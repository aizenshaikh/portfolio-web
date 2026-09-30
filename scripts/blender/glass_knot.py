"""Headless Blender scene: iridescent glass trefoil knot for the portfolio hero.

Usage:
  Blender -b -P glass_knot.py -- <out_dir> <start> <end> <res> <samples>
Renders RGBA PNGs with transparent film + transparent glass so the page
background shows through the glass on the site.
"""
import bpy, math, sys, os
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if len(argv) > 0 else "/tmp/knot"
START = int(argv[1]) if len(argv) > 1 else 1
END = int(argv[2]) if len(argv) > 2 else 1
RES = int(argv[3]) if len(argv) > 3 else 900
SAMPLES = int(argv[4]) if len(argv) > 4 else 64
FRAMES = 96  # total animation length (scroll scrub range)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ---------- Render settings ----------
scene.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
try:
    prefs.compute_device_type = "METAL"
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    scene.cycles.device = "GPU"
except Exception as e:
    print("GPU setup failed, CPU fallback:", e)
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 16
scene.cycles.transmission_bounces = 16
scene.cycles.glossy_bounces = 8
scene.cycles.caustics_reflective = False
scene.cycles.caustics_refractive = False
scene.render.film_transparent = True
scene.cycles.film_transparent_glass = True
scene.cycles.film_transparent_roughness = 0.1
scene.render.resolution_x = RES
scene.render.resolution_y = RES
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.color_depth = "8"
try:
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
except Exception:
    pass
scene.frame_start = 1
scene.frame_end = FRAMES

# ---------- World: very dark with a faint cool gradient (reflections only) ----------
world = bpy.data.worlds.new("World")
scene.world = world
world.use_nodes = True
wn = world.node_tree.nodes
bg = wn["Background"]
bg.inputs["Color"].default_value = (0.02, 0.026, 0.06, 1)
bg.inputs["Strength"].default_value = 1.0

# ---------- Trefoil knot as a bevelled curve ----------
curve = bpy.data.curves.new("KnotCurve", "CURVE")
curve.dimensions = "3D"
curve.resolution_u = 4
curve.bevel_depth = 0.34
curve.bevel_resolution = 10
curve.use_fill_caps = False
spl = curve.splines.new("NURBS")
N = 220
spl.points.add(N - 1)
for i in range(N):
    t = 2 * math.pi * i / N
    x = math.sin(t) + 2 * math.sin(2 * t)
    y = math.cos(t) - 2 * math.cos(2 * t)
    z = -math.sin(3 * t)
    spl.points[i].co = (x * 0.62, y * 0.62, z * 0.62, 1)
spl.use_cyclic_u = True
spl.order_u = 4
knot = bpy.data.objects.new("GlassKnot", curve)
scene.collection.objects.link(knot)
bpy.context.view_layer.objects.active = knot
knot.select_set(True)
bpy.ops.object.convert(target="MESH")
knot = bpy.context.view_layer.objects.active
bpy.ops.object.shade_smooth()

# ---------- Glass material: iridescent thin film + dispersion ----------
mat = bpy.data.materials.new("IridescentGlass")
mat.use_nodes = True
nodes = mat.node_tree.nodes
p = nodes["Principled BSDF"]
def setin(name, val):
    if name in p.inputs:
        p.inputs[name].default_value = val
setin("Base Color", (0.93, 0.95, 1.0, 1))
setin("Roughness", 0.03)
setin("IOR", 1.5)
setin("Transmission Weight", 1.0)
setin("Transmission", 1.0)
setin("Thin Film Thickness", 480.0)
setin("Thin Film IOR", 1.38)
setin("Dispersion", 0.35)
setin("Coat Weight", 0.3)
setin("Coat Roughness", 0.02)
knot.data.materials.append(mat)

# ---------- Lights: coloured softbox strips that the glass reflects/refracts ----------
def strip(name, loc, rot, size, color, strength):
    m = bpy.data.materials.new(name + "M")
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (*color, 1)
    em.inputs["Strength"].default_value = strength
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    lp = nt.nodes.new("ShaderNodeLightPath")
    mix = nt.nodes.new("ShaderNodeMixShader")
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    # invisible to camera, visible in reflections/refractions
    nt.links.new(lp.outputs["Is Camera Ray"], mix.inputs[0])
    nt.links.new(em.outputs[0], mix.inputs[1])
    nt.links.new(tr.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs[0])
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    o.scale = (size[0], size[1], 1)
    o.data.materials.append(m)
    return o

# point planes at origin
def look_rot(loc):
    d = -Vector(loc)
    return d.to_track_quat("-Z", "Y").to_euler()

for name, loc, size, col, s in [
    ("KeyBlue",   (-5.0, -3.5, 4.0), (6, 1.6), (0.18, 0.36, 1.0), 30),
    ("RimViolet", (5.5, 2.0, 2.5),   (5, 1.4), (0.62, 0.30, 1.0), 26),
    ("TopWhite",  (0.5, -1.0, 7.0),  (8, 2.2), (1.0, 0.97, 0.94), 12),
    ("FillCyan",  (-2.0, 6.0, -2.0), (4, 1.2), (0.2, 0.9, 1.0), 14),
    ("WarmLow",   (3.0, -5.0, -3.5), (5, 1.2), (1.0, 0.45, 0.6), 12),
]:
    strip(name, loc, look_rot(loc), size, col, s)

# a soft area light for body sheen
bpy.ops.object.light_add(type="AREA", location=(0, -6, 5))
al = bpy.context.active_object
al.data.energy = 900
al.data.size = 6
al.data.color = (0.85, 0.9, 1.0)
al.rotation_euler = look_rot(al.location)

# ---------- Camera ----------
bpy.ops.object.camera_add(location=(0, -11.5, 0.6))
cam = bpy.context.active_object
cam.data.lens = 60
cam.rotation_euler = look_rot(cam.location)
scene.camera = cam

# ---------- Animation: one smooth turn + tilt across the scroll range ----------
knot.rotation_mode = "XYZ"
def key(frame, rx, ry, rz, s):
    knot.rotation_euler = (math.radians(rx), math.radians(ry), math.radians(rz))
    knot.scale = (s, s, s)
    knot.keyframe_insert("rotation_euler", frame=frame)
    knot.keyframe_insert("scale", frame=frame)
key(1, 62, 0, -20, 1.0)
key(FRAMES, 18, 35, 250, 1.0)
for fc in knot.animation_data.action.fcurves if hasattr(knot.animation_data.action, "fcurves") else []:
    for kp in fc.keyframe_points:
        kp.interpolation = "LINEAR"

os.makedirs(OUT, exist_ok=True)
for f in range(START, END + 1):
    scene.frame_set(f)
    scene.render.filepath = os.path.join(OUT, f"f{f:03d}.png")
    bpy.ops.render.render(write_still=True)
    print("RENDERED", f, flush=True)
