
import { 
  Brain, Target, Settings, Users, Calendar,
  DollarSign, BookOpen, BarChart3, Gamepad2,
  Grid3x3, Sparkles, Globe, Eye, Layers
} from 'lucide-react';
import { NeuralDimensionConfig } from './neuralTypes';

export const NEURAL_DIMENSIONS: NeuralDimensionConfig[] = [
  // Fase 1: Diagnóstico
  {
    id: 'matrix_diagnostics',
    name: 'Matrix Diagnóstico',
    description: 'Sistema de evaluación neural avanzado',
    icon: Grid3x3,
    color: 'from-green-600 to-emerald-600',
    phase: 'Diagnóstico',
    order: 1
  },
  {
    id: 'intelligence_hub',
    name: 'Centro de Inteligencia',
    description: 'Hub de análisis y procesamiento neural',
    icon: Eye,
    color: 'from-purple-600 to-violet-600',
    phase: 'Diagnóstico',
    order: 2
  },
  
  // Fase 2: Planificación
  {
    id: 'vocational_prediction',
    name: 'Predicción Vocacional',
    description: 'Plan inteligente de futuro académico',
    icon: Target,
    color: 'from-indigo-600 to-blue-600',
    phase: 'Planificación',
    order: 3
  },
  {
    id: 'financial_center',
    name: 'Centro Financiero',
    description: 'Gestión económica educativa neural',
    icon: DollarSign,
    color: 'from-emerald-600 to-green-600',
    phase: 'Planificación',
    order: 4
  },
  
  // Fase 3: Práctica
  {
    id: 'neural_training',
    name: 'Entrenamiento Neural',
    description: 'LectoGuía y ejercitación adaptativa',
    icon: Brain,
    color: 'from-purple-600 to-pink-600',
    phase: 'Práctica',
    order: 5
  },
  {
    id: 'educational_universe',
    name: 'Universo Educativo',
    description: 'Exploración 3D del conocimiento',
    icon: Globe,
    color: 'from-cyan-600 to-blue-600',
    phase: 'Práctica',
    order: 6
  },
  
  // Fase 4: Evaluación
  {
    id: 'battle_mode',
    name: 'Modo Batalla PAES',
    description: 'Simulaciones y evaluaciones reales',
    icon: Gamepad2,
    color: 'from-red-600 to-orange-600',
    phase: 'Evaluación',
    order: 7
  },
  {
    id: 'paes_universe',
    name: 'Universo PAES',
    description: 'Exploración completa del ecosistema PAES',
    icon: Sparkles,
    color: 'from-blue-600 to-purple-600',
    phase: 'Evaluación',
    order: 8
  },
  
  // Fase 5: Análisis
  {
    id: 'progress_analysis',
    name: 'Análisis de Progreso',
    description: 'Métricas neurales en tiempo real',
    icon: BarChart3,
    color: 'from-green-600 to-teal-600',
    phase: 'Análisis',
    order: 9
  },
  {
    id: 'holographic_analytics',
    name: 'Análisis Holográfico',
    description: 'Visualización avanzada de datos neurales',
    icon: Layers,
    color: 'from-violet-600 to-purple-600',
    phase: 'Análisis',
    order: 10
  },
  
  // Fase 6: Gestión
  {
    id: 'calendar_management',
    name: 'Gestión Temporal',
    description: 'Calendario inteligente neural',
    icon: Calendar,
    color: 'from-cyan-600 to-blue-600',
    phase: 'Gestión',
    order: 11
  },
  {
    id: 'settings_control',
    name: 'Control Neural',
    description: 'Configuración del ecosistema',
    icon: Settings,
    color: 'from-gray-600 to-slate-600',
    phase: 'Gestión',
    order: 12
  }
];

export const getDimensionsByPhase = () => {
  return NEURAL_DIMENSIONS.reduce((acc, dimension) => {
    if (!acc[dimension.phase]) {
      acc[dimension.phase] = [];
    }
    acc[dimension.phase].push(dimension);
    return acc;
  }, {} as Record<string, NeuralDimensionConfig[]>);
};
