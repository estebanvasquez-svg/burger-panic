/**
 * Retro Arcade Web Audio Synthesizer for Burger Panic Mobile
 * 100% Original Procedural Chiptune & Sound Effects Engine
 */
class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.nextStepTime = 0;
    this.bgmMasterGain = null;
    this.noiseBuffer = null;
    this.currentBgmStage = 1;
    this.distortionCurve = null;
    this.drumBuffers = {};
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.initialized = true;
      this.createNoiseBuffer();
      this.distortionCurve = this.makeDistortionCurve(55);
    } catch (e) {
      console.warn('Web Audio not supported', e);
    }
  }

  createNoiseBuffer() {
    if (!this.ctx) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.1);
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } catch (e) {
      console.warn('Could not create noise buffer', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.bgmPlaying) {
      this.stopBGM();
    }
    return this.muted;
  }

  // Play step blip
  playStep() {
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Play retro jump sound
  playJump() {
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Pepper spray noise burst
  playPepper() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + 0.25);
      filter.Q.value = 3.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch (e) {
      console.warn('Audio playPepper warning:', e);
    }
  }

  // Blowtorch sustained flame roar
  playFlame() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(1400, now + 0.06);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.12);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.20, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } catch (e) {
      console.warn('Audio playFlame warning:', e);
    }
  }

  // Blowtorch pickup & pilot ignition click
  playIgnition() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // 1. Piezo spark click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);

      // 2. Flare ignition whoosh
      this.playFlame();
    } catch (e) {
      console.warn('Audio playIgnition warning:', e);
    }
  }

  // Blowtorch fuel exhausted hiss and valve snap
  playGasEmpty() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High hiss
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2400, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);

      // Valve click
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.09);
      oscGain.gain.setValueAtTime(0.18, now + 0.06);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now + 0.06);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn('Audio playGasEmpty warning:', e);
    }
  }

  // Authentic mechanical arcade microswitch click
  playArcadeClick() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.016);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.016);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.018);
    } catch (e) {}
  }

  // Boss claw attack hydraulic windup & warning charge (telegraph sound)
  playBossTelegraphClaw() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High-pitched electrical warning chirp
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.linearRampToValueAtTime(1250, now + 0.22);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);

      // Hydraulic hiss
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.frequency.linearRampToValueAtTime(1100, now + 0.2);
      filter.Q.value = 2.5;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
    } catch (e) {}
  }

  // Boss furnace flame intake / charge (telegraph sound)
  playBossFlameCharge() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(340, now + 0.32);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {}
  }

  // Ingredient bounce / drop
  playDrop() {
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Burger landing thud
  playLand() {
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Enemy stunned
  playStun() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(300, now + 0.08);
      osc.frequency.linearRampToValueAtTime(700, now + 0.16);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn('Audio playStun warning:', e);
    }
  }

  // Enemy squashed / crushed
  playSquash() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    [260, 390, 520, 650].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + i * 0.04;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.14, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.1);
    });
  }

  // Bonus item pickup
  playBonus() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 554, 659, 880].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + i * 0.05;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.08);
    });
  }

  // Extra Life / 1-UP Fanfare
  playLifeUp() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [330, 392, 659, 523, 587, 784, 1046.5]; // Triumphant ascending arpeggio
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + i * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.22, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.12);
    });
  }

  // Star Earned Chime (Arcade victory chime)
  playStar() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + i * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.16);
    });
  }

  // Player death
  playDie() {
    if (this.muted || !this.ctx) return;
    this.stopBGM();
    const now = this.ctx.currentTime;
    const notes = [400, 380, 360, 340, 320, 300, 260, 220, 180, 140];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + i * 0.07;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.09);
    });
  }

  // Stage clear fanfare
  playClear() {
    if (this.muted || !this.ctx) return;
    this.stopBGM();
    this.stopBGM();
    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 523.25, d: 0.12 }, // C5
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.24 }, // E5
      { f: 783.99, d: 0.18 }, // G5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.18 }, // G5
      { f: 1046.5, d: 0.40 }  // C6
    ];

    let t = now;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + note.d);

      t += note.d + 0.03;
    });
  }

  // =========================================================================
  // DYNAMIC MULTI-STAGE SOUNDTRACK ENGINE (16 RICH, CONTINUOUS SOUNDTRACKS)
  // Stage 3: HEAVY METAL / HARD ROCK (Continuous Wall-of-Sound Overdrive Engine)
  // =========================================================================

  makeDistortionCurve(k = 55) {
    const n_samples = 22050;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  // =========================================================================
  // STAGE 3: HEAVY METAL / HARD ROCK SYNTHESIZER (BOSS KILOBURNER)
  // High-Energy, Zero-Silence, Full-Throttle Rock Engine
  // =========================================================================

  playRockGuitar(chordFreqs, time, dur, isPalmChug = false) {
    if (!this.bgmMasterGain || !this.ctx || !chordFreqs) return;
    try {
      if (!this.distortionCurve) this.distortionCurve = this.makeDistortionCurve(58);
      const shaper = this.ctx.createWaveShaper();
      shaper.curve = this.distortionCurve;
      shaper.oversample = '2x';

      // 4x12 Marshall Stack Cabinet Emulation Filter
      const cabinet = this.ctx.createBiquadFilter();
      cabinet.type = 'lowpass';
      cabinet.frequency.setValueAtTime(isPalmChug ? 2200 : 4200, time);
      cabinet.Q.setValueAtTime(2.2, time);

      const gain = this.ctx.createGain();
      // Loud, powerful rock guitar levels
      const peak = isPalmChug ? 0.16 : 0.24;
      gain.gain.setValueAtTime(peak, time);
      if (isPalmChug) {
        gain.gain.exponentialRampToValueAtTime(0.005, time + Math.min(dur, 0.088));
      } else {
        gain.gain.setValueAtTime(peak * 0.90, time + dur * 0.5);
        gain.gain.exponentialRampToValueAtTime(0.01, time + dur * 0.98);
      }

      shaper.connect(cabinet);
      cabinet.connect(gain);
      gain.connect(this.bgmMasterGain);

      const freqs = Array.isArray(chordFreqs) ? chordFreqs : [chordFreqs];
      freqs.forEach((freq) => {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, time);
        osc2.frequency.setValueAtTime(freq * 1.007, time);

        osc1.connect(shaper);
        osc2.connect(shaper);

        osc1.start(time);
        osc2.start(time);
        const stopT = isPalmChug ? (time + Math.min(dur, 0.095)) : (time + dur);
        osc1.stop(stopT);
        osc2.stop(stopT);
      });
    } catch (e) {}
  }

  playRockSolo(freq, time, dur) {
    if (!this.bgmMasterGain || !this.ctx || !freq) return;
    try {
      if (!this.distortionCurve) this.distortionCurve = this.makeDistortionCurve(65);
      const shaper = this.ctx.createWaveShaper();
      shaper.curve = this.distortionCurve;
      shaper.oversample = '2x';

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(5200, time);
      filter.Q.setValueAtTime(3.4, time);

      // Fast Rock Solo Vibrato LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(6.4, time);
      lfoGain.gain.setValueAtTime(0, time);
      lfoGain.gain.setValueAtTime(freq * 0.026, time + 0.04);
      lfo.connect(lfoGain);

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);
      lfo.start(time + 0.03);
      lfo.stop(time + dur);

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, time);
      osc2.frequency.setValueAtTime(freq * 1.009, time);

      const gain = this.ctx.createGain();
      const peak = 0.20; // Searing rock lead presence
      gain.gain.setValueAtTime(peak, time);
      gain.gain.setValueAtTime(peak * 0.92, time + dur * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.01, time + dur * 0.98);

      osc1.connect(shaper);
      osc2.connect(shaper);
      shaper.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + dur);
      osc2.stop(time + dur);
    } catch (e) {}
  }

  playRockBass(freq, time, dur) {
    if (!this.bgmMasterGain || !this.ctx || !freq) return;
    try {
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      sub.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      sub.frequency.setValueAtTime(freq * 0.5, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, time);
      filter.frequency.exponentialRampToValueAtTime(360, time + dur * 0.85);
      filter.Q.setValueAtTime(2.4, time);

      const peak = 0.24; // Punchy, driving bass
      gain.gain.setValueAtTime(peak, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + dur * 0.96);

      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);

      osc.start(time);
      sub.start(time);
      osc.stop(time + dur);
      sub.stop(time + dur);
    } catch (e) {}
  }

  playRockKick(time) {
    if (!this.bgmMasterGain || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.08);

      gain.gain.setValueAtTime(0.32, time); // Heavy thump
      gain.gain.exponentialRampToValueAtTime(0.005, time + 0.12);

      osc.connect(gain);
      gain.connect(this.bgmMasterGain);
      osc.start(time);
      osc.stop(time + 0.13);
    } catch (e) {}
  }

  playRockSnare(time) {
    if (!this.bgmMasterGain || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(230, time);
      osc.frequency.exponentialRampToValueAtTime(95, time + 0.07);
      oscGain.gain.setValueAtTime(0.20, time);
      oscGain.gain.exponentialRampToValueAtTime(0.005, time + 0.09);
      osc.connect(oscGain);
      oscGain.connect(this.bgmMasterGain);
      osc.start(time);
      osc.stop(time + 0.10);

      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1200, time);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.24, time); // Cracking rock snap
        gain.gain.exponentialRampToValueAtTime(0.005, time + 0.15);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmMasterGain);
        noise.start(time);
        noise.stop(time + 0.16);
      }
    } catch (e) {}
  }

  playRockHiHat(time, accent = false) {
    if (!this.bgmMasterGain || !this.ctx || !this.noiseBuffer) return;
    try {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7500, time);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(accent ? 0.14 : 0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.005, time + (accent ? 0.07 : 0.04));
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);
      noise.start(time);
      noise.stop(time + 0.08);
    } catch (e) {}
  }

  playRockDrums(stepInBar, bar, time) {
    // Crash cymbal on beat 1 of every 4th bar
    if (stepInBar === 0 && bar % 4 === 0) {
      this.play16BitCrash(time);
    }
    // Driving snare on 4 and 12 (beats 2 and 4), plus ghost notes on 15
    if (stepInBar === 4 || stepInBar === 12) {
      this.playRockSnare(time);
    } else if (stepInBar === 15 && (bar % 2 === 1)) {
      this.playRockSnare(time);
    }
    // Driving double-kick pattern: 0, 3, 6, 8, 10, 14
    if (stepInBar === 0 || stepInBar === 3 || stepInBar === 6 || stepInBar === 8 || stepInBar === 10 || stepInBar === 14) {
      this.playRockKick(time);
    }
    // Continuous 16th-note sizzle hi-hat (accent on upbeats)
    this.playRockHiHat(time, stepInBar % 2 === 1);
  }

  // =========================================================================
  // GENERAL 16-BIT MULTI-GENRE INSTRUMENT SUITE (STAGES 1, 2, 4-16)
  // Full-body, high-impact arcade instruments
  // =========================================================================

  play16BitLead(freq, time, dur) {
    if (!this.bgmMasterGain || !this.ctx || !freq) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(freq, time);
      osc2.frequency.setValueAtTime(freq * 1.005, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4200, time);
      filter.frequency.exponentialRampToValueAtTime(1600, time + dur * 0.85);

      if (dur > 0.12) {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(6.0, time);
        lfoGain.gain.setValueAtTime(0, time);
        lfoGain.gain.setValueAtTime(freq * 0.018, time + 0.05);

        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        lfo.start(time + 0.04);
        lfo.stop(time + dur);
      }

      const peakGain = 0.18; // Full rich lead
      gain.gain.setValueAtTime(peakGain, time);
      gain.gain.setValueAtTime(peakGain * 0.90, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.01, time + dur * 0.95);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + dur);
      osc2.stop(time + dur);
    } catch (e) {}
  }

  play16BitBass(freq, time, dur) {
    if (!this.bgmMasterGain || !this.ctx || !freq) return;
    try {
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      sub.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      sub.frequency.setValueAtTime(freq * 0.5, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, time);
      filter.frequency.exponentialRampToValueAtTime(320, time + dur * 0.8);
      filter.Q.setValueAtTime(3.2, time);

      const peakGain = 0.22; // Solid bass foundation
      gain.gain.setValueAtTime(peakGain, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + dur * 0.95);

      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);

      osc.start(time);
      sub.start(time);
      osc.stop(time + dur);
      sub.stop(time + dur);
    } catch (e) {}
  }

  play16BitBrassStabs(chordFreqs, time, dur) {
    if (!this.bgmMasterGain || !this.ctx || !chordFreqs) return;
    try {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, time);
      filter.frequency.exponentialRampToValueAtTime(900, time + dur);
      filter.Q.setValueAtTime(2.0, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.16, time); // Full chord presence
      gain.gain.exponentialRampToValueAtTime(0.01, time + dur);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);

      chordFreqs.forEach((f) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, time);
        osc.connect(filter);
        osc.start(time);
        osc.stop(time + dur);
      });
    } catch (e) {}
  }

  play16BitArp(freq, time, dur) {
    if (!this.bgmMasterGain || !this.ctx || !freq) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.14, time);
      gain.gain.exponentialRampToValueAtTime(0.005, time + dur);
      osc.connect(gain);
      gain.connect(this.bgmMasterGain);
      osc.start(time);
      osc.stop(time + dur);
    } catch (e) {}
  }

  playBellPluck(freq, time, dur) {
    if (!this.bgmMasterGain || !this.ctx || !freq) return;
    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, time);
      osc2.frequency.setValueAtTime(freq * 2.76, time);

      gain.gain.setValueAtTime(0.16, time);
      gain.gain.exponentialRampToValueAtTime(0.005, time + dur);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.bgmMasterGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + dur);
      osc2.stop(time + dur);
    } catch (e) {}
  }

  playFluteTone(freq, time, dur) {
    if (!this.bgmMasterGain || !this.ctx || !freq) return;
    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, time);

      gain.gain.setValueAtTime(0.04, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.01, time + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);

      osc.start(time);
      osc.stop(time + dur);
    } catch (e) {}
  }

  play16BitKick(time) {
    if (!this.bgmMasterGain || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, time);
      osc.frequency.exponentialRampToValueAtTime(45, time + 0.08);
      gain.gain.setValueAtTime(0.30, time); // Punchy kick
      gain.gain.exponentialRampToValueAtTime(0.005, time + 0.12);
      osc.connect(gain);
      gain.connect(this.bgmMasterGain);
      osc.start(time);
      osc.stop(time + 0.13);
    } catch (e) {}
  }

  play16BitSnare(time) {
    if (!this.bgmMasterGain || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.06);
      oscGain.gain.setValueAtTime(0.18, time);
      oscGain.gain.exponentialRampToValueAtTime(0.005, time + 0.08);
      osc.connect(oscGain);
      oscGain.connect(this.bgmMasterGain);
      osc.start(time);
      osc.stop(time + 0.09);

      if (this.noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1600, time);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.20, time); // Snappy snare
        gain.gain.exponentialRampToValueAtTime(0.005, time + 0.12);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmMasterGain);
        noise.start(time);
        noise.stop(time + 0.13);
      }
    } catch (e) {}
  }

  play16BitHiHat(time, accent = false) {
    if (!this.bgmMasterGain || !this.ctx || !this.noiseBuffer) return;
    try {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(8000, time);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(accent ? 0.10 : 0.06, time);
      gain.gain.exponentialRampToValueAtTime(0.005, time + (accent ? 0.06 : 0.035));
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);
      noise.start(time);
      noise.stop(time + 0.07);
    } catch (e) {}
  }

  play16BitCrash(time) {
    if (!this.bgmMasterGain || !this.ctx || !this.noiseBuffer) return;
    try {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(5000, time);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.26, time);
      gain.gain.exponentialRampToValueAtTime(0.005, time + 0.45);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);
      noise.start(time);
      noise.stop(time + 0.48);
    } catch (e) {}
  }

  // =========================================================================
  // SCHEDULER IMPLEMENTATIONS PER STAGE (ZERO SILENCES, CONTINUOUS GROOVE)
  // =========================================================================

  // STAGE 3: HEAVY METAL ROCK (Boss Kiloburner)
  scheduleRockBossStep(step, time, stepDur) {
    const totalSteps = 256; // 16 bars @ 16 steps = 256 steps
    const stepInPattern = step % totalSteps;
    const bar = Math.floor(stepInPattern / 16);
    const stepInBar = stepInPattern % 16;

    // 1. Rock Drums on every step
    this.playRockDrums(stepInBar, bar, time);

    // Power Chords:
    const E5 = [82.41, 123.47, 164.81];
    const G5 = [98.0, 146.83, 196.0];
    const A5 = [110.0, 164.81, 220.0];
    const C5 = [130.81, 196.0, 261.63];
    const D5 = [146.83, 220.0, 293.66];
    const Bb5 = [116.54, 174.61, 233.08];

    // 2. Rhythm Guitar Wall-of-Sound (EVERY single step plays - NO SILENCE)
    let chordToPlay = null;
    let isChug = false;

    if (bar < 4 || (bar >= 8 && bar < 12)) {
      // Verse / Riff Section: Heavy E-minor power chords + continuous driving chugs
      if (stepInBar === 0 || stepInBar === 6) {
        chordToPlay = E5;
      } else if (stepInBar === 8) {
        chordToPlay = G5;
      } else if (stepInBar === 11) {
        chordToPlay = A5;
      } else if (stepInBar === 14) {
        chordToPlay = (bar % 2 === 1) ? D5 : Bb5;
      } else {
        // Relentless 16th-note palm-muted chug
        chordToPlay = [82.41, 123.47];
        isChug = true;
      }
    } else if (bar >= 4 && bar < 8) {
      // Chorus / Driving Chord Changes
      const barChord = [C5, D5, E5, E5][bar - 4];
      if (stepInBar === 0 || stepInBar === 6 || stepInBar === 10) {
        chordToPlay = barChord;
      } else {
        chordToPlay = barChord.slice(0, 2);
        isChug = true;
      }
    } else {
      // Climax Solo 2 Section (Bars 12-15): Hyper-speed riffing
      if (stepInBar === 0) chordToPlay = E5;
      else if (stepInBar === 4) chordToPlay = G5;
      else if (stepInBar === 8) chordToPlay = A5;
      else if (stepInBar === 12) chordToPlay = C5;
      else {
        chordToPlay = [82.41, 123.47];
        isChug = true;
      }
    }

    this.playRockGuitar(chordToPlay, time, isChug ? stepDur * 0.95 : stepDur * 2.5, isChug);

    // 3. Continuous 16th-note Distorted Galloping Bass (Plays on EVERY step!)
    const bassRoot = (bar < 4 || (bar >= 8 && bar < 12))
      ? 41.2
      : (bar < 8 ? [65.41, 73.42, 41.2, 41.2][bar - 4] : [41.2, 49.0, 55.0, 65.41][bar - 12]);
    // Octave gallop pattern on 16th notes
    const bassOctave = (stepInBar % 4 === 2) ? 2 : 1;
    this.playRockBass(bassRoot * bassOctave, time, stepDur * 0.98);

    // 4. Screaming Lead Guitar Solo & Riff Melody (Plays throughout battle!)
    const soloMelody = [
      // Bars 0-3: Heavy Rock Main Riff Hook
      329.63, 0, 329.63, 392.0, 0, 440.0, 0, 466.16, 440.0, 0, 392.0, 0, 329.63, 0, 293.66, 329.63,
      329.63, 0, 329.63, 392.0, 0, 440.0, 0, 587.33, 0, 493.88, 0, 440.0, 392.0, 0, 440.0, 0,
      329.63, 0, 329.63, 392.0, 0, 440.0, 0, 466.16, 440.0, 0, 392.0, 0, 329.63, 0, 293.66, 329.63,
      659.25, 0, 587.33, 0, 493.88, 0, 440.0, 0, 392.0, 440.0, 466.16, 440.0, 392.0, 0, 329.63, 0,

      // Bars 4-7: Searing High Solo 1
      659.25, 659.25, 783.99, 0, 880.0, 880.0, 783.99, 659.25, 0, 587.33, 587.33, 493.88, 0, 587.33, 659.25, 0,
      880.0, 0, 783.99, 880.0, 987.77, 0, 880.0, 783.99, 659.25, 0, 587.33, 493.88, 587.33, 659.25, 783.99, 0,
      1046.5, 0, 987.77, 0, 880.0, 0, 783.99, 0, 659.25, 0, 587.33, 0, 659.25, 783.99, 880.0, 0,
      987.77, 0, 880.0, 0, 783.99, 0, 659.25, 0, 587.33, 493.88, 440.0, 392.0, 440.0, 493.88, 587.33, 659.25,

      // Bars 8-11: Heavy Groove Metal Breakdown
      329.63, 329.63, 0, 329.63, 392.0, 0, 440.0, 0, 493.88, 0, 440.0, 392.0, 329.63, 0, 0, 0,
      329.63, 329.63, 0, 329.63, 392.0, 0, 587.33, 0, 523.25, 0, 440.0, 392.0, 440.0, 0, 0, 0,
      329.63, 329.63, 0, 329.63, 392.0, 0, 440.0, 0, 493.88, 0, 440.0, 392.0, 329.63, 0, 0, 0,
      783.99, 0, 659.25, 0, 587.33, 0, 493.88, 0, 440.0, 392.0, 329.63, 293.66, 329.63, 0, 0, 0,

      // Bars 12-15: Shred Climax
      659.25, 783.99, 880.0, 987.77, 1046.5, 987.77, 880.0, 783.99, 880.0, 987.77, 1046.5, 1174.66, 1318.51, 0, 0, 0,
      1318.51, 0, 1174.66, 0, 1046.5, 0, 987.77, 0, 880.0, 0, 783.99, 0, 659.25, 0, 587.33, 659.25,
      880.0, 0, 783.99, 0, 659.25, 0, 587.33, 0, 493.88, 0, 440.0, 0, 493.88, 587.33, 659.25, 783.99,
      880.0, 0, 783.99, 0, 659.25, 0, 587.33, 0, 493.88, 440.0, 392.0, 329.63, 329.63, 329.63, 329.63, 0
    ];
    const note = soloMelody[stepInPattern];
    if (note && note > 0) {
      this.playRockSolo(note, time, stepDur * 2.2);
    }
  }

  // STAGE 1: LA COCINA CLÁSICA (Bouncy Arcade Chiptune - Continuous 4-Layer Sound)
  scheduleStage1Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    const bar = Math.floor(s / 16);

    // 1. Continuous Drums
    if (bStep === 0 || bStep === 8 || bStep === 14) this.play16BitKick(time);
    if (bStep === 4 || bStep === 12) this.play16BitSnare(time);
    this.play16BitHiHat(time, bStep % 2 === 1);
    if (s === 0) this.play16BitCrash(time);

    // 2. Continuous 16-bit Fast Arpeggio (Fills every step)
    const chords = [
      [261.63, 329.63, 392.0, 523.25], // C
      [220.0, 261.63, 329.63, 440.0],  // Am
      [174.61, 220.0, 261.63, 349.23], // F
      [196.0, 246.94, 293.66, 392.0]   // G
    ];
    const currChord = chords[bar];
    this.play16BitArp(currChord[bStep % 4], time, stepDur * 0.95);

    // 3. Continuous Driving Walking Bass (Every 8th note)
    const bassLines = [
      [130.81, 164.81, 196.0, 164.81, 130.81, 164.81, 196.0, 220.0],
      [110.0, 130.81, 164.81, 130.81, 110.0, 130.81, 164.81, 196.0],
      [87.31, 110.0, 130.81, 110.0, 87.31, 110.0, 130.81, 146.83],
      [98.0, 123.47, 146.83, 123.47, 98.0, 123.47, 146.83, 164.81]
    ];
    if (bStep % 2 === 0) {
      const bIdx = Math.floor(bStep / 2);
      this.play16BitBass(bassLines[bar][bIdx], time, stepDur * 1.9);
    }

    // 4. Catchy Lead Melody (Sustained notes & phrasing)
    const melody = [
      523.25, 523.25, 659.25, 0, 783.99, 783.99, 659.25, 0, 523.25, 587.33, 659.25, 698.46, 783.99, 0, 1046.5, 0,
      880.0, 880.0, 698.46, 0, 783.99, 783.99, 659.25, 0, 587.33, 659.25, 587.33, 523.25, 587.33, 0, 783.99, 0,
      523.25, 523.25, 659.25, 0, 783.99, 783.99, 880.0, 0, 1046.5, 1046.5, 987.77, 880.0, 783.99, 0, 659.25, 0,
      698.46, 698.46, 659.25, 0, 587.33, 659.25, 523.25, 0, 440.0, 493.88, 523.25, 587.33, 523.25, 0, 0, 0
    ];
    if (melody[s] && melody[s] > 0) {
      this.play16BitLead(melody[s], time, stepDur * 2.1);
    }
  }

  // STAGE 2: LA DESPENSA DE ESPECIAS (Spicy Salsa Montuno - Full Latin Ensemble)
  scheduleStage2Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    const bar = Math.floor(s / 16);

    // 1. Continuous Latin Percussion (Clave + Timbale + Shaker)
    if (bStep === 0 || bStep === 8 || bStep === 14) this.play16BitKick(time);
    if (bStep === 4 || bStep === 10 || bStep === 12) this.play16BitSnare(time);
    this.play16BitHiHat(time, bStep % 2 === 1);

    // 2. Montuno Piano & Brass Stabs (Dm, Gm, A7)
    const chords = [
      [293.66, 349.23, 440.0],
      [293.66, 349.23, 440.0],
      [392.0, 466.16, 587.33],
      [440.0, 554.37, 659.25]
    ];
    const currChord = chords[bar];
    if (bStep === 0 || bStep === 3 || bStep === 6 || bStep === 8 || bStep === 11 || bStep === 14) {
      this.play16BitBrassStabs(currChord, time, stepDur * 1.8);
    }

    // 3. Continuous Tumbao Bassline (Syncopated Afro-Cuban drive)
    const roots = [73.42, 73.42, 98.0, 110.0];
    const r = roots[bar];
    if (bStep === 0 || bStep === 6 || bStep === 8 || bStep === 14) {
      this.play16BitBass(r * (bStep === 6 ? 2 : 1), time, stepDur * 2.8);
    }

    // 4. Trumpet Solo Lead
    const trumpet = [
      587.33, 0, 587.33, 698.46, 0, 783.99, 698.46, 587.33, 0, 523.25, 587.33, 0, 440.0, 0, 523.25, 0,
      587.33, 0, 587.33, 698.46, 0, 783.99, 880.0, 0, 783.99, 698.46, 587.33, 0, 554.37, 0, 587.33, 0,
      698.46, 0, 698.46, 783.99, 0, 880.0, 783.99, 698.46, 0, 587.33, 698.46, 0, 523.25, 0, 587.33, 0,
      880.0, 0, 783.99, 698.46, 587.33, 0, 554.37, 0, 440.0, 0, 493.88, 554.37, 587.33, 0, 0, 0
    ];
    if (trumpet[s] && trumpet[s] > 0) {
      this.play16BitLead(trumpet[s], time, stepDur * 2.2);
    }
  }

  // STAGE 4: EL GRAN BISTRÓ GOURMET (French Swing & Ragtime)
  scheduleStage4Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    const bar = Math.floor(s / 16);

    // Swing Drums
    if (bStep === 0 || bStep === 8) this.play16BitKick(time);
    if (bStep === 4 || bStep === 12) this.play16BitSnare(time);
    this.play16BitHiHat(time, bStep % 2 === 1);

    // Stride Piano Chords on Beats 2 & 4
    if (bStep === 4 || bStep === 12) {
      this.play16BitBrassStabs([349.23, 440.0, 523.25], time, stepDur * 2.4);
    }

    // Continuous Walking Bass on EVERY Quarter Note (steps 0, 4, 8, 12)
    const walk = [87.31, 110.0, 130.81, 146.83, 174.61, 146.83, 130.81, 110.0];
    if (bStep % 4 === 0) {
      const idx = (bar * 4 + Math.floor(bStep / 4)) % walk.length;
      this.play16BitBass(walk[idx], time, stepDur * 3.6);
    }

    // Clarinet Lead Melody
    const bistroMelody = [
      523.25, 0, 587.33, 659.25, 0, 698.46, 0, 783.99, 0, 698.46, 659.25, 587.33, 523.25, 0, 587.33, 0,
      659.25, 0, 698.46, 783.99, 0, 880.0, 0, 1046.5, 0, 880.0, 783.99, 698.46, 659.25, 0, 587.33, 0,
      523.25, 0, 587.33, 659.25, 0, 698.46, 0, 783.99, 0, 880.0, 783.99, 698.46, 659.25, 0, 587.33, 0,
      523.25, 0, 440.0, 493.88, 523.25, 0, 587.33, 0, 659.25, 0, 587.33, 0, 523.25, 0, 0, 0
    ];
    if (bistroMelody[s] && bistroMelody[s] > 0) {
      this.playFluteTone(bistroMelody[s], time, stepDur * 2.2);
    }
  }

  // STAGE 5: LA MARISQUERÍA DEL PULPO (60s California Surf Rock)
  scheduleStage5Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    // Fast Surf Drums
    if (bStep % 4 === 0 || bStep === 10) this.play16BitKick(time);
    if (bStep === 4 || bStep === 12) this.play16BitSnare(time);
    this.play16BitHiHat(time, true);

    // Continuous Surf Bass
    const surfBass = [55.0, 55.0, 65.41, 73.42, 82.41, 73.42, 65.41, 55.0];
    if (bStep % 2 === 0) {
      this.play16BitBass(surfBass[Math.floor(bStep / 2)], time, stepDur * 1.8);
    }

    // Fast Surf Tremolo Guitar Lead
    const surfRiff = [
      440.0, 440.0, 493.88, 523.25, 587.33, 587.33, 659.25, 698.46,
      783.99, 698.46, 659.25, 587.33, 523.25, 493.88, 440.0, 415.3
    ];
    this.play16BitLead(surfRiff[bStep], time, stepDur * 0.95);
  }

  // STAGE 6: LA ESTACIÓN DE CAFÉ & BARISTA (Smooth Bebop / Lo-Fi Coffee Jazz)
  scheduleStage6Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    const bar = Math.floor(s / 16);
    // Relaxed Hip-Hop / Jazz Drums
    if (bStep === 0 || bStep === 10) this.play16BitKick(time);
    if (bStep === 4 || bStep === 12) this.play16BitSnare(time);
    this.play16BitHiHat(time, bStep % 2 === 0);

    // Lush 7th Chords
    if (bStep === 0 || bStep === 8) {
      const chords = [
        [233.08, 293.66, 349.23, 440.0],
        [196.0, 246.94, 293.66, 369.99],
        [220.0, 261.63, 329.63, 392.0],
        [174.61, 220.0, 261.63, 329.63]
      ];
      this.play16BitBrassStabs(chords[bar], time, stepDur * 4.0);
    }

    // Upright Acoustic Bass on every 8th note
    const coffeeBass = [58.27, 87.31, 116.54, 87.31, 49.0, 73.42, 98.0, 73.42];
    if (bStep % 2 === 0) {
      this.play16BitBass(coffeeBass[Math.floor(bStep / 2)], time, stepDur * 1.9);
    }

    // Mellow Vibraphone Plucks
    const vibe = [0, 466.16, 523.25, 0, 587.33, 0, 698.46, 0, 587.33, 0, 523.25, 466.16, 523.25, 0, 0, 0];
    if (vibe[bStep]) this.playBellPluck(vibe[bStep], time, stepDur * 2.5);
  }

  // STAGE 7: LA PASTELERÍA FELINA (Kawaii Chiptune Pop)
  scheduleStage7Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    // Electro Pop Beat
    if (bStep % 4 === 0) this.play16BitKick(time);
    if (bStep === 4 || bStep === 12) this.play16BitSnare(time);
    this.play16BitHiHat(time, true);

    // Sparkle Bell Arpeggio
    const arpNotes = [392.0, 493.88, 587.33, 783.99];
    this.play16BitArp(arpNotes[bStep % 4], time, stepDur * 0.95);

    // Bubblegum Bass on every 8th note
    if (bStep % 2 === 0) this.play16BitBass(98.0 * ((bStep % 4 === 2) ? 1.5 : 1), time, stepDur * 1.8);

    // Bright Sparkle Lead
    const kawaii = [783.99, 0, 880.0, 0, 987.77, 0, 1046.5, 0, 987.77, 880.0, 783.99, 0, 659.25, 0, 783.99, 0];
    if (kawaii[bStep]) this.play16BitLead(kawaii[bStep], time, stepDur * 2.0);
  }

  // STAGE 8: EL ASADOR DEL CASTILLO (Medieval Battle March)
  scheduleStage8Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    // Battle Snare Cadence & Kettle Drums
    if (bStep % 4 === 0 || bStep === 14) this.play16BitKick(time);
    if (bStep === 4 || bStep === 10 || bStep === 12 || bStep === 14) this.play16BitSnare(time);
    this.play16BitHiHat(time, bStep % 2 === 0);

    // Fortress Deep Bass on every quarter note
    if (bStep % 4 === 0) this.play16BitBass(73.42, time, stepDur * 3.8);

    // Heraldic Dorian Horn Fanfare
    const fanfare = [587.33, 0, 587.33, 0, 880.0, 0, 783.99, 0, 698.46, 0, 659.25, 0, 587.33, 0, 0, 0];
    if (fanfare[bStep]) this.play16BitBrassStabs([fanfare[bStep], fanfare[bStep] * 1.5], time, stepDur * 2.2);
  }

  // STAGE 9: LA FORJA DEL DRAGÓN (Industrial Heavy Metal)
  scheduleStage9Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    // Industrial Kick & Snare
    if (bStep % 4 === 0) this.play16BitKick(time);
    if (bStep === 4 || bStep === 12) this.playRockSnare(time);
    this.play16BitHiHat(time, true);

    // Metallic Anvil Strike
    if (bStep === 8 || bStep === 14) this.playBellPluck(1800, time, stepDur * 0.8);

    // Continuous Sawtooth Industrial Bassline (Plays on every step!)
    const indBass = [46.25, 46.25, 92.5, 46.25, 55.0, 46.25, 92.5, 46.25];
    this.playRockBass(indBass[Math.floor(bStep / 2) % indBass.length], time, stepDur * 0.98);

    // Cyber Synth Lead
    const forgeLead = [740.0, 0, 740.0, 880.0, 0, 987.77, 0, 1108.73, 0, 987.77, 0, 880.0, 740.0, 0, 0, 0];
    if (forgeLead[bStep]) this.play16BitLead(forgeLead[bStep], time, stepDur * 2.0);
  }

  // STAGE 10: LA COCINA DE ALTA MAR (Pirate Sea Shanty Jig)
  scheduleStage10Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    // 6/8 Maritime Stomp & Clap
    if (bStep === 0 || bStep === 6) this.play16BitKick(time);
    if (bStep === 3 || bStep === 9) this.play16BitSnare(time);
    this.play16BitHiHat(time, bStep % 3 === 0);

    // Nautical Oom-Pah Bass on beats 1 and 4
    if (bStep === 0 || bStep === 6) this.play16BitBass(82.41, time, stepDur * 2.8);

    // Accordion Sea Shanty Lead
    const shanty = [329.63, 392.0, 440.0, 493.88, 0, 493.88, 587.33, 493.88, 440.0, 392.0, 0, 329.63, 392.0, 440.0, 329.63, 0];
    if (shanty[bStep]) this.playFluteTone(shanty[bStep], time, stepDur * 1.8);
  }

  // STAGE 11: LA HELADERÍA BAJO CERO (Subzero Crystalline Synthwave)
  scheduleStage11Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    // Ambient digital percussion
    if (bStep === 0 || bStep === 8) this.play16BitKick(time);
    if (bStep === 4 || bStep === 12) this.play16BitSnare(time);
    this.play16BitHiHat(time, bStep % 2 === 0);

    // Continuous Sub Drone / Bass
    if (bStep % 4 === 0) this.play16BitBass(61.74, time, stepDur * 3.8);

    // Ice Crystal Bell Plucks
    const ice = [987.77, 0, 1174.66, 0, 1318.51, 0, 1479.98, 0, 1318.51, 0, 1174.66, 0, 987.77, 0, 880.0, 0];
    if (ice[bStep]) this.playBellPluck(ice[bStep], time, stepDur * 2.8);
  }

  // STAGE 12: LA PANADERÍA CRUJIENTE (Viennese Baker Waltz 3/4)
  scheduleStage12Step(step, time, stepDur) {
    const s = step % 48; // 3/4 time
    const bStep = s % 12;
    // 3/4 Waltz Drums
    if (bStep === 0) this.play16BitKick(time);
    if (bStep === 4 || bStep === 8) this.play16BitHiHat(time, true);

    // Downbeat Bass on 1
    if (bStep === 0) this.play16BitBass(77.78, time, stepDur * 3.8);

    // Accordion pads on beats 2 & 3
    if (bStep === 4 || bStep === 8) {
      this.play16BitBrassStabs([311.13, 392.0, 466.16], time, stepDur * 2.6);
    }

    // Whimsical Flute Waltz
    const waltzLead = [622.25, 0, 0, 0, 698.46, 0, 0, 0, 783.99, 0, 622.25, 0];
    if (waltzLead[bStep]) this.playFluteTone(waltzLead[bStep], time, stepDur * 3.2);
  }

  // STAGE 13: EL WOK DEL PANDA DORADO (Kung-Fu Pentatonic Trap)
  scheduleStage13Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    // Trap Drums
    if (bStep === 0 || bStep === 7) this.play16BitKick(time);
    if (bStep === 4 || bStep === 12) this.play16BitSnare(time);
    this.play16BitHiHat(time, true);

    // Booming 808 Sub Glide
    if (bStep === 0 || bStep === 7) this.play16BitBass(32.7, time, stepDur * 4.5);

    // Pentatonic Flute Melody
    const kungfu = [523.25, 0, 622.25, 0, 698.46, 0, 783.99, 0, 932.33, 783.99, 698.46, 0, 622.25, 0, 523.25, 0];
    if (kungfu[bStep]) this.playFluteTone(kungfu[bStep], time, stepDur * 2.0);
  }

  // STAGE 14: COSMIC DINER 3000 (Cyberpunk Synthwave)
  scheduleStage14Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    // Electro 80s Drums
    if (bStep === 0 || bStep === 8) this.play16BitKick(time);
    if (bStep === 4 || bStep === 12) this.play16BitSnare(time);
    this.play16BitHiHat(time, bStep % 2 === 1);

    // Galloping 16th Synthwave Bassline (Continuous on EVERY step!)
    const synthBass = [73.42, 146.83, 73.42, 146.83];
    this.play16BitBass(synthBass[bStep % 4], time, stepDur * 0.98);

    // Dual Saw Lead
    const synthLead = [587.33, 0, 659.25, 0, 698.46, 0, 880.0, 0, 783.99, 0, 659.25, 587.33, 659.25, 0, 0, 0];
    if (synthLead[bStep]) this.play16BitLead(synthLead[bStep], time, stepDur * 2.2);
  }

  // STAGE 15: COSTILLAS JURÁSICAS & VOLCÁN (Prehistoric Tribal War Stomp)
  scheduleStage15Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    // Heavy Primal Toms
    if (bStep === 0 || bStep === 3 || bStep === 6 || bStep === 10) this.play16BitKick(time);
    if (bStep === 8 || bStep === 14) this.play16BitSnare(time);
    this.play16BitHiHat(time, bStep % 2 === 0);

    // Lava Rumble Sub Bass on every 8th note
    if (bStep % 2 === 0) this.play16BitBass(55.0, time, stepDur * 1.9);

    // Primitive Bone Flute
    const tribal = [440.0, 0, 466.16, 0, 523.25, 0, 466.16, 440.0, 392.0, 0, 440.0, 0, 493.88, 0, 0, 0];
    if (tribal[bStep]) this.playFluteTone(tribal[bStep], time, stepDur * 2.2);
  }

  // STAGE 16: EL BANQUETE IMPERIAL (Grand Royal Fanfare Finale)
  scheduleStage16Step(step, time, stepDur) {
    const s = step % 64;
    const bStep = s % 16;
    const bar = Math.floor(s / 16);
    // Grand Orchestral Snare & Timpani
    if (bStep === 0 || bStep === 8) this.play16BitKick(time);
    if (bStep === 4 || bStep === 12 || bStep === 14 || bStep === 15) this.play16BitSnare(time);
    if (s === 0) this.play16BitCrash(time);
    this.play16BitHiHat(time, bStep % 2 === 1);

    // Regal Counterpoint Bass on every quarter note
    if (bStep % 4 === 0) this.play16BitBass(130.81, time, stepDur * 3.8);

    // Majestic Brass Fanfare Chords
    const fanfares = [
      [523.25, 659.25, 783.99, 1046.5],
      [587.33, 698.46, 880.0, 1174.66],
      [659.25, 783.99, 987.77, 1318.51],
      [783.99, 987.77, 1174.66, 1567.98]
    ];
    if (bStep === 0 || bStep === 6) {
      this.play16BitBrassStabs(fanfares[bar], time, stepDur * 3.5);
    }
  }

  // Master Step Scheduler dispatching to appropriate track
  scheduleStageStep(stageNum, step, time, stepDur) {
    switch (stageNum) {
      case 1:  return this.scheduleStage1Step(step, time, stepDur);
      case 2:  return this.scheduleStage2Step(step, time, stepDur);
      case 3:  return this.scheduleRockBossStep(step, time, stepDur); // KILOBURNER BOSS HEAVY METAL!
      case 4:  return this.scheduleStage4Step(step, time, stepDur);
      case 5:  return this.scheduleStage5Step(step, time, stepDur);
      case 6:  return this.scheduleStage6Step(step, time, stepDur);
      case 7:  return this.scheduleStage7Step(step, time, stepDur);
      case 8:  return this.scheduleStage8Step(step, time, stepDur);
      case 9:  return this.scheduleStage9Step(step, time, stepDur);
      case 10: return this.scheduleStage10Step(step, time, stepDur);
      case 11: return this.scheduleStage11Step(step, time, stepDur);
      case 12: return this.scheduleStage12Step(step, time, stepDur);
      case 13: return this.scheduleStage13Step(step, time, stepDur);
      case 14: return this.scheduleStage14Step(step, time, stepDur);
      case 15: return this.scheduleStage15Step(step, time, stepDur);
      case 16: return this.scheduleStage16Step(step, time, stepDur);
      default: return this.scheduleStage1Step(step, time, stepDur);
    }
  }

  // =========================================================================
  // BGM LIFECYCLE MANAGEMENT
  // =========================================================================

  startBGM(stageNumber = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.stopBGM();
    this.bgmPlaying = true;
    this.bgmStep = 0;
    this.nextStepTime = this.ctx.currentTime + 0.05;
    this.currentBgmStage = Number(stageNumber) || 1;

    this.bgmMasterGain = this.ctx.createGain();
    // Loud, punchy arcade master levels (0.75 for Boss Rock, 0.68 for other stages)
    this.bgmMasterGain.gain.setValueAtTime(this.currentBgmStage === 3 ? 0.75 : 0.68, this.ctx.currentTime);
    this.bgmMasterGain.connect(this.ctx.destination);

    // Tempo definition per stage
    const STAGE_TEMPOS = {
      1: 154,  // Kitchen Arcade Chiptune
      2: 132,  // Latin Salsa Montuno
      3: 172,  // KILOBURNER BOSS HEAVY METAL / HARD ROCK
      4: 140,  // French Bistro Swing
      5: 160,  // Surf Rock
      6: 114,  // Barista Bebop Lo-Fi
      7: 166,  // Kawaii Chiptune Pop
      8: 134,  // Medieval Castle March
      9: 146,  // Dragon Forge Industrial Metal
      10: 138, // Pirate Sea Shanty
      11: 124, // Subzero Ice Synthwave
      12: 144, // Baker Waltz 3/4
      13: 130, // Kung-Fu Pentatonic Trap
      14: 128, // Cyberpunk Synthwave
      15: 120, // Jurassic Volcano Tribal
      16: 142  // Imperial Banquet Royal Fanfare
    };

    const bpm = STAGE_TEMPOS[this.currentBgmStage] || 150;
    const stepDuration = 60 / (bpm * 4); // 16th-note duration

    const scheduler = () => {
      if (!this.bgmPlaying || this.muted || !this.ctx) return;
      // Resynchronize immediately if time fell behind (e.g. tab switch or phone resume)
      if (this.nextStepTime < this.ctx.currentTime) {
        this.nextStepTime = this.ctx.currentTime + 0.02;
      }
      while (this.nextStepTime < this.ctx.currentTime + 0.16) {
        this.scheduleStageStep(this.currentBgmStage, this.bgmStep, this.nextStepTime, stepDuration);
        this.nextStepTime += stepDuration;
        this.bgmStep = (this.bgmStep + 1) % 512;
      }
    };

    scheduler();
    this.bgmTimer = setInterval(scheduler, 32);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.bgmMasterGain && this.ctx) {
      try {
        this.bgmMasterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.bgmMasterGain.disconnect();
      } catch (e) {}
      this.bgmMasterGain = null;
    }
  }
}

window.soundManager = new SoundManager();

// Global unlock listener ensuring audio starts on first user touch anywhere
const unlockAudioOnUserAction = () => {
  if (window.soundManager) {
    window.soundManager.init();
    window.soundManager.resume();
  }
};
['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'].forEach(evt => {
  window.addEventListener(evt, unlockAudioOnUserAction, { passive: true });
});
