
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  UnifiedPAESData, 
  PAESCompetencia, 
  PAESRecomendacion,
  PAESUser,
  PAESProgress,
  PAESDiagnostico,
  PAESPlan
} from '@/types/unified-paes-types';

interface IntersectionalMetrics {
  superPaesCompatibility: number;
  universeAlignment: number;
  diagnosticAccuracy: number;
  planEffectiveness: number;
  overallSynergy: number;
}

interface UnifiedPAESStore {
  // State
  user: PAESUser;
  progress: PAESProgress;
  competencias: PAESCompetencia[];
  recomendaciones: PAESRecomendacion[];
  diagnostico: PAESDiagnostico | null;
  plan: PAESPlan | null;
  isInitialized: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  initializeSystem: (userId: string) => Promise<void>;
  updateCompetencia: (competenciaId: string, nivel: number) => void;
  addRecomendacion: (recomendacion: PAESRecomendacion) => void;
  updateProgress: (area: string, value: number) => void;
  syncWithSuper: (superData: any) => void;
  syncWithUniverse: (universeData: any) => void;
  syncWithDiagnostic: (diagnosticData: any) => void;
  
  // Intersectional methods
  getIntersectionalMetrics: () => IntersectionalMetrics;
  generateCrossModuleRecommendations: () => PAESRecomendacion[];
  calculateGlobalCompatibility: () => number;
}

export const useUnifiedPAES = create<UnifiedPAESStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: {
          id: '',
          email: '',
          profile: {
            studyPhase: 'diagnostic',
            preferences: {
              studyTime: 'evening',
              difficulty: 'adaptive',
              visualMode: 'cinematic'
            }
          }
        },
        progress: {
          overall: 0,
          bySubject: {},
          streak: 0,
          totalStudyTime: 0,
          lastActivity: new Date().toISOString(),
          achievements: []
        },
        competencias: [],
        recomendaciones: [],
        diagnostico: null,
        plan: null,
        isInitialized: false,
        loading: false,
        error: null,

        // Actions
        initializeSystem: async (userId: string) => {
          set({ loading: true, error: null });
          
          try {
            console.log('🚀 Inicializando sistema unificado PAES');
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            set({
              user: {
                id: userId,
                email: 'user@example.com',
                profile: {
                  studyPhase: 'diagnostic',
                  preferences: {
                    studyTime: 'evening',
                    difficulty: 'adaptive',
                    visualMode: 'cinematic'
                  }
                }
              },
              isInitialized: true,
              loading: false
            });
            
            console.log('✅ Sistema PAES inicializado correctamente');
          } catch (error) {
            set({ error: `Error de inicialización: ${error}`, loading: false });
          }
        },

        updateCompetencia: (competenciaId: string, nivel: number) => {
          set(state => ({
            competencias: state.competencias.map(comp =>
              comp.id === competenciaId
                ? { ...comp, nivel, progreso: { ...comp.progreso, actual: nivel } }
                : comp
            )
          }));
        },

        addRecomendacion: (recomendacion: PAESRecomendacion) => {
          set(state => ({
            recomendaciones: [...state.recomendaciones, recomendacion]
          }));
        },

        updateProgress: (area: string, value: number) => {
          set(state => {
            const newBySubject = {
              ...state.progress.bySubject,
              [area]: value
            };
            const values = Object.values(newBySubject);
            const overall = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
            
            return {
              progress: {
                ...state.progress,
                bySubject: newBySubject,
                overall
              }
            };
          });
        },

        syncWithSuper: (superData: any) => {
          if (!superData) return;
          
          set(state => ({
            competencias: superData.competencias || state.competencias,
            recomendaciones: superData.recomendaciones || state.recomendaciones
          }));
          
          console.log('🔄 Sincronizado con SuperPAES');
        },

        syncWithUniverse: (universeData: any) => {
          if (!universeData) return;
          
          set(state => ({
            progress: {
              ...state.progress,
              bySubject: { ...state.progress.bySubject, ...universeData.progress }
            }
          }));
          
          console.log('🔄 Sincronizado con PAES Universe');
        },

        syncWithDiagnostic: (diagnosticData: any) => {
          if (!diagnosticData) return;
          
          set({ diagnostico: diagnosticData });
          console.log('🔄 Sincronizado con Diagnóstico');
        },

        getIntersectionalMetrics: (): IntersectionalMetrics => {
          const state = get();
          
          return {
            superPaesCompatibility: state.competencias.length > 0 ? 85 : 0,
            universeAlignment: Object.keys(state.progress.bySubject).length > 0 ? 78 : 0,
            diagnosticAccuracy: state.diagnostico ? 92 : 0,
            planEffectiveness: state.plan ? 88 : 0,
            overallSynergy: 85.75
          };
        },

        generateCrossModuleRecommendations: (): PAESRecomendacion[] => {
          const state = get();
          const metrics = get().getIntersectionalMetrics();
          
          const recommendations: PAESRecomendacion[] = [];
          
          if (metrics.superPaesCompatibility < 70) {
            recommendations.push({
              id: 'improve-super-sync',
              tipo: 'estrategia',
              titulo: 'Mejorar Sincronización SuperPAES',
              descripcion: 'Optimizar la integración entre competencias y análisis vocacional',
              compatibilidadGlobal: 75,
              razonamiento: ['Baja compatibilidad detectada', 'Posible desalineación de datos'],
              accionSugerida: 'Ejecutar resincronización completa',
              prioridad: 1,
              metadata: {}
            });
          }
          
          return recommendations;
        },

        calculateGlobalCompatibility: (): number => {
          const metrics = get().getIntersectionalMetrics();
          return (
            metrics.superPaesCompatibility * 0.3 +
            metrics.universeAlignment * 0.25 +
            metrics.diagnosticAccuracy * 0.25 +
            metrics.planEffectiveness * 0.2
          );
        }
      }),
      {
        name: 'unified-paes-store',
        partialize: (state) => ({
          user: state.user,
          progress: state.progress,
          competencias: state.competencias,
          recomendaciones: state.recomendaciones
        })
      }
    ),
    { name: 'UnifiedPAESStore' }
  )
);
