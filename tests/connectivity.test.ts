import { describe, it, expect } from 'vitest';
import { updateComponentStates } from '../src/lib/circuit/connectivity';
import { CircuitState, PinState } from '../src/types/simulator';

describe('Circuit Electrical Connectivity Engine', () => {
  const pin13High: Record<number, PinState> = {
    13: {
      mode: 'OUTPUT',
      digitalValue: 1,
      analogValue: 0,
      voltage: 5.0,
      lastToggledMs: Date.now()
    }
  };

  const pin13Low: Record<number, PinState> = {
    13: {
      mode: 'OUTPUT',
      digitalValue: 0,
      analogValue: 0,
      voltage: 0.0,
      lastToggledMs: Date.now()
    }
  };

  it('unwired LED remains OFF even when Arduino Pin 13 is HIGH', () => {
    const circuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} },
        { id: 'bb-1', type: 'breadboard', name: 'Half Breadboard', x: 400, y: 100, rotation: 0, properties: {} },
        { id: 'led-1', type: 'led', name: '5mm LED', x: 450, y: 150, rotation: 0, properties: { color: 'red', brightness: 0 } },
        { id: 'res-1', type: 'resistor', name: '220Ω Resistor', x: 450, y: 200, rotation: 0, properties: { resistance: 220 } }
      ],
      wires: [] // ZERO wires!
    };

    const resolved = updateComponentStates(circuit, pin13High);
    const led = resolved.find((c) => c.id === 'led-1');
    expect(led?.properties?.brightness).toBe(0);
  });

  it('LED wired to Pin 13 but missing GND remains OFF', () => {
    const circuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} },
        { id: 'led-1', type: 'led', name: '5mm LED', x: 450, y: 150, rotation: 0, properties: { color: 'red', brightness: 0 } }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'uno-1', fromPinId: 'd13', toComponentId: 'led-1', toPinId: 'anode', color: '#16B8B0' }
      ] // Anode connected, but Cathode has NO ground!
    };

    const resolved = updateComponentStates(circuit, pin13High);
    const led = resolved.find((c) => c.id === 'led-1');
    expect(led?.properties?.brightness).toBe(0);
  });

  it('LED properly connected through series resistor to Pin 13 and GND turns ON when Pin 13 is HIGH and OFF when LOW', () => {
    const circuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} },
        { id: 'res-1', type: 'resistor', name: '220Ω Resistor', x: 300, y: 100, rotation: 0, properties: { resistance: 220 } },
        { id: 'led-1', type: 'led', name: '5mm LED', x: 450, y: 150, rotation: 0, properties: { color: 'red', brightness: 0 } }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'uno-1', fromPinId: 'd13', toComponentId: 'res-1', toPinId: 'pin1', color: '#10B981' },
        { id: 'w2', fromComponentId: 'res-1', fromPinId: 'pin2', toComponentId: 'led-1', toPinId: 'anode', color: '#10B981' },
        { id: 'w3', fromComponentId: 'led-1', fromPinId: 'cathode', toComponentId: 'uno-1', toPinId: 'gnd1', color: '#1F2937' }
      ]
    };

    // When Pin 13 is HIGH
    const onResult = updateComponentStates(circuit, pin13High);
    const ledOn = onResult.find((c) => c.id === 'led-1');
    expect(ledOn?.properties?.brightness).toBe(1.0);

    // When Pin 13 is LOW
    const offResult = updateComponentStates(circuit, pin13Low);
    const ledOff = offResult.find((c) => c.id === 'led-1');
    expect(ledOff?.properties?.brightness).toBe(0);
  });

  it('LED wired to 5V and GND remains constantly ON', () => {
    const circuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} },
        { id: 'led-1', type: 'led', name: '5mm LED', x: 450, y: 150, rotation: 0, properties: { color: 'red', brightness: 0 } }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'uno-1', fromPinId: '5v', toComponentId: 'led-1', toPinId: 'anode', color: '#EF4444' },
        { id: 'w2', fromComponentId: 'led-1', fromPinId: 'cathode', toComponentId: 'uno-1', toPinId: 'gnd2', color: '#1F2937' }
      ]
    };

    const result = updateComponentStates(circuit, {});
    const led = result.find((c) => c.id === 'led-1');
    expect(led?.properties?.brightness).toBe(1.0);
  });
});
