/**
 * Sci-Fi Enemies for Burger Panic: Metroidvania Overhaul
 * - SecurityDrone: Floating surveillance sentinel with red conical searchlight & plasma burst
 * - AlienCrawler: 4-legged bio-armored parasite patrolling lower floor
 * - AlienSoldier: Bipedal cyborg alien guarding the right airlock forcefield
 */

class SecurityDrone {
  constructor(x, y) {
    this.type = 'drone';
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.hp = 45;
    this.maxHp = 45;
    this.isDead = false;
    this.state = 'patrol'; // 'patrol', 'alert', 'dead'

    this.timer = Math.random() * 100;
    this.hitFlash = 0;
    this.searchlightAngle = 0.55; // Radians, pointing downward-right
    this.targetBeamAngle = 0.55;
    this.alertTimer = 0;
  }

  takeDamage(amount) {
    if (this.isDead) return;
    this.hp -= amount;
    this.hitFlash = 6;
    if (this.hp <= 0) {
      this.isDead = true;
      this.state = 'dead';
    }
  }

  update(player, game) {
    if (this.isDead) return;
    this.timer += 0.05;

    // Smooth sinusoidal hover flight
    this.y = this.startY + Math.sin(this.timer) * 6;
    this.x = this.startX + Math.cos(this.timer * 0.7) * 4;

    if (this.hitFlash > 0) this.hitFlash--;

    // Searchlight tracking: sweep or lock onto player if nearby
    const eyeX = this.x + 10;
    const eyeY = this.y + 12;
    if (player && !player.isDead) {
      const pCenterX = player.x + 8;
      const pCenterY = player.y + 8;
      const dist = Math.hypot(pCenterX - eyeX, pCenterY - eyeY);

      if (dist < 180) {
        // Aim searchlight cone towards player
        this.targetBeamAngle = Math.atan2(pCenterY - eyeY, pCenterX - eyeX);
      } else {
        // Ambient scanning sweep
        this.targetBeamAngle = 0.55 + Math.sin(this.timer * 0.8) * 0.35;
      }
    }

    // Smooth angle interpolation
    this.searchlightAngle += (this.targetBeamAngle - this.searchlightAngle) * 0.08;

    // Check if player is detected in searchlight beam cone
    if (player && !player.isDead) {
      const pCenterX = player.x + 8;
      const pCenterY = player.y + 8;
      const angleToPlayer = Math.atan2(pCenterY - eyeY, pCenterX - eyeX);
      const angleDiff = Math.abs(angleToPlayer - this.searchlightAngle);
      const distToPlayer = Math.hypot(pCenterX - eyeX, pCenterY - eyeY);

      if (angleDiff < 0.22 && distToPlayer < 170) {
        this.state = 'alert';
        this.alertTimer = 30;
      } else {
        if (this.alertTimer > 0) {
          this.alertTimer--;
        } else {
          this.state = 'patrol';
        }
      }
    }
  }

  draw(ctx) {
    if (this.isDead) return;

    const eyeX = this.x + 10;
    const eyeY = this.y + 12;

    // 1. Draw Active Conical Red Searchlight Beam
    ctx.save();
    const beamLength = 160;
    const halfSpread = 0.24; // ~14 degrees cone
    const a1 = this.searchlightAngle - halfSpread;
    const a2 = this.searchlightAngle + halfSpread;

    const p1x = eyeX + Math.cos(a1) * beamLength;
    const p1y = eyeY + Math.sin(a1) * beamLength;
    const p2x = eyeX + Math.cos(a2) * beamLength;
    const p2y = eyeY + Math.sin(a2) * beamLength;

    const coneGrad = ctx.createRadialGradient(eyeX, eyeY, 4, eyeX, eyeY, beamLength);
    if (this.state === 'alert') {
      coneGrad.addColorStop(0, 'rgba(239, 68, 68, 0.65)');
      coneGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.3)');
      coneGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    } else {
      coneGrad.addColorStop(0, 'rgba(244, 63, 94, 0.45)');
      coneGrad.addColorStop(0.6, 'rgba(244, 63, 94, 0.18)');
      coneGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
    }

    ctx.beginPath();
    ctx.moveTo(eyeX, eyeY);
    ctx.lineTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.closePath();
    ctx.fillStyle = coneGrad;
    ctx.fill();
    ctx.restore();

