export interface HotspotData {
  id: string;
  name: string;
  category: 'power' | 'processor' | 'io' | 'analog' | 'control';
  position: [number, number, number];
  labelOffset: [number, number];
  shortDesc: string;
  fullDesc: string;
  role: string;
  specs: { label: string; value: string }[];
}

export const HOTSPOTS: HotspotData[] = [
  {
    id: 'usb',
    name: 'USB Type-B Port',
    category: 'power',
    position: [-2.2, 0.45, -0.9],
    labelOffset: [-60, -40],
    shortDesc: 'Powers the board (5V) and loads sketches from your computer.',
    fullDesc: 'Standard USB Type-B port. Connects to the on-board ATmega16U2 USB-to-serial converter. Provides 5V DC power (up to 500mA protected by a 500mA PTC resettable polyfuse) and bidirectional UART serial communications.',
    role: 'Firmware flashing, serial debugging, and primary 5V power supply from PC.',
    specs: [
      { label: 'Voltage', value: '5.0 V DC' },
      { label: 'Current Limit', value: '500 mA (Resettable Fuse)' },
      { label: 'Interface', value: 'USB 2.0 Full Speed' }
    ]
  },
  {
    id: 'power_jack',
    name: 'DC Barrel Power Jack',
    category: 'power',
    position: [-2.35, 0.45, 1.25],
    labelOffset: [-60, 40],
    shortDesc: 'Accepts 7-12V DC power from AC adapter or 9V battery.',
    fullDesc: 'Center-positive 2.1mm DC barrel connector. Feeds an on-board NCP1117ST50T3G linear voltage regulator which steps down external voltages (7-12V recommended, 6-20V limits) to a steady 5.0V system rail.',
    role: 'Autonomous standalone power when disconnected from a computer.',
    specs: [
      { label: 'Center Pin', value: 'Positive (+)' },
      { label: 'Recommended Range', value: '7 - 12 V DC' },
      { label: 'Absolute Limits', value: '6 - 20 V DC' }
    ]
  },
  {
    id: 'atmega328p',
    name: 'ATmega328P Microcontroller',
    category: 'processor',
    position: [0.55, 0.35, 0.45],
    labelOffset: [50, -30],
    shortDesc: 'The 8-bit AVR "brain" of the Arduino Uno running at 16 MHz.',
    fullDesc: 'Microchip (formerly Atmel) ATmega328P in a DIP-28 socket. Executes your C/C++ sketch instructions. Houses 32 KB flash memory, 2 KB SRAM, 1 KB EEPROM, 6 PWM channels, and a 6-channel 10-bit ADC converter.',
    role: 'Central processing unit that reads inputs, runs your program logic, and controls outputs.',
    specs: [
      { label: 'Architecture', value: '8-bit AVR RISC' },
      { label: 'Clock Speed', value: '16.0 MHz Quartz' },
      { label: 'Flash Memory', value: '32 KB (0.5 KB bootloader)' },
      { label: 'SRAM', value: '2 KB' },
      { label: 'EEPROM', value: '1 KB' }
    ]
  },
  {
    id: 'digital_pins',
    name: 'Digital I/O Header (Pins 0 - 13)',
    category: 'io',
    position: [0.1, 0.4, -1.65],
    labelOffset: [0, -60],
    shortDesc: '14 configurable digital pins for sensors, switches, LEDs, and PWM.',
    fullDesc: 'Pins 0 to 13 can be configured as inputs or outputs with pinMode(). Pins 3, 5, 6, 9, 10, and 11 feature hardware PWM output marked with a tilde (~). Pins 0 (RX) and 1 (TX) handle hardware UART communications.',
    role: 'Primary digital interface to interact with buttons, relays, displays, and sensors.',
    specs: [
      { label: 'Digital Logic', value: '0V (LOW) / 5V (HIGH)' },
      { label: 'Max Current / Pin', value: '20 mA continuous (40 mA peak)' },
      { label: 'PWM Pins', value: '3, 5, 6, 9, 10, 11 (~490 Hz & 980 Hz)' }
    ]
  },
  {
    id: 'analog_pins',
    name: 'Analog Input Header (Pins A0 - A5)',
    category: 'analog',
    position: [1.2, 0.4, 1.65],
    labelOffset: [30, 50],
    shortDesc: '6 analog inputs with 10-bit ADC (reads 0-5V as 0-1023 integers).',
    fullDesc: 'Reads continuous analog voltages from sensors (potentiometers, light sensors, temperature probes). Pins A4 and A5 also serve as the SDA and SCL I2C communication bus.',
    role: 'Digitizes continuous real-world electrical signals into numeric values.',
    specs: [
      { label: 'Resolution', value: '10-bit (1024 discrete levels)' },
      { label: 'Voltage Range', value: '0 to 5.0 V DC (Reference AREF)' },
      { label: 'I2C Function', value: 'A4 = SDA, A5 = SCL' }
    ]
  },
  {
    id: 'power_pins',
    name: 'Power & Ground Header',
    category: 'power',
    position: [-0.65, 0.4, 1.65],
    labelOffset: [-40, 50],
    shortDesc: 'Supplies 5V, 3.3V, GND, and VIN power rails to your breadboard circuits.',
    fullDesc: 'Distributes regulated 5.0V, regulated 3.3V (up to 50mA), multiple ground (GND) return paths, reset line, and raw VIN from the DC barrel jack.',
    role: 'Powers all external chips, breadboards, sensors, and actuators.',
    specs: [
      { label: '5V Rail Current', value: 'Up to 800 mA from external DC' },
      { label: '3.3V Rail Current', value: 'Up to 50 mA from LP2985' },
      { label: 'Grounds', value: '3x Common Ground pins' }
    ]
  },
  {
    id: 'reset_btn',
    name: 'Hardware Reset Button',
    category: 'control',
    position: [-2.2, 0.35, -1.65],
    labelOffset: [-40, -40],
    shortDesc: 'Restarts sketch execution from the setup() function.',
    fullDesc: 'Tactile momentary push button connected to the ATmega328P RESET pin. Pressing it momentarily pulls the active-low line to GND, triggering a full hardware reboot.',
    role: 'Restart code execution, run diagnostics, or re-enter the bootloader.',
    specs: [
      { label: 'Type', value: 'Momentary Normally Open' },
      { label: 'Logic', value: 'Active LOW' }
    ]
  },
  {
    id: 'crystal',
    name: '16 MHz Quartz Crystal Oscillator',
    category: 'control',
    position: [-0.75, 0.35, 0.2],
    labelOffset: [-30, 20],
    shortDesc: 'Provides the high-precision 16.000 MHz clock pulse heartbeat.',
    fullDesc: 'Silver HC-49 quartz crystal package. Resonates mechanically at exactly 16 million vibrations per second when excited by the microcontroller oscillator inverter, setting the fundamental instruction cycle speed.',
    role: 'System clock generator (62.5 nanoseconds per clock cycle).',
    specs: [
      { label: 'Frequency', value: '16.000 MHz' },
      { label: 'Cycle Time', value: '62.5 nanoseconds' }
    ]
  }
];
