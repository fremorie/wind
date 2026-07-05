import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import terrainVertexShader from '../shaders/terrain/vertex.glsl';
import terrainFragmentShader from '../shaders/terrain/fragment.glsl';

export const terrainUniforms = {
    uPositionFrequency: new THREE.Uniform(0.05),
    uStrength: new THREE.Uniform(10.0),
    uWarpFrequency: new THREE.Uniform(8),
    uWarpStrength: new THREE.Uniform(0.41),
    uTime: new THREE.Uniform(0),

    uColorWaterDeep: new THREE.Uniform(new THREE.Color('#002b3d')),
    uColorWaterSurface: new THREE.Uniform(new THREE.Color('#66a8ff')),
    uColorSand: new THREE.Uniform(new THREE.Color('#ffe894')),
    uColorGrass: new THREE.Uniform(new THREE.Color('#85d534')),
    uColorSnow: new THREE.Uniform(new THREE.Color('#ffffff')),
    uColorRock: new THREE.Uniform(new THREE.Color('#bfbd8d')),
};

export const terrainDepthMaterial = new CustomShaderMaterial({
    // MeshdDepthMaterial props
    depthPacking: THREE.RGBADepthPacking,

    // Shader (CSM props)
    vertexShader: terrainVertexShader,
    uniforms: terrainUniforms,
    baseMaterial: THREE.MeshDepthMaterial,
});

export const terrainMaterial = new CustomShaderMaterial({
    // MeshStandardMaterial props
    metalness: 0,
    roughness: 0.5,
    color: '#85d534',

    // Shader (CSM props)
    vertexShader: terrainVertexShader,
    fragmentShader: terrainFragmentShader,
    uniforms: terrainUniforms,
    baseMaterial: THREE.MeshStandardMaterial,
});
