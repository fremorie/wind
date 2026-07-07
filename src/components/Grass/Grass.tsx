import { useMemo } from 'react';
import { useControls } from 'leva';

import { GrassField } from './GrassField';
import { getGrassBladesPositions } from '../../utils/grass';
import { GRID_TOTAL_WIDTH, GRASS_TILE_SIZE } from '../../utils/constants';

export function Grass() {
    const { density } = useControls('Grass', {
        density: { value: 10, min: 1, max: 40, step: 0.5 },
    });

    const clamps = useMemo(() => {
        const count = Math.round(density * GRASS_TILE_SIZE * GRASS_TILE_SIZE);
        return getGrassBladesPositions(count, GRASS_TILE_SIZE, [], 1, 0);
    }, [density]);

    return (
        <group position={[GRID_TOTAL_WIDTH / 2, 0, GRID_TOTAL_WIDTH / 2]}>
            <GrassField positions={clamps} />
        </group>
    );
}
