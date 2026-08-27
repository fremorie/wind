import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

import {
    riverSurfaceFragmentShader,
    riverSurfaceVertexShader,
} from '../shaders';

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
    },
    riverSurfaceVertexShader,
    riverSurfaceFragmentShader,
);

export const riverSurfaceMaterial = new RiverSurfaceMaterial({
    transparent: true,
});
