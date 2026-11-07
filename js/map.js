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
      // STAGE 3: Wide Kitchen & Broken Platforms
      // Asymmetric layout with gaps, jumps & wide exploration
      // ==========================================
      {
        stageNumber: 3,
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
      // STAGE 4: LA MARISQUERÍA DEL PULPO (Wide Screen: 360px)
      // ==========================================
      {
        stageNumber: 4,
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
          { y: 48, x1: 266, x2: 344 },
          { y: 96, x1: 16, x2: 140 },
          { y: 96, x1: 164, x2: 280 },
          { y: 96, x1: 298, x2: 344 },
          { y: 144, x1: 16, x2: 80 },
          { y: 144, x1: 100, x2: 190 },
          { y: 144, x1: 210, x2: 300 },
          { y: 144, x1: 316, x2: 344 },
          { y: 192, x1: 16, x2: 120 },
          { y: 192, x1: 140, x2: 220 },
          { y: 192, x1: 240, x2: 344 },
          { y: 240, x1: 16, x2: 100 },
          { y: 240, x1: 120, x2: 240 },
          { y: 240, x1: 260, x2: 344 },
          { y: 288, x1: 12, x2: 348 }
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
      // STAGE 5: LA ESTACIÓN DE CAFÉ & BARISTA (Wide Screen: 370px)
      // ==========================================
      {
        stageNumber: 5,
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
          { y: 48, x1: 270, x2: 354 },
          { y: 96, x1: 16, x2: 80 },
          { y: 96, x1: 98, x2: 188 },
          { y: 96, x1: 208, x2: 298 },
          { y: 96, x1: 316, x2: 354 },
          { y: 144, x1: 16, x2: 124 },
          { y: 144, x1: 144, x2: 246 },
          { y: 144, x1: 256, x2: 354 },
          { y: 192, x1: 16, x2: 90 },
          { y: 192, x1: 110, x2: 200 },
          { y: 192, x1: 220, x2: 310 },
          { y: 192, x1: 328, x2: 354 },
          { y: 240, x1: 16, x2: 130 },
          { y: 240, x1: 150, x2: 246 },
          { y: 240, x1: 260, x2: 354 },
          { y: 288, x1: 12, x2: 358 }
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
      // STAGE 6: LA PASTELERÍA FELINA (Wide Screen: 380px)
      // ==========================================
      {
        stageNumber: 6,
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
          { y: 48, x1: 270, x2: 364 },
          { y: 96, x1: 16, x2: 144 },
          { y: 96, x1: 164, x2: 288 },
          { y: 96, x1: 306, x2: 364 },
          { y: 144, x1: 16, x2: 88 },
          { y: 144, x1: 108, x2: 204 },
          { y: 144, x1: 224, x2: 320 },
          { y: 144, x1: 338, x2: 364 },
          { y: 192, x1: 16, x2: 134 },
          { y: 192, x1: 154, x2: 264 },
          { y: 192, x1: 284, x2: 364 },
          { y: 240, x1: 16, x2: 96 },
          { y: 240, x1: 116, x2: 224 },
          { y: 240, x1: 244, x2: 364 },
          { y: 288, x1: 12, x2: 368 }
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
          { col: 3, x: 326, y: 48, type: 'bun_top' },
          { col: 3, x: 326, y: 96, type: 'tomato' },
          { col: 3, x: 326, y: 144, type: 'patty' },
          { col: 3, x: 326, y: 192, type: 'bun_bottom' }
        ],
        plates: [
          { x: 30, y: 288 },
          { x: 128, y: 288 },
          { x: 228, y: 288 },
          { x: 324, y: 288 }
        ],
        playerStart: { x: 190, y: 288 },
        enemies: [
          { type: 'hotdog', x: 32, y: 48 },
          { type: 'hotdog', x: 326, y: 48 },
          { type: 'pickle', x: 130, y: 48 },
          { type: 'egg', x: 230, y: 48 }
        ],
        enemySpeed: 0.96
      },

      // ==========================================
      // STAGE 7: EL ASADOR DEL CASTILLO (Wide Screen: 360px)
      // ==========================================
      {
        stageNumber: 7,
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
          { y: 48, x1: 264, x2: 344 },
          { y: 96, x1: 16, x2: 130 },
          { y: 96, x1: 150, x2: 270 },
          { y: 96, x1: 288, x2: 344 },
          { y: 144, x1: 16, x2: 94 },
          { y: 144, x1: 114, x2: 244 },
          { y: 144, x1: 260, x2: 344 },
          { y: 192, x1: 16, x2: 140 },
          { y: 192, x1: 160, x2: 304 },
          { y: 192, x1: 314, x2: 344 },
          { y: 240, x1: 16, x2: 100 },
          { y: 240, x1: 120, x2: 260 },
          { y: 240, x1: 270, x2: 344 },
          { y: 288, x1: 12, x2: 348 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 340, y1: 48, y2: 288 },
          { x: 54, y1: 48, y2: 144 },
          { x: 80, y1: 96, y2: 240 },
          { x: 118, y1: 48, y2: 192 },
          { x: 170, y1: 96, y2: 288 },
          { x: 218, y1: 48, y2: 144 },
          { x: 236, y1: 96, y2: 240 },
          { x: 280, y1: 48, y2: 192 },
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
        playerStart: { x: 170, y: 288 },
        enemies: [
          { type: 'hotdog', x: 30, y: 48 },
          { type: 'hotdog', x: 306, y: 48 },
          { type: 'pickle', x: 122, y: 48 },
          { type: 'egg', x: 214, y: 48 }
        ],
        enemySpeed: 1.0
      },

      // ==========================================
      // STAGE 8: EL HORNO DEL DRAGÓN (Wide Screen: 380px)
      // ==========================================
      {
        stageNumber: 8,
        name: 'EL HORNO DEL DRAGÓN',
        width: 380,
        bonusSpots: [
          { x: 40, y: 144 },
          { x: 142, y: 96 },
          { x: 240, y: 144 },
          { x: 338, y: 96 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 104 },
          { y: 48, x1: 124, x2: 256 },
          { y: 48, x1: 276, x2: 364 },
          { y: 96, x1: 16, x2: 136 },
          { y: 96, x1: 156, x2: 280 },
          { y: 96, x1: 300, x2: 364 },
          { y: 144, x1: 16, x2: 90 },
          { y: 144, x1: 110, x2: 214 },
          { y: 144, x1: 234, x2: 330 },
          { y: 144, x1: 346, x2: 364 },
          { y: 192, x1: 16, x2: 140 },
          { y: 192, x1: 160, x2: 270 },
          { y: 192, x1: 290, x2: 364 },
          { y: 240, x1: 16, x2: 100 },
          { y: 240, x1: 120, x2: 234 },
          { y: 240, x1: 254, x2: 364 },
          { y: 288, x1: 12, x2: 368 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 360, y1: 48, y2: 288 },
          { x: 60, y1: 48, y2: 144 },
          { x: 84, y1: 96, y2: 240 },
          { x: 130, y1: 48, y2: 192 },
          { x: 172, y1: 96, y2: 288 },
          { x: 222, y1: 48, y2: 144 },
          { x: 258, y1: 96, y2: 240 },
          { x: 288, y1: 48, y2: 192 },
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
      // STAGE 9: LA COCINA DE ALTA MAR (Wide Screen: 390px)
      // ==========================================
      {
        stageNumber: 9,
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
          { y: 48, x1: 284, x2: 374 },
          { y: 96, x1: 16, x2: 148 },
          { y: 96, x1: 168, x2: 298 },
          { y: 96, x1: 318, x2: 374 },
          { y: 144, x1: 16, x2: 96 },
          { y: 144, x1: 116, x2: 224 },
          { y: 144, x1: 244, x2: 344 },
          { y: 144, x1: 358, x2: 374 },
          { y: 192, x1: 16, x2: 144 },
          { y: 192, x1: 164, x2: 284 },
          { y: 192, x1: 304, x2: 374 },
          { y: 240, x1: 16, x2: 104 },
          { y: 240, x1: 124, x2: 244 },
          { y: 240, x1: 264, x2: 374 },
          { y: 288, x1: 12, x2: 378 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 370, y1: 48, y2: 288 },
          { x: 64, y1: 48, y2: 144 },
          { x: 88, y1: 96, y2: 240 },
          { x: 138, y1: 48, y2: 192 },
          { x: 180, y1: 96, y2: 288 },
          { x: 234, y1: 48, y2: 144 },
          { x: 270, y1: 96, y2: 240 },
          { x: 308, y1: 48, y2: 192 },
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
      // STAGE 10: LA HELADERÍA BAJO CERO (Wide Screen: 370px)
      // ==========================================
      {
        stageNumber: 10,
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
          { y: 48, x1: 270, x2: 354 },
          { y: 96, x1: 16, x2: 136 },
          { y: 96, x1: 156, x2: 280 },
          { y: 96, x1: 298, x2: 354 },
          { y: 144, x1: 16, x2: 88 },
          { y: 144, x1: 108, x2: 208 },
          { y: 144, x1: 228, x2: 324 },
          { y: 144, x1: 338, x2: 354 },
          { y: 192, x1: 16, x2: 130 },
          { y: 192, x1: 150, x2: 260 },
          { y: 192, x1: 280, x2: 354 },
          { y: 240, x1: 16, x2: 100 },
          { y: 240, x1: 120, x2: 236 },
          { y: 240, x1: 256, x2: 354 },
          { y: 288, x1: 12, x2: 358 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 350, y1: 48, y2: 288 },
          { x: 56, y1: 48, y2: 144 },
          { x: 80, y1: 96, y2: 240 },
          { x: 124, y1: 48, y2: 192 },
          { x: 168, y1: 96, y2: 288 },
          { x: 214, y1: 48, y2: 144 },
          { x: 246, y1: 96, y2: 240 },
          { x: 282, y1: 48, y2: 192 },
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
      // STAGE 11: LA PANADERÍA CRUJIENTE (Wide Screen: 380px)
      // ==========================================
      {
        stageNumber: 11,
        name: 'LA PANADERÍA CRUJIENTE',
        width: 380,
        bonusSpots: [
          { x: 38, y: 96 },
          { x: 142, y: 144 },
          { x: 238, y: 96 },
          { x: 334, y: 144 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 108 },
          { y: 48, x1: 128, x2: 252 },
          { y: 48, x1: 272, x2: 364 },
          { y: 96, x1: 16, x2: 140 },
          { y: 96, x1: 160, x2: 284 },
          { y: 96, x1: 304, x2: 364 },
          { y: 144, x1: 16, x2: 92 },
          { y: 144, x1: 112, x2: 214 },
          { y: 144, x1: 234, x2: 330 },
          { y: 144, x1: 344, x2: 364 },
          { y: 192, x1: 16, x2: 136 },
          { y: 192, x1: 156, x2: 268 },
          { y: 192, x1: 288, x2: 364 },
          { y: 240, x1: 16, x2: 98 },
          { y: 240, x1: 118, x2: 230 },
          { y: 240, x1: 250, x2: 364 },
          { y: 288, x1: 12, x2: 368 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 360, y1: 48, y2: 288 },
          { x: 60, y1: 48, y2: 144 },
          { x: 86, y1: 96, y2: 240 },
          { x: 130, y1: 48, y2: 192 },
          { x: 172, y1: 96, y2: 288 },
          { x: 224, y1: 48, y2: 144 },
          { x: 256, y1: 96, y2: 240 },
          { x: 288, y1: 48, y2: 192 },
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
          { x: 30, y: 288 },
          { x: 128, y: 288 },
          { x: 226, y: 288 },
          { x: 324, y: 288 }
        ],
        playerStart: { x: 190, y: 288 },
        enemies: [
          { type: 'hotdog', x: 32, y: 48 },
          { type: 'hotdog', x: 326, y: 48 },
          { type: 'pickle', x: 130, y: 48 },
          { type: 'egg', x: 228, y: 48 }
        ],
        enemySpeed: 1.15
      },

      // ==========================================
      // STAGE 12: EL WOK DEL PANDA GOURMET (Wide Screen: 400px)
      // ==========================================
      {
        stageNumber: 12,
        name: 'EL WOK DEL PANDA GOURMET',
        width: 400,
        bonusSpots: [
          { x: 44, y: 96 },
          { x: 130, y: 144 },
          { x: 218, y: 96 },
          { x: 306, y: 144 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 90 },
          { y: 48, x1: 108, x2: 180 },
          { y: 48, x1: 198, x2: 290 },
          { y: 48, x1: 308, x2: 384 },
          { y: 96, x1: 16, x2: 124 },
          { y: 96, x1: 144, x2: 244 },
          { y: 96, x1: 264, x2: 384 },
          { y: 144, x1: 16, x2: 96 },
          { y: 144, x1: 116, x2: 214 },
          { y: 144, x1: 234, x2: 330 },
          { y: 144, x1: 348, x2: 384 },
          { y: 192, x1: 16, x2: 140 },
          { y: 192, x1: 160, x2: 270 },
          { y: 192, x1: 290, x2: 384 },
          { y: 240, x1: 16, x2: 100 },
          { y: 240, x1: 120, x2: 234 },
          { y: 240, x1: 254, x2: 384 },
          { y: 288, x1: 12, x2: 388 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 380, y1: 48, y2: 288 },
          { x: 54, y1: 48, y2: 144 },
          { x: 78, y1: 96, y2: 240 },
          { x: 118, y1: 48, y2: 192 },
          { x: 164, y1: 96, y2: 288 },
          { x: 208, y1: 48, y2: 144 },
          { x: 240, y1: 96, y2: 240 },
          { x: 276, y1: 48, y2: 192 },
          { x: 314, y1: 96, y2: 288 },
          { x: 348, y1: 48, y2: 192 }
        ],
        burgers: [
          { col: 0, x: 28, y: 48, type: 'bun_top' },
          { col: 0, x: 28, y: 96, type: 'lettuce' },
          { col: 0, x: 28, y: 144, type: 'patty' },
          { col: 0, x: 28, y: 192, type: 'bun_bottom' },
          { col: 1, x: 114, y: 48, type: 'bun_top' },
          { col: 1, x: 114, y: 96, type: 'cheese' },
          { col: 1, x: 114, y: 144, type: 'tomato' },
          { col: 1, x: 114, y: 192, type: 'patty' },
          { col: 1, x: 114, y: 240, type: 'bun_bottom' },
          { col: 2, x: 204, y: 48, type: 'bun_top' },
          { col: 2, x: 204, y: 96, type: 'lettuce' },
          { col: 2, x: 204, y: 144, type: 'cheese' },
          { col: 2, x: 204, y: 192, type: 'patty' },
          { col: 2, x: 204, y: 240, type: 'bun_bottom' },
          { col: 3, x: 288, y: 48, type: 'bun_top' },
          { col: 3, x: 288, y: 96, type: 'tomato' },
          { col: 3, x: 288, y: 144, type: 'patty' },
          { col: 3, x: 288, y: 192, type: 'bun_bottom' },
          { col: 4, x: 356, y: 48, type: 'bun_top' },
          { col: 4, x: 356, y: 96, type: 'lettuce' },
          { col: 4, x: 356, y: 144, type: 'cheese' },
          { col: 4, x: 356, y: 192, type: 'patty' },
          { col: 4, x: 356, y: 240, type: 'bun_bottom' }
        ],
        plates: [
          { x: 26, y: 288 },
          { x: 112, y: 288 },
          { x: 202, y: 288 },
          { x: 286, y: 288 },
          { x: 354, y: 288 }
        ],
        playerStart: { x: 200, y: 288 },
        enemies: [
          { type: 'hotdog', x: 28, y: 48 },
          { type: 'hotdog', x: 356, y: 48 },
          { type: 'pickle', x: 114, y: 48 },
          { type: 'egg', x: 288, y: 48 }
        ],
        enemySpeed: 1.18
      },

      // ==========================================
      // STAGE 13: EL COMEDOR CÓSMICO (Wide Screen: 390px)
      // ==========================================
      {
        stageNumber: 13,
        name: 'EL COMEDOR CÓSMICO',
        width: 390,
        bonusSpots: [
          { x: 42, y: 96 },
          { x: 144, y: 144 },
          { x: 244, y: 96 },
          { x: 342, y: 144 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 110 },
          { y: 48, x1: 130, x2: 260 },
          { y: 48, x1: 280, x2: 374 },
          { y: 96, x1: 16, x2: 144 },
          { y: 96, x1: 164, x2: 290 },
          { y: 96, x1: 310, x2: 374 },
          { y: 144, x1: 16, x2: 94 },
          { y: 144, x1: 114, x2: 220 },
          { y: 144, x1: 240, x2: 340 },
          { y: 144, x1: 354, x2: 374 },
          { y: 192, x1: 16, x2: 140 },
          { y: 192, x1: 160, x2: 274 },
          { y: 192, x1: 294, x2: 374 },
          { y: 240, x1: 16, x2: 102 },
          { y: 240, x1: 122, x2: 240 },
          { y: 240, x1: 260, x2: 374 },
          { y: 288, x1: 12, x2: 378 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 370, y1: 48, y2: 288 },
          { x: 62, y1: 48, y2: 144 },
          { x: 86, y1: 96, y2: 240 },
          { x: 136, y1: 48, y2: 192 },
          { x: 176, y1: 96, y2: 288 },
          { x: 230, y1: 48, y2: 144 },
          { x: 264, y1: 96, y2: 240 },
          { x: 300, y1: 48, y2: 192 },
          { x: 336, y1: 96, y2: 288 }
        ],
        burgers: [
          { col: 0, x: 32, y: 48, type: 'bun_top' },
          { col: 0, x: 32, y: 96, type: 'lettuce' },
          { col: 0, x: 32, y: 144, type: 'cheese' },
          { col: 0, x: 32, y: 192, type: 'patty' },
          { col: 0, x: 32, y: 240, type: 'bun_bottom' },
          { col: 1, x: 134, y: 48, type: 'bun_top' },
          { col: 1, x: 134, y: 96, type: 'tomato' },
          { col: 1, x: 134, y: 144, type: 'patty' },
          { col: 1, x: 134, y: 192, type: 'bun_bottom' },
          { col: 2, x: 234, y: 48, type: 'bun_top' },
          { col: 2, x: 234, y: 96, type: 'lettuce' },
          { col: 2, x: 234, y: 144, type: 'cheese' },
          { col: 2, x: 234, y: 192, type: 'patty' },
          { col: 2, x: 234, y: 240, type: 'bun_bottom' },
          { col: 3, x: 336, y: 48, type: 'bun_top' },
          { col: 3, x: 336, y: 96, type: 'tomato' },
          { col: 3, x: 336, y: 144, type: 'patty' },
          { col: 3, x: 336, y: 192, type: 'bun_bottom' }
        ],
        plates: [
          { x: 30, y: 288 },
          { x: 132, y: 288 },
          { x: 232, y: 288 },
          { x: 334, y: 288 }
        ],
        playerStart: { x: 195, y: 288 },
        enemies: [
          { type: 'hotdog', x: 32, y: 48 },
          { type: 'hotdog', x: 336, y: 48 },
          { type: 'pickle', x: 134, y: 48 },
          { type: 'egg', x: 234, y: 48 },
          { type: 'egg', x: 176, y: 96 }
        ],
        enemySpeed: 1.2
      },

      // ==========================================
      // STAGE 14: EL MESÓN JURÁSICO DE CARNES (Wide Screen: 400px)
      // ==========================================
      {
        stageNumber: 14,
        name: 'EL MESÓN JURÁSICO DE CARNES',
        width: 400,
        bonusSpots: [
          { x: 42, y: 96 },
          { x: 128, y: 144 },
          { x: 214, y: 96 },
          { x: 302, y: 144 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 94 },
          { y: 48, x1: 114, x2: 184 },
          { y: 48, x1: 202, x2: 294 },
          { y: 48, x1: 312, x2: 384 },
          { y: 96, x1: 16, x2: 128 },
          { y: 96, x1: 148, x2: 248 },
          { y: 96, x1: 268, x2: 384 },
          { y: 144, x1: 16, x2: 98 },
          { y: 144, x1: 118, x2: 218 },
          { y: 144, x1: 238, x2: 334 },
          { y: 144, x1: 350, x2: 384 },
          { y: 192, x1: 16, x2: 144 },
          { y: 192, x1: 164, x2: 274 },
          { y: 192, x1: 294, x2: 384 },
          { y: 240, x1: 16, x2: 104 },
          { y: 240, x1: 124, x2: 238 },
          { y: 240, x1: 258, x2: 384 },
          { y: 288, x1: 12, x2: 388 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 380, y1: 48, y2: 288 },
          { x: 58, y1: 48, y2: 144 },
          { x: 82, y1: 96, y2: 240 },
          { x: 122, y1: 48, y2: 192 },
          { x: 168, y1: 96, y2: 288 },
          { x: 212, y1: 48, y2: 144 },
          { x: 244, y1: 96, y2: 240 },
          { x: 280, y1: 48, y2: 192 },
          { x: 318, y1: 96, y2: 288 },
          { x: 352, y1: 48, y2: 192 }
        ],
        burgers: [
          { col: 0, x: 28, y: 48, type: 'bun_top' },
          { col: 0, x: 28, y: 96, type: 'lettuce' },
          { col: 0, x: 28, y: 144, type: 'patty' },
          { col: 0, x: 28, y: 192, type: 'bun_bottom' },
          { col: 1, x: 118, y: 48, type: 'bun_top' },
          { col: 1, x: 118, y: 96, type: 'cheese' },
          { col: 1, x: 118, y: 144, type: 'tomato' },
          { col: 1, x: 118, y: 192, type: 'patty' },
          { col: 1, x: 118, y: 240, type: 'bun_bottom' },
          { col: 2, x: 208, y: 48, type: 'bun_top' },
          { col: 2, x: 208, y: 96, type: 'lettuce' },
          { col: 2, x: 208, y: 144, type: 'cheese' },
          { col: 2, x: 208, y: 192, type: 'patty' },
          { col: 2, x: 208, y: 240, type: 'bun_bottom' },
          { col: 3, x: 292, y: 48, type: 'bun_top' },
          { col: 3, x: 292, y: 96, type: 'tomato' },
          { col: 3, x: 292, y: 144, type: 'patty' },
          { col: 3, x: 292, y: 192, type: 'bun_bottom' },
          { col: 4, x: 358, y: 48, type: 'bun_top' },
          { col: 4, x: 358, y: 96, type: 'lettuce' },
          { col: 4, x: 358, y: 144, type: 'cheese' },
          { col: 4, x: 358, y: 192, type: 'patty' },
          { col: 4, x: 358, y: 240, type: 'bun_bottom' }
        ],
        plates: [
          { x: 26, y: 288 },
          { x: 116, y: 288 },
          { x: 206, y: 288 },
          { x: 290, y: 288 },
          { x: 356, y: 288 }
        ],
        playerStart: { x: 200, y: 288 },
        enemies: [
          { type: 'hotdog', x: 28, y: 48 },
          { type: 'hotdog', x: 358, y: 48 },
          { type: 'pickle', x: 118, y: 48 },
          { type: 'egg', x: 292, y: 48 },
          { type: 'pickle', x: 208, y: 48 }
        ],
        enemySpeed: 1.22
      },

      // ==========================================
      // STAGE 15: EL BANQUETE IMPERIAL DEL CHEF (Wide Screen: 420px)
      // ==========================================
      {
        stageNumber: 15,
        name: 'EL BANQUETE IMPERIAL DEL CHEF',
        width: 420,
        bonusSpots: [
          { x: 44, y: 96 },
          { x: 136, y: 144 },
          { x: 228, y: 96 },
          { x: 320, y: 144 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 98 },
          { y: 48, x1: 118, x2: 196 },
          { y: 48, x1: 214, x2: 306 },
          { y: 48, x1: 324, x2: 404 },
          { y: 96, x1: 16, x2: 136 },
          { y: 96, x1: 156, x2: 264 },
          { y: 96, x1: 284, x2: 404 },
          { y: 144, x1: 16, x2: 104 },
          { y: 144, x1: 124, x2: 230 },
          { y: 144, x1: 250, x2: 350 },
          { y: 144, x1: 368, x2: 404 },
          { y: 192, x1: 16, x2: 152 },
          { y: 192, x1: 172, x2: 290 },
          { y: 192, x1: 310, x2: 404 },
          { y: 240, x1: 16, x2: 110 },
          { y: 240, x1: 130, x2: 252 },
          { y: 240, x1: 272, x2: 404 },
          { y: 288, x1: 12, x2: 408 }
        ],
        ladders: [
          { x: 18, y1: 48, y2: 288 },
          { x: 400, y1: 48, y2: 288 },
          { x: 62, y1: 48, y2: 144 },
          { x: 88, y1: 96, y2: 240 },
          { x: 128, y1: 48, y2: 192 },
          { x: 178, y1: 96, y2: 288 },
          { x: 224, y1: 48, y2: 144 },
          { x: 258, y1: 96, y2: 240 },
          { x: 296, y1: 48, y2: 192 },
          { x: 336, y1: 96, y2: 288 },
          { x: 372, y1: 48, y2: 192 }
        ],
        burgers: [
          { col: 0, x: 30, y: 48, type: 'bun_top' },
          { col: 0, x: 30, y: 96, type: 'lettuce' },
          { col: 0, x: 30, y: 144, type: 'cheese' },
          { col: 0, x: 30, y: 192, type: 'patty' },
          { col: 0, x: 30, y: 240, type: 'bun_bottom' },
          { col: 1, x: 126, y: 48, type: 'bun_top' },
          { col: 1, x: 126, y: 96, type: 'tomato' },
          { col: 1, x: 126, y: 144, type: 'patty' },
          { col: 1, x: 126, y: 192, type: 'bun_bottom' },
          { col: 2, x: 220, y: 48, type: 'bun_top' },
          { col: 2, x: 220, y: 96, type: 'lettuce' },
          { col: 2, x: 220, y: 144, type: 'cheese' },
          { col: 2, x: 220, y: 192, type: 'patty' },
          { col: 2, x: 220, y: 240, type: 'bun_bottom' },
          { col: 3, x: 310, y: 48, type: 'bun_top' },
          { col: 3, x: 310, y: 96, type: 'tomato' },
          { col: 3, x: 310, y: 144, type: 'patty' },
          { col: 3, x: 310, y: 192, type: 'bun_bottom' },
          { col: 4, x: 376, y: 48, type: 'bun_top' },
          { col: 4, x: 376, y: 96, type: 'lettuce' },
          { col: 4, x: 376, y: 144, type: 'cheese' },
          { col: 4, x: 376, y: 192, type: 'patty' },
          { col: 4, x: 376, y: 240, type: 'bun_bottom' }
        ],
        plates: [
          { x: 28, y: 288 },
          { x: 124, y: 288 },
          { x: 218, y: 288 },
          { x: 308, y: 288 },
          { x: 374, y: 288 }
        ],
        playerStart: { x: 210, y: 288 },
        enemies: [
          { type: 'hotdog', x: 30, y: 48 },
          { type: 'hotdog', x: 376, y: 48 },
          { type: 'pickle', x: 126, y: 48 },
          { type: 'egg', x: 310, y: 48 },
          { type: 'pickle', x: 220, y: 48 }
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
