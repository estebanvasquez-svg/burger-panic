import os
from PIL import Image

# Remove old pepper_left_3 and pepper_left_4 if they exist
for folder in ['assets/peter', 'assets/peter_game']:
    p3 = os.path.join(folder, 'pepper_left_3.png')
    p4 = os.path.join(folder, 'pepper_left_4.png')
    if os.path.exists(p3):
        os.remove(p3)
    if os.path.exists(p4):
        os.remove(p4)

# Invert pepper_right_1 and pepper_right_2 to create pepper_left_1 and pepper_left_2
for folder in ['assets/peter', 'assets/peter_game']:
    for i in (1, 2):
        src = os.path.join(folder, f'pepper_right_{i}.png')
        dst = os.path.join(folder, f'pepper_left_{i}.png')
        im = Image.open(src)
        flipped = im.transpose(Image.FLIP_LEFT_RIGHT)
        flipped.save(dst)
        print(f"Generated {dst} ({flipped.size})")

print("Pepper left sprites generated from inverted pepper right!")
