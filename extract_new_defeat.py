import os
from PIL import Image
import numpy as np
import scipy.ndimage as ndi

img = Image.open(r'C:/Users/INVESTIGACION 220/.gemini/antigravity/brain/a6a894a4-46dc-4a58-a501-57ea4d70730e/.user_uploaded/media_1793909305701_1a863073.png').convert('RGBA')
arr = np.array(img)

# Sprite 1: sitting (9..77, 8..86)
# Sprite 2: slumped (94..168, 19..86)
boxes = [
    ("defeat_1", 9, 8, 78, 87),
    ("defeat_2", 94, 18, 169, 87)
]

bg_ref = np.array([16.0, 19.0, 26.0])

os.makedirs('assets/peter', exist_ok=True)
os.makedirs('assets/peter_game', exist_ok=True)

# Delete older defeat_3..6 from peter_game so atlas stays clean
for i in range(3, 7):
    p = f'assets/peter_game/defeat_{i}.png'
    if os.path.exists(p):
        os.remove(p)

for name, x1, y1, x2, y2 in boxes:
    crop = arr[y1:y2, x1:x2].copy()
    h, w, _ = crop.shape

    # Color difference from background
    diff = np.sqrt(np.sum((crop[:, :, :3].astype(float) - bg_ref)**2, axis=2))
    is_bg_candidate = diff < 26.0

    # Flood fill outer perimeter
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

    # Auto-trim
    non_empty_rows = np.where(np.any(crop[:, :, 3] > 0, axis=1))[0]
    non_empty_cols = np.where(np.any(crop[:, :, 3] > 0, axis=0))[0]
    if len(non_empty_rows) > 0 and len(non_empty_cols) > 0:
        crop = crop[non_empty_rows[0]:non_empty_rows[-1]+1, non_empty_cols[0]:non_empty_cols[-1]+1]

    raw = Image.fromarray(crop)
    raw.save(f'assets/peter/{name}.png')

    # Scale: standing Peter is ~145px tall -> 28px in game (scale ≈ 28/145 = 0.193)
    # Here, sitting Peter raw height is ~78px -> target_h ≈ 16px
    scale = 28.0 / 145.0
    target_h = max(int(round(raw.height * scale)), 1)
    target_w = max(int(round(raw.width * scale)), 1)

    game_im = raw.resize((target_w, target_h), Image.Resampling.LANCZOS)
    game_im.save(f'assets/peter_game/{name}.png')
    print(f"Saved {name}: raw {raw.size} -> game {game_im.size}")

print("New defeat sprites generated successfully!")
