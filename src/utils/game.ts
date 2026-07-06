import {
    CHUNK_SIZE,
    GRID_SIZE,
    GRID_TOTAL_WIDTH,
    RECYCLING_RADIUS,
} from './constants';

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

export function wrapTerrainChunk(
    terrainChunk: GridChunk,
    playerCellX: number,
    playerCellZ: number,
): GridChunk {
    const newTerrainChunk: GridChunk = {
        position: [...terrainChunk.position],
        key: terrainChunk.key,
    };

    const chunkCellX = terrainChunk.position[0] / CHUNK_SIZE;
    const chunkCellZ = terrainChunk.position[2] / CHUNK_SIZE;

    const shouldWrapNorth = chunkCellX < playerCellX - RECYCLING_RADIUS;
    const shouldWrapEast = chunkCellZ < playerCellZ - RECYCLING_RADIUS;
    const shouldWrapSouth = chunkCellX > playerCellX + RECYCLING_RADIUS;
    const shouldWrapWest = chunkCellZ > playerCellZ + RECYCLING_RADIUS;

    if (
        !shouldWrapNorth &&
        !shouldWrapEast &&
        !shouldWrapSouth &&
        !shouldWrapWest
    ) {
        return terrainChunk;
    }

    if (shouldWrapNorth) {
        newTerrainChunk.position[0] += GRID_TOTAL_WIDTH;
    }

    if (shouldWrapEast) {
        newTerrainChunk.position[2] += GRID_TOTAL_WIDTH;
    }

    if (shouldWrapSouth) {
        newTerrainChunk.position[0] -= GRID_TOTAL_WIDTH;
    }

    if (shouldWrapWest) {
        newTerrainChunk.position[2] -= GRID_TOTAL_WIDTH;
    }

    return newTerrainChunk;
}
