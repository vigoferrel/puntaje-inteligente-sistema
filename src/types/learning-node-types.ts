
/**
 * Types and interfaces for learning nodes
 */

import { TPAESHabilidad, TPAESPrueba } from './paes-types';
import { TLearningCyclePhase } from './learning-cycle-types';

export interface TLearningNode {
  id: string;
  title: string;
  description: string;
  content?: string | {
    theory: string;
    examples: any[];
    exerciseCount: number;
  };
  phase?: TLearningCyclePhase;
  skill: TPAESHabilidad;
  prueba: TPAESPrueba;
  bloomLevel?: string;
  estimatedTime?: number;
  estimatedTimeMinutes?: number;
  difficulty: string;
  prerequisites?: string[];
  dependsOn?: string[];
  learningObjectives?: string[];
  tags?: string[];
  resources?: string[];
  createdAt?: string;
  updatedAt?: string;
  position?: number;
  // Nuevas propiedades agregadas en la migración
  cognitive_level?: string;
  subject_area?: string;
  code?: string;
  skillId?: number;
  testId?: number;
}
