import { Exercise } from './ai-types';
import { TPAESHabilidad } from './system-types';

export interface ExerciseAttempt {
  id: string;
  exerciseId: string;
  userId: string;
  selectedOption: number;
  isCorrect: boolean;
  skillType: string;
  completedAt: string;
  prueba: string;  // Added prueba field
}

export interface UserPreference {
  id?: string;
  key: string;
  value: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LectoGuiaSession {
  userId: string | null;
  exerciseHistory: ExerciseAttempt[];
  preferences: Record<string, string>;
  skillLevels: Record<string, number>;
  loading: boolean;
}

export interface SkillInfo {
  id: number;
  code: string;
  name: string;
  level: number;
  description?: string;
}

export interface ExerciseResult {
  success: boolean;
  attempt?: ExerciseAttempt | null;
  error?: string;
}

export interface SavePreferenceResult {
  success: boolean;
  error?: string;
}

export interface UpdateSkillResult {
  success: boolean;
  newLevel?: number;
  error?: string;
}

// Use TPAESHabilidad from system-types.ts for LectoGuiaSkill
export type LectoGuiaSkill = TPAESHabilidad;

// Re-export TLearningNode for convenience
export type { TLearningNode } from './system-types';
