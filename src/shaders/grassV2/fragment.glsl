varying vec3 vColor;
varying vec4 vGrassData;
varying vec3 vNormal;
varying vec3 vWorldPosition;

#include "../includes/utils.glsl"
#include "../includes/lights.glsl"

void main() {
    float grassX = vGrassData.x;
    float grassY = vGrassData.y;

    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);

    vec3 baseColor = mix(
        vColor * 0.75,
        vColor,
        smoothstep(0.125, 0.0, abs(grassX))
    );

    // Hemi
    vec3 c1 = vec3(1.0, 1.0, 0.75);
    vec3 c2 = vec3(0.05, 0.05, 0.25);

    vec3 ambientLighting = hemiLight(normal, c2, c1);

    // Directional light
    vec3 lightDir = normalize(vec3(-1.0, 0.5, 1.0));
    vec3 lightColor = vec3(1.0);
    vec3 diffuseLighting = lambertLight(normal, viewDir, lightDir, lightColor);

    // Specular
    vec3 specular = phongSpecular(normal, lightDir, viewDir);

    // Fake AO
    float ao = remap(pow(grassY, 2.0), 0.0, 1.0, 0.125, 1.0);

    vec3 lighting = diffuseLighting * 0.5 + ambientLighting * 0.5;

    vec3 color = baseColor * ambientLighting + specular * 0.25;
    color *= ao;

    gl_FragColor = vec4(pow(color, vec3(1.0 / 2.2)), 1.0);
}