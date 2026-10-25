# scripts/generate_atlas.py
"""
High-Resolution Retro Pixel Art Texture Atlas Generator & Packer for Phaser 3
Generates:
- public/assets/farm/atlas.png (256x256 RGBA Spritesheet)
- public/assets/farm/atlas.json (Phaser 3 / TexturePacker Hash JSON)

Zero external dependencies - uses Python standard library (struct, zlib, json, os).
"""

import os
import sys
import json
import zlib
import struct

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Spritesheet dimensions
ATLAS_W = 256
ATLAS_H = 256
TILE_SIZE = 32

def hex_to_rgba(hex_str, alpha=255):
    """Parses #RRGGBB or #RRGGBBAA into (R, G, B, A) tuple."""
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 6:
        r = int(hex_str[0:2], 16)
        g = int(hex_str[2:4], 16)
        b = int(hex_str[4:6], 16)
        return (r, g, b, alpha)
    elif len(hex_str) == 8:
        r = int(hex_str[0:2], 16)
        g = int(hex_str[2:4], 16)
        b = int(hex_str[4:6], 16)
        a = int(hex_str[6:8], 16)
        return (r, g, b, a)
    raise ValueError(f"Invalid hex color: {hex_str}")

class Canvas2D:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        # Initialize buffer with transparent black: (0, 0, 0, 0)
        self.pixels = [(0, 0, 0, 0)] * (width * height)

    def set_pixel(self, x, y, color):
        if 0 <= x < self.width and 0 <= y < self.height:
            if isinstance(color, str):
                color = hex_to_rgba(color)
            
            # Alpha blending if source has partial transparency
            sa = color[3] / 255.0
            if sa >= 1.0:
                self.pixels[y * self.width + x] = color
            elif sa > 0:
                orig = self.pixels[y * self.width + x]
                oa = orig[3] / 255.0
                out_a = sa + oa * (1.0 - sa)
                if out_a > 0:
                    out_r = int((color[0] * sa + orig[0] * oa * (1.0 - sa)) / out_a)
                    out_g = int((color[1] * sa + orig[1] * oa * (1.0 - sa)) / out_a)
                    out_b = int((color[2] * sa + orig[2] * oa * (1.0 - sa)) / out_a)
                    self.pixels[y * self.width + x] = (out_r, out_g, out_b, int(out_a * 255))

    def fill_rect(self, x, y, w, h, color):
        for py in range(max(0, y), min(self.height, y + h)):
            for px in range(max(0, x), min(self.width, x + w)):
                self.set_pixel(px, py, color)

    def fill_circle(self, cx, cy, r, color):
        r_sq = r * r
        for py in range(int(cy - r), int(cy + r + 1)):
            for px in range(int(cx - r), int(cx + r + 1)):
                if (px - cx)**2 + (py - cy)**2 <= r_sq:
                    self.set_pixel(px, py, color)

    def fill_ellipse(self, cx, cy, rx, ry, color):
        if rx <= 0 or ry <= 0: return
        rx_sq = rx * rx
        ry_sq = ry * ry
        for py in range(int(cy - ry), int(cy + ry + 1)):
            for px in range(int(cx - rx), int(cx + rx + 1)):
                if ((px - cx)**2) / rx_sq + ((py - cy)**2) / ry_sq <= 1.0:
                    self.set_pixel(px, py, color)

    def blit(self, source, dest_x, dest_y):
        for sy in range(source.height):
            for sx in range(source.width):
                sp = source.pixels[sy * source.width + sx]
                if sp[3] > 0:
                    self.set_pixel(dest_x + sx, dest_y + sy, sp)

    def to_png_bytes(self):
        """Generates valid raw PNG binary bytes."""
        raw_scanlines = bytearray()
        row_bytes = self.width * 4
        for y in range(self.height):
            raw_scanlines.append(0)  # Filter byte: 0 (None)
            for x in range(self.width):
                p = self.pixels[y * self.width + x]
                raw_scanlines.extend(p)

        def make_chunk(chunk_type, data):
            c = chunk_type + data
            crc = struct.pack('>I', zlib.crc32(c) & 0xffffffff)
            return struct.pack('>I', len(data)) + c + crc

        png = bytearray(b'\x89PNG\r\n\x1a\n')
        # IHDR: width(4), height(4), bit_depth=8, color_type=6 (RGBA), comp=0, filter=0, interlace=0
        ihdr_data = struct.pack('>IIBBBBB', self.width, self.height, 8, 6, 0, 0, 0)
        png.extend(make_chunk(b'IHDR', ihdr_data))
        # IDAT
        compressed_data = zlib.compress(bytes(raw_scanlines), 9)
        png.extend(make_chunk(b'IDAT', compressed_data))
        # IEND
        png.extend(make_chunk(b'IEND', b''))
        return bytes(png)

