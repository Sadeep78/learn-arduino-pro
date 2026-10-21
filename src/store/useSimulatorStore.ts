import { create } from 'zustand';
import {
  CircuitState,
  CircuitComponent,
  CircuitWire,
  CircuitWarning,
  ComponentType,
  PinState
} from '../types/simulator';
import { validateCircuit } from '../lib/circuit/validator';
import { AvrRunner } from '../lib/avr/avrRunner';
import { SketchRunner } from '../lib/avr/sketchRunner';
import { DEFAULT_SKETCHES } from '../data/defaultSketches';
import { soundSynth } from '../lib/avr/audio';

interface SimulatorStore {
  circuit: CircuitState;
  activeCode: string;
  isRunning: boolean;
  isPaused: boolean;
  isSlowMo: boolean;
  selectedComponentId: string | null;
  selectedWireId: string | null;
  wiringSource: { componentId: string; pinId: string } | null;
  wireColor: string;
  pinStates: Record<number, PinState>;
  serialLogs: string[];
  serialBaudRate: number;
  plotterValues: number[];
  warnings: CircuitWarning[];
  activeRunner: 'avr' | 'sketch';

  // Undo / Redo history
  past: CircuitState[];
  future: CircuitState[];

  // Actions
  addComponent: (type: ComponentType, x: number, y: number) => void;
  updateComponentProperty: (id: string, property: string, value: any) => void;
  removeComponent: (id: string) => void;
  rotateComponent: (id: string) => void;
  moveComponent: (id: string, x: number, y: number) => void;

  startWiring: (componentId: string, pinId: string) => void;
  completeWiring: (targetComponentId: string, targetPinId: string) => void;
  cancelWiring: () => void;
  removeWire: (id: string) => void;
  setWireColor: (color: string) => void;

  selectComponent: (id: string | null) => void;
  selectWire: (id: string | null) => void;

  setActiveCode: (code: string) => void;
  startSimulation: (hexPayload?: string) => void;
  stopSimulation: () => void;
  stepSimulation: () => void;
  toggleSlowMo: () => void;

  sendSerialInput: (input: string) => void;
  clearSerialLogs: () => void;
  setSerialBaudRate: (baud: number) => void;

  undo: () => void;
  redo: () => void;
  resetCanvas: () => void;
  loadCircuit: (circuit: CircuitState, code?: string) => void;
}

const DEFAULT_CIRCUIT: CircuitState = {
  components: [
    {
      id: 'uno-main',
      type: 'arduino_uno',
      name: 'Arduino Uno R3',
      x: 100,
      y: 100,
      rotation: 0,
      properties: {}
    },
    {
      id: 'bb-main',
      type: 'breadboard',
      name: 'Half Breadboard',
      x: 480,
      y: 100,
      rotation: 0,
      properties: {}
    },
    {
      id: 'led-red',
      type: 'led',
      name: 'Red LED',
      x: 520,
      y: 160,
      rotation: 0,
      properties: { color: 'red', brightness: 0 }
    },
    {
      id: 'res-220',
      type: 'resistor',
      name: '220Ω Resistor',
      x: 520,
      y: 240,
      rotation: 0,
      properties: { resistance: 220 }
    }
  ],
  wires: [
    {
      id: 'wire-1',
      fromComponentId: 'uno-main',
      fromPinId: 'd8',
      toComponentId: 'res-220',
      toPinId: 'pin1',
      color: '#10B981'
    },
    {
      id: 'wire-2',
      fromComponentId: 'res-220',
      fromPinId: 'pin2',
      toComponentId: 'led-red',
      toPinId: 'anode',
      color: '#10B981'
    },
    {
      id: 'wire-3',
      fromComponentId: 'led-red',
      fromPinId: 'cathode',
      toComponentId: 'uno-main',
      toPinId: 'gnd1',
      color: '#1F2937'
    }
  ]
};

const initPinStates = (): Record<number, PinState> => {
  const map: Record<number, PinState> = {};
  for (let i = 0; i <= 19; i++) {
    map[i] = { mode: 'INPUT', digitalValue: 0, analogValue: 0, voltage: 0, lastToggledMs: 0 };
  }
  return map;
};

// Singleton runner instances
let avrEngine: AvrRunner | null = null;
let sketchEngine: SketchRunner | null = null;

