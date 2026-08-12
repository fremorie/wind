uniform float uTime;
uniform sampler2D uPerlinNoiseTexture;

float csm_noiseTex(vec2 p) {
    return texture2D(uPerlinNoiseTexture, p).r;
}

void main() {
    float uWorldNoiseScale = 0.7;
    float uSpeed = 0.04;

    vec2 worldUV = (modelMatrix * vec4(csm_Position, 1.0)).xz;

    vec2 perlinUV = worldUV * uWorldNoiseScale + uTime * uSpeed;
    vec4 perlinColor = (texture(uPerlinNoiseTexture, perlinUV) - 0.5);

    // Final position
    csm_Position += vec3(perlinColor.r, 0, perlinColor.r) * 0.5;
}