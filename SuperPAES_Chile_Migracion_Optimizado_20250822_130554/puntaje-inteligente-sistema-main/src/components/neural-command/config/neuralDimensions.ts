/* eslint-disable react-refresh/only-export-components */
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../../types/core';


export interface NeuralDimension {
  id: string;
  title: string;
  description: string;
  phase: 'foundation' | 'intelligence' | 'evolution';
  color: string;
  glowColor: string;
  icon: string;
  status: 'active' | 'developing' | 'conceptual';
  complexity: number;
  dependencies: string[];
  features: string[];
}

export const NEURAL_DIMENSIONS: NeuralDimension[] = [
  // PHASE 1: FOUNDATION (Base Neural)
  {
    id: 'neural_command',
    title: 'Centro de Comando Neural',
    description: 'Hub central del ecosistema neural con mÃ©tricas en tiempo real',
    phase: 'foundation',
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'cyan',
    icon: 'ðŸ§ ',
    status: 'active',
    complexity: 1,
    dependencies: [],
    features: ['MÃ©tricas en tiempo real', 'Estado del sistema', 'NavegaciÃ³n neural']
  },
  
  {
    id: 'educational_universe',
    title: 'Universo Educativo 3D',
    description: 'ExploraciÃ³n inmersiva del conocimiento en entorno 3D',
    phase: 'foundation',
    color: 'from-purple-500 to-pink-600',
    glowColor: 'purple',
    icon: 'ðŸŒŒ',
    status: 'active',
    complexity: 2,
    dependencies: ['neural_command'],
    features: ['NavegaciÃ³n 3D', 'Mundos inmersivos', 'ExploraciÃ³n gamificada']
  },

  {
    id: 'neural_training',
    title: 'Entrenamiento Neural',
    description: 'LectoGuÃ­a con IA adaptativa y ejercicios personalizados',
    phase: 'foundation',
    color: 'from-green-500 to-emerald-600',
    glowColor: 'green',
    icon: 'ðŸŽ¯',
    status: 'active',
    complexity: 3,
    dependencies: ['neural_command'],
    features: ['IA conversacional', 'Ejercicios adaptativos', 'AnÃ¡lisis de texto']
  },

  // PHASE 2: INTELLIGENCE (IA Avanzada)
  {
    id: 'progress_analysis',
    title: 'AnÃ¡lisis de Progreso',
    description: 'DiagnÃ³sticos inteligentes y anÃ¡lisis predictivo',
    phase: 'intelligence',
    color: 'from-orange-500 to-red-600',
    glowColor: 'orange',
    icon: 'ðŸ“Š',
    status: 'active',
    complexity: 4,
    dependencies: ['neural_command', 'neural_training'],
    features: ['DiagnÃ³sticos IA', 'AnÃ¡lisis predictivo', 'Reportes avanzados']
  },

  {
    id: 'paes_simulation',
    title: 'SimulaciÃ³n PAES',
    description: 'Simulador avanzado con IA y anÃ¡lisis de rendimiento',
    phase: 'intelligence',
    color: 'from-red-500 to-orange-600',
    glowColor: 'red',
    icon: 'ðŸŽ­',
    status: 'active',
    complexity: 5,
    dependencies: ['progress_analysis'],
    features: ['Simulaciones reales', 'IA evaluadora', 'PredicciÃ³n de puntajes']
  },

  {
    id: 'personalized_feedback',
    title: 'Feedback Personalizado',
    description: 'Sistema de retroalimentaciÃ³n inteligente y adaptativo',
    phase: 'intelligence',
    color: 'from-blue-500 to-purple-600',
    glowColor: 'blue',
    icon: 'ðŸ’¬',
    status: 'developing',
    complexity: 4,
    dependencies: ['progress_analysis', 'neural_training'],
    features: ['Feedback IA', 'Recomendaciones personalizadas', 'Coaching virtual']
  },

  // PHASE 3: EVOLUTION (GamificaciÃ³n y Futuro)
  {
    id: 'battle_mode',
    title: 'Modo Batalla',
    description: 'Competencias Ã©picas y desafÃ­os en tiempo real',
    phase: 'evolution',
    color: 'from-pink-500 to-purple-600',
    glowColor: 'pink',
    icon: 'âš”ï¸',
    status: 'developing',
    complexity: 6,
    dependencies: ['paes_simulation', 'achievement_system'],
    features: ['PvP educativo', 'Torneos Ã©picos', 'Rankings globales']
  },

  {
    id: 'achievement_system',
    title: 'Sistema de Logros',
    description: 'GamificaciÃ³n avanzada con logros y recompensas',
    phase: 'evolution',
    color: 'from-yellow-500 to-orange-600',
    glowColor: 'yellow',
    icon: 'ðŸ†',
    status: 'developing',
    complexity: 3,
    dependencies: ['neural_training'],
    features: ['Logros dinÃ¡micos', 'Sistema de XP', 'Recompensas virtuales']
  },

  {
    id: 'vocational_prediction',
    title: 'PredicciÃ³n Vocacional',
    description: 'IA predictiva para orientaciÃ³n vocacional y futuro acadÃ©mico',
    phase: 'evolution',
    color: 'from-indigo-500 to-blue-600',
    glowColor: 'indigo',
    icon: 'ðŸ”®',
    status: 'conceptual',
    complexity: 7,
    dependencies: ['progress_analysis', 'paes_simulation'],
    features: ['IA predictiva', 'AnÃ¡lisis vocacional', 'ProyecciÃ³n acadÃ©mica']
  },

  {
    id: 'financial_center',
    title: 'Centro Financiero',
    description: 'Calculadora PAES y planificaciÃ³n financiera universitaria',
    phase: 'foundation',
    color: 'from-emerald-500 to-green-600',
    glowColor: 'emerald',
    icon: 'ðŸ’°',
    status: 'active',
    complexity: 2,
    dependencies: ['neural_command'],
    features: ['Calculadora PAES', 'Costos universitarios', 'PlanificaciÃ³n financiera']
  },

  {
    id: 'calendar_management',
    title: 'GestiÃ³n de Calendario',
    description: 'Calendario inteligente con IA para optimizaciÃ³n de estudio',
    phase: 'intelligence',
    color: 'from-teal-500 to-blue-600',
    glowColor: 'teal',
    icon: 'ðŸ“…',
    status: 'active',
    complexity: 3,
    dependencies: ['neural_command'],
    features: ['Calendario IA', 'OptimizaciÃ³n horarios', 'Recordatorios inteligentes']
  },

  {
    id: 'settings_control',
    title: 'Control de ConfiguraciÃ³n',
    description: 'Centro de configuraciÃ³n avanzado y personalizaciÃ³n',
    phase: 'foundation',
    color: 'from-gray-500 to-slate-600',
    glowColor: 'gray',
    icon: 'âš™ï¸',
    status: 'active',
    complexity: 1,
    dependencies: ['neural_command'],
    features: ['ConfiguraciÃ³n avanzada', 'PersonalizaciÃ³n', 'GestiÃ³n de datos']
  }
];

// Organizar dimensiones por fases
export const getDimensionsByPhase = () => {
  return {
    foundation: NEURAL_DIMENSIONS.filter(d => d.phase === 'foundation'),
    intelligence: NEURAL_DIMENSIONS.filter(d => d.phase === 'intelligence'),
    evolution: NEURAL_DIMENSIONS.filter(d => d.phase === 'evolution')
  };
};

// Obtener dimensiÃ³n por ID
export const getDimensionById = (id: string): NeuralDimension | undefined => {
  return NEURAL_DIMENSIONS.find(d => d.id === id);
};

// Validar dependencias
export const validateDependencies = (dimensionId: string): boolean => {
  const dimension = getDimensionById(dimensionId);
  if (!dimension) return false;
  
  return dimension.dependencies.every(depId => {
    const dep = getDimensionById(depId);
    return dep?.status === 'active';
  });
};


