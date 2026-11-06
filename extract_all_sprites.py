import os
from PIL import Image
import numpy as np
import scipy.ndimage as ndi

os.makedirs('assets/peter', exist_ok=True)
os.makedirs('assets/peter_game', exist_ok=True)

img = Image.open(r'C:/Users/INVESTIGACION 220/.gemini/antigravity/brain/a6a894a4-46dc-4a58-a501-57ea4d70730e/.user_uploaded/media_1793907305614_c29d82c6.jpg').convert('RGBA')
arr = np.array(img)

# Sprite dictionary: name -> (x1, y1, x2, y2)
sprites_def = {
    # ROW 1
    'detenido_1': (34, 30, 106, 180),
    'detenido_2': (158, 30, 230, 180),
    'run_left_1': (290, 30, 375, 180),
    'run_left_2': (405, 30, 490, 180),
    'run_right_1': (525, 30, 620, 180),
    'run_right_2': (660, 30, 750, 180),
    'run_right_3': (780, 50, 870, 180),
    'run_right_4': (900, 50, 985, 180),

    # ROW 2: ESCALERAS
    'subiendo_1': (34, 215, 108, 365),
    'subiendo_2': (158, 215, 235, 365),
    'subiendo_3': (280, 215, 375, 365),
    'subiendo_4': (410, 215, 485, 365),
    'bajando_1': (535, 215, 630, 365),
    'bajando_2': (655, 215, 750, 365),
    'bajando_3': (778, 215, 870, 365),
    'bajando_4': (895, 215, 990, 365),

    # ROW 3: PIMIENTA / SAL
    'pepper_left_1': (40, 395, 136, 525),
    'pepper_left_2': (160, 395, 265, 525),
    'pepper_left_3': (300, 395, 395, 525),
    'pepper_left_4': (405, 395, 515, 525),
    'pepper_right_1': (655, 395, 760, 525),
    'pepper_right_2': (775, 395, 880, 525),

    # ROW 4: DERROTA & VICTORIA
    'defeat_1': (40, 550, 120, 710),
    'defeat_2': (150, 550, 240, 710),
    'defeat_3': (260, 550, 385, 710),
    'defeat_4': (395, 550, 515, 710),
    'defeat_5': (530, 550, 635, 710),
    'defeat_6': (650, 550, 760, 710),
    'victory_1': (775, 550, 885, 715),
    'victory_2': (895, 550, 1000, 715),
}

bg_ref = np.array([18.0, 20.0, 28.0])

for name, box in sprites_def.items():
    x1, y1, x2, y2 = box
    crop = arr[y1:y2, x1:x2].copy()
    h, w, _ = crop.shape

    # Color difference from dark background
    diff = np.sqrt(np.sum((crop[:, :, :3].astype(float) - bg_ref)**2, axis=2))
    is_bg_candidate = diff < 26.0

    # Flood fill outer border to only remove external background
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

    # Auto-crop transparent boundaries
    non_empty_rows = np.where(np.any(crop[:, :, 3] > 0, axis=1))[0]
    non_empty_cols = np.where(np.any(crop[:, :, 3] > 0, axis=0))[0]

    if len(non_empty_rows) > 0 and len(non_empty_cols) > 0:
        crop = crop[non_empty_rows[0]:non_empty_rows[-1]+1, non_empty_cols[0]:non_empty_cols[-1]+1]

    raw_img = Image.fromarray(crop)
    raw_img.save(f'assets/peter/{name}.png')

    # Also generate pixel-art downscaled version for game (preserving pixel aspect ratio)
    # Target height around 26-28 pixels for character standing
    # Standing sprites are ~140-150px tall, so scale by ~0.19 (h ≈ 28px)
    target_h = 28
    if 'defeat_5' in name or 'defeat_6' in name:
        target_h = int(raw_img.height * (28.0 / 145.0))
    scale = target_h / float(raw_img.height)
    target_w = max(int(round(raw_img.width * scale)), 1)
    
    # Use LANCZOS or NEAREST for crisp pixel art
    game_img = raw_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    game_img.save(f'assets/peter_game/{name}.png')

print("All sprites extracted successfully!")
