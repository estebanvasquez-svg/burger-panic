import os
import json
import numpy as np
from PIL import Image, ImageDraw
import scipy.ndimage as ndi

def clean_sprite_bg(crop):
    arr = np.array(crop).copy()
    h, w, _ = arr.shape
    
    # White background threshold
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
    crop_alpha = arr.copy()
    crop_alpha[:, :, 3] = alpha
    
    non_empty_r = np.where(np.any(crop_alpha[:, :, 3] > 0, axis=1))[0]
    non_empty_c = np.where(np.any(crop_alpha[:, :, 3] > 0, axis=0))[0]
    if len(non_empty_r) > 0 and len(non_empty_c) > 0:
        crop_alpha = crop_alpha[non_empty_r[0]:non_empty_r[-1]+1, non_empty_c[0]:non_empty_c[-1]+1]
    
    return Image.fromarray(crop_alpha)

def process_roach():
    src_path = r'C:\Users\User\.gemini\antigravity\brain\78f9aa15-5143-4115-b1aa-d068c68beb50\cockroach_spritesheet_1794079422351.jpg'
    sheet = Image.open(src_path).convert('RGBA')
    
    # Coordinates from inspection:
    # Walk 1..4
    # Climb 1..3
    # Stun 1..2
    # Squash 1..2
    boxes = {
        'walk1': (55, 35, 245, 270),
        'walk2': (295, 35, 490, 270),
        'walk3': (540, 35, 735, 270),
        'walk4': (785, 35, 975, 270),
        'climb1': (110, 320, 290, 560),
        'climb2': (420, 295, 605, 575),
        'climb3': (730, 270, 915, 565),
        'stun1': (200, 575, 430, 820),
        'stun2': (605, 575, 835, 820),
        'squash1': (125, 840, 450, 980),
        'squash2': (555, 850, 910, 980),
    }

    cleaned = {}
    for k, b in boxes.items():
        crop = sheet.crop(b)
        cleaned[k] = clean_sprite_bg(crop)

    # Scale: standard height 26px
    scale = 26.0 / cleaned['walk1'].size[1]
    scaled = {}
    for k, im in cleaned.items():
        tw = max(1, int(round(im.size[0] * scale)))
        th = max(1, int(round(im.size[1] * scale)))
        scaled[k] = im.resize((tw, th), Image.Resampling.LANCZOS)
        print(f'Roach {k:10s}: {im.size} -> scaled {scaled[k].size}')
    
    return scaled

def process_fly():
    src_path = r'C:\Users\User\.gemini\antigravity\brain\78f9aa15-5143-4115-b1aa-d068c68beb50\la_mosca_spritesheet_clean_1794079468895.jpg'
    sheet = Image.open(src_path).convert('RGBA')
    
    boxes = {
        'walk1': (50, 40, 235, 235),
        'walk2': (295, 40, 480, 235),
        'walk3': (535, 40, 725, 235),
        'walk4': (780, 65, 975, 240),
        'climb1': (155, 310, 345, 515),
        'climb2': (415, 310, 600, 515),
        'climb3': (680, 310, 865, 515),
        'stun1': (260, 575, 450, 775),
        'stun2': (545, 595, 745, 775),
        'squash1': (150, 855, 480, 980),
        'squash2': (565, 880, 815, 970),
    }

    cleaned = {}
    for k, b in boxes.items():
        crop = sheet.crop(b)
        cleaned[k] = clean_sprite_bg(crop)

    # Scale: fly is compact hovering bug, standard height ~22px
    scale = 22.0 / cleaned['walk1'].size[1]
    scaled = {}
    for k, im in cleaned.items():
        tw = max(1, int(round(im.size[0] * scale)))
        th = max(1, int(round(im.size[1] * scale)))
        scaled[k] = im.resize((tw, th), Image.Resampling.LANCZOS)
        print(f'Fly   {k:10s}: {im.size} -> scaled {scaled[k].size}')
    
    return scaled

