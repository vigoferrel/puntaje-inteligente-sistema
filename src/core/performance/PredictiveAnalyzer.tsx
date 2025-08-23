
import { useState, useEffect, useCallback } from 'react';

interface DataPoint {
  timestamp: number;
  value: number;
  metadata?: Record<string, any>;
}

interface PredictionResult {
  nextValue: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  alertProbability: number;
  timeToAlert?: number;
}

interface UserBehaviorPattern {
  type: 'navigation' | 'interaction' | 'performance';
  pattern: string;
  frequency: number;
  lastSeen: number;
  predictedNext: number;
}

class PredictiveAnalyzer {
  private static instance: PredictiveAnalyzer;
  private dataStreams = new Map<string, DataPoint[]>();
  private behaviorPatterns: UserBehaviorPattern[] = [];

  static getInstance(): PredictiveAnalyzer {
    if (!PredictiveAnalyzer.instance) {
      PredictiveAnalyzer.instance = new PredictiveAnalyzer();
    }
    return PredictiveAnalyzer.instance;
  }

  addDataPoint(streamId: string, value: number, metadata?: Record<string, any>) {
    const dataPoint: DataPoint = {
      timestamp: Date.now(),
      value,
      metadata
    };

    const stream = this.dataStreams.get(streamId) || [];
    stream.push(dataPoint);
    
    // Mantener solo los últimos 100 puntos
    if (stream.length > 100) {
      stream.shift();
    }
    
    this.dataStreams.set(streamId, stream);
  }

  predict(streamId: string, horizon: number = 5): PredictionResult | null {
    const stream = this.dataStreams.get(streamId);
    if (!stream || stream.length < 10) return null;

    const values = stream.map(p => p.value);
    const timestamps = stream.map(p => p.timestamp);
    
    // Análisis de tendencia usando regresión lineal simple
    const trend = this.calculateTrend(values);
    const volatility = this.calculateVolatility(values);
    
    // Predicción usando promedio móvil exponencial
    const alpha = 0.3;
    let ema = values[0];
    for (let i = 1; i < values.length; i++) {
      ema = alpha * values[i] + (1 - alpha) * ema;
    }
    
    // Proyectar hacia adelante
    const trendFactor = trend.slope * horizon;
    const nextValue = Math.max(0, ema + trendFactor);
    
    // Calcular confianza basada en volatilidad
    const confidence = Math.max(0.1, 1 - (volatility / 100));
    
    // Detectar probabilidad de alerta
    const currentAvg = values.slice(-5).reduce((sum, v) => sum + v, 0) / 5;
    const alertThresholds = this.getAlertThresholds(streamId);
    const alertProbability = this.calculateAlertProbability(nextValue, alertThresholds, volatility);
    
    // Estimar tiempo hasta alerta si la tendencia continúa
    let timeToAlert: number | undefined;
    if (trend.direction !== 'stable' && alertProbability > 0.3) {
      timeToAlert = this.estimateTimeToAlert(currentAvg, alertThresholds.warning, trend.slope);
    }

    return {
      nextValue,
      confidence,
      trend: trend.direction,
      alertProbability,
      timeToAlert
    };
  }

  recordUserBehavior(type: 'navigation' | 'interaction' | 'performance', pattern: string) {
    const existing = this.behaviorPatterns.find(p => p.type === type && p.pattern === pattern);
    
    if (existing) {
      existing.frequency++;
      existing.lastSeen = Date.now();
    } else {
      this.behaviorPatterns.push({
        type,
        pattern,
        frequency: 1,
        lastSeen: Date.now(),
        predictedNext: Date.now() + (24 * 60 * 60 * 1000) // 24 horas por defecto
      });
    }

    // Mantener solo patrones recientes
    this.behaviorPatterns = this.behaviorPatterns.filter(p => 
      Date.now() - p.lastSeen < 7 * 24 * 60 * 60 * 1000 // 7 días
    );
  }

