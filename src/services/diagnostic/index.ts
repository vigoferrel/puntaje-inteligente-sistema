
// Servicio diagnóstico refactorizado - Exportaciones centralizadas
import { TestService } from './core/test-service';
import { ResultService } from './core/result-service';
import { fetchTestQuestions, safeParseOptions } from './core/question-service';

// Exportar servicios core
export { TestService } from './core/test-service';
export { ResultService } from './core/result-service';
export { fetchTestQuestions, safeParseOptions } from './core/question-service';

// Re-export legacy functions para compatibilidad
export const fetchDiagnosticTests = TestService.fetchTests;
export const submitDiagnosticResult = ResultService.submitResult;
export const fetchDiagnosticResults = ResultService.fetchUserResults;

// Re-export tipos
export type {
  DiagnosticTest,
  DiagnosticQuestion,
  DiagnosticResult
} from '@/types/diagnostic';
