uniform float uTime;
uniform sampler2D uLakeAlphaMap;
uniform float uPlaneSize;

varying vec2 vUv;

void main() {
    // Wind animation
    vec3 newPosition = position;
    float wind = sin(uTime) * uv.y * 0.2;
    newPosition.x += wind;
    newPosition.z += wind * 0.01;
    csm_Position = newPosition;

    // Hide blade if it sits over the lake.
    // instanceMatrix[3].xz is the blade's local XZ position (group only offsets Y so this equals world XZ).
    // The ground plane is PLANE_SIZE × PLANE_SIZE, rotated -π/2 around X, so:
    //   u = x / size + 0.5,  v = -z / size + 0.5
    vec2 bladeXZ = instanceMatrix[3].xz;
    vec2 lakeUV  = vec2(bladeXZ.x / uPlaneSize + 0.5, -bladeXZ.y / uPlaneSize + 0.5);
    float lakeAlpha = texture2D(uLakeAlphaMap, lakeUV).r;
    csm_Position.y -= step(0.1, lakeAlpha) * 1000.0;

    vUv = uv;
}
