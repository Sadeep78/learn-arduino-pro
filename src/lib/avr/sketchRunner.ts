import { soundSynth } from './audio';

export interface SketchRunnerCallbacks {
  onPinChange?: (pin: number, state: { high: boolean; pwm: number; voltage: number }) => void;
  onSerialOutput?: (text: string) => void;
  onLineExecuted?: (lineNumber: number) => void;
  onTone?: (freq: number) => void;
}

export class SketchRunner {
  private isRunning = false;
  private isSlowMo = false;
  private currentTimeout: any = null;
  private callbacks: SketchRunnerCallbacks = {};

  // Internal state
  public pins: Record<number, { mode: string; high: boolean; pwm: number; voltage: number }> = {};
  public serialInputBuffer: string = '';
  public analogInputs: Record<number, number> = { 0: 512, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  public digitalInputs: Record<number, boolean> = { 2: true }; // default button released (HIGH with pullup)

  constructor(callbacks: SketchRunnerCallbacks = {}) {
    this.callbacks = callbacks;
    this.resetPins();
  }

  public resetPins() {
    for (let p = 0; p <= 19; p++) {
      this.pins[p] = { mode: 'INPUT', high: false, pwm: 0, voltage: 0 };
    }
  }

  public setAnalogInput(pinNumber: number, value: number) {
    // 0 to 1023
    const channel = pinNumber >= 14 ? pinNumber - 14 : pinNumber;
    this.analogInputs[channel] = Math.max(0, Math.min(1023, value));
  }

  public setDigitalInput(pin: number, high: boolean) {
    this.digitalInputs[pin] = high;
    if (this.pins[pin]) {
      this.pins[pin].high = high;
      this.pins[pin].voltage = high ? 5.0 : 0.0;
    }
  }

  public sendSerial(text: string) {
    this.serialInputBuffer += text;
  }

  public start(code: string, slowMo = false) {
    this.stop();
    this.isRunning = true;
    this.isSlowMo = slowMo;

    // Simulate sketch execution loop
    this.executeSketch(code);
  }

  public stop() {
    this.isRunning = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    soundSynth.stopTone();
  }

  private executeSketch(code: string) {
    if (!this.isRunning) return;

    // Extract pin numbers and patterns from the code
    const hasPin13Blink = code.includes('13') && code.includes('HIGH') && code.includes('LOW');
    const hasPin8Blink = code.includes('8') && code.includes('digitalWrite');
    const hasPwm = code.includes('analogWrite');
    const hasSerial = code.includes('Serial.print');
    const hasTone = code.includes('tone(');
    const hasButton = code.includes('digitalRead');

    // Run setup serial print if present
    if (hasSerial && this.serialInputBuffer.length === 0) {
      if (code.includes('Meet the Board') || code.includes('Learn Arduino Pro')) {
        this.callbacks.onSerialOutput?.("Learn Arduino Pro - Online!\r\nClock: 16.00 MHz\r\n");
      } else {
        this.callbacks.onSerialOutput?.("System Initialized at 9600 baud.\r\n");
      }
    }

    let toggleState = false;

    const tick = () => {
      if (!this.isRunning) return;

      toggleState = !toggleState;

      // Pin 13 / Pin 8 toggle
      if (hasPin13Blink) {
        this.setPinOutput(13, toggleState, toggleState ? 255 : 0, toggleState ? 5.0 : 0.0);
        if (hasSerial) {
          this.callbacks.onSerialOutput?.(`LED 13: ${toggleState ? 'HIGH' : 'LOW'}\r\n`);
        }
      }

      if (hasPin8Blink && !hasButton) {
        this.setPinOutput(8, toggleState, toggleState ? 255 : 0, toggleState ? 5.0 : 0.0);
      }

      // If button reading
      if (hasButton) {
        const btnPressed = this.digitalInputs[2] === false; // active-low
        this.setPinOutput(8, btnPressed, btnPressed ? 255 : 0, btnPressed ? 5.0 : 0.0);
      }

      // If PWM fade on Pin 9
      if (hasPwm) {
        const potVal = this.analogInputs[0] ?? 512;
        const pwmVal = Math.round((potVal / 1023) * 255);
        this.setPinOutput(9, pwmVal > 0, pwmVal, (pwmVal / 255) * 5.0);
      }

      // If Tone on Pin 8
      if (hasTone) {
        if (toggleState) {
          soundSynth.playTone(440);
          this.callbacks.onTone?.(440);
        } else {
          soundSynth.stopTone();
          this.callbacks.onTone?.(0);
        }
      }

      // Handle incoming serial command echo
      if (this.serialInputBuffer.length > 0) {
        const cmd = this.serialInputBuffer;
        this.serialInputBuffer = '';
        if (cmd.includes('1')) {
          this.setPinOutput(13, true, 255, 5.0);
          this.callbacks.onSerialOutput?.("Command: LED 13 ON\r\n");
        } else if (cmd.includes('0')) {
          this.setPinOutput(13, false, 0, 0.0);
          this.callbacks.onSerialOutput?.("Command: LED 13 OFF\r\n");
        } else {
          this.callbacks.onSerialOutput?.(`Echo: ${cmd}\r\n`);
        }
      }

      const delayInterval = this.isSlowMo ? 1200 : 500;
      this.currentTimeout = setTimeout(tick, delayInterval);
    };

    tick();
  }

  private setPinOutput(pin: number, high: boolean, pwm: number, voltage: number) {
    this.pins[pin] = { mode: 'OUTPUT', high, pwm, voltage };
    this.callbacks.onPinChange?.(pin, { high, pwm, voltage });
  }
}
