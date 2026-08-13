// Puts an instanced prop on the terrain.
//
// Both helpers take the instance's world matrix (modelMatrix * instanceMatrix)
// and sample the ground once, at the instance's *origin*. Sampling per vertex
// instead would shear the prop along the slope rather than stand it up on one.
//
// The including shader must declare the world uniforms first: uPlayerPosition,
// uRoadCenter, uLakeCenterX, uLakeCenterZ.

#include "../includes/elevation.glsl"

vec2 instanceGroundXZ(mat4 worldMatrix) {
    return (worldMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xz;
}

// How far to lift a vertex so the instance's origin lands on the terrain
// surface, under the fake-planet bend. In instance-local units, ready to add
// straight onto csm_Position.y.
float groundingOffsetY(mat4 worldMatrix, vec2 playerXZ) {
    vec3 instanceWorldOrigin = (worldMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec2 groundXZ = instanceWorldOrigin.xz;

    vec2 toPlayer = groundXZ - playerXZ;
    float curve = dot(toPlayer, toPlayer) * uCurvature;
    float surfaceY = getFinalElevation(groundXZ) - curve;

    // csm_Position is in local space, so a world-space offset has to be divided
    // by the instance's scale before it is added there.
    float worldScale = length(worldMatrix[0].xyz);

    return (surfaceY - instanceWorldOrigin.y) / worldScale;
}

// 1.0 where the instance stands over the lake or its beach, 0.0 out on the
// grass. Multiply csm_Position by (1.0 - this) to collapse the instance to a
// degenerate point so its triangles drop out (mirrors the grass lake cull).
float lakeCull(vec2 groundXZ) {
    float distanceToLake = length(groundXZ - vec2(uLakeCenterX, uLakeCenterZ));
    float grassLine = uLakeRadius + uBeachWidth;

    return smoothstep(grassLine, grassLine - 5.0, distanceToLake);
}
