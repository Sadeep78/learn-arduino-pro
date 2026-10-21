import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Info,
  Cpu,
  Code2,
  ListTree,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Play,
  Search
} from 'lucide-react';
import { useUIStore, RightPanelTab } from '../../store/useUIStore';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { HOTSPOTS } from '../3d/HotspotsData';
import { ARDUINO_UNO_PINS, BOARD_SPECS } from '../../data/pinouts';

export const RightPanel: React.FC = () => {
  const { t } = useTranslation();
  const {
    rightPanelTab,
    setRightPanelTab,
    selectedHotspot,
    setSelectedHotspot,
    setActiveNav
  } = useUIStore();

  const [copiedCode, setCopiedCode] = useState(false);
  const [pinSearch, setPinSearch] = useState('');
  const [selectedPinId, setSelectedPinId] = useState<string>('d13');

  // Currently active hotspot data
  const currentHotspot =
    HOTSPOTS.find((h) => h.id === selectedHotspot) || HOTSPOTS[2]; // Default to ATmega328P

  // Example code matching current hotspot
  const getExampleCode = () => {
    switch (currentHotspot.id) {
      case 'atmega328p':
        return `// ATmega328P 16MHz Architecture Demo
void setup() {
  Serial.begin(9600);
  Serial.print("CPU Frequency (F_CPU): ");
  Serial.print(F_CPU / 1000000L);
  Serial.println(" MHz");
  
  Serial.println("Memory layout:");
  Serial.println("- Flash: 32 KB (Program instructions)");
  Serial.println("- SRAM:  2 KB (Variables & stack)");
  Serial.println("- EEPROM: 1 KB (Persistent data)");
}

void loop() {
  // Read internal temperature sensor or run tasks
  delay(2000);
}`;
      case 'digital_pins':
        return `// Digital I/O and PWM Modulation
const int outPin = 9; // PWM capable pin marked with ~

void setup() {
  pinMode(outPin, OUTPUT);
}

void loop() {
  // Fade LED brightness with 8-bit analogWrite (0 - 255)
  for (int brightness = 0; brightness <= 255; brightness += 5) {
    analogWrite(outPin, brightness);
    delay(20);
  }
  for (int brightness = 255; brightness >= 0; brightness -= 5) {
    analogWrite(outPin, brightness);
    delay(20);
  }
}`;
      case 'analog_pins':
        return `// Reading 10-bit Analog Inputs (A0 - A5)
const int sensorPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  // Returns integer 0 to 1023 (0.0V to 5.0V)
  int rawValue = analogRead(sensorPin);
  float voltage = rawValue * (5.0 / 1023.0);
  
  Serial.print("ADC Raw: ");
  Serial.print(rawValue);
  Serial.print(" -> Voltage: ");
  Serial.print(voltage, 2);
  Serial.println(" V");
  
  delay(200);
}`;
      case 'usb':
        return `// Bidirectional Serial over USB
void setup() {
  // Configure hardware UART at 9600 baud
  Serial.begin(9600);
  Serial.println("USB Serial Link Established.");
  Serial.println("Send commands via Serial Monitor!");
}

void loop() {
  if (Serial.available() > 0) {
    char c = Serial.read();
    Serial.print("Echo: ");
    Serial.println(c);
  }
}`;
      default:
        return `// Arduino Uno Default Test Routine
void setup() {
  pinMode(13, OUTPUT);
  Serial.begin(9600);
  Serial.println("Arduino Uno Ready!");
}

void loop() {
  digitalWrite(13, HIGH);
  delay(500);
  digitalWrite(13, LOW);
  delay(500);
}`;
    }
  };

  const codeString = getExampleCode();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLoadInSimulator = () => {
    useSimulatorStore.getState().setActiveCode(codeString);
    setActiveNav('simulator');
  };

  const tabs: { id: RightPanelTab; labelKey: string; defaultLabel: string; icon: React.ElementType }[] = [
    { id: 'overview', labelKey: 'tabs.overview', defaultLabel: 'OVERVIEW', icon: Info },
    { id: 'pinout', labelKey: 'tabs.pinout', defaultLabel: 'PINOUT', icon: ListTree },
    { id: 'example', labelKey: 'tabs.example', defaultLabel: 'EXAMPLE', icon: Code2 },
    { id: 'specs', labelKey: 'tabs.specs', defaultLabel: 'SPECIFICATIONS', icon: Cpu },
  ];

  // Filter pins
  const filteredPins = ARDUINO_UNO_PINS.filter((p) =>
    p.name.toLowerCase().includes(pinSearch.toLowerCase()) ||
    p.pinNumber.toString().toLowerCase().includes(pinSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(pinSearch.toLowerCase()) ||
    p.features.some((f) => f.toLowerCase().includes(pinSearch.toLowerCase()))
  );

  const selectedPin = ARDUINO_UNO_PINS.find((p) => p.id === selectedPinId) || ARDUINO_UNO_PINS[0];

  return (
    <div className="w-full h-full flex flex-col bg-blueprint-cream/70 dark:bg-blueprint-nightCard/85 backdrop-blur-md border border-blueprint-creamBorder dark:border-blueprint-nightBorder rounded-2xl shadow-blueprint overflow-hidden select-none">
      {/* Top Tabs */}
      <div className="flex items-center border-b border-blueprint-creamBorder dark:border-blueprint-nightBorder bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg/60 px-2 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = rightPanelTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setRightPanelTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-mono font-bold border-b-2 transition-all ${
                isActive
                  ? 'border-blueprint-teal text-blueprint-teal bg-white dark:bg-blueprint-nightCard rounded-t-xl shadow-xs'
                  : 'border-transparent text-blueprint-navyMuted dark:text-gray-400 hover:text-blueprint-navy dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t(tab.labelKey, tab.defaultLabel)}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* TAB 1: OVERVIEW */}
        {rightPanelTab === 'overview' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header / Selected Component Badge */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blueprint-teal/15 text-blueprint-teal font-bold border border-blueprint-teal/30">
                  {currentHotspot.category}
                </span>
                <h3 className="text-lg font-extrabold text-blueprint-navy dark:text-white mt-1">
                  {currentHotspot.name}
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blueprint-tealLight dark:bg-blueprint-teal/15 flex items-center justify-center text-blueprint-teal border border-blueprint-teal/30">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            {/* Quick summary card */}
            <p className="text-xs text-blueprint-navy/80 dark:text-gray-300 leading-relaxed font-sans">
              {currentHotspot.shortDesc}
            </p>

            {/* Role in Arduino architecture */}
            <div className="p-3 rounded-xl bg-blueprint-creamDark dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder">
              <span className="text-[10px] font-mono font-bold text-blueprint-teal uppercase tracking-wider block mb-1">
                SYSTEM ARCHITECTURE ROLE
              </span>
              <p className="text-xs text-blueprint-navy dark:text-gray-200 font-medium">
                {currentHotspot.role}
              </p>
            </div>

            {/* Full technical description */}
            <div className="text-xs text-blueprint-navyMuted dark:text-gray-300 leading-relaxed">
              {currentHotspot.fullDesc}
            </div>

            {/* Technical Specifications Specs Grid */}
            <div>
              <span className="text-[11px] font-mono font-bold text-blueprint-navy dark:text-gray-300 block mb-2">
                KEY SPECIFICATIONS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentHotspot.specs.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder flex flex-col"
                  >
                    <span className="text-[10px] font-mono text-gray-400">{s.label}</span>
                    <span className="text-xs font-mono font-bold text-blueprint-navy dark:text-white mt-0.5">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick jump to other hotspots */}
            <div className="pt-2 border-t border-blueprint-creamBorder dark:border-blueprint-nightBorder">
              <span className="text-[10px] font-mono uppercase text-gray-400 block mb-2">
                EXPLORE OTHER BOARD REGIONS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {HOTSPOTS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHotspot(h.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                      selectedHotspot === h.id
                        ? 'bg-blueprint-teal text-white font-bold'
                        : 'bg-blueprint-creamDark dark:bg-blueprint-nightBg text-blueprint-navy dark:text-gray-300 hover:border-blueprint-teal border border-transparent'
                    }`}
                  >
                    {h.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PINOUT */}
        {rightPanelTab === 'pinout' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Search filter */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search pins (e.g., PWM, SPI, A0, D13)..."
                value={pinSearch}
                onChange={(e) => setPinSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blueprint-teal font-mono"
              />
            </div>

            {/* Selected Pin Detail Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blueprint-teal/10 to-transparent border border-blueprint-teal/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-lg text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: selectedPin.color }}
                  >
                    {selectedPin.pinNumber}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold font-mono text-blueprint-navy dark:text-white">
                      {selectedPin.name}
                    </h4>
                    <span className="text-[10px] font-mono text-blueprint-teal uppercase">
                      {selectedPin.category} · {selectedPin.voltage}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-blueprint-navy/80 dark:text-gray-300 mt-2 font-sans">
                {selectedPin.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedPin.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder font-medium text-blueprint-navy dark:text-gray-200"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Color Category Legend */}
            <div className="flex flex-wrap gap-2 text-[10px] font-mono py-1 border-y border-blueprint-creamBorder dark:border-blueprint-nightBorder">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-[#DC2626]" /> Power
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-[#06B6D4]" /> Analog
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-[#10B981]" /> Digital
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-[#14B8A6]" /> PWM (~)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-[#8B5CF6]" /> Comm (SPI/I2C/UART)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-[#1F2937]" /> GND
              </span>
            </div>

            {/* Pin list grid */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {filteredPins.map((pin) => (
                <button
                  key={pin.id}
                  onClick={() => setSelectedPinId(pin.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left border transition ${
                    selectedPinId === pin.id
                      ? 'border-blueprint-teal bg-blueprint-tealLight/50 dark:bg-blueprint-teal/15 font-semibold'
                      : 'border-blueprint-creamBorder/70 dark:border-blueprint-nightBorder/70 hover:bg-white dark:hover:bg-blueprint-nightBg'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: pin.color }}
                    >
                      {pin.pinNumber}
                    </span>
                    <span className="text-xs font-mono text-blueprint-navy dark:text-gray-200">
                      {pin.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">{pin.voltage}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EXAMPLE CODE */}
        {rightPanelTab === 'example' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blueprint-teal uppercase">
                {currentHotspot.name} Sample Code
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blueprint-creamDark dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs font-mono hover:text-blueprint-teal transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleLoadInSimulator}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blueprint-teal text-white text-xs font-mono font-bold shadow-sm hover:bg-blueprint-tealHover transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run in Sim</span>
                </button>
              </div>
            </div>

            {/* Monaco-styled syntax display */}
            <div className="relative rounded-xl overflow-hidden border border-blueprint-creamBorder dark:border-blueprint-nightBorder bg-[#1E1E1E] text-gray-200 p-3.5 font-mono text-xs shadow-inner">
              <pre className="overflow-x-auto leading-relaxed selection:bg-blueprint-teal selection:text-white">
                <code>{codeString}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: SPECIFICATIONS */}
        {rightPanelTab === 'specs' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <h4 className="text-xs font-mono font-bold text-blueprint-teal uppercase tracking-wider">
              TECHNICAL SPECIFICATIONS TABLE
            </h4>

            <div className="border border-blueprint-creamBorder dark:border-blueprint-nightBorder rounded-xl overflow-hidden divide-y divide-blueprint-creamBorder dark:divide-blueprint-nightBorder bg-white dark:bg-blueprint-nightBg text-xs font-mono">
              {Object.entries(BOARD_SPECS).map(([key, val], idx) => {
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase());
                return (
                  <div key={idx} className="flex items-center justify-between p-2.5">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">{formattedKey}</span>
                    <span className="font-bold text-blueprint-navy dark:text-gray-100 text-right ml-4">
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
