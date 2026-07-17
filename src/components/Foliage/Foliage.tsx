import { useMemo } from 'react';

import { Bushes } from './Bushes';
import { Trees } from './Trees';
import { getTreesAttributes } from '../../utils/trees';
import { getFoliageAttributes } from '../../utils/bushes';

type Props = {
    bushesCount: number;
    treesCount: number;
};

export function Foliage({ bushesCount, treesCount }: Props) {
    const trees = useMemo(() => getTreesAttributes(treesCount), [treesCount]);
    const bushes = useMemo(
        () => getFoliageAttributes(trees, bushesCount),
        [trees, bushesCount],
    );

    return (
        <>
            <Bushes instances={bushes} />
            <Trees instances={trees} />
        </>
    );
}
