/**
 * Entities: Player (Chef Pepe), Enemies (Hot Dog, Pickle, Egg), Pepper Cloud, Bonus Items
 */

// Helper to check platform collision (checks vertical proximity and horizontal platform span)
function getNearestFloor(x, y, floors, tolerance = 6) {
  if (typeof y === 'undefined') return null;
  for (const f of floors) {
    if (Math.abs(y - f.y) <= tolerance) {
      if (typeof x === 'number') {
        const footCenter = x + 8;
        if (footCenter >= f.x1 && footCenter <= f.x2) {
          return f;
        }
      } else {
        return f;
      }
    }
  }
  return null;
}

// Helper to check ladder collision
function getAvailableLadder(x, y, ladders, tolerance = 10) {
  for (const l of ladders) {
    if (Math.abs(x - l.x) <= tolerance && y >= l.y1 - tolerance && y <= l.y2 + tolerance) {
      return l;
    }
  }
  return null;
}

// Helper to check ladder collision with 1-pixel hitbox overlap:
// Player span is [x, x + 16], Ladder span is [l.x, l.x + 16].
// Touching occurs as soon as (x + 16 > l.x) && (x < l.x + 16).
function getTouchingLadder(x, y, ladders, verticalTolerance = 8) {
  let best = null;
  let minDist = Infinity;
  for (const l of ladders) {
    if (x + 16 > l.x && x < l.x + 16) {
      if (y >= l.y1 - verticalTolerance && y <= l.y2 + verticalTolerance) {
        const dist = Math.abs(x - l.x);
        if (dist < minDist) {
          minDist = dist;
          best = l;
        }
      }
    }
  }
  return best;
}

// ========================================================
// PLAYER (CHEF PEPE)
// ========================================================
class Player {
  constructor(x, y, levelData) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.levelData = levelData;

    this.width = 16;
    this.height = 16;
    this.speed = 1.1;

    this.vx = 0;
    this.vy = 0;
    this.dir = 1; // 1 = right, -1 = left
    this.facingDir = 'right'; // 'up', 'down', 'left', 'right'
    this.lastTossDir = 'right';
    this.isClimbing = false;
    this.isJumping = false;
    this.onFloor = true;

    this.peppers = 5;
    this.lives = 3;
    this.isDead = false;
    this.deathTimer = 0;
    this.invulnerableTimer = 0;

