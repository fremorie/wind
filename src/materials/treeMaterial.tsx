import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import treeVertexShader from '../shaders/tree/vertex.glsl';
import treeFragmentShader from '../shaders/tree/fragment.glsl';
import { GRID_TOTAL_WIDTH, LAKE_CENTER } from '../utils/constants';

export const treeUniforms = {
    uPlayerPosition: new THREE.Uniform(new THREE.Vector2()),

    // Road
    uRoadCenter: new THREE.Uniform(
        new THREE.Vector3(GRID_TOTAL_WIDTH / 2, 0, GRID_TOTAL_WIDTH / 2),
    ),

    // Lake
    uLakeCenterX: new THREE.Uniform(LAKE_CENTER[0]),
    uLakeCenterZ: new THREE.Uniform(LAKE_CENTER[1]),
};

export const treeDepthMaterial = new CustomShaderMaterial({
    // MeshdDepthMaterial props
    depthPacking: THREE.RGBADepthPacking,

    // Shader (CSM props)
    vertexShader: treeVertexShader,
    uniforms: treeUniforms,
    baseMaterial: THREE.MeshDepthMaterial,
});

export const treeMaterial = new CustomShaderMaterial({
    // MeshStandardMaterial props
    metalness: 0,
    roughness: 1,
    color: '#936d2f',

    // Shader (CSM props)
    vertexShader: treeVertexShader,
    fragmentShader: treeFragmentShader,
    uniforms: treeUniforms,
    baseMaterial: THREE.MeshStandardMaterial,
});
