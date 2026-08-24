import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import { terrainFragmentShader, terrainVertexShader } from '../shaders';
import { GRID_TOTAL_WIDTH, LAKE_CENTER } from '../utils/constants';

const textureLoader = new THREE.TextureLoader();

const perlinNoiseTexture = textureLoader.load(
    './textures/perlinNoise/perlin.png',
);
perlinNoiseTexture.wrapS = THREE.RepeatWrapping;
perlinNoiseTexture.wrapT = THREE.RepeatWrapping;

export const terrainUniforms = {
    uPerlinNoiseTexture: new THREE.Uniform(perlinNoiseTexture),

    uColorGrass: new THREE.Uniform(new THREE.Color('#2B3D13')),
    uColorDirt: new THREE.Uniform(new THREE.Color('#ada364')),

    uNoiseColor: new THREE.Uniform(new THREE.Color('#836c04')),

    uGrassTipColor: new THREE.Uniform(new THREE.Color('#a38e68')),
    uGrassBaseColor: new THREE.Uniform(new THREE.Color('#405823')),

    uPlayerPosition: new THREE.Uniform(new THREE.Vector2()),

    // Road
    uRoadCenter: new THREE.Uniform(
        new THREE.Vector3(GRID_TOTAL_WIDTH / 2, 0, GRID_TOTAL_WIDTH / 2),
    ),

    // Lake
    uLakeCenterX: new THREE.Uniform(LAKE_CENTER[0]),
    uLakeCenterZ: new THREE.Uniform(LAKE_CENTER[1]),
    uColorWaterShallow: new THREE.Uniform(new THREE.Color('#8dc4d1')),
    uColorWaterDeep: new THREE.Uniform(new THREE.Color('#255355')),
};

export const terrainMaterial = new CustomShaderMaterial({
    // MeshStandardMaterial props
    metalness: 0,
    roughness: 1,
    color: '#85d534',

    // Shader (CSM props)
    vertexShader: terrainVertexShader,
    fragmentShader: terrainFragmentShader,
    uniforms: terrainUniforms,
    baseMaterial: THREE.MeshStandardMaterial,
});
