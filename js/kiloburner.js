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
    this.maxVerticalSpeed = 1.8; // Menacing, responsive cyber-thruster tracking speed
    this.minBaseY = 105; // Ceiling gantry clearance (when player is on upper rails)
    this.maxBaseY = 276; // Ground floor clearance (hovering just above floor grates)
    this.lungeX = 0;     // Horizontal attack thrust

    // Scale ratio from original ~240px sprite down to game size (~96x68)
    this.scale = 0.58; // Expanded formidable boss size
    this.logicalW = 120;
    this.logicalH = 88;

    this.maxHealth = 750; // Epic boss durability
    this.health = 750;
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

    // Flame attack hit zone & particle stream
    this.flameActive = false;
    this.flameHitbox = { x: 0, y: 0, w: 0, h: 0 };
    this.flameParticles = [];

    // Claw attack reach & kinetic effects
    this.clawActive = false;
    this.clawHitbox = { x: 0, y: 0, w: 0, h: 0 };
    this.clawSlashParticles = [];

    // Jet Thrusters & Mechanical particle systems
    this.thrusterParticles = [];
    this.cableSparks = [];
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
      // Muzzle / eye aligns with Chef Pepe's torso
      const targetBaseY = Math.max(this.minBaseY, Math.min(this.maxBaseY, player.y + 48));
      const dy = targetBaseY - this.baseY;

      // Heavyweight responsive acceleration
      const accel = 0.055;
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
    this.minX = cameraX + 240 - bossHalfW - 40;

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
      // Head tilts forward slightly during flame
      this.lungeX = this.facing * 8;
      const flameW = 85;
      const flameH = 30;
      const flameX = (this.facing === -1)
        ? (this.x + this.lungeX - this.logicalW / 2 - flameW + 12)
        : (this.x + this.lungeX + this.logicalW / 2 - 12);
      const flameY = this.y - this.logicalH * 0.65;

      this.flameHitbox = { x: flameX, y: flameY, w: flameW, h: flameH };
      this.flameActive = (this.stateTimer >= 15 && this.stateTimer <= 55);

      if (this.flameActive) {
        if (this.stateTimer === 15 && window.soundManager && window.soundManager.playFlame) {
          window.soundManager.playFlame();
        }
        // Spawn active firestorm particles
        const nozzleX = this.x + this.lungeX + (this.facing * (this.logicalW * 0.40));
        const nozzleY = this.y - (this.logicalH * 0.62);
        for (let p = 0; p < 4; p++) {
          this.flameParticles.push({
            x: nozzleX,
            y: nozzleY + (Math.random() - 0.5) * 6,
            vx: this.facing * (4.5 + Math.random() * 2.8),
            vy: (Math.random() - 0.5) * 1.8,
            life: 14 + Math.random() * 8,
            maxLife: 22,
            size: 3 + Math.random() * 3,
            maxSize: 14 + Math.random() * 6,
            color: Math.random() < 0.4 ? '#ffffff' : (Math.random() < 0.75 ? '#f59e0b' : '#ef4444')
          });
        }
      }

      if (this.stateTimer > 65) {
        this.state = 'idle';
        this.attackCooldown = 75 + Math.random() * 45;
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
    for (let i = this.flameParticles.length - 1; i >= 0; i--) {
      const p = this.flameParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.size = Math.min(p.maxSize, p.size + 0.6);
      p.life--;
      if (p.life <= 0) this.flameParticles.splice(i, 1);
    }
    for (let i = this.clawSlashParticles.length - 1; i >= 0; i--) {
      const p = this.clawSlashParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) this.clawSlashParticles.splice(i, 1);
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
    if (this.health <= 0 || this.isDead || !piece.falling) return false;

    const left = this.x - this.logicalW * 0.45;
    const right = this.x + this.logicalW * 0.45;
    const top = this.y - this.logicalH;
    const bottom = this.y;

    // Burger piece bounds
    if (piece.x + 24 >= left && piece.x <= right &&
        piece.y + 12 >= top && piece.y <= bottom) {
      this.takeDamage(50, 'burger');
      return true;
    }
    return false;
  }

  takeDamage(amount, source = 'cryo') {
    if (this.health <= 0) return;
    this.health = Math.max(0, this.health - amount);
    this.hitFlashTimer = 10;

    if (this.health <= 0) {
      this.state = 'explode';
      this.stateTimer = 0;
      return;
    }

    // Flinch state
    if (source === 'burger') {
      this.state = 'hit';
      this.stateTimer = 22; // Longer stun
    } else {
      if (this.state === 'idle') {
        this.state = 'recoil';
        this.stateTimer = 10;
      }
    }
  }

  /**
   * Check if Boss hits Player with body, flame, or claw
   */
  checkPlayerDamage(player) {
    if (this.health <= 0 || !player || player.isDead || player.isInvulnerable) return false;

    const pBox = {
      x: player.x + 2,
      y: player.y,
      w: 12,
      h: 16
    };

    // 1. Direct Body Contact
    const bLeft = this.x - this.logicalW * 0.35;
    const bRight = this.x + this.logicalW * 0.35;
    const bTop = this.y - this.logicalH * 0.85;
    const bBottom = this.y;

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
      // 8-frame ultra-fluid flame stream cycle (65 frames total, ~8 frames per in-between)
      const flameIdx = Math.min(7, Math.floor(this.stateTimer / 8));
      spriteName = 'flame_' + String(flameIdx).padStart(2, '0');
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

    // 0. Draw Underbody Plasma Jet Thrusters (Visual explanation of vertical flight)
    if (this.state !== 'dead') {
      const isAscending = (this.vy < -0.15);
      const thrusterOffsets = [-22, 22];
      for (const offX of thrusterOffsets) {
        const tX = Math.round(this.x + this.lungeX + (flip ? -offX : offX));
        const tY = Math.round(this.y - 4);

        // Metallic thruster bracket / nozzle bell
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(tX - 4, tY - 3, 8, 4);
        ctx.fillStyle = '#475569';
        ctx.fillRect(tX - 3, tY - 3, 6, 1);

        // Pulsing jet flame cone
        const flameLen = isAscending ? (24 + Math.random() * 8) : (14 + Math.random() * 5);
        const flameW = isAscending ? 6 : 4;

        // Outer orange/red flame cone
        ctx.fillStyle = isAscending ? '#f97316' : '#ef4444';
        ctx.beginPath();
        ctx.moveTo(tX - flameW, tY);
        ctx.lineTo(tX + flameW, tY);
        ctx.lineTo(tX, tY + flameLen);
        ctx.closePath();
        ctx.fill();

        // Inner incandescent cyan/white core
        ctx.fillStyle = isAscending ? '#38bdf8' : '#ffffff';
        ctx.beginPath();
        ctx.moveTo(tX - flameW * 0.5, tY);
        ctx.lineTo(tX + flameW * 0.5, tY);
        ctx.lineTo(tX, tY + flameLen * 0.55);
        ctx.closePath();
        ctx.fill();
      }

      // Draw active thruster particles
      for (const p of this.thrusterParticles) {
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha * 0.85;
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.round(p.size), Math.round(p.size));
        ctx.restore();
      }
    }

    // 1. Draw Heavy Industrial Suspension Cables holding Boss from the Ceiling
    if (this.state !== 'dead') {
      const bossTopY = Math.round(this.y - this.logicalH * 0.85);
      const isFlipped = flip;
      const sway = Math.sin(this.floatAngle) * 5;

      // 4 heavy power & coolant conduits plugged into cranial sockets across expanded cyber skull
      const cables = [
        {
          anchorX: Math.round(this.x + this.lungeX + (isFlipped ? 54 : -54) + sway * 0.6),
          socketX: Math.round(this.x + this.lungeX + (isFlipped ? 42 : -42)),
          socketY: bossTopY + 12,
          curveOffset: (isFlipped ? 16 : -16) + sway,
          color: '#1e293b',
          hiColor: '#475569',
          width: 4,
          pulseSpeed: 0.003
        },
        {
          anchorX: Math.round(this.x + this.lungeX + (isFlipped ? 28 : -28) + sway * 0.4),
          socketX: Math.round(this.x + this.lungeX + (isFlipped ? 22 : -22)),
          socketY: bossTopY + 4,
          curveOffset: (isFlipped ? 8 : -8) + sway * 0.8,
          color: '#0f172a',
          hiColor: '#334155',
          width: 4.5,
          pulseSpeed: 0.004
        },
        {
          anchorX: Math.round(this.x + this.lungeX + (isFlipped ? 6 : -6) + sway * 0.3),
          socketX: Math.round(this.x + this.lungeX + (isFlipped ? 6 : -6)),
          socketY: bossTopY + 6,
          curveOffset: (isFlipped ? -8 : 8) + sway * 0.7,
          color: '#1e293b',
          hiColor: '#475569',
          width: 4,
          pulseSpeed: 0.005
        },
        {
          anchorX: Math.round(this.x + this.lungeX + (isFlipped ? -24 : 24) + sway * 0.5),
          socketX: Math.round(this.x + this.lungeX + (isFlipped ? -14 : 14)),
          socketY: bossTopY + 18,
          curveOffset: (isFlipped ? -18 : 18) + sway * 1.1,
          color: '#0f172a',
          hiColor: '#38bdf8',
          width: 3.5,
          pulseSpeed: 0.0035
        }
      ];

      for (const c of cables) {
        // Ceiling anchor clamp box at top gantry (y = 0) with sliding runner trolley
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(c.anchorX - 5, 0, 10, 8);
        ctx.fillStyle = '#334155';
        ctx.fillRect(c.anchorX - 4, 1, 8, 6);
        ctx.fillStyle = '#eab308'; // Hazard warning strip
        ctx.fillRect(c.anchorX - 3, 5, 6, 2);
        // Trolley runner wheel
        ctx.fillStyle = '#64748b';
        ctx.fillRect(c.anchorX - 3, 0, 6, 2);

        // Cable Shadow/Backing
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = c.width + 1.5;
        ctx.beginPath();
        ctx.moveTo(c.anchorX, 0);
        const ctrlX = (c.anchorX + c.socketX) / 2 + c.curveOffset;
        const ctrlY = Math.max(12, c.socketY * 0.45);
        ctx.quadraticCurveTo(ctrlX, ctrlY, c.socketX, c.socketY);
        ctx.stroke();

        // Main braided jacket
        ctx.strokeStyle = c.color;
        ctx.lineWidth = c.width;
        ctx.beginPath();
        ctx.moveTo(c.anchorX, 0);
        ctx.quadraticCurveTo(ctrlX, ctrlY, c.socketX, c.socketY);
        ctx.stroke();

        // Center highlight line
        ctx.strokeStyle = c.hiColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(c.anchorX, 0);
        ctx.quadraticCurveTo(ctrlX, ctrlY, c.socketX, c.socketY);
        ctx.stroke();

        // Glowing cyber energy pulses traveling down the cable into Kiloburner
        const pulseProgress = (Date.now() * c.pulseSpeed) % 1;
        const pt = 1 - pulseProgress;
        const pulseX = (1 - pt) * (1 - pt) * c.anchorX + 2 * (1 - pt) * pt * ctrlX + pt * pt * c.socketX;
        const pulseY = (1 - pt) * (1 - pt) * 0 + 2 * (1 - pt) * pt * ctrlY + pt * pt * c.socketY;

        ctx.fillStyle = (c.hiColor === '#38bdf8') ? '#38bdf8' : '#ef4444';
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
        ctx.fill();

        // Boss armored socket port / collar on cyber skull
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(c.socketX - 3, c.socketY - 3, 6, 6);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.strokeRect(c.socketX - 3, c.socketY - 3, 6, 6);
      }

      // Occasional electric arc spark jumping at cranial sockets or ceiling rail
      if (Math.random() < 0.25) {
        if (!this.cableSparks) this.cableSparks = [];
        const sc = cables[Math.floor(Math.random() * cables.length)];
        const atCeiling = Math.random() < 0.4;
        this.cableSparks.push({
          x: atCeiling ? sc.anchorX : sc.socketX + (Math.random() - 0.5) * 6,
          y: atCeiling ? 4 : sc.socketY + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 2.5,
          vy: atCeiling ? (Math.random() * 2) : (-Math.random() * 2),
          color: Math.random() < 0.5 ? '#38bdf8' : '#fef08a',
          life: 8,
          maxLife: 8
        });
      }
      if (this.cableSparks) {
        for (let i = this.cableSparks.length - 1; i >= 0; i--) {
          const spk = this.cableSparks[i];
          spk.x += spk.vx;
          spk.y += spk.vy;
          spk.life--;
          ctx.save();
          ctx.fillStyle = spk.color;
          ctx.fillRect(Math.round(spk.x), Math.round(spk.y), 2, 2);
          ctx.restore();
          if (spk.life <= 0) this.cableSparks.splice(i, 1);
        }
      }
    }

    // 60 Hz Micro-Transforms for Organic 60 FPS Respiration & Tilting
    ctx.save();
    if (this.state !== 'dead') {
      const breathY = 1.0 + Math.sin(this.animTimer * 0.08) * 0.022;
      const breathX = 1.0 - Math.sin(this.animTimer * 0.08) * 0.012;
      const tilt = Math.sin(this.floatAngle) * 0.032;

      ctx.translate(this.x + this.lungeX, this.y);
      ctx.rotate(flip ? -tilt : tilt);
      ctx.scale(breathX, breathY);
      ctx.translate(-(this.x + this.lungeX), -this.y);
    }

    sm.drawKiloburnerAtlas(ctx, spriteName, drawX, drawY, renderW, renderH, flip);

    // Damage flash overlay (fast alpha tint, zero slow CSS filter)
    if (this.hitFlashTimer > 0 && Math.floor(this.hitFlashTimer / 2) % 2 === 0) {
      ctx.globalAlpha = 0.45;
      sm.drawKiloburnerAtlas(ctx, 'hit_00', drawX, drawY, renderW, renderH, flip);
      ctx.globalAlpha = 1.0;
    }

    // Chest Cybernetic Combustion Furnace Core (Glows behind iron rib grille)
    if (this.state !== 'dead') {
      const coreRelX = (info.w * 0.45) * this.scale;
      const coreRelY = (info.h * 0.56) * this.scale;
      const coreX = Math.round(flip ? (drawX + renderW - coreRelX) : (drawX + coreRelX));
      const coreY = Math.round(drawY + coreRelY);

      // Core intensity increases when attacking or charging
      const isCharging = (this.state === 'flame' || this.state === 'meatball');
      const pulseSpeed = isCharging ? 0.35 : 0.12;
      const coreBrightness = isCharging ? (0.75 + Math.sin(this.animTimer * pulseSpeed) * 0.25) : (0.45 + Math.sin(this.animTimer * pulseSpeed) * 0.20);

      // Outer thermal radiation aura
      ctx.fillStyle = isCharging ? `rgba(254, 240, 138, ${coreBrightness * 0.75})` : `rgba(249, 115, 22, ${coreBrightness * 0.65})`;
      ctx.fillRect(coreX - 7, coreY - 6, 14, 12);

      // Hot molten center
      ctx.fillStyle = isCharging ? '#ffffff' : '#facc15';
      ctx.fillRect(coreX - 4, coreY - 4, 8, 8);

      // Industrial iron grille slats over the core
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(coreX - 6, coreY - 4, 12, 1.5);
      ctx.fillRect(coreX - 6, coreY - 1, 12, 1.5);
      ctx.fillRect(coreX - 6, coreY + 2, 12, 1.5);
    }

    // 60 Hz Pulsing Cybernetic Crimson Eye Flare
    if (this.state !== 'dead' && this.hitFlashTimer <= 0) {
      const eyeRelX = (info.w * 0.38) * this.scale;
      const eyeRelY = (info.h * 0.40) * this.scale;
      const eyeX = Math.round(flip ? (drawX + renderW - eyeRelX) : (drawX + eyeRelX));
      const eyeY = Math.round(drawY + eyeRelY);
      const eyePulse = 0.55 + Math.sin(this.animTimer * 0.16) * 0.35;

      ctx.fillStyle = `rgba(239, 68, 68, ${(0.38 * eyePulse).toFixed(2)})`;
      ctx.fillRect(eyeX - 4, eyeY - 4, 8, 8);
      ctx.fillStyle = 'rgba(255, 245, 245, 0.92)';
      ctx.fillRect(eyeX - 1, eyeY - 1, 2, 2);

      // Targeting laser line pointing toward player
      if (this.state === 'idle' || this.state === 'meatball') {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(eyeX, eyeY);
        ctx.lineTo(eyeX + (flip ? -90 : 90), eyeY + (Math.sin(this.floatAngle) * 8));
        ctx.stroke();
      }
    }

    ctx.restore(); // restore boss body transform

    // 6. Draw Active Real-Time Flamethrower Firestorm Particles
    if (this.flameParticles && this.flameParticles.length > 0) {
      for (const fp of this.flameParticles) {
        const alpha = Math.max(0, fp.life / fp.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha * 0.88;
        ctx.fillStyle = fp.color;
        ctx.beginPath();
        ctx.arc(fp.x, fp.y, fp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
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

    const barW = 108;
    const barH = 5;
    const barX = Math.round((screenWidth - barW) / 2); // 66
    const barY = 12;

    // 1. Sleek Compact Boss Header Label (y = 8)
    ctx.font = 'bold 5.5px "Press Start 2P", monospace, sans-serif';
    ctx.textBaseline = 'middle';

    // Left label: BOSS: KILOBURNER (crisp 1px shadow, zero shadowBlur)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#000000';
    ctx.fillText('KILOBURNER', barX + 1, 9);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('KILOBURNER', barX, 8);

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

