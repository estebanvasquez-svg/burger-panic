/**
 * Mobile Game UX Flow & Screens Manager for Burger Panic
 * Flow: SPLASH -> MENU -> MAP (Level Select) -> Gameplay -> STAGE_CLEAR (Victory) -> MAP / Next
 * Main Menu Sub-screens: PROFILE, SHOP, SETTINGS, LEADERBOARD
 */

class MobileScreensManager {
  constructor() {
    this.shopCatalog = [
      { id: 'extraLives',   name: '+1 VIDA INICIAL',   desc: 'Empieza con más vidas',    max: 2, costs: [60, 140],  icon: '❤️' },
      { id: 'extraPeppers', name: '+2 PIMIENTAS',      desc: 'Más pimienta por nivel',   max: 2, costs: [50, 120],  icon: '🧂' },
      { id: 'speedBoost',   name: 'TURBO CHEF',        desc: '+12% velocidad', max: 1, costs: [100],      icon: '⚡' },
      { id: 'startShield',  name: 'ESCUDO INICIAL',    desc: '3s invulnerable', max: 1, costs: [90],     icon: '🛡️' }
    ];
    this.resetConfirmArmed = false;
    this.shopFeedback = '';
    this.shopFeedbackTimer = 0;

    if (localStorage.getItem('burgerpanic_coins') === null) {
      localStorage.setItem('burgerpanic_coins', '50');
    }
  }

  getCoins() {
    return Math.max(0, parseInt(localStorage.getItem('burgerpanic_coins') || '0', 10));
  }

  addCoins(amount) {
    const next = this.getCoins() + Math.max(0, Math.round(amount));
    localStorage.setItem('burgerpanic_coins', String(next));
    return next;
  }

  getShopState() {
    try {
      const raw = JSON.parse(localStorage.getItem('burgerpanic_shop') || '{}');
      return {
        extraLives: raw.extraLives || 0,
        extraPeppers: raw.extraPeppers || 0,
        speedBoost: raw.speedBoost || 0,
        startShield: raw.startShield || 0
      };
    } catch (e) {
      return { extraLives: 0, extraPeppers: 0, speedBoost: 0, startShield: 0 };
    }
  }

  saveShopState(state) {
    localStorage.setItem('burgerpanic_shop', JSON.stringify(state));
  }

  buyUpgrade(itemId) {
    const item = this.shopCatalog.find((x) => x.id === itemId);
    if (!item) return false;
    const shop = this.getShopState();
    const lvl = shop[itemId] || 0;
    if (lvl >= item.max) {
      this.shopFeedback = '¡MÁXIMO ALCANZADO!';
      this.shopFeedbackTimer = 90;
      return false;
    }
    const cost = item.costs[lvl];
    const coins = this.getCoins();
    if (coins < cost) {
      this.shopFeedback = '¡MONEDAS INSUFICIENTES!';
      this.shopFeedbackTimer = 90;
      if (window.soundManager) window.soundManager.playBlip();
      return false;
    }
    localStorage.setItem('burgerpanic_coins', String(coins - cost));
    shop[itemId] = lvl + 1;
    this.saveShopState(shop);
    this.shopFeedback = `¡${item.name} EQUIPADO!`;
    this.shopFeedbackTimer = 110;
    if (window.soundManager) window.soundManager.playLifeUp();
    return true;
  }

  getLeaderboard() {
    const defaults = [
      { name: 'CHEF BRUNO', score: 15000, stage: 16 },
      { name: 'MASTER PAN', score: 11200, stage: 12 },
      { name: 'DON PIZZA',  score: 8400,  stage: 8 },
      { name: 'SUSHI PRO',  score: 5600,  stage: 5 },
      { name: 'PINCHE JR',  score: 2800,  stage: 2 }
    ];
    try {
      const saved = JSON.parse(localStorage.getItem('burgerpanic_leaderboard') || 'null');
      if (Array.isArray(saved) && saved.length > 0) {
        let migrated = false;
        for (const entry of saved) {
          if (entry && entry.name === 'CHEF PEPE') {
            entry.name = 'CHEF BRUNO';
            migrated = true;
          }
        }
        if (migrated) {
          localStorage.setItem('burgerpanic_leaderboard', JSON.stringify(saved));
        }
        return saved;
      }
    } catch (e) {}
    localStorage.setItem('burgerpanic_leaderboard', JSON.stringify(defaults));
    return defaults;
  }

