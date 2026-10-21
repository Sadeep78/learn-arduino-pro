import { describe, it, expect } from 'vitest';
import { validateCircuit } from '../src/lib/circuit/validator';
import { CircuitState } from '../src/types/simulator';

describe('Circuit Validator', () => {
  it('detects missing Arduino Uno board', () => {
    const emptyCircuit: CircuitState = { components: [], wires: [] };
    const warnings = validateCircuit(emptyCircuit);
    expect(warnings.some((w) => w.id === 'missing-uno')).toBe(true);
  });

  it('detects short circuit between 5V and GND', () => {
    const shortedCircuit: CircuitState = {
      components: [
        {
          id: 'uno-1',
          type: 'arduino_uno',
          name: 'Arduino Uno R3',
          x: 100,
          y: 100,
          rotation: 0,
          properties: {}
        }
      ],
      wires: [
        {
          id: 'w-short',
          fromComponentId: 'uno-1',
          fromPinId: '5v',
          toComponentId: 'uno-1',
          toPinId: 'gnd1',
          color: '#DC2626'
        }
      ]
    };

    const warnings = validateCircuit(shortedCircuit);
    expect(warnings.some((w) => w.id === 'short-circuit-vcc-gnd')).toBe(true);
  });

  it('detects LED connected without a current-limiting resistor', () => {
    const unresistedLedCircuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} },
        { id: 'led-1', type: 'led', name: 'Red LED', x: 400, y: 100, rotation: 0, properties: { color: 'red' } }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'uno-1', fromPinId: '5v', toComponentId: 'led-1', toPinId: 'anode', color: '#DC2626' },
        { id: 'w2', fromComponentId: 'led-1', fromPinId: 'cathode', toComponentId: 'uno-1', toPinId: 'gnd1', color: '#1F2937' }
      ]
    };

    const warnings = validateCircuit(unresistedLedCircuit);
    expect(warnings.some((w) => w.id.includes('led-no-resistor'))).toBe(true);
  });

  it('approves properly resisted LED circuit', () => {
    const validCircuit: CircuitState = {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 100, rotation: 0, properties: {} },
        { id: 'res-1', type: 'resistor', name: '220Ω Resistor', x: 300, y: 100, rotation: 0, properties: { resistance: 220 } },
        { id: 'led-1', type: 'led', name: 'Red LED', x: 400, y: 100, rotation: 0, properties: { color: 'red' } }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'uno-1', fromPinId: 'd8', toComponentId: 'res-1', toPinId: 'pin1', color: '#10B981' },
        { id: 'w2', fromComponentId: 'res-1', fromPinId: 'pin2', toComponentId: 'led-1', toPinId: 'anode', color: '#10B981' },
        { id: 'w3', fromComponentId: 'led-1', fromPinId: 'cathode', toComponentId: 'uno-1', toPinId: 'gnd1', color: '#1F2937' }
      ]
    };

    const warnings = validateCircuit(validCircuit);
    expect(warnings.length).toBe(0);
  });
});
