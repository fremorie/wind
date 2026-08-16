"""
Generates public/models/bicyclePlaceholder/BicyclePlaceholder.glb:
a stand-in "bicycle" made of two cylinders, sized to match the current
Bicycle.glb (~4.3 units long) so it can be swapped in without retuning.

Run:  blender --background --python resources/bicyclePlaceholder/make_placeholder.py

Conventions baked in (see utils/player.ts):
  - forward is +Z in model space (yaw = atan2(dir.x, dir.z))
  - wheels spin about the X axis
  - origin sits at axle height, midway between the axles
Blender is Z-up and the glTF exporter maps (x, y, z) -> (x, z, -y),
so "forward" here is Blender -Y and the axle runs along Blender X.
"""

import math
import os

import bpy

WHEEL_RADIUS = 1.0
WHEEL_WIDTH = 0.15
WHEELBASE = 2.3
OUT = os.path.join("public", "models", "bicyclePlaceholder", "BicyclePlaceholder.glb")

# empty scene
bpy.ops.wm.read_factory_settings(use_empty=True)


def material(name, rgba):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = rgba
    bsdf.inputs["Roughness"].default_value = 0.6
    return mat


def wheel(name, forward_offset, mat):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=24,
        radius=WHEEL_RADIUS,
        depth=WHEEL_WIDTH,
        # cylinder axis is +Z by default; turn it to point along X
        rotation=(0.0, math.radians(90.0), 0.0),
        # glTF +Z (forward) is Blender -Y
        location=(0.0, -forward_offset, 0.0),
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(mat)
    bpy.ops.object.shade_flat()
    return obj


wheel("WheelFront", WHEELBASE / 2, material("PlaceholderFront", (0.85, 0.25, 0.2, 1.0)))
wheel("WheelRear", -WHEELBASE / 2, material("PlaceholderRear", (0.25, 0.3, 0.35, 1.0)))

bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    export_apply=True,
    export_yup=True,
)
print("wrote", OUT)
