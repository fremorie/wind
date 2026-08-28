export const CHUNK_SIZE = 40;
export const GRID_SIZE_X = 7;
export const GRID_SIZE_Z = 7;

export const CHUNKS_BEHIND_PLAYER = 1;
export const CHUNKS_IN_FRONT_OF_PLAYER = GRID_SIZE_X - CHUNKS_BEHIND_PLAYER - 1;

export const GRID_TOTAL_WIDTH = GRID_SIZE_Z * CHUNK_SIZE;
export const GRID_TOTAL_DEPTH = GRID_SIZE_X * CHUNK_SIZE;

export const RECYCLING_RADIUS_Z = Math.floor(GRID_SIZE_Z / 2);

export const GRASS_TILE_SIZE = GRID_TOTAL_WIDTH / 2 + 20;

// Lake. Size and depth are in WORLD_SETTINGS; only the position is CPU-side.
export const LAKE_CENTER = [GRID_TOTAL_WIDTH * 3, GRID_TOTAL_WIDTH / 2];

// Wind farm
export const WIND_TURBINE_COUNT = 6;
export const WIND_FARM_RADIUS = 300;
export const WIND_FARM_CENTER_Z = WIND_FARM_RADIUS / 2;
// Past this X the farm stops following the player, so it can be walked up to.
export const WIND_FARM_REACHABLE_X = GRID_TOTAL_DEPTH * 5;

// Trees
export const TREES_COUNT = 10;
export const TREE_BASE_SCALE = 2.3;

export const TREES_V2_COUNT = 20;

// Side road: straight line along x = 400
export const SIDE_ROAD_X = 400;
const ROAD_WIDTH = 12;

// River
const RIVER_WIDTH = 20;

/**
 * The only copy of the world's shape, read by both terrains: the CPU one in
 * utils/elevation.ts and the GPU one in shaders/includes/elevation.glsl.
 * shaders/worldSettings.ts compiles it into the constants the shaders get.
 * Names match the GLSL spelling so a value is greppable in both languages.
 */
export const WORLD_SETTINGS = {
    // Terrain
    uPositionFrequency: 0.03,
    uStrength: 10,
    uCurvature: 0.0007,

    // Main road
    uRoadWidth: ROAD_WIDTH,
    uRoadAmplitude: 3.46,
    uRoadWaviness: 0.06,
    uRoadFalloff: 5,
    uRoadPeriod: GRID_TOTAL_WIDTH * 2.5,

    // Side road
    uSideRoadX: SIDE_ROAD_X,

    // River
    uRiverWidth: RIVER_WIDTH,
    uRiverAmplitude: 3.46,
    uRiverWaviness: 0.06,
    uRiverFalloff: RIVER_WIDTH,
    uRiverPeriod: GRID_TOTAL_WIDTH * 2.5,
    uRiverCenterZ: 40,
    uRiverAngle: 0.6,
    uRiverDepth: -8,
    uRiverSurfaceLevel: -3,

    // Lake
    uLakeRadius: 70,
    uLakeDepth: 20,
    uBeachWidth: 0.25,
    uLakeSurfaceLevel: -2,

    // Sun
    uSunX: 1,
    uSunZ: -0.6,
} as const;

// Unpacked so call sites can import a single value.
export const {
    uSideRoadX,
    uPositionFrequency,
    uStrength,
    uCurvature,
    uRoadWidth,
    uRoadAmplitude,
    uRoadWaviness,
    uRoadFalloff,
    uRoadPeriod,
    uRiverWidth,
    uRiverAmplitude,
    uRiverWaviness,
    uRiverFalloff,
    uRiverPeriod,
    uRiverCenterZ,
    uRiverAngle,
    uRiverDepth,
    uRiverSurfaceLevel,
    uLakeRadius,
    uLakeDepth,
    uBeachWidth,
    uLakeSurfaceLevel,
} = WORLD_SETTINGS;
