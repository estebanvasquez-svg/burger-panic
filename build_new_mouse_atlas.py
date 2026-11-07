import os
import json
import numpy as np
from PIL import Image
import scipy.ndimage as ndi

def clean_sprite_bg(crop):
    arr = np.array(crop).copy()
    h, w, _ = arr.shape
    
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
    
    # Auto-crop transparent boundaries
    non_empty_r = np.where(np.any(crop_alpha[:, :, 3] > 0, axis=1))[0]
    non_empty_c = np.where(np.any(crop_alpha[:, :, 3] > 0, axis=0))[0]
    if len(non_empty_r) > 0 and len(non_empty_c) > 0:
        crop_alpha = crop_alpha[non_empty_r[0]:non_empty_r[-1]+1, non_empty_c[0]:non_empty_c[-1]+1]
    
    return Image.fromarray(crop_alpha)

def build_complete_atlas():
    # 1. Process HD Mouse Sprites
    src_sheet_path = r'C:\Users\User\.gemini\antigravity\brain\78f9aa15-5143-4115-b1aa-d068c68beb50\mouse_spritesheet_1794074165762.jpg'
    sheet = Image.open(src_sheet_path).convert('RGBA')
    
    mouse_boxes = {
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

    cleaned_mouse = {}
    for name, box in mouse_boxes.items():
        crop = sheet.crop(box)
        cleaned_mouse[name] = clean_sprite_bg(crop)

    scale = 26.0 / cleaned_mouse['walk1'].size[1]
    scaled_mouse = {}
    for name, im in cleaned_mouse.items():
        tw = max(1, int(round(im.size[0] * scale)))
        th = max(1, int(round(im.size[1] * scale)))
        scaled_mouse[name] = im.resize((tw, th), Image.Resampling.LANCZOS)

    # 2. Setup Atlas: 512 x 140
    atlas = Image.new('RGBA', (512, 140), (0, 0, 0, 0))
    atlas_data = {}

    # ROW 1: MOUSE (hotdog) - Y: 2
    row1_names = [
        ('hotdog_walk1', scaled_mouse['walk1']),
        ('hotdog_walk2', scaled_mouse['walk2']),
        ('hotdog_walk3', scaled_mouse['walk3']),
        ('hotdog_walk4', scaled_mouse['walk4']),
        ('hotdog_walk5', scaled_mouse['walk1']),
        ('hotdog_walk6', scaled_mouse['walk2']),
        ('hotdog_climb1', scaled_mouse['climb1']),
        ('hotdog_climb2', scaled_mouse['climb2']),
        ('hotdog_climb3', scaled_mouse['climb3']),
        ('hotdog_stunned', scaled_mouse['stun1']),
        ('hotdog_stunned2', scaled_mouse['stun2']),
        ('hotdog_squashed', scaled_mouse['squash1']),
        ('hotdog_squashed2', scaled_mouse['squash2']),
    ]

    cx = 2
    for name, img in row1_names:
        w, h = img.size
        atlas.paste(img, (cx, 2), img)
        atlas_data[name] = {'x': cx, 'y': 2, 'w': w, 'h': h}
        cx += w + 2

    # ROW 2: ROACH (pickle) - Y: 46
    pickle_order = [
        'pickle_walk1', 'pickle_walk2', 'pickle_walk3', 'pickle_walk4', 'pickle_walk5', 'pickle_walk6',
        'pickle_climb1', 'pickle_climb2', 'pickle_climb3',
        'pickle_stunned', 'pickle_stunned2',
        'pickle_squashed', 'pickle_squashed2'
    ]

    cx = 2
    y_row2 = 46
    for name in pickle_order:
        p = os.path.join('assets/enemies_game', f'{name}.png')
        if os.path.exists(p):
            im = Image.open(p).convert('RGBA')
            w, h = im.size
            atlas.paste(im, (cx, y_row2), im)
            atlas_data[name] = {'x': cx, 'y': y_row2, 'w': w, 'h': h}
            cx += w + 2

    # ROW 3: FLY (egg) - Y: 82
    egg_order = [
        'egg_walk1', 'egg_walk2', 'egg_walk3', 'egg_walk4', 'egg_walk5',
        'egg_climb1', 'egg_climb2', 'egg_climb3',
        'egg_stunned', 'egg_stunned2',
        'egg_squashed', 'egg_squashed2'
    ]

    cx = 2
    y_row3 = 82
    for name in egg_order:
        p = os.path.join('assets/enemies_game', f'{name}.png')
        if os.path.exists(p):
            im = Image.open(p).convert('RGBA')
            w, h = im.size
            atlas.paste(im, (cx, y_row3), im)
            atlas_data[name] = {'x': cx, 'y': y_row3, 'w': w, 'h': h}
            cx += w + 2

    # Save atlas
    atlas.save('assets/enemies_atlas.png')
    print('Generated complete atlas: assets/enemies_atlas.png (512x140)')

    # Generate js/enemies_atlas.js
    out_lines = [
        '/**',
        ' * Burger Panic Enemies Sprite Atlas Definitions - HD Arcade Edition',
        ' */',
        'window.ENEMIES_ATLAS_DATA = {'
    ]

    keys = list(atlas_data.keys())
    for i, k in enumerate(keys):
        v = atlas_data[k]
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

if __name__ == '__main__':
    build_complete_atlas()
