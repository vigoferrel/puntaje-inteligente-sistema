
/**
 * Types related to AI-generated content, specifically exercises
 */

export interface Exercise {
  id?: string | number;
  question: string;
  text?: string; 
  context?: string;
  options: string[];
  alternatives?: string[]; // Para compatibilidad con el generador PAES
  correctAnswer: string;
  explanation?: string;
  skill: string;
  prueba?: string;
  difficulty?: string;
  imageUrl?: string;
  graphData?: any;
  visualType?: string;
  hasVisualContent?: boolean;
  nodeId?: string;
  nodeName?: string;
  node?: string; // Para compatibilidad con el generador PAES
  subject?: string; // Para compatibilidad con el generador PAES
  estimatedTime?: number; // Para compatibilidad con el generador PAES
}

/**
 * Interface for AI analysis results of user performance
 */
export interface AIAnalysis {
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  nextSteps: string[];
  summary?: string;
}

/**
 * Interface for AI feedback on exercise attempts
 */
export interface AIFeedback {
  feedback: string;
  explanation: string;
  tips: string[];
  isCorrect?: boolean;
  additionalResources?: string[];
}

/**
 * Interface for AI image analysis results
 */
export interface ImageAnalysisResult {
  response: string;
  extractedText?: string;
  analysis?: string;
  detectedObjects?: string[];
  tags?: string[];
  confidence?: number;
}
