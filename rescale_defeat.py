import os
from PIL import Image

im1 = Image.open('assets/peter/defeat_1.png')
im2 = Image.open('assets/peter/defeat_2.png')

# Scale im1 to height = 22 (larger, prominent on 240x320 canvas)
scale1 = 22.0 / float(im1.height)
w1 = int(round(im1.width * scale1))
g1 = im1.resize((w1, 22), Image.Resampling.LANCZOS)
g1.save('assets/peter_game/defeat_1.png')
print(f"Rescaled defeat_1: {g1.size}")

# Scale im2 with the same scale factor so proportions match perfectly
w2 = int(round(im2.width * scale1))
h2 = int(round(im2.height * scale1))
g2 = im2.resize((w2, h2), Image.Resampling.LANCZOS)
g2.save('assets/peter_game/defeat_2.png')
print(f"Rescaled defeat_2: {g2.size}")
