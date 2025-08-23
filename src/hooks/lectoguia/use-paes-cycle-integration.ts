import { useState, useCallback, useEffect } from 'react';
import { TLearningCyclePhase, TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { PAESContentService, PAESExerciseConfig } from '@/services/paes/paes-content-service';
import { PAESNodeMappingService, NodeEducationalInfo } from '@/services/paes/paes-node-mapping-service';
import { PAESCycleIntegrationService } from '@/services/paes/paes-cycle-integration';

interface PhaseProgress {
  [phase: string]: {
    completed: number;
    total: number;
    accuracy: number;
    timeSpent: number;
  };
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'exercise' | 'content' | 'assessment';
  priority: 'high' | 'medium' | 'low';
  skill?: TPAESHabilidad;
  difficulty?: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
}

/**
 * Hook integrado para manejar el ciclo de aprendizaje PAES
 */
export function usePAESCycleIntegration() {
  const [loading, setLoading] = useState(false);
  const [phaseProgress, setPhaseProgress] = useState<PhaseProgress>({});
  const [predictedScore, setPredictedScore] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentNodes, setCurrentNodes] = useState<NodeEducationalInfo[]>([]);

  /**
   * Cargar progreso de todas las fases
   */
  const loadPhaseProgress = useCallback(async () => {
    setLoading(true);
    try {
      // Simular carga de progreso por fase
      const mockProgress: PhaseProgress = {
        'DIAGNOSIS': { completed: 8, total: 10, accuracy: 75, timeSpent: 45 },
        'SKILL_TRAINING': { completed: 12, total: 20, accuracy: 68, timeSpent: 180 },
        'CONTENT_STUDY': { completed: 5, total: 15, accuracy: 82, timeSpent: 120 },
        'PERIODIC_TESTS': { completed: 2, total: 8, accuracy: 71, timeSpent: 90 },
        'REINFORCEMENT': { completed: 3, total: 12, accuracy: 79, timeSpent: 75 },
        'FINAL_SIMULATIONS': { completed: 0, total: 5, accuracy: 0, timeSpent: 0 }
      };
      
      setPhaseProgress(mockProgress);
      
      // Calcular puntaje proyectado basado en progreso
      const totalAccuracy = Object.values(mockProgress).reduce((sum, phase) => sum + phase.accuracy, 0);
      const avgAccuracy = totalAccuracy / Object.keys(mockProgress).length;
      const projectedScore = Math.round(400 + (avgAccuracy / 100) * 450); // Escala PAES
      setPredictedScore(projectedScore);
      
    } catch (error) {
      console.error('Error loading phase progress:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generar ejercicios específicos para una fase del ciclo de aprendizaje
   */
  const generatePhaseExercises = useCallback(async (
    phase: TLearningCyclePhase,
    skill: TPAESHabilidad,
    prueba: TPAESPrueba,
    userId?: string
  ) => {
    setLoading(true);
    try {
      const result = await PAESCycleIntegrationService.generatePhaseExercises(
        phase,
        skill,
        prueba,
        userId
      );
      
      console.log(`✅ Ejercicios generados para fase ${phase}:`, result.stats);
      return result.exercises;
    } catch (error) {
      console.error('Error generando ejercicios de fase:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generar recomendaciones inteligentes basadas en progreso
   */
  const generateRecommendations = useCallback((currentPhase: TLearningCyclePhase) => {
    const newRecommendations: Recommendation[] = [];
    
    // Recomendaciones basadas en la fase actual
    switch (currentPhase) {
      case 'DIAGNOSIS':
        newRecommendations.push({
          id: 'diag-1',
          title: 'Completar Diagnóstico de Matemáticas',
          description: 'Evalúa tu nivel actual en resolución de problemas',
          type: 'assessment',
          priority: 'high',
          skill: 'SOLVE_PROBLEMS',
          difficulty: 'INTERMEDIO'
        });
        break;
        
      case 'SKILL_TRAINING':
        newRecommendations.push({
          id: 'skill-1',
          title: 'Ejercicios de Comprensión Lectora',
          description: 'Practica con textos oficiales PAES',
          type: 'exercise',
          priority: 'high',
          skill: 'INTERPRET_RELATE',
          difficulty: 'INTERMEDIO'
        });
        break;
        
      case 'CONTENT_STUDY':
        newRecommendations.push({
          id: 'content-1',
          title: 'Estudio de Álgebra Avanzada',
          description: 'Material teórico con ejemplos resueltos',
          type: 'content',
          priority: 'medium',
          skill: 'REPRESENT',
          difficulty: 'AVANZADO'
        });
        break;
        
      default:
        newRecommendations.push({
          id: 'general-1',
          title: 'Ejercicios Mixtos',
          description: 'Práctica general de habilidades PAES',
          type: 'exercise',
          priority: 'medium',
          difficulty: 'INTERMEDIO'
        });
    }
    
    setRecommendations(newRecommendations);
  }, []);

  /**
   * Obtener configuración específica para una fase
   */
  const getPhaseConfig = useCallback((phase: TLearningCyclePhase) => {
    const configs = {
      'DIAGNOSIS': {
        name: 'Diagnóstico Inicial',
        description: 'Evaluación de conocimientos previos',
        primarySkills: ['SOLVE_PROBLEMS', 'INTERPRET_RELATE'],
        recommendedTime: 60,
        exerciseCount: 10,
        difficulty: 'INTERMEDIO' as const
      },
      'SKILL_TRAINING': {
        name: 'Entrenamiento de Habilidades',
        description: 'Desarrollo de competencias específicas',
        primarySkills: ['TRACK_LOCATE', 'EVALUATE_REFLECT'],
        recommendedTime: 45,
        exerciseCount: 5,
        difficulty: 'BASICO' as const
      },
      'CONTENT_STUDY': {
        name: 'Estudio de Contenido',
        description: 'Refuerzo teórico y conceptual',
        primarySkills: ['APPLY_PRINCIPLES', 'SCIENTIFIC_ARGUMENT'],
        recommendedTime: 90,
        exerciseCount: 3,
        difficulty: 'AVANZADO' as const
      },
      'PERIODIC_TESTS': {
        name: 'Evaluaciones Periódicas',
        description: 'Medición de progreso y ajustes',
        primarySkills: ['MODEL', 'ARGUE_COMMUNICATE'],
        recommendedTime: 120,
        exerciseCount: 15,
        difficulty: 'INTERMEDIO' as const
      },
      'REINFORCEMENT': {
        name: 'Reforzamiento',
        description: 'Consolidación de aprendizajes',
        primarySkills: ['TEMPORAL_THINKING', 'SOURCE_ANALYSIS'],
        recommendedTime: 75,
        exerciseCount: 8,
        difficulty: 'INTERMEDIO' as const
      },
      'FINAL_SIMULATIONS': {
        name: 'Simulacros Finales',
        description: 'Preparación para la prueba oficial',
        primarySkills: ['CRITICAL_THINKING', 'MULTICAUSAL_ANALYSIS'],
        recommendedTime: 150,
        exerciseCount: 65,
        difficulty: 'AVANZADO' as const
      }
    } as const;
    
    return configs[phase] || configs['SKILL_TRAINING'];
  }, []);

  /**
   * Generar ejercicios oficiales para una configuración específica
   */
  const generateOfficialExercises = useCallback(async (config: {
    prueba: TPAESPrueba;
    skill: TPAESHabilidad;
    count: number;
    difficulty?: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  }) => {
    try {
      setLoading(true);
      
      const exerciseConfig: PAESExerciseConfig = {
        prueba: config.prueba,
        skill: config.skill,
        count: config.count,
        difficulty: config.difficulty || 'INTERMEDIO',
        includeContext: true
      };
      
      const exercises = await PAESContentService.getOfficialExercises(exerciseConfig);
      
      console.log(`✅ Generados ${exercises.length} ejercicios oficiales`);
      return exercises;
      
    } catch (error) {
      console.error('Error generating official exercises:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar información educativa de nodos
   */
  const loadNodesEducationalInfo = useCallback(async (nodeIds: string[]) => {
    try {
      const nodesInfo = await PAESNodeMappingService.getMultipleNodesInfo(nodeIds);
      setCurrentNodes(nodesInfo);
      return nodesInfo;
    } catch (error) {
      console.error('Error loading nodes educational info:', error);
      return [];
    }
  }, []);

  /**
   * Buscar nodos por criterios educativos
   */
  const searchEducationalNodes = useCallback(async (criteria: {
    subject?: string;
    difficulty?: string;
    contentArea?: string;
  }) => {
    try {
      const nodes = await PAESNodeMappingService.searchNodesByEducationalCriteria(criteria);
      return nodes;
    } catch (error) {
      console.error('Error searching educational nodes:', error);
      return [];
    }
  }, []);

  /**
   * Actualizar progreso de fase
   */
  const updatePhaseProgress = useCallback((phase: TLearningCyclePhase, progress: {
    completed?: number;
    total?: number;
    accuracy?: number;
    timeSpent?: number;
  }) => {
    setPhaseProgress(prev => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        ...progress
      }
    }));
  }, []);

  // Inicialización
  useEffect(() => {
    loadPhaseProgress();
  }, [loadPhaseProgress]);

  return {
    // Estado
    loading,
    phaseProgress,
    predictedScore,
    recommendations,
    currentNodes,
    
    // Funciones
    loadPhaseProgress,
    generateRecommendations,
    getPhaseConfig,
    generateOfficialExercises,
    generatePhaseExercises,
    loadNodesEducationalInfo,
    searchEducationalNodes,
    updatePhaseProgress
  };
}
