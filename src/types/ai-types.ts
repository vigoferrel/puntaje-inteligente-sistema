
export interface Exercise {
  id?: string;
  text?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  context?: string; // Text content for the exercise
  skill?: string;
  difficulty?: string;
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
}
