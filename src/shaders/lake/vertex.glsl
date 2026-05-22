uniform sampler2D uLakeAlphaMap;
uniform float uPlaneSize;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
    float shift = 0.01;

    // UV offsets matching the position shift (UV is 0→1)
    vec2 uvA = uv + vec2(shift / uPlaneSize, 0.0);
    vec2 uvB = uv + vec2(0.0, shift / uPlaneSize);

    float alpha  = texture2D(uLakeAlphaMap, uv).r;
    float alphaA = texture2D(uLakeAlphaMap, uvA).r;
    float alphaB = texture2D(uLakeAlphaMap, uvB).r;

    // Displace all three positions by their respective alpha depth
    vec3 newPosition = vec3(
        position.x,
        position.y,
        -alpha  * 1.2
    );

    vec3 posA = vec3(
        position.x + shift,
        position.y,
        -alphaA * 1.2
    );

    vec3 posB = vec3(
        position.x,
        position.y + shift,
        -alphaB * 1.2
    );

    csm_Normal = normalize(cross(normalize(posA - newPosition), normalize(posB - newPosition)));
    csm_Position.z -= alpha * 1.2;

    vPosition = csm_Position;
    vUv = uv;
}
