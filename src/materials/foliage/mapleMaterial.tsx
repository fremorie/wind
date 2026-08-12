import { createBarkMaterial, createCanopyMaterial } from './foliageMaterials';

// Bark colour is MapleFlat.glb's own Tree_Wood.001, converted from glTF's
// linear values to sRGB. The canopy is tinted by hand, not by the model.
export const mapleCanopyMaterial = createCanopyMaterial(
    '#A85E49',
    './textures/foliage/maple.png',
);
export const mapleBarkMaterial = createBarkMaterial('#785e30');
