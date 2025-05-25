
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
    description: 'Hub central del ecosistema neural con métricas en tiempo real',
    phase: 'foundation',
    color: 'from-cyan-500 to-blue-600',
    glowColor: 'cyan',
    icon: '🧠',
    status: 'active',
    complexity: 1,
    dependencies: [],
    features: ['Métricas en tiempo real', 'Estado del sistema', 'Navegación neural']
  },
  
  {
    id: 'educational_universe',
    title: 'Universo Educativo 3D',
    description: 'Exploración inmersiva del conocimiento en entorno 3D',
    phase: 'foundation',
    color: 'from-purple-500 to-pink-600',
    glowColor: 'purple',
    icon: '🌌',
    status: 'active',
    complexity: 2,
    dependencies: ['neural_command'],
    features: ['Navegación 3D', 'Mundos inmersivos', 'Exploración gamificada']
  },

  {
    id: 'neural_training',
    title: 'Entrenamiento Neural',
    description: 'LectoGuía con IA adaptativa y ejercicios personalizados',
    phase: 'foundation',
    color: 'from-green-500 to-emerald-600',
    glowColor: 'green',
    icon: '🎯',
    status: 'active',
    complexity: 3,
    dependencies: ['neural_command'],
    features: ['IA conversacional', 'Ejercicios adaptativos', 'Análisis de texto']
  },

  // PHASE 2: INTELLIGENCE (IA Avanzada)
  {
    id: 'progress_analysis',
    title: 'Análisis de Progreso',
    description: 'Diagnósticos inteligentes y análisis predictivo',
    phase: 'intelligence',
    color: 'from-orange-500 to-red-600',
    glowColor: 'orange',
    icon: '📊',
    status: 'active',
    complexity: 4,
    dependencies: ['neural_command', 'neural_training'],
    features: ['Diagnósticos IA', 'Análisis predictivo', 'Reportes avanzados']
  },

  {
    id: 'paes_simulation',
    title: 'Simulación PAES',
    description: 'Simulador avanzado con IA y análisis de rendimiento',
    phase: 'intelligence',
    color: 'from-red-500 to-orange-600',
    glowColor: 'red',
    icon: '🎭',
    status: 'active',
    complexity: 5,
    dependencies: ['progress_analysis'],
    features: ['Simulaciones reales', 'IA evaluadora', 'Predicción de puntajes']
  },

  {
    id: 'personalized_feedback',
    title: 'Feedback Personalizado',
    description: 'Sistema de retroalimentación inteligente y adaptativo',
    phase: 'intelligence',
    color: 'from-blue-500 to-purple-600',
    glowColor: 'blue',
    icon: '💬',
    status: 'developing',
    complexity: 4,
    dependencies: ['progress_analysis', 'neural_training'],
    features: ['Feedback IA', 'Recomendaciones personalizadas', 'Coaching virtual']
  },

  // PHASE 3: EVOLUTION (Gamificación y Futuro)
  {
    id: 'battle_mode',
    title: 'Modo Batalla',
    description: 'Competencias épicas y desafíos en tiempo real',
    phase: 'evolution',
    color: 'from-pink-500 to-purple-600',
    glowColor: 'pink',
    icon: '⚔️',
    status: 'developing',
    complexity: 6,
    dependencies: ['paes_simulation', 'achievement_system'],
    features: ['PvP educativo', 'Torneos épicos', 'Rankings globales']
  },

  {
    id: 'achievement_system',
    title: 'Sistema de Logros',
    description: 'Gamificación avanzada con logros y recompensas',
    phase: 'evolution',
    color: 'from-yellow-500 to-orange-600',
    glowColor: 'yellow',
    icon: '🏆',
    status: 'developing',
    complexity: 3,
    dependencies: ['neural_training'],
    features: ['Logros dinámicos', 'Sistema de XP', 'Recompensas virtuales']
  },

  {
    id: 'vocational_prediction',
    title: 'Predicción Vocacional',
    description: 'IA predictiva para orientación vocacional y futuro académico',
    phase: 'evolution',
    color: 'from-indigo-500 to-blue-600',
    glowColor: 'indigo',
    icon: '🔮',
    status: 'conceptual',
    complexity: 7,
    dependencies: ['progress_analysis', 'paes_simulation'],
    features: ['IA predictiva', 'Análisis vocacional', 'Proyección académica']
  },

  {
    id: 'financial_center',
    title: 'Centro Financiero',
    description: 'Calculadora PAES y planificación financiera universitaria',
    phase: 'foundation',
    color: 'from-emerald-500 to-green-600',
    glowColor: 'emerald',
    icon: '💰',
    status: 'active',
    complexity: 2,
    dependencies: ['neural_command'],
    features: ['Calculadora PAES', 'Costos universitarios', 'Planificación financiera']
  },

  {
    id: 'calendar_management',
    title: 'Gestión de Calendario',
    description: 'Calendario inteligente con IA para optimización de estudio',
    phase: 'intelligence',
    color: 'from-teal-500 to-blue-600',
    glowColor: 'teal',
    icon: '📅',
    status: 'active',
    complexity: 3,
    dependencies: ['neural_command'],
    features: ['Calendario IA', 'Optimización horarios', 'Recordatorios inteligentes']
  },

  {
    id: 'settings_control',
    title: 'Control de Configuración',
    description: 'Centro de configuración avanzado y personalización',
    phase: 'foundation',
    color: 'from-gray-500 to-slate-600',
    glowColor: 'gray',
    icon: '⚙️',
    status: 'active',
    complexity: 1,
    dependencies: ['neural_command'],
    features: ['Configuración avanzada', 'Personalización', 'Gestión de datos']
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

// Obtener dimensión por ID
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
