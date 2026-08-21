float inverseLerp(float v, float minValue, float maxValue) {
    return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
    float t = inverseLerp(v, inMin, inMax);
    return mix(outMin, outMax, t);
}

float saturate(float x) {
    return clamp(x, 0.0, 1.0);
}

float easeOut(float x, float t) {
    return 1.0 - pow(1.0 - x, t);
}

mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);

    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c)
    );
}

mat3 rotateAxis(vec3 axis, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat3(
        oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
        oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
        oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c
    );
}

vec3 bezier(vec3 P0, vec3 P1, vec3 P2, vec3 P3, float t) {
    return (1.0 - t) * (1.0 - t) * (1.0 - t) * P0 +
    3.0 * (1.0 - t) * (1.0 - t) * t * P1 +
    3.0 * (1.0 - t) * t * t * P2 +
    t * t * t * P3;
}

vec3 bezierGrad(vec3 P0, vec3 P1, vec3 P2, vec3 P3, float t) {
    return 3.0 * (1.0 - t) * (1.0 - t) * (P1 - P0) +
    6.0 * (1.0 - t) * t * (P2 - P1) +
    3.0 * t * t * (P3 - P2);
}
