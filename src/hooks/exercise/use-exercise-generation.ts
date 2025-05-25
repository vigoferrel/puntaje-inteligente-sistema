
import { useState, useCallback } from 'react';

interface Exercise {
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

interface GenerationConfig {
  subject: string;
  tier: string;
  nodes: string[];
  difficulty: string;
  count: number;
  apiKey: string;
}

export const useExerciseGeneration = () => {
  const [exerciseResults, setExerciseResults] = useState<Exercise[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMockExercises = (config: GenerationConfig): Exercise[] => {
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

  const clearResults = useCallback(() => {
    setExerciseResults([]);
    setError(null);
  }, []);

  return {
    exerciseResults,
    isGenerating,
    error,
    generateExercises,
    clearResults
  };
};
