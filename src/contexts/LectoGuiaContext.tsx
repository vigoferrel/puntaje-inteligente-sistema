
// Contexto LectoGuía consolidado - versión final para producción
import { LectoGuiaProvider, LectoGuiaContext, useLectoGuia } from './lectoguia';

// Solo re-exportar la versión unificada
export { 
  LectoGuiaProvider, 
  LectoGuiaContext, 
  useLectoGuia
};

// Mantener compatibilidad con imports existentes
export const SUBJECT_TO_PRUEBA_MAP = {
  'general': 'COMPETENCIA_LECTORA',
  'lectura': 'COMPETENCIA_LECTORA',
  'matematicas-basica': 'MATEMATICA_1',
  'matematicas-avanzada': 'MATEMATICA_2',
  'ciencias': 'CIENCIAS',
  'historia': 'HISTORIA'
};

export const SUBJECT_DISPLAY_NAMES = {
  'general': 'Comprensión General',
  'lectura': 'Competencia Lectora',
  'matematicas-basica': 'Matemática Básica M1',
  'matematicas-avanzada': 'Matemática Avanzada M2',
  'ciencias': 'Ciencias Naturales',
  'historia': 'Historia y Ciencias Sociales'
};
