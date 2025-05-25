
import { TPAESPrueba, TPAESHabilidad, TLearningCyclePhase } from './system-types';

export interface MaterialGenerationConfig {
  materialType: 'exercises' | 'study_content' | 'assessment' | 'practice_test';
  subject: string;
  prueba: TPAESPrueba;
  skill?: TPAESHabilidad;
  phase: TLearningCyclePhase;
  count: number;
  difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  mode: 'official' | 'ai' | 'hybrid';
  useOfficialContent: boolean;
  includeContext: boolean;
  tier?: 'tier1' | 'tier2' | 'tier3';
  nodeIds?: string[];
}

export interface GeneratedMaterial {
  id: string;
  type: MaterialGenerationConfig['materialType'];
  title: string;
  content: any;
  metadata: {
    source: 'official' | 'ai' | 'hybrid';
    examCode?: string;
    difficulty: string;
    skill: TPAESHabilidad;
    prueba: TPAESPrueba;
    estimatedTime: number;
  };
  createdAt: Date;
}

export interface UserProgressData {
  userId: string;
  currentPhase: TLearningCyclePhase;
  completedNodes: string[];
  weakAreas: TPAESHabilidad[];
  strongAreas: TPAESHabilidad[];
  overallProgress: number;
  lastActivity: Date;
}

export interface AdaptiveRecommendation {
  id: string;
  type: MaterialGenerationConfig['materialType'];
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  config: Partial<MaterialGenerationConfig>;
  reasoning: string;
}
