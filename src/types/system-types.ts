
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
  | 'FINAL_SIMULATIONS';

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

export interface TLearningNode {
  id: string;
  title: string;
  description: string;
  content?: string | {
    theory: string;
    examples: any[];
    exerciseCount: number;
  };
  phase?: TLearningCyclePhase;
  skill: TPAESHabilidad;
  prueba: TPAESPrueba;
  bloomLevel?: string;
  estimatedTime?: number;
  estimatedTimeMinutes?: number;
  difficulty: string;
  prerequisites?: string[];
  dependsOn?: string[];
  learningObjectives?: string[];
  tags?: string[];
  resources?: string[];
  createdAt?: string;
  updatedAt?: string;
  position?: number;
}

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
    default:
      return 'Fase del ciclo de aprendizaje';
  }
}
