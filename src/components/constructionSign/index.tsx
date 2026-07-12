import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, useMatcapTexture } from '@react-three/drei';
import * as THREE from 'three';

import { ConstructionSignModel } from './constructionSignModel';
import { CHUNK_SIZE, GRID_SIZE_Z } from '../../utils/constants';
import useGame from '../../store/useGame';
import { getWindTurbinePosition } from '../../utils/decorations';

export function ConstructionSign() {
    const groupRef = useRef<THREE.Group>(null);
    const playerPosition = useGame((state) => state.playerPosition);
    const [matcapTexture] = useMatcapTexture(
        '27222B_677491_484F6A_5D657A',
        256,
    );

    useFrame(() => {
        if (!groupRef.current) return;

        groupRef.current.position.y =
            getWindTurbinePosition(groupRef.current.position, playerPosition) +
            2;
    });

    return (
        <group
            ref={groupRef}
            position={[
                ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 18,
                0,
                ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 14,
            ]}
        >
            <ConstructionSignModel scale={3} rotation-y={Math.PI / 2} />
            <ConstructionSignModel scale={3} rotation-y={1} position-z={9} />
            <Text3D
                font={'./fonts/Rubik_Microbe/RubikMicrobe_Regular.json'}
                rotation-y={-Math.PI / 2}
                position-y={2}
                position-z={-3.5}
                size={1.35}
            >
                Under construction
                <meshMatcapMaterial matcap={matcapTexture} />
            </Text3D>
        </group>
    );
}
