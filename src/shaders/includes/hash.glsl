vec2 quickHash(float p) {
    vec2 r = vec2(
        dot(vec2(p), vec2(17.43267, 23.8934543)),
        dot(vec2(p), vec2(13.98342, 37.2435232))
    );

    return fract(sin(r) * 1743.54892229);
}

uvec2 murmurHash21(uint src) {
    const uint M = 0x5bd1e995u;
    uvec2 h = uvec2(1190494759u, 2147483647u);
    src *= M;
    src ^= src>>24u;
    src *= M;
    h *= M;
    h ^= src;
    h ^= h>>13u;
    h *= M;
    h ^= h>>15u;
    return h;
}

// 2 outputs, 1 input
vec2 hash21(float src) {
    uvec2 h = murmurHash21(floatBitsToUint(src));
    return uintBitsToFloat(h & 0x007fffffu | 0x3f800000u) - 1.0;
}

vec3 hash(vec3 p) {
    p = vec3(
        dot(p, vec3(127.1, 311.7, 74.7)),
        dot(p, vec3(269.5, 183.3, 246.1)),
        dot(p, vec3(113.5, 271.9, 124.6))
    );

    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}