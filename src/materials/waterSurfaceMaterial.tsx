import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import waterSurfaceVertexShader from '../shaders/waterSurface/vertex.glsl';
// import waterSurfaceFragmentShader from '../shaders/waterSurface/fragment.glsl';
import { CURVATURE } from '../utils/constants';

export const waterSurfaceUniforms = {
    uPlayerPosition: new THREE.Uniform(new THREE.Vector2()),
    uCurvature: new THREE.Uniform(CURVATURE),
};

export const waterSurfaceDepthMaterial = new CustomShaderMaterial({
    // MeshDepthMaterial props
    depthPacking: THREE.RGBADepthPacking,

    // Shader (CSM props)
    vertexShader: waterSurfaceVertexShader,
    uniforms: waterSurfaceUniforms,
    baseMaterial: THREE.MeshDepthMaterial,
});

export const waterSurfaceMaterial = new CustomShaderMaterial({
    // MeshBasicMaterial props
    color: '#ffffff',
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,

    // Shader (CSM props)
    vertexShader: waterSurfaceVertexShader,
    //fragmentShader: waterSurfaceFragmentShader,
    uniforms: waterSurfaceUniforms,
    baseMaterial: THREE.MeshBasicMaterial,
});
