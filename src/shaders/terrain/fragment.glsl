uniform vec3 uColorGrass;
uniform vec3 uColorDirt;

varying vec3 vPosition;
varying float vUpDot;
varying float vRoadMask;

#include "../includes/simplexNoise2d.glsl"

void main() {
    // Color
    vec3 color = vec3(uColorGrass);
    color = mix(color, uColorDirt, vRoadMask);

    // Final color
    csm_DiffuseColor = vec4(color, 1.0);
}