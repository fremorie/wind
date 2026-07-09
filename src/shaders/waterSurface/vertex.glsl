uniform vec2 uPlayerPosition;
uniform float uCurvature;

#include "../includes/curveWorld.glsl"

void main() {
    vec2 worldUV = (modelMatrix * vec4(csm_Position, 1.0)).xz;

    // Curve world
    csm_Position = curveWorld(csm_Position, worldUV, uPlayerPosition, uCurvature);
}