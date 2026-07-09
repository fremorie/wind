uniform vec3 uColorGrass;
uniform vec3 uColorDirt;
uniform float uLakeCenterX;
uniform float uLakeCenterZ;
uniform float uLakeRadius;
uniform float uBeachWidth;

varying vec3 vPosition;
varying float vUpDot;
varying float vRoadMask;

#include "../includes/simplexNoise2d.glsl"

void main() {
    // Color
    vec3 color = vec3(uColorGrass);
    color = mix(color, uColorDirt, vRoadMask);

    // Beach
    float dist = length(vPosition.xz - vec2(uLakeCenterX, uLakeCenterZ));
    float grassLine = uLakeRadius + uBeachWidth;
    float sandMask = smoothstep(grassLine, grassLine - 5.0, dist);
    color = mix(color, uColorDirt, sandMask);

    // Final color
    csm_DiffuseColor = vec4(color, 1.0);
}