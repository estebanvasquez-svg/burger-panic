from PIL import Image
import numpy as np

img = Image.open(r'C:/Users/INVESTIGACION 220/.gemini/antigravity/brain/a6a894a4-46dc-4a58-a501-57ea4d70730e/.user_uploaded/media_1793907305614_c29d82c6.jpg')
# Check horizontal transitions along a slice of Peter's face or hat
arr = np.array(img)
# Sample row 100, x from 50 to 90
row = arr[100, 50:90]
diffs = np.where(np.any(row[1:] != row[:-1], axis=1))[0]
step_sizes = diffs[1:] - diffs[:-1]
print("Step sizes in x:", step_sizes[:20])
