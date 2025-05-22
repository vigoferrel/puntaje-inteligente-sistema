
import { TPAESHabilidad } from "@/types/system-types";

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
