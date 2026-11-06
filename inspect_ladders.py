from PIL import Image
import numpy as np

img = Image.open(r'C:/Users/INVESTIGACION 220/.gemini/antigravity/brain/a6a894a4-46dc-4a58-a501-57ea4d70730e/.user_uploaded/media_1793907305614_c29d82c6.jpg')
# Check row 2: Subiendo vs Bajando
# In the original image:
# Subiendo la escalera (columns 1 to 4): is there a ladder behind Peter?
# Bajando la escalera (columns 5 to 8): there is a visible ladder behind Peter!
print("Loaded successfully")
