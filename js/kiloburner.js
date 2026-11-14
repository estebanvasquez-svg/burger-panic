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
    this.damage = 12;
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
    this.respawnTimer = 0;
    this.maxRespawnTime = 600; // ~10 seconds to auto-recharge
    this.animTimer = Math.random() * 60;
  }

  collect() {
    this.collected = true;
    this.respawnTimer = this.maxRespawnTime;
  }

  update() {
    this.animTimer += 0.08;
    if (this.collected) {
      this.respawnTimer--;
      if (this.respawnTimer <= 0) {
        this.collected = false;
        if (window.burgerPanicGame && window.burgerPanicGame.particles) {
          for (let s = 0; s < 8; s++) {
            window.burgerPanicGame.particles.push(new window.ArcadeParticle(
              this.x, this.y - 8,
              (Math.random() - 0.5) * 2.5,
              (Math.random() - 0.5) * 2.5,
              Math.random() < 0.5 ? '#fef08a' : '#38bdf8',
              2.5, 18, 'spark'
            ));
          }
        }
      }
    }
  }

  draw(ctx) {
    if (this.collected) {
      // Recharging bracket with animated progress bar
      ctx.save();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(Math.round(this.x - 12), Math.round(this.y - 4), 24, 4);
      ctx.fillStyle = '#475569';
      ctx.fillRect(Math.round(this.x - 10), Math.round(this.y - 3), 20, 2);

      // Recharge progress fill
      const progress = Math.max(0, Math.min(1, 1 - (this.respawnTimer / this.maxRespawnTime)));
      const fillW = Math.round(20 * progress);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(Math.round(this.x - 10), Math.round(this.y - 3), fillW, 2);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '5px monospace';
      ctx.textAlign = 'center';
      const pct = Math.round(progress * 100);
      ctx.fillText(`CARGA ${pct}%`, Math.round(this.x), Math.round(this.y - 7));
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
    this.targetX = targetX;
    this.targetY = targetY;

    const dx = targetX - x;
    const dy = targetY - y;
    const absDx = Math.abs(dx);

    // Dynamic flight time in frames: ensures readable arcade parabola (28 to 50 frames ~ 0.45s - 0.85s)
    // allowing tactical dodge (jump over, run away, or blowtorch counter)
    const flightTime = Math.max(28, Math.min(50, Math.round(absDx / 1.75)));

    this.vx = dx / flightTime;
    this.gravity = 0.085;
    // Ballistic formula: targetY - y = vy * T + 0.5 * g * T^2 ==> vy = (dy - 0.5 * g * T^2) / T
    this.vy = (dy - 0.5 * this.gravity * flightTime * flightTime) / flightTime;

    this.bounces = 0;
    this.maxBounces = 1; // Only 1 fair bounce before dissipating into harmless smoke!
    this.radius = 6.5;
    this.life = 160;
    this.particles = [];
    this.predictedFloorY = targetY || 288;
    this.animTimer = 0;
  }

  checkPlayerHit(player) {
    if (!player || player.isDead || (player.invulnerableTimer && player.invulnerableTimer > 0)) return false;

    // Chef Pepe bounding profile (16x16 logical core, visual sprite 22x30)
    // Feet are at player.y + 14, head at player.y - 10
    const pLeft = player.x - 3;
    const pRight = player.x + (player.width || 16) + 3;
    const pTop = player.y - 10;
    const pBottom = player.y + (player.height || 16) + 2;

    // 1. Direct bounding box overlap with meatball radius (6.5px)
    if (this.x + this.radius >= pLeft && this.x - this.radius <= pRight &&
        this.y + this.radius >= pTop && this.y - this.radius <= pBottom) {
      return true;
    }

    // 2. Radial contact with player torso center
    const px = player.x + (player.width || 16) / 2;
    const py = player.y + 6;
    const dist = Math.hypot(this.x - px, this.y - py);
    return dist < 17;
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

    // Continuous floor collision detection: catches fast falling projectiles without tunneling
    if (floors && this.vy > 0) {
      for (const f of floors) {
        if (this.x >= f.x1 - 6 && this.x <= f.x2 + 6) {
          const prevY = this.y - this.vy;
          if (prevY <= f.y + 2 && this.y >= f.y - 6) {
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
    this.baseY = 288; // Vertical tracking base elevation: starts at floor height
    this.y = this.baseY;
    this.vy = 0;
    this.maxVerticalSpeed = 2.8; // Agile cyber-thruster tracking speed
    this.minBaseY = 95;  // Ceiling clearance
    this.maxBaseY = 320; // Full descent: allows boss to lower completely to the floor (y=320) so all attacks hit player
    this.lungeX = 0;     // Horizontal attack thrust

    // Scale ratio from original ~240px sprite down to game size (~96x68)
    this.scale = 0.58; // Expanded formidable boss size
    this.logicalW = 120;
    this.logicalH = 88;

    // Balanced arcade boss endurance
    this.maxHealth = 600; // Balanced 600 HP arcade boss health
    this.health = 600;
    this.animTimer = 0;
    this.facing = -1; // -1 = looking left toward Chef Pepe
    this.pepperStunTimer = 0; // Blinding pepper duration

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

    // Metroidvania Phase & Kinetic Combat Systems
    this.phase = 1;
    this.trailingHealth = this.maxHealth;
    this.bossAfterimages = [];
    this.shockwaves = [];
    this.dashDir = -1;
  }

  update(player, gameFloors, spawnProjectileCallback, cameraX = 0) {
    this.animTimer++;
    if (this.hitFlashTimer > 0) this.hitFlashTimer--;

    // Smooth Metroidvania trailing damage bar
    if (this.trailingHealth > this.health) {
      this.trailingHealth = Math.max(this.health, this.trailingHealth - 1.6);
    }

    // Fade boss afterimages & expand shockwaves
    for (let i = this.bossAfterimages.length - 1; i >= 0; i--) {
      this.bossAfterimages[i].alpha -= 0.08;
      if (this.bossAfterimages[i].alpha <= 0) this.bossAfterimages.splice(i, 1);
    }
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.r += 3.8;
      sw.alpha -= 0.045;
      if (sw.alpha <= 0) this.shockwaves.splice(i, 1);
    }

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
    // Follows Chef Bruno when climbing ladders or dropping floors (faster in higher phases)
    if (player && !this.isDead && this.state !== 'dash_sweep') {
      const phaseVertMult = this.phase === 3 ? 1.4 : (this.phase === 2 ? 1.22 : 1.0);
      const targetBaseY = Math.max(this.minBaseY, Math.min(this.maxBaseY, player.y + 24));
      const dy = targetBaseY - this.baseY;

      const accel = 0.10 * phaseVertMult;
      const maxSpd = this.maxVerticalSpeed * phaseVertMult;
      this.vy = Math.max(-maxSpd, Math.min(maxSpd, this.vy + dy * accel));
      this.vy *= 0.90; // Damping
      this.baseY += this.vy;
      this.baseY = Math.max(this.minBaseY, Math.min(this.maxBaseY, this.baseY));
    }

    // Organic hover bobbing
    this.floatAngle += (this.phase === 3 ? 0.085 : 0.055);
    const hoverBob = Math.sin(this.floatAngle) * 5;
    this.y = this.baseY + hoverBob;

    // 3. Horizontal Viewport Anchoring & Safe Standoff Distance
    this.maxX = cameraX + 240 - 20;
    this.minX = cameraX + 20;

    if (player && !this.isDead && this.state !== 'dash_sweep') {
      const playerCenterX = player.x + 8;
      const side = (this.x >= playerCenterX) ? 1 : -1;
      const desiredDist = 114;
      const minStandoff = 92;

      const desiredCombatX = playerCenterX + side * desiredDist;
      const targetX = Math.max(this.minX, Math.min(this.maxX, desiredCombatX));

      if (this.state === 'idle') {
        this.x += (targetX - this.x) * (this.phase === 3 ? 0.12 : 0.08);
      } else if (Math.abs(this.x - playerCenterX) < minStandoff) {
        this.x += (targetX - this.x) * 0.14;
      }

      const distAfter = this.x - playerCenterX;
      if (Math.abs(distAfter) < minStandoff) {
        const clampedX = playerCenterX + side * minStandoff;
        if (clampedX >= this.minX && clampedX <= this.maxX) {
          this.x = clampedX;
        }
      }
    }

    // Metroidvania Phase Transition Check (Phase 2 <= 60% HP, Phase 3 <= 30% HP)
    if (!this.isDead && this.state !== 'phase_shift') {
      if (this.phase === 1 && this.health <= this.maxHealth * 0.60) {
        this.phase = 2;
        this.state = 'phase_shift';
        this.stateTimer = 36;
        this.shockwaves.push({ x: this.x, y: this.y - this.logicalH * 0.45, r: 12, alpha: 0.9, color: '#f97316' });
        if (window.soundManager && window.soundManager.playBossFlameCharge) window.soundManager.playBossFlameCharge();
      } else if (this.phase === 2 && this.health <= this.maxHealth * 0.30) {
        this.phase = 3;
        this.state = 'phase_shift';
        this.stateTimer = 40;
        this.shockwaves.push({ x: this.x, y: this.y - this.logicalH * 0.45, r: 14, alpha: 0.95, color: '#ef4444' });
        if (window.soundManager && window.soundManager.playExplosion) window.soundManager.playExplosion();
      }
    }

    if (this.x < this.minX) {
      this.x = this.minX;
      this.hoverSpeedX = Math.abs(this.hoverSpeedX);
    } else if (this.x > this.maxX) {
      this.x = this.maxX;
      this.hoverSpeedX = -Math.abs(this.hoverSpeedX);
    }

    // 4. State Machine (Hit, Recoil, Flame, Meatball, Claw)
    this.flameActive = false;
    this.clawActive = false;
    this.lungeX = 0;

    if (this.pepperStunTimer > 0) {
      this.pepperStunTimer--;
      this.state = 'recoil';
      this.flameActive = false;
      this.clawActive = false;
      if (Math.random() < 0.4) {
        if (!this.armorSparks) this.armorSparks = [];
        this.armorSparks.push({
          x: this.x + (this.facing * -25) + (Math.random() - 0.5) * 16,
          y: this.y - this.logicalH * 0.45 + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 2,
          vy: -1 - Math.random() * 2,
          life: 12,
          maxLife: 12,
          color: Math.random() < 0.5 ? '#fef08a' : '#ffffff'
        });
      }
    } else if (this.state === 'phase_shift') {
      this.stateTimer--;
      this.hitFlashTimer = 2;
      if (this.stateTimer % 3 === 0) {
        this.armorSparks.push({
          x: this.x + (Math.random() - 0.5) * 44,
          y: this.y - Math.random() * this.logicalH,
          vx: (Math.random() - 0.5) * 3.5,
          vy: -1.5 - Math.random() * 2.5,
          life: 16,
          maxLife: 16,
          color: this.phase === 3 ? '#ef4444' : '#f97316'
        });
      }
      if (this.stateTimer <= 0) {
        this.state = 'idle';
        this.attackCooldown = 25;
      }
    } else if (this.state === 'dash_sweep') {
      this.stateTimer++;
      if (this.stateTimer === 1 && player) {
        this.dashDir = (player.x < this.x) ? -1 : 1;
        this.facing = this.dashDir;
        if (window.soundManager && window.soundManager.playBossTelegraphClaw) {
          window.soundManager.playBossTelegraphClaw();
        }
      }

      if (this.stateTimer <= 26) {
        // Telegraph windup: coil back before jet sweep
        this.lungeX = -this.dashDir * Math.sin((this.stateTimer / 26) * Math.PI * 0.5) * 10;
      } else if (this.stateTimer <= 58) {
        // High-speed Metroidvania horizontal jet sweep across the arena
        const sweepSpeed = this.phase === 3 ? 5.6 : 4.6;
        this.x += this.dashDir * sweepSpeed;
        this.lungeX = this.dashDir * 8;
        if (this.stateTimer % 3 === 0) {
          this.bossAfterimages.push({
            x: this.x,
            y: this.y,
            facing: this.facing,
            alpha: 0.5,
            spriteName: 'hover_08'
          });
          if (this.bossAfterimages.length > 4) this.bossAfterimages.shift();
        }
      } else {
        this.lungeX *= 0.85;
      }

      if (this.stateTimer >= 72) {
        this.state = 'idle';
        this.lungeX = 0;
        this.attackCooldown = this.phase === 3 ? 45 : 65;
      }
    } else if (this.state === 'hit') {
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
        // Pose 5: Peak Flame (reaches player standing on platform/ground)
        isFiring = true;
        flameW = 60;
        flameH = 24;
      } else if (relT >= 70 && relT < 86) {
        // Pose 6: Dissipating Embers & Smoke (Harmless!)
        isFiring = false;
        flameW = 28;
        flameH = 16;
      }

      this.flameActive = isFiring;
      const flameX = (this.facing === -1)
        ? (this.x + this.lungeX - this.logicalW * 0.38 - flameW)
        : (this.x + this.lungeX + this.logicalW * 0.38);
      // Flame origin aligned with boss mouth center
      const flameY = this.y - this.logicalH * 0.45;
      this.flameHitbox = { x: flameX, y: flameY, w: flameW, h: flameH + 8 };

      // Launch flying flame projectile at each designated interval
      if (fireFrames.includes(this.stateTimer)) {
        if (spawnProjectileCallback) {
          const nozzleX = this.x + this.lungeX + (this.facing * (this.logicalW * 0.38));
          const nozzleY = this.y - (this.logicalH * 0.45);
          const targetX = player ? player.x : (this.x + this.facing * 200);
          const targetY = player ? (player.y + 4) : this.y;
          spawnProjectileCallback(new BossFlameProjectile(nozzleX, nozzleY, targetX, targetY, this.facing));
        }
        if (window.soundManager && window.soundManager.playFlame) {
          window.soundManager.playFlame();
        }
      }

      // After 3rd flame launches and clears mouth at frame 290:
      // Snappy Metroidvania cooldown scaled by phase (instead of 5s wait)
      if (this.stateTimer >= (this.phase >= 2 ? 170 : 290)) {
        this.state = 'idle';
        this.attackCooldown = this.phase === 3 ? 45 : (this.phase === 2 ? 70 : 100);
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

      // Meatball ejection synchronized with Pose 4 (Launch Frame at frame 24; double salvo in Phase 3!)
      if (this.stateTimer === 24 || (this.phase === 3 && this.stateTimer === 36)) {
        if (spawnProjectileCallback && player) {
          const spawnX = this.x + (this.facing * (this.logicalW * 0.42));
          const spawnY = this.y - (this.logicalH * 0.45);
          const spread = (this.stateTimer === 36) ? (this.facing * -22) : 0;
          const targetX = player.x + (player.width ? player.width / 2 : 8) + spread + (Math.random() - 0.5) * 8;
          const targetY = player.y + 4;
          spawnProjectileCallback(new MeatballProjectile(spawnX, spawnY, targetX, targetY));
          if (window.soundManager && window.soundManager.playDrop) {
            window.soundManager.playDrop();
          }
        }
      }
      if (this.stateTimer > 52) {
        this.state = 'idle';
        this.attackCooldown = this.phase === 3 ? 42 : (this.phase === 2 ? 60 : 85);
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
        this.lungeX = Math.sin(progress * Math.PI) * (this.facing * 20); // 20px lunge forward toward player

        const clawReach = 58; // Formidable reach reaching player
        const clawH = 26;     // Covers full player height profile
        const clawX = (this.facing === -1)
          ? (this.x + this.lungeX - this.logicalW * 0.35 - clawReach)
          : (this.x + this.lungeX + this.logicalW * 0.35);
        const clawY = this.y - this.logicalH * 0.38;

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
        this.attackCooldown = this.phase === 3 ? 42 : (this.phase === 2 ? 62 : 85);
      }
    } else {
      // Idle state: phase-aware Metroidvania attack selection
      if (this.attackCooldown > 0) {
        this.attackCooldown--;
      } else {
        const distToPlayer = player ? Math.hypot(player.x - this.x, player.y - this.y) : 999;
        const verticalDiff = player ? Math.abs(player.y - this.y) : 999;
        const roll = Math.random();

        if (this.phase >= 2 && verticalDiff < 55 && roll < 0.34) {
          this.state = 'dash_sweep';
        } else if (distToPlayer < 110 && verticalDiff < 65) {
          this.state = Math.random() < 0.55 ? 'flame' : 'claw';
        } else if (roll < 0.45) {
          this.state = 'meatball';
        } else if (roll < 0.78) {
          this.state = 'flame';
        } else {
          this.state = 'claw';
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
   * Stun and blind boss with Pepper Cloud
   */
  onPepperHit() {
    if (this.health <= 0 || this.isDead || this.pepperStunTimer > 0) return;
    this.pepperStunTimer = 90; // 1.5s stun
    this.flameActive = false;
    this.clawActive = false;
    this.state = 'recoil';
    this.stateTimer = 90;
    this.hitFlashTimer = 20;

    // Spurt sneezing steam and sparks
    if (!this.armorSparks) this.armorSparks = [];
    for (let i = 0; i < 14; i++) {
      this.armorSparks.push({
        x: this.x + (this.facing * -20) + (Math.random() - 0.5) * 20,
        y: this.y - this.logicalH * 0.45 + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 4,
        vy: -2 - Math.random() * 3,
        size: 3,
        life: 20,
        maxLife: 20,
        color: Math.random() < 0.5 ? '#fef08a' : '#ffffff'
      });
    }

    if (window.burgerPanicGame) {
      window.burgerPanicGame.popups.push(new window.ScorePopup('¡CEGADO! 🧂', this.x - 20, this.y - this.logicalH * 0.8));
      window.burgerPanicGame.addScore(100, this.x, this.y);
      if (window.soundManager && window.soundManager.playBlip) {
        window.soundManager.playBlip();
      }
    }
  }

  /**
   * Check collision with player's blowtorch flame projectile
   * Features a critical weak spot on the open mouth / furnace core during attacks!
   */
  checkHitByFlame(projectile) {
    if (this.health <= 0 || this.isDead) return false;

    // 1. Weak Spot: Open Furnace Mouth / Exposed Core
    // When boss is in 'flame', 'meatball', 'recoil', or pepper-stunned, the mouth is wide open!
    const isMouthOpen = (this.state === 'flame' || this.state === 'meatball' || this.state === 'recoil' || this.pepperStunTimer > 0);
    if (isMouthOpen) {
      const mouthW = 34;
      const mouthH = 26;
      const mouthX = (this.facing === -1)
        ? (this.x - this.logicalW * 0.48)
        : (this.x + this.logicalW * 0.15);
      const mouthY = this.y - this.logicalH * 0.58;

      if (projectile.x >= mouthX && projectile.x <= mouthX + mouthW &&
          projectile.y >= mouthY && projectile.y <= mouthY + mouthH) {
        this.takeDamage(26, 'flame_crit');
        return 'crit';
      }
    }

    // 2. Body Armor Hitbox
    const left = this.x - this.logicalW * 0.5;
    const right = this.x + this.logicalW * 0.5;
    const top = this.y - this.logicalH;
    const bottom = this.y + 16;

    if (projectile.x >= left && projectile.x <= right &&
        projectile.y >= top && projectile.y <= bottom) {
      this.takeDamage(projectile.damage || 12, 'flame');
      return 'hit';
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
    if (piece.hitBossOnThisFall) return 0;

    const left = this.x - this.logicalW * 0.45;
    const right = this.x + this.logicalW * 0.45;
    const top = this.y - this.logicalH;
    const bottom = this.y + 16;

    // Burger piece bounds
    if (piece.x + 24 >= left && piece.x <= right &&
        piece.y + 12 >= top && piece.y <= bottom) {
      piece.hitBossOnThisFall = true;
      const dealt = this.takeDamage(150, 'burger');
      this.state = 'recoil';
      this.stateTimer = 90; // Heavy crush stuns boss in recoil
      return dealt || 150;
    }
    return 0;
  }

  takeDamage(amount, source = 'flame') {
    if (this.health <= 0) return 0;

    let effectiveDamage = amount;
    if (source === 'flame_crit') {
      effectiveDamage = 26; // High reward critical damage penetrating cyber armor!
    } else if (source === 'flame') {
      effectiveDamage = 12; // Solid visible chip damage
    } else if (source === 'burger') {
      effectiveDamage = 150; // Massive crushing crush damage
    }

    this.health = Math.max(0, this.health - effectiveDamage);
    this.hitFlashTimer = 10;

    // Spawn cyber-armor ricochet sparks (metal deflecting incoming impact)
    if (!this.armorSparks) this.armorSparks = [];
    const sparkCount = (source === 'burger' || source === 'flame_crit') ? 8 : 4;
    for (let s = 0; s < sparkCount; s++) {
      this.armorSparks.push({
        x: this.x + (Math.random() - 0.5) * 40,
        y: this.y - 45 + (Math.random() - 0.5) * 35,
        vx: (Math.random() - 0.5) * 3.5,
        vy: -1.2 - Math.random() * 2.2,
        life: 10,
        maxLife: 10,
        color: (source === 'flame_crit') ? '#00f0ff' : (Math.random() < 0.5 ? '#f97316' : '#fef08a')
      });
    }

    if (this.health <= 0) {
      this.state = 'explode';
      this.stateTimer = 0;
      return effectiveDamage;
    }

    // Recoil state when taking heavy hits
    if (source === 'burger') {
      this.state = 'recoil';
      this.stateTimer = 90;
    } else if (this.state === 'idle') {
      this.state = 'recoil';
      this.stateTimer = 15;
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

    // Metroidvania Phase 2/3 Thermal Overdrive Aura
    if (this.phase >= 2 && !this.isDead) {
      const auraPulse = 0.16 + Math.sin(this.animTimer * 0.18) * 0.08;
      ctx.save();
      ctx.globalAlpha = auraPulse;
      ctx.fillStyle = this.phase === 3 ? '#ef4444' : '#f97316';
      ctx.beginPath();
      ctx.ellipse(Math.round(this.x + this.lungeX), Math.round(this.y - renderH * 0.5), renderW * 0.52, renderH * 0.52, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Metroidvania Jet-Sweep Afterimages
    if (this.bossAfterimages && this.bossAfterimages.length > 0) {
      for (const ghost of this.bossAfterimages) {
        const gFlip = (ghost.facing === -1);
        ctx.save();
        ctx.globalAlpha = ghost.alpha * 0.55;
        sm.drawKiloburnerAtlas(ctx, ghost.spriteName, Math.round(ghost.x - renderW / 2), Math.round(ghost.y - renderH), renderW, renderH, gFlip);
        ctx.restore();
      }
    }

    // Clean, 100% solid, professional retro arcade sprite drawing (Zero lines, zero transparency ghosting)
    sm.drawKiloburnerAtlas(ctx, spriteName, drawX, drawY, renderW, renderH, flip);

    // Expanding Phase-Shift Shockwave Rings
    if (this.shockwaves && this.shockwaves.length > 0) {
      for (const sw of this.shockwaves) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(Math.round(sw.x), Math.round(sw.y), sw.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Solid damage flash (maintains 100% opacity, alternate hit frame)
    if (this.hitFlashTimer > 0 && Math.floor(this.hitFlashTimer / 2) % 2 === 0) {
      sm.drawKiloburnerAtlas(ctx, 'hit_00', drawX, drawY, renderW, renderH, flip);
    }

    // 7. Visual Telegraph Signs (Fair gameplay warning prompts!)
    // Telegraph prompt for Metroidvania Jet Dash Sweep
    if (this.state === 'dash_sweep' && this.stateTimer <= 26) {
      const pulse = Math.sin(this.stateTimer * 0.5) * 0.5 + 0.5;
      const lineY = Math.round(this.y - this.logicalH * 0.45);
      ctx.save();
      ctx.strokeStyle = pulse > 0.4 ? '#fef08a' : '#f97316';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(this.x - 180, lineY);
      ctx.lineTo(this.x + 180, lineY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = 'bold 6px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000000';
      ctx.fillText('⚡ ¡EMBESTIDA! ⚡', Math.round(this.x) + 1, lineY - 12 + 1);
      ctx.fillStyle = '#fef08a';
      ctx.fillText('⚡ ¡EMBESTIDA! ⚡', Math.round(this.x), lineY - 12);
      ctx.restore();
    }

    // Telegraph prompt for Hydraulic Claw Attack
    if (this.state === 'claw' && this.stateTimer <= 24) {
      const warnX = this.x + this.lungeX + (this.facing * (this.logicalW * 0.35));
      const warnY = this.y - this.logicalH * 0.48;
      const pulse = Math.sin(this.stateTimer * 0.45) * 0.5 + 0.5;
      const clawReach = 58;
      const clawH = 26;
      const zoneX = (this.facing === -1) ? (this.x - this.logicalW * 0.35 - clawReach) : (this.x + this.logicalW * 0.35);
      const zoneY = this.y - this.logicalH * 0.38;

      ctx.save();
      // Danger reach box preview
      ctx.strokeStyle = pulse > 0.4 ? 'rgba(56, 189, 248, 0.8)' : 'rgba(254, 240, 138, 0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(Math.round(zoneX), Math.round(zoneY), clawReach, clawH);
      ctx.setLineDash([]);

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

    // Left label: BOSS: KILOBURNER [F1/F2/F3]
    const phaseTag = this.phase === 3 ? 'F3!' : (this.phase === 2 ? 'F2' : 'F1');
    ctx.textAlign = 'left';
    ctx.fillStyle = '#000000';
    ctx.fillText(`KILOBURNER [${phaseTag}]`, barX + 1, 9);
    ctx.fillStyle = this.phase === 3 ? '#fef08a' : (this.phase === 2 ? '#fb923c' : '#ef4444');
    ctx.fillText(`KILOBURNER [${phaseTag}]`, barX, 8);

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

    // Trailing White/Amber Damage Catch-Up Bar
    const trailRatio = Math.max(0, Math.min(1, (this.trailingHealth || this.health) / this.maxHealth));
    const trailW = Math.round(barW * trailRatio);
    if (trailW > 0) {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(barX, barY, trailW, barH);
    }

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

    // Phase Threshold Notches (60% & 30%)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(barX + Math.round(barW * 0.60), barY, 1, barH);
    ctx.fillRect(barX + Math.round(barW * 0.30), barY, 1, barH);

    ctx.restore();
  }
}

window.KiloburnerBoss = KiloburnerBoss;
window.CryoProjectile = CryoProjectile;
window.MeatballProjectile = MeatballProjectile;
window.FlameProjectile = FlameProjectile;
window.BlowtorchPickup = BlowtorchPickup;
window.BossFlameProjectile = BossFlameProjectile;

