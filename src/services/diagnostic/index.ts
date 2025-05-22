
export { fetchDiagnosticTests, fetchDiagnosticResults } from './fetch-services';
export { submitDiagnosticResult } from './submit-services';
export { ensureDefaultDiagnosticsExist, createLocalFallbackDiagnostics } from './default-diagnostics';

// Re-export types for convenience
export type { DiagnosticTest, DiagnosticQuestion, DiagnosticResult } from '@/types/diagnostic';