# =========================================================================
# PIXEL ART BUILDERS FOR 32x32 SPRITES
# =========================================================================

def draw_grass_tile():
    c = Canvas2D(32, 32)
    # Base grass layers
    c.fill_rect(0, 0, 32, 32, "#347838")
    
    # Subsurface organic dither
    dark_green = "#255c28"
    mid_green = "#2f6932"
    light_green = "#469c4c"
    bright_green = "#5ebb64"
    
    # Dither pattern for depth
    for y in range(32):
        for x in range(32):
            if (x * 7 + y * 13) % 5 == 0:
                c.set_pixel(x, y, mid_green)
            elif (x * 11 + y * 17) % 7 == 0:
                c.set_pixel(x, y, light_green)
            elif (x * 3 + y * 5) % 11 == 0:
                c.set_pixel(x, y, dark_green)
                
    # Clumps of grass blades
    tufts = [(5, 7), (19, 4), (12, 18), (25, 14), (6, 24), (22, 25)]
    for tx, ty in tufts:
        # Dark blade shadow
        c.set_pixel(tx, ty + 1, dark_green)
        c.set_pixel(tx + 1, ty + 1, dark_green)
        c.set_pixel(tx + 2, ty + 1, dark_green)
        # Blade tuft
        c.set_pixel(tx, ty - 1, bright_green)
        c.set_pixel(tx + 1, ty - 2, bright_green)
        c.set_pixel(tx + 2, ty - 1, bright_green)
        c.set_pixel(tx + 1, ty, light_green)

    # Little white & yellow wildflowers
    flowers = [(10, 8), (27, 21), (15, 27)]
    for fx, fy in flowers:
        c.set_pixel(fx - 1, fy, "#f8fafc")
        c.set_pixel(fx + 1, fy, "#f8fafc")
        c.set_pixel(fx, fy - 1, "#f8fafc")
        c.set_pixel(fx, fy + 1, "#f8fafc")
        c.set_pixel(fx, fy, "#facc15") # Golden center
        
    return c

def draw_soil_dry_tile():
    c = Canvas2D(32, 32)
    # Base warm soil
    c.fill_rect(0, 0, 32, 32, "#70441d")
    
    # Furrows: 4 horizontal ridges with deep shadow valleys
    # Valleys at y = 3, 11, 19, 27
    deep_shadow = "#43250d"
    shadow = "#573214"
    ridge_mid = "#824f23"
    ridge_light = "#9c612d"
    ridge_crest = "#b57338"
    pebble = "#c9935f"

    for y in range(32):
        row_in_cycle = y % 8
        for x in range(32):
            if row_in_cycle == 0:
                c.set_pixel(x, y, deep_shadow)
            elif row_in_cycle == 1:
                c.set_pixel(x, y, shadow)
            elif row_in_cycle in (2, 3):
                c.set_pixel(x, y, ridge_light if (x + y) % 3 != 0 else ridge_crest)
            elif row_in_cycle in (4, 5):
                c.set_pixel(x, y, ridge_mid)
            else:
                c.set_pixel(x, y, shadow)

    # Small soil crumbs & pebbles
    crumbs = [(7, 3), (18, 12), (24, 18), (11, 26), (28, 4), (4, 19)]
    for cx, cy in crumbs:
        c.set_pixel(cx, cy, pebble)
        c.set_pixel(cx + 1, cy, deep_shadow)
    return c

