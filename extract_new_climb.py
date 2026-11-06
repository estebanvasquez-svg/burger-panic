import os
from PIL import Image
import numpy as np
import scipy.ndimage as ndi

img = Image.open(r'C:/Users/INVESTIGACION 220/.gemini/antigravity/brain/a6a894a4-46dc-4a58-a501-57ea4d70730e/.user_uploaded/media_1793908385250_03c39c3f.png').convert('RGBA')
arr = np.array(img)

# Boxes from detection
boxes = [
    (18, 10, 79, 112),
    (106, 11, 162, 114),
    (194, 11, 248, 116),
    (279, 10, 336, 112),
    (370, 10, 424, 106),
    (451, 9, 509, 103),
    (536, 11, 586, 111),
    (619, 14, 674, 116)
]

bg_ref = np.array([17.0, 20.0, 27.0])

os.makedirs('assets/peter', exist_ok=True)
os.makedirs('assets/peter_game', exist_ok=True)

target_h = 28 # standard height in game for Peter

for i, (x1, y1, x2, y2) in enumerate(boxes, start=1):
    crop = arr[y1:y2, x1:x2].copy()
    h, w, _ = crop.shape

    # Color difference from background
    diff = np.sqrt(np.sum((crop[:, :, :3].astype(float) - bg_ref)**2, axis=2))
    is_bg_candidate = diff < 26.0

    # Flood fill outer border to keep all internal dark outlines safe
    labeled, num_features = ndi.label(is_bg_candidate)
    border_mask = np.zeros((h, w), dtype=bool)
    border_mask[0, :] = True
    border_mask[-1, :] = True
    border_mask[:, 0] = True
    border_mask[:, -1] = True

    border_labels = np.unique(labeled[border_mask & is_bg_candidate])
    true_bg = np.isin(labeled, border_labels)

    alpha = np.where(true_bg, 0, 255).astype(np.uint8)
    crop[:, :, 3] = alpha

    # Auto-trim transparent borders
    non_empty_rows = np.where(np.any(crop[:, :, 3] > 0, axis=1))[0]
    non_empty_cols = np.where(np.any(crop[:, :, 3] > 0, axis=0))[0]
    if len(non_empty_rows) > 0 and len(non_empty_cols) > 0:
        crop = crop[non_empty_rows[0]:non_empty_rows[-1]+1, non_empty_cols[0]:non_empty_cols[-1]+1]

    raw = Image.fromarray(crop)
    raw.save(f'assets/peter/climb_{i}.png')

    scale = target_h / float(raw.height)
    gw = max(int(round(raw.width * scale)), 1)
    game_im = raw.resize((gw, target_h), Image.Resampling.LANCZOS)
    game_im.save(f'assets/peter_game/climb_{i}.png')
    print(f"Extracted climb_{i}: raw {raw.size} -> game {game_im.size}")

# Also replace old subiendo/bajando in peter_game with these new clean sprites
# subiendo_1..4 -> climb_1..4
# bajando_1..4 -> climb_5..8
for i in range(1, 5):
    im_up = Image.open(f'assets/peter_game/climb_{i}.png')
    im_up.save(f'assets/peter_game/subiendo_{i}.png')
    im_down = Image.open(f'assets/peter_game/climb_{i+4}.png')
    im_down.save(f'assets/peter_game/bajando_{i}.png')

print("All new climbing sprites saved and mapped!")
