/* eslint-disable react-refresh/only-export-components */

import { TLearningCyclePhase } from '../../../types/system-types';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../../types/core';
import { MaterialType, PhaseConfig } from '../types/learning-material-types';

export const PHASE_CONFIG: Record<TLearningCyclePhase, PhaseConfig> = {
  'DIAGNOSIS': {
    name: 'DiagnÃ³stico',
    description: 'EvalÃºa tu nivel actual y detecta fortalezas y debilidades',
    recommendedMaterials: ['diagnostic_tests', 'exercises'],
    defaultCount: 10,
    estimatedDuration: 30,
    icon: 'ðŸ”'
  },
  'PERSONALIZED_PLAN': {
    name: 'Plan Personalizado',
    description: 'Revisa y ajusta tu plan de estudio personalizado',
    recommendedMaterials: ['study_content', 'practice_guides'],
    defaultCount: 5,
    estimatedDuration: 15,
    icon: 'ðŸ“‹'
  },
  'SKILL_TRAINING': {
    name: 'Entrenamiento de Habilidades',
    description: 'Practica y desarrolla habilidades especÃ­ficas',
    recommendedMaterials: ['exercises', 'practice_guides'],
    defaultCount: 8,
    estimatedDuration: 45,
    icon: 'ðŸ’ª'
  },
  'CONTENT_STUDY': {
    name: 'Estudio de Contenido',
    description: 'Estudia teorÃ­a y conceptos fundamentales',
    recommendedMaterials: ['study_content', 'practice_guides'],
    defaultCount: 6,
    estimatedDuration: 60,
    icon: 'ðŸ“š'
  },
  'PERIODIC_TESTS': {
    name: 'Evaluaciones PeriÃ³dicas',
    description: 'Mide tu progreso con evaluaciones regulares',
    recommendedMaterials: ['diagnostic_tests', 'exercises'],
    defaultCount: 12,
    estimatedDuration: 40,
    icon: 'ðŸ“Š'
  },
  'FEEDBACK_ANALYSIS': {
    name: 'AnÃ¡lisis y Feedback',
    description: 'Analiza resultados y recibe feedback personalizado',
    recommendedMaterials: ['study_content'],
    defaultCount: 3,
    estimatedDuration: 20,
    icon: 'ðŸ“ˆ'
  },
  'REINFORCEMENT': {
    name: 'Reforzamiento',
    description: 'Refuerza Ã¡reas dÃ©biles identificadas',
    recommendedMaterials: ['exercises', 'practice_guides'],
    defaultCount: 10,
    estimatedDuration: 50,
    icon: 'ðŸ”§'
  },
  'FINAL_SIMULATIONS': {
    name: 'Simulaciones Finales',
    description: 'Practica con simulacros completos de la PAES',
    recommendedMaterials: ['simulations', 'diagnostic_tests'],
    defaultCount: 65,
    estimatedDuration: 120,
    icon: 'ðŸŽ¯'
  },
  // Fases del Ciclo de Kolb
  'EXPERIENCIA_CONCRETA': {
    name: 'Experiencia Concreta',
    description: 'PrÃ¡ctica inicial con ejercicios bÃ¡sicos',
    recommendedMaterials: ['exercises', 'practice_guides'],
    defaultCount: 5,
    estimatedDuration: 25,
    icon: 'ðŸŽ¯'
  },
  'OBSERVACION_REFLEXIVA': {
    name: 'ObservaciÃ³n Reflexiva',
    description: 'AnÃ¡lisis de patrones y estrategias',
    recommendedMaterials: ['study_content', 'exercises'],
    defaultCount: 4,
    estimatedDuration: 35,
    icon: 'ðŸ‘ï¸'
  },
  'CONCEPTUALIZACION_ABSTRACTA': {
    name: 'ConceptualizaciÃ³n Abstracta',
    description: 'TeorÃ­a profunda y conceptos avanzados',
    recommendedMaterials: ['study_content', 'practice_guides'],
    defaultCount: 6,
    estimatedDuration: 50,
    icon: 'ðŸ§ '
  },
  'EXPERIMENTACION_ACTIVA': {
    name: 'ExperimentaciÃ³n Activa',
    description: 'AplicaciÃ³n prÃ¡ctica y simulacros',
    recommendedMaterials: ['simulations', 'exercises'],
    defaultCount: 8,
    estimatedDuration: 45,
    icon: 'âš¡'
  },
  // Fases tradicionales
  'diagnostic': {
    name: 'DiagnÃ³stico BÃ¡sico',
    description: 'EvaluaciÃ³n inicial de conocimientos',
    recommendedMaterials: ['diagnostic_tests'],
    defaultCount: 8,
    estimatedDuration: 25,
    icon: 'ðŸ”'
  },
  'exploration': {
    name: 'ExploraciÃ³n',
    description: 'Explora nuevos conceptos y temas',
    recommendedMaterials: ['study_content', 'exercises'],
    defaultCount: 5,
    estimatedDuration: 35,
    icon: 'ðŸ”­'
  },
  'practice': {
    name: 'PrÃ¡ctica',
    description: 'Practica lo aprendido con ejercicios',
    recommendedMaterials: ['exercises', 'practice_guides'],
    defaultCount: 7,
    estimatedDuration: 40,
    icon: 'âœï¸'
  },
  'application': {
    name: 'AplicaciÃ³n',
    description: 'Aplica conocimientos en situaciones reales',
    recommendedMaterials: ['simulations', 'exercises'],
    defaultCount: 10,
    estimatedDuration: 55,
    icon: 'ðŸš€'
  }
};