    // Animation
    this.animFrame = 0;
    this.animTimer = 0;
    this.isTossingPepper = false;
    this.pepperTimer = 0;
  }

  resetPosition() {
    this.x = this.startX;
    this.y = this.startY;
    this.vx = 0;
    this.vy = 0;
    this.dir = 1;
    this.facingDir = 'right';
    this.lastTossDir = 'right';
    this.isClimbing = false;
    this.isJumping = false;
    this.isDead = false;
    this.deathTimer = 0;
    this.isTossingPepper = false;
    this.invulnerableTimer = 120; // ~2 seconds of grace flicker
  }

  dropFromLadder(dir) {
    this.isClimbing = false;
    this.isJumping = true;
    this.dir = dir > 0 ? 1 : -1;
    this.facingDir = dir > 0 ? 'right' : 'left';
    this.vx = dir > 0 ? 1.4 : -1.4;
    this.vy = 0; // Pure drop by gravity, no upward leap!
    window.soundManager.playStep();
  }

  jump(dir = null, input = null) {
    if (this.isDead || this.isJumping || this.isTossingPepper) return false;

    // If currently climbing, omit jump and drop off to the left or right instead!
    if (this.isClimbing) {
      let dropDir = 0;
      if (input && input.x !== 0) {
        dropDir = input.x > 0 ? 1 : -1;
      } else if (dir !== null && dir !== 0) {
        dropDir = dir > 0 ? 1 : -1;
      } else {
        dropDir = this.facingDir === 'left' ? -1 : 1;
      }
      this.dropFromLadder(dropDir);
      return true;
    }

    // Directional Ground Jump:
    // Only jump sideways if direction buttons are held; otherwise purely vertical!
    let jumpVx = 0;
    if (input) {
      if (input.x < 0) {
        jumpVx = -2.2;
        this.dir = -1;
        this.facingDir = 'left';
      } else if (input.x > 0) {
        jumpVx = 2.2;
        this.dir = 1;
        this.facingDir = 'right';
      } else {
        // Vertical jump in place
        jumpVx = 0;
      }
    } else if (dir !== null && dir !== 0) {
      jumpVx = dir > 0 ? 2.2 : -2.2;
      this.dir = dir > 0 ? 1 : -1;
      this.facingDir = dir > 0 ? 'right' : 'left';
    } else {
      jumpVx = 0;
    }

    this.isJumping = true;
    this.isClimbing = false;
    this.vx = jumpVx;
    this.vy = jumpVx === 0 ? -4.3 : -3.8; // High vertical vault or horizontal arc
    window.soundManager.playJump();
    return true;
  }

  throwPepper(pepperClouds, currentInput = null) {
    if (this.peppers <= 0 || this.isDead || this.isTossingPepper) return false;

    this.peppers--;
    this.isTossingPepper = true;
    this.pepperTimer = 16; // frames
    window.soundManager.playPepper();

    // Determine direction from active input or current facing direction
    let dir = this.facingDir || 'right';
    if (currentInput) {
      if (currentInput.y < 0) dir = 'up';
      else if (currentInput.y > 0) dir = 'down';
      else if (currentInput.x < 0) dir = 'left';
      else if (currentInput.x > 0) dir = 'right';
    }

    this.lastTossDir = dir;

    // Pepper cloud spawn point depending on direction
    let px = this.x + 8;
    let py = this.y + 8;

    if (dir === 'up') {
      py = this.y - 4;
      this.facingDir = 'up';
    } else if (dir === 'down') {
      py = this.y + 18;
      this.facingDir = 'down';
    } else if (dir === 'left') {
      px = this.x - 4;
      py = this.y + 6;
      this.dir = -1;
      this.facingDir = 'left';
    } else {
      px = this.x + 18;
      py = this.y + 6;
      this.dir = 1;
      this.facingDir = 'right';
    }

    pepperClouds.push(new PepperCloud(px, py, dir));
    return true;
  }

  update(input, ladders, floors) {
    if (this.isDead) {
      this.deathTimer++;
      return;
    }

    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer--;
    }

    if (this.isTossingPepper) {
      this.pepperTimer--;
      if (this.pepperTimer <= 0) {
        this.isTossingPepper = false;
      }
      return;
    }

    // Mid-air Jump / Fall Physics
    if (this.isJumping) {
      // Check if passing by a ladder and player presses UP (input.y < 0): GRAB LADDER!
      if (input && input.y < 0) {
        const grabLadder = getTouchingLadder(this.x, this.y, ladders);
        if (grabLadder && (grabLadder.y1 < this.y - 2)) {
          this.isJumping = false;
          this.isClimbing = true;
          this.vx = 0;
          this.vy = input.y * this.speed;
          this.facingDir = 'up';
          const dx = grabLadder.x - this.x;
          if (Math.abs(dx) <= 2.5) {
            this.x = grabLadder.x;
          } else {
            this.x += Math.sign(dx) * 2.5;
          }
          this.animTimer++;
          if (this.animTimer % 7 === 0) {
            this.animFrame = 1 - this.animFrame;
          }
          window.soundManager.playStep();
          return;
        }
      }

      this.vy += 0.24; // Gravity
      if (this.vy > 4.2) this.vy = 4.2;

      const oldY = this.y;
      this.x += this.vx;
      this.y += this.vy;

      // Check ladder grab immediately after step as well
      if (input && input.y < 0) {
        const grabLadder = getTouchingLadder(this.x, this.y, ladders);
        if (grabLadder && (grabLadder.y1 < this.y - 2)) {
          this.isJumping = false;
          this.isClimbing = true;
          this.vx = 0;
          this.vy = input.y * this.speed;
          this.facingDir = 'up';
          const dx = grabLadder.x - this.x;
          if (Math.abs(dx) <= 2.5) {
            this.x = grabLadder.x;
          } else {
            this.x += Math.sign(dx) * 2.5;
          }
          window.soundManager.playStep();
          return;
        }
      }

      const mapW = (this.levelData && this.levelData.width) ? this.levelData.width : 240;

      // Solid outer map boundaries (no falling into outer void or teleporting)
      if (this.x < 12) {
        this.x = 12;
        this.vx = 0;
      }
      if (this.x > mapW - this.width - 6) {
        this.x = mapW - this.width - 6;
        this.vx = 0;
      }

      // Check landing on platform when falling downwards
      if (this.vy > 0) {
        const footCenter = this.x + 8;
        for (const f of floors) {
          if (oldY <= f.y + 1 && this.y >= f.y - 3 && this.y <= f.y + 16) {
            if (footCenter >= f.x1 && footCenter <= f.x2) {
              this.y = f.y;
              this.vy = 0;
              this.vx = 0;
              this.isJumping = false;
              this.isClimbing = false;
              window.soundManager.playLand();
              break;
            }
          }
        }
      }

      // Bottom screen safety boundary
      if (this.y > 292) {
        this.y = 292;
        this.vy = 0;
        this.vx = 0;
        this.isJumping = false;
        this.isClimbing = false;
      }

      return;
    }

    const wantX = input.x;
    const wantY = input.y;

    // Hitbox de escalera de 1 píxel: detecta la escalera al rozarla con cualquier píxel
    const touchingLadder = getTouchingLadder(this.x, this.y, ladders);
    const currentFloor = getNearestFloor(this.x, this.y, floors);

    // Lateral dismount or drop off Ladder:
    if (this.isClimbing && !currentFloor && wantX !== 0) {
      this.dropFromLadder(wantX > 0 ? 1 : -1);
      return;
    }

    // Vertical ladder climbing logic
    if (wantY !== 0) {
      if (touchingLadder) {
        const canClimbUp = wantY < 0 && (touchingLadder.y1 < this.y - 2);
        const canClimbDown = wantY > 0 && (touchingLadder.y2 > this.y + 2);

        if (this.isClimbing || canClimbUp || canClimbDown) {
          this.isClimbing = true;
          this.vy = wantY * this.speed;
          this.vx = 0;
          this.facingDir = wantY < 0 ? 'up' : 'down';

          // Centrado horizontal suave mientras sube o baja (sin teletransportes)
          const dx = touchingLadder.x - this.x;
          if (Math.abs(dx) <= 2.0) {
            this.x = touchingLadder.x;
          } else {
            this.x += Math.sign(dx) * 2.0;
          }

          const newY = this.y + this.vy;
          if (newY >= touchingLadder.y1 && newY <= touchingLadder.y2) {
            this.y = newY;
            this.animTimer++;
            if (this.animTimer % 7 === 0) {
              this.animFrame = 1 - this.animFrame;
            }
          } else if (wantY < 0 && newY < touchingLadder.y1) {
            // Reached the top of the ladder! Ascend smoothly onto floor at top
            const topFloor = floors.find(
              (f) => Math.abs(f.y - touchingLadder.y1) <= 8 &&
                     (touchingLadder.x + 14 >= f.x1 && touchingLadder.x + 2 <= f.x2)
            );
            if (topFloor) {
              this.y = topFloor.y;
              this.isClimbing = false;
              this.facingDir = 'up';
              window.soundManager.playStep();
              return;
            } else {
              this.y = touchingLadder.y1;
            }
          } else if (wantY > 0 && newY > touchingLadder.y2) {
            // Reached the bottom of the ladder!
            const botFloor = floors.find(
              (f) => Math.abs(f.y - touchingLadder.y2) <= 8 &&
                     (touchingLadder.x + 14 >= f.x1 && touchingLadder.x + 2 <= f.x2)
            );
            if (botFloor) {
              this.y = botFloor.y;
              this.isClimbing = false;
              this.facingDir = 'down';
              window.soundManager.playStep();
              return;
            } else {
              this.y = touchingLadder.y2;
            }
          }
        }
      }
    } else {
      this.vy = 0;
    }

    // Horizontal platform walking logic (only when not climbing)
    if (wantY === 0 && wantX !== 0) {
      // Can only walk horizontally if at or very near a floor
      if (currentFloor) {
        this.y = currentFloor.y; // Snap vertically to platform line
        this.isClimbing = false;
        this.dir = wantX > 0 ? 1 : -1;
        this.facingDir = this.dir === 1 ? 'right' : 'left';
        this.vx = wantX * this.speed;

        // Check horizontal floor bounds
        const newX = this.x + this.vx;
        const mapW = (this.levelData && this.levelData.width) ? this.levelData.width : 240;

        if (newX >= currentFloor.x1 && newX <= currentFloor.x2 - this.width) {
          this.x = newX;
          this.animTimer++;
          if (this.animTimer % 7 === 0) {
            this.animFrame = 1 - this.animFrame;
          }
          if (this.animTimer % 14 === 0) {
            window.soundManager.playStep();
          }
        } else {
          // If at the outer boundary of the stage, stop safely at the wall
          if (newX < 12) {
            this.x = 12;
          } else if (newX > mapW - this.width - 6) {
            this.x = mapW - this.width - 6;
          } else {
            // Interior platform gap: stepped off into empty air, fall by gravity!
            this.x = newX;
            this.isJumping = true;
            this.vy = 0.5;
            this.vx = wantX * this.speed;
          }
        }
      }
    } else if (wantY === 0) {
      this.vx = 0;
    }
  }

  die() {
    if (this.isDead || this.invulnerableTimer > 0) return;
    this.isDead = true;
    this.deathTimer = 0;
    this.lives--;
    window.soundManager.playDie();
  }

  draw(ctx) {
    if (this.isDead) {
      // Animated 2-sprite defeat sequence:
      // Alternates between sitting dazed (defeat_1) and slumping flat (defeat_2)
      // before settling flat on the ground.
      let atlasName = 'defeat_1';
      if (this.deathTimer >= 55) {
        atlasName = 'defeat_2'; // Final resting pose
      } else {
        // Active wobbling/slumping animation between the two frames
        atlasName = (Math.floor(this.deathTimer / 10) % 2 === 0) ? 'defeat_1' : 'defeat_2';
      }

      const flip = this.dir === -1;

      const info = window.spriteManager.getAtlasInfo(atlasName);
      const h = info ? info.h : 22;
      const w = info ? info.w : 20;
      const drawY = (this.y + 14) - h;
      const drawX = Math.round(this.x + 8 - w / 2);

      const drawn = window.spriteManager.drawAtlas(ctx, atlasName, drawX, drawY, flip);
      if (!drawn) {
        const deadSpr = window.spriteManager.get('player_death');
        if (deadSpr) ctx.drawImage(deadSpr, this.x, this.y);
      }

      // Draw cartoon dizzy stars orbiting Chef's head while dazed
      if (this.deathTimer < 65) {
        ctx.fillStyle = '#fcb400';
        const starPhase = this.deathTimer * 0.18;
        const s1x = this.x + 8 + Math.cos(starPhase) * 9;
        const s1y = drawY - 2 + Math.sin(starPhase) * 3;
        const s2x = this.x + 8 + Math.cos(starPhase + Math.PI) * 9;
        const s2y = drawY - 2 + Math.sin(starPhase + Math.PI) * 3;
        ctx.fillRect(Math.round(s1x), Math.round(s1y), 3, 3);
        ctx.fillRect(Math.round(s2x), Math.round(s2y), 3, 3);
      }

      return;
    }

    // Invulnerability blink
    if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer / 6) % 2 === 0) {
      return;
    }

    let atlasName = 'detenido_1';
    let flip = false;

    if (this.isTossingPepper) {
      if (this.lastTossDir === 'left') {
        atlasName = this.pepperTimer > 8 ? 'pepper_left_1' : 'pepper_left_2';
        flip = false;
      } else if (this.lastTossDir === 'right') {
        atlasName = this.pepperTimer > 8 ? 'pepper_right_1' : 'pepper_right_2';
        flip = false;
      } else if (this.lastTossDir === 'up') {
        atlasName = 'subiendo_3';
      } else {
        atlasName = 'bajando_2';
      }
    } else if (this.isJumping) {
      atlasName = 'victory_2';
      flip = this.dir === -1;
    } else if (this.isClimbing) {
      // 8-frame isolated back-view ladder climbing sequence
      const climbFrames = ['climb_1', 'climb_2', 'climb_3', 'climb_4', 'climb_5', 'climb_6', 'climb_7', 'climb_8'];
      if (this.vy !== 0) {
        if (this.facingDir === 'down') {
          const cIdx = (7 - (Math.floor(this.animTimer / 5) % 8));
          atlasName = climbFrames[cIdx];
        } else {
          const cIdx = Math.floor(this.animTimer / 5) % 8;
          atlasName = climbFrames[cIdx];
        }
      } else {
        atlasName = 'climb_1';
      }
    } else if (this.vx !== 0) {
      // Walking horizontally (symmetrical 4-frame run cycles)
      const runFramesRight = ['run_right_1', 'run_right_2', 'run_right_3', 'run_right_4'];
      const runFramesLeft = ['run_left_1', 'run_left_2', 'run_left_3', 'run_left_4'];
      const rIdx = Math.floor(this.animTimer / 5) % 4;
      if (this.dir === -1) {
        atlasName = runFramesLeft[rIdx];
        flip = false; // Already flipped in atlas
      } else {
        atlasName = runFramesRight[rIdx];
        flip = false;
      }
    } else {
      // Idle on platform
      const idleBlink = Math.floor(Date.now() / 400) % 8 === 0;
      atlasName = idleBlink ? 'detenido_2' : 'detenido_1';
      flip = this.facingDir === 'left';
    }

    const info = window.spriteManager.getAtlasInfo(atlasName);
    const h = info ? info.h : 28;
    const w = info ? info.w : 16;
    const drawY = (this.y + 14) - h;
    const drawX = Math.round(this.x + 8 - w / 2);

    // Draw from atlas with accurate alignment
    const drawn = window.spriteManager.drawAtlas(ctx, atlasName, drawX, drawY, flip);
    if (!drawn) {
      // Fallback
      const spr = window.spriteManager.get('player_walk1');
      if (spr) ctx.drawImage(spr, this.x, this.y, 16, 16);
    }
  }
}

