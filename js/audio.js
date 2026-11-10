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
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.initialized = true;
      this.createNoiseBuffer();
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
  // 16-BIT SEGA GENESIS / SNES RETRO ARCADE SPRINT & RUNNING THEME ENGINE
  // "Turbo Sprint: High-Velocity Kitchen Dash" (~166 BPM, 512 Steps, 32 Bars)
  // =========================================================================

  play16BitLead(freq, time, dur) {
    if (!this.bgmMasterGain || !this.ctx || !freq) return;
    try {
      // Dual-oscillator 16-bit chorused square + pulse lead (YM2612 style)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(freq, time);
      // Subtle +4 cents detune for lush 16-bit stereo chorus
      osc2.frequency.setValueAtTime(freq * 1.004, time);

      // Lowpass filter envelope for bright arcade attack
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3600, time);
      filter.frequency.exponentialRampToValueAtTime(1400, time + dur * 0.85);

      // LFO vibrato on held notes (> 120ms)
      if (dur > 0.12) {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(6.0, time);
        lfoGain.gain.setValueAtTime(0, time);
        lfoGain.gain.setValueAtTime(freq * 0.016, time + 0.06);

        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        lfo.start(time + 0.05);
        lfo.stop(time + dur);
      }

      const peakGain = 0.050;
      gain.gain.setValueAtTime(peakGain, time);
      gain.gain.setValueAtTime(peakGain * 0.90, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.002, time + dur * 0.92);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + dur * 0.94);
      osc2.stop(time + dur * 0.94);
    } catch (e) {}
  }

  play16BitBass(freq, time, dur) {
    if (!this.bgmMasterGain || !this.ctx || !freq) return;
    try {
      // 16-Bit Slap Bass: Sub-triangle fundamental + snappy lowpass sawtooth bite
      const oscSub = this.ctx.createOscillator();
      const oscPluck = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      oscSub.type = 'triangle';
      oscPluck.type = 'sawtooth';

      oscSub.frequency.setValueAtTime(freq, time);
      oscPluck.frequency.setValueAtTime(freq, time);

      // Fast FM lowpass sweep for punchy slap pluck
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, time);
      filter.frequency.exponentialRampToValueAtTime(220, time + Math.min(dur * 0.7, 0.06));

      const peakGain = 0.078;
      gain.gain.setValueAtTime(peakGain, time);
      gain.gain.exponentialRampToValueAtTime(0.004, time + dur * 0.88);

      oscSub.connect(gain);
      oscPluck.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);

      oscSub.start(time);
      oscPluck.start(time);
      oscSub.stop(time + dur * 0.90);
      oscPluck.stop(time + dur * 0.90);
    } catch (e) {}
  }

  play16BitBrassStabs(chordNotes, time, dur) {
    if (!this.bgmMasterGain || !this.ctx || !chordNotes || chordNotes.length === 0) return;
    try {
      chordNotes.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, time);
        filter.frequency.exponentialRampToValueAtTime(700, time + dur * 0.80);

        const chordGain = 0.015;
        gain.gain.setValueAtTime(chordGain, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.85);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmMasterGain);

        osc.start(time);
        osc.stop(time + dur * 0.88);
      });
    } catch (e) {}
  }

  play16BitArp(chordNotes, stepInBar, time, dur) {
    if (!this.bgmMasterGain || !this.ctx || !chordNotes) return;
    try {
      const noteIndex = stepInBar % chordNotes.length;
      const octaveMult = (stepInBar % 4 >= 2) ? 1.5 : 1.0;
      const freq = chordNotes[noteIndex] * octaveMult;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time);

      const arpGain = 0.012;
      gain.gain.setValueAtTime(arpGain, time);
      gain.gain.exponentialRampToValueAtTime(0.0008, time + dur * 0.65);

      osc.connect(gain);
      gain.connect(this.bgmMasterGain);

      osc.start(time);
      osc.stop(time + dur * 0.70);
    } catch (e) {}
  }

  play16BitKick(time) {
    if (!this.bgmMasterGain || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.065);

      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.070);

      osc.connect(gain);
      gain.connect(this.bgmMasterGain);

      osc.start(time);
      osc.stop(time + 0.070);
    } catch (e) {}
  }

  play16BitSnare(time, isAccent = false) {
    if (!this.bgmMasterGain || !this.ctx) return;
    try {
      // 1. Tonal body
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.05);

      oscGain.gain.setValueAtTime(0.08, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.055);

      osc.connect(oscGain);
      oscGain.connect(this.bgmMasterGain);
      osc.start(time);
      osc.stop(time + 0.055);

      // 2. Snare Wire Noise
      if (this.noiseBuffer) {
        const source = this.ctx.createBufferSource();
        source.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2600, time);
        filter.Q.setValueAtTime(1.5, time);

        const noiseGain = this.ctx.createGain();
        const pGain = isAccent ? 0.075 : 0.055;
        noiseGain.gain.setValueAtTime(pGain, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

        source.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.bgmMasterGain);

        source.start(time);
        source.stop(time + 0.11);
      }
    } catch (e) {}
  }

  play16BitHiHat(time, isOpen = false) {
    if (!this.noiseBuffer || !this.bgmMasterGain || !this.ctx) return;
    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7500, time);

      const gain = this.ctx.createGain();
      const dur = isOpen ? 0.085 : 0.030;
      const peak = isOpen ? 0.045 : 0.022;

      gain.gain.setValueAtTime(peak, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);

      source.start(time);
      source.stop(time + dur);
    } catch (e) {}
  }

  play16BitCrash(time) {
    if (!this.noiseBuffer || !this.bgmMasterGain || !this.ctx) return;
    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4500, time);
      filter.Q.setValueAtTime(0.8, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.070, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmMasterGain);

      source.start(time);
      source.stop(time + 0.45);
    } catch (e) {}
  }

  schedule16BitSprintStep(step, time, stepDur) {
    if (!this.ctx || this.muted) return;

    const stepInBar = step % 16;
    const bar = Math.floor(step / 16);

    // 1. Lead Melody
    const leadFreq = SPRINT_SCORE.lead[step];
    if (leadFreq && leadFreq > 0) {
      this.play16BitLead(leadFreq, time, stepDur * 1.55);
    }

    // 2. Galloping 16-Bit Bassline
    const bassFreq = SPRINT_SCORE.bass[step];
    if (bassFreq && bassFreq > 0) {
      this.play16BitBass(bassFreq, time, stepDur * 1.70);
    }

    // 3. Brass Stabs on off-beats (Syncopated running drive)
    const chord = SPRINT_CHORDS[bar] || SPRINT_CHORDS[0];
    if ([2, 6, 10, 14].includes(stepInBar)) {
      this.play16BitBrassStabs(chord, time, stepDur * 1.35);
    }

    // 4. Fast 16th-note Crystal Arpeggio (Sense of velocity)
    this.play16BitArp(chord, stepInBar, time, stepDur);

    // 5. 16-Bit Drum Kit (Sprint Groove)
    // Crash cymbal on downbeats of major sections
    if (stepInBar === 0 && [0, 8, 16, 24].includes(bar)) {
      this.play16BitCrash(time);
    }

    // Kick: Driving sprint beat with galloping ghost kicks
    if (bar === 31) {
      // Final turnaround roll
      if (stepInBar % 2 === 0) {
        this.play16BitKick(time);
      }
    } else {
      if ([0, 6, 8, 12].includes(stepInBar)) {
        this.play16BitKick(time);
      }
    }

    // Snare: Backbeat on 4 and 12, plus rapid fills
    if ([4, 12].includes(stepInBar)) {
      this.play16BitSnare(time, stepInBar === 12);
    }
    if ((bar % 4 === 3) && [14, 15].includes(stepInBar)) {
      this.play16BitSnare(time, true);
    }

    // Hi-Hats: 16th-note ticks with open upbeat sizzles
    const isOpenHat = [2, 6, 10, 14].includes(stepInBar);
    this.play16BitHiHat(time, isOpenHat);
  }

  startBGM() {
    if (this.muted || !this.ctx || this.bgmPlaying) return;
    this.bgmPlaying = true;
    this.bgmStep = 0;

    if (!this.noiseBuffer) {
      this.createNoiseBuffer();
    }

    this.bgmMasterGain = this.ctx.createGain();
    this.bgmMasterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
    this.bgmMasterGain.connect(this.ctx.destination);

    this.nextStepTime = this.ctx.currentTime + 0.05;
    // ~166 BPM high-energy sprint tempo (16th-note step duration: 0.0903s)
    const stepDuration = 0.09036;

    const scheduler = () => {
      if (!this.bgmPlaying || this.muted || !this.ctx) return;
      while (this.nextStepTime < this.ctx.currentTime + 0.16) {
        this.schedule16BitSprintStep(this.bgmStep, this.nextStepTime, stepDuration);
        this.nextStepTime += stepDuration;
        // 512 total steps = 32 full bars before seamless loop
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

// Global 16-Bit Sprint Score & Chords Data
const SPRINT_CHORDS = [
  [
    293.66,
    349.23,
    440.0,
    587.33
  ],
  [
    293.66,
    349.23,
    440.0,
    587.33
  ],
  [
    293.66,
    349.23,
    440.0,
    587.33
  ],
  [
    277.18,
    329.63,
    392.0,
    440.0
  ],
  [
    293.66,
    349.23,
    440.0,
    587.33
  ],
  [
    293.66,
    349.23,
    440.0,
    587.33
  ],
  [
    293.66,
    349.23,
    440.0,
    587.33
  ],
  [
    277.18,
    329.63,
    392.0,
    440.0
  ],
  [
    293.66,
    349.23,
    466.16,
    587.33
  ],
  [
    329.63,
    392.0,
    523.25,
    659.25
  ],
  [
    349.23,
    440.0,
    587.33,
    698.46
  ],
  [
    329.63,
    440.0,
    523.25,
    659.25
  ],
  [
    293.66,
    349.23,
    466.16,
    587.33
  ],
  [
    329.63,
    392.0,
    523.25,
    659.25
  ],
  [
    349.23,
    440.0,
    587.33,
    698.46
  ],
  [
    329.63,
    392.0,
    440.0,
    554.37
  ],
  [
    349.23,
    440.0,
    523.25,
    698.46
  ],
  [
    329.63,
    392.0,
    523.25,
    659.25
  ],
  [
    293.66,
    392.0,
    493.88,
    587.33
  ],
  [
    329.63,
    392.0,
    523.25,
    659.25
  ],
  [
    349.23,
    440.0,
    523.25,
    698.46
  ],
  [
    349.23,
    440.0,
    587.33,
    698.46
  ],
  [
    293.66,
    349.23,
    466.16,
    587.33
  ],
  [
    277.18,
    329.63,
    392.0,
    440.0
  ],
  [
    293.66,
    392.0,
    466.16,
    587.33
  ],
  [
    277.18,
    329.63,
    392.0,
    440.0
  ],
  [
    293.66,
    349.23,
    466.16,
    587.33
  ],
  [
    329.63,
    392.0,
    523.25,
    659.25
  ],
  [
    349.23,
    440.0,
    587.33,
    698.46
  ],
  [
    293.66,
    392.0,
    466.16,
    587.33
  ],
  [
    311.13,
    369.99,
    440.0,
    523.25
  ],
  [
    277.18,
    329.63,
    392.0,
    440.0
  ]
];

const SPRINT_SCORE = {
  lead: [293.66, 0, 293.66, 0, 349.23, 0, 392.0, 0, 440.0, 0, 0, 523.25, 0, 440.0, 0, 0, 587.33, 0, 0, 587.33, 0, 523.25, 0, 440.0, 0, 392.0, 0, 349.23, 0, 392.0, 440.0, 0, 293.66, 0, 293.66, 0, 349.23, 0, 392.0, 0, 440.0, 0, 523.25, 0, 587.33, 0, 0, 0, 659.25, 0, 587.33, 0, 523.25, 0, 440.0, 0, 392.0, 0, 440.0, 0, 349.23, 0, 0, 0, 293.66, 0, 293.66, 0, 349.23, 0, 392.0, 0, 440.0, 0, 0, 523.25, 0, 440.0, 0, 0, 698.46, 0, 0, 698.46, 0, 659.25, 0, 587.33, 0, 523.25, 0, 440.0, 0, 523.25, 587.33, 0, 659.25, 0, 698.46, 0, 783.99, 0, 880.0, 0, 698.46, 0, 659.25, 0, 587.33, 0, 523.25, 0, 587.33, 0, 0, 0, 587.33, 0, 0, 0, 0, 0, 440.0, 0, 523.25, 0, 587.33, 0, 466.16, 0, 0, 587.33, 0, 0, 698.46, 0, 587.33, 0, 466.16, 0, 523.25, 0, 587.33, 0, 659.25, 0, 0, 783.99, 0, 0, 659.25, 0, 523.25, 0, 392.0, 0, 440.0, 0, 523.25, 0, 587.33, 0, 0, 698.46, 0, 0, 880.0, 0, 698.46, 0, 587.33, 0, 523.25, 0, 587.33, 0, 523.25, 0, 0, 659.25, 0, 0, 523.25, 0, 440.0, 0, 329.63, 0, 392.0, 0, 440.0, 0, 466.16, 0, 0, 587.33, 0, 0, 698.46, 0, 783.99, 0, 698.46, 0, 587.33, 0, 466.16, 0, 523.25, 0, 0, 659.25, 0, 0, 783.99, 0, 880.0, 0, 783.99, 0, 659.25, 0, 523.25, 0, 587.33, 0, 659.25, 0, 698.46, 0, 783.99, 0, 880.0, 0, 932.33, 0, 880.0, 0, 783.99, 0, 880.0, 0, 0, 0, 0, 0, 440.0, 0, 523.25, 0, 587.33, 0, 659.25, 0, 0, 0, 698.46, 0, 0, 698.46, 0, 659.25, 0, 587.33, 0, 523.25, 0, 440.0, 0, 523.25, 0, 0, 880.0, 0, 0, 880.0, 0, 783.99, 0, 698.46, 0, 783.99, 0, 0, 0, 0, 0, 0, 783.99, 0, 0, 783.99, 0, 698.46, 0, 659.25, 0, 587.33, 0, 493.88, 0, 587.33, 0, 0, 1046.5, 0, 0, 1046.5, 0, 987.77, 0, 880.0, 0, 783.99, 0, 0, 0, 0, 0, 0, 698.46, 0, 0, 698.46, 0, 659.25, 0, 587.33, 0, 523.25, 0, 440.0, 0, 523.25, 0, 0, 587.33, 0, 0, 698.46, 0, 0, 880.0, 0, 783.99, 0, 698.46, 0, 783.99, 0, 0, 0, 880.0, 0, 783.99, 0, 698.46, 0, 659.25, 0, 587.33, 0, 523.25, 0, 466.16, 0, 440.0, 0, 392.0, 0, 440.0, 0, 466.16, 0, 523.25, 0, 587.33, 0, 659.25, 0, 698.46, 0, 783.99, 0, 783.99, 0, 0, 783.99, 0, 698.46, 0, 587.33, 0, 466.16, 0, 392.0, 0, 466.16, 0, 0, 880.0, 0, 0, 880.0, 0, 783.99, 0, 659.25, 0, 554.37, 0, 440.0, 0, 554.37, 0, 0, 932.33, 0, 0, 932.33, 0, 880.0, 0, 698.46, 0, 587.33, 0, 466.16, 0, 587.33, 0, 0, 1046.5, 0, 0, 1046.5, 0, 932.33, 0, 783.99, 0, 659.25, 0, 523.25, 0, 659.25, 0, 0, 1174.66, 0, 0, 0, 0, 0, 1046.5, 0, 880.0, 0, 698.46, 0, 587.33, 0, 698.46, 0, 783.99, 0, 698.46, 0, 659.25, 0, 587.33, 0, 523.25, 0, 466.16, 0, 440.0, 0, 392.0, 0, 349.23, 0, 392.0, 0, 415.3, 0, 440.0, 0, 466.16, 0, 493.88, 0, 523.25, 0, 554.37, 0, 587.33, 0, 587.33, 0, 587.33, 0, 587.33, 0, 659.25, 0, 698.46, 0, 783.99, 0, 880.0, 0],
  bass: [73.42, 0, 146.83, 73.42, 0, 146.83, 73.42, 0, 73.42, 0, 146.83, 73.42, 0, 87.31, 98.0, 0, 73.42, 0, 146.83, 73.42, 0, 146.83, 73.42, 0, 73.42, 0, 146.83, 73.42, 0, 65.41, 69.3, 0, 73.42, 0, 146.83, 73.42, 0, 146.83, 73.42, 0, 73.42, 0, 146.83, 73.42, 0, 87.31, 98.0, 0, 55.0, 0, 110.0, 55.0, 0, 110.0, 55.0, 0, 65.41, 0, 73.42, 0, 82.41, 0, 87.31, 0, 73.42, 0, 146.83, 73.42, 0, 146.83, 73.42, 0, 73.42, 0, 146.83, 73.42, 0, 87.31, 98.0, 0, 73.42, 0, 146.83, 73.42, 0, 146.83, 73.42, 0, 73.42, 0, 146.83, 73.42, 0, 65.41, 69.3, 0, 73.42, 0, 146.83, 73.42, 0, 146.83, 73.42, 0, 73.42, 0, 146.83, 73.42, 0, 87.31, 98.0, 0, 73.42, 0, 146.83, 73.42, 0, 73.42, 0, 0, 55.0, 0, 65.41, 0, 69.3, 0, 73.42, 0, 58.27, 0, 116.54, 58.27, 0, 116.54, 58.27, 0, 58.27, 0, 116.54, 58.27, 0, 73.42, 87.31, 0, 65.41, 0, 130.81, 65.41, 0, 130.81, 65.41, 0, 65.41, 0, 130.81, 65.41, 0, 82.41, 98.0, 0, 73.42, 0, 146.83, 73.42, 0, 146.83, 73.42, 0, 73.42, 0, 146.83, 73.42, 0, 87.31, 110.0, 0, 55.0, 0, 110.0, 55.0, 0, 110.0, 55.0, 0, 55.0, 0, 110.0, 55.0, 0, 65.41, 82.41, 0, 58.27, 0, 116.54, 58.27, 0, 116.54, 58.27, 0, 58.27, 0, 116.54, 58.27, 0, 73.42, 87.31, 0, 65.41, 0, 130.81, 65.41, 0, 130.81, 65.41, 0, 65.41, 0, 130.81, 65.41, 0, 82.41, 98.0, 0, 73.42, 0, 146.83, 73.42, 0, 146.83, 73.42, 0, 87.31, 0, 174.61, 87.31, 0, 98.0, 0, 0, 55.0, 0, 110.0, 55.0, 0, 55.0, 0, 0, 55.0, 0, 61.74, 0, 65.41, 0, 69.3, 0, 87.31, 0, 174.61, 87.31, 0, 174.61, 87.31, 0, 87.31, 0, 174.61, 87.31, 0, 110.0, 130.81, 0, 65.41, 0, 130.81, 65.41, 0, 130.81, 65.41, 0, 65.41, 0, 130.81, 65.41, 0, 82.41, 98.0, 0, 98.0, 0, 196.0, 98.0, 0, 196.0, 98.0, 0, 98.0, 0, 196.0, 98.0, 0, 123.47, 146.83, 0, 65.41, 0, 130.81, 65.41, 0, 130.81, 65.41, 0, 65.41, 0, 130.81, 65.41, 0, 82.41, 98.0, 0, 87.31, 0, 174.61, 87.31, 0, 174.61, 87.31, 0, 87.31, 0, 174.61, 87.31, 0, 110.0, 130.81, 0, 73.42, 0, 146.83, 73.42, 0, 146.83, 73.42, 0, 73.42, 0, 146.83, 73.42, 0, 87.31, 110.0, 0, 58.27, 0, 116.54, 58.27, 0, 116.54, 58.27, 0, 65.41, 0, 130.81, 65.41, 0, 82.41, 0, 0, 55.0, 0, 110.0, 55.0, 0, 55.0, 0, 0, 55.0, 0, 58.27, 0, 61.74, 0, 65.41, 0, 49.0, 0, 98.0, 49.0, 0, 98.0, 49.0, 0, 49.0, 0, 98.0, 49.0, 0, 58.27, 73.42, 0, 55.0, 0, 110.0, 55.0, 0, 110.0, 55.0, 0, 55.0, 0, 110.0, 55.0, 0, 69.3, 82.41, 0, 58.27, 0, 116.54, 58.27, 0, 116.54, 58.27, 0, 58.27, 0, 116.54, 58.27, 0, 73.42, 87.31, 0, 65.41, 0, 130.81, 65.41, 0, 130.81, 65.41, 0, 65.41, 0, 130.81, 65.41, 0, 82.41, 98.0, 0, 73.42, 0, 146.83, 73.42, 0, 146.83, 73.42, 0, 73.42, 0, 146.83, 73.42, 0, 87.31, 110.0, 0, 49.0, 0, 98.0, 49.0, 0, 98.0, 49.0, 0, 55.0, 0, 110.0, 55.0, 0, 58.27, 0, 0, 58.27, 0, 61.74, 0, 65.41, 0, 69.3, 0, 73.42, 0, 77.78, 0, 82.41, 0, 87.31, 0, 92.5, 0, 98.0, 0, 103.83, 0, 110.0, 0, 55.0, 0, 55.0, 0, 55.0, 0, 55.0, 0]
};

window.soundManager = new SoundManager();
