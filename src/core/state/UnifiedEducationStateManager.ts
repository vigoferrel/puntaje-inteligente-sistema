/**
 * UNIFIED EDUCATION STATE MANAGER v2.0
 * Integrado con UnifiedStorageSystem v2.0 - Sin errores de storage
 */

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { unifiedStorageSystem } from '@/core/storage/UnifiedStorageSystem';

// Tipos consolidados para todo el sistema educativo
interface UnifiedEducationState {
  // Estado del sistema
  system: {
    isInitialized: boolean;
    isLoading: boolean;
    healthScore: number;
    lastSync: Date | null;
    activeModule: 'lectoguia' | 'superpaes' | null;
  };
  
  // Usuario y autenticación
  user: {
    id: string | null;
    profile: any | null;
    preferences: Record<string, any>;
    currentPlan: any | null;
  };
  
  // Estado de LectoGuía
  lectoguia: {
    activeSubject: string;
    selectedPrueba: string;
    selectedTestId: string;
    nodes: any[];
    nodeProgress: Record<string, any>;
    messages: any[];
    isTyping: boolean;
    activeSkill: string | null;
  };
  
  // Estado de SuperPAES
  superpaes: {
    testPerformances: any[];
    unifiedMetrics: any | null;
    comparativeAnalysis: any | null;
    activeTestView: string;
  };
  
  // Métricas unificadas
  metrics: {
    studyTime: number;
    totalExercises: number;
    averageScore: number;
    streakDays: number;
    level: number;
  };
  
  // Estado de UI
  ui: {
    cinematicMode: boolean;
    sidebarOpen: boolean;
    notifications: any[];
    connectionStatus: 'connected' | 'disconnected' | 'connecting';
  };
}

interface UnifiedEducationActions {
  // Sistema
  initialize: (userId: string) => Promise<void>;
  setSystemHealth: (score: number) => void;
  setActiveModule: (module: 'lectoguia' | 'superpaes' | null) => void;
  
  // Usuario
  setUser: (user: any) => void;
  updateUserPreferences: (preferences: Record<string, any>) => void;
  
  // LectoGuía
  setLectoGuiaSubject: (subject: string) => void;
  updateLectoGuiaNodes: (nodes: any[]) => void;
  updateNodeProgress: (nodeId: string, progress: any) => void;
  addLectoGuiaMessage: (message: any) => void;
  
  // SuperPAES
  setSuperPAESData: (data: any) => void;
  updateTestPerformances: (performances: any[]) => void;
  
  // Métricas
  updateMetrics: (metrics: Partial<UnifiedEducationState['metrics']>) => void;
  
  // UI
  toggleCinematicMode: () => void;
  addNotification: (notification: any) => void;
  setConnectionStatus: (status: UnifiedEducationState['ui']['connectionStatus']) => void;
  
  // Optimizaciones
  batchUpdate: (updates: Partial<UnifiedEducationState>) => void;
  syncToStorage: () => void;
  loadFromStorage: () => void;
}

type UnifiedStore = UnifiedEducationState & UnifiedEducationActions;

const initialState: UnifiedEducationState = {
  system: {
    isInitialized: false,
    isLoading: false,
    healthScore: 100,
    lastSync: null,
    activeModule: null,
  },
  user: {
    id: null,
    profile: null,
    preferences: {},
    currentPlan: null,
  },
  lectoguia: {
    activeSubject: 'competencia-lectora',
    selectedPrueba: 'COMPETENCIA_LECTORA',
    selectedTestId: '1',
    nodes: [],
    nodeProgress: {},
    messages: [],
    isTyping: false,
    activeSkill: null,
  },
  superpaes: {
    testPerformances: [],
    unifiedMetrics: null,
    comparativeAnalysis: null,
    activeTestView: 'global',
  },
  metrics: {
    studyTime: 0,
    totalExercises: 0,
    averageScore: 0,
    streakDays: 0,
    level: 1,
  },
  ui: {
    cinematicMode: true,
    sidebarOpen: true,
    notifications: [],
    connectionStatus: 'connected',
  },
};

