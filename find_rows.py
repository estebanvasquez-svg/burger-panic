from PIL import Image
import numpy as np

img = Image.open(r'C:/Users/INVESTIGACION 220/.gemini/antigravity/brain/a6a894a4-46dc-4a58-a501-57ea4d70730e/.user_uploaded/media_1793907305614_c29d82c6.jpg')
arr = np.array(img)

# Background is approx R <= 25, G <= 25, B <= 35
is_bg = (arr[:, :, 0] <= 30) & (arr[:, :, 1] <= 30) & (arr[:, :, 2] <= 40)
content = ~is_bg

# Project horizontally to find rows
row_proj = np.sum(content, axis=1)

print("Image height:", arr.shape[0])
for y in range(0, arr.shape[0], 20):
    val = np.sum(row_proj[y:y+20])
    if val > 100:
        print(f"y={y:3d}..{y+20:3d}: count={val}")
