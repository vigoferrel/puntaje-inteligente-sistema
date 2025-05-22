
/**
 * Archivo de diagnóstico para resolver problemas de importación
 * Este archivo sirve como punto de verificación para asegurar que las exportaciones 
 * de los archivos de mapeo estén funcionando correctamente
 */
import { mapSkillIdToEnum, mapEnumToSkillId, mapTestIdToEnum, mapEnumToTestId } from './supabase-mappers';

// Función de diagnóstico que puede ser llamada para verificar que las importaciones funcionan
export const diagnoseMapperImports = () => {
  console.log('Diagnóstico de importaciones de mappers:');
  console.log('mapSkillIdToEnum disponible:', typeof mapSkillIdToEnum === 'function');
  console.log('mapEnumToSkillId disponible:', typeof mapEnumToSkillId === 'function');
  console.log('mapTestIdToEnum disponible:', typeof mapTestIdToEnum === 'function');
  console.log('mapEnumToTestId disponible:', typeof mapEnumToTestId === 'function');
  
  // Prueba de mapeo de valores
  try {
    console.log('Ejemplo de mapeo de skill ID 1:', mapSkillIdToEnum(1));
    console.log('Ejemplo de mapeo de test ID 1:', mapTestIdToEnum(1));
  } catch (error) {
    console.error('Error al usar las funciones de mapeo:', error);
  }
  
  return {
    mapSkillIdToEnum,
    mapEnumToSkillId,
    mapTestIdToEnum,
    mapEnumToTestId
  };
};
