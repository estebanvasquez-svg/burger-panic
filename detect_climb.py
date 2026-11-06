import os
from PIL import Image
import numpy as np
import scipy.ndimage as ndi

img = Image.open(r'C:/Users/INVESTIGACION 220/.gemini/antigravity/brain/a6a894a4-46dc-4a58-a501-57ea4d70730e/.user_uploaded/media_1793908385250_03c39c3f.png').convert('RGBA')
arr = np.array(img)

bg_ref = np.array([17.0, 20.0, 27.0])
diff = np.sqrt(np.sum((arr[:, :, :3].astype(float) - bg_ref)**2, axis=2))
is_fg = diff > 24.0

# Horizontal projection
col_proj = np.sum(is_fg, axis=0)
active = col_proj > 8
labeled, num_features = ndi.label(active)

print(f"Found {num_features} clusters in image (width {img.width}, height {img.height}):")
clusters = []
for f in range(1, num_features + 1):
    cols = np.where(labeled == f)[0]
    x_min, x_max = cols[0], cols[-1]
    width = x_max - x_min + 1
    if width > 15:
        # Vertical bounds
        char_sub = is_fg[:, x_min:x_max+1]
        rows_active = np.where(np.sum(char_sub, axis=1) > 2)[0]
        y_min, y_max = rows_active[0], rows_active[-1]
        height = y_max - y_min + 1
        clusters.append((x_min, y_min, x_max, y_max))
        print(f"  Sprite {len(clusters)}: x={x_min:3d}..{x_max:3d} (w={width:2d}), y={y_min:3d}..{y_max:3d} (h={height:2d})")
