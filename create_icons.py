import os
from PIL import Image, ImageDraw

os.makedirs('icons', exist_ok=True)

def generate_icon(size):
    img = Image.new('RGBA', (size, size), (16, 16, 26, 255))
    draw = ImageDraw.Draw(img)
    scale = size / 64.0

    # Draw rounded arcade border
    margin = int(2 * scale)
    draw.rounded_rectangle([margin, margin, size - margin, size - margin], radius=int(12*scale), outline=(240, 160, 32), width=int(2.5*scale))

    # Pixel art burger stack
    # Bun top (gold/tan)
    bun_top_color = (235, 150, 40)
    sesame_color = (255, 240, 200)
    lettuce_color = (40, 200, 60)
    tomato_color = (220, 40, 40)
    cheese_color = (250, 210, 30)
    patty_color = (130, 60, 30)
    bun_bottom_color = (220, 140, 35)

    # Chef hat on top
    hat_color = (245, 245, 250)
    hx = int(24 * scale)
    hy = int(10 * scale)
    hw = int(16 * scale)
    hh = int(10 * scale)
    draw.rectangle([hx, hy, hx + hw, hy + hh], fill=hat_color)
    draw.rectangle([hx - int(3*scale), hy + int(7*scale), hx + hw + int(3*scale), hy + hh], fill=hat_color)

    # Bun Top
    bx = int(12 * scale)
    by = int(22 * scale)
    bw = int(40 * scale)
    bh = int(8 * scale)
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=int(4*scale), fill=bun_top_color)
    # Sesame seeds
    for sx, sy in [(20, 24), (32, 23), (44, 25), (26, 26), (38, 26)]:
        draw.rectangle([int(sx*scale), int(sy*scale), int((sx+1.5)*scale), int((sy+1.5)*scale)], fill=sesame_color)

    # Lettuce (wavy)
    lx = int(10 * scale)
    ly = int(32 * scale)
    lw = int(44 * scale)
    lh = int(4 * scale)
    draw.rectangle([lx, ly, lx + lw, ly + lh], fill=lettuce_color)

    # Tomato / Cheese
    tx = int(13 * scale)
    ty = int(37 * scale)
    tw = int(38 * scale)
    th = int(4 * scale)
    draw.rectangle([tx, ty, tx + tw, ty + th], fill=cheese_color)

    # Patty
    px = int(11 * scale)
    py = int(42 * scale)
    pw = int(42 * scale)
    ph = int(6 * scale)
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=int(2*scale), fill=patty_color)

    # Bun Bottom
    bbx = int(13 * scale)
    bby = int(49 * scale)
    bbw = int(38 * scale)
    bbh = int(6 * scale)
    draw.rounded_rectangle([bbx, bby, bbx + bbw, bby + bbh], radius=int(2*scale), fill=bun_bottom_color)

    return img

generate_icon(192).save('icons/icon-192.png')
generate_icon(512).save('icons/icon-512.png')
print("Icons generated successfully!")