// ========================================================
// ENEMY (HOT DOG, PICKLE, EGG)
// ========================================================
class Enemy {
  constructor(type, x, y, speed, levelData) {
    this.type = type; // 'hotdog', 'pickle', 'egg'
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.baseSpeed = speed;
    this.levelData = levelData;

    this.width = 16;
    this.height = 16;
    this.dir = 1;
    this.isClimbing = false;
    this.isFalling = false;
    this.vx = 0;
    this.vy = 0;
    this.landCooldown = 0;

    // States: 'normal', 'stunned', 'riding', 'squashed', 'spawning'
    this.state = 'normal';
    this.spawnTimer = 0;
    this.stunTimer = 0;
    this.squashTimer = 0;
    this.squashed = false;
    this.riding = false;
    this.rideBurger = null;

    this.animFrame = 0;
    this.animTimer = 0;
    this.changeDirCooldown = 0;
  }

  stun() {
    if (this.state === 'squashed' || this.state === 'riding' || this.state === 'spawning') return;
    this.state = 'stunned';
    this.stunTimer = 300; // ~5 seconds at 60fps
    window.soundManager.playStun();
  }

  squash() {
    this.state = 'squashed';
    this.squashed = true;
    this.squashTimer = 80;
    this.riding = false;
    this.rideBurger = null;
  }

