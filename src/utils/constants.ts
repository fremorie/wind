export const CHUNK_SIZE = 40;
export const GRID_SIZE = 9;
export const GRID_TOTAL_WIDTH = GRID_SIZE * CHUNK_SIZE;

export const RECYCLING_RADIUS = Math.floor(GRID_SIZE / 2);
export const GRASS_TILE_SIZE = GRID_TOTAL_WIDTH / 2 + 20;
export const CURVATURE = 0.0007;

// Lake
export const LAKE_CENTER = [GRID_TOTAL_WIDTH * 2, GRID_TOTAL_WIDTH / 2];
export const LAKE_RADIUS = 60;
export const BEACH_WIDTH = 1;
export const LAKE_DEPTH = 20;
export const LAKE_SURFACE_LEVEL = -2;

// Wind farm
export const WIND_TURBINE_COUNT = 8;
