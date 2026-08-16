import { useGLTF } from '@react-three/drei';

import {
    mapleBarkMaterial,
    mapleCanopyMaterial,
} from '../../../../materials/foliage/mapleMaterial';
import { MAPLE_BASE_SCALE } from '../../../../utils/constants';
import { InstancedTree, type TreeSpecies } from '../InstancedTree';

const maple: TreeSpecies = {
    model: './models/trees/MapleFlat.glb',
    canopy: {
        node: 'mapleFoliageV2',
        material: mapleCanopyMaterial,
    },
    bark: [{ node: 'maple', material: mapleBarkMaterial }],
    placement: {
        seed: 'maples2',
        baseScale: MAPLE_BASE_SCALE,
        rotation: -Math.PI / 2,
    },
};

type Props = {
    count: number;
};

export function InstancedMaples({ count }: Props) {
    return <InstancedTree count={count} species={maple} />;
}

useGLTF.preload(maple.model);
