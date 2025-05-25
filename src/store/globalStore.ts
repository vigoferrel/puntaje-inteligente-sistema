
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
}

interface GlobalActions {
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
  
  // Sync simplificado
  syncAllData: () => Promise<void>;
  resetStore: () => void;
}

type StoreState = GlobalState & { actions: GlobalActions };

const initialState: GlobalState = {
  system: {
    isInitialized: false,
    isLoading: false,
    error: null,
    phase: 'idle',
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

export const useGlobalStore = create<StoreState>()(
  devtools(
    persist(
      subscribeWithSelector(
        (set, get) => ({
          ...initialState,
          
          actions: {
            // Sistema
            setSystemState: (newState) => {
              set((state) => ({
                system: { ...state.system, ...newState }
              }), false, 'setSystemState');
            },
            
            setInitialized: (initialized) => {
              set((state) => ({
                system: {
                  ...state.system,
                  isInitialized: initialized,
                  phase: initialized ? 'complete' : state.system.phase,
                  lastSync: initialized ? new Date() : state.system.lastSync,
                  isLoading: false,
                }
              }), false, 'setInitialized');
            },
            
            setError: (error) => {
              set((state) => {
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
                  system: { ...state.system, error, isLoading: false },
                  ui: { ...state.ui, notifications: newNotifications }
                };
              }, false, 'setError');
            },
            
            // Usuario
            setUser: (user) => {
              set({ user }, false, 'setUser');
            },
            
            setSession: (session) => {
              set({
                session,
                user: session?.user || null
              }, false, 'setSession');
            },
            
            logout: () => {
              set((state) => ({
                user: null,
                session: null,
                system: { ...state.system, isInitialized: false },
                currentPlan: null,
                userProgress: {}
              }), false, 'logout');
            },
            
            // UI
            toggleDarkMode: () => {
              set((state) => ({
                ui: { ...state.ui, isDarkMode: !state.ui.isDarkMode }
              }), false, 'toggleDarkMode');
            },
            
            enableCinematicMode: () => {
              set((state) => ({
                ui: { ...state.ui, cinematicMode: true, isDarkMode: true }
              }), false, 'enableCinematicMode');
            },
            
            toggleSidebar: () => {
              set((state) => ({
                ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
              }), false, 'toggleSidebar');
            },
            
            setCurrentModule: (module) => {
              set((state) => ({
                ui: { ...state.ui, currentModule: module }
              }), false, 'setCurrentModule');
            },
            
            addNotification: (notification) => {
              set((state) => ({
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
              }), false, 'addNotification');
            },
            
            removeNotification: (id) => {
              set((state) => ({
                ui: {
                  ...state.ui,
                  notifications: state.ui.notifications.filter(n => n.id !== id)
                }
              }), false, 'removeNotification');
            },
            
            // Datos
            setLearningNodes: (nodes) => {
              set({ learningNodes: nodes }, false, 'setLearningNodes');
            },
            
            updateNodeProgress: (nodeId, progress) => {
              set((state) => ({
                userProgress: { ...state.userProgress, [nodeId]: progress }
              }), false, 'updateNodeProgress');
            },
            
            setPlans: (plans) => {
              set({ plans }, false, 'setPlans');
            },
            
            setCurrentPlan: (plan) => {
              set({ currentPlan: plan }, false, 'setCurrentPlan');
            },
            
            setDiagnostics: (diagnostics) => {
              set({ diagnostics }, false, 'setDiagnostics');
            },
            
            setPaesData: (data) => {
              set({ paesData: data }, false, 'setPaesData');
            },
            
            setFinancialData: (data) => {
              set({ financialData: data }, false, 'setFinancialData');
            },
            
            // Sync simplificado
            syncAllData: async () => {
              const state = get();
              if (!state.user?.id || state.system.isLoading) return;
              
              set((currentState) => ({
                system: { ...currentState.system, isLoading: true }
              }), false, 'syncAllData:start');
              
              try {
                console.log('🔄 Sincronización simulada...');
                
                // Simular sincronización básica
                await new Promise(resolve => setTimeout(resolve, 500));
                
                set((currentState) => ({
                  system: {
                    ...currentState.system,
                    lastSync: new Date(),
                    isLoading: false
                  }
                }), false, 'syncAllData:success');
                
              } catch (error) {
                set((currentState) => ({
                  system: {
                    ...currentState.system,
                    error: `Error de sincronización: ${error}`,
                    isLoading: false
                  }
                }), false, 'syncAllData:error');
              }
            },
            
            resetStore: () => {
              set((state) => ({
                ...initialState,
                actions: state.actions,
              }), false, 'resetStore');
            },
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
