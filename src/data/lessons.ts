import { Lesson } from '../types/lesson';
import { PRECOMPILED_HEX } from './precompiledHex';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    number: 1,
    title: 'Meet the Board',
    category: 'basics',
    categoryLabel: 'BASICS',
    difficulty: 'Beginner',
    xpReward: 100,
    estimatedMinutes: 5,
    description: 'Explore the anatomy of the Arduino Uno, understand the ATmega328P microcontroller, power sources, and learn how to run your first program.',
    summary: 'The Arduino Uno is an open-source microcontroller board based on the Microchip ATmega328P. It features 14 digital I/O pins, 6 analog inputs, and a 16 MHz quartz crystal oscillator.',
    hardwareParts: ['Arduino Uno R3', 'USB Type-B Cable'],
    learningGoals: [
      'Identify USB-B, DC barrel jack, and voltage regulator',
      'Locate Digital pins 0-13 and Analog pins A0-A5',
      'Understand the onboard Pin 13 "L" test LED',
      'Initialize and monitor Serial output at 9600 baud'
    ],
    schematicDescription: 'No external wiring needed! We use the on-board "L" LED connected to digital pin 13 and the hardware UART connected to the USB serial interface.',
    codeSnippet: `// Lesson 1: Meet the Board
// Welcome to Learn Arduino Pro!

void setup() {
  // Initialize digital pin 13 as an output
  pinMode(13, OUTPUT);
  // Start serial communication at 9600 bits per second
  Serial.begin(9600);
  Serial.println("=================================");
  Serial.println("  Learn Arduino Pro - Online!    ");
  Serial.println("  ATmega328P Clock: 16.00 MHz    ");
  Serial.println("=================================");
}

void loop() {
  // Flash on-board LED L
  digitalWrite(13, HIGH);
  Serial.println("Status: LED 13 ON");
  delay(1000);
  
  digitalWrite(13, LOW);
  Serial.println("Status: LED 13 OFF");
  delay(1000);
}`,
    precompiledHex: PRECOMPILED_HEX['lesson-1'],
    initialCircuit: {
      components: [
        {
          id: 'uno-1',
          type: 'arduino_uno',
          name: 'Arduino Uno R3',
          x: 200,
          y: 120,
          rotation: 0,
          properties: {}
        }
      ],
      wires: []
    },
    checkpoints: [
      {
        id: 'cp1-1',
        titleKey: 'Inspect Microcontroller',
        descriptionKey: 'Click on the ATmega328P chip on the 3D board to inspect its specs.',
        completed: false,
        type: 'observe_pin'
      },
      {
        id: 'cp1-2',
        titleKey: 'Run Simulation',
        descriptionKey: 'Click RUN to start the virtual ATmega328P core.',
        completed: false,
        type: 'run_simulation'
      },
      {
        id: 'cp1-3',
        titleKey: 'Open Serial Monitor',
        descriptionKey: 'Verify you see the greeting message in the Serial Monitor tab.',
        completed: false,
        type: 'serial_output'
      }
    ],
    quiz: [
      {
        id: 'q1-1',
        question: 'What is the clock speed of the quartz crystal on the Arduino Uno?',
        options: ['8 MHz', '16 MHz', '32 MHz', '48 MHz'],
        correctIndex: 1,
        explanation: 'The ATmega328P on the Uno runs at 16 MHz, executing up to 16 million instructions per second.'
      },
      {
        id: 'q1-2',
        question: 'Which digital pin is tied to the on-board test LED labeled "L"?',
        options: ['Pin 0', 'Pin 9', 'Pin 13', 'Pin A0'],
        correctIndex: 2,
        explanation: 'Pin 13 is internally connected via an on-board resistor or op-amp buffer to the yellow LED labeled "L".'
      }
    ],
    troubleshootingTips: [
      'Ensure baud rate is set to 9600 in the Serial Monitor to match Serial.begin(9600).',
      'Remember setup() executes once at boot, while loop() runs repeatedly.'
    ]
  },
  {
    id: 'lesson-2',
    number: 2,
    title: 'Blink an LED',
    category: 'basics',
    categoryLabel: 'BASICS',
    difficulty: 'Beginner',
    xpReward: 120,
    estimatedMinutes: 8,
    description: 'Wire an external Light Emitting Diode (LED) with a 220-ohm current-limiting resistor to digital pin 8 and write your first output sketch.',
    summary: 'LEDs are polarized semiconductor devices. Current flows only from the anode (longer lead / positive) to the cathode (shorter lead / flat side). A series resistor is always required to prevent excessive current.',
    hardwareParts: ['Arduino Uno R3', 'Half Breadboard', '5mm Red LED', '220Ω Resistor', 'Jumper Wires'],
    learningGoals: [
      'Understand LED polarity: Anode (+) vs Cathode (-)',
      'Calculate current limit using Ohm’s law: R = (5V - 2V) / 0.015A ≈ 200Ω',
      'Use pinMode(pin, OUTPUT) and digitalWrite(pin, HIGH/LOW)',
      'Use delay() for temporal pulse control'
    ],
    schematicDescription: 'Arduino Pin 8 -> 220Ω Resistor -> LED Anode (+); LED Cathode (-) -> Arduino GND.',
    codeSnippet: `// Lesson 2: External LED Blink
const int ledPin = 8; // External LED on Digital Pin 8

void setup() {
  // Configure pin 8 as an output
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("External LED Blink Initialized");
}

void loop() {
  digitalWrite(ledPin, HIGH); // Turn LED ON (5V)
  delay(500);                 // Wait 500 milliseconds
  digitalWrite(ledPin, LOW);  // Turn LED OFF (0V)
  delay(500);                 // Wait 500 milliseconds
}`,
    precompiledHex: PRECOMPILED_HEX['lesson-2'],
    initialCircuit: {
      components: [
        {
          id: 'uno-1',
          type: 'arduino_uno',
          name: 'Arduino Uno R3',
          x: 100,
          y: 120,
          rotation: 0,
          properties: {}
        },
        {
          id: 'bb-1',
          type: 'breadboard',
          name: 'Half Breadboard',
          x: 480,
          y: 120,
          rotation: 0,
          properties: {}
        },
        {
          id: 'led-1',
          type: 'led',
          name: 'Red LED',
          x: 520,
          y: 180,
          rotation: 0,
          properties: { color: 'red', brightness: 0 }
        },
        {
          id: 'res-1',
          type: 'resistor',
          name: '220Ω Resistor',
          x: 520,
          y: 250,
          rotation: 0,
          properties: { resistance: 220 }
        }
      ],
      wires: [
        {
          id: 'w-1',
          fromComponentId: 'uno-1',
          fromPinId: 'd8',
          toComponentId: 'res-1',
          toPinId: 'pin1',
          color: '#10B981'
        },
        {
          id: 'w-2',
          fromComponentId: 'res-1',
          fromPinId: 'pin2',
          toComponentId: 'led-1',
          toPinId: 'anode',
          color: '#10B981'
        },
        {
          id: 'w-3',
          fromComponentId: 'led-1',
          toPinId: 'gnd1',
          toComponentId: 'uno-1',
          fromPinId: 'cathode',
          color: '#1F2937'
        }
      ]
    },
    checkpoints: [
      {
        id: 'cp2-1',
        titleKey: 'Examine Resistor Color Bands',
        descriptionKey: 'Click on the resistor to inspect its Red-Red-Brown (220Ω) color code.',
        completed: false,
        type: 'observe_pin'
      },
      {
        id: 'cp2-2',
        titleKey: 'Observe External LED',
        descriptionKey: 'Start simulation and watch the red LED illuminate and cycle on pin 8.',
        completed: false,
        type: 'observe_pin',
        targetPin: 8
      }
    ],
    quiz: [
      {
        id: 'q2-1',
        question: 'What happens if you connect a 5mm LED directly to 5V without a resistor?',
        options: [
          'It glows brighter and operates normally',
          'Excess current burns out the LED and can damage the microcontroller pin',
          'The Arduino automatically limits current through software',
          'The LED changes color to blue'
        ],
        correctIndex: 1,
        explanation: 'LEDs have almost zero internal resistance once their forward voltage is reached. Connecting directly to 5V causes an overcurrent condition that destroys the diode.'
      }
    ],
    troubleshootingTips: [
      'If the LED does not glow, verify anode is wired towards Pin 8 and cathode towards GND.',
      'Always power down the board or stop simulation before rewiring.'
    ]
  },
  {
    id: 'lesson-3',
    number: 3,
    title: 'Push a Button',
    category: 'basics',
    categoryLabel: 'BASICS',
    difficulty: 'Beginner',
    xpReward: 140,
    estimatedMinutes: 10,
    description: 'Read digital input from a momentary push button using the ATmega328P internal pull-up resistor (INPUT_PULLUP) and control an LED.',
    summary: 'A floating digital pin fluctuates randomly due to electromagnetic noise. Using INPUT_PULLUP connects an internal 20k-50kΩ resistor to 5V, ensuring a reliable HIGH when open and LOW when pressed.',
    hardwareParts: ['Arduino Uno R3', 'Breadboard', 'Tactile Push Button', 'LED', '220Ω Resistor'],
    learningGoals: [
      'Understand floating pins vs defined digital states',
      'Use pinMode(pin, INPUT_PULLUP)',
      'Read digital states with digitalRead(pin)',
      'Implement active-low logic: LOW = Pressed, HIGH = Released'
    ],
    schematicDescription: 'Push button pin 1 -> Arduino Pin 2; Push button pin 2 -> GND. Arduino Pin 8 -> Resistor -> LED -> GND.',
    codeSnippet: `// Lesson 3: Push Button with Internal Pull-up
const int buttonPin = 2; // Button connected to pin 2 and GND
const int ledPin = 8;    // Indicator LED on pin 8

void setup() {
  // Use internal pull-up: Pin reads HIGH when released, LOW when pressed
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int buttonState = digitalRead(buttonPin);
  
  if (buttonState == LOW) {
    // Button is actively pressed down
    digitalWrite(ledPin, HIGH);
    Serial.println("Button PRESSED -> LED ON");
  } else {
    // Button is released
    digitalWrite(ledPin, LOW);
  }
  delay(50); // Simple debouncing delay
}`,
    precompiledHex: PRECOMPILED_HEX['lesson-3'],
    initialCircuit: {
      components: [
        {
          id: 'uno-1',
          type: 'arduino_uno',
          name: 'Arduino Uno R3',
          x: 100,
          y: 120,
          rotation: 0,
          properties: {}
        },
        {
          id: 'btn-1',
          type: 'button',
          name: 'Tactile Button',
          x: 480,
          y: 140,
          rotation: 0,
          properties: { isPressed: false }
        },
        {
          id: 'led-1',
          type: 'led',
          name: 'Green LED',
          x: 480,
          y: 260,
          rotation: 0,
          properties: { color: 'green', brightness: 0 }
        },
        {
          id: 'res-1',
          type: 'resistor',
          name: '220Ω Resistor',
          x: 480,
          y: 340,
          rotation: 0,
          properties: { resistance: 220 }
        }
      ],
      wires: [
        { id: 'w-btn-sig', fromComponentId: 'uno-1', fromPinId: 'd2', toComponentId: 'btn-1', toPinId: 'pin1', color: '#3B82F6' },
        { id: 'w-btn-gnd', fromComponentId: 'btn-1', fromPinId: 'pin2', toComponentId: 'uno-1', toPinId: 'gnd1', color: '#1F2937' },
        { id: 'w-led-sig', fromComponentId: 'uno-1', fromPinId: 'd8', toComponentId: 'res-1', toPinId: 'pin1', color: '#10B981' },
        { id: 'w-res-led', fromComponentId: 'res-1', fromPinId: 'pin2', toComponentId: 'led-1', toPinId: 'anode', color: '#10B981' },
        { id: 'w-led-gnd', fromComponentId: 'led-1', fromPinId: 'cathode', toComponentId: 'uno-1', toPinId: 'gnd2', color: '#1F2937' }
      ]
    },
    checkpoints: [
      {
        id: 'cp3-1',
        titleKey: 'Press the Push Button',
        descriptionKey: 'Click on the tactile button in the simulator canvas while simulation is running.',
        completed: false,
        type: 'change_input'
      },
      {
        id: 'cp3-2',
        titleKey: 'Observe State Flip',
        descriptionKey: 'Verify digital pin 2 reads LOW and LED on pin 8 illuminates.',
        completed: false,
        type: 'observe_pin',
        targetPin: 8
      }
    ],
    quiz: [
      {
        id: 'q3-1',
        question: 'When a pin is configured with INPUT_PULLUP and the button to GND is NOT pressed, what does digitalRead() return?',
        options: ['LOW (0)', 'HIGH (1)', 'Floating (undefined)', '512'],
        correctIndex: 1,
        explanation: 'The internal pull-up resistor pulls the pin voltage up to 5V (HIGH) when no path to GND is closed.'
      }
    ],
    troubleshootingTips: [
      'If your button reads reversed logic, remember that active-low buttons return LOW when pressed.',
      'Mechanical buttons bounce on contact; a 10-50ms delay helps filter bounce noise.'
    ]
  },
  {
    id: 'lesson-4',
    number: 4,
    title: 'Turn a Knob',
    category: 'sensors',
    categoryLabel: 'ANALOG & PWM',
    difficulty: 'Beginner',
    xpReward: 160,
    estimatedMinutes: 12,
    description: 'Use a 10k potentiometer as an analog voltage divider, read values from 0-1023 using the 10-bit ADC, and control LED brightness with 8-bit PWM (analogWrite).',
    summary: 'The ATmega328P has a 10-bit Successive Approximation ADC that converts 0-5V into an integer from 0 to 1023. We map this 0-1023 range to 0-255 to drive Pulse Width Modulation (PWM) on pin 9.',
    hardwareParts: ['Arduino Uno R3', '10kΩ Potentiometer', 'LED', '220Ω Resistor', 'Jumper Wires'],
    learningGoals: [
      'Learn how voltage dividers work',
      'Read analog inputs with analogRead(A0)',
      'Map values with map(val, 0, 1023, 0, 255)',
      'Control LED intensity using PWM and analogWrite(pin, val)'
    ],
    schematicDescription: 'Potentiometer: Pin 1 -> 5V, Pin 2 (Wiper) -> A0, Pin 3 -> GND. LED: Pin 9 (PWM) -> 220Ω Resistor -> LED -> GND.',
    codeSnippet: `// Lesson 4: Potentiometer to PWM Dimming
const int potPin = A0; // Potentiometer wiper on A0
const int ledPin = 9;  // PWM-capable pin 9

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Read 10-bit ADC (0 to 1023)
  int sensorValue = analogRead(potPin);
  
  // Convert 10-bit input (0-1023) to 8-bit PWM duty cycle (0-255)
  int brightness = map(sensorValue, 0, 1023, 0, 255);
  
  // Output PWM wave
  analogWrite(ledPin, brightness);
  
  Serial.print("ADC: ");
  Serial.print(sensorValue);
  Serial.print(" -> Brightness: ");
  Serial.println(brightness);
  
  delay(30);
}`,
    precompiledHex: PRECOMPILED_HEX['lesson-4'],
    initialCircuit: {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 120, rotation: 0, properties: {} },
        { id: 'pot-1', type: 'potentiometer', name: '10k Potentiometer', x: 450, y: 120, rotation: 0, properties: { value: 512 } },
        { id: 'led-1', type: 'led', name: 'Blue LED', x: 450, y: 260, rotation: 0, properties: { color: 'blue', brightness: 0.5 } },
        { id: 'res-1', type: 'resistor', name: '220Ω Resistor', x: 450, y: 340, rotation: 0, properties: { resistance: 220 } }
      ],
      wires: [
        { id: 'w-p1', fromComponentId: 'uno-1', fromPinId: '5v', toComponentId: 'pot-1', toPinId: 'vcc', color: '#DC2626' },
        { id: 'w-p2', fromComponentId: 'uno-1', fromPinId: 'gnd1', toComponentId: 'pot-1', toPinId: 'gnd', color: '#1F2937' },
        { id: 'w-p3', fromComponentId: 'uno-1', fromPinId: 'a0', toComponentId: 'pot-1', toPinId: 'wiper', color: '#F59E0B' },
        { id: 'w-l1', fromComponentId: 'uno-1', fromPinId: 'd9', toComponentId: 'res-1', toPinId: 'pin1', color: '#14B8A6' },
        { id: 'w-l2', fromComponentId: 'res-1', fromPinId: 'pin2', toComponentId: 'led-1', toPinId: 'anode', color: '#14B8A6' },
        { id: 'w-l3', fromComponentId: 'led-1', fromPinId: 'cathode', toComponentId: 'uno-1', toPinId: 'gnd2', color: '#1F2937' }
      ]
    },
    checkpoints: [
      {
        id: 'cp4-1',
        titleKey: 'Rotate Potentiometer',
        descriptionKey: 'Drag the knob or slider to adjust wiper voltage between 0V and 5V.',
        completed: false,
        type: 'change_input'
      },
      {
        id: 'cp4-2',
        titleKey: 'Observe Duty Cycle',
        descriptionKey: 'Notice the blue LED brightness smoothly adjust in real-time.',
        completed: false,
        type: 'observe_pin',
        targetPin: 9
      }
    ],
    quiz: [
      {
        id: 'q4-1',
        question: 'What is the resolution of the Arduino Uno analog-to-digital converter (ADC)?',
        options: ['8-bit (0-255)', '10-bit (0-1023)', '12-bit (0-4095)', '16-bit (0-65535)'],
        correctIndex: 1,
        explanation: 'The ATmega328P has a 10-bit ADC, meaning it divides 0-5V into 2^10 = 1024 discrete steps (0 to 1023).'
      }
    ],
    troubleshootingTips: [
      'Remember that analogRead() returns 0-1023, while analogWrite() accepts 0-255.',
      'Only pins marked with a tilde ~ (3, 5, 6, 9, 10, 11) support PWM analogWrite().'
    ]
  },
  {
    id: 'lesson-5',
    number: 5,
    title: 'Mix Colours',
    category: 'actuators',
    categoryLabel: 'COLOR & LIGHT',
    difficulty: 'Beginner',
    xpReward: 160,
    estimatedMinutes: 12,
    description: 'Control a Common Cathode RGB LED using three PWM pins (9, 10, 11) to blend red, green, and blue light channels into any color in the visible spectrum.',
    summary: 'An RGB LED houses three distinct diodes (Red, Green, Blue) in a single housing. By varying the PWM duty cycle on each pin independently, you produce over 16.7 million additive color combinations.',
    hardwareParts: ['Arduino Uno R3', 'Common Cathode RGB LED', '3x 220Ω Resistors', 'Breadboard'],
    learningGoals: [
      'Differentiate common cathode (shared GND) vs common anode (shared 5V)',
      'Drive multi-channel PWM outputs concurrently',
      'Create smooth color transitions with algorithmic sine waves',
      'Write reusable functions with parameter arguments'
    ],
    schematicDescription: 'Pins 9 (R), 10 (G), 11 (B) -> 220Ω resistors -> RGB LED pins; Cathode -> GND.',
    codeSnippet: `// Lesson 5: RGB LED Color Mixing
const int redPin = 9;
const int greenPin = 10;
const int bluePin = 11;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
}

void setColor(int red, int green, int blue) {
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);
}

void loop() {
  // Red
  setColor(255, 0, 0);
  delay(800);
  // Green
  setColor(0, 255, 0);
  delay(800);
  // Blue
  setColor(0, 0, 255);
  delay(800);
  // Purple (Red + Blue)
  setColor(180, 0, 255);
  delay(800);
  // Cyan (Green + Blue)
  setColor(0, 255, 255);
  delay(800);
  // Warm White
  setColor(255, 180, 100);
  delay(800);
}`,
    precompiledHex: PRECOMPILED_HEX['lesson-5'],
    initialCircuit: {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 120, rotation: 0, properties: {} },
        { id: 'rgb-1', type: 'rgb_led', name: 'RGB LED', x: 450, y: 180, rotation: 0, properties: { r: 255, g: 0, b: 0 } }
      ],
      wires: [
        { id: 'w-r', fromComponentId: 'uno-1', fromPinId: 'd9', toComponentId: 'rgb-1', toPinId: 'r', color: '#EF4444' },
        { id: 'w-g', fromComponentId: 'uno-1', fromPinId: 'd10', toComponentId: 'rgb-1', toPinId: 'g', color: '#10B981' },
        { id: 'w-b', fromComponentId: 'uno-1', fromPinId: 'd11', toComponentId: 'rgb-1', toPinId: 'b', color: '#3B82F6' },
        { id: 'w-c', fromComponentId: 'rgb-1', fromPinId: 'cathode', toComponentId: 'uno-1', toPinId: 'gnd1', color: '#1F2937' }
      ]
    },
    checkpoints: [
      {
        id: 'cp5-1',
        titleKey: 'Observe Color Cycling',
        descriptionKey: 'Watch the simulated RGB diode morph through primary and secondary hues.',
        completed: false,
        type: 'observe_pin',
        targetPin: 9
      }
    ],
    quiz: [
      {
        id: 'q5-1',
        question: 'Which pin is typically the longest pin on a 4-lead RGB LED package?',
        options: ['Red lead', 'Common lead (Cathode or Anode)', 'Blue lead', 'Green lead'],
        correctIndex: 1,
        explanation: 'The common cathode/anode lead is manufactured longer than the other three pins so you can easily identify orientation.'
      }
    ],
    troubleshootingTips: [
      'If your colors appear inverted (e.g. 255 is dark and 0 is bright), you may have a Common Anode RGB LED instead of Common Cathode.'
    ]
  },
  {
    id: 'lesson-6',
    number: 6,
    title: 'Buzzer & Sound',
    category: 'actuators',
    categoryLabel: 'AUDIO & FREQUENCY',
    difficulty: 'Beginner',
    xpReward: 160,
    estimatedMinutes: 10,
    description: 'Synthesize musical tones and audio alerts using a piezo buzzer and the Arduino tone() and noTone() functions, rendered directly through the Web Audio API.',
    summary: 'A piezoelectric element flexes when an alternating voltage is applied, creating acoustic pressure waves in the air. The tone() function uses hardware timers to generate a square wave of precise frequencies.',
    hardwareParts: ['Arduino Uno R3', 'Piezo Buzzer', '100Ω Resistor', 'Jumper Wires'],
    learningGoals: [
      'Understand frequency in Hertz (cycles per second)',
      'Use tone(pin, frequency, duration)',
      'Silence audio with noTone(pin)',
      'Synthesize musical melody arrays and note durations'
    ],
    schematicDescription: 'Buzzer positive (+) -> Digital Pin 8; Buzzer negative (-) -> GND.',
    codeSnippet: `// Lesson 6: Piezo Melodies and Tone Generation
const int buzzerPin = 8;

// Note frequencies in Hz
#define NOTE_C4 262
#define NOTE_E4 330
#define NOTE_G4 392
#define NOTE_C5 523

int melody[] = { NOTE_C4, NOTE_E4, NOTE_G4, NOTE_C5 };
int noteDurations[] = { 200, 200, 200, 400 };

void setup() {
  Serial.begin(9600);
  Serial.println("Playing fanfare melody...");
  
  for (int i = 0; i < 4; i++) {
    tone(buzzerPin, melody[i], noteDurations[i]);
    delay(noteDurations[i] * 1.3); // Short pause between notes
  }
  noTone(buzzerPin);
}

void loop() {
  // Idle after melody plays
}`,
    precompiledHex: PRECOMPILED_HEX['lesson-6'],
    initialCircuit: {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 120, rotation: 0, properties: {} },
        { id: 'buzzer-1', type: 'buzzer', name: 'Piezo Buzzer', x: 450, y: 180, rotation: 0, properties: { frequency: 440, active: false } }
      ],
      wires: [
        { id: 'w-bz-pos', fromComponentId: 'uno-1', fromPinId: 'd8', toComponentId: 'buzzer-1', toPinId: 'pos', color: '#F59E0B' },
        { id: 'w-bz-neg', fromComponentId: 'buzzer-1', fromPinId: 'neg', toComponentId: 'uno-1', toPinId: 'gnd1', color: '#1F2937' }
      ]
    },
    checkpoints: [
      {
        id: 'cp6-1',
        titleKey: 'Listen to Web Audio',
        descriptionKey: 'Ensure your speakers or headphones are enabled and click RUN to hear the synthesized notes.',
        completed: false,
        type: 'run_simulation'
      }
    ],
    quiz: [
      {
        id: 'q6-1',
        question: 'What type of electronic wave does the Arduino tone() function generate?',
        options: ['Pure Sine wave', 'Square wave', 'Triangle wave', 'Sawtooth wave'],
        correctIndex: 1,
        explanation: 'tone() toggles a digital pin between HIGH and LOW at the specified frequency, creating a 50% duty cycle square wave.'
      }
    ],
    troubleshootingTips: [
      'Active buzzers have an internal oscillator and beep at a fixed tone; passive buzzers allow you to produce custom melodies at any frequency.'
    ]
  },
  {
    id: 'lesson-7',
    number: 7,
    title: 'Light Sensor',
    category: 'sensors',
    categoryLabel: 'ENVIRONMENTAL SENSORS',
    difficulty: 'Beginner',
    xpReward: 160,
    estimatedMinutes: 12,
    description: 'Interface a Light Dependent Resistor (LDR photoresistor) in a voltage divider circuit to build an automatic dark-detecting nightlight.',
    summary: 'Photoresistors decrease resistance as incident light increases (cadmium sulfide semiconductor effect). Paired with a 10k fixed resistor, the voltage at the junction varies with illumination.',
    hardwareParts: ['Arduino Uno R3', 'LDR Photoresistor', '10kΩ Resistor', 'LED', '220Ω Resistor'],
    learningGoals: [
      'Construct a sensor voltage divider',
      'Calibrate analog thresholds for ambient light levels',
      'Implement threshold detection logic (if/else)',
      'Build an autonomous nightlight system'
    ],
    schematicDescription: '5V -> LDR -> Junction -> 10kΩ Resistor -> GND. Junction -> Pin A0. LED -> Pin 12.',
    codeSnippet: `// Lesson 7: Automatic Light Sensor Nightlight
const int sensorPin = A0; // LDR voltage divider on A0
const int ledPin = 12;    // Nightlight LED on Pin 12
const int threshold = 500; // Darkness threshold

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int lightLevel = analogRead(sensorPin);
  Serial.print("Ambient Light: ");
  Serial.println(lightLevel);
  
  if (lightLevel < threshold) {
    // Dark condition: Turn on nightlight
    digitalWrite(ledPin, HIGH);
  } else {
    // Bright condition: Turn off nightlight
    digitalWrite(ledPin, LOW);
  }
  delay(100);
}`,
    precompiledHex: PRECOMPILED_HEX['lesson-7'],
    initialCircuit: {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 120, rotation: 0, properties: {} },
        { id: 'ldr-1', type: 'ldr', name: 'Photoresistor (LDR)', x: 450, y: 140, rotation: 0, properties: { value: 650 } },
        { id: 'led-1', type: 'led', name: 'Yellow LED', x: 450, y: 260, rotation: 0, properties: { color: 'yellow', brightness: 0 } }
      ],
      wires: [
        { id: 'w-ldr-vcc', fromComponentId: 'uno-1', fromPinId: '5v', toComponentId: 'ldr-1', toPinId: 'pin1', color: '#DC2626' },
        { id: 'w-ldr-sig', fromComponentId: 'ldr-1', fromPinId: 'pin2', toComponentId: 'uno-1', toPinId: 'a0', color: '#06B6D4' },
        { id: 'w-led-sig', fromComponentId: 'uno-1', fromPinId: 'd12', toComponentId: 'led-1', toPinId: 'anode', color: '#10B981' },
        { id: 'w-led-gnd', fromComponentId: 'led-1', fromPinId: 'cathode', toComponentId: 'uno-1', toPinId: 'gnd1', color: '#1F2937' }
      ]
    },
    checkpoints: [
      {
        id: 'cp7-1',
        titleKey: 'Adjust Light Slider',
        descriptionKey: 'Use the interactive sun/moon slider on the LDR to simulate shadows and bright room lighting.',
        completed: false,
        type: 'change_input'
      }
    ],
    quiz: [
      {
        id: 'q7-1',
        question: 'How does an LDR resistance respond when light shines onto it?',
        options: [
          'Resistance increases',
          'Resistance decreases',
          'Resistance stays constant',
          'It generates AC current'
        ],
        correctIndex: 1,
        explanation: 'Photons excite electrons into the conduction band of the photo-conductive material, lowering its electrical resistance.'
      }
    ],
    troubleshootingTips: [
      'Different rooms have different ambient light. Open the Serial Monitor to observe real readings and fine-tune your threshold variable.'
    ]
  },
  {
    id: 'lesson-8',
    number: 8,
    title: 'Servo Motor',
    category: 'actuators',
    categoryLabel: 'MECHANICAL ACTUATORS',
    difficulty: 'Intermediate',
    xpReward: 180,
    estimatedMinutes: 15,
    description: 'Control a precision SG90 micro-servo motor across 0° to 180° using standard servo pulse-width modulation signals.',
    summary: 'Servo motors contain a DC motor, reduction gear train, potentiometer, and error amplifier. Sending pulses of 1000µs to 2000µs every 20ms commands the shaft to hold an exact angular position.',
    hardwareParts: ['Arduino Uno R3', 'SG90 Micro Servo', 'External 5V supply / Uno 5V', 'Jumper Wires'],
    learningGoals: [
      'Understand servo PWM control pulses (1ms = 0°, 1.5ms = 90°, 2ms = 180°)',
      'Use the Arduino Servo library (<Servo.h>) or direct PWM',
      'Sweep angles smoothly with for-loops',
      'Prevent current brownouts when driving motors'
    ],
    schematicDescription: 'Servo: Brown (GND) -> GND; Red (VCC) -> 5V; Orange/Yellow (Signal) -> Pin 9.',
    codeSnippet: `// Lesson 8: Servo Motor Position Sweep
// Direct PWM simulation equivalent to Servo library

const int servoPin = 9;

void setServoAngle(int pin, int angle) {
  // Convert 0-180 degrees to microsecond pulse (1000us - 2000us)
  int pulseWidth = map(angle, 0, 180, 1000, 2000);
  digitalWrite(pin, HIGH);
  delayMicroseconds(pulseWidth);
  digitalWrite(pin, LOW);
  delay(18); // 50 Hz frame refresh
}

void setup() {
  pinMode(servoPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Servo sweeping 0 to 180 degrees...");
}

void loop() {
  // Sweep from 0 to 180 degrees
  for (int pos = 0; pos <= 180; pos += 15) {
    setServoAngle(servoPin, pos);
    delay(30);
  }
  // Sweep back from 180 to 0 degrees
  for (int pos = 180; pos >= 0; pos -= 15) {
    setServoAngle(servoPin, pos);
    delay(30);
  }
}`,
    precompiledHex: PRECOMPILED_HEX['lesson-8'],
    initialCircuit: {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 120, rotation: 0, properties: {} },
        { id: 'servo-1', type: 'servo', name: 'SG90 Micro Servo', x: 450, y: 180, rotation: 0, properties: { angle: 90 } }
      ],
      wires: [
        { id: 'w-srv-vcc', fromComponentId: 'uno-1', fromPinId: '5v', toComponentId: 'servo-1', toPinId: 'vcc', color: '#DC2626' },
        { id: 'w-srv-gnd', fromComponentId: 'uno-1', fromPinId: 'gnd1', toComponentId: 'servo-1', toPinId: 'gnd', color: '#1F2937' },
        { id: 'w-srv-sig', fromComponentId: 'uno-1', fromPinId: 'd9', toComponentId: 'servo-1', toPinId: 'signal', color: '#F97316' }
      ]
    },
    checkpoints: [
      {
        id: 'cp8-1',
        titleKey: 'Observe Servo Arm Rotation',
        descriptionKey: 'Watch the virtual servo horn swing smoothly between its physical limits.',
        completed: false,
        type: 'observe_pin',
        targetPin: 9
      }
    ],
    quiz: [
      {
        id: 'q8-1',
        question: 'What typical pulse width centers a hobby servo motor at 90 degrees?',
        options: ['0.5 milliseconds (500 µs)', '1.5 milliseconds (1500 µs)', '5.0 milliseconds (5000 µs)', '10 milliseconds (10000 µs)'],
        correctIndex: 1,
        explanation: 'Standard hobby servos use a 1.5ms pulse width at 50Hz to center the shaft at 90 degrees.'
      }
    ],
    troubleshootingTips: [
      'High-torque or multiple servos can draw more current than the Arduino 5V regulator can supply, causing MCU resets. Use an external battery or power supply with shared grounds.'
    ]
  },
  {
    id: 'lesson-9',
    number: 9,
    title: 'Serial Monitor',
    category: 'communication',
    categoryLabel: 'COMMUNICATION & DEBUGGING',
    difficulty: 'Intermediate',
    xpReward: 180,
    estimatedMinutes: 12,
    description: 'Master bidirectional asynchronous serial communication (UART) between your computer and the Arduino microcontroller.',
    summary: 'UART uses two data lines: TX (Transmitter) and RX (Receiver). You can send diagnostic print statements to inspect variables in real time and send command characters from your keyboard to control board hardware.',
    hardwareParts: ['Arduino Uno R3', 'USB Cable'],
    learningGoals: [
      'Initialize hardware UART with Serial.begin(baud)',
      'Format output with Serial.print() and Serial.println()',
      'Check for incoming bytes using Serial.available()',
      'Read and parse incoming keyboard commands with Serial.read()'
    ],
    schematicDescription: 'Uses onboard USB interface connected to ATmega328P pins D0 (RX) and D1 (TX).',
    codeSnippet: `// Lesson 9: Bidirectional Serial Console
const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Type '1' to turn LED ON, '0' to turn OFF:");
}

void loop() {
  // Check if character arrived from computer
  if (Serial.available() > 0) {
    char receivedChar = Serial.read();
    
    if (receivedChar == '1') {
      digitalWrite(ledPin, HIGH);
      Serial.println("Command acknowledged: LED is ON");
    } else if (receivedChar == '0') {
      digitalWrite(ledPin, LOW);
      Serial.println("Command acknowledged: LED is OFF");
    } else if (receivedChar != '\\n' && receivedChar != '\\r') {
      Serial.print("Unknown command: '");
      Serial.print(receivedChar);
      Serial.println("'. Send 1 or 0.");
    }
  }
}`,
    precompiledHex: PRECOMPILED_HEX['lesson-9'],
    initialCircuit: {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 200, y: 120, rotation: 0, properties: {} }
      ],
      wires: []
    },
    checkpoints: [
      {
        id: 'cp9-1',
        titleKey: 'Send "1" in Serial Monitor',
        descriptionKey: 'Open the Serial Monitor tab, type "1" into the input box and press Send.',
        completed: false,
        type: 'serial_output'
      }
    ],
    quiz: [
      {
        id: 'q9-1',
        question: 'What does Serial.available() return?',
        options: [
          'True if the serial cable is plugged in',
          'The number of bytes currently stored in the incoming serial buffer',
          'The baud rate in bits per second',
          'The pin number of RX'
        ],
        correctIndex: 1,
        explanation: 'Serial.available() returns the integer count of bytes already received and waiting in the 64-byte ring buffer.'
      }
    ],
    troubleshootingTips: [
      'Ensure both sides use identical baud rates; mismatched baud rates result in garbled characters.'
    ]
  },
  {
    id: 'lesson-10',
    number: 10,
    title: 'Ultrasonic Distance',
    category: 'sensors',
    categoryLabel: 'RANGEFINDERS & ROBOTICS',
    difficulty: 'Intermediate',
    xpReward: 200,
    estimatedMinutes: 15,
    description: 'Interface an HC-SR04 ultrasonic sonar sensor to measure target distances from 2cm to 400cm by timing the speed of sound.',
    summary: 'The HC-SR04 emits an 8-cycle ultrasonic burst at 40 kHz. It pulls the ECHO pin HIGH for the round-trip duration. Using distance = (duration * 0.0343 cm/µs) / 2, we calculate centimeter accuracy.',
    hardwareParts: ['Arduino Uno R3', 'HC-SR04 Ultrasonic Sensor', 'Jumper Wires'],
    learningGoals: [
      'Understand time-of-flight distance calculation',
      'Generate a 10µs trigger pulse on TRIG',
      'Measure pulse duration using pulseIn(ECHO, HIGH)',
      'Account for speed of sound: 343 m/s = 0.0343 cm/µs'
    ],
    schematicDescription: 'HC-SR04: VCC -> 5V, GND -> GND, TRIG -> Pin 12, ECHO -> Pin 11.',
    codeSnippet: `// Lesson 10: HC-SR04 Ultrasonic Sonar
const int trigPin = 12;
const int echoPin = 11;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  // Clear trigger
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  
  // Send 10 microsecond HIGH pulse to start sonar burst
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Read echo pulse duration in microseconds
  long duration = pulseIn(echoPin, HIGH);
  
  // Calculate distance in cm: (duration * 0.034) / 2
  int distanceCm = duration * 0.034 / 2;
  
  Serial.print("Distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");
  
  delay(150);
}`,
    precompiledHex: PRECOMPILED_HEX['lesson-10'],
    initialCircuit: {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 120, rotation: 0, properties: {} },
        { id: 'sonar-1', type: 'ultrasonic', name: 'HC-SR04 Ultrasonic', x: 450, y: 160, rotation: 0, properties: { value: 45 } }
      ],
      wires: [
        { id: 'w-us-vcc', fromComponentId: 'uno-1', fromPinId: '5v', toComponentId: 'sonar-1', toPinId: 'vcc', color: '#DC2626' },
        { id: 'w-us-gnd', fromComponentId: 'uno-1', fromPinId: 'gnd1', toComponentId: 'sonar-1', toPinId: 'gnd', color: '#1F2937' },
        { id: 'w-us-trg', fromComponentId: 'uno-1', fromPinId: 'd12', toComponentId: 'sonar-1', toPinId: 'trig', color: '#3B82F6' },
        { id: 'w-us-ech', fromComponentId: 'uno-1', fromPinId: 'd11', toComponentId: 'sonar-1', toPinId: 'echo', color: '#8B5CF6' }
      ]
    },
    checkpoints: [
      {
        id: 'cp10-1',
        titleKey: 'Move Obstacle Slider',
        descriptionKey: 'Drag the virtual distance slider on the HC-SR04 component to watch centimeter values update in real-time.',
        completed: false,
        type: 'change_input'
      }
    ],
    quiz: [
      {
        id: 'q10-1',
        question: 'Why do we divide the round-trip echo pulse duration by 2 when computing distance?',
        options: [
          'Because the Arduino clock speed is 16 MHz',
          'Because the sound wave travels to the obstacle and back to the receiver',
          'To convert from inches to centimeters',
          'Because the sensor has two transducer cylinders'
        ],
        correctIndex: 1,
        explanation: 'The time measured by pulseIn() is the total round-trip flight time. The distance to the object is half of the total path traversed.'
      }
    ],
    troubleshootingTips: [
      'Objects that absorb sound (soft fabrics) or angled reflective surfaces can cause timeouts.'
    ]
  },
  {
    id: 'lesson-11',
    number: 11,
    title: 'Mini Project: Smart Security Alarm',
    category: 'projects',
    categoryLabel: 'CAPSTONE MINI PROJECT',
    difficulty: 'Intermediate',
    xpReward: 300,
    estimatedMinutes: 20,
    description: 'Combine the ultrasonic sensor, buzzer, RGB LED, and push button to build an intelligent intruder proximity alarm with auto-disarm.',
    summary: 'A complete embedded application combining inputs (ultrasonic sonar + disarm button), processing logic with hysteresis, and outputs (audio siren + RGB status beacon).',
    hardwareParts: ['Arduino Uno R3', 'HC-SR04', 'Piezo Buzzer', 'RGB LED', 'Tactile Button', 'Resistors', 'Breadboard'],
    learningGoals: [
      'Architect a state machine (ARMED, ALERT, DISARMED)',
      'Combine multiple sensors and actuators in a unified event loop',
      'Handle asynchronous button presses without blocking delay()',
      'Earn the Arduino Basics Certification upon completion'
    ],
    schematicDescription: 'HC-SR04 on Pins 12 & 11; Buzzer on Pin 8; RGB LED on Pins 9, 10; Push Button on Pin 2.',
    codeSnippet: `// Lesson 11: Capstone Smart Security System
const int trigPin = 12;
const int echoPin = 11;
const int buzzerPin = 8;
const int redLedPin = 9;
const int greenLedPin = 10;
const int buttonPin = 2;

enum SystemState { ARMED, INTRUDER_ALERT, DISARMED };
SystemState state = ARMED;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(redLedPin, OUTPUT);
  pinMode(greenLedPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  Serial.begin(9600);
  Serial.println("Smart Security Alarm Armed!");
}

int getDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long dur = pulseIn(echoPin, HIGH);
  return dur * 0.034 / 2;
}

void loop() {
  // Check disarm button
  if (digitalRead(buttonPin) == LOW) {
    state = (state == DISARMED) ? ARMED : DISARMED;
    Serial.println(state == ARMED ? "System RE-ARMED" : "System DISARMED");
    delay(300);
  }

  if (state == ARMED) {
    digitalWrite(greenLedPin, HIGH);
    digitalWrite(redLedPin, LOW);
    noTone(buzzerPin);
    
    int dist = getDistance();
    if (dist > 0 && dist < 30) { // Intruder within 30cm
      state = INTRUDER_ALERT;
      Serial.println("ALERT! Proximity breached!");
    }
  } else if (state == INTRUDER_ALERT) {
    digitalWrite(greenLedPin, LOW);
    digitalWrite(redLedPin, HIGH);
    tone(buzzerPin, 1000);
    delay(100);
    digitalWrite(redLedPin, LOW);
    tone(buzzerPin, 600);
    delay(100);
  } else if (state == DISARMED) {
    digitalWrite(greenLedPin, LOW);
    digitalWrite(redLedPin, LOW);
    noTone(buzzerPin);
  }
}`,
    precompiledHex: PRECOMPILED_HEX['lesson-11'],
    initialCircuit: {
      components: [
        { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 80, y: 120, rotation: 0, properties: {} },
        { id: 'sonar-1', type: 'ultrasonic', name: 'HC-SR04', x: 420, y: 120, rotation: 0, properties: { value: 20 } },
        { id: 'buzzer-1', type: 'buzzer', name: 'Piezo Siren', x: 420, y: 220, rotation: 0, properties: { active: false } },
        { id: 'btn-1', type: 'button', name: 'Disarm Button', x: 420, y: 320, rotation: 0, properties: { isPressed: false } }
      ],
      wires: [
        { id: 'w1', fromComponentId: 'uno-1', fromPinId: 'd12', toComponentId: 'sonar-1', toPinId: 'trig', color: '#3B82F6' },
        { id: 'w2', fromComponentId: 'uno-1', fromPinId: 'd11', toComponentId: 'sonar-1', toPinId: 'echo', color: '#8B5CF6' },
        { id: 'w3', fromComponentId: 'uno-1', fromPinId: 'd8', toComponentId: 'buzzer-1', toPinId: 'pos', color: '#F59E0B' },
        { id: 'w4', fromComponentId: 'uno-1', fromPinId: 'd2', toComponentId: 'btn-1', toPinId: 'pin1', color: '#10B981' },
        { id: 'w5', fromComponentId: 'btn-1', fromPinId: 'pin2', toComponentId: 'uno-1', toPinId: 'gnd1', color: '#1F2937' },
        { id: 'w6', fromComponentId: 'buzzer-1', fromPinId: 'neg', toComponentId: 'uno-1', toPinId: 'gnd2', color: '#1F2937' }
      ]
    },
    checkpoints: [
      {
        id: 'cp11-1',
        titleKey: 'Trigger Intruder Siren',
        descriptionKey: 'Set ultrasonic distance below 30cm to activate the intrusion siren.',
        completed: false,
        type: 'run_simulation'
      },
      {
        id: 'cp11-2',
        titleKey: 'Disarm with Button',
        descriptionKey: 'Click the disarm button to silence the siren and reset status.',
        completed: false,
        type: 'change_input'
      }
    ],
    quiz: [
      {
        id: 'q11-1',
        question: 'What is a state machine in embedded firmware?',
        options: [
          'A hardware chip that supplies regulated current',
          'A programming model where the system can exist in one of several defined states and transitions between them based on events',
          'A special compiler directive for 32-bit registers',
          'A physical machine that stamps Arduino PCBs'
        ],
        correctIndex: 1,
        explanation: 'State machines allow complex reactive systems to switch deterministically between modes (e.g. Armed, Alert, Disarmed) based on sensor triggers.'
      }
    ],
    troubleshootingTips: [
      'Congratulations on reaching the capstone! You have mastered GPIO inputs, PWM outputs, analog readings, timing, and sensor integration.'
    ]
  }
];
