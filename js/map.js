/**
 * Level & Map Data for Burger Panic Mobile
 * Designed for 240 x 320 vertical portrait canvas
 */
class LevelMap {
  constructor() {
    this.width = 240;
    this.height = 320;
    this.levels = this.defineLevels();
  }

  defineLevels() {
    return [

      // ==========================================
      // STAGE 1: Classic Beginner Kitchen
      // ==========================================
      {
        stageNumber: 1,
        name: 'LA COCINA CLÁSICA',
        bonusSpots: [
          { x: 26, y: 148 },
          { x: 112, y: 100 },
          { x: 196, y: 148 },
          { x: 112, y: 244 }
        ],
        floors: [
          // y, xStart, xEnd
          { y: 52, x1: 12, x2: 232 },
          { y: 100, x1: 12, x2: 232 },
          { y: 148, x1: 12, x2: 232 },
          { y: 196, x1: 12, x2: 232 },
          { y: 244, x1: 12, x2: 232 },
          { y: 292, x1: 12, x2: 232 } // Plate floor
        ],
        ladders: [
          // x, yTop, yBottom
          // Outer left/right ladders
          { x: 12, y1: 52, y2: 292 },
          { x: 212, y1: 52, y2: 292 },
          // Inter-burger ladders
          { x: 56, y1: 52, y2: 196 },
          { x: 68, y1: 100, y2: 244 },
          { x: 112, y1: 52, y2: 244 },
          { x: 124, y1: 100, y2: 292 },
          { x: 168, y1: 52, y2: 196 },
          { x: 180, y1: 148, y2: 292 }
        ],
        burgers: [
          // Stack 0
          { col: 0, x: 22, y: 52, type: 'bun_top' },
          { col: 0, x: 22, y: 100, type: 'lettuce' },
          { col: 0, x: 22, y: 148, type: 'patty' },
          { col: 0, x: 22, y: 196, type: 'bun_bottom' },

          // Stack 1
          { col: 1, x: 78, y: 52, type: 'bun_top' },
          { col: 1, x: 78, y: 100, type: 'cheese' },
          { col: 1, x: 78, y: 148, type: 'patty' },
          { col: 1, x: 78, y: 196, type: 'bun_bottom' },

          // Stack 2
          { col: 2, x: 134, y: 52, type: 'bun_top' },
          { col: 2, x: 134, y: 100, type: 'lettuce' },
          { col: 2, x: 134, y: 148, type: 'patty' },
          { col: 2, x: 134, y: 196, type: 'bun_bottom' },

          // Stack 3
          { col: 3, x: 186, y: 52, type: 'bun_top' },
          { col: 3, x: 186, y: 100, type: 'tomato' },
          { col: 3, x: 186, y: 148, type: 'patty' },
          { col: 3, x: 186, y: 196, type: 'bun_bottom' }
        ],
        plates: [
          { x: 20, y: 292 },
          { x: 76, y: 292 },
          { x: 132, y: 292 },
          { x: 184, y: 292 }
        ],
        playerStart: { x: 112, y: 292 },
        enemies: [
          { type: 'hotdog', x: 22, y: 52 },
          { type: 'hotdog', x: 186, y: 52 },
          { type: 'pickle', x: 112, y: 52 }
        ],
        enemySpeed: 0.65
      },

      // ==========================================
      // STAGE 2: The Staggered Labyrinth
      // ==========================================
      {
        stageNumber: 2,
        name: 'LA DESPENSA DE ESPECIAS',
        bonusSpots: [
          { x: 36, y: 96 },
          { x: 180, y: 96 },
          { x: 60, y: 192 },
          { x: 130, y: 144 }
        ],
        floors: [
          { y: 48, x1: 12, x2: 232 },
          { y: 96, x1: 12, x2: 232 },
          { y: 144, x1: 12, x2: 232 },
          { y: 192, x1: 12, x2: 232 },
          { y: 240, x1: 12, x2: 232 },
          { y: 288, x1: 12, x2: 232 }
        ],
        ladders: [
          { x: 12, y1: 48, y2: 192 },
          { x: 36, y1: 96, y2: 240 },
          { x: 60, y1: 48, y2: 144 },
          { x: 60, y1: 192, y2: 288 },
          { x: 106, y1: 96, y2: 240 },
          { x: 130, y1: 48, y2: 192 },
          { x: 154, y1: 144, y2: 288 },
          { x: 180, y1: 48, y2: 144 },
          { x: 200, y1: 96, y2: 240 },
          { x: 212, y1: 144, y2: 288 }
        ],
        burgers: [
          // Stack 0
          { col: 0, x: 22, y: 48, type: 'bun_top' },
          { col: 0, x: 22, y: 96, type: 'lettuce' },
          { col: 0, x: 22, y: 144, type: 'cheese' },
          { col: 0, x: 22, y: 192, type: 'patty' },
          { col: 0, x: 22, y: 240, type: 'bun_bottom' },

          // Stack 1
          { col: 1, x: 78, y: 48, type: 'bun_top' },
          { col: 1, x: 78, y: 96, type: 'tomato' },
          { col: 1, x: 78, y: 144, type: 'lettuce' },
          { col: 1, x: 78, y: 192, type: 'patty' },
          { col: 1, x: 78, y: 240, type: 'bun_bottom' },

          // Stack 2
          { col: 2, x: 134, y: 48, type: 'bun_top' },
          { col: 2, x: 134, y: 96, type: 'cheese' },
          { col: 2, x: 134, y: 144, type: 'patty' },
          { col: 2, x: 134, y: 192, type: 'tomato' },
          { col: 2, x: 134, y: 240, type: 'bun_bottom' },

          // Stack 3
          { col: 3, x: 186, y: 48, type: 'bun_top' },
          { col: 3, x: 186, y: 96, type: 'lettuce' },
          { col: 3, x: 186, y: 144, type: 'patty' },
          { col: 3, x: 186, y: 192, type: 'cheese' },
          { col: 3, x: 186, y: 240, type: 'bun_bottom' }
        ],
        plates: [
          { x: 20, y: 288 },
          { x: 76, y: 288 },
          { x: 132, y: 288 },
          { x: 184, y: 288 }
        ],
        playerStart: { x: 112, y: 288 },
        enemies: [
          { type: 'hotdog', x: 22, y: 48 },
          { type: 'hotdog', x: 186, y: 48 },
          { type: 'pickle', x: 78, y: 48 },
          { type: 'egg', x: 134, y: 48 }
        ],
        enemySpeed: 0.75
      },

      // ==========================================
      // STAGE 3: 💥 BOSS STAGE - EL COLOSO KILOBURNER
      // Auto-scrolling Cyber-Furnace Arena with Soplete Weapons
      // ==========================================
      {
        stageNumber: 3,
        name: 'EL COLOSO KILOBURNER',
        isBossStage: true,
        boss: {
          type: 'kiloburner',
          health: 400,
          name: 'KILOBURNER'
        },
        exclusivePower: 'SOPLETE',
        width: 1600,
        autoScroll: true,
        autoScrollSpeed: 0.45,
        bonusSpots: [
          { x: 120, y: 120 },
          { x: 390, y: 120 },
          { x: 660, y: 120 },
          { x: 930, y: 120 },
          { x: 1200, y: 120 },
          { x: 1460, y: 120 }
        ],
        floors: [
          // Ground floor segments (y = 288)
          { y: 288, x1: 20, x2: 260 },
          { y: 288, x1: 280, x2: 530 },
          { y: 288, x1: 550, x2: 800 },
          { y: 288, x1: 820, x2: 1070 },
          { y: 288, x1: 1090, x2: 1340 },
          { y: 288, x1: 1360, x2: 1590 },

          // Blowtorch combat platforms (y = 200)
          { y: 200, x1: 90, x2: 190 },
          { y: 200, x1: 350, x2: 450 },
          { y: 200, x1: 620, x2: 720 },
          { y: 200, x1: 890, x2: 990 },
          { y: 200, x1: 1160, x2: 1260 },
          { y: 200, x1: 1420, x2: 1520 },

          // High platforms (y = 120)
          { y: 120, x1: 70, x2: 160 },
          { y: 120, x1: 340, x2: 430 },
          { y: 120, x1: 610, x2: 700 },
          { y: 120, x1: 880, x2: 970 },
          { y: 120, x1: 1150, x2: 1240 },
          { y: 120, x1: 1480, x2: 1570 },

          // Ceiling rails (y = 52)
          { y: 52, x1: 50, x2: 140 },
          { y: 52, x1: 320, x2: 410 },
          { y: 52, x1: 590, x2: 680 },
          { y: 52, x1: 860, x2: 950 },
          { y: 52, x1: 1130, x2: 1220 },
          { y: 52, x1: 1400, x2: 1490 }
        ],
        ladders: [
          // Section 1 (x: 0 - 260)
          { x: 100, y1: 200, y2: 288 },
          { x: 150, y1: 120, y2: 200 },
          { x: 90, y1: 52, y2: 120 },

          // Section 2 (x: 260 - 530)
          { x: 360, y1: 200, y2: 288 },
          { x: 410, y1: 120, y2: 200 },
          { x: 350, y1: 52, y2: 120 },

          // Section 3 (x: 530 - 800)
          { x: 630, y1: 200, y2: 288 },
          { x: 680, y1: 120, y2: 200 },
          { x: 620, y1: 52, y2: 120 },

          // Section 4 (x: 800 - 1070)
          { x: 900, y1: 200, y2: 288 },
          { x: 950, y1: 120, y2: 200 },
          { x: 890, y1: 52, y2: 120 },

          // Section 5 (x: 1070 - 1340)
          { x: 1170, y1: 200, y2: 288 },
          { x: 1220, y1: 120, y2: 200 },
          { x: 1160, y1: 52, y2: 120 },

          // Section 6 (x: 1340 - 1600)
          { x: 1440, y1: 200, y2: 288 },
          { x: 1500, y1: 120, y2: 200 }
        ],
        blowtorches: [
          { id: 1, x: 140, y: 200 },
          { id: 2, x: 400, y: 200 },
          { id: 3, x: 670, y: 200 },
          { id: 4, x: 940, y: 200 },
          { id: 5, x: 1210, y: 200 },
          { id: 6, x: 1470, y: 200 }
        ],
        burgers: [],
        plates: [],
        playerStart: { x: 40, y: 288 },
        enemies: [],
        enemySpeed: 0.70
      },

      // ==========================================
      // STAGE 4: Wide Kitchen & Broken Platforms
      // Asymmetric layout with gaps, jumps & wide exploration
      // ==========================================
      {
        stageNumber: 4,
        name: 'EL GRAN BISTRÓ GOURMET',
        bonusSpots: [
          { x: 44, y: 96 },
          { x: 130, y: 144 },
          { x: 220, y: 96 },
          { x: 310, y: 144 }
        ],
        width: 370,
        floors: [
          // Y = 48 (Dispersed top platforms with jump gaps)
          { y: 48, x1: 12, x2: 74 },
          { y: 48, x1: 104, x2: 168 },
          { y: 48, x1: 180, x2: 262 },
          { y: 48, x1: 290, x2: 354 },

          // Y = 96 (Asymmetric platforms with jump gaps & solid ladder connections)
          { y: 96, x1: 12, x2: 92 },
          { y: 96, x1: 104, x2: 160 },
          { y: 96, x1: 180, x2: 202 },
          { y: 96, x1: 210, x2: 278 },
          { y: 96, x1: 292, x2: 354 },

          // Y = 144 (Dispersed girders & jump gaps)
          { y: 144, x1: 12, x2: 68 },
          { y: 144, x1: 80, x2: 114 },
          { y: 144, x1: 114, x2: 172 },
          { y: 144, x1: 180, x2: 256 },
          { y: 144, x1: 270, x2: 354 },

          // Y = 192 (Varied platform lengths & stepping gaps)
          { y: 192, x1: 12, x2: 92 },
          { y: 192, x1: 108, x2: 164 },
          { y: 192, x1: 180, x2: 212 },
          { y: 192, x1: 210, x2: 278 },
          { y: 192, x1: 294, x2: 354 },

          // Y = 240 (Lower jump platforms)
          { y: 240, x1: 12, x2: 70 },
          { y: 240, x1: 80, x2: 116 },
          { y: 240, x1: 116, x2: 174 },
          { y: 240, x1: 180, x2: 258 },
          { y: 240, x1: 270, x2: 354 },

          // Y = 288 (Conveyor Plate Floor)
          { y: 288, x1: 12, x2: 354 }
        ],
        ladders: [
          // Outer border ladders
          { x: 14, y1: 48, y2: 288 },
          { x: 346, y1: 48, y2: 288 },

          // Interior ladders spanning platforms
          { x: 64, y1: 48, y2: 192 },
          { x: 86, y1: 96, y2: 240 },
          { x: 104, y1: 48, y2: 144 },
          { x: 154, y1: 96, y2: 240 },
          { x: 184, y1: 48, y2: 288 },
          { x: 210, y1: 96, y2: 240 },
          { x: 256, y1: 48, y2: 192 },
          { x: 274, y1: 96, y2: 240 },
          { x: 338, y1: 48, y2: 192 }
        ],
        burgers: [
          // Burger 0: Far Left Zone
          { col: 0, x: 28, y: 48, type: 'bun_top' },
          { col: 0, x: 28, y: 96, type: 'lettuce' },
          { col: 0, x: 28, y: 144, type: 'cheese' },
          { col: 0, x: 28, y: 192, type: 'patty' },
          { col: 0, x: 28, y: 240, type: 'bun_bottom' },

          // Burger 1: Mid-Left Zone
          { col: 1, x: 118, y: 48, type: 'bun_top' },
          { col: 1, x: 118, y: 96, type: 'tomato' },
          { col: 1, x: 118, y: 144, type: 'cheese' },
          { col: 1, x: 118, y: 192, type: 'patty' },
          { col: 1, x: 118, y: 240, type: 'bun_bottom' },

          // Burger 2: Mid-Right Zone
          { col: 2, x: 216, y: 48, type: 'bun_top' },
          { col: 2, x: 216, y: 96, type: 'lettuce' },
          { col: 2, x: 216, y: 144, type: 'tomato' },
          { col: 2, x: 216, y: 192, type: 'patty' },
          { col: 2, x: 216, y: 240, type: 'bun_bottom' },

          // Burger 3: Far Right Zone
          { col: 3, x: 302, y: 48, type: 'bun_top' },
          { col: 3, x: 302, y: 96, type: 'cheese' },
          { col: 3, x: 302, y: 144, type: 'lettuce' },
          { col: 3, x: 302, y: 192, type: 'patty' },
          { col: 3, x: 302, y: 240, type: 'bun_bottom' }
        ],
        plates: [
          { x: 26, y: 288 },
          { x: 116, y: 288 },
          { x: 214, y: 288 },
          { x: 300, y: 288 }
        ],
        playerStart: { x: 184, y: 288 },
        enemies: [
          { type: 'hotdog', x: 28, y: 48 },
          { type: 'hotdog', x: 302, y: 48 },
          { type: 'pickle', x: 118, y: 48 },
          { type: 'egg', x: 216, y: 48 }
        ],
        enemySpeed: 0.85
      },

      // ==========================================
      // STAGE 5: LA MARISQUERÍA DEL PULPO (Wide Screen: 360px)
      // ==========================================
      {
        stageNumber: 5,
        name: 'LA MARISQUERÍA DEL PULPO',
        width: 360,
        bonusSpots: [
          { x: 54, y: 144 },
          { x: 160, y: 96 },
          { x: 260, y: 144 },
          { x: 180, y: 240 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 94 },
          { y: 48, x1: 114, x2: 246 },
          { y: 48, x1: 266, x2: 356 },
          { y: 96, x1: 16, x2: 140 },
          { y: 96, x1: 150, x2: 280 },
          { y: 96, x1: 298, x2: 356 },
          { y: 144, x1: 16, x2: 94 },
          { y: 144, x1: 100, x2: 191 },
          { y: 144, x1: 210, x2: 300 },
          { y: 144, x1: 310, x2: 356 },
          { type: 'diagonal', x1: 94, y1: 144, x2: 140, y2: 192 },
          { y: 192, x1: 16, x2: 120 },
          { y: 192, x1: 140, x2: 220 },
          { y: 192, x1: 240, x2: 356 },
          { y: 240, x1: 16, x2: 100 },
          { y: 240, x1: 120, x2: 240 },
          { y: 240, x1: 250, x2: 356 },
          { y: 288, x1: 12, x2: 356 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 340, y1: 48, y2: 288 },
          { x: 70, y1: 48, y2: 144 },
          { x: 120, y1: 96, y2: 240 },
          { x: 150, y1: 48, y2: 192 },
          { x: 175, y1: 144, y2: 288 },
          { x: 210, y1: 48, y2: 144 },
          { x: 250, y1: 96, y2: 240 },
          { x: 280, y1: 144, y2: 288 },
          { x: 310, y1: 48, y2: 192 }
        ],
        burgers: [
          { col: 0, x: 36, y: 48, type: 'bun_top' },
          { col: 0, x: 36, y: 96, type: 'lettuce' },
          { col: 0, x: 36, y: 144, type: 'tomato' },
          { col: 0, x: 36, y: 192, type: 'patty' },
          { col: 0, x: 36, y: 240, type: 'bun_bottom' },
          { col: 1, x: 126, y: 48, type: 'bun_top' },
          { col: 1, x: 126, y: 96, type: 'cheese' },
          { col: 1, x: 126, y: 144, type: 'patty' },
          { col: 1, x: 126, y: 192, type: 'bun_bottom' },
          { col: 2, x: 222, y: 48, type: 'bun_top' },
          { col: 2, x: 222, y: 96, type: 'lettuce' },
          { col: 2, x: 222, y: 144, type: 'cheese' },
          { col: 2, x: 222, y: 192, type: 'patty' },
          { col: 2, x: 222, y: 240, type: 'bun_bottom' },
          { col: 3, x: 304, y: 48, type: 'bun_top' },
          { col: 3, x: 304, y: 96, type: 'tomato' },
          { col: 3, x: 304, y: 144, type: 'patty' },
          { col: 3, x: 304, y: 192, type: 'bun_bottom' }
        ],
        plates: [
          { x: 34, y: 288 },
          { x: 124, y: 288 },
          { x: 220, y: 288 },
          { x: 302, y: 288 }
        ],
        playerStart: { x: 176, y: 288 },
        enemies: [
          { type: 'hotdog', x: 36, y: 48 },
          { type: 'hotdog', x: 304, y: 48 },
          { type: 'pickle', x: 126, y: 48 },
          { type: 'egg', x: 222, y: 48 }
        ],
        enemySpeed: 0.88
      },

      // ==========================================
      // STAGE 6: LA ESTACIÓN DE CAFÉ & BARISTA (Wide Screen: 370px)
      // ==========================================
      {
        stageNumber: 6,
        name: 'LA ESTACIÓN DE CAFÉ & BARISTA',
        width: 370,
        bonusSpots: [
          { x: 44, y: 96 },
          { x: 140, y: 144 },
          { x: 230, y: 96 },
          { x: 320, y: 144 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 100 },
          { y: 48, x1: 120, x2: 250 },
          { y: 48, x1: 270, x2: 366 },
          { y: 96, x1: 16, x2: 80 },
          { y: 96, x1: 98, x2: 188 },
          { y: 96, x1: 208, x2: 298 },
          { y: 96, x1: 306, x2: 366 },
          { type: 'diagonal', x1: 80, y1: 96, x2: 124, y2: 144 },
          { y: 144, x1: 16, x2: 124 },
          { y: 144, x1: 144, x2: 246 },
          { y: 144, x1: 256, x2: 366 },
          { type: 'diagonal', x1: 246, y1: 144, x2: 290, y2: 192 },
          { y: 192, x1: 16, x2: 94 },
          { y: 192, x1: 110, x2: 200 },
          { y: 192, x1: 220, x2: 322 },
          { y: 192, x1: 328, x2: 366 },
          { y: 240, x1: 16, x2: 130 },
          { y: 240, x1: 150, x2: 246 },
          { y: 240, x1: 260, x2: 366 },
          { y: 288, x1: 12, x2: 366 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 350, y1: 48, y2: 288 },
          { x: 60, y1: 48, y2: 144 },
          { x: 78, y1: 144, y2: 240 },
          { x: 124, y1: 48, y2: 192 },
          { x: 156, y1: 96, y2: 288 },
          { x: 210, y1: 48, y2: 144 },
          { x: 226, y1: 144, y2: 240 },
          { x: 274, y1: 48, y2: 192 },
          { x: 306, y1: 96, y2: 288 }
        ],
        burgers: [
          { col: 0, x: 32, y: 48, type: 'bun_top' },
          { col: 0, x: 32, y: 96, type: 'lettuce' },
          { col: 0, x: 32, y: 144, type: 'patty' },
          { col: 0, x: 32, y: 192, type: 'bun_bottom' },
          { col: 1, x: 124, y: 48, type: 'bun_top' },
          { col: 1, x: 124, y: 96, type: 'cheese' },
          { col: 1, x: 124, y: 144, type: 'tomato' },
          { col: 1, x: 124, y: 192, type: 'patty' },
          { col: 1, x: 124, y: 240, type: 'bun_bottom' },
          { col: 2, x: 218, y: 48, type: 'bun_top' },
          { col: 2, x: 218, y: 96, type: 'lettuce' },
          { col: 2, x: 218, y: 144, type: 'patty' },
          { col: 2, x: 218, y: 192, type: 'bun_bottom' },
          { col: 3, x: 312, y: 48, type: 'bun_top' },
          { col: 3, x: 312, y: 96, type: 'cheese' },
          { col: 3, x: 312, y: 144, type: 'tomato' },
          { col: 3, x: 312, y: 192, type: 'patty' },
          { col: 3, x: 312, y: 240, type: 'bun_bottom' }
        ],
        plates: [
          { x: 30, y: 288 },
          { x: 122, y: 288 },
          { x: 216, y: 288 },
          { x: 310, y: 288 }
        ],
        playerStart: { x: 184, y: 288 },
        enemies: [
          { type: 'hotdog', x: 32, y: 48 },
          { type: 'hotdog', x: 312, y: 48 },
          { type: 'pickle', x: 124, y: 48 },
          { type: 'egg', x: 218, y: 48 }
        ],
        enemySpeed: 0.92
      },

      // ==========================================
      // STAGE 7: LA PASTELERÍA FELINA (Wide Screen: 380px)
      // ==========================================
      {
        stageNumber: 7,
        name: 'LA PASTELERÍA FELINA',
        width: 380,
        bonusSpots: [
          { x: 38, y: 144 },
          { x: 144, y: 96 },
          { x: 240, y: 144 },
          { x: 336, y: 96 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 110 },
          { y: 48, x1: 130, x2: 250 },
          { y: 48, x1: 270, x2: 376 },
          { y: 96, x1: 16, x2: 148 },
          { y: 96, x1: 164, x2: 288 },
          { y: 96, x1: 306, x2: 376 },
          { type: 'diagonal', x1: 110, y1: 96, x2: 154, y2: 144 },
          { y: 144, x1: 16, x2: 102 },
          { y: 144, x1: 108, x2: 204 },
          { y: 144, x1: 224, x2: 320 },
          { y: 144, x1: 328, x2: 376 },
          { type: 'diagonal', x1: 224, y1: 144, x2: 270, y2: 192 },
          { y: 192, x1: 16, x2: 148 },
          { y: 192, x1: 154, x2: 270 },
          { y: 192, x1: 284, x2: 376 },
          { y: 240, x1: 16, x2: 102 },
          { y: 240, x1: 116, x2: 224 },
          { y: 240, x1: 244, x2: 376 },
          { y: 288, x1: 12, x2: 376 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 360, y1: 48, y2: 288 },
          { x: 64, y1: 48, y2: 144 },
          { x: 86, y1: 96, y2: 240 },
          { x: 132, y1: 48, y2: 192 },
          { x: 170, y1: 96, y2: 288 },
          { x: 226, y1: 48, y2: 144 },
          { x: 254, y1: 96, y2: 240 },
          { x: 290, y1: 48, y2: 192 },
          { x: 328, y1: 96, y2: 288 }
        ],
        burgers: [
          { col: 0, x: 30, y: 48, type: 'bun_top' },
          { col: 0, x: 30, y: 96, type: 'lettuce' },
          { col: 0, x: 30, y: 144, type: 'cheese' },
          { col: 0, x: 30, y: 192, type: 'patty' },
          { col: 0, x: 30, y: 240, type: 'bun_bottom' },
          { col: 1, x: 128, y: 48, type: 'bun_top' },
          { col: 1, x: 128, y: 96, type: 'tomato' },
          { col: 1, x: 128, y: 144, type: 'patty' },
          { col: 1, x: 128, y: 192, type: 'bun_bottom' },
          { col: 2, x: 228, y: 48, type: 'bun_top' },
          { col: 2, x: 228, y: 96, type: 'lettuce' },
          { col: 2, x: 228, y: 144, type: 'cheese' },
          { col: 2, x: 228, y: 192, type: 'patty' },
          { col: 2, x: 228, y: 240, type: 'bun_bottom' },
          { col: 3, x: 326, y: 48, type: 'bun_top' },
          { col: 3, x: 326, y: 96, type: 'tomato' },
          { col: 3, x: 326, y: 144, type: 'patty' },
          { col: 3, x: 326, y: 192, type: 'bun_bottom' }
        ],
        plates: [
          { x: 28, y: 288 },
          { x: 126, y: 288 },
          { x: 226, y: 288 },
          { x: 324, y: 288 }
        ],
        playerStart: { x: 190, y: 288 },
        enemies: [
          { type: 'hotdog', x: 30, y: 48 },
          { type: 'hotdog', x: 326, y: 48 },
          { type: 'pickle', x: 128, y: 48 },
          { type: 'egg', x: 228, y: 48 }
        ],
        enemySpeed: 0.96
      },

      // ==========================================
      // STAGE 8: EL ASADOR DEL CASTILLO (Wide Screen: 360px)
      // ==========================================
      {
        stageNumber: 8,
        name: 'EL ASADOR DEL CASTILLO',
        width: 360,
        bonusSpots: [
          { x: 36, y: 96 },
          { x: 132, y: 144 },
          { x: 224, y: 96 },
          { x: 314, y: 144 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 88 },
          { y: 48, x1: 108, x2: 244 },
          { y: 48, x1: 264, x2: 356 },
          { y: 96, x1: 16, x2: 134 },
          { y: 96, x1: 150, x2: 234 },
          { y: 96, x1: 288, x2: 356 },
          { y: 144, x1: 16, x2: 96 },
          { y: 144, x1: 114, x2: 234 },
          { y: 144, x1: 288, x2: 356 },
          { type: 'elevator', x1: 240, x2: 276, y: 192, minY: 96, maxY: 240, speed: 0.028, phase: 0 },
          { y: 192, x1: 16, x2: 140 },
          { y: 192, x1: 160, x2: 234 },
          { y: 192, x1: 288, x2: 356 },
          { y: 240, x1: 16, x2: 100 },
          { y: 240, x1: 120, x2: 234 },
          { y: 240, x1: 288, x2: 356 },
          { y: 288, x1: 12, x2: 356 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 340, y1: 48, y2: 288 },
          { x: 54, y1: 48, y2: 144 },
          { x: 80, y1: 96, y2: 240 },
          { x: 118, y1: 48, y2: 192 },
          { x: 170, y1: 96, y2: 288 },
          { x: 218, y1: 48, y2: 144 },
          { x: 310, y1: 96, y2: 288 }
        ],
        burgers: [
          { col: 0, x: 30, y: 48, type: 'bun_top' },
          { col: 0, x: 30, y: 96, type: 'lettuce' },
          { col: 0, x: 30, y: 144, type: 'patty' },
          { col: 0, x: 30, y: 192, type: 'bun_bottom' },
          { col: 1, x: 122, y: 48, type: 'bun_top' },
          { col: 1, x: 122, y: 96, type: 'cheese' },
          { col: 1, x: 122, y: 144, type: 'tomato' },
          { col: 1, x: 122, y: 192, type: 'patty' },
          { col: 1, x: 122, y: 240, type: 'bun_bottom' },
          { col: 2, x: 214, y: 48, type: 'bun_top' },
          { col: 2, x: 214, y: 96, type: 'lettuce' },
          { col: 2, x: 214, y: 144, type: 'patty' },
          { col: 2, x: 214, y: 192, type: 'bun_bottom' },
          { col: 3, x: 306, y: 48, type: 'bun_top' },
          { col: 3, x: 306, y: 96, type: 'cheese' },
          { col: 3, x: 306, y: 144, type: 'tomato' },
          { col: 3, x: 306, y: 192, type: 'patty' },
          { col: 3, x: 306, y: 240, type: 'bun_bottom' }
        ],
        plates: [
          { x: 28, y: 288 },
          { x: 120, y: 288 },
          { x: 212, y: 288 },
          { x: 304, y: 288 }
        ],
        playerStart: { x: 180, y: 288 },
        enemies: [
          { type: 'hotdog', x: 30, y: 48 },
          { type: 'hotdog', x: 306, y: 48 },
          { type: 'pickle', x: 122, y: 48 },
          { type: 'egg', x: 214, y: 48 }
        ],
        enemySpeed: 1.0
      },

      // ==========================================
      // STAGE 9: LA FORJA DEL DRAGÓN (Wide Screen: 380px)
      // ==========================================
      {
        stageNumber: 9,
        name: 'LA FORJA DEL DRAGÓN',
        width: 380,
        bonusSpots: [
          { x: 42, y: 144 },
          { x: 110, y: 96 },
          { x: 240, y: 144 },
          { x: 338, y: 96 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 100 },
          { y: 48, x1: 120, x2: 166 },
          { y: 48, x1: 220, x2: 260 },
          { y: 48, x1: 280, x2: 376 },
          { y: 96, x1: 16, x2: 146 },
          { y: 96, x1: 220, x2: 294 },
          { y: 96, x1: 312, x2: 376 },
          { type: 'elevator', x1: 170, x2: 212, y: 144, minY: 72, maxY: 216, speed: 0.032, phase: 1.5 },
          { type: 'diagonal', x1: 258, y1: 144, x2: 312, y2: 192 },
          { y: 144, x1: 16, x2: 100 },
          { y: 144, x1: 110, x2: 166 },
          { y: 144, x1: 220, x2: 274 },
          { y: 144, x1: 346, x2: 376 },
          { y: 192, x1: 16, x2: 146 },
          { y: 192, x1: 220, x2: 274 },
          { y: 192, x1: 312, x2: 376 },
          { y: 240, x1: 16, x2: 100 },
          { y: 240, x1: 120, x2: 234 },
          { y: 240, x1: 254, x2: 376 },
          { y: 288, x1: 12, x2: 376 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 360, y1: 48, y2: 288 },
          { x: 60, y1: 48, y2: 144 },
          { x: 84, y1: 96, y2: 240 },
          { x: 130, y1: 48, y2: 192 },
          { x: 230, y1: 48, y2: 144 },
          { x: 258, y1: 96, y2: 240 },
          { x: 324, y1: 96, y2: 288 }
        ],
        burgers: [
          { col: 0, x: 32, y: 48, type: 'bun_top' },
          { col: 0, x: 32, y: 96, type: 'lettuce' },
          { col: 0, x: 32, y: 144, type: 'cheese' },
          { col: 0, x: 32, y: 192, type: 'patty' },
          { col: 0, x: 32, y: 240, type: 'bun_bottom' },
          { col: 1, x: 130, y: 48, type: 'bun_top' },
          { col: 1, x: 130, y: 96, type: 'tomato' },
          { col: 1, x: 130, y: 144, type: 'patty' },
          { col: 1, x: 130, y: 192, type: 'bun_bottom' },
          { col: 2, x: 230, y: 48, type: 'bun_top' },
          { col: 2, x: 230, y: 96, type: 'lettuce' },
          { col: 2, x: 230, y: 144, type: 'cheese' },
          { col: 2, x: 230, y: 192, type: 'patty' },
          { col: 2, x: 230, y: 240, type: 'bun_bottom' },
          { col: 3, x: 328, y: 48, type: 'bun_top' },
          { col: 3, x: 328, y: 96, type: 'tomato' },
          { col: 3, x: 328, y: 144, type: 'patty' },
          { col: 3, x: 328, y: 192, type: 'bun_bottom' }
        ],
        plates: [
          { x: 30, y: 288 },
          { x: 128, y: 288 },
          { x: 228, y: 288 },
          { x: 326, y: 288 }
        ],
        playerStart: { x: 188, y: 288 },
        enemies: [
          { type: 'hotdog', x: 32, y: 48 },
          { type: 'hotdog', x: 328, y: 48 },
          { type: 'pickle', x: 130, y: 48 },
          { type: 'egg', x: 230, y: 48 }
        ],
        enemySpeed: 1.04
      },

      // ==========================================
      // STAGE 10: LA COCINA DE ALTA MAR (Wide Screen: 390px)
      // ==========================================
      {
        stageNumber: 10,
        name: 'LA COCINA DE ALTA MAR',
        width: 390,
        bonusSpots: [
          { x: 44, y: 96 },
          { x: 148, y: 144 },
          { x: 248, y: 96 },
          { x: 348, y: 144 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 114 },
          { y: 48, x1: 134, x2: 264 },
          { y: 48, x1: 284, x2: 386 },
          { y: 96, x1: 16, x2: 154 },
          { y: 96, x1: 192, x2: 264 },
          { y: 96, x1: 308, x2: 386 },
          { type: 'elevator', x1: 146, x2: 186, y: 192, minY: 96, maxY: 240, speed: 0.03, phase: 0 },
          { type: 'diagonal', x1: 264, y1: 96, x2: 308, y2: 144 },
          { y: 144, x1: 16, x2: 104 },
          { y: 144, x1: 116, x2: 154 },
          { y: 144, x1: 192, x2: 286 },
          { y: 144, x1: 308, x2: 386 },
          { y: 192, x1: 16, x2: 140 },
          { y: 192, x1: 192, x2: 286 },
          { y: 192, x1: 304, x2: 386 },
          { y: 240, x1: 16, x2: 104 },
          { y: 240, x1: 124, x2: 140 },
          { y: 240, x1: 192, x2: 244 },
          { y: 240, x1: 264, x2: 386 },
          { y: 288, x1: 12, x2: 386 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 370, y1: 48, y2: 288 },
          { x: 64, y1: 48, y2: 144 },
          { x: 88, y1: 96, y2: 240 },
          { x: 138, y1: 48, y2: 144 },
          { x: 234, y1: 48, y2: 144 },
          { x: 270, y1: 144, y2: 240 },
          { x: 308, y1: 48, y2: 96 },
          { x: 340, y1: 96, y2: 288 }
        ],
        burgers: [
          { col: 0, x: 34, y: 48, type: 'bun_top' },
          { col: 0, x: 34, y: 96, type: 'lettuce' },
          { col: 0, x: 34, y: 144, type: 'cheese' },
          { col: 0, x: 34, y: 192, type: 'patty' },
          { col: 0, x: 34, y: 240, type: 'bun_bottom' },
          { col: 1, x: 136, y: 48, type: 'bun_top' },
          { col: 1, x: 136, y: 96, type: 'tomato' },
          { col: 1, x: 136, y: 144, type: 'patty' },
          { col: 1, x: 136, y: 192, type: 'bun_bottom' },
          { col: 2, x: 238, y: 48, type: 'bun_top' },
          { col: 2, x: 238, y: 96, type: 'lettuce' },
          { col: 2, x: 238, y: 144, type: 'cheese' },
          { col: 2, x: 238, y: 192, type: 'patty' },
          { col: 2, x: 238, y: 240, type: 'bun_bottom' },
          { col: 3, x: 338, y: 48, type: 'bun_top' },
          { col: 3, x: 338, y: 96, type: 'tomato' },
          { col: 3, x: 338, y: 144, type: 'patty' },
          { col: 3, x: 338, y: 192, type: 'bun_bottom' }
        ],
        plates: [
          { x: 32, y: 288 },
          { x: 134, y: 288 },
          { x: 236, y: 288 },
          { x: 336, y: 288 }
        ],
        playerStart: { x: 195, y: 288 },
        enemies: [
          { type: 'hotdog', x: 34, y: 48 },
          { type: 'hotdog', x: 338, y: 48 },
          { type: 'pickle', x: 136, y: 48 },
          { type: 'egg', x: 238, y: 48 }
        ],
        enemySpeed: 1.08
      },

      // ==========================================
      // STAGE 11: LA HELADERÍA BAJO CERO (Wide Screen: 370px)
      // ==========================================
      {
        stageNumber: 11,
        name: 'LA HELADERÍA BAJO CERO',
        width: 370,
        bonusSpots: [
          { x: 40, y: 96 },
          { x: 140, y: 144 },
          { x: 230, y: 96 },
          { x: 324, y: 144 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 96 },
          { y: 48, x1: 116, x2: 250 },
          { y: 48, x1: 270, x2: 366 },
          { y: 96, x1: 16, x2: 140 },
          { y: 96, x1: 156, x2: 280 },
          { y: 96, x1: 298, x2: 366 },
          { type: 'swaying', y: 144, baseX1: 136, baseX2: 192, range: 35, speed: 0.03, phase: 0, x1: 124, x2: 192 },
          { y: 144, x1: 16, x2: 96 },
          { y: 144, x1: 238, x2: 332 },
          { y: 144, x1: 338, x2: 366 },
          { type: 'diagonal', x1: 246, y1: 192, x2: 288, y2: 240 },
          { y: 192, x1: 16, x2: 140 },
          { y: 192, x1: 150, x2: 246 },
          { y: 192, x1: 296, x2: 366 },
          { y: 240, x1: 16, x2: 100 },
          { y: 240, x1: 120, x2: 236 },
          { y: 240, x1: 288, x2: 366 },
          { y: 288, x1: 12, x2: 366 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 350, y1: 48, y2: 288 },
          { x: 56, y1: 48, y2: 144 },
          { x: 80, y1: 96, y2: 240 },
          { x: 124, y1: 48, y2: 192 },
          { x: 168, y1: 96, y2: 192 },
          { x: 168, y1: 192, y2: 288 },
          { x: 214, y1: 48, y2: 96 },
          { x: 282, y1: 48, y2: 144 },
          { x: 316, y1: 96, y2: 288 }
        ],
        burgers: [
          { col: 0, x: 30, y: 48, type: 'bun_top' },
          { col: 0, x: 30, y: 96, type: 'lettuce' },
          { col: 0, x: 30, y: 144, type: 'patty' },
          { col: 0, x: 30, y: 192, type: 'bun_bottom' },
          { col: 1, x: 124, y: 48, type: 'bun_top' },
          { col: 1, x: 124, y: 96, type: 'cheese' },
          { col: 1, x: 124, y: 144, type: 'tomato' },
          { col: 1, x: 124, y: 192, type: 'patty' },
          { col: 1, x: 124, y: 240, type: 'bun_bottom' },
          { col: 2, x: 220, y: 48, type: 'bun_top' },
          { col: 2, x: 220, y: 96, type: 'lettuce' },
          { col: 2, x: 220, y: 144, type: 'patty' },
          { col: 2, x: 220, y: 192, type: 'bun_bottom' },
          { col: 3, x: 312, y: 48, type: 'bun_top' },
          { col: 3, x: 312, y: 96, type: 'cheese' },
          { col: 3, x: 312, y: 144, type: 'tomato' },
          { col: 3, x: 312, y: 192, type: 'patty' },
          { col: 3, x: 312, y: 240, type: 'bun_bottom' }
        ],
        plates: [
          { x: 28, y: 288 },
          { x: 122, y: 288 },
          { x: 218, y: 288 },
          { x: 310, y: 288 }
        ],
        playerStart: { x: 185, y: 288 },
        enemies: [
          { type: 'hotdog', x: 30, y: 48 },
          { type: 'hotdog', x: 312, y: 48 },
          { type: 'pickle', x: 124, y: 48 },
          { type: 'egg', x: 220, y: 48 }
        ],
        enemySpeed: 1.12
      },

      // ==========================================
      // STAGE 12: LA PANADERÍA CRUJIENTE (Wide Screen: 380px)
      // ==========================================
      {
        stageNumber: 12,
        name: 'LA PANADERÍA CRUJIENTE',
        width: 380,
        bonusSpots: [
          { x: 36, y: 144 },
          { x: 148, y: 96 },
          { x: 244, y: 144 },
          { x: 342, y: 96 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 104 },
          { y: 48, x1: 124, x2: 250 },
          { y: 48, x1: 270, x2: 376 },
          { type: 'swaying', y: 96, baseX1: 150, baseX2: 208, range: 38, speed: 0.035, phase: 0, x1: 150, x2: 208 },
          { y: 96, x1: 16, x2: 146 },
          { y: 96, x1: 218, x2: 270 },
          { y: 96, x1: 312, x2: 376 },
          { type: 'elevator', x1: 270, x2: 308, y: 192, minY: 96, maxY: 240, speed: 0.028, phase: 3.14 },
          { y: 144, x1: 16, x2: 100 },
          { y: 144, x1: 112, x2: 214 },
          { y: 144, x1: 226, x2: 270 },
          { y: 144, x1: 312, x2: 376 },
          { y: 192, x1: 16, x2: 146 },
          { y: 192, x1: 160, x2: 270 },
          { y: 192, x1: 312, x2: 376 },
          { y: 240, x1: 16, x2: 100 },
          { y: 240, x1: 120, x2: 234 },
          { y: 240, x1: 250, x2: 270 },
          { y: 240, x1: 312, x2: 376 },
          { y: 288, x1: 12, x2: 376 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 360, y1: 48, y2: 288 },
          { x: 60, y1: 48, y2: 144 },
          { x: 84, y1: 96, y2: 240 },
          { x: 130, y1: 48, y2: 192 },
          { x: 172, y1: 96, y2: 288 },
          { x: 226, y1: 48, y2: 144 },
          { x: 254, y1: 96, y2: 240 },
          { x: 324, y1: 96, y2: 288 }
        ],
        burgers: [
          { col: 0, x: 30, y: 48, type: 'bun_top' },
          { col: 0, x: 30, y: 96, type: 'lettuce' },
          { col: 0, x: 30, y: 144, type: 'patty' },
          { col: 0, x: 30, y: 192, type: 'bun_bottom' },
          { col: 1, x: 128, y: 48, type: 'bun_top' },
          { col: 1, x: 128, y: 96, type: 'cheese' },
          { col: 1, x: 128, y: 144, type: 'tomato' },
          { col: 1, x: 128, y: 192, type: 'patty' },
          { col: 1, x: 128, y: 240, type: 'bun_bottom' },
          { col: 2, x: 226, y: 48, type: 'bun_top' },
          { col: 2, x: 226, y: 96, type: 'lettuce' },
          { col: 2, x: 226, y: 144, type: 'cheese' },
          { col: 2, x: 226, y: 192, type: 'patty' },
          { col: 2, x: 226, y: 240, type: 'bun_bottom' },
          { col: 3, x: 324, y: 48, type: 'bun_top' },
          { col: 3, x: 324, y: 96, type: 'tomato' },
          { col: 3, x: 324, y: 144, type: 'patty' },
          { col: 3, x: 324, y: 192, type: 'bun_bottom' }
        ],
        plates: [
          { x: 28, y: 288 },
          { x: 126, y: 288 },
          { x: 224, y: 288 },
          { x: 322, y: 288 }
        ],
        playerStart: { x: 188, y: 288 },
        enemies: [
          { type: 'hotdog', x: 30, y: 48 },
          { type: 'hotdog', x: 324, y: 48 },
          { type: 'pickle', x: 128, y: 48 },
          { type: 'egg', x: 226, y: 48 }
        ],
        enemySpeed: 1.15
      },

      // ==========================================
      // STAGE 13: EL WOK DEL PANDA DORADO (Wide Screen: 390px)
      // ==========================================
      {
        stageNumber: 13,
        name: 'EL WOK DEL PANDA DORADO',
        width: 390,
        bonusSpots: [
          { x: 44, y: 96 },
          { x: 150, y: 144 },
          { x: 250, y: 96 },
          { x: 350, y: 144 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 114 },
          { y: 48, x1: 134, x2: 264 },
          { y: 48, x1: 284, x2: 386 },
          { type: 'diagonal', x1: 88, y1: 96, x2: 144, y2: 144 },
          { y: 96, x1: 16, x2: 104 },
          { y: 96, x1: 136, x2: 280 },
          { y: 96, x1: 324, x2: 386 },
          { y: 144, x1: 16, x2: 104 },
          { y: 144, x1: 144, x2: 252 },
          { y: 144, x1: 250, x2: 280 },
          { y: 144, x1: 324, x2: 386 },
          { type: 'swaying', y: 192, baseX1: 164, baseX2: 224, range: 40, speed: 0.032, phase: 0, x1: 164, x2: 224 },
          { type: 'elevator', x1: 280, x2: 320, y: 144, minY: 72, maxY: 216, speed: 0.03, phase: 1.0 },
          { y: 192, x1: 16, x2: 140 },
          { y: 192, x1: 240, x2: 280 },
          { y: 192, x1: 324, x2: 386 },
          { y: 240, x1: 16, x2: 104 },
          { y: 240, x1: 124, x2: 240 },
          { y: 240, x1: 260, x2: 386 },
          { y: 288, x1: 12, x2: 386 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 370, y1: 48, y2: 288 },
          { x: 64, y1: 48, y2: 144 },
          { x: 88, y1: 96, y2: 240 },
          { x: 136, y1: 48, y2: 96 },
          { x: 234, y1: 48, y2: 144 },
          { x: 264, y1: 96, y2: 240 },
          { x: 338, y1: 96, y2: 288 }
        ],
        burgers: [
          { col: 0, x: 34, y: 48, type: 'bun_top' },
          { col: 0, x: 34, y: 96, type: 'lettuce' },
          { col: 0, x: 34, y: 144, type: 'cheese' },
          { col: 0, x: 34, y: 192, type: 'patty' },
          { col: 0, x: 34, y: 240, type: 'bun_bottom' },
          { col: 1, x: 136, y: 48, type: 'bun_top' },
          { col: 1, x: 136, y: 96, type: 'tomato' },
          { col: 1, x: 136, y: 144, type: 'patty' },
          { col: 1, x: 136, y: 192, type: 'bun_bottom' },
          { col: 2, x: 238, y: 48, type: 'bun_top' },
          { col: 2, x: 238, y: 96, type: 'lettuce' },
          { col: 2, x: 238, y: 144, type: 'cheese' },
          { col: 2, x: 238, y: 192, type: 'patty' },
          { col: 2, x: 238, y: 240, type: 'bun_bottom' },
          { col: 3, x: 338, y: 48, type: 'bun_top' },
          { col: 3, x: 338, y: 96, type: 'tomato' },
          { col: 3, x: 338, y: 144, type: 'patty' },
          { col: 3, x: 338, y: 192, type: 'bun_bottom' }
        ],
        plates: [
          { x: 32, y: 288 },
          { x: 134, y: 288 },
          { x: 236, y: 288 },
          { x: 336, y: 288 }
        ],
        playerStart: { x: 195, y: 288 },
        enemies: [
          { type: 'hotdog', x: 34, y: 48 },
          { type: 'hotdog', x: 338, y: 48 },
          { type: 'pickle', x: 136, y: 48 },
          { type: 'egg', x: 238, y: 48 }
        ],
        enemySpeed: 1.18
      },

      // ==========================================
      // STAGE 14: COSMIC DINER 3000 (Wide Screen: 400px)
      // ==========================================
      {
        stageNumber: 14,
        name: 'COSMIC DINER 3000',
        width: 400,
        bonusSpots: [
          { x: 42, y: 144 },
          { x: 148, y: 96 },
          { x: 252, y: 144 },
          { x: 356, y: 96 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 78 },
          { y: 48, x1: 128, x2: 256 },
          { y: 48, x1: 270, x2: 396 },
          { type: 'swaying', y: 96, baseX1: 254, baseX2: 306, range: 34, speed: 0.028, phase: 1.5, x1: 240, x2: 306 },
          { y: 96, x1: 16, x2: 78 },
          { y: 96, x1: 128, x2: 190 },
          { y: 96, x1: 316, x2: 396 },
          { type: 'elevator', x1: 82, x2: 122, y: 192, minY: 96, maxY: 240, speed: 0.032, phase: 2.0 },
          { type: 'swing', pivotX: 200, pivotY: 30, length: 110, width: 48, maxAngle: 0.32, speed: 0.025, phase: 0, x1: 172, x2: 224, y: 140 },
          { y: 144, x1: 16, x2: 78 },
          { y: 144, x1: 128, x2: 168 },
          { y: 144, x1: 234, x2: 330 },
          { y: 144, x1: 344, x2: 396 },
          { y: 192, x1: 16, x2: 78 },
          { y: 192, x1: 128, x2: 270 },
          { y: 192, x1: 290, x2: 396 },
          { y: 240, x1: 16, x2: 78 },
          { y: 240, x1: 128, x2: 244 },
          { y: 240, x1: 264, x2: 396 },
          { y: 288, x1: 12, x2: 396 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 380, y1: 48, y2: 288 },
          { x: 54, y1: 48, y2: 288 },
          { x: 136, y1: 48, y2: 192 },
          { x: 172, y1: 96, y2: 288 },
          { x: 240, y1: 48, y2: 144 },
          { x: 344, y1: 96, y2: 288 }
        ],
        burgers: [
          { col: 0, x: 32, y: 48, type: 'bun_top' },
          { col: 0, x: 32, y: 96, type: 'lettuce' },
          { col: 0, x: 32, y: 144, type: 'cheese' },
          { col: 0, x: 32, y: 192, type: 'patty' },
          { col: 0, x: 32, y: 240, type: 'bun_bottom' },
          { col: 1, x: 140, y: 48, type: 'bun_top' },
          { col: 1, x: 140, y: 96, type: 'tomato' },
          { col: 1, x: 140, y: 144, type: 'patty' },
          { col: 1, x: 140, y: 192, type: 'bun_bottom' },
          { col: 2, x: 246, y: 48, type: 'bun_top' },
          { col: 2, x: 246, y: 96, type: 'lettuce' },
          { col: 2, x: 246, y: 144, type: 'cheese' },
          { col: 2, x: 246, y: 192, type: 'patty' },
          { col: 2, x: 246, y: 240, type: 'bun_bottom' },
          { col: 3, x: 350, y: 48, type: 'bun_top' },
          { col: 3, x: 350, y: 96, type: 'tomato' },
          { col: 3, x: 350, y: 144, type: 'patty' },
          { col: 3, x: 350, y: 192, type: 'bun_bottom' }
        ],
        plates: [
          { x: 30, y: 288 },
          { x: 138, y: 288 },
          { x: 244, y: 288 },
          { x: 348, y: 288 }
        ],
        playerStart: { x: 200, y: 288 },
        enemies: [
          { type: 'hotdog', x: 32, y: 48 },
          { type: 'hotdog', x: 350, y: 48 },
          { type: 'pickle', x: 140, y: 48 },
          { type: 'egg', x: 246, y: 48 }
        ],
        enemySpeed: 1.2
      },

      // ==========================================
      // STAGE 15: COSTILLAS JURÁSICAS & VOLCÁN (Wide Screen: 410px)
      // ==========================================
      {
        stageNumber: 15,
        name: 'COSTILLAS JURÁSICAS & VOLCÁN',
        width: 410,
        bonusSpots: [
          { x: 44, y: 96 },
          { x: 156, y: 144 },
          { x: 260, y: 96 },
          { x: 366, y: 144 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 118 },
          { y: 48, x1: 138, x2: 270 },
          { y: 48, x1: 290, x2: 406 },
          { y: 96, x1: 16, x2: 118 },
          { y: 96, x1: 196, x2: 284 },
          { y: 96, x1: 342, x2: 406 },
          { type: 'swing', pivotX: 158, pivotY: 34, length: 112, width: 50, maxAngle: 0.3, speed: 0.024, phase: 0, x1: 133, x2: 183, y: 146 },
          { type: 'diagonal', x1: 214, y1: 144, x2: 274, y2: 192 },
          { y: 144, x1: 16, x2: 108 },
          { y: 144, x1: 196, x2: 230 },
          { y: 144, x1: 342, x2: 406 },
          { type: 'elevator', x1: 294, x2: 334, y: 192, minY: 96, maxY: 240, speed: 0.034, phase: 0 },
          { y: 192, x1: 16, x2: 146 },
          { y: 192, x1: 274, x2: 290 },
          { y: 192, x1: 342, x2: 406 },
          { y: 240, x1: 16, x2: 108 },
          { y: 240, x1: 128, x2: 250 },
          { y: 240, x1: 342, x2: 406 },
          { y: 288, x1: 12, x2: 406 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 390, y1: 48, y2: 288 },
          { x: 66, y1: 48, y2: 144 },
          { x: 92, y1: 96, y2: 240 },
          { x: 90, y1: 48, y2: 96 },
          { x: 214, y1: 48, y2: 144 },
          { x: 358, y1: 96, y2: 288 }
        ],
        burgers: [
          { col: 0, x: 34, y: 48, type: 'bun_top' },
          { col: 0, x: 34, y: 96, type: 'lettuce' },
          { col: 0, x: 34, y: 144, type: 'cheese' },
          { col: 0, x: 34, y: 192, type: 'patty' },
          { col: 0, x: 34, y: 240, type: 'bun_bottom' },
          { col: 1, x: 144, y: 48, type: 'bun_top' },
          { col: 1, x: 144, y: 96, type: 'tomato' },
          { col: 1, x: 144, y: 144, type: 'patty' },
          { col: 1, x: 144, y: 192, type: 'bun_bottom' },
          { col: 2, x: 250, y: 48, type: 'bun_top' },
          { col: 2, x: 250, y: 96, type: 'lettuce' },
          { col: 2, x: 250, y: 144, type: 'cheese' },
          { col: 2, x: 250, y: 192, type: 'patty' },
          { col: 2, x: 250, y: 240, type: 'bun_bottom' },
          { col: 3, x: 356, y: 48, type: 'bun_top' },
          { col: 3, x: 356, y: 96, type: 'tomato' },
          { col: 3, x: 356, y: 144, type: 'patty' },
          { col: 3, x: 356, y: 192, type: 'bun_bottom' }
        ],
        plates: [
          { x: 32, y: 288 },
          { x: 142, y: 288 },
          { x: 248, y: 288 },
          { x: 354, y: 288 }
        ],
        playerStart: { x: 205, y: 288 },
        enemies: [
          { type: 'hotdog', x: 34, y: 48 },
          { type: 'hotdog', x: 356, y: 48 },
          { type: 'pickle', x: 144, y: 48 },
          { type: 'egg', x: 250, y: 48 }
        ],
        enemySpeed: 1.22
      },

      // ==========================================
      // STAGE 16: EL BANQUETE IMPERIAL (Wide Screen: 420px)
      // ==========================================
      {
        stageNumber: 16,
        name: 'EL BANQUETE IMPERIAL',
        width: 420,
        bonusSpots: [
          { x: 26, y: 144 },
          { x: 160, y: 96 },
          { x: 266, y: 144 },
          { x: 374, y: 96 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 100 },
          { y: 48, x1: 156, x2: 266 },
          { y: 48, x1: 330, x2: 416 },
          { type: 'swaying', y: 96, baseX1: 270, baseX2: 324, range: 36, speed: 0.03, phase: 1.5, x1: 270, x2: 324 },
          { y: 96, x1: 16, x2: 100 },
          { y: 96, x1: 156, x2: 180 },
          { y: 96, x1: 330, x2: 416 },
          { type: 'elevator', x1: 108, x2: 148, y: 192, minY: 96, maxY: 240, speed: 0.028, phase: 0 },
          { type: 'swing', pivotX: 210, pivotY: 28, length: 115, width: 54, maxAngle: 0.28, speed: 0.022, phase: 0, x1: 183, x2: 237, y: 143 },
          { type: 'diagonal', x1: 44, y1: 192, x2: 90, y2: 144 },
          { type: 'diagonal', x1: 330, y1: 144, x2: 376, y2: 192 },
          { y: 144, x1: 16, x2: 44 },
          { y: 144, x1: 90, x2: 108 },
          { y: 144, x1: 156, x2: 180 },
          { y: 144, x1: 240, x2: 330 },
          { y: 144, x1: 376, x2: 416 },
          { y: 192, x1: 16, x2: 44 },
          { y: 192, x1: 156, x2: 270 },
          { y: 192, x1: 376, x2: 416 },
          { y: 240, x1: 16, x2: 100 },
          { y: 240, x1: 156, x2: 256 },
          { y: 240, x1: 276, x2: 416 },
          { y: 288, x1: 12, x2: 416 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 400, y1: 48, y2: 288 },
          { x: 70, y1: 48, y2: 96 },
          { x: 164, y1: 48, y2: 192 },
          { x: 200, y1: 192, y2: 288 },
          { x: 250, y1: 48, y2: 144 },
          { x: 388, y1: 96, y2: 288 }
        ],
        burgers: [
          { col: 0, x: 34, y: 48, type: 'bun_top' },
          { col: 0, x: 34, y: 96, type: 'lettuce' },
          { col: 0, x: 34, y: 144, type: 'cheese' },
          { col: 0, x: 34, y: 192, type: 'patty' },
          { col: 0, x: 34, y: 240, type: 'bun_bottom' },
          { col: 1, x: 160, y: 48, type: 'bun_top' },
          { col: 1, x: 160, y: 96, type: 'tomato' },
          { col: 1, x: 160, y: 144, type: 'patty' },
          { col: 1, x: 160, y: 192, type: 'bun_bottom' },
          { col: 2, x: 254, y: 48, type: 'bun_top' },
          { col: 2, x: 254, y: 96, type: 'lettuce' },
          { col: 2, x: 254, y: 144, type: 'cheese' },
          { col: 2, x: 254, y: 192, type: 'patty' },
          { col: 2, x: 254, y: 240, type: 'bun_bottom' },
          { col: 3, x: 370, y: 48, type: 'bun_top' },
          { col: 3, x: 370, y: 96, type: 'tomato' },
          { col: 3, x: 370, y: 144, type: 'patty' },
          { col: 3, x: 370, y: 192, type: 'bun_bottom' }
        ],
        plates: [
          { x: 32, y: 288 },
          { x: 158, y: 288 },
          { x: 252, y: 288 },
          { x: 368, y: 288 }
        ],
        playerStart: { x: 210, y: 288 },
        enemies: [
          { type: 'hotdog', x: 34, y: 48 },
          { type: 'hotdog', x: 370, y: 48 },
          { type: 'pickle', x: 160, y: 48 },
          { type: 'egg', x: 254, y: 48 }
        ],
        enemySpeed: 1.25
      }
    ];
  }

  getLevel(index) {
    const loopIndex = index % this.levels.length;
    const base = JSON.parse(JSON.stringify(this.levels[loopIndex]));
    base.stageNumber = index + 1;
    // Slight speed boost for loops
    const loopMultiplier = Math.floor(index / this.levels.length);
    base.enemySpeed += loopMultiplier * 0.15;
    return base;
  }
}

window.LevelMap = LevelMap;