  recordScore(score, stage) {
    if (!score || score <= 0) return;
    const board = this.getLeaderboard();
    board.push({ name: 'TÚ (CHEF)', score: Math.round(score), stage: stage || 1 });
    board.sort((a, b) => b.score - a.score);
    localStorage.setItem('burgerpanic_leaderboard', JSON.stringify(board.slice(0, 6)));
  }

  drawButton(ctx, x, y, w, h, label, bg, border, textColor = '#ffffff', fontSize = 7) {
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(x + 2, y + 2, w, h);
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px "Press Start 2P", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(label, x + w / 2, y + h / 2 + fontSize / 2 - 1);
  }

  drawTopBar(ctx, title) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 240, 34);
    ctx.fillStyle = '#e40058';
    ctx.fillRect(0, 33, 240, 2);

    this.drawButton(ctx, 8, 6, 56, 22, '◀ VOLVER', '#1e293b', '#38bdf8', '#f8fafc', 5.5);

    ctx.fillStyle = '#fcb400';
    ctx.font = 'bold 8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(title, 146, 21);
  }

  // 1. SPLASH SCREEN
  drawSplashScreen(ctx, game) {
    ctx.fillStyle = '#05050d';
    ctx.fillRect(0, 0, 240, 320);

    const progress = Math.max(0, Math.min(1, 1 - (game.stateTimer / 110)));

    // Radial glow
    const grad = ctx.createRadialGradient(120, 128, 10, 120, 128, 95);
    grad.addColorStop(0, 'rgba(252, 180, 0, 0.25)');
    grad.addColorStop(1, 'rgba(5, 5, 13, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 240, 320);

    // Chef sprite centerpiece
    if (window.spriteManager && window.spriteManager.atlasLoaded) {
      window.spriteManager.drawAtlas(ctx, 'detenido_1', 109, 102, false);
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fcb400';
    ctx.font = 'bold 13px "Press Start 2P", monospace';
    ctx.fillText('CHEF PANIC', 120, 168);

    ctx.fillStyle = '#00f0ff';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText('16-BIT ARCADE MOBILE', 120, 186);

    // Loading bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(40, 226, 160, 10);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 226, 160, 10);
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(42, 228, Math.round(156 * progress), 6);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '5.5px "Press Start 2P", monospace';
    ctx.fillText(`CARGANDO COCINA... ${Math.round(progress * 100)}%`, 120, 250);
  }

  // 2. MAIN MENU SCREEN
  drawMainMenu(ctx, game) {
    ctx.fillStyle = '#0a071a';
    ctx.fillRect(0, 0, 240, 320);

    // Title cover artwork in upper half
    const cover = window.spriteManager ? window.spriteManager.get('title_cover') : null;
    if (cover) {
      ctx.drawImage(cover, 0, 0, 240, 195);
    }

    // Dark gradient overlay for clean button contrast
    const grad = ctx.createLinearGradient(0, 145, 0, 320);
    grad.addColorStop(0, 'rgba(10, 7, 26, 0.25)');
    grad.addColorStop(0.28, 'rgba(10, 7, 26, 0.94)');
    grad.addColorStop(1, '#0a071a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 145, 240, 175);

    // Top Status Pills: Coins + Stars + High
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(8, 6, 224, 18);
    ctx.strokeStyle = '#fcb400';
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 6, 224, 18);

    ctx.font = '6px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#facc15';
    ctx.fillText(`🪙 ${this.getCoins()}`, 14, 18);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#38bdf8';
    const totalStars = game.getTotalStars ? game.getTotalStars() : 0;
    ctx.fillText(`★ ${totalStars}/48`, 120, 18);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#00ff88';
    ctx.fillText(`HI:${game.highScore}`, 226, 18);

    // Primary CTA: JUGAR -> Level Select (MAP)
    const pulse = Math.sin(Date.now() * 0.006) > 0;
    this.drawButton(ctx, 28, 176, 184, 34, '▶ JUGAR', '#10b981', pulse ? '#a7f3d0' : '#059669', '#ffffff', 10);

    // Secondary 2x2 Menu Grid
    this.drawButton(ctx, 20,  220, 96, 34, '👤 PERFIL',  '#1e293b', '#38bdf8', '#f8fafc', 6.5);
    this.drawButton(ctx, 124, 220, 96, 34, '🛒 TIENDA',  '#1e293b', '#facc15', '#fef08a', 6.5);
    this.drawButton(ctx, 20,  262, 96, 34, '⚙️ AJUSTES', '#1e293b', '#a855f7', '#f3e8ff', 6.5);
    this.drawButton(ctx, 124, 262, 96, 34, '🏆 RANKING', '#1e293b', '#f97316', '#ffedd5', 6.5);

    ctx.fillStyle = '#64748b';
    ctx.font = '5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MENÚ PRINCIPAL • v2.0', 120, 312);
  }

  // 3. PROFILE SCREEN
  drawProfileScreen(ctx, game) {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 240, 320);
    this.drawTopBar(ctx, 'PERFIL DEL CHEF');

    const stars = game.getTotalStars ? game.getTotalStars() : 0;
    const unlocked = game.getUnlockedLevel ? game.getUnlockedLevel() : 1;
    const coins = this.getCoins();
    const rank = stars >= 36 ? 'MAESTRO SUPREMO' : (stars >= 18 ? 'CHEF EJECUTIVO' : (stars >= 6 ? 'SOUS CHEF' : 'CHEF APRENDIZ'));

    // Card
    ctx.fillStyle = '#111827';
    ctx.fillRect(14, 46, 212, 74);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(14, 46, 212, 74);

    if (window.spriteManager && window.spriteManager.atlasLoaded) {
      window.spriteManager.drawAtlas(ctx, 'detenido_1', 30, 68, false);
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#fcb400';
    ctx.font = 'bold 8px "Press Start 2P", monospace';
    ctx.fillText('CHEF BRUNO', 72, 68);

    ctx.fillStyle = '#00ff88';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText(rank, 72, 86);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`MONEDAS: 🪙 ${coins}`, 72, 104);

    // Stats Box
    const stats = [
      ['RÉCORD MÁXIMO', `${game.highScore} PTS`, '#facc15'],
      ['ESTRELLAS TOTALES', `${stars} / 48 ★`, '#38bdf8'],
      ['NIVELES ABIERTOS', `${unlocked} / 16`, '#00ff88'],
      ['MEJORES MEJORAS', `${Object.values(this.getShopState()).reduce((a, b) => a + b, 0)} / 6`, '#f472b6']
    ];

    stats.forEach(([label, val, col], idx) => {
      const sy = 132 + idx * 38;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(14, sy, 212, 30);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(14, sy, 212, 30);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '5.5px "Press Start 2P", monospace';
      ctx.fillText(label, 22, sy + 18);

      ctx.textAlign = 'right';
      ctx.fillStyle = col;
      ctx.font = 'bold 6.5px "Press Start 2P", monospace';
      ctx.fillText(val, 218, sy + 18);
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '5px "Press Start 2P", monospace';
    ctx.fillText('GANA MONEDAS SUPERANDO NIVELES', 120, 304);
  }

  // 4. SHOP SCREEN
  drawShopScreen(ctx, game) {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 240, 320);
    this.drawTopBar(ctx, 'TIENDA CHEF');

    const coins = this.getCoins();
    const shop = this.getShopState();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 7.5px "Press Start 2P", monospace';
    ctx.fillText(`SALDO: 🪙 ${coins} MONEDAS`, 120, 50);

    this.shopCatalog.forEach((item, idx) => {
      const y = 62 + idx * 56;
      const lvl = shop[item.id] || 0;
      const maxed = lvl >= item.max;
      const cost = maxed ? 0 : item.costs[lvl];

      ctx.fillStyle = '#111827';
      ctx.fillRect(12, y, 216, 48);
      ctx.strokeStyle = maxed ? '#00ff88' : '#334155';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(12, y, 216, 48);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 6.5px "Press Start 2P", monospace';
      ctx.fillText(`${item.icon} ${item.name}`, 18, y + 16);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '5px "Press Start 2P", monospace';
      ctx.fillText(`${item.desc} (${lvl}/${item.max})`, 18, y + 32);

      if (maxed) {
        this.drawButton(ctx, 162, y + 11, 58, 26, 'MAX', '#065f46', '#10b981', '#a7f3d0', 6);
      } else {
        const canBuy = coins >= cost;
        this.drawButton(
          ctx, 162, y + 11, 58, 26, `🪙 ${cost}`,
          canBuy ? '#b45309' : '#334155',
          canBuy ? '#facc15' : '#475569',
          canBuy ? '#ffffff' : '#94a3b8', 6
        );
      }
    });

    if (this.shopFeedbackTimer > 0) {
      this.shopFeedbackTimer--;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#00ff88';
      ctx.font = '6px "Press Start 2P", monospace';
      ctx.fillText(this.shopFeedback, 120, 304);
    }
  }

  // 5. SETTINGS SCREEN
  drawSettingsScreen(ctx, game) {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 240, 320);
    this.drawTopBar(ctx, 'AJUSTES');

    const isMuted = window.soundManager ? window.soundManager.muted : false;
    const devOn = !!game.devMode;

    const rows = [
      { label: 'SONIDO / MÚSICA', value: isMuted ? 'APAGADO 🔇' : 'ACTIVO 🔊', bg: isMuted ? '#7f1d1d' : '#065f46', border: isMuted ? '#ef4444' : '#10b981' },
      { label: 'MODO GRÁFICO', value: 'CLÁSICO 2D', bg: '#1e293b', border: '#38bdf8' },
      { label: 'MODO DESARROLLADOR', value: devOn ? 'ACTIVO 🛠️' : 'NORMAL', bg: devOn ? '#78350f' : '#1e293b', border: '#facc15' },
      { label: 'REINICIAR PROGRESO', value: this.resetConfirmArmed ? '¡CONFIRMAR!' : 'BORRAR', bg: '#7f1d1d', border: '#ef4444' }
    ];

    rows.forEach((r, idx) => {
      const y = 58 + idx * 54;
      ctx.fillStyle = '#111827';
      ctx.fillRect(14, y, 212, 42);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(14, y, 212, 42);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '5.5px "Press Start 2P", monospace';
      ctx.fillText(r.label, 22, y + 25);

      this.drawButton(ctx, 144, y + 8, 76, 26, r.value, r.bg, r.border, '#ffffff', 5.5);
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '5px "Press Start 2P", monospace';
    ctx.fillText('CHEF PANIC MOBILE • AUDIO & GFX', 120, 304);
  }

  // 6. LEADERBOARD SCREEN
  drawLeaderboardScreen(ctx, game) {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 240, 320);
    this.drawTopBar(ctx, 'RANKING TOP');

    const board = this.getLeaderboard();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#38bdf8';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText('MEJORES PUNTUACIONES ARCADE', 120, 52);

    board.slice(0, 6).forEach((entry, idx) => {
      const y = 64 + idx * 36;
      const isTop = idx === 0;
      ctx.fillStyle = isTop ? '#1e1b4b' : '#111827';
      ctx.fillRect(14, y, 212, 30);
      ctx.strokeStyle = isTop ? '#facc15' : '#334155';
      ctx.strokeRect(14, y, 212, 30);

      ctx.textAlign = 'left';
      ctx.fillStyle = isTop ? '#facc15' : '#e2e8f0';
      ctx.font = 'bold 6px "Press Start 2P", monospace';
      ctx.fillText(`#${idx + 1} ${entry.name}`, 20, y + 19);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#00ff88';
      ctx.fillText(`${entry.score} (N${entry.stage})`, 218, y + 19);
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '5.5px "Press Start 2P", monospace';
    ctx.fillText(`TU RÉCORD ACTUAL: ${game.highScore} PTS`, 120, 298);
  }

  // Handle tap/click coordinates (240x320) for all new mobile screens
  handleTap(game, coords) {
    const x = coords.x;
    const y = coords.y;

    if (game.state === 'SPLASH') {
      game.isInitialBoot = false;
      game.state = 'MENU';
      if (window.soundManager) window.soundManager.playBlip();
      return true;
    }

    if (game.state === 'MENU') {
      // Primary: JUGAR -> Level Select (MAP)
      if (x >= 28 && x <= 212 && y >= 176 && y <= 210) {
        if (window.soundManager) window.soundManager.playStep();
        game.openMap(game.getLastPlayedStage());
        return true;
      }
      // 2x2 Sub-screens
      if (x >= 20 && x <= 116 && y >= 220 && y <= 254) {
        if (window.soundManager) window.soundManager.playBlip();
        game.state = 'PROFILE';
        return true;
      }
      if (x >= 124 && x <= 220 && y >= 220 && y <= 254) {
        if (window.soundManager) window.soundManager.playBlip();
        game.state = 'SHOP';
        return true;
      }
      if (x >= 20 && x <= 116 && y >= 262 && y <= 296) {
        if (window.soundManager) window.soundManager.playBlip();
        this.resetConfirmArmed = false;
        game.state = 'SETTINGS';
        return true;
      }
      if (x >= 124 && x <= 220 && y >= 262 && y <= 296) {
        if (window.soundManager) window.soundManager.playBlip();
        game.state = 'LEADERBOARD';
        return true;
      }
      return true;
    }

    // Sub-screens common Back button (◀ VOLVER)
    if (['PROFILE', 'SHOP', 'SETTINGS', 'LEADERBOARD'].includes(game.state)) {
      if (y <= 34 && x <= 75) {
        if (window.soundManager) window.soundManager.playBlip();
        this.resetConfirmArmed = false;
        game.state = 'MENU';
        return true;
      }

      if (game.state === 'SHOP') {
        this.shopCatalog.forEach((item, idx) => {
          const iy = 62 + idx * 56;
          if (x >= 156 && x <= 226 && y >= iy && y <= iy + 48) {
            this.buyUpgrade(item.id);
          }
        });
        return true;
      }

      if (game.state === 'SETTINGS') {
        if (x >= 140 && x <= 224) {
          if (y >= 58 && y <= 100) {
            const soundBtn = document.getElementById('btn-sound');
            if (soundBtn) soundBtn.click();
          } else if (y >= 112 && y <= 154) {
            if (game.showDevToast) game.showDevToast('🕹️ MODO CLÁSICO 2D');
            if (window.soundManager) window.soundManager.playBlip();
          } else if (y >= 166 && y <= 208) {
            const devBtn = document.getElementById('btn-dev');
            if (devBtn) devBtn.click();
          } else if (y >= 220 && y <= 262) {
            if (!this.resetConfirmArmed) {
              this.resetConfirmArmed = true;
              if (window.soundManager) window.soundManager.playBlip();
            } else {
              localStorage.removeItem('burgerpanic_unlocked_level');
              localStorage.removeItem('burgerpanic_level_stars');
              localStorage.removeItem('burgerpanic_level_scores');
              localStorage.removeItem('burgerpanic_last_stage');
              localStorage.removeItem('burgerpanic_shop');
              localStorage.setItem('burgerpanic_coins', '50');
              this.resetConfirmArmed = false;
              game.mapSelectedStage = 1;
              if (window.soundManager) window.soundManager.playDrop();
            }
          }
        }
        return true;
      }

      return true;
    }

    return false;
  }
}

window.mobileScreensManager = new MobileScreensManager();
