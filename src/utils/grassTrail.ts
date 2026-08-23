/**
 * The trail the player leaves in the grass.
 *
 * A single texture holds the flattened grass around the player. It is not
 * anchored to the world: it follows the player, so it only ever has to cover
 * the grass that is close enough for the bend to be visible. Every frame the
 * previous texture is re-sampled into the new one at the new centre, faded a
 * little, and the player's current segment of travel is stamped on top.
 *
 * Channels: RG = the direction to push a blade (encoded to 0..1), B = strength.
 */

/** Texture is TRAIL_RESOLUTION^2. */
export const TRAIL_RESOLUTION = 256;

/** World units covered by the texture, edge to edge. */
export const TRAIL_AREA_SIZE = 60;

/** World units per texel. The centre snaps to this so re-sampling is 1:1. */
export const TRAIL_TEXEL_SIZE = TRAIL_AREA_SIZE / TRAIL_RESOLUTION;

/** Half-width of the flattened path, in world units. */
export const TRAIL_BRUSH_RADIUS = 1.6;

/** Seconds for a flattened blade to fade back to ~37% bent. */
export const TRAIL_RECOVERY_TIME = 4;

/** How far the tip of a fully flattened blade is pushed, in world units. */
export const TRAIL_PUSH = 0.55;

/** How much of its height a fully flattened blade loses. */
export const TRAIL_FLATTEN = 0.6;
