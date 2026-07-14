import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import waterSurfaceVertexShader from '../shaders/waterSurface/vertex.glsl';
import waterSurfaceFragmentShader from '../shaders/waterSurface/fragment.glsl';
import { GRID_TOTAL_WIDTH, LAKE_CENTER } from '../utils/constants';

export const waterSurfaceUniforms = {
    // Water surface params
    uPlayerPosition: new THREE.Uniform(new THREE.Vector2()),
    uFresnelPower: new THREE.Uniform(7.22),
    uFresnelStrength: new THREE.Uniform(0.79),
    uFresnelColor: new THREE.Uniform(new THREE.Color('#ffffff')),
    uTime: new THREE.Uniform(0),

    // Road
    uRoadCenter: new THREE.Uniform(
        new THREE.Vector3(GRID_TOTAL_WIDTH / 2, 0, GRID_TOTAL_WIDTH / 2),
    ),

    // Lake
    uLakeCenterX: new THREE.Uniform(LAKE_CENTER[0]),
    uLakeCenterZ: new THREE.Uniform(LAKE_CENTER[1]),

    // Match the colours the terrain paints so surface and floor read as one body
    uColorWaterShallow: new THREE.Uniform(new THREE.Color('#60cfd8')),
    uColorWaterDeep: new THREE.Uniform(new THREE.Color('#1c7d93')),
    uOpacityDeep: new THREE.Uniform(0.85),
};

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
