import CustomShaderMaterial, {
    type CSMProxy,
} from 'three-custom-shader-material/vanilla';
import * as THREE from 'three';

import {
    foliageFragmentShader,
    foliageVertexShader,
    treeVertexShader,
} from '../../shaders';
import { GRID_TOTAL_WIDTH, LAKE_CENTER } from '../../utils/constants';

// These textures are fixed assets with no React state behind them, so they are
// loaded here and owned by the materials. That keeps the components free of
// "assign the map once it arrives" effects, and means a material is complete
// the moment it is constructed.
const textureLoader = new THREE.TextureLoader();

// The wind reads the noise at each vertex's world position, which runs far
// outside 0..1, so it has to tile.
const perlinNoiseTexture = textureLoader.load(
    './textures/perlinNoise/perlin.png',
);
perlinNoiseTexture.wrapS = THREE.RepeatWrapping;
perlinNoiseTexture.wrapT = THREE.RepeatWrapping;

// Every v2 tree species shares one set of uniforms: the wind and the world are
// the same for all of them, so uTime (advanced in TreesV2) and uPlayerPosition
// (refreshed in Player) only have to be written once per frame.
export const foliageUniforms = {
    uTime: new THREE.Uniform(0),
    uPerlinNoiseTexture: new THREE.Uniform(perlinNoiseTexture),

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

// Both depth materials are species-agnostic: the shadow pass only needs the
// vertex displacement, and that is identical for every canopy and every trunk.
export const canopyDepthMaterial = new CustomShaderMaterial({
    // MeshDepthMaterial props
    depthPacking: THREE.RGBADepthPacking,

    // Shader (CSM props)
    vertexShader: foliageVertexShader,
    uniforms: foliageUniforms,
    baseMaterial: THREE.MeshDepthMaterial,
});

export const barkDepthMaterial = new CustomShaderMaterial({
    // MeshDepthMaterial props
    depthPacking: THREE.RGBADepthPacking,

    // Shader (CSM props)
    vertexShader: treeVertexShader,
    uniforms: foliageUniforms,
    baseMaterial: THREE.MeshDepthMaterial,
});

/**
 * Leaves: swayed by the wind shader, and cut to leaf shapes by `leafMask` --
 * the texture is a cutout mask, so pixels above alphaTest are kept and the rest
 * are dropped.
 */
export function createCanopyMaterial(
    color: string,
    tint: string,
    leafMask: string,
) {
    return new CustomShaderMaterial({
        // MeshStandardMaterial props
        metalness: 0,
        roughness: 0.8,
        color,
        alphaMap: textureLoader.load(leafMask),
        alphaTest: 0.5,
        shadowSide: THREE.DoubleSide,

        // Shader (CSM props)
        vertexShader: foliageVertexShader,
        fragmentShader: foliageFragmentShader,
        uniforms: {
            ...foliageUniforms,
            uTintColor: new THREE.Uniform(new THREE.Color(tint)),
        },
        baseMaterial: THREE.MeshStandardMaterial,
    }) as CSMProxy<typeof THREE.MeshStandardMaterial>;
}

/**
 * Trunks and branches: no sway, no cutout, so they only need the grounding the
 * v1 tree shader already does. Defaults match glTF's own (metalness 0,
 * roughness 1), so a species only passes what its .glb actually overrides.
 */
export function createBarkMaterial(
    color: string,
    { metalness = 0, roughness = 1 } = {},
) {
    return new CustomShaderMaterial({
        // MeshStandardMaterial props
        metalness,
        roughness,
        color,

        // Shader (CSM props)
        vertexShader: treeVertexShader,
        uniforms: foliageUniforms,
        baseMaterial: THREE.MeshStandardMaterial,
    }) as CSMProxy<typeof THREE.MeshStandardMaterial>;
}
