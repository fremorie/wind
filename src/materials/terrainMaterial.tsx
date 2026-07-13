import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import terrainVertexShader from '../shaders/terrain/vertex.glsl';
import terrainFragmentShader from '../shaders/terrain/fragment.glsl';
import { GRID_TOTAL_WIDTH, LAKE_CENTER } from '../utils/constants';

export const terrainUniforms = {
    uColorGrass: new THREE.Uniform(new THREE.Color('#3a521c')),
    uColorDirt: new THREE.Uniform(new THREE.Color('#c4bb82')),

    uPlayerPosition: new THREE.Uniform(new THREE.Vector2()),

    // Road
    uRoadCenter: new THREE.Uniform(
        new THREE.Vector3(GRID_TOTAL_WIDTH / 2, 0, GRID_TOTAL_WIDTH / 2),
    ),

    // Lake
    uLakeCenterX: new THREE.Uniform(LAKE_CENTER[0]),
    uLakeCenterZ: new THREE.Uniform(LAKE_CENTER[1]),
    uColorWaterShallow: new THREE.Uniform(new THREE.Color('#60cfd8')),
    uColorWaterDeep: new THREE.Uniform(new THREE.Color('#1c7d93')),
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
    roughness: 0.8,
    color: '#85d534',

    // Shader (CSM props)
    vertexShader: terrainVertexShader,
    fragmentShader: terrainFragmentShader,
    uniforms: terrainUniforms,
    baseMaterial: THREE.MeshStandardMaterial,
});
