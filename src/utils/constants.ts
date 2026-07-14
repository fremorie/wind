export const CHUNK_SIZE = 40;
export const GRID_SIZE_X = 7;
export const GRID_SIZE_Z = 7;

export const CHUNKS_BEHIND_PLAYER = 1;
export const CHUNKS_IN_FRONT_OF_PLAYER = GRID_SIZE_X - CHUNKS_BEHIND_PLAYER - 1;

export const GRID_TOTAL_WIDTH = GRID_SIZE_Z * CHUNK_SIZE;
export const GRID_TOTAL_DEPTH = GRID_SIZE_X * CHUNK_SIZE;

export const RECYCLING_RADIUS_Z = Math.floor(GRID_SIZE_Z / 2);

export const GRASS_TILE_SIZE = GRID_TOTAL_WIDTH / 2 + 20;
export const CURVATURE = 0.0007;

export const FINISH_LINE_X = GRID_TOTAL_WIDTH * 2;

// Lake
export const LAKE_CENTER = [GRID_TOTAL_WIDTH * 2, GRID_TOTAL_WIDTH / 2];
export const LAKE_RADIUS = 70;
export const BEACH_WIDTH = 1;
export const LAKE_DEPTH = 20;
export const LAKE_SURFACE_LEVEL = -2;

// Wind farm
export const WIND_TURBINE_COUNT = 6;
export const WIND_FARM_RADIUS = 300;

// Trees
export const TREES_COUNT = 10;
export const TREE_BASE_SCALE = 2;

// Bushes
export const BUSHES_COUNT = 20;

/* Mirrored from GLSL! */
// World settings
export const uPositionFrequency = 0.03;
export const uStrength = 10.0;
export const uCurvature = 0.0007;

// Road
export const uRoadWidth = 12.0;
export const uRoadAmplitude = 3.46;
export const uRoadWaviness = 0.16;
export const uRoadFalloff = 5.0;

// Lake
export const uLakeRadius = 70.0;
export const uLakeDepth = 20.0;
export const uBeachWidth = 1.0;
export const uLakeSurfaceLevel = -2.0;
