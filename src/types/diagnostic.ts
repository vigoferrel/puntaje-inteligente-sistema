export interface DiagnosticTest {
  id: string;
  title: string;
  description: string;
  testId: number;
  questions: DiagnosticQuestion[];
  isCompleted: boolean;
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  skill: string;
  prueba: string;
}

export interface DiagnosticResult {
  testId: number;
  userId: string;
  score: number;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
  completedAt: string;
}
