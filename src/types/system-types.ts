
import { z } from "zod";

// ESTRUCTURA PAES UNIFICADA
export const PAESPruebas = z.enum([
  "COMPETENCIA_LECTORA",
  "MATEMATICA_1", // 7° a 2° medio
  "MATEMATICA_2", // 3° y 4° medio
  "CIENCIAS",
  "HISTORIA"
]);

// HABILIDADES UNIFICADAS - INTEGRA TODAS LAS PRUEBAS
export const PAESHabilidades = z.enum([
  // Habilidades principales (originales)
  "SOLVE_PROBLEMS",     // Resolver Problemas
  "REPRESENT",          // Representar
  "MODEL",              // Modelar
  "INTERPRET_RELATE",   // Interpretar-Relacionar
  "EVALUATE_REFLECT",   // Evaluar-Reflexionar
  "TRACK_LOCATE",       // Rastrear-Localizar
  
  // Habilidades adicionales por prueba
  "ARGUE_COMMUNICATE",  // Argumentar y Comunicar (Matemáticas)
  "IDENTIFY_THEORIES",  // Identificar Teorías (Ciencias)
  "PROCESS_ANALYZE",    // Procesar y Analizar (Ciencias)
  "APPLY_PRINCIPLES",   // Aplicar Principios (Ciencias)
  "SCIENTIFIC_ARGUMENT", // Argumentación Científica
  "TEMPORAL_THINKING",  // Pensamiento Temporal (Historia)
  "SOURCE_ANALYSIS",    // Análisis de Fuentes (Historia)
  "MULTICAUSAL_ANALYSIS", // Análisis Multicausal (Historia)
  "CRITICAL_THINKING",  // Pensamiento Crítico (Historia)
  "REFLECTION"          // Reflexión (Historia)
]);

// CONFIGURACIÓN AI UNIFICADA
export const AIConfig = z.object({
  modelProvider: z.enum(["openrouter"]).default("openrouter"),
  defaultModel: z.enum([
    "google/gemini-2.0-flash-exp:free",
    "qwen/qwen3-4b:free",
    "mistralai/mistral-7b:free",
    "openchat/openchat-7b:free"
  ]).default("google/gemini-2.0-flash-exp:free"),
  
  features: z.object({
    exerciseGeneration: z.boolean().default(true),
    ocrProcessing: z.boolean().default(true),
    simulationCreation: z.boolean().default(true),
    adaptiveLearning: z.boolean().default(true)
  })
});

// CICLO DE APRENDIZAJE UNIFICADO
export const LearningCyclePhase = z.enum([
  "DIAGNOSIS",
  "PERSONALIZED_PLAN",
  "SKILL_TRAINING",
  "CONTENT_STUDY",
  "PERIODIC_TESTS",
  "FEEDBACK_ANALYSIS",
  "REINFORCEMENT",
  "FINAL_SIMULATIONS"
]);

// ESTRUCTURA NODO UNIFICADA
export const LearningNode = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  skill: PAESHabilidades,
  prueba: PAESPruebas,
  difficulty: z.enum(["basic", "intermediate", "advanced"]),
  position: z.number(), // Orden en la secuencia de aprendizaje
  dependsOn: z.array(z.string()).optional(), // IDs de nodos prerrequisitos
  estimatedTimeMinutes: z.number().default(30),
  content: z.object({
    theory: z.string().optional(),
    examples: z.array(z.string()).optional(),
    exerciseCount: z.number().default(15) // Cantidad de ejercicios a generar
  })
});

// TIPOS EXPORTADOS
export type TPAESPrueba = z.infer<typeof PAESPruebas>;
export type TPAESHabilidad = z.infer<typeof PAESHabilidades>;
export type TAIConfig = z.infer<typeof AIConfig>;
export type TLearningCyclePhase = z.infer<typeof LearningCyclePhase>;
export type TLearningNode = z.infer<typeof LearningNode>;