def draw_soil_wet_tile():
    c = Canvas2D(32, 32)
    # Darker rich wet loam
    c.fill_rect(0, 0, 32, 32, "#3a220e")
    
    deep_wet = "#201206"
    shadow_wet = "#2e190a"
    ridge_wet = "#4d2f16"
    ridge_crest = "#613b1d"
    shine = "#94a3b8"       # Glossy water sheen
    sparkle = "#e2e8f0"

    for y in range(32):
        row_in_cycle = y % 8
        for x in range(32):
            if row_in_cycle == 0:
                c.set_pixel(x, y, deep_wet)
            elif row_in_cycle == 1:
                c.set_pixel(x, y, shadow_wet)
            elif row_in_cycle in (2, 3):
                c.set_pixel(x, y, ridge_crest if (x + y) % 4 != 0 else ridge_wet)
            elif row_in_cycle in (4, 5):
                c.set_pixel(x, y, ridge_wet)
            else:
                c.set_pixel(x, y, shadow_wet)

    # Wet reflective droplets on ridge crests
    sheens = [(8, 2), (21, 10), (14, 18), (27, 19), (5, 26), (19, 27)]
    for sx, sy in sheens:
        c.set_pixel(sx, sy, shine)
        c.set_pixel(sx + 1, sy, sparkle)
        c.set_pixel(sx, sy + 1, deep_wet)
    return c

def draw_marker():
    c = Canvas2D(32, 32)
    cyan = "#38bdf8"
    white = "#ffffff"
    # Corner brackets (4 corners)
    corners = [(0, 0), (24, 0), (0, 24), (24, 24)]
    for cx, cy in corners:
        # 8x8 corner bracket
        for i in range(8):
            c.set_pixel(cx + i, cy, white if i < 3 else cyan)
            c.set_pixel(cx, cy + i, white if i < 3 else cyan)
            if cx > 0:
                c.set_pixel(cx + 7, cy + i, white if i < 3 else cyan)
            if cy > 0:
                c.set_pixel(cx + i, cy + 7, white if i < 3 else cyan)
                
    # Center faint targeting reticle
    c.fill_rect(2, 2, 28, 28, (56, 189, 248, 30))
    return c

def draw_obstacle_rock():
    c = Canvas2D(32, 32)
    # Ground drop shadow
    c.fill_ellipse(16, 26, 12, 5, (15, 23, 42, 115))
    
    # 3D faceted boulder
    # Base dark underside
    c.fill_ellipse(16, 17, 11, 9, "#334155")
    # Mid body
    c.fill_ellipse(15, 15, 10, 8, "#475569")
    # Upper sunlit stone
    c.fill_ellipse(14, 13, 8, 6, "#64748b")
    # Sunlit highlight crest
    c.fill_ellipse(12, 11, 5, 4, "#94a3b8")
    c.fill_ellipse(10, 10, 3, 2, "#cbd5e1")
    c.set_pixel(9, 9, "#ffffff")

    # Fracture fissures (cracks)
    c.set_pixel(15, 12, "#1e293b")
    c.set_pixel(16, 13, "#1e293b")
    c.set_pixel(16, 14, "#1e293b")
    c.set_pixel(17, 15, "#1e293b")
    c.set_pixel(18, 16, "#1e293b")
    # Crack highlight
    c.set_pixel(17, 14, "#cbd5e1")
    
    # Moss patch on corner
    c.set_pixel(21, 16, "#15803d")
    c.set_pixel(22, 16, "#22c55e")
    c.set_pixel(22, 17, "#166534")
    c.set_pixel(23, 17, "#4ade80")
    return c

def draw_obstacle_wood():
    c = Canvas2D(32, 32)
    # Ground drop shadow
    c.fill_ellipse(16, 26, 13, 5, (15, 23, 42, 110))
    
    # Log trunk cylinder
    # Dark underside bark
    c.fill_rect(5, 14, 22, 10, "#3e2211")
    # Mid bark
    c.fill_rect(5, 12, 22, 8, "#5c3319")
    # Top lit bark
    c.fill_rect(5, 11, 22, 4, "#784422")
    c.fill_rect(7, 11, 18, 2, "#96552a")
    
    # Bark grooves
    c.fill_rect(12, 13, 1, 6, "#28150a")
    c.fill_rect(18, 14, 1, 5, "#28150a")
    c.fill_rect(22, 13, 1, 6, "#28150a")

    # Cut wood log end (annual growth rings)
    c.fill_ellipse(7, 16, 4, 6, "#d4a373")
    c.fill_ellipse(7, 16, 3, 4, "#b08151")
    c.fill_ellipse(7, 16, 2, 3, "#8a5f36")
    c.fill_ellipse(7, 16, 1, 1, "#54361c")

    # Little green clover / fungus sprout
    c.set_pixel(14, 9, "#16a34a")
    c.set_pixel(15, 9, "#4ade80")
    c.set_pixel(14, 10, "#15803d")
    c.set_pixel(16, 10, "#22c55e")
    c.set_pixel(15, 11, "#166534")
    return c

