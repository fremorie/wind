import { useMemo } from 'react';

import { GrassField } from '../components/Grass/GrassField';
import { getGrassBladesPositions } from '../utils/grass';
import { Terrain } from '../components/Terrain';

export function Grass() {
    const clamps = useMemo(() => getGrassBladesPositions(), []);

    return (
        <group>
            <Terrain />
            <GrassField positions={clamps} />
        </group>
    );
}
