import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend, type ThreeElement } from '@react-three/fiber';

import {
    GRASS_TILE_SIZE,
    GRID_TOTAL_WIDTH,
    LAKE_CENTER,
} from '../utils/constants';
import { grassV2FragmentShader, grassV2VertexShader } from '../shaders';
import {
    GRASS_FADE_BAND,
    GRASS_FADE_END,
    GRASS_HEIGHT,
    GRASS_PATCH_SIZE,
    GRASS_SEGMENTS,
    GRASS_WIDTH,
    GRASS_MAX_GRID,
} from '../utils/grassV2';

export const GrassV2Material = shaderMaterial(
    {
        uTime: 0,

        grassParams: new THREE.Vector4(
            GRASS_SEGMENTS,
            GRASS_PATCH_SIZE,
            GRASS_WIDTH,
            GRASS_HEIGHT,
        ),

        uGridSize: GRASS_MAX_GRID,
        uMaxGridSize: GRASS_MAX_GRID,
        uFadeEnd: new THREE.Vector3(...GRASS_FADE_END),
        uFadeBand: GRASS_FADE_BAND,
        uWidthGain: 1.2,

        uTipColor: new THREE.Color('#608d34'),
        uBaseColor: new THREE.Color('#90d64b'),

        uTipColor2: new THREE.Color('#b2b418'),
        uBaseColor2: new THREE.Color('#365517'),

        uHorizonColor: new THREE.Color('#81A63D'),

        uShadowColor: new THREE.Color('#88a9c4'),
        uAlphaMap: null as THREE.Texture | null,

        // Road
        uRoadCenter: new THREE.Vector3(
            GRID_TOTAL_WIDTH / 2,
            0,
            GRID_TOTAL_WIDTH / 2,
        ),

        uPlayerPosition: new THREE.Vector2(),

        uTileSize: GRASS_TILE_SIZE,

        // Lake
        uLakeCenterX: LAKE_CENTER[0],
        uLakeCenterZ: LAKE_CENTER[1],
    },
    grassV2VertexShader,
    grassV2FragmentShader,
);

extend({ GrassV2Material });

export type GrassV2MaterialImpl = InstanceType<typeof GrassV2Material>;

declare module '@react-three/fiber' {
    interface ThreeElements {
        grassV2Material: ThreeElement<typeof GrassV2Material>;
    }
}