def draw_obstacle_weed():
    c = Canvas2D(32, 32)
    # Drop shadow
    c.fill_ellipse(16, 27, 11, 4, (15, 23, 42, 90))
    
    # Tall bushy weed blades
    # Back dark blades
    for (x0, y0, x1, y1) in [(8, 26, 6, 10), (14, 26, 11, 7), (20, 26, 24, 8), (17, 26, 20, 11)]:
        c.fill_rect(min(x0, x1), min(y0, y1), abs(x1 - x0) + 1, abs(y1 - y0) + 1, "#14532d")
    # Mid blades
    for (x0, y0, x1, y1) in [(10, 26, 9, 8), (15, 26, 16, 5), (18, 26, 22, 9)]:
        c.fill_rect(min(x0, x1), min(y0, y1), abs(x1 - x0) + 1, abs(y1 - y0) + 1, "#16a34a")
    # Front bright blades
    for (x0, y0, x1, y1) in [(12, 26, 13, 7), (16, 26, 17, 9)]:
        c.fill_rect(min(x0, x1), min(y0, y1), abs(x1 - x0) + 1, abs(y1 - y0) + 1, "#4ade80")
    
    # Wild yellow dandelion flowers
    c.fill_circle(16, 6, 2, "#facc15")
    c.set_pixel(16, 6, "#fef08a")
    c.fill_circle(23, 9, 1.5, "#f59e0b")
    c.set_pixel(23, 9, "#fde047")
    return c

def draw_placeable_fence():
    c = Canvas2D(32, 32)
    # Ground shadow
    c.fill_rect(2, 27, 28, 4, (15, 23, 42, 100))
    
    # Horizontal cross rails (back)
    # Top rail
    c.fill_rect(1, 10, 30, 4, "#5a3418")
    c.fill_rect(1, 10, 30, 1, "#8a532a")
    # Bottom rail
    c.fill_rect(1, 20, 30, 4, "#5a3418")
    c.fill_rect(1, 20, 30, 1, "#8a532a")

    # Two vertical posts (left post x=4..10, right post x=22..28)
    for px in [4, 22]:
        # Post body
        c.fill_rect(px, 5, 6, 23, "#784422")
        c.fill_rect(px, 5, 2, 23, "#9c5a30") # Highlight edge
        c.fill_rect(px + 4, 5, 2, 23, "#4d2911") # Shadow edge
        # Pointed top cap
        c.fill_rect(px + 1, 3, 4, 2, "#9c5a30")
        c.fill_rect(px + 2, 2, 2, 1, "#b8703f")
        # Nails
        c.set_pixel(px + 2, 11, "#1e293b")
        c.set_pixel(px + 3, 11, "#94a3b8")
        c.set_pixel(px + 2, 21, "#1e293b")
        c.set_pixel(px + 3, 21, "#94a3b8")
    return c

def draw_placeable_chest():
    c = Canvas2D(32, 32)
    # Drop shadow
    c.fill_ellipse(16, 26, 13, 5, (15, 23, 42, 115))
    
    # Wooden chest main box
    c.fill_rect(4, 11, 24, 16, "#542609")
    c.fill_rect(5, 12, 22, 14, "#78370f")
    # Planks line
    c.fill_rect(5, 18, 22, 1, "#3c1704")
    
    # Golden Brass trim & bands
    c.fill_rect(4, 11, 24, 2, "#d97706")
    c.fill_rect(4, 17, 24, 2, "#d97706")
    c.fill_rect(7, 11, 2, 16, "#f59e0b")
    c.fill_rect(23, 11, 2, 16, "#f59e0b")
    # Corner rivets
    for rx, ry in [(7, 12), (23, 12), (7, 25), (23, 25)]:
        c.set_pixel(rx, ry, "#fef08a")

    # Center lock latch
    c.fill_rect(14, 16, 4, 5, "#fef08a")
    c.fill_rect(15, 17, 2, 3, "#b45309")
    c.set_pixel(15, 18, "#451a03")
    return c

