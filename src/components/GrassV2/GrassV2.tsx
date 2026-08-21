import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { createGrassGeometry } from './utils';
import {
    GrassV2Material,
    type GrassV2MaterialImpl,
} from '../../materials/grassV2Material';
import useGame from '../../store/useGame';
import { GRASS_SEGMENTS } from '../../utils/grassV2';

export function GrassV2() {
    const playerPosition = useGame((state) => state.playerPosition);

    const materialRef = useRef<GrassV2MaterialImpl>(null);
    const geometry = useMemo(() => createGrassGeometry(GRASS_SEGMENTS), []);

    useFrame((_, delta) => {
        if (materialRef.current) {
            materialRef.current.uTime += delta;
            materialRef.current.uPlayerPosition.set(
                playerPosition.x,
                playerPosition.z,
            );
        }
    });

    return (
        <mesh geometry={geometry}>
            <grassV2Material key={GrassV2Material.key} ref={materialRef} />
        </mesh>
    );
}
