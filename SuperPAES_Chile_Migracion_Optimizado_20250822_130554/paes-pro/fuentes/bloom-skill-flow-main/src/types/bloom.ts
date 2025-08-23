
// Core assessment types
export interface TechQuestion {
  id: string;
  text: string;
  type: 'code-analysis' | 'concept-explanation' | 'problem-solving' | 'debugging' | 'architecture' | 'multiple-choice' | 'open-ended' | 'scenario';
  targetBloomLevel: number;
  techDomain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit?: number;
  codeSnippet?: string;
  expectedResponseType: 'text' | 'code' | 'multiple-choice';
  options?: string[];
}

export interface TechDomain {
  id: string;
  name: string;
  description: string;
  bloomCriteria: Record<number, string[]>;
}

export interface BloomLevelAssessment {
  bloomLevel: number;
  dominantLevel: number;
  confidence: number;
  reasoning: string;
  keyIndicators: string[];
  skillBreakdown: {
    strong: string[];
    weak: string[];
  };
  suggestions: string;
  timeSpent?: number;
}

export interface BloomAssessmentResult {
  dominantLevel: number;
  confidence: number;
  reasoning: string;
  keyIndicators: string[];
  suggestions: string;
  skillBreakdown: {
    strong: string[];
    weak: string[];
  };
}

export interface AssessmentSession {
  userId: string;
  techDomain: string;
  startTime: Date;
  questions: TechQuestion[];
  responses: AssessmentResponse[];
  currentEstimatedLevel: number;
  confidence: number;
}

export interface AssessmentResponse {
  question: TechQuestion;
  response: string;
  bloomAssessment: BloomLevelAssessment;
  timestamp?: Date;
  timeSpent?: number;
}

export interface AdaptiveAssessmentResult {
  finalBloomLevel: number;
  overallConfidence: number;
  session: AssessmentSession;
  recommendations: string[];
}

export interface WidgetResults {
  bloomLevel: number;
  confidence: number;
  skillBreakdown: {
    strong: string[];
    weak: string[];
  };
  learningPath: any;
  recommendations: string[];
  assessmentData: BloomAssessmentResult;
}

export interface WidgetProgress {
  currentQuestion: number;
  totalQuestions: number;
  percentage: number;
  timeElapsed: number;
  estimatedTimeRemaining: number;
}

export interface WidgetConfig {
  container: string | HTMLElement;
  techDomain?: string;
  theme?: string;
  onComplete?: (results: WidgetResults) => void;
  onProgress?: (progress: WidgetProgress) => void;
  customBranding?: boolean;
  maxQuestions?: number;
  timeLimit?: number;
}

export interface WidgetRenderConfig {
  widgetId: string;
  techDomain: string;
  theme: string;
  onComplete?: (results: WidgetResults) => void;
  onProgress?: (progress: WidgetProgress) => void;
  customBranding: boolean;
  maxQuestions: number;
  timeLimit: number;
}
