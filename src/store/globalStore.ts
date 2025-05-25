
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

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
    isDarkMode: true, // Modo oscuro por defecto
    cinematicMode: true, // Modo cinematográfico activado
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
        immer((set, get) => ({
          ...initialState,
          
          actions: {
            // Sistema
            setSystemState: (newState) => set((state) => {
              Object.assign(state.system, newState);
            }),
            
            setInitialized: (initialized) => set((state) => {
              state.system.isInitialized = initialized;
              if (initialized) {
                state.system.phase = 'complete';
                state.system.lastSync = new Date();
              }
            }),
            
            setError: (error) => set((state) => {
              state.system.error = error;
              if (error) {
                state.actions.addNotification({
                  type: 'error',
                  message: error
                });
              }
            }),
            
            // Usuario
            setUser: (user) => set((state) => {
              state.user = user;
            }),
            
            setSession: (session) => set((state) => {
              state.session = session;
              state.user = session?.user || null;
            }),
            
            logout: () => set((state) => {
              state.user = null;
              state.session = null;
              state.system.isInitialized = false;
              state.currentPlan = null;
              state.userProgress = {};
            }),
            
            // UI
            toggleDarkMode: () => set((state) => {
              state.ui.isDarkMode = !state.ui.isDarkMode;
            }),
            
            enableCinematicMode: () => set((state) => {
              state.ui.cinematicMode = true;
              state.ui.isDarkMode = true;
            }),
            
            toggleSidebar: () => set((state) => {
              state.ui.sidebarOpen = !state.ui.sidebarOpen;
            }),
            
            setCurrentModule: (module) => set((state) => {
              state.ui.currentModule = module;
            }),
            
            addNotification: (notification) => set((state) => {
              state.ui.notifications.push({
                ...notification,
                id: Date.now().toString(),
                timestamp: new Date(),
              });
            }),
            
            removeNotification: (id) => set((state) => {
              state.ui.notifications = state.ui.notifications.filter(n => n.id !== id);
            }),
            
            // Datos
            setLearningNodes: (nodes) => set((state) => {
              state.learningNodes = nodes;
            }),
            
            updateNodeProgress: (nodeId, progress) => set((state) => {
              state.userProgress[nodeId] = progress;
            }),
            
            setPlans: (plans) => set((state) => {
              state.plans = plans;
            }),
            
            setCurrentPlan: (plan) => set((state) => {
              state.currentPlan = plan;
            }),
            
            setDiagnostics: (diagnostics) => set((state) => {
              state.diagnostics = diagnostics;
            }),
            
            setPaesData: (data) => set((state) => {
              state.paesData = data;
            }),
            
            setFinancialData: (data) => set((state) => {
              state.financialData = data;
            }),
            
            // Sync
            syncAllData: async () => {
              const state = get();
              if (!state.user?.id) return;
              
              set((draft) => {
                draft.system.isLoading = true;
              });
              
              try {
                // Aquí implementaríamos la sincronización real
                console.log('🔄 Sincronizando datos globales...');
                
                // Simular sincronización
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                set((draft) => {
                  draft.system.lastSync = new Date();
                  draft.system.isLoading = false;
                });
                
                console.log('✅ Sincronización completada');
                
              } catch (error) {
                set((draft) => {
                  draft.system.error = `Error de sincronización: ${error}`;
                  draft.system.isLoading = false;
                });
              }
            },
            
            resetStore: () => set(() => ({
              ...initialState,
              actions: get().actions,
            })),
          },
        }))
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
