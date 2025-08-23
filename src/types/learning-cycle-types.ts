
/**
 * Types and utilities related to the learning cycle
 */

export type TLearningCyclePhase =
  | 'diagnostic'
  | 'exploration'
  | 'practice'
  | 'application'
  | 'DIAGNOSIS'
  | 'PERSONALIZED_PLAN'
  | 'SKILL_TRAINING'
  | 'CONTENT_STUDY'
  | 'PERIODIC_TESTS'
  | 'FEEDBACK_ANALYSIS'
  | 'REINFORCEMENT'
  | 'FINAL_SIMULATIONS'
  | 'EXPERIENCIA_CONCRETA'
  | 'OBSERVACION_REFLEXIVA'
  | 'CONCEPTUALIZACION_ABSTRACTA'
  | 'EXPERIMENTACION_ACTIVA';

export const LEARNING_CYCLE_PHASES_ORDER: TLearningCyclePhase[] = [
  'DIAGNOSIS',
  'PERSONALIZED_PLAN',
  'SKILL_TRAINING',
  'CONTENT_STUDY',
  'PERIODIC_TESTS',
  'FEEDBACK_ANALYSIS',
  'REINFORCEMENT',
  'FINAL_SIMULATIONS'
];

/**
 * Obtiene el nombre para mostrar de una fase del ciclo de aprendizaje
 */
export function getLearningCyclePhaseDisplayName(phase: TLearningCyclePhase): string {
  switch (phase) {
    case 'DIAGNOSIS':
      return 'Diagnóstico';
    case 'PERSONALIZED_PLAN':
      return 'Plan Personalizado';
    case 'SKILL_TRAINING':
      return 'Entrenamiento de Habilidades';
    case 'CONTENT_STUDY':
      return 'Estudio de Contenido';
    case 'PERIODIC_TESTS':
      return 'Evaluaciones Periódicas';
    case 'FEEDBACK_ANALYSIS':
      return 'Análisis y Feedback';
    case 'REINFORCEMENT':
      return 'Reforzamiento';
    case 'FINAL_SIMULATIONS':
      return 'Simulaciones Finales';
    case 'diagnostic':
      return 'Diagnóstico';
    case 'exploration':
      return 'Exploración';
    case 'practice':
      return 'Práctica';
    case 'application':
      return 'Aplicación';
    case 'EXPERIENCIA_CONCRETA':
      return 'Experiencia Concreta';
    case 'OBSERVACION_REFLEXIVA':
      return 'Observación Reflexiva';
    case 'CONCEPTUALIZACION_ABSTRACTA':
      return 'Conceptualización Abstracta';
    case 'EXPERIMENTACION_ACTIVA':
      return 'Experimentación Activa';
    default:
      return phase;
  }
}

/**
 * Obtiene la descripción de una fase del ciclo de aprendizaje
 */
export function getLearningCyclePhaseDescription(phase: TLearningCyclePhase): string {
  switch (phase) {
    case 'DIAGNOSIS':
      return 'Evalúa tu nivel actual en diferentes habilidades';
    case 'PERSONALIZED_PLAN':
      return 'Revisa tu plan personalizado según tus resultados';
    case 'SKILL_TRAINING':
      return 'Practica y desarrolla habilidades específicas';
    case 'CONTENT_STUDY':
      return 'Estudia los contenidos teóricos necesarios';
    case 'PERIODIC_TESTS':
      return 'Evalúa tu progreso con pruebas periódicas';
    case 'FEEDBACK_ANALYSIS':
      return 'Analiza tus resultados y áreas de mejora';
    case 'REINFORCEMENT':
      return 'Refuerza tus habilidades más débiles';
    case 'FINAL_SIMULATIONS':
      return 'Practica con simulacros completos de la PAES';
    case 'diagnostic':
      return 'Evalúa tu nivel actual';
    case 'exploration':
      return 'Explora nuevos conceptos';
    case 'practice':
      return 'Practica lo aprendido';
    case 'application':
      return 'Aplica en situaciones reales';
    case 'EXPERIENCIA_CONCRETA':
      return 'Práctica inicial con ejercicios básicos';
    case 'OBSERVACION_REFLEXIVA':
      return 'Análisis de patrones y estrategias';
    case 'CONCEPTUALIZACION_ABSTRACTA':
      return 'Teoría profunda y conceptos avanzados';
    case 'EXPERIMENTACION_ACTIVA':
      return 'Aplicación práctica y simulacros';
    default:
      return 'Fase del ciclo de aprendizaje';
  }
}
