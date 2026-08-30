# Rigging the player character — a plan

## 0. What's actually in Character.blend right now

I opened the file headlessly to check:

- Collection **`Collection`** → `Cube.001`: the real character. One joined mesh,
  3360 verts / 3336 faces, 4 materials (`skin`, `hair`, `shirt`, `Legs`),
  modifiers already applied.
- Collection **`backups`** → the 11 original pieces (`Cube.006…011`, `Vert.005…009`)
  with their `Skin` + `Subdivision` modifiers still live. Keep these, hide them.
- **No armature, no vertex groups, no shape keys, no actions.** You're starting rigging
  from zero.
- `Cube.001` has an unapplied rotation of −90° on Z and a scale of 0.708, and is
  **6.58 Blender units tall**. That's ~4× too big for a 1.7 m person. Both facts matter
  in step 2.

## 1. Answering your question: is legs-only rigging enough?

Almost. Two corrections:

1. **Yes, only the legs need to *animate*.** Torso lean, arms on the bars, head — all
   static. So don't build a spine chain, don't build fingers.
2. **But you still need one bone for everything that doesn't move.** A skinned mesh has
   to assign *every* vertex to some bone. If the armature only contains leg bones,
   automatic weights will hand the torso to whichever leg bone is nearest, and your
   character's chest will swing with her thigh. So the minimum rig is:

```
root            (at the floor, between the feet — the handle you position in three.js)
└── hips        (pelvis → chest; owns the entire upper body, arms, head)
    ├── thigh.L → shin.L → foot.L
    └── thigh.R → shin.R → foot.R
```

8 bones. That's a genuinely small rig, and every one of them earns its place.

**The steering trade-off, decide it now:** the handlebar rotates (`steeringRef` in
`Player.tsx` gets `rotation.y = steerAngle`). If the arms are rigid, the hands will
slide off the grips when steering. Options: (a) ignore it — at your camera distance and
steer angles it's likely invisible; (b) later, add `upperArm/lowerArm` bones and IK the
hands to the grips at runtime. Start with (a). Look at it in-game before spending a day
on (b).

## 2. Prep before you touch an armature

This is where beginners lose an afternoon. Do all of it *first*.

1. **Save As** `Character_rigged.blend`. Never rig in the tutorial file.
2. Exclude the `backups` collection from the view layer (uncheck it in the Outliner) so
   you can't accidentally select those meshes.
3. **Reshape the upper body while it's still an unrigged mesh.** Lean the torso forward,
   bring the arms down/forward toward where the bars are, tilt the head up. Edit Mode +
   proportional editing (`O`, scroll to size the falloff) is the tool. Doing this
   *before* skinning means the riding pose is baked into the mesh and the rig never has
   to hold it.
   - Leave the **legs standing straight** — bones will bend those.
4. **Get the scale and orientation right, then apply the transforms.**
   - Rotate/scale in Object Mode until she's ~1.7 units tall and facing the direction
     the bicycle faces.
   - Then `Ctrl+A → All Transforms`.
   - *Why it matters:* an armature parented to a mesh with unapplied scale deforms with
     that scale baked in, bone roll gets confusing, and glTF export can surprise you.
     Applied transforms = scale (1,1,1), rotation (0,0,0). Check the N-panel.
5. **Set the origin to the floor between the feet**: put the 3D cursor there
   (`Shift+S → Cursor to World Origin` after moving her, or snap it manually), then
   `Object → Set Origin → Origin to 3D Cursor`. The origin becomes the pivot you'll
   position in JSX — you want it somewhere meaningful, not floating in her stomach.
6. **Clean the mesh**: Edit Mode → `A` → `M → By Distance` (merges doubled verts) and
   `Shift+N` (recalculate normals). Automatic weights fails with
   *"Bone Heat Weighting: failed to find solution"* on non-manifold or doubled geometry,
   and this mesh came out of a Skin modifier, so it's a real risk.

**Optional but very useful:** `File → Import → glTF` the bicycle
(`public/models/bicycle/BicycleDecimated.glb`) into the same scene, scale it to match, and
place her on the saddle. Then your leg lengths, seat height and pedal reach are all
consistent with the real bike instead of guessed. You'll need the pedal positions in
step 5 anyway.

## 3. Building the armature

1. `Shift+A → Armature` with the 3D cursor at the pelvis. In Object Data Properties
   enable **Viewport Display → In Front** and turn on X-ray (`Alt+Z`) so you can see
   joints through the mesh.
2. Front ortho view (`Numpad 1`). Tab into Edit Mode.
3. Shape the first bone as `hips`: root (tail... start) at the pelvis, tip at the chest.
4. Select the pelvis end, `E` extrude down to the knee, `E` again to the ankle, `E` again
   forward to the toes. Rename `thigh.L`, `shin.L`, `foot.L` (the `.L` suffix is not
   cosmetic — Symmetrize and pose mirroring depend on it).
5. **Put the knee joint slightly forward** in side view (`Numpad 3`) so the leg is a
   shallow "<" and not a straight line. A perfectly straight chain has no bend
   preference, and any IK solver will pick a direction at random — classic backwards-knee
   bug.
