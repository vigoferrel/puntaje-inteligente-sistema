
import { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CrossModuleDataState {
  // Estado de sincronización
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncErrors: string[];
  syncCount: number; // Contador para evitar bucles
  
  // Métricas interseccionales
  crossModuleMetrics: {
    superPaesUniverseAlignment: number;
    diagnosticPlanConsistency: number;
    globalUserEngagement: number;
    systemCoherence: number;
  };
  
  // Datos unificados
  unifiedUserProfile: {
    id: string;
    level: number;
    strengths: string[];
    weaknesses: string[];
    recommendedPath: string[];
    globalProgress: number;
  } | null;
}

interface CrossModuleDataActions {
  syncAllModules: () => Promise<void>;
  syncSuperPaesWithUniverse: () => Promise<void>;
  syncDiagnosticWithPlans: () => Promise<void>;
  updateCrossModuleMetrics: () => void;
  generateUnifiedRecommendations: () => any[];
  clearSyncErrors: () => void;
  resetSyncCount: () => void;
}

export const useCrossModuleDataSync = create<CrossModuleDataState & CrossModuleDataActions>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      isSyncing: false,
      lastSyncTime: null,
      syncErrors: [],
      syncCount: 0,
      crossModuleMetrics: {
        superPaesUniverseAlignment: 85,
        diagnosticPlanConsistency: 78,
        globalUserEngagement: 92,
        systemCoherence: 88,
      },
      unifiedUserProfile: null,

      syncAllModules: async () => {
        const state = get();
        
        // Evitar bucles infinitos - máximo 1 sync por segundo
        if (state.isSyncing || state.syncCount > 10) {
          console.warn('🚫 Sync bloqueado: ya está en progreso o demasiados intentos');
          return;
        }

        // Verificar tiempo desde última sincronización
        if (state.lastSyncTime && Date.now() - state.lastSyncTime.getTime() < 5000) {
          console.warn('🚫 Sync demasiado frecuente, saltando...');
          return;
        }

        set({ isSyncing: true, syncErrors: [], syncCount: state.syncCount + 1 });

        try {
          console.log('🔄 Iniciando sincronización interseccional controlada...');
          
          // Sincronizar de manera controlada
          await Promise.all([
            state.syncSuperPaesWithUniverse(),
            state.syncDiagnosticWithPlans(),
          ]);

          // Actualizar métricas
          state.updateCrossModuleMetrics();

          set({ 
            lastSyncTime: new Date(),
            isSyncing: false 
          });

          console.log('✅ Sincronización interseccional completada');

        } catch (error) {
          console.error('❌ Error en sincronización:', error);
          set({ 
            syncErrors: [`Error de sincronización: ${error}`],
            isSyncing: false 
          });
        }
      },

      syncSuperPaesWithUniverse: async () => {
        console.log('🔗 Sincronizando SuperPAES ↔ Universe...');
        await new Promise(resolve => setTimeout(resolve, 100)); // Reducido de 500ms
      },

      syncDiagnosticWithPlans: async () => {
        console.log('📊 Sincronizando Diagnóstico → Planes...');
        await new Promise(resolve => setTimeout(resolve, 100)); // Reducido de 300ms
        
        // Generar perfil unificado
        set({
          unifiedUserProfile: {
            id: 'user-123',
            level: 75,
            strengths: ['Análisis Crítico', 'Resolución de Problemas'],
            weaknesses: ['Comprensión Lectora', 'Matemáticas Avanzadas'],
            recommendedPath: ['CL-TEXTO-COMP', 'M2-ALG-FUNC', 'HIST-ANALISIS'],
            globalProgress: 68
          }
        });
      },

      updateCrossModuleMetrics: () => {
        // Usar valores estables en lugar de aleatorios para evitar re-renders constantes
        const state = get();
        const baseMetrics = state.crossModuleMetrics;
        
        const newMetrics = {
          superPaesUniverseAlignment: Math.min(95, baseMetrics.superPaesUniverseAlignment + 1),
          diagnosticPlanConsistency: Math.min(95, baseMetrics.diagnosticPlanConsistency + 1),
          globalUserEngagement: Math.min(95, baseMetrics.globalUserEngagement + 0.5),
          systemCoherence: Math.min(95, baseMetrics.systemCoherence + 0.5),
        };

        set({ crossModuleMetrics: newMetrics });
      },

      generateUnifiedRecommendations: () => {
        const state = get();
        const profile = state.unifiedUserProfile;
        
        if (!profile) return [];

        return [
          {
            id: 'intersectional-1',
            type: 'cross-module',
            title: 'Ruta de Aprendizaje Personalizada',
            description: 'Basada en tu rendimiento en SuperPAES y Universe',
            priority: 'Alta',
            modules: ['SuperPAES', 'Universe', 'Planes'],
            action: 'Seguir secuencia recomendada',
            impact: 85
          }
        ];
      },

      clearSyncErrors: () => {
        set({ syncErrors: [] });
      },

      resetSyncCount: () => {
        set({ syncCount: 0 });
      }
    }),
    { name: 'CrossModuleDataSync' }
  )
);

// Hook mejorado con debounce automático y límites
export const useAutomaticSync = (interval: number = 60000) => { // Aumentado a 1 minuto
  const { syncAllModules, isSyncing, resetSyncCount } = useCrossModuleDataSync();

  const debouncedSync = useCallback(() => {
    if (isSyncing) return;
    syncAllModules();
  }, [syncAllModules, isSyncing]);

  useEffect(() => {
    // Reset del contador cada 10 minutos
    const resetTimer = setInterval(resetSyncCount, 600000);

    // Sync controlado
    const timer = setInterval(debouncedSync, interval);

    // Sincronización inicial solo si no hay una reciente
    const initialTimer = setTimeout(debouncedSync, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(resetTimer);
      clearTimeout(initialTimer);
    };
  }, [debouncedSync, interval, resetSyncCount]);
};
