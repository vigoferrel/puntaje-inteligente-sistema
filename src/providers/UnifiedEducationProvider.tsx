/**
 * UNIFIED EDUCATION PROVIDER v2.0
 * Inicialización segura sin errores de storage
 */

import React, { useEffect, useCallback, useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedEducationStore, useUnifiedActions, useSystemHealth } from '@/core/state/UnifiedEducationStateManager';
import { unifiedStorageSystem } from '@/core/storage/UnifiedStorageSystem';
import { toast } from '@/hooks/use-toast';

interface UnifiedEducationProviderProps {
  children: React.ReactNode;
}

const UnifiedEducationCore: React.FC<UnifiedEducationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const actions = useUnifiedActions();
  const { healthScore, isHealthy, trackingBlocked } = useSystemHealth();
  const system = useUnifiedEducationStore((state) => state.system);
  
  const [storageReady, setStorageReady] = useState(false);

  // Inicialización segura del storage
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        await unifiedStorageSystem.waitForReady();
        setStorageReady(true);
        
        const status = unifiedStorageSystem.getStatus();
        console.log('🚀 Storage system ready:', {
          available: status.storageAvailable,
          trackingBlocked: status.trackingBlocked,
          cacheSize: status.cacheSize
        });
        
      } catch (error) {
        console.warn('⚠️ Storage initialization with limited functionality');
        setStorageReady(true); // Continuar en modo limitado
      }
    };

    initializeStorage();
  }, []);

  // Inicialización unificada solo cuando storage esté listo
  useEffect(() => {
    if (user?.id && storageReady && !system.isInitialized) {
      console.log('🚀 Initializing unified education system v2.0...');
      actions.initialize(user.id);
    }
  }, [user?.id, storageReady, system.isInitialized, actions]);

  // Sync optimizado cada 45 segundos
  useEffect(() => {
    if (!system.isInitialized || !storageReady) return;

    const syncInterval = setInterval(() => {
      // Sync solo si el storage está disponible
      const storageStatus = unifiedStorageSystem.getStatus();
      if (storageStatus.isReady && storageStatus.storageAvailable) {
        actions.syncToStorage();
      }
      
      // Health check mejorado
      const metrics = unifiedStorageSystem.getPerformanceMetrics();
      const newHealthScore = Math.max(50, 100 - (metrics.syncQueueSize * 5) - (metrics.trackingBlocked ? 20 : 0));
      actions.setSystemHealth(newHealthScore);
      
    }, 45000);

    return () => clearInterval(syncInterval);
  }, [system.isInitialized, storageReady, actions]);

  // Notificaciones mejoradas
  useEffect(() => {
    if (trackingBlocked && healthScore > 0) {
      // Solo una notificación discreta sobre tracking
      console.log('ℹ️ Storage running in memory mode (tracking prevention active)');
    } else if (healthScore < 60 && healthScore > 0) {
      toast({
        title: "⚠️ Sistema en Modo Limitado",
        description: `Performance reducido - Health: ${healthScore}%`,
        variant: "default"
      });
    }
  }, [healthScore, trackingBlocked]);

  // Manejo de errores global mejorado
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Filtrar errores conocidos de storage/tracking
      if (event.error?.message?.includes('Access is denied') ||
          event.error?.message?.includes('QuotaExceeded') ||
          event.error?.message?.includes('import.meta')) {
        return; // Ignorar estos errores
      }
      
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

  // Loading state mejorado
  if (!storageReady || system.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-lg">Inicializando Sistema Educativo Neural v2.0...</p>
          <p className="text-sm text-cyan-300 mt-2">
            {!storageReady ? 'Configurando Storage...' : 'Cargando Datos...'}
          </p>
          <div className="mt-4 text-xs text-cyan-200">
            <div>🔧 Sistema Unificado v2.0</div>
            <div>⚡ Health Score: {healthScore}%</div>
            <div>🛡️ {trackingBlocked ? 'Modo Memoria' : 'Storage Normal'}</div>
          </div>
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
