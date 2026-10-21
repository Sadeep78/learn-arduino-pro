import {
  CircuitComponent,
  CircuitState,
  CircuitWarning,
  CircuitCheckItem,
  PinState
} from '../../types/simulator';
import { buildNetlist, Netlist, NET_5V, NET_3V3, NET_GND } from './netlist';

export interface SketchAnalysis {
  pinModes: Record<number, 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP'>;
  drivenPins: number[]; // pins with digitalWrite(pin, ...) or analogWrite(pin, ...)
  writtenValues: Record<number, number>; // pin -> 0 | 1 | pwm
}

/**
 * Resilient regex parser that extracts pinMode and write operations from Arduino sketches.
 */
export function analyzeSketch(code: string): SketchAnalysis {
  const pinModes: Record<number, 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP'> = {};
  const drivenPins: number[] = [];
  const writtenValues: Record<number, number> = {};

  if (!code) return { pinModes, drivenPins, writtenValues };

  // 1. Identify variable definitions (e.g. const int ledPin = 13; or #define LED_PIN 13)
  const varMap: Record<string, number> = {
    LED_BUILTIN: 13
  };

  const constRegex = /(?:const\s+)?(?:int|uint8_t|byte)\s+([a-zA-Z0-9_]+)\s*=\s*(\d+)/g;
  let match: RegExpExecArray | null;
  while ((match = constRegex.exec(code)) !== null) {
    varMap[match[1]] = parseInt(match[2], 10);
  }

  const defineRegex = /#define\s+([a-zA-Z0-9_]+)\s+(\d+)/g;
  while ((match = defineRegex.exec(code)) !== null) {
    varMap[match[1]] = parseInt(match[2], 10);
  }

  const resolvePin = (raw: string): number | null => {
    const trimmed = raw.trim();
    if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);
    if (varMap[trimmed] !== undefined) return varMap[trimmed];
    return null;
  };

  // 2. Extract pinMode(pin, MODE)
  const pinModeRegex = /pinMode\s*\(\s*([^,\)]+)\s*,\s*([A-Z_]+)\s*\)/g;
  while ((match = pinModeRegex.exec(code)) !== null) {
    const p = resolvePin(match[1]);
    const mode = match[2].trim();
    if (p !== null) {
      if (mode === 'OUTPUT') pinModes[p] = 'OUTPUT';
      else if (mode === 'INPUT_PULLUP') pinModes[p] = 'INPUT_PULLUP';
      else if (mode === 'INPUT') pinModes[p] = 'INPUT';
    }
  }

  // 3. Extract digitalWrite(pin, VALUE)
  const digitalRegex = /digitalWrite\s*\(\s*([^,\)]+)\s*,\s*([a-zA-Z0-9_]+)\s*\)/g;
  while ((match = digitalRegex.exec(code)) !== null) {
    const p = resolvePin(match[1]);
    const val = match[2].trim();
    if (p !== null) {
      if (!drivenPins.includes(p)) drivenPins.push(p);
      writtenValues[p] = val === 'HIGH' || val === '1' ? 1 : 0;
    }
  }

  // 4. Extract analogWrite(pin, VALUE)
  const analogRegex = /analogWrite\s*\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*\)/g;
  while ((match = analogRegex.exec(code)) !== null) {
    const p = resolvePin(match[1]);
    if (p !== null && !drivenPins.includes(p)) {
      drivenPins.push(p);
      writtenValues[p] = 255;
    }
  }

  return { pinModes, drivenPins, writtenValues };
}

/**
 * Helper to trace if a terminal reaches Arduino Pin, 5V, or GND,
 * either directly or through a series current-limiting resistor.
 */
