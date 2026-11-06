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
      // STAGE 4: El Pulpo Chef (Silueta de Pulpo)
      // ==========================================
      {
        stageNumber: 4,
        name: 'LA MARISQUERÍA DEL PULPO',
        background: 'bg_stage_4',
        bonusSpots: [
          { x: 24, y: 144 },
          { x: 112, y: 48 },
          { x: 196, y: 144 },
          { x: 112, y: 192 }
        ],
        floors: [
          // Y = 48 (Octopus Head Dome & Curled outer tentacle tips)
          { y: 48, x1: 14, x2: 58 },
          { y: 48, x1: 72, x2: 168 },
          { y: 48, x1: 182, x2: 226 },

          // Y = 96 (Head Base & Upper Tentacle arches)
          { y: 96, x1: 14, x2: 64 },
          { y: 96, x1: 72, x2: 168 },
          { y: 96, x1: 176, x2: 226 },

          // Y = 144 (Tentacle Branches with jump gaps)
          { y: 144, x1: 14, x2: 58 },
          { y: 144, x1: 70, x2: 114 },
          { y: 144, x1: 126, x2: 170 },
          { y: 144, x1: 182, x2: 226 },

          // Y = 192 (Tentacle Mid Sections)
          { y: 192, x1: 14, x2: 58 },
          { y: 192, x1: 70, x2: 114 },
          { y: 192, x1: 126, x2: 170 },
          { y: 192, x1: 182, x2: 226 },

          // Y = 240 (Tentacle Lower Tips)
          { y: 240, x1: 14, x2: 58 },
          { y: 240, x1: 70, x2: 114 },
          { y: 240, x1: 126, x2: 170 },
          { y: 240, x1: 182, x2: 226 },

          // Y = 288 (Bottom seafloor & Plate base)
          { y: 288, x1: 12, x2: 228 }
        ],
        ladders: [
          // Outer left tentacle ladders
          { x: 18, y1: 48, y2: 144 },
          { x: 42, y1: 96, y2: 240 },
          { x: 22, y1: 192, y2: 288 },

          // Inner left tentacle ladders
          { x: 74, y1: 48, y2: 192 },
          { x: 98, y1: 96, y2: 240 },
          { x: 78, y1: 192, y2: 288 },

          // Center suction column
          { x: 112, y1: 48, y2: 288 },

          // Inner right tentacle ladders
          { x: 142, y1: 96, y2: 240 },
          { x: 166, y1: 48, y2: 192 },
          { x: 162, y1: 192, y2: 288 },

          // Outer right tentacle ladders
          { x: 190, y1: 96, y2: 240 },
          { x: 214, y1: 48, y2: 144 },
          { x: 218, y1: 192, y2: 288 }
        ],
        burgers: [
          // Burger 0: Outer Left Tentacle (col: 0)
          { col: 0, x: 22, y: 48, type: 'bun_top' },
          { col: 0, x: 22, y: 96, type: 'lettuce' },
          { col: 0, x: 22, y: 144, type: 'cheese' },
          { col: 0, x: 22, y: 192, type: 'patty' },
          { col: 0, x: 22, y: 240, type: 'bun_bottom' },

          // Burger 1: Inner Left Tentacle (col: 1)
          { col: 1, x: 78, y: 48, type: 'bun_top' },
          { col: 1, x: 78, y: 96, type: 'tomato' },
          { col: 1, x: 78, y: 144, type: 'cheese' },
          { col: 1, x: 78, y: 192, type: 'patty' },
          { col: 1, x: 78, y: 240, type: 'bun_bottom' },

          // Burger 2: Inner Right Tentacle (col: 2)
          { col: 2, x: 132, y: 48, type: 'bun_top' },
          { col: 2, x: 132, y: 96, type: 'lettuce' },
          { col: 2, x: 132, y: 144, type: 'patty' },
          { col: 2, x: 132, y: 192, type: 'cheese' },
          { col: 2, x: 132, y: 240, type: 'bun_bottom' },

          // Burger 3: Outer Right Tentacle (col: 3)
          { col: 3, x: 188, y: 48, type: 'bun_top' },
          { col: 3, x: 188, y: 96, type: 'tomato' },
          { col: 3, x: 188, y: 144, type: 'patty' },
          { col: 3, x: 188, y: 192, type: 'cheese' },
          { col: 3, x: 188, y: 240, type: 'bun_bottom' }
        ],
        plates: [
          { x: 22, y: 288 },
          { x: 78, y: 288 },
          { x: 132, y: 288 },
          { x: 188, y: 288 }
        ],
        playerStart: { x: 112, y: 288 },
        enemies: [
          { type: 'hotdog', x: 112, y: 48 },
          { type: 'pickle', x: 22, y: 96 },
          { type: 'pickle', x: 188, y: 96 },
          { type: 'egg', x: 32, y: 48 }
        ],
        enemySpeed: 0.90
      },

      // ==========================================
      // STAGE 5: La Cafetera Exprés (Silueta de Cafetera)
      // ==========================================
      {
        stageNumber: 5,
        name: 'LA ESTACIÓN DE CAFÉ & BARISTA',
        background: 'bg_stage_5',
        bonusSpots: [
          { x: 26, y: 96 },
          { x: 112, y: 48 },
          { x: 186, y: 96 },
          { x: 112, y: 192 }
        ],
        floors: [
          // Y = 48 (Cup Warming Rack)
          { y: 48, x1: 14, x2: 60 },
          { y: 48, x1: 64, x2: 176 },
          { y: 48, x1: 180, x2: 226 },

          // Y = 96 (Red Console & Pressure Gauge)
          { y: 96, x1: 14, x2: 60 },
          { y: 96, x1: 72, x2: 114 },
          { y: 96, x1: 126, x2: 168 },
          { y: 96, x1: 180, x2: 226 },

          // Y = 144 (Steam Nozzles & Portafilter)
          { y: 144, x1: 14, x2: 58 },
          { y: 144, x1: 70, x2: 114 },
          { y: 144, x1: 126, x2: 170 },
          { y: 144, x1: 182, x2: 226 },

          // Y = 192 (Middle Chamber & Copper Pipes)
          { y: 192, x1: 14, x2: 58 },
          { y: 192, x1: 70, x2: 114 },
          { y: 192, x1: 126, x2: 170 },
          { y: 192, x1: 182, x2: 226 },

          // Y = 240 (Lower Chamber Stands)
          { y: 240, x1: 14, x2: 58 },
          { y: 240, x1: 70, x2: 114 },
          { y: 240, x1: 126, x2: 170 },
          { y: 240, x1: 182, x2: 226 },

          // Y = 288 (Drip Tray Base)
          { y: 288, x1: 12, x2: 228 }
        ],
        ladders: [
          { x: 20, y1: 48, y2: 240 },
          { x: 44, y1: 144, y2: 288 },
          { x: 76, y1: 48, y2: 192 },
          { x: 98, y1: 96, y2: 240 },
          { x: 80, y1: 192, y2: 288 },
          { x: 112, y1: 48, y2: 288 },
          { x: 142, y1: 96, y2: 240 },
          { x: 164, y1: 48, y2: 192 },
          { x: 160, y1: 192, y2: 288 },
          { x: 194, y1: 144, y2: 288 },
          { x: 218, y1: 48, y2: 240 }
        ],
        burgers: [
          // Burger 0: Steam Wand Left (col: 0)
          { col: 0, x: 26, y: 48, type: 'bun_top' },
          { col: 0, x: 26, y: 96, type: 'lettuce' },
          { col: 0, x: 26, y: 144, type: 'cheese' },
          { col: 0, x: 26, y: 192, type: 'patty' },
          { col: 0, x: 26, y: 240, type: 'bun_bottom' },

          // Burger 1: Group Head Left (col: 1)
          { col: 1, x: 80, y: 48, type: 'bun_top' },
          { col: 1, x: 80, y: 96, type: 'tomato' },
          { col: 1, x: 80, y: 144, type: 'cheese' },
          { col: 1, x: 80, y: 192, type: 'patty' },
          { col: 1, x: 80, y: 240, type: 'bun_bottom' },

          // Burger 2: Group Head Right (col: 2)
          { col: 2, x: 134, y: 48, type: 'bun_top' },
          { col: 2, x: 134, y: 96, type: 'cheese' },
          { col: 2, x: 134, y: 144, type: 'lettuce' },
          { col: 2, x: 134, y: 192, type: 'patty' },
          { col: 2, x: 134, y: 240, type: 'bun_bottom' },

          // Burger 3: Steam Wand Right (col: 3)
          { col: 3, x: 186, y: 48, type: 'bun_top' },
          { col: 3, x: 186, y: 96, type: 'tomato' },
          { col: 3, x: 186, y: 144, type: 'cheese' },
          { col: 3, x: 186, y: 192, type: 'patty' },
          { col: 3, x: 186, y: 240, type: 'bun_bottom' }
        ],
        plates: [
          { x: 24, y: 288 },
          { x: 78, y: 288 },
          { x: 132, y: 288 },
          { x: 186, y: 288 }
        ],
        playerStart: { x: 112, y: 288 },
        enemies: [
          { type: 'hotdog', x: 112, y: 48 },
          { type: 'pickle', x: 26, y: 96 },
          { type: 'pickle', x: 186, y: 96 },
          { type: 'egg', x: 32, y: 48 }
        ],
        enemySpeed: 0.95
      },

      // ==========================================
      // STAGE 6: El Gato Michi (Silueta Esculpida de Gato)
      // ==========================================
      {
        stageNumber: 6,
        name: 'LA PASTELERÍA FELINA',
        background: 'bg_stage_6',
        bonusSpots: [
          { x: 54, y: 32 },    // Punta de oreja izquierda (Pescadito / Helado)
          { x: 186, y: 32 },   // Punta de oreja derecha
          { x: 204, y: 144 },  // Punta de la cola enroscada
          { x: 112, y: 162 }   // Cascabel de Oro en el pecho (Vida Extra ⭐⭐⭐)
        ],
        floors: [
          // 1. Puntas de las Orejas (Cúspides triangulares en Y=32)
          { y: 32, x1: 42, x2: 66 },   // Punta Oreja Izquierda
          { y: 32, x1: 174, x2: 198 }, // Punta Oreja Derecha

          // 2. Base de Orejas y Frente del Gato (Y=52 y Y=64)
          { y: 52, x1: 20, x2: 60 },   // Base Oreja Izq
          { y: 52, x1: 180, x2: 220 }, // Base Oreja Der
          { y: 64, x1: 84, x2: 156 },  // Frente / Cabeza

          // 3. Bigotes Superiores y Mejillas (Y=96 y Y=100)
          { y: 96, x1: 10, x2: 56 },   // Bigote Superior Izq
          { y: 96, x1: 184, x2: 230 }, // Bigote Superior Der
          { y: 100, x1: 72, x2: 168 }, // Rostro / Mejillas Tiernas

          // 4. Bigotes Inferiores (Y=116)
          { y: 116, x1: 14, x2: 50 },  // Bigote Inferior Izq
          { y: 116, x1: 190, x2: 226 },// Bigote Inferior Der

          // 5. Punta de la Cola Rizada (Y=144)
          { y: 144, x1: 180, x2: 224 },// Punta Cola Curvada

          // 6. Collar Rojo, Cascabel y Patitas Delanteras (Y=144, Y=152, Y=162)
          { y: 144, x1: 76, x2: 164 }, // Collar Rojo
          { y: 152, x1: 24, x2: 64 },  // Pata Delantera Izquierda
          { y: 152, x1: 172, x2: 214 },// Pata Delantera Derecha
          { y: 162, x1: 106, x2: 134 },// Cascabel Dorado (Vida Extra)

          // 7. Arco Superior de la Cola (Y=174)
          { y: 174, x1: 190, x2: 226 },// Arco Superior de la Cola

          // 8. Pancita Esponjosa y Flanco (Y=196, Y=200, Y=208)
          { y: 196, x1: 68, x2: 172 }, // Pancita Calientita del Gato
          { y: 200, x1: 20, x2: 58 },  // Flanco Izquierdo
          { y: 208, x1: 176, x2: 218 },// Curva Media de la Cola

          // 9. Patas Traseras y Base de la Cola (Y=244)
          { y: 244, x1: 18, x2: 66 },  // Pata Trasera Izquierda
          { y: 244, x1: 74, x2: 166 }, // Patitas Sentadas
          { y: 244, x1: 172, x2: 208 },// Base de la Cola

          // 10. Tapete / Cesta del Gato (Y=288)
          { y: 288, x1: 12, x2: 228 }  // Base inferior con los 4 platos
        ],
        ladders: [
          // Orejas a bigotes
          { x: 48, y1: 32, y2: 96 },
          { x: 192, y1: 32, y2: 96 },

          // Frente a mejillas y collar
          { x: 96, y1: 64, y2: 144 },
          { x: 144, y1: 64, y2: 144 },

          // Bigotes a patas y tapete (Columna izquierda)
          { x: 24, y1: 96, y2: 244 },
          { x: 46, y1: 152, y2: 288 },

          // Pecho, pancita y árbol rascador central
          { x: 80, y1: 144, y2: 244 },
          { x: 112, y1: 100, y2: 288 },
          { x: 160, y1: 144, y2: 244 },

          // Cola enroscada a tapete (Columna derecha)
          { x: 204, y1: 144, y2: 208 },
          { x: 192, y1: 208, y2: 288 },
          { x: 178, y1: 152, y2: 244 }
        ],
        burgers: [
          // Pila 0 (x=26): Oreja Izq -> Bigote Izq -> Pata Izq -> Flanco -> Pata Trasera
          { col: 0, x: 26, y: 52, type: 'bun_top' },
          { col: 0, x: 26, y: 96, type: 'lettuce' },
          { col: 0, x: 26, y: 152, type: 'cheese' },
          { col: 0, x: 26, y: 200, type: 'patty' },
          { col: 0, x: 26, y: 244, type: 'bun_bottom' },

          // Pila 1 (x=80): Frente Izq -> Mejilla Izq -> Collar -> Pancita -> Pata Sentada
          { col: 1, x: 80, y: 64, type: 'bun_top' },
          { col: 1, x: 80, y: 100, type: 'tomato' },
          { col: 1, x: 80, y: 144, type: 'cheese' },
          { col: 1, x: 80, y: 196, type: 'patty' },
          { col: 1, x: 80, y: 244, type: 'bun_bottom' },

          // Pila 2 (x=134): Frente Der -> Mejilla Der -> Collar -> Pancita -> Pata Sentada
          { col: 2, x: 134, y: 64, type: 'bun_top' },
          { col: 2, x: 134, y: 100, type: 'cheese' },
          { col: 2, x: 134, y: 144, type: 'lettuce' },
          { col: 2, x: 134, y: 196, type: 'patty' },
          { col: 2, x: 134, y: 244, type: 'bun_bottom' },

          // Pila 3 (x=186): Oreja Der -> Bigote Der -> Pata Der -> Curva Cola -> Base Cola
          { col: 3, x: 186, y: 52, type: 'bun_top' },
          { col: 3, x: 186, y: 96, type: 'tomato' },
          { col: 3, x: 186, y: 152, type: 'cheese' },
          { col: 3, x: 186, y: 208, type: 'patty' },
          { col: 3, x: 186, y: 244, type: 'bun_bottom' }
        ],
        plates: [
          { x: 24, y: 288 },
          { x: 78, y: 288 },
          { x: 132, y: 288 },
          { x: 186, y: 288 }
        ],
        playerStart: { x: 112, y: 288 },
        enemies: [
          { type: 'hotdog', x: 112, y: 64 },
          { type: 'pickle', x: 26, y: 96 },
          { type: 'pickle', x: 186, y: 96 },
          { type: 'egg', x: 52, y: 32 }
        ],
        enemySpeed: 1.0
      },

      // ==========================================
      // STAGE 7: El Castillo Medieval (Silueta de Fortaleza)
      // ==========================================
      {
        stageNumber: 7,
        name: 'EL ASADOR DEL CASTILLO',
        background: 'bg_stage_7',
        bonusSpots: [
          { x: 24, y: 144 },
          { x: 112, y: 48 },
          { x: 188, y: 144 },
          { x: 112, y: 192 }
        ],
        floors: [
          { y: 48, x1: 18, x2: 68 },
          { y: 48, x1: 88, x2: 152 },
          { y: 48, x1: 172, x2: 222 },
          { y: 96, x1: 18, x2: 68 },
          { y: 96, x1: 76, x2: 164 },
          { y: 96, x1: 172, x2: 222 },
          { y: 144, x1: 18, x2: 60 },
          { y: 144, x1: 74, x2: 114 },
          { y: 144, x1: 126, x2: 166 },
          { y: 144, x1: 180, x2: 222 },
          { y: 192, x1: 16, x2: 64 },
          { y: 192, x1: 72, x2: 168 },
          { y: 192, x1: 176, x2: 224 },
          { y: 240, x1: 14, x2: 66 },
          { y: 240, x1: 70, x2: 114 },
          { y: 240, x1: 126, x2: 170 },
          { y: 240, x1: 174, x2: 226 },
          { y: 288, x1: 12, x2: 228 }
        ],
        ladders: [
          { x: 22, y1: 48, y2: 240 },
          { x: 46, y1: 144, y2: 288 },
          { x: 78, y1: 48, y2: 192 },
          { x: 98, y1: 96, y2: 240 },
          { x: 82, y1: 192, y2: 288 },
          { x: 112, y1: 48, y2: 288 },
          { x: 142, y1: 96, y2: 240 },
          { x: 162, y1: 48, y2: 192 },
          { x: 158, y1: 192, y2: 288 },
          { x: 194, y1: 144, y2: 288 },
          { x: 218, y1: 48, y2: 240 }
        ],
        burgers: [
          { col: 0, x: 24, y: 48, type: 'bun_top' },
          { col: 0, x: 24, y: 96, type: 'lettuce' },
          { col: 0, x: 24, y: 144, type: 'cheese' },
          { col: 0, x: 24, y: 192, type: 'patty' },
          { col: 0, x: 24, y: 240, type: 'bun_bottom' },

          { col: 1, x: 78, y: 48, type: 'bun_top' },
          { col: 1, x: 78, y: 96, type: 'tomato' },
          { col: 1, x: 78, y: 144, type: 'cheese' },
          { col: 1, x: 78, y: 192, type: 'patty' },
          { col: 1, x: 78, y: 240, type: 'bun_bottom' },

          { col: 2, x: 134, y: 48, type: 'bun_top' },
          { col: 2, x: 134, y: 96, type: 'cheese' },
          { col: 2, x: 134, y: 144, type: 'lettuce' },
          { col: 2, x: 134, y: 192, type: 'patty' },
          { col: 2, x: 134, y: 240, type: 'bun_bottom' },

          { col: 3, x: 188, y: 48, type: 'bun_top' },
          { col: 3, x: 188, y: 96, type: 'tomato' },
          { col: 3, x: 188, y: 144, type: 'cheese' },
          { col: 3, x: 188, y: 192, type: 'patty' },
          { col: 3, x: 188, y: 240, type: 'bun_bottom' }
        ],
        plates: [
          { x: 24, y: 288 },
          { x: 78, y: 288 },
          { x: 132, y: 288 },
          { x: 186, y: 288 }
        ],
        playerStart: { x: 112, y: 288 },
        enemies: [
          { type: 'hotdog', x: 112, y: 48 },
          { type: 'pickle', x: 24, y: 96 },
          { type: 'pickle', x: 188, y: 96 },
          { type: 'egg', x: 36, y: 48 }
        ],
        enemySpeed: 1.05
      },

      // ==========================================
      // STAGE 8: El Dragón de Fuego (Silueta de Dragón Mítico)
      // ==========================================
      {
        stageNumber: 8,
        name: 'EL HORNO DEL DRAGÓN',
        background: 'bg_stage_8',
        bonusSpots: [
          { x: 26, y: 96 },
          { x: 112, y: 48 },
          { x: 186, y: 96 },
          { x: 112, y: 192 }
        ],
        floors: [
          { y: 48, x1: 16, x2: 64 },
          { y: 48, x1: 76, x2: 164 },
          { y: 48, x1: 176, x2: 224 },
          { y: 96, x1: 16, x2: 64 },
          { y: 96, x1: 74, x2: 166 },
          { y: 96, x1: 176, x2: 224 },
          { y: 144, x1: 14, x2: 58 },
          { y: 144, x1: 70, x2: 114 },
          { y: 144, x1: 126, x2: 170 },
          { y: 144, x1: 182, x2: 226 },
          { y: 192, x1: 14, x2: 60 },
          { y: 192, x1: 72, x2: 168 },
          { y: 192, x1: 180, x2: 226 },
          { y: 240, x1: 16, x2: 66 },
          { y: 240, x1: 72, x2: 114 },
          { y: 240, x1: 126, x2: 168 },
          { y: 240, x1: 174, x2: 224 },
          { y: 288, x1: 12, x2: 228 }
        ],
        ladders: [
          { x: 20, y1: 48, y2: 240 },
          { x: 42, y1: 144, y2: 288 },
          { x: 76, y1: 48, y2: 192 },
          { x: 96, y1: 96, y2: 240 },
          { x: 80, y1: 192, y2: 288 },
          { x: 112, y1: 48, y2: 288 },
          { x: 144, y1: 96, y2: 240 },
          { x: 164, y1: 48, y2: 192 },
          { x: 160, y1: 192, y2: 288 },
          { x: 196, y1: 144, y2: 288 },
          { x: 218, y1: 48, y2: 240 }
        ],
        burgers: [
          { col: 0, x: 26, y: 48, type: 'bun_top' },
          { col: 0, x: 26, y: 96, type: 'lettuce' },
          { col: 0, x: 26, y: 144, type: 'cheese' },
          { col: 0, x: 26, y: 192, type: 'patty' },
          { col: 0, x: 26, y: 240, type: 'bun_bottom' },

          { col: 1, x: 80, y: 48, type: 'bun_top' },
          { col: 1, x: 80, y: 96, type: 'tomato' },
          { col: 1, x: 80, y: 144, type: 'cheese' },
          { col: 1, x: 80, y: 192, type: 'patty' },
          { col: 1, x: 80, y: 240, type: 'bun_bottom' },

          { col: 2, x: 132, y: 48, type: 'bun_top' },
          { col: 2, x: 132, y: 96, type: 'cheese' },
          { col: 2, x: 132, y: 144, type: 'lettuce' },
          { col: 2, x: 132, y: 192, type: 'patty' },
          { col: 2, x: 132, y: 240, type: 'bun_bottom' },

          { col: 3, x: 186, y: 48, type: 'bun_top' },
          { col: 3, x: 186, y: 96, type: 'tomato' },
          { col: 3, x: 186, y: 144, type: 'cheese' },
          { col: 3, x: 186, y: 192, type: 'patty' },
          { col: 3, x: 186, y: 240, type: 'bun_bottom' }
        ],
        plates: [
          { x: 24, y: 288 },
          { x: 78, y: 288 },
          { x: 132, y: 288 },
          { x: 186, y: 288 }
        ],
        playerStart: { x: 112, y: 288 },
        enemies: [
          { type: 'hotdog', x: 112, y: 48 },
          { type: 'pickle', x: 36, y: 96 },
          { type: 'pickle', x: 186, y: 96 },
          { type: 'egg', x: 36, y: 48 }
        ],
        enemySpeed: 1.10
      },

      // ==========================================
      // STAGE 9: El Submarino Amarillo (Silueta de Submarino Kawaii)
      // ==========================================
      {
        stageNumber: 9,
        name: 'LA COCINA DE ALTA MAR',
        background: 'bg_stage_9',
        bonusSpots: [
          { x: 26, y: 96 },   // Timón superior
          { x: 186, y: 96 },  // Proa con burbujas
          { x: 112, y: 32 },  // Mirador del periscopio
          { x: 112, y: 144 }  // Entre los ojos de buey (Vida Extra ⭐⭐⭐)
        ],
        floors: [
          // Y = 32: Periscopio superior
          { y: 32, x1: 108, x2: 148 },
          // Y = 64: Torreta / Kiosko
          { y: 64, x1: 16, x2: 62 },
          { y: 64, x1: 88, x2: 152 },
          { y: 64, x1: 178, x2: 224 },
          // Y = 96: Cubierta superior y timón
          { y: 96, x1: 16, x2: 62 },
          { y: 96, x1: 74, x2: 166 },
          { y: 96, x1: 178, x2: 224 },
          // Y = 144: Eje de hélice y ojos de buey
          { y: 144, x1: 14, x2: 58 },
          { y: 144, x1: 70, x2: 114 },
          { y: 144, x1: 126, x2: 170 },
          { y: 144, x1: 182, x2: 226 },
          // Y = 196: Cámara central del casco
          { y: 196, x1: 16, x2: 60 },
          { y: 196, x1: 68, x2: 172 },
          { y: 196, x1: 180, x2: 224 },
          // Y = 244: Hélice y tanques de lastre
          { y: 244, x1: 18, x2: 64 },
          { y: 244, x1: 72, x2: 114 },
          { y: 244, x1: 126, x2: 168 },
          { y: 244, x1: 176, x2: 222 },
          // Y = 288: Fondo marino
          { y: 288, x1: 12, x2: 228 }
        ],
        ladders: [
          { x: 112, y1: 32, y2: 96 },
          { x: 80, y1: 64, y2: 196 },
          { x: 144, y1: 64, y2: 196 },
          { x: 24, y1: 64, y2: 244 },
          { x: 46, y1: 144, y2: 288 },
          { x: 98, y1: 96, y2: 244 },
          { x: 82, y1: 196, y2: 288 },
          { x: 112, y1: 96, y2: 288 },
          { x: 142, y1: 96, y2: 244 },
          { x: 158, y1: 196, y2: 288 },
          { x: 194, y1: 144, y2: 288 },
          { x: 216, y1: 64, y2: 244 }
        ],
        burgers: [
          { col: 0, x: 26, y: 64, type: 'bun_top' },
          { col: 0, x: 26, y: 96, type: 'lettuce' },
          { col: 0, x: 26, y: 144, type: 'cheese' },
          { col: 0, x: 26, y: 196, type: 'patty' },
          { col: 0, x: 26, y: 244, type: 'bun_bottom' },

          { col: 1, x: 80, y: 64, type: 'bun_top' },
          { col: 1, x: 80, y: 96, type: 'tomato' },
          { col: 1, x: 80, y: 144, type: 'cheese' },
          { col: 1, x: 80, y: 196, type: 'patty' },
          { col: 1, x: 80, y: 244, type: 'bun_bottom' },

          { col: 2, x: 134, y: 64, type: 'bun_top' },
          { col: 2, x: 134, y: 96, type: 'cheese' },
          { col: 2, x: 134, y: 144, type: 'lettuce' },
          { col: 2, x: 134, y: 196, type: 'patty' },
          { col: 2, x: 134, y: 244, type: 'bun_bottom' },

          { col: 3, x: 186, y: 64, type: 'bun_top' },
          { col: 3, x: 186, y: 96, type: 'tomato' },
          { col: 3, x: 186, y: 144, type: 'cheese' },
          { col: 3, x: 186, y: 196, type: 'patty' },
          { col: 3, x: 186, y: 244, type: 'bun_bottom' }
        ],
        plates: [
          { x: 24, y: 288 },
          { x: 78, y: 288 },
          { x: 132, y: 288 },
          { x: 186, y: 288 }
        ],
        playerStart: { x: 112, y: 288 },
        enemies: [
          { type: 'hotdog', x: 112, y: 32 },
          { type: 'pickle', x: 26, y: 96 },
          { type: 'pickle', x: 186, y: 96 },
          { type: 'egg', x: 36, y: 64 }
        ],
        enemySpeed: 1.12
      },

      // ==========================================
      // STAGE 10: El Pingüino Glacial (Silueta de Pingüino Polar)
      // ==========================================
      {
        stageNumber: 10,
        name: 'LA HELADERÍA BAJO CERO',
        background: 'bg_stage_10',
        bonusSpots: [
          { x: 26, y: 144 },  // Alita izquierda
          { x: 186, y: 144 }, // Alita derecha
          { x: 112, y: 32 },  // Pompón polar
          { x: 112, y: 144 }  // Bufanda roja (Vida Extra ⭐⭐⭐)
        ],
        floors: [
          // Y = 32: Pompón del gorro polar
          { y: 32, x1: 106, x2: 134 },
          // Y = 64: Gorro de lana
          { y: 64, x1: 18, x2: 62 },
          { y: 64, x1: 80, x2: 160 },
          { y: 64, x1: 178, x2: 222 },
          // Y = 96: Rostro y crestas
          { y: 96, x1: 18, x2: 62 },
          { y: 96, x1: 72, x2: 168 },
          { y: 96, x1: 178, x2: 222 },
          // Y = 144: Bufanda roja y alitas
          { y: 144, x1: 14, x2: 56 },
          { y: 144, x1: 74, x2: 166 },
          { y: 144, x1: 184, x2: 226 },
          // Y = 196: Pancita blanca esponjosa
          { y: 196, x1: 18, x2: 62 },
          { y: 196, x1: 68, x2: 172 },
          { y: 196, x1: 178, x2: 222 },
          // Y = 244: Patitas palmeadas naranjas
          { y: 244, x1: 20, x2: 64 },
          { y: 244, x1: 72, x2: 114 },
          { y: 244, x1: 126, x2: 168 },
          { y: 244, x1: 176, x2: 220 },
          // Y = 288: Témpano glacial
          { y: 288, x1: 12, x2: 228 }
        ],
        ladders: [
          { x: 112, y1: 32, y2: 96 },
          { x: 78, y1: 64, y2: 196 },
          { x: 146, y1: 64, y2: 196 },
          { x: 24, y1: 64, y2: 244 },
          { x: 46, y1: 144, y2: 288 },
          { x: 96, y1: 96, y2: 244 },
          { x: 82, y1: 196, y2: 288 },
          { x: 112, y1: 96, y2: 288 },
          { x: 144, y1: 96, y2: 244 },
          { x: 158, y1: 196, y2: 288 },
          { x: 194, y1: 144, y2: 288 },
          { x: 216, y1: 64, y2: 244 }
        ],
        burgers: [
          { col: 0, x: 26, y: 64, type: 'bun_top' },
          { col: 0, x: 26, y: 96, type: 'lettuce' },
          { col: 0, x: 26, y: 144, type: 'cheese' },
          { col: 0, x: 26, y: 196, type: 'patty' },
          { col: 0, x: 26, y: 244, type: 'bun_bottom' },

          { col: 1, x: 80, y: 64, type: 'bun_top' },
          { col: 1, x: 80, y: 96, type: 'tomato' },
          { col: 1, x: 80, y: 144, type: 'cheese' },
          { col: 1, x: 80, y: 196, type: 'patty' },
          { col: 1, x: 80, y: 244, type: 'bun_bottom' },

          { col: 2, x: 134, y: 64, type: 'bun_top' },
          { col: 2, x: 134, y: 96, type: 'cheese' },
          { col: 2, x: 134, y: 144, type: 'lettuce' },
          { col: 2, x: 134, y: 196, type: 'patty' },
          { col: 2, x: 134, y: 244, type: 'bun_bottom' },

          { col: 3, x: 186, y: 64, type: 'bun_top' },
          { col: 3, x: 186, y: 96, type: 'tomato' },
          { col: 3, x: 186, y: 144, type: 'cheese' },
          { col: 3, x: 186, y: 196, type: 'patty' },
          { col: 3, x: 186, y: 244, type: 'bun_bottom' }
        ],
        plates: [
          { x: 24, y: 288 },
          { x: 78, y: 288 },
          { x: 132, y: 288 },
          { x: 186, y: 288 }
        ],
        playerStart: { x: 112, y: 288 },
        enemies: [
          { type: 'hotdog', x: 112, y: 32 },
          { type: 'pickle', x: 36, y: 64 },
          { type: 'pickle', x: 198, y: 64 },
          { type: 'egg', x: 112, y: 96 }
        ],
        enemySpeed: 1.15
      },

      // ==========================================
      // STAGE 11: La Tostadora Mecánica (Silueta de Tostadora Kawaii)
      // ==========================================
      {
        stageNumber: 11,
        name: 'LA PANADERÍA CRUJIENTE',
        background: 'bg_stage_11',
        bonusSpots: [
          { x: 78, y: 32 },   // Tostada izquierda con mantequilla
          { x: 160, y: 32 },  // Tostada derecha con mantequilla
          { x: 218, y: 96 },  // Palanca lateral
          { x: 112, y: 196 }  // Dial de temperatura (Vida Extra ⭐⭐⭐)
        ],
        floors: [
          // Y = 32: Doble tostada emergente
          { y: 32, x1: 52, x2: 104 },
          { y: 32, x1: 136, x2: 188 },
          // Y = 64: Mantequilla & ranuras
          { y: 64, x1: 20, x2: 64 },
          { y: 64, x1: 56, x2: 100 },
          { y: 64, x1: 140, x2: 184 },
          { y: 64, x1: 176, x2: 234 },
          // Y = 96: Tapa cromada y palanca
          { y: 96, x1: 20, x2: 64 },
          { y: 96, x1: 74, x2: 166 },
          { y: 96, x1: 176, x2: 234 },
          // Y = 144: Cara kawaii y laterales
          { y: 144, x1: 18, x2: 60 },
          { y: 144, x1: 70, x2: 114 },
          { y: 144, x1: 126, x2: 170 },
          { y: 144, x1: 180, x2: 222 },
          // Y = 196: Dial giratorio y resistencia
          { y: 196, x1: 18, x2: 62 },
          { y: 196, x1: 68, x2: 172 },
          { y: 196, x1: 178, x2: 222 },
          // Y = 244: Patas de goma antideslizantes
          { y: 244, x1: 20, x2: 64 },
          { y: 244, x1: 74, x2: 114 },
          { y: 244, x1: 126, x2: 166 },
          { y: 244, x1: 176, x2: 220 },
          // Y = 288: Encimera de cocina
          { y: 288, x1: 12, x2: 228 }
        ],
        ladders: [
          { x: 78, y1: 32, y2: 96 },
          { x: 162, y1: 32, y2: 96 },
          { x: 24, y1: 64, y2: 244 },
          { x: 46, y1: 144, y2: 288 },
          { x: 96, y1: 96, y2: 244 },
          { x: 82, y1: 196, y2: 288 },
          { x: 112, y1: 96, y2: 288 },
          { x: 144, y1: 96, y2: 244 },
          { x: 158, y1: 196, y2: 288 },
          { x: 194, y1: 144, y2: 288 },
          { x: 218, y1: 64, y2: 244 }
        ],
        burgers: [
          { col: 0, x: 26, y: 64, type: 'bun_top' },
          { col: 0, x: 26, y: 96, type: 'lettuce' },
          { col: 0, x: 26, y: 144, type: 'cheese' },
          { col: 0, x: 26, y: 196, type: 'patty' },
          { col: 0, x: 26, y: 244, type: 'bun_bottom' },

          { col: 1, x: 80, y: 32, type: 'bun_top' },
          { col: 1, x: 80, y: 96, type: 'tomato' },
          { col: 1, x: 80, y: 144, type: 'cheese' },
          { col: 1, x: 80, y: 196, type: 'patty' },
          { col: 1, x: 80, y: 244, type: 'bun_bottom' },

          { col: 2, x: 134, y: 32, type: 'bun_top' },
          { col: 2, x: 134, y: 96, type: 'cheese' },
          { col: 2, x: 134, y: 144, type: 'lettuce' },
          { col: 2, x: 134, y: 196, type: 'patty' },
          { col: 2, x: 134, y: 244, type: 'bun_bottom' },

          { col: 3, x: 186, y: 64, type: 'bun_top' },
          { col: 3, x: 186, y: 96, type: 'tomato' },
          { col: 3, x: 186, y: 144, type: 'cheese' },
          { col: 3, x: 186, y: 196, type: 'patty' },
          { col: 3, x: 186, y: 244, type: 'bun_bottom' }
        ],
        plates: [
          { x: 24, y: 288 },
          { x: 78, y: 288 },
          { x: 132, y: 288 },
          { x: 186, y: 288 }
        ],
        playerStart: { x: 112, y: 288 },
        enemies: [
          { type: 'hotdog', x: 72, y: 32 },
          { type: 'pickle', x: 160, y: 32 },
          { type: 'pickle', x: 36, y: 64 },
          { type: 'egg', x: 200, y: 64 }
        ],
        enemySpeed: 1.18
      },

            // ==========================================
      // STAGE 12: EL OSO PANDA GOLOSO
      // ==========================================
      {
            stageNumber: 12,
            name: "EL WOK DEL PANDA GOURMET",
            background: "bg_stage_12",
            bonusSpots: [
                  {
                        x: 40,
                        y: 28
                  },
                  {
                        x: 196,
                        y: 36
                  },
                  {
                        x: 196,
                        y: 192
                  },
                  {
                        x: 100,
                        y: 120
                  }
            ],
            floors: [
                  {
                        y: 28,
                        x1: 16,
                        x2: 66,
                        label: "Oreja Izq Cúspide"
                  },
                  {
                        y: 36,
                        x1: 174,
                        x2: 222,
                        label: "Oreja Der Cúspide"
                  },
                  {
                        y: 68,
                        x1: 70,
                        x2: 164,
                        label: "Frente Panda"
                  },
                  {
                        y: 80,
                        x1: 174,
                        x2: 224,
                        label: "Caña Bambú Alta"
                  },
                  {
                        y: 108,
                        x1: 16,
                        x2: 66,
                        label: "Terraza Bambú Izq"
                  },
                  {
                        y: 120,
                        x1: 68,
                        x2: 162,
                        label: "Pecho y Brote Bambú Especial"
                  },
                  {
                        y: 132,
                        x1: 172,
                        x2: 222,
                        label: "Brazo Panda Bambú"
                  },
                  {
                        y: 164,
                        x1: 18,
                        x2: 66,
                        label: "Repisa Flanco Izq"
                  },
                  {
                        y: 178,
                        x1: 70,
                        x2: 160,
                        label: "Barriguita Panda"
                  },
                  {
                        y: 192,
                        x1: 172,
                        x2: 224,
                        label: "Caña Bambú Media"
                  },
                  {
                        y: 224,
                        x1: 16,
                        x2: 66,
                        label: "Pata Negra Izq"
                  },
                  {
                        y: 236,
                        x1: 68,
                        x2: 114,
                        label: "Almohadilla Baja"
                  },
                  {
                        y: 248,
                        x1: 124,
                        x2: 224,
                        label: "Pata Negra Der"
                  },
                  {
                        y: 256,
                        x1: 16,
                        x2: 66,
                        label: "Escalón Pata Izq"
                  },
                  {
                        y: 264,
                        x1: 68,
                        x2: 114,
                        label: "Escalón Almohadilla"
                  },
                  {
                        y: 268,
                        x1: 124,
                        x2: 160,
                        label: "Escalón Pata Der"
                  },
                  {
                        y: 288,
                        x1: 12,
                        x2: 228,
                        label: "Suelo Bosque"
                  }
            ],
            ladders: [
                  {
                        x: 40,
                        y1: 28,
                        y2: 108
                  },
                  {
                        x: 196,
                        y1: 36,
                        y2: 132
                  },
                  {
                        x: 96,
                        y1: 68,
                        y2: 178
                  },
                  {
                        x: 138,
                        y1: 68,
                        y2: 178
                  },
                  {
                        x: 24,
                        y1: 108,
                        y2: 256
                  },
                  {
                        x: 46,
                        y1: 164,
                        y2: 288
                  },
                  {
                        x: 96,
                        y1: 178,
                        y2: 264
                  },
                  {
                        x: 80,
                        y1: 236,
                        y2: 288
                  },
                  {
                        x: 140,
                        y1: 178,
                        y2: 288
                  },
                  {
                        x: 198,
                        y1: 132,
                        y2: 248
                  },
                  {
                        x: 216,
                        y1: 80,
                        y2: 288
                  }
            ],
            burgers: [
                  {
                        col: 0,
                        x: 26,
                        y: 28,
                        type: "bun_top"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 108,
                        type: "lettuce"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 164,
                        type: "cheese"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 224,
                        type: "patty"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 256,
                        type: "bun_bottom"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 68,
                        type: "bun_top"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 120,
                        type: "tomato"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 178,
                        type: "cheese"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 236,
                        type: "patty"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 264,
                        type: "bun_bottom"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 68,
                        type: "bun_top"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 120,
                        type: "cheese"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 178,
                        type: "lettuce"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 248,
                        type: "patty"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 268,
                        type: "bun_bottom"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 36,
                        type: "bun_top"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 80,
                        type: "tomato"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 132,
                        type: "cheese"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 192,
                        type: "patty"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 248,
                        type: "bun_bottom"
                  }
            ],
            plates: [
                  {
                        x: 24,
                        y: 288
                  },
                  {
                        x: 78,
                        y: 288
                  },
                  {
                        x: 132,
                        y: 288
                  },
                  {
                        x: 186,
                        y: 288
                  }
            ],
            playerStart: { x: 112, y: 288 },
            enemies: [
                  {
                        type: "hotdog",
                        x: 96,
                        y: 68
                  },
                  {
                        type: "pickle",
                        x: 26,
                        y: 108
                  },
                  {
                        type: "pickle",
                        x: 190,
                        y: 36
                  },
                  {
                        type: "egg",
                        x: 36,
                        y: 28
                  }
            ],
            enemySpeed: 1.2
      },

      // ==========================================
      // STAGE 13: EL PLATILLO VOLADOR
      // ==========================================
      {
            stageNumber: 13,
            name: "EL COMEDOR CÓSMICO",
            background: "bg_stage_13",
            bonusSpots: [
                  {
                        x: 26,
                        y: 124
                  },
                  {
                        x: 186,
                        y: 124
                  },
                  {
                        x: 112,
                        y: 28
                  },
                  {
                        x: 112,
                        y: 150
                  }
            ],
            floors: [
                  {
                        y: 28,
                        x1: 104,
                        x2: 136,
                        label: "Antena Transmisora"
                  },
                  {
                        y: 56,
                        x1: 70,
                        x2: 170,
                        label: "Cúpula Marciana"
                  },
                  {
                        y: 88,
                        x1: 16,
                        x2: 66,
                        label: "Ala Izq Alta"
                  },
                  {
                        y: 88,
                        x1: 174,
                        x2: 224,
                        label: "Ala Der Alta"
                  },
                  {
                        y: 124,
                        x1: 12,
                        x2: 72,
                        label: "Borde Neón Izq"
                  },
                  {
                        y: 124,
                        x1: 168,
                        x2: 228,
                        label: "Borde Neón Der"
                  },
                  {
                        y: 150,
                        x1: 68,
                        x2: 172,
                        label: "Núcleo Gravitatorio Especial"
                  },
                  {
                        y: 182,
                        x1: 16,
                        x2: 68,
                        label: "Propulsor Izq"
                  },
                  {
                        y: 182,
                        x1: 68,
                        x2: 172,
                        label: "Anillo Reactor Central"
                  },
                  {
                        y: 182,
                        x1: 172,
                        x2: 224,
                        label: "Propulsor Der"
                  },
                  {
                        y: 222,
                        x1: 16,
                        x2: 62,
                        label: "Pata Lunar Izq"
                  },
                  {
                        y: 222,
                        x1: 70,
                        x2: 170,
                        label: "Anillo de Abducción"
                  },
                  {
                        y: 222,
                        x1: 178,
                        x2: 224,
                        label: "Pata Lunar Der"
                  },
                  {
                        y: 255,
                        x1: 16,
                        x2: 62,
                        label: "Base Trípode Izq"
                  },
                  {
                        y: 255,
                        x1: 70,
                        x2: 170,
                        label: "Haz Conexión"
                  },
                  {
                        y: 255,
                        x1: 178,
                        x2: 224,
                        label: "Base Trípode Der"
                  },
                  {
                        y: 288,
                        x1: 12,
                        x2: 228,
                        label: "Superficie Lunar"
                  }
            ],
            ladders: [
                  {
                        x: 112,
                        y1: 28,
                        y2: 56
                  },
                  {
                        x: 96,
                        y1: 56,
                        y2: 150
                  },
                  {
                        x: 144,
                        y1: 56,
                        y2: 150
                  },
                  {
                        x: 24,
                        y1: 88,
                        y2: 222
                  },
                  {
                        x: 46,
                        y1: 124,
                        y2: 288
                  },
                  {
                        x: 112,
                        y1: 150,
                        y2: 288
                  },
                  {
                        x: 194,
                        y1: 124,
                        y2: 288
                  },
                  {
                        x: 216,
                        y1: 88,
                        y2: 222
                  }
            ],
            burgers: [
                  {
                        col: 0,
                        x: 26,
                        y: 88,
                        type: "bun_top"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 124,
                        type: "lettuce"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 182,
                        type: "cheese"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 222,
                        type: "patty"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 255,
                        type: "bun_bottom"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 56,
                        type: "bun_top"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 150,
                        type: "tomato"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 182,
                        type: "cheese"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 222,
                        type: "patty"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 255,
                        type: "bun_bottom"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 56,
                        type: "bun_top"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 150,
                        type: "cheese"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 182,
                        type: "lettuce"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 222,
                        type: "patty"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 255,
                        type: "bun_bottom"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 88,
                        type: "bun_top"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 124,
                        type: "tomato"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 182,
                        type: "cheese"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 222,
                        type: "patty"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 255,
                        type: "bun_bottom"
                  }
            ],
            plates: [
                  {
                        x: 24,
                        y: 288
                  },
                  {
                        x: 78,
                        y: 288
                  },
                  {
                        x: 132,
                        y: 288
                  },
                  {
                        x: 186,
                        y: 288
                  }
            ],
            playerStart: { x: 112, y: 288 },
            enemies: [
                  {
                        type: "hotdog",
                        x: 112,
                        y: 28
                  },
                  {
                        type: "pickle",
                        x: 36,
                        y: 88
                  },
                  {
                        type: "pickle",
                        x: 198,
                        y: 88
                  },
                  {
                        type: "egg",
                        x: 112,
                        y: 56
                  }
            ],
            enemySpeed: 1.22
      },

      // ==========================================
      // STAGE 14: EL DINOSAURIO REX
      // ==========================================
      {
            stageNumber: 14,
            name: "EL MESÓN JURÁSICO DE CARNES",
            background: "bg_stage_14",
            bonusSpots: [
                  {
                        x: 26,
                        y: 96
                  },
                  {
                        x: 186,
                        y: 80
                  },
                  {
                        x: 112,
                        y: 28
                  },
                  {
                        x: 100,
                        y: 165
                  }
            ],
            floors: [
                  {
                        y: 28,
                        x1: 70,
                        x2: 150,
                        label: "Cresta Dorada"
                  },
                  {
                        y: 52,
                        x1: 70,
                        x2: 195,
                        label: "Cráneo y Ceja Rex"
                  },
                  {
                        y: 80,
                        x1: 125,
                        x2: 218,
                        label: "Mandíbula con Diente"
                  },
                  {
                        y: 96,
                        x1: 14,
                        x2: 66,
                        label: "Punta Cola Alta"
                  },
                  {
                        y: 125,
                        x1: 16,
                        x2: 72,
                        label: "Cola Media"
                  },
                  {
                        y: 125,
                        x1: 120,
                        x2: 190,
                        label: "Mandíbula Inferior"
                  },
                  {
                        y: 154,
                        x1: 145,
                        x2: 215,
                        label: "Bracitos Rex"
                  },
                  {
                        y: 165,
                        x1: 65,
                        x2: 135,
                        label: "Corazón de Rex Especial"
                  },
                  {
                        y: 180,
                        x1: 14,
                        x2: 66,
                        label: "Base Cola"
                  },
                  {
                        y: 205,
                        x1: 68,
                        x2: 176,
                        label: "Pancita Amarilla"
                  },
                  {
                        y: 215,
                        x1: 170,
                        x2: 225,
                        label: "Lomo"
                  },
                  {
                        y: 248,
                        x1: 16,
                        x2: 66,
                        label: "Pata Trasera Garra Izq"
                  },
                  {
                        y: 248,
                        x1: 115,
                        x2: 225,
                        label: "Pata Garra Delantera"
                  },
                  {
                        y: 255,
                        x1: 68,
                        x2: 115,
                        label: "Peana Central Rex"
                  },
                  {
                        y: 268,
                        x1: 16,
                        x2: 66,
                        label: "Escalón Pata Izq"
                  },
                  {
                        y: 268,
                        x1: 115,
                        x2: 225,
                        label: "Escalón Pata Der"
                  },
                  {
                        y: 288,
                        x1: 12,
                        x2: 228,
                        label: "Jungla Prehistórica"
                  }
            ],
            ladders: [
                  {
                        x: 112,
                        y1: 28,
                        y2: 52
                  },
                  {
                        x: 155,
                        y1: 52,
                        y2: 125
                  },
                  {
                        x: 38,
                        y1: 96,
                        y2: 180
                  },
                  {
                        x: 96,
                        y1: 52,
                        y2: 165
                  },
                  {
                        x: 24,
                        y1: 180,
                        y2: 268
                  },
                  {
                        x: 46,
                        y1: 125,
                        y2: 288
                  },
                  {
                        x: 80,
                        y1: 165,
                        y2: 288
                  },
                  {
                        x: 140,
                        y1: 125,
                        y2: 205
                  },
                  {
                        x: 158,
                        y1: 205,
                        y2: 288
                  },
                  {
                        x: 185,
                        y1: 125,
                        y2: 268
                  }
            ],
            burgers: [
                  {
                        col: 0,
                        x: 26,
                        y: 96,
                        type: "bun_top"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 125,
                        type: "lettuce"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 180,
                        type: "cheese"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 248,
                        type: "patty"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 268,
                        type: "bun_bottom"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 28,
                        type: "bun_top"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 52,
                        type: "tomato"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 165,
                        type: "cheese"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 205,
                        type: "patty"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 255,
                        type: "bun_bottom"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 52,
                        type: "bun_top"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 80,
                        type: "cheese"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 125,
                        type: "lettuce"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 248,
                        type: "patty"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 268,
                        type: "bun_bottom"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 80,
                        type: "bun_top"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 154,
                        type: "tomato"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 215,
                        type: "cheese"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 248,
                        type: "patty"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 268,
                        type: "bun_bottom"
                  }
            ],
            plates: [
                  {
                        x: 24,
                        y: 288
                  },
                  {
                        x: 78,
                        y: 288
                  },
                  {
                        x: 132,
                        y: 288
                  },
                  {
                        x: 186,
                        y: 288
                  }
            ],
            playerStart: { x: 112, y: 288 },
            enemies: [
                  {
                        type: "hotdog",
                        x: 112,
                        y: 28
                  },
                  {
                        type: "pickle",
                        x: 26,
                        y: 96
                  },
                  {
                        type: "pickle",
                        x: 186,
                        y: 80
                  },
                  {
                        type: "egg",
                        x: 134,
                        y: 52
                  }
            ],
            enemySpeed: 1.25
      },

      // ==========================================
      // STAGE 15: LA CORONA REAL
      // ==========================================
      {
            stageNumber: 15,
            name: "EL BANQUETE IMPERIAL DEL CHEF",
            background: "bg_stage_15",
            bonusSpots: [
                  {
                        x: 32,
                        y: 58
                  },
                  {
                        x: 204,
                        y: 58
                  },
                  {
                        x: 112,
                        y: 18
                  },
                  {
                        x: 112,
                        y: 168
                  }
            ],
            floors: [
                  {
                        y: 18,
                        x1: 104,
                        x2: 136,
                        label: "Gorro Chef Supremo"
                  },
                  {
                        y: 38,
                        x1: 70,
                        x2: 104,
                        label: "Aguja Real 2 (Zafiro)"
                  },
                  {
                        y: 38,
                        x1: 136,
                        x2: 170,
                        label: "Aguja Real 4 (Zafiro)"
                  },
                  {
                        y: 58,
                        x1: 16,
                        x2: 56,
                        label: "Aguja Real 1 (Rubí)"
                  },
                  {
                        y: 58,
                        x1: 184,
                        x2: 224,
                        label: "Aguja Real 5 (Rubí)"
                  },
                  {
                        y: 92,
                        x1: 24,
                        x2: 216,
                        label: "Diadema Enjoyada de la Corona"
                  },
                  {
                        y: 134,
                        x1: 16,
                        x2: 66,
                        label: "Terciopelo Púrpura Izq"
                  },
                  {
                        y: 134,
                        x1: 174,
                        x2: 224,
                        label: "Terciopelo Púrpura Der"
                  },
                  {
                        y: 168,
                        x1: 68,
                        x2: 172,
                        label: "Gran Diamante Imperial Especial"
                  },
                  {
                        y: 175,
                        x1: 16,
                        x2: 66,
                        label: "Balcón Lateral Izq"
                  },
                  {
                        y: 175,
                        x1: 174,
                        x2: 224,
                        label: "Balcón Lateral Der"
                  },
                  {
                        y: 210,
                        x1: 16,
                        x2: 224,
                        label: "Banda Imperial de Gemas"
                  },
                  {
                        y: 250,
                        x1: 20,
                        x2: 220,
                        label: "Pedestal de Oro Macizo"
                  },
                  {
                        y: 288,
                        x1: 12,
                        x2: 228,
                        label: "Gran Salón de Banquete"
                  }
            ],
            ladders: [
                  {
                        x: 112,
                        y1: 18,
                        y2: 92
                  },
                  {
                        x: 32,
                        y1: 58,
                        y2: 134
                  },
                  {
                        x: 88,
                        y1: 38,
                        y2: 92
                  },
                  {
                        x: 148,
                        y1: 38,
                        y2: 92
                  },
                  {
                        x: 204,
                        y1: 58,
                        y2: 134
                  },
                  {
                        x: 64,
                        y1: 92,
                        y2: 210
                  },
                  {
                        x: 176,
                        y1: 92,
                        y2: 210
                  },
                  {
                        x: 112,
                        y1: 168,
                        y2: 288
                  },
                  {
                        x: 24,
                        y1: 134,
                        y2: 250
                  },
                  {
                        x: 46,
                        y1: 210,
                        y2: 288
                  },
                  {
                        x: 194,
                        y1: 210,
                        y2: 288
                  },
                  {
                        x: 216,
                        y1: 134,
                        y2: 250
                  }
            ],
            burgers: [
                  {
                        col: 0,
                        x: 26,
                        y: 58,
                        type: "bun_top"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 134,
                        type: "lettuce"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 175,
                        type: "cheese"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 210,
                        type: "patty"
                  },
                  {
                        col: 0,
                        x: 26,
                        y: 250,
                        type: "bun_bottom"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 38,
                        type: "bun_top"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 92,
                        type: "tomato"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 168,
                        type: "cheese"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 210,
                        type: "patty"
                  },
                  {
                        col: 1,
                        x: 80,
                        y: 250,
                        type: "bun_bottom"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 38,
                        type: "bun_top"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 92,
                        type: "cheese"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 168,
                        type: "lettuce"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 210,
                        type: "patty"
                  },
                  {
                        col: 2,
                        x: 134,
                        y: 250,
                        type: "bun_bottom"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 58,
                        type: "bun_top"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 134,
                        type: "tomato"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 175,
                        type: "cheese"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 210,
                        type: "patty"
                  },
                  {
                        col: 3,
                        x: 186,
                        y: 250,
                        type: "bun_bottom"
                  }
            ],
            plates: [
                  {
                        x: 24,
                        y: 288
                  },
                  {
                        x: 78,
                        y: 288
                  },
                  {
                        x: 132,
                        y: 288
                  },
                  {
                        x: 186,
                        y: 288
                  }
            ],
            playerStart: { x: 112, y: 288 },
            enemies: [
                  {
                        type: "hotdog",
                        x: 112,
                        y: 18
                  },
                  {
                        type: "pickle",
                        x: 36,
                        y: 58
                  },
                  {
                        type: "pickle",
                        x: 200,
                        y: 58
                  },
                  {
                        type: "egg",
                        x: 88,
                        y: 38
                  }
            ],
            enemySpeed: 1.3
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
