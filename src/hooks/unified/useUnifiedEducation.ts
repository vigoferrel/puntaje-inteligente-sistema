
import { useState, useEffect } from 'react';

// Tipos básicos para el hook
interface UnifiedDashboardData {
  analytics: {
    totalStudents: number;
    activeStudents: number;
    averageEngagement: number;
    overallProgress: number;
  };
  calendar?: {
    nextCriticalDate: string;
    totalEvents: number;
  };
  scholarships?: {
    availableCount: number;
    totalAmount: number;
  };
}

interface PersonalizedAlert {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'normal' | 'low';
}

interface UseUnifiedEducationReturn {
  dashboard: UnifiedDashboardData | null;
  optimalPath: any | null;
  alerts: PersonalizedAlert[];
  isLoading: boolean;
  error: string | null;
  loadDashboard: () => Promise<void>;
  calculateOptimalPath: (preferences?: any) => Promise<void>;
  refreshAlerts: () => Promise<void>;
  exportReport: (format: 'pdf' | 'excel' | 'json') => Promise<Blob | null>;
  clearCache: () => void;
  stats: {
    lastUpdated: Date | null;
    totalRequests: number;
  };
}

/**
 * Hook unificado estable con recuperación automática
 */
export const useUnifiedEducation = (userId?: string): UseUnifiedEducationReturn => {
  const [dashboard, setDashboard] = useState<UnifiedDashboardData | null>(null);
  const [optimalPath, setOptimalPath] = useState<any | null>(null);
  const [alerts, setAlerts] = useState<PersonalizedAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    lastUpdated: null as Date | null,
    totalRequests: 0
  });

  // Datos mock estables
  const mockDashboard: UnifiedDashboardData = {
    analytics: {
      totalStudents: 150,
      activeStudents: 120,
      averageEngagement: 0.85,
      overallProgress: 0.72
    },
    calendar: {
      nextCriticalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      totalEvents: 5
    },
    scholarships: {
      availableCount: 12,
      totalAmount: 50000000
    }
  };

  const mockAlerts: PersonalizedAlert[] = [
    {
      id: '1',
      title: 'Próxima evaluación PAES',
      description: 'Simulacro programado para la próxima semana',
      priority: 'urgent'
    },
    {
      id: '2',
      title: 'Progreso en Matemáticas',
      description: 'Has mejorado un 15% en los últimos ejercicios',
      priority: 'normal'
    }
  ];

  const loadDashboard = async () => {
    if (!userId) {
      setDashboard(mockDashboard);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular carga con timeout para evitar bloqueos
      await new Promise(resolve => setTimeout(resolve, Math.min(500, 2000)));
      
      setDashboard(mockDashboard);
      setStats(prev => ({
        lastUpdated: new Date(),
        totalRequests: prev.totalRequests + 1
      }));
      
      console.log('✅ Dashboard cargado correctamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando dashboard';
      setError(errorMessage);
      console.error('❌ Error cargando dashboard:', err);
      
      // Fallback a datos mock
      setDashboard(mockDashboard);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOptimalPath = async (preferences: any = {}) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setOptimalPath({ 
        generated: true, 
        preferences,
        steps: ['Diagnóstico', 'Ejercicios', 'Evaluación', 'Mejora']
      });
      console.log('✅ Ruta óptima calculada');
    } catch (err) {
      setError('Error calculando ruta óptima');
      setOptimalPath({ generated: false, error: true });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAlerts = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      setAlerts(mockAlerts);
      console.log('✅ Alertas actualizadas');
    } catch (err) {
      console.error('❌ Error actualizando alertas:', err);
      setAlerts(mockAlerts); // Siempre mostrar alertas mock
    }
  };

  const exportReport = async (format: 'pdf' | 'excel' | 'json'): Promise<Blob | null> => {
    try {
      const data = JSON.stringify({ dashboard, alerts, format, exportedAt: new Date() });
      return new Blob([data], { type: 'application/json' });
    } catch (err) {
      console.error('❌ Error exportando reporte:', err);
      return null;
    }
  };

  const clearCache = () => {
    setDashboard(null);
    setOptimalPath(null);
    setAlerts([]);
    setError(null);
    console.log('🗑️ Cache limpiado');
  };

  // Carga inicial automática con recovery
  useEffect(() => {
    let mounted = true;
    
    if (userId && !dashboard && mounted) {
      const loadWithRetry = async (retries = 3) => {
        try {
          await loadDashboard();
          if (mounted) await refreshAlerts();
        } catch (error) {
          if (retries > 0 && mounted) {
            console.log(`🔄 Reintentando carga (${retries} intentos restantes)`);
            setTimeout(() => loadWithRetry(retries - 1), 1000);
          }
        }
      };
      
      loadWithRetry();
    }

    return () => {
      mounted = false;
    };
  }, [userId]);

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
