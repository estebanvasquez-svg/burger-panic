/**
 * Kiloburner - Giant Cyborg Boss & Exclusive Level 3 Weapon System
 * Burger Panic Mobile Arcade
 */

/**
 * Cryo Extinguisher Projectile (Exclusive Level 3 Player Weapon)
 * Rapid cryogenic CO2 bursts fired by Chef Pepe using Button B
 */
class CryoProjectile {
  constructor(x, y, dir = 1) {
    this.x = x;
    this.y = y;
    this.dir = dir; // 1 = right, -1 = left
    this.speed = 5.2; // High-speed ice blast
    this.vx = this.dir * this.speed;
    this.vy = (Math.random() - 0.5) * 0.4; // slight jitter
    this.radius = 6;
    this.life = 55; // frames
    this.maxLife = 55;
    this.particles = [];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    // Spawn sub-zero vapor and ice flake particles
    if (Math.random() < 0.75) {
      this.particles.push({
        x: this.x + (Math.random() - 0.5) * 6,
        y: this.y + (Math.random() - 0.5) * 6,
        vx: -this.vx * 0.2 + (Math.random() - 0.5) * 0.8,
        vy: -0.3 + (Math.random() - 0.5) * 0.8,
        life: 14 + Math.random() * 8,
        maxLife: 22,
        size: 1.5 + Math.random() * 2,
        color: Math.random() < 0.6 ? '#67e8f9' : '#ffffff'
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
    // Draw ice vapor trail
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha * 0.8;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), Math.round(p.size), Math.round(p.size));
      ctx.restore();
    }

    // Draw main cryogenic orb
    ctx.save();
    const pulse = Math.sin(Date.now() * 0.02) * 1.5;
    const r = Math.max(2, this.radius + pulse * 0.5);

    // Glowing cyan/white outer aura
    const grad = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, r + 4);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, '#38bdf8');
    grad.addColorStop(0.8, '#0284c7');
    grad.addColorStop(1, 'rgba(2, 132, 199, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r + 4, 0, Math.PI * 2);
    ctx.fill();

    // Solid core
    ctx.fillStyle = '#f0fdf4';
    ctx.beginPath();
    ctx.arc(this.x, this.y, r * 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
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
  constructor(arenaWidth = 320, arenaHeight = 320) {
    this.arenaWidth = arenaWidth;
    this.arenaHeight = arenaHeight;

    // Anchor position (center-bottom reference)
    this.x = 220; // Starts on the right side
    this.baseY = 120; // Hover level across mid platforms
    this.y = this.baseY;

    // Scale ratio from original ~240px sprite down to game size (~96x68)
    this.scale = 0.42;
    this.logicalW = 86;
    this.logicalH = 64;

    this.maxHealth = 300;
    this.health = 300;
    this.facing = -1; // -1 = looking left toward Chef Pepe

    // States: 'idle', 'lean', 'recoil', 'flame', 'meatball', 'claw', 'hit', 'explode', 'dead'
    this.state = 'idle';
    this.stateTimer = 0;
    this.hitFlashTimer = 0;
    this.attackCooldown = 100; // frames before first attack

    // Floating motion
    this.floatAngle = 0;
    this.hoverSpeedX = 0.35;
    this.minX = 140;
    this.maxX = arenaWidth - 55;

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

  update(player, gameFloors, spawnProjectileCallback) {
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

    // Horizontal patrol oscillation
    this.x += this.hoverSpeedX;
    if (this.x > this.maxX) {
      this.x = this.maxX;
      this.hoverSpeedX = -Math.abs(this.hoverSpeedX);
    } else if (this.x < this.minX) {
      this.x = this.minX;
      this.hoverSpeedX = Math.abs(this.hoverSpeedX);
    }

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
  checkHitByCryo(projectile) {
    if (this.health <= 0 || this.isDead) return false;

    // Body hitbox
    const left = this.x - this.logicalW * 0.45;
    const right = this.x + this.logicalW * 0.45;
    const top = this.y - this.logicalH;
    const bottom = this.y;

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

  draw(ctx, spriteManager) {
    if (!spriteManager) return;

    // Select sprite name based on state
    let spriteName = 'move_idle';

    if (this.state === 'recoil') spriteName = 'move_recoil';
    else if (this.state === 'lean') spriteName = 'move_lean';
    else if (this.state === 'flame') spriteName = 'attack_flame';
    else if (this.state === 'meatball') spriteName = 'attack_meatball';
    else if (this.state === 'claw') spriteName = 'attack_claw';
    else if (this.state === 'hit') spriteName = 'defeat_hit';
    else if (this.state === 'explode') spriteName = 'defeat_explode';
    else if (this.state === 'dead') spriteName = 'defeat_dead';

    const info = spriteManager.getKiloburnerAtlasInfo(spriteName);
    if (!info) return;

    const renderW = Math.round(info.w * this.scale);
    const renderH = Math.round(info.h * this.scale);

    // Anchor: draw relative to center x and bottom y
    // Facing: Kiloburner's original sprite faces left.
    // If facing === 1 (right), flip horizontally.
    const flip = (this.facing === 1);
    const drawX = Math.round(this.x - renderW / 2);
    const drawY = Math.round(this.y - renderH);

    ctx.save();

    // Damage flash effect (white / cyan silhouette flash)
    if (this.hitFlashTimer > 0 && Math.floor(this.hitFlashTimer / 2) % 2 === 0) {
      ctx.filter = 'brightness(2.2) drop-shadow(0 0 6px #38bdf8)';
    }

    // Low HP Warning Aura (Overheated engine pulse)
    if (this.health > 0 && this.health <= this.maxHealth * 0.3) {
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8 + Math.sin(Date.now() * 0.01) * 4;
    }

    spriteManager.drawKiloburnerAtlas(ctx, spriteName, drawX, drawY, renderW, renderH, flip);
    ctx.restore();

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
   * Render Retro Arcade Boss Health Bar at top of screen
   */
  drawBossHealthBar(ctx, screenWidth) {
    if (this.defeatSequenceDone) return;

    ctx.save();

    const barW = Math.min(220, screenWidth - 24);
    const barH = 12;
    const barX = Math.round((screenWidth - barW) / 2);
    const barY = 22;

    // Boss Name Plate with Flames & Cyber Skull
    ctx.font = 'bold 9px "Press Start 2P", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    // Text Shadow
    ctx.fillStyle = '#000000';
    ctx.fillText('🔥 KILOBURNER CYBORG BOSS 🔥', screenWidth / 2 + 1, barY - 2);

    // Text Gradient / Retro Chrome
    ctx.fillStyle = (this.health <= this.maxHealth * 0.25) ? '#ef4444' : '#fbbf24';
    ctx.fillText('🔥 KILOBURNER CYBORG BOSS 🔥', screenWidth / 2, barY - 3);

    // Bezel Frame
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(barX - 2, barY - 2, barW + 4, barH + 4);

    // Health Track (Dark Red background)
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(barX, barY, barW, barH);

    // Current HP Fill
    const healthRatio = Math.max(0, Math.min(1, this.health / this.maxHealth));
    const currentW = Math.round(barW * healthRatio);

    if (currentW > 0) {
      const hpGrad = ctx.createLinearGradient(barX, barY, barX + barW, barY);
      if (healthRatio > 0.5) {
        hpGrad.addColorStop(0, '#f59e0b');
        hpGrad.addColorStop(1, '#ef4444');
      } else if (healthRatio > 0.25) {
        hpGrad.addColorStop(0, '#eab308');
        hpGrad.addColorStop(1, '#dc2626');
      } else {
        hpGrad.addColorStop(0, '#ef4444');
        hpGrad.addColorStop(1, '#991b1b');
      }

      ctx.fillStyle = hpGrad;
      ctx.fillRect(barX, barY, currentW, barH);

      // Top gloss highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(barX, barY, currentW, Math.floor(barH / 2));
    }

    // Health numbers / percentage overlay
    ctx.font = '8px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${this.health}/${this.maxHealth}`, barX + barW - 4, barY + barH / 2);

    ctx.restore();
  }
}

window.KiloburnerBoss = KiloburnerBoss;
window.CryoProjectile = CryoProjectile;
window.MeatballProjectile = MeatballProjectile;
