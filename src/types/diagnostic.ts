export interface DiagnosticTest {
  id: string;
  title: string;
  description: string;
  testId: number;
  questions: DiagnosticQuestion[];
  isCompleted: boolean;
  metadata?: {
    source?: string;
    officialCount?: number;
    aiCount?: number;
    totalCostSavings?: number;
    quality?: string;
    targetTier?: string;
  };
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  skill: string;
  prueba: string;
  metadata?: {
    source?: string;
    originalId?: string;
    nodoCode?: string;
    year?: number;
    costSaving?: number;
    costUsed?: number;
    template?: boolean;
    bloomLevel?: string;
    nodeId?: string;
    paesFrequencyWeight?: number;
  };
}

export interface DiagnosticResult {
  id: string;
  testId: number;
  userId: string;
  diagnosticId: string;
  score: number;
  results: Record<string, number>;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
  completedAt: string;
}

// Export unified types for backward compatibility
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
  skillType: string;
  impactWeight: number;
  nodeCount: number;
  applicableTests: string[];
  displayOrder: number;
}

export interface LearningNode {
  id: string;
  title: string;
  description?: string;
  code: string;
  subjectArea: string;
  cognitiveLevel: string;
  difficulty: string;
  tierPriority: string;
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

// Tipos para simulaciones PAES
export interface PAESSimulation {
  id: string;
  name: string;
  type: 'official' | 'practice' | 'diagnostic';
  prueba: string;
  duration: number; // minutos
  totalQuestions: number;
  questions: DiagnosticQuestion[];
  scheduledDate?: Date;
  isCompleted: boolean;
  result?: PAESSimulationResult;
  metadata?: {
    officialFormat: boolean;
    timedMode: boolean;
    allowNavigation: boolean;
    showAnswers: boolean;
  };
}

export interface PAESSimulationResult {
  id: string;
  simulationId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // segundos
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  skillPerformance: Record<string, number>;
  completedAt: string;
  predictedPAESScore?: number;
}

// Export TPAESHabilidad for compatibility
export type { TPAESHabilidad } from '@/types/system-types';
