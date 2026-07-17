import { alea } from 'seedrandom';

import { TREE_BASE_SCALE } from './constants';
import { type Instance } from './instances';
import { scatterPositions } from './foliageField';

export function getTreesAttributes(count: number): Instance[] {
    const rng = alea('trees');

    return scatterPositions(count, rng).map(([x, z]) => ({
        position: [x, 0, z],
        rotation: rng() * Math.PI * 2,
        scale: TREE_BASE_SCALE + rng() - 0.5,
    }));
}
