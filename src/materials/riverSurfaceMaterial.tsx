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
        uFresnelStrength: 0.83,
        uFresnelPower: 6.82,
        uFresnelColor: new THREE.Color('#fce4e4'),
        uPerlinNoiseTexture: perlinNoiseTexture,
        uTime: 0,
    },
    riverSurfaceVertexShader,
    riverSurfaceFragmentShader,
);

export const riverSurfaceMaterial = new RiverSurfaceMaterial({
    transparent: true,
});
