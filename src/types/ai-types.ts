
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
