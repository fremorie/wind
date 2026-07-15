import { useMemo } from 'react';

import { Bushes } from './Bushes';
import { Trees } from './Trees';
import { getTreesPositions } from '../../utils/trees';
import { getFoliageAttributes } from '../../utils/bushes';

type Props = {
    bushesCount: number;
    treesCount: number;
};

export function Foliage({ bushesCount, treesCount }: Props) {
    const { positions: treesPositions, scales: treesScales } = useMemo(
        () => getTreesPositions(treesCount),
        [treesCount],
    );
    const foliageAttributes = useMemo(
        () => getFoliageAttributes(treesPositions, treesScales, bushesCount),
        [treesPositions, treesScales, bushesCount],
    );

    return (
        <>
            <Bushes
                positions={foliageAttributes.positions}
                scales={foliageAttributes.scales}
            />
            <Trees positions={treesPositions} scales={treesScales} />
        </>
    );
}
