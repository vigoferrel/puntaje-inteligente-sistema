
import { DiagnosticResult, TPAESHabilidad } from '@/types/diagnostic';

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