def draw_item_fertilizer():
    c = Canvas2D(32, 32)
    # Drop shadow
    c.fill_ellipse(16, 26, 10, 4, (15, 23, 42, 90))
    # Burlap pouch body
    c.fill_rect(7, 11, 18, 15, "#854d0e")
    c.fill_rect(8, 12, 16, 13, "#a16207")
    c.fill_rect(9, 13, 14, 11, "#ca8a04")
    # Tied neck string
    c.fill_rect(10, 8, 12, 3, "#facc15")
    c.fill_rect(12, 6, 8, 2, "#ca8a04")
    # Organic leaf emblem
    c.fill_circle(16, 18, 4, "#15803d")
    c.fill_circle(16, 17, 3, "#22c55e")
    c.set_pixel(16, 16, "#86efac")
    c.set_pixel(15, 18, "#86efac")
    # Magic sparkle stars
    c.set_pixel(22, 7, "#fef08a")
    c.set_pixel(23, 8, "#fef08a")
    c.set_pixel(21, 8, "#fef08a")
    c.set_pixel(22, 9, "#fef08a")
    return c

# =========================================================================
# WHEAT CROPS (4 Stages)
# =========================================================================

def draw_crop_wheat(stage):
    c = Canvas2D(32, 32)
    # Soil mound shadow
    c.fill_ellipse(16, 27, 8, 3, (40, 20, 8, 120))
    
    if stage == 0:
        # Seedling: Tiny green twin cotyledon
        c.fill_rect(15, 22, 2, 5, "#15803d")
        c.set_pixel(14, 21, "#22c55e")
        c.set_pixel(17, 21, "#4ade80")
        c.set_pixel(14, 20, "#86efac")
        c.set_pixel(17, 20, "#86efac")
    elif stage == 1:
        # Small green shoots
        c.fill_rect(14, 18, 2, 9, "#15803d")
        c.fill_rect(17, 16, 2, 11, "#16a34a")
        # Leaves branching out
        c.set_pixel(12, 19, "#22c55e")
        c.set_pixel(13, 20, "#22c55e")
        c.set_pixel(19, 17, "#4ade80")
        c.set_pixel(20, 18, "#4ade80")
        c.set_pixel(17, 15, "#86efac")
    elif stage == 2:
        # Tall bushy wheat, developing ears
        for sx in [13, 16, 19]:
            c.fill_rect(sx, 12, 2, 15, "#15803d")
        # Leaves
        c.fill_rect(10, 16, 3, 2, "#22c55e")
        c.fill_rect(20, 18, 3, 2, "#4ade80")
        # Developing wheat heads (lime transitioning to amber)
        c.fill_rect(12, 8, 3, 6, "#84cc16")
        c.fill_rect(15, 6, 3, 7, "#a3e635")
        c.fill_rect(18, 9, 3, 6, "#eab308")
        c.set_pixel(16, 5, "#facc15")
    else: # stage 3: Ripe golden wheat
        # Dense golden stems
        c.fill_rect(13, 11, 2, 16, "#ca8a04")
        c.fill_rect(16, 9, 2, 18, "#eab308")
        c.fill_rect(19, 12, 2, 15, "#ca8a04")
        # Plump golden kernel heads
        # Center head
        c.fill_rect(15, 3, 4, 10, "#ca8a04")
        c.fill_rect(15, 3, 3, 9, "#eab308")
        c.fill_rect(16, 4, 2, 7, "#facc15")
        c.set_pixel(16, 4, "#fef08a")
        # Left head bowing left
        c.fill_rect(10, 6, 4, 8, "#ca8a04")
        c.fill_rect(11, 6, 3, 7, "#facc15")
        c.set_pixel(11, 6, "#fef08a")
        # Right head bowing right
        c.fill_rect(19, 7, 4, 8, "#ca8a04")
        c.fill_rect(19, 7, 3, 7, "#facc15")
        c.set_pixel(20, 7, "#fef08a")
        # Awn whiskers / bristles
        c.set_pixel(16, 1, "#fef08a")
        c.set_pixel(17, 2, "#fde047")
        c.set_pixel(9, 4, "#fde047")
        c.set_pixel(23, 5, "#fde047")
        # Sparkle
        c.set_pixel(13, 3, "#ffffff")
    return c

# =========================================================================
# HERB CROPS (4 Stages)
# =========================================================================

