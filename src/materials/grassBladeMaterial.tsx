import * as THREE from 'three';
import { GRID_TOTAL_WIDTH } from '../utils/constants';
import vertexShader from '../shaders/grass/vertex.glsl';
import fragmentShader from '../shaders/grass/fragment.glsl';
import { shaderMaterial } from '@react-three/drei';
import { extend, type ThreeElement } from '@react-three/fiber';

export const GrassBladeMaterial = shaderMaterial(
    {
        uTime: 0,
        uCenterColor: new THREE.Color('#608d34'),
        uShadowColor: new THREE.Color('#d3d9de'),
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
        uCurvature: 0.001,

        uTileSize: GRID_TOTAL_WIDTH,
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
