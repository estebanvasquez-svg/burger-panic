import os
from PIL import Image, ImageDraw

def create_plagas_atlas():
    atlas = Image.new('RGBA', (256, 90), (0, 0, 0, 0))
    pixels = atlas.load()

    # Color Palettes (Rich Retro Arcade 16-color palettes)
    # 1. MOUSE (Ratón de Cocina)
    C_M_OUTLINE = (28, 24, 38, 255)
    C_M_BODY = (140, 140, 156, 255)
    C_M_LIGHT = (180, 180, 200, 255)
    C_M_DARK = (92, 92, 108, 255)
    C_M_PINK = (255, 176, 196, 255)
    C_M_PINK_D = (216, 130, 152, 255)
    C_M_WHITE = (255, 255, 255, 255)
    C_M_BLACK = (20, 16, 28, 255)
    C_M_TAIL = (255, 160, 184, 255)
    C_M_RED_SHD = (168, 24, 40, 255)
    C_M_RED_MID = (236, 44, 60, 255)
    C_M_RED_LGT = (255, 112, 128, 255)
    C_STAR = (255, 216, 32, 255)

    # 2. ROACH (Cucaracha de Cocina)
    C_R_OUTLINE = (40, 16, 8, 255)
    C_R_BODY = (160, 80, 32, 255)
    C_R_LIGHT = (216, 120, 48, 255)
    C_R_DARK = (96, 40, 16, 255)
    C_R_ANTENNA = (232, 136, 64, 255)
    C_R_BOOTS = (224, 56, 40, 255)
    C_R_BOOTS_D = (144, 24, 16, 255)
    C_R_WING_SHINE = (240, 152, 72, 255)

    # 3. FLY (Mosca Metálica de Cocina)
    C_F_OUTLINE = (16, 20, 28, 255)
    C_F_BODY = (32, 128, 160, 255)
    C_F_BODY_L = (48, 168, 200, 255)
    C_F_BODY_D = (16, 72, 96, 255)
    C_F_EYES = (232, 24, 48, 255)
    C_F_EYES_L = (255, 80, 112, 255)
    C_F_WING = (192, 240, 255, 220)
    C_F_WING_D = (136, 208, 240, 255)
    C_F_LEGS = (24, 28, 36, 255)

    def draw_matrix(mat, char_map, start_x, start_y):
        for r, row in enumerate(mat):
            for c, char in enumerate(row):
                if char in char_map and char_map[char] is not None:
                    px = start_x + c
                    py = start_y + r
                    if 0 <= px < 256 and 0 <= py < 90:
                        pixels[px, py] = char_map[char]

    # =========================================================================
    # ROW 1: MOUSE (RATÓN DE COCINA) - Y: 2
    # =========================================================================
    cm_mouse = {
        'O': C_M_OUTLINE, 'G': C_M_BODY, 'H': C_M_LIGHT, 'D': C_M_DARK,
        'P': C_M_PINK, 'p': C_M_PINK_D, 'W': C_M_WHITE, 'K': C_M_BLACK,
        'T': C_M_TAIL, 'r': C_M_RED_SHD, 'R': C_M_RED_MID, 'b': C_M_RED_LGT,
        '*': C_STAR, ' ': None
    }

    # Mouse Walk Frames 1-6
    m_walk1 = [
        "  PPP      PPP   ",
        " PHHPP    PPHP   ",
        " PHGHPO  OPGHP   ",
        "  OGHHHOOGHHHO   ",
        " OGGHWKGGHWKGO   ",
        " OGGHKKGGHKKGO   ",
        "  OGGHPOPGHGO    ",
        "  OGGGGGGGGGDO   ",
        " OGGHWWHGGGGDO  T",
        " OGGHWWHDDDGDO TT",
        "  OGGGGGDDGGDO T ",
        "   OGG  OGG  OT  ",
        "   OPP  OPP  OT  ",
        "   OpP  OpP  T   ",
        "                 ",
        "                 "
    ]

    m_walk2 = [
        "  PPP      PPP   ",
        " PHHPP    PPHP   ",
        " PHGHPO  OPGHP   ",
        "  OGHHHOOGHHHO   ",
        " OGGHWKGGHWKGO   ",
        " OGGHKKGGHKKGO   ",
        "  OGGHPOPGHGO    ",
        "  OGGGGGGGGGDO  T",
        " OGGHWWHGGGGDO  T",
        " OGGHWWHDDDGDO  T",
        "  OGGGGGDDGGDO T ",
        "  OPP    OPP   T ",
        "  OpP    OpP  T  ",
        "                 ",
        "                 ",
        "                 "
    ]

    m_walk3 = [
        "  PPP      PPP   ",
        " PHHPP    PPHP   ",
        " PHGHPO  OPGHP   ",
        "  OGHHHOOGHHHO   ",
        " OGGHWKGGHWKGO   ",
        " OGGHKKGGHKKGO   ",
        "  OGGHPOPGHGO    ",
        "  OGGGGGGGGGDO T ",
        " OGGHWWHGGGGDO TT",
        " OGGHWWHDDDGDO  T",
        "  OGGGGGDDGGDO  T",
        "   OGG    OPP   T",
        "   OPP    OpP    ",
        "   OpP           ",
        "                 ",
        "                 "
    ]

    m_walk4 = [
        "  PPP      PPP   ",
        " PHHPP    PPHP   ",
        " PHGHPO  OPGHP   ",
        "  OGHHHOOGHHHO   ",
        " OGGHWKGGHWKGO   ",
        " OGGHKKGGHKKGO   ",
        "  OGGHPOPGHGO    ",
        "  OGGGGGGGGGDO   ",
        " OGGHWWHGGGGDO T ",
        " OGGHWWHDDDGDO TT",
        "  OGGGGGDDGGDO  T",
        "    OPP  OGG    T",
        "    OpP  OPP    T",
        "         OpP     ",
        "                 ",
        "                 "
    ]

    # Mouse Climb Frames 1-3 (Back view - 100% Isolated, NO LADDER, clean transparent background)
    m_climb1 = [
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

    m_climb2 = [
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

    m_climb3 = [
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

    # Mouse Stunned 1-2
    m_stun1 = [
        "  PPP      PPP   ",
        " PHHPP    PPHP   ",
        " PHGHPO  OPGHP   ",
        "  OGHHHOOGHHHO   ",
        " OGGH**GGH**GO   ",
        " OGGH**GGH**GO   ",
        "  OGGHPOPGHGO    ",
        "  OGGGGGGGGGDO   ",
        " OGGHWWHGGGGDO  T",
        " OGGHWWHDDDGDO TT",
        "  OGGGGGDDGGDO T ",
        "   OGG  OGG  OT  ",
        "   OPP  OPP   T  ",
        "   OpP  OpP      ",
        "                 ",
        "                 "
    ]

    m_stun2 = [
        "  PPP      PPP   ",
        " PHHPP    PPHP   ",
        " PHGHPO  OPGHP   ",
        "  OGHHHOOGHHHO   ",
        " OGGH**GGH**GO   ",
        " OGGH**GGH**GO   ",
        "  OGGHPOPGHGO    ",
        "  OGGGGGGGGGDO   ",
        " OGGHWWHDDDGDO  T",
        "  OGGGGGDDGGDO TT",
        "   OPP    OPP  T ",
        "   OpP    OpP  T ",
        "                 ",
        "                 ",
        "                 ",
        "                 "
    ]

    # Mouse Squashed 1-2
    m_squash1 = [
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "                 ",
        "  PPP      PPP   ",
        " PHHPP    PPHP   ",
        "OGGHWKWKGGHWKWGO ",
        "OGGGGHPOPGGGGGGO ",
        " OGGGGGGGGGGGDO  ",
        "  OPPPPPPPPPDO TT",
        "   OpPpPpPpPO TT "
    ]

    m_squash2 = [
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
        "  PPP      PPP   ",
        "OGGHWKWKGGHWKWGO ",
        "OGGGGHPOPGGGGGGO ",
        " OGGGGGGGGGGGDO T",
        "  OPPPPPPPPPDO TT",
        "   OpPpPpPpPO TT "
    ]

    # Draw Mouse Sprites at Row 1 coordinates (matching enemies_atlas.js)
    draw_matrix(m_walk1, cm_mouse, 2, 2)    # hotdog_walk1
    draw_matrix(m_walk2, cm_mouse, 19, 2)   # hotdog_walk2
    draw_matrix(m_walk3, cm_mouse, 36, 2)   # hotdog_walk3
    draw_matrix(m_walk4, cm_mouse, 54, 2)   # hotdog_walk4
    draw_matrix(m_walk1, cm_mouse, 71, 2)   # hotdog_walk5
    draw_matrix(m_walk2, cm_mouse, 87, 2)   # hotdog_walk6
    draw_matrix(m_climb1, cm_mouse, 104, 2) # hotdog_climb1
    draw_matrix(m_climb2, cm_mouse, 120, 2) # hotdog_climb2
    draw_matrix(m_climb3, cm_mouse, 137, 2) # hotdog_climb3
    draw_matrix(m_stun1, cm_mouse, 153, 2)  # hotdog_stunned
    draw_matrix(m_stun2, cm_mouse, 173, 2)  # hotdog_stunned2
    draw_matrix(m_squash1, cm_mouse, 193, 2)# hotdog_squashed
    draw_matrix(m_squash2, cm_mouse, 216, 2)# hotdog_squashed2

    # =========================================================================
    # ROW 2: ROACH (CUCARACHA DE COCINA) - Y: 33
    # =========================================================================
    cm_roach = {
        'O': C_R_OUTLINE, 'A': C_R_ANTENNA, 'B': C_R_BODY, 'H': C_R_LIGHT,
        'L': C_R_WING_SHINE, 'D': C_R_DARK, 'S': C_R_BOOTS, 's': C_R_BOOTS_D,
        '*': C_STAR, 'W': (255, 255, 255, 255), 'K': (24, 12, 8, 255), ' ': None
    }

    r_walk1 = [
        " A            A ",
        "  A          A  ",
        "   A   OO   A   ",
        "    A OKKO A    ",
        "   OOBWWBOO     ",
        "  AOOBHHLBOOA   ",
        " A OOBHLLBOO A  ",
        "   OOBHLLBOO    ",
        "  AOBBHHLLBD A  ",
        " A ODBBHHBBD  A ",
        "   ODDBBBDDO    ",
        "    ODD  ODD    ",
        "   OSS    OSS   ",
        "   Oss    Oss   ",
        "                ",
        "                "
    ]

    r_walk2 = [
        " A            A ",
        "  A          A  ",
        "   A   OO   A   ",
        "    A OKKO A    ",
        "   OOBWWBOO     ",
        " A OOBHHLBOO A  ",
        "  AOOBHLLBOOA   ",
        "   OOBHLLBOO    ",
        " A ODBBHHBBD  A ",
        "  AOBBHHLLBD A  ",
        "   ODDBBBDDO    ",
        "   OSS    OSS   ",
        "   Oss    Oss   ",
        "                ",
        "                ",
        "                "
    ]

    r_walk3 = [
        "  A          A  ",
        "   A   OO   A   ",
        "    A OKKO A    ",
        "   OOBWWBOO     ",
        "  AOOBHHLBOOA   ",
        " A OOBHLLBOO A  ",
        "   OOBHLLBOO    ",
        "  AOBBHHLLBD A  ",
        " A ODBBHHBBD  A ",
        "   ODDBBBDDO    ",
        "    ODD  ODD    ",
        "    OSS  OSS    ",
        "    Oss  Oss    ",
        "                ",
        "                ",
        "                "
    ]

    r_walk4 = [
        " A            A ",
        "  A          A  ",
        "   A   OO   A   ",
        "    A OKKO A    ",
        "   OOBWWBOO     ",
        " A OOBHHLBOO A  ",
        "  AOOBHLLBOOA   ",
        "   OOBHLLBOO    ",
        "  AOBBHHLLBD A  ",
        " A ODBBHHBBD  A ",
        "   ODDBBBDDO    ",
        "   OSS    OSS   ",
        "   Oss    Oss   ",
        "                ",
        "                ",
        "                "
    ]

    r_climb1 = [
        " A            A ",
        "  A   OOOO   A  ",
        "   A OBBHHO A   ",
        "    OBBHHBBO    ",
        "  AOOBHHLLBOOA  ",
        " A OOBHLLBOO A  ",
        "   OOBHLLBOO    ",
        "  AOBBHHLLBD A  ",
        " A ODBBHHBBD  A ",
        "   ODDBBBDDO    ",
        "   OSS    OSS   ",
        "   Oss    Oss   ",
        "  OSS      OSS  ",
        "  Oss      Oss  ",
        "                ",
        "                "
    ]

    r_climb2 = [
        " A            A ",
        "  A   OOOO   A  ",
        "   A OBBHHO A   ",
        "    OBBHHBBO    ",
        " A OOBHHLLBOO A ",
        "  AOOBHLLBOOA   ",
        "   OOBHLLBOO    ",
        " A ODBBHHBBD  A ",
        "  AOBBHHLLBD A  ",
        "   ODDBBBDDO    ",
        "  OSS      OSS  ",
        "  Oss      Oss  ",
        "   OSS    OSS   ",
        "   Oss    Oss   ",
        "                ",
        "                "
    ]

    r_climb3 = [
        "  A          A  ",
        "   A  OOOO  A   ",
        "    AOBBHHOA    ",
        "    OBBHHBBO    ",
        "  AOOBHHLLBOOA  ",
        " A OOBHLLBOO A  ",
        "   OOBHLLBOO    ",
        "  AOBBHHLLBD A  ",
        " A ODBBHHBBD  A ",
        "   ODDBBBDDO    ",
        "   OSS    OSS   ",
        "   Oss    Oss   ",
        "                ",
        "                ",
        "                ",
        "                "
    ]

    r_stun1 = [
        "  A          A  ",
        "   A   OO   A   ",
        "    A O**O A    ",
        "   OOB**BOO     ",
        "  AOOBHHLBOOA   ",
        " A OOBHLLBOO A  ",
        "   OOBHLLBOO    ",
        "  AOBBHHLLBD A  ",
        " A ODBBHHBBD  A ",
        "   ODDBBBDDO    ",
        "   OSS    OSS   ",
        "   Oss    Oss   ",
        "  A            A",
        "                ",
        "                ",
        "                "
    ]

    r_stun2 = [
        " A            A ",
        "  A    OO    A  ",
        "   A  O**O  A   ",
        "   OOB**BOO     ",
        " A OOBHHLBOO A  ",
        "  AOOBHLLBOOA   ",
        "   OOBHLLBOO    ",
        " A ODBBHHBBD  A ",
        "  AOBBHHLLBD A  ",
        "   ODDBBBDDO    ",
        "  OSS      OSS  ",
        "  Oss      Oss  ",
        "                ",
        "                ",
        "                ",
        "                "
    ]

    r_squash1 = [
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        " A            A ",
        "  A   OKKO   A  ",
        "  AOOBWWWWBOOA  ",
        "  OOBHHLLLLBOO  ",
        "  ODDBBHHBBDDO  ",
        "   OSS OO OSS   ",
        "   Oss    Oss   ",
        "                "
    ]

    r_squash2 = [
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        " A            A ",
        "  A   OKKO   A  ",
        "  AOOBWWWWBOOA  ",
        "  OOBHHLLLLBOO  ",
        "  ODDBBHHBBDDO  ",
        "  OSS  OO  OSS  ",
        "  Oss      Oss  "
    ]

    draw_matrix(r_walk1, cm_roach, 2, 33)   # pickle_walk1
    draw_matrix(r_walk2, cm_roach, 18, 33)  # pickle_walk2
    draw_matrix(r_walk3, cm_roach, 33, 33)  # pickle_walk3
    draw_matrix(r_walk4, cm_roach, 49, 33)  # pickle_walk4
    draw_matrix(r_walk1, cm_roach, 65, 33)  # pickle_walk5
    draw_matrix(r_walk2, cm_roach, 78, 33)  # pickle_walk6
    draw_matrix(r_climb1, cm_roach, 91, 33) # pickle_climb1
    draw_matrix(r_climb2, cm_roach, 105, 33)# pickle_climb2
    draw_matrix(r_climb3, cm_roach, 119, 33)# pickle_climb3
    draw_matrix(r_stun1, cm_roach, 133, 33) # pickle_stunned
    draw_matrix(r_stun2, cm_roach, 149, 33) # pickle_stunned2
    draw_matrix(r_squash1, cm_roach, 165, 33)# pickle_squashed
    draw_matrix(r_squash2, cm_roach, 189, 33)# pickle_squashed2

    # =========================================================================
    # ROW 3: FLY (MOSCA METÁLICA DE COCINA) - Y: 61 (and x: 214, y: 33 for walk1)
    # =========================================================================
    cm_fly = {
        'O': C_F_OUTLINE, 'R': C_F_EYES, 'H': C_F_EYES_L, 'K': C_F_LEGS,
        'B': C_F_BODY, 'G': C_F_BODY_L, 'D': C_F_BODY_D,
        'C': C_F_WING, 'c': C_F_WING_D, 'W': (255, 255, 255, 255),
        '*': C_STAR, ' ': None
    }

    f_walk1 = [
        "  ccWW    WWcc  ",
        " cCCCCc  cCCCCc ",
        " cCCCCCccCCCCCc ",
        "c ORRROccORRRO c",
        "  OHHROccOHHRO  ",
        "  OKKROccOKKRO  ",
        "   OOBBGGGBBO   ",
        "  OKOBGGGGGGBKO ",
        "  OKOBGGGGGGBKO ",
        "   OOBBDDDDBBO  ",
        "    ODDDDDDDDO  ",
        "    OKK   OKK   ",
        "    OKK   OKK   ",
        "                ",
        "                ",
        "                "
    ]

    f_walk2 = [
        " cCCCCc  cCCCCc ",
        "cCCWWCc  cCCWWCc",
        " cCCCCc  cCCCCc ",
        "  ORRRO  ORRRO  ",
        "  OHHROccOHHRO  ",
        "  OKKROccOKKRO  ",
        "   OOBBGGGBBO   ",
        "  OKOBGGGGGGBKO ",
        "  OKOBGGGGGGBKO ",
        "   OOBBDDDDBBO  ",
        "    ODDDDDDDDO  ",
        "   OKK     OKK  ",
        "   OKK     OKK  ",
        "                ",
        "                ",
        "                "
    ]

    f_walk3 = [
        " cCCCCC  CCCCCc ",
        " cCCWCc  cWCCCc ",
        "  ORRRO  ORRRO  ",
        "  OHHROccOHHRO  ",
        "  OKKROccOKKRO  ",
        "   OOBBGGGBBO   ",
        "  OKOBGGGGGGBKO ",
        "  OKOBGGGGGGBKO ",
        "   OOBBDDDDBBO  ",
        "    ODDDDDDDDO  ",
        "    OKK   OKK   ",
        "    OKK   OKK   ",
        "                ",
        "                ",
        "                ",
        "                "
    ]

    f_walk4 = [
        "  ccWW    WWcc  ",
        " cCCCCc  cCCCCc ",
        "  ORRRO  ORRRO  ",
        "  OHHROccOHHRO  ",
        "  OKKROccOKKRO  ",
        "   OOBBGGGBBO   ",
        "  OKOBGGGGGGBKO ",
        "  OKOBGGGGGGBKO ",
        "   OOBBDDDDBBO  ",
        "    ODDDDDDDDO  ",
        "   OKK     OKK  ",
        "   OKK     OKK  ",
        "                ",
        "                ",
        "                ",
        "                "
    ]

    f_climb1 = [
        "  ccWW    WWcc  ",
        " cCCCCc  cCCCCc ",
        " cCCCCCccCCCCCc ",
        "  OKKKO  OKKKO  ",
        "   OOBBGGGBBO   ",
        "  OKOBGGGGGGBKO ",
        "  OKOBGGGGGGBKO ",
        "   OOBBDDDDBBO  ",
        "    ODDDDDDDDO  ",
        "   OKK    OKK   ",
        "   OKK    OKK   ",
        "  OKK      OKK  ",
        "  OKK      OKK  ",
        "                ",
        "                ",
        "                "
    ]

    f_climb2 = [
        " cCCCCc  cCCCCc ",
        "cCCWWCc  cCCWWCc",
        "  OKKKO  OKKKO  ",
        "   OOBBGGGBBO   ",
        "  OKOBGGGGGGBKO ",
        "  OKOBGGGGGGBKO ",
        "   OOBBDDDDBBO  ",
        "    ODDDDDDDDO  ",
        "  OKK      OKK  ",
        "  OKK      OKK  ",
        "   OKK    OKK   ",
        "   OKK    OKK   ",
        "                ",
        "                ",
        "                ",
        "                "
    ]

    f_climb3 = [
        " cCCCCC  CCCCCc ",
        "  OKKKO  OKKKO  ",
        "   OOBBGGGBBO   ",
        "  OKOBGGGGGGBKO ",
        "  OKOBGGGGGGBKO ",
        "   OOBBDDDDBBO  ",
        "    ODDDDDDDDO  ",
        "   OKK    OKK   ",
        "   OKK    OKK   ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                "
    ]

    f_stun1 = [
        "  ccWW    WWcc  ",
        " cCCCCc  cCCCCc ",
        "  O***O  O***O  ",
        "  O***OccO***O  ",
        "  OKKROccOKKRO  ",
        "   OOBBGGGBBO   ",
        "  OKOBGGGGGGBKO ",
        "   OOBBDDDDBBO  ",
        "    ODDDDDDDDO  ",
        "    OKK   OKK   ",
        "    OKK   OKK   ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                "
    ]

    f_stun2 = [
        " cCCCCc  cCCCCc ",
        "  O***O  O***O  ",
        "  O***OccO***O  ",
        "  OKKROccOKKRO  ",
        "   OOBBGGGBBO   ",
        "  OKOBGGGGGGBKO ",
        "   OOBBDDDDBBO  ",
        "    ODDDDDDDDO  ",
        "   OKK     OKK  ",
        "   OKK     OKK  ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                "
    ]

    f_squash1 = [
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "cCCCCc    cCCCCc",
        "cCCWWCc  cCCWWCc",
        " ORRRROccORRRRO ",
        " OGGGGGBBGGGGGO ",
        "  ODDDDDDDDDDO  ",
        "  OKK      OKK  ",
        "                ",
        "                "
    ]

    f_squash2 = [
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "                ",
        "cCCCCc    cCCCCc",
        " ORRRROccORRRRO ",
        " OGGGGGBBGGGGGO ",
        "  ODDDDDDDDDDO  ",
        " OKK        OKK ",
        "                ",
        "                "
    ]

    # Draw Fly Sprites at Row 3 coordinates (and 214, 33 for walk1)
    draw_matrix(f_walk1, cm_fly, 214, 33)   # egg_walk1
    draw_matrix(f_walk2, cm_fly, 2, 61)     # egg_walk2
    draw_matrix(f_walk3, cm_fly, 24, 61)    # egg_walk3
    draw_matrix(f_walk4, cm_fly, 46, 61)    # egg_walk4
    draw_matrix(f_walk1, cm_fly, 67, 61)    # egg_walk5
    draw_matrix(f_climb1, cm_fly, 89, 61)   # egg_climb1
    draw_matrix(f_climb2, cm_fly, 107, 61)  # egg_climb2
    draw_matrix(f_climb3, cm_fly, 123, 61)  # egg_climb3
    draw_matrix(f_stun1, cm_fly, 139, 61)   # egg_stunned
    draw_matrix(f_stun2, cm_fly, 159, 61)   # egg_stunned2
    draw_matrix(f_squash1, cm_fly, 179, 61) # egg_squashed
    draw_matrix(f_squash2, cm_fly, 204, 61) # egg_squashed2

    out_path = 'assets/enemies_atlas.png'
    atlas.save(out_path)
    print(f"Successfully generated new kitchen pests atlas: {out_path} ({atlas.size[0]}x{atlas.size[1]})")

if __name__ == '__main__':
    create_plagas_atlas()

