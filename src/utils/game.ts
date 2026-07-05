import { CHUNK_SIZE, GRID_SIZE } from './constants';

export type GridChunkPosition = [x: number, y: number, z: number];

export type GridChunk = {
    position: GridChunkPosition;
    key: string;
};

export function generateTerrainChunkPositions(gridSize: number = GRID_SIZE) {
    const positions: Array<GridChunk> = [];

    for (let z = 0; z < gridSize; z++) {
        for (let x = 0; x < gridSize; x++) {
            positions.push({
                position: [x * CHUNK_SIZE, 0, z * CHUNK_SIZE],
                key: `${x}_${z}`,
            });
        }
    }

    return positions;
}
