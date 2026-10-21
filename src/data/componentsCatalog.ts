import { ComponentCatalogItem } from '../types/component';

export const COMPONENTS_CATALOG: ComponentCatalogItem[] = [
  {
    id: 'arduino-uno-r3',
    name: 'Arduino Uno R3',
    category: 'Microcontroller',
    shortDesc: 'ATmega328P 8-bit AVR Development Board with 16 MHz Clock and USB Interface.',
    fullDesc: 'The flagship educational microcontroller board. Features 14 digital I/O pins (6 with PWM), 6 analog inputs, 16 MHz quartz crystal, USB connection, power jack, ICSP header, and a reset button.',
    pinCount: 32,
    voltageRating: '5V (Operates 7-12V DC in)',
    currentRating: '40mA max per I/O pin',
    pinout: [
      { pin: 'D0-D1', name: 'RX/TX', desc: 'Hardware UART Serial', type: 'Serial' },
      { pin: 'D2, D3', name: 'INT0/INT1', desc: 'Hardware External Interrupts', type: 'Interrupt' },
      { pin: 'D3,5,6,9,10,11', name: 'PWM', desc: '8-bit timer PWM output', type: 'PWM' },
      { pin: 'D10-D13', name: 'SPI', desc: 'SS, MOSI, MISO, SCK SPI bus', type: 'SPI' },
      { pin: 'A0-A5', name: 'Analog In', desc: '10-bit Successive Approximation ADC', type: 'Analog' },
      { pin: 'A4, A5', name: 'I2C', desc: 'SDA and SCL Two-Wire Interface', type: 'I2C' }
    ],
    datasheetSummary: {
      operatingVoltage: '5.0 V',
      maxCurrent: '200 mA total MCU package',
      interfaceType: 'USB Serial / UART / SPI / I2C',
      operatingTemp: '-40°C to +85°C',
      dimensions: '68.6 mm x 53.4 mm'
    },
    typicalApplications: ['Robotics control', 'IoT prototypes', 'Sensor telemetry', 'Automation logic'],
    circuitTips: [
      'Never draw more than 200mA total from all digital pins combined.',
      'Always supply 7-12V when powering through the DC barrel jack.'
    ],
    sampleCode: `void setup() {\n  pinMode(13, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(500);\n  digitalWrite(13, LOW);\n  delay(500);\n}`,
    simulatorType: 'arduino_uno',
    iconName: 'Cpu'
  },
  {
    id: 'led-5mm',
    name: '5mm LED (Red, Green, Blue, Yellow)',
    category: 'Output',
    shortDesc: 'Standard forward-biased semiconductor diode that emits visible light.',
    fullDesc: 'A Light Emitting Diode emits photons when current passes through the P-N junction. Standard 5mm LEDs feature a forward voltage drop of ~1.8V to 2.2V (red/yellow) or ~3.0V to 3.2V (blue/green). Requires a series current limiting resistor.',
    pinCount: 2,
    voltageRating: '1.8V - 3.2V forward drop',
    currentRating: '15mA - 20mA recommended',
    pinout: [
      { pin: 'Anode (+)', name: 'Long lead', desc: 'Connect to positive voltage via resistor', type: 'Power' },
      { pin: 'Cathode (-)', name: 'Short lead / flat rim', desc: 'Connect to ground (GND)', type: 'Ground' }
    ],
    datasheetSummary: {
      operatingVoltage: '2.0 V typ (Red)',
      maxCurrent: '25 mA continuous',
      interfaceType: 'Digital GPIO / PWM',
      operatingTemp: '-25°C to +80°C',
      dimensions: '5.0 mm diameter'
    },
    typicalApplications: ['Status indicators', 'Visual alarms', 'Optical communication', 'Backlighting'],
    circuitTips: [
      'Calculate resistor: R = (Vcc - Vf) / If. For 5V and red LED: (5V - 2.0V) / 0.015A = 200Ω. Use 220Ω standard.',
      'Connecting without a resistor will permanently destroy the diode in milliseconds!'
    ],
    sampleCode: `const int ledPin = 8;\nvoid setup() { pinMode(ledPin, OUTPUT); }\nvoid loop() {\n  digitalWrite(ledPin, HIGH);\n  delay(300);\n  digitalWrite(ledPin, LOW);\n  delay(300);\n}`,
    simulatorType: 'led',
    iconName: 'Sun'
  },
  {
    id: 'rgb-led-diffused',
    name: 'RGB LED (Common Cathode)',
    category: 'Output',
    shortDesc: 'Tri-color LED capable of generating any color via red, green, blue additive mixing.',
    fullDesc: 'Houses three separate microscopic LEDs inside a diffused 5mm lens. In a common cathode package, all three LEDs share a single ground pin.',
    pinCount: 4,
    voltageRating: '2.0V (Red), 3.2V (Green/Blue)',
    currentRating: '20mA per channel',
    pinout: [
      { pin: 'Pin 1', name: 'Red Anode', desc: 'Red channel positive control', type: 'PWM' },
      { pin: 'Pin 2', name: 'Common Cathode', desc: 'Longest lead, connect to GND', type: 'Ground' },
      { pin: 'Pin 3', name: 'Green Anode', desc: 'Green channel positive control', type: 'PWM' },
      { pin: 'Pin 4', name: 'Blue Anode', desc: 'Blue channel positive control', type: 'PWM' }
    ],
    datasheetSummary: {
      operatingVoltage: 'Red: 2.0V, Green: 3.2V, Blue: 3.2V',
      maxCurrent: '20 mA per diode',
      interfaceType: '3x PWM channels',
      operatingTemp: '-30°C to +85°C',
      dimensions: '5.0 mm diameter diffused'
    },
    typicalApplications: ['Mood lighting', 'Multi-state machine status beacons', 'Color displays'],
    circuitTips: [
      'Always use a dedicated series resistor on each anode pin, because Red has a lower forward voltage than Blue/Green.'
    ],
    sampleCode: `void setColor(int r, int g, int b) {\n  analogWrite(9, r);\n  analogWrite(10, g);\n  analogWrite(11, b);\n}`,
    simulatorType: 'rgb_led',
    iconName: 'Sparkles'
  },
  {
    id: 'tactile-button',
    name: 'Tactile Push Button',
    category: 'Input',
    shortDesc: 'Normally-open momentary mechanical switch for user input.',
    fullDesc: 'A 6x6mm momentary switch. When pressed, an internal flexible metal dome makes contact between pin pairs, completing the electrical circuit.',
    pinCount: 4,
    voltageRating: 'Up to 12V DC',
    currentRating: '50 mA max',
    pinout: [
      { pin: 'Pin 1 & 2', name: 'Terminal A', desc: 'Internally connected pin pair', type: 'Signal' },
      { pin: 'Pin 3 & 4', name: 'Terminal B', desc: 'Connected to Terminal A only when pressed', type: 'Signal' }
    ],
    datasheetSummary: {
      operatingVoltage: '1V to 12V DC',
      maxCurrent: '50 mA',
      interfaceType: 'Digital Input',
      operatingTemp: '-20°C to +70°C',
      dimensions: '6.0 x 6.0 x 5.0 mm'
    },
    typicalApplications: ['Reset triggers', 'Mode selection buttons', 'User interactive inputs'],
    circuitTips: [
      'Use pinMode(pin, INPUT_PULLUP) in software to avoid needing an external pull-up resistor.'
    ],
    sampleCode: `void setup() {\n  pinMode(2, INPUT_PULLUP);\n}\nvoid loop() {\n  if (digitalRead(2) == LOW) { /* Pressed */ }\n}`,
    simulatorType: 'button',
    iconName: 'Square'
  },
  {
    id: 'potentiometer-10k',
    name: '10k Rotary Potentiometer',
    category: 'Passive',
    shortDesc: 'Three-terminal resistor with a smooth rotating contact forming an adjustable voltage divider.',
    fullDesc: 'Provides continuous manual adjustment between 0V and 5V. As the user twists the shaft, the central wiper slides along a resistive carbon track.',
    pinCount: 3,
    voltageRating: 'Up to 50V DC',
    currentRating: '0.1W rated power dissipation',
    pinout: [
      { pin: 'Pin 1', name: 'Outer Leg 1', desc: 'Connect to 5V or GND', type: 'Power' },
      { pin: 'Pin 2', name: 'Wiper', desc: 'Variable output voltage (0 to 5V)', type: 'Analog' },
      { pin: 'Pin 3', name: 'Outer Leg 2', desc: 'Connect to opposite power rail', type: 'Ground' }
    ],
    datasheetSummary: {
      operatingVoltage: '5V recommended for Arduino',
      maxCurrent: '0.5 mA through track',
      interfaceType: 'Analog Voltage (0-5V)',
      operatingTemp: '-10°C to +70°C',
      dimensions: '16 mm diameter'
    },
    typicalApplications: ['Volume sliders', 'Motor speed controls', 'Menu navigation dials', 'Threshold calibration'],
    circuitTips: [
      'Connect pin 1 to 5V, pin 3 to GND, and center pin 2 to any Analog Pin (A0-A5).'
    ],
    sampleCode: `int sensorVal = analogRead(A0);\nint pwm = map(sensorVal, 0, 1023, 0, 255);\nanalogWrite(9, pwm);`,
    simulatorType: 'potentiometer',
    iconName: 'Sliders'
  },
  {
    id: 'servo-sg90',
    name: 'SG90 9g Micro Servo',
    category: 'Actuator',
    shortDesc: 'Lightweight rotary actuator providing 180° precise angular position control.',
    fullDesc: 'Features integrated nylon gear train, DC coreless motor, internal feedback potentiometer, and control circuit. Operates via 50 Hz PWM control pulses.',
    pinCount: 3,
    voltageRating: '4.8V - 6.0V DC',
    currentRating: '100mA idle, 650mA stall',
    pinout: [
      { pin: 'Brown / Black', name: 'GND', desc: 'System Ground (0V)', type: 'Ground' },
      { pin: 'Red', name: 'VCC', desc: 'Power supply (+5V)', type: 'Power' },
      { pin: 'Orange / Yellow', name: 'Signal', desc: 'PWM pulse input (50Hz, 1ms-2ms)', type: 'Signal' }
    ],
    datasheetSummary: {
      operatingVoltage: '4.8V - 6.0V',
      maxCurrent: '650 mA stall',
      interfaceType: 'PWM Pulse (1000µs - 2000µs)',
      operatingTemp: '-30°C to +60°C',
      dimensions: '22.2 x 11.8 x 31 mm'
    },
    typicalApplications: ['Robotic arms', 'Camera pan/tilt gimbals', 'Steering mechanisms', 'Door latches'],
    circuitTips: [
      'Always connect servo ground to Arduino ground even if using an external battery pack.'
    ],
    sampleCode: `#include <Servo.h>\nServo myServo;\nvoid setup() { myServo.attach(9); }\nvoid loop() { myServo.write(90); }`,
    simulatorType: 'servo',
    iconName: 'RotateCw'
  },
  {
    id: 'hc-sr04',
    name: 'HC-SR04 Ultrasonic Distance Sensor',
    category: 'Sensor',
    shortDesc: 'Contactless sonar rangefinder accurate from 2cm to 400cm.',
    fullDesc: 'Emits an ultrasonic sound wave at 40 kHz, listens for the reflected echo, and outputs a pulse proportional to the distance traveled.',
    pinCount: 4,
    voltageRating: '5V DC',
    currentRating: '15 mA active',
    pinout: [
      { pin: 'VCC', name: 'Power', desc: '+5V Power Rail', type: 'Power' },
      { pin: 'TRIG', name: 'Trigger', desc: '10µs pulse input initiates sonic burst', type: 'Digital' },
      { pin: 'ECHO', name: 'Echo', desc: 'Outputs HIGH pulse for round-trip duration', type: 'Digital' },
      { pin: 'GND', name: 'Ground', desc: '0V System Ground', type: 'Ground' }
    ],
    datasheetSummary: {
      operatingVoltage: '5.0 V DC',
      maxCurrent: '15 mA',
      interfaceType: 'Trigger Pulse / Echo Duration',
      operatingTemp: '-15°C to +70°C',
      dimensions: '45 x 20 x 15 mm'
    },
    typicalApplications: ['Obstacle avoidance robots', 'Liquid level measurement', 'Parking assist sensors'],
    circuitTips: [
      'Calculate distance in cm: duration_microseconds / 58.2.'
    ],
    sampleCode: `digitalWrite(trigPin, HIGH);\ndelayMicroseconds(10);\ndigitalWrite(trigPin, LOW);\nlong dur = pulseIn(echoPin, HIGH);\nint cm = dur / 58;`,
    simulatorType: 'ultrasonic',
    iconName: 'Radio'
  },
  {
    id: 'piezo-buzzer',
    name: 'Piezoelectric Audio Buzzer',
    category: 'Output',
    shortDesc: 'Acoustic transducer that generates tones and beeps across 100Hz to 10kHz.',
    fullDesc: 'Contains a piezoceramic disc bonded to a brass plate. When AC voltages are applied, mechanical vibration produces clear audible tones.',
    pinCount: 2,
    voltageRating: '3V - 12V',
    currentRating: '20 mA typ',
    pinout: [
      { pin: 'Positive (+)', name: 'Anode / Signal', desc: 'Connect to Arduino PWM pin', type: 'Signal' },
      { pin: 'Negative (-)', name: 'Cathode / GND', desc: 'Connect to Ground (0V)', type: 'Ground' }
    ],
    datasheetSummary: {
      operatingVoltage: '3.0V - 12V',
      maxCurrent: '30 mA',
      interfaceType: 'tone() frequency square wave',
      operatingTemp: '-20°C to +70°C',
      dimensions: '12 mm diameter'
    },
    typicalApplications: ['Audible alarm alerts', 'Button press feedback', '8-bit chip tunes and melodies'],
    circuitTips: [
      'Use a 100Ω resistor in series to protect the pin and moderate sound volume.'
    ],
    sampleCode: `tone(8, 440, 500); // 440 Hz (Note A4) for 500ms\ndelay(600);\nnoTone(8);`,
    simulatorType: 'buzzer',
    iconName: 'Volume2'
  },
  {
    id: 'photoresistor-ldr',
    name: 'Photoresistor (LDR GL5528)',
    category: 'Sensor',
    shortDesc: 'Light-dependent variable resistor sensitive to ambient illumination.',
    fullDesc: 'Resistance drops from ~1 MΩ in complete pitch darkness to ~1 kΩ in direct sunlight.',
    pinCount: 2,
    voltageRating: 'Up to 100V',
    currentRating: '100 mW max dissipation',
    pinout: [
      { pin: 'Pin 1', name: 'Lead 1', desc: 'Non-polarized terminal to 5V', type: 'Passive' },
      { pin: 'Pin 2', name: 'Lead 2', desc: 'Non-polarized terminal to Analog Pin + 10k resistor', type: 'Passive' }
    ],
    datasheetSummary: {
      operatingVoltage: '5V in Arduino circuit',
      maxCurrent: '1 mA',
      interfaceType: 'Analog Voltage Divider',
      operatingTemp: '-30°C to +70°C',
      dimensions: '5 mm head diameter'
    },
    typicalApplications: ['Automatic streetlights', 'Solar tracking systems', 'Camera light meters'],
    circuitTips: [
      'Pair with a 10kΩ resistor to form a standard voltage divider.'
    ],
    sampleCode: `int light = analogRead(A0);\nif (light < 400) digitalWrite(13, HIGH);`,
    simulatorType: 'ldr',
    iconName: 'Eye'
  },
  {
    id: 'lcd-1602-i2c',
    name: '16x2 Character LCD (I2C)',
    category: 'Display',
    shortDesc: 'Alphanumeric display showing 16 characters across 2 lines via PCF8574 I2C adapter.',
    fullDesc: 'Standard HD44780 LCD module equipped with an I2C backpack that reduces 16 control wires down to just 2 communication pins (SDA & SCL).',
    pinCount: 4,
    voltageRating: '5V DC',
    currentRating: '50 mA (with backlight)',
    pinout: [
      { pin: 'GND', name: 'Ground', desc: '0V System Ground', type: 'Ground' },
      { pin: 'VCC', name: 'Power', desc: '+5V Power Rail', type: 'Power' },
      { pin: 'SDA', name: 'Serial Data', desc: 'Connect to Arduino A4 (SDA)', type: 'I2C' },
      { pin: 'SCL', name: 'Serial Clock', desc: 'Connect to Arduino A5 (SCL)', type: 'I2C' }
    ],
    datasheetSummary: {
      operatingVoltage: '5.0 V',
      maxCurrent: '50 mA',
      interfaceType: 'I2C Address 0x27 or 0x3F',
      operatingTemp: '0°C to +50°C',
      dimensions: '80 x 36 x 12 mm'
    },
    typicalApplications: ['Weather stations', 'Digital clocks', 'Debugging displays', 'Menu interfaces'],
    circuitTips: [
      'Adjust the blue potentiometer on the back of the I2C module to set crystal contrast.'
    ],
    sampleCode: `#include <LiquidCrystal_I2C.h>\nLiquidCrystal_I2C lcd(0x27, 16, 2);\nvoid setup() {\n  lcd.init();\n  lcd.backlight();\n  lcd.print("Arduino Pro!");\n}`,
    simulatorType: 'lcd1602',
    iconName: 'Tv'
  }
];