    // 2. Draw Drone Sprite / Body
    ctx.save();
    ctx.translate(this.x + 10, this.y + 10);

    if (this.hitFlash > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // Top thruster fins / antennae
    ctx.fillStyle = '#334155';
    ctx.fillRect(-8, -10, 3, 5);
    ctx.fillRect(5, -10, 3, 5);
    ctx.fillRect(-1, -12, 2, 4);

    // Main spherical robotic armored chassis
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Armored chassis plating highlight
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-5, -5, 10, 3);

    // Tripod mechanical landing legs
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Left leg
    ctx.moveTo(-5, 6);
    ctx.lineTo(-8, 12);
    ctx.lineTo(-11, 15);
    // Center leg
    ctx.moveTo(0, 7);
    ctx.lineTo(0, 14);
    // Right leg
    ctx.moveTo(5, 6);
    ctx.lineTo(8, 12);
    ctx.lineTo(11, 15);
    ctx.stroke();

    // Glowing Central Cyclops Eye
    const isAlert = (this.state === 'alert');
    ctx.beginPath();
    ctx.arc(2, 1, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = isAlert ? '#ef4444' : '#f43f5e';
    ctx.fill();

    // White incandescent pupil
    ctx.beginPath();
    ctx.arc(2.5, 0.5, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }
}

class AlienCrawler {
  constructor(x, y) {
    this.type = 'crawler';
    this.x = x;
    this.y = y;
    this.startX = x;
    this.width = 22;
    this.height = 14;
    this.hp = 35;
    this.maxHp = 35;
    this.isDead = false;
    this.dir = -1; // -1: left, 1: right
    this.speed = 0.75;
    this.walkCycle = 0;
    this.hitFlash = 0;
    this.minX = 250;
    this.maxX = 345;
  }

  takeDamage(amount) {
    if (this.isDead) return;
    this.hp -= amount;
    this.hitFlash = 6;
    if (this.hp <= 0) {
      this.isDead = true;
    }
  }

  update(player, game) {
    if (this.isDead) return;
    this.walkCycle += 0.18;
    if (this.hitFlash > 0) this.hitFlash--;

    // Crawl back and forth between cargo crates
    this.x += this.dir * this.speed;
    if (this.x <= this.minX) {
      this.x = this.minX;
      this.dir = 1;
    } else if (this.x >= this.maxX) {
      this.x = this.maxX;
      this.dir = -1;
    }
  }

  draw(ctx) {
    if (this.isDead) return;
    ctx.save();

    const drawX = Math.round(this.x);
    const drawY = Math.round(this.y + 16 - this.height);

    if (this.hitFlash > 0) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(drawX, drawY, this.width, this.height);
      ctx.restore();
      return;
    }

    // Flip sprite based on direction
    const isFlipped = (this.dir === 1);
    if (isFlipped) {
      ctx.translate(drawX + this.width, drawY);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(drawX, drawY);
    }

    // 4 Articulated Chitinous Legs
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 1.5;
    const legPhase = Math.sin(this.walkCycle);
    // Back legs
    ctx.beginPath();
    ctx.moveTo(4, 8);
    ctx.lineTo(1, 4 + legPhase * 3);
    ctx.lineTo(-2, 14);

    ctx.moveTo(8, 8);
    ctx.lineTo(6, 4 - legPhase * 3);
    ctx.lineTo(4, 14);

    // Front legs
    ctx.moveTo(14, 8);
    ctx.lineTo(16, 4 + legPhase * 3);
    ctx.lineTo(19, 14);

    ctx.moveTo(18, 8);
    ctx.lineTo(21, 4 - legPhase * 3);
    ctx.lineTo(24, 14);
    ctx.stroke();

    // Main Carapace (Dark biomechanical chitin)
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.ellipse(11, 6, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Carapace plate ridges
    ctx.fillStyle = '#4338ca';
    ctx.fillRect(6, 3, 3, 2);
    ctx.fillRect(11, 2, 3, 2);
    ctx.fillRect(16, 3, 3, 2);

    // Head & glowing red sensory eyes
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(3, 7, 4, 0, Math.PI * 2);
    ctx.fill();

    // Twin glowing red eyes
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(1, 5, 2, 2);
    ctx.fillRect(3, 7, 2, 1);

    ctx.restore();
  }
}

class AlienSoldier {
  constructor(x, y) {
    this.type = 'soldier';
    this.x = x;
    this.y = y;
    this.startX = x;
    this.width = 20;
    this.height = 32;
    this.hp = 60;
    this.maxHp = 60;
    this.isDead = false;
    this.hitFlash = 0;
    this.staggerX = 0;
    this.shieldFlash = 0;
  }

