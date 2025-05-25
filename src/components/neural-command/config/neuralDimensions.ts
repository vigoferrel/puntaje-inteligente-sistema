
import { 
  Brain, Zap, Target, Sparkles, Globe, Eye, Network, Command, 
  Cpu, Activity, BookOpen, BarChart3, Calendar, Settings, 
  DollarSign, Shield, Gamepad2, TrendingUp, Star, Compass
} from 'lucide-react';
import { NeuralDimensionConfig, NeuralDimension } from './neuralTypes';

/**
 * Configuración reorganizada del ecosistema neural PAES
 * Flujo unificado que potencia Universe 3D, SuperPAES y gamificación
 */
export const NEURAL_DIMENSIONS: NeuralDimensionConfig[] = [
  // Fase 1: Centro Neural (Hub Principal)
  {
    id: 'neural_command',
    name: 'Centro de Comando Neural',
    description: 'Hub principal con métricas unificadas y transiciones cinemáticas',
    icon: Brain,
    color: '#00FFFF',
    phase: 'core',
    order: 1
  },

  // Fase 2: Universe 3D (Navegación Principal)
  {
    id: 'educational_universe',
    name: 'Universo Educativo 3D',
    description: 'Galaxias temáticas con datos reales y navegación inmersiva',
    icon: Globe,
    color: '#8A2BE2',
    phase: 'navigation',
    order: 2
  },

  // Fase 3: SuperPAES Coordinador (Sistema Vocacional)
  {
    id: 'superpaes_coordinator',
    name: 'SuperPAES Coordinador',
    description: 'Predicción vocacional y análisis de competencias inteligente',
    icon: Star,
    color: '#FFD700',
    phase: 'coordination',
    order: 3
  },

  // Fase 4: Flujo de Aprendizaje Gamificado
  {
    id: 'neural_training',
    name: 'Entrenamiento Neural',
    description: 'Aprendizaje adaptativo con datos reales de Supabase',
    icon: Target,
    color: '#00FF88',
    phase: 'learning',
    order: 4
  },
  {
    id: 'progress_analysis',
    name: 'Análisis de Progreso',
    description: 'Diagnóstico IA integrado con plan personalizado',
    icon: BarChart3,
    color: '#FF6B6B',
    phase: 'learning',
    order: 5
  },
  {
    id: 'paes_simulation',
    name: 'Simulación PAES Real',
    description: 'Ambiente de examen real con tracking de progreso',
    icon: Shield,
    color: '#FF4500',
    phase: 'learning',
    order: 6
  },
  {
    id: 'personalized_feedback',
    name: 'Feedback Personalizado',
    description: 'Análisis inteligente basado en metas y plan de estudio',
    icon: Compass,
    color: '#32CD32',
    phase: 'learning',
    order: 7
  },

  // Fase 5: Gamificación Sistémica
  {
    id: 'battle_mode',
    name: 'Modo Batalla',
    description: 'Competencia gamificada con logros reales',
    icon: Gamepad2,
    color: '#FF1493',
    phase: 'gamification',
    order: 8
  },
  {
    id: 'achievement_system',
    name: 'Sistema de Logros',
    description: 'Progresión visible conectada al Universe 3D',
    icon: TrendingUp,
    color: '#9370DB',
    phase: 'gamification',
    order: 9
  },

  // Fase 6: Inteligencia Cross-Module
  {
    id: 'vocational_prediction',
    name: 'Predicción Vocacional',
    description: 'Análisis predictivo integrado con centro financiero',
    icon: Eye,
    color: '#4169E1',
    phase: 'intelligence',
    order: 10
  },
  {
    id: 'financial_center',
    name: 'Centro Financiero',
    description: 'Simulaciones económicas conectadas con predicción vocacional',
    icon: DollarSign,
    color: '#228B22',
    phase: 'intelligence',
    order: 11
  },
  {
    id: 'calendar_management',
    name: 'Gestión de Calendario',
    description: 'Planificación sincronizada con plan de estudio inteligente',
    icon: Calendar,
    color: '#FF8C00',
    phase: 'intelligence',
    order: 12
  },
  {
    id: 'settings_control',
    name: 'Control de Sistema',
    description: 'Configuración avanzada del ecosistema neural',
    icon: Settings,
    color: '#708090',
    phase: 'intelligence',
    order: 13
  }
];

/**
 * Agrupación por fases del ecosistema neural
 */
export const getDimensionsByPhase = () => {
  const phases = {
    core: NEURAL_DIMENSIONS.filter(d => d.phase === 'core'),
    navigation: NEURAL_DIMENSIONS.filter(d => d.phase === 'navigation'),
    coordination: NEURAL_DIMENSIONS.filter(d => d.phase === 'coordination'),
    learning: NEURAL_DIMENSIONS.filter(d => d.phase === 'learning'),
    gamification: NEURAL_DIMENSIONS.filter(d => d.phase === 'gamification'),
    intelligence: NEURAL_DIMENSIONS.filter(d => d.phase === 'intelligence')
  };

  return phases;
};

/**
 * Obtener dimensión por ID
 */
export const getDimensionById = (id: NeuralDimension): NeuralDimensionConfig | undefined => {
  return NEURAL_DIMENSIONS.find(d => d.id === id);
};

/**
 * Obtener siguientes dimensiones recomendadas basadas en el flujo
 */
export const getNextRecommendedDimensions = (currentId: NeuralDimension): NeuralDimensionConfig[] => {
  const current = getDimensionById(currentId);
  if (!current) return [];

  const recommendations: Record<NeuralDimension, NeuralDimension[]> = {
    'neural_command': ['educational_universe', 'superpaes_coordinator'],
    'educational_universe': ['neural_training', 'progress_analysis'],
    'superpaes_coordinator': ['vocational_prediction', 'financial_center'],
    'neural_training': ['paes_simulation', 'progress_analysis'],
    'progress_analysis': ['personalized_feedback', 'neural_training'],
    'paes_simulation': ['personalized_feedback', 'battle_mode'],
    'personalized_feedback': ['neural_training', 'achievement_system'],
    'battle_mode': ['achievement_system', 'paes_simulation'],
    'achievement_system': ['educational_universe', 'vocational_prediction'],
    'vocational_prediction': ['financial_center', 'calendar_management'],
    'financial_center': ['vocational_prediction', 'settings_control'],
    'calendar_management': ['neural_training', 'settings_control'],
    'settings_control': ['neural_command', 'educational_universe'],
    'universe_exploration': ['educational_universe'], // Backwards compatibility
    'matrix_diagnostics': ['progress_analysis'], // Backwards compatibility
    'intelligence_hub': ['superpaes_coordinator'], // Backwards compatibility
    'holographic_analytics': ['personalized_feedback'], // Backwards compatibility
    'paes_universe': ['educational_universe'] // Backwards compatibility
  };

  const nextIds = recommendations[currentId] || [];
  return nextIds.map(id => getDimensionById(id)).filter(Boolean) as NeuralDimensionConfig[];
};
