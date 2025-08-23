
import { useState, useEffect, useCallback, useRef } from 'react';
import { CentralizedEducationService } from '@/services/unified/CentralizedEducationService';
import { optimizedLogger } from '@/core/logging/OptimizedLogger';
import type { UnifiedDashboardData, OptimalPathData, PersonalizedAlert } from '@/services/unified/types';

interface OptimizedUnifiedEducationState {
  dashboard: UnifiedDashboardData | null;
  optimalPath: OptimalPathData | null;
  alerts: PersonalizedAlert[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

interface OptimizedUnifiedEducationActions {
  refreshDashboard: () => Promise<void>;
  generateOptimalPath: (preferences?: any) => Promise<void>;
  updateAlerts: () => Promise<void>;
  exportData: (format: 'pdf' | 'excel' | 'json') => Promise<Blob | null>;
  resetState: () => void;
}

interface OptimizedMetrics {
  lastSync: Date | null;
  operationCount: number;
  averageResponseTime: number;
}

/**
 * Hook optimizado para educación unificada - Performance mejorada
 */
export const useOptimizedUnifiedEducation = (userId?: string) => {
  const [state, setState] = useState<OptimizedUnifiedEducationState>({
    dashboard: null,
    optimalPath: null,
    alerts: [],
    isLoading: false,
    error: null,
    isInitialized: false
  });

  const [metrics, setMetrics] = useState<OptimizedMetrics>({
    lastSync: null,
    operationCount: 0,
    averageResponseTime: 0
  });

  const responseTimesRef = useRef<number[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Función optimizada para actualizar métricas
  const updateMetrics = useCallback((responseTime: number) => {
    responseTimesRef.current.push(responseTime);
    if (responseTimesRef.current.length > 10) {
      responseTimesRef.current = responseTimesRef.current.slice(-10);
    }

    const avgTime = responseTimesRef.current.reduce((a, b) => a + b, 0) / responseTimesRef.current.length;

    setMetrics(prev => ({
      lastSync: new Date(),
      operationCount: prev.operationCount + 1,
      averageResponseTime: avgTime
    }));
  }, []);

  // Función optimizada para manejar operaciones async
  const executeOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T | null> => {
    const startTime = Date.now();
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await operation();
      const responseTime = Date.now() - startTime;
      updateMetrics(responseTime);
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Error en ${operationName}`;
      setState(prev => ({ ...prev, error: errorMessage }));
      optimizedLogger.critical();
      return null;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [updateMetrics]);

  const refreshDashboard = useCallback(async () => {
    if (!userId) return;

    const dashboardData = await executeOperation(
      () => CentralizedEducationService.getUnifiedDashboard(userId),
      'refreshDashboard'
    );

    if (dashboardData) {
      setState(prev => ({ ...prev, dashboard: dashboardData, isInitialized: true }));
    }
  }, [userId, executeOperation]);

  const generateOptimalPath = useCallback(async (preferences: any = {}) => {
    if (!userId) return;

    const pathData = await executeOperation(
      () => CentralizedEducationService.calculateOptimalPath(userId, preferences),
      'generateOptimalPath'
    );

    if (pathData) {
      setState(prev => ({ ...prev, optimalPath: pathData }));
    }
  }, [userId, executeOperation]);

  const updateAlerts = useCallback(async () => {
    if (!userId) return;

    const alertsData = await executeOperation(
      () => CentralizedEducationService.getPersonalizedAlerts(userId),
      'updateAlerts'
    );

    if (alertsData) {
      setState(prev => ({ ...prev, alerts: alertsData }));
    }
  }, [userId, executeOperation]);

  const exportData = useCallback(async (format: 'pdf' | 'excel' | 'json'): Promise<Blob | null> => {
    if (!userId) return null;

    return executeOperation(
      () => CentralizedEducationService.exportCompleteReport(userId, format),
      `exportData_${format}`
    );
  }, [userId, executeOperation]);

  const resetState = useCallback(() => {
    // Cancelar operaciones pendientes
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState({
      dashboard: null,
      optimalPath: null,
      alerts: [],
      isLoading: false,
      error: null,
      isInitialized: false
    });

    setMetrics({
      lastSync: null,
      operationCount: 0,
      averageResponseTime: 0
    });

    responseTimesRef.current = [];
    CentralizedEducationService.clearCache();
  }, []);

  // Inicialización automática optimizada
  useEffect(() => {
    if (userId && !state.isInitialized && !state.isLoading) {
      abortControllerRef.current = new AbortController();
      
      const initializeData = async () => {
        await Promise.allSettled([
          refreshDashboard(),
          updateAlerts()
        ]);
      };

      initializeData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [userId, state.isInitialized, state.isLoading, refreshDashboard, updateAlerts]);

  const actions: OptimizedUnifiedEducationActions = {
    refreshDashboard,
    generateOptimalPath,
    updateAlerts,
    exportData,
    resetState
  };

  return {
    ...state,
    metrics,
    actions
  };
};