  startRiding(burger) {
    this.state = 'riding';
    this.riding = true;
    this.rideBurger = burger;
    this.rideOffsetX = this.x - burger.x;
    this.rideOffsetY = this.y - burger.y;
  }

  crushFromRide() {
    this.squash();
  }

  respawn(player = null) {
    let spawnX = this.startX;
    let spawnY = this.startY;

    // Pick spawn spot farthest from player so enemies never appear on top of player
    if (player && this.levelData && this.levelData.enemies && this.levelData.enemies.length > 1) {
      let bestDist = -1;
      for (const e of this.levelData.enemies) {
        const d = Math.hypot((e.x + 8) - (player.x + 8), (e.y + 8) - (player.y + 8));
        if (d > bestDist) {
          bestDist = d;
          spawnX = e.x;
          spawnY = e.y;
        }
      }
    }

    this.x = spawnX;
    this.y = spawnY;
    this.state = 'spawning';
    this.spawnTimer = 180; // 3 seconds grace period (harmless & visible beacon)
    this.squashed = false;
    this.riding = false;
    this.rideBurger = null;
    this.stunTimer = 0;
    this.isClimbing = false;
    this.isFalling = false;
    this.vx = 0;
    this.vy = 0;
    this.landCooldown = 25;
    this.dir = 1;
    this.changeDirCooldown = 15;
  }

