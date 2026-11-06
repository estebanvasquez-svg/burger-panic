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
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
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
  // 8-BIT RETRO MERENGUE ENGINE: IL BARBIERE DI SIVIGLIA (Gioachino Rossini)
  // "Largo al factotum della citta" + Overture + "Figaro! Figaro!" in 8-bit Merengue
  // =========================================================================

  playLeadNote(freq, time, dur) {
    if (!this.bgmMasterGain || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.040, time);
    gain.gain.exponentialRampToValueAtTime(0.003, time + dur * 0.82);

    osc.connect(gain);
    gain.connect(this.bgmMasterGain);

    osc.start(time);
    osc.stop(time + dur * 0.85);
  }

  playBrassNote(freq, time, dur) {
    if (!this.bgmMasterGain || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, time);

    gain.gain.setValueAtTime(0.024, time);
    gain.gain.exponentialRampToValueAtTime(0.002, time + dur * 0.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmMasterGain);

    osc.start(time);
    osc.stop(time + dur * 0.82);
  }

  playBassNote(freq, time, dur) {
    if (!this.bgmMasterGain || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.065, time);
    gain.gain.exponentialRampToValueAtTime(0.005, time + dur * 0.85);

    osc.connect(gain);
    gain.connect(this.bgmMasterGain);

    osc.start(time);
    osc.stop(time + dur * 0.88);
  }

  playGuiraScrape(time, isAccent, dur) {
    if (!this.noiseBuffer || !this.bgmMasterGain || !this.ctx) return;
    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3400, time);

    const gain = this.ctx.createGain();
    const peakGain = isAccent ? 0.034 : 0.016;
    gain.gain.setValueAtTime(peakGain, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmMasterGain);

    source.start(time);
    source.stop(time + dur);
  }

  playTamboraRim(time) {
    if (!this.bgmMasterGain || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, time);
    osc.frequency.exponentialRampToValueAtTime(380, time + 0.028);

    gain.gain.setValueAtTime(0.042, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.028);

    osc.connect(gain);
    gain.connect(this.bgmMasterGain);

    osc.start(time);
    osc.stop(time + 0.028);
  }

  playTamboraSkin(time) {
    if (!this.bgmMasterGain || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(170, time);
    osc.frequency.exponentialRampToValueAtTime(54, time + 0.075);

    gain.gain.setValueAtTime(0.075, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.075);

    osc.connect(gain);
    gain.connect(this.bgmMasterGain);

    osc.start(time);
    osc.stop(time + 0.075);
  }

  scheduleMerengueStep(step, time, stepDur) {
    if (!this.ctx || this.muted) return;

    const stepInBar = step % 16;
    const bar = Math.floor(step / 16);

    // 1. Lead Melody: Rossini Figaro / Largo al Factotum
    const leadFreq = MERENGUE_SCORE.lead[step];
    if (leadFreq && leadFreq > 0) {
      this.playLeadNote(leadFreq, time, stepDur * 1.5);
    }

    // 2. Merengue Brass Stabs
    const brassFreq = MERENGUE_SCORE.brass[step];
    if (brassFreq && brassFreq > 0) {
      this.playBrassNote(brassFreq, time, stepDur * 1.3);
    }

    // 3. Merengue Bass Tumbao
    const bassFreq = MERENGUE_SCORE.bass[step];
    if (bassFreq && bassFreq > 0) {
      this.playBassNote(bassFreq, time, stepDur * 1.7);
    }

    // 4. Guira Scrapes (continuous 16th-note Dominican merengue groove)
    const isGuiraAccent = (stepInBar % 4 === 2);
    this.playGuiraScrape(time, isGuiraAccent, isGuiraAccent ? 0.045 : 0.025);

    // 5. Tambora (Rim and Skin hits)
    const isRepiqueBar = (bar === 10);
    if (isRepiqueBar) {
      // Merengue roll during the famous Figaro! Figaro! Figaro! line
      if ([0, 2, 4, 6, 8, 10, 12, 14].includes(stepInBar)) {
        this.playTamboraRim(time);
      }
      if ([1, 3, 5, 7, 9, 11, 13, 15].includes(stepInBar)) {
        this.playTamboraSkin(time);
      }
    } else {
      // Standard Merengue Tambora pattern
      if ([0, 6, 8, 12].includes(stepInBar)) {
        this.playTamboraRim(time);
      }
      if ([4, 10, 14].includes(stepInBar)) {
        this.playTamboraSkin(time);
      }
    }
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
    const stepDuration = 0.098; // ~153 BPM Merengue tempo

    const scheduler = () => {
      if (!this.bgmPlaying || this.muted || !this.ctx) return;
      while (this.nextStepTime < this.ctx.currentTime + 0.16) {
        this.scheduleMerengueStep(this.bgmStep, this.nextStepTime, stepDuration);
        this.nextStepTime += stepDuration;
        this.bgmStep = (this.bgmStep + 1) % 256;
      }
    };

    scheduler();
    this.bgmTimer = setInterval(scheduler, 35);
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

// Global score and note definitions for Il Barbiere di Siviglia Merengue
const ROSSINI_FREQ = {
  _: 0,
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50, D6: 1174.66, E6: 1318.51
};

const MERENGUE_SCORE = {
  lead: [
    // Bar 0: Largo al factotum della citta
    ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.E4, 0,
    ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.G4, 0,
    // Bar 1: Largo!
    ROSSINI_FREQ.A4, 0, ROSSINI_FREQ.A4, 0, ROSSINI_FREQ.A4, 0, ROSSINI_FREQ.F4, 0,
    ROSSINI_FREQ.A4, 0, ROSSINI_FREQ.D5, 0, ROSSINI_FREQ.D5, 0, ROSSINI_FREQ.B4, 0,
    // Bar 2: La ran la lera la ran la la
    ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.D5, 0, ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.D5, 0,
    ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.B4, 0, ROSSINI_FREQ.A4, 0, ROSSINI_FREQ.G4, 0,
    // Bar 3: Cadence resolve
    ROSSINI_FREQ.F4, 0, ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.A4, 0, ROSSINI_FREQ.B4, 0,
    ROSSINI_FREQ.C5, 0, 0, ROSSINI_FREQ.G4, 0, 0, ROSSINI_FREQ.C5, 0,

    // Bar 4: Overture Theme A (Rossini gallop)
    ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.D5, 0, ROSSINI_FREQ.C5, 0,
    ROSSINI_FREQ.B4, 0, ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.D5, 0, ROSSINI_FREQ.G4, 0,
    // Bar 5: Overture Theme B
    ROSSINI_FREQ.F5, 0, ROSSINI_FREQ.F5, 0, ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.D5, 0,
    ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.D5, 0, ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.G4, 0,
    // Bar 6: Mambo Crescendo Gallop
    ROSSINI_FREQ.G5, 0, ROSSINI_FREQ.G5, 0, ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.C5, 0,
    ROSSINI_FREQ.A4, 0, ROSSINI_FREQ.A4, 0, ROSSINI_FREQ.F5, 0, ROSSINI_FREQ.D5, 0,
    // Bar 7: Crescendo Resolve
    ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.B4, 0, ROSSINI_FREQ.A4, 0, ROSSINI_FREQ.B4, 0,
    ROSSINI_FREQ.C5, 0, 0, ROSSINI_FREQ.G4, 0, 0, ROSSINI_FREQ.C5, 0,

    // Bar 8: Figaro! Figaro!
    ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.C5, 0,
    ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.C5, 0,
    // Bar 9: Figaro! Figaro!
    ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.F5, 0, ROSSINI_FREQ.D5, 0,
    ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.F5, 0, ROSSINI_FREQ.D5, 0,
    // Bar 10: Repique Figaro Figaro Figaro Figaro!
    ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.C5, 0,
    ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.C5, 0,
    // Bar 11: Bravo bravissimo!
    ROSSINI_FREQ.F5, 0, ROSSINI_FREQ.D5, 0, ROSSINI_FREQ.F5, 0, ROSSINI_FREQ.D5, 0,
    ROSSINI_FREQ.G5, 0, ROSSINI_FREQ.G5, 0, ROSSINI_FREQ.G5, 0, 0, 0,

    // Bar 12: Merengue Mambo Horns Part 1
    ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.G5, 0, ROSSINI_FREQ.E5, 0,
    ROSSINI_FREQ.C6, 0, 0, ROSSINI_FREQ.G5, 0, 0, ROSSINI_FREQ.E5, 0,
    // Bar 13: Mambo Horns Part 2
    ROSSINI_FREQ.D5, 0, ROSSINI_FREQ.F5, 0, ROSSINI_FREQ.A5, 0, ROSSINI_FREQ.F5, 0,
    ROSSINI_FREQ.D6, 0, 0, ROSSINI_FREQ.B5, 0, 0, ROSSINI_FREQ.G5, 0,
    // Bar 14: Gallop Descent
    ROSSINI_FREQ.C6, 0, ROSSINI_FREQ.B5, 0, ROSSINI_FREQ.A5, 0, ROSSINI_FREQ.G5, 0,
    ROSSINI_FREQ.F5, 0, ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.D5, 0, ROSSINI_FREQ.C5, 0,
    // Bar 15: Loop Turnaround
    ROSSINI_FREQ.B4, 0, ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.D5, 0, ROSSINI_FREQ.B4, 0,
    ROSSINI_FREQ.C5, 0, 0, ROSSINI_FREQ.G4, 0, 0, ROSSINI_FREQ.C5, 0
  ],

  // Dominican Merengue Tumbao Bass (Syncopated leaps)
  bass: [
    // 0-3
    ROSSINI_FREQ.C3, 0, 0, 0, ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.C3, 0, 0, ROSSINI_FREQ.E3, 0, 0, ROSSINI_FREQ.G2, 0,
    ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.D3, 0, 0, 0, ROSSINI_FREQ.G2, 0, 0, ROSSINI_FREQ.B2, 0, 0, ROSSINI_FREQ.D3, 0,
    ROSSINI_FREQ.C3, 0, 0, 0, ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.C3, 0, 0, ROSSINI_FREQ.E3, 0, 0, ROSSINI_FREQ.G2, 0,
    ROSSINI_FREQ.F2, 0, 0, 0, ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.C3, 0, 0, ROSSINI_FREQ.G2, 0, 0, ROSSINI_FREQ.C3, 0,

    // 4-7
    ROSSINI_FREQ.C3, 0, 0, 0, ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.C3, 0, 0, ROSSINI_FREQ.E3, 0, 0, ROSSINI_FREQ.G2, 0,
    ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.D3, 0, 0, 0, ROSSINI_FREQ.G2, 0, 0, ROSSINI_FREQ.B2, 0, 0, ROSSINI_FREQ.D3, 0,
    ROSSINI_FREQ.C3, 0, 0, 0, ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.F2, 0, 0, ROSSINI_FREQ.A2, 0, 0, ROSSINI_FREQ.D3, 0,
    ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.D3, 0, 0, 0, ROSSINI_FREQ.C3, 0, 0, ROSSINI_FREQ.G2, 0, 0, ROSSINI_FREQ.C3, 0,

    // 8-11 (Figaro section)
    ROSSINI_FREQ.C3, 0, 0, 0, ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.C3, 0, 0, ROSSINI_FREQ.E3, 0, 0, ROSSINI_FREQ.G2, 0,
    ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.D3, 0, 0, 0, ROSSINI_FREQ.G2, 0, 0, ROSSINI_FREQ.B2, 0, 0, ROSSINI_FREQ.D3, 0,
    ROSSINI_FREQ.C3, 0, ROSSINI_FREQ.E3, 0, ROSSINI_FREQ.G3, 0, ROSSINI_FREQ.C3, 0, ROSSINI_FREQ.C3, 0, ROSSINI_FREQ.E3, 0, ROSSINI_FREQ.G3, 0, ROSSINI_FREQ.C3, 0,
    ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.D3, 0, 0, 0, ROSSINI_FREQ.G2, 0, 0, ROSSINI_FREQ.B2, 0, 0, ROSSINI_FREQ.D3, 0,

    // 12-15 (Mambo & Outro)
    ROSSINI_FREQ.C3, 0, 0, 0, ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.C3, 0, 0, ROSSINI_FREQ.E3, 0, 0, ROSSINI_FREQ.G2, 0,
    ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.D3, 0, 0, 0, ROSSINI_FREQ.G2, 0, 0, ROSSINI_FREQ.B2, 0, 0, ROSSINI_FREQ.D3, 0,
    ROSSINI_FREQ.C3, 0, 0, 0, ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.F2, 0, 0, ROSSINI_FREQ.G2, 0, 0, ROSSINI_FREQ.B2, 0,
    ROSSINI_FREQ.G2, 0, 0, 0, ROSSINI_FREQ.D3, 0, 0, 0, ROSSINI_FREQ.C3, 0, 0, ROSSINI_FREQ.G2, 0, 0, ROSSINI_FREQ.C3, 0
  ],

  // Merengue Brass Stabs & Harmonies
  brass: [
    // 0-3
    0, 0, ROSSINI_FREQ.E4, 0, 0, 0, ROSSINI_FREQ.G4, 0, 0, 0, ROSSINI_FREQ.E4, 0, ROSSINI_FREQ.G4, 0, 0, 0,
    0, 0, ROSSINI_FREQ.D4, 0, 0, 0, ROSSINI_FREQ.F4, 0, 0, 0, ROSSINI_FREQ.D4, 0, ROSSINI_FREQ.F4, 0, 0, 0,
    0, 0, ROSSINI_FREQ.E4, 0, 0, 0, ROSSINI_FREQ.G4, 0, 0, 0, ROSSINI_FREQ.E4, 0, ROSSINI_FREQ.G4, 0, 0, 0,
    0, 0, ROSSINI_FREQ.F4, 0, 0, 0, ROSSINI_FREQ.G4, 0, 0, 0, ROSSINI_FREQ.E4, 0, ROSSINI_FREQ.G4, 0, 0, 0,

    // 4-7
    0, 0, ROSSINI_FREQ.E4, 0, 0, 0, ROSSINI_FREQ.G4, 0, 0, 0, ROSSINI_FREQ.E4, 0, ROSSINI_FREQ.G4, 0, 0, 0,
    0, 0, ROSSINI_FREQ.D4, 0, 0, 0, ROSSINI_FREQ.F4, 0, 0, 0, ROSSINI_FREQ.D4, 0, ROSSINI_FREQ.F4, 0, 0, 0,
    ROSSINI_FREQ.E5, 0, 0, 0, ROSSINI_FREQ.C5, 0, 0, 0, ROSSINI_FREQ.F5, 0, 0, 0, ROSSINI_FREQ.D5, 0, 0, 0,
    0, 0, ROSSINI_FREQ.E4, 0, 0, 0, ROSSINI_FREQ.G4, 0, 0, 0, ROSSINI_FREQ.E4, 0, ROSSINI_FREQ.G4, 0, 0, 0,

    // 8-11 (Figaro section)
    0, 0, 0, 0, ROSSINI_FREQ.G5, 0, ROSSINI_FREQ.E5, 0, 0, 0, 0, 0, ROSSINI_FREQ.G5, 0, ROSSINI_FREQ.E5, 0,
    0, 0, 0, 0, ROSSINI_FREQ.G5, 0, ROSSINI_FREQ.F5, 0, 0, 0, 0, 0, ROSSINI_FREQ.G5, 0, ROSSINI_FREQ.F5, 0,
    ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.C5, 0, ROSSINI_FREQ.G4, 0, ROSSINI_FREQ.C5, 0,
    ROSSINI_FREQ.B4, 0, 0, 0, ROSSINI_FREQ.B4, 0, 0, 0, ROSSINI_FREQ.B4, 0, 0, 0, ROSSINI_FREQ.D5, 0, 0, 0,

    // 12-15
    ROSSINI_FREQ.E4, 0, 0, 0, ROSSINI_FREQ.G4, 0, 0, 0, ROSSINI_FREQ.C5, 0, 0, 0, ROSSINI_FREQ.E5, 0, 0, 0,
    ROSSINI_FREQ.F4, 0, 0, 0, ROSSINI_FREQ.A4, 0, 0, 0, ROSSINI_FREQ.D5, 0, 0, 0, ROSSINI_FREQ.F5, 0, 0, 0,
    ROSSINI_FREQ.G5, 0, 0, 0, ROSSINI_FREQ.E5, 0, 0, 0, ROSSINI_FREQ.D5, 0, 0, 0, ROSSINI_FREQ.B4, 0, 0, 0,
    0, 0, ROSSINI_FREQ.D5, 0, 0, 0, ROSSINI_FREQ.D5, 0, 0, 0, ROSSINI_FREQ.E5, 0, ROSSINI_FREQ.E5, 0, 0, 0
  ]
};

window.soundManager = new SoundManager();
