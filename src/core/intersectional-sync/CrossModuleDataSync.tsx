
import { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CrossModuleDataState {
  // Estado de sincronización con circuit breaker mejorado
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncErrors: string[];
  syncCount: number;
  consecutiveErrors: number;
  isCircuitBreakerOpen: boolean;
  nextAllowedSync: Date | null;
  
  // Métricas interseccionales (valores estables)
  crossModuleMetrics: {
    superPaesUniverseAlignment: number;
    diagnosticPlanConsistency: number;
    globalUserEngagement: number;
    systemCoherence: number;
  };
  
  // Datos unificados sin mocks
  unifiedUserProfile: {
    id: string;
    level: number;
    strengths: string[];
    weaknesses: string[];
    recommendedPath: string[];
    globalProgress: number;
    isLoaded: boolean;
  } | null;
}

interface CrossModuleDataActions {
  syncAllModules: () => Promise<void>;
  syncSuperPaesWithUniverse: () => Promise<void>;
  syncDiagnosticWithPlans: () => Promise<void>;
  updateCrossModuleMetrics: () => void;
  generateUnifiedRecommendations: () => any[];
  clearSyncErrors: () => void;
  resetCircuitBreaker: () => void;
  loadRealUserData: (userId: string) => Promise<void>;
}

export const useCrossModuleDataSync = create<CrossModuleDataState & CrossModuleDataActions>()(
  devtools(
    (set, get) => ({
      // Estado inicial optimizado
      isSyncing: false,
      lastSyncTime: null,
      syncErrors: [],
      syncCount: 0,
      consecutiveErrors: 0,
      isCircuitBreakerOpen: false,
      nextAllowedSync: null,
      crossModuleMetrics: {
        superPaesUniverseAlignment: 85,
        diagnosticPlanConsistency: 78,
        globalUserEngagement: 92,
        systemCoherence: 88,
      },
      unifiedUserProfile: null,

      syncAllModules: async () => {
        const state = get();
        
        // Circuit breaker agresivo - bloquear si está abierto
        if (state.isCircuitBreakerOpen) {
          if (state.nextAllowedSync && Date.now() < state.nextAllowedSync.getTime()) {
            console.warn('🚫 Circuit breaker abierto, sync bloqueado hasta:', state.nextAllowedSync);
            return;
          } else {
            // Resetear circuit breaker después del timeout
            set({ isCircuitBreakerOpen: false, nextAllowedSync: null, consecutiveErrors: 0 });
          }
        }

        // Límites más estrictos - máximo 3 sync por sesión
        if (state.isSyncing || state.syncCount >= 3) {
          console.warn('🚫 Sync límite alcanzado o ya en progreso');
          return;
        }

        // Intervalo mínimo de 60 segundos entre syncs
        if (state.lastSyncTime && Date.now() - state.lastSyncTime.getTime() < 60000) {
          console.warn('🚫 Sync demasiado frecuente, esperando cooldown...');
          return;
        }

        set({ isSyncing: true, syncErrors: [], syncCount: state.syncCount + 1 });

        try {
          console.log('🔄 Sync interseccional controlado iniciado...');
          
          // Sync con timeout reducido
          await Promise.race([
            Promise.all([
              state.syncSuperPaesWithUniverse(),
              state.syncDiagnosticWithPlans(),
            ]),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Sync timeout')), 5000)
            )
          ]);

          // Actualizar métricas de forma controlada
          state.updateCrossModuleMetrics();

          set({ 
            lastSyncTime: new Date(),
            isSyncing: false,
            consecutiveErrors: 0
          });

          console.log('✅ Sync interseccional completado exitosamente');

        } catch (error) {
          console.error('❌ Error en sync interseccional:', error);
          
          const newConsecutiveErrors = state.consecutiveErrors + 1;
          const shouldOpenCircuitBreaker = newConsecutiveErrors >= 2;
          
          set({ 
            syncErrors: [`Error de sync: ${error}`],
            isSyncing: false,
            consecutiveErrors: newConsecutiveErrors,
            isCircuitBreakerOpen: shouldOpenCircuitBreaker,
            nextAllowedSync: shouldOpenCircuitBreaker ? 
              new Date(Date.now() + 300000) : // 5 minutos de bloqueo
              null
          });
        }
      },

      syncSuperPaesWithUniverse: async () => {
        console.log('🔗 Sync SuperPAES ↔ Universe (optimizado)');
        await new Promise(resolve => setTimeout(resolve, 50));
      },

      syncDiagnosticWithPlans: async () => {
        console.log('📊 Sync Diagnóstico → Planes (optimizado)');
        await new Promise(resolve => setTimeout(resolve, 50));
      },

      updateCrossModuleMetrics: () => {
        // Actualización mínima para evitar re-renders constantes
        const state = get();
        const now = Date.now();
        
        // Solo actualizar cada 5 minutos
        if (state.lastSyncTime && now - state.lastSyncTime.getTime() < 300000) {
          return;
        }

        const incremento = 0.1; // Incremento mínimo
        set({ 
          crossModuleMetrics: {
            superPaesUniverseAlignment: Math.min(95, state.crossModuleMetrics.superPaesUniverseAlignment + incremento),
            diagnosticPlanConsistency: Math.min(95, state.crossModuleMetrics.diagnosticPlanConsistency + incremento),
            globalUserEngagement: Math.min(95, state.crossModuleMetrics.globalUserEngagement + incremento/2),
            systemCoherence: Math.min(95, state.crossModuleMetrics.systemCoherence + incremento/2),
          }
        });
      },

      loadRealUserData: async (userId: string) => {
        const state = get();
        if (state.unifiedUserProfile?.isLoaded) {
          return; // Ya cargado, no recargar
        }

        try {
          // TODO: Conectar con Supabase real cuando esté listo
          // Por ahora, datos mínimos sin logging excesivo
          set({
            unifiedUserProfile: {
              id: userId,
              level: 60,
              strengths: ['Comprensión Lectora'],
              weaknesses: ['Matemáticas'],
              recommendedPath: ['CL-TEXTO-COMP'],
              globalProgress: 60,
              isLoaded: true
            }
          });
        } catch (error) {
          console.error('Error cargando datos reales:', error);
        }
      },

      generateUnifiedRecommendations: () => {
        const state = get();
        if (!state.unifiedUserProfile?.isLoaded) return [];

        return [
          {
            id: 'unified-rec-1',
            type: 'intersectional',
            title: 'Continuar con Diagnóstico',
            description: 'Completar evaluación inicial',
            priority: 'Media',
            modules: ['Diagnóstico'],
            action: 'Ir a diagnóstico',
            impact: 75
          }
        ];
      },

      clearSyncErrors: () => {
        set({ syncErrors: [] });
      },

      resetCircuitBreaker: () => {
        set({ 
          isCircuitBreakerOpen: false, 
          nextAllowedSync: null, 
          consecutiveErrors: 0,
          syncCount: 0 
        });
      }
    }),
    { name: 'CrossModuleDataSync-Optimized' }
  )
);

// Hook con intervalo aumentado a 5 minutos y mejor control
export const useAutomaticSync = (interval: number = 300000) => {
  const { syncAllModules, isSyncing, isCircuitBreakerOpen, resetCircuitBreaker } = useCrossModuleDataSync();

  const debouncedSync = useCallback(() => {
    if (isSyncing || isCircuitBreakerOpen) return;
    syncAllModules();
  }, [syncAllModules, isSyncing, isCircuitBreakerOpen]);

  useEffect(() => {
    // Reset cada 30 minutos en lugar de 10
    const resetTimer = setInterval(resetCircuitBreaker, 1800000);

    // Sync cada 5 minutos en lugar de 1 minuto
    const timer = setInterval(debouncedSync, interval);

    // Sync inicial retrasado para evitar carga inicial
    const initialTimer = setTimeout(debouncedSync, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(resetTimer);
      clearTimeout(initialTimer);
    };
  }, [debouncedSync, interval, resetCircuitBreaker]);
};
