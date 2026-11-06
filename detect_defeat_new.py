import os
from PIL import Image
import numpy as np
import scipy.ndimage as ndi

img = Image.open(r'C:/Users/INVESTIGACION 220/.gemini/antigravity/brain/a6a894a4-46dc-4a58-a501-57ea4d70730e/.user_uploaded/media_1793909305701_1a863073.png').convert('RGBA')
arr = np.array(img)

bg_ref = np.array([16.0, 19.0, 26.0])
diff = np.sqrt(np.sum((arr[:, :, :3].astype(float) - bg_ref)**2, axis=2))
is_fg = diff > 24.0

col_proj = np.sum(is_fg, axis=0)
active = col_proj > 2
labeled, num_features = ndi.label(active)

print(f"Found {num_features} clusters:")
for f in range(1, num_features + 1):
    cols = np.where(labeled == f)[0]
    x_min, x_max = cols[0], cols[-1]
    w = x_max - x_min + 1
    if w > 10:
        char_sub = is_fg[:, x_min:x_max+1]
        rows = np.where(np.sum(char_sub, axis=1) > 2)[0]
        y_min, y_max = rows[0], rows[-1]
        h = y_max - y_min + 1
        print(f"  Sprite {f}: x={x_min:3d}..{x_max:3d} (w={w:2d}), y={y_min:3d}..{y_max:3d} (h={h:2d})")
