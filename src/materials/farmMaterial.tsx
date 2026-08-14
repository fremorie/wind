import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import { farmVertexShader } from '../shaders';

export const farmUniforms = {
    uPlayerPosition: new THREE.Uniform(new THREE.Vector2()),
};

export const farmDepthMaterialMaterial = new CustomShaderMaterial({
    depthPacking: THREE.RGBADepthPacking,

    // Shader (CSM props)
    vertexShader: farmVertexShader,
    uniforms: farmUniforms,
    baseMaterial: THREE.MeshDepthMaterial,
});
