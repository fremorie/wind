uniform vec3 uColorGrass;
uniform vec3 uColorDirt;
uniform vec3 uColorLake;
uniform float uLakeFloorY;
uniform float uShorePositionX;
uniform float uBeachWidth;

varying vec3 vPosition;
varying float vUpDot;
varying float vRoadMask;

#include "../includes/simplexNoise2d.glsl"

void main() {
    // Grass
    vec3 color = vec3(uColorGrass);

    // Road
    color = mix(color, uColorDirt, vRoadMask);

    // Beach sand
    float sandMix = smoothstep(uShorePositionX - uBeachWidth, uShorePositionX, vPosition.x);
    color = mix(color, uColorDirt, sandMix);

    // Lake
    float waterMix = smoothstep(uShorePositionX - 50.0, uShorePositionX, vPosition.x);
    color = mix(color, uColorLake, waterMix);

    // Final color
    csm_DiffuseColor = vec4(color, 1.0);
}