def build_ultimate_atlas():
    # Process all pests
    roach_sprites = process_roach()
    fly_sprites = process_fly()

    # Load existing atlas to preserve Mouse row 1
    existing_atlas = Image.open('assets/enemies_atlas.png').convert('RGBA')
    mouse_row = existing_atlas.crop((0, 0, 512, 42))

    # Master canvas: 512 x 150
    master = Image.new('RGBA', (512, 150), (0, 0, 0, 0))
    master.paste(mouse_row, (0, 0), mouse_row)

    # Read current atlas_data for Mouse
    with open('js/enemies_atlas.js', 'r', encoding='utf-8') as f:
        js_code = f.read()

    import re
    hotdog_matches = re.findall(r'\"(hotdog_[^\"]+)\":\s*\{\s*\"x\":\s*(\d+),\s*\"y\":\s*(\d+),\s*\"w\":\s*(\d+),\s*\"h\":\s*(\d+)\s*\}', js_code)
    
    final_atlas_data = {}
    for name, x, y, w, h in hotdog_matches:
        final_atlas_data[name] = {'x': int(x), 'y': int(y), 'w': int(w), 'h': int(h)}

    # ROW 2: ROACH (pickle) - Y: 46
    roach_sequence = [
        ('pickle_walk1', roach_sprites['walk1']),
        ('pickle_walk2', roach_sprites['walk2']),
        ('pickle_walk3', roach_sprites['walk3']),
        ('pickle_walk4', roach_sprites['walk4']),
        ('pickle_walk5', roach_sprites['walk1']),
        ('pickle_walk6', roach_sprites['walk2']),
        ('pickle_climb1', roach_sprites['climb1']),
        ('pickle_climb2', roach_sprites['climb2']),
        ('pickle_climb3', roach_sprites['climb3']),
        ('pickle_stunned', roach_sprites['stun1']),
        ('pickle_stunned2', roach_sprites['stun2']),
        ('pickle_squashed', roach_sprites['squash1']),
        ('pickle_squashed2', roach_sprites['squash2']),
    ]

    cx = 2
    y_roach = 46
    for name, sim in roach_sequence:
        w, h = sim.size
        master.paste(sim, (cx, y_roach), sim)
        final_atlas_data[name] = {'x': cx, 'y': y_roach, 'w': w, 'h': h}
        cx += w + 2

    print(f'Roach row placed up to x={cx}')

    # ROW 3: FLY (egg) - Y: 84
    fly_sequence = [
        ('egg_walk1', fly_sprites['walk1']),
        ('egg_walk2', fly_sprites['walk2']),
        ('egg_walk3', fly_sprites['walk3']),
        ('egg_walk4', fly_sprites['walk4']),
        ('egg_walk5', fly_sprites['walk1']),
        ('egg_climb1', fly_sprites['climb1']),
        ('egg_climb2', fly_sprites['climb2']),
        ('egg_climb3', fly_sprites['climb3']),
        ('egg_stunned', fly_sprites['stun1']),
        ('egg_stunned2', fly_sprites['stun2']),
        ('egg_squashed', fly_sprites['squash1']),
        ('egg_squashed2', fly_sprites['squash2']),
    ]

    cx = 2
    y_fly = 84
    for name, sim in fly_sequence:
        w, h = sim.size
        master.paste(sim, (cx, y_fly), sim)
        final_atlas_data[name] = {'x': cx, 'y': y_fly, 'w': w, 'h': h}
        cx += w + 2

    print(f'Fly row placed up to x={cx}')

    # Save atlas
    master.save('assets/enemies_atlas.png')
    print('Saved master atlas: assets/enemies_atlas.png (512x150)')

    # Generate js/enemies_atlas.js
    out_lines = [
        '/**',
        ' * Burger Panic Enemies Sprite Atlas Definitions - HD Arcade Edition (All Pests)',
        ' */',
        'window.ENEMIES_ATLAS_DATA = {'
    ]

    keys = list(final_atlas_data.keys())
    for i, k in enumerate(keys):
        v = final_atlas_data[k]
        comma = ',' if i < len(keys) - 1 else ''
        out_lines.append(f'  "{k}": {{\n    "x": {v["x"]},\n    "y": {v["y"]},\n    "w": {v["w"]},\n    "h": {v["h"]}\n  }}{comma}')

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

    # Generate animations and preview showcases for Roach and Fly
    create_previews('cucaracha', roach_sprites, 'LA CUCARACHA DE COCINA (HD 16-BIT)')
    create_previews('mosca', fly_sprites, 'LA MOSCA DE COCINA (HD 16-BIT)')