  update(player, ladders, floors) {
    const mapW = (this.levelData && this.levelData.width) ? this.levelData.width : 240;

    // If spawning, count down 3 seconds in harmless flickering state
    // (continues moving and patrolling while flashing; does NOT deal damage!)
    if (this.state === 'spawning') {
      this.spawnTimer--;
      if (this.spawnTimer <= 0) {
        this.state = 'normal';
      }
    }

    // If riding a burger piece, stick directly on top of it
    if (this.state === 'riding' && this.rideBurger) {
      this.x = this.rideBurger.x + (this.rideOffsetX !== undefined ? this.rideOffsetX : 8);
      this.y = this.rideBurger.y + (this.rideOffsetY !== undefined ? this.rideOffsetY : 0);
      return;
    }

    if (this.state === 'squashed') {
      this.squashTimer--;
      if (this.squashTimer <= 0) {
        this.respawn(player);
      }
      return;
    }

    // Stunned countdown
    if (this.state === 'stunned') {
      this.stunTimer--;
      if (this.stunTimer <= 0) {
        this.state = 'normal';
      }
      // If stunned while falling, let gravity finish landing onto floor before freezing
      if (!this.isFalling) {
        return;
      }
    }

    this.animTimer++;
    if (this.animTimer % 7 === 0) {
      this.animFrame = (this.animFrame + 1) % 4;
    }

    if (this.changeDirCooldown > 0) {
      this.changeDirCooldown--;
    }
    if (this.landCooldown > 0) {
      this.landCooldown--;
    }

    const dx = player.x - this.x;
    const dy = player.y - this.y;

    // ========================================================
    // 1. MID-AIR / LEAPING / FALLING INTO VOID PHYSICS
    // ========================================================
    if (this.isFalling) {
      this.vy += 0.22;
      if (this.vy > 4.5) this.vy = 4.5;

      this.x += this.vx;
      this.y += this.vy;

      // Strict safety: Never exit outer map boundaries
      this.x = Math.max(12, Math.min(this.x, mapW - this.width - 6));

      // In mid-air, only grab an intersecting ladder if closely aligned (tolerance = 3)
      const midAirLadder = getAvailableLadder(this.x, this.y, ladders, 3);
      if (midAirLadder && this.y >= midAirLadder.y1 + 4 && this.y <= midAirLadder.y2 - 4) {
        this.isFalling = false;
        this.vx = 0;
        this.vy = 0;
        this.isClimbing = true;
        this.x = midAirLadder.x;
        this.climbDir = (player.y < this.y) ? -1 : 1;
        this.changeDirCooldown = 20;
        return;
      }

      // Check landing on platforms below when falling downwards
      if (this.vy > 0) {
        const prevY = this.y - this.vy;
        for (const f of floors) {
          if (prevY <= f.y + 2 && this.y >= f.y - 3) {
            if (this.x + 12 >= f.x1 && this.x + 4 <= f.x2) {
              this.y = f.y;
              this.isFalling = false;
              this.vy = 0;
              this.vx = 0;
              this.landCooldown = 25; // Landing recovery: prevents instant-killing player
              this.dir = dx >= 0 ? 1 : -1;
              this.changeDirCooldown = 15;
              return;
            }
          }
        }
      }

      // Absolute safety ground floor clamp (bottom floor)
      const bottomFloor = floors[floors.length - 1];
      const bottomY = bottomFloor ? bottomFloor.y : 288;
      if (this.y >= bottomY) {
        this.y = bottomY;
        this.isFalling = false;
        this.vy = 0;
        this.vx = 0;
        this.landCooldown = 25;
        this.dir = dx >= 0 ? 1 : -1;
        this.changeDirCooldown = 15;
        return;
      }

      return;
    }

    // Walking / climbing ladder checks: Use tolerance = 3 to prevent horizontal snapping
    const currentLadder = getAvailableLadder(this.x, this.y, ladders, 3);
    const currentFloor = getNearestFloor(this.x, this.y, floors);

    // ========================================================
    // 2. AI DECISION MAKING AT INTERSECTIONS & LADDERS
    // ========================================================
    if (this.changeDirCooldown === 0) {
      // Case A: Walking on platform and encountering a ladder
      if (!this.isClimbing && currentLadder && currentFloor) {
        const canGoUp = dy < -6 && currentLadder.y1 < this.y - 2;
        const canGoDown = dy > 6 && currentLadder.y2 > this.y + 2;

        let wantClimb = false;
        if (canGoUp || canGoDown) {
          if (this.type === 'hotdog') {
            wantClimb = true;
          } else if (this.type === 'egg') {
            wantClimb = Math.random() < 0.85;
          } else {
            wantClimb = Math.random() < 0.70;
          }
        }

        if (wantClimb) {
          this.isClimbing = true;
          this.x = currentLadder.x;
          this.climbDir = canGoUp ? -1 : 1;
          this.changeDirCooldown = 25;
        } else {
          this.dir = dx >= 0 ? 1 : -1;
          this.changeDirCooldown = 20;
        }
      }
      // Case B: Climbing ladder and intersecting a floor
      else if (this.isClimbing && currentFloor) {
        const atLadderTop = currentLadder && this.y <= currentLadder.y1 + 4;
        const atLadderBottom = currentLadder && this.y >= currentLadder.y2 - 4;
        const onPlayerFloor = Math.abs(dy) <= 6;
        const cannotContinueClimb = (this.climbDir < 0 && atLadderTop) || (this.climbDir > 0 && atLadderBottom);

        if (onPlayerFloor || cannotContinueClimb) {
          this.isClimbing = false;
          this.y = currentFloor.y;
          this.dir = dx >= 0 ? 1 : -1;
          this.changeDirCooldown = 25;
        }
      }
      // Case C: Walking on floor with no ladder: steer towards player
      else if (!this.isClimbing && currentFloor) {
        if (Math.abs(dx) > 10 && Math.random() < 0.04) {
          this.dir = dx >= 0 ? 1 : -1;
          this.changeDirCooldown = 20;
        }
      }
    }

    // ========================================================
    // 3. EXECUTE MOVEMENT & PLATFORM JUMPING INTO VOID
    // ========================================================
    if (this.isClimbing) {
      if (!currentLadder) {
        this.isClimbing = false;
        if (currentFloor) this.y = currentFloor.y;
        return;
      }

      const nextY = this.y + (this.climbDir || 1) * this.speed * 0.85;
      if (nextY >= currentLadder.y1 && nextY <= currentLadder.y2) {
        this.y = nextY;
      } else {
        this.isClimbing = false;
        this.y = (this.climbDir < 0) ? currentLadder.y1 : currentLadder.y2;
        this.dir = dx >= 0 ? 1 : -1;
        this.changeDirCooldown = 20;
      }
    } else if (currentFloor) {
      if (!this.dir) this.dir = dx >= 0 ? 1 : -1;

      const nextX = this.x + this.dir * this.speed;

      // Platform bounds check (smooth directional reversal, zero teleportation)
      const minX = currentFloor.x1;
      const maxX = Math.max(minX, currentFloor.x2 - this.width);

      if (this.dir > 0) {
        if (nextX <= maxX) {
          this.x = nextX;
        } else {
          this.x = maxX;
          this.dir = -1;
          this.changeDirCooldown = 15;
        }
      } else {
        if (nextX >= minX) {
          this.x = nextX;
        } else {
          this.x = minX;
          this.dir = 1;
          this.changeDirCooldown = 15;
        }
      }
    } else {
      // Check if safely on another floor before falling
      const anyFloor = floors.find(f => Math.abs(f.y - this.y) <= 4 && this.x + 12 >= f.x1 && this.x + 4 <= f.x2);
      if (anyFloor) {
        this.y = anyFloor.y;
      } else {
        this.isFalling = true;
        this.vy = 1.0;
        this.vx = 0;
      }
    }

    // Absolute screen boundary clamp
    this.x = Math.max(12, Math.min(this.x, mapW - this.width - 6));
  }

