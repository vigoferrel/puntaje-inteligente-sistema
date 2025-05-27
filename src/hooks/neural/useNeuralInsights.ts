
/**
 * NEURAL INSIGHTS HOOK v3.0
 * Módulo especializado para detección de patrones y generación de insights
 */

import { useCallback, useRef, useEffect } from 'react';
import { useNeuralSystem } from '@/contexts/NeuralSystemProvider';
import { NeuralInsight, NeuralMetrics, NeuralPrediction } from '@/types/neural-system-types';

interface InsightDetectionConfig {
  minConfidence: number;
  maxInsights: number;
  analysisInterval: number;
  enablePatternLearning: boolean;
}

const defaultConfig: InsightDetectionConfig = {
  minConfidence: 0.6,
  maxInsights: 10,
  analysisInterval: 60000, // 1 minute
  enablePatternLearning: true
};

export const useNeuralInsights = (config: Partial<InsightDetectionConfig> = {}) => {
  const { state } = useNeuralSystem();
  const insightConfig = { ...defaultConfig, ...config };
  const patternHistory = useRef<Array<{ metrics: NeuralMetrics; timestamp: number }>>([]);
  const lastAnalysis = useRef(0);

  // Detectar patrones en métricas
  const detectUsagePatterns = useCallback((metrics: NeuralMetrics): NeuralInsight[] => {
    const insights: NeuralInsight[] = [];
    const now = Date.now();

    // Patrón de engagement bajo
    if (metrics.real_time_engagement < 40) {
      insights.push({
        id: `low_engagement_${now}`,
        type: 'pattern',
        title: 'Engagement Bajo Detectado',
        description: 'El nivel de engagement ha estado consistentemente bajo. Se recomienda cambiar la estrategia de aprendizaje.',
        confidence: 0.8,
        data: {
          current_engagement: metrics.real_time_engagement,
          recommendation: 'break_or_change_method',
          impact: 'high'
        },
        created_at: now
      });
    }

    // Patrón de aprendizaje efectivo
    if (metrics.learning_effectiveness > 80 && metrics.neural_coherence > 70) {
      insights.push({
        id: `effective_learning_${now}`,
        type: 'optimization',
        title: 'Aprendizaje Altamente Efectivo',
        description: 'Estás en un estado óptimo de aprendizaje. Mantén este ritmo y técnica.',
        confidence: 0.9,
        data: {
          effectiveness: metrics.learning_effectiveness,
          coherence: metrics.neural_coherence,
          recommendation: 'maintain_current_approach'
        },
        created_at: now
      });
    }

    // Patrón de fatiga cognitiva
    if (metrics.neural_coherence < 30 && metrics.user_satisfaction_index < 50) {
      insights.push({
        id: `cognitive_fatigue_${now}`,
        type: 'anomaly',
        title: 'Fatiga Cognitiva Detectada',
        description: 'Los indicadores sugieren fatiga mental. Se recomienda un descanso.',
        confidence: 0.75,
        data: {
          coherence: metrics.neural_coherence,
          satisfaction: metrics.user_satisfaction_index,
          recommendation: 'take_break',
          suggested_break_duration: '15-30 minutes'
        },
        created_at: now
      });
    }

    return insights.filter(insight => insight.confidence >= insightConfig.minConfidence);
  }, [insightConfig.minConfidence]);

  // Analizar tendencias temporales
  const analyzeTrends = useCallback((history: Array<{ metrics: NeuralMetrics; timestamp: number }>): NeuralInsight[] => {
    if (history.length < 3) return [];

    const insights: NeuralInsight[] = [];
    const recent = history.slice(-3);
    const now = Date.now();

    // Calcular tendencias
    const engagementTrend = recent.map(h => h.metrics.real_time_engagement);
    const learningTrend = recent.map(h => h.metrics.learning_effectiveness);

    // Tendencia decreciente en engagement
    const engagementDecline = engagementTrend.every((val, i) => 
      i === 0 || val < engagementTrend[i - 1]
    );

    if (engagementDecline && engagementTrend[0] - engagementTrend[engagementTrend.length - 1] > 20) {
      insights.push({
        id: `declining_engagement_${now}`,
        type: 'pattern',
        title: 'Tendencia Decreciente en Engagement',
        description: 'El engagement ha estado disminuyendo consistentemente en las últimas sesiones.',
        confidence: 0.85,
        data: {
          trend: engagementTrend,
          decline_rate: engagementTrend[0] - engagementTrend[engagementTrend.length - 1],
          recommendation: 'diversify_learning_methods'
        },
        created_at: now
      });
    }

    // Mejora consistente en aprendizaje
    const learningImprovement = learningTrend.every((val, i) => 
      i === 0 || val > learningTrend[i - 1]
    );

    if (learningImprovement && learningTrend[learningTrend.length - 1] > 70) {
      insights.push({
        id: `improving_learning_${now}`,
        type: 'optimization',
        title: 'Mejora Consistente en Aprendizaje',
        description: 'Tu efectividad de aprendizaje ha estado mejorando consistentemente.',
        confidence: 0.9,
        data: {
          trend: learningTrend,
          improvement_rate: learningTrend[learningTrend.length - 1] - learningTrend[0],
          recommendation: 'continue_current_strategy'
        },
        created_at: now
      });
    }

    return insights;
  }, []);

  // Generar recomendaciones basadas en contexto
  const generateContextualRecommendations = useCallback((
    metrics: NeuralMetrics,
    predictions: NeuralPrediction[]
  ): NeuralInsight[] => {
    const insights: NeuralInsight[] = [];
    const now = Date.now();

    // Recomendación basada en hora del día
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 6) {
      if (metrics.neural_coherence < 50) {
        insights.push({
          id: `late_study_warning_${now}`,
          type: 'recommendation',
          title: 'Estudio Nocturno Detectado',
          description: 'Estudiar muy tarde puede afectar la retención. Considera sesiones más cortas.',
          confidence: 0.7,
          data: {
            current_hour: hour,
            coherence: metrics.neural_coherence,
            recommendation: 'shorter_sessions_or_rest'
          },
          created_at: now
        });
      }
    }

    // Recomendación basada en predicciones
    const lowEngagementPrediction = predictions.find(p => 
      p.type === 'engagement_forecast' && p.data.predicted_engagement < 50
    );

    if (lowEngagementPrediction) {
      insights.push({
        id: `proactive_engagement_${now}`,
        type: 'recommendation',
        title: 'Prevención de Bajo Engagement',
        description: 'Las predicciones sugieren que el engagement podría disminuir. Considera un cambio proactivo.',
        confidence: lowEngagementPrediction.confidence,
        data: {
          prediction: lowEngagementPrediction.data,
          recommendation: 'change_learning_method_preemptively'
        },
        created_at: now
      });
    }

    return insights;
  }, []);

  // Función principal de detección de insights
  const detectPatterns = useCallback(async (
    metrics: NeuralMetrics,
    predictions: NeuralPrediction[]
  ): Promise<NeuralInsight[]> => {
    const now = Date.now();
    
    // Agregar métricas al historial
    patternHistory.current.push({ metrics, timestamp: now });
    
    // Mantener solo los últimos 50 registros
    if (patternHistory.current.length > 50) {
      patternHistory.current = patternHistory.current.slice(-50);
    }

    const allInsights: NeuralInsight[] = [];

    try {
      // Detectar patrones actuales
      const currentPatterns = detectUsagePatterns(metrics);
      allInsights.push(...currentPatterns);

      // Analizar tendencias históricas
      const trendInsights = analyzeTrends(patternHistory.current);
      allInsights.push(...trendInsights);

      // Generar recomendaciones contextuales
      const contextualInsights = generateContextualRecommendations(metrics, predictions);
      allInsights.push(...contextualInsights);

      // Filtrar y limitar insights
      const uniqueInsights = allInsights
        .filter((insight, index, self) => 
          self.findIndex(i => i.type === insight.type && i.title === insight.title) === index
        )
        .slice(0, insightConfig.maxInsights);

      lastAnalysis.current = now;
      return uniqueInsights;

    } catch (error) {
      console.error('Error detecting patterns:', error);
      return [];
    }
  }, [detectUsagePatterns, analyzeTrends, generateContextualRecommendations, insightConfig.maxInsights]);

  // Auto-análisis periódico
  useEffect(() => {
    if (!insightConfig.enablePatternLearning) return;

    const interval = setInterval(() => {
      if (state.metrics && state.predictions) {
        detectPatterns(state.metrics, state.predictions);
      }
    }, insightConfig.analysisInterval);

    return () => clearInterval(interval);
  }, [state.metrics, state.predictions, detectPatterns, insightConfig]);

  return {
    detectPatterns,
    detectUsagePatterns,
    analyzeTrends,
    generateContextualRecommendations,
    getPatternHistory: () => patternHistory.current,
    clearHistory: () => {
      patternHistory.current = [];
    }
  };
};

// Función standalone para detección desde el provider
export const detectPatterns = async (
  metrics: NeuralMetrics,
  predictions: NeuralPrediction[]
): Promise<NeuralInsight[]> => {
  const insights: NeuralInsight[] = [];
  const now = Date.now();

  // Detección básica de patrones
  if (metrics.real_time_engagement < 40) {
    insights.push({
      id: `basic_low_engagement_${now}`,
      type: 'pattern',
      title: 'Engagement Bajo',
      description: 'Se detectó bajo nivel de engagement',
      confidence: 0.7,
      data: { engagement: metrics.real_time_engagement },
      created_at: now
    });
  }

  return insights.slice(0, 5); // Limitar a 5 insights básicos
};
