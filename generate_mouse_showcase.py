import os
from PIL import Image, ImageDraw

def create_stylized_mouse_showcase():
    # Width: 480, Height: 320 (Large high-contrast display with titles and animations)
    scale = 3  # 3x pixel art zoom for crisp inspection
    base_w, base_h = 160, 110
    img = Image.new('RGBA', (base_w, base_h), (12, 14, 20, 255))
    pixels = img.load()

    # Enhanced 16-color Neo-Geo Arcade Palette for "El Ratón Bandido de Cocina"
    C_OUTLINE  = (22, 18, 30, 255)      # Deep ink outline
    C_FUR_SHD  = (80, 80, 96, 255)      # Dark slate fur shadow
    C_FUR_MID  = (136, 138, 154, 255)   # Rich silver fur midtone
    C_FUR_LGT  = (188, 192, 208, 255)   # Soft platinum fur highlight
    C_PINK_SHD = (196, 108, 134, 255)   # Rosy pink shadow (ears/feet/tail)
    C_PINK_MID = (255, 172, 194, 255)   # Vibrant peach-pink (ears/snout/tail)
    C_PINK_LGT = (255, 216, 230, 255)   # Inner ear gleam
    C_RED_SHD  = (168, 24, 40, 255)     # Deep crimson bandana shadow
    C_RED_MID  = (236, 44, 60, 255)     # Cute bandit red bandana
    C_RED_LGT  = (255, 112, 128, 255)   # Bandana knot highlight
    C_WHITE    = (255, 255, 255, 255)   # Eye catchlight & whiskers
    C_BLACK    = (14, 12, 18, 255)      # Snout tip & beady eye pupils
    C_STAR_GLD = (255, 214, 32, 255)    # Dizzy stars
    C_STAR_ORG = (255, 152, 0, 255)     # Star glow

    cm = {
        'O': C_OUTLINE, 'D': C_FUR_SHD, 'G': C_FUR_MID, 'L': C_FUR_LGT,
        'p': C_PINK_SHD, 'P': C_PINK_MID, 'q': C_PINK_LGT,
        'r': C_RED_SHD, 'R': C_RED_MID, 'b': C_RED_LGT,
        'W': C_WHITE, 'K': C_BLACK, '*': C_STAR_GLD, '+': C_STAR_ORG,
        ' ': None
    }

    def put_sprite(mat, ox, oy):
        for r, row in enumerate(mat):
            for c, char in enumerate(row):
                col = cm.get(char)
                if col:
                    px, py = ox + c, oy + r
                    if 0 <= px < base_w and 0 <= py < base_h:
                        pixels[px, py] = col

    # 1. Walk Cycle (4 energetic keyframes with red bandit bandana & expressive tail)
    w1 = [
        "   PqP     PqP   ",
        "  PqqPP   PPqqP  ",
        "  PppPO   OPppP  ",
        "   OGLLLOOGLLLO  ",
        "  OGLLWKGGLLWKGO ",
        "  OGGLKKGGGLKKGO ",
        "   OGGPOPPGHGO   ",
        "   OrRbbRRrRRO   ",
        "  OGGRRRRRRRRDO  ",
        " OGGGLGGGGGDDDDO ",
        " OGGGLGGDGDDDDDO ",
        "  OGGGGGDDGGDO TT",
        "   OGG   OGG  OT ",
        "   OPP   OPP  T  ",
        "   Opp   Opp     ",
        "                 "
    ]

    w2 = [
        "   PqP     PqP   ",
        "  PqqPP   PPqqP  ",
        "  PppPO   OPppP  ",
        "   OGLLLOOGLLLO  ",
        "  OGLLWKGGLLWKGO ",
        "  OGGLKKGGGLKKGO ",
        "   OGGPOPPGHGO   ",
        "   OrRbbRRrRRO  T",
        "  OGGRRRRRRRRDO T",
        " OGGGLGGGGGDDDDOT",
        " OGGGLGGDGDDDDDO ",
        "  OGGGGGDDGGDO   ",
        "  OPP     OPP    ",
        "  Opp     Opp    ",
        "                 ",
        "                 "
    ]

    w3 = [
        "   PqP     PqP   ",
        "  PqqPP   PPqqP  ",
        "  PppPO   OPppP  ",
        "   OGLLLOOGLLLO  ",
        "  OGLLWKGGLLWKGO ",
        "  OGGLKKGGGLKKGO ",
        "   OGGPOPPGHGO   ",
        "   OrRbbRRrRRO TT",
        "  OGGRRRRRRRRDOT ",
        " OGGGLGGGGGDDDDT ",
        " OGGGLGGDGDDDDDOT",
        "  OGGGGGDDGGDO  T",
        "   OGG    OPP    ",
        "   OPP    Opp    ",
        "   Opp           ",
        "                 "
    ]

    w4 = [
        "   PqP     PqP   ",
        "  PqqPP   PPqqP  ",
        "  PppPO   OPppP  ",
        "   OGLLLOOGLLLO  ",
        "  OGLLWKGGLLWKGO ",
        "  OGGLKKGGGLKKGO ",
        "   OGGPOPPGHGO   ",
        "   OrRbbRRrRRO   ",
        "  OGGRRRRRRRRDO T",
        " OGGGLGGGGGDDDDOTT",
        " OGGGLGGDGDDDDDOT",
        "  OGGGGGDDGGDO  T",
        "    OPP   OGG    ",
        "    Opp   OPP    ",
        "          Opp    ",
        "                 "
    ]

    # 2. Ladder Climb Cycle (Back view - ABSOLUTELY NO LADDER, transparent background, climbing paws & bandana knot)
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

    # 3. Pepper Stunned Cycle (Swirling comic stars, dizzy spiral eyes, red bandana askew)
    stun1 = [
        "   *+*     *+*   ",
        "  PqP       PqP  ",
        " PqqPP     PPqqP ",
        " PppPO     OPppP ",
        "  OGLLLO OOGLLLO ",
        " OGLL**GG GLL**GO",
        " OGGL**GG GGL**GO",
        "  OGGPOPP PGHGO  ",
        "   OrRbbRR rRRO  ",
        "  OGGRRRRR RRRDO ",
        " OGGGLGGGG GDDDDO",
        "  OGGGGGDD GGDO T",
        "   OGG  OG G  OT ",
        "   OPP  OP P  T  ",
        "   Opp  Op p     ",
        "                 "
    ]

    stun2 = [
        "  +*+       +*+  ",
        "  PqP       PqP  ",
        " PqqPP     PPqqP ",
        " PppPO     OPppP ",
        "  OGLLLO OOGLLLO ",
        " OGLL**GG GLL**GO",
        " OGGL**GG GGL**GO",
        "  OGGPOPP PGHGO  ",
        "   OrRbbRR rRRO  ",
        "  OGGRRRRR RRRDO ",
        "  OGGGGGDD GGDO T",
        "   OPP    OPP  TT",
        "   Opp    Opp  T ",
        "                 ",
        "                 ",
        "                 "
    ]

    # 4. Squashed Pancake Cycle (Comically flat under burger, eyes popped, red bandana spread)
    squash1 = [
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "   PqP     PqP   ",
        "  PqqPP   PPqqP  ",
        "OGLLWKWK GGLLWKWGO",
        "OrRbbRRr RrRbbRRrO",
        "OGGGGHPO PGGGGGGDO",
        " OPPPPPP PPPPPDO T",
        "  Oppppp pppppOTTT"
    ]

    squash2 = [
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "   PqP     PqP   ",
        "OGLLWKWK GGLLWKWGO",
        "OrRbbRRr RrRbbRRrO",
        " OGGGGGG GGGGGDO T",
        " OPPPPPP PPPPPDO T",
        "  Oppppp pppppOTTT"
    ]

    # 5. Sniffing Cheese / Sneak Idle Pose
    idle_sniff = [
        "     PqP   PqP   ",
        "    PqqP   PqqP  ",
        "    PppP   PppP  ",
        "    OGLLLOOGLLLO ",
        "    OGLLWKGGLLWKO",
        "    OGGLKKGGGLKKO",
        "    OGGPOPPGHGO  ",
        "     OrRbbRRrO   ",
        "    OGGRRRRRRDO  ",
        "   OGGGLGGGGDDDO ",
        "   OGGGLGGDGDDDOT",
        "    OGGGGGDDGDO T",
        "     OPP   OPP  T",
        "     Opp   Opp  T",
        "                 ",
        "                 "
    ]

    # Layout on preview sheet:
    # Row 1: Walk Cycle (1 to 4) + Idle Sniff (Y: 10)
    put_sprite(w1, 10, 10)
    put_sprite(w2, 34, 10)
    put_sprite(w3, 58, 10)
    put_sprite(w4, 82, 10)
    put_sprite(idle_sniff, 114, 10)

    # Row 2: Climbing Ladder (1 to 3) + Stunned (1 to 2) (Y: 42)
    put_sprite(climb1, 10, 42)
    put_sprite(climb2, 34, 42)
    put_sprite(climb3, 58, 42)
    put_sprite(stun1, 88, 42)
    put_sprite(stun2, 114, 42)

    # Row 3: Squashed Pancake (1 to 2) (Y: 74)
    put_sprite(squash1, 20, 74)
    put_sprite(squash2, 60, 74)

    # Upscale 3x with NEAREST filter for razor-sharp pixel art display
    final_img = img.resize((base_w * scale, base_h * scale), Image.NEAREST)
    out_dir = 'assets'
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'mouse_showcase.png')
    final_img.save(out_path)
    print(f"Mouse showcase generated at {out_path} ({final_img.size[0]}x{final_img.size[1]})")

if __name__ == '__main__':
    create_stylized_mouse_showcase()

