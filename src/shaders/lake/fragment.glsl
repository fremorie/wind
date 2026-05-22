uniform vec3 uColorWaterDeep;
uniform vec3 uColorWaterSurface;
uniform vec3 uColorGrass;

varying vec3 vPosition;

void main() {
    // Color
    vec3 color = vec3(1.0);

    // Water
    float surfaceWaterMix = smoothstep(-2.0, -0.1, vPosition.z);
    color = mix(uColorWaterDeep, uColorWaterSurface, surfaceWaterMix);

    // Grass
    float grassMix = step(-0.06, vPosition.z);
    color = mix(color, uColorGrass, grassMix);

    // Final color
    csm_DiffuseColor = vec4(color, 1.0);
}