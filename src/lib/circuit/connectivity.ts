import { CircuitComponent, CircuitState, PinState } from '../../types/simulator';

/**
 * Parses an Arduino pin identifier into a digital/analog pin number or power/ground type.
 */
function parseArduinoPin(pinId: string): { type: 'digital' | 'analog' | 'vcc' | 'gnd' | 'unknown'; pinNumber?: number } {
  const normalized = pinId.toLowerCase().trim();

  if (normalized === '5v' || normalized === '3v3' || normalized === 'vin' || normalized === 'ioref') {
    return { type: 'vcc' };
  }

  if (normalized === 'gnd' || normalized === 'gnd1' || normalized === 'gnd2' || normalized === 'gnd3') {
    return { type: 'gnd' };
  }

  // Digital pins: d0 - d13 or 0 - 13
  const dMatch = normalized.match(/^d?(\d+)$/);
  if (dMatch) {
    const num = parseInt(dMatch[1], 10);
    if (num >= 0 && num <= 13) {
      return { type: 'digital', pinNumber: num };
    }
  }

  // Analog pins: a0 - a5
  const aMatch = normalized.match(/^a(\d+)$/);
  if (aMatch) {
    const num = parseInt(aMatch[1], 10);
    if (num >= 0 && num <= 5) {
      return { type: 'analog', pinNumber: 14 + num };
    }
  }

  return { type: 'unknown' };
}

/**
 * Builds the electrical adjacency graph of the circuit.
 * Edge exists if two terminals are connected by wire, breadboard internal strip,
 * or through a conducting passive/closed component (e.g. resistor).
 */
export function buildElectricalGraph(circuit: CircuitState): Map<string, string[]> {
  const adj = new Map<string, string[]>();

  const addEdge = (nodeA: string, nodeB: string) => {
    if (!adj.has(nodeA)) adj.set(nodeA, []);
    if (!adj.has(nodeB)) adj.set(nodeB, []);
    adj.get(nodeA)!.push(nodeB);
    adj.get(nodeB)!.push(nodeA);
  };

  // 1. Physical Wires
  for (const wire of circuit.wires) {
    const from = `${wire.fromComponentId}:${wire.fromPinId}`;
    const to = `${wire.toComponentId}:${wire.toPinId}`;
    addEdge(from, to);
  }

  // 2. Breadboard internal connections
  const breadboards = circuit.components.filter((c) => c.type === 'breadboard');
  for (const bb of breadboards) {
    // Columns 1 to 30: tie rows a-e and rows f-j
    for (let col = 1; col <= 30; col++) {
      const topHalf = ['a', 'b', 'c', 'd', 'e'];
      for (let i = 0; i < topHalf.length - 1; i++) {
        addEdge(`${bb.id}:${topHalf[i]}${col}`, `${bb.id}:${topHalf[i + 1]}${col}`);
      }

      const bottomHalf = ['f', 'g', 'h', 'i', 'j'];
      for (let i = 0; i < bottomHalf.length - 1; i++) {
        addEdge(`${bb.id}:${bottomHalf[i]}${col}`, `${bb.id}:${bottomHalf[i + 1]}${col}`);
      }
    }

    // Power Rails (connect tie points on the same rail)
    const cols = Array.from({ length: 30 }, (_, i) => i + 1).filter((c) => c % 3 === 1);
    for (let i = 0; i < cols.length - 1; i++) {
      addEdge(`${bb.id}:top-vcc-${cols[i]}`, `${bb.id}:top-vcc-${cols[i + 1]}`);
      addEdge(`${bb.id}:top-gnd-${cols[i]}`, `${bb.id}:top-gnd-${cols[i + 1]}`);
      addEdge(`${bb.id}:bot-vcc-${cols[i]}`, `${bb.id}:bot-vcc-${cols[i + 1]}`);
      addEdge(`${bb.id}:bot-gnd-${cols[i]}`, `${bb.id}:bot-gnd-${cols[i + 1]}`);
    }
  }

  // 3. Resistors conduct current between pin1 and pin2
  const resistors = circuit.components.filter((c) => c.type === 'resistor');
  for (const res of resistors) {
    addEdge(`${res.id}:pin1`, `${res.id}:pin2`);
  }

  // 4. Closed push buttons conduct between pin1 and pin2
  const buttons = circuit.components.filter((c) => c.type === 'button');
  for (const btn of buttons) {
    if (btn.properties?.isPressed) {
      addEdge(`${btn.id}:pin1`, `${btn.id}:pin2`);
    }
  }

  return adj;
}

