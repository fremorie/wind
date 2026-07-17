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
const ROAD_MARGIN = 5;
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
