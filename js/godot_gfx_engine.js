/**
 * Godot-Inspired 2D WebGL2 Graphics, Lighting & Particle Engine for Burger Panic
 * Implements Godot 4 style visual features directly in HTML5/WebGL2:
 *  1. WorldEnvironment: Selective Emissive HDR Glow / Bloom & ACES Filmic Tonemapping
 *  2. PointLight2D & NormalMap2D: Real-time dynamic 2D point lights with procedural 2.5D normal mapping
 *  3. ScaleFX / xBR Shader: Razor-sharp edge-aware HD sprite upscaling (4x Super-Sampling 960x1280)
 *  4. 2.5D Soft Drop Shadows & Volumetric Depth: Ground contact shadows, platform occlusion & specular bevels
 *  5. GPUParticles2D: Advanced physics particles (steam, embers, shockwaves, sparkles, dust plumes)
 */

class Godot2DGraphicsEngine {
  constructor(game) {
    this.game = game;
    this.baseCanvas = game.canvas;
    // Modes: 0 = GODOT ULTRA HD (xBR + Emissive Bloom + Lights + 2.5D + Particles),
    //        1 = GODOT RETRO GLOW (Pixel Crisp + Emissive Bloom + Lights + 2.5D + Particles),
    //        2 = CLASSIC 2D
    this.mode = 0;
    this.modeNames = [
      '✨ GODOT ULTRA HD (xBR + Bloom + Luces 2D)',
      '🌟 GODOT RETRO GLOW (Pixel + Bloom + Luces 2D)',
      '🕹️ CLÁSICO 2D ORIGINAL'
    ];

    this.scaleFactor = 4; // 240x320 -> 960x1280 HD
    this.glCanvas = null;
    this.gl = null;
    this.program = null;
    this.texture = null;
    this.uniforms = {};

    // Dynamic PointLight2D array (up to 16 simultaneous lights)
    this.maxLights = 16;
    this.lightData = new Float32Array(this.maxLights * 4);  // x(uv), y(uv), radius(uv), intensity
    this.lightColors = new Float32Array(this.maxLights * 3); // r, g, b
    this.activeLightCount = 0;

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

    // Create high-resolution WebGL2 overlay canvas inside .bezel
    const glCanvas = document.createElement('canvas');
    glCanvas.id = 'webglCanvas';
    glCanvas.width = this.baseCanvas.width * this.scaleFactor;   // 960
    glCanvas.height = this.baseCanvas.height * this.scaleFactor; // 1280
    glCanvas.style.position = 'absolute';
    glCanvas.style.inset = '0';
    glCanvas.style.width = '100%';
    glCanvas.style.height = '100%';
    glCanvas.style.objectFit = 'contain';
    glCanvas.style.pointerEvents = 'none';
    glCanvas.style.borderRadius = '6px';
    glCanvas.style.zIndex = '2';

    this.baseCanvas.parentElement.appendChild(glCanvas);
    this.glCanvas = glCanvas;

    const gl = glCanvas.getContext('webgl2', {
      alpha: false,
      antialias: true,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true
    }) || glCanvas.getContext('webgl', {
      alpha: false,
      antialias: true,
      preserveDrawingBuffer: true
    });

    if (!gl) {
      console.warn('WebGL no disponible, usando modo Canvas 2D mejorado.');
      glCanvas.style.display = 'none';
      return;
    }

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

    const fsSource = `
      precision highp float;
      varying vec2 v_uv;

      uniform sampler2D u_texture;
      uniform vec2 u_texSize;
      uniform float u_time;
      uniform float u_hdFilter;       // 1.0 = ScaleFX/xBR HD, 0.0 = crisp sub-pixel
      uniform float u_normalStrength; // 2.5D normal map relief intensity
      uniform float u_bloomStrength;  // WorldEnvironment glow intensity
      uniform vec3 u_ambientColor;    // CanvasModulate ambient tint
      uniform int u_lightCount;
      uniform vec4 u_lights[16];      // xy = uv pos, z = radius, w = intensity
      uniform vec3 u_lightColors[16]; // rgb color

      float getLuma(vec3 c) {
        return dot(c, vec3(0.299, 0.587, 0.114));
      }

      float getSaturation(vec3 c) {
        float maxC = max(max(c.r, c.g), c.b);
        float minC = min(min(c.r, c.g), c.b);
        return (maxC > 0.01) ? ((maxC - minC) / maxC) : 0.0;
      }

      float colorDist(vec3 a, vec3 b) {
        vec3 d = a - b;
        return dot(d, d);
      }

      // Razor-Sharp 4x HD Sub-Pixel Anti-Aliasing + xBR Diagonal Corner Smoothing
      vec3 sampleHDSprite(vec2 uv, vec2 texSize, float useHD) {
        vec2 texel = 1.0 / texSize;
        vec2 pos = uv * texSize - 0.5;
        vec2 f = fract(pos);
        vec2 base = (floor(pos) + 0.5) * texel;

        // Keep pixel interiors 100% sharp; anti-alias only the outer 15% sub-pixel edge
        vec2 sharpF = smoothstep(0.42, 0.58, f);
        vec3 sharpSample = texture2D(u_texture, (floor(pos) + sharpF + 0.5) * texel).rgb;

        if (useHD < 0.5) {
          return sharpSample;
        }

        // Sample 4 cardinal neighbors for xBR diagonal corner rounding
        vec3 c = texture2D(u_texture, base).rgb;
        vec3 n = texture2D(u_texture, base + vec2(0.0, -texel.y)).rgb;
        vec3 s = texture2D(u_texture, base + vec2(0.0,  texel.y)).rgb;
        vec3 e = texture2D(u_texture, base + vec2( texel.x, 0.0)).rgb;
        vec3 w = texture2D(u_texture, base + vec2(-texel.x, 0.0)).rgb;

        vec3 result = sharpSample;
        float eqThresh = 0.018;
        float diffThresh = 0.065;

        // Top-Left corner smoothing when N == W and C is different
        if (colorDist(n, w) < eqThresh && colorDist(c, n) > diffThresh) {
          float corner = smoothstep(0.45, 0.0, f.x + f.y);
          result = mix(result, (n + w) * 0.5, corner * 0.55);
        }
        // Top-Right corner smoothing when N == E and C is different
        if (colorDist(n, e) < eqThresh && colorDist(c, n) > diffThresh) {
          float corner = smoothstep(0.45, 0.0, (1.0 - f.x) + f.y);
          result = mix(result, (n + e) * 0.5, corner * 0.55);
        }
        // Bottom-Left corner smoothing when S == W and C is different
        if (colorDist(s, w) < eqThresh && colorDist(c, s) > diffThresh) {
          float corner = smoothstep(0.45, 0.0, f.x + (1.0 - f.y));
          result = mix(result, (s + w) * 0.5, corner * 0.55);
        }
        // Bottom-Right corner smoothing when S == E and C is different
        if (colorDist(s, e) < eqThresh && colorDist(c, s) > diffThresh) {
          float corner = smoothstep(0.45, 0.0, (1.0 - f.x) + (1.0 - f.y));
          result = mix(result, (s + e) * 0.5, corner * 0.55);
        }

        return result;
      }

      // Compute procedural 2.5D Normal Vector from local height/luminance gradients
      vec3 computeNormal25D(vec2 uv, vec2 texSize) {
        vec2 texel = 1.0 / texSize;
        float lL = getLuma(texture2D(u_texture, uv + vec2(-texel.x, 0.0)).rgb);
        float lR = getLuma(texture2D(u_texture, uv + vec2( texel.x, 0.0)).rgb);
        float lU = getLuma(texture2D(u_texture, uv + vec2(0.0, -texel.y)).rgb);
        float lD = getLuma(texture2D(u_texture, uv + vec2(0.0,  texel.y)).rgb);

        float dx = (lL - lR) * u_normalStrength;
        float dy = (lU - lD) * u_normalStrength;
        return normalize(vec3(dx, dy, 1.0));
      }

      // Selective Emissive HDR Glow: blooms saturated neon/fire/gold colors without blurring white ladders/text
      vec3 extractGlow(vec3 col) {
        float luma = getLuma(col);
        float sat = getSaturation(col);
        // Only glow vibrant emissive colors (flames, neon, gold, lasers, buns)
        float emissiveMask = smoothstep(0.32, 0.75, sat) * smoothstep(0.45, 0.85, luma);
        return col * emissiveMask;
      }

      // Multi-scale Dual-Kawase Emissive Bloom
      vec3 sampleBloom(vec2 uv, vec2 texSize) {
        vec2 texel = 1.0 / texSize;
        vec3 bloom = vec3(0.0);
        float totalW = 0.0;

        for (int x = -2; x <= 2; x++) {
          for (int y = -2; y <= 2; y++) {
            float w = 1.0 / (1.0 + float(x*x + y*y));
            vec2 offset = vec2(float(x), float(y)) * texel * 1.5;
            bloom += extractGlow(texture2D(u_texture, uv + offset).rgb) * w;
            totalW += w;
          }
        }

        vec3 wideHalo = vec3(0.0);
        wideHalo += extractGlow(texture2D(u_texture, uv + vec2( 3.5,  0.0) * texel).rgb);
        wideHalo += extractGlow(texture2D(u_texture, uv + vec2(-3.5,  0.0) * texel).rgb);
        wideHalo += extractGlow(texture2D(u_texture, uv + vec2( 0.0,  3.5) * texel).rgb);
        wideHalo += extractGlow(texture2D(u_texture, uv + vec2( 0.0, -3.5) * texel).rgb);

        return (bloom / totalW) * 0.65 + (wideHalo / 4.0) * 0.45;
      }

      // ACES Filmic Tonemapping Curve
      vec3 acesTonemap(vec3 x) {
        float a = 2.51;
        float b = 0.03;
        float c = 2.43;
        float d = 0.59;
        float e = 0.14;
        return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
      }

      void main() {
        // 1. Sample crisp HD upscaled base albedo
        vec3 baseCol = sampleHDSprite(v_uv, u_texSize, u_hdFilter);

        // 2. Compute 2.5D surface normal for relief lighting
        vec3 normal = computeNormal25D(v_uv, u_texSize);

        // Global overhead directional key light (gives crisp 2.5D bevel to sprites & platforms)
        vec3 keyLightDir = normalize(vec3(-0.25, -0.55, 0.85));
        float keyDiff = max(dot(normal, keyLightDir), 0.0);
        float bevelBoost = 0.95 + keyDiff * 0.14;

        // 3. Accumulate Godot PointLight2D dynamic lighting
        vec3 dynamicLight = u_ambientColor;
        vec3 specularAccum = vec3(0.0);
        vec3 volumetricHalo = vec3(0.0);
        vec2 aspect = vec2(1.0, u_texSize.y / u_texSize.x); // 1.0, 320/240

        for (int i = 0; i < 16; i++) {
          if (i >= u_lightCount) break;
          vec4 l = u_lights[i];
          vec3 lCol = u_lightColors[i];

          vec2 delta = (l.xy - v_uv) * aspect;
          float dist = length(delta);
          float radius = max(l.z, 0.001);

          if (dist < radius) {
            float atten = clamp(1.0 - (dist / radius), 0.0, 1.0);
            atten = atten * atten * (3.0 - 2.0 * atten);

            vec3 lightDir3D = normalize(vec3(delta.x, delta.y, 0.22));
            float nDotL = max(dot(normal, lightDir3D), 0.35);

            // Blinn-Phong 2.5D Specular Glint on sprites/platforms
            vec3 halfVec = normalize(lightDir3D + vec3(0.0, 0.0, 1.0));
            float spec = pow(max(dot(normal, halfVec), 0.0), 22.0);

            dynamicLight += lCol * l.w * atten * nDotL * 0.45;
            specularAccum += lCol * l.w * atten * spec * 0.16;
            volumetricHalo += lCol * l.w * pow(atten, 2.4) * 0.055;
          }
        }

        // Combine Albedo + 2.5D Bevel + Dynamic PointLight2D + Specular + Subtle Light Halo
        vec3 litCol = baseCol * bevelBoost * dynamicLight + specularAccum * getLuma(baseCol) + volumetricHalo;

        // 4. Add Selective Emissive WorldEnvironment HDR Bloom
        vec3 bloom = sampleBloom(v_uv, u_texSize);
        vec3 hdrColor = litCol + bloom * u_bloomStrength;

        // 5. Vibrance & ACES Filmic Tonemapping
        float luma = getLuma(hdrColor);
        hdrColor = mix(vec3(luma), hdrColor, 1.12);
        vec3 finalColor = mix(hdrColor, acesTonemap(hdrColor * 1.06), 0.35);

        gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
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
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_hdFilter: gl.getUniformLocation(program, 'u_hdFilter'),
      u_normalStrength: gl.getUniformLocation(program, 'u_normalStrength'),
      u_bloomStrength: gl.getUniformLocation(program, 'u_bloomStrength'),
      u_ambientColor: gl.getUniformLocation(program, 'u_ambientColor'),
      u_lightCount: gl.getUniformLocation(program, 'u_lightCount'),
      u_lights: gl.getUniformLocation(program, 'u_lights[0]'),
      u_lightColors: gl.getUniformLocation(program, 'u_lightColors[0]')
    };
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
      this.glCanvas.style.display = (this.mode === 2) ? 'none' : 'block';
    }
    return this.modeNames[this.mode];
  }

  // ==========================================================
  // DYNAMIC POINTLIGHT2D COLLECTION
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

    const idx = this.activeLightCount;
    this.lightData[idx * 4 + 0] = screenX / 240.0;
    this.lightData[idx * 4 + 1] = screenY / 320.0;
    this.lightData[idx * 4 + 2] = radiusPx / 240.0;
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
      // Glowing fiery eyes & furnace mouth
      this.addPointLight(bx + 18, by + 28, 110, 0.95 * pulse, 1.0, 0.28, 0.08);
      // Lava pit at bottom-left of Stage 3
      this.addPointLight(35 + g.cameraX, 305, 85, 0.85 * pulse, 1.0, 0.45, 0.05);
    }

    // 3. Active Pepper Clouds (Sparkling Golden Magic Light)
    if (g.pepperClouds) {
      for (const pc of g.pepperClouds) {
        this.addPointLight(pc.x + 8, pc.y + 8, 54, 0.95, 1.0, 0.85, 0.2);
      }
    }

    // 4. Blowtorch Pickup Stations
    if (g.blowtorches) {
      for (const bt of g.blowtorches) {
        if (bt.active) {
          this.addPointLight(bt.x + 8, bt.y + 8, 50, 0.8, 0.2, 0.85, 1.0);
        }
      }
    }

    // 5. Flame Projectiles & Boss Meatballs
    if (g.flameProjectiles) {
      for (const fp of g.flameProjectiles) {
        this.addPointLight(fp.x, fp.y, 46, 0.95, 1.0, 0.5, 0.1);
      }
    }
    if (g.bossProjectiles) {
      for (const bp of g.bossProjectiles) {
        this.addPointLight(bp.x, bp.y, 48, 0.90, 1.0, 0.35, 0.05);
      }
    }
    if (g.cryoProjectiles) {
      for (const cp of g.cryoProjectiles) {
        this.addPointLight(cp.x, cp.y, 44, 0.85, 0.2, 0.9, 1.0);
      }
    }

    // 6. Bonus Items (Pulsing Treasure Glow)
    if (g.bonusItems) {
      for (const item of g.bonusItems) {
        this.addPointLight(item.x + 8, item.y + 8, 50, 0.78, 1.0, 0.75, 0.25);
      }
    }

    // 7. Ambient Stage Theme Accent Lights
    const stageNum = (g.levelData && g.levelData.stageNumber) ? g.levelData.stageNumber : (g.stageIndex + 1);
    const camX = g.cameraX || 0;
    if (stageNum === 8 || stageNum === 9) {
      this.addPointLight(camX + 60, 300, 110, 0.65, 1.0, 0.35, 0.05);
      this.addPointLight(camX + 180, 300, 110, 0.65, 1.0, 0.35, 0.05);
    } else if (stageNum === 11) {
      this.addPointLight(camX + 120, 80, 130, 0.50, 0.4, 0.9, 1.0);
    } else if (stageNum === 14) {
      this.addPointLight(camX + 60, 100, 110, 0.60, 0.85, 0.2, 1.0);
      this.addPointLight(camX + 180, 220, 110, 0.60, 0.1, 0.9, 1.0);
    }
  }

  // ==========================================================
  // 2.5D DEPTH, VOLUMETRIC LIGHTING & SOFT SHADOWS (WORLD PASS)
  // ==========================================================
  drawBackdropAtmosphere(ctx) {
    const g = this.game;
    if (!g || this.mode === 2) return;

    const w = g.canvas.width;
    const h = g.canvas.height;
    const stageNum = (g.levelData && g.levelData.stageNumber) ? g.levelData.stageNumber : (g.stageIndex + 1);
    const camX = g.cameraX || 0;

    ctx.save();

    // Soft radial ambient lighting (no hard geometric edges)
    const ambGrad = ctx.createRadialGradient(camX + 120, 120, 15, camX + 120, 150, 175);
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
    ctx.fillStyle = ambGrad;
    ctx.fillRect(camX, 34, w, h - 34);

    // Bottom Floor Ambient Glow / Heat Haze on Fire & Boss Stages
    if (stageNum === 3 || stageNum === 8 || stageNum === 9) {
      const lavaGlow = ctx.createLinearGradient(0, h - 42, 0, h);
      lavaGlow.addColorStop(0, 'rgba(239, 68, 68, 0)');
      lavaGlow.addColorStop(1, 'rgba(249, 115, 22, 0.20)');
      ctx.fillStyle = lavaGlow;
      ctx.fillRect(camX, h - 42, w, 42);
    }

    ctx.restore();
  }

  // Draw 2.5D Soft Drop Shadows under Platforms & Ladders
  drawWorldShadows25D(ctx) {
    const g = this.game;
    if (!g || !g.levelData || this.mode === 2) return;

    ctx.save();

    // 1. Ladder wall drop shadows (offset +2px right, +2px down)
    if (g.levelData.ladders) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      for (const l of g.levelData.ladders) {
        const y1 = l.y1 + 4;
        const y2 = l.y2 + 14;
        ctx.fillRect(l.x + 3, y1 + 2, 2, y2 - y1);
        ctx.fillRect(l.x + 14, y1 + 2, 2, y2 - y1);
      }
    }

    // 2. Platform 2.5D Underglow & Projected Wall Shadow
    if (g.levelData.floors) {
      for (const f of g.levelData.floors) {
        if (f.type === 'diagonal') continue;
        const x = f.x1;
        const w = f.x2 - f.x1;
        const y = (f.currentY !== undefined ? f.currentY : f.y) + 14;

        const shadGrad = ctx.createLinearGradient(0, y + 7, 0, y + 14);
        shadGrad.addColorStop(0, 'rgba(0, 0, 0, 0.62)');
        shadGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
        shadGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
        ctx.fillStyle = shadGrad;
        ctx.fillRect(x + 1, y + 7, w, 7);
      }
    }

    ctx.restore();
  }

  // Draw 2.5D Specular Rim & Bevel on Platforms
  drawPlatformSpecular25D(ctx) {
    const g = this.game;
    if (!g || !g.levelData || !g.levelData.floors || this.mode === 2) return;

    ctx.save();
    for (const f of g.levelData.floors) {
      if (f.type === 'diagonal') continue;
      const x = f.x1;
      const w = f.x2 - f.x1;
      const y = (f.currentY !== undefined ? f.currentY : f.y) + 14;

      // Top 2.5D bevel specular highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
      ctx.fillRect(x, y, w, 1);

      // Bottom ambient occlusion crease
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.fillRect(x, y + 7, w, 1);
    }
    ctx.restore();
  }

  // Draw 2.5D Shadows & Gloss on Burgers + Spawn Hot Patty Steam
  drawBurgers25DEffects(ctx) {
    const g = this.game;
    if (!g || !g.burgers || this.mode === 2) return;

    ctx.save();
    for (const b of g.burgers) {
      const bx = b.x;
      const by = b.y + 6;

      // Soft shadow beneath each burger segment onto the platform surface
      ctx.fillStyle = b.falling ? 'rgba(0, 0, 0, 0.28)' : 'rgba(0, 0, 0, 0.48)';
      for (let i = 0; i < 4; i++) {
        const dropOffset = b.falling ? 0 : b.segments[i].dropY;
        ctx.fillRect(bx + i * 8 + 1, by + 7 + dropOffset, 7, 2);
      }

      // Top glossy rim highlight on bun_top, cheese, tomato
      if (b.type === 'bun_top' || b.type === 'cheese' || b.type === 'tomato') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.20)';
        for (let i = 0; i < 4; i++) {
          const dropOffset = b.falling ? 0 : b.segments[i].dropY;
          ctx.fillRect(bx + i * 8 + 2, by + 1 + dropOffset, 4, 1);
        }
      }

      // Emit subtle rising culinary steam from hot meat patties!
      if (b.type === 'patty' && Math.random() < 0.035) {
        this.spawnSteamWisp(bx + 6 + Math.random() * 20, by + 2);
      }
    }
    ctx.restore();
  }

  // Draw Contact Ground Shadows under Chef Pepe, Enemies & Bonus Items
  drawEntityShadows25D(ctx) {
    const g = this.game;
    if (!g || !g.levelData || this.mode === 2) return;

    ctx.save();

    const drawShadowEllipse = (cx, footY, baseRadiusX, alpha) => {
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha.toFixed(2)})`;
      ctx.beginPath();
      ctx.ellipse(cx, footY, baseRadiusX, 2.0, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    if (g.player && !g.player.isDead) {
      const px = g.player.x + 8;
      const py = g.player.y + 15;
      const shadowScale = g.player.isJumping ? 0.65 : 1.0;
      const shadowAlpha = g.player.isJumping ? 0.25 : 0.50;
      drawShadowEllipse(px, py, 6.2 * shadowScale, shadowAlpha);
    }

    if (g.enemies) {
      for (const e of g.enemies) {
        if (e.state === 'spawning' || e.isClimbing) continue;
        drawShadowEllipse(e.x + 8, e.y + 15, 5.8, 0.42);
      }
    }

    if (g.bonusItems) {
      const pulse = 0.5 + Math.sin(performance.now() * 0.008) * 0.3;
      for (const item of g.bonusItems) {
        drawShadowEllipse(item.x + 8, item.y + 15, 5.5, 0.45);
        ctx.strokeStyle = `rgba(252, 180, 0, ${(0.35 * pulse).toFixed(2)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(item.x + 8, item.y + 8, 9 + pulse * 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // ==========================================================
  // GPUPARTICLES2D SYSTEM (STEAM, EMBERS, SPARKLES, SHOCKWAVES)
  // ==========================================================
  initAmbientParticles() {
    this.particles = [];
    this.shockwaves = [];
  }

  spawnSteamWisp(x, y) {
    if (this.particles.length > 120) return;
    this.particles.push({
      kind: 'steam',
      x,
      y,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -0.32 - Math.random() * 0.22,
      size: 1.4 + Math.random() * 1.1,
      alpha: 0.22,
      life: 32 + Math.random() * 16,
      maxLife: 48,
      phase: Math.random() * Math.PI * 2
    });
  }

  spawnShockwave(x, y, color = '#38bdf8', maxRadius = 26) {
    this.shockwaves.push({
      x,
      y,
      radius: 3,
      maxRadius,
      color,
      alpha: 0.85
    });
  }

  spawnGlowingBurst(x, y, color = '#fef08a', count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 0.8 + Math.random() * 2.2;
      this.particles.push({
        kind: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4,
        size: 1.5 + Math.random() * 1.4,
        color,
        alpha: 1.0,
        life: 18 + Math.random() * 14,
        maxLife: 32
      });
    }
  }

  updateAndDrawParticles(ctx) {
    const g = this.game;
    if (!g || this.mode === 2) return;

    this.ambientTimer++;
    const stageNum = (g.levelData && g.levelData.stageNumber) ? g.levelData.stageNumber : (g.stageIndex + 1);
    const camX = g.cameraX || 0;

    // 1. Spawn ambient stage particles (Embers, Snowflakes, Neon Motes, Golden Dust)
    if (this.ambientTimer % 6 === 0 && this.particles.length < 110) {
      const spawnX = camX + Math.random() * 240;
      if (stageNum === 3 || stageNum === 8 || stageNum === 9) {
        this.particles.push({
          kind: 'ember',
          x: spawnX,
          y: 318,
          vx: (Math.random() - 0.5) * 0.45,
          vy: -0.6 - Math.random() * 0.7,
          size: 1.2 + Math.random() * 1.5,
          color: Math.random() < 0.5 ? '#f97316' : '#fef08a',
          alpha: 0.85,
          life: 70 + Math.random() * 40,
          maxLife: 110,
          phase: Math.random() * Math.PI * 2
        });
      } else if (stageNum === 11) {
        this.particles.push({
          kind: 'snow',
          x: spawnX,
          y: 34,
          vx: (Math.random() - 0.5) * 0.35,
          vy: 0.45 + Math.random() * 0.4,
          size: 1.3 + Math.random() * 1.2,
          color: '#e0f2fe',
          alpha: 0.75,
          life: 90 + Math.random() * 40,
          maxLife: 130,
          phase: Math.random() * Math.PI * 2
        });
      } else if (this.ambientTimer % 18 === 0) {
        this.particles.push({
          kind: 'mote',
          x: spawnX,
          y: 50 + Math.random() * 240,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -0.15 - Math.random() * 0.2,
          size: 1.0 + Math.random() * 0.9,
          color: stageNum === 14 ? '#38bdf8' : '#fef08a',
          alpha: 0.40,
          life: 60 + Math.random() * 30,
          maxLife: 90,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    // 2. Spawn soft footstep dust when Chef Pepe runs
    if (g.player && !g.player.isDead && !g.player.isJumping && !g.player.isClimbing && g.player.vx !== 0) {
      if (this.ambientTimer % 5 === 0) {
        this.particles.push({
          kind: 'dust',
          x: g.player.x + 8 - Math.sign(g.player.vx) * 4,
          y: g.player.y + 15,
          vx: -Math.sign(g.player.vx) * (0.2 + Math.random() * 0.3),
          vy: -0.15 - Math.random() * 0.2,
          size: 1.5 + Math.random() * 1.0,
          color: '#e2e8f0',
          alpha: 0.38,
          life: 14,
          maxLife: 14
        });
      }
    }

    // 3. Render & update Shockwave rings
    ctx.save();
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * 0.22 + 0.8;
      sw.alpha *= 0.86;

      if (sw.alpha <= 0.04 || sw.radius >= sw.maxRadius) {
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

    // 4. Render & update GPU-style Particles with additive glow
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      const lifeRatio = p.life / p.maxLife;
      if (p.phase !== undefined) {
        p.x += p.vx + Math.sin(this.ambientTimer * 0.06 + p.phase) * 0.18;
      } else {
        p.x += p.vx;
      }
      p.y += p.vy;

      if (p.kind === 'steam') {
        p.size += 0.025;
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = p.alpha * lifeRatio;
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === 'dust') {
        p.size += 0.035;
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = p.alpha * lifeRatio;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = p.alpha * lifeRatio;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
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

    gl.viewport(0, 0, this.glCanvas.width, this.glCanvas.height);
    gl.useProgram(this.program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.baseCanvas);

    gl.uniform1i(this.uniforms.u_texture, 0);
    gl.uniform2f(this.uniforms.u_texSize, this.baseCanvas.width, this.baseCanvas.height);
    gl.uniform1f(this.uniforms.u_time, (performance.now() - this.startTime) * 0.001);

    gl.uniform1f(this.uniforms.u_hdFilter, this.mode === 0 ? 1.0 : 0.0);
    gl.uniform1f(this.uniforms.u_normalStrength, 1.25);
    gl.uniform1f(this.uniforms.u_bloomStrength, 0.85);

    const isPlaying = this.game && (this.game.state === 'PLAYING' || this.game.state === 'READY');
    if (isPlaying) {
      gl.uniform3f(this.uniforms.u_ambientColor, 0.95, 0.95, 0.99);
    } else {
      gl.uniform3f(this.uniforms.u_ambientColor, 0.98, 0.98, 1.0);
    }

    gl.uniform1i(this.uniforms.u_lightCount, this.activeLightCount);
    gl.uniform4fv(this.uniforms.u_lights, this.lightData);
    gl.uniform3fv(this.uniforms.u_lightColors, this.lightColors);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

window.Godot2DGraphicsEngine = Godot2DGraphicsEngine;
