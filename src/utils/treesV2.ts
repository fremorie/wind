import { alea } from 'seedrandom';

import { type Instance } from './instances';
import { scatterPositions } from './foliageField';

/** How a species is sown across the field. */
export type TreePlacement = {
    /** Seeds the scatter, so each species lands somewhere different. */
    seed: string;
    /** Random scale is this +/- 0.5. */
    baseScale: number;
    /**
     * Fixed yaw, in radians. These models are flat cards, so a random yaw would
     * turn half the forest edge-on to the camera.
     */
    rotation: number;
};

export function getTreeAttributes(
    { seed, baseScale, rotation }: TreePlacement,
    count: number,
): Instance[] {
    const rng = alea(seed);

    return scatterPositions(count, rng).map(([x, z]) => ({
        // y is left at 0: the shader lifts each tree onto the terrain.
        position: [x, 0, z],
        rotation,
        scale: baseScale + rng() - 0.5,
    }));
}
