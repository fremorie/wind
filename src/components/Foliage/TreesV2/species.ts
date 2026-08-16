import { useGLTF } from '@react-three/drei';

import {
    birchBarkMaterial,
    birchCanopyMaterial,
    birchStripeMaterial,
} from '../../../materials/foliage/birchMaterial';
import {
    mapleBarkMaterial,
    mapleCanopyMaterial,
} from '../../../materials/foliage/mapleMaterial';
import {
    oakBarkMaterial,
    oakCanopyMaterial,
} from '../../../materials/foliage/oakMaterial';
import { type TreeSpecies } from './InstancedTree';

/**
 * One entry per species. TreesV2 renders an InstancedTree from each, so adding
 * a species here (and to the mix in utils/treesV2.ts) is all it takes.
 */
export const TREE_SPECIES: TreeSpecies[] = [
    {
        name: 'birch',
        model: './models/trees/BirchFlat.glb',
        canopy: {
            node: 'Foliage',
            material: birchCanopyMaterial,
        },
        // The trunk is a two-primitive mesh, so the loader splits it into a
        // pale part and a dark-stripe part under the names below.
        bark: [
            { node: 'Mesh_1007', material: birchBarkMaterial },
            { node: 'Mesh_1007_1', material: birchStripeMaterial },
        ],
    },
    {
        name: 'maple',
        model: './models/trees/MapleFlat.glb',
        canopy: {
            node: 'mapleFoliageV2',
            material: mapleCanopyMaterial,
        },
        bark: [{ node: 'maple', material: mapleBarkMaterial }],
    },
    {
        name: 'oak',
        model: './models/trees/OakFlat.glb',
        canopy: {
            node: 'oakFoliage',
            material: oakCanopyMaterial,
        },
        bark: [{ node: 'oak', material: oakBarkMaterial }],
    },
];

for (const species of TREE_SPECIES) {
    useGLTF.preload(species.model);
}
