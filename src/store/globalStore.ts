
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

// Tipos centralizados
interface User {
  id: string;
  email: string;
  name?: string;
  profile?: any;
}

interface LearningNode {
  id: string;
  code: string;
  title: string;
  subject_area: string;
  tier_priority: string;
  progress?: number;
  status?: string;
}

interface SystemState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  phase: 'idle' | 'auth' | 'nodes' | 'validation' | 'complete' | 'emergency';
  lastSync: Date | null;
}

interface UIState {
  isDarkMode: boolean;
  cinematicMode: boolean;
  sidebarOpen: boolean;
  currentModule: string;
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: Date;
  }>;
}

interface GlobalState {
  // Sistema
  system: SystemState;
  
  // Usuario
  user: User | null;
  session: any | null;
  
  // UI Estado
  ui: UIState;
  
  // Datos del sistema educativo
  learningNodes: LearningNode[];
  userProgress: Record<string, any>;
  plans: any[];
  currentPlan: any | null;
  diagnostics: any[];
  paesData: any;
  financialData: any;
  
  // Acciones
  actions: {
    // Sistema
    setSystemState: (state: Partial<SystemState>) => void;
    setInitialized: (initialized: boolean) => void;
    setError: (error: string | null) => void;
    
    // Usuario
    setUser: (user: User | null) => void;
    setSession: (session: any) => void;
    logout: () => void;
    
    // UI
    toggleDarkMode: () => void;
    enableCinematicMode: () => void;
    toggleSidebar: () => void;
    setCurrentModule: (module: string) => void;
    addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    
    // Datos
    setLearningNodes: (nodes: LearningNode[]) => void;
    updateNodeProgress: (nodeId: string, progress: any) => void;
    setPlans: (plans: any[]) => void;
    setCurrentPlan: (plan: any) => void;
    setDiagnostics: (diagnostics: any[]) => void;
    setPaesData: (data: any) => void;
    setFinancialData: (data: any) => void;
    
    // Sync
    syncAllData: () => Promise<void>;
    resetStore: () => void;
  };
}

const initialState = {
  system: {
    isInitialized: false,
    isLoading: false,
    error: null,
    phase: 'idle' as const,
    lastSync: null,
  },
  user: null,
  session: null,
  ui: {
    isDarkMode: true,
    cinematicMode: true,
    sidebarOpen: true,
    currentModule: 'dashboard',
    notifications: [],
  },
  learningNodes: [],
  userProgress: {},
  plans: [],
  currentPlan: null,
  diagnostics: [],
  paesData: null,
  financialData: null,
};

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      subscribeWithSelector(
        (set, get) => ({
          ...initialState,
          
          actions: {
            // Sistema
            setSystemState: (newState) => set((state) => ({
              ...state,
              system: { ...state.system, ...newState }
            })),
            
            setInitialized: (initialized) => set((state) => ({
              ...state,
              system: {
                ...state.system,
                isInitialized: initialized,
                phase: initialized ? 'complete' : state.system.phase,
                lastSync: initialized ? new Date() : state.system.lastSync
              }
            })),
            
            setError: (error) => set((state) => {
              const newNotifications = error ? [
                ...state.ui.notifications,
                {
                  id: Date.now().toString(),
                  type: 'error' as const,
                  message: error,
                  timestamp: new Date()
                }
              ] : state.ui.notifications;
              
              return {
                ...state,
                system: { ...state.system, error },
                ui: { ...state.ui, notifications: newNotifications }
              };
            }),
            
            // Usuario
            setUser: (user) => set((state) => ({
              ...state,
              user
            })),
            
            setSession: (session) => set((state) => ({
              ...state,
              session,
              user: session?.user || null
            })),
            
            logout: () => set((state) => ({
              ...state,
              user: null,
              session: null,
              system: { ...state.system, isInitialized: false },
              currentPlan: null,
              userProgress: {}
            })),
            
            // UI
            toggleDarkMode: () => set((state) => ({
              ...state,
              ui: { ...state.ui, isDarkMode: !state.ui.isDarkMode }
            })),
            
            enableCinematicMode: () => set((state) => ({
              ...state,
              ui: { ...state.ui, cinematicMode: true, isDarkMode: true }
            })),
            
            toggleSidebar: () => set((state) => ({
              ...state,
              ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
            })),
            
            setCurrentModule: (module) => set((state) => ({
              ...state,
              ui: { ...state.ui, currentModule: module }
            })),
            
            addNotification: (notification) => set((state) => ({
              ...state,
              ui: {
                ...state.ui,
                notifications: [
                  ...state.ui.notifications,
                  {
                    ...notification,
                    id: Date.now().toString(),
                    timestamp: new Date(),
                  }
                ]
              }
            })),
            
            removeNotification: (id) => set((state) => ({
              ...state,
              ui: {
                ...state.ui,
                notifications: state.ui.notifications.filter(n => n.id !== id)
              }
            })),
            
            // Datos
            setLearningNodes: (nodes) => set((state) => ({
              ...state,
              learningNodes: nodes
            })),
            
            updateNodeProgress: (nodeId, progress) => set((state) => ({
              ...state,
              userProgress: { ...state.userProgress, [nodeId]: progress }
            })),
            
            setPlans: (plans) => set((state) => ({
              ...state,
              plans
            })),
            
            setCurrentPlan: (plan) => set((state) => ({
              ...state,
              currentPlan: plan
            })),
            
            setDiagnostics: (diagnostics) => set((state) => ({
              ...state,
              diagnostics
            })),
            
            setPaesData: (data) => set((state) => ({
              ...state,
              paesData: data
            })),
            
            setFinancialData: (data) => set((state) => ({
              ...state,
              financialData: data
            })),
            
            // Sync
            syncAllData: async () => {
              const state = get();
              if (!state.user?.id) return;
              
              set((currentState) => ({
                ...currentState,
                system: { ...currentState.system, isLoading: true }
              }));
              
              try {
                console.log('🔄 Sincronizando datos globales...');
                
                // Simular sincronización
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                set((currentState) => ({
                  ...currentState,
                  system: {
                    ...currentState.system,
                    lastSync: new Date(),
                    isLoading: false
                  }
                }));
                
                console.log('✅ Sincronización completada');
                
              } catch (error) {
                set((currentState) => ({
                  ...currentState,
                  system: {
                    ...currentState.system,
                    error: `Error de sincronización: ${error}`,
                    isLoading: false
                  }
                }));
              }
            },
            
            resetStore: () => set(() => ({
              ...initialState,
              actions: get().actions,
            })),
          },
        })
      ),
      {
        name: 'global-store',
        partialize: (state) => ({
          ui: state.ui,
          user: state.user,
          currentPlan: state.currentPlan,
        }),
      }
    ),
    {
      name: 'GlobalStore',
    }
  )
);

// Selectores específicos para evitar re-renders innecesarios
export const useSystemState = () => useGlobalStore((state) => state.system);
export const useUser = () => useGlobalStore((state) => state.user);
export const useUIState = () => useGlobalStore((state) => state.ui);
export const useLearningData = () => useGlobalStore((state) => ({
  nodes: state.learningNodes,
  progress: state.userProgress,
  plans: state.plans,
  currentPlan: state.currentPlan,
}));
export const useActions = () => useGlobalStore((state) => state.actions);