/**
 * Result of traversing from a component terminal across the circuit net.
 */
interface NetEndpointAnalysis {
  hasGnd: boolean;
  hasConstantVcc: boolean;
  connectedArduinoPins: number[]; // e.g. [13, 8]
}

/**
 * Traverses the electrical graph from a given terminal to determine if it reaches
 * Arduino GND, 5V VCC, or active Arduino I/O pins.
 * Does NOT traverse through LEDs or other semiconductors (unidirectional/load).
 */
export function traceNet(startNode: string, adj: Map<string, string[]>, components: CircuitComponent[]): NetEndpointAnalysis {
  const result: NetEndpointAnalysis = {
    hasGnd: false,
    hasConstantVcc: false,
    connectedArduinoPins: []
  };

  const uno = components.find((c) => c.type === 'arduino_uno');
  if (!uno) return result;

  const visited = new Set<string>();
  const queue: string[] = [startNode];
  visited.add(startNode);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const [compId, pinId] = curr.split(':');

    // If we reached the Arduino Uno, inspect the pin
    if (compId === uno.id) {
      const parsed = parseArduinoPin(pinId);
      if (parsed.type === 'gnd') {
        result.hasGnd = true;
      } else if (parsed.type === 'vcc') {
        result.hasConstantVcc = true;
      } else if ((parsed.type === 'digital' || parsed.type === 'analog') && parsed.pinNumber !== undefined) {
        if (!result.connectedArduinoPins.includes(parsed.pinNumber)) {
          result.connectedArduinoPins.push(parsed.pinNumber);
        }
      }
    }

    const neighbors = adj.get(curr) || [];
    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) continue;

      const [nCompId, nPinId] = neighbor.split(':');
      const comp = components.find((c) => c.id === nCompId);

      // Do NOT cross through another LED or active load directly (treat as open boundary unless startNode is part of it)
      if (comp && comp.type === 'led' && neighbor !== startNode) {
        continue;
      }

      visited.add(neighbor);
      queue.push(neighbor);
    }
  }

  return result;
}

/**
 * Updates component properties (such as LED brightness, buzzer active, servo angle)
 * based on the actual physical wiring to the Arduino and the current pin states.
 */