  takeDamage(amount) {
    if (this.isDead) return;
    this.hp -= amount;
    this.hitFlash = 5;
    this.shieldFlash = 8;
    this.staggerX = Math.min(6, this.staggerX + 0.8);
    if (this.hp <= 0) {
      this.isDead = true;
    }
  }

  update(player, game) {
    if (this.isDead) return;
    if (this.hitFlash > 0) this.hitFlash--;
    if (this.shieldFlash > 0) this.shieldFlash--;
    if (this.staggerX > 0) this.staggerX *= 0.88;
  }

  draw(ctx) {
    if (this.isDead) return;
    ctx.save();

    const drawX = Math.round(this.x + this.staggerX);
    const drawY = Math.round(this.y + 16 - this.height);

    // Green Plasma Beam Impact Energy Flare on Soldier
    if (this.shieldFlash > 0) {
      ctx.save();
      const flareGrad = ctx.createRadialGradient(drawX + 6, drawY + 14, 2, drawX + 6, drawY + 14, 22);
      flareGrad.addColorStop(0, '#ffffff');
      flareGrad.addColorStop(0.35, '#86efac');
      flareGrad.addColorStop(0.7, 'rgba(34, 197, 94, 0.6)');
      flareGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.arc(drawX + 6, drawY + 14, 22, 0, Math.PI * 2);
      ctx.fill();

      // Energetic impact plasma ripple ring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(drawX + 6, drawY + 14, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    const isFlashing = (this.hitFlash > 0);
    const armorCol = isFlashing ? '#86efac' : '#1e293b';
    const highlightCol = isFlashing ? '#ffffff' : '#475569';
    const trimCol = isFlashing ? '#bbf7d0' : '#334155';

    // Digitigrade biomechanical legs (hunched backwards)
    ctx.strokeStyle = armorCol;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    // Back leg
    ctx.moveTo(drawX + 12, drawY + 16);
    ctx.lineTo(drawX + 16, drawY + 24);
    ctx.lineTo(drawX + 12, drawY + 31);
    // Front leg
    ctx.moveTo(drawX + 8, drawY + 16);
    ctx.lineTo(drawX + 4, drawY + 24);
    ctx.lineTo(drawX + 2, drawY + 31);
    ctx.stroke();

    // Taloned feet
    ctx.fillStyle = trimCol;
    ctx.fillRect(drawX, drawY + 30, 5, 2);
    ctx.fillRect(drawX + 10, drawY + 30, 5, 2);

    // Torso / Biomechanical Carapace
    ctx.fillStyle = armorCol;
    ctx.fillRect(drawX + 4, drawY + 8, 12, 11);
    ctx.fillStyle = highlightCol;
    ctx.fillRect(drawX + 5, drawY + 10, 8, 7);

    // Hunched biomechanical arm / claw reaching left
    ctx.fillStyle = trimCol;
    ctx.fillRect(drawX - 3, drawY + 10, 8, 4);
    ctx.fillStyle = highlightCol;
    ctx.fillRect(drawX - 6, drawY + 9, 4, 5);

    // Elongated Alien Skull with backwards cranial crest
    ctx.fillStyle = armorCol;
    ctx.beginPath();
    ctx.ellipse(drawX + 9, drawY + 5, 7, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Backwards cranial horn / crest
    ctx.fillStyle = trimCol;
    ctx.beginPath();
    ctx.moveTo(drawX + 13, drawY + 2);
    ctx.lineTo(drawX + 20, drawY + 4);
    ctx.lineTo(drawX + 14, drawY + 8);
    ctx.closePath();
    ctx.fill();

    // Glowing Red Visor / Sensor Eye
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(drawX + 3, drawY + 4, 3, 2);
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(drawX + 4, drawY + 4, 1, 1);

    ctx.restore();
  }
}

window.SecurityDrone = SecurityDrone;
window.AlienCrawler = AlienCrawler;
window.AlienSoldier = AlienSoldier;
