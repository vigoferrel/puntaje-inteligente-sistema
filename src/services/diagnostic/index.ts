
// Este archivo reexporta todas las funcionalidades de la nueva estructura de servicios
// para mantener la compatibilidad con el código existente
export * from './fetch-services';
// Corregimos la exportación duplicada
export { submitDiagnosticResult } from './results/submit-result';
export * from './skill-services';
export * from './question/index';
export * from './results/index';
export * from './types';
export * from './mappers';
