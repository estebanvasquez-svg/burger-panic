import os
import json
from PIL import Image
import numpy as np
import scipy.ndimage as ndi

os.makedirs('assets/enemies_game', exist_ok=True)
os.makedirs('assets/enemies_raw', exist_ok=True)

img_path = r'C:\Users\User\.gemini\antigravity\brain\78f9aa15-5143-4115-b1aa-d068c68beb50\burger_panic_enemies_spritesheet_1794015890695.jpg'
img = Image.open(img_path).convert('RGBA')
arr = np.array(img)

# Named sprites mapping to bounding boxes
# (x1, y1, x2, y2)
named_boxes = {
    # FRANK (HOT DOG)
    'hotdog_walk1': (42, 78, 117, 204),
    'hotdog_walk2': (137, 78, 211, 204),
    'hotdog_walk3': (231, 78, 307, 204),
    'hotdog_walk4': (331, 78, 405, 204),
    'hotdog_walk5': (426, 78, 493, 203),
    'hotdog_walk6': (512, 78, 586, 204),
    'hotdog_climb1': (622, 65, 689, 204),
    'hotdog_climb2': (708, 65, 779, 204),
    'hotdog_climb3': (795, 65, 862, 204),
    'hotdog_stunned': (907, 65, 996, 204),
    'hotdog_stunned2': (1011, 71, 1100, 204),
    'hotdog_squashed': (1121, 167, 1221, 203),
    'hotdog_squashed2': (1235, 168, 1350, 203),

    # DILL (PICKLE)
    'pickle_walk1': (42, 332, 119, 471),
    'pickle_walk2': (141, 332, 213, 471),
    'pickle_walk3': (238, 332, 315, 472),
    'pickle_walk4': (337, 332, 410, 470),
    'pickle_walk5': (436, 332, 493, 472),
    'pickle_walk6': (522, 332, 582, 472),
    'pickle_climb1': (624, 330, 689, 472),
    'pickle_climb2': (709, 330, 775, 472),
    'pickle_climb3': (798, 330, 861, 472),
    'pickle_stunned': (906, 339, 979, 472),
    'pickle_stunned2': (1003, 330, 1080, 472),
    'pickle_squashed': (1097, 436, 1213, 471),
    'pickle_squashed2': (1226, 441, 1351, 471),

    # SUNNY (FRIED EGG)
    'egg_walk1': (39, 617, 134, 725),
    'egg_walk2': (150, 617, 248, 725),
    'egg_walk3': (265, 617, 361, 725),
    'egg_walk4': (374, 617, 469, 725),
    'egg_walk5': (484, 617, 580, 725),
    'egg_climb1': (607, 600, 688, 725),
    'egg_climb2': (706, 600, 775, 725),
    'egg_climb3': (793, 600, 863, 725),
    'egg_stunned': (891, 600, 981, 725),
    'egg_stunned2': (995, 600, 1085, 725),
    'egg_squashed': (1101, 697, 1214, 724),
    'egg_squashed2': (1230, 697, 1344, 724),
}

# Scale factor mapping based on standing walk height
scale_factors = {
    'hotdog': 26.0 / 126.0,
    'pickle': 26.0 / 140.0,
    'egg': 22.0 / 108.0,
}

extracted_images = {}

for name, box in named_boxes.items():
    x1, y1, x2, y2 = box
    crop = arr[y1:y2, x1:x2].copy()
    h, w, _ = crop.shape

    # Background threshold: dark background pixels
    is_bg_candidate = (crop[:, :, 0] < 34) & (crop[:, :, 1] < 34) & (crop[:, :, 2] < 34)

    # Flood fill outer border to only remove external background
    labeled, num_features = ndi.label(is_bg_candidate)
    border_mask = np.zeros((h, w), dtype=bool)
    border_mask[0, :] = True
    border_mask[-1, :] = True
    border_mask[:, 0] = True
    border_mask[:, -1] = True

    border_labels = np.unique(labeled[border_mask & is_bg_candidate])
    true_bg = np.isin(labeled, border_labels)

    # All candidate black background or enclosed black (inside ladders)
    true_bg = is_bg_candidate

    alpha = np.where(true_bg, 0, 255).astype(np.uint8)
    crop[:, :, 3] = alpha

    # Auto-crop transparent boundaries
    non_empty_rows = np.where(np.any(crop[:, :, 3] > 0, axis=1))[0]
    non_empty_cols = np.where(np.any(crop[:, :, 3] > 0, axis=0))[0]

    if len(non_empty_rows) > 0 and len(non_empty_cols) > 0:
        crop = crop[non_empty_rows[0]:non_empty_rows[-1]+1, non_empty_cols[0]:non_empty_cols[-1]+1]

    raw_img = Image.fromarray(crop)
    raw_img.save(f'assets/enemies_raw/{name}.png')

    # Find character type
    ctype = name.split('_')[0]
    sf = scale_factors[ctype]

    # For squashed, enforce proportional height
    new_w = max(1, int(round(raw_img.width * sf)))
    new_h = max(1, int(round(raw_img.height * sf)))

    # In case squashed is too small vertically, ensure min height of 7px
    if 'squashed' in name:
        new_h = max(7, new_h)

    game_img = raw_img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Clean semi-transparent dark halos caused by lanczos on black edges
    g_arr = np.array(game_img)
    halo_mask = (g_arr[:, :, 3] < 50) | ((g_arr[:, :, 0] < 20) & (g_arr[:, :, 1] < 20) & (g_arr[:, :, 2] < 20) & (g_arr[:, :, 3] < 120))
    g_arr[halo_mask, 3] = 0
    game_img = Image.fromarray(g_arr)

    game_img.save(f'assets/enemies_game/{name}.png')
    extracted_images[name] = game_img
    print(f'Extracted {name}: raw={raw_img.size} -> game={game_img.size}')

# Build Atlas
atlas_w = 256
cur_x = 2
cur_y = 2
row_h = 0
coords = {}
placed = []

for name, im in extracted_images.items():
    w, h = im.size
    if cur_x + w + 2 > atlas_w:
        cur_x = 2
        cur_y += row_h + 2
        row_h = 0
    coords[name] = {
        'x': cur_x,
        'y': cur_y,
        'w': w,
        'h': h
    }
    placed.append((im, cur_x, cur_y))
    cur_x += w + 2
    row_h = max(row_h, h)

atlas_h = cur_y + row_h + 4

atlas = Image.new('RGBA', (atlas_w, atlas_h), (0, 0, 0, 0))
for im, x, y in placed:
    atlas.paste(im, (x, y))

atlas.save('assets/enemies_atlas.png')
print(f'Atlas generated: assets/enemies_atlas.png ({atlas_w}x{atlas_h})')

# Write JS mapping
with open('js/enemies_atlas.js', 'w', encoding='utf-8') as f:
    f.write('/**\n * Burger Panic Enemies Sprite Atlas Definitions\n */\n')
    f.write('window.ENEMIES_ATLAS_DATA = ' + json.dumps(coords, indent=2) + ';\n')

print('Generated js/enemies_atlas.js!')
