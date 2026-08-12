import { createBarkMaterial, createCanopyMaterial } from './foliageMaterials';

// Bark colours are BirchFlat.glb's own White.001 and Black.001, converted from
// glTF's linear values to sRGB. The canopy is tinted by hand, not by the model.
const BARK_FINISH = { metalness: 0.4, roughness: 0.415 };

export const birchCanopyMaterial = createCanopyMaterial(
    '#A87834',
    './textures/foliage/birch.png',
);
export const birchBarkMaterial = createBarkMaterial('#c0c3bc', BARK_FINISH);
export const birchStripeMaterial = createBarkMaterial('#3b3b3b', BARK_FINISH);
