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
    this.bgmNoteIndex = 0;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio not supported', e);
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

  // Catchy 8-bit Retro Arcade Background Music loop (Original Composition)
  startBGM() {
    if (this.muted || !this.ctx || this.bgmPlaying) return;
    this.bgmPlaying = true;
    this.bgmNoteIndex = 0;

    // Original 8-bit upbeat arcade ragtime bounce in F major
    const melody = [
      // Phrase 1 (F major swing)
      { note: 349.2, dur: 0.11, bass: 174.6 }, // F4
      { note: 440.0, dur: 0.11, bass: 261.6 }, // A4
      { note: 523.2, dur: 0.11, bass: 174.6 }, // C5
      { note: 587.3, dur: 0.11, bass: 261.6 }, // D5
      { note: 523.2, dur: 0.14, bass: 174.6 }, // C5
      { note: 440.0, dur: 0.11, bass: 220.0 }, // A4
      { note: 392.0, dur: 0.11, bass: 196.0 }, // G4
      { note: 349.2, dur: 0.18, bass: 174.6 }, // F4

      // Phrase 2 (D minor / Bb groove)
      { note: 293.7, dur: 0.11, bass: 146.8 }, // D4
      { note: 349.2, dur: 0.11, bass: 220.0 }, // F4
      { note: 440.0, dur: 0.11, bass: 146.8 }, // A4
      { note: 466.2, dur: 0.14, bass: 116.5 }, // Bb4
      { note: 440.0, dur: 0.11, bass: 174.6 }, // A4
      { note: 392.0, dur: 0.11, bass: 130.8 }, // G4
      { note: 349.2, dur: 0.14, bass: 174.6 }, // F4
      { note: 329.6, dur: 0.18, bass: 130.8 }, // E4

      // Phrase 3 (Ascending staccato run)
      { note: 261.6, dur: 0.10, bass: 130.8 }, // C4
      { note: 293.7, dur: 0.10, bass: 130.8 }, // D4
      { note: 329.6, dur: 0.10, bass: 164.8 }, // E4
      { note: 349.2, dur: 0.11, bass: 174.6 }, // F4
      { note: 392.0, dur: 0.11, bass: 196.0 }, // G4
      { note: 440.0, dur: 0.11, bass: 220.0 }, // A4
      { note: 466.2, dur: 0.11, bass: 233.1 }, // Bb4
      { note: 523.2, dur: 0.18, bass: 261.6 }, // C5

      // Phrase 4 (Turnaround cadence)
      { note: 587.3, dur: 0.11, bass: 146.8 }, // D5
      { note: 523.2, dur: 0.11, bass: 261.6 }, // C5
      { note: 440.0, dur: 0.11, bass: 220.0 }, // A4
      { note: 392.0, dur: 0.11, bass: 196.0 }, // G4
      { note: 349.2, dur: 0.22, bass: 174.6 }, // F4
      { note: 261.6, dur: 0.11, bass: 130.8 }, // C4
      { note: 349.2, dur: 0.28, bass: 87.3  }  // F4 resolve
    ];

    const playNext = () => {
      if (!this.bgmPlaying || this.muted) return;
      const cur = melody[this.bgmNoteIndex];
      const now = this.ctx.currentTime;

      // Pulse lead
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(cur.note, now);

      gain.gain.setValueAtTime(0.042, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + cur.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + cur.dur);

      // Bass triangle
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      const bassFreq = cur.bass || (cur.note / 2);
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      bassGain.gain.setValueAtTime(0.055, now);
      bassGain.gain.exponentialRampToValueAtTime(0.005, now + cur.dur);

      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + cur.dur);

      this.bgmNoteIndex = (this.bgmNoteIndex + 1) % melody.length;
      this.bgmTimer = setTimeout(playNext, (cur.dur + 0.025) * 1000);
    };

    playNext();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

window.soundManager = new SoundManager();