  predictUserBehavior(type?: 'navigation' | 'interaction' | 'performance'): UserBehaviorPattern[] {
    let patterns = this.behaviorPatterns;
    
    if (type) {
      patterns = patterns.filter(p => p.type === type);
    }
    
    return patterns
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10)
      .map(pattern => ({
        ...pattern,
        predictedNext: this.calculateNextOccurrence(pattern)
      }));
  }

  private calculateTrend(values: number[]): { direction: 'increasing' | 'decreasing' | 'stable'; slope: number } {
    if (values.length < 2) return { direction: 'stable', slope: 0 };
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, v) => sum + v, 0);
    const sumXY = values.reduce((sum, v, i) => sum + (i * v), 0);
    const sumXX = values.reduce((sum, v, i) => sum + (i * i), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    let direction: 'increasing' | 'decreasing' | 'stable';
    if (Math.abs(slope) < 0.1) direction = 'stable';
    else if (slope > 0) direction = 'increasing';
    else direction = 'decreasing';
    
    return { direction, slope };
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  }

  private getAlertThresholds(streamId: string) {
    const thresholds = {
      memory: { warning: 70, critical: 85 },
      cpu: { warning: 80, critical: 95 },
      responseTime: { warning: 200, critical: 500 },
      errorRate: { warning: 1, critical: 3 }
    };
    
    return thresholds[streamId as keyof typeof thresholds] || { warning: 70, critical: 85 };
  }

  private calculateAlertProbability(predictedValue: number, thresholds: any, volatility: number): number {
    const warningDistance = Math.abs(predictedValue - thresholds.warning);
    const criticalDistance = Math.abs(predictedValue - thresholds.critical);
    
    // Mayor volatilidad = mayor probabilidad de cruzar umbrales
    const volatilityFactor = Math.min(1, volatility / 50);
    
    if (predictedValue >= thresholds.critical) return 0.9 + volatilityFactor * 0.1;
    if (predictedValue >= thresholds.warning) return 0.6 + volatilityFactor * 0.3;
    
    // Probabilidad basada en proximidad a umbrales
    const proximityFactor = Math.max(0, 1 - warningDistance / thresholds.warning);
    return proximityFactor * volatilityFactor;
  }

  private estimateTimeToAlert(currentValue: number, threshold: number, slope: number): number {
    if (slope <= 0) return Infinity;
    
    const distance = threshold - currentValue;
    const timeMinutes = distance / slope;
    
    return Math.max(0, timeMinutes * 60 * 1000); // Convert to milliseconds
  }

  private calculateNextOccurrence(pattern: UserBehaviorPattern): number {
    const avgInterval = 24 * 60 * 60 * 1000 / Math.max(1, pattern.frequency); // Promedio por día
    const timeSinceLastSeen = Date.now() - pattern.lastSeen;
    
    return pattern.lastSeen + avgInterval + (timeSinceLastSeen * 0.1);
  }

  getAnalyticsReport() {
    const streams = Array.from(this.dataStreams.entries());
    const predictions = streams.map(([id, data]) => ({
      streamId: id,
      dataPoints: data.length,
      prediction: this.predict(id),
      lastValue: data[data.length - 1]?.value
    }));

    const behaviorInsights = this.predictUserBehavior();
    
    return {
      streams: predictions,
      behaviorPatterns: behaviorInsights,
      totalDataPoints: streams.reduce((sum, [, data]) => sum + data.length, 0),
      activeStreams: streams.length,
      timestamp: Date.now()
    };
  }
}

export const usePredictiveAnalyzer = () => {
  const [analyzer] = useState(() => PredictiveAnalyzer.getInstance());
  const [predictions, setPredictions] = useState<Record<string, PredictionResult>>({});
  const [behaviorPatterns, setBehaviorPatterns] = useState<UserBehaviorPattern[]>([]);

  const addMetric = useCallback((streamId: string, value: number, metadata?: Record<string, any>) => {
    analyzer.addDataPoint(streamId, value, metadata);
  }, [analyzer]);

  const recordBehavior = useCallback((type: 'navigation' | 'interaction' | 'performance', pattern: string) => {
    analyzer.recordUserBehavior(type, pattern);
  }, [analyzer]);

  const updatePredictions = useCallback(() => {
    const newPredictions: Record<string, PredictionResult> = {};
    const streams = ['memory', 'cpu', 'responseTime', 'errorRate'];
    
    streams.forEach(streamId => {
      const prediction = analyzer.predict(streamId);
      if (prediction) {
        newPredictions[streamId] = prediction;
      }
    });
    
    setPredictions(newPredictions);
    setBehaviorPatterns(analyzer.predictUserBehavior());
  }, [analyzer]);

  useEffect(() => {
    const interval = setInterval(updatePredictions, 10000); // Actualizar cada 10 segundos
    updatePredictions(); // Inicial
    
    return () => clearInterval(interval);
  }, [updatePredictions]);

  return {
    addMetric,
    recordBehavior,
    predictions,
    behaviorPatterns,
    getReport: analyzer.getAnalyticsReport.bind(analyzer)
  };
};

export { PredictiveAnalyzer };
