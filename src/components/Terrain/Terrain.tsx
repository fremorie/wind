import { useMemo } from 'react';

import { generateTerrainChunkPositions } from './utils';
import { TerrainChunk } from './TerrainChunk';
import { useTerrainControls } from './useTerrainControls';

export function Terrain() {
    useTerrainControls();

    const terrainChunkPositions = useMemo(
        () => generateTerrainChunkPositions(),
        [],
    );

    return (
        <>
            {terrainChunkPositions.map((position) => (
                <TerrainChunk key={position.toString()} position={position} />
            ))}
        </>
    );
}
