import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

import { foliageUniforms } from '../../../materials/foliage/foliageMaterials';
import {
    getTreeAttributes,
    type TreeSpeciesName,
} from '../../../utils/treesV2';
import { InstancedTree } from './InstancedTree';
import { TREE_SPECIES } from './species';
import { useTreesV2Controls } from './useTreesV2Controls';
import { type Instance } from '../../../utils/instances';

type Props = {
    count: number;
    recycle: boolean;
    treesAttributes?: Record<TreeSpeciesName, Instance[]>;
};

export function TreesV2({ count, recycle, treesAttributes }: Props) {
    useTreesV2Controls();

    useFrame((_, delta) => {
        foliageUniforms.uTime.value += delta;
    });

    const treesBySpecies = useMemo(
        () => treesAttributes ?? getTreeAttributes(count),
        [count, treesAttributes],
    );

    return (
        <>
            {TREE_SPECIES.map((species) => (
                <InstancedTree
                    recycle={recycle}
                    key={species.name}
                    trees={treesBySpecies[species.name]}
                    species={species}
                />
            ))}
        </>
    );
}
