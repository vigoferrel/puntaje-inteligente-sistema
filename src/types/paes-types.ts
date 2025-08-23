
/**
 * Types related to PAES tests and skills - ACTUALIZADO POST-MIGRACIÓN
 */

export type TPAESPrueba =
  | 'COMPETENCIA_LECTORA'
  | 'MATEMATICA_1'
  | 'MATEMATICA_2'
  | 'CIENCIAS'
  | 'HISTORIA';

export type TPAESHabilidad =
  | 'TRACK_LOCATE'
  | 'INTERPRET_RELATE'
  | 'EVALUATE_REFLECT'
  | 'SOLVE_PROBLEMS'
  | 'REPRESENT'
  | 'MODEL'
  | 'ARGUE_COMMUNICATE'
  | 'IDENTIFY_THEORIES'
  | 'PROCESS_ANALYZE'
  | 'APPLY_PRINCIPLES'
  | 'SCIENTIFIC_ARGUMENT'
  | 'TEMPORAL_THINKING'
  | 'SOURCE_ANALYSIS'
  | 'MULTICAUSAL_ANALYSIS'
  | 'CRITICAL_THINKING'
  | 'REFLECTION';

// Mapeo de ID de test a tipo de prueba PAES CORREGIDO POST-MIGRACIÓN
export const TEST_ID_TO_PRUEBA_MAP: Record<number, TPAESPrueba> = {
  1: 'COMPETENCIA_LECTORA',
  2: 'MATEMATICA_1',
  3: 'MATEMATICA_2',
  4: 'HISTORIA', // CORREGIDO
  5: 'CIENCIAS'  // CORREGIDO
};

// Mapeo inverso de prueba PAES a ID de test CORREGIDO POST-MIGRACIÓN
export const PRUEBA_TO_TEST_ID_MAP: Record<TPAESPrueba, number> = {
  'COMPETENCIA_LECTORA': 1,
  'MATEMATICA_1': 2,
  'MATEMATICA_2': 3,
  'HISTORIA': 4, // CORREGIDO
  'CIENCIAS': 5  // CORREGIDO
};

/**
 * Obtiene el nombre para mostrar de una prueba PAES
 */
export function getPruebaDisplayName(prueba: TPAESPrueba): string {
  switch (prueba) {
    case 'COMPETENCIA_LECTORA':
      return 'Competencia Lectora';
    case 'MATEMATICA_1':
      return 'Matemática 1 (7° a 2° medio)';
    case 'MATEMATICA_2':
      return 'Matemática 2 (3° y 4° medio)';
    case 'CIENCIAS':
      return 'Ciencias';
    case 'HISTORIA':
      return 'Historia';
    default:
      return prueba;
  }
}

/**
 * Obtiene el nombre para mostrar de una habilidad PAES
 */
export function getHabilidadDisplayName(habilidad: TPAESHabilidad): string {
  switch (habilidad) {
    case 'TRACK_LOCATE':
      return 'Localizar';
    case 'INTERPRET_RELATE':
      return 'Interpretar y relacionar';
    case 'EVALUATE_REFLECT':
      return 'Evaluar y reflexionar';
    case 'SOLVE_PROBLEMS':
      return 'Resolución de problemas';
    case 'REPRESENT':
      return 'Representación';
    case 'MODEL':
      return 'Modelamiento';
    case 'ARGUE_COMMUNICATE':
      return 'Argumentación y comunicación';
    case 'IDENTIFY_THEORIES':
      return 'Identificación de teorías';
    case 'PROCESS_ANALYZE':
      return 'Procesar y analizar';
    case 'APPLY_PRINCIPLES':
      return 'Aplicar principios';
    case 'SCIENTIFIC_ARGUMENT':
      return 'Argumentación científica';
    case 'TEMPORAL_THINKING':
      return 'Pensamiento temporal';
    case 'SOURCE_ANALYSIS':
      return 'Análisis de fuentes';
    case 'MULTICAUSAL_ANALYSIS':
      return 'Análisis multicausal';
    case 'CRITICAL_THINKING':
      return 'Pensamiento crítico';
    case 'REFLECTION':
      return 'Reflexión';
    default:
      return habilidad;
  }
}

/**
 * Convierte un ID de prueba a su tipo TPAESPrueba correspondiente
 */
export function testIdToPrueba(testId: number): TPAESPrueba {
  const prueba = TEST_ID_TO_PRUEBA_MAP[testId];
  if (!prueba) {
    console.warn(`⚠️ testId ${testId} no encontrado, usando COMPETENCIA_LECTORA como fallback`);
    return 'COMPETENCIA_LECTORA';
  }
  return prueba;
}

/**
 * Convierte un tipo TPAESPrueba a su ID de prueba correspondiente
 */
export function pruebaToTestId(prueba: TPAESPrueba): number {
  const testId = PRUEBA_TO_TEST_ID_MAP[prueba];
  if (!testId) {
    console.warn(`⚠️ Prueba ${prueba} no encontrada, usando 1 como fallback`);
    return 1;
  }
  return testId;
}

/**
 * Valida si un mapeo prueba-testId es correcto
 */
export function validatePruebaTestIdMapping(prueba: TPAESPrueba, testId: number): boolean {
  return PRUEBA_TO_TEST_ID_MAP[prueba] === testId;
}
