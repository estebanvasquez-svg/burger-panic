/**
 * Burger Piece Mechanics & Cascades for Burger Panic Mobile
 */
class BurgerPiece {
  constructor(data, levelData) {
    this.col = data.col;
    this.x = data.x;
    this.y = data.y;
    this.initialY = data.y;
    this.type = data.type; // 'bun_top', 'lettuce', 'tomato', 'cheese', 'patty', 'bun_bottom'
    this.width = 32;
    this.height = 8;
    this.levelData = levelData;

    // 4 segments (8px each)
    this.segments = [
      { stepped: false, dropY: 0 },
      { stepped: false, dropY: 0 },
      { stepped: false, dropY: 0 },
      { stepped: false, dropY: 0 }
    ];

    this.falling = false;
    this.fallSpeed = 3.5;
    this.targetY = this.y;
    this.landedOnPlate = false;
    this.riders = []; // Enemies currently riding this falling piece
    this.bounceTimer = 0; // Squash & stretch bounce when landing
  }

  // Check if player walks across segments
  checkPlayerStep(player) {
    if (this.falling || this.landedOnPlate || player.isDead) return;

    // Both player.y and burger.y are aligned to floor.y
    // Verify vertical distance is within walking range
    if (Math.abs(player.y - this.y) > 8) return;

    // Check player foot span [pX1, pX2]
    const pX1 = player.x + 2;
    const pX2 = player.x + 14;

    let newlyStepped = false;
    for (let i = 0; i < 4; i++) {
      const segX1 = this.x + i * 8;
      const segX2 = segX1 + 8;

      if (pX2 >= segX1 && pX1 <= segX2) {
        if (!this.segments[i].stepped) {
          this.segments[i].stepped = true;
          this.segments[i].dropY = 3; // Visual dip
          newlyStepped = true;
          if (window.burgerPanicGame && window.burgerPanicGame.spawnBreadCrumbs) {
            window.burgerPanicGame.spawnBreadCrumbs(segX1 + 4, this.y + 6);
          }
        }
      }
    }

    if (newlyStepped) {
      window.soundManager.playStep();
    }

    // Check if all 4 segments have been stepped on
    if (this.segments.every((s) => s.stepped)) {
      this.triggerFall();
    }
  }

  triggerFall(forced = false) {
    if (this.falling || this.landedOnPlate) return;
    this.falling = true;
    window.soundManager.playDrop();

    // Reset visual dip during fall
    this.segments.forEach((s) => (s.dropY = 0));

    // Calculate next floor below
    this.targetY = this.findNextFloorBelow();
  }

  findNextFloorBelow() {
    const floors = this.levelData.floors;
    const plateFloor = floors[floors.length - 1];
    let closestY = plateFloor ? plateFloor.y : 288;

    for (const f of floors) {
      let floorY = f.y;
      if (f.type === 'diagonal') {
        const ratio = Math.max(0, Math.min(1, (this.x + 16 - f.x1) / Math.max(1, f.x2 - f.x1)));
        floorY = Math.round(f.y1 + (f.y2 - f.y1) * ratio);
      }
      if (floorY > this.y + 6 && floorY < closestY) {
        // Only land on floor segments that physically span this burger piece
        if (this.x + 6 >= f.x1 && this.x + this.width - 6 <= f.x2) {
          closestY = floorY;
        }
      }
    }
    return closestY;
  }

