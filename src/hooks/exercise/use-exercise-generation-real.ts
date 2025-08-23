
import { useState, useCallback } from 'react';
import { Exercise } from '@/types/ai-types';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { supabase } from '@/integrations/supabase/client';

interface GenerationConfig {
  subject: string;
  tier: string;
  nodes: string[];
  difficulty: string;
  count: number;
  apiKey?: string;
}

interface ExerciseFromGeneration {
  id: number;
  node: string;
  subject: string;
  difficulty: string;
  question: string;
  alternatives: string[];
  correctAnswer: string;
  explanation: string;
  estimatedTime: number;
}

export const useExerciseGenerationReal = () => {
  const [exerciseResults, setExerciseResults] = useState<ExerciseFromGeneration[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateExercises = useCallback(async (config: GenerationConfig) => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log('🎯 Generando ejercicios reales desde banco_preguntas:', config);
      
      // Obtener ejercicios reales del banco de preguntas
      const { data: preguntasData, error: preguntasError } = await supabase
        .from('banco_preguntas')
        .select(`
          id,
          codigo_pregunta,
          enunciado,
          nivel_dificultad,
          competencia_especifica,
          tiempo_estimado_segundos,
          nodo_code,
          prueba_paes
        `)
        .eq('validada', true)
        .eq('nivel_dificultad', config.difficulty.toLowerCase())
        .limit(config.count);

      if (preguntasError) throw preguntasError;

      // Obtener alternativas para cada pregunta
      const exercisesWithAlternatives = await Promise.all(
        (preguntasData || []).map(async (pregunta) => {
          const { data: alternativasData, error: alternativasError } = await supabase
            .from('alternativas_respuesta')
            .select('letra, contenido, es_correcta')
            .eq('pregunta_id', pregunta.id)
            .order('orden');

          if (alternativasError) {
            console.warn('⚠️ Error obteniendo alternativas para pregunta:', pregunta.id);
            return null;
          }

          const correctAlternative = alternativasData?.find(alt => alt.es_correcta);
          
          return {
            id: parseInt(pregunta.codigo_pregunta.split('-').pop() || '0'),
            node: pregunta.nodo_code,
            subject: pregunta.prueba_paes,
            difficulty: pregunta.nivel_dificultad,
            question: pregunta.enunciado,
            alternatives: alternativasData?.map(alt => alt.contenido) || [],
            correctAnswer: correctAlternative?.letra || 'A',
            explanation: `Ejercicio del banco oficial para ${pregunta.competencia_especifica}`,
            estimatedTime: Math.ceil((pregunta.tiempo_estimado_segundos || 60) / 60)
          };
        })
      );

      const validExercises = exercisesWithAlternatives.filter(Boolean) as ExerciseFromGeneration[];
      setExerciseResults(validExercises);
      
      console.log('✅ Ejercicios reales generados:', validExercises.length);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('❌ Error generating real exercises:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateExercise = useCallback(async (
    skill: TPAESHabilidad, 
    prueba?: TPAESPrueba, 
    difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' = 'INTERMEDIATE'
  ): Promise<Exercise | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🎯 Generando ejercicio real para habilidad:', skill);
      
      // Mapear difficulty a los valores correctos de la base de datos
      const difficultyMap = {
        'BASIC': 'basico',
        'INTERMEDIATE': 'intermedio', 
        'ADVANCED': 'avanzado'
      };
      
      const mappedDifficulty = difficultyMap[difficulty];
      
      // Buscar ejercicio real en la base de datos
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('exercises')
        .select('*')
        .eq('skill_id', getSkillIdFromCode(skill))
        .eq('difficulty', mappedDifficulty as 'basic' | 'intermediate' | 'advanced')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (exerciseError) throw exerciseError;

      const exercise: Exercise = {
        id: exerciseData.id,
        question: exerciseData.question,
        options: exerciseData.options ? Object.values(exerciseData.options) : [],
        correctAnswer: exerciseData.correct_answer,
        explanation: exerciseData.explanation || '',
        skill: skill,
        difficulty: mappedDifficulty as 'basic' | 'intermediate' | 'advanced'
      };

      setCurrentExercise(exercise);
      return exercise;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating exercise');
      console.error('❌ Error generating single exercise:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateExerciseForNode = useCallback(async (node: any): Promise<Exercise | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Buscar ejercicios asociados al nodo
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('exercises')
        .select('*')
        .eq('node_id', node.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (exerciseError) throw exerciseError;

      const exercise: Exercise = {
        id: exerciseData.id,
        question: exerciseData.question,
        options: exerciseData.options ? Object.values(exerciseData.options) : [],
        correctAnswer: exerciseData.correct_answer,
        explanation: exerciseData.explanation || '',
        skill: 'INTERPRET_RELATE', // Default, should be mapped from node
        difficulty: exerciseData.difficulty || 'intermediate'
      };

      setCurrentExercise(exercise);
      return exercise;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating exercise for node');
      console.error('❌ Error generating exercise for node:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setExerciseResults([]);
    setCurrentExercise(null);
    setError(null);
  }, []);

  return {
    exerciseResults,
    currentExercise,
    setCurrentExercise,
    generateExercise,
    generateExerciseForNode,
    isGenerating,
    isLoading,
    error,
    generateExercises,
    clearResults
  };
};

function getSkillIdFromCode(skill: TPAESHabilidad): number {
  const skillMap: Record<TPAESHabilidad, number> = {
    'TRACK_LOCATE': 1,
    'INTERPRET_RELATE': 2,
    'EVALUATE_REFLECT': 3,
    'SOLVE_PROBLEMS': 4,
    'REPRESENT': 5,
    'MODEL': 6,
    'ARGUE_COMMUNICATE': 7,
    'IDENTIFY_THEORIES': 8,
    'PROCESS_ANALYZE': 9,
    'APPLY_PRINCIPLES': 10,
    'SCIENTIFIC_ARGUMENT': 11,
    'TEMPORAL_THINKING': 12,
    'SOURCE_ANALYSIS': 13,
    'MULTICAUSAL_ANALYSIS': 14,
    'CRITICAL_THINKING': 15,
    'REFLECTION': 16
  };
  
  return skillMap[skill] || 2;
}