  draw(ctx) {
    if (this.state === 'spawning') {
      // High-visibility 3-second flashing warning
      const flash = Math.floor(this.spawnTimer / 4) % 2 === 0;
      const pulseColor = (Math.floor(this.spawnTimer / 6) % 2 === 0) ? '#fcb400' : '#00f0ff';

      ctx.save();
      // Retro pulsating beacon border
      ctx.strokeStyle = pulseColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);

      // Warning exclamation point above spawning enemy
      if (flash) {
        ctx.fillStyle = pulseColor;
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('!', this.x + 8, this.y - 4);
      }

      // Sprite flicker: alternating high and low opacity
      ctx.globalAlpha = flash ? 1.0 : 0.35;
      const spawnSpr = `${this.type}_walk1`;
      const info = window.spriteManager.getEnemyAtlasInfo(spawnSpr);
      if (info) {
        const drawY = (this.y + 16) - info.h;
        const drawX = Math.round(this.x + 8 - info.w / 2);
        window.spriteManager.drawEnemyAtlas(ctx, spawnSpr, drawX, drawY, false);
      } else {
        const spr = window.spriteManager.get(spawnSpr);
        if (spr) {
          ctx.drawImage(spr, this.x, this.y, this.width, this.height);
        }
      }
      ctx.restore();
      return;
    }