def create_previews(pest_name, sprites, title):
    scale = 3
    cw, ch = 340, 200
    
    # 1. Climbing Animation GIF (Isolated vs. Over Ladder)
    climb_frames = [sprites['climb1'], sprites['climb2'], sprites['climb3'], sprites['climb2']]
    gif_frames = []
    for idx, f in enumerate(climb_frames):
        canvas = Image.new('RGBA', (cw, ch), (20, 18, 30, 255))
        draw = ImageDraw.Draw(canvas)
        draw.rectangle([(2, 2), (cw - 3, ch - 3)], outline=(60, 50, 90, 255), width=2)
        
        # Left Panel: Transparent isolated
        draw.rectangle([(10, 10), (160, ch - 10)], fill=(30, 26, 44, 255), outline=(0, 220, 255, 255))
        for cy in range(35, 160, 10):
            for cx in range(25, 145, 10):
                if ((cx // 10) + (cy // 10)) % 2 == 0:
                    draw.rectangle([(cx, cy), (cx + 9, cy + 9)], fill=(40, 36, 58, 255))
        draw.text((20, 16), "SPRITE SIN ESCALERA", fill=(0, 220, 255, 255))
        draw.text((20, ch - 24), "100% Transparente", fill=(180, 180, 200, 255))

        # Right Panel: Over in-game ladder
        draw.rectangle([(170, 10), (cw - 10, ch - 10)], fill=(26, 24, 38, 255), outline=(255, 180, 0, 255))
        draw.text((185, 16), "SOBRE ESCALERA DE JUEGO", fill=(255, 180, 0, 255))
        draw.text((185, ch - 24), "Animación en tiempo real", fill=(180, 180, 200, 255))

        # Draw ladder
        lx = 240
        draw.rectangle([(lx, 0), (lx + 2, ch)], fill=(120, 140, 160, 255))
        draw.rectangle([(lx + 22, 0), (lx + 24, ch)], fill=(120, 140, 160, 255))
        for ry in range(4, ch, 12):
            draw.rectangle([(lx + 2, ry), (lx + 22, ry + 2)], fill=(200, 220, 240, 255))

        sf = f.resize((f.size[0] * scale, f.size[1] * scale), Image.NEAREST)
        canvas.paste(sf, (55, 45), sf)
        y_offset = (idx * 5) % 15
        canvas.paste(sf, (222, 45 - y_offset), sf)
        gif_frames.append(canvas)

    out_climb_gif = f'assets/{pest_name}_hd_climb_anim.gif'
    gif_frames[0].save(out_climb_gif, save_all=True, append_images=gif_frames[1:], duration=180, loop=0)

    # 2. Walk Animation GIF
    walk_frames = [sprites[f'walk{i}'] for i in [1, 2, 3, 4]]
    walk_gif = []
    w_cw, w_ch = 280, 160
    for idx, f in enumerate(walk_frames):
        canvas = Image.new('RGBA', (w_cw, w_ch), (18, 16, 26, 255))
        draw = ImageDraw.Draw(canvas)
        draw.rectangle([(2, 2), (w_cw - 3, w_ch - 3)], outline=(50, 45, 75, 255), width=2)
        draw.text((20, 15), f"CAMINATA / VUELO HD", fill=(0, 220, 255, 255))
        
        fy = 120
        draw.rectangle([(15, fy), (w_cw - 15, fy + 4)], fill=(180, 140, 100, 255))
        draw.rectangle([(15, fy + 4), (w_cw - 15, fy + 6)], fill=(120, 90, 60, 255))
        
        sf = f.resize((f.size[0] * scale, f.size[1] * scale), Image.NEAREST)
        sx = 100 + ((idx * 8) % 60)
        sy = fy - sf.size[1]
        canvas.paste(sf, (sx, sy), sf)
        draw.text((20, w_ch - 22), "16-Bit Retro Arcade HD", fill=(160, 160, 180, 255))
        walk_gif.append(canvas)

    out_walk_gif = f'assets/{pest_name}_hd_walk_anim.gif'
    walk_gif[0].save(out_walk_gif, save_all=True, append_images=walk_gif[1:], duration=140, loop=0)

    # 3. Static Showcase Canvas (640x420)
    scw, sch = 640, 420
    preview = Image.new('RGBA', (scw, sch), (16, 14, 24, 255))
    draw = ImageDraw.Draw(preview)
    draw.rectangle([(8, 8), (scw - 8, sch - 8)], outline=(228, 0, 88, 255), width=2)
    draw.rectangle([(10, 10), (scw - 10, 44)], fill=(32, 28, 48, 255))
    draw.text((25, 20), title, fill=(255, 215, 0, 255))

    # Row 1: Walk Cycle 1-4
    draw.text((25, 55), "1. CAMINATA / DESPLAZAMIENTO (4 frames HD)", fill=(0, 228, 255, 255))
    for i, wname in enumerate(['walk1', 'walk2', 'walk3', 'walk4']):
        sim = sprites[wname].resize((sprites[wname].size[0]*3, sprites[wname].size[1]*3), Image.NEAREST)
        preview.paste(sim, (30 + i * 90, 80), sim)

    # Row 2: Escaleras 1-3
    draw.text((25, 175), "2. ESCALERAS (3 frames espalda - 100% SIN ESCALERA)", fill=(0, 228, 255, 255))
    for i, cname in enumerate(['climb1', 'climb2', 'climb3']):
        sim = sprites[cname].resize((sprites[cname].size[0]*3, sprites[cname].size[1]*3), Image.NEAREST)
        preview.paste(sim, (30 + i * 90, 200), sim)

    # Row 2 right: Stunned 1-2
    draw.text((360, 175), "3. ATURDIDO POR PIMIENTA", fill=(255, 180, 0, 255))
    for i, sname in enumerate(['stun1', 'stun2']):
        sim = sprites[sname].resize((sprites[sname].size[0]*3, sprites[sname].size[1]*3), Image.NEAREST)
        preview.paste(sim, (360 + i * 95, 200), sim)

    # Row 3: Squashed 1-2
    draw.text((25, 325), "4. APLASTADO POR HAMBURGUESA (Pancake)", fill=(57, 255, 20, 255))
    for i, sqname in enumerate(['squash1', 'squash2']):
        sim = sprites[sqname].resize((sprites[sqname].size[0]*3, sprites[sqname].size[1]*3), Image.NEAREST)
        preview.paste(sim, (30 + i * 110, 350), sim)

    out_prev = f'assets/{pest_name}_hd_preview.png'
    preview.save(out_prev)

    # Copy all to brain artifact dir
    art_dir = r'C:\Users\User\.gemini\antigravity\brain\78f9aa15-5143-4115-b1aa-d068c68beb50'
    for fpath in [out_climb_gif, out_walk_gif, out_prev]:
        base = os.path.basename(fpath)
        Image.open(fpath).save(os.path.join(art_dir, base))
    print(f'Saved previews and animations for {pest_name}')

if __name__ == '__main__':
    build_ultimate_atlas()
