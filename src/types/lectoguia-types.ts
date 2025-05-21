
import { Exercise } from './ai-types';

export interface ExerciseAttempt {
  id: string;
  exerciseId: string;
  userId: string;
  selectedOption: number;
  isCorrect: boolean;
  skillType: string;
  completedAt: string;
}

export interface UserPreference {
  key: string;
  value: string;
}

export interface LectoGuiaSession {
  userId: string | null;
  exerciseHistory: ExerciseAttempt[];
  preferences: Record<string, string>;
  skillLevels: Record<string, number>;
  loading: boolean;
}