    ctx.save();
    let sprName = `${this.type}_walk1`;

    if (this.state === 'squashed') {
      sprName = (this.squashTimer < 40) ? `${this.type}_squashed2` : `${this.type}_squashed`;
    } else if (this.state === 'stunned') {
      sprName = (Math.floor(this.animTimer / 8) % 2 === 0) ? `${this.type}_stunned` : `${this.type}_stunned2`;
      // Shaking dizzy animation
      const shakeX = (Math.random() - 0.5) * 2;
      ctx.translate(shakeX, 0);
    } else if (this.isClimbing) {
      const climbFrame = (this.animFrame % 3) + 1;
      sprName = `${this.type}_climb${climbFrame}`;
    } else {
      const walkFrame = (this.animFrame % 4) + 1;
      sprName = `${this.type}_walk${walkFrame}`;
    }

    const flip = (this.dir === -1 && this.state !== 'squashed' && this.state !== 'stunned' && !this.isClimbing);
    const info = window.spriteManager.getEnemyAtlasInfo(sprName);
    let drawn = false;

    if (info) {
      const drawY = (this.y + 16) - info.h;
      const drawX = Math.round(this.x + 8 - info.w / 2);
      drawn = window.spriteManager.drawEnemyAtlas(ctx, sprName, drawX, drawY, flip);
    }

