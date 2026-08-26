#include "../includes/curveWorld.glsl"

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    worldPosition.xyz = curveWorld(worldPosition.xyz, position.xz, vec2(0.0), uCurvature);

    vec4 mvPosition = viewMatrix * worldPosition;

    gl_Position = projectionMatrix * mvPosition;
}