function findSourceOrGndThroughResistors(
  startPin: string,
  netlist: Netlist,
  resistors: CircuitComponent[]
): { sourcePin: number | null; is5V: boolean; isGnd: boolean; hasResistor: boolean } {
  // Direct connection
  if (netlist.isGnd(startPin)) {
    return { sourcePin: null, is5V: false, isGnd: true, hasResistor: false };
  }
  if (netlist.isVcc(startPin)) {
    return { sourcePin: null, is5V: true, isGnd: false, hasResistor: false };
  }
  const directPin = netlist.getArduinoPin(startPin);
  if (directPin !== null) {
    return { sourcePin: directPin, is5V: false, isGnd: false, hasResistor: false };
  }

  // Trace through series resistors
  for (const res of resistors) {
    const r1 = `${res.id}:pin1`;
    const r2 = `${res.id}:pin2`;

    if (netlist.areConnected(startPin, r1)) {
      if (netlist.isGnd(r2)) return { sourcePin: null, is5V: false, isGnd: true, hasResistor: true };
      if (netlist.isVcc(r2)) return { sourcePin: null, is5V: true, isGnd: false, hasResistor: true };
      const p = netlist.getArduinoPin(r2);
      if (p !== null) return { sourcePin: p, is5V: false, isGnd: false, hasResistor: true };
    }

    if (netlist.areConnected(startPin, r2)) {
      if (netlist.isGnd(r1)) return { sourcePin: null, is5V: false, isGnd: true, hasResistor: true };
      if (netlist.isVcc(r1)) return { sourcePin: null, is5V: true, isGnd: false, hasResistor: true };
      const p = netlist.getArduinoPin(r1);
      if (p !== null) return { sourcePin: p, is5V: false, isGnd: false, hasResistor: true };
    }
  }

  return { sourcePin: null, is5V: false, isGnd: false, hasResistor: false };
}

export interface ElectricalEngineResult {
  updatedComponents: CircuitComponent[];
  warnings: CircuitWarning[];
  checklist: CircuitCheckItem[];
  isShortCircuit: boolean;
}

/**
 * Validates the circuit netlist and applies strict electrical physics rules.
 */
