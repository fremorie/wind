uniform vec3 uColorGrass;

varying vec3 vPosition;
varying float vUpDot;

#include "../includes/simplexNoise2d.glsl"

void main() {
    // Color
    vec3 color = vec3(uColorGrass);

    // Final color
    csm_DiffuseColor = vec4(color, 1.0);
}