def draw_crop_herb(stage):
    c = Canvas2D(32, 32)
    # Soil mound shadow
    c.fill_ellipse(16, 27, 8, 3, (40, 20, 8, 120))

    if stage == 0:
        # Seedling
        c.fill_rect(15, 23, 2, 4, "#166534")
        c.fill_circle(14, 22, 2, "#15803d")
        c.fill_circle(18, 22, 2, "#22c55e")
        c.set_pixel(18, 21, "#86efac")
    elif stage == 1:
        # Bushy leafy herb
        c.fill_rect(15, 17, 2, 10, "#14532d")
        c.fill_circle(12, 20, 3, "#16a34a")
        c.fill_circle(20, 19, 3, "#15803d")
        c.fill_circle(16, 16, 3, "#22c55e")
        c.set_pixel(16, 15, "#86efac")
    elif stage == 2:
        # Dense bush with purple flower buds
        c.fill_rect(15, 14, 2, 13, "#14532d")
        c.fill_circle(11, 18, 4, "#15803d")
        c.fill_circle(21, 17, 4, "#16a34a")
        c.fill_circle(16, 13, 4, "#22c55e")
        # Purple buds forming
        c.fill_circle(12, 13, 2, "#7c3aed")
        c.fill_circle(20, 12, 2, "#8b5cf6")
        c.fill_circle(16, 9, 2, "#a855f7")
        c.set_pixel(16, 8, "#d8b4fe")
    else: # stage 3: Fully blooming fragrant herb
        c.fill_rect(15, 13, 2, 14, "#14532d")
        # Rich green foliage base
        c.fill_circle(10, 19, 4, "#15803d")
        c.fill_circle(22, 18, 4, "#16a34a")
        c.fill_circle(16, 15, 5, "#22c55e")
        # Glorious lavender flower clusters
        for fx, fy in [(10, 12), (22, 11), (16, 7), (13, 9), (19, 8)]:
            c.fill_circle(fx, fy, 3, "#7c3aed")
            c.fill_circle(fx, fy, 2, "#a855f7")
            c.set_pixel(fx, fy, "#facc15") # Golden center pollen
            c.set_pixel(fx - 1, fy - 1, "#f3e8ff") # Bloom highlight
    return c

# =========================================================================
# FARMER CHARACTER (4 Directions & Walk Animations)
# =========================================================================

