uniform float uTime;
uniform float uPositionFrequency;
uniform float uStrength;

varying vec3 vPosition;
varying float vUpDot;

#include "../includes/simplexNoise2d.glsl"

float getElevation(vec2 position) {
    float elevation = 0.0;
    elevation += simplexNoise2d(position * uPositionFrequency) / 2.0;

    float elevationSign = sign(elevation);
    elevation = elevationSign * pow(abs(elevation), 2.0);
    elevation *= uStrength;

    return elevation;
}

void main() {
    // Sample the noise field in world space so neighbouring chunks line up
    // seamlessly (modelMatrix carries this chunk's offset per draw call).
    vec2 worldUV = (modelMatrix * vec4(csm_Position, 1.0)).xz;

    // Neighbours
    float shift = 0.01;
    vec3 positionA = csm_Position + vec3(shift, 0.0, 0.0);
    vec3 positionB = csm_Position + vec3(0.0, 0.0, - shift);

    // Elevation
    float elevation = getElevation(worldUV);
    csm_Position.y += elevation;
    positionA.y = getElevation(worldUV + vec2(shift, 0.0));
    positionB.y = getElevation(worldUV + vec2(0.0, - shift));

    // Compute normal
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);

    vPosition = csm_Position;
    vPosition.xz = worldUV + uTime * 0.2;

    vUpDot = dot(csm_Normal, vec3(0.0, 1.0, 0.0));
}