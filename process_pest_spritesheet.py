import os
import numpy as np
from PIL import Image
import scipy.ndimage as ndi

def clean_sprite_bg(crop):
    arr = np.array(crop).copy()
    h, w, _ = arr.shape
    
    # White background threshold
    is_white = (arr[:, :, 0] > 238) & (arr[:, :, 1] > 238) & (arr[:, :, 2] > 238)
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

def find_components_auto(img_path):
    im = Image.open(img_path).convert('RGB')
    arr = np.array(im)
    mask = np.mean(arr, axis=2) < 240
    labeled, num = ndi.label(mask)
    objs = ndi.find_objects(labeled)
    valid = []
    for s in objs:
        h = s[0].stop - s[0].start
        w = s[1].stop - s[1].start
        if h > 35 and w > 35:
            valid.append((s[0].start, s[1].start, s[0].stop, s[1].stop, w, h))
    
    # Sort by row (y // 100) then col (x)
    valid.sort(key=lambda b: (b[0] // 80, b[1]))
    return valid

if __name__ == '__main__':
    print('Pest sprite processor utility ready.')

