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
      // Empty spent station bracket
      ctx.save();
      ctx.fillStyle = '#334155';
      ctx.fillRect(Math.round(this.x - 7), Math.round(this.y - 4), 14, 4);
      ctx.fillStyle = '#64748b';
      ctx.font = '6px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('USADO', Math.round(this.x), Math.round(this.y - 6));
      ctx.restore();
      return;
    }

    const bob = Math.sin(this.animTimer) * 2;
    const drawY = this.y - 18 + bob;

    ctx.save();

    // Bouncing overhead prompt (crisp 1px drop shadow, zero CPU shadowBlur)
    const tx = Math.round(this.x);
    const ty = Math.round(drawY - 6);
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.fillText('▼ SOPLETE ▼', tx + 1, ty + 1);
    ctx.fillStyle = '#fef08a';
    ctx.fillText('▼ SOPLETE ▼', tx, ty);

    // Fast glowing aura ring (zero createRadialGradient per frame)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.fillRect(Math.round(this.x - 9), Math.round(drawY + 1), 18, 15);

    // Gas Canister body (vivid blue industrial cylinder)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(Math.round(this.x - 5), Math.round(drawY + 5), 10, 11);
    // Canister highlight
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(Math.round(this.x - 4), Math.round(drawY + 6), 2, 9);
    // Metal base ring
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(Math.round(this.x - 6), Math.round(drawY + 15), 12, 2);

    // Brass valve / regulator
    ctx.fillStyle = '#eab308';
    ctx.fillRect(Math.round(this.x - 3), Math.round(drawY + 2), 6, 3);
    // Angled burner nozzle
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(Math.round(this.x + 2), Math.round(drawY - 1), 6, 3);

    // Animated pilot flame at the tip
    const flameSize = 2 + Math.random() * 2;
    ctx.fillStyle = Math.random() < 0.5 ? '#38bdf8' : '#f59e0b';
    ctx.beginPath();
    ctx.arc(this.x + 9, drawY, flameSize, 0, Math.PI * 2);
    ctx.fill();

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
 */
