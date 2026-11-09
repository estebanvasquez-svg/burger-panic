/**
 * Core Game Engine for Burger Panic Mobile
 * Original Indie Retro Arcade Platformer
 */
class BurgerPanicGame {
  get sprites() {
    return window.spriteManager ? window.spriteManager.sprites : {};
  }
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.levelMap = new window.LevelMap();
    this.stageIndex = 0;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('burgerpanic_highscore') || '0', 10);

    // States: 'TITLE', 'READY', 'PLAYING', 'DYING', 'STAGE_CLEAR', 'GAME_OVER', 'PAUSED', 'MAP'
    this.state = 'TITLE';
    this.stateTimer = 0;
    this.previousState = 'TITLE';

    this.player = null;
    this.enemies = [];
    this.burgers = [];
    this.pepperClouds = [];
    this.bonusItems = [];
    this.popups = [];
    this.particles = [];
    this.screenShake = 0;
    this.cameraX = 0;
    this.blowtorches = [];
    this.flameProjectiles = [];

    this.bonusSpawnTimer = 350;
    this.stageBonusItemsSpawned = 0;
    this.stageBonusItemsCollected = 0;
    this.stageLifeItemSpawned = false;
    this.stageLifeItemCollected = false;
    this.stageTotalItemsSpawned = 0;
    this.stageEarnedStars = 0;
    this.devMode = localStorage.getItem('burgerpanic_dev_mode') === 'true';
    this.toastTimeout = null;

    this.spriteManager = window.spriteManager;
    this.mapSelectedStage = 1;
    this.mapNavLock = false;
    this.mapScrollY = 600;
    this.mapTargetScrollY = 600;
    this.mapNodes = [
      { level: 1,  x: 75,  y: 880, name: 'LA COCINA CLÁSICA' },
      { level: 2,  x: 130, y: 825, name: 'LA DESPENSA DE ESPECIAS' },
      { level: 3,  x: 175, y: 770, name: 'EL COLOSO KILOBURNER', isBoss: true },
      { level: 4,  x: 145, y: 715, name: 'EL GRAN BISTRÓ GOURMET' },
      { level: 5,  x: 90,  y: 660, name: 'LA MARISQUERÍA DEL PULPO' },
      { level: 6,  x: 65,  y: 605, name: 'LA ESTACIÓN DE CAFÉ & BARISTA' },
      { level: 7,  x: 85,  y: 550, name: 'LA PASTELERÍA FELINA' },
      { level: 8,  x: 145, y: 495, name: 'EL ASADOR DEL CASTILLO' },
      { level: 9,  x: 175, y: 440, name: 'EL HORNO DEL DRAGÓN' },
      { level: 10, x: 140, y: 385, name: 'LA COCINA DE ALTA MAR' },
      { level: 11, x: 85,  y: 330, name: 'LA HELADERÍA BAJO CERO' },
      { level: 12, x: 65,  y: 275, name: 'LA PANADERÍA CRUJIENTE' },
      { level: 13, x: 115, y: 220, name: 'EL WOK DEL PANDA GOURMET' },
      { level: 14, x: 170, y: 165, name: 'EL COMEDOR CÓSMICO' },
      { level: 15, x: 135, y: 110, name: 'EL MESÓN JURÁSICO DE CARNES' },
      { level: 16, x: 95,  y: 55,  name: 'EL BANQUETE IMPERIAL DEL CHEF' }
    ];

    this.controls = new window.ControlsManager();
    this.setupControlHooks();

    // Boot sequence: Show Home (Portada) first, then transition into the Map at their saved level
    this.state = 'TITLE';
    this.isInitialBoot = true;
    this.stateTimer = 150; // ~2.5s showcase on boot, or tap to advance immediately
    const resumeStage = this.getLastPlayedStage();
    this.mapSelectedStage = resumeStage;
    this.centerMapOnStage(resumeStage, true);

    this.updateControlsVisibility();

    this.lastTime = performance.now();
    this.startLoop();
  }

  setupControlHooks() {
    this.controls.onPepperPress = () => {
      if (this.state === 'MAP') {
        this.state = (this.player && !this.player.isDead) ? 'PAUSED' : 'TITLE';
        if (this.state === 'PAUSED') this.updatePauseButtonUI(true);
        return;
      }
      if (this.state === 'STAGE_CLEAR') {
        this.openMap();
        return;
      }
      if (this.state === 'TITLE') {
        this.isInitialBoot = false;
        const resumeStage = this.getLastPlayedStage();
        this.openMap(resumeStage);
      } else if (this.state === 'GAME_OVER') {
        const lostStage = (this.stageIndex || 0) + 1;
        this.saveCurrentStage(lostStage);
        this.openMap(lostStage);
      } else if (this.state === 'PLAYING') {
        if (this.player) {
          if (this.levelData && this.levelData.blowtorches && this.levelData.blowtorches.length > 0) {
            if (!this.player.hasBlowtorch || this.player.blowtorchFuel <= 0) {
              this.popups.push(new window.ScorePopup('¡SUBE POR UN SOPLETE!', this.player.x - 30, this.player.y - 14));
              if (window.soundManager && window.soundManager.playGasEmpty) {
                window.soundManager.playGasEmpty();
              }
              return;
            }
            this.player.fireBlowtorch(this.flameProjectiles, this.controls.input);
            this.updatePepperUI();
            return;
          }
          if (this.kiloburnerBoss) {
            this.player.fireCryoExtinguisher(this.cryoProjectiles, this.controls.input);
          } else {
            const tossed = this.player.throwPepper(this.pepperClouds, this.controls.input);
            if (tossed) this.updatePepperUI();
          }
        }
      }
    };

    this.controls.onJumpPress = () => {
      if (this.state === 'MAP') {
        this.startStage(this.mapSelectedStage);
        return;
      }
      if (this.state === 'STAGE_CLEAR') {
        this.advanceNextStage();
        return;
      }
      if (this.state === 'PLAYING') {
        if (this.player) {
          this.player.jump(null, this.controls.input);
        }
      }
    };

    this.controls.onPausePress = () => {
      this.togglePause();
    };
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      if (window.soundManager && window.soundManager.playArcadeClick) {
        window.soundManager.playArcadeClick();
      }
      this.updatePauseButtonUI(true);
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      if (window.soundManager && window.soundManager.playArcadeClick) {
        window.soundManager.playArcadeClick();
      }
      this.updatePauseButtonUI(false);
    }
  }

  updatePauseButtonUI(isPaused) {
    const pauseBtn = document.getElementById('btn-pause');
    if (!pauseBtn) return;
    if (isPaused) {
      pauseBtn.classList.add('paused');
      const label = pauseBtn.querySelector('.pause-label');
      if (label) label.textContent = 'RESUME';
      const icon = pauseBtn.querySelector('.pause-icon');
      if (icon) icon.textContent = '▶';
      pauseBtn.setAttribute('title', 'Reanudar Juego');
    } else {
      pauseBtn.classList.remove('paused');
      const label = pauseBtn.querySelector('.pause-label');
      if (label) label.textContent = 'PAUSE';
      const icon = pauseBtn.querySelector('.pause-icon');
      if (icon) icon.textContent = '⏸';
      pauseBtn.setAttribute('title', 'Pausar Juego');
    }
  }

  startGame() {
    this.stageIndex = 0;
    this.score = 0;
    this.loadStage(this.stageIndex);
    this.player.lives = 3;
    this.player.peppers = 5;
    this.updatePepperUI();
    this.state = 'READY';
    this.stateTimer = 100;
  }

  startStage(stageNumber) {
    const unlocked = this.getUnlockedLevel();
    if (stageNumber > unlocked) {
      return;
    }
    const totalStages = (this.levelMap && this.levelMap.levels) ? this.levelMap.levels.length : 16;
    if (stageNumber > totalStages) {
      return;
    }
    this.saveCurrentStage(stageNumber);
    this.stageIndex = stageNumber - 1;
    this.loadStage(this.stageIndex);
    if (!this.player || this.player.lives <= 0) {
      this.score = 0;
    }
    this.player.lives = 3;
    this.player.peppers = 5;
    this.updatePepperUI();
    this.state = 'READY';
    this.stateTimer = 100;
    if (window.soundManager) {
      window.soundManager.init();
      window.soundManager.resume();
    }
  }

  advanceNextStage() {
    const totalStages = (this.levelMap && this.levelMap.levels) ? this.levelMap.levels.length : 16;
    if (this.stageIndex + 1 < totalStages) {
      this.stageIndex++;
      this.saveCurrentStage(this.stageIndex + 1);
      this.loadStage(this.stageIndex);
      this.state = 'READY';
      this.stateTimer = 100;
    } else {
      this.saveCurrentStage(totalStages);
      this.openMap(totalStages);
    }
  }

  openMap(stageToFocus = null) {
    if (this.state === 'DYING') return;
    this.updatePauseButtonUI(false);
    this.previousState = this.state;
    this.state = 'MAP';
    this.stateTimer = 0;
    const unlocked = this.getUnlockedLevel();
    if (stageToFocus) {
      this.mapSelectedStage = Math.max(1, Math.min(stageToFocus, Math.min(unlocked, 15)));
    } else if (!this.mapSelectedStage || this.mapSelectedStage < 1 || this.mapSelectedStage > 15) {
      this.mapSelectedStage = this.getLastPlayedStage();
    }
    this.saveCurrentStage(this.mapSelectedStage);
    this.centerMapOnStage(this.mapSelectedStage, true);
  }

  centerMapOnStage(stageNum, immediate = false) {
    const node = this.mapNodes ? this.mapNodes.find((n) => n.level === stageNum) : null;
    if (node) {
      const target = node.y - 150;
      const maxScroll = 920 - 320;
      this.mapTargetScrollY = Math.max(0, Math.min(target, maxScroll));
      if (immediate) {
        this.mapScrollY = this.mapTargetScrollY;
      }
    }
  }

  calculateStageStars() {
    if (this.stageBonusItemsCollected === 3 && this.stageLifeItemCollected) {
      return 3;
    }
    if (this.stageBonusItemsCollected === 3) {
      return 2;
    }
    if (this.stageBonusItemsCollected === 1 || this.stageBonusItemsCollected === 2) {
      return 1.5;
    }
    return 1;
  }

  saveCurrentStage(stageNumber) {
    try {
      const totalStages = (this.levelMap && this.levelMap.levels) ? this.levelMap.levels.length : 16;
      const validStage = Math.max(1, Math.min(stageNumber, totalStages));
      localStorage.setItem('burgerpanic_current_stage', validStage.toString());
      localStorage.setItem('burgerpanic_has_played', 'true');
    } catch (e) {
      console.error('Error saving current stage:', e);
    }
  }

  getLastPlayedStage() {
    try {
      const saved = parseInt(localStorage.getItem('burgerpanic_current_stage'), 10);
      const unlocked = this.getUnlockedLevel();
      const totalStages = (this.levelMap && this.levelMap.levels) ? this.levelMap.levels.length : 16;
      if (!isNaN(saved) && saved >= 1) {
        return Math.max(1, Math.min(saved, Math.min(unlocked, totalStages)));
      }
      return unlocked;
    } catch (e) {
      return 1;
    }
  }

  saveStageProgress(stageNum, stars, score) {
    try {
      localStorage.setItem('burgerpanic_has_played', 'true');
      const starsData = JSON.parse(localStorage.getItem('burgerpanic_stars') || '{}');
      const currentStars = typeof starsData[stageNum] === 'number' ? starsData[stageNum] : 0;
      if (stars > currentStars) {
        starsData[stageNum] = stars;
        localStorage.setItem('burgerpanic_stars', JSON.stringify(starsData));
      }

      const currentUnlocked = parseInt(localStorage.getItem('burgerpanic_unlocked_level') || '1', 10);
      const nextLevel = Math.max(currentUnlocked, stageNum + 1);
      const totalStages = (this.levelMap && this.levelMap.levels) ? this.levelMap.levels.length : 16;
      localStorage.setItem('burgerpanic_unlocked_level', Math.min(nextLevel, totalStages).toString());
      this.saveCurrentStage(Math.min(nextLevel, totalStages));

      const scoresData = JSON.parse(localStorage.getItem('burgerpanic_level_scores') || '{}');
      const prevScore = scoresData[stageNum] || 0;
      if (score > prevScore) {
        scoresData[stageNum] = score;
        localStorage.setItem('burgerpanic_level_scores', JSON.stringify(scoresData));
      }
    } catch (e) {
      console.error('Error saving stage progress:', e);
    }
  }

  getStageStars(stageNum) {
    try {
      const starsData = JSON.parse(localStorage.getItem('burgerpanic_stars') || '{}');
      return typeof starsData[stageNum] === 'number' ? starsData[stageNum] : 0;
    } catch (e) {
      return 0;
    }
  }

  getUnlockedLevel() {
    const totalStages = (this.levelMap && this.levelMap.levels) ? this.levelMap.levels.length : 16;
    if (this.devMode) return totalStages;
    const val = parseInt(localStorage.getItem('burgerpanic_unlocked_level') || '1', 10);
    return Math.min(Math.max(1, val), totalStages);
  }

  toggleDevMode(forceState = null) {
    if (typeof forceState === 'boolean') {
      this.devMode = forceState;
    } else {
      this.devMode = !this.devMode;
    }
    localStorage.setItem('burgerpanic_dev_mode', this.devMode ? 'true' : 'false');
    this.applyDevModeUI();
    this.showDevToast(this.devMode ? '🛠️ MODO DEV: 15 NIVELES ABIERTOS' : '🛠️ MODO DEV: DESACTIVADO');
    if (window.soundManager) window.soundManager.playBonus();
  }

  applyDevModeUI() {
    const devToolbar = document.getElementById('dev-toolbar');
    const devBtn = document.getElementById('btn-dev');
    if (devToolbar) {
      devToolbar.classList.toggle('hidden', !this.devMode);
    }
    if (devBtn) {
      devBtn.classList.toggle('active', this.devMode);
      devBtn.style.background = this.devMode ? '#00e436' : '';
      devBtn.style.color = this.devMode ? '#000' : '';
    }
    this.updateDevSelect();
  }

  updateDevSelect() {
    const select = document.getElementById('dev-stage-select');
    if (select) {
      const currentStage = (this.stageIndex || 0) + 1;
      select.value = currentStage.toString();
    }
  }

  showDevToast(msg) {
    let toast = document.getElementById('dev-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'dev-toast';
      toast.className = 'dev-toast';
      const container = document.getElementById('app-container') || document.body;
      container.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.remove('hidden');
    toast.style.opacity = '1';
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2000);
  }

  jumpToStage(stageNum) {
    const totalStages = (this.levelMap && this.levelMap.levels) ? this.levelMap.levels.length : 16;
    const target = Math.max(1, Math.min(stageNum, totalStages));
    this.startStage(target);
    this.updateDevSelect();
    this.showDevToast(`CARGANDO NIVEL ${target}`);
  }

  getTotalStars() {
    let total = 0;
    const totalStages = (this.levelMap && this.levelMap.levels) ? this.levelMap.levels.length : 16;
    for (let i = 1; i <= totalStages; i++) {
      total += this.getStageStars(i);
    }
    return total;
  }

  loadStage(index) {
    this.updatePauseButtonUI(false);
    this.levelData = this.levelMap.getLevel(index);
    this.particles = [];
    this.screenShake = 0;

    // Initialize player (always start on the bottom ground floor of the stage)
    const bottomFloor = this.levelData.floors[this.levelData.floors.length - 1];
    const groundY = bottomFloor ? bottomFloor.y : (this.levelData.playerStart ? this.levelData.playerStart.y : 288);
    const groundX = this.levelData.playerStart ? this.levelData.playerStart.x : 112;

    if (!this.player) {
      this.player = new window.Player(groundX, groundY, this.levelData);
    } else {
      this.player.startX = groundX;
      this.player.startY = groundY;
      this.player.resetPosition();
      this.player.levelData = this.levelData;
    }

    // Initialize burgers
    this.burgers = this.levelData.burgers.map((b) => new window.BurgerPiece(b, this.levelData));

    // Initialize enemies (Safety: ensure all enemies spawn on upper floors far from chef)
    const MIN_SAFE_DIST = 170;
    this.enemies = this.levelData.enemies.map((e) => {
      let spawnX = e.x;
      let spawnY = e.y;
      const initialDist = Math.hypot((spawnX + 8) - (this.player.x + 8), (spawnY + 8) - (this.player.y + 8));

      // Guard: If enemy is placed near player or on low floors, find highest/furthest upper platform
      if (initialDist < MIN_SAFE_DIST || spawnY > this.player.y - 80) {
        let bestCandidate = { x: spawnX, y: spawnY };
        let maxDist = -1;
        if (this.levelData && this.levelData.floors) {
          const upperFloors = this.levelData.floors.filter((f) => f.y <= 120);
          const candidateFloors = upperFloors.length > 0 ? upperFloors : this.levelData.floors;
          for (const floor of candidateFloors) {
            const checkXs = [floor.x1 + 8, Math.floor((floor.x1 + floor.x2) / 2), floor.x2 - 8];
            for (const tx of checkXs) {
              const d = Math.hypot(tx - this.player.x, floor.y - this.player.y);
              if (d > maxDist) {
                maxDist = d;
                bestCandidate = { x: tx - 8, y: floor.y };
              }
            }
          }
        }
        spawnX = bestCandidate.x;
        spawnY = bestCandidate.y;
      }

      return new window.Enemy(e.type, spawnX, spawnY, this.levelData.enemySpeed, this.levelData);
    });

    this.pepperClouds = [];
    this.bonusItems = [];
    this.popups = [];
    this.bonusSpawnTimer = 350;
    this.cameraX = 0;
    this.blowtorches = [];
    this.flameProjectiles = [];
    this.stageBonusItemsSpawned = 0;
    this.stageBonusItemsCollected = 0;
    this.stageLifeItemSpawned = false;
    this.stageLifeItemCollected = false;
    this.stageTotalItemsSpawned = 0;
    this.stageEarnedStars = 0;
    this.devMode = localStorage.getItem('burgerpanic_dev_mode') === 'true';
    this.toastTimeout = null;

    // Initialize Stage Boss if defined for this level
    if (this.levelData && this.levelData.boss && this.levelData.boss.type === 'kiloburner' && window.KiloburnerBoss) {
      this.kiloburnerBoss = new window.KiloburnerBoss(this.levelData.width || 1600, this.height);
      this.cryoProjectiles = [];
      this.bossProjectiles = [];
    } else {
      this.kiloburnerBoss = null;
      this.cryoProjectiles = [];
      this.bossProjectiles = [];
    }

    // Initialize Blowtorch stations for Level 3
    if (this.levelData && this.levelData.blowtorches && window.BlowtorchPickup) {
      this.blowtorches = this.levelData.blowtorches.map(b => new window.BlowtorchPickup(b.id, b.x, b.y));
    } else {
      this.blowtorches = [];
    }
    this.flameProjectiles = [];
    if (this.player) {
      this.player.hasBlowtorch = false;
      this.player.blowtorchFuel = 0;
    }
    this.boss = null;
    this.updatePepperUI();
  }

  updatePepperUI() {
    const badge = document.getElementById('pepper-count-badge');
    const pepperBtn = document.getElementById('btn-pepper');
    const labelSpan = pepperBtn ? pepperBtn.querySelector('.action-label') : null;
    const iconSpan = pepperBtn ? pepperBtn.querySelector('.action-icon') : null;
    const wrap = pepperBtn ? pepperBtn.closest('.arcade-button-wrapper') : null;
    const subLabel = wrap ? wrap.querySelector('.button-cpo-sublabel') : null;

    if (this.levelData && this.levelData.blowtorches && this.levelData.blowtorches.length > 0) {
      if (this.player && this.player.hasBlowtorch) {
        if (badge) badge.textContent = Math.round(this.player.blowtorchFuel) + '%';
        if (labelSpan) labelSpan.textContent = 'FUEGO';
        if (iconSpan) iconSpan.textContent = '🔥';
        if (subLabel) subLabel.textContent = 'SOPLETE';
      } else {
        if (badge) badge.textContent = '0%';
        if (labelSpan) labelSpan.textContent = 'BUSCA';
        if (iconSpan) iconSpan.textContent = '🔍';
        if (subLabel) subLabel.textContent = 'SOPLETE';
      }
    } else if (this.kiloburnerBoss) {
      if (badge) badge.textContent = '∞';
      if (labelSpan) labelSpan.textContent = 'SPRAY';
      if (iconSpan) iconSpan.textContent = '🧪';
      if (subLabel) subLabel.textContent = 'ÁCIDO VERDE';
    } else {
      if (badge && this.player) badge.textContent = this.player.peppers;
      if (labelSpan) labelSpan.textContent = 'PEPPER';
      if (iconSpan) iconSpan.textContent = '🧂';
      if (subLabel) subLabel.textContent = 'PIMIENTA';
    }
  }

  addScore(pts, x, y) {
    this.score += pts;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('burgerpanic_highscore', this.highScore.toString());
    }
    if (x !== undefined && y !== undefined) {
      this.popups.push(new window.ScorePopup(`+${pts}`, x, y));
    }
  }

  awardComboLife(count, x, y) {
    if (this.player && !this.player.isDead) {
      this.player.lives++;
      window.soundManager.playLifeUp();
      this.popups.push(new window.ScorePopup(`1UP! COMBO x${count}!`, x, y - 10));
    }
  }

  addScreenShake(amount = 4.0) {
    this.screenShake = Math.max(this.screenShake, amount);
  }

  spawnBreadCrumbs(x, y) {
    const colors = ['#f5d061', '#e8b839', '#ffffff', '#ff8b3d'];
    for (let i = 0; i < 4; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const spd = Math.random() * 1.8 + 0.8;
      this.particles.push(new window.ArcadeParticle(
        x + (Math.random() - 0.5) * 6,
        y,
        Math.cos(angle) * spd,
        Math.sin(angle) * spd,
        colors[Math.floor(Math.random() * colors.length)],
        Math.random() < 0.5 ? 2 : 3,
        18,
        'rect'
      ));
    }
  }

  spawnLandingDust(x, y, width = 32) {
    for (let i = 0; i < 6; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const px = side === -1 ? x + 2 : x + width - 2;
      this.particles.push(new window.ArcadeParticle(
        px,
        y,
        side * (Math.random() * 1.4 + 0.6),
        -(Math.random() * 0.8 + 0.2),
        '#f0e6df',
        Math.random() * 3 + 2.5,
        16,
        'smoke'
      ));
    }
  }

  spawnSquashSparks(x, y) {
    const colors = ['#ffd700', '#ff3b30', '#ff9500', '#00f0ff', '#ffffff'];
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const spd = Math.random() * 2.8 + 1.2;
      this.particles.push(new window.ArcadeParticle(
        x,
        y,
        Math.cos(angle) * spd,
        Math.sin(angle) * spd,
        colors[i % colors.length],
        Math.random() < 0.6 ? 3 : 4,
        24,
        'star'
      ));
    }
    for (let i = 0; i < 5; i++) {
      this.particles.push(new window.ArcadeParticle(
        x + (Math.random() - 0.5) * 8,
        y + (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 1.2,
        '#ffffff',
        4,
        16,
        'smoke'
      ));
    }
  }

  spawnJumpDust(x, y) {
    for (let i = 0; i < 4; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      this.particles.push(new window.ArcadeParticle(
        x + side * (Math.random() * 3 + 1),
        y - 1,
        side * (Math.random() * 0.8 + 0.4),
        -(Math.random() * 0.5 + 0.1),
        '#d0c8be',
        2.5,
        12,
        'smoke'
      ));
    }
  }

  updateControlsVisibility() {
    const deck = document.querySelector('.controls-deck');
    if (!deck) return;
    // Show buttons ONLY in the game (playing, ready, dying, paused, stage clear)
    // Hide buttons on all other screens (TITLE, MAP, GAME_OVER)
    const inGame = this.state === 'PLAYING' ||
                   this.state === 'READY' ||
                   this.state === 'DYING' ||
                   this.state === 'PAUSED' ||
                   this.state === 'STAGE_CLEAR';
    if (inGame) {
      deck.classList.remove('hidden');
    } else {
      deck.classList.add('hidden');
    }
  }

  update() {
    this.stateTimer--;

    // Keep controls zone visible ONLY during active gameplay
    if (this._lastControlsState !== this.state) {
      this._lastControlsState = this.state;
      this.updateControlsVisibility();
    }

    // Keep camera focused on player for wider stages (unless stage is auto-scrolling)
    const mapW = (this.levelData && this.levelData.width) ? this.levelData.width : 240;
    if (this.levelData && this.levelData.autoScroll) {
      // Handled continuously by auto-scroller
    } else if (mapW > 240 && this.player) {
      const targetCamX = this.player.x + 8 - 120;
      this.cameraX = Math.max(0, Math.min(targetCamX, mapW - 240));
    } else {
      this.cameraX = 0;
    }

    switch (this.state) {
      case 'TITLE':
        if (this.isInitialBoot && this.stateTimer <= 0) {
          this.isInitialBoot = false;
          const resumeStage = this.getLastPlayedStage();
          this.openMap(resumeStage);
        }
        break;

      case 'READY':
        if (this.stateTimer <= 0) {
          this.state = 'PLAYING';
          window.soundManager.startBGM();
        }
        break;

      case 'PLAYING':
        this.updatePlaying();
        break;

      case 'DYING':
        if (this.stateTimer <= 0) {
          if (this.player.lives > 0) {
            this.player.resetPosition();
            // Reset enemies to starting corners (farthest from player)
            this.enemies.forEach((e) => e.respawn(this.player));
            this.state = 'READY';
            this.stateTimer = 80;
          } else {
            this.state = 'GAME_OVER';
            this.stateTimer = 110;
          }
        }
        break;

      case 'MAP':
        this.mapScrollY += (this.mapTargetScrollY - this.mapScrollY) * 0.18;

        if (this.controls.input.up && !this.mapNavLock) {
          const unlocked = this.getUnlockedLevel();
          if (this.mapSelectedStage < Math.min(unlocked + 1, 16)) {
            this.mapSelectedStage++;
            this.saveCurrentStage(this.mapSelectedStage);
            this.centerMapOnStage(this.mapSelectedStage);
            if (window.soundManager) window.soundManager.playStep();
          }
          this.mapNavLock = true;
        } else if (this.controls.input.down && !this.mapNavLock) {
          if (this.mapSelectedStage > 1) {
            this.mapSelectedStage--;
            this.saveCurrentStage(this.mapSelectedStage);
            this.centerMapOnStage(this.mapSelectedStage);
            if (window.soundManager) window.soundManager.playStep();
          }
          this.mapNavLock = true;
        } else if (!this.controls.input.up && !this.controls.input.down) {
          this.mapNavLock = false;
        }
        break;

      case 'STAGE_CLEAR':
        if (this.stateTimer <= 0) {
          this.advanceNextStage();
        }
        break;

      case 'GAME_OVER':
        if (this.stateTimer <= 0) {
          const lostStage = (this.stageIndex || 0) + 1;
          this.saveCurrentStage(lostStage);
          this.openMap(lostStage);
        }
        break;

      case 'PAUSED':
        break;
    }
  }

  updateDynamicPlatforms() {
    if (!this.levelData || !this.levelData.floors) return;

    for (const f of this.levelData.floors) {
      if (f.type === 'elevator') {
        if (typeof f.phase === 'undefined') f.phase = f.initialPhase || 0;
        f.phase += f.speed || 0.025;
        const oldY = f.y;
        const midY = (f.minY + f.maxY) / 2;
        const ampY = (f.maxY - f.minY) / 2;
        f.y = Math.round(midY + Math.sin(f.phase) * ampY);
        f.vy = f.y - oldY;
        f.vx = 0;
      } else if (f.type === 'swaying') {
        if (typeof f.phase === 'undefined') f.phase = f.initialPhase || 0;
        f.phase += f.speed || 0.025;
        const oldX1 = f.x1;
        const offset = Math.round(Math.sin(f.phase) * (f.range || 35));
        f.x1 = f.baseX1 + offset;
        f.x2 = f.baseX2 + offset;
        f.vx = f.x1 - oldX1;
        f.vy = 0;
      } else if (f.type === 'swing') {
        if (typeof f.phase === 'undefined') f.phase = f.initialPhase || 0;
        f.phase += f.speed || 0.022;
        const maxAngle = f.maxAngle || 0.32;
        const angle = Math.sin(f.phase) * maxAngle;
        const oldX1 = f.x1;
        const oldY = f.y;
        const cx = f.pivotX + Math.sin(angle) * f.length;
        const cy = f.pivotY + Math.cos(angle) * f.length;
        const halfW = (f.width || 44) / 2;
        f.x1 = Math.round(cx - halfW);
        f.x2 = Math.round(cx + halfW);
        f.y = Math.round(cy);
        f.angle = angle;
        f.vx = f.x1 - oldX1;
        f.vy = f.y - oldY;
      }
    }
  }

  updatePlaying() {
    // 0. Update Dynamic Platforms (Elevators, Swaying, Swing platforms)
    this.updateDynamicPlatforms();

    // 1. Update Player
    this.player.update(this.controls.input, this.levelData.ladders, this.levelData.floors);

    // 2. Check Player stepping on burger pieces
    for (const b of this.burgers) {
      b.checkPlayerStep(this.player);
    }

    // 3. Update Burgers
    for (const b of this.burgers) {
      b.update(
        this.burgers,
        this.enemies,
        (pts, x, y) => this.addScore(pts, x, y),
        (count, x, y) => this.awardComboLife(count, x, y)
      );
    }

    // 4. Update Pepper clouds
    for (let i = this.pepperClouds.length - 1; i >= 0; i--) {
      const pc = this.pepperClouds[i];
      pc.update(this.enemies);
      if (pc.duration <= 0) {
        this.pepperClouds.splice(i, 1);
      }
    }

    // 5. Update Enemies
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      enemy.update(this.player, this.levelData.ladders, this.levelData.floors);

      // Soft anti-stacking separation (keeps enemies distinct and prevents clustering into a single sprite)
      for (let j = i + 1; j < this.enemies.length; j++) {
        const other = this.enemies[j];
        if (
          enemy.state === 'normal' && other.state === 'normal' &&
          !enemy.isClimbing && !other.isClimbing &&
          !enemy.isFalling && !other.isFalling
        ) {
          if (Math.abs(enemy.y - other.y) <= 4 && Math.abs(enemy.x - other.x) < 8) {
            const push = (enemy.x <= other.x) ? -0.35 : 0.35;
            enemy.x += push;
            other.x -= push;
          }
        }
      }

      // Check collision between enemy and player
      if (
        enemy.state === 'normal' &&
        !enemy.isFalling &&
        (!enemy.landCooldown || enemy.landCooldown <= 0) &&
        !this.player.isDead &&
        this.player.invulnerableTimer === 0
      ) {
        const dx = Math.abs((enemy.x + 8) - (this.player.x + 8));

        if (this.player.isJumping) {
          // Chef is leaping in the air: can vault over enemies!
          // Only collides if Chef's feet fail to clear the enemy's head
          const feetY = this.player.y + 14;
          const bodyY = this.player.y;
          if (dx < 11 && feetY > enemy.y + 2 && bodyY < enemy.y + 16) {
            this.player.die();
            this.state = 'DYING';
            this.stateTimer = 90;
            return;
          }
        } else {
          const dist = Math.hypot((enemy.x + 8) - (this.player.x + 8), (enemy.y + 8) - (this.player.y + 8));
          if (dist < 12) {
            // Player hit!
            this.player.die();
            this.state = 'DYING';
            this.stateTimer = 90;
            return;
          }
        }
      }
    }

    // 5.4. Auto-scrolling for Level 3 & Blowtorch mechanics
    if (this.levelData && this.levelData.autoScroll && (!this.kiloburnerBoss || !this.kiloburnerBoss.isDead)) {
      const scrollSpeed = this.levelData.autoScrollSpeed || 0.45;
      const maxCamX = (this.levelData.width || 1600) - 240;
      this.cameraX = Math.min(maxCamX, (this.cameraX || 0) + scrollSpeed);

      // Clamp player within visible scrolling bounds
      if (this.player && !this.player.isDead) {
        if (this.player.x < this.cameraX + 4) {
          this.player.x = this.cameraX + 4;
        } else if (this.player.x > this.cameraX + 220) {
          this.player.x = this.cameraX + 220;
        }
      }
    }

    // Check Blowtorch pickup collisions
    if (this.blowtorches && this.player && !this.player.isDead) {
      for (const bt of this.blowtorches) {
        bt.update();
        if (bt.checkCollision(this.player)) {
          bt.collected = true;
          this.player.hasBlowtorch = true;
          this.player.blowtorchFuel = 100;
          this.addScore(100, bt.x, bt.y - 10);
          this.popups.push(new window.ScorePopup('¡SOPLETE LISTO! 🔥', this.player.x - 20, this.player.y - 16));
          if (window.soundManager && window.soundManager.playIgnition) {
            window.soundManager.playIgnition();
          }
          for (let s = 0; s < 12; s++) {
            this.particles.push(new window.ArcadeParticle(
              bt.x, bt.y - 8,
              (Math.random() - 0.5) * 3,
              (Math.random() - 0.5) * 3,
              Math.random() < 0.5 ? '#f97316' : '#38bdf8',
              3, 20, 'star'
            ));
          }
          this.updatePepperUI();
        }
      }
    }

    // Continuous Blowtorch Firing while Pepper/Attack button is held down
    if (this.player && this.player.hasBlowtorch && !this.player.isDead) {
      const isFiring = (this.controls && this.controls.input && this.controls.input.pepper);
      if (isFiring) {
        const result = this.player.fireBlowtorch(this.flameProjectiles, this.controls.input);
        this.updatePepperUI();
        if (result === 'exhausted') {
          this.popups.push(new window.ScorePopup('¡SIN GAS! BUSCA OTRO', this.player.x - 30, this.player.y - 18));
          this.addScreenShake(2.0);
        }
      }
    }

    // 5.5. Update Kiloburner Giant Boss & Combat
    if (this.kiloburnerBoss) {
      this.kiloburnerBoss.update(this.player, this.levelData.floors, (proj) => {
        if (!this.bossProjectiles) this.bossProjectiles = [];
        this.bossProjectiles.push(proj);
      }, this.cameraX || 0);

      // Update Player Cryo Projectiles
      if (this.cryoProjectiles) {
        for (let i = this.cryoProjectiles.length - 1; i >= 0; i--) {
          const cp = this.cryoProjectiles[i];
          cp.update();

          // Hit check on Boss
          if (this.kiloburnerBoss.checkHitByCryo(cp)) {
            this.addScore(50, cp.x, cp.y);
            this.popups.push(new window.ScorePopup('+50', cp.x, cp.y - 8));
            for (let s = 0; s < 7; s++) {
              this.particles.push(new window.ArcadeParticle(
                cp.x, cp.y,
                (Math.random() - 0.5) * 3.2,
                (Math.random() - 0.5) * 3.2,
                Math.random() < 0.5 ? '#4ade80' : (Math.random() < 0.8 ? '#a3e635' : '#ffffff'),
                2.5, 18, 'spark'
              ));
            }
            if (window.soundManager && window.soundManager.playBlip) {
              window.soundManager.playBlip();
            }
            this.cryoProjectiles.splice(i, 1);
            continue;
          }

          if (cp.life <= 0 || cp.x < 0 || cp.x > (this.levelData.width || 300) + 20) {
            this.cryoProjectiles.splice(i, 1);
          }
        }
      }

      // Update Player Flame Projectiles (Level 3 Soplete)
      if (this.flameProjectiles) {
        for (let i = this.flameProjectiles.length - 1; i >= 0; i--) {
          const fp = this.flameProjectiles[i];
          fp.update();

          // Hit check on Boss
          if (this.kiloburnerBoss && this.kiloburnerBoss.checkHitByFlame(fp)) {
            this.addScore(40, fp.x, fp.y);
            this.popups.push(new window.ScorePopup('+40', fp.x, fp.y - 8));
            for (let s = 0; s < 6; s++) {
              this.particles.push(new window.ArcadeParticle(
                fp.x, fp.y,
                (Math.random() - 0.5) * 3.5,
                (Math.random() - 0.5) * 3.5,
                Math.random() < 0.5 ? '#f97316' : (Math.random() < 0.8 ? '#fef08a' : '#ef4444'),
                2.5, 18, 'spark'
              ));
            }
            if (window.soundManager && window.soundManager.playBlip) {
              window.soundManager.playBlip();
            }
            this.flameProjectiles.splice(i, 1);
            continue;
          }

          if (fp.life <= 0 || fp.x < 0 || fp.x > (this.levelData.width || 1600) + 40) {
            this.flameProjectiles.splice(i, 1);
          }
        }
      }

      // Update Boss Projectiles (Meatballs)
      if (this.bossProjectiles) {
        for (let i = this.bossProjectiles.length - 1; i >= 0; i--) {
          const bp = this.bossProjectiles[i];
          bp.update(this.levelData.floors);

          if (!this.player.isDead && this.player.invulnerableTimer === 0) {
            const dist = Math.hypot((bp.x) - (this.player.x + 8), (bp.y) - (this.player.y + 8));
            if (dist < 12) {
              this.player.die();
              this.state = 'DYING';
              this.stateTimer = 90;
              return;
            }
          }

          if (bp.life <= 0 || bp.bounces > bp.maxBounces || bp.y > 320) {
            this.bossProjectiles.splice(i, 1);
          }
        }
      }

      // Check Boss body/flame/claw damage against player
      if (this.kiloburnerBoss.checkPlayerDamage(this.player)) {
        this.player.die();
        this.state = 'DYING';
        this.stateTimer = 90;
        return;
      }

      // Check burger crush damage on boss (-50 HP)
      for (const b of this.burgers) {
        if (this.kiloburnerBoss.checkHitByBurgerPiece(b)) {
          this.addScore(500, this.kiloburnerBoss.x, this.kiloburnerBoss.y - 20);
          this.popups.push(new window.ScorePopup('¡APLASTADO! -50 HP', this.kiloburnerBoss.x - 25, this.kiloburnerBoss.y - 30));
          this.screenShake = 12;
          if (window.soundManager && window.soundManager.playDrop) {
            window.soundManager.playDrop();
          }
        }
      }
    }

    // 6. Bonus items spawn & pickup (Max 3 regular items + 1 extra life item per level)
    this.bonusSpawnTimer--;
    if (this.bonusSpawnTimer <= 0 && this.bonusItems.length === 0) {
      const spots = (this.levelData && this.levelData.bonusSpots && this.levelData.bonusSpots.length > 0)
        ? this.levelData.bonusSpots
        : [{ x: 112, y: 148 }];

      if (this.stageBonusItemsSpawned < 3) {
        // Items 1, 2, 3: rich variety of retro arcade snacks (Ice Cream, Coffee, Fries, Donut)
        const regularPool = ['bonus_icecream', 'bonus_coffee', 'bonus_fries', 'bonus_donut'];
        const type = regularPool[Math.floor(Math.random() * regularPool.length)];
        const spot = spots[this.stageTotalItemsSpawned % spots.length];
        this.bonusItems.push(new window.BonusItem(spot.x, spot.y, type));
        this.stageBonusItemsSpawned++;
        this.stageTotalItemsSpawned++;
        this.bonusSpawnTimer = 650;
      } else if (
        this.stageBonusItemsSpawned === 3 &&
        this.stageBonusItemsCollected === 3 &&
        !this.stageLifeItemSpawned
      ) {
        // 4th Item: Golden Royale Chef Hat (Extra Life item ONLY after collecting all 3 initial items!)
        const spot = spots[this.stageTotalItemsSpawned % spots.length];
        this.bonusItems.push(new window.BonusItem(spot.x, spot.y, 'bonus_life'));
        this.stageLifeItemSpawned = true;
        this.stageTotalItemsSpawned++;
        this.bonusSpawnTimer = 999999; // No further items in this level
      } else {
        // Player missed an item or already spawned life item
        this.bonusSpawnTimer = 999999;
      }
    }

    for (let i = this.bonusItems.length - 1; i >= 0; i--) {
      const item = this.bonusItems[i];
      item.update(this.levelData.floors);
      // Player pickup check
      const dist = Math.hypot((item.x + 8) - (this.player.x + 8), (item.y + 8) - (this.player.y + 8));
      if (dist < 14) {
        // Spawn vibrant 16-bit arcade pickup sparkle particles
        const particleColor = item.type === 'bonus_life' ? '#fcb400' :
                              item.type === 'bonus_icecream' ? '#ff6097' :
                              item.type === 'bonus_coffee' ? '#00f0ff' :
                              item.type === 'bonus_fries' ? '#fcd018' : '#e8286a';

        for (let p = 0; p < 8; p++) {
          const angle = (p / 8) * Math.PI * 2 + (Math.random() * 0.4);
          const speed = 1.0 + Math.random() * 0.9;
          this.particles.push(new window.ArcadeParticle(
            item.x + 8, item.y + 8,
            Math.cos(angle) * speed, Math.sin(angle) * speed,
            particleColor, 2.5, 24, 'star'
          ));
        }

        if (item.type === 'bonus_life') {
          // Extra Life Item reward (awards 3rd star condition!)
          this.stageLifeItemCollected = true;
          this.player.lives++;
          this.addScore(1000, item.x, item.y);
          this.popups.push(new window.ScorePopup('+1 VIDA (★3)!', item.x, item.y - 12));
          window.soundManager.playLifeUp();
        } else {
          // Regular bonus item (helado, café, papas, dona)
          this.stageBonusItemsCollected++;
          window.soundManager.playBonus();
          this.addScore(500, item.x, item.y);
          this.player.peppers = Math.min(this.player.peppers + 1, 9);
          this.updatePepperUI();

          const itemLabels = {
            'bonus_icecream': 'HELADO',
            'bonus_coffee': 'CAFÉ',
            'bonus_fries': 'PAPAS',
            'bonus_donut': 'DONA'
          };
          const name = itemLabels[item.type] || 'SNACK';
          this.popups.push(new window.ScorePopup(`+1 PIMIENTA • ${name} (${this.stageBonusItemsCollected}/3)`, item.x, item.y - 12));
        }

        this.bonusItems.splice(i, 1);
        continue;
      }
      if (item.timer <= 0) {
        this.bonusItems.splice(i, 1);
      }
    }

    // 7. Popups
    for (let i = this.popups.length - 1; i >= 0; i--) {
      this.popups[i].update();
      if (this.popups[i].timer <= 0) {
        this.popups.splice(i, 1);
      }
    }

    // 7.5. Dynamic Juice Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 8. Check Stage Victory:
    let isVictory = false;
    if (this.kiloburnerBoss) {
      if (this.kiloburnerBoss.isDead && this.kiloburnerBoss.defeatSequenceDone) {
        isVictory = true;
      }
    } else {
      isVictory = this.burgers.every((b) => b.landedOnPlate);
    }

    if (isVictory && this.state !== 'STAGE_CLEAR') {
      window.soundManager.playClear();
      this.addScore(1000, 100, 150);
      if (this.player) {
        this.player.lives++;
        window.soundManager.playLifeUp();
        this.popups.push(new window.ScorePopup('+1 VIDA!', this.player.x, this.player.y - 12));
      }

      const stageNum = (this.levelData && this.levelData.stageNumber) ? this.levelData.stageNumber : (this.stageIndex + 1);
      this.stageEarnedStars = this.calculateStageStars();
      this.saveStageProgress(stageNum, this.stageEarnedStars, this.score);

      setTimeout(() => {
        if (window.soundManager && window.soundManager.playStar) {
          window.soundManager.playStar();
        }
      }, 350);

      this.state = 'STAGE_CLEAR';
      this.stateTimer = 360;
    }

    // 9. Camera Tracking for wide levels (unless stage is auto-scrolling)
    const mapW = (this.levelData && this.levelData.width) ? this.levelData.width : 240;
    if (this.levelData && this.levelData.autoScroll) {
      // Auto-scrolling handled in 5.4 during playing state
    } else if (mapW > 240 && this.player) {
      const targetCamX = this.player.x + 8 - 120;
      this.cameraX = Math.max(0, Math.min(targetCamX, mapW - 240));
    } else {
      this.cameraX = 0;
    }
  }

  // ========================================================
  // RENDERING
  // ========================================================
  draw() {
    const stageNum = (this.levelData && this.levelData.stageNumber) ? this.levelData.stageNumber : (this.stageIndex + 1);
    const theme = window.stageThemesManager ? window.stageThemesManager.getTheme(stageNum) : null;

    if (theme && this.state !== 'TITLE' && this.state !== 'MAP') {
      this.ctx.fillStyle = theme.wallColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Subtle atmospheric kitchen tile backdrop pattern
      this.ctx.save();
      this.ctx.fillStyle = theme.wallTileColor;
      for (let ty = 34; ty < 320; ty += 16) {
        for (let tx = 0; tx < this.canvas.width; tx += 16) {
          if ((Math.floor(tx / 16) + Math.floor(ty / 16)) % 2 === 0) {
            this.ctx.fillRect(tx, ty, 15, 15);
          }
        }
      }
      this.ctx.restore();
    } else {
      this.ctx.fillStyle = '#050508';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (this.state === 'TITLE') {
      this.drawTitleScreen();
      return;
    }

    if (this.state === 'MAP') {
      this.drawMapScreen();
      return;
    }

    // Draw HUD (fixed overlay)
    this.drawHUD();

    // World Rendering (translated by camera for wide maps + physical screen shake)
    this.ctx.save();
    let shakeX = 0;
    let shakeY = 0;
    if (this.screenShake > 0) {
      shakeX = (Math.random() - 0.5) * this.screenShake;
      shakeY = (Math.random() - 0.5) * this.screenShake;
      this.screenShake *= 0.82;
      if (this.screenShake < 0.25) this.screenShake = 0;
    }
    const camRenderX = (this.cameraX !== 0) ? -Math.round(this.cameraX) : 0;
    this.ctx.translate(camRenderX + Math.round(shakeX), Math.round(shakeY));

    // Render Cyber Furnace Environment Details for Stage 3 (matching reference artwork)
    if (stageNum === 3) {
      const bg3 = window.spriteManager ? window.spriteManager.sprites.bg_stage_3 : null;
      if (bg3) {
        const fullW = (this.levelData && this.levelData.width) ? this.levelData.width : 1600;
        for (let bx = 0; bx < fullW; bx += 360) {
          this.ctx.drawImage(bg3, bx, 0, 360, 320);
        }
      }

      // Truss lattice support legs under the sniper platform (x: 60 to 140, y: 200 to 288)
      this.ctx.strokeStyle = '#334155';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(62, 206, 8, 82);
      this.ctx.strokeRect(130, 206, 8, 82);
      this.ctx.lineWidth = 1.4;
      for (let ty = 206; ty + 20 <= 288; ty += 20) {
        this.ctx.beginPath();
        this.ctx.moveTo(70, ty);
        this.ctx.lineTo(130, ty + 20);
        this.ctx.moveTo(130, ty);
        this.ctx.lineTo(70, ty + 20);
        this.ctx.stroke();
      }

      // Animated Cheese Dripping from left pipe (x: 28, y: 240) into lava pit
      const dropProgress = (Date.now() / 900) % 1;
      const dropY = 240 + dropProgress * 48;
      this.ctx.fillStyle = '#facc15';
      this.ctx.beginPath();
      this.ctx.arc(28, dropY, 2.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Animated Lava Pit Bubbles (x: 10 to 60, y: 290 to 318)
      const t = Date.now() * 0.005;
      for (let b = 0; b < 3; b++) {
        const bx = 16 + b * 16 + Math.sin(t + b) * 4;
        const bProgress = ((Date.now() / 1200 + b * 0.33) % 1);
        const by = 312 - bProgress * 18;
        this.ctx.fillStyle = bProgress > 0.8 ? '#fef08a' : '#f97316';
        this.ctx.beginPath();
        this.ctx.arc(bx, by, 1.5 + bProgress * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Draw Ladders
    this.drawLadders();

    // Draw Platforms
    this.drawPlatforms();

    // Draw Plates
    this.drawPlates();

    // Draw Burgers
    for (const b of this.burgers) {
      b.draw(this.ctx);
    }

    // Draw Bonus Items
    for (const item of this.bonusItems) {
      item.draw(this.ctx);
    }

    // Draw Enemies
    for (const enemy of this.enemies) {
      enemy.draw(this.ctx);
    }

    // Draw Blowtorch pickup stations
    if (this.blowtorches) {
      for (const bt of this.blowtorches) bt.draw(this.ctx);
    }

    // Draw Flame Projectiles
    if (this.flameProjectiles) {
      for (const fp of this.flameProjectiles) fp.draw(this.ctx);
    }

    // Draw Cryo Projectiles (Player Exclusive Weapon)
    if (this.cryoProjectiles) {
      for (const cp of this.cryoProjectiles) cp.draw(this.ctx);
    }

    // Draw Boss Projectiles (Meatballs)
    if (this.bossProjectiles) {
      for (const bp of this.bossProjectiles) bp.draw(this.ctx);
    }

    // Draw Kiloburner Giant Boss
    if (this.kiloburnerBoss) {
      this.kiloburnerBoss.draw(this.ctx, window.spriteManager);
    }

    // Draw Pepper Clouds
    for (const pc of this.pepperClouds) {
      pc.draw(this.ctx);
    }

    // Draw Player
    if (this.player) {
      this.player.draw(this.ctx);
    }

    // Draw Dynamic Juice Particles
    for (const p of this.particles) {
      p.draw(this.ctx);
    }

    // Draw Popups
    for (const popup of this.popups) {
      popup.draw(this.ctx);
    }

    this.ctx.restore();

    // Render Boss Health Bar (Fixed screen coordinate overlay)
    if (this.kiloburnerBoss) {
      this.kiloburnerBoss.drawBossHealthBar(this.ctx, this.canvas.width);
    // Render Blowtorch Fuel Gauge (Level 3 Soplete HUD)
    if (this.levelData && this.levelData.blowtorches && this.levelData.blowtorches.length > 0 && this.player) {
      const fuelPct = Math.max(0, Math.min(1, this.player.blowtorchFuel / this.player.maxBlowtorchFuel));
      const fuelBarW = 76;
      const fuelBarH = 7;
      const fuelBarX = 82;
      const fuelBarY = 22;

      this.ctx.save();
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 7px monospace';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(this.player.hasBlowtorch ? `🔥 GAS: ${Math.round(this.player.blowtorchFuel)}%` : '🔍 BUSCA SOPLETE', fuelBarX, fuelBarY - 2);

      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(fuelBarX, fuelBarY, fuelBarW, fuelBarH);

      if (this.player.hasBlowtorch && fuelPct > 0) {
        const fillW = Math.round(fuelBarW * fuelPct);
        const grad = this.ctx.createLinearGradient(fuelBarX, fuelBarY, fuelBarX + fuelBarW, fuelBarY);
        grad.addColorStop(0, '#f97316');
        grad.addColorStop(0.7, '#eab308');
        grad.addColorStop(1, '#38bdf8');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(fuelBarX, fuelBarY, fillW, fuelBarH);
      } else {
        if (Math.floor(Date.now() / 250) % 2 === 0) {
          this.ctx.fillStyle = '#ef4444';
          this.ctx.fillRect(fuelBarX, fuelBarY, fuelBarW, fuelBarH);
        }
      }
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(fuelBarX, fuelBarY, fuelBarW, fuelBarH);
      this.ctx.restore();
    }

    }

    // Overlays for specific states
    if (this.state === 'READY') {
      this.drawBanner(`STAGE ${this.levelData.stageNumber}`, 'GET READY!');
    } else if (this.state === 'STAGE_CLEAR') {
      this.drawStageClearOverlay();
    } else if (this.state === 'GAME_OVER') {
      this.drawBanner('GAME OVER', 'VOLVIENDO AL MAPA...');
    } else if (this.state === 'PAUSED') {
      this.drawBanner('PAUSED', 'TAP PAUSE TO RESUME');
    }
  }

  drawStageBackground() {
    // Background designs removed per user request to maintain clean classic arcade contrast
  }

  drawHUD() {
    this.ctx.fillStyle = '#fcfcfc';
    this.ctx.font = '7px "Press Start 2P", monospace';

    // 1UP Score (Left)
    this.ctx.fillStyle = '#e40058';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('1UP', 14, 14);
    this.ctx.fillStyle = '#fcfcfc';
    this.ctx.fillText(this.score.toString().padStart(6, '0'), 14, 25);

    // Current Stage / Level (Center)
    const stageNum = (this.levelData && this.levelData.stageNumber) ? this.levelData.stageNumber : (this.stageIndex + 1);
    this.ctx.fillStyle = '#fcb400'; // Arcade gold
    this.ctx.textAlign = 'center';
    this.ctx.fillText('STAGE', 120, 14);
    this.ctx.fillStyle = '#00f0ff'; // Retro cyan
    this.ctx.fillText(stageNum.toString().padStart(2, '0'), 120, 25);

    if (this.devMode) {
      this.ctx.fillStyle = '#00e436';
      this.ctx.font = '6px "Press Start 2P", monospace';
      this.ctx.fillText('[DEV]', 120, 34);
      this.ctx.font = '7px "Press Start 2P", monospace';
    }

    // High Score (Right)
    this.ctx.fillStyle = '#e40058';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('HIGH', 170, 14);
    this.ctx.fillStyle = '#fcfcfc';
    this.ctx.fillText(this.highScore.toString().padStart(6, '0'), 170, 25);

    // Pepper shaker icons or Bio Ammo remaining (Matching Reference Art)
    if (this.kiloburnerBoss) {
      this.ctx.fillStyle = '#4ade80';
      this.ctx.font = '6px "Press Start 2P", monospace';
      this.ctx.textAlign = 'left';
      this.ctx.fillText('PEPPER AMMO', 14, 34);
      // Glowing green battery bars
      for (let i = 0; i < 5; i++) {
        this.ctx.fillStyle = '#22c55e';
        this.ctx.fillRect(14 + i * 9, 37, 7, 5);
        this.ctx.fillStyle = '#bbf7d0';
        this.ctx.fillRect(14 + i * 9, 37, 7, 1);
      }
    } else {
      const pepperSpr = window.spriteManager.get('pepper_icon');
      if (pepperSpr && this.player) {
        for (let i = 0; i < this.player.peppers; i++) {
          this.ctx.drawImage(pepperSpr, 14 + i * 11, 33, 10, 10);
        }
      }
    }

    // Lives icons remaining
    const lifeSpr = window.spriteManager.get('player_walk1');
    if (lifeSpr && this.player) {
      if (this.player.lives <= 4) {
        for (let i = 0; i < this.player.lives; i++) {
          this.ctx.drawImage(lifeSpr, 180 + i * 12, 31, 11, 11);
        }
      } else {
        this.ctx.drawImage(lifeSpr, 178, 31, 12, 12);
        this.ctx.fillStyle = '#fcfcfc';
        this.ctx.font = '7px "Press Start 2P", monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`x${this.player.lives}`, 194, 40);
      }
    }

    // Boss Health Bar in HUD (when on a Boss stage)
    if (this.boss && !this.boss.isDead && this.boss.drawHUDHealthBar) {
      this.boss.drawHUDHealthBar(this.ctx);
    }
  }

  drawPlatforms() {
    const stageNum = (this.levelData && this.levelData.stageNumber) ? this.levelData.stageNumber : (this.stageIndex + 1);
    const theme = window.stageThemesManager ? window.stageThemesManager.getTheme(stageNum) : null;
    const platSpr = window.spriteManager.get('platform');

    for (const f of this.levelData.floors) {
      if (f.type === 'diagonal') {
        this.drawDiagonalPlatform(f, theme || platSpr);
      } else if (f.type === 'elevator') {
        this.drawElevatorPlatform(f, theme || platSpr);
      } else if (f.type === 'swaying') {
        this.drawSwayingPlatform(f, theme || platSpr);
      } else if (f.type === 'swing') {
        this.drawSwingPlatform(f, theme || platSpr);
      } else {
        if (theme && window.stageThemesManager) {
          window.stageThemesManager.drawPlatform(this.ctx, f, theme);
        } else if (platSpr) {
          for (let x = f.x1; x < f.x2; x += 16) {
            const w = Math.min(16, f.x2 - x);
            this.ctx.drawImage(platSpr, 0, 0, w, 8, x, f.y + 14, w, 8);
          }
        }
      }
    }
  }

  drawDiagonalPlatform(f, themeOrSpr) {
    const stageNum = (this.levelData && this.levelData.stageNumber) ? this.levelData.stageNumber : (this.stageIndex + 1);
    const theme = window.stageThemesManager ? window.stageThemesManager.getTheme(stageNum) : null;
    const p = theme ? theme.platform : null;

    const steps = Math.max(3, Math.floor((f.x2 - f.x1) / 12));
    const dx = (f.x2 - f.x1) / steps;
    const dy = (f.y2 - f.y1) / steps;

    // Metallic truss girder rail under the ramp matching stage theme
    this.ctx.strokeStyle = p ? p.trimColor : '#b87820';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(f.x1, f.y1 + 18);
    this.ctx.lineTo(f.x2, f.y2 + 18);
    this.ctx.stroke();

    this.ctx.strokeStyle = p ? p.highlightColor : '#f8b800';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(f.x1, f.y1 + 16);
    this.ctx.lineTo(f.x2, f.y2 + 16);
    this.ctx.stroke();

    // Stepped platform segments
    for (let i = 0; i < steps; i++) {
      const sx = Math.round(f.x1 + i * dx);
      const sy = Math.round(f.y1 + i * dy);
      const sw = Math.round(dx + 2);

      if (theme && window.stageThemesManager) {
        window.stageThemesManager.drawPlatform(this.ctx, { x1: sx, x2: sx + sw, y: sy }, theme);
      } else {
        this.ctx.fillStyle = p ? p.topColor : '#00a844';
        this.ctx.fillRect(sx, sy + 14, sw, 8);
      }
    }

    // Safety edge studs
    this.ctx.fillStyle = p ? p.highlightColor : '#fce4a0';
    this.ctx.fillRect(f.x1 - 2, f.y1 + 13, 3, 10);
    this.ctx.fillRect(f.x2 - 1, f.y2 + 13, 3, 10);
  }

  drawElevatorPlatform(f, themeOrSpr) {
    const stageNum = (this.levelData && this.levelData.stageNumber) ? this.levelData.stageNumber : (this.stageIndex + 1);
    const theme = window.stageThemesManager ? window.stageThemesManager.getTheme(stageNum) : null;
    const p = theme ? theme.platform : null;

    // 1. Draw vertical cables & shaft rails
    this.ctx.strokeStyle = p ? p.trimColor : '#445566';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(f.x1 + 6, f.minY + 6);
    this.ctx.lineTo(f.x1 + 6, f.maxY + 22);
    this.ctx.moveTo(f.x2 - 6, f.minY + 6);
    this.ctx.lineTo(f.x2 - 6, f.maxY + 22);
    this.ctx.stroke();

    // 2. Draw pulley cogs at top
    this.ctx.fillStyle = p ? p.highlightColor : '#f8b800';
    this.ctx.fillRect(f.x1 + 4, f.minY + 2, 5, 5);
    this.ctx.fillRect(f.x2 - 8, f.minY + 2, 5, 5);

    // 3. Draw themed elevator platform
    const w = f.x2 - f.x1;
    if (theme && window.stageThemesManager) {
      window.stageThemesManager.drawPlatform(this.ctx, f, theme);
    } else {
      this.ctx.fillStyle = p ? p.bodyColor : '#203048';
      this.ctx.fillRect(f.x1, f.y + 14, w, 8);
    }

    // Flashing safety signal lamp on elevator
    const pulse = Math.floor(Date.now() / 250) % 2 === 0;
    this.ctx.fillStyle = pulse ? '#00e436' : '#fc5454';
    this.ctx.fillRect(f.x1 + Math.floor(w / 2) - 2, f.y + 16, 4, 4);

    // Side brackets
    this.ctx.fillStyle = p ? p.trimColor : '#83769c';
    this.ctx.fillRect(f.x1, f.y + 11, 4, 11);
    this.ctx.fillRect(f.x2 - 4, f.y + 11, 4, 11);
  }

  drawSwayingPlatform(f, themeOrSpr) {
    const stageNum = (this.levelData && this.levelData.stageNumber) ? this.levelData.stageNumber : (this.stageIndex + 1);
    const theme = window.stageThemesManager ? window.stageThemesManager.getTheme(stageNum) : null;
    const p = theme ? theme.platform : null;

    // 1. Draw sliding guide track behind platform
    const railX1 = (f.baseX1 || f.x1) - (f.range || 35);
    const railX2 = (f.baseX2 || f.x2) + (f.range || 35);
    this.ctx.strokeStyle = p ? p.trimColor : '#556677';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(railX1, f.y + 18);
    this.ctx.lineTo(railX2, f.y + 18);
    this.ctx.stroke();

    // Track end bumpers
    this.ctx.fillStyle = p ? p.highlightColor : '#d82800';
    this.ctx.fillRect(railX1 - 2, f.y + 15, 3, 7);
    this.ctx.fillRect(railX2 - 1, f.y + 15, 3, 7);

    // 2. Platform body
    if (theme && window.stageThemesManager) {
      window.stageThemesManager.drawPlatform(this.ctx, f, theme);
    } else {
      this.ctx.fillStyle = p ? p.topColor : '#00a844';
      this.ctx.fillRect(f.x1, f.y + 14, f.x2 - f.x1, 8);
    }

    // Hazard accents on borders
    this.ctx.fillStyle = p ? p.highlightColor : '#fcb400';
    this.ctx.fillRect(f.x1, f.y + 14, 3, 8);
    this.ctx.fillRect(f.x2 - 3, f.y + 14, 3, 8);
  }

  drawSwingPlatform(f, themeOrSpr) {
    const stageNum = (this.levelData && this.levelData.stageNumber) ? this.levelData.stageNumber : (this.stageIndex + 1);
    const theme = window.stageThemesManager ? window.stageThemesManager.getTheme(stageNum) : null;
    const p = theme ? theme.platform : null;

    // 1. Pivot ring
    this.ctx.fillStyle = p ? p.highlightColor : '#fcb400';
    this.ctx.beginPath();
    this.ctx.arc(f.pivotX, f.pivotY, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // 2. Tension chains / ropes to both ends of the platform
    const leftAnchorX = f.x1 + 4;
    const rightAnchorX = f.x2 - 4;
    const anchorY = f.y + 15;

    this.ctx.strokeStyle = p ? p.trimColor : '#a08050';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(f.pivotX - 2, f.pivotY);
    this.ctx.lineTo(leftAnchorX, anchorY);
    this.ctx.moveTo(f.pivotX + 2, f.pivotY);
    this.ctx.lineTo(rightAnchorX, anchorY);
    this.ctx.stroke();

    // 3. Platform body
    if (theme && window.stageThemesManager) {
      window.stageThemesManager.drawPlatform(this.ctx, f, theme);
    } else {
      this.ctx.fillStyle = p ? p.bodyColor : '#8b5a2b';
      this.ctx.fillRect(f.x1, f.y + 14, f.x2 - f.x1, 8);
    }

    // Metallic ring fittings on ends
    this.ctx.fillStyle = p ? p.highlightColor : '#fcb400';
    this.ctx.fillRect(leftAnchorX - 2, anchorY - 2, 4, 4);
    this.ctx.fillRect(rightAnchorX - 2, anchorY - 2, 4, 4);
  }

  drawLadders() {
    const stageNum = (this.levelData && this.levelData.stageNumber) ? this.levelData.stageNumber : (this.stageIndex + 1);
    const theme = window.stageThemesManager ? window.stageThemesManager.getTheme(stageNum) : null;
    const ladderSpr = window.spriteManager.get('ladder');

    for (const l of this.levelData.ladders) {
      if (theme && window.stageThemesManager) {
        window.stageThemesManager.drawLadder(this.ctx, l, theme);
      } else if (ladderSpr) {
        for (let y = l.y1 + 4; y < l.y2 + 14; y += 16) {
          const h = Math.min(16, l.y2 + 14 - y);
          this.ctx.drawImage(ladderSpr, 0, 0, 16, h, l.x, y, 16, h);
        }
      }
    }
  }

  drawPlates() {
    const stageNum = (this.levelData && this.levelData.stageNumber) ? this.levelData.stageNumber : (this.stageIndex + 1);
    const theme = window.stageThemesManager ? window.stageThemesManager.getTheme(stageNum) : null;
    const plateSpr = window.spriteManager.get('plate');

    for (const p of this.levelData.plates) {
      if (theme && window.stageThemesManager) {
        window.stageThemesManager.drawPlate(this.ctx, p, theme);
      } else if (plateSpr) {
        this.ctx.drawImage(plateSpr, p.x, p.y + 14);
      }
    }
  }

  drawBanner(line1, line2) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.ctx.fillRect(20, 120, 200, 60);

    this.ctx.strokeStyle = '#fcb400';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(20, 120, 200, 60);

    this.ctx.fillStyle = '#fcb400';
    this.ctx.font = '10px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(line1, 120, 144);

    this.ctx.fillStyle = '#fcfcfc';
    this.ctx.font = '7px "Press Start 2P", monospace';
    this.ctx.fillText(line2, 120, 164);
    this.ctx.textAlign = 'left';
  }

  drawTitleScreen() {
    this.ctx.textAlign = 'center';

    const coverImg = window.spriteManager.get('title_cover');
    if (coverImg && (coverImg.complete || coverImg.naturalWidth > 0)) {
      // 1. Draw Official Cover Illustration
      // Canvas is 240x320. Cover is 387x392.
      // Positioned cleanly from y = 14 to y = 256
      this.ctx.drawImage(coverImg, 0, 14, 240, 242);

      // Subtle top vignette gradient for title contrast
      const topGrad = this.ctx.createLinearGradient(0, 0, 0, 36);
      topGrad.addColorStop(0, 'rgba(5, 5, 8, 0.92)');
      topGrad.addColorStop(1, 'rgba(5, 5, 8, 0.0)');
      this.ctx.fillStyle = topGrad;
      this.ctx.fillRect(0, 0, 240, 36);

      // Subtle bottom gradient for drawer contrast
      const botGrad = this.ctx.createLinearGradient(0, 226, 0, 254);
      botGrad.addColorStop(0, 'rgba(5, 5, 8, 0.0)');
      botGrad.addColorStop(1, 'rgba(5, 5, 8, 0.95)');
      this.ctx.fillStyle = botGrad;
      this.ctx.fillRect(0, 226, 240, 28);

      // 2. Retro Title Header
      this.ctx.fillStyle = '#000000';
      this.ctx.font = '14px "Press Start 2P", monospace';
      this.ctx.fillText('BURGER PANIC', 121, 23);
      this.ctx.fillStyle = '#fcb400';
      this.ctx.fillText('BURGER PANIC', 120, 22);

      if (this.devMode) {
        this.ctx.fillStyle = '#00e436';
        this.ctx.font = '6px "Press Start 2P", monospace';
        this.ctx.fillText('🛠️ MODO DEV: 15 NIVELES', 120, 32);
      }

      // 3. Bottom Action Drawer
      this.ctx.fillStyle = '#080612';
      this.ctx.fillRect(0, 252, 240, 68);
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 252);
      this.ctx.lineTo(240, 252);
      this.ctx.stroke();

      // Pulsing Play Button
      const pulse = Math.floor(Date.now() / 380) % 2 === 0;
      this.ctx.fillStyle = pulse ? '#e40058' : '#c80045';
      this.ctx.beginPath();
      if (this.ctx.roundRect) {
        this.ctx.roundRect(32, 258, 176, 22, 4);
      } else {
        this.ctx.rect(32, 258, 176, 22);
      }
      this.ctx.fill();
      this.ctx.strokeStyle = pulse ? '#ffe870' : '#fcb400';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '9px "Press Start 2P", monospace';
      this.ctx.fillText('▶ TAP TO PLAY', 120, 273);

      // Map Button Prompt
      this.ctx.fillStyle = '#00f0ff';
      this.ctx.font = '7px "Press Start 2P", monospace';
      this.ctx.fillText('🗺️ MAPA DE NIVELES', 120, 292);

      // Top Score
      this.ctx.fillStyle = '#747474';
      this.ctx.font = '6px "Press Start 2P", monospace';
      this.ctx.fillText(`TOP SCORE: ${this.highScore.toString().padStart(6, '0')}`, 120, 308);

    } else {
      // Fallback if image is still loading
      this.ctx.fillStyle = '#e40058';
      this.ctx.font = '16px "Press Start 2P", monospace';
      this.ctx.fillText('BURGER', 120, 60);
      this.ctx.fillStyle = '#fcb400';
      this.ctx.fillText('PANIC', 120, 84);

      this.ctx.fillStyle = '#00a8fc';
      this.ctx.font = '7px "Press Start 2P", monospace';
      this.ctx.fillText('RETRO ARCADE ADVENTURE', 120, 104);

      if (Math.floor(Date.now() / 450) % 2 === 0) {
        this.ctx.fillStyle = '#fce4a0';
        this.ctx.font = '9px "Press Start 2P", monospace';
        this.ctx.fillText('TAP TO PLAY', 120, 248);
      }
      this.ctx.fillStyle = '#00f0ff';
      this.ctx.font = '7px "Press Start 2P", monospace';
      this.ctx.fillText('🗺️ MAPA DE NIVELES', 120, 268);
      this.ctx.fillStyle = '#747474';
      this.ctx.font = '6px "Press Start 2P", monospace';
      this.ctx.fillText(`TOP SCORE: ${this.highScore.toString().padStart(6, '0')}`, 120, 288);
    }

    this.ctx.textAlign = 'left';
  }

  drawStars(ctx, stars, x, y, size = 16, spacing = 18) {
    const sprFull = window.spriteManager.get('star_full');
    const sprHalf = window.spriteManager.get('star_half');
    const sprEmpty = window.spriteManager.get('star_empty');

    for (let i = 0; i < 3; i++) {
      const starX = x + i * spacing;
      let sprite = sprEmpty;
      if (stars >= i + 1) {
        sprite = sprFull;
      } else if (stars >= i + 0.5) {
        sprite = sprHalf;
      }
      if (sprite) {
        ctx.drawImage(sprite, starX, y, size, size);
      }
    }
  }

  drawStageClearOverlay() {
    const stageNum = (this.levelData && this.levelData.stageNumber) ? this.levelData.stageNumber : (this.stageIndex + 1);

    this.ctx.fillStyle = 'rgba(5, 5, 12, 0.90)';
    this.ctx.fillRect(16, 36, 208, 248);

    this.ctx.strokeStyle = '#fcb400';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(16, 36, 208, 248);

    this.ctx.textAlign = 'center';

    // Title
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.font = '10px "Press Start 2P", monospace';
    this.ctx.fillText(`NIVEL ${stageNum} SUPERADO!`, 120, 62);

    this.ctx.fillStyle = '#fcb400';
    this.ctx.font = '7px "Press Start 2P", monospace';
    const stageName = (this.levelData && this.levelData.name) ? this.levelData.name : 'COCINA';
    this.ctx.fillText(stageName, 120, 78);

    // Big Stars Display
    const stars = this.stageEarnedStars || 1;
    const startX = 120 - (3 * 26) / 2 + 3;
    this.drawStars(this.ctx, stars, startX, 90, 20, 26);

    this.ctx.fillStyle = '#fcfcfc';
    this.ctx.font = '7px "Press Start 2P", monospace';
    this.ctx.fillText(`CALIFICACIÓN: ${stars} ★`, 120, 126);

    // Breakdown Table
    this.ctx.textAlign = 'left';
    this.ctx.font = '6px "Press Start 2P", monospace';

    // Level Clear
    this.ctx.fillStyle = '#00ff88';
    this.ctx.fillText('• SUPERAR NIVEL: 1★ OBTENIDA', 26, 148);

    // Items 1-3
    if (this.stageBonusItemsCollected === 3) {
      this.ctx.fillStyle = '#00ff88';
      this.ctx.fillText('• 3 ÍTEMS: 2★ ALCANZADAS!', 26, 164);
    } else if (this.stageBonusItemsCollected > 0) {
      this.ctx.fillStyle = '#fcb400';
      this.ctx.fillText(`• ${this.stageBonusItemsCollected}/3 ÍTEMS: 1.5★ OBTENIDAS`, 26, 164);
    } else {
      this.ctx.fillStyle = '#777777';
      this.ctx.fillText('• 0/3 ÍTEMS: (0★ ADICIONALES)', 26, 164);
    }

    // Extra life item
    if (this.stageLifeItemCollected) {
      this.ctx.fillStyle = '#00ff88';
      this.ctx.fillText('• VIDA EXTRA ÍTEM: 3★ TOTAL!', 26, 180);
    } else {
      this.ctx.fillStyle = '#777777';
      this.ctx.fillText('• VIDA EXTRA: NO OBTENIDA', 26, 180);
    }

    // Score
    this.ctx.fillStyle = '#fcb400';
    this.ctx.fillText(`• PUNTOS: ${this.score}`, 26, 198);

    // Action Buttons Prompt
    this.ctx.textAlign = 'center';
    if (Math.floor(Date.now() / 400) % 2 === 0) {
      this.ctx.fillStyle = '#00ff88';
      this.ctx.font = '7px "Press Start 2P", monospace';
      this.ctx.fillText('[ JUMP / TAP ] SIGUIENTE', 120, 234);
    }
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.font = '6px "Press Start 2P", monospace';
    this.ctx.fillText('[ PEPPER ] VER MAPA', 120, 254);
  }

  drawMapScreen() {
    this.ctx.fillStyle = '#0c0722';
    this.ctx.fillRect(0, 0, 240, 320);

    const unlocked = this.getUnlockedLevel();
    const scores = JSON.parse(localStorage.getItem('burgerpanic_level_scores') || '{}');
    const scrollY = Math.round(this.mapScrollY);

    // Save context for scrollable world
    this.ctx.save();
    this.ctx.translate(0, -scrollY);

    // 1. Twilight / Candy Sky Gradient (920px tall world)
    const bgGrad = this.ctx.createLinearGradient(0, 0, 0, 920);
    bgGrad.addColorStop(0, '#0c0722');
    bgGrad.addColorStop(0.3, '#1c1038');
    bgGrad.addColorStop(0.65, '#161d42');
    bgGrad.addColorStop(1, '#091526');
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, 240, 920);

    // Fluffy candy pastel clouds along the path
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    const clouds = [
      { x: 40, y: 120, rx: 35, ry: 12 },
      { x: 190, y: 220, rx: 42, ry: 14 },
      { x: 60, y: 360, rx: 38, ry: 13 },
      { x: 180, y: 490, rx: 45, ry: 15 },
      { x: 50, y: 640, rx: 40, ry: 14 },
      { x: 200, y: 770, rx: 42, ry: 15 }
    ];
    for (const c of clouds) {
      this.ctx.beginPath();
      this.ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
      this.ctx.ellipse(c.x - 10, c.y - 4, c.rx * 0.7, c.ry * 0.8, 0, 0, Math.PI * 2);
      this.ctx.ellipse(c.x + 12, c.y - 2, c.rx * 0.6, c.ry * 0.7, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Twinkling stars
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let sy = 20; sy < 900; sy += 38) {
      const sx = ((sy * 43) % 210) + 15;
      const pulse = (Math.sin(Date.now() / 400 + sy) + 1) * 0.8 + 0.5;
      this.ctx.fillRect(sx, sy, pulse, pulse);
    }

    // 2. Draw Golden Candy Road Ribbons connecting nodes
    for (let i = 0; i < this.mapNodes.length - 1; i++) {
      const n1 = this.mapNodes[i];
      const n2 = this.mapNodes[i + 1];
      const isSegmentUnlocked = n2.level <= unlocked;

      const steps = 16;
      const pts = [];
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const curveOffset = Math.sin(t * Math.PI) * 16 * (i % 2 === 0 ? 1 : -1);
        pts.push({
          x: n1.x + (n2.x - n1.x) * t + curveOffset,
          y: n1.y + (n2.y - n1.y) * t
        });
      }

      // Outer path border
      this.ctx.beginPath();
      this.ctx.moveTo(pts[0].x, pts[0].y);
      for (let p = 1; p < pts.length; p++) {
        this.ctx.lineTo(pts[p].x, pts[p].y);
      }
      this.ctx.lineWidth = 12;
      this.ctx.strokeStyle = isSegmentUnlocked ? 'rgba(180, 115, 15, 0.75)' : 'rgba(30, 30, 45, 0.6)';
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.stroke();

      // Inner golden ribbon
      this.ctx.lineWidth = 8;
      this.ctx.strokeStyle = isSegmentUnlocked ? '#fbbf24' : '#2d2d3f';
      this.ctx.stroke();

      // Sweet cream center dashes
      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = isSegmentUnlocked ? '#fffbeb' : '#47475c';
      this.ctx.setLineDash([4, 6]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // 3. Draw Level Nodes (3D Candy Jewels)
    for (let i = 0; i < this.mapNodes.length; i++) {
      const node = this.mapNodes[i];
      const isUnlocked = node.level <= unlocked;
      const isSelected = this.mapSelectedStage === node.level;
      const stars = this.getStageStars(node.level);

      // Node soft drop shadow
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y + 3, 17, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      this.ctx.fill();

      // Selected Glowing Aura
      if (isSelected) {
        const pulse = 20 + Math.sin(Date.now() / 150) * 2.5;
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();
      }

      // Outer Gold / Metal Rim
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
      this.ctx.fillStyle = isUnlocked
        ? (node.isBoss ? '#ef4444' : (stars === 3 ? '#d97706' : '#0284c7'))
        : '#27273a';
      this.ctx.fill();

      // Inner Candy Sphere
      const radGrad = this.ctx.createRadialGradient(node.x - 4, node.y - 5, 2, node.x, node.y, 14);
      if (isUnlocked) {
        if (node.isBoss) {
          radGrad.addColorStop(0, '#fca5a5');
          radGrad.addColorStop(0.5, '#dc2626');
          radGrad.addColorStop(1, '#7f1d1d');
        } else if (stars === 3) {
          radGrad.addColorStop(0, '#fef08a');
          radGrad.addColorStop(0.5, '#f59e0b');
          radGrad.addColorStop(1, '#b45309');
        } else {
          radGrad.addColorStop(0, '#7dd3fc');
          radGrad.addColorStop(0.5, '#0284c7');
          radGrad.addColorStop(1, '#0369a1');
        }
      } else {
        radGrad.addColorStop(0, '#3f3f5a');
        radGrad.addColorStop(1, '#181824');
      }
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 13.5, 0, Math.PI * 2);
      this.ctx.fillStyle = radGrad;
      this.ctx.fill();

      // Specular Highlight (Curved glossy crescent sheen)
      this.ctx.beginPath();
      this.ctx.ellipse(node.x, node.y - 6, 8, 3.5, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      this.ctx.fill();

      // Level Label or Lock Icon
      this.ctx.textAlign = 'center';
      if (isUnlocked) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 9px "Press Start 2P", monospace';
        this.ctx.fillText(node.level.toString(), node.x, node.y + 4);

        // Stars beneath node
        this.drawStars(this.ctx, stars, node.x - 17, node.y + 20, 10, 12);
      } else {
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '8px "Press Start 2P", monospace';
        this.ctx.fillText('🔒', node.x, node.y + 3);
      }

      // Chef Avatar on Selected Level (Same sprite as the game)
      if (isSelected) {
        const bounce = Math.sin(Date.now() / 180) * 2;
        const idleBlink = Math.floor(Date.now() / 400) % 8 === 0;
        const atlasName = idleBlink ? 'detenido_2' : 'detenido_1';

        const info = window.spriteManager.getAtlasInfo(atlasName);
        const w = info ? info.w : 13;
        const h = info ? info.h : 28;
        const drawX = Math.round(node.x - w / 2);
        const drawY = Math.round(node.y - 14 - h + bounce);

        // Subtle ground shadow under Chef's feet
        this.ctx.beginPath();
        this.ctx.ellipse(node.x, node.y - 13, 7, 2, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        this.ctx.fill();

        // Draw exact game sprite from Chef Atlas
        const drawn = window.spriteManager.drawAtlas(this.ctx, atlasName, drawX, drawY, false);
        if (!drawn) {
          const chefSpr = window.spriteManager.get('player_walk1');
          if (chefSpr) {
            this.ctx.drawImage(chefSpr, node.x - 8, node.y - 32 + bounce, 16, 16);
          }
        }

        // Floating golden arrow beacon above Chef
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.font = '7px "Press Start 2P", monospace';
        this.ctx.fillText('▼', node.x, drawY - 4);
      }
    }

    this.ctx.restore();

    // 4. Fixed Top Modern Glass Header
    this.ctx.fillStyle = 'rgba(12, 10, 26, 0.92)';
    this.ctx.fillRect(0, 0, 240, 36);
    this.ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 36);
    this.ctx.lineTo(240, 36);
    this.ctx.stroke();

    // Back pill button
    this.ctx.fillStyle = '#fb7185';
    this.ctx.font = '7px "Press Start 2P", monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('◀ VOLVER', 10, 22);

    // Total stars
    const totalStars = this.getTotalStars();
    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.fillText(`★ ${totalStars.toFixed(1).replace('.0', '')}/45`, 230, 22);

    // 5. Fixed Bottom Action Glass Drawer
    this.ctx.fillStyle = 'rgba(12, 10, 26, 0.95)';
    this.ctx.fillRect(0, 260, 240, 60);
    this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(0, 260);
    this.ctx.lineTo(240, 260);
    this.ctx.stroke();

    const selNode = this.mapNodes.find((n) => n.level === this.mapSelectedStage) || this.mapNodes[0];
    const isSelUnlocked = selNode.level <= unlocked;
    const availableStages = (this.levelMap && this.levelMap.levels) ? this.levelMap.levels.length : 16;
    const isImplemented = selNode.level <= availableStages;
    const selStars = this.getStageStars(selNode.level);
    const selScore = scores[selNode.level] || 0;

    // Stage Info
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = selNode.isBoss ? '#ef4444' : '#ffffff';
    this.ctx.font = '7px "Press Start 2P", monospace';
    const stagePrefix = selNode.isBoss ? '💥 JEFE' : `NIVEL ${selNode.level}`;
    this.ctx.fillText(`${stagePrefix}: ${selNode.name}`, 10, 278);

    if (isSelUnlocked) {
      if (isImplemented) {
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.font = '6px "Press Start 2P", monospace';
        this.ctx.fillText(`RÉCORD: ${selScore.toString().padStart(6, '0')} | ${selStars}★`, 10, 295);

        // Glowing Green Play Pill
        const pulse = Math.floor(Date.now() / 350) % 2 === 0;
        this.ctx.fillStyle = pulse ? '#10b981' : '#059669';
        this.ctx.beginPath();
        if (this.ctx.roundRect) {
          this.ctx.roundRect(162, 280, 68, 26, 8);
          this.ctx.fill();
        } else {
          this.ctx.fillRect(162, 280, 68, 26);
        }
        this.ctx.strokeStyle = '#6ee7b7';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 8px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('JUGAR', 196, 297);
      } else {
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.font = '6px "Press Start 2P", monospace';
        this.ctx.fillText('¡PRÓXIMAMENTE!', 10, 295);
      }
    } else {
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.font = '6px "Press Start 2P", monospace';
      this.ctx.fillText('NIVEL BLOQUEADO', 10, 295);
      this.ctx.fillText(`🔒 Supera Nivel ${selNode.level - 1} para abrir`, 10, 308);
    }
  }

  startLoop() {
    const loop = (timestamp) => {
      this.update();
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

window.BurgerPanicGame = BurgerPanicGame;

window.addEventListener('DOMContentLoaded', () => {
  window.burgerPanicGame = new BurgerPanicGame();

  const canvas = document.getElementById('gameCanvas');

  function getCanvasCoords(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = 240 / rect.width;
    const scaleY = 320 / rect.height;
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  let isTouchDragging = false;
  let dragStartY = 0;
  let dragStartScrollY = 0;
  let totalDragDist = 0;

  const handlePointerDown = (e) => {
    const game = window.burgerPanicGame;
    if (!game || game.state !== 'MAP') return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    isTouchDragging = true;
    dragStartY = clientY;
    dragStartScrollY = game.mapScrollY;
    totalDragDist = 0;
  };

  const handlePointerMove = (e) => {
    const game = window.burgerPanicGame;
    if (!game || game.state !== 'MAP' || !isTouchDragging) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dy = clientY - dragStartY;
    totalDragDist += Math.abs(dy);
    if (totalDragDist > 4) {
      // Scale dy relative to 240x320 virtual world
      const rect = canvas.getBoundingClientRect();
      const scaleY = 320 / rect.height;
      const scaledDy = dy * scaleY;
      game.mapTargetScrollY = Math.max(0, Math.min(dragStartScrollY - scaledDy, 600));
      game.mapScrollY = game.mapTargetScrollY;
    }
  };

  const handlePointerUp = () => {
    isTouchDragging = false;
  };

  canvas.addEventListener('mousedown', handlePointerDown);
  window.addEventListener('mousemove', handlePointerMove);
  window.addEventListener('mouseup', handlePointerUp);

  canvas.addEventListener('touchstart', handlePointerDown, { passive: true });
  window.addEventListener('touchmove', handlePointerMove, { passive: true });
  window.addEventListener('touchend', handlePointerUp, { passive: true });

  const handleCanvasInteraction = (e) => {
    if (window.soundManager) {
      window.soundManager.init();
      window.soundManager.resume();
    }

    const game = window.burgerPanicGame;
    if (!game) return;

    // Ignore taps if the user was actively dragging the map
    if (totalDragDist > 8) {
      return;
    }

    const coords = getCanvasCoords(canvas, e);

    if (game.state === 'TITLE') {
      game.isInitialBoot = false;
      const resumeStage = game.getLastPlayedStage();
      game.openMap(resumeStage);
    } else if (game.state === 'PAUSED') {
      game.togglePause();
    } else if (game.state === 'GAME_OVER') {
      const lostStage = (game.stageIndex || 0) + 1;
      game.saveCurrentStage(lostStage);
      game.openMap(lostStage);
    } else if (game.state === 'STAGE_CLEAR') {
      if (coords.y >= 242) {
        game.openMap();
      } else {
        game.advanceNextStage();
      }
    } else if (game.state === 'MAP') {
      const unlocked = game.getUnlockedLevel();
      const availableStages = (game.levelMap && game.levelMap.levels) ? game.levelMap.levels.length : 3;

      // 1. Top bar: [ ◀ VOLVER ]
      if (coords.y <= 36) {
        game.isInitialBoot = false;
        game.state = (game.player && !game.player.isDead) ? 'PAUSED' : 'TITLE';
        if (game.state === 'PAUSED') game.updatePauseButtonUI(true);
        return;
      }

      // 2. Bottom Drawer: [ JUGAR ]
      if (coords.y >= 264) {
        if (coords.x >= 150) {
          game.startStage(game.mapSelectedStage);
        }
        return;
      }

      // 3. Winding Map World Nodes
      const worldY = coords.y + game.mapScrollY;
      const worldX = coords.x;

      for (const node of game.mapNodes) {
        const dist = Math.hypot(node.x - worldX, node.y - worldY);
        if (dist < 22) {
          if (node.level <= unlocked) {
            if (game.mapSelectedStage === node.level && node.level <= availableStages) {
              game.startStage(node.level);
            } else {
              game.mapSelectedStage = node.level;
              game.saveCurrentStage(node.level);
              game.centerMapOnStage(node.level);
              if (window.soundManager) window.soundManager.playStep();
            }
          } else {
            game.mapSelectedStage = node.level;
            game.centerMapOnStage(node.level);
            if (window.soundManager) window.soundManager.playBlip();
          }
          break;
        }
      }
    }
  };

  canvas.addEventListener('click', handleCanvasInteraction);
  canvas.addEventListener('touchend', handleCanvasInteraction, { passive: true });

  // Map header button
  const mapBtn = document.getElementById('btn-map');
  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      if (window.burgerPanicGame.state === 'MAP') {
        if (window.burgerPanicGame.player && !window.burgerPanicGame.player.isDead) {
          window.burgerPanicGame.state = 'PLAYING';
        } else {
          window.burgerPanicGame.state = 'TITLE';
        }
      } else {
        window.burgerPanicGame.openMap();
      }
    });
  }

  // Sound toggle button
  const soundBtn = document.getElementById('btn-sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = window.soundManager.toggleMute();
      soundBtn.textContent = isMuted ? '🔇' : '🔊';
    });
  }

  // Arcade Center Pause / Resume Button
  const pauseBtn = document.getElementById('btn-pause');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.burgerPanicGame) {
        window.burgerPanicGame.togglePause();
      }
    });
  }

  // Help Modal Toggle
  const helpBtn = document.getElementById('btn-help');
  const modal = document.getElementById('help-modal');
  const closeHelp = document.getElementById('btn-close-help');

  if (helpBtn && modal && closeHelp) {
    helpBtn.addEventListener('click', () => modal.classList.toggle('hidden'));
    closeHelp.addEventListener('click', () => modal.classList.add('hidden'));
  }

  // ----------------------------------------------------
  // DEVELOPER MODE CONTROLS & SHORTCUTS
  // ----------------------------------------------------
  const devBtn = document.getElementById('btn-dev');
  if (devBtn) {
    devBtn.addEventListener('click', () => {
      window.burgerPanicGame.toggleDevMode();
    });
  }

  const devStageSelect = document.getElementById('dev-stage-select');
  if (devStageSelect) {
    devStageSelect.addEventListener('change', (e) => {
      const stage = parseInt(e.target.value, 10);
      if (!isNaN(stage)) {
        window.burgerPanicGame.jumpToStage(stage);
      }
    });
  }

  const devPrevBtn = document.getElementById('dev-btn-prev');
  if (devPrevBtn) {
    devPrevBtn.addEventListener('click', () => {
      const current = (window.burgerPanicGame.stageIndex || 0) + 1;
      window.burgerPanicGame.jumpToStage(current - 1);
    });
  }

  const devNextBtn = document.getElementById('dev-btn-next');
  if (devNextBtn) {
    devNextBtn.addEventListener('click', () => {
      const current = (window.burgerPanicGame.stageIndex || 0) + 1;
      window.burgerPanicGame.jumpToStage(current + 1);
    });
  }

  const devPeppersBtn = document.getElementById('dev-btn-peppers');
  if (devPeppersBtn) {
    devPeppersBtn.addEventListener('click', () => {
      if (window.burgerPanicGame.player) {
        window.burgerPanicGame.player.peppers = 9;
        window.burgerPanicGame.updatePepperUI();
        window.burgerPanicGame.showDevToast('🧂 PIMIENTA RECARGADA: 9');
      }
    });
  }

  const devLivesBtn = document.getElementById('dev-btn-lives');
  if (devLivesBtn) {
    devLivesBtn.addEventListener('click', () => {
      if (window.burgerPanicGame.player) {
        window.burgerPanicGame.player.lives = 9;
        window.burgerPanicGame.showDevToast('❤️ VIDAS RECARGADAS: 9');
      }
    });
  }

  // Keyboard Shortcuts for Dev Mode & Inspection
  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) return;

    // Toggle Dev Mode with key 'D'
    if (e.key === 'd' || e.key === 'D') {
      window.burgerPanicGame.toggleDevMode();
      return;
    }

    if (window.burgerPanicGame.devMode) {
      if (e.key === ']' || e.key === 'PageDown' || e.key === '+' || e.key === 'n' || e.key === 'N') {
        const nextStage = ((window.burgerPanicGame.stageIndex || 0) + 1) + 1;
        window.burgerPanicGame.jumpToStage(nextStage);
      } else if (e.key === '[' || e.key === 'PageUp' || e.key === '-') {
        const prevStage = ((window.burgerPanicGame.stageIndex || 0) + 1) - 1;
        window.burgerPanicGame.jumpToStage(prevStage);
      } else if (e.key >= '1' && e.key <= '9') {
        window.burgerPanicGame.jumpToStage(parseInt(e.key, 10));
      } else if (e.key === '0') {
        window.burgerPanicGame.jumpToStage(10);
      } else if (e.key === 'l' || e.key === 'L') {
        if (window.burgerPanicGame.player) {
          window.burgerPanicGame.player.lives = 9;
          window.burgerPanicGame.showDevToast('❤️ VIDAS: 9');
        }
      } else if (e.key === 'k' || e.key === 'K') {
        if (window.burgerPanicGame.player) {
          window.burgerPanicGame.player.peppers = 9;
          window.burgerPanicGame.updatePepperUI();
          window.burgerPanicGame.showDevToast('🧂 PIMIENTA: 9');
        }
      }
    }
  });

  // Initial apply of dev mode UI state
  window.burgerPanicGame.applyDevModeUI();

  // Expose global dev helpers for console use
  window.game = window.burgerPanicGame;
  window.toggleDevMode = (force) => window.burgerPanicGame.toggleDevMode(force);
  window.unlockAllLevels = () => window.burgerPanicGame.toggleDevMode(true);
  window.jumpToStage = (n) => window.burgerPanicGame.jumpToStage(n);
});
