
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
  estimatedTimeMinutes: number;
  difficulty: string;
  prerequisites?: string[];
  dependsOn?: string[];
  learningObjectives?: string[];
  tags?: string[];
  resources?: string[];
  createdAt?: string;
  updatedAt?: string;
  position?: number;
  // Propiedades unificadas y consistentes
  cognitive_level: string;
  cognitiveLevel: string;
  subject_area: string;
  subjectArea: string;
  code: string;
  skillId: number;
  testId: number;
  // Propiedades para compatibilidad con el sistema diagnóstico
  tierPriority?: 'tier1_critico' | 'tier2_importante' | 'tier3_complementario';
  domainCategory?: string;
  baseWeight?: number;
  difficultyMultiplier?: number;
  frequencyBonus?: number;
  prerequisiteWeight?: number;
  adaptiveAdjustment?: number;
  bloomComplexityScore?: number;
  paesFrequency?: number;
}