class MeatballProjectile {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 2.4;
    this.vx = (dx / dist) * speed;
    this.vy = Math.min(-1.5, (dy / dist) * speed - 1.2); // arc launch
    this.gravity = 0.12;
    this.bounces = 0;
    this.maxBounces = 2;
    this.radius = 7;
    this.life = 160;
    this.particles = [];
  }

  update(floors) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life--;

    // Check floor collision for bouncing
    if (floors && this.vy > 0) {
      for (const f of floors) {
        if (this.x >= f.x1 - 4 && this.x <= f.x2 + 4) {
          if (Math.abs(this.y - f.y) <= 6) {
            this.y = f.y - 4;
            this.vy = -Math.abs(this.vy) * 0.65;
            this.bounces++;
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
    // Trail
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha * 0.8;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), 3, 3);
      ctx.restore();
    }

    // Meatball core
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
    const speed = 3.6;
    this.vx = facing * speed;
    // Clamped vertical drift so Pepe can dodge by jumping, ducking, or climbing
    this.vy = Math.max(-1.1, Math.min(1.1, dy / 55));

    this.life = 180;
    this.maxLife = 180;
    this.bounces = 0;
    this.maxBounces = 999; // Projectile flies through the air; no bouncing
    this.animTimer = 0;
    this.scale = 0.48;
    this.width = Math.round(120 * this.scale);  // 58px
    this.height = Math.round(62 * this.scale); // 30px

    // Fair dodgeable hitbox centered near the leading incandescent head
    this.hitboxW = 22;
    this.hitboxH = 16;

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
    this.maxVerticalSpeed = 2.4; // Menacing, responsive cyber-thruster tracking speed
    this.minBaseY = 80;  // Ceiling gantry clearance (when player is on upper rails)
    this.maxBaseY = 314; // Full ground floor descent (boss lowers completely to player height)
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
      // Calculate target vertical position based on player's feet elevation (52, 120, 200, 288)
      // Lowers completely down to ground floor (y = 288) so boss torso & claws align with Chef Pepe!
      const targetBaseY = Math.max(this.minBaseY, Math.min(this.maxBaseY, player.y + 42));
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
    const hoverBob = Math.sin(this.floatAngle) * 6;
    this.y = this.baseY + hoverBob;

    // 3. Horizontal Viewport Anchoring (Follows auto-scrolling camera)
    const bossHalfW = Math.round(this.logicalW * 0.55);
    this.maxX = cameraX + 240 - bossHalfW - 8;
    this.minX = cameraX + 240 - bossHalfW - 65;

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
      // Head tilts forward slightly during flame burst
      this.lungeX = this.facing * 8;
      const flameW = 45;
      const flameH = 24;
      const flameX = (this.facing === -1)
        ? (this.x + this.lungeX - this.logicalW / 2 - flameW + 12)
        : (this.x + this.lungeX + this.logicalW / 2 - 12);
      const flameY = this.y - this.logicalH * 0.65;

      this.flameHitbox = { x: flameX, y: flameY, w: flameW, h: flameH };

      // Cadence requested: 3 flames separated by 2 seconds (120 frames at 60 FPS), then wait 5 seconds (300 frames)!
      // Shot 1 fires at frame 20
      // Shot 2 fires at frame 140 (20 + 120)
      // Shot 3 fires at frame 260 (140 + 120)
      const fireFrames = [20, 140, 260];
      const isFiring = fireFrames.some(f => (this.stateTimer >= f && this.stateTimer < f + 25));
      this.flameActive = isFiring;

      // Launch flying flame projectile at each designated interval
      if (fireFrames.includes(this.stateTimer)) {
        if (spawnProjectileCallback) {
          const nozzleX = this.x + this.lungeX + (this.facing * (this.logicalW * 0.40));
          const nozzleY = this.y - (this.logicalH * 0.62);
          const targetX = player ? player.x : (this.x + this.facing * 200);
          const targetY = player ? (player.y - 6) : this.y;
          spawnProjectileCallback(new BossFlameProjectile(nozzleX, nozzleY, targetX, targetY, this.facing));
        }
        if (window.soundManager && window.soundManager.playFlame) {
          window.soundManager.playFlame();
        }
      }

      // After 3rd flame launches and clears mouth at frame 280:
      // Transition to idle and wait 5.0 seconds (300 frames at 60 FPS) before next attack!
      if (this.stateTimer >= 280) {
        this.state = 'idle';
        this.attackCooldown = 300; // Exactly 5 seconds cooldown!
      }
    } else if (this.state === 'meatball') {
      this.stateTimer++;
      if (this.stateTimer === 15 || this.stateTimer === 28) {
        if (spawnProjectileCallback && player) {
          const spawnX = this.x + (this.facing * (this.logicalW * 0.35));
          const spawnY = this.y - (this.logicalH * 0.55);
          const targetX = player.x + (Math.random() - 0.5) * 25;
          const targetY = player.y;
          spawnProjectileCallback(new MeatballProjectile(spawnX, spawnY, targetX, targetY));
          if (window.soundManager && window.soundManager.playDrop) {
            window.soundManager.playDrop();
          }
        }
      }
      if (this.stateTimer > 45) {
        this.state = 'idle';
        this.attackCooldown = 65 + Math.random() * 40;
      }
    } else if (this.state === 'claw') {
      this.stateTimer++;
      // High-speed ferocious hydraulic lunge
      if (this.stateTimer >= 10 && this.stateTimer <= 35) {
        const progress = (this.stateTimer - 10) / 25;
        this.lungeX = Math.sin(progress * Math.PI) * (this.facing * 22);
      }
      const clawReach = 70;
      const clawH = 26;
      const clawX = (this.facing === -1)
        ? (this.x + this.lungeX - this.logicalW / 2 - clawReach)
        : (this.x + this.lungeX + this.logicalW / 2);
      const clawY = this.y - this.logicalH * 0.5;

      this.clawHitbox = { x: clawX, y: clawY, w: clawReach, h: clawH };
      this.clawActive = (this.stateTimer >= 12 && this.stateTimer <= 35);

      if (this.clawActive && this.stateTimer % 3 === 0) {
        // Hydraulic slash blur particles & steam
        this.clawSlashParticles.push({
          x: clawX + (this.facing === -1 ? 0 : clawReach),
          y: clawY + Math.random() * clawH,
          vx: -this.facing * (1.5 + Math.random() * 2),
          vy: (Math.random() - 0.5) * 2,
          life: 8,
          maxLife: 8,
          color: Math.random() < 0.5 ? '#38bdf8' : '#e2e8f0'
        });
      }

      if (this.stateTimer > 45) {
        this.state = 'idle';
        this.attackCooldown = 75 + Math.random() * 45;
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

    // 1. Direct Body Contact (Colossal mechanical furnace hull, chest core, claws & thrusters)
    const bLeft = centerX - this.logicalW * 0.42;
    const bRight = centerX + this.logicalW * 0.42;
    const bTop = this.y - this.logicalH;
    const bBottom = this.y + 8;

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
      // 8-frame ultra-fluid claw strike cycle (45 frames total, ~5.5 frames per in-between)
      const clawIdx = Math.min(7, Math.floor(this.stateTimer / 5.5));
      spriteName = 'claw_' + String(clawIdx).padStart(2, '0');
    } else if (this.state === 'flame') {
      // 3-shot burst animation rhythm matching 120-frame (2s) intervals
      const relT = (this.stateTimer < 240) ? (this.stateTimer % 120) : (this.stateTimer - 240);
      if (relT < 12) {
        spriteName = 'flame_00'; // Preparing flame
      } else if (relT < 20) {
        spriteName = 'flame_01'; // Ignition spark in mouth
      } else if (relT < 35) {
        spriteName = 'flame_02'; // Incandescent mouth launch burst
      } else if (relT < 50) {
        spriteName = 'flame_03'; // Flame discharge thrust
      } else if (relT < 65) {
        spriteName = 'flame_04'; // Exhaust dissipation
      } else if (relT < 80) {
        spriteName = 'flame_06'; // Mouth closing
      } else {
        spriteName = 'hover_04'; // Hovering between burst shots
      }
    } else if (this.state === 'meatball') {
      spriteName = (this.stateTimer % 10 < 5) ? 'attack_meatball' : 'hover_08';
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

    // 7. Draw Hydraulic Claw Slashing Arc Blades
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

