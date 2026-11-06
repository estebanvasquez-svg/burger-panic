/**
 * Mobile Touch & Gamepad Controller for Burger Panic Mobile
 * Supports iOS & Android touch gestures, virtual D-pad, swipe, keyboard, and haptics
 */
class ControlsManager {
  constructor() {
    this.input = {
      x: 0,
      y: 0,
      pepper: false
    };

    this.onPepperPress = null;
    this.onJumpPress = null;
    this.onPausePress = null;

    this.activeTouchId = null;
    this.touchStartX = 0;
    this.touchStartY = 0;

    this.initKeyboard();
    this.initTouchControls();
    this.initCanvasSwipe();
  }

  vibrate(ms = 15) {
    if (window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(ms);
      } catch (e) {}
    }
  }

  // Keyboard controls for PC testing
  initKeyboard() {
    const keys = {};

    window.addEventListener('keydown', (e) => {
      // Unlock audio on first user key
      if (window.soundManager) {
        window.soundManager.init();
        window.soundManager.resume();
      }

      keys[e.code] = true;
      this.updateDirectionFromKeys(keys);

      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (this.onPausePress) this.onPausePress();
      }

      if (e.code === 'KeyX' || e.code === 'KeyK' || e.code === 'KeyC') {
        if (this.onJumpPress) this.onJumpPress();
      }

      if (e.code === 'Space' || e.code === 'KeyZ' || e.code === 'KeyJ') {
        if (!this.input.pepper) {
          this.input.pepper = true;
          if (this.onPepperPress) this.onPepperPress();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      keys[e.code] = false;
      if (e.code === 'Space' || e.code === 'KeyZ' || e.code === 'KeyJ') {
        this.input.pepper = false;
      }
      this.updateDirectionFromKeys(keys);
    });
  }

  updateDirectionFromKeys(keys) {
    let x = 0;
    let y = 0;

    if (keys['ArrowLeft'] || keys['KeyA']) x -= 1;
    if (keys['ArrowRight'] || keys['KeyD']) x += 1;
    if (keys['ArrowUp'] || keys['KeyW']) y -= 1;
    if (keys['ArrowDown'] || keys['KeyS']) y += 1;

    // Prioritize vertical or horizontal (cardinal movement only)
    if (y !== 0) {
      this.input.y = y;
      this.input.x = 0;
    } else {
      this.input.x = x;
      this.input.y = 0;
    }
  }

  // Virtual On-Screen D-Pad & Action Buttons (Touch sliding supported)
  initTouchControls() {
    const dpad = document.getElementById('dpad');
    const pepperBtn = document.getElementById('btn-pepper');
    const jumpBtn = document.getElementById('btn-jump');

    if (!dpad) return;

    const handleDpadTouch = (e) => {
      e.preventDefault();
      // Unlock audio
      if (window.soundManager) {
        window.soundManager.init();
        window.soundManager.resume();
      }

      const rect = dpad.getBoundingClientRect();
      const touch = e.touches[0];
      if (!touch) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = touch.clientX - centerX;
      const dy = touch.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist < 12) {
        // Deadzone in the center
        this.input.x = 0;
        this.input.y = 0;
        this.clearDpadActiveStyles();
        return;
      }

      // Determine dominant direction (Up, Down, Left, Right)
      if (Math.abs(dy) > Math.abs(dx)) {
        this.input.x = 0;
        this.input.y = dy > 0 ? 1 : -1;
      } else {
        this.input.y = 0;
        this.input.x = dx > 0 ? 1 : -1;
      }

      this.vibrate(10);
      this.updateDpadActiveStyles();
    };

    const resetDpad = (e) => {
      e.preventDefault();
      this.input.x = 0;
      this.input.y = 0;
      this.clearDpadActiveStyles();
    };

    dpad.addEventListener('touchstart', handleDpadTouch, { passive: false });
    dpad.addEventListener('touchmove', handleDpadTouch, { passive: false });
    dpad.addEventListener('touchend', resetDpad, { passive: false });
    dpad.addEventListener('touchcancel', resetDpad, { passive: false });

    // Jump Button Touch
    if (jumpBtn) {
      const triggerJump = (e) => {
        e.preventDefault();
        if (window.soundManager) {
          window.soundManager.init();
          window.soundManager.resume();
        }
        this.vibrate(15);
        jumpBtn.classList.add('active');
        if (this.onJumpPress) this.onJumpPress();
      };

      const releaseJump = (e) => {
        e.preventDefault();
        jumpBtn.classList.remove('active');
      };

      jumpBtn.addEventListener('touchstart', triggerJump, { passive: false });
      jumpBtn.addEventListener('touchend', releaseJump, { passive: false });
      jumpBtn.addEventListener('mousedown', triggerJump);
      jumpBtn.addEventListener('mouseup', releaseJump);
    }

    // Pepper Button Touch
    if (pepperBtn) {
      const triggerPepper = (e) => {
        e.preventDefault();
        if (window.soundManager) {
          window.soundManager.init();
          window.soundManager.resume();
        }
        this.vibrate(20);
        pepperBtn.classList.add('active');
        if (this.onPepperPress) this.onPepperPress();
      };

      const releasePepper = (e) => {
        e.preventDefault();
        pepperBtn.classList.remove('active');
      };

      pepperBtn.addEventListener('touchstart', triggerPepper, { passive: false });
      pepperBtn.addEventListener('touchend', releasePepper, { passive: false });
      pepperBtn.addEventListener('mousedown', triggerPepper);
      pepperBtn.addEventListener('mouseup', releasePepper);
    }
  }

  updateDpadActiveStyles() {
    this.clearDpadActiveStyles();
    if (this.input.y < 0) document.getElementById('dpad-up')?.classList.add('active');
    if (this.input.y > 0) document.getElementById('dpad-down')?.classList.add('active');
    if (this.input.x < 0) document.getElementById('dpad-left')?.classList.add('active');
    if (this.input.x > 0) document.getElementById('dpad-right')?.classList.add('active');
  }

  clearDpadActiveStyles() {
    ['dpad-up', 'dpad-down', 'dpad-left', 'dpad-right'].forEach((id) => {
      document.getElementById(id)?.classList.remove('active');
    });
  }

  // Swipe support directly on the game canvas
  initCanvasSwipe() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    let startX = 0;
    let startY = 0;
    let lastTap = 0;

    canvas.addEventListener('touchstart', (e) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        // Double tap on canvas = Pepper toss!
        if (this.onPepperPress) this.onPepperPress();
        this.vibrate(25);
      }
      lastTap = now;

      if (e.touches.length > 0) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 0) return;
      const curX = e.touches[0].clientX;
      const curY = e.touches[0].clientY;
      const dx = curX - startX;
      const dy = curY - startY;

      if (Math.hypot(dx, dy) > 20) {
        if (Math.abs(dy) > Math.abs(dx)) {
          this.input.x = 0;
          this.input.y = dy > 0 ? 1 : -1;
        } else {
          this.input.y = 0;
          this.input.x = dx > 0 ? 1 : -1;
        }
        startX = curX;
        startY = curY;
        this.updateDpadActiveStyles();
      }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      // keep direction or stop
    }, { passive: true });
  }
}

window.ControlsManager = ControlsManager;
