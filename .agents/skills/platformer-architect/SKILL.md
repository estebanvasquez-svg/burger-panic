---
name: platformer-architect
description: >-
  Specialized skill for mobile arcade 2D platformers. Use when creating, balancing,
  or testing levels, generating maps, designing platforms, and preventing physics or collision bugs.
---

# 🕹️ Platformer Level & Physics Architect (Mobile Arcade)

Guía y estándares técnicos para el diseño de niveles, plataformas dinámicas y prevención de bugs físicos en **Burger Panic Mobile** (lienzo vertical 240x320 y niveles anchos panorámicos).

---

## 1. 📐 Dimensiones y Grilla Móvil Vertical
- **Resolución base:** 240 px (ancho) × 320 px (alto).
- **Niveles Panorámicos:** Niveles 4 en adelante con anchos entre 360 px y 420 px y cámara de seguimiento horizontal automático.
- **Piso superior jugable:** `y = 48` a `52`.
- **Piso inferior (platos):** `y = 288` a `292`.
- **Espaciado vertical entre pisos:** Entre **36 px y 48 px**.
  *(Nota: El salto vertical máximo de Chef Pepe es de 20 px, por lo que subir entre pisos requiere escaleras o rebotar sobre ingredientes).*
- **Salto horizontal máximo:** **35 px**. Toda separación o hueco entre plataformas transitable mediante salto debe ser `<= 32 px`.

---

## 2. 🚡 Plataformas Dinámicas y Progresión Orgánica
Para mantener la jugabilidad fresca sin saturar al jugador, los niveles incorporan dinámicas de forma escalonada:

1. **Rampas Diagonales / Pendientes (`type: 'diagonal'`):**
   - Introducidas en **Niveles 4 a 6** (Marisquería, Café Ciber-Gato, Pastelería Felina).
   - Conectan desniveles entre pisos: `ratio = Math.max(0, Math.min(1, (x - x1) / (x2 - x1)))`.
   - `floorY = y1 + (y2 - y1) * ratio`. Tanto el Chef como los enemigos ajustan su altura continua en cada paso.

2. **Elevadores Mecánicos Verticales (`type: 'elevator'`):**
   - Introducidos en **Niveles 7 a 9** (Asador del Castillo, Forja del Dragón, Cocina de Alta Mar).
   - Oscilación vertical suave entre `minY` y `maxY`: `y = midY + Math.sin(phase) * ampY`.
   - Inercia y arrastre: `character.y += elevator.vy`. Cero caídas al saltar o estar de pie sobre el elevador.

3. **Plataformas Horizontales Balanceantes (`type: 'swaying'`):**
   - Introducidas en **Niveles 10 a 12** (Heladería Sub-Zero, Tren Bento, Wok del Panda Dorado).
   - Deslizamiento suave sobre riel entre `baseX1 - range` y `baseX2 + range`.
   - Arrastre inercial: `character.x += swaying.vx`. Permite surfear las brechas entre plataformas.

4. **Columpios de Péndulo (`type: 'swing'`):**
   - Introducidos en **Niveles 13 a 15** (Cosmic Diner 3000, Costillas Jurásicas, Banquete Imperial).
   - Suspensión angular desde un pivote `(pivotX, pivotY)` con cadenas tensas:
     `cx = pivotX + Math.sin(angle) * length; cy = pivotY + Math.cos(angle) * length;`
   - El Chef y los enemigos son transportados en balanceo dinámico en dos ejes (`vx` y `vy`).

---

## 3. 🪜 Geometría de Escaleras y Prevención de Bugs
Para evitar caídas infinitas o bloqueos de movimiento:
1. **Conexión en ambos extremos:** Todo peldaño superior (`y1`) e inferior (`y2`) debe coincidir con la coordenada `y` de un piso válido con una tolerancia máxima de `|floor.y - ladder.y| <= 8`.
2. **Detección de contacto en 1 pixel:** El jugador o enemigo toca la escalera en cuanto `(x + 16 > ladder.x && x < ladder.x + 16)`.
3. **Salida sin teletransporte:** Al llegar al final de una escalera (`y <= l.y1` o `y >= l.y2`), el personaje debe anclarse exactamente a `floor.y` sin saltos bruscos.
4. **Anclaje seguro:** Las escaleras deben anclarse a plataformas sólidas de soporte, evitando acoples a pisos en movimiento que deformen la escalera.

---

## 4. 👾 Prevención de Spawn-Camping de Enemigos
1. **Spawn en pisos superiores:** Los enemigos nunca deben aparecer en el mismo piso inicial del Chef (`y = 292`).
2. **Distancia de seguridad:** Distancia euclidiana mínima de **100 píxeles** entre el jugador y cualquier punto de spawn.
3. **Fase de Gracia (Spawning State):** Durante los primeros 180 frames (3 segundos), el enemigo parpadea en modo inofensivo con un indicador visual `!`, permitiendo al jugador reaccionar sin recibir daño injusto.

---

## 5. 🛠️ Herramientas del MCP `platformer-architect`
- `validate_stage_architecture(stage_number)`: Ejecuta el análisis geométrico, de balance y validación de plataformas dinámicas en `js/map.js`.
- `generate_dynamic_stage(stage_number, theme, difficulty, width, dynamic_platform_type, num_burgers, num_floors)`: Genera el código JavaScript listo para copiar con pisos dinámicos, escaleras, hamburguesas y enemigos balanceados.
- `diagnose_character_physics_rules()`: Consulta los algoritmos matemáticos anti-tunneling, arrastre de velocidad y desacoplamiento de hitboxes.
