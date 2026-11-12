/**
 * Kiloburner - Giant Cyborg Boss & Exclusive Level 3 Weapon System
 * Burger Panic Mobile Arcade - Cyber-Furnace Arena Art Edition
 */

/**
 * Bio-Chemical Spray Projectile (Exclusive Level 3 Player Weapon)
 * Rapid phosphorescent green chemical blast fired by Chef Pepe using Button B,
 * matching the user's reference artwork.
 */
class CryoProjectile {
  constructor(x, y, dir = 1) {
    this.x = x;
    this.y = y;
    this.dir = dir; // 1 = right, -1 = left
    this.speed = 5.4; // High-speed chemical stream
    this.vx = this.dir * this.speed;
    this.vy = (Math.random() - 0.5) * 0.7; // conical spread
    this.radius = 5.5;
    this.life = 45; // frames
    this.maxLife = 45;
    this.particles = [];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    // Spawn expanding conical spray particles with neon acid glow
    if (Math.random() < 0.85) {
      this.particles.push({
        x: this.x + (Math.random() - 0.5) * 6,
        y: this.y + (Math.random() - 0.5) * 6,
        vx: -this.vx * 0.15 + (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        life: 14 + Math.random() * 8,
        maxLife: 22,
        size: 2 + Math.random() * 2.5,
        color: Math.random() < 0.5 ? '#4ade80' : (Math.random() < 0.8 ? '#22c55e' : '#a3e635')
      });
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    // Draw bio-spray mist and droplet trail
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha * 0.85;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.round(p.size), Math.round(p.size));
      ctx.restore();
    }

    // Draw main conical neon-green chemical jet
    ctx.save();
    const pulse = Math.sin(Date.now() * 0.03) * 1.5;
    const r = Math.max(2, this.radius + pulse * 0.5);

    // Glowing phosphorescent green outer aura
    const grad = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, r + 5);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, '#a3e635');
    grad.addColorStop(0.7, '#22c55e');
    grad.addColorStop(1, 'rgba(34, 197, 94, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r + 5, 0, Math.PI * 2);
    ctx.fill();

    // Solid bright core (white/lime)
    ctx.fillStyle = '#f0fdf4';
    ctx.beginPath();
    ctx.arc(this.x, this.y, r * 0.65, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

/**
 * Flame Projectile fired by Chef Pepe's Blowtorch in Level 3
 * Incandescent jet of flame and sparks directed at Boss Kiloburner
 */
class FlameProjectile {
  constructor(x, y, dir = 1) {
    this.x = x;
    this.y = y;
    this.dir = dir; // 1 = right, -1 = left
    this.speed = 5.8;
    this.vx = this.dir * this.speed;
    this.vy = (Math.random() - 0.5) * 0.9; // Conical flame spread
    this.radius = 5.5;
    this.life = 42; // frames
    this.maxLife = 42;
    this.damage = 8;
    this.particles = [];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    // Spawn expanding fiery embers and smoke particles
    if (Math.random() < 0.9) {
      const colors = ['#fef08a', '#f59e0b', '#f97316', '#ef4444', '#78350f'];
      this.particles.push({
        x: this.x + (Math.random() - 0.5) * 6,
        y: this.y + (Math.random() - 0.5) * 6,
        vx: -this.vx * 0.12 + (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.2, // heat rises slightly
        life: 14 + Math.random() * 8,
        maxLife: 22,
        size: 2.2 + Math.random() * 2.8,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    // Draw outer embers and smoke trail
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha * 0.85;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.round(p.size), Math.round(p.size));
      ctx.restore();
    }

    // Draw main incandescent plasma flame core
    ctx.save();
    const pulse = Math.sin(Date.now() * 0.04) * 1.5;
    const r = Math.max(2, this.radius + pulse * 0.6);

    const grad = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, r + 5);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#fef08a');
    grad.addColorStop(0.65, '#f97316');
    grad.addColorStop(1, 'rgba(239, 68, 68, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r + 5, 0, Math.PI * 2);
    ctx.fill();

    // Hot molten core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, r * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

/**
 * Blowtorch Pickup Station (Soplete)
 * Placed on platforms in Level 3. Chef collects it to get a full fuel tank of flames.
 */
class BlowtorchPickup {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y; // platform floor level
    this.w = 16;
    this.h = 18;
    this.collected = false;
    this.animTimer = Math.random() * 60;
  }

  update() {
    this.animTimer += 0.08;
  }

  draw(ctx) {
    if (this.collected) {
      // Empty spent station bracket with cool industrial aesthetic
      ctx.save();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(Math.round(this.x - 8), Math.round(this.y - 3), 16, 3);
      ctx.fillStyle = '#475569';
      ctx.fillRect(Math.round(this.x - 6), Math.round(this.y - 2), 12, 1);
      ctx.fillStyle = '#64748b';
      ctx.font = '5px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('VACÍO', Math.round(this.x), Math.round(this.y - 5));
      ctx.restore();
      return;
    }

    const bob = Math.sin(this.animTimer) * 2;
    const drawY = this.y - 20 + bob;
    const cx = Math.round(this.x);

    ctx.save();

    // 1. Sleek overhead badge (crisp 1px drop shadow, pulsing gold color)
    const tx = cx;
    const ty = Math.round(drawY - 7);
    const pulse = Math.sin(this.animTimer * 2) * 0.5 + 0.5;
    ctx.font = 'bold 6px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.fillText('⚡ SOPLETE ⚡', tx + 1, ty + 1);
    ctx.fillStyle = (pulse > 0.4) ? '#fef08a' : '#f59e0b';
    ctx.fillText('⚡ SOPLETE ⚡', tx, ty);

    // 2. High-Tech Holographic Base Glow
    ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
    ctx.beginPath();
    ctx.ellipse(cx, Math.round(this.y - 2), 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Professional Blowtorch Tool Sprite (Industrial Pixel Art):
    // Rubberized base foot
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 6, Math.round(drawY + 16), 12, 3);
    ctx.fillStyle = '#334155';
    ctx.fillRect(cx - 5, Math.round(drawY + 16), 10, 1);

    // Blue pressurized tank with metallic cylindrical shading
    ctx.fillStyle = '#0369a1'; // Base deep cyan
    ctx.fillRect(cx - 5, Math.round(drawY + 6), 10, 10);
    // Cylinder highlight reflection
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(cx - 4, Math.round(drawY + 6), 2, 10);
    // Cylinder shadow
    ctx.fillStyle = '#075985';
    ctx.fillRect(cx + 3, Math.round(drawY + 6), 2, 10);
    // Industrial caution hazard stripe band
    ctx.fillStyle = '#eab308';
    ctx.fillRect(cx - 5, Math.round(drawY + 10), 10, 2);
    ctx.fillStyle = '#000000';
    ctx.fillRect(cx - 3, Math.round(drawY + 10), 2, 2);
    ctx.fillRect(cx + 1, Math.round(drawY + 10), 2, 2);

    // Brass high-pressure regulator valve & control wheel
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(cx - 3, Math.round(drawY + 3), 6, 3);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(cx - 2, Math.round(drawY + 3), 2, 1);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(cx - 6, Math.round(drawY + 3), 3, 3); // side knob

    // Heavy-duty stainless steel neck & curved burner tube
    ctx.fillStyle = '#64748b';
    ctx.fillRect(cx - 1, Math.round(drawY), 3, 3);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cx + 2, Math.round(drawY - 2), 6, 3);
    // Chromed nozzle shroud
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(cx + 6, Math.round(drawY - 3), 4, 5);
    ctx.fillStyle = '#475569';
    ctx.fillRect(cx + 10, Math.round(drawY - 2), 1, 3);

    // Animated intense blue-core pilot flame
    const fPulse = Math.sin(this.animTimer * 4) * 1.2;
    const fLen = 4 + fPulse;
    // Outer flame aura
    ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.beginPath();
    ctx.arc(cx + 12, drawY - 1, 3 + fPulse * 0.5, 0, Math.PI * 2);
    ctx.fill();
    // Inner incandescent white-blue pilot jet
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(cx + 11, drawY - 2);
    ctx.lineTo(cx + 11 + fLen, drawY - 1);
    ctx.lineTo(cx + 11, drawY);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx + 11, Math.round(drawY - 1), 2, 1);

    ctx.restore();
  }

  checkCollision(player) {
    if (this.collected) return false;
    const dx = Math.abs((player.x + 8) - this.x);
    const dy = Math.abs(player.y - this.y);
    return dx < 18 && dy <= 16;
  }
}


/**
 * Fiery Meatball Projectile fired by Kiloburner Boss
 * Balanced with clear parabolic arc, ground shadow & danger targeting reticle
 */
class MeatballProjectile {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 2.0; // Fair parabolic velocity allowing tactical evasion
    this.vx = (dx / dist) * speed;
    this.vy = Math.min(-1.6, (dy / dist) * speed - 1.4); // Graceful arc
    this.gravity = 0.09;
    this.bounces = 0;
    this.maxBounces = 1; // Only 1 fair bounce before dissipating into harmless smoke!
    this.radius = 6.5;
    this.life = 160;
    this.particles = [];
    this.predictedFloorY = targetY || 288;
    this.targetX = targetX;
    this.animTimer = 0;
  }

  checkPlayerHit(player) {
    if (!player || player.isDead || (player.invulnerableTimer && player.invulnerableTimer > 0)) return false;
    // Logical hitbox centered on the meatball core (radius 7.5px)
    const px = player.x + (player.width ? player.width / 2 : 8);
    const py = player.y + (player.height ? player.height / 2 : 8);
    const dist = Math.hypot(this.x - px, this.y - py);
    return dist < 14; // Generous contact threshold ensuring player is hit
  }

  update(floors) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life--;
    this.animTimer++;

    // Dynamically locate the platform floor directly beneath the projectile
    if (floors) {
      let closestBelow = null;
      for (const f of floors) {
        if (this.x >= f.x1 - 6 && this.x <= f.x2 + 6 && f.y >= this.y - 4) {
          if (!closestBelow || f.y < closestBelow.y) {
            closestBelow = f;
          }
        }
      }
      if (closestBelow) {
        this.predictedFloorY = closestBelow.y;
      }
    }

    // Check floor collision for bouncing
    if (floors && this.vy > 0) {
      for (const f of floors) {
        if (this.x >= f.x1 - 4 && this.x <= f.x2 + 4) {
          if (Math.abs(this.y - f.y) <= 5) {
            this.y = f.y - 4;
            this.bounces++;
            if (this.bounces > this.maxBounces) {
              this.life = 0; // Dissipates after 1 bounce!
            } else {
              this.vy = -Math.abs(this.vy) * 0.45;
              this.vx *= 0.6;
            }
            break;
          }
        }
      }
    }

    // Fire & smoke trail
    if (Math.random() < 0.7) {
      this.particles.push({
        x: this.x + (Math.random() - 0.5) * 5,
        y: this.y + (Math.random() - 0.5) * 5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.4 - Math.random() * 0.5,
        life: 14,
        maxLife: 14,
        color: Math.random() < 0.5 ? '#f97316' : '#ef4444'
      });
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  draw(ctx) {
    // 1. Render Ground Landing Reticle & Shadow on floor before impact!
    if (this.predictedFloorY && this.y < this.predictedFloorY - 6 && this.bounces === 0) {
      const floorDist = this.predictedFloorY - this.y;
      const progress = Math.max(0, Math.min(1, 1 - (floorDist / 140)));
      const shadowW = 10 + progress * 6;

      ctx.save();
      // Drop shadow ellipse on floor
      ctx.fillStyle = `rgba(0, 0, 0, ${0.25 + progress * 0.35})`;
      ctx.beginPath();
      ctx.ellipse(Math.round(this.x), Math.round(this.predictedFloorY), shadowW, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Flashing yellow/red danger target reticle when nearing ground
      if (progress > 0.3) {
        const pulse = Math.sin(Date.now() * 0.02) * 0.5 + 0.5;
        ctx.strokeStyle = (progress > 0.7) ? '#ef4444' : '#f59e0b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(Math.round(this.x), Math.round(this.predictedFloorY), 6 + pulse * 3, 0, Math.PI * 2);
        ctx.stroke();

        // Warning crosshairs
        ctx.beginPath();
        ctx.moveTo(Math.round(this.x) - 7, Math.round(this.predictedFloorY));
        ctx.lineTo(Math.round(this.x) + 7, Math.round(this.predictedFloorY));
        ctx.stroke();
      }
      ctx.restore();
    }

    // Trail
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha * 0.8;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 3, 3);
      ctx.restore();
    }

    // HD Meatball In-Flight Sprite from user artwork (or clean fallback)
    const sm = window.spriteManager;
    let spriteDrawn = false;
    if (sm && sm.kiloburnerAtlasLoaded && sm.drawKiloburnerAtlas) {
      const projW = 26;
      const projH = 21;
      // Native sprite points right (fiery exhaust trail on left, meatball head on right).
      // If moving left (vx < 0), flip horizontally so head leads left and trail trails right.
      const flip = (this.vx < 0);
      const angle = Math.atan2(this.vy, Math.abs(this.vx)) * (flip ? -1 : 1);

      // 4-frame animation cycle for glowing pulsating flame & molten meatball surface
      const frameIdx = Math.floor(this.animTimer / 4) % 4;
      const spriteName = `meatball_proj_${frameIdx}`;

      ctx.save();
      ctx.translate(Math.round(this.x), Math.round(this.y));
      ctx.rotate(angle * 0.7); // Dynamic ballistic trajectory alignment
      // Center the ball mass at origin: ball center in 26x21 sprite is at x=15, y=10
      const drawX = -15;
      const drawY = -10;
      spriteDrawn = sm.drawKiloburnerAtlas(ctx, spriteName, drawX, drawY, projW, projH, flip);
      ctx.restore();
    }

    if (!spriteDrawn) {
      // Procedural fallback
      ctx.save();
      ctx.fillStyle = '#7c2d12'; // deep meat brown
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Fiery crust
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Hot molten core highlight
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(this.x - 2, this.y - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

/**
 * Flying Flame Projectile launched from Kiloburner Boss mouth
 * Formed from high-fidelity animated sprite extracted and cleaned from the boss's flame artwork.
 */
class BossFlameProjectile {
  constructor(x, y, targetX, targetY, facing = -1) {
    this.x = x;
    this.y = y;
    this.facing = facing; // -1 = moving left toward player, 1 = moving right

    // Targeted trajectory towards Chef Pepe's position at moment of launch
    const dy = (targetY !== undefined) ? (targetY - y) : 0;
    const speed = 2.7; // Fair reaction speed (was 3.6)
    this.vx = facing * speed;
    // Clamped horizontal drift: stays in horizontal corridor so Pepe can jump over it!
    this.vy = Math.max(-0.5, Math.min(0.5, dy / 80));

    this.life = 180;
    this.maxLife = 180;
    this.bounces = 0;
    this.maxBounces = 999; // Projectile flies through the air; no bouncing
    this.animTimer = 0;
    this.scale = 0.44;
    this.width = Math.round(120 * this.scale);  // 53px
    this.height = Math.round(62 * this.scale); // 27px

    // Fair dodgeable hitbox (16x12px) centered near the leading incandescent head
    this.hitboxW = 16;
    this.hitboxH = 12;

    BossFlameProjectile.initAssets();
  }

  static initAssets() {
    if (BossFlameProjectile.framesLoaded) return;
    BossFlameProjectile.frames = [];
    for (let i = 0; i < 4; i++) {
      const img = new Image();
      img.src = `assets/boss_flame/frame_${i}.png?v=106`;
      BossFlameProjectile.frames.push(img);
    }
    BossFlameProjectile.framesLoaded = true;
  }

  update(floors) {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.animTimer++;
  }

  checkPlayerHit(player) {
    if (!player || player.isDead || player.invulnerableTimer > 0) return false;
    // Core hitbox is positioned near the leading head
    const headX = (this.facing === -1) ? (this.x - this.width * 0.20) : (this.x + this.width * 0.20);
    const headY = this.y;
    const px = player.x + 8;
    const py = player.y + 8;
    const hitDistX = Math.abs(headX - px);
    const hitDistY = Math.abs(headY - py);
    return (hitDistX < (this.hitboxW / 2 + 6) && hitDistY < (this.hitboxH / 2 + 6));
  }

  draw(ctx) {
    if (this.life <= 0) return;
    // 4-frame animation cycle at 60 FPS (~6 frames per frame)
    const frameIdx = Math.floor(this.animTimer / 6) % 4;
    const img = (BossFlameProjectile.frames && BossFlameProjectile.frames.length > 0)
      ? BossFlameProjectile.frames[frameIdx]
      : null;

    ctx.save();
    ctx.translate(Math.round(this.x), Math.round(this.y));

    // Slight angle tilt following trajectory vector
    const angle = Math.atan2(this.vy, Math.abs(this.vx)) * (this.facing === -1 ? 1 : -1);
    ctx.rotate(angle);

    // Orientation: frame_*.png has incandescent head on LEFT (x=0) and fiery tail on RIGHT.
    // When moving left (facing === -1), head is already leading on the left.
    // When moving right (facing === 1), flip horizontally so head leads on right.
    if (this.facing === 1) {
      ctx.scale(-1, 1);
    }

    const drawW = this.width;
    const drawH = this.height;
    const drawX = -Math.round(drawW * 0.40);
    const drawY = -Math.round(drawH * 0.50);

    // Subtle thermal bloom / heat distortion aura around the incandescent head
    ctx.save();
    ctx.globalAlpha = 0.20;
    const rad = Math.round(drawW * 0.45);
    const grad = ctx.createRadialGradient(drawX + drawW * 0.25, drawY + drawH * 0.5, 2, drawX + drawW * 0.25, drawY + drawH * 0.5, rad);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.5, '#ea580c');
    grad.addColorStop(1, 'rgba(234, 88, 12, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(drawX + drawW * 0.25, drawY + drawH * 0.5, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }

    ctx.restore();
  }
}

/**
 * Kiloburner - Giant Boss Class
 */
class KiloburnerBoss {
  constructor(arenaWidth = 320, arenaHeight = 320, initialX = null) {
    this.arenaWidth = arenaWidth;
    this.arenaHeight = arenaHeight;

    // Anchor position (center-bottom reference)
    this.x = (initialX !== null) ? initialX : (arenaWidth > 320 ? arenaWidth - 45 : 275);
    this.baseY = 215; // Vertical tracking base elevation
    this.y = this.baseY;
    this.vy = 0;
    this.maxVerticalSpeed = 2.2; // Responsive cyber-thruster tracking speed
    this.minBaseY = 95;  // Ceiling clearance
    this.maxBaseY = 282; // Descent tracking: descends to y=282 so attacks can strike player on floor (y=288)
    this.lungeX = 0;     // Horizontal attack thrust

    // Scale ratio from original ~240px sprite down to game size (~96x68)
    this.scale = 0.58; // Expanded formidable boss size
    this.logicalW = 120;
    this.logicalH = 88;

    // Colossal boss endurance & fortified durability
    this.maxHealth = 2000; // Colossal 2000 HP fortress health
    this.health = 2000;
    this.animTimer = 0;
    this.facing = -1; // -1 = looking left toward Chef Pepe

    // States: 'idle', 'lean', 'recoil', 'flame', 'meatball', 'claw', 'hit', 'explode', 'dead'
    this.state = 'idle';
    this.stateTimer = 0;
    this.hitFlashTimer = 0;
    this.attackCooldown = 90; // frames before first attack

    // Floating motion & horizontal hover
    this.floatAngle = 0;
    this.hoverSpeedX = 0.35;
    this.minX = 220;
    this.maxX = 315;

    // Defeat states
    this.isDead = false;
    this.defeatSequenceDone = false;
    this.explosionList = [];
    this.deadFallVy = 0;

    // Flame attack hit zone & projectile burst system
    this.flameActive = false;
    this.flameHitbox = { x: 0, y: 0, w: 0, h: 0 };
    BossFlameProjectile.initAssets();

    // Claw attack reach & kinetic effects
    this.clawActive = false;
    this.clawHitbox = { x: 0, y: 0, w: 0, h: 0 };
    this.clawSlashParticles = [];

    // Jet Thrusters & Mechanical particle systems
    this.thrusterParticles = [];
    this.cableSparks = [];
    this.armorSparks = [];
    this.corePulse = 0;
  }

  update(player, gameFloors, spawnProjectileCallback, cameraX = 0) {
    this.animTimer++;
    if (this.hitFlashTimer > 0) this.hitFlashTimer--;

    // ----------------------------------------------------
    // DEFEAT / EXPLODING / DEAD SEQUENCE
    // ----------------------------------------------------
    if (this.health <= 0) {
      if (!this.isDead) {
        this.isDead = true;
        this.state = 'explode';
        this.stateTimer = 0;
        if (window.soundManager && window.soundManager.playExplosion) {
          window.soundManager.playExplosion();
        }
      }

      if (this.state === 'explode') {
        this.stateTimer++;

        // Spawn multiple arcade explosions across the boss body
        if (this.stateTimer % 5 === 0) {
          const ex = this.x - this.logicalW / 2 + Math.random() * this.logicalW;
          const ey = this.y - this.logicalH + Math.random() * this.logicalH;
          this.explosionList.push({
            x: ex,
            y: ey,
            r: 10 + Math.random() * 16,
            life: 18,
            maxLife: 18,
            color: Math.random() < 0.5 ? '#f59e0b' : '#ef4444'
          });
          if (window.soundManager && window.soundManager.playExplosion) {
            window.soundManager.playExplosion();
          }
        }

        // Update explosion particles
        for (let i = this.explosionList.length - 1; i >= 0; i--) {
          const ex = this.explosionList[i];
          ex.life--;
          ex.r += 0.8;
          if (ex.life <= 0) this.explosionList.splice(i, 1);
        }

        // After 110 frames of explosions, fall to floor and become destroyed husk
        if (this.stateTimer >= 110) {
          this.state = 'dead';
          this.stateTimer = 0;
          this.deadFallVy = 1.0;
        }
        return;
      }

      if (this.state === 'dead') {
        this.stateTimer++;
        // Fall down until reaching plate/bottom floor (~y = 288)
        if (this.y < 288) {
          this.y += this.deadFallVy;
          this.deadFallVy = Math.min(4.5, this.deadFallVy + 0.25);
        } else {
          this.y = 288;
        }

        // Spawn periodic dark smoke puffs from smoking husk
        if (this.stateTimer % 12 === 0) {
          this.explosionList.push({
            x: this.x - 20 + Math.random() * 40,
            y: this.y - 30 - Math.random() * 20,
            r: 6,
            vy: -0.6,
            life: 25,
            maxLife: 25,
            color: '#64748b'
          });
        }
        for (let i = this.explosionList.length - 1; i >= 0; i--) {
          const ex = this.explosionList[i];
          ex.life--;
          ex.y += (ex.vy || -0.5);
          ex.r += 0.4;
          if (ex.life <= 0) this.explosionList.splice(i, 1);
        }

        // Wait 70 frames then trigger stage clear
        if (this.stateTimer >= 70) {
          this.defeatSequenceDone = true;
        }
        return;
      }
    }

    // ----------------------------------------------------
    // ACTIVE COMBAT BEHAVIOR & 2D PURSUIT
    // ----------------------------------------------------

    // 1. Facing Direction toward Player
    if (player && (this.state === 'idle' || this.state === 'meatball')) {
      const targetFacing = (player.x < this.x) ? -1 : 1;
      this.facing = targetFacing;
    }

    // 2. Vertical 2D Pursuit & Hydraulic Cables Suspension Physics
    // Follows Chef Pepe when climbing ladders or dropping floors!
    if (player && !this.isDead) {
      // Calculate target vertical position based on player's feet elevation.
      // Descends dynamically so attacks (flame, claw, meatball) align with player's standing height!
      const targetBaseY = Math.max(this.minBaseY, Math.min(this.maxBaseY, player.y + 6));
      const dy = targetBaseY - this.baseY;

      // Heavyweight responsive acceleration
      const accel = 0.08;
      this.vy = Math.max(-this.maxVerticalSpeed, Math.min(this.maxVerticalSpeed, this.vy + dy * accel));
      this.vy *= 0.92; // Damping
      this.baseY += this.vy;
      this.baseY = Math.max(this.minBaseY, Math.min(this.maxBaseY, this.baseY));
    }

    // Organic hover bobbing
    this.floatAngle += 0.055;
    const hoverBob = Math.sin(this.floatAngle) * 5;
    this.y = this.baseY + hoverBob;

    // 3. Horizontal Viewport Anchoring & Tactical Standoff
    const bossHalfW = Math.round(this.logicalW * 0.55);
    this.maxX = cameraX + 240 - bossHalfW - 8;
    this.minX = cameraX + 240 - bossHalfW - 65;

    // Enforce tactical standoff so the boss never drifts on top of player causing sudden collision death
    const minStandoff = 65;
    if (player && (this.x - player.x) < minStandoff && this.facing === -1) {
      this.x = Math.max(this.x, player.x + minStandoff);
    }

    if (this.x < this.minX) {
      this.x = this.minX;
      this.hoverSpeedX = Math.abs(this.hoverSpeedX);
    } else if (this.x > this.maxX) {
      this.x = this.maxX;
      this.hoverSpeedX = -Math.abs(this.hoverSpeedX);
    }

    // Horizontal patrol oscillation
    if (this.state === 'idle') {
      this.x += this.hoverSpeedX;
    }

    // 4. State Machine (Hit, Recoil, Flame, Meatball, Claw)
    this.flameActive = false;
    this.clawActive = false;
    this.lungeX = 0;

    if (this.state === 'hit') {
      this.stateTimer--;
      if (this.stateTimer <= 0) this.state = 'idle';
    } else if (this.state === 'recoil') {
      this.stateTimer--;
      this.x -= this.facing * 0.8;
      if (this.stateTimer <= 0) this.state = 'idle';
    } else if (this.state === 'flame') {
      this.stateTimer++;
      if (this.stateTimer === 1 && player) {
        this.facing = (player.x < this.x) ? -1 : 1;
        if (window.soundManager && window.soundManager.playBossFlameCharge) {
          window.soundManager.playBossFlameCharge();
        }
      }
      // Head tilts forward slightly during flame burst
      this.lungeX = this.facing * 6;

      // Cadence requested: 3 flames separated by 2 seconds (120 frames at 60 FPS), then wait 5 seconds (300 frames)!
      // Shot 1 fires at frame 28 (after 24-frame telegraph)
      // Shot 2 fires at frame 148 (28 + 120)
      // Shot 3 fires at frame 268 (148 + 120)
      const fireFrames = [28, 148, 268];
      const relT = (this.stateTimer < 240) ? (this.stateTimer % 120) : (this.stateTimer - 240);

      // Hitbox dynamically scales with the flame sprite progression (Poses 3 -> 4 -> 5 -> 6)
      let flameW = 38;
      let flameH = 20;
      let isFiring = false;

      // Frames 0 to 24: Telegraph Warning! Mouth charges and furnace glows. NO HITBOX.
      if (relT < 24) {
        isFiring = false;
        if (relT % 4 === 0) {
          // Venting furnace embers from top chimneys
          this.armorSparks.push({
            x: this.x + (this.facing * -15) + (Math.random() - 0.5) * 10,
            y: this.y - this.logicalH + 10,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -1.5 - Math.random() * 1.5,
            life: 12,
            maxLife: 12,
            color: Math.random() < 0.5 ? '#f97316' : '#fef08a'
          });
        }
      } else if (relT >= 24 && relT < 34) {
        // Pose 3: Initial Burst
        isFiring = true;
        flameW = 32;
        flameH = 18;
      } else if (relT >= 34 && relT < 48) {
        // Pose 4: Flame Jet
        isFiring = true;
        flameW = 44;
        flameH = 20;
      } else if (relT >= 48 && relT < 70) {
        // Pose 5: Peak Flame (fair 50px reach, was 85px!)
        isFiring = true;
        flameW = 50;
        flameH = 22;
      } else if (relT >= 70 && relT < 86) {
        // Pose 6: Dissipating Embers & Smoke (Harmless!)
        isFiring = false;
        flameW = 26;
        flameH = 16;
      }

      this.flameActive = isFiring;
      const flameX = (this.facing === -1)
        ? (this.x + this.lungeX - this.logicalW * 0.38 - flameW)
        : (this.x + this.lungeX + this.logicalW * 0.38);
      const flameY = this.y - this.logicalH * 0.58;
      this.flameHitbox = { x: flameX, y: flameY, w: flameW, h: flameH };

      // Launch flying flame projectile at each designated interval
      if (fireFrames.includes(this.stateTimer)) {
        if (spawnProjectileCallback) {
          const nozzleX = this.x + this.lungeX + (this.facing * (this.logicalW * 0.38));
          const nozzleY = this.y - (this.logicalH * 0.56);
          const targetX = player ? player.x : (this.x + this.facing * 200);
          const targetY = player ? player.y : this.y;
          spawnProjectileCallback(new BossFlameProjectile(nozzleX, nozzleY, targetX, targetY, this.facing));
        }
        if (window.soundManager && window.soundManager.playFlame) {
          window.soundManager.playFlame();
        }
      }

      // After 3rd flame launches and clears mouth at frame 290:
      // Transition to idle and wait 5.0 seconds (300 frames at 60 FPS) before next attack!
      if (this.stateTimer >= 290) {
        this.state = 'idle';
        this.attackCooldown = 300; // Exactly 5 seconds cooldown!
      }
    } else if (this.state === 'meatball') {
      this.stateTimer++;
      if (this.stateTimer === 1 && player) {
        this.facing = (player.x < this.x) ? -1 : 1;
      }
      // Fluid telegraph: Boss pulls back slightly while preparing meatball in mouth
      if (this.stateTimer < 22) {
        this.lungeX = -this.facing * (Math.sin((this.stateTimer / 22) * Math.PI * 0.5) * 5);
      } else if (this.stateTimer < 32) {
        // Forward recoil on ejection
        this.lungeX = this.facing * 6;
      } else {
        // Smooth return
        this.lungeX = this.facing * Math.max(0, 6 - (this.stateTimer - 32) * 0.3);
      }

      // Meatball ejection synchronized with Pose 4 (Launch Frame at frame 24)
      if (this.stateTimer === 24) {
        if (spawnProjectileCallback && player) {
          const spawnX = this.x + (this.facing * (this.logicalW * 0.42));
          const spawnY = this.y - (this.logicalH * 0.52);
          const targetX = player.x + (Math.random() - 0.5) * 20;
          const targetY = player.y;
          spawnProjectileCallback(new MeatballProjectile(spawnX, spawnY, targetX, targetY));
          if (window.soundManager && window.soundManager.playDrop) {
            window.soundManager.playDrop();
          }
        }
      }
      if (this.stateTimer > 52) {
        this.state = 'idle';
        this.attackCooldown = 90 + Math.random() * 40;
      }
    } else if (this.state === 'claw') {
      this.stateTimer++;

      // Phase 1: Telegraph Windup (frames 1 to 24, ~0.4s)
      if (this.stateTimer === 1) {
        if (window.soundManager && window.soundManager.playBossTelegraphClaw) {
          window.soundManager.playBossTelegraphClaw();
        }
      }

      if (this.stateTimer <= 24) {
        // Windup: Boss pulls back slightly, claws flare open with electrical spark warning
        this.lungeX = -this.facing * (Math.sin((this.stateTimer / 24) * Math.PI * 0.5) * 8);
        this.clawActive = false;

        // Warning electric sparks & hydraulic steam charging at claw arm
        if (this.stateTimer % 2 === 0) {
          const armX = this.x + this.lungeX + (this.facing * (this.logicalW * 0.28));
          const armY = this.y - this.logicalH * 0.42;
          this.clawSlashParticles.push({
            x: armX + (Math.random() - 0.5) * 12,
            y: armY + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -0.5 - Math.random() * 1.5,
            life: 10,
            maxLife: 10,
            color: Math.random() < 0.6 ? '#38bdf8' : '#fef08a'
          });
        }
      } else if (this.stateTimer <= 42) {
        // Phase 2: Forward Hydraulic Strike (frames 25 to 42)
        const progress = (this.stateTimer - 24) / 18;
        this.lungeX = Math.sin(progress * Math.PI) * (this.facing * 16); // 16px lunge (was 22px)

        const clawReach = 46; // Balanced reach (was 70px)
        const clawH = 18;     // Balanced height (was 26px)
        const clawX = (this.facing === -1)
          ? (this.x + this.lungeX - this.logicalW * 0.35 - clawReach)
          : (this.x + this.lungeX + this.logicalW * 0.35);
        const clawY = this.y - this.logicalH * 0.45;

        this.clawHitbox = { x: clawX, y: clawY, w: clawReach, h: clawH };
        this.clawActive = true;

        if (this.stateTimer % 2 === 0) {
          this.clawSlashParticles.push({
            x: clawX + (this.facing === -1 ? 0 : clawReach),
            y: clawY + Math.random() * clawH,
            vx: -this.facing * (1.8 + Math.random() * 2),
            vy: (Math.random() - 0.5) * 2,
            life: 8,
            maxLife: 8,
            color: Math.random() < 0.5 ? '#38bdf8' : '#ffffff'
          });
        }
      } else {
        // Phase 3: Cooldown & Retraction (frames 43 to 65)
        this.clawActive = false;
        this.lungeX *= 0.85;
      }

      if (this.stateTimer > 65) {
        this.state = 'idle';
        this.attackCooldown = 90 + Math.random() * 30; // 1.5 - 2s breather
      }
    } else {
      // Idle state: attack decision
      if (this.attackCooldown > 0) {
        this.attackCooldown--;
      } else {
        const distToPlayer = player ? Math.hypot(player.x - this.x, player.y - this.y) : 999;
        const verticalDiff = player ? Math.abs(player.y - this.y) : 999;

        if (distToPlayer < 95 && verticalDiff < 45) {
          this.state = Math.random() < 0.55 ? 'flame' : 'claw';
        } else {
          const roll = Math.random();
          if (roll < 0.45) {
            this.state = 'meatball';
          } else if (roll < 0.8) {
            this.state = 'flame';
          } else {
            this.state = 'claw';
          }
        }
        this.stateTimer = 0;
      }
    }

    // 5. Update Thruster Plasma Jet Particles
    if (this.state !== 'dead') {
      const isAscending = this.vy < -0.15;
      const thrusterOffsets = [-22, 22];
      for (const offX of thrusterOffsets) {
        const tX = this.x + this.lungeX + (this.facing === -1 ? -offX : offX);
        const tY = this.y - 4;
        const count = isAscending ? 3 : 1;
        for (let k = 0; k < count; k++) {
          this.thrusterParticles.push({
            x: tX + (Math.random() - 0.5) * 6,
            y: tY,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (isAscending ? 3.2 : 1.8) + Math.random() * 1.6,
            size: (isAscending ? 3.5 : 2.2) + Math.random() * 2,
            life: 12 + Math.random() * 6,
            maxLife: 18,
            color: Math.random() < 0.45 ? '#38bdf8' : (Math.random() < 0.75 ? '#f97316' : '#ef4444')
          });
        }
      }
    }

    // Particle cleanup loops
    for (let i = this.thrusterParticles.length - 1; i >= 0; i--) {
      const p = this.thrusterParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) this.thrusterParticles.splice(i, 1);
    }
    for (let i = this.clawSlashParticles.length - 1; i >= 0; i--) {
      const p = this.clawSlashParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) this.clawSlashParticles.splice(i, 1);
    }
    if (this.armorSparks) {
      for (let i = this.armorSparks.length - 1; i >= 0; i--) {
        const spk = this.armorSparks[i];
        spk.x += spk.vx;
        spk.y += spk.vy;
        spk.life--;
        if (spk.life <= 0) this.armorSparks.splice(i, 1);
      }
    }
  }

  /**
   * Check collision with player's cryogenic projectile
   */
  /**
   * Check collision with player's blowtorch flame projectile
   */
  checkHitByFlame(projectile) {
    if (this.health <= 0 || this.isDead) return false;

    // Body hitbox
    const left = this.x - this.logicalW * 0.5;
    const right = this.x + this.logicalW * 0.5;
    const top = this.y - this.logicalH;
    const bottom = this.y + 16;

    if (projectile.x >= left && projectile.x <= right &&
        projectile.y >= top && projectile.y <= bottom) {
      this.takeDamage(projectile.damage || 8, 'flame');
      return true;
    }
    return false;
  }

  checkHitByCryo(projectile) {
    if (this.health <= 0 || this.isDead) return false;

    // Body hitbox
    const left = this.x - this.logicalW * 0.5;
    const right = this.x + this.logicalW * 0.5;
    const top = this.y - this.logicalH;
    const bottom = this.y + 16;

    if (projectile.x >= left && projectile.x <= right &&
        projectile.y >= top && projectile.y <= bottom) {
      this.takeDamage(10, 'cryo');
      return true;
    }
    return false;
  }

  /**
   * Check collision with a falling burger piece (massive crush damage!)
   */
  checkHitByBurgerPiece(piece) {
    if (this.health <= 0 || this.isDead || !piece.falling) return 0;

    const left = this.x - this.logicalW * 0.45;
    const right = this.x + this.logicalW * 0.45;
    const top = this.y - this.logicalH;
    const bottom = this.y;

    // Burger piece bounds
    if (piece.x + 24 >= left && piece.x <= right &&
        piece.y + 12 >= top && piece.y <= bottom) {
      const dealt = this.takeDamage(50, 'burger');
      return dealt || 35;
    }
    return 0;
  }

  takeDamage(amount, source = 'cryo') {
    if (this.health <= 0) return 0;

    // Heavy Cyber-Armor Resistance (Blindaje de Titanio Térmico):
    // 50% damage reduction on energy/flame projectiles (reinforced thermal plating)
    // 30% reduction on falling burger crush impacts (shock absorption chassis)
    let effectiveDamage = amount;
    if (source === 'flame' || source === 'cryo') {
      effectiveDamage = Math.max(3, Math.round(amount * 0.50));
    } else if (source === 'burger') {
      effectiveDamage = Math.max(25, Math.round(amount * 0.70));
    }

    this.health = Math.max(0, this.health - effectiveDamage);
    this.hitFlashTimer = 10;

    // Spawn cyber-armor ricochet sparks (metal deflecting incoming impact)
    if (!this.armorSparks) this.armorSparks = [];
    for (let s = 0; s < 5; s++) {
      this.armorSparks.push({
        x: this.x + (Math.random() - 0.5) * 40,
        y: this.y - 45 + (Math.random() - 0.5) * 35,
        vx: (Math.random() - 0.5) * 3.5,
        vy: -1.2 - Math.random() * 2.2,
        life: 10,
        maxLife: 10,
        color: Math.random() < 0.5 ? '#38bdf8' : '#ffffff'
      });
    }

    if (this.health <= 0) {
      this.state = 'explode';
      this.stateTimer = 0;
      return effectiveDamage;
    }

    // Hyper-Armor & Poise: minor projectiles do not interrupt the boss during attacks!
    if (source === 'burger') {
      this.state = 'hit';
      this.stateTimer = 20; // Heavy crush stuns boss briefly
    } else {
      // Light flinch recoil ONLY if completely idle; maintains uninterrupted attack flow!
      if (this.state === 'idle') {
        this.state = 'recoil';
        this.stateTimer = 6;
      }
    }
    return effectiveDamage;
  }

  /**
   * Check if Boss hits Player with body, flame, or claw
   * Balanced: Body contact restricted to central furnace chassis so Pepe can run/walk underneath!
   */
  checkPlayerDamage(player) {
    if (this.health <= 0 || !player || player.isDead || (player.invulnerableTimer && player.invulnerableTimer > 0)) return false;

    const pBox = {
      x: player.x,
      y: player.y,
      w: player.width || 16,
      h: player.height || 16
    };

    const centerX = this.x + (this.lungeX || 0);

    // 1. Direct Body Contact - tightened to central chassis so Pepe can safely walk/run underneath without sudden death!
    const bLeft = centerX - this.logicalW * 0.28;
    const bRight = centerX + this.logicalW * 0.28;
    const bTop = this.y - this.logicalH * 0.88;
    const bBottom = this.y - 12; // Raised 12px above bottom anchor: guaranteed safe walking space below!

    if (pBox.x + pBox.w >= bLeft && pBox.x <= bRight &&
        pBox.y + pBox.h >= bTop && pBox.y <= bBottom) {
      return true;
    }

    // 2. Flame Breath Contact
    if (this.flameActive) {
      const f = this.flameHitbox;
      if (pBox.x + pBox.w >= f.x && pBox.x <= f.x + f.w &&
          pBox.y + pBox.h >= f.y && pBox.y <= f.y + f.h) {
        return true;
      }
    }

    // 3. Hydraulic Claw Contact
    if (this.clawActive) {
      const c = this.clawHitbox;
      if (pBox.x + pBox.w >= c.x && pBox.x <= c.x + c.w &&
          pBox.y + pBox.h >= c.y && pBox.y <= c.y + c.h) {
        return true;
      }
    }

    return false;
  }

  draw(ctx, spriteManager = window.spriteManager) {
    const sm = spriteManager || window.spriteManager;
    if (!sm) return;

    // Select sprite name with 60 FPS ultra-fluid high-density frames (100% consistent with original art)
    let spriteName = 'hover_00';

    if (this.state === 'dead') {
      spriteName = 'defeat_dead';
    } else if (this.state === 'explode') {
      spriteName = (this.stateTimer % 6 < 3) ? 'defeat_explode' : 'hit_01';
    } else if (this.hitFlashTimer > 0) {
      const hitIdx = Math.min(3, Math.floor(this.hitFlashTimer / 2)) % 4;
      spriteName = 'hit_' + String(hitIdx).padStart(2, '0');
    } else if (this.state === 'recoil') {
      const hitIdx = Math.min(3, Math.floor(this.stateTimer / 3)) % 4;
      spriteName = 'hit_' + String(hitIdx).padStart(2, '0');
    } else if (this.state === 'claw') {
      // 3-Phase Claw Animation: Telegraph (0-24) -> Strike (25-42) -> Recovery (43-65)
      if (this.stateTimer <= 24) {
        spriteName = (this.stateTimer % 8 < 4) ? 'claw_00' : 'claw_01';
      } else if (this.stateTimer <= 42) {
        const strikeProgress = (this.stateTimer - 25) / 17;
        const strikeIdx = 2 + Math.min(4, Math.floor(strikeProgress * 5));
        spriteName = 'claw_' + String(strikeIdx).padStart(2, '0');
      } else {
        spriteName = 'claw_07';
      }
    } else if (this.state === 'flame') {
      // 3-shot burst animation rhythm matching 120-frame (2s) intervals
      const relT = (this.stateTimer < 240) ? (this.stateTimer % 120) : (this.stateTimer - 240);
      if (relT < 12) {
        spriteName = 'flame_00'; // Pose 1: Preparing flame / mouth open
      } else if (relT < 24) {
        spriteName = 'flame_01'; // Pose 2: Fiery furnace charging glow inside mouth
      } else if (relT < 34) {
        spriteName = 'flame_02'; // Pose 3: Incandescent mouth launch burst
      } else if (relT < 48) {
        spriteName = 'flame_03'; // Pose 4: Expanding flame jet thrust
      } else if (relT < 58) {
        spriteName = 'flame_04'; // Pose 5: Full blast flamethrower
      } else if (relT < 70) {
        spriteName = 'flame_05'; // Pose 5/Pulse: Flame turbulence pulse
      } else if (relT < 86) {
        spriteName = 'flame_06'; // Pose 6: Exhaust smoke & dissipating embers
      } else if (relT < 100) {
        spriteName = 'flame_07'; // Pose 1: Mouth closing & recovery
      } else {
        spriteName = 'hover_04'; // Hovering smoothly between burst shots
      }
    } else if (this.state === 'meatball') {
      // 6-Frame fluid animation sequence for meatball launch:
      // Pose 1 (meatball_00): Mouth open / targeting (frames 0-7)
      // Pose 2 (meatball_01): Meatball chambered / charging (frames 8-15)
      // Pose 3 (meatball_02): Pre-launch compression & sparks (frames 16-23)
      // Pose 4 (meatball_03): Launch / ejection moment (frames 24-31)
      // Pose 5 (meatball_04): Heavy muzzle flash / exhaust recoil (frames 32-41)
      // Pose 6 (meatball_05): Smoke dissipation & recovery (frames 42-52)
      if (this.stateTimer < 8) {
        spriteName = 'meatball_00';
      } else if (this.stateTimer < 16) {
        spriteName = 'meatball_01';
      } else if (this.stateTimer < 24) {
        spriteName = 'meatball_02';
      } else if (this.stateTimer < 32) {
        spriteName = 'meatball_03';
      } else if (this.stateTimer < 42) {
        spriteName = 'meatball_04';
      } else {
        spriteName = 'meatball_05';
      }
    } else if (this.state === 'lean') {
      spriteName = 'hover_08';
    } else {
      // Ultra-fluid 16-frame hover & respiration cycle at 60 FPS (updates every 2.5 frames)
      const hoverIdx = Math.floor(this.animTimer / 2.5) % 16;
      spriteName = 'hover_' + String(hoverIdx).padStart(2, '0');
    }

    const info = spriteManager.getKiloburnerAtlasInfo(spriteName);
    if (!info) return;

    const renderW = Math.round(info.w * this.scale);
    const renderH = Math.round(info.h * this.scale);

    // Anchor: draw relative to center x and bottom y
    // Facing: Kiloburner's atlas sprite natively faces right.
    // If facing === -1 (looking left toward Chef), flip horizontally.
    const flip = (this.facing === -1);
    const drawX = Math.round(this.x + this.lungeX - renderW / 2);
    const drawY = Math.round(this.y - renderH);

    ctx.save();

    // Clean, 100% solid, professional retro arcade sprite drawing (Zero lines, zero transparency ghosting)
    sm.drawKiloburnerAtlas(ctx, spriteName, drawX, drawY, renderW, renderH, flip);

    // Solid damage flash (maintains 100% opacity, alternate hit frame)
    if (this.hitFlashTimer > 0 && Math.floor(this.hitFlashTimer / 2) % 2 === 0) {
      sm.drawKiloburnerAtlas(ctx, 'hit_00', drawX, drawY, renderW, renderH, flip);
    }

    // 7. Visual Telegraph Signs (Fair gameplay warning prompts!)
    // Telegraph prompt for Hydraulic Claw Attack
    if (this.state === 'claw' && this.stateTimer <= 24) {
      const warnX = this.x + this.lungeX + (this.facing * (this.logicalW * 0.35));
      const warnY = this.y - this.logicalH * 0.48;
      const pulse = Math.sin(this.stateTimer * 0.45) * 0.5 + 0.5;

      ctx.save();
      // Flashing electrical danger circle
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(Math.round(warnX), Math.round(warnY), 10 + pulse * 6, 0, Math.PI * 2);
      ctx.stroke();

      // Flashing text warning banner (jump over or back off!)
      ctx.font = 'bold 6px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000000';
      ctx.fillText('⚡ ¡ZARPAZO! ⚡', Math.round(warnX) + 1, Math.round(warnY - 14) + 1);
      ctx.fillStyle = (pulse > 0.4) ? '#fef08a' : '#38bdf8';
      ctx.fillText('⚡ ¡ZARPAZO! ⚡', Math.round(warnX), Math.round(warnY - 14));
      ctx.restore();
    }

    // Telegraph prompt for Flame Attack
    if (this.state === 'flame') {
      const relT = (this.stateTimer < 240) ? (this.stateTimer % 120) : (this.stateTimer - 240);
      if (relT < 24) {
        const warnX = this.x + this.lungeX + (this.facing * (this.logicalW * 0.38));
        const warnY = this.y - this.logicalH * 0.58;
        const pulse = Math.sin(relT * 0.45) * 0.5 + 0.5;

        ctx.save();
        // Heat distortion aura
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(Math.round(warnX), Math.round(warnY), 9 + pulse * 6, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = 'bold 6px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';
        ctx.fillText('🔥 ¡FUEGO! 🔥', Math.round(warnX) + 1, Math.round(warnY - 14) + 1);
        ctx.fillStyle = (pulse > 0.4) ? '#ef4444' : '#fef08a';
        ctx.fillText('🔥 ¡FUEGO! 🔥', Math.round(warnX), Math.round(warnY - 14));
        ctx.restore();
      }
    }

    // 8. Draw Hydraulic Claw Slashing Arc Blades
    if (this.clawSlashParticles && this.clawSlashParticles.length > 0) {
      for (const cp of this.clawSlashParticles) {
        const alpha = Math.max(0, cp.life / cp.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = cp.color;
        ctx.fillRect(Math.round(cp.x), Math.round(cp.y), 4, 2);
        ctx.restore();
      }
    }

    // Dynamic Slash Arc Blade during active claw strike
    if (this.clawActive) {
      const c = this.clawHitbox;
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const arcCenterX = c.x + c.w * 0.5;
      const arcCenterY = c.y + c.h * 0.5;
      ctx.arc(arcCenterX, arcCenterY, 18, -Math.PI * 0.4, Math.PI * 0.4, flip);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    // 8. Draw Armor Ricochet Sparks (Deflecting projectile fire)
    if (this.armorSparks && this.armorSparks.length > 0) {
      for (const spk of this.armorSparks) {
        ctx.save();
        ctx.fillStyle = spk.color;
        ctx.fillRect(Math.round(spk.x), Math.round(spk.y), 2, 2);
        ctx.restore();
      }
    }

    ctx.restore(); // restore main draw context

    // Draw active explosions during defeat
    for (const ex of this.explosionList) {
      ctx.save();
      const alpha = ex.life / ex.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = ex.color;
      ctx.beginPath();
      ctx.arc(ex.x, ex.y, ex.r, 0, Math.PI * 2);
      ctx.fill();

      // Bright core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex.x, ex.y, ex.r * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /**
   * Render Retro Arcade Boss Health Bar in Top HUD
   * Positioned cleanly at the top center so it does not obstruct the gameplay panorama
   */
  drawBossHealthBar(ctx, screenWidth) {
    if (this.defeatSequenceDone) return;

    ctx.save();

    const barW = 124;
    const barH = 5;
    const barX = Math.round((screenWidth - barW) / 2);
    const barY = 12;

    // 1. Sleek Compact Boss Header Label (y = 8)
    ctx.font = 'bold 5px "Press Start 2P", monospace, sans-serif';
    ctx.textBaseline = 'middle';

    // Left label: BOSS: KILOBURNER [BLINDADO] (crisp 1px shadow, zero shadowBlur)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#000000';
    ctx.fillText('KILOBURNER [ARMOR]', barX + 1, 9);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('KILOBURNER [ARMOR]', barX, 8);

    // Right label: Remaining HP
    ctx.textAlign = 'right';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`${Math.max(0, this.health)} HP`, barX + barW, 8);

    // 2. Health Bar Outer Steel Housing
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX - 1, barY - 1, barW + 2, barH + 2);

    // Health Track (Dark Red background)
    ctx.fillStyle = '#3f0c0c';
    ctx.fillRect(barX, barY, barW, barH);

    // Current HP Fill (Cached Gradient)
    const healthRatio = Math.max(0, Math.min(1, this.health / this.maxHealth));
    const currentW = Math.round(barW * healthRatio);

    if (currentW > 0) {
      if (!this._hpGrad) {
        this._hpGrad = ctx.createLinearGradient(barX, barY, barX + barW, barY);
        this._hpGrad.addColorStop(0, '#ef4444');
        this._hpGrad.addColorStop(0.7, '#f97316');
        this._hpGrad.addColorStop(1, '#fef08a');
      }
      ctx.fillStyle = this._hpGrad;
      ctx.fillRect(barX, barY, currentW, barH);

      // Top gloss highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillRect(barX, barY, currentW, 1);
    }

    ctx.restore();
  }
}

window.KiloburnerBoss = KiloburnerBoss;
window.CryoProjectile = CryoProjectile;
window.MeatballProjectile = MeatballProjectile;
window.FlameProjectile = FlameProjectile;
window.BlowtorchPickup = BlowtorchPickup;
window.BossFlameProjectile = BossFlameProjectile;

