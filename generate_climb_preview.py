import os
from PIL import Image, ImageDraw

def generate_climb_preview():
    # Palette
    C_OUTLINE  = (22, 18, 30, 255)
    C_FUR_SHD  = (80, 80, 96, 255)
    C_FUR_MID  = (136, 138, 154, 255)
    C_FUR_LGT  = (188, 192, 208, 255)
    C_PINK_SHD = (196, 108, 134, 255)
    C_PINK_MID = (255, 172, 194, 255)
    C_PINK_LGT = (255, 216, 230, 255)
    C_RED_SHD  = (168, 24, 40, 255)
    C_RED_MID  = (236, 44, 60, 255)
    C_RED_LGT  = (255, 112, 128, 255)

    cm = {
        'O': C_OUTLINE, 'D': C_FUR_SHD, 'G': C_FUR_MID, 'L': C_FUR_LGT,
        'p': C_PINK_SHD, 'P': C_PINK_MID, 'q': C_PINK_LGT,
        'r': C_RED_SHD, 'R': C_RED_MID, 'b': C_RED_LGT,
        'T': (255, 160, 184, 255),
        ' ': None
    }

    climb1 = [
        " OPP       PqP   ",
        " OppPqP   PPqqP  ",
        "  PqqPP   OPppO  ",
        "  OppPO  OGLLGO  ",
        "   OGLLDOOrRRO   ",
        "   OrRbbRGGGGDO  ",
        "  OGGGGGGGGGGDO  ",
        "  OGGGGGGGGGGDO  ",
        "  OGGGGGGGGGGDO T",
        "  OGGGGGDDGGDO TT",
        "  OGGGGGDDGGDO  T",
        "   OGG   OPP    T",
        "   OPP   Opp     ",
        "   Opp   OGG     ",
        "          OPP    ",
        "          Opp    "
    ]

    climb2 = [
        "   PqP     PqP   ",
        "  PqqPP   PPqqP  ",
        "  OppPO   OPppO  ",
        " OPPLLDOODLLPPO  ",
        " OppRbbRRrRROpp  ",
        "  OGGGGGGGGGGDO  ",
        "  OGGGGGGGGGGDO  ",
        "  OGGGGGGGGGGDO  ",
        "  OGGGGGGGGGGDO  ",
        "  OGGGGGDDGGGGDO ",
        "  OGGGGGDDGGGGDO ",
        "    OPP    OPP T ",
        "    Opp    Opp T ",
        "    OGG    OGG TT",
        "    OPP    OPP T ",
        "    Opp    Opp   "
    ]

    climb3 = [
        "   PqP       OPP ",
        "  PqqPP   PqPOpp ",
        "  OppPO   PPqqP  ",
        "  OGLLGO  OPppO  ",
        "   OrRROODLLGO   ",
        "  OGGGGDrRbbR    ",
        "  OGGGGGGGGGGDO  ",
        "  OGGGGGGGGGGDO  ",
        "T OGGGGGGGGGGDO  ",
        "TTOGGGGGDDGGDO   ",
        "T OGGGGGDDGGDO   ",
        "T   OPP   OGG    ",
        "    Opp   OPP    ",
        "    OGG   Opp    ",
        "   OPP           ",
        "   Opp           "
    ]

    frames_raw = [climb1, climb2, climb3, climb2]

    def render_matrix_to_img(mat):
        im = Image.new('RGBA', (17, 16), (0, 0, 0, 0))
        px = im.load()
        for r, row in enumerate(mat):
            for c, ch in enumerate(row):
                color = cm.get(ch)
                if color:
                    px[c, r] = color
        return im

    # Ladder drawer for side-by-side comparison
    def draw_kitchen_ladder(canvas, lx, w, h):
        d = ImageDraw.Draw(canvas)
        # Rails
        d.rectangle([(lx, 0), (lx + 2, h)], fill=(120, 140, 160, 255))
        d.rectangle([(lx + 20, 0), (lx + 22, h)], fill=(120, 140, 160, 255))
        # Rungs every 10px
        for ry in range(4, h, 10):
            d.rectangle([(lx + 2, ry), (lx + 20, ry + 2)], fill=(200, 220, 240, 255))

    # Scale 4x for high clarity preview
    scale = 4
    cw, ch = 340, 180
    gif_frames = []

    for idx, mat in enumerate(frames_raw):
        # Create canvas with dark arcade backdrop
        canvas = Image.new('RGBA', (cw, ch), (18, 16, 26, 255))
        draw = ImageDraw.Draw(canvas)

        # Border & Title
        draw.rectangle([(2, 2), (cw - 3, ch - 3)], outline=(50, 45, 75, 255), width=2)
        
        # Left Panel: SPRITE AISLADO (100% Transparente / Sin Escalera)
        draw.rectangle([(10, 10), (160, ch - 10)], fill=(28, 25, 40, 255), outline=(0, 220, 255, 255), width=1)
        # Checkerboard to prove transparency
        for cy in range(35, 145, 10):
            for cx in range(25, 145, 10):
                if ((cx // 10) + (cy // 10)) % 2 == 0:
                    draw.rectangle([(cx, cy), (cx + 9, cy + 9)], fill=(36, 32, 52, 255))
        draw.text((20, 16), "SPRITE SIN ESCALERA", fill=(0, 220, 255, 255))
        draw.text((25, ch - 22), "Fondo 100% Transparente", fill=(160, 160, 180, 255))

        # Right Panel: SIMULACION EN EL JUEGO (Sobre Escalera del Nivel)
        draw.rectangle([(170, 10), (cw - 10, ch - 10)], fill=(24, 22, 34, 255), outline=(255, 180, 0, 255), width=1)
        draw.text((185, 16), "EN EL JUEGO (BURGER PANIC)", fill=(255, 180, 0, 255))
        draw.text((185, ch - 22), "Limpio sobre la escalera del nivel", fill=(160, 160, 180, 255))

        # Draw Ladder in right panel
        ladder_canvas = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
        draw_kitchen_ladder(ladder_canvas, 240, 24, ch)
        canvas.paste(ladder_canvas, (0, 0), ladder_canvas)

        # Render Mouse Sprite
        sprite_im = render_matrix_to_img(mat)
        scaled_sprite = sprite_im.resize((17 * scale, 16 * scale), Image.NEAREST)

        # Paste left (transparent checkerboard)
        canvas.paste(scaled_sprite, (50, 48), scaled_sprite)

        # Paste right (over ladder, moving slightly vertically for climbing sensation)
        climb_y_offset = (idx * 4) % 16
        canvas.paste(scaled_sprite, (220, 48 - climb_y_offset), scaled_sprite)

        gif_frames.append(canvas)

    out_gif = 'assets/raton_escalera_animacion.gif'
    gif_frames[0].save(
        out_gif,
        save_all=True,
        append_images=gif_frames[1:],
        duration=220,
        loop=0
    )

    # Also save static high-res comparison image
    # Combine 3 frames side-by-side
    static_w, static_h = 580, 280
    static_img = Image.new('RGBA', (static_w, static_h), (16, 14, 24, 255))
    s_draw = ImageDraw.Draw(static_img)
    s_draw.rectangle([(4, 4), (static_w - 5, static_h - 5)], outline=(228, 0, 88, 255), width=2)
    s_draw.rectangle([(6, 6), (static_w - 7, 40)], fill=(32, 28, 48, 255))
    s_draw.text((20, 14), "EL RATON DE COCINA - ANIMACION DE ESCALADA (SIN ESCALERA)", fill=(255, 215, 0, 255))

    frame_labels = ["Frame 1: Pata Izq. Arriba", "Frame 2: Agarre Central", "Frame 3: Pata Der. Arriba"]
    for i, mat in enumerate([climb1, climb2, climb3]):
        box_x = 20 + i * 185
        s_draw.rectangle([(box_x, 50), (box_x + 170, 230)], fill=(24, 22, 34, 255), outline=(0, 228, 255, 255), width=1)
        # Checkerboard background
        for cy in range(70, 200, 10):
            for cx in range(box_x + 10, box_x + 160, 10):
                if ((cx // 10) + (cy // 10)) % 2 == 0:
                    s_draw.rectangle([(cx, cy), (cx + 9, cy + 9)], fill=(32, 30, 46, 255))
        
        sim = render_matrix_to_img(mat).resize((17 * 6, 16 * 6), Image.NEAREST)
        static_img.paste(sim, (box_x + 35, 85), sim)
        s_draw.text((box_x + 15, 205), frame_labels[i], fill=(255, 255, 255, 255))

    s_draw.text((25, 250), "Fondo 100% transparente: El motor dibuja la escalera debajo dinamicamente segun el tema del nivel", fill=(180, 180, 200, 255))
    out_static = 'assets/raton_escalada_limpia.png'
    static_img.save(out_static)

    # Artifact destinations
    art_dir = r'C:\Users\User\.gemini\antigravity\brain\78f9aa15-5143-4115-b1aa-d068c68beb50'
    static_img.save(os.path.join(art_dir, 'raton_escalada_limpia.png'))
    gif_frames[0].save(os.path.join(art_dir, 'raton_escalera_animacion.gif'), save_all=True, append_images=gif_frames[1:], duration=220, loop=0)
    print("Climb previews generated successfully!")

if __name__ == '__main__':
    generate_climb_preview()