export function updateComponentStates(
  circuit: CircuitState,
  pinStates: Record<number, PinState>
): CircuitComponent[] {
  const uno = circuit.components.find((c) => c.type === 'arduino_uno');

  // If there is no Arduino board on the canvas, everything is unpowered
  if (!uno) {
    return circuit.components.map((c) => {
      if (c.type === 'led') {
        return { ...c, properties: { ...c.properties, brightness: 0 } };
      }
      if (c.type === 'rgb_led') {
        return { ...c, properties: { ...c.properties, r: 0, g: 0, b: 0 } };
      }
      if (c.type === 'buzzer') {
        return { ...c, properties: { ...c.properties, active: false } };
      }
      return c;
    });
  }

  const adj = buildElectricalGraph(circuit);

  return circuit.components.map((comp) => {
    // 1. Standard 5mm LED
    if (comp.type === 'led') {
      const anodeNet = traceNet(`${comp.id}:anode`, adj, circuit.components);
      const cathodeNet = traceNet(`${comp.id}:cathode`, adj, circuit.components);

      let brightness = 0;

      // Forward bias: Anode to positive source & Cathode to GND
      if (cathodeNet.hasGnd) {
        if (anodeNet.hasConstantVcc) {
          brightness = 1.0;
        } else {
          // Check connected digital pins
          for (const pinNum of anodeNet.connectedArduinoPins) {
            const pState = pinStates[pinNum];
            if (pState) {
              if (pState.analogValue > 0) {
                brightness = Math.max(brightness, pState.analogValue / 255);
              } else if (pState.digitalValue === 1 || pState.voltage >= 2.5) {
                brightness = 1.0;
              }
            }
          }
        }
      }

      return {
        ...comp,
        properties: {
          ...comp.properties,
          brightness
        }
      };
    }

    // 2. RGB LED (Common Cathode)
    if (comp.type === 'rgb_led') {
      const cathodeNet = traceNet(`${comp.id}:cathode`, adj, circuit.components);

      let r = 0;
      let g = 0;
      let b = 0;

      if (cathodeNet.hasGnd) {
        // Red channel
        const rNet = traceNet(`${comp.id}:r`, adj, circuit.components);
        if (rNet.hasConstantVcc) r = 255;
        for (const p of rNet.connectedArduinoPins) {
          const st = pinStates[p];
          if (st) r = Math.max(r, st.analogValue > 0 ? st.analogValue : st.digitalValue ? 255 : 0);
        }

        // Green channel
        const gNet = traceNet(`${comp.id}:g`, adj, circuit.components);
        if (gNet.hasConstantVcc) g = 255;
        for (const p of gNet.connectedArduinoPins) {
          const st = pinStates[p];
          if (st) g = Math.max(g, st.analogValue > 0 ? st.analogValue : st.digitalValue ? 255 : 0);
        }

        // Blue channel
        const bNet = traceNet(`${comp.id}:b`, adj, circuit.components);
        if (bNet.hasConstantVcc) b = 255;
        for (const p of bNet.connectedArduinoPins) {
          const st = pinStates[p];
          if (st) b = Math.max(b, st.analogValue > 0 ? st.analogValue : st.digitalValue ? 255 : 0);
        }
      }

      return {
        ...comp,
        properties: {
          ...comp.properties,
          r,
          g,
          b
        }
      };
    }

    // 3. Piezo Buzzer
    if (comp.type === 'buzzer') {
      const posNet = traceNet(`${comp.id}:pos`, adj, circuit.components);
      const negNet = traceNet(`${comp.id}:neg`, adj, circuit.components);

      let active = false;
      if (negNet.hasGnd) {
        if (posNet.hasConstantVcc) {
          active = true;
        } else {
          for (const p of posNet.connectedArduinoPins) {
            const st = pinStates[p];
            if (st && (st.digitalValue === 1 || st.analogValue > 0)) {
              active = true;
              break;
            }
          }
        }
      }

      return {
        ...comp,
        properties: {
          ...comp.properties,
          active
        }
      };
    }

    // 4. SG90 Servo
    if (comp.type === 'servo') {
      const vccNet = traceNet(`${comp.id}:vcc`, adj, circuit.components);
      const gndNet = traceNet(`${comp.id}:gnd`, adj, circuit.components);
      const sigNet = traceNet(`${comp.id}:signal`, adj, circuit.components);

      let angle = comp.properties?.angle ?? 90;
      // Only operate if powered by 5V and GND
      if (vccNet.hasConstantVcc && gndNet.hasGnd) {
        for (const p of sigNet.connectedArduinoPins) {
          const st = pinStates[p];
          if (st && st.analogValue > 0) {
            // Map PWM 0-255 to 0-180 degrees
            angle = Math.round((st.analogValue / 255) * 180);
          }
        }
      }

      return {
        ...comp,
        properties: {
          ...comp.properties,
          angle
        }
      };
    }

    return comp;
  });
}
