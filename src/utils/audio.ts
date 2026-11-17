// Ambient sound generator using Web Audio API (100% offline, zero-latency, realistic)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private activeSources: AudioScheduledSourceNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentType: string = 'none';

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSoundscape(type: 'rain' | 'whitenoise' | 'binaural' | 'waves', volume: number = 0.3) {
    this.stop();
    this.initCtx();
    if (!this.ctx) return;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);
    this.currentType = type;

    if (type === 'whitenoise') {
      this.playWhiteNoise();
    } else if (type === 'rain') {
      this.playRain();
    } else if (type === 'binaural') {
      this.playBinauralFocus();
    } else if (type === 'waves') {
      this.playWaves();
    }
    this.isPlaying = true;
  }

  private playWhiteNoise() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to make it warm and soft (pink/brown noise feel)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();
    this.activeSources.push(whiteNoise);
  }

  private playRain() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.8;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1000, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.5, this.ctx.currentTime);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1200, this.ctx.currentTime);

    rainSource.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(this.gainNode);
    rainSource.start();
    this.activeSources.push(rainSource);
  }

  private playBinauralFocus() {
    if (!this.ctx || !this.gainNode) return;
    // 216 Hz base carrier + 256 Hz = 40 Hz Gamma wave for high alertness & study flow
    const oscLeft = this.ctx.createOscillator();
    const oscRight = this.ctx.createOscillator();
    const merger = this.ctx.createChannelMerger(2);

    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(216, this.ctx.currentTime);

    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(216 + 40, this.ctx.currentTime);

    oscLeft.connect(merger, 0, 0);
    oscRight.connect(merger, 0, 1);
    merger.connect(this.gainNode);

    oscLeft.start();
    oscRight.start();

    // Register BOTH oscillators so stop() terminates both immediately!
    this.activeSources.push(oscLeft, oscRight);
  }

  private playWaves() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);

    // LFO for wave surging
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(300, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.gainNode);
    noise.start();
    lfo.start();

    // Register BOTH the noise generator and LFO oscillator
    this.activeSources.push(noise, lfo);
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  public stop() {
    // Stop all active sources (oscillators, buffers, LFOs)
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch {
        // already stopped
      }
    }
    this.activeSources = [];

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {}
      this.gainNode = null;
    }

    if (this.ctx && this.ctx.state === 'running') {
      try {
        this.ctx.suspend();
      } catch {}
    }

    this.isPlaying = false;
    this.currentType = 'none';
  }

  public playChime() {
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.3);
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentType: this.currentType
    };
  }
}

export const soundEngine = new SoundEngine();
