import { alea } from 'seedrandom';

import { CHUNK_SIZE, GRID_SIZE_Z, TREE_BASE_SCALE } from './constants';

export function getTreesPositions(count: number): {
    positions: Array<[x: number, y: number, z: number]>;
    scales: number[];
} {
    const rng = alea('trees');
    const positions: Array<[x: number, y: number, z: number]> = [];
    const scales: number[] = [];

    for (let i = 1; i < count / 2 + 1; i++) {
        positions.push([
            ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 28 + 20 * i,
            0,
            ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 44 + 20 * i,
        ]);

        positions.push([
            ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 28 + 20 * i,
            0,
            ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 44 - 20 * i,
        ]);

        scales.push(TREE_BASE_SCALE + rng() - 0.5);
        scales.push(TREE_BASE_SCALE + rng() - 0.5);
    }

    return { positions, scales };
}
