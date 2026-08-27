uniform float uFresnelStrength;
uniform float uFresnelPower;
uniform vec3 uFresnelColor;
uniform sampler2D uPerlinNoiseTexture;
uniform float uTime;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

const float opacityNear = 0.1;
const float opacityFar = 1.0;

const vec2 flowDirecation = normalize(vec2(-1.0, -1.0));
const float flowDistance = 0.3;
const float cycleSpeed = 0.2; // cycles per second

void main() {
    vec2 uv = vWorldPosition.xz * 0.1;

    // Twinkle
    float phaseOffset = texture(uPerlinNoiseTexture, uv * 0.35 + 0.5).r;

    float cycle = uTime * cycleSpeed + phaseOffset;
    float phase0 = fract(cycle);
    float phase1 = fract(cycle + 0.5);

    float phaseWeight = abs(1.0 - 2.0 * phase0);

    float n0 = texture(uPerlinNoiseTexture, uv - flowDirecation * flowDistance * phase0).r;
    float n1 = texture(uPerlinNoiseTexture, uv - flowDirecation * flowDistance * phase1).r;

    float perlinNoise = mix(n0, n1, phaseWeight);
    perlinNoise = smoothstep(0.7, 0.9, perlinNoise);

    // Color
    vec3 color = vec3(1.0);
    vec3 fresnelColor = uFresnelColor;

    // Fresnel
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(
        1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0),
        uFresnelPower
    );
    color = mix(color, fresnelColor, fresnel * uFresnelStrength);

    float alphaMix = smoothstep(0.0, 0.9, fresnel);
    float alpha = mix(opacityNear, opacityFar, alphaMix);

    // Flowing perlin noise
    alpha = mix(alpha, 1.0, perlinNoise);

    gl_FragColor = vec4(color, alpha);
}