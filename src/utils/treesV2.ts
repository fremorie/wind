import { alea } from 'seedrandom';

import { TREE_BASE_SCALE } from './constants';
import { type Instance } from './instances';
import { scatterPositionsSpaced } from './foliageField';

export type TreeSpeciesName = 'birch' | 'maple' | 'oak';

/**
 * Relative share of the forest each species takes. The shares sum to 1, so one
 * uniform sample per tree is enough to pick a species.
 */
const SPECIES_MIX: Array<[TreeSpeciesName, number]> = [
    ['maple', 0.35],
    ['birch', 0.35],
    ['oak', 0.3],
];

function pickSpecies(sample: number): TreeSpeciesName {
    let cumulative = 0;

    for (const [species, share] of SPECIES_MIX) {
        cumulative += share;

        if (sample < cumulative) return species;
    }

    // Only reachable if the shares undershoot 1 by a rounding error.
    return SPECIES_MIX[SPECIES_MIX.length - 1][0];
}

/**
 * These models are flat cards, so a random yaw would turn half the forest
 * edge-on to the camera. Every tree faces the same way instead.
 */
const TREE_ROTATION = -Math.PI / 2;

/**
 * Scatters `count` trees over the field in one pass - so the spacing holds
 * across species, not just within one - then splits them by species. Each
 * species gets its own list because each is drawn by its own InstancedMesh.
 */
export function getTreeAttributes(
    count: number,
): Record<TreeSpeciesName, Instance[]> {
    const rng = alea('trees');
    const bySpecies: Record<TreeSpeciesName, Instance[]> = {
        birch: [],
        maple: [],
        oak: [],
    };

    for (const [x, z] of scatterPositionsSpaced(count, rng)) {
        const scale = TREE_BASE_SCALE + rng() - 0.5;

        bySpecies[pickSpecies(rng())].push({
            // y is left at 0: the shader lifts each tree onto the terrain.
            position: [x, 0, z],
            rotation: TREE_ROTATION,
            scale,
        });
    }

    return bySpecies;
}
