
import { useState, useCallback } from 'react';
import { Exercise } from '@/types/ai-types';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { SmartExerciseBankPAES } from '@/services/paes/SmartExerciseBankPAES';
import { ExerciseGenerationServicePAES } from '@/services/paes/ExerciseGenerationServicePAES';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/core/logging/SystemLogger';

interface PAESExerciseSystemState {
  currentExercise: Exercise | null;
  isLoading: boolean;
  error: string | null;
  stats: any;
  generationHistory: Exercise[];
}

export const usePAESExerciseSystem = () => {
  const { user } = useAuth();
  const [state, setState] = useState<PAESExerciseSystemState>({
    currentExercise: null,
    isLoading: false,
    error: null,
    stats: null,
    generationHistory: []
  });

  /**
   * Genera ejercicio PAES optimizado con sistema inteligente
   */
  const generateOptimizedExercise = useCallback(async (
    prueba: TPAESPrueba,
    skill: TPAESHabilidad,
    difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO' = 'INTERMEDIO',
    forceNew: boolean = false
  ): Promise<Exercise | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      logger.info('usePAESExerciseSystem', 'Generando ejercicio optimizado', {
        prueba, skill, difficulty, forceNew, userId: user?.id
      });
      
      let exercise: Exercise | null = null;
      
      if (forceNew) {
        // Forzar generación nueva
        exercise = await ExerciseGenerationServicePAES.generatePAESExercise({
          prueba,
          skill,
          difficulty,
          includeVisuals: shouldIncludeVisuals(prueba)
        });
      } else {
        // Usar sistema inteligente
        exercise = await SmartExerciseBankPAES.getOptimizedExercise(
          prueba,
          skill,
          difficulty,
          user?.id
        );
      }
      
      if (exercise) {
        setState(prev => ({
          ...prev,
          currentExercise: exercise,
          generationHistory: [exercise, ...prev.generationHistory.slice(0, 9)], // Últimos 10
          isLoading: false
        }));
        
        logger.info('usePAESExerciseSystem', 'Ejercicio generado exitosamente', {
          exerciseId: exercise.id,
          source: exercise.metadata?.source
        });
      } else {
        setState(prev => ({
          ...prev,
          error: 'No se pudo generar ejercicio de calidad suficiente',
          isLoading: false
        }));
      }
      
      return exercise;
    } catch (error) {
      logger.error('usePAESExerciseSystem', 'Error generando ejercicio', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false
      }));
      return null;
    }
  }, [user?.id]);

  /**
   * Genera lote de ejercicios para sesión de práctica
   */
  const generateExerciseBatch = useCallback(async (
    prueba: TPAESPrueba,
    skill: TPAESHabilidad,
    difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO',
    count: number = 5
  ): Promise<Exercise[]> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const exercises = await ExerciseGenerationServicePAES.generatePAESBatch({
        prueba,
        skill,
        difficulty,
        includeVisuals: shouldIncludeVisuals(prueba)
      }, count);
      
      setState(prev => ({
        ...prev,
        generationHistory: [...exercises, ...prev.generationHistory].slice(0, 20),
        isLoading: false
      }));
      
      return exercises;
    } catch (error) {
      logger.error('usePAESExerciseSystem', 'Error generando lote', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error generando lote',
        isLoading: false
      }));
      return [];
    }
  }, []);

  /**
   * Obtiene ejercicio por ID con sistema de cache
   */
  const getExerciseById = useCallback(async (exerciseId: string): Promise<Exercise | null> => {
    // Buscar en historial primero
    const cachedExercise = state.generationHistory.find(ex => ex.id === exerciseId);
    if (cachedExercise) {
      setState(prev => ({ ...prev, currentExercise: cachedExercise }));
      return cachedExercise;
    }
    
    // Si no está en cache, buscar en base de datos
    try {
      // Implementar búsqueda en BD
      return null; // Placeholder
    } catch (error) {
      logger.error('usePAESExerciseSystem', 'Error obteniendo ejercicio por ID', error);
      return null;
    }
  }, [state.generationHistory]);

  /**
   * Carga estadísticas del banco de ejercicios
   */
  const loadBankStats = useCallback(async () => {
    try {
      const stats = await SmartExerciseBankPAES.getBankStats();
      setState(prev => ({ ...prev, stats }));
      return stats;
    } catch (error) {
      logger.error('usePAESExerciseSystem', 'Error cargando estadísticas', error);
      return null;
    }
  }, []);

  /**
   * Reinicia el sistema (limpia cache y estado)
   */
  const resetSystem = useCallback(() => {
    setState({
      currentExercise: null,
      isLoading: false,
      error: null,
      stats: null,
      generationHistory: []
    });
  }, []);

  /**
   * Valida ejercicio manualmente
   */
  const validateExercise = useCallback(async (exercise: Exercise): Promise<boolean> => {
    try {
      // Usar sistema de validación del SmartExerciseBank
      // Implementar validación manual
      return true; // Placeholder
    } catch (error) {
      logger.error('usePAESExerciseSystem', 'Error validando ejercicio', error);
      return false;
    }
  }, []);

  /**
   * Reporta problema con ejercicio
   */
  const reportExerciseIssue = useCallback(async (
    exerciseId: string,
    issueType: string,
    description: string
  ) => {
    try {
      // Implementar reporte de issues
      logger.warn('usePAESExerciseSystem', 'Issue reportado', {
        exerciseId, issueType, description, userId: user?.id
      });
    } catch (error) {
      logger.error('usePAESExerciseSystem', 'Error reportando issue', error);
    }
  }, [user?.id]);

  return {
    // Estado
    currentExercise: state.currentExercise,
    isLoading: state.isLoading,
    error: state.error,
    stats: state.stats,
    generationHistory: state.generationHistory,
    
    // Acciones principales
    generateOptimizedExercise,
    generateExerciseBatch,
    getExerciseById,
    
    // Utilidades
    loadBankStats,
    resetSystem,
    validateExercise,
    reportExerciseIssue,
    
    // Métodos de conveniencia
    hasCurrentExercise: !!state.currentExercise,
    canGenerate: !state.isLoading,
    historyCount: state.generationHistory.length
  };
};

