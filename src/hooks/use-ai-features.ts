
import { useState } from "react";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { Exercise, AIAnalysis, AIFeedback } from "@/types/ai-types";
import { generateExercise as generateExerciseService } from "@/services/exercise-service";
import { analyzePerformance as analyzePerformanceService } from "@/services/performance-service";
import { provideFeedback as provideFeedbackService } from "@/services/feedback-service";

export const useAIFeatures = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateExercise = async (
    skill: TPAESHabilidad,
    prueba: TPAESPrueba,
    difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED',
    previousExercises: Exercise[] = []
  ): Promise<Exercise | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const exercise = await generateExerciseService(skill, prueba, difficulty, previousExercises);
      return exercise;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar ejercicio';
      console.error('Error generating exercise:', err);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const analyzePerformance = async (
    userId: string,
    skillLevels: Record<TPAESHabilidad, number>,
    exerciseResults: any[]
  ): Promise<AIAnalysis | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const analysis = await analyzePerformanceService(userId, skillLevels, exerciseResults);
      return analysis;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al analizar rendimiento';
      console.error('Error analyzing performance:', err);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const provideFeedback = async (
    exerciseAttempt: { question: string; answer: string },
    correctAnswer: string,
    explanation: string
  ): Promise<AIFeedback | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const feedback = await provideFeedbackService(exerciseAttempt, correctAnswer, explanation);
      return feedback;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar retroalimentación';
      console.error('Error providing feedback:', err);
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    generateExercise,
    analyzePerformance,
    provideFeedback,
    loading,
    error
  };
};
