
// Servicio diagnóstico simplificado - Re-export del servicio unificado
export * from '../diagnostic-service-unified';

// Re-export tipos básicos
export type {
  DiagnosticTest,
  DiagnosticQuestion,
  DiagnosticResult,
  LearningNode,
  PAESTest,
  PAESSkill
} from '@/types/diagnostic';
