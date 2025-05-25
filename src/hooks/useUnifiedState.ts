
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UnifiedState {
  // Navegación
  currentTool: string;
  navigationHistory: string[];
  
  // Usuario y Progreso
  userProgress: {
    overallScore: number;
    completedExercises: number;
    streak: number;
    level: number;
    experience: number;
  };
  
  // LectoGuía
  lectoguiaState: {
    activeSubject: string;
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>;
    exerciseHistory: Array<{ id: string; score: number; timestamp: Date }>;
  };
  
  // Métricas del Sistema
  systemMetrics: {
    completedNodes: number;
    totalNodes: number;
    todayStudyTime: number;
    streakDays: number;
    totalProgress: number;
    userLevel: number;
    experience: number;
    lastUpdated: Date;
  };
  
  // Cache
  cache: {
    dashboard: any;
    exercises: any;
    timestamp: Date;
  };
  
  // Actions
  setCurrentTool: (tool: string) => void;
  addToHistory: (tool: string) => void;
  updateUserProgress: (progress: Partial<UnifiedState['userProgress']>) => void;
  updateLectoguiaState: (state: Partial<UnifiedState['lectoguiaState']>) => void;
  updateSystemMetrics: (metrics: Partial<UnifiedState['systemMetrics']>) => void;
  updateCache: (key: keyof UnifiedState['cache'], data: any) => void;
  resetState: () => void;
}

const initialState = {
  currentTool: 'dashboard',
  navigationHistory: ['dashboard'],
  userProgress: {
    overallScore: 0,
    completedExercises: 0,
    streak: 0,
    level: 1,
    experience: 0
  },
  lectoguiaState: {
    activeSubject: 'COMPETENCIA_LECTORA',
    chatHistory: [],
    exerciseHistory: []
  },
  systemMetrics: {
    completedNodes: 0,
    totalNodes: 277,
    todayStudyTime: 0,
    streakDays: 0,
    totalProgress: 0,
    userLevel: 1,
    experience: 0,
    lastUpdated: new Date()
  },
  cache: {
    dashboard: null,
    exercises: null,
    timestamp: new Date()
  }
};

export const useUnifiedState = create<UnifiedState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setCurrentTool: (tool: string) => set(state => ({
        currentTool: tool,
        navigationHistory: [...state.navigationHistory.slice(-9), tool]
      })),
      
      addToHistory: (tool: string) => set(state => ({
        navigationHistory: [...state.navigationHistory.slice(-9), tool]
      })),
      
      updateUserProgress: (progress) => set(state => ({
        userProgress: { ...state.userProgress, ...progress }
      })),
      
      updateLectoguiaState: (lectoguiaState) => set(state => ({
        lectoguiaState: { ...state.lectoguiaState, ...lectoguiaState }
      })),
      
      updateSystemMetrics: (metrics) => set(state => ({
        systemMetrics: { 
          ...state.systemMetrics, 
          ...metrics,
          lastUpdated: new Date()
        }
      })),
      
      updateCache: (key, data) => set(state => ({
        cache: {
          ...state.cache,
          [key]: data,
          timestamp: new Date()
        }
      })),
      
      resetState: () => set(initialState)
    }),
    {
      name: 'paes-unified-state',
      version: 1,
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          if (!value) return null;
          try {
            const parsed = JSON.parse(value);
            // Rehydrate dates
            if (parsed.state?.systemMetrics?.lastUpdated) {
              parsed.state.systemMetrics.lastUpdated = new Date(parsed.state.systemMetrics.lastUpdated);
            }
            if (parsed.state?.cache?.timestamp) {
              parsed.state.cache.timestamp = new Date(parsed.state.cache.timestamp);
            }
            return parsed;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);
