import { useMemo, useRef } from 'react';
import type { Group } from 'three';

import { generateTerrainChunkPositions } from './utils';
import { TerrainChunk } from './TerrainChunk';
import { useTerrainControls } from './useTerrainControls';
import useGame from '../../store/useGame';
import { useFrame } from '@react-three/fiber';

export function Terrain() {
    useTerrainControls();

    const terrainRef = useRef<Group>(null);

    const terrainChunkPositions = useMemo(
        () => generateTerrainChunkPositions(),
        [],
    );

    const isMovingForward = useGame((state) => state.isMovingForward);

    useFrame(() => {
        if (isMovingForward && terrainRef.current) {
            terrainRef.current.position.x -= 0.2;
        }
    });

    return (
        <group ref={terrainRef}>
            {terrainChunkPositions.map((position) => (
                <TerrainChunk key={position.toString()} position={position} />
            ))}
        </group>
    );
}
