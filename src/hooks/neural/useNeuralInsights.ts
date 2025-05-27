
/**
 * NEURAL INSIGHTS HOOK v3.0
 * Módulo especializado para insights y análisis inteligente
 */

import { useCallback, useRef } from 'react';
import { useNeuralSystem } from '@/components/neural/NeuralSystemProvider';

interface NeuralInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'recommendation' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  data: any;
  created_at: number;
}

export const useNeuralInsights = () => {
  const { state, actions } = useNeuralSystem();
  const analysisCache = useRef<Map<string, any>>(new Map());

  const generateInsight = useCallback((
    type: NeuralInsight['type'],
    title: string,
    description: string,
    data: any,
    confidence: number = 0.8
  ): NeuralInsight => {
    return {
      id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      title,
      description,
      confidence,
      data,
      created_at: Date.now()
    };
  }, []);

  const analyzeUserBehavior = useCallback(() => {
    const metrics = state.metrics;
    const insights: NeuralInsight[] = [];

    // Análisis de engagement
    if (metrics.real_time_engagement < 30) {
      insights.push(generateInsight(
        'recommendation',
        'Bajo Engagement Detectado',
        'Se recomienda tomar un descanso y cambiar la estrategia de estudio',
        { current_engagement: metrics.real_time_engagement },
        0.85
      ));
    }

    // Análisis de coherencia neural
    if (metrics.neural_coherence > 90) {
      insights.push(generateInsight(
        'pattern',
        'Excelente Coherencia Neural',
        'El sistema está funcionando en niveles óptimos',
        { coherence_score: metrics.neural_coherence },
        0.95
      ));
    }

    insights.forEach(insight => actions.addInsight(insight));
    return insights;
  }, [state.metrics, generateInsight, actions]);

  return {
    generateInsight,
    analyzeUserBehavior,
    insights: state.insights
  };
};
