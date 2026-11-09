/**
 * Entities: Player (Chef Pepe), Enemies (Hot Dog, Pickle, Egg), Pepper Cloud, Bonus Items
 */

// Helper to calculate exact elevation for horizontal or diagonal/sloped floors
function getFloorElevation(f, x) {
  if (f.type === 'diagonal') {
    const ratio = Math.max(0, Math.min(1, (x - f.x1) / Math.max(1, f.x2 - f.x1)));
    return f.y1 + (f.y2 - f.y1) * ratio;
  }
  return f.y;
}

// Helper to check platform collision (checks vertical proximity and horizontal platform span)
function getNearestFloor(x, y, floors, tolerance = 6) {
  if (typeof y === 'undefined') return null;
  for (const f of floors) {
    if (typeof x === 'number') {
      const footCenter = x + 8;
      // Allow detection if character body [x + 2, x + 14] overlaps platform [f.x1, f.x2]
      if (x + 14 >= f.x1 - 2 && x + 2 <= f.x2 + 2) {
        const checkX = Math.max(f.x1, Math.min(f.x2, footCenter));
        const floorY = getFloorElevation(f, checkX);
        if (Math.abs(y - floorY) <= tolerance) {
          return f;
        }
      }
    } else {
      if (Math.abs(y - f.y) <= tolerance) {
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
    this.landSquashTimer = 0;
    this.cryoCooldown = 0;
    this.hasBlowtorch = false;
    this.blowtorchFuel = 0;
    this.maxBlowtorchFuel = 100;
    this.flameSoundTimer = 0;
  }

  resetPosition() {
    this.x = this.startX;
    this.y = this.startY;
    this.vx = 0;
    this.vy = 0;
    if (this.levelData && this.levelData.autoScrollDir === -1) {
      this.dir = -1;
      this.facingDir = 'left';
      this.lastTossDir = 'left';
    } else {
      this.dir = 1;
      this.facingDir = 'right';
      this.lastTossDir = 'right';
    }
    this.isClimbing = false;
    this.isJumping = false;
    this.isDead = false;
    this.deathTimer = 0;
    this.isTossingPepper = false;
    this.landSquashTimer = 0;
    this.cryoCooldown = 0;
    this.hasBlowtorch = false;
    this.blowtorchFuel = 0;
    this.maxBlowtorchFuel = 100;
    this.flameSoundTimer = 0;
    this.invulnerableTimer = 120; // ~2 seconds of grace flicker
    this.hasBlowtorch = false;
    this.blowtorchFuel = 0;
    this.flameSoundTimer = 0;
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
    if (window.burgerPanicGame && window.burgerPanicGame.spawnJumpDust) {
      window.burgerPanicGame.spawnJumpDust(this.x + 8, this.y + 14);
    }
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

  fireBlowtorch(flameProjectiles, currentInput = null) {
    if (!this.hasBlowtorch || this.blowtorchFuel <= 0 || this.isDead) return 'empty';

    this.isTossingPepper = true;
    this.pepperTimer = 4; // Brief pose so Chef can keep running while firing

    // Fuel drain: ~133 continuous frames of flame (~2.2 seconds) per tank
    this.blowtorchFuel = Math.max(0, this.blowtorchFuel - 0.75);

    let dir = (this.facingDir === 'left' || this.dir === -1) ? -1 : 1;
    if (currentInput && currentInput.x !== 0) {
      dir = (currentInput.x < 0) ? -1 : 1;
    } else if (this.levelData && this.levelData.autoScrollDir === -1 && this.facingDir === 'right') {
      dir = 1; // Aim right at the pursuing boss behind chef
    }
    this.dir = dir;
    this.facingDir = (dir === -1) ? 'left' : 'right';

    const spawnX = (dir === -1) ? (this.x - 4) : (this.x + 20);
    const spawnY = this.y + 7;

    if (window.FlameProjectile && flameProjectiles) {
      flameProjectiles.push(new window.FlameProjectile(spawnX, spawnY, dir));
    }

    if (this.flameSoundTimer <= 0) {
      if (window.soundManager && window.soundManager.playFlame) {
        window.soundManager.playFlame();
      }
      this.flameSoundTimer = 6;
    }

    if (this.blowtorchFuel <= 0) {
      this.hasBlowtorch = false;
      this.blowtorchFuel = 0;
      if (window.soundManager && window.soundManager.playGasEmpty) {
        window.soundManager.playGasEmpty();
      }
      return 'exhausted';
    }

    return 'fired';
  }

  fireCryoExtinguisher(cryoProjectiles, currentInput = null) {
    if (this.isDead || this.cryoCooldown > 0) return false;

    this.isTossingPepper = true;
    this.pepperTimer = 10;
    this.cryoCooldown = 12; // Rapid-fire cooldown (arcade rhythm)

    let dir = (this.dir === -1) ? -1 : 1;
    if (currentInput && currentInput.x !== 0) {
      dir = (currentInput.x < 0) ? -1 : 1;
    }
    this.dir = dir;
    this.facingDir = (dir === -1) ? 'left' : 'right';

    const spawnX = (dir === -1) ? (this.x - 2) : (this.x + 18);
    const spawnY = this.y + 7;

    if (window.CryoProjectile) {
      cryoProjectiles.push(new window.CryoProjectile(spawnX, spawnY, dir));
    }

    if (window.soundManager && window.soundManager.playPepper) {
      window.soundManager.playPepper();
    }
    return true;
  }

  update(input, ladders, floors) {
    if (this.cryoCooldown > 0) {
      this.cryoCooldown--;
    }

    if (this.isDead) {
      this.deathTimer++;
      return;
    }

    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer--;
    }

    if (this.landSquashTimer > 0) {
      this.landSquashTimer--;
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
          const floorY = getFloorElevation(f, footCenter);
          if (oldY <= floorY + 1 && this.y >= floorY - 3 && this.y <= floorY + 16) {
            if (this.x + 12 >= f.x1 - 2 && this.x + 4 <= f.x2 + 2) {
              this.y = floorY;
              this.vy = 0;
              this.vx = 0;
              this.isJumping = false;
              this.isClimbing = false;
              this.landSquashTimer = 4;
              if (window.burgerPanicGame && window.burgerPanicGame.spawnJumpDust) {
                window.burgerPanicGame.spawnJumpDust(footCenter, floorY + 14);
              }
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
              (f) => Math.abs(getFloorElevation(f, touchingLadder.x + 8) - touchingLadder.y1) <= 8 &&
                     (touchingLadder.x + 14 >= f.x1 && touchingLadder.x + 2 <= f.x2)
            );
            if (topFloor) {
              this.y = getFloorElevation(topFloor, this.x + 8);
              this.isClimbing = false;
              this.facingDir = 'up';
              const minWalkX = topFloor.x1;
              const maxWalkX = topFloor.x2 - this.width;
              if (maxWalkX >= minWalkX) {
                this.x = Math.max(minWalkX, Math.min(maxWalkX, this.x));
              }
              window.soundManager.playStep();
              return;
            } else {
              this.y = touchingLadder.y1;
            }
          } else if (wantY > 0 && newY > touchingLadder.y2) {
            // Reached the bottom of the ladder!
            const botFloor = floors.find(
              (f) => Math.abs(getFloorElevation(f, touchingLadder.x + 8) - touchingLadder.y2) <= 8 &&
                     (touchingLadder.x + 14 >= f.x1 && touchingLadder.x + 2 <= f.x2)
            );
            if (botFloor) {
              this.y = getFloorElevation(botFloor, this.x + 8);
              this.isClimbing = false;
              this.facingDir = 'down';
              const minWalkX = botFloor.x1;
              const maxWalkX = botFloor.x2 - this.width;
              if (maxWalkX >= minWalkX) {
                this.x = Math.max(minWalkX, Math.min(maxWalkX, this.x));
              }
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
        const footCenter = this.x + 8;
        this.y = getFloorElevation(currentFloor, footCenter);
        this.isClimbing = false;
        this.dir = wantX > 0 ? 1 : -1;
        this.facingDir = this.dir === 1 ? 'right' : 'left';
        this.vx = wantX * this.speed;

        // Carry dynamic horizontal floor velocity (swaying, swing)
        let newX = this.x + this.vx;
        if (currentFloor.vx) newX += currentFloor.vx;

        const mapW = (this.levelData && this.levelData.width) ? this.levelData.width : 240;
        const minX = currentFloor.x1;
        const maxX = currentFloor.x2 - this.width;

        let canWalkOnCurrent = (newX >= minX && newX <= maxX);

        if (!canWalkOnCurrent && wantX < 0 && this.x > maxX) {
          canWalkOnCurrent = true;
          newX = Math.max(minX, newX);
        } else if (!canWalkOnCurrent && wantX > 0 && this.x < minX) {
          canWalkOnCurrent = true;
          newX = Math.min(maxX, newX);
        }

        if (canWalkOnCurrent) {
          this.x = newX;
          this.animTimer++;
          if (this.animTimer % 7 === 0) {
            this.animFrame = 1 - this.animFrame;
          }
          if (this.animTimer % 14 === 0) {
            window.soundManager.playStep();
          }
        } else {
          // Check if an adjacent connecting floor or diagonal ramp connects at this boundary!
          const nextFootX = newX + 8;
          const connectingFloor = floors.find(f => {
            if (f === currentFloor) return false;
            if (newX + 14 < f.x1 - 2 || newX + 2 > f.x2 + 2) return false;
            const checkX = Math.max(f.x1, Math.min(f.x2, nextFootX));
            const elev = getFloorElevation(f, checkX);
            return Math.abs(elev - this.y) <= 8;
          });

          if (connectingFloor) {
            // Seamless transition onto adjacent floor or diagonal ramp without falling
            this.x = newX;
            const newFootX = Math.max(connectingFloor.x1, Math.min(connectingFloor.x2, newX + 8));
            this.y = getFloorElevation(connectingFloor, newFootX);
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
              // Real interior platform gap: stepped off into empty air, fall by gravity!
              this.x = newX;
              this.isJumping = true;
              this.vy = 0.5;
              this.vx = wantX * this.speed;
            }
          }
        }
      }
    } else if (wantY === 0) {
      this.vx = 0;
      // If standing still on a dynamic moving floor (elevator, swaying, swing), ride along!
      if (currentFloor && !this.isJumping && !this.isClimbing) {
        if (currentFloor.vx) this.x += currentFloor.vx;
        const footCenter = this.x + 8;
        this.y = getFloorElevation(currentFloor, footCenter);
      }
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

    // Subtle arcade Squash & Stretch anchored to Chef's feet
    let scaleX = 1.0;
    let scaleY = 1.0;
    if (this.landSquashTimer > 0) {
      scaleX = 1.14;
      scaleY = 0.88; // Impact squash upon landing
    } else if (this.isJumping) {
      if (this.vy < 0) {
        scaleX = 0.92;
        scaleY = 1.10; // Vault stretch
      } else {
        scaleX = 0.95;
        scaleY = 1.05; // Fall stretch
      }
    }

    const hasScale = (scaleX !== 1.0 || scaleY !== 1.0);
    if (hasScale) {
      ctx.save();
      const footX = this.x + 8;
      const footY = this.y + 14;
      ctx.translate(footX, footY);
      ctx.scale(scaleX, scaleY);
      ctx.translate(-footX, -footY);
    }

    // Draw from atlas with accurate alignment
    const drawn = window.spriteManager.drawAtlas(ctx, atlasName, drawX, drawY, flip);
    if (!drawn) {
      // Fallback
      const spr = window.spriteManager.get('player_walk1');
      if (spr) ctx.drawImage(spr, this.x, this.y, 16, 16);
    }

    if (hasScale) {
      ctx.restore();
      // Render Blowtorch on Chef and overhead mini fuel bar
    if (this.hasBlowtorch && !this.isDead) {
      ctx.save();
      const flip = (this.dir === -1 || this.facingDir === 'left');
      const bX = flip ? (this.x + 13) : (this.x - 3);
      const bY = this.y + 4;

      // Strapped Blue Canister
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(Math.round(bX), Math.round(bY), 5, 8);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(Math.round(bX + 1), Math.round(bY + 1), 1, 6);

      // Brass valve
      ctx.fillStyle = '#eab308';
      ctx.fillRect(Math.round(bX + (flip ? -1 : 4)), Math.round(bY - 1), 3, 2);

      // Flickering pilot light at the nozzle
      const nozX = flip ? (this.x - 4) : (this.x + 19);
      const nozY = this.y + 8;
      ctx.fillStyle = Math.random() < 0.5 ? '#38bdf8' : '#f97316';
      ctx.fillRect(Math.round(nozX), Math.round(nozY), 2, 2);

      // Mini overhead fuel meter
      const pct = Math.max(0, Math.min(1, this.blowtorchFuel / this.maxBlowtorchFuel));
      const mw = 18;
      const mh = 3;
      const mx = Math.round(this.x + 8 - mw / 2);
      const my = Math.round(drawY - 6);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(mx - 1, my - 1, mw + 2, mh + 2);
      ctx.fillStyle = pct > 0.5 ? '#22c55e' : (pct > 0.25 ? '#eab308' : '#ef4444');
      ctx.fillRect(mx, my, Math.round(mw * pct), mh);

      ctx.restore();
    }
  }
    // Render Blowtorch on Chef and overhead mini fuel bar
    if (this.hasBlowtorch && !this.isDead) {
      ctx.save();
      const flip = (this.dir === -1 || this.facingDir === 'left');
      const bX = flip ? (this.x + 13) : (this.x - 3);
      const bY = this.y + 4;

      // Strapped Blue Canister
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(Math.round(bX), Math.round(bY), 5, 8);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(Math.round(bX + 1), Math.round(bY + 1), 1, 6);

      // Brass valve
      ctx.fillStyle = '#eab308';
      ctx.fillRect(Math.round(bX + (flip ? -1 : 4)), Math.round(bY - 1), 3, 2);

      // Flickering pilot light at the nozzle
      const nozX = flip ? (this.x - 4) : (this.x + 19);
      const nozY = this.y + 8;
      ctx.fillStyle = Math.random() < 0.5 ? '#38bdf8' : '#f97316';
      ctx.fillRect(Math.round(nozX), Math.round(nozY), 2, 2);

      // Mini overhead fuel meter
      const pct = Math.max(0, Math.min(1, this.blowtorchFuel / this.maxBlowtorchFuel));
      const mw = 18;
      const mh = 3;
      const mx = Math.round(this.x + 8 - mw / 2);
      const my = Math.round(drawY - 6);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(mx - 1, my - 1, mw + 2, mh + 2);
      ctx.fillStyle = pct > 0.5 ? '#22c55e' : (pct > 0.25 ? '#eab308' : '#ef4444');
      ctx.fillRect(mx, my, Math.round(mw * pct), mh);

      ctx.restore();
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

    // Dead-end and anti-oscillation tracking
    this.bouncedEdge = null;
    this.bounceX = x;
    this.pacingCount = 0;

    // Differentiate speeds subtly so enemies don't cluster or walk in exact lockstep
    let speedMod = 1.0;
    if (type === 'pickle') speedMod = 1.08;
    else if (type === 'egg') speedMod = 0.94;
    this.speed = speed * speedMod;
    this.baseSpeed = this.speed;
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
    this.bouncedEdge = null;
    this.bounceX = this.x;
    this.pacingCount = 0;
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
      const curFloor = getNearestFloor(this.x, this.y, floors);
      if (curFloor) {
        if (curFloor.vx) this.x += curFloor.vx;
        if (curFloor.vy) this.y += curFloor.vy;
        this.y = getFloorElevation(curFloor, this.x + 8);
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
        const footX = this.x + 8;
        for (const f of floors) {
          const floorY = getFloorElevation(f, footX);
          if (prevY <= floorY + 2 && this.y >= floorY - 3) {
            if (this.x + 12 >= f.x1 && this.x + 4 <= f.x2) {
              this.y = floorY;
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

    // Clear edge bounce commitment once enemy has moved a safe distance (~28px) away from edge
    if (this.bouncedEdge && Math.abs(this.x - this.bounceX) >= 28) {
      this.bouncedEdge = null;
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

        // Dead-End Escape: If trapped/pacing this platform without finding player,
        // take ANY open ladder direction to navigate out of the dead-end!
        if (!wantClimb && (this.pacingCount || 0) >= 2) {
          const canAltUp = currentLadder.y1 < this.y - 2;
          const canAltDown = currentLadder.y2 > this.y + 2;
          if (canAltUp || canAltDown) {
            wantClimb = true;
          }
        }

        if (wantClimb) {
          this.isClimbing = true;
          this.x = currentLadder.x;
          // Prioritize player direction if valid, otherwise take whichever ladder path is open
          if (canGoUp) this.climbDir = -1;
          else if (canGoDown) this.climbDir = 1;
          else if (currentLadder.y1 < this.y - 2) this.climbDir = -1;
          else this.climbDir = 1;

          this.changeDirCooldown = 25;
          this.bouncedEdge = null;
          this.pacingCount = 0;
        } else {
          // IMPORTANT: Do NOT force this.dir = dx >= 0 ? 1 : -1 !
          // The enemy must continue in its current heading to traverse the platform
          // and reach other ladders or connecting ramps!
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
          this.y = getFloorElevation(currentFloor, this.x + 8);
          this.dir = dx >= 0 ? 1 : -1;
          this.changeDirCooldown = 25;
          this.bouncedEdge = null;
          this.pacingCount = 0;
        }
      }
      // Case C: Walking on floor with no ladder: steer towards player
      else if (!this.isClimbing && currentFloor) {
        // Only steer towards player if NOT currently moving away from a recently bounced dead-end edge!
        if (!this.bouncedEdge && Math.abs(dx) > 12 && Math.random() < 0.04) {
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
        if (currentFloor) this.y = getFloorElevation(currentFloor, this.x + 8);
        return;
      }

      const nextY = this.y + (this.climbDir || 1) * this.speed * 0.85;
      if (nextY >= currentLadder.y1 && nextY <= currentLadder.y2) {
        this.y = nextY;
      } else {
        this.isClimbing = false;
        const targetY = (this.climbDir < 0) ? currentLadder.y1 : currentLadder.y2;
        const destFloor = floors.find(f => Math.abs(getFloorElevation(f, this.x + 8) - targetY) <= 8 &&
          (this.x + 14 >= f.x1 && this.x + 2 <= f.x2));
        if (destFloor) {
          this.y = getFloorElevation(destFloor, this.x + 8);
        } else {
          this.y = targetY;
        }
        this.dir = dx >= 0 ? 1 : -1;
        this.changeDirCooldown = 20;
        this.bouncedEdge = null;
        this.pacingCount = 0;
      }
    } else if (currentFloor) {
      if (!this.dir) this.dir = dx >= 0 ? 1 : -1;

      const footX = this.x + 8;
      this.y = getFloorElevation(currentFloor, footX);

      // Carry moving floor velocity horizontally (swaying platforms, swings)
      if (currentFloor.vx) this.x += currentFloor.vx;

      const nextX = this.x + this.dir * this.speed;

      // Platform bounds check
      const minX = currentFloor.x1;
      const maxX = Math.max(minX, currentFloor.x2 - this.width);

      const canWalkOnCurrent = (this.dir > 0) ? (nextX <= maxX) : (nextX >= minX);

      if (canWalkOnCurrent) {
        this.x = nextX;
      } else {
        // nextX is beyond currentFloor boundary.
        // Check if an adjacent connecting floor or diagonal ramp supports this movement!
        const nextFootX = nextX + 8;
        const connectingFloor = floors.find(f => {
          if (f === currentFloor) return false;
          if (nextX + 14 < f.x1 - 2 || nextX + 2 > f.x2 + 2) return false;
          const checkX = Math.max(f.x1, Math.min(f.x2, nextFootX));
          const elev = getFloorElevation(f, checkX);
          return Math.abs(elev - this.y) <= 8;
        });

        if (connectingFloor) {
          // Seamless transition onto connecting platform or diagonal ramp!
          this.x = nextX;
          const checkX = Math.max(connectingFloor.x1, Math.min(connectingFloor.x2, nextX + 8));
          this.y = getFloorElevation(connectingFloor, checkX);
          this.bouncedEdge = null;
          this.pacingCount = 0;
        } else {
          // True platform edge / dead end: reverse direction smoothly!
          if (this.dir > 0) {
            this.x = maxX;
            this.dir = -1;
            this.bouncedEdge = 'right';
            this.bounceX = this.x;
          } else {
            this.x = minX;
            this.dir = 1;
            this.bouncedEdge = 'left';
            this.bounceX = this.x;
          }
          this.pacingCount = (this.pacingCount || 0) + 1;
          this.changeDirCooldown = 25;
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

    // Also check collision with active Boss if present
    if (window.burgerPanicGame && window.burgerPanicGame.boss && !window.burgerPanicGame.boss.isDead) {
      const boss = window.burgerPanicGame.boss;
      const bx = boss.x + 12;
      const by = boss.y + 12;
      for (const p of this.particles) {
        if (Math.hypot(p.x - bx, p.y - by) < 18) {
          boss.onPepperHit();
          break;
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
// BONUS ITEM (ICE CREAM, COFFEE, EXTRA LIFE)
// ========================================================
class BonusItem {
  constructor(x, y, type = 'bonus_icecream') {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.type = type;
    this.timer = 550; // Time before disappearing
    this.sparklePhase = Math.random() * Math.PI * 2;
    this.dynamicFloor = null;
    this.relOffsetX = 0;
  }

  update(floors) {
    this.timer--;
    // If sitting on a dynamic moving floor (elevator, swaying, swing), ride along smoothly!
    if (floors && !this.dynamicFloor) {
      this.dynamicFloor = floors.find(f => 
        (f.type === 'elevator' || f.type === 'swaying' || f.type === 'swing') &&
        this.x + 8 >= f.x1 - 4 && this.x + 8 <= f.x2 + 4 &&
        Math.abs(f.y - this.startY) <= 18
      );
      if (this.dynamicFloor) {
        const midX = (this.dynamicFloor.x1 + this.dynamicFloor.x2) / 2;
        this.relOffsetX = this.startX - midX;
      }
    }

    if (this.dynamicFloor) {
      const midX = (this.dynamicFloor.x1 + this.dynamicFloor.x2) / 2;
      this.x = Math.round(midX + this.relOffsetX);
      this.y = this.dynamicFloor.y;
    }
  }

  draw(ctx) {
    const spr = window.spriteManager.get(this.type);
    if (!spr) return;

    // Urgency blinking when expiring
    if (this.timer < 120) {
      const blinkSpeed = this.timer < 45 ? 4 : 8;
      if (Math.floor(this.timer / blinkSpeed) % 2 === 0) return;
    }

    const now = Date.now();
    // Gentle arcade floating/bobbing oscillation (±2px)
    const bobY = Math.sin((now / 190) + this.sparklePhase) * 2;
    const targetSize = 20;
    const drawX = Math.round(this.x - (targetSize - 16) / 2);
    const drawY = Math.round(this.y + bobY - (targetSize - 16) / 2);
    const centerX = this.x + 8;
    const centerY = drawY + 10;

    ctx.save();

    // 1. Oval platform ambient shadow beneath hovering item
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    const shadowWidth = Math.max(3, 7 - Math.abs(bobY) * 0.6);
    ctx.ellipse(centerX, this.y + 16, shadowWidth, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Soft pulsating ambient glow halo tailored to item palette
    let haloColor = 'rgba(255, 204, 0, 0.25)';
    let sparkleColor = '#ffffff';

    if (this.type === 'bonus_life') {
      haloColor = 'rgba(252, 184, 0, 0.4)';
      sparkleColor = '#ffe360';
    } else if (this.type === 'bonus_icecream') {
      haloColor = 'rgba(255, 96, 151, 0.3)';
      sparkleColor = '#ffcce0';
    } else if (this.type === 'bonus_coffee') {
      haloColor = 'rgba(0, 240, 255, 0.25)';
      sparkleColor = '#d8f4ff';
    } else if (this.type === 'bonus_fries') {
      haloColor = 'rgba(252, 208, 24, 0.3)';
      sparkleColor = '#fff6b8';
    } else if (this.type === 'bonus_donut') {
      haloColor = 'rgba(232, 40, 106, 0.3)';
      sparkleColor = '#ffd0e4';
    }

    const pulse = 9 + Math.sin(now / 160) * 1.5;
    ctx.fillStyle = haloColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulse, 0, Math.PI * 2);
    ctx.fill();

    // 3. Render 16-Bit HD Arcade Sprite
    ctx.drawImage(spr, drawX, drawY, targetSize, targetSize);

    // 4. Sparkling 4-point twinkle stars orbiting the item
    const phase1 = (now / 140) + this.sparklePhase;
    const sx1 = centerX + Math.cos(phase1) * 9;
    const sy1 = centerY - 5 + Math.sin(phase1 * 1.6) * 4;

    ctx.fillStyle = sparkleColor;
    ctx.fillRect(Math.round(sx1) - 1, Math.round(sy1), 3, 1);
    ctx.fillRect(Math.round(sx1), Math.round(sy1) - 1, 1, 3);

    // Secondary sparkle for extra life
    if (this.type === 'bonus_life') {
      const phase2 = phase1 + Math.PI;
      const sx2 = centerX + Math.cos(phase2) * 8;
      const sy2 = centerY - 2 + Math.sin(phase2 * 1.4) * 4;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.round(sx2) - 1, Math.round(sy2), 3, 1);
      ctx.fillRect(Math.round(sx2), Math.round(sy2) - 1, 1, 3);
    }

    ctx.restore();
  }
}

// ========================================================
// ARCADE PARTICLE (JUICE & VIBRANT PHYSICAL DUST/SPARKS)
// ========================================================
class ArcadeParticle {
  constructor(x, y, vx, vy, color, size, life, shape = 'rect') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.initialLife = life;
    this.life = life;
    this.shape = shape; // 'rect', 'star', 'smoke'
    this.gravity = shape === 'smoke' ? -0.015 : 0.14;
    this.rot = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.28;
  }

  update() {
    this.life--;
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.rot += this.rotSpeed;
    if (this.shape === 'smoke') {
      this.vx *= 0.94;
      this.size *= 1.03;
    }
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life / this.initialLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(Math.round(this.x), Math.round(this.y));
    ctx.rotate(this.rot);
    ctx.fillStyle = this.color;

    if (this.shape === 'star') {
      const s = Math.round(this.size);
      ctx.fillRect(-s, -1, s * 2, 2);
      ctx.fillRect(-1, -s, 2, s * 2);
    } else if (this.shape === 'smoke') {
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, this.size), 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-Math.round(this.size / 2), -Math.round(this.size / 2), this.size, this.size);
    }
    ctx.restore();
  }
}

// ========================================================
// SCORE POPUP (JUICY ELASTIC BOUNCE & RETRO STROKE)
// ========================================================
class ScorePopup {
  constructor(text, x, y) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.initialTimer = 50;
    this.timer = 50;

    // Pick vibrant arcade color based on event type
    const upper = text.toUpperCase();
    if (upper.includes('VIDA') || upper.includes('COMBO')) {
      this.color = '#ff2a85'; // Neon magenta
      this.strokeColor = '#ffffff';
    } else if (upper.includes('SQUASH') || upper.includes('APLASTA')) {
      this.color = '#00f0ff'; // Neon electric cyan
      this.strokeColor = '#000000';
    } else if (upper.includes('PERFECT') || upper.includes('1000')) {
      this.color = '#39ff14'; // Neon lime
      this.strokeColor = '#000000';
    } else {
      this.color = '#ffd700'; // Gold yellow
      this.strokeColor = '#000000';
    }
  }

  update() {
    this.timer--;
    this.y -= 0.65;
  }

  draw(ctx) {
    ctx.save();
    const progress = 1 - (this.timer / this.initialTimer);
    // Elastic scale pop in first 8 frames: 1.4 -> 1.0
    const scale = this.timer > 42 ? 1.4 - (50 - this.timer) * 0.05 : 1.0;

    ctx.translate(Math.round(this.x), Math.round(this.y));
    ctx.scale(scale, scale);

    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';

    // Bold arcade contrast outline
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = this.strokeColor;
    ctx.strokeText(this.text, 0, 0);

    // Vibrant face fill
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, 0, 0);

    ctx.restore();
  }
}

// ========================================================
// CUPHEAD-STYLE STAGE BOSS (5 ICONIC BOSS ENCOUNTERS)
// ========================================================
class Boss {
  constructor(config, levelData) {
    this.id = config.id || 'root_pack';
    this.name = config.name || 'EL GRAN JEFE';
    this.subtitle = config.subtitle || '¡A COCINAR!';
    this.maxHealth = config.health || 300;
    this.health = this.maxHealth;
    this.x = config.x || 120;
    this.y = config.y || 48;
    this.startX = this.x;
    this.startY = this.y;
    this.width = 24;
    this.height = 24;
    this.speed = config.speed || 0.75;
    this.baseSpeed = this.speed;
    this.dir = 1;
    this.levelData = levelData;

    this.isEnraged = false;
    this.isDead = false;
    this.state = 'normal'; // 'normal', 'stunned', 'enraged', 'dying'
    this.stunTimer = 0;
    this.hitFlashTimer = 0;
    this.pepperCooldown = 0;
    this.attackTimer = 150;
    this.projectiles = [];
    this.animTimer = 0;
  }

  takeDamage(amount, source = 'attack') {
    if (this.isDead) return;
    this.health = Math.max(0, this.health - amount);
    this.hitFlashTimer = 14;

    if (window.burgerPanicGame) {
      window.burgerPanicGame.addScore(source === 'burger' ? 1000 : 250, this.x + 8, this.y);
      window.burgerPanicGame.spawnSquashSparks(this.x + 12, this.y + 12);
      window.burgerPanicGame.addScreenShake(source === 'burger' ? 6.0 : 2.5);
    }

    if (this.health <= 0) {
      this.defeat();
      return;
    }

    if (this.health <= this.maxHealth * 0.5 && !this.isEnraged) {
      this.enrage();
    }
  }

  onPepperHit() {
    if (this.isDead || this.pepperCooldown > 0) return;
    this.pepperCooldown = 28;
    this.stunTimer = 95;
    this.state = 'stunned';
    if (window.soundManager) window.soundManager.playStun();
    this.takeDamage(35, 'pepper');
  }

  onBurgerCrush() {
    if (this.isDead) return;
    this.stunTimer = 110;
    this.state = 'stunned';
    if (window.soundManager) window.soundManager.playSquash();
    this.takeDamage(100, 'burger');
  }

  enrage() {
    this.isEnraged = true;
    this.speed = this.baseSpeed * 1.45;
    if (window.burgerPanicGame) {
      window.burgerPanicGame.popups.push(
        new window.ScorePopup(`¡${this.name} ENFURECIDO!`, this.x + 12, this.y - 10)
      );
      window.burgerPanicGame.addScreenShake(5.0);
    }
  }

  defeat() {
    this.isDead = true;
    this.state = 'dying';
    this.projectiles = [];
    if (window.soundManager) window.soundManager.playSquash();
    if (window.burgerPanicGame) {
      window.burgerPanicGame.addScore(3000, this.x + 12, this.y);
      window.burgerPanicGame.popups.push(
        new window.ScorePopup(`¡JEFE DERROTADO! +3000`, this.x + 12, this.y - 14)
      );
      window.burgerPanicGame.spawnSquashSparks(this.x + 12, this.y + 12);
      window.burgerPanicGame.addScreenShake(8.0);
    }
  }

  update(player, ladders, floors) {
    if (this.isDead) return;

    this.animTimer++;
    if (this.hitFlashTimer > 0) this.hitFlashTimer--;
    if (this.pepperCooldown > 0) this.pepperCooldown--;

    // Update active boss projectiles
    const mapW = (this.levelData && this.levelData.width) ? this.levelData.width : 240;
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      // Check player hit by boss projectile
      if (player && !player.isDead && player.invulnerableTimer === 0) {
        const dist = Math.hypot((p.x) - (player.x + 8), (p.y) - (player.y + 8));
        if (dist < 10) {
          player.die();
          if (window.burgerPanicGame) {
            window.burgerPanicGame.state = 'DYING';
            window.burgerPanicGame.stateTimer = 90;
          }
          this.projectiles.splice(i, 1);
          continue;
        }
      }

      if (p.life <= 0 || p.x < 0 || p.x > mapW || p.y < 0 || p.y > 320) {
        this.projectiles.splice(i, 1);
      }
    }

    if (this.stunTimer > 0) {
      this.stunTimer--;
      if (this.stunTimer <= 0) {
        this.state = 'normal';
      }
      return;
    }

    // Patrol along current platform & chase player horizontally
    const curFloor = getNearestFloor(this.x, this.y, floors, 10);
    const minX = curFloor ? curFloor.x1 + 4 : 20;
    const maxX = curFloor ? Math.max(minX, curFloor.x2 - 24) : mapW - 28;

    this.x += this.dir * this.speed;
    if (this.x <= minX) {
      this.x = minX;
      this.dir = 1;
    } else if (this.x >= maxX) {
      this.x = maxX;
      this.dir = -1;
    }

    if (curFloor) {
      this.y = getFloorElevation(curFloor, this.x + 12);
    }

    // Boss signature Cuphead-style projectile attack
    this.attackTimer--;
    const fireInterval = this.isEnraged ? 115 : 175;
    if (this.attackTimer <= 0 && player && !player.isDead) {
      this.attackTimer = fireInterval;
      this.fireAttack(player);
    }
  }

  fireAttack(player) {
    const bx = this.x + 12;
    const by = this.y + 12;
    const angle = Math.atan2((player.y + 8) - by, (player.x + 8) - bx);
    const spd = this.isEnraged ? 1.85 : 1.35;

    const colors = {
      'root_pack': '#a3e635',
      'goopy': '#38bdf8',
      'baroness': '#f472b6',
      'grim': '#fb923c',
      'king_dice': '#c084fc'
    };
    const pColor = colors[this.id] || '#fbbf24';

    this.projectiles.push({
      x: bx,
      y: by,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      color: pColor,
      life: 190
    });

    if (this.isEnraged) {
      // Spread shot in Phase 2 (Enrage)
      for (const offset of [-0.32, 0.32]) {
        this.projectiles.push({
          x: bx,
          y: by,
          vx: Math.cos(angle + offset) * spd,
          vy: Math.sin(angle + offset) * spd,
          color: '#ff2a85',
          life: 165
        });
      }
    }
  }

  draw(ctx) {
    if (this.isDead) return;

    ctx.save();

    // Draw Boss Projectiles (Cuphead Parry-Pink & glowing orbs)
    for (const p of this.projectiles) {
      const pulse = 3.5 + Math.sin(this.animTimer * 0.35) * 1.0;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(Math.round(p.x), Math.round(p.y), pulse + 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(Math.round(p.x), Math.round(p.y), pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    const bob = Math.sin(this.animTimer * (this.isEnraged ? 0.25 : 0.12)) * 2.5;
    const bx = Math.round(this.x);
    const by = Math.round(this.y - 6 + bob);

    // Shadow on platform
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(bx + 12, this.y + 15, 11, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Enrage fiery aura
    if (this.isEnraged) {
      const auraR = 16 + Math.sin(this.animTimer * 0.4) * 3;
      ctx.fillStyle = 'rgba(255, 42, 133, 0.28)';
      ctx.beginPath();
      ctx.arc(bx + 12, by + 11, auraR, 0, Math.PI * 2);
      ctx.fill();
    }

    // Flash white when taking damage
    const isFlashing = this.hitFlashTimer > 0 && (this.hitFlashTimer % 2 === 0);

    // Draw Cuphead-inspired Boss Character Pixel Art / Vector Silhouette
    this.drawBossCharacter(ctx, bx, by, isFlashing);

    // Stunned dizzy stars
    if (this.stunTimer > 0) {
      ctx.fillStyle = '#fde047';
      for (let i = 0; i < 3; i++) {
        const ang = (this.animTimer * 0.15) + (i * Math.PI * 2 / 3);
        const sx = bx + 12 + Math.cos(ang) * 10;
        const sy = by - 3 + Math.sin(ang) * 3;
        ctx.fillRect(Math.round(sx) - 1, Math.round(sy) - 1, 3, 3);
      }
    }

    ctx.restore();
  }

  drawBossCharacter(ctx, bx, by, isFlashing) {
    ctx.save();
    if (this.id === 'root_pack') {
      // Sal Spudder / Root Pack (Giant angry cartoon Potato/Root Boss)
      ctx.fillStyle = isFlashing ? '#ffffff' : (this.isEnraged ? '#d97706' : '#a16207');
      ctx.beginPath();
      ctx.ellipse(bx + 12, by + 11, 12, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#422006';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Leafy crown
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(bx + 8, by - 3, 8, 4);
    } else if (this.id === 'goopy') {
      // Goopy Le Grande (Giant Bouncing Blue Slime with Boxing Crown)
      ctx.fillStyle = isFlashing ? '#ffffff' : (this.isEnraged ? '#2563eb' : '#0ea5e9');
      ctx.beginPath();
      ctx.arc(bx + 12, by + 11, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#082f49';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Red nose cap
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(bx + 10, by + 9, 4, 4);
    } else if (this.id === 'baroness') {
      // Baroness Von Bon Bon (Candy Castle Cupcake Queen)
      ctx.fillStyle = isFlashing ? '#ffffff' : (this.isEnraged ? '#db2777' : '#f472b6');
      ctx.beginPath();
      ctx.arc(bx + 12, by + 11, 11, 0, Math.PI * 2);
      ctx.fill();
      // Golden Candy Crown
      ctx.fillStyle = '#facc15';
      ctx.fillRect(bx + 6, by - 2, 12, 4);
      ctx.fillRect(bx + 7, by - 5, 2, 3);
      ctx.fillRect(bx + 11, by - 6, 2, 4);
      ctx.fillRect(bx + 15, by - 5, 2, 3);
    } else if (this.id === 'grim') {
      // Grim Matchstick (Fiery Emerald Dragon)
      ctx.fillStyle = isFlashing ? '#ffffff' : (this.isEnraged ? '#dc2626' : '#16a34a');
      ctx.beginPath();
      ctx.ellipse(bx + 12, by + 11, 12, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      // Dragon Horns & Spikes
      ctx.fillStyle = '#facc15';
      ctx.fillRect(bx + 4, by - 2, 3, 5);
      ctx.fillRect(bx + 17, by - 2, 3, 5);
    } else {
      // King Dice (Purple Casino Dapper Cube Boss)
      ctx.fillStyle = isFlashing ? '#ffffff' : (this.isEnraged ? '#9333ea' : '#f8fafc');
      ctx.fillRect(bx + 1, by, 22, 22);
      ctx.strokeStyle = '#581c87';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx + 1, by, 22, 22);
      // Purple bow tie
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(bx + 8, by + 18, 8, 4);
    }

    // Cuphead 1930s Pie-Cut Cartoon Eyes & Grimace
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + 5, by + 5, 5, 6);
    ctx.fillRect(bx + 14, by + 5, 5, 6);
    ctx.fillStyle = this.isEnraged ? '#ef4444' : '#000000';
    const pupilOffset = this.dir > 0 ? 2 : 0;
    ctx.fillRect(bx + 5 + pupilOffset, by + 7, 3, 3);
    ctx.fillRect(bx + 14 + pupilOffset, by + 7, 3, 3);

    // Angry brow
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bx + 4, by + 4);
    ctx.lineTo(bx + 10, by + 6);
    ctx.moveTo(bx + 20, by + 4);
    ctx.lineTo(bx + 14, by + 6);
    ctx.stroke();

    // Cartoon grin
    ctx.fillStyle = '#000000';
    ctx.fillRect(bx + 6, by + 14, 12, 3);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + 8, by + 14, 2, 2);
    ctx.fillRect(bx + 11, by + 14, 2, 2);
    ctx.fillRect(bx + 14, by + 14, 2, 2);

    ctx.restore();
  }

  drawHUDHealthBar(ctx) {
    if (this.isDead) return;

    ctx.save();
    const barW = 148;
    const barH = 8;
    const barX = 46;
    const barY = 39;

    // Dark arcade frame
    ctx.fillStyle = 'rgba(10, 8, 20, 0.9)';
    ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);
    ctx.strokeStyle = this.isEnraged ? '#ff2a85' : '#fcb400';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(barX - 1, barY - 1, barW + 2, barH + 2);

    // Health fill
    const ratio = Math.max(0, Math.min(1, this.health / this.maxHealth));
    const fillW = Math.round(barW * ratio);
    let fillColor = '#22c55e';
    if (ratio <= 0.25) fillColor = '#ef4444';
    else if (ratio <= 0.5) fillColor = '#f59e0b';

    ctx.fillStyle = fillColor;
    ctx.fillRect(barX, barY, fillW, barH);

    // Glossy top highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(barX, barY, fillW, 2);

    // Boss Name Tag centered on bar
    ctx.fillStyle = '#ffffff';
    ctx.font = '5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`👑 ${this.name} (${this.health}/${this.maxHealth})`, 120, barY + 6);

    ctx.restore();
  }
}

window.Player = Player;
window.Enemy = Enemy;
window.Boss = Boss;
window.PepperCloud = PepperCloud;
window.BonusItem = BonusItem;
window.ArcadeParticle = ArcadeParticle;
window.ScorePopup = ScorePopup;
