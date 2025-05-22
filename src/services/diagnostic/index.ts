
// Este archivo reexporta todas las funcionalidades de la nueva estructura de servicios
// para mantener la compatibilidad con el código existente
export * from './fetch-services';
// Exportamos submitDiagnosticResult solo desde un lugar para evitar conflictos
export { submitDiagnosticResult } from './results/submit-result';
export * from './skill-services';
export * from './question/index';
// Exportamos todo de results excepto submitDiagnosticResult que ya lo exportamos arriba
export * from './results/index';
export * from './types';
export * from './mappers';
export * from './default-diagnostics';
export * from './test-services';
// Exportamos el servicio para generar diagnósticos por defecto
export { 
  ensureDefaultDiagnosticsExist, 
  createLocalFallbackDiagnostics 
} from './default-services';
// Exportamos el módulo refactorizado de generación de diagnósticos
export * from '../diagnostic-generator';
