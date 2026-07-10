import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import waterSurfaceVertexShader from '../shaders/waterSurface/vertex.glsl';
import waterSurfaceFragmentShader from '../shaders/waterSurface/fragment.glsl';
import {
    BEACH_WIDTH,
    CURVATURE,
    GRID_TOTAL_WIDTH,
    LAKE_CENTER,
    LAKE_DEPTH,
    LAKE_RADIUS,
} from '../utils/constants';

export const waterSurfaceUniforms = {
    // Water surface params
    uPlayerPosition: new THREE.Uniform(new THREE.Vector2()),
    uCurvature: new THREE.Uniform(CURVATURE),
    uFresnelPower: new THREE.Uniform(4.11),
    uFresnelStrength: new THREE.Uniform(0.79),
    uFresnelColor: new THREE.Uniform(new THREE.Color('#ffffff')),
    uTime: new THREE.Uniform(0),

    uPositionFrequency: new THREE.Uniform(0.03),
    uStrength: new THREE.Uniform(10.0),

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

    // Shader (CSM props)
    vertexShader: waterSurfaceVertexShader,
    fragmentShader: waterSurfaceFragmentShader,
    uniforms: waterSurfaceUniforms,
    baseMaterial: THREE.MeshBasicMaterial,
});
