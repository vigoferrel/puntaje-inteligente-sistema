
import { TLearningCyclePhase } from '@/types/system-types';
import { MaterialType, PhaseConfig } from '../types/learning-material-types';

export const PHASE_CONFIG: Record<TLearningCyclePhase, PhaseConfig> = {
  'DIAGNOSIS': {
    name: 'Diagnóstico',
    description: 'Evalúa tu nivel actual y detecta fortalezas y debilidades',
    recommendedMaterials: ['diagnostic_tests', 'exercises'],
    defaultCount: 10,
    estimatedDuration: 30,
    icon: '🔍'
  },
  'PERSONALIZED_PLAN': {
    name: 'Plan Personalizado',
    description: 'Revisa y ajusta tu plan de estudio personalizado',
    recommendedMaterials: ['study_content', 'practice_guides'],
    defaultCount: 5,
    estimatedDuration: 15,
    icon: '📋'
  },
  'SKILL_TRAINING': {
    name: 'Entrenamiento de Habilidades',
    description: 'Practica y desarrolla habilidades específicas',
    recommendedMaterials: ['exercises', 'practice_guides'],
    defaultCount: 8,
    estimatedDuration: 45,
    icon: '💪'
  },
  'CONTENT_STUDY': {
    name: 'Estudio de Contenido',
    description: 'Estudia teoría y conceptos fundamentales',
    recommendedMaterials: ['study_content', 'practice_guides'],
    defaultCount: 6,
    estimatedDuration: 60,
    icon: '📚'
  },
  'PERIODIC_TESTS': {
    name: 'Evaluaciones Periódicas',
    description: 'Mide tu progreso con evaluaciones regulares',
    recommendedMaterials: ['diagnostic_tests', 'exercises'],
    defaultCount: 12,
    estimatedDuration: 40,
    icon: '📊'
  },
  'FEEDBACK_ANALYSIS': {
    name: 'Análisis y Feedback',
    description: 'Analiza resultados y recibe feedback personalizado',
    recommendedMaterials: ['study_content'],
    defaultCount: 3,
    estimatedDuration: 20,
    icon: '📈'
  },
  'REINFORCEMENT': {
    name: 'Reforzamiento',
    description: 'Refuerza áreas débiles identificadas',
    recommendedMaterials: ['exercises', 'practice_guides'],
    defaultCount: 10,
    estimatedDuration: 50,
    icon: '🔧'
  },
  'FINAL_SIMULATIONS': {
    name: 'Simulaciones Finales',
    description: 'Practica con simulacros completos de la PAES',
    recommendedMaterials: ['simulations', 'diagnostic_tests'],
    defaultCount: 65,
    estimatedDuration: 120,
    icon: '🎯'
  },
  // Fases del Ciclo de Kolb
  'EXPERIENCIA_CONCRETA': {
    name: 'Experiencia Concreta',
    description: 'Práctica inicial con ejercicios básicos',
    recommendedMaterials: ['exercises', 'practice_guides'],
    defaultCount: 5,
    estimatedDuration: 25,
    icon: '🎯'
  },
  'OBSERVACION_REFLEXIVA': {
    name: 'Observación Reflexiva',
    description: 'Análisis de patrones y estrategias',
    recommendedMaterials: ['study_content', 'exercises'],
    defaultCount: 4,
    estimatedDuration: 35,
    icon: '👁️'
  },
  'CONCEPTUALIZACION_ABSTRACTA': {
    name: 'Conceptualización Abstracta',
    description: 'Teoría profunda y conceptos avanzados',
    recommendedMaterials: ['study_content', 'practice_guides'],
    defaultCount: 6,
    estimatedDuration: 50,
    icon: '🧠'
  },
  'EXPERIMENTACION_ACTIVA': {
    name: 'Experimentación Activa',
    description: 'Aplicación práctica y simulacros',
    recommendedMaterials: ['simulations', 'exercises'],
    defaultCount: 8,
    estimatedDuration: 45,
    icon: '⚡'
  },
  // Fases tradicionales
  'diagnostic': {
    name: 'Diagnóstico Básico',
    description: 'Evaluación inicial de conocimientos',
    recommendedMaterials: ['diagnostic_tests'],
    defaultCount: 8,
    estimatedDuration: 25,
    icon: '🔍'
  },
  'exploration': {
    name: 'Exploración',
    description: 'Explora nuevos conceptos y temas',
    recommendedMaterials: ['study_content', 'exercises'],
    defaultCount: 5,
    estimatedDuration: 35,
    icon: '🔭'
  },
  'practice': {
    name: 'Práctica',
    description: 'Practica lo aprendido con ejercicios',
    recommendedMaterials: ['exercises', 'practice_guides'],
    defaultCount: 7,
    estimatedDuration: 40,
    icon: '✏️'
  },
  'application': {
    name: 'Aplicación',
    description: 'Aplica conocimientos en situaciones reales',
    recommendedMaterials: ['simulations', 'exercises'],
    defaultCount: 10,
    estimatedDuration: 55,
    icon: '🚀'
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
    icon: '📝',
    estimatedTimePerItem: 3
  },
  'study_content': {
    name: 'Material de Estudio',
    description: 'Contenido teórico y explicaciones',
    icon: '📖',
    estimatedTimePerItem: 8
  },
  'diagnostic_tests': {
    name: 'Evaluaciones Diagnósticas',
    description: 'Tests para medir progreso específico',
    icon: '🔬',
    estimatedTimePerItem: 4
  },
  'practice_guides': {
    name: 'Guías de Práctica',
    description: 'Ejercicios paso a paso con soluciones',
    icon: '🗺️',
    estimatedTimePerItem: 6
  },
  'simulations': {
    name: 'Simulacros',
    description: 'Pruebas completas formato PAES',
    icon: '🎭',
    estimatedTimePerItem: 2
  }
};

export const getRecommendedConfigForPhase = (phase: TLearningCyclePhase, subject: string) => {
  // Validación defensiva
  if (!phase || !PHASE_CONFIG[phase]) {
    console.warn('Fase inválida o no encontrada:', phase);
    // Retornar configuración por defecto
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

// Función helper para validar fases
export const isValidPhase = (phase: any): phase is TLearningCyclePhase => {
  return typeof phase === 'string' && phase in PHASE_CONFIG;
};

// Función helper para obtener la configuración de fase de forma segura
export const getPhaseConfigSafe = (phase: TLearningCyclePhase) => {
  return PHASE_CONFIG[phase] || PHASE_CONFIG['SKILL_TRAINING'];
};
