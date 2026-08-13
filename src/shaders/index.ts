import { withWorldSettings } from './worldSettings';

import bushFragment from './bush/fragment.glsl';
import bushVertex from './bush/vertex.glsl';
import foliageFragment from './foliage/fragment.glsl';
import foliageVertex from './foliage/vertex.glsl';
import grassFragment from './grass/fragment.glsl';
import grassVertex from './grass/vertex.glsl';
import terrainFragment from './terrain/fragment.glsl';
import terrainVertex from './terrain/vertex.glsl';
import treeFragment from './tree/fragment.glsl';
import treeVertex from './tree/vertex.glsl';
import waterSurfaceFragment from './waterSurface/fragment.glsl';
import waterSurfaceVertex from './waterSurface/vertex.glsl';

// Every shader that draws the world, with WORLD_SETTINGS prepended, so none can
// be compiled without its constants. Materials import from here, not from the
// .glsl files.
//
// Shaders that read no constant today are prefixed too: unused ones cost
// nothing, and it keeps adding one later from breaking the compile.
//
// ./lake is absent on purpose -- Ground.tsx imports it directly.

export const bushVertexShader = withWorldSettings(bushVertex);
export const bushFragmentShader = withWorldSettings(bushFragment);

export const foliageVertexShader = withWorldSettings(foliageVertex);
export const foliageFragmentShader = withWorldSettings(foliageFragment);

export const grassVertexShader = withWorldSettings(grassVertex);
export const grassFragmentShader = withWorldSettings(grassFragment);

export const terrainVertexShader = withWorldSettings(terrainVertex);
export const terrainFragmentShader = withWorldSettings(terrainFragment);

export const treeVertexShader = withWorldSettings(treeVertex);
export const treeFragmentShader = withWorldSettings(treeFragment);

export const waterSurfaceVertexShader = withWorldSettings(waterSurfaceVertex);
export const waterSurfaceFragmentShader =
    withWorldSettings(waterSurfaceFragment);
