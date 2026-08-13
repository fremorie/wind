uniform sampler2D uPerlinNoiseTexture;
uniform vec3 uTintColor;

varying vec3 vLocalPosition;

void main() {
    float perlinNoise = texture(uPerlinNoiseTexture, vLocalPosition.xy * 0.2).r;

    csm_DiffuseColor.rgb = mix(
        csm_DiffuseColor.rgb,
        uTintColor,
        vec3(perlinNoise) * 0.5
    );
}