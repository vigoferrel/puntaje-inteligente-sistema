// 🧠 Hook para Predicciones Neurales - Integración con sistema de ejercicios
import { useState, useEffect, useCallback } from 'react';
import { NeuralPredictionService, NeuralPrediction, ExercisePerformance } from '../services/NeuralPredictionService';

export interface UseNeuralPredictionsReturn {
  prediction: NeuralPrediction | null;
  loading: boolean;
  error: string | null;
  generatePrediction: (userId: string, exerciseHistory: ExercisePerformance[]) => Promise<void>;
  updatePerformance: (userId: string, performance: ExercisePerformance) => Promise<void>;
  generatePersonalizedExercise: (userId: string) => Promise<any>;
}

export const useNeuralPredictions = (): UseNeuralPredictionsReturn => {
  const [prediction, setPrediction] = useState<NeuralPrediction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const neuralService = NeuralPredictionService.getInstance();

  const generatePrediction = useCallback(async (
    userId: string, 
    exerciseHistory: ExercisePerformance[]
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const newPrediction = await neuralService.predictPerformance(userId, exerciseHistory);
      setPrediction(newPrediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar predicción neural');
    } finally {
      setLoading(false);
    }
  }, [neuralService]);

  const updatePerformance = useCallback(async (
    userId: string, 
    performance: ExercisePerformance
  ): Promise<void> => {
    try {
      await neuralService.updateNeuralModel(userId, performance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar rendimiento');
    }
  }, [neuralService]);

  const generatePersonalizedExercise = useCallback(async (userId: string): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      const exercise = await neuralService.generatePersonalizedExercise(userId);
      return exercise;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar ejercicio personalizado');
      return null;
    } finally {
      setLoading(false);
    }
  }, [neuralService]);

  return {
    prediction,
    loading,
    error,
    generatePrediction,
    updatePerformance,
    generatePersonalizedExercise
  };
};
