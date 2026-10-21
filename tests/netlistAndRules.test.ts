import { describe, it, expect } from 'vitest';
import { buildNetlist } from '../src/lib/circuit/netlist';
import { evaluateElectricalCircuit, analyzeSketch } from '../src/lib/circuit/electricalEngine';
import { CircuitState, PinState } from '../src/types/simulator';

describe('Electrical Netlist & Electrical Rules Engine (ERC)', () => {
  const pin13High: Record<number, PinState> = {
    13: { mode: 'OUTPUT', digitalValue: 1, analogValue: 0, voltage: 5.0, lastToggledMs: Date.now() }
  };

  const defaultBlinkSketch = `
    void setup() {
      pinMode(13, OUTPUT);
    }
    void loop() {
      digitalWrite(13, HIGH);
      delay(1000);
      digitalWrite(13, LOW);
      delay(1000);
    }
  `;

  // 1. Correct blink circuit lights the LED
  it('Rule 1: Correct blink circuit lights the LED with series resistor', () => {
    const circuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} },
        { id: 'res-1', type: 'resistor', name: '220Ω Resistor', x: 300, y: 100, rotation: 0, properties: { resistance: 220 } },
        { id: 'led-1', type: 'led', name: 'Red LED', x: 450, y: 150, rotation: 0, properties: { color: 'red', brightness: 0 } }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'uno-1', fromPinId: 'd13', toComponentId: 'res-1', toPinId: 'pin1', color: '#10B981' },
        { id: 'w2', fromComponentId: 'res-1', fromPinId: 'pin2', toComponentId: 'led-1', toPinId: 'anode', color: '#10B981' },
        { id: 'w3', fromComponentId: 'led-1', toPinId: 'gnd1', toComponentId: 'uno-1', fromPinId: 'cathode', color: '#1F2937' }
      ]
    };

    const result = evaluateElectricalCircuit(circuit, defaultBlinkSketch, pin13High);
    const led = result.updatedComponents.find((c) => c.id === 'led-1');

    expect(led?.properties?.brightness).toBe(1.0);
    expect(led?.properties?.isBurnt).toBe(false);
    expect(led?.properties?.isBackwards).toBe(false);
    expect(result.checklist.some((c) => c.id === 'chk-led-polarity-led-1' && c.status === 'pass')).toBe(true);
  });

  // 2. Reversed LED stays off ("LED is backwards")
  it('Rule 2: Reversed LED polarity stays OFF and flags backwards error', () => {
    const circuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} },
        { id: 'res-1', type: 'resistor', name: '220Ω Resistor', x: 300, y: 100, rotation: 0, properties: { resistance: 220 } },
        { id: 'led-1', type: 'led', name: 'Red LED', x: 450, y: 150, rotation: 0, properties: { color: 'red', brightness: 0 } }
      ],
      wires: [
        // Backward: Anode to GND, Cathode to Pin 13 through resistor!
        { id: 'w1', fromComponentId: 'uno-1', fromPinId: 'd13', toComponentId: 'res-1', toPinId: 'pin1', color: '#10B981' },
        { id: 'w2', fromComponentId: 'res-1', fromPinId: 'pin2', toComponentId: 'led-1', toPinId: 'cathode', color: '#10B981' },
        { id: 'w3', fromComponentId: 'led-1', fromPinId: 'anode', toComponentId: 'uno-1', toPinId: 'gnd1', color: '#1F2937' }
      ]
    };

    const result = evaluateElectricalCircuit(circuit, defaultBlinkSketch, pin13High);
    const led = result.updatedComponents.find((c) => c.id === 'led-1');

    expect(led?.properties?.brightness).toBe(0);
    expect(led?.properties?.isBackwards).toBe(true);
    expect(result.warnings.some((w) => w.id === 'led-backwards-led-1')).toBe(true);
  });

  // 3. Missing GND stays off
  it('Rule 3: Missing GND stays OFF', () => {
    const circuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} },
        { id: 'res-1', type: 'resistor', name: '220Ω Resistor', x: 300, y: 100, rotation: 0, properties: { resistance: 220 } },
        { id: 'led-1', type: 'led', name: 'Red LED', x: 450, y: 150, rotation: 0, properties: { color: 'red', brightness: 0 } }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'uno-1', fromPinId: 'd13', toComponentId: 'res-1', toPinId: 'pin1', color: '#10B981' },
        { id: 'w2', fromComponentId: 'res-1', fromPinId: 'pin2', toComponentId: 'led-1', toPinId: 'anode', color: '#10B981' }
        // Missing wire to GND!
      ]
    };

    const result = evaluateElectricalCircuit(circuit, defaultBlinkSketch, pin13High);
    const led = result.updatedComponents.find((c) => c.id === 'led-1');

    expect(led?.properties?.brightness).toBe(0);
    expect(led?.properties?.unconnectedPins).toContain('cathode');
  });

  // 4. No resistor burns the LED
  it('Rule 4: LED connected directly without resistor burns out', () => {
    const circuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} },
        { id: 'led-1', type: 'led', name: 'Red LED', x: 450, y: 150, rotation: 0, properties: { color: 'red', brightness: 0 } }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'uno-1', fromPinId: 'd13', toComponentId: 'led-1', toPinId: 'anode', color: '#EF4444' },
        { id: 'w2', fromComponentId: 'led-1', fromPinId: 'cathode', toComponentId: 'uno-1', toPinId: 'gnd1', color: '#1F2937' }
      ]
    };

    const result = evaluateElectricalCircuit(circuit, defaultBlinkSketch, pin13High);
    const led = result.updatedComponents.find((c) => c.id === 'led-1');

    expect(led?.properties?.isBurnt).toBe(true);
    expect(led?.properties?.brightness).toBe(0);
    expect(result.warnings.some((w) => w.id === 'led-no-resistor-led-1')).toBe(true);
  });

  // 5. Wrong pin number stays off
  it('Rule 5: When code drives Pin 13 but LED is wired to Pin 12, LED stays off', () => {
    const circuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} },
        { id: 'res-1', type: 'resistor', name: '220Ω Resistor', x: 300, y: 100, rotation: 0, properties: { resistance: 220 } },
        { id: 'led-1', type: 'led', name: 'Red LED', x: 450, y: 150, rotation: 0, properties: { color: 'red', brightness: 0 } }
      ],
      wires: [
        // Wired to D12 instead of D13!
        { id: 'w1', fromComponentId: 'uno-1', fromPinId: 'd12', toComponentId: 'res-1', toPinId: 'pin1', color: '#10B981' },
        { id: 'w2', fromComponentId: 'res-1', fromPinId: 'pin2', toComponentId: 'led-1', toPinId: 'anode', color: '#10B981' },
        { id: 'w3', fromComponentId: 'led-1', toPinId: 'gnd1', toComponentId: 'uno-1', fromPinId: 'cathode', color: '#1F2937' }
      ]
    };

    const result = evaluateElectricalCircuit(circuit, defaultBlinkSketch, pin13High);
    const led = result.updatedComponents.find((c) => c.id === 'led-1');

    expect(led?.properties?.brightness).toBe(0);
    expect(result.warnings.some((w) => w.id === 'led-wrong-pin-led-1')).toBe(true);
  });

  // 6. 5V-to-GND short circuit is detected
  it('Rule 6: 5V-to-GND direct short circuit is detected and flagged', () => {
    const circuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} }
      ],
      wires: [
        { id: 'w-short', fromComponentId: 'uno-1', fromPinId: '5v', toComponentId: 'uno-1', toPinId: 'gnd1', color: '#EF4444' }
      ]
    };

    const result = evaluateElectricalCircuit(circuit, defaultBlinkSketch, {});
    expect(result.isShortCircuit).toBe(true);
    expect(result.warnings.some((w) => w.id === 'short-circuit-vcc-gnd')).toBe(true);
  });

  // 7. Button with and without pull-up
  it('Rule 7: Push button with INPUT_PULLUP warns if missing connection to GND', () => {
    const pullupSketch = `
      void setup() {
        pinMode(2, INPUT_PULLUP);
      }
      void loop() {}
    `;

    const floatingButtonCircuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} },
        { id: 'btn-1', type: 'button', name: 'Push Button', x: 300, y: 100, rotation: 0, properties: {} }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'uno-1', fromPinId: 'd2', toComponentId: 'btn-1', toPinId: 'pin1', color: '#3B82F6' }
        // Missing wire from pin2 to GND!
      ]
    };

    const result = evaluateElectricalCircuit(floatingButtonCircuit, pullupSketch, {});
    expect(result.warnings.some((w) => w.id === 'button-floating-btn-1')).toBe(true);
  });

  // 8. Potentiometer with missing leg
  it('Rule 8: Potentiometer with a missing leg is flagged and value stays at 0', () => {
    const potCircuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} },
        { id: 'pot-1', type: 'potentiometer', name: 'Potentiometer', x: 300, y: 100, rotation: 0, properties: { value: 700 } }
      ],
      wires: [
        // Missing 5V! Only Wiper to A0 and GND connected
        { id: 'w1', fromComponentId: 'pot-1', fromPinId: 'wiper', toComponentId: 'uno-1', toPinId: 'a0', color: '#F59E0B' },
        { id: 'w2', fromComponentId: 'pot-1', fromPinId: 'gnd', toComponentId: 'uno-1', toPinId: 'gnd1', color: '#1F2937' }
      ]
    };

    const result = evaluateElectricalCircuit(potCircuit, '', {});
    const pot = result.updatedComponents.find((c) => c.id === 'pot-1');

    expect(pot?.properties?.value).toBe(0);
    expect(result.warnings.some((w) => w.id === 'pot-missing-leg-pot-1')).toBe(true);
  });
});
