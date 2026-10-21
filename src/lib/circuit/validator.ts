import { CircuitState, CircuitWarning } from '../../types/simulator';

export function validateCircuit(circuit: CircuitState): CircuitWarning[] {
  const warnings: CircuitWarning[] = [];
  const { components, wires } = circuit;

  const uno = components.find((c) => c.type === 'arduino_uno');
  if (!uno) {
    warnings.push({
      id: 'missing-uno',
      level: 'warning',
      message: 'No Arduino Uno board on the canvas. Add a board to run simulations.',
      helpText: 'Place an Arduino Uno from the Components palette.'
    });
    return warnings;
  }

  // Build simple netlist graph
  // Map pin -> connected pins: `${componentId}:${pinId}`
  const adj = new Map<string, string[]>();
  const addEdge = (a: string, b: string) => {
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a)!.push(b);
    adj.get(b)!.push(a);
  };

  wires.forEach((w) => {
    const from = `${w.fromComponentId}:${w.fromPinId}`;
    const to = `${w.toComponentId}:${w.toPinId}`;
    addEdge(from, to);
  });

  // Breadboard internal connections
  const breadboards = components.filter((c) => c.type === 'breadboard');
  breadboards.forEach((bb) => {
    // Top & bottom power rails (+ and -) are continuous strips
    // Columns (1 to 30) tie pins a-b-c-d-e together and f-g-h-i-j together
    // For breadboard internal nets:
    for (let col = 1; col <= 30; col++) {
      ['a', 'b', 'c', 'd', 'e'].forEach((row, i, arr) => {
        if (i < arr.length - 1) {
          addEdge(`${bb.id}:${row}${col}`, `${bb.id}:${arr[i + 1]}${col}`);
        }
      });
      ['f', 'g', 'h', 'i', 'j'].forEach((row, i, arr) => {
        if (i < arr.length - 1) {
          addEdge(`${bb.id}:${row}${col}`, `${bb.id}:${arr[i + 1]}${col}`);
        }
      });
    }
  });

  // Check 1: Short circuit directly between 5V and GND
  const vccPin = `${uno.id}:5v`;
  const gndPins = [`${uno.id}:gnd1`, `${uno.id}:gnd2`, `${uno.id}:gnd3`];

  const visited = new Set<string>();
  const queue: string[] = [vccPin];
  visited.add(vccPin);

  let hasDirectShort = false;
  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (gndPins.includes(curr)) {
      hasDirectShort = true;
      break;
    }
    const neighbors = adj.get(curr) || [];
    for (const n of neighbors) {
      // Don't traverse through load components like resistors or LEDs directly as zero-ohm shorts
      if (!visited.has(n)) {
        // If it's a wire or breadboard tie, traverse
        const [compGuid, pinName] = n.split(':');
        const comp = components.find((c) => c.id === compGuid);
        if (comp && comp.type !== 'arduino_uno' && comp.type !== 'breadboard') {
          // It's an active/passive electronic component; does not conduct 0-ohm directly without internal resistance
          continue;
        }
        visited.add(n);
        queue.push(n);
      }
    }
  }

  if (hasDirectShort) {
    warnings.push({
      id: 'short-circuit-vcc-gnd',
      level: 'error',
      message: 'Short circuit detected! 5V is directly bridged to GND with zero load.',
      helpText: 'This will cause power supply shutdown or burn the USB polyfuse on real hardware. Remove direct wire between 5V and GND.'
    });
  }

  // Check 2: LED connected without resistor
  const leds = components.filter((c) => c.type === 'led');
  leds.forEach((led) => {
    const anodeNeighbors = adj.get(`${led.id}:anode`) || [];
    const cathodeNeighbors = adj.get(`${led.id}:cathode`) || [];

    // Check if anode is directly wired to 5V or high-current pin, and cathode to GND, without a resistor
    const anodeHasResistor = anodeNeighbors.some((n) => {
      const [compId] = n.split(':');
      const comp = components.find((c) => c.id === compId);
      return comp?.type === 'resistor';
    });

    const cathodeHasResistor = cathodeNeighbors.some((n) => {
      const [compId] = n.split(':');
      const comp = components.find((c) => c.id === compId);
      return comp?.type === 'resistor';
    });

    const hasSource = anodeNeighbors.length > 0;
    const hasGround = cathodeNeighbors.length > 0;

    if (hasSource && hasGround && !anodeHasResistor && !cathodeHasResistor) {
      warnings.push({
        id: `led-no-resistor-${led.id}`,
        level: 'warning',
        componentId: led.id,
        message: `${led.name} is wired without a current-limiting resistor!`,
        helpText: 'In physical hardware, LEDs have near-zero resistance when forward biased. Add a 220Ω resistor in series with the LED to prevent burning it out.'
      });
    }
  });

  return warnings;
}
