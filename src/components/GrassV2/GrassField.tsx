import { useState } from 'react';
import { useFrame } from '@react-three/fiber';

import useGame from '../../store/useGame';
import {
    generateGrassTilePositions,
    GRASS_PATCH_SIZE,
    GRASS_SEGMENTS,
    wrapGrassTile,
} from '../../utils/grassV2';
import { createGrassGeometry } from './utils';
import { GrassV2Material } from '../../materials/grassV2Material';

const geometry = createGrassGeometry(GRASS_SEGMENTS);
const material = new GrassV2Material();

export function GrassFieldV2() {
    const playerPosition = useGame((state) => state.playerPosition);

    const [grassTiles, setGrassTiles] = useState(() =>
        generateGrassTilePositions(),
    );

    useFrame((_, delta) => {
        material.uTime += delta;
        material.uPlayerPosition.set(playerPosition.x, playerPosition.z);

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
                    geometry={geometry}
                    material={material}
                    position={grassTile.position}
                    key={grassTile.key}
                />
            ))}
        </>
    );
}
