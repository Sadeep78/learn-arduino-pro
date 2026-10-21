/**
 * Web Audio API synthesizer for Arduino tone() and piezo buzzers
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private currentFreq = 0;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playTone(frequency: number) {
    if (frequency <= 0) {
      this.stopTone();
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    // If frequency is unchanged and oscillator is active, keep playing
    if (this.osc && Math.abs(this.currentFreq - frequency) < 1) {
      return;
    }

    this.stopTone();

    try {
      this.currentFreq = frequency;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Square wave reproduces typical AVR microcontroller digital output
      osc.type = 'square';
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      // Low gain to prevent ear fatigue / clipping
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      this.osc = osc;
      this.gain = gain;
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }

  public stopTone() {
    if (this.osc && this.gain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.gain.gain.setValueAtTime(this.gain.gain.value, now);
        this.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        this.osc.stop(now + 0.05);
      } catch (_) {}
      this.osc = null;
      this.gain = null;
      this.currentFreq = 0;
    }
  }
}

export const soundSynth = new AudioSynthesizer();
