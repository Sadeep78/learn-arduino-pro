import {
  CPU,
  avrInstruction,
  AVRIOPort,
  portBConfig,
  portCConfig,
  portDConfig,
  AVRTimer,
  timer0Config,
  timer1Config,
  timer2Config,
  AVRUSART,
  usart0Config,
  AVRADC,
  adcConfig,
  PinState
} from 'avr8js';
import { parseHex } from './hexParser';
import { soundSynth } from './audio';

export interface RunnerCallbacks {
  onPinStateChange?: (pin: number, state: { mode: string; high: boolean; pwm: number; voltage: number }) => void;
  onSerialOutput?: (text: string) => void;
  onSlowMoLine?: (lineNumber: number) => void;
  onTone?: (freq: number) => void;
}

export class AvrRunner {
  public cpu: CPU | null = null;
  public portB: AVRIOPort | null = null;
  public portC: AVRIOPort | null = null;
  public portD: AVRIOPort | null = null;
  public usart: AVRUSART | null = null;
  public adc: AVRADC | null = null;
  public timer0: AVRTimer | null = null;
  public timer1: AVRTimer | null = null;
  public timer2: AVRTimer | null = null;

  private progBytes: Uint8Array = new Uint8Array(32768);
  private isRunning = false;
  private animFrameId: number | null = null;
  private callbacks: RunnerCallbacks = {};
  private speed = 1.0; // 1.0 = full 16 MHz, 0.1 = slow motion
  private cyclesPerFrame = 250000; // ~16 MHz at 60 fps is ~266,667 cycles

  // Simulated pin memory for fast reactive reads
  public pinValues: Record<number, { high: boolean; pwm: number; voltage: number }> = {};

  constructor(callbacks: RunnerCallbacks = {}) {
    this.callbacks = callbacks;
    this.initPinMemory();
  }

  private initPinMemory() {
    for (let p = 0; p <= 19; p++) {
      this.pinValues[p] = { high: false, pwm: 0, voltage: 0 };
    }
  }

  public loadHex(hexString: string): boolean {
    this.progBytes.fill(0);
    const result = parseHex(hexString, this.progBytes);
    if (result.bytesLoaded === 0) return false;

    // Instantiate CPU with ATmega328P flash & 2KB SRAM
    this.cpu = new CPU(new Uint16Array(this.progBytes.buffer), 2048);

    // Initialize Ports
    this.portB = new AVRIOPort(this.cpu, portBConfig);
    this.portC = new AVRIOPort(this.cpu, portCConfig);
    this.portD = new AVRIOPort(this.cpu, portDConfig);

    // Initialize Timers for PWM and delay()
    this.timer0 = new AVRTimer(this.cpu, timer0Config);
    this.timer1 = new AVRTimer(this.cpu, timer1Config);
    this.timer2 = new AVRTimer(this.cpu, timer2Config);

    // Initialize USART for Serial
    this.usart = new AVRUSART(this.cpu, usart0Config, 16000000);
    this.usart.onByteTransmit = (byte: number) => {
      const char = String.fromCharCode(byte);
      this.callbacks.onSerialOutput?.(char);
    };

    // Initialize ADC for Analog Inputs
    this.adc = new AVRADC(this.cpu, adcConfig);

    // Listen to Port B changes (Pins 8 to 13)
    this.portB.addListener((value: number) => {
      for (let bit = 0; bit < 6; bit++) {
        const pin = 8 + bit;
        const isHigh = Boolean(value & (1 << bit));
        this.updatePinState(pin, isHigh, isHigh ? 255 : 0, isHigh ? 5.0 : 0.0);
      }
    });

    // Listen to Port D changes (Pins 0 to 7)
    this.portD.addListener((value: number) => {
      for (let bit = 0; bit < 8; bit++) {
        const pin = bit;
        const isHigh = Boolean(value & (1 << bit));
        this.updatePinState(pin, isHigh, isHigh ? 255 : 0, isHigh ? 5.0 : 0.0);
      }
    });

    return true;
  }

  private updatePinState(pin: number, high: boolean, pwm: number, voltage: number) {
    this.pinValues[pin] = { high, pwm, voltage };
    this.callbacks.onPinStateChange?.(pin, {
      mode: 'OUTPUT',
      high,
      pwm,
      voltage
    });

    // If pin 8 is buzzer, synthesize tone
    if (pin === 8 && high) {
      soundSynth.playTone(440);
      this.callbacks.onTone?.(440);
    } else if (pin === 8 && !high) {
      soundSynth.stopTone();
      this.callbacks.onTone?.(0);
    }
  }

  public setAnalogInput(channel: number, voltage: number) {
    // 0 to 5.0V input into 10-bit ADC
    if (this.adc) {
      this.adc.channelValues[channel] = Math.max(0, Math.min(5.0, voltage));
    }
    const pin = 14 + channel; // A0 is pin 14
    this.pinValues[pin] = {
      high: voltage > 2.5,
      pwm: Math.round((voltage / 5.0) * 1023),
      voltage
    };
  }

  public setDigitalInput(pin: number, isHigh: boolean) {
    if (pin >= 8 && pin <= 13 && this.portB) {
      const bit = pin - 8;
      this.portB.setPin(bit, isHigh);
    } else if (pin >= 0 && pin <= 7 && this.portD) {
      this.portD.setPin(pin, isHigh);
    }
    this.pinValues[pin] = {
      high: isHigh,
      pwm: isHigh ? 255 : 0,
      voltage: isHigh ? 5.0 : 0.0
    };
  }

  public sendSerialInput(text: string) {
    if (!this.usart) return;
    for (let i = 0; i < text.length; i++) {
      this.usart.writeByte(text.charCodeAt(i));
    }
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    soundSynth.stopTone();
  }

  public step() {
    if (this.cpu) {
      avrInstruction(this.cpu);
      this.cpu.cycles++;
    }
  }

  public setSpeed(multiplier: number) {
    this.speed = Math.max(0.01, Math.min(2.0, multiplier));
  }

  private loop = () => {
    if (!this.isRunning) return;

    if (this.cpu) {
      const cyclesToRun = Math.round(this.cyclesPerFrame * this.speed);
      for (let i = 0; i < cyclesToRun; i++) {
        avrInstruction(this.cpu);
        this.cpu.cycles++;
      }
    }

    this.animFrameId = requestAnimationFrame(this.loop);
  };
}
