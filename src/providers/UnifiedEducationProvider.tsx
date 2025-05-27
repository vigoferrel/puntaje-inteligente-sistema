
/**
 * UNIFIED EDUCATION PROVIDER v4.0 - INICIALIZACIÓN DETERMINÍSTICA
 * Secuencia estricta coordinada con timeouts agresivos
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
  const timeoutRef = useRef<NodeJS.Timeout>();

  // FASE 1: Inicialización determinística de storage con timeout agresivo
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    const initializeStorageWithTimeout = async () => {
      // Timeout agresivo de 2 segundos
      const timeoutPromise = new Promise<void>((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Storage initialization timeout'));
        }, 2000);
      });

      const initPromise = new Promise<void>(async (resolve) => {
        try {
          await unifiedStorageSystem.waitForReady();
          const status = unifiedStorageSystem.getStatus();
          
          console.log('🚀 Storage inicializado v4.0:', {
            available: status.storageAvailable,
            trackingBlocked: status.trackingBlocked,
            circuitBreaker: status.circuitBreakerActive,
            cacheSize: status.cacheSize
          });
          
          resolve();
        } catch (error) {
          console.warn('⚠️ Storage en modo limitado');
          resolve(); // Continuar de todas formas
        }
      });

      try {
        await Promise.race([initPromise, timeoutPromise]);
      } catch (error) {
        console.warn('⚠️ Storage timeout - continuando con memoria');
      } finally {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setStorageReady(true);
      }
    };

    initializeStorageWithTimeout();
  }, []);

  // FASE 2: Inicialización del sistema educativo con bloqueo estricto
  useEffect(() => {
    if (!user?.id || !storageReady || system.isInitialized || system.isLoading) {
      return;
    }

    console.log('🚀 Initializing unified education system v4.0...');
    actions.initialize(user.id);
    
  }, [user?.id, storageReady, system.isInitialized, system.isLoading, actions]);

  // FASE 3: Sync coordinado con circuit breaker awareness
  useEffect(() => {
    if (!system.isInitialized || !storageReady) return;

    const syncInterval = setInterval(() => {
      const storageStatus = unifiedStorageSystem.getStatus();
      
      // Solo sync si storage está realmente disponible Y circuit breaker no está activo
      if (storageStatus.isReady && storageStatus.storageAvailable && !storageStatus.circuitBreakerActive) {
        actions.syncToStorage();
      }
      
      // Health check optimizado con circuit breaker metrics
      const metrics = unifiedStorageSystem.getPerformanceMetrics();
      const newHealthScore = storageStatus.circuitBreakerActive ? 75 : Math.max(60, 100 - (metrics.alertCount * 10));
      actions.setSystemHealth(newHealthScore);
      
    }, 45000); // 45 segundos - menos frecuente

    return () => clearInterval(syncInterval);
  }, [system.isInitialized, storageReady, actions]);

  // FASE 4: Notificaciones coordinadas
  useEffect(() => {
    if (!system.isInitialized || initializationComplete) return;

    setInitializationComplete(true);

    const storageStatus = unifiedStorageSystem.getStatus();
    
    if (storageStatus.circuitBreakerActive) {
      console.log('🔒 Circuit breaker activo - modo memoria optimizado');
    }
    
    // Solo toast para problemas graves O circuit breaker activo
    if (healthScore < 60 || storageStatus.circuitBreakerActive) {
      toast({
        title: storageStatus.circuitBreakerActive ? "Modo Memoria Activo" : "Sistema en Modo Seguro",
        description: storageStatus.circuitBreakerActive 
          ? "Funcionando completamente en memoria - sin dependencia de storage" 
          : `Performance limitado por protecciones del navegador`,
        variant: storageStatus.circuitBreakerActive ? "default" : "destructive"
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

  // Loading state mejorado con circuit breaker info
  if (!storageReady || system.isLoading) {
    const storageStatus = unifiedStorageSystem.getStatus();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-lg">Inicializando Sistema Neural v4.0...</p>
          <p className="text-sm text-cyan-300 mt-2">
            {!storageReady ? 'Configurando Storage Ultra-Seguro...' : 'Cargando Datos...'}
          </p>
          <div className="mt-4 text-xs text-cyan-200">
            <div>🛡️ Circuit Breaker {storageStatus.circuitBreakerActive ? 'ACTIVO' : 'Standby'}</div>
            <div>⚡ Health Score: {healthScore}%</div>
            <div>🔒 {storageStatus.circuitBreakerActive ? 'Modo Memoria Permanente' : 'Storage Normal'}</div>
            <div>📊 Cache: {storageStatus.cacheSize} items</div>
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
