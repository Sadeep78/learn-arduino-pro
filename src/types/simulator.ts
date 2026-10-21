export type ComponentType =
  | 'arduino_uno'
  | 'breadboard'
  | 'led'
  | 'rgb_led'
  | 'resistor'
  | 'button'
  | 'potentiometer'
  | 'buzzer'
  | 'servo'
  | 'ldr'
  | 'ultrasonic'
  | 'lcd1602'
  | 'seven_segment';

export interface PinDefinition {
  id: string;
  label: string;
  type: 'digital' | 'analog' | 'power' | 'gnd' | 'signal' | 'nc';
  x: number; // offset from component origin
  y: number;
}

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  name: string;
  x: number;
  y: number;
  rotation: number; // 0, 90, 180, 270
  properties: {
    resistance?: number; // for resistor
    color?: string; // for LED: red, green, blue, yellow, orange
    label?: string;
    state?: any;
    value?: number; // for pot, ldr, distance slider
    isPressed?: boolean; // for push button
    angle?: number; // for servo (0-180)
    frequency?: number; // for buzzer
    active?: boolean;
    brightness?: number; // 0-1
    isBurnt?: boolean; // burnt out state (e.g. LED without resistor)
    isBackwards?: boolean; // reverse polarity
    unconnectedPins?: string[]; // pins missing connection
    [key: string]: any;
  };
}

export interface CircuitCheckItem {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  componentId?: string;
  pinId?: string;
  wireId?: string;
}

export interface RequiredConnection {
  from: string; // e.g. "uno:d13" or "uno:13"
  to: string; // e.g. "resistor:pin1"
  description?: string;
}

export interface RequiredCircuit {
  components: { type: ComponentType; count?: number; properties?: Record<string, any> }[];
  connections: RequiredConnection[];
}

export interface CircuitWire {
  id: string;
  fromComponentId: string;
  fromPinId: string;
  toComponentId: string;
  toPinId: string;
  color: string;
  waypoints?: { x: number; y: number }[];
}

export interface CircuitState {
  components: CircuitComponent[];
  wires: CircuitWire[];
}

export interface CircuitWarning {
  id: string;
  level: 'warning' | 'error' | 'info';
  message: string;
  componentId?: string;
  helpText?: string;
}

export interface PinState {
  mode: 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP';
  digitalValue: 0 | 1;
  analogValue: number; // 0 - 255 for PWM out, 0 - 1023 for ADC in
  voltage: number; // 0.0 - 5.0 V
  lastToggledMs: number;
}

export interface LogicSample {
  timestampMs: number;
  pins: Record<number, number>; // pin -> 0 | 1
}
