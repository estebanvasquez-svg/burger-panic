from PIL import Image
import numpy as np

img = Image.open(r'C:/Users/INVESTIGACION 220/.gemini/antigravity/brain/a6a894a4-46dc-4a58-a501-57ea4d70730e/.user_uploaded/media_1793908385250_03c39c3f.png')
arr = np.array(img)
bg_ref = np.array([17, 20, 27])
diff = np.sqrt(np.sum((arr[:15, :, :3].astype(float) - bg_ref)**2, axis=2))
print("Active pixels in rows 0..15:")
for y in range(15):
    act = np.where(diff[y, :] > 25)[0]
    if len(act) > 0:
        print(f"y={y}: count={len(act)}, x in [{act[0]}..{act[-1]}]")
