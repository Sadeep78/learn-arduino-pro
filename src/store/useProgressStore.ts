import { create } from 'zustand';
import confetti from 'canvas-confetti';
import { Badge } from '../types/user';

export const ALL_BADGES: Badge[] = [
  { id: 'first_blink', title: 'First Blink', description: 'Flashed the digital pin 13 LED successfully.', icon: 'Zap', category: 'starter' },
  { id: 'button_master', title: 'Button Master', description: 'Handled digital inputs and internal pull-ups.', icon: 'Square', category: 'circuits' },
  { id: 'pwm_pioneer', title: 'PWM Pioneer', description: 'Mastered analogWrite and smooth brightness modulation.', icon: 'Sliders', category: 'circuits' },
  { id: 'sound_smith', title: 'Audio Maestro', description: 'Synthesized musical tones using Web Audio timers.', icon: 'Volume2', category: 'actuators' as any },
  { id: 'sensor_scout', title: 'Sensor Scout', description: 'Acquired analog telemetry with photoresistors.', icon: 'Eye', category: 'circuits' },
  { id: 'servo_pilot', title: 'Servo Pilot', description: 'Controlled precision angular positioning.', icon: 'RotateCw', category: 'actuators' as any },
  { id: 'serial_sleuth', title: 'UART Sleuth', description: 'Connected bidirectional serial terminal at 9600 baud.', icon: 'Radio', category: 'code' },
  { id: 'capstone_hero', title: 'Arduino Master', description: 'Completed all 11 curriculum lessons & capstone alarm.', icon: 'Award', category: 'mastery' }
];

interface ProgressStore {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessons: string[];
  unlockedBadges: string[];
  completedQuizzes: Record<string, number>;
  totalSimSeconds: number;
  displayName: string;
  certificateClaimed: boolean;
  certificateDate?: string;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string, xpReward: number) => void;
  recordQuizScore: (lessonId: string, score: number) => void;
  unlockBadge: (badgeId: string) => void;
  incrementSimTime: (seconds: number) => void;
  setDisplayName: (name: string) => void;
  claimCertificate: () => void;
  resetProgress: () => void;
}

const STORAGE_KEY = 'learn_arduino_pro_progress_v1';

const loadSavedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load progress', e);
  }
  return null;
};

const saved = loadSavedState() || {};

export const useProgressStore = create<ProgressStore>((set, get) => ({
  xp: saved.xp ?? 0,
  level: saved.level ?? 1,
  streakDays: saved.streakDays ?? 1,
  lastActiveDate: saved.lastActiveDate ?? new Date().toISOString().split('T')[0],
  completedLessons: saved.completedLessons ?? [],
  unlockedBadges: saved.unlockedBadges ?? [],
  completedQuizzes: saved.completedQuizzes ?? {},
  totalSimSeconds: saved.totalSimSeconds ?? 0,
  displayName: saved.displayName ?? 'Maker Learner',
  certificateClaimed: saved.certificateClaimed ?? false,
  certificateDate: saved.certificateDate,

  addXP: (amount) => {
    set((state) => {
      const newXP = state.xp + amount;
      const newLevel = Math.max(1, Math.floor(Math.sqrt(newXP / 100)) + 1);
      const isLevelUp = newLevel > state.level;

      if (isLevelUp) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        } catch (_) {}
      }

      const nextState = { ...state, xp: newXP, level: newLevel };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    });
  },

  completeLesson: (lessonId, xpReward) => {
    const state = get();
    if (state.completedLessons.includes(lessonId)) return;

    const newCompleted = [...state.completedLessons, lessonId];
    const newXP = state.xp + xpReward;
    const newLevel = Math.max(1, Math.floor(Math.sqrt(newXP / 100)) + 1);

    // Auto-unlock corresponding badges
    const newBadges = [...state.unlockedBadges];
    if (lessonId === 'lesson-1' || lessonId === 'lesson-2') {
      if (!newBadges.includes('first_blink')) newBadges.push('first_blink');
    }
    if (lessonId === 'lesson-3' && !newBadges.includes('button_master')) newBadges.push('button_master');
    if (lessonId === 'lesson-4' && !newBadges.includes('pwm_pioneer')) newBadges.push('pwm_pioneer');
    if (lessonId === 'lesson-6' && !newBadges.includes('sound_smith')) newBadges.push('sound_smith');
    if (lessonId === 'lesson-7' && !newBadges.includes('sensor_scout')) newBadges.push('sensor_scout');
    if (lessonId === 'lesson-8' && !newBadges.includes('servo_pilot')) newBadges.push('servo_pilot');
    if (lessonId === 'lesson-9' && !newBadges.includes('serial_sleuth')) newBadges.push('serial_sleuth');
    if (newCompleted.length >= 11 && !newBadges.includes('capstone_hero')) newBadges.push('capstone_hero');

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (_) {}

    const updated = {
      ...state,
      completedLessons: newCompleted,
      xp: newXP,
      level: newLevel,
      unlockedBadges: newBadges
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set(updated);
  },

  recordQuizScore: (lessonId, score) => {
    set((state) => {
      const nextQuizzes = { ...state.completedQuizzes, [lessonId]: score };
      const nextState = { ...state, completedQuizzes: nextQuizzes };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    });
  },

  unlockBadge: (badgeId) => {
    set((state) => {
      if (state.unlockedBadges.includes(badgeId)) return state;
      try {
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.8 } });
      } catch (_) {}
      const next = { ...state, unlockedBadges: [...state.unlockedBadges, badgeId] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  },

  incrementSimTime: (seconds) => {
    set((state) => {
      const next = { ...state, totalSimSeconds: state.totalSimSeconds + seconds };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  },

  setDisplayName: (name) => {
    set((state) => {
      const next = { ...state, displayName: name };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  },

  claimCertificate: () => {
    set((state) => {
      const next = {
        ...state,
        certificateClaimed: true,
        certificateDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  },

  resetProgress: () => {
    const fresh = {
      xp: 0,
      level: 1,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedLessons: [],
      unlockedBadges: [],
      completedQuizzes: {},
      totalSimSeconds: 0,
      displayName: 'Maker Learner',
      certificateClaimed: false
    };
    localStorage.removeItem(STORAGE_KEY);
    set(fresh);
  }
}));
