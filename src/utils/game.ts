import {
    CHUNK_SIZE,
    GRID_SIZE_X,
    GRID_SIZE_Z,
    GRID_TOTAL_WIDTH,
    GRID_TOTAL_DEPTH,
    RECYCLING_RADIUS_Z,
    CHUNKS_BEHIND_PLAYER,
    CHUNKS_IN_FRONT_OF_PLAYER,
} from './constants';

export type GridChunkPosition = [x: number, y: number, z: number];

export type GridChunk = {
    position: GridChunkPosition;
    key: string;
};

export function generateTerrainChunkPositions(
    gridSizeX: number = GRID_SIZE_X,
    gridSizeZ: number = GRID_SIZE_Z,
) {
    const positions: Array<GridChunk> = [];

    for (let z = 0; z < gridSizeZ; z++) {
        for (let x = 0; x < gridSizeX; x++) {
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

    const shouldWrapNorth = chunkCellX < playerCellX - CHUNKS_BEHIND_PLAYER;
    const shouldWrapEast = chunkCellZ < playerCellZ - RECYCLING_RADIUS_Z;
    const shouldWrapSouth =
        chunkCellX > playerCellX + CHUNKS_IN_FRONT_OF_PLAYER;
    const shouldWrapWest = chunkCellZ > playerCellZ + RECYCLING_RADIUS_Z;

    if (
        !shouldWrapNorth &&
        !shouldWrapEast &&
        !shouldWrapSouth &&
        !shouldWrapWest
    ) {
        return terrainChunk;
    }

    if (shouldWrapNorth) {
        newTerrainChunk.position[0] += GRID_TOTAL_DEPTH;
    }

    if (shouldWrapEast) {
        newTerrainChunk.position[2] += GRID_TOTAL_WIDTH;
    }

    if (shouldWrapSouth) {
        newTerrainChunk.position[0] -= GRID_TOTAL_DEPTH;
    }

    if (shouldWrapWest) {
        newTerrainChunk.position[2] -= GRID_TOTAL_WIDTH;
    }

    return newTerrainChunk;
}
