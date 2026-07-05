import { shaderMaterial } from '@react-three/drei';
import { extend, type ThreeElement } from '@react-three/fiber';

import terrainVertexShader from '../shaders/terrain/vertex.glsl';
import terrainFragmentShader from '../shaders/terrain/fragment.glsl';

export const TerrainMaterial = shaderMaterial(
    { time: 0 },
    terrainVertexShader,
    terrainFragmentShader,
);

extend({ TerrainMaterial });

declare module '@react-three/fiber' {
    interface ThreeElements {
        terrainMaterial: ThreeElement<typeof TerrainMaterial>;
    }
}
