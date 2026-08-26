uniform float uFresnelStrength;
uniform float uFresnelPower;
uniform vec3 uFresnelColor;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

const float opacityNear = 0.2;
const float opacityFar = 0.99;

void main() {
    vec3 color = vec3(1.0);
    vec3 fresnelColor = uFresnelColor;

    // Fresnel
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(
        1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0),
        uFresnelPower
    );
    color = mix(color, fresnelColor, fresnel * uFresnelStrength);

    float alphaMix = smoothstep(0.0, 0.6, fresnel);
    float alpha = mix(opacityNear, opacityFar, alphaMix);

    gl_FragColor = vec4(color, alpha);
}