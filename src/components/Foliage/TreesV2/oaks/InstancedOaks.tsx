import { useGLTF } from '@react-three/drei';

import {
    oakBarkMaterial,
    oakCanopyMaterial,
} from '../../../../materials/foliage/oakMaterial';
import { OAK_BASE_SCALE } from '../../../../utils/constants';
import { InstancedTree, type TreeSpecies } from '../InstancedTree';

const oak: TreeSpecies = {
    model: './models/trees/OakFlat.glb',
    canopy: {
        node: 'oakFoliage',
        material: oakCanopyMaterial,
    },
    bark: [{ node: 'oak', material: oakBarkMaterial }],
    placement: {
        seed: 'oaks4',
        baseScale: OAK_BASE_SCALE,
        rotation: -Math.PI / 2,
    },
};

type Props = {
    count: number;
};

export function InstancedOaks({ count }: Props) {
    return <InstancedTree count={count} species={oak} />;
}

useGLTF.preload(oak.model);