export const useSimulatorStore = create<SimulatorStore>((set, get) => ({
  circuit: DEFAULT_CIRCUIT,
  activeCode: DEFAULT_SKETCHES[0].code,
  isRunning: false,
  isPaused: false,
  isSlowMo: false,
  selectedComponentId: null,
  selectedWireId: null,
  wiringSource: null,
  wireColor: '#10B981', // Default teal-green wire
  pinStates: initPinStates(),
  serialLogs: ['Learn Arduino Pro Virtual Serial Console Initialized at 9600 baud.\n'],
  serialBaudRate: 9600,
  plotterValues: [],
  warnings: validateCircuit(DEFAULT_CIRCUIT),
  activeRunner: 'sketch',
  past: [],
  future: [],

  addComponent: (type, x, y) => {
    const state = get();
    const id = `${type}-${Date.now()}`;
    const nameMap: Record<ComponentType, string> = {
      arduino_uno: 'Arduino Uno R3',
      breadboard: 'Half Breadboard',
      led: '5mm LED',
      rgb_led: 'RGB LED',
      resistor: '220Ω Resistor',
      button: 'Push Button',
      potentiometer: '10k Potentiometer',
      buzzer: 'Piezo Buzzer',
      servo: 'SG90 Micro Servo',
      ldr: 'Photoresistor (LDR)',
      ultrasonic: 'HC-SR04 Ultrasonic',
      lcd1602: '16x2 LCD',
      seven_segment: '7-Segment Display'
    };

    const newComponent: CircuitComponent = {
      id,
      type,
      name: nameMap[type] || type,
      x: Math.round(x / 20) * 20, // snap to 20px grid
      y: Math.round(y / 20) * 20,
      rotation: 0,
      properties: {
        color: type === 'led' ? 'red' : undefined,
        resistance: type === 'resistor' ? 220 : undefined,
        value: type === 'potentiometer' ? 512 : type === 'ultrasonic' ? 45 : type === 'ldr' ? 600 : undefined,
        angle: type === 'servo' ? 90 : undefined
      }
    };

    const newCircuit = {
      ...state.circuit,
      components: [...state.circuit.components, newComponent]
    };

    set({
      past: [...state.past, state.circuit],
      future: [],
      circuit: newCircuit,
      warnings: validateCircuit(newCircuit),
      selectedComponentId: id
    });
  },

  updateComponentProperty: (id, prop, value) => {
    const state = get();
    const updatedComponents = state.circuit.components.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          properties: { ...c.properties, [prop]: value }
        };
      }
      return c;
    });

    const newCircuit = { ...state.circuit, components: updatedComponents };
    set({
      circuit: newCircuit,
      warnings: validateCircuit(newCircuit)
    });

    // If potentiometer or sensor moved, update AVR engine ADC
    if (prop === 'value') {
      const comp = updatedComponents.find((c) => c.id === id);
      if (comp?.type === 'potentiometer' && sketchEngine) {
        sketchEngine.setAnalogInput(0, value);
      }
    }
  },

  removeComponent: (id) => {
    const state = get();
    const newComponents = state.circuit.components.filter((c) => c.id !== id);
    const newWires = state.circuit.wires.filter(
      (w) => w.fromComponentId !== id && w.toComponentId !== id
    );

    const newCircuit = { components: newComponents, wires: newWires };
    set({
      past: [...state.past, state.circuit],
      future: [],
      circuit: newCircuit,
      warnings: validateCircuit(newCircuit),
      selectedComponentId: null
    });
  },

  rotateComponent: (id) => {
    const state = get();
    const updated = state.circuit.components.map((c) => {
      if (c.id === id) {
        return { ...c, rotation: (c.rotation + 90) % 360 };
      }
      return c;
    });

    const newCircuit = { ...state.circuit, components: updated };
    set({
      past: [...state.past, state.circuit],
      future: [],
      circuit: newCircuit
    });
  },

  moveComponent: (id, x, y) => {
    const state = get();
    const snappedX = Math.round(x / 10) * 10;
    const snappedY = Math.round(y / 10) * 10;

    const updated = state.circuit.components.map((c) => {
      if (c.id === id) {
        return { ...c, x: snappedX, y: snappedY };
      }
      return c;
    });

    set({ circuit: { ...state.circuit, components: updated } });
  },

  startWiring: (componentId, pinId) => {
    set({ wiringSource: { componentId, pinId } });
  },

  completeWiring: (targetComponentId, targetPinId) => {
    const state = get();
    if (!state.wiringSource) return;

    // Prevent connecting pin to itself
    if (
      state.wiringSource.componentId === targetComponentId &&
      state.wiringSource.pinId === targetPinId
    ) {
      set({ wiringSource: null });
      return;
    }

    const wireId = `w-${Date.now()}`;
    const newWire: CircuitWire = {
      id: wireId,
      fromComponentId: state.wiringSource.componentId,
      fromPinId: state.wiringSource.pinId,
      toComponentId: targetComponentId,
      toPinId: targetPinId,
      color: state.wireColor
    };

    const newCircuit = {
      ...state.circuit,
      wires: [...state.circuit.wires, newWire]
    };

    set({
      past: [...state.past, state.circuit],
      future: [],
      circuit: newCircuit,
      warnings: validateCircuit(newCircuit),
      wiringSource: null,
      selectedWireId: wireId
    });
  },

  cancelWiring: () => {
    set({ wiringSource: null });
  },

  removeWire: (id) => {
    const state = get();
    const newWires = state.circuit.wires.filter((w) => w.id !== id);
    const newCircuit = { ...state.circuit, wires: newWires };

    set({
      past: [...state.past, state.circuit],
      future: [],
      circuit: newCircuit,
      warnings: validateCircuit(newCircuit),
      selectedWireId: null
    });
  },

  setWireColor: (color) => set({ wireColor: color }),
  selectComponent: (id) => set({ selectedComponentId: id, selectedWireId: null }),
  selectWire: (id) => set({ selectedWireId: id, selectedComponentId: null }),

  setActiveCode: (code) => set({ activeCode: code }),

  startSimulation: (hexPayload) => {
    const state = get();

    // Callback on pin changes
    const onPinChange = (pin: number, pState: { high: boolean; pwm: number; voltage: number }) => {
      set((st) => {
        const nextPins = { ...st.pinStates };
        nextPins[pin] = {
          mode: 'OUTPUT',
          digitalValue: pState.high ? 1 : 0,
          analogValue: pState.pwm,
          voltage: pState.voltage,
          lastToggledMs: Date.now()
        };

        // Also update visual components connected to this pin (e.g. LED brightness)
        const updatedComps = st.circuit.components.map((c) => {
          if (c.type === 'led') {
            return {
              ...c,
              properties: {
                ...c.properties,
                brightness: pState.pwm > 0 ? pState.pwm / 255 : pState.high ? 1.0 : 0.0
              }
            };
          }
          return c;
        });

        return {
          pinStates: nextPins,
          circuit: { ...st.circuit, components: updatedComps }
        };
      });
    };

    const onSerial = (text: string) => {
      set((st) => ({
        serialLogs: [...st.serialLogs, text]
      }));

      // Parse numeric plotter values if line ends with newline
      if (text.includes('\n')) {
        const match = text.match(/[-+]?[0-9]*\.?[0-9]+/);
        if (match) {
          const num = parseFloat(match[0]);
          if (!isNaN(num)) {
            set((st) => ({
              plotterValues: [...st.plotterValues.slice(-50), num]
            }));
          }
        }
      }
    };

    if (hexPayload) {
      if (!avrEngine) {
        avrEngine = new AvrRunner({
          onPinStateChange: onPinChange,
          onSerialOutput: onSerial
        });
      }
      const loaded = avrEngine.loadHex(hexPayload);
      if (loaded) {
        avrEngine.start();
        set({ isRunning: true, activeRunner: 'avr' });
        return;
      }
    }

    // Fallback to in-browser sketch engine
    if (!sketchEngine) {
      sketchEngine = new SketchRunner({
        onPinChange: onPinChange,
        onSerialOutput: onSerial
      });
    }

    sketchEngine.start(state.activeCode, state.isSlowMo);
    set({ isRunning: true, activeRunner: 'sketch' });
  },

  stopSimulation: () => {
    if (avrEngine) avrEngine.stop();
    if (sketchEngine) sketchEngine.stop();
    soundSynth.stopTone();

    // Turn off LED brightness
    const state = get();
    const turnedOffComps = state.circuit.components.map((c) => {
      if (c.type === 'led') {
        return { ...c, properties: { ...c.properties, brightness: 0 } };
      }
      return c;
    });

    set({
      isRunning: false,
      isPaused: false,
      circuit: { ...state.circuit, components: turnedOffComps }
    });
  },

  stepSimulation: () => {
    if (avrEngine) avrEngine.step();
  },

  toggleSlowMo: () => {
    set((st) => {
      const nextSlowMo = !st.isSlowMo;
      if (avrEngine) avrEngine.setSpeed(nextSlowMo ? 0.05 : 1.0);
      return { isSlowMo: nextSlowMo };
    });
  },

  sendSerialInput: (input) => {
    const state = get();
    if (state.activeRunner === 'avr' && avrEngine) {
      avrEngine.sendSerialInput(input + '\n');
    } else if (sketchEngine) {
      sketchEngine.sendSerial(input + '\n');
    }
  },

  clearSerialLogs: () => set({ serialLogs: [], plotterValues: [] }),
  setSerialBaudRate: (baud) => set({ serialBaudRate: baud }),

  undo: () => {
    const state = get();
    if (state.past.length === 0) return;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);

    set({
      past: newPast,
      future: [state.circuit, ...state.future],
      circuit: previous,
      warnings: validateCircuit(previous)
    });
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return;
    const next = state.future[0];
    const newFuture = state.future.slice(1);

    set({
      past: [...state.past, state.circuit],
      future: newFuture,
      circuit: next,
      warnings: validateCircuit(next)
    });
  },

  resetCanvas: () => {
    set({
      circuit: { components: [], wires: [] },
      warnings: [],
      selectedComponentId: null,
      selectedWireId: null,
      wiringSource: null
    });
  },

  loadCircuit: (circuit, code) => {
    const state = get();
    set({
      past: [...state.past, state.circuit],
      future: [],
      circuit,
      activeCode: code || state.activeCode,
      warnings: validateCircuit(circuit),
      selectedComponentId: null,
      selectedWireId: null,
      wiringSource: null
    });
  }
}));
