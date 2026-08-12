import CustomShaderMaterial, {
    type CSMProxy,
} from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import foliageVertexShader from '../../shaders/foliage/vertex.glsl';

export const uniforms = {
    uTime: new THREE.Uniform(0),
    uPerlinNoiseTexture: new THREE.Uniform(null),
};

export const birchFoliageDepthMaterial = new CustomShaderMaterial({
    // MeshDepthMaterial props
    depthPacking: THREE.RGBADepthPacking,

    // Shader (CSM props)
    vertexShader: foliageVertexShader,
    uniforms,
    baseMaterial: THREE.MeshDepthMaterial,
});

export const birchFoliageMaterial = new CustomShaderMaterial({
    // MeshStandardMaterial props
    metalness: 0,
    roughness: 0.8,
    color: '#A87834',
    alphaTest: 0.5,
    shadowSide: THREE.DoubleSide,

    // Shader (CSM props)
    vertexShader: foliageVertexShader,
    uniforms,
    baseMaterial: THREE.MeshStandardMaterial,
}) as CSMProxy<typeof THREE.MeshStandardMaterial>;
