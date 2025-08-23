
import { DiagnosticQuestion } from '@/types/diagnostic';
import { TPAESHabilidad } from '@/types/system-types';

/**
 * Calcula resultados diagnósticos basado en respuestas del usuario
 */
export const calculateDiagnosticResults = (
  answers: Record<string, string>, 
  questions: DiagnosticQuestion[]
): Record<TPAESHabilidad, number> => {
  // Initialize default results
  const results: Record<TPAESHabilidad, number> = {
    SOLVE_PROBLEMS: 0,
    REPRESENT: 0,
    MODEL: 0,
    INTERPRET_RELATE: 0,
    EVALUATE_REFLECT: 0,
    TRACK_LOCATE: 0,
    ARGUE_COMMUNICATE: 0,
    IDENTIFY_THEORIES: 0,
    PROCESS_ANALYZE: 0,
    APPLY_PRINCIPLES: 0,
    SCIENTIFIC_ARGUMENT: 0,
    TEMPORAL_THINKING: 0,
    SOURCE_ANALYSIS: 0,
    MULTICAUSAL_ANALYSIS: 0,
    CRITICAL_THINKING: 0,
    REFLECTION: 0
  };

  // Calculate results based on answers
  questions.forEach(question => {
    const userAnswer = answers[question.id];
    const isCorrect = userAnswer === question.correctAnswer;
    const skill = question.skill as TPAESHabilidad;
    
    if (results[skill] !== undefined) {
      results[skill] += isCorrect ? 100 : 0;
    }
  });

  // Normalize results by number of questions per skill
  Object.keys(results).forEach(skill => {
    const skillQuestions = questions.filter(q => q.skill === skill).length;
    if (skillQuestions > 0) {
      results[skill as TPAESHabilidad] /= skillQuestions;
    }
  });

  return results;
};
