# Wind

An endless bike ride across a procedurally generated landscape — grass, trees, a lake, and a wind farm — built with React Three Fiber and custom GLSL shaders.

Live: https://fremorie.github.io/wind/

## Running it

Requires Node (see `.nvmrc`).

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run lint` | ESLint over the repo |
| `npm run prettier` | Format `src/` |

Controls: **WASD** / arrow keys to ride. The camera follows the bicycle; drag to orbit. [Leva](https://github.com/pmndrs/leva) panels expose terrain, sky, water and foliage parameters at runtime, and [r3f-perf](https://github.com/utsuboco/r3f-perf) shows frame stats in the corner.

## How it works

**The world is infinite by recycling, not by generating.** A fixed grid of terrain chunks (`GRID_SIZE_X × GRID_SIZE_Z`, see `src/utils/constants.ts`) follows the player: when a chunk falls too far behind, it wraps around to the front (`src/utils/game.ts`, `src/components/Terrain/Terrain.tsx`). Trees and bushes recycle the same way. Nothing is ever allocated mid-ride.

**Terrain height is a function, not a mesh.** Elevation comes from simplex noise plus a road carve and a lake basin. It exists twice:

- on the GPU, in `src/shaders/includes/elevation.glsl`, which displaces the vertices actually drawn;
- on the CPU, in `src/utils/elevation.ts`, which places things that need to sit on the ground — the player, the cow, the sign.

The two copies must agree or objects float. `src/utils/glslParity.test.ts` guards the shared constants by parsing `worldSettings.glsl` and comparing it against `constants.ts` — that's what the `/* Mirrored from GLSL! */` comment is asking for.

**The horizon curves.** `curveWorld.glsl` bends the world down quadratically with distance from the player, so the landscape falls away like a small planet. Every displaced material applies it, which is why they all take a `uPlayerPosition` uniform (updated once per frame in `Player.tsx`).

**Grass, trees and bushes are instanced** and animated in the vertex shader — wind sway, curvature and terrain displacement all happen on the GPU. Materials are built with [three-custom-shader-material](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial) so they keep Three.js lighting while injecting custom vertex work.

## Layout

```
src/
  Experience/     scene root, sky and lighting
  components/     one folder per world entity (Terrain, Grass, Foliage, WindFarm, Player, …)
  materials/      CustomShaderMaterial instances, shared as module singletons
  shaders/        GLSL, with reusable chunks in shaders/includes/
  utils/          elevation, noise, instancing and placement math (+ tests)
  store/          zustand store holding the player position
public/           models, textures and fonts
```

## Stack

React 19 (with the React Compiler), TypeScript, Vite, Three.js, `@react-three/fiber` + `drei`, `vite-plugin-glsl`, zustand, leva, Vitest.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `dist/` to GitHub Pages. The Vite `base` is set to `/wind/` to match the Pages path.

## Credits

Third-party assets keep their own attribution files next to them under `public/`:

- Bicycle by Poly by Google, [CC-BY], via [Poly Pizza](https://poly.pizza/m/5pBoRkAPQk6)
- Cow and construction sign — see `public/models/*/README.md`
- Bark texture — see `public/textures/wood/ATTRIBUTION.md`
- Rubik Microbe font — SIL Open Font License, see `public/fonts/Rubik_Microbe/OFL.txt`

Code is MIT licensed (see `LICENSE`); asset licenses are as attributed above.
