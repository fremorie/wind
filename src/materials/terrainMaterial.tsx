import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import terrainVertexShader from '../shaders/terrain/vertex.glsl';
import terrainFragmentShader from '../shaders/terrain/fragment.glsl';
import {
    BEACH_WIDTH,
    CURVATURE,
    GRID_TOTAL_WIDTH,
    LAKE_CENTER,
    LAKE_DEPTH,
    LAKE_RADIUS,
} from '../utils/constants';

export const terrainUniforms = {
    uPositionFrequency: new THREE.Uniform(0.03),
    uStrength: new THREE.Uniform(10.0),

    uColorGrass: new THREE.Uniform(new THREE.Color('#3a521c')),
    uColorDirt: new THREE.Uniform(new THREE.Color('#c4bb82')),

    uPlayerPosition: new THREE.Uniform(new THREE.Vector2()),
    uCurvature: new THREE.Uniform(CURVATURE),

    // Road
    uRoadCenter: new THREE.Uniform(
        new THREE.Vector3(GRID_TOTAL_WIDTH / 2, 0, GRID_TOTAL_WIDTH / 2),
    ),
    uRoadWidth: new THREE.Uniform(12),
    uRoadAmplitude: new THREE.Uniform(3.46),
    uRoadWaviness: new THREE.Uniform(0.16),
    uRoadFalloff: new THREE.Uniform(5),

    // Lake
    uLakeCenterX: new THREE.Uniform(LAKE_CENTER[0]),
    uLakeCenterZ: new THREE.Uniform(LAKE_CENTER[1]),
    uLakeRadius: new THREE.Uniform(LAKE_RADIUS),
    uBeachWidth: new THREE.Uniform(BEACH_WIDTH),
    uLakeDepth: new THREE.Uniform(LAKE_DEPTH),
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