export function evaluateElectricalCircuit(
  circuit: CircuitState,
  code: string,
  pinStates: Record<number, PinState>
): ElectricalEngineResult {
  const netlist = buildNetlist(circuit);
  const sketch = analyzeSketch(code);

  const warnings: CircuitWarning[] = [];
  const checklist: CircuitCheckItem[] = [];

  const uno = circuit.components.find((c) => c.type === 'arduino_uno');

  // Rule 0: Missing Arduino Uno
  if (!uno) {
    warnings.push({
      id: 'missing-uno',
      level: 'warning',
      message: 'No Arduino Uno board on the canvas. Add a board to run simulations.',
      helpText: 'Place an Arduino Uno from the Components palette.'
    });
    return {
      updatedComponents: circuit.components.map((c) => ({
        ...c,
        properties: { ...c.properties, brightness: 0, isBurnt: false, active: false }
      })),
      warnings,
      checklist,
      isShortCircuit: false
    };
  }

  // Rule 1: Direct 5V / 3V3 to GND Short Circuit
  const isShortCircuit = netlist.isShortCircuit();
  if (isShortCircuit) {
    warnings.push({
      id: 'short-circuit-vcc-gnd',
      level: 'error',
      message: 'Short circuit detected! 5V is directly connected to GND with zero load.',
      helpText: 'Simulation stopped immediately to protect hardware. Remove the direct bridge between 5V and GND.'
    });
    checklist.push({
      id: 'chk-short',
      label: 'Power supply safe (no short circuits)',
      status: 'fail',
      details: '5V power rail is directly shorted to GND!'
    });
  } else {
    checklist.push({
      id: 'chk-short',
      label: 'Power supply safe (no short circuits)',
      status: 'pass',
      details: 'Power and Ground lines are properly separated.'
    });
  }

  // Resistors list for series resistance checks
  const resistors = circuit.components.filter((c) => c.type === 'resistor');

  const updatedComponents = circuit.components.map((comp) => {
    const unconnectedPins: string[] = [];

    // ==========================================
    // 💡 1. STANDARD 5MM LED
    // ==========================================
    if (comp.type === 'led') {
      const anodePin = `${comp.id}:anode`;
      const cathodePin = `${comp.id}:cathode`;

      const anodeRoot = netlist.dsu.find(anodePin);
      const cathodeRoot = netlist.dsu.find(cathodePin);

      const isAnodeConnected = netlist.nets.has(anodeRoot) && (netlist.nets.get(anodeRoot)?.size || 0) > 1;
      const isCathodeConnected = netlist.nets.has(cathodeRoot) && (netlist.nets.get(cathodeRoot)?.size || 0) > 1;

      if (!isAnodeConnected) unconnectedPins.push('anode');
      if (!isCathodeConnected) unconnectedPins.push('cathode');

      let brightness = 0;
      let isBurnt = false;
      let isBackwards = false;

      const anodeTrace = findSourceOrGndThroughResistors(anodePin, netlist, resistors);
      const cathodeTrace = findSourceOrGndThroughResistors(cathodePin, netlist, resistors);

      const hasResistorInSeries = anodeTrace.hasResistor || cathodeTrace.hasResistor;

      // 1. Reversed polarity check:
      // Anode goes to GND, and Cathode goes to Source/5V!
      if (anodeTrace.isGnd && (cathodeTrace.sourcePin !== null || cathodeTrace.is5V)) {
        isBackwards = true;
        warnings.push({
          id: `led-backwards-${comp.id}`,
          level: 'error',
          componentId: comp.id,
          message: `${comp.name} is backwards! Polarity reversed.`,
          helpText: 'Current can only flow from Anode (+) to Cathode (-). Swap the LED pins so Anode connects to power/pin and Cathode to GND.'
        });
        checklist.push({
          id: `chk-led-polarity-${comp.id}`,
          label: `${comp.name} polarity correct`,
          status: 'fail',
          componentId: comp.id,
          details: 'Anode (+) must face positive voltage, Cathode (-) must face GND.'
        });
      } else if (isAnodeConnected && isCathodeConnected) {
        checklist.push({
          id: `chk-led-polarity-${comp.id}`,
          label: `${comp.name} polarity correct`,
          status: 'pass',
          componentId: comp.id,
          details: 'Anode (+) faces power, Cathode (-) faces GND.'
        });
      }

      const sourcePin = anodeTrace.sourcePin;
      const isAnode5V = anodeTrace.is5V;
      const isCathodeGnd = cathodeTrace.isGnd;

      // Checklist: Anode & Cathode connection
      if (sourcePin !== null || isAnode5V) {
        const pinLabel = isAnode5V ? '5V' : `Pin ${sourcePin}`;
        checklist.push({
          id: `chk-led-anode-${comp.id}`,
          label: `${comp.name} Anode connected to ${pinLabel}`,
          status: 'pass',
          componentId: comp.id,
          details: `Connected to ${pinLabel}.`
        });
      } else {
        checklist.push({
          id: `chk-led-anode-${comp.id}`,
          label: `${comp.name} Anode connected to digital pin`,
          status: 'fail',
          componentId: comp.id,
          details: 'Anode (+) is missing connection to an Arduino Pin or 5V.'
        });
      }

      if (isCathodeGnd) {
        checklist.push({
          id: `chk-led-gnd-${comp.id}`,
          label: `${comp.name} Cathode connected to GND`,
          status: 'pass',
          componentId: comp.id,
          details: 'Cathode (-) is connected to GND.'
        });
      } else {
        checklist.push({
          id: `chk-led-gnd-${comp.id}`,
          label: `${comp.name} Cathode connected to GND`,
          status: 'fail',
          componentId: comp.id,
          details: 'Cathode (-) must connect to Arduino GND.'
        });
      }

      // Check if LED is connected without resistor (burned out!)
      const hasPowerSource = (sourcePin !== null || isAnode5V);
      const hasGroundPath = isCathodeGnd;

      if (hasPowerSource && hasGroundPath && !hasResistorInSeries) {
        isBurnt = true;
        warnings.push({
          id: `led-no-resistor-${comp.id}`,
          level: 'error',
          componentId: comp.id,
          message: `${comp.name} burned out! Add a resistor (220 ohm).`,
          helpText: 'Without a current-limiting resistor, excessive current burns physical LEDs. Place a 220Ω resistor in series with the LED.'
        });
        checklist.push({
          id: `chk-led-resistor-${comp.id}`,
          label: `Resistor in series with ${comp.name} (220Ω)`,
          status: 'fail',
          componentId: comp.id,
          details: 'Missing current-limiting resistor!'
        });
      } else if (hasPowerSource && hasGroundPath && hasResistorInSeries) {
        checklist.push({
          id: `chk-led-resistor-${comp.id}`,
          label: `Resistor in series with ${comp.name} (220Ω)`,
          status: 'pass',
          componentId: comp.id,
          details: 'Series 220Ω current limiting resistor verified.'
        });
      }

      // Check code matching and compute live brightness:
      if (hasPowerSource && hasGroundPath && hasResistorInSeries && !isShortCircuit && !isBackwards && !isBurnt) {
        if (sourcePin !== null) {
          // Did student write code driving this pin?
          const isDrivenInCode = sketch.drivenPins.includes(sourcePin);
          const isPinOutput = sketch.pinModes[sourcePin] === 'OUTPUT';

          if (!isPinOutput && code.length > 20) {
            warnings.push({
              id: `led-no-output-mode-${comp.id}`,
              level: 'warning',
              componentId: comp.id,
              message: `Pin ${sourcePin} is not configured as OUTPUT in setup().`,
              helpText: `Add pinMode(${sourcePin}, OUTPUT); inside void setup() to enable current output.`
            });
            checklist.push({
              id: `chk-led-code-pinmode-${comp.id}`,
              label: `pinMode(${sourcePin}, OUTPUT) in code`,
              status: 'fail',
              details: `Pin ${sourcePin} needs pinMode(${sourcePin}, OUTPUT);`
            });
          }

          // Did code drive a DIFFERENT pin? (e.g. Code drives pin 13, but LED is on pin 12)
          const otherDrivenPins = sketch.drivenPins.filter((p) => p !== sourcePin);
          if (!isDrivenInCode && otherDrivenPins.length > 0) {
            warnings.push({
              id: `led-wrong-pin-${comp.id}`,
              level: 'warning',
              componentId: comp.id,
              message: `Code is driving Pin ${otherDrivenPins.join(', ')}, but ${comp.name} is connected to Pin ${sourcePin}.`,
              helpText: `Either change your code to drive Pin ${sourcePin}, or move the wire to Pin ${otherDrivenPins[0]}.`
            });
            checklist.push({
              id: `chk-led-code-drive-${comp.id}`,
              label: `Sketch drives Pin ${sourcePin}`,
              status: 'fail',
              details: `Code is driving Pin ${otherDrivenPins[0]}, not Pin ${sourcePin}.`
            });
          }

          // Compute live brightness:
          if (isDrivenInCode || sourcePin === 13) {
            const livePin = pinStates[sourcePin];
            if (livePin) {
              if (livePin.analogValue > 0) {
                brightness = livePin.analogValue / 255;
              } else if (livePin.digitalValue === 1 || livePin.voltage >= 2.5) {
                brightness = 1.0;
              }
            }
          }
        } else if (isAnode5V) {
          brightness = 1.0;
        }
      }

      return {
        ...comp,
        properties: {
          ...comp.properties,
          brightness: isBurnt || isBackwards || isShortCircuit ? 0 : brightness,
          isBurnt,
          isBackwards,
          unconnectedPins
        }
      };
    }

    // ==========================================
    // 🔘 2. PUSH BUTTON
    // ==========================================
    if (comp.type === 'button') {
      const pin1 = `${comp.id}:pin1`;
      const pin2 = `${comp.id}:pin2`;

      const isPin1Connected = (netlist.nets.get(netlist.dsu.find(pin1))?.size || 0) > 1;
      const isPin2Connected = (netlist.nets.get(netlist.dsu.find(pin2))?.size || 0) > 1;

      if (!isPin1Connected) unconnectedPins.push('pin1');
      if (!isPin2Connected) unconnectedPins.push('pin2');

      const targetPin = netlist.getArduinoPin(pin1) ?? netlist.getArduinoPin(pin2);
      const isOneSideGnd = netlist.isGnd(pin1) || netlist.isGnd(pin2);

      if (targetPin !== null) {
        const isPullup = sketch.pinModes[targetPin] === 'INPUT_PULLUP';

        if (isPullup && !isOneSideGnd) {
          warnings.push({
            id: `button-floating-${comp.id}`,
            level: 'warning',
            componentId: comp.id,
            message: `Floating input on Pin ${targetPin}! Missing connection to GND.`,
            helpText: 'With INPUT_PULLUP, the button must connect between the digital pin and GND to pull the line LOW when pressed.'
          });
          checklist.push({
            id: `chk-btn-gnd-${comp.id}`,
            label: 'Button connected to GND',
            status: 'fail',
            componentId: comp.id,
            details: 'Other side of button must connect to GND.'
          });
        } else if (isPullup && isOneSideGnd) {
          checklist.push({
            id: `chk-btn-gnd-${comp.id}`,
            label: `Button connected to Pin ${targetPin} and GND`,
            status: 'pass',
            componentId: comp.id,
            details: 'INPUT_PULLUP properly wired to GND.'
          });
        }
      }

      return {
        ...comp,
        properties: {
          ...comp.properties,
          unconnectedPins
        }
      };
    }

    // ==========================================
    // 🎛️ 3. POTENTIOMETER (3 Legs Required)
    // ==========================================
    if (comp.type === 'potentiometer') {
      const pVcc = `${comp.id}:vcc`;
      const pGnd = `${comp.id}:gnd`;
      const pWiper = `${comp.id}:wiper`;

      const hasVcc = netlist.isVcc(pVcc) || netlist.isVcc(pGnd);
      const hasGnd = netlist.isGnd(pGnd) || netlist.isGnd(pVcc);
      const wiperPin = netlist.getArduinoPin(pWiper);

      if (!netlist.isVcc(pVcc) && !netlist.isGnd(pVcc)) unconnectedPins.push('vcc');
      if (!netlist.isVcc(pGnd) && !netlist.isGnd(pGnd)) unconnectedPins.push('gnd');
      if (wiperPin === null) unconnectedPins.push('wiper');

      if (!hasVcc || !hasGnd || wiperPin === null) {
        warnings.push({
          id: `pot-missing-leg-${comp.id}`,
          level: 'warning',
          componentId: comp.id,
          message: `${comp.name} needs all 3 legs connected (5V, GND, and wiper to Analog Pin).`,
          helpText: 'Connect terminal 1 to 5V, terminal 2 to GND, and the center wiper to an analog input (A0-A5).'
        });
        checklist.push({
          id: `chk-pot-${comp.id}`,
          label: `${comp.name} all 3 legs connected`,
          status: 'fail',
          componentId: comp.id,
          details: 'Needs 5V, GND, and Wiper to Analog Pin.'
        });
      } else {
        checklist.push({
          id: `chk-pot-${comp.id}`,
          label: `${comp.name} wired to 5V, GND, and Pin A${wiperPin >= 14 ? wiperPin - 14 : wiperPin}`,
          status: 'pass',
          componentId: comp.id,
          details: '3-terminal voltage divider active.'
        });
      }

      return {
        ...comp,
        properties: {
          ...comp.properties,
          value: hasVcc && hasGnd && wiperPin !== null ? comp.properties?.value ?? 512 : 0,
          unconnectedPins
        }
      };
    }

    // ==========================================
    // 🦾 4. SG90 SERVO (3 Wires Required)
    // ==========================================
    if (comp.type === 'servo') {
      const sVcc = `${comp.id}:vcc`;
      const sGnd = `${comp.id}:gnd`;
      const sSig = `${comp.id}:signal`;

      const hasVcc = netlist.isVcc(sVcc);
      const hasGnd = netlist.isGnd(sGnd);
      const sigPin = netlist.getArduinoPin(sSig);

      if (!hasVcc) unconnectedPins.push('vcc');
      if (!hasGnd) unconnectedPins.push('gnd');
      if (sigPin === null) unconnectedPins.push('signal');

      if (!hasVcc || !hasGnd || sigPin === null) {
        warnings.push({
          id: `servo-missing-wires-${comp.id}`,
          level: 'warning',
          componentId: comp.id,
          message: `${comp.name} requires 3 wires: 5V (power), GND (ground), and Signal (PWM pin).`,
          helpText: 'Connect red wire to 5V, brown wire to GND, and orange signal wire to a PWM pin (e.g. Pin 9).'
        });
        checklist.push({
          id: `chk-servo-${comp.id}`,
          label: `${comp.name} 3 wires connected`,
          status: 'fail',
          componentId: comp.id,
          details: 'Needs 5V, GND, and Signal.'
        });
      } else {
        checklist.push({
          id: `chk-servo-${comp.id}`,
          label: `${comp.name} connected to 5V, GND, and Pin ${sigPin}`,
          status: 'pass',
          componentId: comp.id,
          details: 'Servo motor ready.'
        });
      }

      return {
        ...comp,
        properties: {
          ...comp.properties,
          angle: hasVcc && hasGnd && sigPin !== null ? comp.properties?.angle ?? 90 : 90,
          unconnectedPins
        }
      };
    }

    // ==========================================
    // 🔊 5. PIEZO BUZZER
    // ==========================================
    if (comp.type === 'buzzer') {
      const bPos = `${comp.id}:pos`;
      const bNeg = `${comp.id}:neg`;

      const hasGnd = netlist.isGnd(bNeg);
      const posPin = netlist.getArduinoPin(bPos);

      if (!hasGnd) unconnectedPins.push('neg');
      if (posPin === null) unconnectedPins.push('pos');

      const isActive = hasGnd && posPin !== null && (pinStates[posPin]?.digitalValue === 1 || pinStates[posPin]?.analogValue > 0);

      if (hasGnd && posPin !== null) {
        checklist.push({
          id: `chk-buzzer-${comp.id}`,
          label: `${comp.name} connected to Pin ${posPin} and GND`,
          status: 'pass',
          componentId: comp.id,
          details: 'Buzzer polarity and GND return verified.'
        });
      } else {
        checklist.push({
          id: `chk-buzzer-${comp.id}`,
          label: `${comp.name} wiring (+ to digital pin, - to GND)`,
          status: 'fail',
          componentId: comp.id,
          details: 'Positive (+) must connect to a digital pin and negative (-) to GND.'
        });
      }

      return {
        ...comp,
        properties: {
          ...comp.properties,
          active: isActive,
          unconnectedPins
        }
      };
    }

    // ==========================================
    // ⚡ 6. RESISTOR
    // ==========================================
    if (comp.type === 'resistor') {
      const pin1 = `${comp.id}:pin1`;
      const pin2 = `${comp.id}:pin2`;

      const isPin1Connected = (netlist.nets.get(netlist.dsu.find(pin1))?.size || 0) > 1;
      const isPin2Connected = (netlist.nets.get(netlist.dsu.find(pin2))?.size || 0) > 1;

      if (!isPin1Connected) unconnectedPins.push('pin1');
      if (!isPin2Connected) unconnectedPins.push('pin2');

      return {
        ...comp,
        properties: {
          ...comp.properties,
          unconnectedPins
        }
      };
    }

    // ==========================================
    // 🌈 7. RGB LED
    // ==========================================
    if (comp.type === 'rgb_led') {
      const pCathode = `${comp.id}:cathode`;
      const pR = `${comp.id}:r`;
      const pG = `${comp.id}:g`;
      const pB = `${comp.id}:b`;

      const isCathodeGnd = netlist.isGnd(pCathode);
      if (!isCathodeGnd) unconnectedPins.push('cathode');

      const traceR = findSourceOrGndThroughResistors(pR, netlist, resistors);
      const traceG = findSourceOrGndThroughResistors(pG, netlist, resistors);
      const traceB = findSourceOrGndThroughResistors(pB, netlist, resistors);

      const isRConnected = (netlist.nets.get(netlist.dsu.find(pR))?.size || 0) > 1;
      const isGConnected = (netlist.nets.get(netlist.dsu.find(pG))?.size || 0) > 1;
      const isBConnected = (netlist.nets.get(netlist.dsu.find(pB))?.size || 0) > 1;

      if (!isRConnected && !isGConnected && !isBConnected) {
        unconnectedPins.push('r', 'g', 'b');
      }

      let rVal = 0, gVal = 0, bVal = 0;
      if (isCathodeGnd) {
        if (traceR.sourcePin !== null) {
          const st = pinStates[traceR.sourcePin];
          rVal = st ? (st.analogValue > 0 ? st.analogValue : st.digitalValue ? 255 : 0) : 0;
        }
        if (traceG.sourcePin !== null) {
          const st = pinStates[traceG.sourcePin];
          gVal = st ? (st.analogValue > 0 ? st.analogValue : st.digitalValue ? 255 : 0) : 0;
        }
        if (traceB.sourcePin !== null) {
          const st = pinStates[traceB.sourcePin];
          bVal = st ? (st.analogValue > 0 ? st.analogValue : st.digitalValue ? 255 : 0) : 0;
        }
      }

      if (isCathodeGnd) {
        checklist.push({
          id: `chk-rgb-gnd-${comp.id}`,
          label: `${comp.name} Common Cathode to GND`,
          status: 'pass',
          componentId: comp.id,
          details: 'GND return verified.'
        });
      } else {
        checklist.push({
          id: `chk-rgb-gnd-${comp.id}`,
          label: `${comp.name} Common Cathode to GND`,
          status: 'fail',
          componentId: comp.id,
          details: 'Common Cathode lead must connect to Arduino GND.'
        });
      }

      return {
        ...comp,
        properties: {
          ...comp.properties,
          r: isCathodeGnd ? rVal : 0,
          g: isCathodeGnd ? gVal : 0,
          b: isCathodeGnd ? bVal : 0,
          unconnectedPins
        }
      };
    }

    // ==========================================
    // 📡 8. HC-SR04 ULTRASONIC
    // ==========================================
    if (comp.type === 'ultrasonic') {
      const uVcc = `${comp.id}:vcc`;
      const uGnd = `${comp.id}:gnd`;
      const uTrig = `${comp.id}:trig`;
      const uEcho = `${comp.id}:echo`;

      const hasVcc = netlist.isVcc(uVcc);
      const hasGnd = netlist.isGnd(uGnd);
      const trigPin = netlist.getArduinoPin(uTrig);
      const echoPin = netlist.getArduinoPin(uEcho);

      if (!hasVcc) unconnectedPins.push('vcc');
      if (!hasGnd) unconnectedPins.push('gnd');
      if (trigPin === null) unconnectedPins.push('trig');
      if (echoPin === null) unconnectedPins.push('echo');

      const isAllConnected = hasVcc && hasGnd && trigPin !== null && echoPin !== null;

      if (!isAllConnected) {
        checklist.push({
          id: `chk-ultrasonic-${comp.id}`,
          label: `${comp.name} 4-pin connection (VCC, GND, TRIG, ECHO)`,
          status: 'fail',
          componentId: comp.id,
          details: 'HC-SR04 requires VCC (5V), GND, TRIG (output pin), and ECHO (input pin).'
        });
      } else {
        checklist.push({
          id: `chk-ultrasonic-${comp.id}`,
          label: `${comp.name} connected to 5V, GND, TRIG(Pin ${trigPin}), ECHO(Pin ${echoPin})`,
          status: 'pass',
          componentId: comp.id,
          details: 'Ultrasonic rangefinder ready.'
        });
      }

      return {
        ...comp,
        properties: {
          ...comp.properties,
          value: isAllConnected ? comp.properties?.value ?? 45 : 0,
          unconnectedPins
        }
      };
    }

    // ==========================================
    // ☀️ 9. LDR PHOTORESISTOR
    // ==========================================
    if (comp.type === 'ldr') {
      const p1 = `${comp.id}:pin1`;
      const p2 = `${comp.id}:pin2`;

      const hasPower = netlist.isVcc(p1) || netlist.isVcc(p2);
      const sigPin = netlist.getArduinoPin(p1) ?? netlist.getArduinoPin(p2);

      if ((netlist.nets.get(netlist.dsu.find(p1))?.size || 0) <= 1) unconnectedPins.push('pin1');
      if ((netlist.nets.get(netlist.dsu.find(p2))?.size || 0) <= 1) unconnectedPins.push('pin2');

      if (hasPower && sigPin !== null) {
        checklist.push({
          id: `chk-ldr-${comp.id}`,
          label: `${comp.name} voltage divider connected to Pin A${sigPin >= 14 ? sigPin - 14 : sigPin}`,
          status: 'pass',
          componentId: comp.id,
          details: 'LDR analog sensor circuit active.'
        });
      } else {
        checklist.push({
          id: `chk-ldr-${comp.id}`,
          label: `${comp.name} voltage divider connection`,
          status: 'fail',
          componentId: comp.id,
          details: 'LDR must connect to 5V and an analog pin (A0-A5).'
        });
      }

      return {
        ...comp,
        properties: {
          ...comp.properties,
          value: hasPower && sigPin !== null ? comp.properties?.value ?? 600 : 0,
          unconnectedPins
        }
      };
    }

    return {
      ...comp,
      properties: {
        ...comp.properties,
        unconnectedPins
      }
    };
  });

  return {
    updatedComponents,
    warnings,
    checklist,
    isShortCircuit
  };
}
