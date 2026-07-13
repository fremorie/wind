import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import bushVertexShader from '../shaders/bush/vertex.glsl';
import bushFragmentShader from '../shaders/bush/fragment.glsl';
import { GRID_TOTAL_WIDTH, LAKE_CENTER } from '../utils/constants';

export const bushUniforms = {
    uPlayerPosition: new THREE.Uniform(new THREE.Vector2()),

    // Road
    uRoadCenter: new THREE.Uniform(
        new THREE.Vector3(GRID_TOTAL_WIDTH / 2, 0, GRID_TOTAL_WIDTH / 2),
    ),

    // Lake
    uLakeCenterX: new THREE.Uniform(LAKE_CENTER[0]),
    uLakeCenterZ: new THREE.Uniform(LAKE_CENTER[1]),
};

export const bushDepthMaterial = new CustomShaderMaterial({
    // MeshdDepthMaterial props
    depthPacking: THREE.RGBADepthPacking,
    // Discard transparent leaf pixels so cast shadows are leaf-shaped, not solid
    // quads (alphaMap is assigned once the texture loads).
    alphaTest: 0.5,

    // Shader (CSM props)
    vertexShader: bushVertexShader,
    uniforms: bushUniforms,
    baseMaterial: THREE.MeshDepthMaterial,
});

export const bushMaterial = new CustomShaderMaterial({
    // MeshStandardMaterial props
    metalness: 0,
    roughness: 0.8,
    color: '#3a521c',
    // The leaf texture is a cutout mask: keep pixels above the threshold, drop the
    // rest. DoubleSide so both faces of each foliage plane are lit.
    alphaTest: 0.5,
    side: THREE.DoubleSide,

    // Shader (CSM props)
    vertexShader: bushVertexShader,
    fragmentShader: bushFragmentShader,
    uniforms: bushUniforms,
    baseMaterial: THREE.MeshStandardMaterial,
});
