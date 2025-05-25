
import { useState, useCallback } from 'react';
import { Exercise } from '@/types/ai-types';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { generateExercise as generateExerciseApi, generateExercisesBatch } from '@/services/openrouter/exercise-generation';

interface GenerationConfig {
  subject: string;
  tier: string;
  nodes: string[];
  difficulty: string;
  count: number;
  apiKey: string;
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

export const useExerciseGeneration = () => {
  const [exerciseResults, setExerciseResults] = useState<ExerciseFromGeneration[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMockExercises = (config: GenerationConfig): ExerciseFromGeneration[] => {
    return Array.from({ length: config.count }, (_, i) => ({
      id: i + 1,
      node: config.nodes[i % config.nodes.length],
      subject: config.subject,
      difficulty: config.difficulty,
      question: `¿Cuál de las siguientes opciones mejor describe el concepto evaluado en el nodo ${config.nodes[i % config.nodes.length]}?`,
      alternatives: [
        'Primera alternativa de respuesta que podría ser correcta',
        'Segunda alternativa que presenta una opción distinta',
        'Tercera alternativa con contenido relacionado',
        'Cuarta alternativa como distractor final'
      ],
      correctAnswer: 'A',
      explanation: `La respuesta correcta es A porque evalúa directamente el objetivo de aprendizaje del nodo ${config.nodes[i % config.nodes.length]}. Este nodo se enfoca en desarrollar las competencias específicas de ${config.subject} en nivel ${config.difficulty}.`,
      estimatedTime: Math.floor(Math.random() * 3) + 2
    }));
  };

  const generateExercises = useCallback(async (config: GenerationConfig) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Simular llamada a la API (aquí iría la integración real con OpenRouter)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockExercises = generateMockExercises(config);
      setExerciseResults(mockExercises);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error generating exercises:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Función para generar un ejercicio individual
  const generateExercise = useCallback(async (
    skill: TPAESHabilidad, 
    prueba?: TPAESPrueba, 
    difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' = 'INTERMEDIATE'
  ): Promise<Exercise | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const exercise = await generateExerciseApi(skill, prueba, difficulty);
      setCurrentExercise(exercise);
      return exercise;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating exercise');
      console.error('Error generating single exercise:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para generar ejercicio para un nodo específico
  const generateExerciseForNode = useCallback(async (node: any): Promise<Exercise | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mapear nodo a skill y prueba
      const skill = node.skill || 'COMPETENCIA_LECTORA';
      const prueba = node.prueba || 'COMPETENCIA_LECTORA';
      
      const exercise = await generateExerciseApi(skill, prueba, 'INTERMEDIATE');
      setCurrentExercise(exercise);
      return exercise;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating exercise for node');
      console.error('Error generating exercise for node:', err);
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
