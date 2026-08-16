import {
    CHUNK_SIZE,
    CHUNKS_BEHIND_PLAYER,
    GRID_TOTAL_DEPTH,
    GRID_TOTAL_WIDTH,
    uRoadAmplitude,
    uRoadWidth,
} from './constants';
import { type Instance } from './instances';

// The road centreline sits at z = ROAD_CENTER_Z and only ever wavers
// +/- uRoadAmplitude along it (see roadCenterZ in elevation.ts), so the strip
// it can ever occupy is a fixed band in z that does not depend on x. Clearing
// that whole band once is therefore enough to keep foliage off the road for
// every x -- which is what lets a recycled instance wrap freely along x without
// ever landing on the road.
const ROAD_CENTER_Z = GRID_TOTAL_WIDTH / 2;
const ROAD_MARGIN = 1;
const ROAD_CLEARANCE = uRoadWidth + uRoadAmplitude + ROAD_MARGIN;

export function isNearRoad(z: number): boolean {
    return Math.abs(z - ROAD_CENTER_Z) < ROAD_CLEARANCE;
}

// The lake, unlike the road, is a fixed point in the world (not an x-invariant
// band) and does not tile, so it can't be cleared from the base scatter -- the
// base tile never overlaps it. An instance only reaches the lake by wrapping to
// its world x, so foliage over the lake is culled in the vertex shader instead
// (see the lake cull in tree/vertex.glsl and bush/vertex.glsl), matching how
// grass culls itself there.

// Scatters `count` ground positions across one field tile, rejecting any that
// fall on the road band. The tile matches the terrain's wrap period so the
// scatter tiles seamlessly as instances recycle.
export function scatterPositions(
    count: number,
    rng: () => number,
): Array<[number, number]> {
    const positions: Array<[x: number, z: number]> = [];

    while (positions.length < count) {
        const x = rng() * GRID_TOTAL_DEPTH;
        const z = rng() * GRID_TOTAL_WIDTH;

        if (isNearRoad(z)) continue;

        positions.push([x, z]);
    }

    return positions;
}

// The player-centred window each instance is kept inside, mirroring the terrain
// recycler: biased forward along the travel axis (x) so most foliage is ahead,
// symmetric along the lateral axis (z). Each window is exactly one wrap period
// wide, so a single +/- period shift always brings a strayed instance back.
const WINDOW_BEHIND_X = CHUNKS_BEHIND_PLAYER * CHUNK_SIZE;
const WINDOW_BEHIND_Z = GRID_TOTAL_WIDTH / 2;

function wrapToWindow(
    value: number,
    windowLow: number,
    period: number,
): number {
    return value - period * Math.floor((value - windowLow) / period);
}

// Recentres a standalone instance's XZ around the player. Returns true if it
// moved this frame (i.e. it wrapped from one edge of the window to the other).
function recycleXZ(
    position: [number, number, number],
    playerX: number,
    playerZ: number,
): boolean {
    const x = position[0];
    const z = position[2];

    const wrappedX = wrapToWindow(
        x,
        playerX - WINDOW_BEHIND_X,
        GRID_TOTAL_DEPTH,
    );
    const wrappedZ = wrapToWindow(
        z,
        playerZ - WINDOW_BEHIND_Z,
        GRID_TOTAL_WIDTH,
    );

    if (wrappedX === x && wrappedZ === z) return false;

    position[0] = wrappedX;
    position[2] = wrappedZ;
    return true;
}

export function recycleInstances(
    instances: Instance[],
    playerX: number,
    playerZ: number,
): boolean {
    let changed = false;

    for (const instance of instances) {
        if (recycleXZ(instance.position, playerX, playerZ)) changed = true;
    }

    return changed;
}

// Recycles trees together with their canopies: when a tree wraps, every canopy
// bush that belongs to it is shifted by the same XZ delta, so the tree stays a
// rigid body. `canopies` is laid out as `canopiesPerTree` consecutive bushes
// per tree, in tree order (the order getBushesAsTreeFoliageAttributes produces).
export function recycleTreesWithCanopies(
    trees: Instance[],
    canopies: Instance[],
    canopiesPerTree: number,
    playerX: number,
    playerZ: number,
): boolean {
    let changed = false;

    for (let t = 0; t < trees.length; t++) {
        const treePosition = trees[t].position;
        const beforeX = treePosition[0];
        const beforeZ = treePosition[2];

        if (!recycleXZ(treePosition, playerX, playerZ)) continue;

        const deltaX = treePosition[0] - beforeX;
        const deltaZ = treePosition[2] - beforeZ;

        for (let j = 0; j < canopiesPerTree; j++) {
            const canopyPosition = canopies[t * canopiesPerTree + j].position;
            canopyPosition[0] += deltaX;
            canopyPosition[2] += deltaZ;
        }

        changed = true;
    }

    return changed;
}

// Poisson-disk scatter (Bridson 2007), toroidal because the tile wraps.

/** Wraps a coordinate into [0, size). */
function wrapCoord(value: number, size: number): number {
    return value - size * Math.floor(value / size);
}

/** Shortest gap between two coordinates on a wrapped axis of length `size`. */
function toroidalDelta(a: number, b: number, size: number): number {
    const delta = Math.abs(a - b);

    return Math.min(delta, size - delta);
}

/** Positive modulo, for wrapping grid indices of either sign. */
function mod(value: number, n: number): number {
    return ((value % n) + n) % n;
}

