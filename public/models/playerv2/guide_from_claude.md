# Making the rider actually ride the bike

Written against the current state of `Character_rigged.blend` and
`armature_character_and_bicycle.glb` (both inspected headlessly on 2026-08-30).
Read section 0 and 1 before you touch anything — they change what you do in 2–6.

---

## 0. What is in the files right now

### `Character_rigged.blend` — the bind is healthy

| Thing | State |
|---|---|
| `REAL_ARMATURE` | 33 `mixamorig:` bones, object scale `0.01`, rotation `(90°, 0, 90°)` — normal Mixamo import values |
| `Body.002` | child of the armature, **Armature modifier present**, 28 vertex groups, **0 unweighted vertices** |
| Pose | T-pose. Only `Hips` carries a pose rotation (90°, you turned her to face +X) |
| Constraints | **none** — no IK anywhere yet |
| Empties | **none** — no IK targets yet |
| Actions | one orphan `Armature|mixamo.com|Layer0`, not assigned to the armature |
| Bike | `Bicycle` collection, 7 objects, all at the origin, **pedals are NOT parented to `PedalRotor`** |

So the skinning work is done and done correctly. What is missing is the *pose*, the
*mechanism* (IK), and the *export*.

### `armature_character_and_bicycle.glb` — the export is broken

The file contains 42 nodes, 8 meshes… and:

```
skins:      []      <-- no skinning
animations: []      <-- no animation
```

A glTF with no `skins` means the character mesh is a **static lump** and the 33 bone nodes
next to it are decorative. Dropped into three.js it renders a frozen T-pose. The Blender
side is fine, so this is purely an export-settings problem — see section 6. It also
contains all 7 bicycle meshes, which the game already loads separately from
`BicycleDecimated.glb`; the final export should be the character only.

---

## 1. Measure first: she does not fit the bike

This is the part that will waste your weekend if you skip it. I measured the world-space
bone positions against the bike geometry:

| Measurement | Value (Blender units) |
|---|---|
| Leg length, hip joint → ankle (`LeftUpLeg` head → `LeftFoot` head) | **2.05** |
| Arm length, shoulder → wrist (`LeftArm` head → `LeftHand` head) | **1.43** |
| Saddle top (`Frame` highest verts, around x = −1.10) | z = **2.02** |
| Crank centre (`PedalRotor`) | (−0.279, 0.002, −0.109) |
| Crank radius | **0.404** |
| Lowest pedal position | z = **−0.512** |
| Grips (`HandleBar`, \|y\| > 1.0) | x ≈ 1.6, y = ±1.24, z ≈ 2.6 |

Now the arithmetic that matters:

* **Feet.** Sitting on the saddle, her hip joint is at roughly z = 2.15. The pedal at the
  bottom of the stroke is at z = −0.512, about 0.3 forward. Straight-line distance:
  **≈ 2.69**. Even allowing for the ankle sitting behind and above the pedal
  (ball of the foot on the axle), you need **≈ 2.55**. You have **2.05**.
* **Hands.** Even with the torso leaned ~50° forward, the shoulder ends up ~1.9 from the
  grip. You have **1.43**.

Both are short by roughly the same factor, ~1.3. That is not a coincidence: this is a
stylised character whose legs are 34% of her height (a real human is ~45%), sitting on a
cartoon bike.

**Options, pick one before rigging:**

1. **Scale the whole character up ~1.3×.** Select `REAL_ARMATURE` in Object Mode, `S`,
   type `1.3`, `Enter` — the mesh is its child, so it follows. Cheapest, reversible,
   both problems solved at once. Cost: she becomes ~8 units tall against a bike whose
   wheels are 2.76 across, so she'll read as a tall adult. Look at it from the game camera
   before judging.
2. **Lengthen only the legs.** In Pose Mode, scale `LeftUpLeg`/`LeftLeg` (and right) along
   their local Y by ~1.3. Keeps the head and torso the size you designed. Cost: it is a
   pose, so it must survive into the bake (it will — Visual Keying bakes scale too), and
   long-legged proportions on a stylised character can look odd.
3. **Move the bike, not the character.** Don't. `BicycleDecimated.glb` is shared with the
   running game; changing it invalidates every constant in `Bicycle/index.tsx`.

I'd start with (1), eyeball it in Blender against the saddle, and only reach for (2) if
her head looks comically large. **Whatever you pick, redo the reach check afterwards** —
put the 3D cursor on the low pedal and use `N` → Item to read distances.

---

## 2. Pose the static half by hand

The legs will be driven by IK. Everything else — hips, spine, shoulders, arms, hands,
neck, head — is posed **once**, by hand, and never moves again.

In Pose Mode, `R` to rotate bones (never `G` — translating pose bones detaches them from
their parent visually and will bite you later):

