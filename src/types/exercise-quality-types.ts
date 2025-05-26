
export interface ExerciseQualityMetrics {
  [key: string]: any;
  structuralValidity: number;
  contentQuality: number;
  paesCompliance: number;
  difficultyAccuracy: number;
  visualContentScore?: number;
  overallScore: number;
}

export interface ExerciseGenerationMetadata {
  qualityMetrics: ExerciseQualityMetrics;
  hasVisualContent: boolean;
  visualType?: string;
  text?: string;
  source?: string;
  generatedAt?: string;
  prueba?: string;
  skill?: string;
  difficulty?: string;
}
