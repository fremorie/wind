import { useState } from 'react';
import { useFrame } from '@react-three/fiber';

import {
    generateTerrainChunkPositions,
    type GridChunk,
    type GridChunkPosition,
} from '../../utils/game';
import { TerrainChunk } from './TerrainChunk';
import { useTerrainControls } from './useTerrainControls';
import useGame from '../../store/useGame';
import { BACK_BUFFER, GRID_TOTAL_WIDTH } from '../../utils/constants';

export function Terrain() {
    useTerrainControls();

    const [terrainChunks, setTerrainChunks] = useState(() =>
        generateTerrainChunkPositions(),
    );
    const playerPosition = useGame((state) => state.playerPosition);

    useFrame(() => {
        const playerX = playerPosition.x;
        let movedToNextChunk = false;

        const nextChunk: GridChunk[] = terrainChunks.map((chunk) => {
            if (chunk.position[0] < playerX - BACK_BUFFER) {
                movedToNextChunk = true;
                const [x, y, z] = chunk.position;
                const nextPosition: GridChunkPosition = [
                    x + GRID_TOTAL_WIDTH,
                    y,
                    z,
                ];
                return {
                    ...chunk,
                    position: nextPosition,
                };
            }
            return chunk;
        });

        if (movedToNextChunk) {
            setTerrainChunks(nextChunk);
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
