import React from 'react';
import {
  Trophy,
  Zap,
  CheckCircle2,
  Play,
  Clock,
  Target,
  Sparkles
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useProgressStore } from '../store/useProgressStore';
import { useSimulatorStore } from '../store/useSimulatorStore';

interface ChallengeItem {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Master';
  xp: number;
  description: string;
  requirements: string[];
  testCode: string;
}

export const ChallengesView: React.FC = () => {
  const { setActiveNav } = useUIStore();
  const { addXP } = useProgressStore();
  const { loadCircuit } = useSimulatorStore();

  const challenges: ChallengeItem[] = [
    {
      id: 'ch-1',
      title: 'The 2 Hz Optical Heartbeat',
      difficulty: 'Beginner',
      xp: 150,
      description: 'Program digital Pin 8 to cycle ON and OFF at exactly 2 Hertz (250ms ON, 250ms OFF). Connect a 220Ω resistor and red LED.',
      requirements: [
        'Pin 8 configured as OUTPUT in setup()',
        'digitalWrite toggles with 250ms delay',
        'Current limiting resistor in circuit'
      ],
      testCode: `void setup() {\n  pinMode(8, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(8, HIGH);\n  delay(250);\n  digitalWrite(8, LOW);\n  delay(250);\n}`
    },
    {
      id: 'ch-2',
      title: 'Pull-up Security Sensor',
      difficulty: 'Beginner',
      xp: 180,
      description: 'Configure Pin 2 using internal pull-up (INPUT_PULLUP). When pressed (LOW), trigger Pin 13 LED and output alert to Serial.',
      requirements: [
        'pinMode(2, INPUT_PULLUP)',
        'Active-LOW detection logic',
        'Serial diagnostic notification'
      ],
      testCode: `void setup() {\n  pinMode(2, INPUT_PULLUP);\n  pinMode(13, OUTPUT);\n  Serial.begin(9600);\n}\nvoid loop() {\n  if (digitalRead(2) == LOW) {\n    digitalWrite(13, HIGH);\n    Serial.println("ALERT: Intrusion detected!");\n  } else {\n    digitalWrite(13, LOW);\n  }\n}`
    },
    {
      id: 'ch-3',
      title: 'Precision PWM Dimming Dial',
      difficulty: 'Intermediate',
      xp: 220,
      description: 'Read the 10-bit analog voltage from potentiometer on A0 (0-1023) and proportionally map it to PWM output on Pin 9 (0-255).',
      requirements: [
        'analogRead(A0) acquired each loop cycle',
        'map(val, 0, 1023, 0, 255) translation',
        'analogWrite(9, pwm) executed'
      ],
      testCode: `void setup() {\n  pinMode(9, OUTPUT);\n}\nvoid loop() {\n  int raw = analogRead(A0);\n  int pwm = map(raw, 0, 1023, 0, 255);\n  analogWrite(9, pwm);\n  delay(20);\n}`
    },
    {
      id: 'ch-4',
      title: 'Acoustic Tone Fanfare',
      difficulty: 'Intermediate',
      xp: 250,
      description: 'Drive a piezo buzzer on Pin 8 to play the musical notes C4 (262 Hz), E4 (330 Hz), and G4 (392 Hz) with tone() and noTone().',
      requirements: [
        'Piezo buzzer wired between Pin 8 and GND',
        'tone() function utilized with valid frequencies',
        'Proper silence intervals between note pulses'
      ],
      testCode: `void setup() {\n  tone(8, 262, 300);\n  delay(350);\n  tone(8, 330, 300);\n  delay(350);\n  tone(8, 392, 400);\n  delay(450);\n  noTone(8);\n}\nvoid loop() {}`
    }
  ];

  const handleLaunchChallenge = (ch: ChallengeItem) => {
    loadCircuit(
      {
        components: [
          { id: 'uno-1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 120, rotation: 0, properties: {} }
        ],
        wires: []
      },
      ch.testCode
    );
    setActiveNav('simulator');
  };

  return (
    <div className="space-y-6 select-none">
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-black text-blueprint-navy dark:text-white">
              CHALLENGE MODE
            </h2>
          </div>
          <p className="text-xs text-blueprint-navyMuted dark:text-gray-300 mt-1">
            Build circuits and write firmware sketches to satisfy automated engineering requirements.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold border border-amber-300 dark:border-amber-800">
          <Zap className="w-4 h-4 fill-current" />
          <span>Earn Bonus Badges</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((ch) => (
          <div
            key={ch.id}
            className="p-5 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm flex flex-col justify-between hover:border-blueprint-teal transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blueprint-tealLight dark:bg-blueprint-teal/15 text-blueprint-teal border border-blueprint-teal/30">
                  {ch.difficulty}
                </span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  +{ch.xp} XP
                </span>
              </div>

              <h3 className="text-base font-bold text-blueprint-navy dark:text-white group-hover:text-blueprint-teal transition-colors">
                {ch.title}
              </h3>
              <p className="text-xs text-blueprint-navyMuted dark:text-gray-300 mt-1 leading-relaxed">
                {ch.description}
              </p>

              {/* Requirements list */}
              <div className="mt-3 pt-3 border-t border-blueprint-creamBorder/70 dark:border-blueprint-nightBorder/70 space-y-1">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                  VERIFICATION CRITERIA
                </span>
                {ch.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-blueprint-navy dark:text-gray-200">
                    <Target className="w-3.5 h-3.5 text-blueprint-teal flex-shrink-0" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-blueprint-creamBorder/70 dark:border-blueprint-nightBorder/70 flex justify-end">
              <button
                onClick={() => handleLaunchChallenge(ch)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-xs font-mono font-bold shadow-sm transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Challenge</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
