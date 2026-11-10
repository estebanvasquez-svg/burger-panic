/**
 * Mobile Touch & Gamepad Controller for Burger Panic Mobile
 * Supports iOS & Android touch gestures, virtual D-pad, swipe, keyboard, and haptics
 */
class ControlsManager {
  constructor() {
    this.input = {
      x: 0,
      y: 0,
      pepper: false,
      get up() { return this.y < 0; },
      get down() { return this.y > 0; },
      get left() { return this.x < 0; },
      get right() { return this.x > 0; }
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

      if (e.code === 'Escape' || e.code === 'KeyO' || e.code === 'Pause') {
        if (this.onPausePress) this.onPausePress();
      }

      if (e.code === 'KeyX' || e.code === 'KeyK' || e.code === 'KeyC') {
        if (this.onJumpPress) this.onJumpPress();
      }

      // Pepper / Pimienta keys: P (Pimienta/Pepper), Spacebar, Z, J
      if (e.code === 'KeyP' || e.code === 'Space' || e.code === 'KeyZ' || e.code === 'KeyJ') {
        if (!this.input.pepper) {
          this.input.pepper = true;
          if (this.onPepperPress) this.onPepperPress();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      keys[e.code] = false;
      if (e.code === 'KeyP' || e.code === 'Space' || e.code === 'KeyZ' || e.code === 'KeyJ') {
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

    const ball = document.getElementById('joystick-ball');

    let prevDirKey = '';
    const handleDpadTouch = (e) => {
      e.preventDefault();
      // Unlock audio
      if (window.soundManager) {
        window.soundManager.init();
        window.soundManager.resume();
      }

      const rect = dpad.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      if (!touch) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      let dx = touch.clientX - centerX;
      let dy = touch.clientY - centerY;

      const lockAngle = window.getPortraitLockAngle ? window.getPortraitLockAngle() : 0;
      if (lockAngle === -90) {
        const tmp = dx;
        dx = -dy;
        dy = tmp;
      } else if (lockAngle === 90) {
        const tmp = dx;
        dx = dy;
        dy = -tmp;
      }

      const dist = Math.hypot(dx, dy);

      if (dist < 10) {
        // Deadzone in the center
        this.input.x = 0;
        this.input.y = 0;
        prevDirKey = '';
        if (ball) ball.style.transform = 'translate(0px, 0px)';
        this.clearDpadActiveStyles();
        return;
      }

      // Tilt the arcade ball-top lever physically in 3D
      if (ball) {
        const tiltX = Math.max(-14, Math.min(14, dx * 0.28));
        const tiltY = Math.max(-14, Math.min(14, dy * 0.28));
        ball.style.transform = `translate(${tiltX}px, ${tiltY}px) scale(0.95)`;
      }

      // Determine dominant direction (Up, Down, Left, Right)
      if (Math.abs(dy) > Math.abs(dx)) {
        this.input.x = 0;
        this.input.y = dy > 0 ? 1 : -1;
      } else {
        this.input.y = 0;
        this.input.x = dx > 0 ? 1 : -1;
      }

      const curDirKey = `${this.input.x},${this.input.y}`;
      if (curDirKey !== prevDirKey) {
        prevDirKey = curDirKey;
        if (window.soundManager?.playArcadeClick) {
          window.soundManager.playArcadeClick();
        }
        this.vibrate(12);
      }

      this.updateDpadActiveStyles();
    };

    const resetDpad = (e) => {
      e.preventDefault();
      this.input.x = 0;
      this.input.y = 0;
      prevDirKey = '';
      if (ball) ball.style.transform = 'translate(0px, 0px)';
      this.clearDpadActiveStyles();
    };

    dpad.addEventListener('touchstart', handleDpadTouch, { passive: false });
    dpad.addEventListener('touchmove', handleDpadTouch, { passive: false });
    dpad.addEventListener('touchend', resetDpad, { passive: false });
    dpad.addEventListener('touchcancel', resetDpad, { passive: false });

    // Desktop Mouse Drag on Arcade Joystick
    let isMouseDraggingDpad = false;
    dpad.addEventListener('mousedown', (e) => {
      isMouseDraggingDpad = true;
      handleDpadTouch(e);
    });
    window.addEventListener('mousemove', (e) => {
      if (isMouseDraggingDpad) {
        handleDpadTouch(e);
      }
    });
    window.addEventListener('mouseup', (e) => {
      if (isMouseDraggingDpad) {
        isMouseDraggingDpad = false;
        resetDpad(e);
      }
    });

    // Jump Button Touch & Click
    if (jumpBtn) {
      const triggerJump = (e) => {
        e.preventDefault();
        if (window.soundManager) {
          window.soundManager.init();
          window.soundManager.resume();
          if (window.soundManager.playArcadeClick) window.soundManager.playArcadeClick();
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

    // Pepper Button Touch & Click
    if (pepperBtn) {
      const triggerPepper = (e) => {
        e.preventDefault();
        if (window.soundManager) {
          window.soundManager.init();
          window.soundManager.resume();
          if (window.soundManager.playArcadeClick) window.soundManager.playArcadeClick();
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
      let dx = curX - startX;
      let dy = curY - startY;

      const lockAngle = window.getPortraitLockAngle ? window.getPortraitLockAngle() : 0;
      if (lockAngle === -90) {
        const tmp = dx;
        dx = -dy;
        dy = tmp;
      } else if (lockAngle === 90) {
        const tmp = dx;
        dx = dy;
        dy = -tmp;
      }

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

// ==========================================================
// STRICT PORTRAIT ORIENTATION LOCK MANAGER
// Keeps the game physically vertical on mobile screens even
// when the user rotates their cell phone sideways!
// ==========================================================
(function initPortraitLockManager() {
  let currentLockAngle = 0; // 0 = normal upright, -90 = counter-rotated CCW, 90 = counter-rotated CW

  function isMobileDevice() {
    if (/Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent || '')) return true;
    if (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches) return true;
    if (navigator.maxTouchPoints && navigator.maxTouchPoints > 1 && Math.min(window.screen.width, window.screen.height) < 960) return true;
    return false;
  }

  function tryNativePortraitLock() {
    if (window.screen && window.screen.orientation && typeof window.screen.orientation.lock === 'function') {
      window.screen.orientation.lock('portrait-primary').catch(() => {});
    }
  }

  function updateOrientationLock() {
    if (!document.body) return;

    const isLandscapeViewport = window.innerWidth > window.innerHeight;
    if (isMobileDevice() && isLandscapeViewport) {
      let rawAngle = 90;
      if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === 'number') {
        rawAngle = window.screen.orientation.angle;
      } else if (typeof window.orientation === 'number') {
        rawAngle = window.orientation;
      }

      if (rawAngle === 270 || rawAngle === -90) {
        currentLockAngle = 90;
        document.body.classList.remove('portrait-lock-ccw');
        document.body.classList.add('portrait-lock-cw');
      } else {
        currentLockAngle = -90;
        document.body.classList.remove('portrait-lock-cw');
        document.body.classList.add('portrait-lock-ccw');
      }
    } else {
      currentLockAngle = 0;
      document.body.classList.remove('portrait-lock-ccw', 'portrait-lock-cw');
    }
  }

  window.getPortraitLockAngle = () => currentLockAngle;
  window.updateOrientationLock = updateOrientationLock;

  window.addEventListener('resize', updateOrientationLock);
  window.addEventListener('orientationchange', () => {
    updateOrientationLock();
    setTimeout(updateOrientationLock, 120);
  });
  if (window.screen && window.screen.orientation) {
    window.screen.orientation.addEventListener('change', updateOrientationLock);
  }
  window.addEventListener('DOMContentLoaded', () => {
    tryNativePortraitLock();
    updateOrientationLock();
  });
  window.addEventListener('touchstart', tryNativePortraitLock, { once: true, passive: true });
})();
