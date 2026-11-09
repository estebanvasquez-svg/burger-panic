/**
 * Sector 1: Bahía de Carga (Cargo Bay) - Metroidvania Sci-Fi Environment Renderer
 * Faithfully matches the reference artwork:
 * - Deep space reinforced observation window with starry cosmos, nebula & planet rim
 * - Animated rotating industrial ventilation fans
 * - Overhead red emergency beacon lights casting ambient lighting
 * - Rusted steel bulkheads, rivets, and dripping coolant pipes with sparks
 * - Left airlock blast door with glowing vertical orange/red plasma barrier
 * - Right airlock security door with pulsating cyan forcefield
 * - Industrial cargo crates with high-tech markings
 * - Heavy structural steel catwalks and open-step diagonal staircase
 */

class SciFiCargoBayRenderer {
  constructor() {
    this.fanAngle = 0;
    this.sparkTimer = 0;
    this.sparks = [];
    this.stars = this.generateStars(65);
    this.coolantDripY = 162;
    this.forcefieldPulse = 0;
  }

  generateStars(count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      // Confined to window region: x in [250, 400], y in [34, 158]
      stars.push({
        x: 252 + Math.random() * 148,
        y: 36 + Math.random() * 122,
        size: Math.random() < 0.2 ? 2 : (Math.random() < 0.6 ? 1.5 : 1),
        speed: 0.02 + Math.random() * 0.04,
        color: Math.random() < 0.25 ? '#38bdf8' : (Math.random() < 0.4 ? '#c084fc' : '#ffffff'),
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
    return stars;
  }

  update() {
    // 60 FPS fan rotation
    this.fanAngle += 0.075;
    if (this.fanAngle > Math.PI * 2) this.fanAngle -= Math.PI * 2;

    this.forcefieldPulse += 0.05;
    if (this.forcefieldPulse > Math.PI * 2) this.forcefieldPulse -= Math.PI * 2;

    // Dripping coolant
    this.coolantDripY += 0.8;
    if (this.coolantDripY > 176) this.coolantDripY = 158;

    // Ambient industrial welding sparks popping near stairs or floor
    this.sparkTimer++;
    if (this.sparkTimer % 18 === 0 && Math.random() < 0.8) {
      const origins = [
        { x: 92, y: 104 },   // Stair junction
        { x: 176, y: 176 },  // Catwalk joint
        { x: 382, y: 254 },  // Lower right floor
        { x: 44, y: 168 }    // Coolant pipe
      ];
      const spot = origins[Math.floor(Math.random() * origins.length)];
      for (let i = 0; i < 4; i++) {
        this.sparks.push({
          x: spot.x,
          y: spot.y,
          vx: (Math.random() - 0.5) * 2.2,
          vy: -Math.random() * 2.2 - 0.5,
          life: 14 + Math.random() * 10,
          color: Math.random() < 0.4 ? '#ffffff' : '#f59e0b'
        });
      }
    }

    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const spk = this.sparks[i];
      spk.x += spk.vx;
      spk.y += spk.vy;
      spk.vy += 0.15; // Gravity
      spk.life--;
      if (spk.life <= 0) this.sparks.splice(i, 1);
    }
  }

  draw(ctx, game) {
    this.update();
    const w = game.canvas.width;
    const h = game.canvas.height;

    ctx.save();

    // 1. Base Wall: Dark Industrial Steel with Riveted Seams
    ctx.fillStyle = '#111520';
    ctx.fillRect(0, 0, w, h);

    // Subtle wall panel seams & rust staining
    ctx.strokeStyle = '#1e2433';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 30; y < h; y += 42) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Rivets along panel joints
    ctx.fillStyle = '#2d3748';
    for (let x = 0; x < w; x += 40) {
      for (let y = 30; y < h; y += 42) {
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }

    // 2. THE GRAND OBSERVATION BAY WINDOW (x: 250..402, y: 34..158)
    this.drawDeepSpaceWindow(ctx);

    // 3. ROTATING INDUSTRIAL VENTILATION FANS
    this.drawVentilationFan(ctx, 228, 66, 18);
    this.drawVentilationFan(ctx, 328, 208, 18);

    // 4. CEILING I-BEAM, CONDUITS & RED EMERGENCY TUBE LIGHTS
    this.drawCeilingFixtures(ctx);

    // 5. COOLANT PIPES & LIQUID DRIP ON LEFT WALL
    this.drawCoolantPipes(ctx);

    // 6. AIRLOCK BLAST DOORS
    // Left Airlock (Red/Orange barrier)
    this.drawLeftAirlock(ctx);
    // Right Airlock (Cyan Forcefield shield)
    this.drawRightAirlock(ctx, game);

    // 7. CARGO CRATES ON LOWER FLOOR
    this.drawCargoCrates(ctx);

    // 8. STRUCTURAL PILLARS & CATWALK SUPPORTS
    this.drawCatwalkStructuralColumns(ctx);

    // 9. AMBIENT PARTICLES / WELDING SPARKS
    for (const spk of this.sparks) {
      ctx.fillStyle = spk.color;
      ctx.fillRect(Math.round(spk.x), Math.round(spk.y), 1.5, 1.5);
    }

    ctx.restore();
  }

  drawDeepSpaceWindow(ctx) {
    const wx = 252;
    const wy = 34;
    const ww = 150;
    const wh = 124;

    ctx.save();
    // Clip inside window geometry
    ctx.beginPath();
    ctx.moveTo(wx + 10, wy);
    ctx.lineTo(wx + ww - 10, wy);
    ctx.lineTo(wx + ww, wy + 14);
    ctx.lineTo(wx + ww, wy + wh);
    ctx.lineTo(wx, wy + wh);
    ctx.lineTo(wx, wy + 14);
    ctx.closePath();
    ctx.clip();

    // Deep Space Cosmic Background
    const spaceGrad = ctx.createLinearGradient(wx, wy, wx + ww, wy + wh);
    spaceGrad.addColorStop(0, '#040612');
    spaceGrad.addColorStop(0.5, '#0b0f24');
    spaceGrad.addColorStop(1, '#060918');
    ctx.fillStyle = spaceGrad;
    ctx.fillRect(wx, wy, ww, wh);

    // Nebula dust clouds
    const nebGrad = ctx.createRadialGradient(wx + 40, wy + 50, 10, wx + 40, wy + 50, 60);
    nebGrad.addColorStop(0, 'rgba(139, 92, 246, 0.22)');
    nebGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.12)');
    nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebGrad;
    ctx.fillRect(wx, wy, ww, wh);

    // Distant Celestial Planet Crescent Rim in Upper Right
    ctx.save();
    ctx.beginPath();
    ctx.arc(wx + ww + 15, wy - 5, 52, 0, Math.PI * 2);
    ctx.fillStyle = '#081226';
    ctx.fill();
    // Glowing atmospheric limb
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#e0f2fe';
    ctx.stroke();
    ctx.restore();

    // Twinkling Stars
    const time = Date.now() * 0.003;
    for (const st of this.stars) {
      const alpha = 0.45 + Math.sin(time + st.twinklePhase) * 0.45;
      ctx.globalAlpha = Math.max(0.1, Math.min(1.0, alpha));
      ctx.fillStyle = st.color;
      ctx.fillRect(st.x, st.y, st.size, st.size);
      // Bright star cross glint
      if (st.size >= 2) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(st.x - 1, st.y, 3, 1);
        ctx.fillRect(st.x, st.y - 1, 1, 3);
      }
    }
    ctx.globalAlpha = 1.0;
    ctx.restore();

