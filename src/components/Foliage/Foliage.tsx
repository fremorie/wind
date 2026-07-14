import { useMemo } from 'react';

import { Bushes } from './Bushes';
import { Trees } from './Trees';
import { getTreesPositions } from '../../utils/trees';
import { getBushesPositions } from '../../utils/bushes';

type Props = {
    bushesCount: number;
    treesCount: number;
};

export function Foliage({ bushesCount, treesCount }: Props) {
    const { positions: treesPositions, scales: treesScales } = useMemo(
        () => getTreesPositions(treesCount),
        [treesCount],
    );
    const bushesPositions = useMemo(
        () => getBushesPositions(treesPositions, treesScales, bushesCount),
        [treesPositions, treesScales, bushesCount],
    );

    return (
        <>
            <Bushes positions={bushesPositions} />
            <Trees positions={treesPositions} scales={treesScales} />
        </>
    );
}
