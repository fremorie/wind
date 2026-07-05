import { useMemo } from 'react';

import { generateTerrainChunkPositions } from './utils';
import { TerrainChunk } from './TerrainChunk';

export function Terrain() {
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
