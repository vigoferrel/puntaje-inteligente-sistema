/**
 * QUANTUM SCORING BRIDGE - ENTRELAZAMIENTO CUÁNTICO
 * Context7 + Arsenal Educativo + Sistema de Scoring/Benchmark
 * Puente cuántico entre sistemas educativos y evaluación académica
 */

import React, { useState, useEffect, useCallback } from 'react';
import { QuantumEducationalArsenalService } from '../../services/quantum/QuantumEducationalArsenalService';
import styles from './QuantumScoringBridge.module.css';

interface ScoringBridgeProps {
  context7Coherence: number;
  sequentialStep: number;
  quantumEntanglements: number;
  transcendenceLevel: 'pending' | 'processing' | 'transcendent';
  onScoringUpdate?: (data: ScoringData) => void;
}

interface ScoringData {
  academicScore: number;
  benchmarkRating: string;
  paesProjection: {
    matematica: number;
    lenguaje: number;
    ciencias: number;
    historia: number;
  };
  quantumBonus: number;
  totalScore: number;
  recommendations: string[];
  activityLog: string[];
}

interface BenchmarkMetrics {
  coherenceImpact: number;
  sequentialBonus: number;
  transcendenceMultiplier: number;
  arsenalEfficiency: number;
}

const QuantumScoringBridge: React.FC<ScoringBridgeProps> = ({
  context7Coherence,
  sequentialStep,
  quantumEntanglements,
  transcendenceLevel,
  onScoringUpdate
}) => {
  const [scoringData, setScoringData] = useState<ScoringData>({
    academicScore: 0,
    benchmarkRating: 'Calculando...',
    paesProjection: {
      matematica: 0,
      lenguaje: 0,
      ciencias: 0,
      historia: 0
    },
    quantumBonus: 0,
    totalScore: 0,
    recommendations: [],
    activityLog: []
  });

  const [benchmarkMetrics, setBenchmarkMetrics] = useState<BenchmarkMetrics>({
    coherenceImpact: 0,
    sequentialBonus: 0,
    transcendenceMultiplier: 1,
    arsenalEfficiency: 0
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [activeView, setActiveView] = useState<'scoring' | 'benchmark' | 'projection'>('scoring');

  const addLog = useCallback((message: string) => {
    setScoringData(prev => ({
      ...prev,
      activityLog: [...prev.activityLog.slice(-4), `[${new Date().toLocaleTimeString()}] ${message}`]
    }));
  }, []);

  // Calcular métricas de benchmark
  const calculateBenchmarkMetrics = useCallback((): BenchmarkMetrics => {
    const coherenceImpact = (context7Coherence - 90) * 2; // Bonus por coherencia alta
    const sequentialBonus = sequentialStep * 5; // 5 puntos por paso completado
    const transcendenceMultiplier = transcendenceLevel === 'transcendent' ? 1.5 : 
                                   transcendenceLevel === 'processing' ? 1.2 : 1.0;
    const arsenalEfficiency = quantumEntanglements * 3; // 3 puntos por entrelazamiento

    return {
      coherenceImpact: Math.max(coherenceImpact, 0),
      sequentialBonus,
      transcendenceMultiplier,
      arsenalEfficiency
    };
  }, [context7Coherence, sequentialStep, transcendenceLevel, quantumEntanglements]);

  // Calcular score académico cuántico
  const calculateQuantumScore = useCallback(async () => {
    setIsCalculating(true);
    addLog('🧮 Calculando score académico cuántico');

    try {
      // Obtener datos del arsenal
      const [metrics, arsenalStatus] = await Promise.all([
        QuantumEducationalArsenalService.getRealTimeMetrics(),
        QuantumEducationalArsenalService.getArsenalStatus()
      ]);

      // Calcular métricas de benchmark
      const benchmarkMetrics = calculateBenchmarkMetrics();
      setBenchmarkMetrics(benchmarkMetrics);

      // Score base académico (simulado basado en coherencia)
      const baseScore = Math.round(context7Coherence * 8); // 92% coherencia = ~736 puntos

      // Bonus cuántico
      const quantumBonus = Math.round(
        benchmarkMetrics.coherenceImpact + 
        benchmarkMetrics.sequentialBonus + 
        benchmarkMetrics.arsenalEfficiency
      );

      // Score total con multiplicador de transcendencia
      const totalScore = Math.round((baseScore + quantumBonus) * benchmarkMetrics.transcendenceMultiplier);

      // Proyección PAES basada en Context7
      const paesProjection = {
        matematica: Math.round(baseScore * 0.85 + (benchmarkMetrics.coherenceImpact * 2)),
        lenguaje: Math.round(baseScore * 0.90 + (benchmarkMetrics.sequentialBonus * 1.5)),
        ciencias: Math.round(baseScore * 0.88 + (benchmarkMetrics.arsenalEfficiency * 2)),
        historia: Math.round(baseScore * 0.82 + (quantumBonus * 0.5))
      };

      // Rating de benchmark
      let benchmarkRating = 'Básico';
      if (totalScore >= 900) benchmarkRating = 'Transcendente';
      else if (totalScore >= 800) benchmarkRating = 'Excelente';
      else if (totalScore >= 700) benchmarkRating = 'Avanzado';
      else if (totalScore >= 600) benchmarkRating = 'Intermedio';

      // Generar recomendaciones
      const recommendations = generateScoringRecommendations(totalScore, benchmarkMetrics);

      const newScoringData: ScoringData = {
        academicScore: baseScore,
        benchmarkRating,
        paesProjection,
        quantumBonus,
        totalScore,
        recommendations,
        activityLog: scoringData.activityLog
      };

      setScoringData(newScoringData);
      onScoringUpdate?.(newScoringData);
      addLog(`✅ Score calculado: ${totalScore} puntos (${benchmarkRating})`);

    } catch (error) {
      console.error('Error calculando score:', error);
      addLog(`❌ Error: ${error}`);
    } finally {
      setIsCalculating(false);
    }
  }, [context7Coherence, calculateBenchmarkMetrics, scoringData.activityLog, onScoringUpdate, addLog]);

  // Generar recomendaciones de scoring
  const generateScoringRecommendations = (score: number, metrics: BenchmarkMetrics): string[] => {
    const recommendations: string[] = [];

    if (score >= 900) {
      recommendations.push('🌟 Score transcendente: Mantener coherencia cuántica');
      recommendations.push('🎯 Preparación PAES: Nivel universitario avanzado');
    } else if (score >= 800) {
      recommendations.push('🚀 Score excelente: Optimizar entrelazamientos cuánticos');
      recommendations.push('📚 Enfoque en materias específicas para transcendencia');
    } else if (score >= 700) {
      recommendations.push('⚡ Score avanzado: Incrementar pasos secuenciales');
      recommendations.push('🧠 Activar más funciones del arsenal educativo');
    } else {
      recommendations.push('🔄 Score intermedio: Mejorar coherencia Context7');
      recommendations.push('📈 Usar playlists adaptativas para optimización');
    }

    if (metrics.transcendenceMultiplier > 1.2) {
      recommendations.push('🌌 Bonus transcendente activo: Aprovechar multiplicador');
    }

    return recommendations;
  };

  // Crear simulación PAES optimizada
  const createOptimizedPAESSimulation = useCallback(async () => {
    addLog('🎯 Creando simulación PAES optimizada');
    
    try {
      const enhancedScores = {
        context7_coherence: context7Coherence,
        sequential_step: sequentialStep,
        quantum_entanglements: quantumEntanglements,
        transcendence_level: transcendenceLevel,
        benchmark_score: scoringData.totalScore,
        academic_projection: scoringData.paesProjection
      };

      const simulation = await QuantumEducationalArsenalService.generatePAESSimulation(
        'quantum_benchmark_enhanced',
        enhancedScores
      );

      if (simulation) {
        addLog('✅ Simulación PAES optimizada creada');
        calculateQuantumScore(); // Recalcular con nueva data
      }
    } catch (error) {
      console.error('Error:', error);
      addLog(`❌ Error: ${error}`);
    }
  }, [context7Coherence, sequentialStep, quantumEntanglements, transcendenceLevel, scoringData, addLog, calculateQuantumScore]);

  // Calcular score al cambiar props
  useEffect(() => {
    calculateQuantumScore();
  }, [calculateQuantumScore]);

  // Obtener clase CSS para el rating
  const getRatingClass = (): string => {
    switch (scoringData.benchmarkRating) {
      case 'Transcendente': return styles.transcendent;
      case 'Excelente': return styles.excellent;
      case 'Avanzado': return styles.advanced;
      case 'Intermedio': return styles.intermediate;
      default: return styles.basic;
    }
  };

  return (
    <div className={`${styles.scoringContainer} ${getRatingClass()}`}>
      {/* Header */}
      <div className={styles.header}>
        <h3>🎯 Quantum Scoring Bridge</h3>
        <div className={styles.scoreDisplay}>
          <span className={styles.totalScore}>{scoringData.totalScore}</span>
          <span className={styles.rating}>{scoringData.benchmarkRating}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tab} ${activeView === 'scoring' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('scoring')}
        >
          Scoring
        </button>
        <button
          className={`${styles.tab} ${activeView === 'benchmark' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('benchmark')}
        >
          Benchmark
        </button>
        <button
          className={`${styles.tab} ${activeView === 'projection' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('projection')}
        >
          Proyección
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeView === 'scoring' && (
          <div className={styles.scoringTab}>
            <div className={styles.scoreBreakdown}>
              <div className={styles.scoreItem}>
                <span>Score Académico Base:</span>
                <span>{scoringData.academicScore}</span>
              </div>
              <div className={styles.scoreItem}>
                <span>Bonus Cuántico:</span>
                <span className={styles.bonus}>+{scoringData.quantumBonus}</span>
              </div>
              <div className={styles.scoreItem}>
                <span>Multiplicador Transcendencia:</span>
                <span className={styles.multiplier}>×{benchmarkMetrics.transcendenceMultiplier}</span>
              </div>
              <div className={`${styles.scoreItem} ${styles.totalItem}`}>
                <span>Score Total:</span>
                <span className={styles.totalScore}>{scoringData.totalScore}</span>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.actionButton}
                onClick={calculateQuantumScore}
                disabled={isCalculating}
              >
                🔄 Recalcular Score
              </button>
              <button
                className={styles.actionButton}
                onClick={createOptimizedPAESSimulation}
                disabled={isCalculating}
              >
                🎯 Simular PAES
              </button>
            </div>
          </div>
        )}

        {activeView === 'benchmark' && (
          <div className={styles.benchmarkTab}>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <h4>Impacto Coherencia</h4>
                <div className={styles.metricValue}>+{benchmarkMetrics.coherenceImpact.toFixed(1)}</div>
              </div>
              <div className={styles.metricCard}>
                <h4>Bonus Secuencial</h4>
                <div className={styles.metricValue}>+{benchmarkMetrics.sequentialBonus}</div>
              </div>
              <div className={styles.metricCard}>
                <h4>Eficiencia Arsenal</h4>
                <div className={styles.metricValue}>+{benchmarkMetrics.arsenalEfficiency}</div>
              </div>
              <div className={styles.metricCard}>
                <h4>Multiplicador</h4>
                <div className={styles.metricValue}>×{benchmarkMetrics.transcendenceMultiplier}</div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'projection' && (
          <div className={styles.projectionTab}>
            <h4>Proyección PAES Cuántica</h4>
            <div className={styles.paesGrid}>
              <div className={styles.paesSubject}>
                <span>Matemática:</span>
                <span className={styles.paesScore}>{scoringData.paesProjection.matematica}</span>
              </div>
              <div className={styles.paesSubject}>
                <span>Lenguaje:</span>
                <span className={styles.paesScore}>{scoringData.paesProjection.lenguaje}</span>
              </div>
              <div className={styles.paesSubject}>
                <span>Ciencias:</span>
                <span className={styles.paesScore}>{scoringData.paesProjection.ciencias}</span>
              </div>
              <div className={styles.paesSubject}>
                <span>Historia:</span>
                <span className={styles.paesScore}>{scoringData.paesProjection.historia}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className={styles.recommendations}>
        <h4>Recomendaciones de Optimización</h4>
        <div className={styles.recommendationList}>
          {scoringData.recommendations.map((rec, index) => (
            <div key={index} className={styles.recommendation}>
              {rec}
            </div>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className={styles.activityLog}>
        <h4>Log de Cálculos</h4>
        <div className={styles.logContainer}>
          {scoringData.activityLog.map((log, index) => (
            <div key={index} className={styles.logEntry}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      {isCalculating && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}>🧮</div>
          <div>Calculando score cuántico...</div>
        </div>
      )}
    </div>
  );
};

export default QuantumScoringBridge;