uniform float uPositionFrequency;
uniform float uStrength;
uniform vec2 uPlayerPosition;
uniform float uCurvature;
uniform vec3 uRoadCenter;
uniform float uRoadWidth;
uniform float uRoadAmplitude;
uniform float uRoadWaviness;
uniform float uRoadFalloff;
uniform float uLakeCenterX;
uniform float uLakeCenterZ;
uniform float uLakeRadius;
uniform float uBeachWidth;
uniform float uLakeDepth;

varying float vLakeElevation;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec2 vUv;
varying float vLakeDepth;

#include "../includes/curveWorld.glsl"
#include "../includes/elevation.glsl"

void main() {
    vec3 worldPositionNew = (modelMatrix * vec4(csm_Position, 1.0)).xyz;
    vec2 worldUV = worldPositionNew.xz;

    // Elevation
    float lakeElevation = getFinalElevation(worldUV);

    // Curve world
    csm_Position = curveWorld(csm_Position, worldUV, uPlayerPosition, uCurvature);

    // Varyings
    vLakeElevation = lakeElevation;
    vWorldPosition = worldPositionNew;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vUv = worldUV;
    vLakeDepth = getLakeDepth(worldUV) / uLakeDepth;
}