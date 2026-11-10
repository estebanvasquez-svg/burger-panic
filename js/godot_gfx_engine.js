/**
 * Godot-Inspired 2D WebGL2 Graphics, Lighting & Particle Engine for Burger Panic
 * Ultra-Optimized 60 FPS Edition:
 *  1. WorldEnvironment: Fast 9-Tap Dual-Kawase Selective Emissive HDR Bloom & Tonemapping
 *  2. PointLight2D & NormalMap2D: Squared-distance zero-sqrt dynamic 2D point lights + 2.5D normal bevels
 *  3. Sub-Pixel Crisp Upscaling: Sharp arcade pixel edges with zero MSAA/buffer-copy overhead
 *  4. 2.5D Soft Drop Shadows & Volumetric Depth: Cached backdrop gradients & frustum-culled shadows
 *  5. GPUParticles2D: Batched rect-based physics particles (steam, embers, shockwaves, sparkles)
 */

class Godot2DGraphicsEngine {
  constructor(game) {
    this.game = game;
    this.baseCanvas = game.canvas;
    // Modes: 0 = GODOT ULTRA HD (Sub-Pixel Crisp + Emissive Bloom + Lights + 2.5D + Particles),
    //        1 = GODOT RETRO GLOW (Pixel + Bloom + Lights + 2.5D + Particles),
    //        2 = CLASSIC 2D
    this.mode = 0;
    this.modeNames = [
      '✨ GODOT ULTRA HD (60 FPS + Bloom + Luces 2D)',
      '🌟 GODOT RETRO GLOW (Pixel + Bloom + Luces 2D)',
      '🕹️ CLÁSICO 2D ORIGINAL'
    ];

    // 2x internal resolution (480x640) gives 4x sub-pixel crispness at 1/4th the fragment cost of 4x
    this.scaleFactor = 2;
    this.glCanvas = null;
    this.gl = null;
    this.program = null;
    this.texture = null;
    this.textureAllocated = false;
    this.uniforms = {};

    // Dynamic PointLight2D array (up to 8 simultaneous lights, zero-sqrt squared distance)
    this.maxLights = 8;
    this.lightData = new Float32Array(this.maxLights * 4);  // x(uv), y(uv), radiusSq(uv^2), intensity
    this.lightColors = new Float32Array(this.maxLights * 3); // r, g, b
    this.activeLightCount = 0;

    // Cached offscreen backdrop atmosphere per stage (zero per-frame gradient allocations)
    this.backdropCache = {};

    // GPUParticles2D system
    this.particles = [];
    this.shockwaves = [];
    this.ambientTimer = 0;
    this.startTime = performance.now();

    this.initWebGL2Overlay();
    this.initAmbientParticles();
  }

  initWebGL2Overlay() {
    if (!this.baseCanvas || !this.baseCanvas.parentElement) return;

    const glCanvas = document.createElement('canvas');
    glCanvas.id = 'webglCanvas';
    glCanvas.width = 480;
    glCanvas.height = 640;
    glCanvas.style.position = 'absolute';
    glCanvas.style.inset = '0';
    glCanvas.style.width = '100%';
    glCanvas.style.height = '100%';
    glCanvas.style.objectFit = 'contain';
    glCanvas.style.pointerEvents = 'none';
    glCanvas.style.borderRadius = '6px';
    glCanvas.style.zIndex = '2';
    glCanvas.style.imageRendering = 'pixelated';

    this.baseCanvas.parentElement.appendChild(glCanvas);
    this.glCanvas = glCanvas;

    const ctxAttrs = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    };

    const gl = glCanvas.getContext('webgl2', ctxAttrs) || glCanvas.getContext('webgl', ctxAttrs);

    if (!gl) {
      console.warn('WebGL no disponible, usando modo Canvas 2D.');
      glCanvas.style.display = 'none';
      return;
    }

    // Hide baseCanvas paint opacity while keeping pointer events active on it
    this.baseCanvas.style.opacity = '0';

