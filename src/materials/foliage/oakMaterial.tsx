import { createBarkMaterial, createCanopyMaterial } from './foliageMaterials';

// Bark colour is OakFlat.glb's own Tree_Wood, converted from glTF's linear
// values to sRGB. The canopy is tinted by hand, not by the model.
export const oakCanopyMaterial = createCanopyMaterial(
    '#597932',
    '#9c882f',
    './textures/foliage/oak.png',
);
export const oakBarkMaterial = createBarkMaterial('#90774d', {
    metalness: 0.1,
    roughness: 0.415,
});
