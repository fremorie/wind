import { withWorldSettings } from './worldSettings';

import foliageFragment from './foliage/fragment.glsl';
import foliageVertex from './foliage/vertex.glsl';
import grassFragment from './grass/fragment.glsl';
import grassVertex from './grass/vertex.glsl';
import terrainFragment from './terrain/fragment.glsl';
import terrainVertex from './terrain/vertex.glsl';
import treeVertex from './tree/vertex.glsl';
import waterSurfaceFragment from './waterSurface/fragment.glsl';
import waterSurfaceVertex from './waterSurface/vertex.glsl';
import grassV2Vertex from './grassV2/vertex.glsl';
import grassV2Fragment from './grassV2/fragment.glsl';
import grassTrailVertex from './grassTrail/vertex.glsl';
import grassTrailFragment from './grassTrail/fragment.glsl';
import riverSurfaceFragment from './riverSurface/fragment.glsl';
import riverSurfaceVertex from './riverSurface/vertex.glsl';

// Every shader that draws the world, with WORLD_SETTINGS prepended, so none can
// be compiled without its constants. Materials import from here, not from the
// .glsl files.
//
// Shaders that read no constant today are prefixed too: unused ones cost
// nothing, and it keeps adding one later from breaking the compile.

export const foliageVertexShader = withWorldSettings(foliageVertex);
export const foliageFragmentShader = withWorldSettings(foliageFragment);

export const grassVertexShader = withWorldSettings(grassVertex);
export const grassFragmentShader = withWorldSettings(grassFragment);

export const terrainVertexShader = withWorldSettings(terrainVertex);
export const terrainFragmentShader = withWorldSettings(terrainFragment);

export const treeVertexShader = withWorldSettings(treeVertex);

export const waterSurfaceVertexShader = withWorldSettings(waterSurfaceVertex);
export const waterSurfaceFragmentShader =
    withWorldSettings(waterSurfaceFragment);

export const grassV2FragmentShader = withWorldSettings(grassV2Fragment);
export const grassV2VertexShader = withWorldSettings(grassV2Vertex);

export const grassTrailVertexShader = withWorldSettings(grassTrailVertex);
export const grassTrailFragmentShader = withWorldSettings(grassTrailFragment);

export const riverSurfaceVertexShader = withWorldSettings(riverSurfaceVertex);
export const riverSurfaceFragmentShader =
    withWorldSettings(riverSurfaceFragment);
