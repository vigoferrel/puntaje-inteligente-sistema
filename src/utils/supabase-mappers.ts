
import { TPAESHabilidad, TPAESPrueba } from "../types/system-types";

/**
 * Utility functions to map between Supabase database IDs and frontend enum types
 */

// Skill mapping (database ID to frontend TPAESHabilidad)
export const mapSkillIdToEnum = (skillId: number): TPAESHabilidad => {
  const skillMap: Record<number, TPAESHabilidad> = {
    1: "TRACK_LOCATE",
    2: "INTERPRET_RELATE",
    3: "EVALUATE_REFLECT",
    4: "SOLVE_PROBLEMS",
    5: "REPRESENT",
    6: "MODEL",
    7: "ARGUE_COMMUNICATE",
    8: "IDENTIFY_THEORIES",
    9: "PROCESS_ANALYZE",
    10: "APPLY_PRINCIPLES",
    11: "SCIENTIFIC_ARGUMENT",
    12: "TEMPORAL_THINKING",
    13: "SOURCE_ANALYSIS",
    14: "MULTICAUSAL_ANALYSIS",
    15: "CRITICAL_THINKING",
    16: "REFLECTION"
  };
  
  return skillMap[skillId] || "SOLVE_PROBLEMS"; // Default to SOLVE_PROBLEMS if mapping not found
};

// Skill mapping (frontend TPAESHabilidad to database ID)
export const mapEnumToSkillId = (skillEnum: TPAESHabilidad): number => {
  const enumMap: Record<TPAESHabilidad, number> = {
    TRACK_LOCATE: 1,
    INTERPRET_RELATE: 2,
    EVALUATE_REFLECT: 3,
    SOLVE_PROBLEMS: 4,
    REPRESENT: 5,
    MODEL: 6,
    ARGUE_COMMUNICATE: 7,
    IDENTIFY_THEORIES: 8,
    PROCESS_ANALYZE: 9,
    APPLY_PRINCIPLES: 10,
    SCIENTIFIC_ARGUMENT: 11,
    TEMPORAL_THINKING: 12,
    SOURCE_ANALYSIS: 13,
    MULTICAUSAL_ANALYSIS: 14,
    CRITICAL_THINKING: 15,
    REFLECTION: 16
  };
  
  return enumMap[skillEnum] || 4; // Default to 4 (SOLVE_PROBLEMS) if mapping not found
};

// Test mapping (database ID to frontend TPAESPrueba)
export const mapTestIdToEnum = (testId: number): TPAESPrueba => {
  const testMap: Record<number, TPAESPrueba> = {
    1: "COMPETENCIA_LECTORA",
    2: "MATEMATICA_1",
    3: "MATEMATICA_2",
    4: "CIENCIAS",
    5: "HISTORIA"
  };
  
  return testMap[testId] || "MATEMATICA_1"; // Default to MATEMATICA_1 if mapping not found
};

// Test mapping (frontend TPAESPrueba to database ID)
export const mapEnumToTestId = (testEnum: TPAESPrueba): number => {
  const enumMap: Record<TPAESPrueba, number> = {
    COMPETENCIA_LECTORA: 1,
    MATEMATICA_1: 2,
    MATEMATICA_2: 3,
    CIENCIAS: 4,
    HISTORIA: 5
  };
  
  return enumMap[testEnum] || 2; // Default to 2 (MATEMATICA_1) if mapping not found
};