1. `Hips` — move (this one *may* be translated, it is the root) so the pelvis sits on the
   saddle at x ≈ −1.1, z ≈ 2.1.
2. `Spine`, `Spine1`, `Spine2` — split the forward lean across all three, ~15–20° each.
   Leaning at one joint looks like a hinge, not a spine.
3. `LeftShoulder`/`LeftArm`/`LeftForeArm` — bring the hand to the grip at (1.6, 1.24, 2.6).
   Do it in a front and a side view alternately; it is nearly impossible from one angle.
4. `LeftHand` + the index-finger chain — wrap onto the bar. Mixamo only gave you one finger
   chain per hand, so don't expect a real grip; get the wrist angle right and it reads fine.
5. `Neck`, `Head` — with the torso leaned forward, the head must tilt *back* to look at the
   road, otherwise she stares at the front tyre.

Trick worth knowing: pose the left arm, then use **Pose → Copy Pose** / **Paste Pose
Flipped** to mirror it to the right side.

Sanity check: view from the front (`Numpad 1`) — hands and feet should be symmetrical
about y = 0, and her knees shouldn't pass through the frame's top tube.

---

## 3. Wire the legs to the pedals with IK

### The idea

An **IK constraint** goes on the *last bone of the chain* (the shin), points at a
**target**, and Blender solves the rotations of the bone plus however many parents you
declare in **Chain Length**. Set the target to something attached to the pedal, and the
foot follows the pedal for free — you never keyframe a leg again.

### Do it

1. **Parent the pedals to the crank.** They aren't yet. Select `LeftPedal`, shift-select
   `PedalRotor`, `Ctrl+P` → **Object (Keep Transform)**. Same for `RightPedal`.
2. **Keep the pedals level.** Real pedals hang level; the game already does this by
   counter-rotating them (`Player.tsx`: `leftPedalRef.current.rotation.z = -crankAngle`).
   Reproduce it in Blender with a **Limit Rotation** constraint on each pedal: tick X, Y, Z
   with min = max = 0 and set **Owner: World**. Now they orbit but never tilt.
3. **Add the foot targets.** `Shift+A` → Empty → Plain Axes, size ~0.3, named `IK_Foot.L`.
   Place it where the *ankle joint* belongs when the ball of the foot rests on the pedal:
   with a flat foot her ankle sits about **0.54 above the sole and 0.60 behind the ball**
   (that is her actual `LeftFoot` bone offset — multiply by whatever you scaled in step 1).
   Then parent it to `LeftPedal` with `Ctrl+P` → **Object (Keep Transform)**. Repeat right.
4. **Pre-bend the knees.** Before adding the constraint, rotate each shin a few degrees so
   the knee points *forward*. IK solvers pick the solution nearest the current pose; a
   perfectly straight leg is a coin flip and you'll get a knee that bends backwards.
5. **Add the constraint.** Select `mixamorig:LeftLeg` (the *shin*, not the thigh), Bone
   Constraint tab → **Inverse Kinematics**. Target = the empty `IK_Foot.L`; leave the
   **Bone** field blank, since the target is an object, not a bone. **Chain Length = 2**.
   That's shin + thigh; leave it at 0 and it will solve all the way up through your spine
   and destroy the pose you just made. Repeat for `mixamorig:RightLeg`.
6. **Keep the feet flat.** The foot bone is a child of the shin, so it currently swings with
   it. Add a second empty per side (`FootAim.L`), also parented to the pedal, and put a
   **Copy Rotation** constraint on `mixamorig:LeftFoot` targeting it. Rotate the empty by
   hand until the foot looks right — because the empty rides a pedal that never tilts, the
   foot now holds a fixed orientation for the whole revolution, which is what a foot on a
   level pedal does. (Skipping this is survivable; the ankle just stays rigid and the toe
   dips at the extremes.)

If a knee still snaps to the wrong side, add a **Pole Target**: an empty ~1 unit in front
of the knee, parented to the *armature* (not the pedal), then dial **Pole Angle** — for
Mixamo rigs it is usually near −90°. Trial and error, one side at a time.

---

## 4. Drive the crank

Pick a frame count for one full pedal revolution — **40** is plenty (it's scrubbed, not
played, so this is just sampling resolution).

* Frame 1: `PedalRotor` rotation **Y = 0°**, `I` → Rotation.
* Frame 41: rotation **Y = 360°**, `I` → Rotation.
* Graph Editor / Dope Sheet: set the two keys to **Interpolation → Linear**.

Why Y? The bike faces +X and the crank axle runs sideways along Y, so the pedals orbit in
the X–Z plane. Rotating +Y carries the top of the crank forward — that is pedalling
forward. Scrub the timeline: the legs should now pump. Watch for the hip popping (leg too
short — back to section 1) or the knee flipping (section 3, step 4/pole target).

