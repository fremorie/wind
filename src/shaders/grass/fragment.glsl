uniform sampler2D alphaMap;
varying vec2 vUv;

void main() {
    float alpha = texture2D(alphaMap, vUv).r;

    if (alpha < 0.15) discard;

    vec3 baseColor = vec3(0.2, 1.0, 0.1);

    // Make sides darker
    vec3 color = vec3(vUv.y, vUv.y, 0.0);
    color = mix(baseColor, color, 0.5);

    // Final color
    csm_DiffuseColor = vec4(color, 1.0);
}