  update(allBurgers, enemies, addScoreCallback, onComboCallback) {
    if (!this.falling) return;

    this.y += this.fallSpeed;

    // Check enemies riding on top (only at the start of the fall, standing on the piece)
    if (this.y <= this.initialY + 6) {
      for (const enemy of enemies) {
        if (!enemy.squashed && !enemy.riding && enemy.state === 'normal') {
          if (
            Math.abs(enemy.y - this.initialY) <= 6 &&
            enemy.x + 10 >= this.x &&
            enemy.x + 6 <= this.x + this.width
          ) {
            enemy.startRiding(this);
            this.riders.push(enemy);
          }
        }
      }
    }

    // Check enemies underneath to squash them
    for (const enemy of enemies) {
      if (!enemy.squashed && !enemy.riding && enemy.state !== 'spawning') {
        const enemyCenter = enemy.x + 8;
        const enemyTop = enemy.y;
        const enemyBottom = enemy.y + 16;

        if (enemyCenter >= this.x - 2 && enemyCenter <= this.x + this.width + 2) {
          if (this.y + 12 >= enemyTop && this.y <= enemyBottom) {
            // Squash enemy with juicy physical feedback!
            enemy.squash();
            window.soundManager.playSquash();
            if (window.burgerPanicGame) {
              if (window.burgerPanicGame.spawnSquashSparks) {
                window.burgerPanicGame.spawnSquashSparks(enemy.x + 8, enemy.y + 8);
              }
              if (window.burgerPanicGame.addScreenShake) {
                window.burgerPanicGame.addScreenShake(5.0);
              }
            }
            if (addScoreCallback) {
              addScoreCallback(500, enemy.x, enemy.y);
            }
          }
        }
      }
    }

    // Check landing on targetY
    if (this.y >= this.targetY) {
      this.y = this.targetY;
      this.falling = false;
      this.bounceTimer = 5; // Squash & stretch bounce impact
      window.soundManager.playLand();

      if (window.burgerPanicGame) {
        if (window.burgerPanicGame.spawnLandingDust) {
          window.burgerPanicGame.spawnLandingDust(this.x, this.y + 6, this.width);
        }
        if (window.burgerPanicGame.addScreenShake) {
          window.burgerPanicGame.addScreenShake(2.8);
        }
      }

      // Reset step state
      this.segments.forEach((s) => {
        s.stepped = false;
        s.dropY = 0;
      });

      // If riders were carried down, destroy riders for huge bonus points & combo lives!
      if (this.riders.length > 0) {
        const riderCount = this.riders.length;
        this.riders.forEach((rider, idx) => {
          rider.crushFromRide();
          window.soundManager.playSquash();
          const pts = (idx + 1) * 500;
          if (addScoreCallback) {
            addScoreCallback(pts, rider.x, rider.y);
          }
        });

        // Combo: 2 or more enemies dropped on the same piece awards an extra life!
        if (riderCount >= 2 && onComboCallback) {
          onComboCallback(riderCount, this.x + 8, this.y);
        }

        this.riders = [];
      }

      // Check cascade: Did we land on another burger below us in the same column?
      for (const other of allBurgers) {
        if (other !== this && other.col === this.col && !other.falling) {
          if (Math.abs(other.y - this.y) < 12) {
            // Knock lower burger down!
            other.triggerFall(true);
          }
        }
      }

      // Check if reached bottom plate
      const plateFloor = this.levelData.floors[this.levelData.floors.length - 1];
      if (this.y >= plateFloor.y - 6) {
        this.landedOnPlate = true;
        // Stack neatly inside the tray
        const othersOnPlate = allBurgers.filter(
          (b) => b !== this && b.col === this.col && b.landedOnPlate
        );
        this.y = plateFloor.y - othersOnPlate.length * 4;
      }
    }
  }

  draw(ctx) {
    const sprite = window.spriteManager.get(this.type);
    if (!sprite) return;

    const sw = sprite.width / 4;
    const sh = sprite.height;

    if (this.bounceTimer > 0) {
      this.bounceTimer--;
    }

    const isBouncing = this.bounceTimer > 0;
    const scaleX = isBouncing ? 1.12 : 1.0;
    const scaleY = isBouncing ? 0.78 : 1.0;

    if (isBouncing) {
      ctx.save();
      const centerX = this.x + this.width / 2;
      const bottomY = this.y + 14;
      ctx.translate(centerX, bottomY);
      ctx.scale(scaleX, scaleY);
      ctx.translate(-centerX, -bottomY);
    }

    // Draw 4 segments resting cleanly on top of the girder
    for (let i = 0; i < 4; i++) {
      const segX = this.x + i * 8;
      const segY = this.y + 6 + (this.falling ? 0 : this.segments[i].dropY);
      ctx.drawImage(
        sprite,
        i * sw, 0, sw, sh, // source slice
        segX, segY, 8, 8 // destination
      );
    }

    if (isBouncing) {
      ctx.restore();
    }
  }
}

window.BurgerPiece = BurgerPiece;