/**
 * Determina si incluir contenido visual según la materia
 */
function shouldIncludeVisuals(prueba: TPAESPrueba): boolean {
  return ['MATEMATICA_1', 'MATEMATICA_2', 'CIENCIAS'].includes(prueba);
}

/**
 * Hook simplificado para generación rápida
 */
export const useQuickPAESExercise = () => {
  const { generateOptimizedExercise } = usePAESExerciseSystem();
  
  return useCallback(async (
    subject: string,
    difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO' = 'INTERMEDIO'
  ) => {
    // Mapear materia a prueba y skill por defecto
    const subjectMapping = {
      'competencia-lectora': { prueba: 'COMPETENCIA_LECTORA' as TPAESPrueba, skill: 'INTERPRET_RELATE' as TPAESHabilidad },
      'matematica-m1': { prueba: 'MATEMATICA_1' as TPAESPrueba, skill: 'SOLVE_PROBLEMS' as TPAESHabilidad },
      'matematica-m2': { prueba: 'MATEMATICA_2' as TPAESPrueba, skill: 'MODEL' as TPAESHabilidad },
      'ciencias': { prueba: 'CIENCIAS' as TPAESPrueba, skill: 'PROCESS_ANALYZE' as TPAESHabilidad },
      'historia': { prueba: 'HISTORIA' as TPAESPrueba, skill: 'SOURCE_ANALYSIS' as TPAESHabilidad }
    };
    
    const mapping = subjectMapping[subject as keyof typeof subjectMapping];
    if (!mapping) {
      throw new Error(`Materia no soportada: ${subject}`);
    }
    
    return generateOptimizedExercise(mapping.prueba, mapping.skill, difficulty);
  }, [generateOptimizedExercise]);
};