export const useUnifiedEducationStore = create<UnifiedStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          ...initialState,
          
          // Sistema con storage seguro
          initialize: async (userId: string) => {
            if (get().system.isInitialized) return;
            
            set((state) => {
              state.system.isLoading = true;
              state.user.id = userId;
            });
            
            try {
              // Esperar a que el storage esté listo
              await unifiedStorageSystem.waitForReady();
              
              console.log('🚀 Inicializando sistema educativo unificado v2.0...');
              
              // Cargar datos con el nuevo sistema seguro
              const cachedData = unifiedStorageSystem.batchGet([
                'user_preferences_cache_v2',
                'lectoguia_chat_settings_v2',
                'learning_plans_v2',
                'unified_metrics_v2'
              ]);
              
              set((state) => {
                if (cachedData.user_preferences_cache_v2) {
                  state.user.preferences = cachedData.user_preferences_cache_v2;
                }
                if (cachedData.unified_metrics_v2) {
                  state.metrics = { ...state.metrics, ...cachedData.unified_metrics_v2 };
                }
                
                state.system.isInitialized = true;
                state.system.isLoading = false;
                state.system.lastSync = new Date();
                state.system.healthScore = unifiedStorageSystem.getStatus().storageAvailable ? 100 : 80;
              });
              
            } catch (error) {
              console.error('Error initializing unified state:', error);
              set((state) => {
                state.system.isLoading = false;
                state.system.healthScore = 60; // Modo degradado
              });
            }
          },
          
          setSystemHealth: (score: number) => {
            set((state) => {
              state.system.healthScore = score;
            });
          },
          
          setActiveModule: (module: 'lectoguia' | 'superpaes' | null) => {
            set((state) => {
              state.system.activeModule = module;
            });
          },
          
          // Usuario
          setUser: (user: any) => {
            set((state) => {
              state.user.profile = user;
              state.user.id = user?.id || null;
            });
          },
          
          updateUserPreferences: (preferences: Record<string, any>) => {
            set((state) => {
              state.user.preferences = { ...state.user.preferences, ...preferences };
            });
            
            // Sync automático a storage unificado
            get().syncToStorage();
          },
          
          // LectoGuía
          setLectoGuiaSubject: (subject: string) => {
            set((state) => {
              state.lectoguia.activeSubject = subject;
            });
          },
          
          updateLectoGuiaNodes: (nodes: any[]) => {
            set((state) => {
              state.lectoguia.nodes = nodes;
            });
          },
          
          updateNodeProgress: (nodeId: string, progress: any) => {
            set((state) => {
              state.lectoguia.nodeProgress[nodeId] = progress;
            });
          },
          
          addLectoGuiaMessage: (message: any) => {
            set((state) => {
              state.lectoguia.messages.push({
                ...message,
                id: Date.now().toString(),
                timestamp: new Date(),
              });
            });
          },
          
          // SuperPAES
          setSuperPAESData: (data: any) => {
            set((state) => {
              state.superpaes = { ...state.superpaes, ...data };
            });
          },
          
          updateTestPerformances: (performances: any[]) => {
            set((state) => {
              state.superpaes.testPerformances = performances;
            });
          },
          
          // Métricas
          updateMetrics: (metrics: Partial<UnifiedEducationState['metrics']>) => {
            set((state) => {
              state.metrics = { ...state.metrics, ...metrics };
            });
          },
          
          // UI
          toggleCinematicMode: () => {
            set((state) => {
              state.ui.cinematicMode = !state.ui.cinematicMode;
            });
          },
          
          addNotification: (notification: any) => {
            set((state) => {
              state.ui.notifications.push({
                ...notification,
                id: Date.now().toString(),
                timestamp: new Date(),
              });
            });
          },
          
          setConnectionStatus: (status: UnifiedEducationState['ui']['connectionStatus']) => {
            set((state) => {
              state.ui.connectionStatus = status;
            });
          },
          
          // Optimizaciones
          batchUpdate: (updates: Partial<UnifiedEducationState>) => {
            set((state) => {
              Object.assign(state, updates);
            });
          },
          
          syncToStorage: () => {
            const state = get();
            
            // Solo sincronizar si el storage está disponible
            const storageStatus = unifiedStorageSystem.getStatus();
            if (!storageStatus.isReady) return;
            
            unifiedStorageSystem.batchSet([
              { key: 'user_preferences_cache_v2', value: state.user.preferences },
              { key: 'lectoguia_state_v2', value: state.lectoguia },
              { key: 'unified_metrics_v2', value: state.metrics },
              { key: 'system_health_v2', value: { 
                healthScore: state.system.healthScore,
                lastSync: state.system.lastSync 
              }}
            ]);
          },
          
          loadFromStorage: () => {
            const cached = unifiedStorageSystem.batchGet([
              'user_preferences_cache_v2',
              'lectoguia_state_v2',
              'unified_metrics_v2',
              'system_health_v2'
            ]);
            
            set((state) => {
              if (cached.user_preferences_cache_v2) {
                state.user.preferences = cached.user_preferences_cache_v2;
              }
              if (cached.lectoguia_state_v2) {
                Object.assign(state.lectoguia, cached.lectoguia_state_v2);
              }
              if (cached.unified_metrics_v2) {
                state.metrics = cached.unified_metrics_v2;
              }
              if (cached.system_health_v2) {
                state.system.healthScore = cached.system_health_v2.healthScore || 100;
                state.system.lastSync = cached.system_health_v2.lastSync || null;
              }
            });
          },
        }))
      ),
      {
        name: 'unified-education-store-v2',
        partialize: (state) => ({
          user: { preferences: state.user.preferences },
          ui: { cinematicMode: state.ui.cinematicMode },
          metrics: state.metrics,
        }),
        // Usar el storage unificado para persistencia
        storage: {
          getItem: (name) => unifiedStorageSystem.getItem(name),
          setItem: (name, value) => unifiedStorageSystem.setItem(name, value),
          removeItem: (name) => unifiedStorageSystem.removeItem(name),
        },
      }
    ),
    { name: 'UnifiedEducationStore-v2' }
  )
);

