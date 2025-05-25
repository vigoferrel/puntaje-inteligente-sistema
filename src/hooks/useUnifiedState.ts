
import { useState, useCallback, useEffect } from 'react';

interface SystemMetrics {
  completedNodes: number;
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

interface UnifiedState {
  currentTool: string;
  navigationHistory: string[];
  systemMetrics: SystemMetrics;
  setCurrentTool: (tool: string) => void;
  updateSystemMetrics: (updates: Partial<SystemMetrics>) => void;
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

  // Cargar estado desde localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('unified-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setCurrentToolState(parsed.currentTool || 'dashboard');
        setNavigationHistory(parsed.navigationHistory || ['dashboard']);
        setSystemMetrics(prev => ({ ...prev, ...parsed.systemMetrics }));
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
      systemMetrics
    };
    localStorage.setItem('unified-state', JSON.stringify(stateToSave));
  }, [currentTool, navigationHistory, systemMetrics]);

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

  return {
    currentTool,
    navigationHistory,
    systemMetrics,
    setCurrentTool,
    updateSystemMetrics
  };
};