def draw_farmer(direction='down', walk_step=0):
    c = Canvas2D(32, 32)
    # Character ground shadow
    c.fill_ellipse(16, 28, 7, 3, (15, 23, 42, 110))
    
    # Body vertical bounce during walk
    bob = 1 if walk_step in (1, 2) else 0

    # Colors
    straw_light = "#fef08a"
    straw_mid = "#eab308"
    straw_shadow = "#ca8a04"
    hat_band = "#991b1b" # Red hat ribbon
    skin_light = "#fde047"
    skin_mid = "#fcd34d"
    skin_tone = "#fbcfe8"
    shirt = "#f8fafc"
    denim = "#1d4ed8"
    denim_dark = "#1e3a8a"
    denim_light = "#3b82f6"
    boot = "#451a03"
    boot_sole = "#291002"

    if direction == 'down':
        # Boots
        if walk_step == 1:
            c.fill_rect(11, 24 + bob, 4, 5, boot) # Left foot forward
            c.fill_rect(17, 23, 4, 4, boot_sole)  # Right foot back
        elif walk_step == 2:
            c.fill_rect(11, 23, 4, 4, boot_sole)  # Left foot back
            c.fill_rect(17, 24 + bob, 4, 5, boot) # Right foot forward
        else: # Idle
            c.fill_rect(11, 24, 4, 5, boot)
            c.fill_rect(17, 24, 4, 5, boot)

        # Overalls legs & body
        c.fill_rect(10, 16 + bob, 12, 9, denim)
        c.fill_rect(15, 21 + bob, 2, 4, denim_dark) # Leg separation
        # Overalls straps & chest bib
        c.fill_rect(12, 14 + bob, 8, 4, denim)
        c.fill_rect(12, 13 + bob, 2, 3, denim_light)
        c.fill_rect(18, 13 + bob, 2, 3, denim_light)
        # Brass buttons
        c.set_pixel(12, 15 + bob, "#facc15")
        c.set_pixel(19, 15 + bob, "#facc15")
        # White shirt under overalls & sleeves
        c.fill_rect(9, 14 + bob, 3, 4, shirt)
        c.fill_rect(20, 14 + bob, 3, 4, shirt)
        c.fill_rect(9, 17 + bob, 2, 3, skin_tone) # Hands
        c.fill_rect(21, 17 + bob, 2, 3, skin_tone)

        # Head / Face
        c.fill_rect(12, 9 + bob, 8, 6, skin_tone)
        # Eyes
        c.set_pixel(14, 11 + bob, "#1e293b")
        c.set_pixel(17, 11 + bob, "#1e293b")
        # Cheerful smile & blush
        c.set_pixel(13, 13 + bob, "#f472b6")
        c.set_pixel(18, 13 + bob, "#f472b6")
        c.set_pixel(15, 13 + bob, "#991b1b")
        c.set_pixel(16, 13 + bob, "#991b1b")

        # Straw Hat
        c.fill_ellipse(16, 8 + bob, 10, 3, straw_mid) # Hat brim
        c.fill_rect(7, 7 + bob, 18, 2, straw_mid)
        c.fill_rect(11, 4 + bob, 10, 4, straw_light)  # Hat crown
        c.fill_rect(11, 7 + bob, 10, 1, hat_band)     # Hat band

    elif direction == 'up':
        # Back view
        if walk_step == 1:
            c.fill_rect(11, 24 + bob, 4, 5, boot)
            c.fill_rect(17, 23, 4, 4, boot_sole)
        elif walk_step == 2:
            c.fill_rect(11, 23, 4, 4, boot_sole)
            c.fill_rect(17, 24 + bob, 4, 5, boot)
        else:
            c.fill_rect(11, 24, 4, 5, boot)
            c.fill_rect(17, 24, 4, 5, boot)

        # Overalls back
        c.fill_rect(10, 15 + bob, 12, 10, denim_dark)
        c.fill_rect(15, 21 + bob, 2, 4, "#0f172a") # Leg crease
        # Crossed straps on back
        c.fill_rect(12, 13 + bob, 2, 4, denim)
        c.fill_rect(18, 13 + bob, 2, 4, denim)
        c.fill_rect(10, 13 + bob, 2, 3, shirt)
        c.fill_rect(20, 13 + bob, 2, 3, shirt)

        # Back of head & hair
        c.fill_rect(12, 8 + bob, 8, 6, "#78350f") # Brown hair

        # Straw Hat (Back)
        c.fill_ellipse(16, 8 + bob, 10, 3, straw_shadow)
        c.fill_rect(7, 7 + bob, 18, 2, straw_mid)
        c.fill_rect(11, 4 + bob, 10, 4, straw_light)
        c.fill_rect(11, 7 + bob, 10, 1, hat_band)

    elif direction == 'left':
        # Left profile
        stride = 2 if walk_step in (1, 2) else 0
        c.fill_rect(13 - stride, 24 + bob, 4, 5, boot)
        c.fill_rect(16 + stride, 24, 4, 5, boot_sole if stride else boot)

        c.fill_rect(12, 15 + bob, 8, 10, denim)
        c.fill_rect(11, 14 + bob, 3, 5, shirt)
        c.fill_rect(10, 18 + bob, 2, 3, skin_tone)

        # Face profile
        c.fill_rect(11, 9 + bob, 7, 6, skin_tone)
        c.set_pixel(12, 11 + bob, "#1e293b") # Left eye

        # Hat profile
        c.fill_ellipse(15, 8 + bob, 9, 3, straw_mid)
        c.fill_rect(11, 4 + bob, 8, 4, straw_light)
        c.fill_rect(10, 7 + bob, 9, 1, hat_band)

    elif direction == 'right':
        # Right profile
        stride = 2 if walk_step in (1, 2) else 0
        c.fill_rect(15 + stride, 24 + bob, 4, 5, boot)
        c.fill_rect(12 - stride, 24, 4, 5, boot_sole if stride else boot)

        c.fill_rect(12, 15 + bob, 8, 10, denim)
        c.fill_rect(18, 14 + bob, 3, 5, shirt)
        c.fill_rect(20, 18 + bob, 2, 3, skin_tone)

        # Face profile
        c.fill_rect(14, 9 + bob, 7, 6, skin_tone)
        c.set_pixel(19, 11 + bob, "#1e293b") # Right eye

        # Hat profile
        c.fill_ellipse(17, 8 + bob, 9, 3, straw_mid)
        c.fill_rect(13, 4 + bob, 8, 4, straw_light)
        c.fill_rect(13, 7 + bob, 9, 1, hat_band)

    return c

# =========================================================================
# MAIN BUILD SCRIPT
# =========================================================================

