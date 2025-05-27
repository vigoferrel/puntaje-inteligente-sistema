
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface CinematicPreferences {
  audioEnabled: boolean;
  volume: number;
  immersionLevel: 'minimal' | 'standard' | 'full';
  particleIntensity: 'low' | 'medium' | 'high';
  visualMode: 'neural' | 'cosmic' | 'energy' | 'universe';
  autoTransitions: boolean;
  adaptivePerformance: boolean;
}

interface GlobalCinematicState {
  preferences: CinematicPreferences;
  currentScene: string;
  isTransitioning: boolean;
  performanceMetrics: {
    fps: number;
    memoryUsage: number;
    renderTime: number;
  };
  navigationHistory: string[];
  achievements: string[];
  systemHealth: number;
}

interface GlobalCinematicContextType {
  state: GlobalCinematicState;
  updatePreferences: (prefs: Partial<CinematicPreferences>) => void;
  setScene: (scene: string) => void;
  startTransition: (scene: string) => Promise<void>;
  addAchievement: (achievement: string) => void;
  getOptimalSettings: () => CinematicPreferences;
  resetToOptimal: () => void;
}

const defaultPreferences: CinematicPreferences = {
  audioEnabled: true,
  volume: 0.6,
  immersionLevel: 'standard',
  particleIntensity: 'medium',
  visualMode: 'neural',
  autoTransitions: true,
  adaptivePerformance: true
};

const GlobalCinematicContext = createContext<GlobalCinematicContextType | null>(null);

export const useGlobalCinematic = () => {
  const context = useContext(GlobalCinematicContext);
  if (!context) {
    throw new Error('useGlobalCinematic must be used within GlobalCinematicProvider');
  }
  return context;
};

export const GlobalCinematicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [state, setState] = useState<GlobalCinematicState>({
    preferences: defaultPreferences,
    currentScene: 'dashboard',
    isTransitioning: false,
    performanceMetrics: { fps: 60, memoryUsage: 0, renderTime: 16 },
    navigationHistory: ['dashboard'],
    achievements: [],
    systemHealth: 100
  });

  // Cargar preferencias del usuario desde localStorage
  useEffect(() => {
    if (user?.id) {
      const savedPrefs = localStorage.getItem(`cinematic_prefs_${user.id}`);
      if (savedPrefs) {
        try {
          const parsed = JSON.parse(savedPrefs);
          setState(prev => ({ ...prev, preferences: { ...defaultPreferences, ...parsed } }));
        } catch (error) {
          console.warn('Error loading cinematic preferences:', error);
        }
      }
    }
  }, [user?.id]);

  // Guardar preferencias automáticamente
  const updatePreferences = useCallback((prefs: Partial<CinematicPreferences>) => {
    setState(prev => {
      const newPrefs = { ...prev.preferences, ...prefs };
      if (user?.id) {
        localStorage.setItem(`cinematic_prefs_${user.id}`, JSON.stringify(newPrefs));
      }
      return { ...prev, preferences: newPrefs };
    });
  }, [user?.id]);

  // Monitor de performance en tiempo real
  useEffect(() => {
    const monitorPerformance = () => {
      const now = performance.now();
      const memory = (performance as any).memory;
      
      setState(prev => ({
        ...prev,
        performanceMetrics: {
          fps: Math.round(1000 / (now % 100)),
          memoryUsage: memory ? memory.usedJSHeapSize / (1024 * 1024) : 0,
          renderTime: now % 32
        },
        systemHealth: Math.max(40, 100 - (memory ? memory.usedJSHeapSize / (10 * 1024 * 1024) : 0))
      }));
    };

    const interval = setInterval(monitorPerformance, 2000);
    return () => clearInterval(interval);
  }, []);

  // Ajuste automático de performance
  useEffect(() => {
    if (state.preferences.adaptivePerformance) {
      const { memoryUsage } = state.performanceMetrics;
      
      if (memoryUsage > 150) {
        updatePreferences({
          particleIntensity: 'low',
          immersionLevel: 'minimal'
        });
      } else if (memoryUsage > 100) {
        updatePreferences({
          particleIntensity: 'medium',
          immersionLevel: 'standard'
        });
      }
    }
  }, [state.performanceMetrics.memoryUsage, state.preferences.adaptivePerformance, updatePreferences]);

  const setScene = useCallback((scene: string) => {
    setState(prev => ({
      ...prev,
      currentScene: scene,
      navigationHistory: [...prev.navigationHistory.slice(-9), scene]
    }));
  }, []);

  const startTransition = useCallback(async (scene: string) => {
    setState(prev => ({ ...prev, isTransitioning: true }));
    
    // Simular tiempo de transición basado en nivel de inmersión
    const duration = {
      minimal: 300,
      standard: 600,
      full: 1200
    }[state.preferences.immersionLevel];

    await new Promise(resolve => setTimeout(resolve, duration));
    
    setScene(scene);
    setState(prev => ({ ...prev, isTransitioning: false }));
  }, [state.preferences.immersionLevel, setScene]);

  const addAchievement = useCallback((achievement: string) => {
    setState(prev => {
      if (!prev.achievements.includes(achievement)) {
        return {
          ...prev,
          achievements: [...prev.achievements, achievement]
        };
      }
      return prev;
    });
  }, []);

  const getOptimalSettings = useCallback((): CinematicPreferences => {
    const { memoryUsage } = state.performanceMetrics;
    
    if (memoryUsage > 200) {
      return {
        ...state.preferences,
        immersionLevel: 'minimal',
        particleIntensity: 'low',
        audioEnabled: false
      };
    } else if (memoryUsage > 100) {
      return {
        ...state.preferences,
        immersionLevel: 'standard',
        particleIntensity: 'medium'
      };
    } else {
      return {
        ...state.preferences,
        immersionLevel: 'full',
        particleIntensity: 'high'
      };
    }
  }, [state.performanceMetrics.memoryUsage, state.preferences]);

  const resetToOptimal = useCallback(() => {
    const optimal = getOptimalSettings();
    updatePreferences(optimal);
  }, [getOptimalSettings, updatePreferences]);

  const contextValue: GlobalCinematicContextType = {
    state,
    updatePreferences,
    setScene,
    startTransition,
    addAchievement,
    getOptimalSettings,
    resetToOptimal
  };

  return (
    <GlobalCinematicContext.Provider value={contextValue}>
      {children}
    </GlobalCinematicContext.Provider>
  );
};