export const MATERIAL_TYPE_CONFIG: Record<MaterialType, {
  name: string;
  description: string;
  icon: string;
  estimatedTimePerItem: number;
}> = {
  'exercises': {
    name: 'Ejercicios',
    description: 'Preguntas tipo PAES para practicar',
    icon: 'ðŸ“',
    estimatedTimePerItem: 3
  },
  'study_content': {
    name: 'Material de Estudio',
    description: 'Contenido teÃ³rico y explicaciones',
    icon: 'ðŸ“–',
    estimatedTimePerItem: 8
  },
  'diagnostic_tests': {
    name: 'Evaluaciones DiagnÃ³sticas',
    description: 'Tests para medir progreso especÃ­fico',
    icon: 'ðŸ”¬',
    estimatedTimePerItem: 4
  },
  'practice_guides': {
    name: 'GuÃ­as de PrÃ¡ctica',
    description: 'Ejercicios paso a paso con soluciones',
    icon: 'ðŸ—ºï¸',
    estimatedTimePerItem: 6
  },
  'simulations': {
    name: 'Simulacros',
    description: 'Pruebas completas formato PAES',
    icon: 'ðŸŽ­',
    estimatedTimePerItem: 2
  }
};

export const getRecommendedConfigForPhase = (phase: TLearningCyclePhase, subject: string) => {
  // ValidaciÃ³n defensiva
  if (!phase || !PHASE_CONFIG[phase]) {
    console.warn('Fase invÃ¡lida o no encontrada:', phase);
    // Retornar configuraciÃ³n por defecto
    return {
      recommendedMaterials: ['exercises'] as MaterialType[],
      defaultCount: 5,
      estimatedDuration: 30,
      primaryMaterial: 'exercises' as MaterialType,
      phase: 'SKILL_TRAINING' as TLearningCyclePhase,
      subject: subject
    };
  }

  const phaseConfig = PHASE_CONFIG[phase];
  
  return {
    recommendedMaterials: phaseConfig.recommendedMaterials,
    defaultCount: phaseConfig.defaultCount,
    estimatedDuration: phaseConfig.estimatedDuration,
    primaryMaterial: phaseConfig.recommendedMaterials[0],
    phase: phase,
    subject: subject
  };
};

// FunciÃ³n helper para validar fases
export const isValidPhase = (phase: unknown): phase is TLearningCyclePhase => {
  return typeof phase === 'string' && phase in PHASE_CONFIG;
};

// FunciÃ³n helper para obtener la configuraciÃ³n de fase de forma segura
export const getPhaseConfigSafe = (phase: TLearningCyclePhase) => {
  return PHASE_CONFIG[phase] || PHASE_CONFIG['SKILL_TRAINING'];
};


