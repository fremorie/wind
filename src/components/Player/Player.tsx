import { useMemo } from 'react';

import { getPlayerPosition } from '../Terrain/utils';

export function Player() {
    const position = useMemo(() => getPlayerPosition(), []);

    return (
        <mesh position={position}>
            <sphereGeometry />
            <meshBasicMaterial color="mediumpurple" />
        </mesh>
    );
}
