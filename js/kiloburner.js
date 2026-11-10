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
    // Default to right side when in wide scrolling arena (e.g. 1555 in 1600px stage)
    this.x = (initialX !== null) ? initialX : (arenaWidth > 320 ? arenaWidth - 45 : 275);
    this.baseY = 205; // Hover level aligning with combat platforms (y = 200)
    this.y = this.baseY;

    // Scale ratio from original ~240px sprite down to game size (~96x68)
    this.scale = 0.58; // Expanded formidable boss size
    this.logicalW = 120;
    this.logicalH = 88;
    this.baseY = 215;

    this.maxHealth = 750; // Increased stamina & epic boss durability
    this.health = 750;
    this.animTimer = 0;
    this.facing = -1; // -1 = looking left toward Chef Pepe

    // States: 'idle', 'lean', 'recoil', 'flame', 'meatball', 'claw', 'hit', 'explode', 'dead'
    this.state = 'idle';
    this.stateTimer = 0;
    this.hitFlashTimer = 0;
    this.attackCooldown = 100; // frames before first attack

    // Floating motion
    this.floatAngle = 0;
    this.hoverSpeedX = 0.30;
    this.minX = 220;
    this.maxX = 315;

    // Defeat states
    this.isDead = false;
    this.defeatSequenceDone = false;
    this.explosionList = [];
    this.deadFallVy = 0;

    // Flame attack hit zone
    this.flameActive = false;
    this.flameHitbox = { x: 0, y: 0, w: 0, h: 0 };

    // Claw attack reach
    this.clawActive = false;
    this.clawHitbox = { x: 0, y: 0, w: 0, h: 0 };
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
    // ACTIVE COMBAT BEHAVIOR
    // ----------------------------------------------------

    // Determine facing direction toward Player
    if (player && this.state === 'idle') {
      const targetFacing = (player.x < this.x) ? -1 : 1;
      this.facing = targetFacing;
    }

    // State machine updates
    this.flameActive = false;
    this.clawActive = false;

    if (this.state === 'hit') {
      this.stateTimer--;
      if (this.stateTimer <= 0) {
        this.state = 'idle';
      }
      return;
    }

    if (this.state === 'recoil') {
      this.stateTimer--;
      this.x -= this.facing * 0.8; // pushback
      if (this.stateTimer <= 0) {
        this.state = 'idle';
      }
      return;
    }

    if (this.state === 'flame') {
      this.stateTimer++;
      // The flame hitbox extends in front of Kiloburner
      const flameW = 80;
      const flameH = 26;
      const flameX = (this.facing === -1)
        ? (this.x - this.logicalW / 2 - flameW + 10)
        : (this.x + this.logicalW / 2 - 10);
      const flameY = this.y - this.logicalH * 0.65;

      this.flameHitbox = { x: flameX, y: flameY, w: flameW, h: flameH };
      this.flameActive = (this.stateTimer >= 15 && this.stateTimer <= 55);

      if (this.stateTimer > 65) {
        this.state = 'idle';
        this.attackCooldown = 80 + Math.random() * 50;
      }
      return;
    }

    if (this.state === 'meatball') {
      this.stateTimer++;
      // Fire meatballs at frame 15 and 28
      if (this.stateTimer === 15 || this.stateTimer === 28) {
        if (spawnProjectileCallback && player) {
          const spawnX = this.x + (this.facing * (this.logicalW * 0.35));
          const spawnY = this.y - (this.logicalH * 0.55);
          const targetX = player.x + (Math.random() - 0.5) * 30;
          const targetY = player.y;
          spawnProjectileCallback(new MeatballProjectile(spawnX, spawnY, targetX, targetY));
          if (window.soundManager && window.soundManager.playDrop) {
            window.soundManager.playDrop();
          }
        }
      }
      if (this.stateTimer > 45) {
        this.state = 'idle';
        this.attackCooldown = 70 + Math.random() * 45;
      }
      return;
    }

    if (this.state === 'claw') {
      this.stateTimer++;
      const clawReach = 65;
      const clawH = 24;
      const clawX = (this.facing === -1)
        ? (this.x - this.logicalW / 2 - clawReach)
        : (this.x + this.logicalW / 2);
      const clawY = this.y - this.logicalH * 0.5;

      this.clawHitbox = { x: clawX, y: clawY, w: clawReach, h: clawH };
      this.clawActive = (this.stateTimer >= 12 && this.stateTimer <= 35);

      if (this.stateTimer > 45) {
        this.state = 'idle';
        this.attackCooldown = 80 + Math.random() * 50;
      }
      return;
    }

    // ----------------------------------------------------
    // IDLE PATROL & ATTACK DECISION
    // ----------------------------------------------------
    this.floatAngle += 0.05;
    this.y = this.baseY + Math.sin(this.floatAngle) * 16;

    // Boss patrol anchored to the advancing viewport:
    // Keeps Kiloburner 100% completely visible on screen (never cut in half by right screen boundary)
    const bossHalfW = Math.round(this.logicalW * 0.55); // ~66px margin
    this.maxX = cameraX + 240 - bossHalfW - 8;  // ~cameraX + 166 (8px safety margin from right edge)
    this.minX = cameraX + 240 - bossHalfW - 38; // ~cameraX + 136 (smooth hover swing zone)

    if (this.x < this.minX) {
      this.x = this.minX;
      this.hoverSpeedX = Math.abs(this.hoverSpeedX);
    } else if (this.x > this.maxX) {
      this.x = this.maxX;
      this.hoverSpeedX = -Math.abs(this.hoverSpeedX);
    }

    // Horizontal patrol oscillation
    this.x += this.hoverSpeedX;

    // Attack cooldown management
    if (this.attackCooldown > 0) {
      this.attackCooldown--;
    } else {
      // Pick attack based on distance and random strategy
      const distToPlayer = player ? Math.hypot(player.x - this.x, player.y - this.y) : 999;
      const verticalDiff = player ? Math.abs(player.y - this.y) : 999;

      if (distToPlayer < 90 && verticalDiff < 35) {
        // Close range: Flame or Claw
        this.state = Math.random() < 0.55 ? 'flame' : 'claw';
      } else {
        // Mid/Long range: Meatballs or Flame
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
    const drawX = Math.round(this.x - renderW / 2);
    const drawY = Math.round(this.y - renderH);

    ctx.save();

    // 1. Draw Heavy Industrial Suspension Cables holding Boss from the Ceiling (ONLY cables support the boss)
    if (this.state !== 'dead') {
      const bossTopY = Math.round(this.y - this.logicalH * 0.85);
      const isFlipped = flip;
      const sway = Math.sin(this.floatAngle) * 5;

      // 4 heavy power & coolant conduits plugged into cranial sockets across expanded cyber skull
      const cables = [
        {
          anchorX: Math.round(this.x + (isFlipped ? 54 : -54) + sway * 0.6),
          socketX: Math.round(this.x + (isFlipped ? 42 : -42)),
          socketY: bossTopY + 12,
          curveOffset: (isFlipped ? 16 : -16) + sway,
          color: '#1e293b',
          hiColor: '#475569',
          width: 4,
          pulseSpeed: 0.003
        },
        {
          anchorX: Math.round(this.x + (isFlipped ? 28 : -28) + sway * 0.4),
          socketX: Math.round(this.x + (isFlipped ? 22 : -22)),
          socketY: bossTopY + 4,
          curveOffset: (isFlipped ? 8 : -8) + sway * 0.8,
          color: '#0f172a',
          hiColor: '#334155',
          width: 4.5,
          pulseSpeed: 0.004
        },
        {
          anchorX: Math.round(this.x + (isFlipped ? 6 : -6) + sway * 0.3),
          socketX: Math.round(this.x + (isFlipped ? 6 : -6)),
          socketY: bossTopY + 6,
          curveOffset: (isFlipped ? -8 : 8) + sway * 0.7,
          color: '#1e293b',
          hiColor: '#475569',
          width: 4,
          pulseSpeed: 0.005
        },
        {
          anchorX: Math.round(this.x + (isFlipped ? -24 : 24) + sway * 0.5),
          socketX: Math.round(this.x + (isFlipped ? -14 : 14)),
          socketY: bossTopY + 18,
          curveOffset: (isFlipped ? -18 : 18) + sway * 1.1,
          color: '#0f172a',
          hiColor: '#38bdf8',
          width: 3.5,
          pulseSpeed: 0.0035
        }
      ];

      for (const c of cables) {
        // Ceiling anchor clamp box at top gantry (y = 0)
        ctx.fillStyle = '#334155';
        ctx.fillRect(c.anchorX - 3, 0, 6, 8);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(c.anchorX - 2, 0, 4, 3);
        // Yellow safety hazard accent on clamp
        ctx.fillStyle = '#eab308';
        ctx.fillRect(c.anchorX - 2, 5, 4, 2);

        // Cable Shadow/Backing
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = c.width + 1.5;
        ctx.beginPath();
        ctx.moveTo(c.anchorX, 0);
        const ctrlX = (c.anchorX + c.socketX) / 2 + c.curveOffset;
        const ctrlY = (c.socketY) * 0.45;
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

      // Occasional electric arc spark jumping at cranial sockets
      if (Math.random() < 0.20) {
        if (!this.cableSparks) this.cableSparks = [];
        const sc = cables[Math.floor(Math.random() * cables.length)];
        this.cableSparks.push({
          x: sc.socketX + (Math.random() - 0.5) * 6,
          y: sc.socketY + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 2,
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

      ctx.translate(this.x, this.y);
      ctx.rotate(flip ? -tilt : tilt);
      ctx.scale(breathX, breathY);
      ctx.translate(-this.x, -this.y);
    }

    sm.drawKiloburnerAtlas(ctx, spriteName, drawX, drawY, renderW, renderH, flip);

    // Damage flash overlay (fast alpha tint, zero slow CSS filter)
    if (this.hitFlashTimer > 0 && Math.floor(this.hitFlashTimer / 2) % 2 === 0) {
      ctx.globalAlpha = 0.45;
      sm.drawKiloburnerAtlas(ctx, 'hit_00', drawX, drawY, renderW, renderH, flip);
      ctx.globalAlpha = 1.0;
    }

    // 60 Hz Pulsing Cybernetic Crimson Eye Flare (zero createRadialGradient per frame)
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
    }

    ctx.restore(); // restore boss body transform
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

