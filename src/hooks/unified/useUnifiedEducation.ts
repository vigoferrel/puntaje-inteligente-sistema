
import { useState, useEffect, useCallback } from 'react';
import { CentralizedEducationService } from '@/services/unified/CentralizedEducationService';
import { logger } from '@/core/logging/SystemLogger';
import type { UnifiedDashboardData, OptimalPathData, PersonalizedAlert } from '@/services/unified/types';

interface UseUnifiedEducationReturn {
  dashboard: UnifiedDashboardData | null;
  optimalPath: OptimalPathData | null;
  alerts: PersonalizedAlert[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadDashboard: () => Promise<void>;
  calculateOptimalPath: (preferences?: any) => Promise<void>;
  refreshAlerts: () => Promise<void>;
  exportReport: (format: 'pdf' | 'excel' | 'json') => Promise<Blob | null>;
  clearCache: () => void;
  
  // Stats
  stats: {
    lastUpdated: Date | null;
    cacheHits: number;
    totalRequests: number;
  };
}

/**
 * Hook unificado para todo el sistema educativo
 * Reemplaza múltiples hooks especializados
 */
export const useUnifiedEducation = (userId?: string): UseUnifiedEducationReturn => {
  const [dashboard, setDashboard] = useState<UnifiedDashboardData | null>(null);
  const [optimalPath, setOptimalPath] = useState<OptimalPathData | null>(null);
  const [alerts, setAlerts] = useState<PersonalizedAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    lastUpdated: null as Date | null,
    cacheHits: 0,
    totalRequests: 0
  });

  const updateStats = useCallback((operation: string) => {
    setStats(prev => ({
      ...prev,
      totalRequests: prev.totalRequests + 1,
      lastUpdated: new Date()
    }));
    logger.info('useUnifiedEducation', `Operación ejecutada: ${operation}`, { userId });
  }, [userId]);

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
      logger.error('useUnifiedEducation', 'Error en loadDashboard', err);
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
      logger.error('useUnifiedEducation', 'Error en calculateOptimalPath', err);
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
      logger.error('useUnifiedEducation', 'Error refrescando alertas', err);
    }
  }, [userId, updateStats]);

  const exportReport = useCallback(async (format: 'pdf' | 'excel' | 'json'): Promise<Blob | null> => {
    if (!userId) return null;

    try {
      const blob = await CentralizedEducationService.exportCompleteReport(userId, format);
      updateStats(`exportReport_${format}`);
      return blob;
      
    } catch (err) {
      logger.error('useUnifiedEducation', 'Error exportando reporte', err);
      return null;
    }
  }, [userId, updateStats]);

  const clearCache = useCallback(() => {
    CentralizedEducationService.clearCache();
    updateStats('clearCache');
    logger.info('useUnifiedEducation', 'Cache limpiado por usuario');
  }, [updateStats]);

  // Carga inicial automática
  useEffect(() => {
    if (userId) {
      loadDashboard();
      refreshAlerts();
    }
  }, [userId, loadDashboard, refreshAlerts]);

  // Actualización periódica de alertas
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      refreshAlerts();
    }, 300000); // 5 minutos

    return () => clearInterval(interval);
  }, [userId, refreshAlerts]);

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
