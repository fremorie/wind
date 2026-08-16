import { useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { HeightfieldCollider, RigidBody } from '@react-three/rapier';

import useGame from '../../store/useGame';
import {
    buildHeights,
    cellFor,
    PATCH_SIZE,
    RECENTER_STEP,
    SUBDIVS,
} from './colliderUtils';

export function TerrainCollider() {
    const playerPosition = useGame((state) => state.playerPosition);
    const [cell, setCell] = useState(() => ({
        x: cellFor(playerPosition.x),
        z: cellFor(playerPosition.z),
    }));

    useFrame(() => {
        const x = cellFor(playerPosition.x);
        const z = cellFor(playerPosition.z);

        if (x !== cell.x || z !== cell.z) {
            setCell({ x, z });
        }
    });

    const centerX = cell.x * RECENTER_STEP;
    const centerZ = cell.z * RECENTER_STEP;

    const heights = useMemo(
        () => buildHeights(centerX, centerZ),
        [centerX, centerZ],
    );

    const scale = useMemo(() => ({ x: PATCH_SIZE, y: 1, z: PATCH_SIZE }), []);

    return (
        <RigidBody
            key={`${cell.x}:${cell.z}`}
            type="fixed"
            colliders={false}
            position={[centerX, 0, centerZ]}
            restitution={0}
        >
            <HeightfieldCollider args={[SUBDIVS, SUBDIVS, heights, scale]} />
        </RigidBody>
    );
}
