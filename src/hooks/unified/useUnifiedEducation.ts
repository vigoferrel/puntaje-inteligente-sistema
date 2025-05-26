
import { useState, useEffect, useCallback } from 'react';
import { CentralizedEducationService } from '@/services/unified/CentralizedEducationService';
import { optimizedLogger } from '@/core/logging/OptimizedLogger';
import type { UnifiedDashboardData, OptimalPathData, PersonalizedAlert } from '@/services/unified/types';

interface UseUnifiedEducationReturn {
  dashboard: UnifiedDashboardData | null;
  optimalPath: OptimalPathData | null;
  alerts: PersonalizedAlert[];
  isLoading: boolean;
  error: string | null;
  
  // Actions optimizadas
  loadDashboard: () => Promise<void>;
  calculateOptimalPath: (preferences?: any) => Promise<void>;
  refreshAlerts: () => Promise<void>;
  exportReport: (format: 'pdf' | 'excel' | 'json') => Promise<Blob | null>;
  clearCache: () => void;
  
  // Stats mínimas
  stats: {
    lastUpdated: Date | null;
    totalRequests: number;
  };
}

/**
 * Hook unificado optimizado - Logging mínimo, performance mejorada
 */
export const useUnifiedEducation = (userId?: string): UseUnifiedEducationReturn => {
  const [dashboard, setDashboard] = useState<UnifiedDashboardData | null>(null);
  const [optimalPath, setOptimalPath] = useState<OptimalPathData | null>(null);
  const [alerts, setAlerts] = useState<PersonalizedAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    lastUpdated: null as Date | null,
    totalRequests: 0
  });

  const updateStats = useCallback((operation: string) => {
    setStats(prev => ({
      totalRequests: prev.totalRequests + 1,
      lastUpdated: new Date()
    }));
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const dashboardData = await CentralizedEducationService.getUnifiedDashboard(userId);
      setDashboard(dashboardData);
      updateStats('loadDashboard');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando dashboard';
      setError(errorMessage);
      optimizedLogger.error('useUnifiedEducation', 'Dashboard load failed', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, updateStats]);

  const calculateOptimalPath = useCallback(async (preferences: any = {}) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const pathData = await CentralizedEducationService.calculateOptimalPath(userId, preferences);
      setOptimalPath(pathData);
      updateStats('calculateOptimalPath');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error calculando ruta óptima';
      setError(errorMessage);
      optimizedLogger.error('useUnifiedEducation', 'Path calculation failed', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, updateStats]);

  const refreshAlerts = useCallback(async () => {
    if (!userId) return;

    try {
      const alertsData = await CentralizedEducationService.getPersonalizedAlerts(userId);
      setAlerts(alertsData);
      updateStats('refreshAlerts');
      
    } catch (err) {
      optimizedLogger.error('useUnifiedEducation', 'Alerts refresh failed', err);
    }
  }, [userId, updateStats]);

  const exportReport = useCallback(async (format: 'pdf' | 'excel' | 'json'): Promise<Blob | null> => {
    if (!userId) return null;

    try {
      const blob = await CentralizedEducationService.exportCompleteReport(userId, format);
      updateStats(`exportReport_${format}`);
      return blob;
      
    } catch (err) {
      optimizedLogger.error('useUnifiedEducation', 'Export failed', err);
      return null;
    }
  }, [userId, updateStats]);

  const clearCache = useCallback(() => {
    CentralizedEducationService.clearCache();
    updateStats('clearCache');
  }, [updateStats]);

  // Carga inicial automática con debounce
  useEffect(() => {
    if (userId) {
      const timer = setTimeout(() => {
        loadDashboard();
        refreshAlerts();
      }, 100); // Micro-delay para evitar renders múltiples

      return () => clearTimeout(timer);
    }
  }, [userId, loadDashboard, refreshAlerts]);

  return {
    dashboard,
    optimalPath,
    alerts,
    isLoading,
    error,
    loadDashboard,
    calculateOptimalPath,
    refreshAlerts,
    exportReport,
    clearCache,
    stats
  };
};
