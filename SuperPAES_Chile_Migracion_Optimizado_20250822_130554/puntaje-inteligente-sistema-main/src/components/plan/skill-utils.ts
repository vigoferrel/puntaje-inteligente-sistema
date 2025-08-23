/* eslint-disable react-refresh/only-export-components */
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../types/core';


// Map skill codes to display names
const skillDisplayNames: Record<string, string> = {
  "TRACK_LOCATE": "Rastrear y Localizar",
  "INTERPRET_RELATE": "Interpretar y Relacionar",
  "EVALUATE_REFLECT": "Evaluar y Reflexionar",
  "SOLVE_PROBLEMS": "Resolver Problemas",
  "REPRESENT": "Representar",
  "MODEL": "Modelar",
  "ARGUE_COMMUNICATE": "Argumentar y Comunicar",
  "IDENTIFY_THEORIES": "Identificar TeorÃ­as",
  "PROCESS_ANALYZE": "Procesar y Analizar",
  "APPLY_PRINCIPLES": "Aplicar Principios",
  "SCIENTIFIC_ARGUMENT": "ArgumentaciÃ³n CientÃ­fica",
  "TEMPORAL_THINKING": "Pensamiento Temporal",
  "SOURCE_ANALYSIS": "AnÃ¡lisis de Fuentes",
  "MULTICAUSAL_ANALYSIS": "AnÃ¡lisis Multicausal",
  "CRITICAL_THINKING": "Pensamiento CrÃ­tico",
  "REFLECTION": "ReflexiÃ³n"
};

// Helper (...args: unknown[]) => unknown to get the display name for a skill
export const getSkillDisplayName = (skillCode: string): string => {
  return skillDisplayNames[skillCode] || "Habilidad General";
};



