// Faithful CPU port of shaders/includes/simplexNoise2d.glsl.
//
// This MUST return the same values as the GLSL version, or anything placed with
// it (the player, later trees/grass) will glue itself to a surface that isn't
// the one being drawn. Note the non-standard permute constants (44.0 / 299.0) —
// they match the shader exactly.
//
// One honest caveat: the GPU runs this in float32 and JS runs in float64, so the
// two differ by ~1e-6 — far below anything you could ever see. If you change the
// GLSL, change this to match; the tunable params (frequency/strength/warp) stay
// in sync automatically because both read them from `terrainUniforms`.

// GLSL mod(): x - y*floor(x/y). Unlike JS `%`, its result takes the sign of the
// divisor, so it stays positive here. Getting this wrong breaks negative coords.
function mod(x: number, y: number): number {
    return x - y * Math.floor(x / y);
}

// GLSL fract(): the fractional part, floored toward -Infinity.
function fract(x: number): number {
    return x - Math.floor(x);
}

// permute() applied component-wise to a 3-vector.
function permute(x0: number, x1: number, x2: number): [number, number, number] {
    return [
        mod((x0 * 44 + 1) * x0, 299),
        mod((x1 * 44 + 1) * x1, 299),
        mod((x2 * 44 + 1) * x2, 299),
    ];
}

const C = {
    x: 0.211324865405187, // (3 - sqrt(3)) / 6
    y: 0.366025403784439, // (sqrt(3) - 1) / 2
    z: -0.577350269189626, // -1 + 2 * C.x
    w: 0.024390243902439, // 1 / 41
};

export function simplexNoise2d(vx: number, vy: number): number {
    // Skew the input space to determine which simplex cell we're in.
    // i = floor(v + dot(v, C.yy))
    const skew = (vx + vy) * C.y;
    let ix = Math.floor(vx + skew);
    let iy = Math.floor(vy + skew);

    // Unskew the cell origin back to (x,y) space. x0 = v - i + dot(i, C.xx)
    const unskew = (ix + iy) * C.x;
    const x0x = vx - ix + unskew;
    const x0y = vy - iy + unskew;

    // Which of the two triangles of the cell are we in?
    const i1x = x0x > x0y ? 1 : 0;
    const i1y = x0x > x0y ? 0 : 1;

    // Offsets for the other two corners. x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    const x12_0 = x0x + C.x - i1x;
    const x12_1 = x0y + C.x - i1y;
    const x12_2 = x0x + C.z;
    const x12_3 = x0y + C.z;

    // Hash the three corner indices. i = mod(i, 299) keeps them in range.
    ix = mod(ix, 299);
    iy = mod(iy, 299);

    const pInner = permute(iy + 0, iy + i1y, iy + 1);
    const p = permute(
        pInner[0] + ix + 0,
        pInner[1] + ix + i1x,
        pInner[2] + ix + 1,
    );

    // Radial falloff from each corner: m = max(0.5 - dist^2, 0), then m = m^4.
    let m0 = Math.max(0.5 - (x0x * x0x + x0y * x0y), 0);
    let m1 = Math.max(0.5 - (x12_0 * x12_0 + x12_1 * x12_1), 0);
    let m2 = Math.max(0.5 - (x12_2 * x12_2 + x12_3 * x12_3), 0);
    m0 = m0 * m0;
    m0 = m0 * m0;
    m1 = m1 * m1;
    m1 = m1 * m1;
    m2 = m2 * m2;
    m2 = m2 * m2;

    // Gradients from the hashed values. x = 2*fract(p * C.www) - 1
    const gx0 = 2 * fract(p[0] * C.w) - 1;
    const gx1 = 2 * fract(p[1] * C.w) - 1;
    const gx2 = 2 * fract(p[2] * C.w) - 1;

    const h0 = Math.abs(gx0) - 0.5;
    const h1 = Math.abs(gx1) - 0.5;
    const h2 = Math.abs(gx2) - 0.5;

    // a0 = x - floor(x + 0.5)
    const a00 = gx0 - Math.floor(gx0 + 0.5);
    const a01 = gx1 - Math.floor(gx1 + 0.5);
    const a02 = gx2 - Math.floor(gx2 + 0.5);

    // Normalise the gradients (approx). m *= 1.79284... - 0.85373...*(a0^2 + h^2)
    m0 *= 1.79284291400159 - 0.85373472095314 * (a00 * a00 + h0 * h0);
    m1 *= 1.79284291400159 - 0.85373472095314 * (a01 * a01 + h1 * h1);
    m2 *= 1.79284291400159 - 0.85373472095314 * (a02 * a02 + h2 * h2);

    // Dot the falloff with the gradient at each corner and sum.
    const g0 = a00 * x0x + h0 * x0y;
    const g1 = a01 * x12_0 + h1 * x12_1;
    const g2 = a02 * x12_2 + h2 * x12_3;

    return 130 * (m0 * g0 + m1 * g1 + m2 * g2);
}
