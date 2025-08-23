// ========================================
// SUPERPAES CHILE - CONFIGURACIÓN DE NAVEGACIÓN
// ========================================

import {
  Home,
  Target,
  Music,
  Bot,
  BarChart3,
  Calendar,
  Book,
  Zap,
  Brain,
  Layers,
  TrendingUp,
  Network,
  Atom
} from 'lucide-react'

export interface NavigationItem {
  id: string;
  label: string;
  ariaLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    ariaLabel: 'Ir al Dashboard',
    icon: Home
  },
  {
    id: 'goals',
    label: 'Metas PAES',
    ariaLabel: 'Ir a Metas PAES',
    icon: Target
  },
  {
    id: 'playlists',
    label: 'Playlists Neural',
    ariaLabel: 'Ir a Playlists Neural',
    icon: Music
  },
  {
    id: 'agents',
    label: 'Agentes IA',
    ariaLabel: 'Ir a Agentes IA',
    icon: Bot
  },
  {
    id: 'analytics',
    label: 'Analytics',
    ariaLabel: 'Ir a Analytics',
    icon: BarChart3
  },
  {
    id: 'calendar',
    label: 'Calendario',
    ariaLabel: 'Ir a Calendario',
    icon: Calendar
  },
  {
    id: 'exercises',
    label: 'Ejercicios PAES',
    ariaLabel: 'Ir a Ejercicios PAES',
    icon: Book
  },
  {
    id: 'integrated-system',
    label: 'Sistema Integrado',
    ariaLabel: 'Ver sistema integrado SUPERPAES',
    icon: Zap
  },
  {
    id: 'diagnostico',
    label: 'Diagnóstico',
    ariaLabel: 'Diagnóstico Inteligente PAES',
    icon: Brain
  },
  {
    id: 'paes-nodes',
    label: 'Nodos PAES',
    ariaLabel: 'Nodos Educativos Oficiales PAES',
    icon: Layers
  },
  {
    id: 'neural-predictions',
    label: 'Predicciones Neural',
    ariaLabel: 'Predicciones Neurales IA',
    icon: TrendingUp
  },
  {
    id: 'unified-nodes',
    label: 'Nodos Unificados',
    ariaLabel: 'Sistema Unificado de Nodos PAES',
    icon: Network
  }
]
