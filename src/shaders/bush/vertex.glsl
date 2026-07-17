uniform vec2 uPlayerPosition;
uniform vec3 uRoadCenter;
uniform float uLakeCenterX;
uniform float uLakeCenterZ;

#include "../includes/worldSettings.glsl"
#include "../includes/curveWorld.glsl"
#include "../includes/elevation.glsl"

void main() {
    mat4 worldMatrix = modelMatrix * instanceMatrix;
    vec3 instanceWorldOrigin = (worldMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec2 groundXZ = instanceWorldOrigin.xz;

    // Elevation
    float elevation = getFinalElevation(groundXZ);
    vec2 toPlayer = groundXZ - uPlayerPosition;
    float curve = dot(toPlayer, toPlayer) * uCurvature;
    float surfaceY = elevation - curve;

    float worldScale = length(worldMatrix[0].xyz);

    // No bushes over the lake or beach: collapse the instance to a degenerate
    // point (mirrors the grass lake cull). Done before the grounding offset so
    // every vertex lands on the same point and the triangles drop out.
    float distanceToLake = length(groundXZ - vec2(uLakeCenterX, uLakeCenterZ));
    float grassLine = uLakeRadius + uBeachWidth;
    float lakeCull = smoothstep(grassLine, grassLine - 5.0, distanceToLake);
    csm_Position.xyz *= (1.0 - lakeCull);

    // Final position
    csm_Position.y += surfaceY / worldScale;
}