    // Heavy reinforced window frame & angled mullion struts
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.strokeRect(wx, wy, ww, wh);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(wx + 2, wy + 2, ww - 4, wh - 4);

    // Diagonal reinforced steel mullion beams across the glass
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.lineTo(wx + 45, wy + wh);
    ctx.moveTo(wx + ww, wy);
    ctx.lineTo(wx + ww - 45, wy + wh);
    ctx.stroke();

    // Frame bolts
    ctx.fillStyle = '#64748b';
    for (let bx = wx + 12; bx < wx + ww; bx += 24) {
      ctx.fillRect(bx, wy + 1, 2, 2);
      ctx.fillRect(bx, wy + wh - 3, 2, 2);
    }
  }

  drawVentilationFan(ctx, cx, cy, r) {
    ctx.save();
    // Outer circular steel duct
    ctx.beginPath();
    ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fan interior recess
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#05070e';
    ctx.fill();

    // 4 Rotating steel blades
    ctx.translate(cx, cy);
    ctx.rotate(this.fanAngle);
    ctx.fillStyle = '#475569';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r - 2, -4);
      ctx.lineTo(r - 1, 4);
      ctx.closePath();
      ctx.fill();
      ctx.rotate(Math.PI / 2);
    }

    // Central hub
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();

    // Protective outer wire grill
    ctx.save();
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.stroke();
    ctx.restore();
  }

  drawCeilingFixtures(ctx) {
    // Upper horizontal steel I-Beam spanning entire width
    ctx.fillStyle = '#1e2433';
    ctx.fillRect(0, 24, 480, 8);
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 24, 480, 2);
    ctx.fillRect(0, 31, 480, 1);

    // Hanging high-voltage conduit cables
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, 26);
    ctx.quadraticCurveTo(80, 42, 135, 28);
    ctx.moveTo(175, 28);
    ctx.quadraticCurveTo(240, 40, 340, 28);
    ctx.stroke();

    // Emergency Red Tube Lights
    const tubes = [
      { x: 135, y: 28, w: 40 },
      { x: 340, y: 28, w: 40 }
    ];

    for (const tb of tubes) {
      // Atmospheric ambient downward cone glow
      const coneGrad = ctx.createRadialGradient(tb.x + tb.w / 2, tb.y, 4, tb.x + tb.w / 2, tb.y + 40, 60);
      coneGrad.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
      coneGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.12)');
      coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coneGrad;
      ctx.fillRect(tb.x - 30, tb.y, tb.w + 60, 90);

      // Light fixture metal bracket
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(tb.x - 2, tb.y - 2, tb.w + 4, 3);

      // Incandescent Red Tube Lamp
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(tb.x, tb.y, tb.w, 3);
      // Bright inner core
      ctx.fillStyle = '#fca5a5';
      ctx.fillRect(tb.x + 2, tb.y + 1, tb.w - 4, 1);
    }
  }

  drawCoolantPipes(ctx) {
    // Heavy industrial bent pipes on left wall
    ctx.save();
    ctx.fillStyle = '#262f40';
    // Vertical pipe descending
    ctx.fillRect(16, 120, 8, 48);
    // Horizontal bend
    ctx.fillRect(16, 160, 32, 8);
    // Pipe collar couplings
    ctx.fillStyle = '#475569';
    ctx.fillRect(14, 134, 12, 3);
    ctx.fillRect(36, 158, 3, 12);

    // Hazard liquid drip nozzle
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(44, 168, 4, 3);
    // Dripping drop
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(45, Math.round(this.coolantDripY), 2, 4);

    ctx.restore();
  }

  drawLeftAirlock(ctx) {
    // Left Airlock Blast Door at x: 0..18, y: 196..254
    const ax = 0;
    const ay = 196;
    const aw = 18;
    const ah = 58;

    // Outer frame
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(ax, ay, aw, ah);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(ax, ay, aw, ah);

    // Warning hazard chevron stripes on door frame
    for (let sy = ay + 4; sy < ay + ah; sy += 10) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(ax + 2, sy, 3, 4);
    }

    // Active Glowing Vertical Plasma Energy Barrier
    const pulse = Math.sin(Date.now() * 0.008) * 0.2 + 0.8;
    const barrierGrad = ctx.createLinearGradient(ax + aw - 4, ay, ax + aw + 8, ay);
    barrierGrad.addColorStop(0, `rgba(239, 68, 68, ${0.8 * pulse})`);
    barrierGrad.addColorStop(0.5, `rgba(249, 115, 22, ${0.95 * pulse})`);
    barrierGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

    ctx.fillStyle = barrierGrad;
    ctx.fillRect(ax + aw - 4, ay + 2, 12, ah - 4);

    // Superheated core beam
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ax + aw - 1, ay + 4, 1.5, ah - 8);
  }

  drawRightAirlock(ctx, game) {
    // Right Airlock Security Forcefield at x: 452..480, y: 118..176
    const ax = 452;
    const ay = 118;
    const aw = 28;
    const ah = 58;

    // Airlock Door Frame
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(ax, ay, aw, ah);
    ctx.fillStyle = '#334155';
    ctx.fillRect(ax + 2, ay, 2, ah);

    // Door lock status panel
    const allEnemiesCleared = game.enemies && game.enemies.length > 0 && game.enemies.every(e => e.isDead || e.hp <= 0);
    ctx.fillStyle = allEnemiesCleared ? '#22c55e' : '#ef4444';
    ctx.fillRect(ax + 6, ay + 14, 5, 8);

    // Forcefield Energy Shield
    if (!allEnemiesCleared) {
      // Pulsating Electric Cyan Forcefield Barrier
      const pulse = Math.sin(this.forcefieldPulse) * 0.25 + 0.75;
      const ffGrad = ctx.createLinearGradient(ax - 10, ay, ax + 4, ay);
      ffGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
      ffGrad.addColorStop(0.6, `rgba(0, 229, 255, ${0.75 * pulse})`);
      ffGrad.addColorStop(1, `rgba(255, 255, 255, ${0.9 * pulse})`);

      ctx.fillStyle = ffGrad;
      ctx.fillRect(ax - 8, ay + 2, 12, ah - 4);

      // Electric sine ripple wave lines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const waveT = Date.now() * 0.012;
      for (let y = ay + 4; y < ay + ah - 4; y += 4) {
        const xOffset = Math.sin(y * 0.35 + waveT) * 2.5;
        if (y === ay + 4) ctx.moveTo(ax - 1 + xOffset, y);
        else ctx.lineTo(ax - 1 + xOffset, y);
      }
      ctx.stroke();
    } else {
      // Sector Cleared: Forcefield opens with green unlocked gateway!
      ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
      ctx.fillRect(ax - 4, ay + 2, 8, ah - 4);
      ctx.fillStyle = '#86efac';
      ctx.fillRect(ax - 1, ay + 4, 2, ah - 8);
    }
  }

  drawCargoCrates(ctx) {
    // Crate Stack A (left-center ground): x: 210, y: 220, w: 34, h: 34
    this.drawIndustrialCrate(ctx, 210, 220, 34, 34, '#475569', '#334155', 'A-01');

    // Crate Stack B (right ground): x: 352, y: 232, w: 40, h: 22
    this.drawIndustrialCrate(ctx, 352, 232, 40, 22, '#3b4252', '#2e3440', 'CY-4');

    // Crate Stack C (right high crate): x: 394, y: 210, w: 40, h: 44
    this.drawIndustrialCrate(ctx, 394, 210, 40, 44, '#4c566a', '#3b4252', 'BIO-9', true);
  }

  drawIndustrialCrate(ctx, x, y, w, h, topCol, bodyCol, label, hasCyanLed = false) {
    ctx.save();
    // Crate body
    ctx.fillStyle = bodyCol;
    ctx.fillRect(x, y, w, h);

    // Beveled frame
    ctx.strokeStyle = topCol;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);

    // Inner cross brace
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 2);
    ctx.lineTo(x + w - 2, y + h - 2);
    ctx.moveTo(x + w - 2, y + 2);
    ctx.lineTo(x + 2, y + h - 2);
    ctx.stroke();

    // Corner reinforcement plates
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x, y, 4, 4);
    ctx.fillRect(x + w - 4, y, 4, 4);
    ctx.fillRect(x, y + h - 4, 4, 4);
    ctx.fillRect(x + w - 4, y + h - 4, 4, 4);

    // Stencil Label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '5px monospace';
    ctx.fillText(label, x + 5, y + Math.round(h / 2) + 2);

    // High-tech Cyan LED Indicator
    if (hasCyanLed) {
      const ledPulse = Math.sin(Date.now() * 0.006) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(56, 189, 248, ${ledPulse})`;
      ctx.fillRect(x + w - 7, y + 6, 3, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + w - 6, y + 7, 1, 1);
    }

    ctx.restore();
  }

  drawCatwalkStructuralColumns(ctx) {
    // Vertical steel structural support pillars under center catwalk
    // Column at x = 176 and x = 286 from y = 184 down to floor y = 254
    const cols = [176, 286];
    for (const cx of cols) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cx - 3, 184, 6, 70);
      ctx.fillStyle = '#334155';
      ctx.fillRect(cx - 1, 184, 2, 70);

      // Lattice cross lacing
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      for (let ly = 190; ly < 250; ly += 12) {
        ctx.beginPath();
        ctx.moveTo(cx - 3, ly);
        ctx.lineTo(cx + 3, ly + 6);
        ctx.lineTo(cx - 3, ly + 12);
        ctx.stroke();
      }
    }
  }

  // Draw open industrial steel grating catwalk platform matching reference
  drawGratingPlatform(ctx, f) {
    const w = f.x2 - f.x1;
    const x = f.x1;
    const y = f.y + 14;

    ctx.save();

    // 1. Under-truss steel I-Beam with diamond cutouts
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y + 3, w, 8);

    // Lower flange
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y + 10, w, 2);

    // Triangular truss lacing in underbody
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    for (let tx = x; tx < f.x2 - 8; tx += 12) {
      ctx.beginPath();
      ctx.moveTo(tx, y + 3);
      ctx.lineTo(tx + 6, y + 10);
      ctx.lineTo(tx + 12, y + 3);
      ctx.stroke();
    }

    // 2. Walkable Steel Grating Tread Surface
    ctx.fillStyle = '#475569';
    ctx.fillRect(x, y, w, 3);
    // Non-slip top highlight
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x, y, w, 1);

    // Mesh grating perforations every 4px
    ctx.fillStyle = '#0f172a';
    for (let gx = x + 2; gx < f.x2; gx += 4) {
      ctx.fillRect(gx, y + 1, 2, 2);
    }

    // Safety edge plates with rivets
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x, y - 1, 3, 12);
    ctx.fillRect(f.x2 - 3, y - 1, 3, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 1, y + 2, 1, 1);
    ctx.fillRect(f.x2 - 2, y + 2, 1, 1);

    ctx.restore();
  }

  // Draw open metal diagonal staircase matching reference
  drawDiagonalStaircase(ctx, f) {
    const x1 = f.x1;
    const y1 = f.y1 + 14;
    const x2 = f.x2;
    const y2 = f.y2 + 14;
    const steps = 10;
    const dx = (x2 - x1) / steps;
    const dy = (y2 - y1) / steps;

    ctx.save();

    // 1. Structural angled steel under-girder stringer
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1, y1 + 6);
    ctx.lineTo(x2, y2 + 6);
    ctx.stroke();

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1 + 5);
    ctx.lineTo(x2, y2 + 5);
    ctx.stroke();

    // 2. Individual open-riser metal stair treads
    for (let i = 0; i < steps; i++) {
      const sx = Math.round(x1 + i * dx);
      const sy = Math.round(y1 + i * dy);
      const sw = Math.round(dx + 2);

      // Metal step tread
      ctx.fillStyle = '#475569';
      ctx.fillRect(sx, sy, sw, 3);
      // Top edge gleam
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(sx, sy, sw, 1);
      // Grating notches
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(sx + 2, sy + 1, 2, 1);
      if (sw > 6) ctx.fillRect(sx + 5, sy + 1, 2, 1);

      // Vertical step riser bracket
      ctx.fillStyle = '#334155';
      ctx.fillRect(sx, sy + 3, 2, 4);
    }

    // 3. Handrail along the staircase
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1 - 10);
    ctx.lineTo(x2, y2 - 10);
    ctx.stroke();

    // Handrail stanchion posts
    for (let i = 0; i <= steps; i += 3) {
      const px = Math.round(x1 + i * dx);
      const py = Math.round(y1 + i * dy);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px, py - 10, 2, 11);
    }

    ctx.restore();
  }
}

window.SciFiCargoBay = new SciFiCargoBayRenderer();
