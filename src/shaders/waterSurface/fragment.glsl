uniform vec3 uFresnelColor;
uniform float uFresnelPower;
uniform float uFresnelStrength;

varying float vLakeElevation;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
    vec3 finalColor = vec3(1.0, 1.0, 1.0);

    // Fresnel
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(
        1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0),
        uFresnelPower
    );
    finalColor = mix(finalColor, uFresnelColor, fresnel * uFresnelStrength);

    float alpha = mix(opacity, 1.0, fresnel);

    // Final color
    csm_DiffuseColor = vec4(finalColor, alpha);
}