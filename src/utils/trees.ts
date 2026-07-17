import { alea } from 'seedrandom';

import { CHUNK_SIZE, GRID_SIZE_Z, TREE_BASE_SCALE } from './constants';
import { type Instance } from './instances';

export function getTreesAttributes(count: number): Instance[] {
    const rng = alea('trees');
    const trees: Instance[] = [];

    for (let i = 1; i < count / 2 + 1; i++) {
        const x = ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 28 + 20 * i;
        const z = ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 44;

        trees.push({
            position: [x, 0, z + 20 * i],
            rotation: rng() * Math.PI * 2,
            scale: TREE_BASE_SCALE + rng() - 0.5,
        });

        trees.push({
            position: [x, 0, z - 20 * i],
            rotation: rng() * Math.PI * 2,
            scale: TREE_BASE_SCALE + rng() - 0.5,
        });
    }

    return trees;
}
