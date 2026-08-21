vec3 lambertLight(vec3 normal, vec3 viewDir, vec3 lightDir, vec3 lightColor) {
    float wrap = 0.5;
    float dotNL = saturate((dot(normal, lightDir) + wrap) / (1.0 + wrap));
    vec3 lighting = vec3(dotNL);

    float backlight = saturate((dot(viewDir, -lightDir) + wrap) / (1.0 + wrap));
    vec3 scatter = vec3(pow(backlight, 2.0));

    lighting += scatter;

    return lighting;
}

vec3 hemiLight(vec3 normal, vec3 groundColor, vec3 skyColor) {
    return mix(groundColor, skyColor, 0.5 * normal.y + 0.5);
}

vec3 phongSpecular(vec3 normal, vec3 lightDir, vec3 viewDir) {
    float dotNL = saturate(dot(normal, lightDir));

    vec3 r = normalize(reflect(-lightDir, normal));
    float phongValue = max(0.0, dot(viewDir, r));
    phongValue = pow(phongValue, 32.0);

    vec3 specular = dotNL * vec3(phongValue);
    return specular;
}