6. Detach the thighs: select `thigh.L`, in Bone Properties → Relations, keep parent
   `hips` but **uncheck Connected** (the hip socket shouldn't drag the pelvis around).
7. Select the `.L` bones → `Armature → Symmetrize`. You now have `.R`.
8. Add the `root` bone at the floor, parent `hips` to it (unconnected).

## 4. Skinning

Select the mesh, then `Shift`-select the armature, `Ctrl+P → With Automatic Weights`.

What that actually did: created a vertex group per bone, filled them with heat-diffusion
weights, and added an **Armature modifier** to the mesh. Nothing magic — you can inspect
and edit every number.

Now test it, in Pose Mode, before moving on:

- Rotate `thigh.L` 90° forward. Does the hem of her shirt come with the leg? Does the
  opposite hip dent? Does the torso lean?
- Fix by either Weight Paint mode, or — usually faster and cleaner on a chunky low-poly
  character — Edit Mode: box-select the verts that belong to one bone, pick that vertex
  group in Object Data Properties, weight 1.0, **Assign**. Near-binary weights look fine
  on a stylized character and are far easier to reason about than a smooth heat map.
- `Alt+R` / `Alt+G` in Pose Mode clears the pose back to rest.

## 5. Making her pedal — pick one of three

Get the pedal geometry first: the crank centre (bottom bracket) position, and the crank
arm length. Read them off the imported bike in Blender; they're also implied by
`Bicycle/index.tsx`, where the pedals sit as children of the crank.

**A. Bake a looping IK cycle in Blender (recommended start).**
- Add an Empty at the bottom bracket (`crank`), and two more parented to it at ±crank
  length (`pedal.L` / `pedal.R`, 180° apart).
- On `shin.L`, add a **Bone Constraint → Inverse Kinematics**, target `pedal.L`,
  **Chain Length 2** (shin + thigh). Same for `.R`.
- Keyframe `crank` rotation 0° at frame 1 and 360° at frame 25, set both keys to
  **Linear** interpolation, and set the scene end frame so the loop closes.
- `Pose → Animation → Bake Action` with *Visual Keying* + *Clear Constraints* — glTF only
  exports plain bone keyframes, not constraints. Bake, then check the loop still looks
  right.
- In three.js, don't just `play()` the clip: drive it from the crank angle you already
  compute in `Player.tsx`, so the legs stay locked to the wheels at every speed and
  freeze when she stops. Roughly:
  ```
  action.play(); action.paused = true
  action.time = fract(crankAngle / 2π) * clip.duration
  ```
  `Rabbit.tsx` is your working reference for the `useGLTF` + `useAnimations` half.
- *Pros:* no runtime math, art-directable, you learn IK and baking. *Cons:* the cycle is
  baked for one seat height and crank radius; change the bike and you re-bake.

**B. Two-bone IK at runtime in three.js.**
You already have `leftPedalRef` / `rightPedalRef` in the scene graph. Read their world
positions each frame, convert into the character's local space
(`worldToLocal`), and solve thigh/shin angles with the law of cosines — a closed-form
2-bone solve, maybe 20 lines. *Pros:* feet are always exactly on the pedals, adapts free
to any bike change, nothing to re-export. *Cons:* you manage bone quaternions and bone
space yourself, and foot orientation needs a separate decision.

**C. No skinning at all.** Cut the legs into thigh/shin/foot objects, parent them into a
hierarchy, rotate the objects — exactly the pattern the bicycle crank already uses.
*Pros:* zero new concepts. *Cons:* your mesh is one smooth joined body, so you'd be
re-cutting it and living with seams at the joints. Only worth it if you decide you like
the separated-limbs look.

Do **A** now, **B** later if the feet visibly float.

## 6. Export and wire-up

`File → Export → glTF 2.0 (.glb)`:
- **Include** → Selected Objects (mesh + armature only; `backups` stays out).
- **Data → Mesh** → Apply Modifiers.
- **Data → Armature** → uncheck *Add Leaf Bones*; check *Export Deformation Bones Only*.
- **Animation** → on, with sampling/baking, and name the action something you'll
  recognise (the rabbit clip is `'Bunny|Bunny_walk'`).
- Y-up stays on — the exporter does the Blender Z-up → glTF Y-up conversion for you
  (remember: `blender (x, y, z) → three (x, z, −y)`).

Then `npx gltfjsx model.glb` to scaffold the component, the way
`src/components/Bicycle/index.tsx` was made. In `Player.tsx` the character becomes a
sibling of `<Bicycle>` inside the player group. Note that the bike is rendered with
`rotation-y={-Math.PI/2}` and `scale={0.8}` — if you match the bike's own axis convention
in Blender, you can apply the same rotation to the character and they'll agree.

No shader work needed: the player sits at the centre of the curved world, so unlike the
rabbit it takes no `curveOffset`, and the bike uses its own glTF materials.

## 7. Order of operations, condensed

1. Save As a working copy; hide `backups`.
2. Reshape the upper body into the riding pose (mesh edit, legs left straight).
3. Scale to ~1.7, orient, `Ctrl+A` All Transforms, origin to the floor.
4. Merge by distance, recalc normals.
5. Build the 8-bone armature, knees pre-bent.
6. `Ctrl+P` Automatic Weights → test in Pose Mode → fix weights.
7. Import bike, add crank + pedal empties, IK constraints, bake the cycle.
8. Export .glb, `gltfjsx`, drive `action.time` from `crankAngle`.

## 8. The five traps most likely to bite you

- Unapplied scale/rotation before parenting → weird deformation and export surprises.
- Perfectly straight leg chain → IK bends the knee backwards.
- Automatic weights error → doubled verts / non-manifold geometry; merge by distance.
- Forgetting to bake before export → the constraints are gone and the legs don't move.
- Exporting the whole file → the `backups` meshes ship to the browser with it.

## What to read

- Blender manual, *Rigging → Armatures → Bone Parenting* and *Skinning → Automatic Weights*.
- Blender manual, *Constraints → Tracking → Inverse Kinematics* (chain length, pole target).
- three.js docs: `SkinnedMesh`, `Skeleton`, `AnimationMixer`, `AnimationAction.time`.
- Grant Abbitt's rigging videos if you want it on video; his low-poly character series is
  the same lineage as the model you built.
