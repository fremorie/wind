uniform float uTime;
varying vec2 vUv;

void main() {
    vec3 newPosition = position;

    float vHeight = position.y;
    float wind = sin(uTime) * uv.y * 0.2;

    newPosition.x += wind;
    newPosition.z += wind * 0.01;

    csm_Position = newPosition;

    // Varyings
    vUv = uv;
}