// Selectores optimizados para evitar re-renders
export const useSystemState = () => useUnifiedEducationStore((state) => state.system);
export const useUserState = () => useUnifiedEducationStore((state) => state.user);
export const useLectoGuiaState = () => useUnifiedEducationStore((state) => state.lectoguia);
export const useSuperPAESState = () => useUnifiedEducationStore((state) => state.superpaes);
export const useMetricsState = () => useUnifiedEducationStore((state) => state.metrics);
export const useUIState = () => useUnifiedEducationStore((state) => state.ui);

// Hook de acciones
export const useUnifiedActions = () => useUnifiedEducationStore((state) => ({
  initialize: state.initialize,
  setSystemHealth: state.setSystemHealth,
  setActiveModule: state.setActiveModule,
  setUser: state.setUser,
  updateUserPreferences: state.updateUserPreferences,
  setLectoGuiaSubject: state.setLectoGuiaSubject,
  updateLectoGuiaNodes: state.updateLectoGuiaNodes,
  updateNodeProgress: state.updateNodeProgress,
  addLectoGuiaMessage: state.addLectoGuiaMessage,
  setSuperPAESData: state.setSuperPAESData,
  updateTestPerformances: state.updateTestPerformances,
  updateMetrics: state.updateMetrics,
  toggleCinematicMode: state.toggleCinematicMode,
  addNotification: state.addNotification,
  setConnectionStatus: state.setConnectionStatus,
  batchUpdate: state.batchUpdate,
  syncToStorage: state.syncToStorage,
  loadFromStorage: state.loadFromStorage,
}));

// Health monitoring mejorado
export const useSystemHealth = () => {
  const healthScore = useUnifiedEducationStore((state) => state.system.healthScore);
  const connectionStatus = useUnifiedEducationStore((state) => state.ui.connectionStatus);
  const storageMetrics = unifiedStorageSystem.getPerformanceMetrics();
  
  return {
    healthScore,
    connectionStatus,
    storageMetrics,
    isHealthy: healthScore > 70 && connectionStatus === 'connected' && !storageMetrics.trackingBlocked,
    trackingBlocked: storageMetrics.trackingBlocked,
  };
};
