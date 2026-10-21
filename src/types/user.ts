export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'starter' | 'circuits' | 'code' | 'mastery';
}

export interface UserProgressState {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessons: string[]; // lesson ids
  unlockedBadges: string[]; // badge ids
  completedQuizzes: Record<string, number>; // lessonId -> score
  solvedChallenges: string[];
  totalSimTimeSeconds: number;
  displayName: string;
  certificateClaimed: boolean;
  certificateDate?: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  circuit: any;
  likes: number;
  author: string;
  tags: string[];
  isPublic?: boolean;
}
