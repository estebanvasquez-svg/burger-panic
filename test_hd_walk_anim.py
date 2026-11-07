import os
from PIL import Image, ImageDraw

def test_hd_walk():
    atlas = Image.open('assets/enemies_atlas.png')
    with open('js/enemies_atlas.js') as f:
        js = f.read()
    
    import re
    boxes = []
    for i in range(1, 5):
        pat = '"hotdog_walk' + str(i) + r'":\s*\{\s*"x":\s*(\d+),\s*"y":\s*(\d+),\s*"w":\s*(\d+),\s*"h":\s*(\d+)'
        m = re.search(pat, js)
        boxes.append([int(v) for v in m.groups()])

    frames = [atlas.crop((b[0], b[1], b[0] + b[2], b[1] + b[3])) for b in boxes]

    cw, ch = 280, 160
    scale = 3
    gif_frames = []

    for idx, f in enumerate(frames):
        canvas = Image.new('RGBA', (cw, ch), (18, 16, 26, 255))
        draw = ImageDraw.Draw(canvas)
        draw.rectangle([(2, 2), (cw - 3, ch - 3)], outline=(50, 45, 75, 255), width=2)
        draw.text((20, 15), "CAMINATA HD (16-BIT RETRO ARCADE)", fill=(0, 220, 255, 255))
        
        # Floor line
        fy = 120
        draw.rectangle([(15, fy), (cw - 15, fy + 4)], fill=(180, 140, 100, 255))
        draw.rectangle([(15, fy + 4), (cw - 15, fy + 6)], fill=(120, 90, 60, 255))
        
        # Scale sprite
        sf = f.resize((f.size[0] * scale, f.size[1] * scale), Image.NEAREST)
        
        # Ground anchoring: bottom of sprite touches floor line fy
        sx = 100 + ((idx * 8) % 60)
        sy = fy - sf.size[1]
        canvas.paste(sf, (sx, sy), sf)
        
        draw.text((20, ch - 22), "Animación suave con bandana y cola", fill=(160, 160, 180, 255))
        gif_frames.append(canvas)

    out_gif = 'assets/raton_hd_walk_anim.gif'
    gif_frames[0].save(out_gif, save_all=True, append_images=gif_frames[1:], duration=140, loop=0)
    
    art_dir = r'C:\Users\User\.gemini\antigravity\brain\78f9aa15-5143-4115-b1aa-d068c68beb50'
    gif_frames[0].save(os.path.join(art_dir, 'raton_hd_walk_anim.gif'), save_all=True, append_images=gif_frames[1:], duration=140, loop=0)
    print("Saved raton_hd_walk_anim.gif successfully!")

if __name__ == '__main__':
    test_hd_walk()
