import { CHUNK_SIZE, GRID_SIZE_Z } from './constants';

export function getTreesPositions(
    count: number,
): Array<[x: number, y: number, z: number]> {
    return [
        [
            ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 28,
            0,
            ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 44,
        ],
        [
            ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 48,
            0,
            ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 - 44,
        ],
        [
            ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 68,
            0,
            ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 64,
        ],
        [
            ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 88,
            0,
            ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 - 64,
        ],
    ];
}
