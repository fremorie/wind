import * as THREE from 'three';
import { alea } from 'seedrandom';

const MIN_BLADE_SCALE = 3;
const MAX_BLADE_SCALE = 5;

export const BLADE_WIDTH = 0.2;
export const BLADE_HEIGHT = 0.3;

const COUNT = 10000;
const PLANE_SIZE = 100;
const TURBINE_POSITIONS: [number, number][] = [
    [-7, -5],
    [7, -3],
    [0, -8],
];
const TURBINE_CLEAR_RADIUS = 0.6;

// Terrain height is displaced in the vertex shader (GPU), so the CPU-side
// geometry is a flat plane at y = 0. Grass just sits slightly below that.
const GRASS_Y = -0.01;

// Reads the red channel of the lake alpha map at world (x, z), using the same
// UV mapping the ground shader uses: the plane is centered at the origin and
// rotated -90° about X, so world x -> u and world z -> flipped v. Textures are
// uploaded with flipY, hence the (1 - v) row lookup.
export function makeLakeAlphaSampler(
    image: CanvasImageSource & { width: number; height: number },
    planeSize: number = PLANE_SIZE,
) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0);
    const { data, width, height } = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
    );

    return (x: number, z: number) => {
        const u = x / planeSize + 0.5;
        const v = -z / planeSize + 0.5;
        const col = Math.min(
            width - 1,
            Math.max(0, Math.round(u * (width - 1))),
        );
        const row = Math.min(
            height - 1,
            Math.max(0, Math.round((1 - v) * (height - 1))),
        );
        return data[(row * width + col) * 4] / 255;
    };
}

export function getGrassBladesPositions(
    count: number = COUNT,
    planeSize: number = PLANE_SIZE,
    turbinePositions: Array<number[]> = TURBINE_POSITIONS,
    turbineClearRadius: number = TURBINE_CLEAR_RADIUS,
    grassY: number = GRASS_Y,
) {
    const rng = alea('grass-positions');
    const result: Array<[number, number, number]> = [];
    while (result.length < count) {
        const x = (rng() - 0.5) * planeSize;
        const z = (rng() - 0.5) * planeSize;
        if (
            turbinePositions.some(
                ([tx, tz]) => Math.hypot(x - tx, z - tz) < turbineClearRadius,
            )
        )
            continue;

        result.push([x, grassY, z]);
    }
    return result;
}

export function generateGrassBladesAttributes(
    positions: Array<[x: number, y: number, z: number]>,
) {
    const count = positions.length;

    const rng = alea('grass-attributes');
    const bladeRandoms = new Float32Array(count);
    const matrices = [];
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
        const [x, y, z] = positions[i];
        position.set(x, y, z);

        const uniformScale =
            MIN_BLADE_SCALE + rng() * (MAX_BLADE_SCALE - MIN_BLADE_SCALE);

        scale.set(uniformScale, uniformScale, uniformScale);

        matrix.compose(position, quaternion, scale);

        matrices.push(matrix.clone());

        bladeRandoms[i] = rng();
    }

    return { count, matrices, bladeRandoms };
}