def generate_atlas():
    print("[Atlas] Generating Retro Pixel Art Texture Atlas (256x256px)...")

    # Map of frame keys to coordinates on the 256x256 grid
    # Grid: 8 columns x 8 rows (each 32x32)
    frame_defs = {
        # Row 0: Tiles & Obstacles & Consumables
        "tile_grass":        (0, 0, draw_grass_tile()),
        "tile_soil_dry":     (1, 0, draw_soil_dry_tile()),
        "tile_soil_wet":     (2, 0, draw_soil_wet_tile()),
        "tile_marker":       (3, 0, draw_marker()),
        "obstacle_rock":     (4, 0, draw_obstacle_rock()),
        "obstacle_wood":     (5, 0, draw_obstacle_wood()),
        "obstacle_weed":     (6, 0, draw_obstacle_weed()),
        "item_fertilizer":   (7, 0, draw_item_fertilizer()),

        # Row 1: Crops (Wheat & Herb)
        "crop_wheat_0":      (0, 1, draw_crop_wheat(0)),
        "crop_wheat_1":      (1, 1, draw_crop_wheat(1)),
        "crop_wheat_2":      (2, 1, draw_crop_wheat(2)),
        "crop_wheat_3":      (3, 1, draw_crop_wheat(3)),
        "crop_herb_0":       (4, 1, draw_crop_herb(0)),
        "crop_herb_1":       (5, 1, draw_crop_herb(1)),
        "crop_herb_2":       (6, 1, draw_crop_herb(2)),
        "crop_herb_3":       (7, 1, draw_crop_herb(3)),

        # Row 2: Placeables & Character Idles
        "placeable_fence":   (0, 2, draw_placeable_fence()),
        "placeable_chest":   (1, 2, draw_placeable_chest()),
        "farmer_sprite":     (2, 2, draw_farmer('down', 0)),
        "player_idle_down":  (3, 2, draw_farmer('down', 0)),
        "player_idle_up":    (4, 2, draw_farmer('up', 0)),
        "player_idle_left":  (5, 2, draw_farmer('left', 0)),
        "player_idle_right": (6, 2, draw_farmer('right', 0)),

        # Row 3: Character Walk Animations
        "player_walk_down_0":(0, 3, draw_farmer('down', 1)),
        "player_walk_down_1":(1, 3, draw_farmer('down', 2)),
        "player_walk_up_0":  (2, 3, draw_farmer('up', 1)),
        "player_walk_up_1":  (3, 3, draw_farmer('up', 2)),
        "player_walk_left_0":(4, 3, draw_farmer('left', 1)),
        "player_walk_left_1":(5, 3, draw_farmer('left', 2)),
        "player_walk_right_0":(6, 3, draw_farmer('right', 1)),
        "player_walk_right_1":(7, 3, draw_farmer('right', 2)),
    }

    atlas_canvas = Canvas2D(ATLAS_W, ATLAS_H)
    atlas_json_frames = {}

    for frame_name, (col, row, tile_canvas) in frame_defs.items():
        px = col * TILE_SIZE
        py = row * TILE_SIZE
        atlas_canvas.blit(tile_canvas, px, py)

        atlas_json_frames[frame_name] = {
            "frame": {"x": px, "y": py, "w": TILE_SIZE, "h": TILE_SIZE},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": TILE_SIZE, "h": TILE_SIZE},
            "sourceSize": {"w": TILE_SIZE, "h": TILE_SIZE}
        }

    output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "assets", "farm")
    os.makedirs(output_dir, exist_ok=True)

    png_path = os.path.join(output_dir, "atlas.png")
    json_path = os.path.join(output_dir, "atlas.json")

    # 1. Write PNG
    png_bytes = atlas_canvas.to_png_bytes()
    with open(png_path, "wb") as f:
        f.write(png_bytes)
    print(f"[OK] Generated Texture Atlas Image: {png_path} ({len(png_bytes):,} bytes)")

    # 2. Write JSON Index (TexturePacker Hash format)
    atlas_data = {
        "frames": atlas_json_frames,
        "meta": {
            "app": "LopCoOanhFarmAtlasBuilder",
            "version": "1.0",
            "image": "atlas.png",
            "format": "RGBA8888",
            "size": {"w": ATLAS_W, "h": ATLAS_H},
            "scale": "1"
        }
    }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(atlas_data, f, indent=2, ensure_ascii=False)
    print(f"[OK] Generated Texture Atlas JSON: {json_path} ({len(atlas_json_frames)} frames)")

    print("\n[SUCCESS] Texture Atlas successfully built and packed!")

if __name__ == "__main__":
    generate_atlas()