    this.gl = gl;
    this.setupShaders();
  }

  setupShaders() {
    const gl = this.gl;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        v_uv.y = 1.0 - v_uv.y;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Ultra-fast single-pass shader:
    // Only 9 texture fetches total (shared between 2.5D normal bevel, sub-pixel AA, and Dual-Kawase bloom)
    // Zero sqrt(), zero normalize(), zero pow() inside the PointLight2D loop!
    const fsSource = `
      precision mediump float;
      varying vec2 v_uv;

      uniform sampler2D u_texture;
      uniform vec2 u_texSize;
      uniform float u_hdFilter;
      uniform float u_normalStrength;
      uniform float u_bloomStrength;
      uniform vec3 u_ambientColor;
      uniform int u_lightCount;
      uniform vec4 u_lights[8];      // xy = uv pos, z = radiusSq, w = intensity
      uniform vec3 u_lightColors[8]; // rgb color

      float getLuma(vec3 c) {
        return dot(c, vec3(0.299, 0.587, 0.114));
      }

      vec3 extractGlow(vec3 col) {
        float maxC = max(max(col.r, col.g), col.b);
        float minC = min(min(col.r, col.g), col.b);
        float sat = (maxC > 0.05) ? ((maxC - minC) / maxC) : 0.0;
        float luma = getLuma(col);
        float mask = smoothstep(0.32, 0.72, sat) * smoothstep(0.45, 0.82, luma);
        return col * mask;
      }

      void main() {
        vec2 texel = 1.0 / u_texSize;
        vec2 pos = v_uv * u_texSize - 0.5;
        vec2 f = fract(pos);
        vec2 sharpF = mix(f, smoothstep(0.40, 0.60, f), u_hdFilter);
        vec2 centerUV = (floor(pos) + sharpF + 0.5) * texel;

        // 1. Sample center + 4 cardinal neighbors (shared for albedo, 2.5D normal, and inner bloom)
        vec3 baseCol = texture2D(u_texture, centerUV).rgb;
        vec3 n = texture2D(u_texture, v_uv + vec2(0.0, -texel.y)).rgb;
        vec3 s = texture2D(u_texture, v_uv + vec2(0.0,  texel.y)).rgb;
        vec3 e = texture2D(u_texture, v_uv + vec2( texel.x, 0.0)).rgb;
        vec3 w = texture2D(u_texture, v_uv + vec2(-texel.x, 0.0)).rgb;

        // 2. Fast 2.5D surface normal gradient (zero normalize needed)
        float lL = getLuma(w);
        float lR = getLuma(e);
        float lU = getLuma(n);
        float lD = getLuma(s);
        vec2 normalXY = vec2(lL - lR, lU - lD) * u_normalStrength;

        // Overhead directional key light bevel
        float bevelBoost = clamp(0.97 + (normalXY.x * -0.18 + normalXY.y * -0.45), 0.86, 1.14);

        // 3. Fast 8-Light PointLight2D accumulation using squared distance (zero sqrt/pow)
        vec3 dynamicLight = u_ambientColor;
        vec3 haloAccum = vec3(0.0);
        vec2 aspect = vec2(1.0, 1.3333);

        for (int i = 0; i < 8; i++) {
          if (i >= u_lightCount) break;
          vec4 l = u_lights[i];
          vec2 delta = (l.xy - v_uv) * aspect;
          float distSq = dot(delta, delta);
          if (distSq < l.z) {
            float t = 1.0 - (distSq / l.z);
            float atten = t * t;
            float nDotL = clamp(0.75 + dot(normalXY, delta) * 3.5, 0.45, 1.30);
            vec3 lCol = u_lightColors[i];
            dynamicLight += lCol * (l.w * atten * nDotL * 0.48);
            haloAccum += lCol * (l.w * atten * t * 0.05);
          }
        }

        vec3 litCol = baseCol * bevelBoost * dynamicLight + haloAccum;

        // 4. Fast Dual-Kawase Selective Emissive Bloom (only 4 outer diagonal taps + shared cardinals)
        vec2 bOff = texel * 2.5;
        vec3 b1 = texture2D(u_texture, v_uv + vec2( bOff.x,  bOff.y)).rgb;
        vec3 b2 = texture2D(u_texture, v_uv + vec2(-bOff.x,  bOff.y)).rgb;
        vec3 b3 = texture2D(u_texture, v_uv + vec2( bOff.x, -bOff.y)).rgb;
        vec3 b4 = texture2D(u_texture, v_uv + vec2(-bOff.x, -bOff.y)).rgb;

        vec3 innerGlow = (extractGlow(n) + extractGlow(s) + extractGlow(e) + extractGlow(w)) * 0.15;
        vec3 outerGlow = (extractGlow(b1) + extractGlow(b2) + extractGlow(b3) + extractGlow(b4)) * 0.14;
        vec3 hdrColor = litCol + (innerGlow + outerGlow) * u_bloomStrength;

        // 5. Subtle vibrance & fast contrast curve
        float luma = getLuma(hdrColor);
        hdrColor = mix(vec3(luma), hdrColor, 1.10);

        gl_FragColor = vec4(clamp(hdrColor, 0.0, 1.0), 1.0);
      }
    `;

    const vs = this.compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Error enlazando shader WebGL:', gl.getProgramInfoLog(program));
      return;
    }

    this.program = program;
    gl.useProgram(program);

    const quadVerts = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    this.texture = tex;

    this.uniforms = {
      u_texture: gl.getUniformLocation(program, 'u_texture'),
      u_texSize: gl.getUniformLocation(program, 'u_texSize'),
      u_hdFilter: gl.getUniformLocation(program, 'u_hdFilter'),
      u_normalStrength: gl.getUniformLocation(program, 'u_normalStrength'),
      u_bloomStrength: gl.getUniformLocation(program, 'u_bloomStrength'),
      u_ambientColor: gl.getUniformLocation(program, 'u_ambientColor'),
      u_lightCount: gl.getUniformLocation(program, 'u_lightCount'),
      u_lights: gl.getUniformLocation(program, 'u_lights[0]'),
      u_lightColors: gl.getUniformLocation(program, 'u_lightColors[0]')
    };

    // Set static uniforms once
    gl.uniform1i(this.uniforms.u_texture, 0);
    gl.uniform2f(this.uniforms.u_texSize, this.baseCanvas.width, this.baseCanvas.height);
    gl.uniform1f(this.uniforms.u_normalStrength, 1.25);
    gl.uniform1f(this.uniforms.u_bloomStrength, 0.85);
  }

  compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  cycleGraphicsMode() {
    this.mode = (this.mode + 1) % 3;
    if (this.glCanvas) {
      const useGL = (this.mode !== 2);
      this.glCanvas.style.display = useGL ? 'block' : 'none';
      if (this.baseCanvas) {
        this.baseCanvas.style.opacity = useGL ? '0' : '1';
      }
    }
    return this.modeNames[this.mode];
  }

  // ==========================================================
  // DYNAMIC POINTLIGHT2D COLLECTION (PRE-SQUARED RADIUS)
  // ==========================================================
  clearLights() {
    this.activeLightCount = 0;
  }

  addPointLight(worldX, worldY, radiusPx, intensity, r, g, b) {
    if (this.activeLightCount >= this.maxLights) return;
    const camX = (this.game && this.game.cameraX) ? this.game.cameraX : 0;
    const screenX = worldX - camX;
    const screenY = worldY;

    if (screenX < -radiusPx || screenX > 240 + radiusPx) return;

    const radUV = Math.max(radiusPx / 240.0, 0.01);
    const idx = this.activeLightCount;
    this.lightData[idx * 4 + 0] = screenX / 240.0;
    this.lightData[idx * 4 + 1] = screenY / 320.0;
    this.lightData[idx * 4 + 2] = radUV * radUV; // Pre-squared radius for zero-sqrt shader!
    this.lightData[idx * 4 + 3] = intensity;

    this.lightColors[idx * 3 + 0] = r;
    this.lightColors[idx * 3 + 1] = g;
    this.lightColors[idx * 3 + 2] = b;

    this.activeLightCount++;
  }

  collectSceneLights() {
    this.clearLights();
    const g = this.game;
    if (!g) return;

    const t = (performance.now() - this.startTime) * 0.004;

    if (g.state === 'TITLE') {
      this.addPointLight(120 + Math.sin(t) * 35, 95, 130, 0.70, 1.0, 0.75, 0.35);
      this.addPointLight(120, 210, 110, 0.50, 0.95, 0.3, 0.55);
      return;
    }

    if (g.state === 'MAP') {
      const selNode = g.mapNodes ? g.mapNodes.find((n) => n.level === g.mapSelectedStage) : null;
      if (selNode) {
        const sy = selNode.y - g.mapScrollY;
        this.addPointLight(selNode.x, sy, 85, 0.80, 0.25, 0.85, 1.0);
      }
      return;
    }

    // 1. Player (Chef Pepe) Warm Hero Key Light
    if (g.player && !g.player.isDead) {
      const px = g.player.x + 8;
      const py = g.player.y + 8;
      if (g.player.hasBlowtorch && g.player.blowtorchFuel > 0) {
        this.addPointLight(px, py, 76, 0.85, 0.25, 0.85, 1.0);
      } else {
        this.addPointLight(px, py, 60, 0.50, 1.0, 0.92, 0.76);
      }
    }

    // 2. Kiloburner Giant Boss Lights (Stage 3)
    if (g.kiloburnerBoss && !g.kiloburnerBoss.isDead) {
      const bx = g.kiloburnerBoss.x;
      const by = g.kiloburnerBoss.y;
      const pulse = 0.85 + Math.sin(t * 2.5) * 0.2;
      this.addPointLight(bx + 18, by + 28, 110, 0.95 * pulse, 1.0, 0.28, 0.08);
      this.addPointLight(35 + g.cameraX, 305, 85, 0.85 * pulse, 1.0, 0.45, 0.05);
    }

    // 3. Active Pepper Clouds
    if (g.pepperClouds) {
      for (const pc of g.pepperClouds) {
        this.addPointLight(pc.x + 8, pc.y + 8, 54, 0.95, 1.0, 0.85, 0.2);
      }
    }

    // 4. Blowtorch Pickup Stations (only near camera)
    if (g.blowtorches) {
      for (const bt of g.blowtorches) {
        if (!bt.collected && Math.abs(bt.x - (g.cameraX + 120)) < 140) {
          this.addPointLight(bt.x + 8, bt.y + 8, 50, 0.8, 0.2, 0.85, 1.0);
        }
      }
    }

    // 5. Projectiles & Bonus Items
    if (g.flameProjectiles && g.flameProjectiles.length > 0) {
      const fp = g.flameProjectiles[g.flameProjectiles.length - 1];
      this.addPointLight(fp.x, fp.y, 48, 0.95, 1.0, 0.5, 0.1);
    }
    if (g.bossProjectiles && g.bossProjectiles.length > 0) {
      const bp = g.bossProjectiles[0];
      this.addPointLight(bp.x, bp.y, 48, 0.90, 1.0, 0.35, 0.05);
    }
    if (g.bonusItems) {
      for (const item of g.bonusItems) {
        this.addPointLight(item.x + 8, item.y + 8, 50, 0.78, 1.0, 0.75, 0.25);
      }
    }

    // 6. Ambient Neon Sign Warm Light (Stage Map Neon)
    const neonPulse = (Math.sin(t * 1.2) * 0.12 + 0.88);
    this.addPointLight(120, 78, 65, 0.38 * neonPulse, 1.0, 0.35, 0.45);
  }

  // ==========================================================
  // 2.5D DEPTH, CACHED ATMOSPHERE & FRUSTUM-CULLED SHADOWS
  // ==========================================================
  getCachedBackdrop(stageNum, w, h) {
    if (this.backdropCache[stageNum]) return this.backdropCache[stageNum];

    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const octx = off.getContext('2d');

    const ambGrad = octx.createRadialGradient(120, 120, 15, 120, 150, 175);
    if (stageNum === 3 || stageNum === 8 || stageNum === 9) {
      ambGrad.addColorStop(0, 'rgba(249, 115, 22, 0.08)');
      ambGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (stageNum === 11) {
      ambGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      ambGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (stageNum === 14) {
      ambGrad.addColorStop(0, 'rgba(192, 132, 252, 0.09)');
      ambGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      ambGrad.addColorStop(0, 'rgba(255, 244, 214, 0.05)');
      ambGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    octx.fillStyle = ambGrad;
    octx.fillRect(0, 34, w, h - 34);

    if (stageNum === 3 || stageNum === 8 || stageNum === 9) {
      const lavaGlow = octx.createLinearGradient(0, h - 42, 0, h);
      lavaGlow.addColorStop(0, 'rgba(239, 68, 68, 0)');
      lavaGlow.addColorStop(1, 'rgba(249, 115, 22, 0.20)');
      octx.fillStyle = lavaGlow;
      octx.fillRect(0, h - 42, w, 42);
    }

    this.backdropCache[stageNum] = off;
    return off;
  }

  drawBackdropAtmosphere(ctx) {
    const g = this.game;
    if (!g || this.mode === 2) return;

    const stageNum = (g.levelData && g.levelData.stageNumber) ? g.levelData.stageNumber : (g.stageIndex + 1);
    const camX = Math.round(g.cameraX || 0);
    const cached = this.getCachedBackdrop(stageNum, 240, 320);
    ctx.drawImage(cached, camX, 0);
  }

  // Draw Frustum-Culled 2.5D Soft Drop Shadows under Platforms & Ladders (Zero Gradients!)
  drawWorldShadows25D(ctx) {
    const g = this.game;
    if (!g || !g.levelData || this.mode === 2) return;

    const camX = g.cameraX || 0;
    const viewL = camX - 24;
    const viewR = camX + 264;

    // 1. Ladder wall drop shadows
    if (g.levelData.ladders) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      for (const l of g.levelData.ladders) {
        if (l.x < viewL || l.x > viewR) continue;
        const y1 = l.y1 + 4;
        const y2 = l.y2 + 14;
        ctx.fillRect(l.x + 3, y1 + 2, 2, y2 - y1);
        ctx.fillRect(l.x + 14, y1 + 2, 2, y2 - y1);
      }
    }

    // 2. Fast 2-strip Platform Underglow Shadow (zero createLinearGradient calls)
    if (g.levelData.floors) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
      for (const f of g.levelData.floors) {
        if (f.type === 'diagonal' || f.x2 < viewL || f.x1 > viewR) continue;
        const x = Math.max(f.x1, viewL);
        const w = Math.min(f.x2, viewR) - x;
        const y = (f.currentY !== undefined ? f.currentY : f.y) + 14;
        ctx.fillRect(x + 1, y + 7, w, 3);
      }
      ctx.fillStyle = 'rgba(0, 0, 0, 0.20)';
      for (const f of g.levelData.floors) {
        if (f.type === 'diagonal' || f.x2 < viewL || f.x1 > viewR) continue;
        const x = Math.max(f.x1, viewL);
        const w = Math.min(f.x2, viewR) - x;
        const y = (f.currentY !== undefined ? f.currentY : f.y) + 14;
        ctx.fillRect(x + 1, y + 10, w, 3);
      }
    }
  }

  // Draw Frustum-Culled 2.5D Specular Rim & Bevel on Platforms
  drawPlatformSpecular25D(ctx) {
    const g = this.game;
    if (!g || !g.levelData || !g.levelData.floors || this.mode === 2) return;

    const camX = g.cameraX || 0;
    const viewL = camX - 24;
    const viewR = camX + 264;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    for (const f of g.levelData.floors) {
      if (f.type === 'diagonal' || f.x2 < viewL || f.x1 > viewR) continue;
      const x = Math.max(f.x1, viewL);
      const w = Math.min(f.x2, viewR) - x;
      const y = (f.currentY !== undefined ? f.currentY : f.y) + 14;
      ctx.fillRect(x, y, w, 1);
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.40)';
    for (const f of g.levelData.floors) {
      if (f.type === 'diagonal' || f.x2 < viewL || f.x1 > viewR) continue;
      const x = Math.max(f.x1, viewL);
      const w = Math.min(f.x2, viewR) - x;
      const y = (f.currentY !== undefined ? f.currentY : f.y) + 14;
      ctx.fillRect(x, y + 7, w, 1);
    }
  }

  // Draw Frustum-Culled 2.5D Shadows & Gloss on Burgers + Spawn Hot Patty Steam
  drawBurgers25DEffects(ctx) {
    const g = this.game;
    if (!g || !g.burgers || this.mode === 2) return;

    const camX = g.cameraX || 0;
    const viewL = camX - 40;
    const viewR = camX + 264;

    for (const b of g.burgers) {
      if (b.x < viewL || b.x > viewR) continue;
      const bx = b.x;
      const by = b.y + 6;

      ctx.fillStyle = b.falling ? 'rgba(0, 0, 0, 0.28)' : 'rgba(0, 0, 0, 0.46)';
      for (let i = 0; i < 4; i++) {
        const dropOffset = b.falling ? 0 : b.segments[i].dropY;
        ctx.fillRect(bx + i * 8 + 1, by + 7 + dropOffset, 7, 2);
      }

      if (b.type === 'bun_top' || b.type === 'cheese' || b.type === 'tomato') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.20)';
        for (let i = 0; i < 4; i++) {
          const dropOffset = b.falling ? 0 : b.segments[i].dropY;
          ctx.fillRect(bx + i * 8 + 2, by + 1 + dropOffset, 4, 1);
        }
      }

      if (b.type === 'patty' && Math.random() < 0.025) {
        this.spawnSteamWisp(bx + 6 + Math.random() * 20, by + 2);
      }
    }
  }

  // Draw Fast Pixel-Crisp Contact Ground Shadows under Chef Pepe, Enemies & Bonus Items
  drawEntityShadows25D(ctx) {
    const g = this.game;
    if (!g || !g.levelData || this.mode === 2) return;

    const camX = g.cameraX || 0;
    const viewL = camX - 24;
    const viewR = camX + 264;

    if (g.player && !g.player.isDead) {
      const px = Math.round(g.player.x + 8);
      const py = Math.round(g.player.y + 14);
      const rx = g.player.isJumping ? 4 : 6;
      ctx.fillStyle = g.player.isJumping ? 'rgba(0, 0, 0, 0.24)' : 'rgba(0, 0, 0, 0.46)';
      ctx.fillRect(px - rx, py, rx * 2, 2);
    }

    if (g.enemies) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      for (const e of g.enemies) {
        if (e.state === 'spawning' || e.isClimbing || e.x < viewL || e.x > viewR) continue;
        ctx.fillRect(Math.round(e.x + 3), Math.round(e.y + 14), 10, 2);
      }
    }

    if (g.bonusItems) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.44)';
      for (const item of g.bonusItems) {
        ctx.fillRect(Math.round(item.x + 3), Math.round(item.y + 14), 10, 2);
      }
    }
  }

  // ==========================================================
  // GPUPARTICLES2D SYSTEM (BATCHED RECT PARTICLES FOR 60 FPS)
  // ==========================================================
  initAmbientParticles() {
    this.particles = [];
    this.shockwaves = [];
  }

  spawnSteamWisp(x, y) {
    if (this.particles.length > 55) return;
    this.particles.push({
      kind: 'steam',
      x,
      y,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -0.32 - Math.random() * 0.22,
      size: 2,
      color: '#f8fafc',
      alpha: 0.22,
      life: 28 + Math.random() * 12,
      maxLife: 40,
      phase: Math.random() * Math.PI * 2
    });
  }

  spawnShockwave(x, y, color = '#38bdf8', maxRadius = 26) {
    if (this.shockwaves.length > 6) return;
    this.shockwaves.push({
      x,
      y,
      radius: 3,
      maxRadius,
      color,
      alpha: 0.85
    });
  }

  spawnGlowingBurst(x, y, color = '#fef08a', count = 8) {
    if (this.particles.length > 65) return;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 0.8 + Math.random() * 2.0;
      this.particles.push({
        kind: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4,
        size: 2,
        color,
        alpha: 0.95,
        life: 16 + Math.random() * 10,
        maxLife: 26
      });
    }
  }

  updateAndDrawParticles(ctx) {
    const g = this.game;
    if (!g || this.mode === 2) return;

    this.ambientTimer++;
    const stageNum = (g.levelData && g.levelData.stageNumber) ? g.levelData.stageNumber : (g.stageIndex + 1);
    const camX = g.cameraX || 0;

    // 1. Spawn ambient stage particles (capped at 50 for zero CPU overhead)
    if (this.ambientTimer % 10 === 0 && this.particles.length < 48) {
      const spawnX = camX + Math.random() * 240;
      if (stageNum === 3 || stageNum === 8 || stageNum === 9) {
        this.particles.push({
          kind: 'ember',
          x: spawnX,
          y: 318,
          vx: (Math.random() - 0.5) * 0.45,
          vy: -0.65 - Math.random() * 0.65,
          size: 2,
          color: Math.random() < 0.5 ? '#f97316' : '#fef08a',
          alpha: 0.85,
          life: 60 + Math.random() * 30,
          maxLife: 90,
          phase: Math.random() * Math.PI * 2
        });
      } else if (stageNum === 11) {
        this.particles.push({
          kind: 'snow',
          x: spawnX,
          y: 34,
          vx: (Math.random() - 0.5) * 0.35,
          vy: 0.5 + Math.random() * 0.4,
          size: 2,
          color: '#e0f2fe',
          alpha: 0.75,
          life: 75 + Math.random() * 30,
          maxLife: 105,
          phase: Math.random() * Math.PI * 2
        });
      } else if (this.ambientTimer % 20 === 0) {
        this.particles.push({
          kind: 'mote',
          x: spawnX,
          y: 50 + Math.random() * 240,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -0.15 - Math.random() * 0.2,
          size: 2,
          color: stageNum === 14 ? '#38bdf8' : '#fef08a',
          alpha: 0.40,
          life: 55 + Math.random() * 25,
          maxLife: 80,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    // 2. Spawn soft footstep dust when Chef Pepe runs
    if (g.player && !g.player.isDead && !g.player.isJumping && !g.player.isClimbing && g.player.vx !== 0) {
      if (this.ambientTimer % 6 === 0 && this.particles.length < 55) {
        this.particles.push({
          kind: 'dust',
          x: g.player.x + 8 - Math.sign(g.player.vx) * 4,
          y: g.player.y + 14,
          vx: -Math.sign(g.player.vx) * 0.25,
          vy: -0.2,
          size: 2,
          color: '#cbd5e1',
          alpha: 0.38,
          life: 12,
          maxLife: 12
        });
      }
    }

    if (this.shockwaves.length === 0 && this.particles.length === 0) return;

    ctx.save();

    // 3. Render & update Shockwave rings
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * 0.24 + 0.8;
      sw.alpha *= 0.84;

      if (sw.alpha <= 0.05 || sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
        continue;
      }

      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.alpha;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 4. Render & update Particles using fast fillRect (10x faster than arc())
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      const lifeRatio = p.life / p.maxLife;
      if (p.phase !== undefined) {
        p.x += p.vx + Math.sin(this.ambientTimer * 0.06 + p.phase) * 0.16;
      } else {
        p.x += p.vx;
      }
      p.y += p.vy;

      ctx.globalAlpha = p.alpha * lifeRatio;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }

    ctx.restore();
  }

  // ==========================================================
  // FINAL WEBGL2 POST-PROCESS RENDER PASS
  // ==========================================================
  renderWebGLPass() {
    if (!this.gl || !this.program || this.mode === 2) return;

    const gl = this.gl;
    this.collectSceneLights();

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    if (!this.textureAllocated) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.baseCanvas);
      this.textureAllocated = true;
    } else {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.baseCanvas);
    }

    gl.uniform1f(this.uniforms.u_hdFilter, this.mode === 0 ? 1.0 : 0.0);

    const isPlaying = this.game && (this.game.state === 'PLAYING' || this.game.state === 'READY');
    if (isPlaying) {
      gl.uniform3f(this.uniforms.u_ambientColor, 0.96, 0.96, 1.0);
    } else {
      gl.uniform3f(this.uniforms.u_ambientColor, 0.99, 0.99, 1.0);
    }

    gl.uniform1i(this.uniforms.u_lightCount, this.activeLightCount);
    gl.uniform4fv(this.uniforms.u_lights, this.lightData);
    gl.uniform3fv(this.uniforms.u_lightColors, this.lightColors);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

window.Godot2DGraphicsEngine = Godot2DGraphicsEngine;
