uniform float uTime;
uniform sampler2D uPerlinNoiseTexture;

uniform vec2 uPlayerPosition;
uniform vec3 uRoadCenter;
uniform float uLakeCenterX;
uniform float uLakeCenterZ;

varying vec3 vLocalPosition;

#include "../includes/groundInstance.glsl"

void main() {
    float uWorldNoiseScale = 2.0;
    float uSpeed = 0.05;

    mat4 worldMatrix = modelMatrix * instanceMatrix;
    vec2 groundXZ = instanceGroundXZ(worldMatrix);

    // Wind. Sampled at the vertex's own world position -- through
    // instanceMatrix, so neighbouring birches sway out of phase instead of
    // drifting as one block.
    vec2 worldUV = (worldMatrix * vec4(csm_Position, 1.0)).xz;
    vec2 perlinUV = worldUV * uWorldNoiseScale + uTime * uSpeed;
    float sway = texture(uPerlinNoiseTexture, perlinUV).r - 0.5;

    csm_Position += vec3(sway, 0.0, sway) * 0.5;

    // No canopies over the lake or beach. Done before the grounding offset so
    // every vertex lands on the same point and the triangles drop out.
    csm_Position.xyz *= (1.0 - lakeCull(groundXZ));

    // No trees on the road
    float roadMask = getRoadMask(groundXZ);
    csm_Position.xyz *= (1.0 - step(0.5, roadMask));

    // Final position
    csm_Position.y += groundingOffsetY(worldMatrix, uPlayerPosition);

    // Varyings
    vLocalPosition = position.xyz;
}
