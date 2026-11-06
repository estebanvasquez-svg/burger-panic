import os
import json
from PIL import Image

sprites_dir = 'assets/peter_game'
files = sorted(os.listdir(sprites_dir))

# Measure total width and max height
images = {}
for f in files:
    if f.endswith('.png'):
        name = os.path.splitext(f)[0]
        im = Image.open(os.path.join(sprites_dir, f))
        images[name] = im

# Pack in a grid or row
# Let's pack in rows with padding = 2
atlas_w = 256
cur_x = 2
cur_y = 2
row_h = 0
coords = {}

placed = []
for name, im in images.items():
    w, h = im.size
    if cur_x + w + 2 > atlas_w:
        cur_x = 2
        cur_y += row_h + 2
        row_h = 0
    coords[name] = {
        'x': cur_x,
        'y': cur_y,
        'w': w,
        'h': h
    }
    placed.append((im, cur_x, cur_y))
    cur_x += w + 2
    row_h = max(row_h, h)

atlas_h = cur_y + row_h + 4

atlas = Image.new('RGBA', (atlas_w, atlas_h), (0, 0, 0, 0))
for im, x, y in placed:
    atlas.paste(im, (x, y))

atlas.save('assets/peter_atlas.png')
print(f"Atlas generated: assets/peter_atlas.png ({atlas_w}x{atlas_h})")

# Write JS mapping
with open('js/peter_atlas.js', 'w', encoding='utf-8') as f:
    f.write("/**\n * Peter Pepper Sprite Atlas Definitions\n */\n")
    f.write("window.PETER_ATLAS_DATA = " + json.dumps(coords, indent=2) + ";\n")

print("Generated js/peter_atlas.js!")
