uniform vec3 uFresnelColor;
uniform float uFresnelPower;
uniform float uFresnelStrength;
uniform float uLakeDepth;

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

uniform float uTime;

varying float vLakeElevation;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec2 vUv;
varying float vLakeDepth;

#include "../includes/perlinNoise.glsl"
#include "../includes/elevation.glsl"

void main() {
    vec3 finalColor = vec3(0.0, 0.0, 0.0);

    // Fresnel
//    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
//    float fresnel = pow(
//        1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0),
//        uFresnelPower
//    );
//    finalColor = mix(finalColor, uFresnelColor, fresnel * uFresnelStrength);
//
//    float alpha = mix(opacity, 1.0, fresnel);

    // Ripple
    float lakeElevation = getFinalElevation(vUv);
    float shore = clamp(1.0 + lakeElevation / uLakeDepth, 0.0, 1.0);

    float depthMap = 1.0 - vLakeDepth;

    float ripplePhase = (shore - uTime * 0.01) * 20.0;
    float rippleIndex = floor(ripplePhase);
    float noise = cnoise(vec3(vUv * 0.1, rippleIndex)) * 0.5 + 0.5;
    float ripple = mod(ripplePhase, 1.0);
    ripple = ripple - (1.0 - shore);
    ripple += noise;

    ripple = ripple > 1.3 ? ripple : 0.0;

    finalColor += ripple;

    if (finalColor.r < 1.0) {
        discard;
    }

    // Final color
    csm_DiffuseColor = vec4(finalColor, 1.0);
}