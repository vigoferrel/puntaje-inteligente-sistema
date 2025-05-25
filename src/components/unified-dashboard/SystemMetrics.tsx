
import { useState, useEffect, useCallback } from 'react';

interface SystemMetricsData {
  totalProgress: number;
  todayStudyTime: number;
  completedNodes: number;
  totalNodes: number;
  systemHealth: number;
  performanceScore: number;
}

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetricsData>({
    totalProgress: 67,
    todayStudyTime: 45,
    completedNodes: 8,
    totalNodes: 25,
    systemHealth: 95,
    performanceScore: 87
  });

  // Actualizar métricas cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        systemHealth: Math.min(100, prev.systemHealth + Math.random() * 2 - 1),
        performanceScore: Math.min(100, prev.performanceScore + Math.random() * 3 - 1.5)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const updateMetrics = useCallback((updates: Partial<SystemMetricsData>) => {
    setMetrics(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    ...metrics,
    updateMetrics
  };
};
