
// Tipos unificados para la arquitectura interseccional de LectoGuía

export interface IntersectionalContext {
  // Contexto del usuario
  userId: string;
  currentSubject: string;
  activeModule: 'chat' | 'exercise' | 'progress' | 'subject';
  
  // Estado del ecosistema
  financialGoals?: {
    targetCareer: string;
    budgetRange: [number, number];
    scholarshipNeeds: boolean;
  };
  
  diagnosticResults?: {
    overallLevel: number;
    subjectLevels: Record<string, number>;
    recommendedPath: string[];
  };
  
  studyPlan?: {
    id: string;
    currentPhase: string;
    weeklyGoals: Record<string, number>;
  };
  
  // Métricas transversales
  crossModuleMetrics: {
    totalStudyTime: number;
    exercisesCompleted: number;
    averagePerformance: number;
    streakDays: number;
  };
}

export interface ModuleState {
  isActive: boolean;
  lastUpdated: Date;
  performance: number;
  needsAttention: boolean;
}

export interface IntersectionalState {
  context: IntersectionalContext;
  modules: {
    chat: ModuleState & { 
      activeConversation: string | null;
      messageCount: number;
    };
    exercise: ModuleState & { 
      currentExercise: string | null;
      completionRate: number;
    };
    progress: ModuleState & { 
      currentLevel: number;
      progressToday: number;
    };
    subject: ModuleState & { 
      focusAreas: string[];
      masteryLevels: Record<string, number>;
    };
  };
  
  // Conexiones con otros módulos del ecosistema
  ecosystem: {
    financial: {
      connected: boolean;
      lastSync: Date | null;
      recommendations: string[];
    };
    diagnostic: {
      connected: boolean;
      lastAssessment: Date | null;
      nextRecommended: Date | null;
    };
    planning: {
      connected: boolean;
      activePlan: string | null;
      alignment: number; // 0-100
    };
  };
}

export interface CrossModuleAction {
  type: 'UPDATE_CONTEXT' | 'SYNC_METRICS' | 'REQUEST_RECOMMENDATION' | 'TRIGGER_INTEGRATION';
  source: string;
  target: string;
  payload: any;
  priority: 'low' | 'medium' | 'high';
}

export interface AIIntersectionalRequest {
  message: string;
  context: IntersectionalContext;
  crossModuleData: {
    recentExercises: any[];
    financialGoals: any;
    diagnosticInsights: any;
    planProgress: any;
  };
}

export interface IntersectionalRecommendation {
  id: string;
  type: 'exercise' | 'study_plan' | 'financial_action' | 'diagnostic_test';
  title: string;
  description: string;
  priority: number;
  estimatedTime: number;
  module: string;
  action: () => void;
}
