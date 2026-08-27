import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

import {
    riverSurfaceFragmentShader,
    riverSurfaceVertexShader,
} from '../shaders';
import { GRID_TOTAL_WIDTH, LAKE_CENTER } from '../utils/constants';

const textureLoader = new THREE.TextureLoader();

const perlinNoiseTexture = textureLoader.load(
    './textures/perlinNoise/perlin.png',
);
perlinNoiseTexture.wrapS = THREE.RepeatWrapping;
perlinNoiseTexture.wrapT = THREE.RepeatWrapping;

export const RiverSurfaceMaterial = shaderMaterial(
    {
        uFresnelStrength: 0.65,
        uFresnelPower: 3.49,
        // Color of the sky
        uFresnelColor: new THREE.Color('#d6c8c7'),
        uPerlinNoiseTexture: perlinNoiseTexture,
        uTime: 0,

        // Stuff for elevation
        uRoadCenter: new THREE.Vector3(
            GRID_TOTAL_WIDTH / 2,
            0,
            GRID_TOTAL_WIDTH / 2,
        ),
        // Lake
        uLakeCenterX: LAKE_CENTER[0],
        uLakeCenterZ: LAKE_CENTER[1],
    },
    riverSurfaceVertexShader,
    riverSurfaceFragmentShader,
);

export const riverSurfaceMaterial = new RiverSurfaceMaterial({
    transparent: true,
});
