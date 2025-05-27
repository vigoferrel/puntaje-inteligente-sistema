
/**
 * UNIFIED EDUCATION PROVIDER v3.0 - CORRECCIÓN DEFINITIVA
 * Inicialización coordinada sin bucles infinitos
 */

import React, { useEffect, useCallback, useState, useRef } from 'react';
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
  const [initializationComplete, setInitializationComplete] = useState(false);
  const initializationRef = useRef(false);

  // FASE 1: Inicialización de storage (solo una vez)
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    const initializeStorage = async () => {
      try {
        await unifiedStorageSystem.waitForReady();
        const status = unifiedStorageSystem.getStatus();
        
        console.log('🚀 Storage initialized:', {
          available: status.storageAvailable,
          trackingBlocked: status.trackingBlocked,
          circuitBreaker: status.circuitBreakerActive
        });
        
        setStorageReady(true);
        
      } catch (error) {
        console.warn('⚠️ Storage en modo limitado');
        setStorageReady(true); // Continuar de todas formas
      }
    };

    initializeStorage();
  }, []);

  // FASE 2: Inicialización del sistema educativo (cuando storage esté listo)
  useEffect(() => {
    if (!user?.id || !storageReady || system.isInitialized || system.isLoading) {
      return;
    }

    console.log('🚀 Initializing unified education system v3.0...');
    actions.initialize(user.id);
    
  }, [user?.id, storageReady, system.isInitialized, system.isLoading, actions]);

  // FASE 3: Sync periódico CONTROLADO (sin bucles)
  useEffect(() => {
    if (!system.isInitialized || !storageReady) return;

    const syncInterval = setInterval(() => {
      const storageStatus = unifiedStorageSystem.getStatus();
      
      // Solo sync si storage está realmente disponible
      if (storageStatus.isReady && storageStatus.storageAvailable && !storageStatus.circuitBreakerActive) {
        actions.syncToStorage();
      }
      
      // Health check optimizado
      const metrics = unifiedStorageSystem.getPerformanceMetrics();
      const newHealthScore = Math.max(50, 100 - (metrics.alertCount * 15));
      actions.setSystemHealth(newHealthScore);
      
    }, 30000); // 30 segundos

    return () => clearInterval(syncInterval);
  }, [system.isInitialized, storageReady, actions]);

  // FASE 4: Notificaciones una sola vez
  useEffect(() => {
    if (!system.isInitialized || initializationComplete) return;

    // Marcar como completado inmediatamente para evitar re-ejecución
    setInitializationComplete(true);

    if (trackingBlocked) {
      console.log('ℹ️ Tracking prevention detectado - modo memoria activo');
    }
    
    // Solo toast si hay problemas graves
    if (healthScore < 50) {
      toast({
        title: "Sistema en Modo Seguro",
        description: `Performance limitado por protecciones del navegador`,
        variant: "default"
      });
    }
  }, [system.isInitialized, trackingBlocked, healthScore, initializationComplete]);

  // Connection monitoring
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
          <p className="text-lg">Inicializando Sistema Neural v3.0...</p>
          <p className="text-sm text-cyan-300 mt-2">
            {!storageReady ? 'Configurando Storage Seguro...' : 'Cargando Datos...'}
          </p>
          <div className="mt-4 text-xs text-cyan-200">
            <div>🛡️ Protección Anti-Tracking Activa</div>
            <div>⚡ Health Score: {healthScore}%</div>
            <div>🔒 {trackingBlocked ? 'Modo Memoria' : 'Storage Normal'}</div>
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
