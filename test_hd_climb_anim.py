import os
from PIL import Image, ImageDraw

def test_hd_climb():
    atlas = Image.open('assets/enemies_atlas.png')
    
    # Climb frames in new atlas:
    # hotdog_climb1: x: 164, y: 2, w: 21, h: 37
    # Let's read exact coords from js/enemies_atlas.js
    with open('js/enemies_atlas.js') as f:
        js = f.read()
    
    import re
    c1 = re.search(r'\"hotdog_climb1\":\s*\{\s*\"x\":\s*(\d+),\s*\"y\":\s*(\d+),\s*\"w\":\s*(\d+),\s*\"h\":\s*(\d+)', js)
    c2 = re.search(r'\"hotdog_climb2\":\s*\{\s*\"x\":\s*(\d+),\s*\"y\":\s*(\d+),\s*\"w\":\s*(\d+),\s*\"h\":\s*(\d+)', js)
    c3 = re.search(r'\"hotdog_climb3\":\s*\{\s*\"x\":\s*(\d+),\s*\"y\":\s*(\d+),\s*\"w\":\s*(\d+),\s*\"h\":\s*(\d+)', js)

    boxes = [
        [int(v) for v in c1.groups()],
        [int(v) for v in c2.groups()],
        [int(v) for v in c3.groups()],
    ]

    frames = [atlas.crop((b[0], b[1], b[0] + b[2], b[1] + b[3])) for b in boxes]
    frames.append(frames[1])

    cw, ch = 340, 200
    scale = 3
    gif_frames = []

    for idx, f in enumerate(frames):
        canvas = Image.new('RGBA', (cw, ch), (20, 18, 30, 255))
        draw = ImageDraw.Draw(canvas)
        draw.rectangle([(2, 2), (cw - 3, ch - 3)], outline=(60, 50, 90, 255), width=2)
        
        # Left Panel: Transparent isolated
        draw.rectangle([(10, 10), (160, ch - 10)], fill=(30, 26, 44, 255), outline=(0, 220, 255, 255))
        for cy in range(35, 160, 10):
            for cx in range(25, 145, 10):
                if ((cx // 10) + (cy // 10)) % 2 == 0:
                    draw.rectangle([(cx, cy), (cx + 9, cy + 9)], fill=(40, 36, 58, 255))
        draw.text((20, 16), "HD PIXEL ART LIMPIO", fill=(0, 220, 255, 255))
        draw.text((20, ch - 24), "100% Sin Escalera", fill=(180, 180, 200, 255))

        # Right Panel: Over in-game ladder
        draw.rectangle([(170, 10), (cw - 10, ch - 10)], fill=(26, 24, 38, 255), outline=(255, 180, 0, 255))
        draw.text((185, 16), "SOBRE ESCALERA DE JUEGO", fill=(255, 180, 0, 255))
        draw.text((185, ch - 24), "Animación en tiempo real", fill=(180, 180, 200, 255))

        # Draw ladder in right panel
        lx = 240
        draw.rectangle([(lx, 0), (lx + 2, ch)], fill=(120, 140, 160, 255))
        draw.rectangle([(lx + 22, 0), (lx + 24, ch)], fill=(120, 140, 160, 255))
        for ry in range(4, ch, 12):
            draw.rectangle([(lx + 2, ry), (lx + 22, ry + 2)], fill=(200, 220, 240, 255))

        # Paste mouse
        sf = f.resize((f.size[0] * scale, f.size[1] * scale), Image.NEAREST)
        canvas.paste(sf, (55, 45), sf)
        
        y_offset = (idx * 5) % 15
        canvas.paste(sf, (222, 45 - y_offset), sf)
        gif_frames.append(canvas)

    out_gif = 'assets/raton_hd_climb_anim.gif'
    gif_frames[0].save(out_gif, save_all=True, append_images=gif_frames[1:], duration=200, loop=0)
    
    # Copy to artifact
    art_dir = r'C:\Users\User\.gemini\antigravity\brain\78f9aa15-5143-4115-b1aa-d068c68beb50'
    gif_frames[0].save(os.path.join(art_dir, 'raton_hd_climb_anim.gif'), save_all=True, append_images=gif_frames[1:], duration=200, loop=0)
    print("Saved raton_hd_climb_anim.gif successfully!")

if __name__ == '__main__':
    test_hd_climb()

