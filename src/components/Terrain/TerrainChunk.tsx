import { terrainGeometry } from './common';
import {
    terrainMaterial,
    terrainDepthMaterial,
} from '../../materials/terrainMaterial';

type Props = {
    position: [x: number, y: number, z: number];
};

export function TerrainChunk({ position }: Props) {
    return (
        <mesh
            geometry={terrainGeometry}
            material={terrainMaterial}
            customDepthMaterial={terrainDepthMaterial}
            position={position}
            receiveShadow
        />
    );
}
