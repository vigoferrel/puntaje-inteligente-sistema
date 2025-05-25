
import { DiagnosticResult } from '@/types/diagnostic';
import { TPAESHabilidad } from '@/types/system-types';

export const submitDiagnosticResult = async (
  userId: string,
  diagnosticId: string,
  results: Record<TPAESHabilidad, number>
): Promise<DiagnosticResult> => {
  const totalScore = Object.values(results).reduce((sum, score) => sum + score, 0) / Object.keys(results).length;
  
  const result: DiagnosticResult = {
    id: `result-${diagnosticId}-${Date.now()}`,
    testId: 1, // Default test ID
    userId,
    diagnosticId,
    score: totalScore,
    results,
    answers: [], // Se llenarían con las respuestas reales
    completedAt: new Date().toISOString()
  };
  
  // Store in localStorage temporarily
  const existingResults = JSON.parse(localStorage.getItem('diagnostic-results') || '[]');
  existingResults.push(result);
  localStorage.setItem('diagnostic-results', JSON.stringify(existingResults));
  
  console.log(`✅ Resultado diagnóstico guardado: ${totalScore.toFixed(1)}%`);
  return result;
};

export const calculateDiagnosticResults = (answers: Record<string, string>, questions: any[]): Record<TPAESHabilidad, number> => {
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