// Candidates tried around an active point before it is retired (Bridson's 30).
const CANDIDATES_PER_POINT = 30;

// Random dense disk packing fits ~0.7 * area / radius^2 points; a first guess.
const PACKING_FACTOR = 0.7;

// Aim past the target so the sampler rarely comes up short and needs a retry.
const OVERSHOOT = 1.15;

/** One pass at a fixed radius; may fit more or fewer points than `target`. */
function poissonDiskPass(
    radius: number,
    target: number,
    rng: () => number,
): Array<[number, number]> {
    const width = GRID_TOTAL_DEPTH; // x
    const depth = GRID_TOTAL_WIDTH; // z

    // Cells of r/sqrt(2) hold at most one point; whole-number division so it wraps.
    const columns = Math.max(1, Math.ceil(width / (radius / Math.SQRT2)));
    const rows = Math.max(1, Math.ceil(depth / (radius / Math.SQRT2)));
    const cellWidth = width / columns;
    const cellDepth = depth / rows;

    // How far the neighbour scan reaches: 5x5 cells, unless rounding shrank them.
    const spanX = Math.ceil(radius / cellWidth);
    const spanZ = Math.ceil(radius / cellDepth);

    const grid = new Int32Array(columns * rows).fill(-1);
    const points: Array<[number, number]> = [];

    const cellIndex = (x: number, z: number) => {
        const gx = Math.min(columns - 1, Math.floor(x / cellWidth));
        const gz = Math.min(rows - 1, Math.floor(z / cellDepth));

        return gz * columns + gx;
    };

    const isFarEnough = (x: number, z: number): boolean => {
        const gx = Math.min(columns - 1, Math.floor(x / cellWidth));
        const gz = Math.min(rows - 1, Math.floor(z / cellDepth));

        for (let dz = -spanZ; dz <= spanZ; dz++) {
            for (let dx = -spanX; dx <= spanX; dx++) {
                const index =
                    mod(gz + dz, rows) * columns + mod(gx + dx, columns);
                const neighbour = grid[index];

                if (neighbour === -1) continue;

                const [nx, nz] = points[neighbour];
                const deltaX = toroidalDelta(x, nx, width);
                const deltaZ = toroidalDelta(z, nz, depth);

                if (deltaX * deltaX + deltaZ * deltaZ < radius * radius) {
                    return false;
                }
            }
        }

        return true;
    };

    const accept = (x: number, z: number): number => {
        grid[cellIndex(x, z)] = points.length;
        points.push([x, z]);

        return points.length - 1;
    };

    // Dart-throws a valid point, or returns null once the field is saturated.
    const findFreeSpot = (): [number, number] | null => {
        for (let attempt = 0; attempt < CANDIDATES_PER_POINT; attempt++) {
            const x = rng() * width;
            const z = rng() * depth;

            if (isNearRoad(z)) continue;
            if (isFarEnough(x, z)) return [x, z];
        }

        return null;
    };

    // Restart the front whenever it dies out: the road can split the tile in two.
    while (points.length < target) {
        const seed = findFreeSpot();

        if (!seed) break; // saturated: no room left at this radius

        const active = [accept(seed[0], seed[1])];

        while (active.length > 0 && points.length < target) {
            const slot = Math.floor(rng() * active.length);
            const [originX, originZ] = points[active[slot]];
            let placed = false;

            for (let i = 0; i < CANDIDATES_PER_POINT; i++) {
                // Annulus [r, 2r): nearer candidates always fail, farther leave holes.
                const angle = rng() * Math.PI * 2;
                const distance = radius * (1 + rng());
                const x = wrapCoord(
                    originX + Math.cos(angle) * distance,
                    width,
                );
                const z = wrapCoord(
                    originZ + Math.sin(angle) * distance,
                    depth,
                );

                if (isNearRoad(z)) continue;
                if (!isFarEnough(x, z)) continue;

                active.push(accept(x, z));
                placed = true;
                break;
            }

            if (!placed) {
                // Retire it: swap-with-last is O(1) and order does not matter.
                active[slot] = active[active.length - 1];
                active.pop();
            }
        }
    }

    return points;
}

/** Like `scatterPositions`, but spaced out (Poisson-disk / blue noise). */
export function scatterPositionsSpaced(
    count: number,
    rng: () => number,
): Array<[number, number]> {
    if (count <= 0) return [];

    // Only the off-road area can hold anything, so derive the radius from that.
    const usableArea =
        GRID_TOTAL_DEPTH * (GRID_TOTAL_WIDTH - 2 * ROAD_CLEARANCE);
    let radius = Math.sqrt((PACKING_FACTOR * usableArea) / (count * OVERSHOOT));

    let points: Array<[number, number]> = [];

    // The estimate can fall short; each retry raises capacity by ~1.56x.
    for (let attempt = 0; attempt < 8; attempt++) {
        points = poissonDiskPass(radius, Math.ceil(count * OVERSHOOT), rng);

        if (points.length >= count) break;

        radius *= 0.8;
    }

    // Bridson emits blobs in front order, so shuffle before trimming.
    for (let i = points.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [points[i], points[j]] = [points[j], points[i]];
    }

    // Callers size an InstancedMesh from `count`, so the length must be exact.
    if (points.length < count) {
        points.push(...scatterPositions(count - points.length, rng));
    }

    return points.slice(0, count);
}
