
export type MaterialType = 
  | 'exercises' 
  | 'study_content' 
  | 'diagnostic_tests' 
  | 'practice_guides' 
  | 'simulations';

export interface MaterialGenerationConfig {
  materialType: MaterialType;
  phase: string;
  subject: string;
  tier: string;
  nodes: string[];
  difficulty: string;
  count: number;
  apiKey: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  timeAvailable?: number; // minutes
  personalizedMode?: boolean;
}

export interface GeneratedMaterial {
  id: string;
  type: MaterialType;
  phase: string;
  title: string;
  content: any;
  estimatedTime: number;
  difficulty: string;
  nodes: string[];
  createdAt: Date;
}

export interface PhaseConfig {
  name: string;
  description: string;
  recommendedMaterials: MaterialType[];
  defaultCount: number;
  estimatedDuration: number;
  icon: string;
}
