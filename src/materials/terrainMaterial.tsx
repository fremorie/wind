import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import { terrainFragmentShader, terrainVertexShader } from '../shaders';
import { GRID_TOTAL_WIDTH, LAKE_CENTER } from '../utils/constants';

export const terrainUniforms = {
    uColorGrass: new THREE.Uniform(new THREE.Color('#2B3D13')),
    uColorDirt: new THREE.Uniform(new THREE.Color('#ada364')),

    uGrassTipColor: new THREE.Uniform(new THREE.Color('#86905e')),
    uGrassBaseColor: new THREE.Uniform(new THREE.Color('#1a2e03')),

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

export const terrainMaterial = new CustomShaderMaterial({
    // MeshStandardMaterial props
    metalness: 0,
    roughness: 1,
    color: '#85d534',

    // Shader (CSM props)
    vertexShader: terrainVertexShader,
    fragmentShader: terrainFragmentShader,
    uniforms: terrainUniforms,
    baseMaterial: THREE.MeshStandardMaterial,
});
