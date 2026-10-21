import { CircuitComponent, CircuitState } from '../../types/simulator';

/**
 * Union-Find (Disjoint-Set) data structure with path compression and union-by-rank.
 */
export class DisjointSet {
  private parent = new Map<string, string>();
  private rank = new Map<string, number>();

  find(item: string): string {
    if (!this.parent.has(item)) {
      this.parent.set(item, item);
      this.rank.set(item, 0);
      return item;
    }
    const p = this.parent.get(item)!;
    if (p !== item) {
      const root = this.find(p);
      this.parent.set(item, root);
      return root;
    }
    return p;
  }

  union(a: string, b: string): string {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return rootA;

    const rankA = this.rank.get(rootA) || 0;
    const rankB = this.rank.get(rootB) || 0;

    if (rankA < rankB) {
      this.parent.set(rootA, rootB);
      return rootB;
    } else if (rankA > rankB) {
      this.parent.set(rootB, rootA);
      return rootA;
    } else {
      this.parent.set(rootB, rootA);
      this.rank.set(rootA, rankA + 1);
      return rootA;
    }
  }

  connected(a: string, b: string): boolean {
    return this.find(a) === this.find(b);
  }

  getAllRoots(): Map<string, Set<string>> {
    const map = new Map<string, Set<string>>();
    for (const key of this.parent.keys()) {
      const root = this.find(key);
      if (!map.has(root)) {
        map.set(root, new Set<string>());
      }
      map.get(root)!.add(key);
    }
    return map;
  }
}

// Canonical Net Identifiers
export const NET_5V = 'NET:5V';
export const NET_3V3 = 'NET:3V3';
export const NET_GND = 'NET:GND';
export const NET_VIN = 'NET:VIN';
export const NET_DIGITAL = (pin: number) => `NET:D${pin}`;
export const NET_ANALOG = (pin: number) => `NET:A${pin}`;

export interface Netlist {
  dsu: DisjointSet;
  nets: Map<string, Set<string>>;
  areConnected: (pinA: string, pinB: string) => boolean;
  isGnd: (pin: string) => boolean;
  isVcc: (pin: string) => boolean;
  getArduinoPin: (pin: string) => number | null;
  isShortCircuit: () => boolean;
}

/**
 * Normalizes an Arduino pin identifier into standard format.
 */
export function normalizeArduinoPin(pinId: string): string {
  const norm = pinId.toLowerCase().trim();
  if (norm.startsWith('gnd')) return NET_GND;
  if (norm === '5v' || norm === 'ioref') return NET_5V;
  if (norm === '3v3' || norm === '3.3v') return NET_3V3;
  if (norm === 'vin') return NET_VIN;

  // Digital pins: d0 - d13 or 0 - 13
  const dMatch = norm.match(/^d?(\d+)$/);
  if (dMatch) {
    const num = parseInt(dMatch[1], 10);
    if (num >= 0 && num <= 13) return NET_DIGITAL(num);
  }

  // Analog pins: a0 - a5
  const aMatch = norm.match(/^a(\d+)$/);
  if (aMatch) {
    const num = parseInt(aMatch[1], 10);
    if (num >= 0 && num <= 5) return NET_ANALOG(num);
  }

  return norm;
}

/**
 * Calculates physical coordinates of a breadboard hole.
 */
function getBreadboardHoleCoord(bb: CircuitComponent, row: string, col: number): { x: number; y: number } {
  const colX = bb.x + 28 + (col - 1) * 14.4;
  const topRows = ['a', 'b', 'c', 'd', 'e'];
  const botRows = ['f', 'g', 'h', 'i', 'j'];

  if (topRows.includes(row)) {
    return { x: colX, y: bb.y + 36 + topRows.indexOf(row) * 12 };
  }
  if (botRows.includes(row)) {
    return { x: colX, y: bb.y + 126 + botRows.indexOf(row) * 12 };
  }
  return { x: colX, y: bb.y + 40 };
}

/**
 * Builds an electrical Netlist from the circuit components, wires, and breadboard strips.
 */
