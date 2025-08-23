
// Servicio unificado de compatibilidad para el sistema diagnóstico
import { TestService } from './diagnostic/core/test-service';
import { ResultService } from './diagnostic/core/result-service';
import { fetchTestQuestions } from './diagnostic/core/question-service';
import { createLocalFallbackDiagnostics, ensureDefaultDiagnosticsExist } from './diagnostic/default-diagnostics';

// Re-exportar funciones principales del nuevo sistema
export const fetchDiagnosticTests = TestService.fetchTests;
export const submitDiagnosticResult = ResultService.submitResult;
export const fetchDiagnosticResults = ResultService.fetchUserResults;

// Funciones de compatibilidad legacy
export { createLocalFallbackDiagnostics, ensureDefaultDiagnosticsExist };

// Re-exportar tipos
export type {
  DiagnosticTest,
  DiagnosticQuestion,
  DiagnosticResult
} from '@/types/diagnostic';
