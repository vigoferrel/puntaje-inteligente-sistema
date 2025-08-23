
// Map skill codes to display names
const skillDisplayNames: Record<string, string> = {
  "TRACK_LOCATE": "Rastrear y Localizar",
  "INTERPRET_RELATE": "Interpretar y Relacionar",
  "EVALUATE_REFLECT": "Evaluar y Reflexionar",
  "SOLVE_PROBLEMS": "Resolver Problemas",
  "REPRESENT": "Representar",
  "MODEL": "Modelar",
  "ARGUE_COMMUNICATE": "Argumentar y Comunicar",
  "IDENTIFY_THEORIES": "Identificar Teorías",
  "PROCESS_ANALYZE": "Procesar y Analizar",
  "APPLY_PRINCIPLES": "Aplicar Principios",
  "SCIENTIFIC_ARGUMENT": "Argumentación Científica",
  "TEMPORAL_THINKING": "Pensamiento Temporal",
  "SOURCE_ANALYSIS": "Análisis de Fuentes",
  "MULTICAUSAL_ANALYSIS": "Análisis Multicausal",
  "CRITICAL_THINKING": "Pensamiento Crítico",
  "REFLECTION": "Reflexión"
};

// Helper function to get the display name for a skill
export const getSkillDisplayName = (skillCode: string): string => {
  return skillDisplayNames[skillCode] || "Habilidad General";
};
