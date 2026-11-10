# 🍔 Burger Panic Mobile (Retro Arcade Platformer)

Un videojuego arcade de plataformas retro original, diseñado y optimizado específicamente para dispositivos móviles (Android e iOS) en orientación vertical (*portrait*).

---

## 📱 Características Principales

1. **Optimizado para Móviles (Android e iOS)**:
   - **Orientación Vertical**: Diseñado para jugar cómodamente en teléfonos con una o dos manos en modo vertical.
   - **Cruceta Táctil (D-Pad) Ergonómica**: Movimiento fluido en cruz sin atascos.
   - **Botones Arcade Táctiles**: Botones de gran tamaño para **Salto (JUMP)** y **Pimienta (PEPPER)** con respuesta háptica y animaciones táctiles.
   - **Soporte de Gestos**: Desliza el dedo (*swipe*) sobre la pantalla para moverte o realiza doble toque para rociar pimienta.
   - **Vibración / Retroalimentación Háptica**: Efectos de vibración en saltos, aturdimiento y caídas en dispositivos compatibles.
   - **PWA (Progressive Web App)**: Instalable como aplicación nativa tanto en iOS (Safari -> *Agregar a pantalla de inicio*) como en Android (Chrome -> *Instalar aplicación*), con soporte sin conexión (*offline*).

2. **Mecánicas Originales de Plataformas y Puzle**:
   - **Chef Pepe**: Protagonista con gorro de chef y salero aturdidor.
   - **Pisado y Caída de Ingredientes**: Cada ingrediente (pan superior, lechuga, tomate, queso, carne, pan inferior) está compuesto por 4 secciones. Al pisar las 4, la pieza cae por gravedad al siguiente piso.
   - **Cascadas en Cadena**: Las piezas que caen empujan los ingredientes inferiores hacia abajo.
   - **Aplastamiento de Enemigos**: Aplasta a los enemigos con ingredientes en caída para ganar 500 puntos de bonificación.
   - **Viaje sobre Ingredientes**: Si un enemigo se encuentra sobre un ingrediente al caer, caerá con él otorgando bonificaciones masivas.
   - **Enemigos Divertidos con IA Única**:
     - 🌭 *Frank* (Salchicha): Persecución implacable por el piso y escaleras.
     - 🥒 *Dill* (Pepinillo): Patrullaje errático y bloqueador.
     - 🍳 *Sunny* (Huevo Frito): Movimientos rápidos y evasivos.
   - **Salero de Pimienta en 4 Direcciones**: Aturde a los enemigos temporalmente hacia arriba, abajo, izquierda y derecha para cruzar sobre ellos sin peligro.
   - **Salto y Salto de Evacuación en Escaleras**: Salta obstáculos en suelo plano o salta hacia afuera desde una escalera para huir de enemigos que suban desde abajo.
   - **Ítems de Bonificación**: Helados y cafés que otorgan puntos extra y recargan las cargas de sal/pimienta.
   - **Progresión de Niveles**: Múltiples niveles con laberintos de escaleras y dificultad progresiva.

3. **Audio y Gráficos Retro 100% Originales**:
   - Gráficos pixel art originales y hojas de sprites personalizadas.
   - Sintetizador chiptune 8-bit procedural generado mediante **Web Audio API** con música original y efectos de sonido en tiempo real.
   - Sin librerías externas pesadas ni dependencias propietarias: 100% código limpio para publicar y monetizar.

---

## 🚀 Cómo Ejecutar y Jugar

### 1. Iniciar el Servidor Local
Abre una terminal en esta carpeta y ejecuta:

```bash
python server.py
```

El servidor te mostrará dos enlaces:
1. **Para jugar en PC:** `http://localhost:9090`
2. **Para jugar en tu Celular (Android / iOS):** `http://TU_IP_LOCAL:9090` *(por ejemplo: `http://192.9.0.223:9090`)*

> **Nota:** El celular y la computadora deben estar conectados a la misma red Wi-Fi local.

---

## 📲 Cómo Instalarlo como App en tu Celular

### En iPhone / iPad (iOS):
1. Abre Safari y entra a la dirección de tu servidor (ej. `http://192.9.0.223:9090`).
2. Toca el botón de **Compartir** (ícono del cuadrado con flecha hacia arriba).
3. Selecciona **"Agregar a pantalla de inicio"** (*Add to Home Screen*).
4. Se abrirá como app independiente a pantalla completa.

### En Android:
1. Abre Google Chrome y entra a la dirección del juego.
2. Toca el menú de tres puntos arriba a la derecha y selecciona **"Instalar aplicación"** o **"Agregar a la pantalla principal"**.
3. Se agregará con su ícono propio y correrá en modo pantalla completa sin barra de navegador.

---

## 🎮 Controles

### En Celular:
- **Cruceta Virtual (D-Pad)**: Moverse y subir/bajar escaleras.
- **Botón JUMP (👟)**: Saltar sobre enemigos en el suelo o escapar de una escalera hacia los lados.
- **Botón PEPPER (🧂)**: Rociar sal o pimienta en la dirección actual para aturdir enemigos.
- **Gestos en pantalla**: Deslizar el dedo para moverse / doble toque para lanzar pimienta.

### En Teclado (PC):
- **Flechas / WASD**: Moverse y subir/bajar escaleras.
- **Tecla X / K / C**: Saltar / Escapar de escalera.
- **Espacio / Tecla Z / J**: Rociar pimienta/sal.
- **Tecla P**: Pausar / Reanudar el juego.
