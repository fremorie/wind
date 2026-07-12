import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import bushVertexShader from '../shaders/bush/vertex.glsl';
import bushFragmentShader from '../shaders/bush/fragment.glsl';
import {
    BEACH_WIDTH,
    CURVATURE,
    GRID_TOTAL_WIDTH,
    LAKE_CENTER,
    LAKE_DEPTH,
    LAKE_RADIUS,
    LAKE_SURFACE_LEVEL,
} from '../utils/constants';

export const bushUniforms = {
    uPositionFrequency: new THREE.Uniform(0.03),
    uStrength: new THREE.Uniform(10.0),

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
    uColorWaterShallow: new THREE.Uniform(new THREE.Color('#60cfd8')),
    uColorWaterDeep: new THREE.Uniform(new THREE.Color('#1c7d93')),
    uLakeSurfaceLevel: new THREE.Uniform(LAKE_SURFACE_LEVEL),
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
