import { create } from 'zustand';
import { ProjectData } from '../types/user';
import { CircuitState } from '../types/simulator';

interface ProjectStore {
  projects: ProjectData[];
  communityProjects: ProjectData[];
  saveProject: (title: string, description: string, circuit: CircuitState, code: string) => string;
  updateProject: (id: string, updates: Partial<ProjectData>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  exportProjectJSON: (id: string) => void;
  importProjectJSON: (jsonString: string) => boolean;
  likeCommunityProject: (id: string) => void;
}

const STORAGE_KEY = 'learn_arduino_pro_projects_v1';

const DEFAULT_PROJECTS: ProjectData[] = [
  {
    id: 'proj-1',
    title: 'Dual Flashing Railroad Signal',
    description: 'Alternating twin red LEDs with 220Ω resistors simulating a train crossing light.',
    createdAt: '2026-10-18',
    updatedAt: '2026-10-20',
    code: `const int led1 = 8;\nconst int led2 = 9;\nvoid setup() {\n  pinMode(led1, OUTPUT);\n  pinMode(led2, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(led1, HIGH);\n  digitalWrite(led2, LOW);\n  delay(400);\n  digitalWrite(led1, LOW);\n  digitalWrite(led2, HIGH);\n  delay(400);\n}`,
    circuit: { components: [], wires: [] },
    likes: 24,
    author: 'Sadeep Sasanka',
    tags: ['LED', 'PWM', 'Beginner']
  },
  {
    id: 'proj-2',
    title: 'Precision Light Sensor Alarm',
    description: 'Dark-detecting nightlight paired with audio piezo buzzer alert.',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-21',
    code: `const int ldrPin = A0;\nconst int buzzerPin = 8;\nvoid setup() {\n  pinMode(buzzerPin, OUTPUT);\n  Serial.begin(9600);\n}\nvoid loop() {\n  int val = analogRead(ldrPin);\n  if (val < 400) {\n    tone(buzzerPin, 1000, 100);\n  }\n  delay(150);\n}`,
    circuit: { components: [], wires: [] },
    likes: 42,
    author: 'Alex Carter',
    tags: ['Sensors', 'Buzzer', 'LDR']
  }
];

const COMMUNITY_PROJECTS: ProjectData[] = [
  {
    id: 'comm-1',
    title: 'Smart Traffic Light with Pedestrian Crossing',
    description: 'A 4-way traffic junction with Red, Yellow, Green LEDs and a pedestrian push button with beep audio.',
    createdAt: '2026-10-15',
    updatedAt: '2026-10-19',
    code: `const int redPin = 8;\nconst int yellowPin = 9;\nconst int greenPin = 10;\nconst int btnPin = 2;\nvoid setup() {\n  pinMode(redPin, OUTPUT);\n  pinMode(yellowPin, OUTPUT);\n  pinMode(greenPin, OUTPUT);\n  pinMode(btnPin, INPUT_PULLUP);\n}\nvoid loop() {\n  digitalWrite(greenPin, HIGH);\n  if (digitalRead(btnPin) == LOW) {\n    delay(1000);\n    digitalWrite(greenPin, LOW);\n    digitalWrite(yellowPin, HIGH);\n    delay(1500);\n    digitalWrite(yellowPin, LOW);\n    digitalWrite(redPin, HIGH);\n    delay(4000);\n    digitalWrite(redPin, LOW);\n  }\n}`,
    circuit: { components: [], wires: [] },
    likes: 128,
    author: 'Elena Rostova',
    tags: ['Traffic', 'State Machine', 'LEDs']
  },
  {
    id: 'comm-2',
    title: '8-Bit Retro Chiptune Music Box',
    description: 'Synthesizes classic 8-bit game music themes using Timer interrupts and tone frequencies.',
    createdAt: '2026-10-16',
    updatedAt: '2026-10-20',
    code: `int notes[] = { 262, 294, 330, 349, 392, 440, 494, 523 };\nvoid setup() {\n  for (int i=0; i<8; i++) {\n    tone(8, notes[i], 150);\n    delay(200);\n  }\n  noTone(8);\n}\nvoid loop() {}`,
    circuit: { components: [], wires: [] },
    likes: 95,
    author: 'Kenji Sato',
    tags: ['Audio', 'Chiptune', 'Buzzer']
  },
  {
    id: 'comm-3',
    title: 'Ultrasonic Parking Distance Radar',
    description: 'Color-coded proximity warning (Green > 30cm, Yellow 15-30cm, Red < 15cm + rapid beeping).',
    createdAt: '2026-10-17',
    updatedAt: '2026-10-21',
    code: `// Parking radar with HC-SR04 sonar\nvoid setup() {\n  Serial.begin(9600);\n}\nvoid loop() {\n  // Telemetry loop\n}`,
    circuit: { components: [], wires: [] },
    likes: 84,
    author: 'Marcus Vance',
    tags: ['Robotics', 'HC-SR04', 'Safety']
  }
];

const loadSavedProjects = (): ProjectData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return DEFAULT_PROJECTS;
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: loadSavedProjects(),
  communityProjects: COMMUNITY_PROJECTS,

  saveProject: (title, description, circuit, code) => {
    const state = get();
    const id = `proj-${Date.now()}`;
    const newProj: ProjectData = {
      id,
      title,
      description,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      circuit,
      code,
      likes: 0,
      author: 'You (Guest)',
      tags: ['Custom']
    };

    const next = [newProj, ...state.projects];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ projects: next });
    return id;
  },

  updateProject: (id, updates) => {
    set((state) => {
      const updated = state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { projects: updated };
    });
  },

  deleteProject: (id) => {
    set((state) => {
      const remaining = state.projects.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
      return { projects: remaining };
    });
  },

  duplicateProject: (id) => {
    const state = get();
    const orig = state.projects.find((p) => p.id === id);
    if (!orig) return;

    const copy: ProjectData = {
      ...orig,
      id: `proj-${Date.now()}`,
      title: `${orig.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const next = [copy, ...state.projects];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ projects: next });
  },

  exportProjectJSON: (id) => {
    const state = get();
    const proj = state.projects.find((p) => p.id === id) || state.communityProjects.find((p) => p.id === id);
    if (!proj) return;

    const blob = new Blob([JSON.stringify(proj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${proj.title.toLowerCase().replace(/\s+/g, '_')}_arduino_pro.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importProjectJSON: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.title || !data.code) return false;

      const newProj: ProjectData = {
        id: `proj-${Date.now()}`,
        title: data.title || 'Imported Project',
        description: data.description || 'Imported from JSON',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        code: data.code,
        circuit: data.circuit || { components: [], wires: [] },
        likes: 0,
        author: data.author || 'Imported',
        tags: data.tags || ['Imported']
      };

      set((state) => {
        const next = [newProj, ...state.projects];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return { projects: next };
      });
      return true;
    } catch (_) {
      return false;
    }
  },

  likeCommunityProject: (id) => {
    set((state) => ({
      communityProjects: state.communityProjects.map((p) =>
        p.id === id ? { ...p, likes: p.likes + 1 } : p
      )
    }));
  }
}));
