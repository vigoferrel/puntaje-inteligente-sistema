export interface Exercise {
  id: string;
  text?: string;
  context?: string; // Text content for the exercise
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  skill?: string;
  difficulty?: string;
  prueba?: string;
  nodeId?: string; // Added to support node-specific exercises
  imageUrl?: string; // URL for any image related to the exercise
  graphData?: any; // Data for rendering graphs if needed
  visualType?: 'image' | 'graph' | 'table' | 'code' | 'math'; // Type of visual content
  hasVisualContent?: boolean; // Flag to indicate if this exercise has visual content
}

export interface AIAnalysis {
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  nextSteps: string[];
}

export interface AIFeedback {
  positive: string;
  corrections: string;
  explanation: string;
  tip: string;
  response?: string; // Added for direct text responses
}

export interface ImageAnalysisResult {
  response: string;
  extractedText?: string;
  analysis?: {
    textContent?: string;
    ocrConfidence?: number;
    detectedLanguage?: string;
    mainTopic?: string;
    keyPoints?: string[];
  };
}
