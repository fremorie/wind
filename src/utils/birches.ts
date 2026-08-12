import { alea } from 'seedrandom';

import { BIRCH_BASE_SCALE } from './constants';
import { type Instance } from './instances';
import { scatterPositions } from './foliageField';

export function getBirchesAttributes(count: number): Instance[] {
    const rng = alea('birches');

    return scatterPositions(count, rng).map(([x, z]) => ({
        // y is left at 0: the shader lifts each birch onto the terrain.
        position: [x, 0, z],
        rotation: -Math.PI / 2,
        scale: BIRCH_BASE_SCALE + rng() - 0.5,
    }));
}
