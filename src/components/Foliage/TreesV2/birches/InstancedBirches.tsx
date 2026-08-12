import { useGLTF } from '@react-three/drei';

import {
    birchBarkMaterial,
    birchCanopyMaterial,
    birchStripeMaterial,
} from '../../../../materials/foliage/birchMaterial';
import { BIRCH_BASE_SCALE } from '../../../../utils/constants';
import { InstancedTree, type TreeSpecies } from '../InstancedTree';

// The trunk is a two-primitive mesh, so the loader splits it into a pale part
// and a dark-stripe part under the names below.
const birch: TreeSpecies = {
    model: './models/trees/BirchFlat.glb',
    canopy: {
        node: 'Foliage',
        material: birchCanopyMaterial,
    },
    bark: [
        { node: 'Mesh_1007', material: birchBarkMaterial },
        { node: 'Mesh_1007_1', material: birchStripeMaterial },
    ],
    placement: {
        seed: 'birches',
        baseScale: BIRCH_BASE_SCALE,
        rotation: -Math.PI / 2,
    },
};

type Props = {
    count: number;
};

export function InstancedBirches({ count }: Props) {
    return <InstancedTree count={count} species={birch} />;
}

useGLTF.preload(birch.model);
