import os
import numpy as np
from PIL import Image
import scipy.ndimage as ndi

def clean_sprite_bg(crop):
    arr = np.array(crop).copy()
    h, w, _ = arr.shape
    
    # White background threshold (pure white to light grey border)
    is_white = (arr[:, :, 0] > 236) & (arr[:, :, 1] > 236) & (arr[:, :, 2] > 236)
    labeled, num = ndi.label(is_white)
    
    border_mask = np.zeros((h, w), dtype=bool)
    border_mask[0, :] = True
    border_mask[-1, :] = True
    border_mask[:, 0] = True
    border_mask[:, -1] = True
    
    border_labels = np.unique(labeled[border_mask & is_white])
    true_bg = np.isin(labeled, border_labels)
    
    alpha = np.where(true_bg, 0, 255).astype(np.uint8)
    arr[:, :, 3] = alpha
    
    # Auto-crop transparent boundaries
    non_empty_r = np.where(np.any(arr[:, :, 3] > 0, axis=1))[0]
    non_empty_c = np.where(np.any(arr[:, :, 3] > 0, axis=0))[0]
    if len(non_empty_r) > 0 and len(non_empty_c) > 0:
        arr = arr[non_empty_r[0]:non_empty_r[-1]+1, non_empty_c[0]:non_empty_c[-1]+1]
    
    return Image.fromarray(arr)

