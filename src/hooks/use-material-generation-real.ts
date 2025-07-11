
import { useState, useCallback } from 'react';
import { MaterialGenerationConfig, GeneratedMaterial, AdaptiveRecommendation, UserProgressData } from '@/types/material-generation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useMaterialGenerationReal = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMaterials, setGeneratedMaterials] = useState<GeneratedMaterial[]>([]);
  const [recommendations, setRecommendations] = useState<AdaptiveRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateMaterial = useCallback(async (config: MaterialGenerationConfig) => {
    if (!user?.id) return [];
    
    setIsGenerating(true);
    setError(null);

    try {
      console.log('🎯 Generando material real:', config);

      let materials: GeneratedMaterial[] = [];

      switch (config.materialType) {
        case 'exercises':
          materials = await generateRealExercises(config);
          break;
        case 'study_content':
          materials = await generateRealStudyContent(config);
          break;
        case 'assessment':
          materials = await generateRealAssessment(config);
          break;
        default:
          throw new Error(`Tipo de material no soportado: ${config.materialType}`);
      }

      setGeneratedMaterials(materials);

      toast({
        title: "Material generado exitosamente",
        description: `Se generaron ${materials.length} elementos reales de ${config.materialType}`,
      });

      console.log('✅ Material real generado:', materials.length, 'elementos');
      return materials;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ Error generando material real:', err);
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: `No se pudo generar el material: ${errorMessage}`,
        variant: "destructive"
      });

      return [];
    } finally {
      setIsGenerating(false);
    }
  }, [user?.id]);

  const generateRealExercises = async (config: MaterialGenerationConfig): Promise<GeneratedMaterial[]> => {
    const quantity = config.count || 5;
    
    const { data: exercisesData, error } = await supabase
      .from('banco_preguntas')
      .select(`
        id,
        codigo_pregunta,
        enunciado,
        nivel_dificultad,
        competencia_especifica,
        tiempo_estimado_segundos,
        prueba_paes
      `)
      .eq('prueba_paes', config.prueba)
      .eq('validada', true)
      .limit(quantity);

    if (error) throw error;

    return (exercisesData || []).map(exercise => ({
      id: exercise.id,
      type: 'exercises' as const,
      title: `Ejercicio ${exercise.codigo_pregunta}`,
      content: {
        question: exercise.enunciado,
        difficulty: exercise.nivel_dificultad,
        skill: exercise.competencia_especifica
      },
      metadata: {
        source: 'official' as const, // Changed from 'banco_oficial' to 'official'
        difficulty: exercise.nivel_dificultad,
        estimatedTime: Math.ceil((exercise.tiempo_estimado_segundos || 60) / 60),
        skill: exercise.competencia_especifica,
        prueba: exercise.prueba_paes
      },
      createdAt: new Date()
    }));
  };

  const generateRealStudyContent = async (config: MaterialGenerationConfig): Promise<GeneratedMaterial[]> => {
    const quantity = config.count || 3;
    
    const { data: nodesData, error } = await supabase
      .from('learning_nodes')
      .select('*')
      .eq('test_id', getTestIdFromPrueba(config.prueba))
      .limit(quantity);

    if (error) throw error;

    return (nodesData || []).map(node => ({
      id: node.id,
      type: 'study_content' as const,
      title: node.title,
      content: {
        topic: node.title,
        description: node.description,
        difficulty: node.difficulty
      },
      metadata: {
        source: 'official' as const, // Changed from 'nodos_aprendizaje' to 'official'
        difficulty: node.difficulty,
        estimatedTime: node.estimated_time_minutes,
        skill: node.subject_area,
        prueba: config.prueba
      },
      createdAt: new Date()
    }));
  };

  const generateRealAssessment = async (config: MaterialGenerationConfig): Promise<GeneratedMaterial[]> => {
    const quantity = config.count || 1;
    
    const { data: assessmentData, error } = await supabase
      .from('evaluaciones')
      .select('*')
      .eq('prueba_paes', config.prueba)
      .eq('esta_activo', true)
      .limit(quantity);

    if (error) throw error;

    return (assessmentData || []).map(assessment => ({
      id: assessment.id,
      type: 'assessment' as const,
      title: assessment.nombre,
      content: {
        assessmentType: assessment.tipo_evaluacion,
        duration: assessment.duracion_minutos,
        questions: assessment.total_preguntas
      },
      metadata: {
        source: 'official' as const, // Changed from 'evaluaciones_oficiales' to 'official'
        difficulty: assessment.nivel_dificultad || 'intermedio',
        estimatedTime: assessment.duracion_minutos,
        skill: assessment.tipo_evaluacion,
        prueba: assessment.prueba_paes || config.prueba
      },
      createdAt: new Date()
    }));
  };

  const generateRecommendations = useCallback(async (userProgress: UserProgressData, subject: string) => {
    if (!user?.id) return [];

    try {
      // Obtener recomendaciones reales basadas en progreso del usuario
      const { data: progressData, error } = await supabase
        .from('user_node_progress')
        .select(`
          node_id,
          mastery_level,
          learning_nodes(title, difficulty, tier_priority)
        `)
        .eq('user_id', user.id)
        .lt('mastery_level', 0.7); // Nodos con dominio bajo

      if (error) throw error;

      const realRecommendations: AdaptiveRecommendation[] = (progressData || []).map((progress: any) => ({
        id: `rec-${progress.node_id}`,
        type: 'exercises' as const, // Changed from 'study_focus' to 'exercises'
        priority: progress.learning_nodes?.tier_priority === 'tier1_critico' ? 'high' as const : 'medium' as const,
        title: `Reforzar: ${progress.learning_nodes?.title || 'Nodo desconocido'}`,
        description: `Dominio actual: ${Math.round(progress.mastery_level * 100)}%`,
        estimatedTime: 30,
        reasoning: `Basado en el bajo dominio (${Math.round(progress.mastery_level * 100)}%) en este nodo crítico`,
        config: {
          materialType: 'exercises' as const,
          prueba: subject as any,
          nodeIds: [progress.node_id],
          difficulty: progress.learning_nodes?.difficulty || 'INTERMEDIO',
          subject: subject,
          phase: 'EXPERIENCIA_CONCRETA' as const,
          count: 5,
          mode: 'official' as const,
          useOfficialContent: true,
          includeContext: true
        }
      }));

      setRecommendations(realRecommendations);
      return realRecommendations;
    } catch (err) {
      console.error('❌ Error generando recomendaciones reales:', err);
      return [];
    }
  }, [user?.id]);

  const getRealUserProgress = useCallback(async (subject: string): Promise<UserProgressData> => {
    if (!user?.id) {
      return {
        userId: 'anonymous',
        currentPhase: 'DIAGNOSIS',
        completedNodes: [],
        weakAreas: [],
        strongAreas: [],
        overallProgress: 0,
        lastActivity: new Date()
      };
    }

    try {
      const { data: progressData, error } = await supabase
        .from('user_node_progress')
        .select(`
          node_id,
          mastery_level,
          learning_nodes(code, tier_priority)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const completedNodes = (progressData || [])
        .filter(p => p.mastery_level > 0.8)
        .map(p => p.learning_nodes?.code)
        .filter(Boolean);

      const weakAreas = (progressData || [])
        .filter(p => p.mastery_level < 0.5)
        .map(p => p.learning_nodes?.code)
        .filter(Boolean);

      const strongAreas = (progressData || [])
        .filter(p => p.mastery_level > 0.8)
        .map(p => p.learning_nodes?.code)
        .filter(Boolean);

      const overallProgress = progressData?.length > 0 
        ? progressData.reduce((sum, p) => sum + p.mastery_level, 0) / progressData.length
        : 0;

      return {
        userId: user.id,
        currentPhase: overallProgress < 0.3 ? 'DIAGNOSIS' : overallProgress < 0.7 ? 'EXPERIENCIA_CONCRETA' : 'EXPERIMENTACION_ACTIVA',
        completedNodes,
        weakAreas,
        strongAreas,
        overallProgress,
        lastActivity: new Date()
      };
    } catch (err) {
      console.error('❌ Error obteniendo progreso real del usuario:', err);
      return {
        userId: user.id,
        currentPhase: 'DIAGNOSIS',
        completedNodes: [],
        weakAreas: [],
        strongAreas: [],
        overallProgress: 0,
        lastActivity: new Date()
      };
    }
  }, [user?.id]);

  const clearMaterials = useCallback(() => {
    setGeneratedMaterials([]);
    setRecommendations([]);
    setError(null);
  }, []);

  return {
    isGenerating,
    generatedMaterials,
    recommendations,
    error,
    generateMaterial,
    generateRecommendations,
    clearMaterials,
    getRealUserProgress
  };
};

function getTestIdFromPrueba(prueba: string): number {
  const mapping: Record<string, number> = {
    'COMPETENCIA_LECTORA': 1,
    'MATEMATICA_1': 2,
    'MATEMATICA_2': 3,
    'CIENCIAS': 4,
    'HISTORIA': 5
  };
  return mapping[prueba] || 1;
}
