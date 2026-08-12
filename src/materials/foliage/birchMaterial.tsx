import CustomShaderMaterial, {
    type CSMProxy,
} from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import foliageVertexShader from '../../shaders/foliage/vertex.glsl';
import treeVertexShader from '../../shaders/tree/vertex.glsl';
import { GRID_TOTAL_WIDTH, LAKE_CENTER } from '../../utils/constants';

// Shared by all four birch materials, so the per-frame uPlayerPosition update in
// Player.tsx drives the canopy, the bark and both depth passes at once.
export const birchUniforms = {
    uTime: new THREE.Uniform(0),
    uPerlinNoiseTexture: new THREE.Uniform<THREE.Texture | null>(null),

    // Read by the grounding include. Only uPlayerPosition changes.
    uPlayerPosition: new THREE.Uniform(new THREE.Vector2()),

    // Road
    uRoadCenter: new THREE.Uniform(
        new THREE.Vector3(GRID_TOTAL_WIDTH / 2, 0, GRID_TOTAL_WIDTH / 2),
    ),

    // Lake
    uLakeCenterX: new THREE.Uniform(LAKE_CENTER[0]),
    uLakeCenterZ: new THREE.Uniform(LAKE_CENTER[1]),
};

export const birchFoliageDepthMaterial = new CustomShaderMaterial({
    // MeshDepthMaterial props
    depthPacking: THREE.RGBADepthPacking,

    // Shader (CSM props)
    vertexShader: foliageVertexShader,
    uniforms: birchUniforms,
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
    uniforms: birchUniforms,
    baseMaterial: THREE.MeshStandardMaterial,
}) as CSMProxy<typeof THREE.MeshStandardMaterial>;

// The trunk doesn't sway, so it only needs the grounding -- which is exactly
// what the v1 tree shader already does. Colours are the GLB's White.001 and
// Black.001, converted from glTF's linear values to sRGB hex.
export const birchBarkDepthMaterial = new CustomShaderMaterial({
    // MeshDepthMaterial props
    depthPacking: THREE.RGBADepthPacking,

    // Shader (CSM props)
    vertexShader: treeVertexShader,
    uniforms: birchUniforms,
    baseMaterial: THREE.MeshDepthMaterial,
});

export const birchBarkMaterial = new CustomShaderMaterial({
    // MeshStandardMaterial props
    metalness: 0.4,
    roughness: 0.415,
    color: '#c0c3bc',

    // Shader (CSM props)
    vertexShader: treeVertexShader,
    uniforms: birchUniforms,
    baseMaterial: THREE.MeshStandardMaterial,
}) as CSMProxy<typeof THREE.MeshStandardMaterial>;

export const birchBarkDarkMaterial = new CustomShaderMaterial({
    // MeshStandardMaterial props
    metalness: 0.4,
    roughness: 0.415,
    color: '#3b3b3b',

    // Shader (CSM props)
    vertexShader: treeVertexShader,
    uniforms: birchUniforms,
    baseMaterial: THREE.MeshStandardMaterial,
}) as CSMProxy<typeof THREE.MeshStandardMaterial>;
