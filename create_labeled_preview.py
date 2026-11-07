import os
from PIL import Image, ImageDraw, ImageFont

def create_labeled_mouse_preview():
    # Load mouse_showcase.png
    src_path = 'assets/mouse_showcase.png'
    if not os.path.exists(src_path):
        print("Source not found")
        return

    src = Image.open(src_path)
    
    # Create a nice canvas with title and labels: 640x520
    canvas_w = 640
    canvas_h = 500
    preview = Image.new('RGBA', (canvas_w, canvas_h), (16, 14, 24, 255))
    draw = ImageDraw.Draw(preview)

    # Header border & title banner
    draw.rectangle([(10, 10), (canvas_w - 10, canvas_h - 10)], outline=(228, 0, 88, 255), width=2)
    draw.rectangle([(12, 12), (canvas_w - 12, 46)], fill=(32, 28, 48, 255))
    
    # Draw title
    title_text = "EL RATON DE COCINA - HOJA DE SPRITES (BURGER PANIC)"
    draw.text((25, 22), title_text, fill=(252, 180, 0, 255))

    # Paste the sprites showcase in the center: size 480x330 -> center at x=80, y=70
    preview.paste(src, (80, 70), src)

    # Section Labels
    # Row 1 Labels (Y: 180)
    draw.rectangle([(25, 175), (200, 195)], fill=(20, 20, 30, 220), outline=(0, 228, 255, 255))
    draw.text((32, 180), "1. CAMINATA / CORRER (4 frames)", fill=(0, 228, 255, 255))

    draw.rectangle([(420, 175), (615, 195)], fill=(20, 20, 30, 220), outline=(255, 215, 0, 255))
    draw.text((430, 180), "OLFATEO DE QUESO (Idle)", fill=(255, 215, 0, 255))

    # Row 2 Labels (Y: 275)
    draw.rectangle([(25, 275), (250, 295)], fill=(20, 20, 30, 220), outline=(0, 228, 255, 255))
    draw.text((32, 280), "2. ESCALERAS (3 frames espalda)", fill=(0, 228, 255, 255))

    draw.rectangle([(340, 275), (615, 295)], fill=(20, 20, 30, 220), outline=(255, 60, 60, 255))
    draw.text((350, 280), "3. ATURDIDO POR PIMIENTA (2 frames)", fill=(255, 60, 60, 255))

    # Row 3 Labels (Y: 375)
    draw.rectangle([(25, 375), (330, 395)], fill=(20, 20, 30, 220), outline=(57, 255, 20, 255))
    draw.text((32, 380), "4. APLASTADO POR HAMBURGUESA (Pancake)", fill=(57, 255, 20, 255))

    # Bottom notes
    notes = "Bandana roja de ladron | Pelaje plateado Neo-Geo | Orejas y cola dinamica"
    draw.text((30, 460), notes, fill=(180, 180, 200, 255))

    out_asset = 'assets/raton_sprites_preview.png'
    preview.save(out_asset)

    artifact_dest = r'C:\Users\User\.gemini\antigravity\brain\78f9aa15-5143-4115-b1aa-d068c68beb50\raton_sprites_preview.png'
    preview.save(artifact_dest)
    print(f"Generated labeled preview at {out_asset} and {artifact_dest}")

if __name__ == '__main__':
    create_labeled_mouse_preview()

