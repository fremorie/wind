import { useState } from 'react';
import { useFrame } from '@react-three/fiber';

import useGame from '../../store/useGame';
import {
    generateGrassTilePositions,
    GRASS_PATCH_SIZE,
    wrapGrassTile,
} from '../../utils/grassV2';
import { createLodLevels } from './utils';

const lodLevels = createLodLevels();

export function GrassFieldV2() {
    const playerPosition = useGame((state) => state.playerPosition);

    const [grassTiles, setGrassTiles] = useState(() =>
        generateGrassTilePositions(),
    );

    useFrame((_, delta) => {
        lodLevels.forEach((level) => {
            level.material.uTime += delta;
            level.material.uPlayerPosition.set(
                playerPosition.x,
                playerPosition.z,
            );
        });

        const playerX = playerPosition.x;
        const playerZ = playerPosition.z;

        const playerCellX = Math.round(playerX / GRASS_PATCH_SIZE);
        const playerCellZ = Math.round(playerZ / GRASS_PATCH_SIZE);

        const nextGrassTiles = grassTiles.map((chunk) =>
            wrapGrassTile(chunk, playerCellX, playerCellZ),
        );

        const changed = nextGrassTiles.some(
            (chunk, index) => chunk !== grassTiles[index],
        );

        if (changed) {
            setGrassTiles(nextGrassTiles);
        }
    });
    return (
        <>
            {grassTiles.map((grassTile) => (
                <mesh
                    geometry={lodLevels[grassTile.lod].geometry}
                    material={lodLevels[grassTile.lod].material}
                    position={grassTile.position}
                    key={grassTile.key}
                />
            ))}
        </>
    );
}
