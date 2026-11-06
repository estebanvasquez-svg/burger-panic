import os
from PIL import Image
import numpy as np
import scipy.ndimage as ndi

os.makedirs('assets/peter', exist_ok=True)

img = Image.open(r'C:/Users/INVESTIGACION 220/.gemini/antigravity/brain/a6a894a4-46dc-4a58-a501-57ea4d70730e/.user_uploaded/media_1793907305614_c29d82c6.jpg').convert('RGBA')
arr = np.array(img)

def extract_sprite(box, name):
    x1, y1, x2, y2 = box
    crop = arr[y1:y2, x1:x2].copy()
    h, w, _ = crop.shape

    # Detect background candidates: distance to dark navy [18, 20, 28]
    bg_ref = np.array([18.0, 20.0, 28.0])
    diff = np.sqrt(np.sum((crop[:, :, :3].astype(float) - bg_ref)**2, axis=2))
    is_bg_candidate = diff < 26.0

    # Flood fill from the outer perimeter
    labeled, num_features = ndi.label(is_bg_candidate)

    # Find which labels touch the borders of the crop
    border_mask = np.zeros((h, w), dtype=bool)
    border_mask[0, :] = True
    border_mask[-1, :] = True
    border_mask[:, 0] = True
    border_mask[:, -1] = True

    border_labels = np.unique(labeled[border_mask & is_bg_candidate])

    # True background is only the labels touching the border
    true_bg = np.isin(labeled, border_labels)

    # Set alpha
    alpha = np.where(true_bg, 0, 255).astype(np.uint8)
    crop[:, :, 3] = alpha

    # Trim any extra fully transparent border pixels
    non_empty_rows = np.where(np.any(crop[:, :, 3] > 0, axis=1))[0]
    non_empty_cols = np.where(np.any(crop[:, :, 3] > 0, axis=0))[0]

    if len(non_empty_rows) > 0 and len(non_empty_cols) > 0:
        crop = crop[non_empty_rows[0]:non_empty_rows[-1]+1, non_empty_cols[0]:non_empty_cols[-1]+1]

    res = Image.fromarray(crop)
    res.save(f'assets/peter/{name}.png')
    print(f"Saved {name}.png, size: {res.size}")
    return res

# Test on Detenido 1
extract_sprite((34, 30, 106, 180), "idle_1")
