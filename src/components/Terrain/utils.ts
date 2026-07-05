import { CHUNK_SIZE, GRID_SIZE } from './constants';

export function generateTerrainChunkPositions(gridSize: number = GRID_SIZE) {
    const positions: Array<[x: number, y: number, z: number]> = [];

    for (let z = 0; z < gridSize; z++) {
        for (let x = 0; x < gridSize; x++) {
            positions.push([x * CHUNK_SIZE, 0, z * CHUNK_SIZE]);
        }
    }

    return positions;
}

export function getPlayerPosition(
    gridSize = GRID_SIZE,
    chunkSize = CHUNK_SIZE,
) {
    return [0, 0, ((gridSize - 1) * chunkSize) / 2];
}
