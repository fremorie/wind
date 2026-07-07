import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend, type ThreeElement } from '@react-three/fiber';

import { GRID_TOTAL_WIDTH, GRASS_TILE_SIZE } from '../utils/constants';
import vertexShader from '../shaders/grass/vertex.glsl';
import fragmentShader from '../shaders/grass/fragment.glsl';

export const GrassBladeMaterial = shaderMaterial(
    {
        uTime: 0,
        uCenterColor: new THREE.Color('#608d34'),
        uShadowColor: new THREE.Color('#88a9c4'),
        uAlphaMap: null as THREE.Texture | null,

        uPositionFrequency: 0.03,
        uStrength: 10.0,

        // Road
        uRoadCenter: new THREE.Vector3(
            GRID_TOTAL_WIDTH / 2,
            0,
            GRID_TOTAL_WIDTH / 2,
        ),
        uRoadWidth: 12,
        uRoadAmplitude: 3.46,
        uRoadWaviness: 0.16,
        uRoadFalloff: 5,

        uPlayerPosition: new THREE.Vector2(),
        uCurvature: 0.0007,

        uTileSize: GRASS_TILE_SIZE,
    },
    vertexShader,
    fragmentShader,
    (material) => {
        if (!material) return;
        // Real-time directional light shadows
        material.lights = true;
        material.uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib.lights,
            material.uniforms,
        ]);
    },
);

extend({ GrassBladeMaterial });

export type GrassBladeMaterialImpl = InstanceType<typeof GrassBladeMaterial>;

declare module '@react-three/fiber' {
    interface ThreeElements {
        grassBladeMaterial: ThreeElement<typeof GrassBladeMaterial>;
    }
}
