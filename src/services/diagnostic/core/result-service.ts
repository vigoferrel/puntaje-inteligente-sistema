
import { DiagnosticResult } from '@/types/diagnostic';
import { TPAESHabilidad } from '@/types/system-types';

const createResultRecord = (
  userId: string,
  diagnosticId: string,
  results: Record<TPAESHabilidad, number>
): DiagnosticResult => {
  const totalScore = Object.values(results).reduce((sum, score) => sum + score, 0) / Object.keys(results).length;
  
  return {
    id: `result-${diagnosticId}-${Date.now()}`,
    testId: 1, // Default test ID
    userId,
    diagnosticId,
    score: totalScore,
    results,
    answers: [], // Se llenarían con las respuestas reales
    completedAt: new Date().toISOString()
  };
};

export const ResultService = {
  submitResult: async (
    userId: string,
    diagnosticId: string,
    results: Record<TPAESHabilidad, number>
  ): Promise<DiagnosticResult> => {
    const result = createResultRecord(userId, diagnosticId, results);
    
    // Store in localStorage temporarily
    const existingResults = JSON.parse(localStorage.getItem('diagnostic-results') || '[]');
    existingResults.push(result);
    localStorage.setItem('diagnostic-results', JSON.stringify(existingResults));
    
    return result;
  },

  fetchUserResults: async (userId: string): Promise<DiagnosticResult[]> => {
    const results = JSON.parse(localStorage.getItem('diagnostic-results') || '[]');
    return results.filter((result: DiagnosticResult) => result.userId === userId);
  }
};
