
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  skill: TPAESHabilidad;
  prueba: TPAESPrueba;
  explanation?: string;
}

export interface DiagnosticTest {
  id: string;
  title: string;
  description?: string;
  testId: number;
  questions: DiagnosticQuestion[];
  isCompleted: boolean;
}

export interface DiagnosticResult {
  id: string;
  userId: string;
  diagnosticId: string;
  results: Record<TPAESHabilidad, number>;
  completedAt: string;
}

export interface DiagnosticAnswer {
  questionId: string;
  answer: string;
}
