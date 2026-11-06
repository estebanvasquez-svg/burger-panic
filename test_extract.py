import os
from PIL import Image
import numpy as np

os.makedirs('assets/peter', exist_ok=True)

img = Image.open(r'C:/Users/INVESTIGACION 220/.gemini/antigravity/brain/a6a894a4-46dc-4a58-a501-57ea4d70730e/.user_uploaded/media_1793907305614_c29d82c6.jpg').convert('RGBA')
arr = np.array(img)

# Crop Detenido 1: x=34..105, y=30..180
crop = arr[30:180, 34:106].copy()

# Sample background from top-left corner of crop
bg_color = np.median(crop[:5, :5, :3], axis=(0,1))
print("Median BG color:", bg_color)

# Compute color difference
diff = np.sqrt(np.sum((crop[:, :, :3].astype(float) - bg_color)**2, axis=2))
alpha = np.where(diff < 22, 0, 255).astype(np.uint8)

# Smooth slight edge fringing
alpha_img = Image.fromarray(alpha, mode='L')
crop[:, :, 3] = alpha

result = Image.fromarray(crop)
result.save('assets/peter/test_idle.png')
print("Saved test_idle.png, size:", result.size)
