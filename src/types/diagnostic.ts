
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
    costSaving?: number;
    costUsed?: number;
    template?: boolean;
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
