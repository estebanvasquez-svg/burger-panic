from PIL import Image, ImageDraw
import numpy as np
import scipy.ndimage as ndi

img = Image.open(r'C:/Users/INVESTIGACION 220/.gemini/antigravity/brain/a6a894a4-46dc-4a58-a501-57ea4d70730e/.user_uploaded/media_1793907305614_c29d82c6.jpg')
arr = np.array(img)

# Detect background: background color is close to [18, 20, 28]
dist = np.sqrt(np.sum((arr.astype(float) - np.array([18, 20, 28]))**2, axis=2))
is_foreground = dist > 20

# Filter out the title at the top (y < 35) and text labels
# Let's inspect each row range
rows = [
    ("row1", 30, 180),
    ("row2", 215, 365),
    ("row3", 395, 525),
    ("row4", 550, 715)
]

for row_name, y1, y2 in rows:
    sub = is_foreground[y1:y2, :]
    # Horizontal projection
    col_proj = np.sum(sub, axis=0)
    # Find contiguous column intervals where count > 10
    active = col_proj > 8
    labeled, num_features = ndi.label(active)
    print(f"\n{row_name} (y={y1}..{y2}): found {num_features} clusters")
    for f in range(1, num_features + 1):
        cols = np.where(labeled == f)[0]
        x_min, x_max = cols[0], cols[-1]
        width = x_max - x_min + 1
        if width > 15: # Ignore small dots/specs
            # Now find exact vertical bounds in this box
            char_sub = sub[:, x_min:x_max+1]
            rows_active = np.where(np.sum(char_sub, axis=1) > 2)[0]
            if len(rows_active) > 0:
                cy1 = y1 + rows_active[0]
                cy2 = y1 + rows_active[-1]
                print(f"  Cluster {f}: x={x_min:3d}..{x_max:3d} (w={width:2d}), y={cy1:3d}..{cy2:3d} (h={cy2-cy1+1:2d})")
