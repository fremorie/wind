uniform sampler2D uAlphaMap;
uniform float uPlaneSize;

void main() {
    float shift = 0.01;

    // UV offsets matching the position shift (UV is 0→1)
    vec2 uvA = uv + vec2(shift / uPlaneSize, 0.0);
    vec2 uvB = uv + vec2(0.0, shift / uPlaneSize);

    float alpha  = texture2D(uAlphaMap, uv).r;
    float alphaA = texture2D(uAlphaMap, uvA).r;
    float alphaB = texture2D(uAlphaMap, uvB).r;

    // Displace all three positions by their respective alpha depth
    vec3 newPosition = vec3(
        position.x,
        position.y,
        -alpha  * 2.0
    );

    vec3 posA = vec3(
        position.x + shift,
        position.y,
        -alphaA * 2.0
    );

    vec3 posB = vec3(
        position.x,
        position.y + shift,
        -alphaB * 2.0
    );

    csm_Normal = normalize(cross(normalize(posA - newPosition), normalize(posB - newPosition)));
    csm_Position.z -= alpha * 2.0;
}
