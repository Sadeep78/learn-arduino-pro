export interface DefaultSketch {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const DEFAULT_SKETCHES: DefaultSketch[] = [
  {
    id: 'blink',
    name: 'Blink Built-in LED',
    description: 'The classic "Hello World" of microcontrollers. Flashes the onboard LED L (Pin 13) at 1 Hz.',
    code: `// Classic Arduino Blink
// Turns on an LED on for one second, then off for one second, repeatedly.

void setup() {
  // initialize digital pin LED_BUILTIN (Pin 13) as an output.
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Blink sketch initiated.");
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
  Serial.println("LED: HIGH (5V)");
  delay(1000);                       // wait for a second
  digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
  Serial.println("LED: LOW (0V)");
  delay(1000);                       // wait for a second
}`
  },
  {
    id: 'fade',
    name: 'PWM LED Fading',
    description: 'Demonstrates pulse-width modulation (PWM) to produce an analog fading breathing effect.',
    code: `// PWM Fading LED on Pin 9
const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Fade in from min to max in increments of 5 points:
  for (int fadeValue = 0; fadeValue <= 255; fadeValue += 5) {
    analogWrite(ledPin, fadeValue);
    delay(30);
  }

  // Fade out from max to min in increments of 5 points:
  for (int fadeValue = 255; fadeValue >= 0; fadeValue -= 5) {
    analogWrite(ledPin, fadeValue);
    delay(30);
  }
}`
  },
  {
    id: 'serial-echo',
    name: 'Serial Command Dispatcher',
    description: 'Bidirectional UART console that echoes commands and converts strings to uppercase.',
    code: `// Bidirectional Serial Echo
void setup() {
  Serial.begin(9600);
  Serial.println("Interactive UART Console Ready. Type text below:");
}

void loop() {
  if (Serial.available() > 0) {
    String incoming = Serial.readStringUntil('\\n');
    incoming.trim();
    if (incoming.length() > 0) {
      Serial.print("Received: [");
      Serial.print(incoming);
      Serial.print("] Length: ");
      Serial.print(incoming.length());
      Serial.print(" Uppercase: ");
      incoming.toUpperCase();
      Serial.println(incoming);
    }
  }
}`
  },
  {
    id: 'ultrasonic-radar',
    name: 'Ultrasonic Sonar Radar',
    description: 'Measures distances with HC-SR04 and outputs telemetry for the Serial Plotter.',
    code: `// Sonar Rangefinder with Serial Plotter output
const int trigPin = 12;
const int echoPin = 11;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  float distance = duration * 0.034 / 2;

  // Formatted for Serial Plotter (single number or comma-separated)
  Serial.print("Distance_cm:");
  Serial.println(distance);
  delay(100);
}`
  }
];