export function buildNetlist(circuit: CircuitState): Netlist {
  const dsu = new DisjointSet();

  // 1. Initialize Arduino Uno named nets
  const uno = circuit.components.find((c) => c.type === 'arduino_uno');
  if (uno) {
    // Merge all Uno GND pins into canonical NET_GND
    ['gnd', 'gnd1', 'gnd2', 'gnd3'].forEach((p) => {
      dsu.union(`${uno.id}:${p}`, NET_GND);
    });

    dsu.union(`${uno.id}:5v`, NET_5V);
    dsu.union(`${uno.id}:3v3`, NET_3V3);
    dsu.union(`${uno.id}:vin`, NET_VIN);

    // Digital pins D0-D13
    for (let i = 0; i <= 13; i++) {
      dsu.union(`${uno.id}:d${i}`, NET_DIGITAL(i));
      dsu.union(`${uno.id}:${i}`, NET_DIGITAL(i));
    }

    // Analog pins A0-A5
    for (let i = 0; i <= 5; i++) {
      dsu.union(`${uno.id}:a${i}`, NET_ANALOG(i));
    }
  }

  // 2. Model Breadboards
  const breadboards = circuit.components.filter((c) => c.type === 'breadboard');
  for (const bb of breadboards) {
    // Columns 1 to 30:
    // Top half: rows a, b, c, d, e form one net per column
    // Bottom half: rows f, g, h, i, j form one net per column
    // Center divider separates rows e and f
    for (let col = 1; col <= 30; col++) {
      const topHalf = ['a', 'b', 'c', 'd', 'e'];
      const topNetRef = `${bb.id}:strip_top_${col}`;
      for (const r of topHalf) {
        dsu.union(`${bb.id}:${r}${col}`, topNetRef);
      }

      const bottomHalf = ['f', 'g', 'h', 'i', 'j'];
      const botNetRef = `${bb.id}:strip_bot_${col}`;
      for (const r of bottomHalf) {
        dsu.union(`${bb.id}:${r}${col}`, botNetRef);
      }
    }

    // Power Rails (continuous strips along the entire length)
    const cols = Array.from({ length: 30 }, (_, i) => i + 1).filter((c) => c % 3 === 1);
    const topVccNet = `${bb.id}:rail_top_vcc`;
    const topGndNet = `${bb.id}:rail_top_gnd`;
    const botVccNet = `${bb.id}:rail_bot_vcc`;
    const botGndNet = `${bb.id}:rail_bot_gnd`;

    for (const c of cols) {
      dsu.union(`${bb.id}:top-vcc-${c}`, topVccNet);
      dsu.union(`${bb.id}:top-gnd-${c}`, topGndNet);
      dsu.union(`${bb.id}:bot-vcc-${c}`, botVccNet);
      dsu.union(`${bb.id}:bot-gnd-${c}`, botGndNet);
    }
  }

  // 3. Physical Wires between pins
  for (const wire of circuit.wires) {
    const fromPin = `${wire.fromComponentId}:${wire.fromPinId}`;
    const toPin = `${wire.toComponentId}:${wire.toPinId}`;
    dsu.union(fromPin, toPin);
  }

  // 4. Breadboard Automatic Pin Snapping
  // If a component pin (LED, Resistor, Button) physically sits on a breadboard hole, union them
  for (const comp of circuit.components) {
    if (comp.type === 'arduino_uno' || comp.type === 'breadboard') continue;

    const parentBb = breadboards.find(
      (bb) =>
        comp.x + 20 >= bb.x &&
        comp.x <= bb.x + 480 &&
        comp.y + 20 >= bb.y &&
        comp.y <= bb.y + 220
    );

    if (parentBb) {
      // Find nearest hole for component pin
      const testPins =
        comp.type === 'led'
          ? [
              { id: 'anode', relX: 24, relY: 78 },
              { id: 'cathode', relX: 56, relY: 78 }
            ]
          : comp.type === 'resistor'
            ? [
                { id: 'pin1', relX: 10, relY: 28 },
                { id: 'pin2', relX: 102, relY: 28 }
              ]
            : comp.type === 'button'
              ? [
                  { id: 'pin1', relX: 16, relY: 16 },
                  { id: 'pin2', relX: 48, relY: 48 }
                ]
              : [];

      for (const p of testPins) {
        const pinAbsX = comp.x + p.relX;
        const pinAbsY = comp.y + p.relY;

        // Find nearest breadboard column (1..30)
        const col = Math.max(1, Math.min(30, Math.round((pinAbsX - (parentBb.x + 28)) / 14.4) + 1));
        
        // Find whether it is top half (rows a-e) or bottom half (rows f-j)
        if (pinAbsY >= parentBb.y + 25 && pinAbsY <= parentBb.y + 105) {
          dsu.union(`${comp.id}:${p.id}`, `${parentBb.id}:strip_top_${col}`);
        } else if (pinAbsY >= parentBb.y + 115 && pinAbsY <= parentBb.y + 195) {
          dsu.union(`${comp.id}:${p.id}`, `${parentBb.id}:strip_bot_${col}`);
        }
      }
    }
  }

  const nets = dsu.getAllRoots();

  return {
    dsu,
    nets,
    areConnected: (pinA: string, pinB: string) => dsu.connected(pinA, pinB),
    isGnd: (pin: string) => dsu.connected(pin, NET_GND),
    isVcc: (pin: string) => dsu.connected(pin, NET_5V) || dsu.connected(pin, NET_3V3) || dsu.connected(pin, NET_VIN),
    getArduinoPin: (pin: string) => {
      for (let i = 0; i <= 13; i++) {
        if (dsu.connected(pin, NET_DIGITAL(i))) return i;
      }
      for (let i = 0; i <= 5; i++) {
        if (dsu.connected(pin, NET_ANALOG(i))) return 14 + i;
      }
      return null;
    },
    isShortCircuit: () => {
      return (
        dsu.connected(NET_5V, NET_GND) ||
        dsu.connected(NET_3V3, NET_GND) ||
        dsu.connected(NET_VIN, NET_GND)
      );
    }
  };
}
