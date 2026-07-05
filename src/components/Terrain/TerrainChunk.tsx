import { terrainGeometry } from './common';
import { TerrainMaterial } from '../../materials/terrainMaterial';

type Props = {
    position: [x: number, y: number, z: number];
};

export function TerrainChunk({ position }: Props) {
    return (
        <mesh
            geometry={terrainGeometry}
            position={position}
            rotation-x={-Math.PI / 2}
        >
            <terrainMaterial key={TerrainMaterial.key} />
        </mesh>
    );
}