    if (!drawn) {
      const fallbackName = this.animFrame % 2 === 0 ? `${this.type}_walk1` : `${this.type}_walk2`;
      const spr = window.spriteManager.get(sprName) || window.spriteManager.get(fallbackName);
      if (spr) {
        if (flip) {
          ctx.translate(this.x + this.width, this.y);
          ctx.scale(-1, 1);
          ctx.drawImage(spr, 0, 0, this.width, this.height);
        } else {
          ctx.drawImage(spr, this.x, this.y, this.width, this.height);
        }
      }
    }

    // If stunned, draw cartoon dizzy stars above head
    if (this.state === 'stunned') {
      ctx.fillStyle = '#fcb400';
      const starPhase = (Date.now() / 80) % (Math.PI * 2);
      const s1x = this.x + 8 + Math.cos(starPhase) * 6;
      const s1y = this.y - 4 + Math.sin(starPhase) * 2;
      const s2x = this.x + 8 + Math.cos(starPhase + Math.PI) * 6;
      const s2y = this.y - 4 + Math.sin(starPhase + Math.PI) * 2;
      ctx.fillRect(s1x, s1y, 3, 3);
      ctx.fillRect(s2x, s2y, 3, 3);
    }

    ctx.restore();
  }
}

// ========================================================
// PEPPER CLOUD (PARTICLE BURST)
// ========================================================
class PepperCloud {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir; // 'up', 'down', 'left', 'right'
    this.duration = 24; // frames
    this.particles = [];

    let baseAngle = 0;
    if (dir === 'up') {
      baseAngle = -Math.PI / 2;
    } else if (dir === 'down') {
      baseAngle = Math.PI / 2;
    } else if (dir === 'left' || dir === -1) {
      baseAngle = Math.PI;
    } else {
      baseAngle = 0;
    }

    // Create 20 retro salt/pepper flakes expanding in direction cone
    for (let i = 0; i < 20; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * 1.3;
      const spd = Math.random() * 2.8 + 1.0;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: Math.random() < 0.5 ? 2 : 3,
        color: Math.random() < 0.75 ? '#ffffff' : '#e0e0f8'
      });
    }
  }

  update(enemies) {
    this.duration--;

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
    }

    // Check collision with all active enemies
    for (const enemy of enemies) {
      if (enemy.state === 'normal') {
        const ex = enemy.x + 8;
        const ey = enemy.y + 8;

        // Check if any salt flake touches the enemy
        for (const p of this.particles) {
          if (Math.hypot(p.x - ex, p.y - ey) < 14) {
            enemy.stun();
            break;
          }
        }
      }
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    }
  }
}

// ========================================================
// BONUS ITEM (ICE CREAM, COFFEE)
// ========================================================
class BonusItem {
  constructor(x, y, type = 'bonus_icecream') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.timer = 500; // Time before disappearing
  }

  update() {
    this.timer--;
  }

  draw(ctx) {
    const spr = window.spriteManager.get(this.type);
    if (!spr) return;
    // Slight flash when expiring
    if (this.timer < 100 && Math.floor(this.timer / 8) % 2 === 0) return;
    ctx.drawImage(spr, this.x, this.y, 16, 16);
  }
}

// ========================================================
// SCORE POPUP (+500, etc.)
// ========================================================
class ScorePopup {
  constructor(text, x, y) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.timer = 45;
  }

  update() {
    this.timer--;
    this.y -= 0.6;
  }

  draw(ctx) {
    ctx.fillStyle = '#fcb400';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText(this.text, this.x, this.y);
  }
}

window.Player = Player;
window.Enemy = Enemy;
window.PepperCloud = PepperCloud;
window.BonusItem = BonusItem;
window.ScorePopup = ScorePopup;
