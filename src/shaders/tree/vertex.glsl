uniform vec2 uPlayerPosition;
uniform vec3 uRoadCenter;
uniform float uLakeCenterX;
uniform float uLakeCenterZ;

#include "../includes/groundInstance.glsl"

void main() {
    mat4 worldMatrix = modelMatrix * instanceMatrix;
    vec2 groundXZ = instanceGroundXZ(worldMatrix);

    // No trees over the lake or beach. Done before the grounding offset so
    // every vertex lands on the same point and the triangles drop out.
    csm_Position.xyz *= (1.0 - lakeCull(groundXZ));

    // Final position
    csm_Position.y += groundingOffsetY(worldMatrix, uPlayerPosition);
}
