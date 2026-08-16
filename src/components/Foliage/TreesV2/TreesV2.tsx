import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

import { foliageUniforms } from '../../../materials/foliage/foliageMaterials';
import { getTreeAttributes } from '../../../utils/treesV2';
import { InstancedTree } from './InstancedTree';
import { TREE_SPECIES } from './species';
import { useTreesV2Controls } from './useTreesV2Controls';

type Props = {
    count: number;
};

export function TreesV2({ count }: Props) {
    useTreesV2Controls();

    useFrame((_, delta) => {
        foliageUniforms.uTime.value += delta;
    });

    const treesBySpecies = useMemo(() => getTreeAttributes(count), [count]);

    return (
        <>
            {TREE_SPECIES.map((species) => (
                <InstancedTree
                    key={species.name}
                    trees={treesBySpecies[species.name]}
                    species={species}
                />
            ))}
        </>
    );
}
