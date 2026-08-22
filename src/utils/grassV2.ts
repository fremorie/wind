export const NUM_GRASS = 50 * 50;
export const GRASS_SEGMENTS = 6;
export const GRASS_VERTICES = (GRASS_SEGMENTS + 1) * 2;
export const GRASS_PATCH_SIZE = 20;
export const GRASS_WIDTH = 0.12;
export const GRASS_HEIGHT = 1.7;

export const GRASS_GRID_SIZE = 11;
export const GRASS_GRID_TOTAL_SIZE = GRASS_GRID_SIZE * GRASS_PATCH_SIZE;

const GRASS_RECYCLING_RADIUS_Z = Math.floor(GRASS_GRID_SIZE / 2);

export const GRASS_TILES_BEHIND_PLAYER = 1;
export const GRASS_TILES_IN_FRONT_OF_PLAYER =
    GRASS_GRID_SIZE - GRASS_TILES_BEHIND_PLAYER - 1;

export type GrassTilePosition = [x: number, y: number, z: number];

export type GridChunk = {
    position: GrassTilePosition;
    key: string;
};

export function generateGrassTilePositions(
    gridSizeX: number = GRASS_GRID_SIZE,
    gridSizeZ: number = GRASS_GRID_SIZE,
) {
    const positions: Array<GridChunk> = [];

    for (let z = 0; z < gridSizeZ; z++) {
        for (let x = 0; x < gridSizeX; x++) {
            positions.push({
                position: [x * GRASS_PATCH_SIZE, 0, z * GRASS_PATCH_SIZE],
                key: `${x}_${z}`,
            });
        }
    }

    return positions;
}

export function wrapGrassTile(
    grassTile: GridChunk,
    playerCellX: number,
    playerCellZ: number,
): GridChunk {
    const newGrassTile: GridChunk = {
        position: [...grassTile.position],
        key: grassTile.key,
    };

    const chunkCellX = grassTile.position[0] / GRASS_PATCH_SIZE;
    const chunkCellZ = grassTile.position[2] / GRASS_PATCH_SIZE;

    const shouldWrapNorth =
        chunkCellX < playerCellX - GRASS_TILES_BEHIND_PLAYER;
    const shouldWrapEast = chunkCellZ < playerCellZ - GRASS_RECYCLING_RADIUS_Z;
    const shouldWrapSouth =
        chunkCellX > playerCellX + GRASS_TILES_IN_FRONT_OF_PLAYER;
    const shouldWrapWest = chunkCellZ > playerCellZ + GRASS_RECYCLING_RADIUS_Z;

    if (
        !shouldWrapNorth &&
        !shouldWrapEast &&
        !shouldWrapSouth &&
        !shouldWrapWest
    ) {
        return grassTile;
    }

    if (shouldWrapNorth) {
        newGrassTile.position[0] += GRASS_GRID_TOTAL_SIZE;
    }

    if (shouldWrapEast) {
        newGrassTile.position[2] += GRASS_GRID_TOTAL_SIZE;
    }

    if (shouldWrapSouth) {
        newGrassTile.position[0] -= GRASS_GRID_TOTAL_SIZE;
    }

    if (shouldWrapWest) {
        newGrassTile.position[2] -= GRASS_GRID_TOTAL_SIZE;
    }

    return newGrassTile;
}
