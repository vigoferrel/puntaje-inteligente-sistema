
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealProgressData } from '@/hooks/useRealProgressData';
import { useRealDiagnosticData } from '@/hooks/useRealDiagnosticData';

interface OptimizedNeuralMetrics {
  neural_efficiency: number;
  cognitive_resonance: number;
  learning_velocity: number;
  knowledge_depth: number;
  strategic_thinking: number;
  pattern_recognition: number;
  adaptive_capacity: number;
  conceptual_mastery: number;
  creative_synthesis: number;
  analytical_precision: number;
  metacognitive_awareness: number;
  universe_exploration_depth: number;
  paes_simulation_accuracy: number;
  gamification_engagement: number;
  overall_neural_score: number;
}

export const useOptimizedRealNeuralMetrics = () => {
  const { user } = useAuth();
  const { metrics: progressMetrics, isLoading: progressLoading } = useRealProgressData();
  const { metrics: diagnosticMetrics, isLoading: diagnosticLoading } = useRealDiagnosticData();
  
  const [metrics, setMetrics] = useState<OptimizedNeuralMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateNeuralMetrics = useCallback(() => {
    if (!progressMetrics || !diagnosticMetrics || !user) {
      return null;
    }

    // Calcular métricas neurales basadas en datos reales
    const neuralEfficiency = Math.min(100, progressMetrics.learningVelocity * 1.2);
    const cognitiveResonance = Math.min(100, progressMetrics.retentionRate * 1.1);
    const learningVelocity = progressMetrics.learningVelocity;
    const knowledgeDepth = Math.min(100, (progressMetrics.completedNodes / Math.max(progressMetrics.totalNodes, 1)) * 100);
    const strategicThinking = Math.min(100, (100 - progressMetrics.cognitiveLoad) * 1.3);
    const patternRecognition = Math.min(100, diagnosticMetrics.readinessLevel * 1.1);
    const adaptiveCapacity = Math.min(100, progressMetrics.weeklyGrowth * 2);
    const conceptualMastery = Math.min(100, progressMetrics.retentionRate * 1.2);
    const creativeSynthesis = Math.min(100, (progressMetrics.totalSessions > 0 ? 70 : 0) + (progressMetrics.streakDays * 2));
    const analyticalPrecision = Math.min(100, diagnosticMetrics.averageScore > 0 ? (diagnosticMetrics.averageScore - 150) / 7 : 0);
    const metacognitiveAwareness = Math.min(100, progressMetrics.overallProgress * 0.9);
    
    // Métricas específicas del sistema
    const universeExplorationDepth = Math.min(100, knowledgeDepth * 0.8 + adaptiveCapacity * 0.2);
    const paesSimulationAccuracy = Math.min(100, diagnosticMetrics.readinessLevel * 0.9);
    const gamificationEngagement = Math.min(100, (progressMetrics.streakDays * 5) + (progressMetrics.totalSessions * 2));

    // Calcular puntaje neural general
    const allMetrics = [
      neuralEfficiency, cognitiveResonance, learningVelocity, knowledgeDepth,
      strategicThinking, patternRecognition, adaptiveCapacity, conceptualMastery,
      creativeSynthesis, analyticalPrecision, metacognitiveAwareness
    ];
    const overallNeuralScore = Math.round(allMetrics.reduce((sum, metric) => sum + metric, 0) / allMetrics.length);

    return {
      neural_efficiency: Math.round(neuralEfficiency),
      cognitive_resonance: Math.round(cognitiveResonance),
      learning_velocity: Math.round(learningVelocity),
      knowledge_depth: Math.round(knowledgeDepth),
      strategic_thinking: Math.round(strategicThinking),
      pattern_recognition: Math.round(patternRecognition),
      adaptive_capacity: Math.round(adaptiveCapacity),
      conceptual_mastery: Math.round(conceptualMastery),
      creative_synthesis: Math.round(creativeSynthesis),
      analytical_precision: Math.round(analyticalPrecision),
      metacognitive_awareness: Math.round(metacognitiveAwareness),
      universe_exploration_depth: Math.round(universeExplorationDepth),
      paes_simulation_accuracy: Math.round(paesSimulationAccuracy),
      gamification_engagement: Math.round(gamificationEngagement),
      overall_neural_score: overallNeuralScore
    };
  }, [progressMetrics, diagnosticMetrics, user]);

  const getMetricForDimension = useCallback((dimensionId: string): number => {
    if (!metrics) return 0;
    
    const dimensionMetricMap: Record<string, keyof OptimizedNeuralMetrics> = {
      'neural_command': 'overall_neural_score',
      'cognitive_resonance': 'cognitive_resonance',
      'learning_velocity': 'learning_velocity',
      'knowledge_depth': 'knowledge_depth',
      'strategic_thinking': 'strategic_thinking',
      'pattern_recognition': 'pattern_recognition',
      'adaptive_capacity': 'adaptive_capacity',
      'conceptual_mastery': 'conceptual_mastery',
      'creative_synthesis': 'creative_synthesis',
      'analytical_precision': 'analytical_precision',
      'metacognitive_awareness': 'metacognitive_awareness',
      'educational_universe': 'universe_exploration_depth',
      'paes_simulation': 'paes_simulation_accuracy',
      'battle_mode': 'gamification_engagement'
    };

    const metricKey = dimensionMetricMap[dimensionId];
    return metricKey ? metrics[metricKey] : 0;
  }, [metrics]);

  useEffect(() => {
    setIsLoading(progressLoading || diagnosticLoading);
    
    if (!progressLoading && !diagnosticLoading) {
      if (progressMetrics && diagnosticMetrics) {
        const calculatedMetrics = calculateNeuralMetrics();
        setMetrics(calculatedMetrics);
        setError(null);
      } else if (!progressMetrics || !diagnosticMetrics) {
        setError('No se pudieron cargar las métricas necesarias');
      }
    }
  }, [progressLoading, diagnosticLoading, progressMetrics, diagnosticMetrics, calculateNeuralMetrics]);

  return {
    metrics,
    isLoading,
    error,
    getMetricForDimension
  };
};
