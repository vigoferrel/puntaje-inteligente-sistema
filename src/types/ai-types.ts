
export interface Exercise {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  context?: string; // Optional text content for the exercise
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
