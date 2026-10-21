import React, { useState } from 'react';
import {
  Video,
  Play,
  Clock,
  Sparkles,
  ArrowRight,
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useSimulatorStore } from '../store/useSimulatorStore';

interface Chapter {
  id: string;
  time: string;
  title: string;
  transcript: string;
  codeSnippet: string;
}

export const VideosView: React.FC = () => {
  const { setActiveNav } = useUIStore();
  const { loadCircuit } = useSimulatorStore();

  const chapters: Chapter[] = [
    {
      id: 'ch-1',
      time: '00:00',
      title: '1. Introduction to the ATmega328P Microcontroller',
      transcript:
        'In this chapter we look at the ATmega328P 8-bit AVR core, the 16 MHz crystal clock, and how power is regulated from the 5V USB bus.',
      codeSnippet: `void setup() {\n  pinMode(13, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}`
    },
    {
      id: 'ch-2',
      time: '02:45',
      title: '2. Wiring LEDs with Ohm’s Law and Series Resistors',
      transcript:
        'Why does an LED need a 220-ohm resistor? Let us apply V = I * R. With 5V supply and 2.0V forward drop, a 200-ohm resistor limits current to 15mA.',
      codeSnippet: `// 220 Ohm Resistor + External Red LED on Pin 8\nconst int ledPin = 8;\nvoid setup() {\n  pinMode(ledPin, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(ledPin, HIGH);\n  delay(500);\n  digitalWrite(ledPin, LOW);\n  delay(500);\n}`
    },
    {
      id: 'ch-3',
      time: '05:30',
      title: '3. Reading Digital Inputs with Internal Pull-Ups',
      transcript:
        'A floating digital pin fluctuates randomly. In this step we configure INPUT_PULLUP to provide a deterministic HIGH when the switch is open and LOW when pressed.',
      codeSnippet: `const int btn = 2;\nconst int led = 8;\nvoid setup() {\n  pinMode(btn, INPUT_PULLUP);\n  pinMode(led, OUTPUT);\n}\nvoid loop() {\n  if (digitalRead(btn) == LOW) {\n    digitalWrite(led, HIGH);\n  } else {\n    digitalWrite(led, LOW);\n  }\n}`
    },
    {
      id: 'ch-4',
      time: '08:15',
      title: '4. Pulse-Width Modulation (PWM) and Analog Conversion',
      transcript:
        'We connect a 10k potentiometer to A0 and map 10-bit values (0-1023) down to 8-bit duty cycle (0-255) on PWM Pin 9.',
      codeSnippet: `void setup() {\n  pinMode(9, OUTPUT);\n}\nvoid loop() {\n  int val = analogRead(A0);\n  int pwm = map(val, 0, 1023, 0, 255);\n  analogWrite(9, pwm);\n}`
    }
  ];

  const [activeChapter, setActiveChapter] = useState<Chapter>(chapters[0]);

  const handleOpenStepInSim = (chap: Chapter) => {
    loadCircuit(
      {
        components: [
          { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 120, rotation: 0, properties: {} }
        ],
        wires: []
      },
      chap.codeSnippet
    );
    setActiveNav('simulator');
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-blueprint-teal" />
            <h2 className="text-xl font-black text-blueprint-navy dark:text-white">
              INTERACTIVE VIDEO MASTERCLASS
            </h2>
          </div>
          <p className="text-xs text-blueprint-navyMuted dark:text-gray-300 mt-1">
            Watch hands-on lessons with timestamped chapters, synchronized transcripts, and launch each step directly into the simulator.
          </p>
        </div>
      </div>

      {/* Main Grid: Video Player + Synced Transcript & Step Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Video Player Mockup (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full aspect-video rounded-2xl bg-black border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-2xl overflow-hidden flex flex-col justify-between p-4">
            {/* Blueprint Grid Overlay */}
            <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />

            {/* Video Simulated Stage */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-blueprint-teal/90 text-white flex items-center justify-center shadow-lg shadow-teal-500/40 hover:scale-110 transition cursor-pointer">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <span className="text-xs font-mono font-bold text-gray-300">
                Playing: {activeChapter.title}
              </span>
              <span className="text-[10px] font-mono text-blueprint-teal">
                1080p 60fps · Arduino Engineering Masterclass
              </span>
            </div>

            {/* Video Overlay Bottom Bar */}
            <div className="relative z-10 w-full flex items-center justify-between bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs font-mono">
              <span>{activeChapter.time} / 12:45</span>
              <button
                onClick={() => handleOpenStepInSim(activeChapter)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blueprint-teal text-white font-bold hover:bg-blueprint-tealHover transition shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Open this step in Simulator</span>
              </button>
            </div>
          </div>

          {/* Current Transcript Callout */}
          <div className="p-4 rounded-xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder">
            <span className="text-[10px] font-mono font-bold text-blueprint-teal uppercase">
              CHAPTER TRANSCRIPT ({activeChapter.time})
            </span>
            <p className="text-xs text-blueprint-navy dark:text-gray-200 mt-1 leading-relaxed font-sans">
              "{activeChapter.transcript}"
            </p>
          </div>
        </div>

        {/* Right: Chapters Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-mono font-bold text-blueprint-teal uppercase tracking-wider">
            LESSON CHAPTERS
          </h3>

          <div className="space-y-2">
            {chapters.map((chap) => {
              const isActive = activeChapter.id === chap.id;
              return (
                <div
                  key={chap.id}
                  onClick={() => setActiveChapter(chap)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-white dark:bg-blueprint-nightBg border-blueprint-teal ring-2 ring-blueprint-teal/30 shadow-md'
                      : 'bg-white/70 dark:bg-blueprint-nightCard/70 border-blueprint-creamBorder dark:border-blueprint-nightBorder hover:border-blueprint-teal/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blueprint-tealLight dark:bg-blueprint-teal/15 text-blueprint-teal">
                      {chap.time}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenStepInSim(chap);
                      }}
                      className="text-[10px] font-mono text-blueprint-teal hover:underline flex items-center gap-1"
                    >
                      <span>Simulate step</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-blueprint-navy dark:text-white">
                    {chap.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
