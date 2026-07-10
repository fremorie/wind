uniform vec3 uFresnelColor;
uniform float uFresnelPower;
uniform float uFresnelStrength;
uniform float uLakeDepth;

uniform vec3 uColorWaterShallow;
uniform vec3 uColorWaterDeep;
uniform float uOpacityDeep;

uniform float uPositionFrequency;
uniform float uStrength;
uniform vec3 uRoadCenter;
uniform float uRoadWidth;
uniform float uRoadAmplitude;
uniform float uRoadWaviness;
uniform float uRoadFalloff;
uniform float uLakeCenterX;
uniform float uLakeCenterZ;
uniform float uLakeRadius;
uniform float uBeachWidth;
uniform float uLakeSurfaceLevel;

uniform float uTime;

varying float vLakeElevation;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec2 vUv;
varying float vLakeDepth;

#include "../includes/perlinNoise.glsl"
#include "../includes/elevation.glsl"

void main() {
    float lakeElevation = getFinalElevation(vUv);
    float depth = clamp((uLakeSurfaceLevel - lakeElevation) / uLakeDepth, 0.0, 1.0);

    vec3 finalColor = mix(uColorWaterShallow, uColorWaterDeep, depth);

    // Fresnel
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(
        1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0),
        uFresnelPower
    );
    finalColor = mix(finalColor, uFresnelColor, fresnel * uFresnelStrength);

    // Ripple
    float shore = clamp(1.0 + lakeElevation / uLakeDepth, 0.0, 1.0);

    float depthMap = 1.0 - vLakeDepth;

    float ripplePhase = (shore - uTime * 0.01) * 20.0;
    float rippleIndex = floor(ripplePhase);
    float noise = cnoise(vec3(vUv * 0.1, rippleIndex)) * 0.5 + 0.5;
    float ripple = mod(ripplePhase, 1.0);
    ripple = ripple - (1.0 - shore);
    ripple += noise;

    float rippleMask = step(1.3, ripple);

    finalColor += rippleMask;

    float distanceToLake = length(vUv - vec2(uLakeCenterX, uLakeCenterZ));
    float lakeRegion = smoothstep(uLakeRadius, uLakeRadius - 0.5, distanceToLake);
    float coverage = lakeRegion
        * smoothstep(uLakeSurfaceLevel, uLakeSurfaceLevel - 0.5, lakeElevation);

    // Far water reads opaque, near water stays clear
    float distanceOpacity = smoothstep(30.0, 120.0, length(cameraPosition - vWorldPosition));

    // Clear shallows up close, opaque over deep or distant water
    float baseOpacity = mix(mix(opacity, uOpacityDeep, depth), 1.0, distanceOpacity);
    float alpha = mix(baseOpacity, 1.0, fresnel);
    alpha = max(alpha, rippleMask);
    alpha *= coverage;

    // Final color
    csm_DiffuseColor = vec4(finalColor, alpha);
}