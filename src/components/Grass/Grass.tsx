import { useMemo } from 'react';

import { GrassField } from './GrassField';
import { getGrassBladesPositions } from '../../utils/grass';
import { GRID_TOTAL_WIDTH } from '../../utils/constants';

export function Grass() {
    const clamps = useMemo(
        () => getGrassBladesPositions(500000, GRID_TOTAL_WIDTH, [], 1, 0),
        [],
    );

    return (
        <group position={[GRID_TOTAL_WIDTH / 2, 0, GRID_TOTAL_WIDTH / 2]}>
            <GrassField positions={clamps} />
        </group>
    );
}
