
/**
 * UNIFIED EDUCATION PROVIDER v1.0
 * Proveedor único que reemplaza múltiples contextos
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedEducationStore, useUnifiedActions, useSystemHealth } from '@/core/state/UnifiedEducationStateManager';
import { optimizedStorageManager } from '@/core/storage/OptimizedStorageManager';
import { toast } from '@/hooks/use-toast';

interface UnifiedEducationProviderProps {
  children: React.ReactNode;
}

const UnifiedEducationCore: React.FC<UnifiedEducationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const actions = useUnifiedActions();
  const { healthScore, isHealthy } = useSystemHealth();
  const system = useUnifiedEducationStore((state) => state.system);

  // Inicialización unificada
  useEffect(() => {
    if (user?.id && !system.isInitialized) {
      console.log('🚀 Initializing unified education system...');
      actions.initialize(user.id);
    }
  }, [user?.id, system.isInitialized, actions]);

  // Sync automático cada 30 segundos
  useEffect(() => {
    if (!system.isInitialized) return;

    const syncInterval = setInterval(() => {
      actions.syncToStorage();
      
      // Health check
      const metrics = optimizedStorageManager.getPerformanceMetrics();
      const newHealthScore = Math.max(50, 100 - (metrics.syncQueueSize * 10));
      actions.setSystemHealth(newHealthScore);
      
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [system.isInitialized, actions]);

  // Notificaciones de salud del sistema
  useEffect(() => {
    if (healthScore < 70 && healthScore > 0) {
      toast({
        title: "⚠️ Sistema Optimizando",
        description: `Health Score: ${healthScore}% - Optimizando rendimiento...`,
        variant: "default"
      });
    }
  }, [healthScore]);

  // Manejo de errores global
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      actions.addNotification({
        type: 'error',
        title: 'Error del Sistema',
        message: 'Se detectó un error. El sistema se está recuperando automáticamente.',
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [actions]);

  // Monitoring de conexión
  useEffect(() => {
    const updateConnectionStatus = () => {
      actions.setConnectionStatus(navigator.onLine ? 'connected' : 'disconnected');
    };

    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    
    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  }, [actions]);

  // Loading state
  if (system.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-lg">Inicializando Sistema Educativo Unificado...</p>
          <p className="text-sm text-cyan-300 mt-2">Health Score: {healthScore}%</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const UnifiedEducationProvider: React.FC<UnifiedEducationProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <UnifiedEducationCore>
        {children}
      </UnifiedEducationCore>
    </AuthProvider>
  );
};

// Hook simplificado para acceso al sistema unificado
export const useUnifiedEducation = () => {
  const systemState = useUnifiedEducationStore((state) => state.system);
  const userState = useUnifiedEducationStore((state) => state.user);
  const lectoguiaState = useUnifiedEducationStore((state) => state.lectoguia);
  const superpaesState = useUnifiedEducationStore((state) => state.superpaes);
  const metricsState = useUnifiedEducationStore((state) => state.metrics);
  const uiState = useUnifiedEducationStore((state) => state.ui);
  const actions = useUnifiedActions();
  const { isHealthy } = useSystemHealth();

  return {
    // Estados
    system: systemState,
    user: userState,
    lectoguia: lectoguiaState,
    superpaes: superpaesState,
    metrics: metricsState,
    ui: uiState,
    
    // Acciones
    ...actions,
    
    // Utilidades
    isReady: systemState.isInitialized && !systemState.isLoading,
    isHealthy,
    
    // Métodos de conveniencia
    switchToLectoGuia: () => {
      actions.setActiveModule('lectoguia');
    },
    switchToSuperPAES: () => {
      actions.setActiveModule('superpaes');
    },
  };
};
