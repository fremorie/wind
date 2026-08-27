# Sunday ride

An endless bike ride across a procedurally generated landscape — grass, trees, a lake, a river and a wind farm — built with React Three Fiber and custom GLSL shaders.

Live: https://fremorie.github.io/wind/

<img width="5005" height="2643" alt="Screenshot from 2026-08-18 22-42-57" src="https://github.com/user-attachments/assets/3cdc1683-14a2-4626-9a72-ebd1bf73fcb5" />


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

Controls: **WASD** / arrow keys to ride, **Shift** to sprint, or drag the on-screen joystick on touch devices. The camera follows the bicycle on its own — there are no orbit controls.

Debug tools are behind the URL hash: load the page with `#debug` (`src/hooks/useDebug.ts`) to get the [Leva](https://github.com/pmndrs/leva) panels for terrain, sky, water and foliage parameters, [r3f-perf](https://github.com/utsuboco/r3f-perf) frame stats and the light/axes helpers. Without it the screen is just the ride.

## How it works

**The world is infinite by recycling, not by generating.** A fixed grid of terrain chunks (`GRID_SIZE_X × GRID_SIZE_Z`, see `src/utils/constants.ts`) follows the player: when a chunk falls too far behind, it wraps around to the front (`src/utils/game.ts`, `src/components/Terrain/Terrain.tsx`). Trees recycle the same way, inside a player-centred window one wrap period wide (`src/utils/foliageField.ts`), so the scatter tiles seamlessly. Nothing is ever allocated mid-ride.

**Terrain height is a function, not a mesh.** Elevation comes from simplex noise plus a road carve and a lake basin. It exists twice:

- on the GPU, in `src/shaders/includes/elevation.glsl`, which displaces the vertices actually drawn;
- on the CPU, in `src/utils/elevation.ts`, which places things that need to sit on the ground — the turbines, the camera, and the bike itself, which reads its height and its pitch from it every frame.

The two copies share one set of constants rather than mirroring them by hand. `WORLD_SETTINGS` in `src/utils/constants.ts` is the only copy; `src/shaders/worldSettings.ts` compiles it into `const float` declarations and `src/shaders/index.ts` prepends them to every world shader, which is why materials import shaders from `shaders/index.ts` and not from the `.glsl` files. `src/shaders/worldSettings.test.ts` checks the generated text, because a bad constant only shows up as a black screen at runtime.

**The bike is solved, not simulated.** There is no physics engine. Position and heading come from a kinematic bicycle model in `src/utils/player.ts`, stepped once per frame from `src/components/Player/Player.tsx`. Input sets a target heading; the steering angle is the wrapped error between that and the current heading, clamped to a steering lock. Yaw is integrated from it — `yawRate = speed · tan(steer) / wheelbase` — which is what makes the bike arc through a turn instead of pivoting, and what stops it turning at all when stationary. Speed ramps toward its target at a fixed acceleration and falls off faster than it builds, so pulling away and slowing down both take time. Height and pitch are read straight from the CPU elevation function, sampling ahead of and behind the bike for the slope.

**The bicycle model is rigged by hand** (`src/components/Bicycle/index.tsx`). The fork and bars pivot about the steerer axis with the front wheel parented to them so it swings with the fork; both wheels roll at `distance / radius`; the pedals hang off the crank with an equal counter-rotation, which keeps them level while they orbit. All of it is driven from two numbers — the steering angle and the accumulated wheel spin.

**The horizon curves.** `curveWorld.glsl` bends the world down quadratically with distance from the player, so the landscape falls away like a small planet. Every displaced material applies it, which is why they all take a `uPlayerPosition` uniform (set once per frame from `src/components/Player/Player.tsx`).

**Grass and trees are instanced** and animated in the vertex shader — wind sway, curvature and terrain displacement all happen on the GPU. Materials are built with [three-custom-shader-material](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial) so they keep Three.js lighting while injecting custom vertex work.

## Layout

```
src/
  Experience/     scene root, sky and lighting
  components/     one folder per world entity (Terrain, GrassV2, Foliage, WindFarm, WaterSurface, Player, Bicycle, Joystick, …)
  materials/      CustomShaderMaterial instances, shared as module singletons
  shaders/        GLSL, with reusable chunks in shaders/includes/ (+ the generated world settings)
  utils/          elevation, noise, instancing and placement math (+ tests)
  hooks/          small shared hooks (useDebug)
  store/          zustand store holding the player position and joystick input
public/           models, textures and fonts shipped with the build
resources/        source art (Blender files, bakes) that is not shipped
```

## Stack

React 19 (with the React Compiler), TypeScript, Vite, Three.js, `@react-three/fiber` + `drei`, `vite-plugin-glsl`, zustand, leva, seedrandom, Vitest.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `dist/` to GitHub Pages. The Vite `base` is set to `/wind/` to match the Pages path.

## Credits

Third-party assets keep their own attribution files next to them under `public/`:

**Models** — three by [Quaternius](https://poly.pizza/u/Quaternius), via [Poly Pizza](https://poly.pizza):

| Model | Link | Used in |
| --- | --- | --- |
| Birch tree dead | [RieYOsjDj8](https://poly.pizza/m/RieYOsjDj8) | `public/models/trees/` |
| Tree | [b0boebSV1r](https://poly.pizza/m/b0boebSV1r) | `public/models/trees/` |
| Tree (another) | [1BkD9JnKrE](https://poly.pizza/m/1BkD9JnKrE) | `public/models/trees/` |

That folder keeps its own `README.md` with the same attribution next to the `.glb`. Everything else under `public/` is original work: the bicycle, along with every texture and image.

**Fonts** — Playpen Sans and Outfit, both under the SIL Open Font License; the licence text is in the `OFL.txt` beside each one under `public/fonts/`.

Code is MIT licensed (see `LICENSE`); asset licenses are as attributed above.
