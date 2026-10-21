import { CircuitState } from './simulator';

export type LessonCategory = 'basics' | 'sensors' | 'actuators' | 'communication' | 'projects';

export interface LessonCheckpoint {
  id: string;
  titleKey: string;
  descriptionKey: string;
  completed: boolean;
  type: 'observe_pin' | 'run_simulation' | 'change_input' | 'serial_output' | 'quiz';
  targetPin?: number;
  expectedState?: any;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  category: LessonCategory;
  categoryLabel: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  estimatedMinutes: number;
  summary: string;
  hardwareParts: string[];
  learningGoals: string[];
  schematicDescription: string;
  codeSnippet: string;
  precompiledHex: string;
  initialCircuit: CircuitState;
  checkpoints: LessonCheckpoint[];
  quiz: QuizQuestion[];
  troubleshootingTips: string[];
}
