uniform float uFresnelStrength;
uniform float uFresnelPower;
uniform vec3 uFresnelColor;
uniform sampler2D uPerlinNoiseTexture;
uniform float uTime;
uniform vec3 uRoadCenter;
uniform float uLakeCenterX;
uniform float uLakeCenterZ;
uniform vec3 uShadowColor;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying float vElevation;
varying float vRiverMask;

const float opacityNear = 0.1;
const float opacityFar = 1.0;

const vec2 flowDirecation = normalize(vec2(-1.0, -1.0));
const float flowDistance = 0.3;
const float cycleSpeed = 0.2; // cycles per second

#include "../includes/elevation.glsl"

void main() {
    vec2 uv = vWorldPosition.xz * 0.1;

    // Color
    vec3 color = vec3(1.0);
    vec3 fresnelColor = uFresnelColor;
    float alpha = 0.0;

    // Noise
    float phaseOffset = texture(uPerlinNoiseTexture, uv * 0.35 + 0.5).r;
    float cycle = uTime * cycleSpeed + phaseOffset;
    float phase0 = fract(cycle);
    float phase1 = fract(cycle + 0.5);
    float phaseWeight = abs(1.0 - 2.0 * phase0);
    float n0 = texture(uPerlinNoiseTexture, uv - flowDirecation * flowDistance * phase0).r;
    float n1 = texture(uPerlinNoiseTexture, uv - flowDirecation * flowDistance * phase1).r;
    float perlinNoise = mix(n0, n1, phaseWeight);
    perlinNoise = smoothstep(0.7, 0.9, perlinNoise);

    // Fresnel
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(
        1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0),
        uFresnelPower
    );
    color = mix(color, fresnelColor, fresnel * uFresnelStrength);
    float alphaMix = smoothstep(0.0, 0.9, fresnel);
    alpha = mix(alpha, opacityFar, alphaMix);

    // Shadows & reflections
    float elevation = getFinalElevation(vWorldPosition.xz);
    //float riverMask = getRiverMask(vWorldPosition.xz);

    //float reflectionMix = step(0.4, 1.0 - riverMask);
    float sunwardOffset = getRiverOffset(vWorldPosition.xz) * getSunwardRiverBankSign();
    float bankMask = smoothstep(0.0, uRiverWidth * 0.5, sunwardOffset);

    float elevationMix = step(uRiverSurfaceLevel - 1.2, elevation + n0 - n1) * bankMask * (1.0 - fresnel);

    alpha = mix(alpha, 0.8, elevationMix);
    color = mix(color, uShadowColor, elevationMix);

    // Twinkle
    alpha = mix(alpha, 1.0, perlinNoise);

    // Final color
    gl_FragColor = vec4(color, alpha);
}