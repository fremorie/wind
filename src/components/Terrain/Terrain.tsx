import { useState } from 'react';
import { useFrame } from '@react-three/fiber';

import {
    generateTerrainChunkPositions,
    wrapTerrainChunk,
} from '../../utils/game';
import { TerrainChunk } from './TerrainChunk';
import { useTerrainControls } from './useTerrainControls';
import useGame from '../../store/useGame';
import { CHUNK_SIZE } from '../../utils/constants';

export function Terrain() {
    useTerrainControls();

    const [terrainChunks, setTerrainChunks] = useState(() =>
        generateTerrainChunkPositions(),
    );
    const playerPosition = useGame((state) => state.playerPosition);

    useFrame(() => {
        const playerX = playerPosition.x;
        const playerZ = playerPosition.z;

        const playerCellX = Math.round(playerX / CHUNK_SIZE);
        const playerCellZ = Math.round(playerZ / CHUNK_SIZE);

        const nextTerrainChunks = terrainChunks.map((chunk) =>
            wrapTerrainChunk(chunk, playerCellX, playerCellZ),
        );

        const changed = nextTerrainChunks.some(
            (chunk, index) => chunk !== terrainChunks[index],
        );

        if (changed) {
            setTerrainChunks(nextTerrainChunks);
        }
    });

    return (
        <group>
            {terrainChunks.map(({ key, position }) => (
                <TerrainChunk key={key} position={position} />
            ))}
        </group>
    );
}
