uniform vec2 uPlayerPosition;

#include "../includes/curveWorld.glsl"

void main() {
    vec3 worldPositionNew = (modelMatrix * vec4(csm_Position, 1.0)).xyz;
    vec2 worldUV = worldPositionNew.xz;

    csm_Position = curveWorld(csm_Position, worldUV, uPlayerPosition, uCurvature);
}