import os
from PIL import Image

for i in range(1, 5):
    # Flip raw asset
    src_raw = f'assets/peter/run_right_{i}.png'
    dst_raw = f'assets/peter/run_left_{i}.png'
    if os.path.exists(src_raw):
        im_raw = Image.open(src_raw)
        flipped_raw = im_raw.transpose(Image.FLIP_LEFT_RIGHT)
        flipped_raw.save(dst_raw)
        print(f"Generated {dst_raw}")

    # Flip game asset
    src_game = f'assets/peter_game/run_right_{i}.png'
    dst_game = f'assets/peter_game/run_left_{i}.png'
    if os.path.exists(src_game):
        im_game = Image.open(src_game)
        flipped_game = im_game.transpose(Image.FLIP_LEFT_RIGHT)
        flipped_game.save(dst_game)
        print(f"Generated {dst_game}")

print("Flipping completed!")