// Helper function to get display names
export const getHabilidadDisplayName = (habilidad: TPAESHabilidad): string => {
  const displayNames: Record<TPAESHabilidad, string> = {
    SOLVE_PROBLEMS: "Resolver Problemas",
    REPRESENT: "Representar",
    MODEL: "Modelar",
    INTERPRET_RELATE: "Interpretar y Relacionar",
    EVALUATE_REFLECT: "Evaluar y Reflexionar",
    TRACK_LOCATE: "Rastrear y Localizar",
    ARGUE_COMMUNICATE: "Argumentar y Comunicar",
    IDENTIFY_THEORIES: "Identificar Teorías",
    PROCESS_ANALYZE: "Procesar y Analizar",
    APPLY_PRINCIPLES: "Aplicar Principios",
    SCIENTIFIC_ARGUMENT: "Argumentación Científica",
    TEMPORAL_THINKING: "Pensamiento Temporal",
    SOURCE_ANALYSIS: "Análisis de Fuentes",
    MULTICAUSAL_ANALYSIS: "Análisis Multicausal",
    CRITICAL_THINKING: "Pensamiento Crítico",
    REFLECTION: "Reflexión"
  };
  
  return displayNames[habilidad] || habilidad;
};

export const getPruebaDisplayName = (prueba: TPAESPrueba): string => {
  const displayNames: Record<TPAESPrueba, string> = {
    COMPETENCIA_LECTORA: "Competencia Lectora",
    MATEMATICA_1: "Matemática 1 (7° a 2° medio)",
    MATEMATICA_2: "Matemática 2 (3° y 4° medio)",
    CIENCIAS: "Ciencias",
    HISTORIA: "Historia"
  };
  
  return displayNames[prueba] || prueba;
};

// Learning cycle phase display names
export const getLearningCyclePhaseDisplayName = (phase: TLearningCyclePhase): string => {
  const displayNames: Record<TLearningCyclePhase, string> = {
    DIAGNOSIS: "Diagnóstico",
    PERSONALIZED_PLAN: "Plan Personalizado",
    SKILL_TRAINING: "Entrenamiento de Habilidades",
    CONTENT_STUDY: "Estudio de Contenido",
    PERIODIC_TESTS: "Evaluaciones Periódicas",
    FEEDBACK_ANALYSIS: "Análisis y Retroalimentación",
    REINFORCEMENT: "Reforzamiento",
    FINAL_SIMULATIONS: "Simulaciones Finales"
  };
  
  return displayNames[phase] || phase;
};

// Learning cycle phase descriptions
export const getLearningCyclePhaseDescription = (phase: TLearningCyclePhase): string => {
  const descriptions: Record<TLearningCyclePhase, string> = {
    DIAGNOSIS: "Evaluación inicial para identificar tus fortalezas y áreas de mejora",
    PERSONALIZED_PLAN: "Creación de un plan de estudio adaptado a tus necesidades",
    SKILL_TRAINING: "Desarrollo de habilidades específicas para mejorar tu rendimiento",
    CONTENT_STUDY: "Profundización en los contenidos más relevantes para la prueba",
    PERIODIC_TESTS: "Evaluaciones periódicas para medir tu progreso",
    FEEDBACK_ANALYSIS: "Análisis detallado de tus resultados para identificar patrones",
    REINFORCEMENT: "Práctica adicional en las áreas que más necesitas mejorar",
    FINAL_SIMULATIONS: "Simulaciones completas tipo PAES para estar preparado"
  };
  
  return descriptions[phase] || "";
};

// Learning cycle phase order and progress
export const LEARNING_CYCLE_PHASES_ORDER: TLearningCyclePhase[] = [
  "DIAGNOSIS",
  "PERSONALIZED_PLAN",
  "SKILL_TRAINING",
  "CONTENT_STUDY",
  "PERIODIC_TESTS",
  "FEEDBACK_ANALYSIS",
  "REINFORCEMENT",
  "FINAL_SIMULATIONS"
];

export const getLearningCyclePhaseProgress = (phase: TLearningCyclePhase): number => {
  const index = LEARNING_CYCLE_PHASES_ORDER.indexOf(phase);
  return index >= 0 ? (index + 1) / LEARNING_CYCLE_PHASES_ORDER.length : 0;
};
