/**
 * Retro Arcade Pixel Art Sprite Generator
 * Generates high-contrast 8-bit retro canvases
 */
class SpriteManager {
  constructor() {
    this.sprites = {};
    this.initSprites();
    this.initAtlas();
    this.initEnemiesAtlas();
    this.initItemsAtlas();
    this.initKiloburnerAtlas();
    this.loadBackground('title_cover', 'assets/title_cover.png');
    this.loadBackground('bg_stage_3', 'assets/bg_stage3_kiloburner.png');
    this.loadBackground('bg_stage_4', 'assets/bg_stage4_octopus.png');
    this.loadBackground('bg_stage_5', 'assets/bg_stage5_coffee.png');
    this.loadBackground('bg_stage_6', 'assets/bg_stage6_cat.png');
    this.loadBackground('bg_stage_7', 'assets/bg_stage7_castle.png');
    this.loadBackground('bg_stage_8', 'assets/bg_stage8_dragon.png');
    this.loadBackground('bg_stage_9', 'assets/bg_stage9_submarine.png');
    this.loadBackground('bg_stage_10', 'assets/bg_stage10_penguin.png');
    this.loadBackground('bg_stage_11', 'assets/bg_stage11_toaster.png');
    this.loadBackground('bg_stage_12', 'assets/bg_stage12_panda.png');
    this.loadBackground('bg_stage_13', 'assets/bg_stage13_ufo.png');
    this.loadBackground('bg_stage_14', 'assets/bg_stage14_dino.png');
    this.loadBackground('bg_stage_15', 'assets/bg_stage15_crown.png');
  }

