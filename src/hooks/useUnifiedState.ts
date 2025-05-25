
import { useState, useCallback, useEffect } from 'react';

interface SystemMetrics {
  completedNodes: number;
  totalNodes: number;
  todayStudyTime: number;
  streakDays: number;
  totalProgress: number;
  userLevel: number;
  experience: number;
  lastUpdated: string;
  optimizationStats?: {
    officialContentUsage: number;
    aiUsage: number;
    costSavings: number;
    cacheHitRate: number;
  };
}

interface UserProgress {
  overallScore: number;
  level: number;
  completedExercises: number;
  streakDays: number;
}

interface UnifiedState {
  currentTool: string;
  navigationHistory: string[];
  systemMetrics: SystemMetrics;
  userProgress: UserProgress;
  setCurrentTool: (tool: string) => void;
  updateSystemMetrics: (updates: Partial<SystemMetrics>) => void;
  updateUserProgress: (updates: Partial<UserProgress>) => void;
}

/**
 * HOOK DE ESTADO UNIFICADO
 * Centraliza el estado del dashboard optimizado
 */
export const useUnifiedState = (): UnifiedState => {
  const [currentTool, setCurrentToolState] = useState('dashboard');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['dashboard']);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    completedNodes: 0,
    totalNodes: 277, // Total nodes in system
    todayStudyTime: 0,
    streakDays: 1,
    totalProgress: 0,
    userLevel: 1,
    experience: 0,
    lastUpdated: new Date().toISOString(),
    optimizationStats: {
      officialContentUsage: 87,
      aiUsage: 13,
      costSavings: 2.34,
      cacheHitRate: 76
    }
  });

  const [userProgress, setUserProgress] = useState<UserProgress>({
    overallScore: 0,
    level: 1,
    completedExercises: 0,
    streakDays: 1
  });

  // Cargar estado desde localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('unified-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setCurrentToolState(parsed.currentTool || 'dashboard');
        setNavigationHistory(parsed.navigationHistory || ['dashboard']);
        setSystemMetrics(prev => ({ ...prev, ...parsed.systemMetrics }));
        setUserProgress(prev => ({ ...prev, ...parsed.userProgress }));
      } catch (error) {
        console.warn('Error cargando estado unificado:', error);
      }
    }
  }, []);

  // Guardar estado en localStorage
  useEffect(() => {
    const stateToSave = {
      currentTool,
      navigationHistory,
      systemMetrics,
      userProgress
    };
    localStorage.setItem('unified-state', JSON.stringify(stateToSave));
  }, [currentTool, navigationHistory, systemMetrics, userProgress]);

  const setCurrentTool = useCallback((tool: string) => {
    if (tool !== currentTool) {
      setNavigationHistory(prev => [...prev.slice(-9), tool]); // Mantener últimos 10
      setCurrentToolState(tool);
      console.log(`🎯 Navegación unificada: ${currentTool} → ${tool}`);
    }
  }, [currentTool]);

  const updateSystemMetrics = useCallback((updates: Partial<SystemMetrics>) => {
    setSystemMetrics(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString()
    }));
    console.log('📊 Métricas actualizadas:', updates);
  }, []);

  const updateUserProgress = useCallback((updates: Partial<UserProgress>) => {
    setUserProgress(prev => ({
      ...prev,
      ...updates
    }));
    console.log('👤 Progreso usuario actualizado:', updates);
  }, []);

  return {
    currentTool,
    navigationHistory,
    systemMetrics,
    userProgress,
    setCurrentTool,
    updateSystemMetrics,
    updateUserProgress
  };
};
