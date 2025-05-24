
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";

// Nuevos tipos para el sistema jerarquizado
export type TierPriority = 'tier1_critico' | 'tier2_importante' | 'tier3_complementario';
export type BloomLevel = 'recordar' | 'comprender' | 'aplicar' | 'analizar' | 'evaluar' | 'crear';
export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced';

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  skill: TPAESHabilidad;
  prueba: TPAESPrueba;
  explanation?: string;
  bloomLevel?: BloomLevel;
  difficulty?: DifficultyLevel;
  nodeId?: string;
  paesFrequencyWeight?: number;
}

export interface DiagnosticTest {
  id: string;
  title: string;
  description?: string;
  testId: number;
  questions: DiagnosticQuestion[];
  isCompleted: boolean;
  targetTier?: TierPriority;
  questionsPerSkill?: number;
  totalQuestions?: number;
}

export interface DiagnosticResult {
  id: string;
  userId: string;
  diagnosticId: string;
  results: Record<TPAESHabilidad, number>;
  skillAnalysis?: Record<string, any>;
  tierPerformance?: Record<TierPriority, number>;
  completedAt: string;
}

export interface DiagnosticAnswer {
  questionId: string;
  answer: string;
}

// Nuevos tipos para el sistema jerárquico
export interface LearningNode {
  id: string;
  title: string;
  code: string;
  description?: string;
  subjectArea: string;
  cognitiveLevel: BloomLevel;
  difficulty: DifficultyLevel;
  tierPriority: TierPriority;
  testId: number;
  skillId: number;
  position: number;
  domainCategory: string;
  dependsOn: string[];
  estimatedTimeMinutes: number;
  baseWeight: number;
  difficultyMultiplier: number;
  frequencyBonus: number;
  prerequisiteWeight: number;
  adaptiveAdjustment: number;
  bloomComplexityScore: number;
  paesFrequency: number;
}

export interface NodeWeight {
  id: string;
  userId: string;
  nodeId: string;
  calculatedWeight: number;
  careerRelevance: number;
  performanceAdjustment: number;
  lastCalculated: string;
}

export interface PAESTest {
  id: number;
  name: string;
  code: string;
  description?: string;
  questionsCount: number;
  timeMinutes: number;
  relativeWeight: number;
  complexityLevel: string;
  isRequired: boolean;
}

export interface PAESSkill {
  id: number;
  name: string;
  code: string;
  description?: string;
  testId: number;
  skillType: TPAESHabilidad;
  impactWeight: number;
  nodeCount: number;
  applicableTests: string[];
  displayOrder: number;
}
