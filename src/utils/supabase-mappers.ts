
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";

/**
 * Convierte un skill ID numérico de la base de datos en un enum de TPAESHabilidad
 */
export const mapSkillIdToEnum = (skillId: number): TPAESHabilidad => {
  const mapping: Record<number, TPAESHabilidad> = {
    1: "TRACK_LOCATE",         // Rastrear-Localizar (CL)
    2: "INTERPRET_RELATE",     // Interpretar-Relacionar (CL)
    3: "EVALUATE_REFLECT",     // Evaluar-Reflexionar (CL)
    4: "SOLVE_PROBLEMS",       // Resolver Problemas (M1)
    5: "REPRESENT",            // Representar (M1)
    6: "MODEL",                // Modelar (M1)
    7: "ARGUE_COMMUNICATE",    // Argumentar y Comunicar (M1)
    8: "IDENTIFY_THEORIES",    // Identificar-Teorías (CN)
    9: "PROCESS_ANALYZE",      // Procesar-Analizar (CN)
    10: "APPLY_PRINCIPLES",    // Aplicar-Principios (CN)
    11: "SCIENTIFIC_ARGUMENT", // Argumentación Científica (CN)
    12: "TEMPORAL_THINKING",   // Pensamiento Temporal (CS)
    13: "SOURCE_ANALYSIS",     // Análisis de Fuentes (CS)
    14: "MULTICAUSAL_ANALYSIS",// Análisis Multicausal (CS)
    15: "CRITICAL_THINKING",   // Pensamiento Crítico (CS)
    16: "REFLECTION"           // Reflexión (CS)
  };
  
  return mapping[skillId] || "INTERPRET_RELATE"; // Default fallback
};

/**
 * Convierte un enum de TPAESHabilidad en un skill ID numérico para la base de datos
 */
export const mapEnumToSkillId = (skill: TPAESHabilidad): number => {
  const mapping: Record<TPAESHabilidad, number> = {
    "TRACK_LOCATE": 1,
    "INTERPRET_RELATE": 2,
    "EVALUATE_REFLECT": 3,
    "SOLVE_PROBLEMS": 4,
    "REPRESENT": 5,
    "MODEL": 6,
    "ARGUE_COMMUNICATE": 7,
    "IDENTIFY_THEORIES": 8,
    "PROCESS_ANALYZE": 9,
    "APPLY_PRINCIPLES": 10,
    "SCIENTIFIC_ARGUMENT": 11,
    "TEMPORAL_THINKING": 12,
    "SOURCE_ANALYSIS": 13,
    "MULTICAUSAL_ANALYSIS": 14,
    "CRITICAL_THINKING": 15,
    "REFLECTION": 16
  };
  
  return mapping[skill] || 2; // Default fallback to INTERPRET_RELATE's ID
};

/**
 * Convierte un test ID numérico de la base de datos en un enum de TPAESPrueba
 */
export const mapTestIdToEnum = (testId: number): TPAESPrueba => {
  const mapping: Record<number, TPAESPrueba> = {
    1: "COMPETENCIA_LECTORA",  // Competencia Lectora
    2: "MATEMATICA_1",         // Matemática 1
    3: "MATEMATICA_2",         // Matemática 2
    4: "CIENCIAS",             // Ciencias
    5: "HISTORIA"              // Historia
  };
  
  return mapping[testId] || "COMPETENCIA_LECTORA"; // Default fallback
};

/**
 * Convierte un enum de TPAESPrueba en un test ID numérico para la base de datos
 */
export const mapEnumToTestId = (test: TPAESPrueba): number => {
  const mapping: Record<TPAESPrueba, number> = {
    "COMPETENCIA_LECTORA": 1,
    "MATEMATICA_1": 2,
    "MATEMATICA_2": 3,
    "CIENCIAS": 4,
    "HISTORIA": 5
  };
  
  return mapping[test] || 1; // Default fallback to COMPETENCIA_LECTORA's ID
};
