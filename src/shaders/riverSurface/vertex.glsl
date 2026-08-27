uniform vec3 uRoadCenter;
uniform float uLakeCenterX;
uniform float uLakeCenterZ;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying float vElevation;

#include "../includes/curveWorld.glsl"
#include "../includes/elevation.glsl"

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    worldPosition.xyz = curveWorld(worldPosition.xyz, position.xz, vec2(0.0), uCurvature);

    vec4 mvPosition = viewMatrix * worldPosition;

    gl_Position = projectionMatrix * mvPosition;

    vWorldPosition = worldPosition.xyz;

    vec3 curvedNormal = normalize(
      vec3(2.0 * uCurvature * position.x, 1.0, 2.0 * uCurvature * position.z)
    );
    vWorldNormal = normalize(mat3(modelMatrix) * curvedNormal);
    vElevation = getFinalElevation(worldPosition.xz);
}