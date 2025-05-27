/**
 * UNIFIED EDUCATION STATE MANAGER v3.0 - DEFINITIVO
 * Sistema de estado optimizado con memoización y cache
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { unifiedStorageSystem } from '@/core/storage/UnifiedStorageSystem';
import { useMemo, useCallback } from 'react';

interface UnifiedEducationState {
  system: SystemState;
  user: UserState;
  lectoguia: LectoGuiaState;
  superpaes: SuperPAESState;
  metrics: MetricsState;
  ui: UIState;
}

interface SystemState {
  isInitialized: boolean;
  isLoading: boolean;
  healthScore: number;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  lastSync: Date | null;
  version: string;
}

interface UserState {
  id: string | null;
  profile: any | null;
  preferences: Record<string, string>;
  progress: Record<string, number>;
}

interface LectoGuiaState {
  activeSubject: string;
  messages: any[];
  nodes: any[];
  nodeProgress: Record<string, any>;
  isTyping: boolean;
  activeSkill: string | null;
}

interface SuperPAESState {
  activeTest: string | null;
  progress: Record<string, number>;
  results: any[];
  currentSession: string | null;
}

interface MetricsState {
  level: number;
  points: number;
  streakDays: number;
  todayStudyTime: number;
  totalExercises: number;
  averageScore: number;
}

interface UIState {
  activeModule: 'lectoguia' | 'superpaes' | 'dashboard' | null;
  sidebarOpen: boolean;
  notifications: any[];
  connectionStatus: 'connected' | 'disconnected';
}

// Cache para métricas de performance
let metricsCache: any = null;
let metricsLastUpdate = 0;
const METRICS_CACHE_TTL = 5000; // 5 segundos

// Función memoizada para métricas de performance
const getPerformanceMetricsOptimized = () => {
  const now = Date.now();
  if (metricsCache && (now - metricsLastUpdate) < METRICS_CACHE_TTL) {
    return metricsCache;
  }
  
  metricsCache = unifiedStorageSystem.getPerformanceMetrics();
  metricsLastUpdate = now;
  return metricsCache;
};

export const useUnifiedEducationStore = create<UnifiedEducationState>()(
  subscribeWithSelector((set, get) => ({
    system: {
      isInitialized: false,
      isLoading: false,
      healthScore: 100,
      connectionStatus: 'connecting',
      lastSync: null,
      version: '3.0.0'
    },
    user: {
      id: null,
      profile: null,
      preferences: {},
      progress: {}
    },
    lectoguia: {
      activeSubject: 'competencia-lectora',
      messages: [],
      nodes: [],
      nodeProgress: {},
      isTyping: false,
      activeSkill: null
    },
    superpaes: {
      activeTest: null,
      progress: {},
      results: [],
      currentSession: null
    },
    metrics: {
      level: 1,
      points: 0,
      streakDays: 0,
      todayStudyTime: 0,
      totalExercises: 0,
      averageScore: 0
    },
    ui: {
      activeModule: null,
      sidebarOpen: false,
      notifications: [],
      connectionStatus: 'connected'
    }
  }))
);

// Hook optimizado con memoización
export const useUnifiedActions = () => {
  const store = useUnifiedEducationStore();
  
  return useMemo(() => ({
    // System actions
    initialize: (userId: string) => {
      store.setState(state => ({
        ...state,
        system: { ...state.system, isLoading: true },
        user: { ...state.user, id: userId }
      }));
      
      setTimeout(() => {
        store.setState(state => ({
          ...state,
          system: {
            ...state.system,
            isInitialized: true,
            isLoading: false,
            lastSync: new Date()
          }
        }));
      }, 1000);
    },
    
    setSystemHealth: (score: number) => {
      store.setState(state => ({
        ...state,
        system: { ...state.system, healthScore: Math.max(0, Math.min(100, score)) }
      }));
    },
    
    setConnectionStatus: (status: 'connected' | 'disconnected') => {
      store.setState(state => ({
        ...state,
        system: { ...state.system, connectionStatus: status },
        ui: { ...state.ui, connectionStatus: status }
      }));
    },
    
    // LectoGuía actions
    setLectoGuiaSubject: (subject: string) => {
      store.setState(state => ({
        ...state,
        lectoguia: { ...state.lectoguia, activeSubject: subject }
      }));
    },
    
    addLectoGuiaMessage: (message: any) => {
      store.setState(state => ({
        ...state,
        lectoguia: {
          ...state.lectoguia,
          messages: [...state.lectoguia.messages, { ...message, id: Date.now() }]
        }
      }));
    },
    
    setActiveModule: (module: 'lectoguia' | 'superpaes' | 'dashboard') => {
      store.setState(state => ({
        ...state,
        ui: { ...state.ui, activeModule: module }
      }));
    },
    
    updateLectoGuiaNodes: (nodes: any[]) => {
      store.setState(state => ({
        ...state,
        lectoguia: { ...state.lectoguia, nodes }
      }));
    },
    
    updateNodeProgress: (nodeId: string, progress: any) => {
      store.setState(state => ({
        ...state,
        lectoguia: {
          ...state.lectoguia,
          nodeProgress: {
            ...state.lectoguia.nodeProgress,
            [nodeId]: progress
          }
        }
      }));
    },
    
    updateUserPreferences: (preferences: Record<string, string>) => {
      store.setState(state => ({
        ...state,
        user: { ...state.user, preferences }
      }));
    },
    
    addNotification: (notification: any) => {
      store.setState(state => ({
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, { ...notification, id: Date.now() }]
        }
      }));
    },
    
    syncToStorage: () => {
      const state = store.getState();
      unifiedStorageSystem.setItem('unified_education_state', state, { silentErrors: true });
    }
  }), [store]);
};

// Hook optimizado para system health con memoización
export const useSystemHealth = () => {
  const healthScore = useUnifiedEducationStore(state => state.system.healthScore);
  const connectionStatus = useUnifiedEducationStore(state => state.system.connectionStatus);
  
  return useMemo(() => {
    const metrics = getPerformanceMetricsOptimized();
    
    return {
      healthScore,
      isHealthy: healthScore >= 70,
      trackingBlocked: metrics.trackingBlocked || false,
      connectionStatus,
      metrics
    };
  }, [healthScore, connectionStatus]);
};
