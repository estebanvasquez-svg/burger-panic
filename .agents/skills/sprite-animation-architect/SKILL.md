---
name: sprite-animation-architect
description: >-
  Specialized skill for 2D arcade sprite animation, pixel-perfect atlas generation,
  baseline anchoring, frame-rate pacing, and visual glitch prevention in retro/arcade games.
---

# 🎨 Sprite Animation Architect (Arcade & Retro Platformers)

Estándares técnicos y metodologías para el diseño, sincronización, anclaje y renderizado de sprites y animaciones 2D sin bugs visuales, tirones ni desalineaciones en motores arcade HTML5 Canvas / WebGL.

---

## 1. 📏 Principio de Anclaje Universal (Baseline & Feet Anchoring)

### El Problema del "Pop" Visual
Cuando un personaje transiciona entre estados (ej. Correr ➔ Detenerse ➔ Subir escalera ➔ Saltar), si cada frame tiene una altura o posición de pies diferente dentro de su caja de recorte (`bounding box`), el personaje sufrirá:
- **Temblores verticales (Jitter):** Los pies se despegan del suelo o se hunden periódicamente.
- **Desplazamiento horizontal abrupto:** Al cambiar el ancho lógico `w` de 22 a 16 px, el cálculo `drawX = x + 8 - w/2` produce un salto de 3 px.

### La Regla de Oro
1. **Línea de Suelo Idéntica (`baseline_y`):**
   Todos los frames del atlas deben tener el píxel más bajo de los pies exactamente en la misma coordenada relativa `baseline_y` (ej. `y = 116` en celdas de 120 px de alto).
2. **Dimensiones Lógicas Uniformes:**
   Todos los estados de movimiento y reposo del personaje deben compartir el mismo tamaño lógico `(w: 22, h: 30)`.
3. **Fórmula de Renderizado Invariable:**
   ```javascript
   const drawX = Math.round(this.x + 8 - w / 2);
   const drawY = Math.round((this.y + 14) - h);
   ```

---

## 2. 🏃 Ciclo Biomecánico de Carrera (Run Cycle 8-Frames)

Para lograr una animación natural con fluidez profesional y peso arcade:
1. **Pies en contacto (`Frames 1, 2, 5, 6`):**
   El pie de apoyo debe estar firmemente posado en `baseline_y = 116`.
2. **Fase de Vuelo / Cruce (`Frames 4 y 8`):**
   El torso NO debe teletransportarse hacia arriba; debe mantener una altura de centro de masa estable (`top_y ≈ 6-7`), mientras la pierna trasera pasa hacia adelante a `y ≈ 113`.
3. **Péndulo de Brazos Opuestos:**
   - Brazo delantero avanza en oposición a la pierna delantera.
   - Movimiento armónico con codo flexionado y gorro con micro-inercia reactiva.
4. **Cadencia de Fotogramas (`Tick Pacing`):**
   - En 60 FPS, un ciclo de 8 fotogramas se reproduce óptimamente a `Math.floor(this.animTimer / 3) % 8` (24 FPS perceptuales / 3 frames de juego por sprite).

---

## 3. 🪜 Escaleras y Puntos de Vista Tridimensionales

1. **Perspectiva Dorsal (Espalda):**
   Al subir o bajar escaleras, el sprite debe mostrar la espalda del personaje centrada en los barrotes de la escalera (`x = ladder.x`).
2. **Ciclo Alternado de Peldaños (4 a 8 frames):**
   - Subiendo: `climb_1 ➔ climb_2 ➔ climb_3 ➔ climb_4` (mano izquierda arriba, pie derecho arriba, alternando).
   - Bajando: Inversión del ciclo `climb_4 ➔ climb_3 ➔ climb_2 ➔ climb_1`.
   - Detenido en escalera: Frame neutro estable (`climb_1`).

---

## 4. ⚔️ Estados de Acción Rápida (Pepper Toss, Salto, Derrota)

1. **Lanzamiento de Pimienta (`pepper_1..2`):**
   - Frame 1: Carga y preparación con salero levantado.
   - Frame 2: Sacudida frontal y nube de partículas.
2. **Salto y Victoria (`victory_1..2`):**
   - Estiramiento vertical natural (`scaleX: 0.95, scaleY: 1.05`) anclado a los pies.
3. **Secuencia de Derrota (`defeat_1..2`):**
   - Frame 1: Sentado aturdido con estrellas giratorias.
   - Frame 2: Desvanecido en el suelo con alivio cómico arcade.

---

## 5. 🛡️ Aislamiento del Canvas Context (`ctx.save()` / `ctx.restore()`)

Toda transformación (espejado horizontal `flip`, squash & stretch, accesorios como el soplete) DEBE estar encapsulada en pares estrictos de `ctx.save()` y `ctx.restore()`. Jamás dejar bloques condicionales con restores abiertos o desbalanceados.