def build_new_mouse_atlas():
    src_sheet_path = r'C:\Users\User\.gemini\antigravity\brain\78f9aa15-5143-4115-b1aa-d068c68beb50\mouse_spritesheet_1794074165762.jpg'
    sheet = Image.open(src_sheet_path).convert('RGBA')
    
    sprites_boxes = {
        'walk1': (40, 35, 255, 265),
        'walk2': (280, 35, 500, 265),
        'walk3': (520, 35, 750, 265),
        'walk4': (765, 35, 990, 265),
        'climb1': (95, 295, 280, 620),
        'climb2': (415, 295, 605, 620),
        'climb3': (740, 305, 930, 630),
        'stun1': (45, 700, 255, 960),
        'stun2': (275, 700, 490, 960),
        'squash1': (515, 850, 760, 960),
        'squash2': (760, 860, 990, 960),
    }

    # Clean and scale each sprite
    # Standard height for standing enemy is 26px
    cleaned = {}
    for name, box in sprites_boxes.items():
        crop = sheet.crop(box)
        cleaned[name] = clean_sprite_bg(crop)

    scale = 26.0 / cleaned['walk1'].size[1]

    scaled = {}
    for name, im in cleaned.items():
        tw = max(1, int(round(im.size[0] * scale)))
        th = max(1, int(round(im.size[1] * scale)))
        scaled[name] = im.resize((tw, th), Image.Resampling.LANCZOS)
        print(f'{name:10s}: {im.size} -> scaled {scaled[name].size}')

    # Load existing atlas to preserve roach (pickle) and fly (egg)
    old_atlas = Image.open('assets/enemies_atlas.png').convert('RGBA')
    
    # We create a new atlas with plenty of space: 512 x 120
    new_atlas = Image.new('RGBA', (512, 120), (0, 0, 0, 0))

    # Paste row 2 (roach) and row 3 (fly) from old atlas with offset
    # In old atlas:
    # Roach was at y: 33, Fly was at y: 61
    # We shift Roach to y: 45, and Fly to y: 78
    roach_strip = old_atlas.crop((0, 33, 256, 60))
    fly_strip = old_atlas.crop((0, 61, 256, 90))
    
    roach_new_y = 45
    fly_new_y = 78
    new_atlas.paste(roach_strip, (0, roach_new_y), roach_strip)
    new_atlas.paste(fly_strip, (0, fly_new_y), fly_strip)

    # Now lay out Row 1: Mouse (hotdog) sprites starting at x: 2, y: 2
    atlas_info = {}
    
    # Order of mouse sprites in atlas:
    # hotdog_walk1, hotdog_walk2, hotdog_walk3, hotdog_walk4, hotdog_walk5, hotdog_walk6,
    # hotdog_climb1, hotdog_climb2, hotdog_climb3,
    # hotdog_stunned, hotdog_stunned2,
    # hotdog_squashed, hotdog_squashed2
    
    mouse_sequence = [
        ('hotdog_walk1', scaled['walk1']),
        ('hotdog_walk2', scaled['walk2']),
        ('hotdog_walk3', scaled['walk3']),
        ('hotdog_walk4', scaled['walk4']),
        ('hotdog_walk5', scaled['walk1']), # walk5 is walk1
        ('hotdog_walk6', scaled['walk2']), # walk6 is walk2
        ('hotdog_climb1', scaled['climb1']),
        ('hotdog_climb2', scaled['climb2']),
        ('hotdog_climb3', scaled['climb3']),
        ('hotdog_stunned', scaled['stun1']),
        ('hotdog_stunned2', scaled['stun2']),
        ('hotdog_squashed', scaled['squash1']),
        ('hotdog_squashed2', scaled['squash2']),
    ]

    cur_x = 2
    for spr_name, sim in mouse_sequence:
        w, h = sim.size
        # Align vertically at y: 2
        new_atlas.paste(sim, (cur_x, 2), sim)
        atlas_info[spr_name] = {
            'x': cur_x,
            'y': 2,
            'w': w,
            'h': h
        }
        cur_x += w + 2  # 2px padding between sprites

    print(f'Mouse sprites placed up to x={cur_x}')

    # Save new atlas
    new_atlas.save('assets/enemies_atlas.png')
    print('Saved updated assets/enemies_atlas.png (512x120)')

    # Now update js/enemies_atlas.js
    with open('js/enemies_atlas.js', 'r', encoding='utf-8') as f:
        js_code = f.read()

    # We update both hotdog entries and the adjusted y coordinates for roach and fly
    # Roach y offset shift: 33 -> 45 (+12)
    # Fly y offset shift: 61 -> 78 (+17)
    
    # Let's read current ENEMIES_ATLAS_DATA
    import json
    # Replace hotdog definitions
    # Build complete new JS file
    lines = js_code.split('\n')
    
    # Generate JS entries
    hotdog_js = []
    for k, v in atlas_info.items():
        hotdog_js.append(f'  "{k}": {{\n    "x": {v["x"]},\n    "y": {v["y"]},\n    "w": {v["w"]},\n    "h": {v["h"]}\n  }},')

    # For roach (pickle) and fly (egg), update their y coordinates by +12 and +17
    # Let's inspect existing entries
    out_lines = [
        '/**',
        ' * Burger Panic Enemies Sprite Atlas Definitions - HD Arcade Edition',
        ' */',
        'window.ENEMIES_ATLAS_DATA = {'
    ]
    
    # Add hotdog entries
    out_lines.extend(hotdog_js)

    # Read the rest from js/enemies_atlas.js (pickle and egg)
    # Update y values
    import re
    pickle_egg_matches = re.findall(r'\"((?:pickle|egg)_[^\"]+)\":\s*\{\s*\"x\":\s*(\d+),\s*\"y\":\s*(\d+),\s*\"w\":\s*(\d+),\s*\"h\":\s*(\d+)\s*\}', js_code)
    
    for name, x, y, w, h in pickle_egg_matches:
        iy = int(y)
        if name.startswith('pickle_'):
            new_y = iy - 33 + roach_new_y
        else:
            new_y = iy - 61 + fly_new_y
        out_lines.append(f'  "{name}": {{\n    "x": {x},\n    "y": {new_y},\n    "w": {w},\n    "h": {h}\n  }},')

    # Remove trailing comma on last item
    if out_lines[-1].endswith(','):
        out_lines[-1] = out_lines[-1][:-1]

    out_lines.append('};')
    out_lines.append('')
    out_lines.append('// Register Kitchen Pest Aliases: mouse (Ratón), roach (Cucaracha), fly (Mosca)')
    out_lines.append('Object.keys(window.ENEMIES_ATLAS_DATA).forEach((k) => {')
    out_lines.append('  if (k.startsWith("hotdog_")) {')
    out_lines.append('    window.ENEMIES_ATLAS_DATA[k.replace("hotdog_", "mouse_")] = window.ENEMIES_ATLAS_DATA[k];')
    out_lines.append('  } else if (k.startsWith("pickle_")) {')
    out_lines.append('    window.ENEMIES_ATLAS_DATA[k.replace("pickle_", "roach_")] = window.ENEMIES_ATLAS_DATA[k];')
    out_lines.append('  } else if (k.startsWith("egg_")) {')
    out_lines.append('    window.ENEMIES_ATLAS_DATA[k.replace("egg_", "fly_")] = window.ENEMIES_ATLAS_DATA[k];')
    out_lines.append('  }')
    out_lines.append('});')

    with open('js/enemies_atlas.js', 'w', encoding='utf-8') as f:
        f.write('\n'.join(out_lines))
    print('Updated js/enemies_atlas.js successfully!')

    # Generate a gorgeous high-contrast preview canvas (640x480) with labels
    cw, ch = 640, 420
    preview = Image.new('RGBA', (cw, ch), (16, 14, 24, 255))
    from PIL import ImageDraw
    draw = ImageDraw.Draw(preview)
    draw.rectangle([(8, 8), (cw - 8, ch - 8)], outline=(228, 0, 88, 255), width=2)
    draw.rectangle([(10, 10), (cw - 10, 44)], fill=(32, 28, 48, 255))
    draw.text((25, 20), "EL RATON DE COCINA - NUEVO PIXEL ART HD ARCADE (16-BIT)", fill=(255, 215, 0, 255))

    # Draw checkerboard preview zones
    # Row 1: Walk Cycle 1-4 (scaled 3x)
    draw.text((25, 55), "1. CAMINATA / CORRER (4 frames HD)", fill=(0, 228, 255, 255))
    for i, wname in enumerate(['walk1', 'walk2', 'walk3', 'walk4']):
        sim = scaled[wname].resize((scaled[wname].size[0]*3, scaled[wname].size[1]*3), Image.NEAREST)
        preview.paste(sim, (30 + i * 90, 80), sim)

    # Row 2: Escaleras 1-3 (scaled 3x) - completely isolated, no ladder
    draw.text((25, 175), "2. ESCALERAS (3 frames espalda, pata alternada - SIN ESCALERA)", fill=(0, 228, 255, 255))
    for i, cname in enumerate(['climb1', 'climb2', 'climb3']):
        sim = scaled[cname].resize((scaled[cname].size[0]*3, scaled[cname].size[1]*3), Image.NEAREST)
        preview.paste(sim, (30 + i * 90, 200), sim)

    # Row 2 right: Stunned 1-2
    draw.text((360, 175), "3. ATURDIDO POR PIMIENTA", fill=(255, 180, 0, 255))
    for i, sname in enumerate(['stun1', 'stun2']):
        sim = scaled[sname].resize((scaled[sname].size[0]*3, scaled[sname].size[1]*3), Image.NEAREST)
        preview.paste(sim, (360 + i * 95, 200), sim)

    # Row 3: Squashed 1-2
    draw.text((25, 325), "4. APLASTADO POR HAMBURGUESA (Pancake)", fill=(57, 255, 20, 255))
    for i, sqname in enumerate(['squash1', 'squash2']):
        sim = scaled[sqname].resize((scaled[sqname].size[0]*3, scaled[sqname].size[1]*3), Image.NEAREST)
        preview.paste(sim, (30 + i * 110, 350), sim)

    out_prev = 'assets/raton_hd_preview.png'
    preview.save(out_prev)

    # Save to artifacts
    art_dir = r'C:\Users\User\.gemini\antigravity\brain\78f9aa15-5143-4115-b1aa-d068c68beb50'
    preview.save(os.path.join(art_dir, 'raton_hd_preview.png'))
    print(f'Saved preview to {out_prev} and artifact directory')

if __name__ == '__main__':
    build_new_mouse_atlas()
