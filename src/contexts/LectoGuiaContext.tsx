
// Este archivo ahora re-exporta desde la estructura refactorizada
// para mantener compatibilidad con backwards

import { LectoGuiaProvider, LectoGuiaContext, useLectoGuia } from './lectoguia';
import { SUBJECT_TO_PRUEBA_MAP, SUBJECT_DISPLAY_NAMES } from './lectoguia/types';

// Re-exportar para mantener la compatibilidad con código existente
export { 
  LectoGuiaProvider, 
  LectoGuiaContext, 
  useLectoGuia,
  SUBJECT_TO_PRUEBA_MAP,
  SUBJECT_DISPLAY_NAMES
};