Frame 41 is deliberately a duplicate of frame 1. That is what makes the clip a seamless
loop when you scrub it.

---

## 5. Bake

The IK, the constraints and the empties cannot be exported — glTF has no concept of them.
Bake the *result* into plain bone keyframes.

Pose Mode → `A` to **select every bone** → **Pose → Animation → Bake Action**:

* Frame range **1 → 41**, step 1
* **Visual Keying** ✔ (this is the one that reads the constraint result instead of the raw
  pose values — without it you bake nothing)
* **Clear Constraints** ✔
* **Only Selected Bones** ✔
* Bake Data: **Pose**
* **Overwrite Current Action** ✔ (or make a new one; name it something like `PedalCycle`)

**Why select all bones and not just the legs:** the arms and torso are *posed*, not *rest*.
If the clip only contains leg tracks, three.js plays it on top of the rest pose and she
rides with her arms in a T. Baking every bone writes 41 identical keys for the static
bones — a few kilobytes, and it makes the clip self-contained.

*(Tidier alternative, optional: before baking, do* **Pose → Apply → Apply Pose as Rest
Pose** *with only the non-leg bones posed. That rebinds the mesh in the riding pose and
lets you bake legs only. It is destructive — save first.)*

After baking, the constraints are gone. Scrub again and confirm nothing changed. Then hide
the empties and the bike collection.

---

## 6. Export — and verify it

`File → Export → glTF 2.0 (.glb)`. Select **`REAL_ARMATURE` + `Body.002` only** first.

* **Include → Selected Objects** ✔ (this is how you leave the bicycle out)
* **Transform → +Y Up** ✔
* **Data → Mesh → Skinning** ✔ ← *this is what was off; it is why the current .glb has
  `skins: []`*
* Data → Mesh → Apply Modifiers **off** (applying would freeze the armature deform)
* **Animation** ✔, Mode **Actions**, **Always Sample Animations** ✔
* Animation → Sampling Rate 1

Then verify instead of hoping. Either drag the file onto
<https://gltf-viewer.donmccurdy.com> and press play, or from the repo root:

```
npx --yes @gltf-transform/cli inspect public/models/playerv2/<yourfile>.glb
```

You are looking for **one skin with ~33 joints** and **one animation**. If either is
missing, the rest of the pipeline cannot work — fix it here, not in three.js.

One minor thing the exporter will tell you about: some vertices have **5 bone influences**
and glTF's default is 4, so the weakest is dropped and the rest renormalised. On a
low-poly character at game camera distance this is invisible; ignore it unless you see a
vertex spike.

---

## 7. The three.js side

You are **not** playing the clip. Playing it would make the legs spin at a fixed rate
regardless of speed. You *scrub* it from the crank angle the game already computes —
`Player.tsx` has `const crankAngle = spin * CRANK_GEAR_RATIO;` and hands it to the crank
mesh. Feed the same number to the animation.

Shape of it, in words:

* `useGLTF` the character; build an `AnimationMixer` on the loaded scene, take
  `animations[0]`, make an action, `play()` it, then immediately set `action.paused = true`.
* Each frame: normalise the crank angle into `0…1` (careful — it can be negative, so
  `((a % 2π) + 2π) % 2π`), multiply by `clip.duration`, assign to `action.time`, and call
  `mixer.update(0)`.
* If she pedals backwards, use `duration - t` instead of flipping signs everywhere.

Placement: the character was posed against a bike sitting at the Blender origin, so she
needs exactly the transform the bike gets. Today that lives on the `<Bicycle>` element
(`position-y={0.1} scale={0.8} rotation-y={-Math.PI / 2}`). Cleanest is to lift those
three props onto a shared `<group>` and put both the bicycle and the character inside it —
then they can never drift apart.

Axis reminder, since it has bitten you before: Blender is Z-up, three.js is Y-up, and a
Blender coordinate `(x, y, z)` reads as `(x, z, −y)` in three. The **minus sign is the
part people forget**.

---

## Checklist

- [ ] Reach check redone after scaling (section 1)
- [ ] Torso/arms/head posed, hands on the grips
- [ ] Pedals parented to `PedalRotor`, Limit Rotation (Owner: World) on both
- [ ] Two empties per foot, parented to the pedals
- [ ] IK on the **shins**, Chain Length **2**
- [ ] `PedalRotor` Y: 0° at frame 1, 360° at frame 41, linear
- [ ] Baked with **Visual Keying**, **all bones selected**
- [ ] Exported with **Skinning** on, bicycle excluded
- [ ] `inspect` shows 1 skin + 1 animation
- [ ] Scrubbed, not played, in `Player.tsx`