  loadBackground(key, src) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      this.sprites[key] = img;
    };
    this.sprites[key] = img;
  }

  initAtlas() {
    this.atlasImg = new Image();
    this.atlasImg.src = 'assets/chef_atlas.png?v=109';
    this.atlasLoaded = false;
    this.atlasImg.onload = () => {
      this.atlasLoaded = true;
    };
    this.atlasImg.onerror = () => {
      this.atlasImg.src = 'assets/peter_atlas.png?v=102';
    };
  }

  drawAtlas(ctx, name, dx, dy, flip = false) {
    const atlasData = window.CHEF_ATLAS_DATA || window.PETER_ATLAS_DATA;
    if (!this.atlasLoaded || !atlasData) return false;
    const info = atlasData[name];
    if (!info) return false;

    const sx = info.sx !== undefined ? info.sx : info.x;
    const sy = info.sy !== undefined ? info.sy : info.y;
    const sw = info.sw !== undefined ? info.sw : info.w;
    const sh = info.sh !== undefined ? info.sh : info.h;

    ctx.save();
    if (flip) {
      ctx.translate(dx + info.w, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(this.atlasImg, sx, sy, sw, sh, 0, 0, info.w, info.h);
    } else {
      ctx.drawImage(this.atlasImg, sx, sy, sw, sh, dx, dy, info.w, info.h);
    }
    ctx.restore();
    return true;
  }

  getAtlasInfo(name) {
    const atlasData = window.CHEF_ATLAS_DATA || window.PETER_ATLAS_DATA;
    if (atlasData) {
      return atlasData[name] || null;
    }
    return null;
  }

  initEnemiesAtlas() {
    this.enemiesAtlasImg = new Image();
    this.enemiesAtlasImg.src = 'assets/enemies_atlas.png';
    this.enemiesAtlasLoaded = false;
    this.enemiesAtlasImg.onload = () => {
      this.enemiesAtlasLoaded = true;
    };
  }

  initItemsAtlas() {
    this.itemsAtlasImg = new Image();
    this.itemsAtlasImg.src = 'assets/items_atlas.png';
    this.itemsAtlasLoaded = false;
    this.itemsAtlasImg.onload = () => {
      this.itemsAtlasLoaded = true;
      const atlasData = window.ITEMS_ATLAS_DATA;
      if (atlasData) {
        for (const [name, info] of Object.entries(atlasData)) {
          const { canvas, ctx } = this.createCanvas(info.w, info.h);
          ctx.drawImage(this.itemsAtlasImg, info.x, info.y, info.w, info.h, 0, 0, info.w, info.h);
          this.sprites[name] = canvas;
        }
      }
    };
  }

  initKiloburnerAtlas() {
    this.kiloburnerAtlasImg = new Image();
    this.kiloburnerAtlasImg.src = 'assets/kiloburner_atlas.png';
    this.kiloburnerAtlasLoaded = false;
    this.kiloburnerAtlasImg.onload = () => {
      this.kiloburnerAtlasLoaded = true;
    };
  }

  drawKiloburnerAtlas(ctx, name, dx, dy, targetW = null, targetH = null, flip = false) {
    const atlasData = window.KILOBURNER_ATLAS_DATA;
    if (!this.kiloburnerAtlasLoaded || !atlasData) return false;
    const info = atlasData[name];
    if (!info) return false;

    const w = targetW !== null ? targetW : info.w;
    const h = targetH !== null ? targetH : info.h;

    ctx.save();
    if (flip) {
      ctx.translate(dx + w, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(this.kiloburnerAtlasImg, info.x, info.y, info.w, info.h, 0, 0, w, h);
    } else {
      ctx.drawImage(this.kiloburnerAtlasImg, info.x, info.y, info.w, info.h, dx, dy, w, h);
    }
    ctx.restore();
    return true;
  }

  getKiloburnerAtlasInfo(name) {
    const atlasData = window.KILOBURNER_ATLAS_DATA;
    if (atlasData) {
      return atlasData[name] || null;
    }
    return null;
  }

  drawEnemyAtlas(ctx, name, dx, dy, flip = false) {
    const atlasData = window.ENEMIES_ATLAS_DATA;
    if (!this.enemiesAtlasLoaded || !atlasData) return false;
    const info = atlasData[name];
    if (!info) return false;

    ctx.save();
    if (flip) {
      ctx.translate(dx + info.w, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(this.enemiesAtlasImg, info.x, info.y, info.w, info.h, 0, 0, info.w, info.h);
    } else {
      ctx.drawImage(this.enemiesAtlasImg, info.x, info.y, info.w, info.h, dx, dy, info.w, info.h);
    }
    ctx.restore();
    return true;
  }

  getEnemyAtlasInfo(name) {
    const atlasData = window.ENEMIES_ATLAS_DATA;
    if (atlasData) {
      return atlasData[name] || null;
    }
    return null;
  }

  createCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas: c, ctx: ctx };
  }

  drawPixels(ctx, pixelMatrix, colorMap, scale = 1, offsetX = 0, offsetY = 0) {
    for (let r = 0; r < pixelMatrix.length; r++) {
      const row = pixelMatrix[r];
      for (let c = 0; c < row.length; c++) {
        const char = row[c];
        if (char !== ' ' && colorMap[char]) {
          ctx.fillStyle = colorMap[char];
          ctx.fillRect(offsetX + c * scale, offsetY + r * scale, scale, scale);
        }
      }
    }
  }

  initSprites() {
    this.createPlayerSprites();
    this.createHotDogSprites();
    this.createPickleSprites();
    this.createEggSprites();
    this.createBurgerSprites();
    this.createTiles();
    this.createBonusSprites();
    this.createStarSprites();
  }


  // CHEF PEPE (THE HERO)
  // ==========================================
  createPlayerSprites() {
    // Colors:
    // W = White (Hat/Apron), R = Red (Scarf/Tie), S = Skin, B = Blue (Pants), K = Black (Shoes/Outline), Y = Yellow (Shaker)
    const cm = {
      'W': '#f4f4f4',
      'S': '#f8b888',
      'R': '#e40058',
      'B': '#0058f8',
      'K': '#181818',
      'D': '#b84400',
      'Y': '#fcb400'
    };

    // Frame 1: Walk Right / Left (can flip)
    const walk1 = [
      "    WWWW    ",
      "   WWWWWW   ",
      "    WWWW    ",
      "   SSSSSS   ",
      "   SKSSSK   ",
      "    SSSS    ",
      "    RRRR    ",
      "   WWWWWW   ",
      "   W WW W   ",
      "   W WW W   ",
      "    BBBB    ",
      "    B  B    ",
      "   KK  KK   "
    ];

    const walk2 = [
      "    WWWW    ",
      "   WWWWWW   ",
      "    WWWW    ",
      "   SSSSSS   ",
      "   SKSSSK   ",
      "    SSSS    ",
      "    RRRR    ",
      "   WWWWWW   ",
      "   W WW W   ",
      "   W WW W   ",
      "    BBBB    ",
      "   BB  B    ",
      "  KK    KK  "
    ];

    // Climb Frame 1
    const climb1 = [
      "    WWWW    ",
      "   WWWWWW   ",
      "    WWWW    ",
      "    DDDD    ",
      "   DDDDDD   ",
      "    DDDD    ",
      "   WWWWWW   ",
      "  WW WW WW  ",
      "  W  WW  W  ",
      "    WWWW    ",
      "   BBBBBB   ",
      "   B    B   ",
      "  KK    KK  "
    ];

    // Climb Frame 2
    const climb2 = [
      "    WWWW    ",
      "   WWWWWW   ",
      "    WWWW    ",
      "    DDDD    ",
      "   DDDDDD   ",
      "    DDDD    ",
      "   WWWWWW   ",
      "  W  WW  W  ",
      "  WW WW WW  ",
      "    WWWW    ",
      "   BBBBBB   ",
      "    B  B    ",
      "   KK  KK   "
    ];

    // Pepper Toss
    const pepperToss = [
      "    WWWW     ",
      "   WWWWWW    ",
      "    WWWW     ",
      "   SSSSSS    ",
      "   SKSSSK    ",
      "    SSSS  YY ",
      "    RRRR  WW ",
      "   WWWWWWWWW ",
      "   W WW      ",
      "    BBBB     ",
      "    B  B     ",
      "   KK  KK    "
    ];

    // Pepper Toss Up (Ladder)
    const pepperUp = [
      "    YYWW    ",
      "    WWWW    ",
      "   WWWWWW   ",
      "    WWWW    ",
      "    DDDD    ",
      "   DDDDDD   ",
      "    DDDD    ",
      "  WWWWWWWW  ",
      "  WW WW WW  ",
      "    WWWW    ",
      "   BBBBBB   ",
      "   B    B   ",
      "  KK    KK  "
    ];

    // Pepper Toss Down (Ladder)
    const pepperDown = [
      "    WWWW    ",
      "   WWWWWW   ",
      "    WWWW    ",
      "    DDDD    ",
      "   DDDDDD   ",
      "    DDDD    ",
      "   WWWWWW   ",
      "  WW WW WW  ",
      "    WWWW    ",
      "   BBBBBB   ",
      "   B YY B   ",
      "  KK WW KK  "
    ];

    // Jump
    const jump = [
      "    WWWW    ",
      "   WWWWWW   ",
      "    WWWW    ",
      "   SSSSSS   ",
      "   SKSSSK   ",
      "  W SSSS W  ",
      "  WW RRRR WW ",
      "   WWWWWW   ",
      "   W WW W   ",
      "    BBBB    ",
      "   BB  BB   ",
      "  KK    KK  "
    ];

    // Death
    const death = [
      "            ",
      "   SSSSSS   ",
      "   SKSSSK   ",
      "  SSSSSSSS  ",
      "   WWWWWW   ",
      "  WWWWWWWW  ",
      "  RRRRRRRR  ",
      "  BBBBBBBB  ",
      "  BB    BB  ",
      "  KK    KK  ",
      "            "
    ];

    this.sprites['player_walk1'] = this.renderMatrix(walk1, cm, 16, 16);
    this.sprites['player_walk2'] = this.renderMatrix(walk2, cm, 16, 16);
    this.sprites['player_climb1'] = this.renderMatrix(climb1, cm, 16, 16);
    this.sprites['player_climb2'] = this.renderMatrix(climb2, cm, 16, 16);
    this.sprites['player_pepper'] = this.renderMatrix(pepperToss, cm, 16, 16);
    this.sprites['player_pepper_up'] = this.renderMatrix(pepperUp, cm, 16, 16);
    this.sprites['player_pepper_down'] = this.renderMatrix(pepperDown, cm, 16, 16);
    this.sprites['player_jump'] = this.renderMatrix(jump, cm, 16, 16);
    this.sprites['player_death'] = this.renderMatrix(death, cm, 16, 16);
  }

  // ==========================================
  // ENEMIGOS NATURALES DEL CHEF (PLAGAS DE COCINA)
  // ==========================================

  // 1. EL RATÓN DE COCINA (MOUSE - Enemigo Principal Chaser)
    // 1. MR. HOT DOG (Salchicha Frank - HD Arcade Sprite)
    // 1. EL RATÓN DE COCINA (MOUSE - Enemigo Principal Chaser HD)
  createHotDogSprites() {
    const cm = {
      'O': '#2c2838', // Contorno oscuro
      'G': '#8c8c9c', // Pelaje gris
      'H': '#b4b4c8', // Brillo pelaje
      'D': '#5c5c6c', // Sombra pelaje
      'P': '#ffb0c4', // Rosa orejas, nariz, patas
      'p': '#d88298', // Sombra rosa
      'W': '#ffffff', // Diente blanco, bigotes, brillo ojos
      'K': '#14101c', // Pupilas y hocico
      'T': '#ffa0b8', // Cola larga rosada
      '*': '#ffd820'  // Estrellas mareo
    };

    const walk1 = [
      "  PPP      PPP  ",
      " PHHPP    PPHP  ",
      " PHGHPO  OPGHP  ",
      "  OGHHHOOGHHHO  ",
      " OGGHWKGGHWKGO  ",
      " OGGHKKGGHKKGO  ",
      "  OGGHPOPGHGO   ",
      "  OGGGGGGGGGDO  ",
      " OGGHWWHGGGGDO  ",
      " OGGHWWHDDDGDO T",
      "  OGGGGGDDGGDO T",
      "   OGG  OGG  OT ",
      "   OPP  OPP  OT ",
      "   OpP  OpP  T  ",
      "                ",
      "                "
    ];

    const walk2 = [
      "  PPP      PPP  ",
      " PHHPP    PPHP  ",
      " PHGHPO  OPGHP  ",
      "  OGHHHOOGHHHO  ",
      " OGGHWKGGHWKGO  ",
      " OGGHKKGGHKKGO  ",
      "  OGGHPOPGHGO   ",
      "  OGGGGGGGGGDO T",
      " OGGHWWHGGGGDO T",
      " OGGHWWHDDDGDO T",
      "  OGGGGGDDGGDO  ",
      "  OPP    OPP    ",
      "  OpP    OpP    ",
      "                ",
      "                ",
      "                "
    ];

    const stunned = [
      "  PPP      PPP  ",
      " PHHPP    PPHP  ",
      " PHGHPO  OPGHP  ",
      "  OGHHHOOGHHHO  ",
      " OGGH**GGH**GO  ",
      " OGGH**GGH**GO  ",
      "  OGGHPOPGHGO   ",
      "  OGGGGGGGGGDO  ",
      " OGGHWWHGGGGDO  ",
      "  OGGGGGDDGGDO T",
      "   OGG  OGG  OT ",
      "   OPP  OPP   T ",
      "   OpP  OpP     ",
      "                ",
      "                ",
      "                "
    ];

    const squashed = [
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "  PPP      PPP  ",
      " PHHPP    PPHP  ",
      "OGGHWKWKGGHWKWGO",
      "OGGGGHPOPGGGGGGO",
      " OGGGGGGGGGGGDO ",
      "  OPPPPPPPPPDO T",
      "   OpPpPpPpPO TT",
      "                ",
      "                "
    ];

    const sprWalk1 = this.renderMatrix(walk1, cm, 16, 16);
    const sprWalk2 = this.renderMatrix(walk2, cm, 16, 16);
    const sprStunned = this.renderMatrix(stunned, cm, 16, 16);
    const sprSquashed = this.renderMatrix(squashed, cm, 16, 16);

    this.sprites['mouse_walk1'] = sprWalk1;
    this.sprites['mouse_walk2'] = sprWalk2;
    this.sprites['mouse_stunned'] = sprStunned;
    this.sprites['mouse_squashed'] = sprSquashed;
    this.sprites['hotdog_walk1'] = sprWalk1;
    this.sprites['hotdog_walk2'] = sprWalk2;
    this.sprites['hotdog_stunned'] = sprStunned;
    this.sprites['hotdog_squashed'] = sprSquashed;
  }

  // 2. LA CUCARACHA DE COCINA (ROACH - Enemigo Rápido HD)
  createPickleSprites() {
    const cm = {
      'O': '#281008', // Contorno oscuro
      'A': '#e88840', // Antenas largas curvadas
      'B': '#a05020', // Quitina marrón cobrizo
      'H': '#d87830', // Brillo ámbar
      'L': '#f09848', // Reflejo alas
      'D': '#602810', // Sombra quitina
      'W': '#ffffff', // Reflejo ojos
      'K': '#180c08', // Ojos
      'S': '#e03828', // Zapatillas rojas
      's': '#901810', // Suela zapatilla
      '*': '#ffd820'  // Mareo
    };

    const walk1 = [
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
    ];

    const walk2 = [
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
    ];

    const stunned = [
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
    ];

    const squashed = [
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
      "                ",
      "                "
    ];

    const sprWalk1 = this.renderMatrix(walk1, cm, 16, 16);
    const sprWalk2 = this.renderMatrix(walk2, cm, 16, 16);
    const sprStunned = this.renderMatrix(stunned, cm, 16, 16);
    const sprSquashed = this.renderMatrix(squashed, cm, 16, 16);

    this.sprites['roach_walk1'] = sprWalk1;
    this.sprites['roach_walk2'] = sprWalk2;
    this.sprites['roach_stunned'] = sprStunned;
    this.sprites['roach_squashed'] = sprSquashed;
    this.sprites['pickle_walk1'] = sprWalk1;
    this.sprites['pickle_walk2'] = sprWalk2;
    this.sprites['pickle_stunned'] = sprStunned;
    this.sprites['pickle_squashed'] = sprSquashed;
  }

  // 3. LA MOSCA DE COCINA (FLY - Enemigo Volador Errático HD)
  createEggSprites() {
    const cm = {
      'O': '#10141c', // Contorno
      'R': '#e81830', // Ojos compuestos rubí
      'H': '#ff5070', // Reflejo facetado rubí
      'K': '#181c24', // Pupilas y patas
      'B': '#2080a0', // Cuerpo metálico azul-esmeralda
      'G': '#30a8c8', // Brillo metálico
      'D': '#104860', // Sombra cuerpo
      'C': '#c0f0ff', // Alas translúcidas
      'c': '#88d0f0', // Borde y nervaduras ala
      'W': '#ffffff', // Reflejo ala
      '*': '#ffd820'  // Mareo
    };

    const walk1 = [
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
    ];

    const walk2 = [
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
    ];

    const stunned = [
      "  ccWW    WWcc  ",
      " cCCCCc  cCCCCc ",
      " cCCCCCccCCCCCc ",
      "c O***OccO***O c",
      "  O***OccO***O  ",
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
    ];

    const squashed = [
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
      " cCCCCc  cCCCCc ",
      "cCCWWCc  cCCWWCc",
      "  ORRROccORRRO  ",
      " OOBBGGGGGGGGBBO",
      "  OODDDDDDDDOO  ",
      "   OKK    OKK   ",
      "                ",
      "                ",
      "                "
    ];

    const sprWalk1 = this.renderMatrix(walk1, cm, 16, 16);
    const sprWalk2 = this.renderMatrix(walk2, cm, 16, 16);
    const sprStunned = this.renderMatrix(stunned, cm, 16, 16);
    const sprSquashed = this.renderMatrix(squashed, cm, 16, 16);

    this.sprites['fly_walk1'] = sprWalk1;
    this.sprites['fly_walk2'] = sprWalk2;
    this.sprites['fly_stunned'] = sprStunned;
    this.sprites['fly_squashed'] = sprSquashed;
    this.sprites['egg_walk1'] = sprWalk1;
    this.sprites['egg_walk2'] = sprWalk2;
    this.sprites['egg_stunned'] = sprStunned;
    this.sprites['egg_squashed'] = sprSquashed;
  }

  createBurgerSprites() {
    // 1. Top Bun (Toasted Brioche Dome with Sesame Seeds)
    const cmBunTop = {
      'O': '#4a1e00', // Deep toasted outer shadow / base crease
      'D': '#b05208', // Baked golden-brown crust
      'B': '#e6881c', // Rich brioche bun body
      'H': '#f8b848', // Golden glow highlight
      'L': '#ffdd80', // Top sheen
      'S': '#fff6dc', // Plump white sesame seed
      'T': '#8c3e04'  // Sesame seed shadow dot
    };
    const mBunTop = [
      '      DDHHHHLLLLLLLLHHDDD       ',
      '    DDHHBBLSSSSBSTLLBBHHHDD     ',
      '  DDHBSTBBBBBBSTBBBSTBBBBBHHDD  ',
      ' ODHBBBBBBBBBBBBBBBBBBBBBBBBHDDO',
      'ODHBBSTBBBBBBBBBSTBBBBBSTBBBBBDO',
      'ODBBBBBBBBBBBBBBBBBBBBBBBBBBBBDO',
      'ODDBBBBBBBBBBBBBBBBBBBBBBBBBBDO ',
      ' OODDDDDDDDDDDDDDDDDDDDDDDDDDOO '
    ];
    this.sprites['bun_top'] = this.renderMatrix(mBunTop, cmBunTop, 32, 8);

    // 2. Fresh Crisp Ruffled Curly Lettuce
    const cmLettuce = {
      'D': '#0a400a', // Deep forest green shadow / underside folds
      'M': '#147a18', // Fresh garden leaf green
      'L': '#3cb828', // Crisp bright lettuce leaf body
      'H': '#86e838', // Crispy lime-green translucent frills & ruffled peaks
      'W': '#d2fc70'  // Crunchy white-lime leaf vein highlight
    };
    const mLettuce = [
      '  HH      HHHH      HH      HHHH',
      ' HLLHH   HLLLLHH   HLLHH   HLLLL',
      'HLLWLLHHHLLWMWLLHHHLLWLLHHHLLWML',
      'LLMMMLLLLMMMDMMMLLLLMMMLLLLMMMDM',
      ' LDDMMMLLLDDDDDMLLLLDDMMMLLLDDDM',
      '  LLMMMDLLLLMMMDDLLLLMMMDLLLLMMM',
      ' HLLLLDDDLLLLLDDD HLLLLDDDLLLLLD',
      '  HH  DD   HH  DD   HH  DD   HH '
    ];
    this.sprites['lettuce'] = this.renderMatrix(mLettuce, cmLettuce, 32, 8);

    // 3. Ripe Sliced Beefsteak Tomato (Locular Cavities with Seeds)
    const cmTomato = {
      'K': '#680408', // Deep burgundy outer skin rim & chamber shadow
      'R': '#c41418', // Ripe red tomato flesh
      'B': '#eb2a2e', // Bright red juicy pulp
      'H': '#ff7878', // Wet juicy reflection highlight
      'J': '#880810', // Dark translucent seed jelly pocket
      'Y': '#fce440', // Golden tomato seed
      'G': '#a4dc38'  // Seed green core
    };
    const mTomato = [
      ' KKRRRRRRRRRRRRRRRRRRRRRRRRRRKK ',
      'KRRBHHBBBRRBBHBBBRRBBHHBBBRRRRRK',
      'KRBJJJJJBRBJJJJJBRBJJJJJBRBBBRRK',
      'KRBJYGJ BRBJYGJ BRBJYGJ BRBHHBRK',
      'KRBJJJJJBRBJJJJJBRBJJJJJBRBBBRRK',
      'KRRBBBBBRRRBBBBBRRRBBBBBRRRRRRRK',
      'KRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRK',
      ' KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK '
    ];
    this.sprites['tomato'] = this.renderMatrix(mTomato, cmTomato, 32, 8);

    // 4. Melted Cheddar Cheese with Drooping Melted Corners
    const cmCheese = {
      'D': '#b05800', // Dark amber melted edge shadow
      'O': '#e87800', // Rich sharp cheddar orange
      'C': '#fca808', // Golden melted cheddar body
      'Y': '#ffd430', // Creamy bright melted cheese
      'H': '#fff088'  // Glossy melted shine highlight
    };
    const mCheese = [
      '  YYHHHHHYYYYYYYHHHHHYYYYYYYHHY ',
      ' YYYCHHHHYYYYCCCHHHHYYYYCCCHHYYY',
      'OCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCO',
      'OOCOOOOOOOOOCOOOOOOOOOCOOOOOOOCO',
      ' OCCO    OCCO    OCCO   OCCO  OO',
      '  OCO     OCO     OCO    OCO    ',
      '   CO      CO      CO     CO    ',
      '   DD      DD      DD     DD    '
    ];
    this.sprites['cheese'] = this.renderMatrix(mCheese, cmCheese, 32, 8);

    // 5. Char-Grilled Flame-Broiled Beef Patty with Diagonal Sear Marks
    const cmPatty = {
      'K': '#200804', // Charred black-brown grill sear marks / crust
      'C': '#481608', // Dark roasted beef
      'M': '#742a10', // Rich cooked ground beef main tone
      'B': '#9c4218', // Sizzling meat highlights / juicy flecks
      'H': '#c46830'  // Top sear highlight flecks
    };
    const mPatty = [
      ' CCCCCMMKKKCCCCMMKKKCCCCMMKKKCCC',
      'CMKMBBMCCKMKMBBMCCKMKMBBMCCKMKMC',
      'CKMKKMMMBBKMKKMMMBBKMKKMMMBBKMKC',
      'CKMMBBMKKCKMMBBMKKCKMMBBMKKCKMMC',
      'CKMBBMMMKCKMBBMMMKCKMBBMMMKCKMBC',
      'CCKMKMBBMCCKMKMBBMCCKMKMBBMCCKMC',
      'CCKKMMMMCCCCKKMMMMCCCCKKMMMMCCCC',
      ' CKKKKKCCCCKKKKKCCCCKKKKKCCCCKC '
    ];
    this.sprites['patty'] = this.renderMatrix(mPatty, cmPatty, 32, 8);

    // 6. Bottom Bun (Fluffy Light Interior Crumb with Rounded Toasted Crust)
    const cmBunBot = {
      'O': '#4a1e00', // Base crust shadow
      'D': '#b05208', // Deep baked golden crust
      'B': '#e6881c', // Warm brioche bun body
      'C': '#f4b448', // Soft crumb transition
      'W': '#ffecb8'  // Soft, fluffy white-gold bread crumb interior
    };
    const mBunBot = [
      ' WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW ',
      'OWCCCWWCCCWWCCCWWCCCWWCCCWWCCCO ',
      'ODBBCCCCCCCCCCCCCCCCCCCCCCCCBBD ',
      'ODBBBBBBBBBBBBBBBBBBBBBBBBBBBBD ',
      'ODBBBBBBBBBBBBBBBBBBBBBBBBBBBBD ',
      'ODDDBBBBBBBBBBBBBBBBBBBBBBBBDDDO',
      ' ODDDDBBBBBBBBBBBBBBBBBBBBDDDDO ',
      '  OODDDDDDDDDDDDDDDDDDDDDDDDOO  '
    ];
    this.sprites['bun_bottom'] = this.renderMatrix(mBunBot, cmBunBot, 32, 8);

    // 7. Polished Silver / Ceramic Serving Tray
    const cmPlate = {
      'S': '#707880', // Plate shadow / outer edge
      'M': '#a4b0b8', // Metallic plate rim
      'L': '#d8e4ec', // Polished silver / ceramic body
      'W': '#ffffff', // Bright specular reflection
      'D': '#485058'  // Base shadow
    };
    const mPlate = [
      '  WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW  ',
      ' WLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLW ',
      'SMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMS',
      'SLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLS',
      ' SDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDS ',
      '   DDDDDDDDDDDDDDDDDDDDDDDDDDDDD    '
    ];
    this.sprites['plate'] = this.renderMatrix(mPlate, cmPlate, 36, 6);
  }
  // ==========================================
  // TILES (Ladders and Platforms)
  // ==========================================
  createTiles() {
    // Ladder (16x16)
    const ladder = this.createCanvas(16, 16);
    const ctxL = ladder.ctx;
    // Side rails (Blue/Cyan)
    ctxL.fillStyle = '#00a8fc';
    ctxL.fillRect(2, 0, 2, 16);
    ctxL.fillRect(12, 0, 2, 16);
    // White highlights
    ctxL.fillStyle = '#fcfcfc';
    ctxL.fillRect(3, 0, 1, 16);
    ctxL.fillRect(13, 0, 1, 16);
    // Rungs
    ctxL.fillStyle = '#fcfcfc';
    ctxL.fillRect(4, 3, 8, 2);
    ctxL.fillRect(4, 11, 8, 2);
    ctxL.fillStyle = '#0058b8';
    ctxL.fillRect(4, 4, 8, 1);
    ctxL.fillRect(4, 12, 8, 1);
    this.sprites['ladder'] = ladder.canvas;

    // Platform Girder (16x8)
    const platform = this.createCanvas(16, 8);
    const ctxP = platform.ctx;
    ctxP.fillStyle = '#00a800'; // Green girder
    ctxP.fillRect(0, 0, 16, 3);
    ctxP.fillStyle = '#80e000'; // Top highlight
    ctxP.fillRect(0, 0, 16, 1);
    // Girder braces
    ctxP.fillStyle = '#005800';
    ctxP.fillRect(0, 3, 2, 5);
    ctxP.fillRect(7, 3, 2, 5);
    ctxP.fillRect(14, 3, 2, 5);
    this.sprites['platform'] = platform.canvas;
  }

  // ==========================================
  // BONUS ITEMS & EXTRAS (16-BIT RETRO ARCADE MATRICES)
  // ==========================================
  createBonusSprites() {
    // 1. Ice Cream Sundae (Swirled Strawberry/Vanilla with Cherry & Waffle Cone)
    const cmIceCream = {
      '.': '#1c0a00', // Dark outline
      'R': '#8a0018', // Deep cherry shadow
      'C': '#eb1838', // Glossy cherry red
      'W': '#ffffff', // Specular glint
      'P': '#ff6097', // Strawberry syrup swirl
      'Q': '#ffa0c4', // Soft pink cream
      'V': '#fff2ba', // Creamy rich vanilla
      'Y': '#ffe382', // Vanilla shadow
      'G': '#fca410', // Baked golden waffle
      'O': '#c86800', // Toasted waffle grid shadow
      'H': '#843e00'  // Deep cone crease
    };
    const mIceCream = [
      '       ..       ',
      '      .RC.      ',
      '      .WC.      ',
      '     ..PP..     ',
      '    .VQPPQV.    ',
      '   .VVWPPQVV.   ',
      '  .VVPWPPQYYV.  ',
      '  .QQPPQYYVVV.  ',
      '  .YYVVVVYYYV.  ',
      '   .GGGGGGGG.   ',
      '   .GOGGGOGG.   ',
      '    .GGHGGH.    ',
      '    .GOGGOG.    ',
      '     .GGHG.     ',
      '      .GG.      ',
      '       ..       '
    ];
    this.sprites['bonus_icecream'] = this.renderMatrix(mIceCream, cmIceCream, 16, 16);

    // 2. Steaming Diner Coffee Mug with Latte Art Heart
    const cmCoffee = {
      '.': '#101018', // Outline
      'S': '#a8c0d8', // Translucent rising steam
      's': '#d8ecf8', // Bright steam highlight
      'W': '#ffffff', // Glossy ceramic highlight
      'C': '#e0eaf2', // Retro ceramic mug white/cyan
      'c': '#96b0c4', // Ceramic shadow
      'B': '#1878b8', // Retro teal/blue diner stripe
      'M': '#3e1a06', // Dark rich roasted espresso
      'L': '#caa278', // Golden crema / latte foam heart
      'l': '#e8d4b8', // Latte foam highlight
      'H': '#240e02'  // Mug rim interior shadow
    };
    const mCoffee = [
      '    s    S      ',
      '     S  s       ',
      '    ..   ..     ',
      '   .CCCCCC.     ',
      '  .CHMMMMLCc.   ',
      ' .CMMLLLLMMC....',
      '.CMMLLlLlMMC.WW.',
      '.CWWMMLLMMCC.CC.',
      '.CBBBBBBBBCC.CC.',
      '.CWWCCCCCCcc.cc.',
      '.CWWCCCCCCcc....',
      '.CWWCCCCCCcc.   ',
      '.CWWCCCCCCcc.   ',
      ' .cWCCCCCCcc.   ',
      '  .cccccccc.    ',
      '   ........     '
    ];
    this.sprites['bonus_coffee'] = this.renderMatrix(mCoffee, cmCoffee, 16, 16);

    // 3. Crispy Golden French Fries Carton
    const cmFries = {
      '.': '#1c0800', // Outline
      'R': '#c81020', // Crimson diner carton red
      'r': '#88040e', // Deep carton shadow
      'Y': '#fcd018', // Golden crispy hot fry
      'y': '#d09400', // Toasted fry shadow
      'W': '#ffffff', // Salt crystal sparkle / carton shine
      'w': '#fff4aa', // Fry light highlight
      'B': '#fcac00'  // Yellow retro carton emblem
    };
    const mFries = [
      '    .     .     ',
      '   .Y. . .Y.    ',
      '   .w. .Y.w.    ',
      '  .Y.Y.Yw.Y.Y.  ',
      '  .w.y.y.Y.w.   ',
      '  .Y.Y.w.y.y.   ',
      ' ............   ',
      ' .RRRRRRRRRRR.  ',
      ' .WWRRRRRRRRR.  ',
      ' .WWRRRBBRRRR.  ',
      ' .WWRRBBBBRRR.  ',
      ' .WWRRRBBRRRR.  ',
      ' .WWRRRRRRRRr.  ',
      '  .WWRRRRRRRr.  ',
      '  .WWrrrrrrrr.  ',
      '   ..........   '
    ];
    this.sprites['bonus_fries'] = this.renderMatrix(mFries, cmFries, 16, 16);

    // 4. Strawberry Glazed Donut with Rainbow Sprinkles
    const cmDonut = {
      '.': '#1c0804', // Outline
      'D': '#b86410', // Baked golden brioche dough
      'd': '#dc8824', // Dough body
      'P': '#e8286a', // Glossy strawberry frosting
      'p': '#ff629c', // Bright pink frosting highlight
      'W': '#ffffff', // Frosting specular shine
      'G': '#44e040', // Lime sprinkle
      'B': '#00d4fc', // Cyan sprinkle
      'Y': '#ffe428', // Golden sprinkle
      'H': '#602008'  // Hole interior shadow
    };
    const mDonut = [
      '     ......     ',
      '   ..PPPPPP..   ',
      '  .PPPPpWWPPP.  ',
      ' .PPGYPPpPPBPP. ',
      '.PPPPPPPPPGPPPP.',
      '.PpPPPP....PPpP.',
      '.PPPP..HHHH..PP.',
      '.PYP.HH....HH.BP.',
      '.PpP.HH....HH.PP.',
      '.PPPP..HHHH..PP.',
      '.PdPpPP....PGdP.',
      '.ddddPPPPPPdddd.',
      '.dddDDddddDDddd.',
      ' .ddDDDDDDDDdd. ',
      '  ..DDDDDDDD..  ',
      '    ........    '
    ];
    this.sprites['bonus_donut'] = this.renderMatrix(mDonut, cmDonut, 16, 16);

    // 5. Golden Royale Chef Hat (Extra Life 1UP Bonus)
    const cmLife = {
      '.': '#180e00', // Outline
      'G': '#9e6c00', // Dark rich gold shading
      'Y': '#fcb800', // Radiant golden silk
      'y': '#ffd840', // Bright golden highlight
      'W': '#ffffff', // Diamond sparkle glint
      'R': '#940020', // Royal crimson velvet headband
      'r': '#d81438', // Bright crimson ribbon
      'B': '#ffe878'  // Golden ribbon buckle
    };
    const mLife = [
      '   W            ',
      '    ..    ..    ',
      '  .Yyy..Yyy.  W ',
      ' .YyyyyyyyYY.   ',
      '.YyWyyyyyyyYY.  ',
      '.YyyyyyyyyyyY.. ',
      '.YYYYYyyyyyYYYY.',
      '.GYYYYYYYYYYYyG.',
      '.GGYYYYYYYYYYGG.',
      ' .GGGGGGGGGGGG. ',
      ' .rRRRRRRRRRRr. ',
      ' .rrRRRBBRRRrr. ',
      ' .rrRRRBBRRRrr. ',
      ' .rRRRRRRRRRRr. ',
      '  .rrrrrrrrrr.  ',
      '   ..........   '
    ];
    this.sprites['bonus_life'] = this.renderMatrix(mLife, cmLife, 16, 16);

    // 6. Vintage Glass Pepper Shaker UI Icon (16x16)
    const cmPepper = {
      '.': '#101018', // Outline
      'M': '#687888', // Metallic chrome dome cap shadow
      'C': '#b4c4d4', // Chrome cap body
      'W': '#ffffff', // Specular chrome / glass highlight
      'G': '#dce8f4', // Translucent glass body reflection
      'g': '#8ca4b8', // Glass shaded edge
      'P': '#18181c', // Peppercorn grain
      'p': '#383844', // Peppercorn medium grain
      'Y': '#fcb400'  // Golden retro pepper label
    };
    const mPepper = [
      '      ....      ',
      '     .CMMC.     ',
      '     .WWCC.     ',
      '    ..CCCC..    ',
      '   .CCCCCCCC.   ',
      '   .gGGGGGGg.   ',
      '  .gWGgGGgGgg.  ',
      '  .gWPPpPgPGg.  ',
      '  .gWpPggPPGg.  ',
      '  .gWYYYYYYGg.  ',
      '  .gWYPPPYYGg.  ',
      '  .gWYYYYYYGg.  ',
      '  .gWPPpPgPGg.  ',
      '  .gWpPGpPpGg.  ',
      '   .gGGGGGGg.   ',
      '    ........    '
    ];
    this.sprites['pepper_icon'] = this.renderMatrix(mPepper, cmPepper, 16, 16);
  }

  // ==========================================
  // RETRO STAR RATING SPRITES (Full, Half, Empty)
  // ==========================================
  createStarSprites() {
    // 1. Full Golden Star (16x16)
    const cmFull = {
      'G': '#b07800', // Gold outline / base shadow
      'Y': '#fcb400', // Vibrant golden body
      'L': '#ffe448', // Bright yellow highlight
      'W': '#ffffff'  // Specular shine
    };
    const mFull = [
      '       GG       ',
      '       YY       ',
      '      LYYG      ',
      '     WLYYYG     ',
      'GGGGGWLYYYYGGGGG',
      ' GYYYWLYYYYGYYG ',
      '  GYYWLYYYGYYG  ',
      '   GYYYYYYYYG   ',
      '    GYYYYYYG    ',
      '   GLYYYYYYYG   ',
      '  GLYYG  GYYYG  ',
      ' GLYYG    GYYYG ',
      'GLYYG      GYYYG',
      'GGGG        GGGG',
      '                ',
      '                '
    ];
    this.sprites['star_full'] = this.renderMatrix(mFull, cmFull, 16, 16);

    // 2. Half Star (16x16)
    const cmHalf = {
      'G': '#b07800', // Gold outline
      'Y': '#fcb400', // Gold fill
      'L': '#ffe448', // Bright highlight
      'W': '#ffffff', // Specular
      'D': '#3a3a4c', // Dark outline
      'E': '#181824'  // Dark empty fill
    };
    const mHalf = [
      '       GD       ',
      '       YE       ',
      '      LYEE      ',
      '     WLYEEE     ',
      'GGGGGWLYEEEDDDDD',
      ' GYYYWLYEEEDEEG ',
      '  GYYWLYEEEDEG  ',
      '   GYYYYEEED    ',
      '    GYYYEED     ',
      '   GLYYYYEEED    ',
      '  GLYYG  GEEED  ',
      ' GLYYG    GEEED ',
      'GLYYG      GEEED',
      'GGGG        DDDD',
      '                ',
      '                '
    ];
    this.sprites['star_half'] = this.renderMatrix(mHalf, cmHalf, 16, 16);

    // 3. Empty Star (16x16)
    const cmEmpty = {
      'D': '#3a3a4c', // Dark slate outline
      'E': '#181824', // Empty fill
      'H': '#54546c'  // Muted grey rim
    };
    const mEmpty = [
      '       DD       ',
      '       EE       ',
      '      HEEE      ',
      '     EHEEEE     ',
      'DDDDDEHEEEEDDDDD',
      ' DEEEHEEEEEDEEH ',
      '  DEEHEEEEEDEH  ',
      '   DEEEEEEEEH   ',
      '    DEEEEEEH    ',
      '   DHEEEEEEEH   ',
      '  DHEED  DEEEH  ',
      ' DHEED    DEEEH ',
      'DHEED      DEEEH',
      'DDDD        DDDD',
      '                ',
      '                '
    ];
    this.sprites['star_empty'] = this.renderMatrix(mEmpty, cmEmpty, 16, 16);
  }

  renderMatrix(matrix, colorMap, w, h) {
    const { canvas, ctx } = this.createCanvas(w, h);
    this.drawPixels(ctx, matrix, colorMap, 1, 0, 0);
    return canvas;
  }

  get(name) {
    return this.sprites[name] || null;
  }
}

window.spriteManager = new SpriteManager();
