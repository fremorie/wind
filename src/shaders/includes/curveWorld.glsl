// Fake-planet bend
vec3 curveWorld(vec3 localPosition, vec2 worldXZ, vec2 playerXZ, float curvature) {
    vec2 d = worldXZ - playerXZ;
    localPosition.y -= dot(d, d) * curvature;

    return localPosition;
}