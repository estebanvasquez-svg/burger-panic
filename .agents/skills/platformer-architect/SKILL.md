---
name: platformer-architect
description: >-
  Specialized skill for mobile arcade 2D platformers. Use when creating, balancing,
  or testing levels, generating maps, designing platforms, and preventing physics or collision bugs.
---

# 🕹️ Platformer Level & Physics Architect (Mobile Arcade)

Guía y estándares técnicos para el diseño de niveles, plataformas dinámicas y prevención de bugs físicos en **Burger Panic Mobile** (lienzo vertical 240x320).

---

## 1. 📐 Dimensiones y Grilla Móvil Vertical
- **Resolución base:** 240 px (ancho) × 320 px (alto).
- **Piso superior jugable:** `y = 48` a `52`.
- **Piso inferior (platos):** `y = 288` a `292`.
- **Espaciado vertical entre pisos:** Entre **36 px y 48 px**.
  *(Nota: El salto vertical máximo de Chef Pepe es de 20 px, por lo que subir entre pisos requiere escaleras o rebotar sobre ingredientes).*
- **Salto horizontal máximo:** **35 px**. Toda separación o hueco entre plataformas transitable mediante salto debe ser `<= 32 px`.

---

## 2. 🪜 Geometría de Escaleras y Prevención de Bugs
Para evitar caídas infinitas o bloqueos de movimiento:
1. **Conexión en ambos extremos:** Todo peldaño superior (`y1`) e inferior (`y2`) debe coincidir con la coordenada `y` de un piso válido con una tolerancia máxima de `|floor.y - ladder.y| <= 8`.
2. **Detección de contacto en 1 pixel:** El jugador o enemigo toca la escalera en cuanto `(x + 16 > ladder.x && x < ladder.x + 16)`.
3. **Salida sin teletransporte:** Al llegar al final de una escalera (`y <= l.y1` o `y >= l.y2`), el personaje debe anclarse exactamente a `floor.y` sin saltos bruscos.

---

## 3. 🍔 Diseño de Plataformas Dinámicas y Divertidas
- **Flujo en Zigzag (Staggered):** En niveles avanzados, alterna pisos completos con plataformas partidas (por ejemplo: `x: 16..108` y `x: 132..224`), obligando al jugador a planificar rutas y utilizar saltos entre plataformas.
- **Cascadas de Hamburguesas:** Coloca los ingredientes de manera que las caídas provoquen reacciones en cadena que empujen los pisos inferiores.
- **Riesgo vs. Recompensa:** Ubica los ítems de bonificación (helados, cafés, vidas extra) en plataformas intermedias custodiadas por enemigos.

---

## 4. 👾 Prevención de Spawn-Camping de Enemigos
1. **Spawn en pisos superiores:** Los enemigos nunca deben aparecer en el mismo piso inicial del Chef (`y = 292`).
2. **Distancia de seguridad:** Distancia euclidiana mínima de **100 píxeles** entre el jugador y cualquier punto de spawn.
3. **Fase de Gracia (Spawning State):** Durante los primeros 180 frames (3 segundos), el enemigo parpadea en modo inofensivo con un indicador visual `!`, permitiendo al jugador reaccionar sin recibir daño injusto.

---

## 5. 🛠️ Herramientas del MCP `platformer-architect`
- `validate_stage_architecture(stage_number)`: Ejecuta el análisis geométrico y de balance de cualquier nivel en `js/map.js`.
- `generate_dynamic_stage(stage_number, theme, difficulty, num_burgers, num_floors)`: Genera el código JavaScript listo para copiar con pisos, escaleras, hamburguesas y enemigos balanceados.
- `diagnose_character_physics_rules()`: Consulta los algoritmos matemáticos anti-tunneling y desacoplamiento de hitboxes.
