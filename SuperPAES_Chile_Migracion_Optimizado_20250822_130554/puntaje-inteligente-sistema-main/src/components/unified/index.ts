/* eslint-disable react-refresh/only-export-components */
// UNIFIED SYSTEM - Exportaciones del Sistema Unificado
// Context7 + Pensamiento Secuencial - Rafael's Arsenal GrÃ¡fico

import React from 'react';

export { UnifiedLayout } from './UnifiedLayout';
export {
  UnifiedCard,
  UnifiedButton,
  UnifiedMetric,
  UnifiedProgress,
  UnifiedNotification,
  UnifiedBadge,
  UnifiedContainer,
  UnifiedGrid
} from './UnifiedComponents';

// Tipos del Layout
export type UnifiedLayoutProps = {
  children: React.ReactNode;
  currentSection?: 'anatomia' | 'professional' | 'paes' | 'universe';
  showParticles?: boolean;
  showEffects?: boolean;
  theme?: 'neural' | 'spotify' | 'paes' | 'leonardo';
};

// Constantes del sistema unificado
export const UNIFIED_THEMES = {
  NEURAL: 'neural' as const,
  SPOTIFY: 'spotify' as const,
  PAES: 'paes' as const,
  LEONARDO: 'leonardo' as const
};

export const UNIFIED_SECTIONS = {
  ANATOMIA: 'anatomia' as const,
  PROFESSIONAL: 'professional' as const,
  PAES: 'paes' as const,
  UNIVERSE: 'universe' as const
};

export const UNIFIED_VARIANTS = {
  PRIMARY: 'primary' as const,
  SECONDARY: 'secondary' as const,
  SUCCESS: 'success' as const,
  WARNING: 'warning' as const,
  ERROR: 'error' as const,
  GHOST: 'ghost' as const,
  NEURAL: 'neural' as const
};

export const UNIFIED_SIZES = {
  SM: 'sm' as const,
  MD: 'md' as const,
  LG: 'lg' as const,
  XL: 'xl' as const
};

// Hooks del sistema unificado
export const useUnifiedTheme = () => {
  const [theme, setTheme] = React.useState<keyof typeof UNIFIED_THEMES>('LEONARDO');
  
  const changeTheme = (newTheme: keyof typeof UNIFIED_THEMES) => {
    setTheme(newTheme);
    // Aplicar tema globalmente
    document.documentElement.setAttribute('data-unified-theme', UNIFIED_THEMES[newTheme]);
  };

  return { theme: UNIFIED_THEMES[theme], changeTheme };
};

export const useUnifiedNotifications = () => {
  const [notifications, setNotifications] = React.useState<Array<{
    id: string;
    type: 'success' | 'info' | 'warning' | 'error';
    title?: string;
    message: string;
    icon?: string;
    duration?: number;
  }>>([]);

  const addNotification = (notification: Omit<typeof notifications[0], 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  };
};

// Utilidades del sistema unificado
export const unifiedUtils = {
  // Generar clases CSS dinÃ¡micas
  generateClasses: (...classes: (string | undefined | false)[]) => {
    return classes.filter(Boolean).join(' ');
  },

  // Formatear mÃ©tricas
  formatMetric: (value: number, type: 'percentage' | 'time' | 'count' = 'count') => {
    switch (type) {
      case 'percentage':
        return `${Math.round(value)}%`;
      case 'time':
        return value >= 60 ? `${Math.floor(value / 60)}h ${value % 60}m` : `${value}m`;
      case 'count':
        return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
      default:
        return value.toString();
    }
  },

  // Generar colores dinÃ¡micos
  getThemeColor: (theme: string, variant: string = 'primary') => {
    const colors = {
      leonardo: {
        primary: '#1db954',
        secondary: '#8b5cf6',
        accent: '#3b82f6'
      },
      spotify: {
        primary: '#1db954',
        secondary: '#1ed760',
        accent: '#191414'
      },
      paes: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#8b5cf6'
      },
      neural: {
        primary: '#8b5cf6',
        secondary: '#ec4899',
        accent: '#06b6d4'
      }
    };

    return colors[theme as keyof typeof colors]?.[variant as keyof typeof colors.leonardo] || '#1db954';
  },

  // Detectar rendimiento del dispositivo
  detectPerformance: () => {
    const memory = (navigator as Navigator & { deviceMemory?: number })?.deviceMemory;
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })?.connection;
    
    if (memory && memory < 4) return 'low';
    if (connection && connection.effectiveType === '3g') return 'medium';
    return 'high';
  }
};

// ConfiguraciÃ³n global del sistema unificado
export const UNIFIED_CONFIG = {
  animations: {
    duration: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s'
    },
    easing: {
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  zIndex: {
    base: 1,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modal: 400,
    popover: 500,
    tooltip: 600,
    notification: 700,
    overlay: 800,
    max: 9999
  }
};
