
// Re-exportar los componentes y hooks principales
export { LectoGuiaProvider } from './LectoGuiaProvider';
export { LectoGuiaContext, useLectoGuia } from './useLectoGuia';

// Exportar tipos para que puedan ser importados desde otros archivos
export type { LectoGuiaContextType } from './types';

// Exportar constantes útiles
export { SUBJECT_TO_PRUEBA_MAP, SUBJECT_DISPLAY_NAMES } from './types';

// Exportar hooks individuales para uso avanzado
export { useTabs } from './useTabs';
export { useSubjects } from './useSubjects';
export { useNodes } from './useNodes';
export { useChat } from './useChat';
export { useSkills } from './useSkills';
export { useExercises } from './useExercises';
