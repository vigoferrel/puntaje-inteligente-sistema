// 🧠 Neural Prediction Service - Predicciones inteligentes basadas en ejercicios
import { integratedSystemService } from './IntegratedSystemService';

export interface NeuralPrediction {
  userId: string;
  exerciseId: string;
  predictedScore: number;
  confidence: number;
  recommendations: string[];
  nextExercise: string;
  neuralFrequency: number;
  learningPath: string[];
}

export interface ExercisePerformance {
  exerciseId: string;
  userId: string;
  score: number;
  timeSpent: number;
  difficulty: string;
  bloomLevel: string;
  completedAt: Date;
}

export class NeuralPredictionService {
  private static instance: NeuralPredictionService;
  private neuralModel: Map<string, any> = new Map();
  private performanceHistory: Map<string, ExercisePerformance[]> = new Map();

  static getInstance(): NeuralPredictionService {
    if (!NeuralPredictionService.instance) {
      NeuralPredictionService.instance = new NeuralPredictionService();
    }
    return NeuralPredictionService.instance;
  }

  async predictPerformance(userId: string, exerciseHistory: ExercisePerformance[]): Promise<NeuralPrediction> {
    // Obtener estado cuántico real del sistema
    const quantumState = integratedSystemService.getQuantumState();
    const aiSystem = integratedSystemService.getAISystem();
    
    // Obtener historial real del usuario
    const userHistory = this.performanceHistory.get(userId) || [];
    const recentPerformance = userHistory.slice(-10);
    
    // Calcular métricas neurales usando datos reales del sistema
    const averageScore = recentPerformance.length > 0 
      ? recentPerformance.reduce((sum, perf) => sum + perf.score, 0) / recentPerformance.length 
      : quantumState.coherence; // Usar coherencia cuántica como base real
    
    const improvementTrend = this.calculateImprovementTrend(recentPerformance);
    const difficultyAdaptation = this.analyzeDifficultyAdaptation(recentPerformance);
    
    // Predicción neural usando entrelazamiento cuántico real
    const quantumFactor = quantumState.entanglement / 100;
    const aiAccuracyFactor = aiSystem.model_accuracy / 100;
    
    const predictedScore = Math.min(1.0, Math.max(0.0, 
      averageScore + (improvementTrend * 0.1) + (difficultyAdaptation * 0.05) + 
      (quantumFactor * 0.02) + (aiAccuracyFactor * 0.03)
    ));
    
    const confidence = this.calculateConfidence(recentPerformance, quantumState);
    const recommendations = this.generateRecommendations(recentPerformance, predictedScore, quantumState);
    const nextExercise = this.recommendNextExercise(userId, recentPerformance, quantumState);
    
    return {
      userId,
      exerciseId: `neural_${Date.now()}`,
      predictedScore,
      confidence,
      recommendations,
      nextExercise,
      neuralFrequency: this.calculateNeuralFrequency(predictedScore, quantumState),
      learningPath: this.generateLearningPath(userId, recentPerformance, quantumState)
    };
  }

  async generatePersonalizedExercise(userId: string): Promise<any> {
    const userHistory = this.performanceHistory.get(userId) || [];
    const prediction = await this.predictPerformance(userId, userHistory);
    const quantumState = integratedSystemService.getQuantumState();
    
    // Generar ejercicio personalizado basado en datos reales
    const difficulty = this.mapScoreToDifficulty(prediction.predictedScore);
    const bloomLevel = this.recommendBloomLevel(userHistory, quantumState);
    
    return {
      id: `personalized_${Date.now()}`,
      type: 'personalized',
      difficulty,
      bloomLevel,
      neuralScore: prediction.predictedScore,
      confidence: prediction.confidence,
      recommendations: prediction.recommendations,
      quantumState: {
        coherence: quantumState.coherence,
        entanglement: quantumState.entanglement,
        entropy: quantumState.entropy
      }
    };
  }

  async updateNeuralModel(userId: string, performance: ExercisePerformance): Promise<void> {
    const userHistory = this.performanceHistory.get(userId) || [];
    userHistory.push(performance);
    this.performanceHistory.set(userId, userHistory);
    
    // Actualizar modelo neural con datos reales
    this.updateUserModel(userId, performance);
  }

  // Obtener datos reales del sistema
  getRealSystemData() {
    const quantumState = integratedSystemService.getQuantumState();
    const aiSystem = integratedSystemService.getAISystem();
    const userProgress = integratedSystemService.getUserProgress('default-user');
    
    return {
      quantumState,
      aiSystem,
      userProgress,
      totalUsers: this.performanceHistory.size,
      totalExercises: Array.from(this.performanceHistory.values())
        .reduce((total, history) => total + history.length, 0)
    };
  }

  private calculateImprovementTrend(performance: ExercisePerformance[]): number {
    if (performance.length < 2) return 0;
    
    const scores = performance.map(p => p.score);
    const trend = scores.slice(-5).reduce((sum, score, index) => {
      if (index === 0) return 0;
      return sum + (score - scores[index - 1]);
    }, 0) / (scores.length - 1);
    
    return Math.max(-0.1, Math.min(0.1, trend));
  }

  private analyzeDifficultyAdaptation(performance: ExercisePerformance[]): number {
    if (performance.length < 3) return 0;
    
    const recent = performance.slice(-3);
    const adaptation = recent.map((perf, index) => {
      if (index === 0) return 0;
      const prevDifficulty = this.mapDifficultyToNumber(recent[index - 1].difficulty);
      const currentDifficulty = this.mapDifficultyToNumber(perf.difficulty);
      const scoreChange = perf.score - recent[index - 1].score;
      
      return scoreChange / (currentDifficulty - prevDifficulty + 0.1);
    }).reduce((sum, val) => sum + val, 0) / (recent.length - 1);
    
    return Math.max(-0.2, Math.min(0.2, adaptation));
  }

  private calculateConfidence(performance: ExercisePerformance[], quantumState: any): number {
    if (performance.length === 0) return quantumState.coherence;
    
    const consistency = this.calculateConsistency(performance);
    const sampleSize = Math.min(1.0, performance.length / 20);
    const quantumConfidence = quantumState.coherence;
    
    return Math.min(0.95, (consistency * 0.5) + (sampleSize * 0.2) + (quantumConfidence * 0.3));
  }

  private calculateConsistency(performance: ExercisePerformance[]): number {
    if (performance.length < 2) return 0.5;
    
    const scores = performance.map(p => p.score);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    
    return Math.max(0, 1 - (stdDev * 2));
  }

  private generateRecommendations(performance: ExercisePerformance[], predictedScore: number, quantumState: any): string[] {
    const recommendations: string[] = [];
    
    // Recomendaciones basadas en puntaje predicho
    if (predictedScore < 0.6) {
      recommendations.push("Revisa los conceptos básicos antes de continuar");
      recommendations.push("Practica ejercicios de nivel 'Fácil' para fortalecer fundamentos");
    } else if (predictedScore < 0.8) {
      recommendations.push("Enfócate en ejercicios de aplicación práctica");
      recommendations.push("Revisa los errores comunes en tu área de estudio");
    } else {
      recommendations.push("Desafíate con ejercicios de mayor complejidad");
      recommendations.push("Ayuda a otros estudiantes para consolidar tu conocimiento");
    }
    
    // Recomendaciones basadas en estado cuántico
    if (quantumState.coherence < 0.7) {
      recommendations.push("El sistema detecta baja coherencia - enfócate en un tema a la vez");
    }
    if (quantumState.entanglement > 80) {
      recommendations.push("Alto entrelazamiento detectado - aprovecha las conexiones entre conceptos");
    }
    
    // Recomendaciones específicas basadas en rendimiento
    const weakAreas = this.identifyWeakAreas(performance);
    weakAreas.forEach(area => {
      recommendations.push(`Refuerza tu conocimiento en: ${area}`);
    });
    
    return recommendations.slice(0, 5);
  }

  private recommendNextExercise(userId: string, performance: ExercisePerformance[], quantumState: any): string {
    if (performance.length === 0) return "ejercicio_basico_001";
    
    const lastExercise = performance[performance.length - 1];
    const quantumFactor = quantumState.entanglement / 100;
    
    // Lógica para recomendar siguiente ejercicio basada en datos reales
    if (lastExercise.score < 0.6) {
      return `ejercicio_refuerzo_${lastExercise.bloomLevel.toLowerCase()}_${Math.floor(quantumFactor * 100)}`;
    } else if (lastExercise.score > 0.8) {
      return `ejercicio_desafio_${this.getNextBloomLevel(lastExercise.bloomLevel)}_${Math.floor(quantumFactor * 100)}`;
    } else {
      return `ejercicio_practica_${lastExercise.bloomLevel.toLowerCase()}_${Math.floor(quantumFactor * 100)}`;
    }
  }

  private calculateNeuralFrequency(predictedScore: number, quantumState: any): number {
    // Frecuencia neural basada en el puntaje predicho y estado cuántico
    const baseFrequency = 0.5 + (predictedScore * 0.5);
    const quantumFrequency = quantumState.coherence * 0.3;
    return Math.min(1.0, baseFrequency + quantumFrequency);
  }

  private generateLearningPath(userId: string, performance: ExercisePerformance[], quantumState: any): string[] {
    const path: string[] = [];
    const bloomLevels = ['RECORDAR', 'COMPRENDER', 'APLICAR', 'ANALIZAR', 'EVALUAR', 'CREAR'];
    
    // Generar camino de aprendizaje personalizado basado en datos reales
    performance.forEach(perf => {
      if (perf.score < 0.7) {
        path.push(`Reforzar ${perf.bloomLevel.toLowerCase()}`);
      }
    });
    
    // Agregar siguientes pasos basados en estado cuántico
    const currentLevel = this.getCurrentBloomLevel(performance);
    const nextLevels = bloomLevels.slice(bloomLevels.indexOf(currentLevel) + 1);
    nextLevels.forEach(level => {
      path.push(`Avanzar a ${level.toLowerCase()}`);
    });
    
    // Agregar recomendaciones cuánticas
    if (quantumState.coherence < 0.6) {
      path.push("Optimizar coherencia cuántica del aprendizaje");
    }
    if (quantumState.entanglement > 70) {
      path.push("Aprovechar entrelazamiento cuántico para conexiones");
    }
    
    return path.slice(0, 10);
  }

  private mapScoreToDifficulty(score: number): string {
    if (score < 0.4) return 'Fácil';
    if (score < 0.7) return 'Medio';
    if (score < 0.9) return 'Difícil';
    return 'Muy Difícil';
  }

  private recommendBloomLevel(performance: ExercisePerformance[], quantumState: any): string {
    if (performance.length === 0) return 'RECORDAR';
    
    const currentLevel = this.getCurrentBloomLevel(performance);
    const bloomLevels = ['RECORDAR', 'COMPRENDER', 'APLICAR', 'ANALIZAR', 'EVALUAR', 'CREAR'];
    const currentIndex = bloomLevels.indexOf(currentLevel);
    
    // Recomendar siguiente nivel si el actual está dominado
    const recentAtCurrentLevel = performance.filter(p => p.bloomLevel === currentLevel).slice(-3);
    const averageAtCurrent = recentAtCurrentLevel.reduce((sum, p) => sum + p.score, 0) / recentAtCurrentLevel.length;
    
    if (averageAtCurrent > 0.8 && currentIndex < bloomLevels.length - 1) {
      return bloomLevels[currentIndex + 1];
    }
    
    return currentLevel;
  }

  private updateUserModel(userId: string, performance: ExercisePerformance): void {
    const userModel = this.neuralModel.get(userId) || {
      totalExercises: 0,
      averageScore: 0,
      strongAreas: new Set<string>(),
      weakAreas: new Set<string>()
    };
    
    userModel.totalExercises++;
    userModel.averageScore = ((userModel.averageScore * (userModel.totalExercises - 1)) + performance.score) / userModel.totalExercises;
    
    if (performance.score > 0.8) {
      userModel.strongAreas.add(performance.bloomLevel);
    } else if (performance.score < 0.6) {
      userModel.weakAreas.add(performance.bloomLevel);
    }
    
    this.neuralModel.set(userId, userModel);
  }

  private mapDifficultyToNumber(difficulty: string): number {
    const difficultyMap: { [key: string]: number } = {
      'Fácil': 1,
      'Medio': 2,
      'Difícil': 3,
      'Muy Difícil': 4
    };
    return difficultyMap[difficulty] || 2;
  }

  private identifyWeakAreas(performance: ExercisePerformance[]): string[] {
    const areaScores: { [key: string]: number[] } = {};
    
    performance.forEach(perf => {
      if (!areaScores[perf.bloomLevel]) {
        areaScores[perf.bloomLevel] = [];
      }
      areaScores[perf.bloomLevel].push(perf.score);
    });
    
    const weakAreas: string[] = [];
    Object.entries(areaScores).forEach(([area, scores]) => {
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      if (average < 0.7) {
        weakAreas.push(area);
      }
    });
    
    return weakAreas;
  }

  private getCurrentBloomLevel(performance: ExercisePerformance[]): string {
    if (performance.length === 0) return 'RECORDAR';
    
    const recent = performance.slice(-5);
    const levelCounts: { [key: string]: number } = {};
    
    recent.forEach(perf => {
      levelCounts[perf.bloomLevel] = (levelCounts[perf.bloomLevel] || 0) + 1;
    });
    
    return Object.entries(levelCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  private getNextBloomLevel(currentLevel: string): string {
    const bloomLevels = ['RECORDAR', 'COMPRENDER', 'APLICAR', 'ANALIZAR', 'EVALUAR', 'CREAR'];
    const currentIndex = bloomLevels.indexOf(currentLevel);
    return currentIndex < bloomLevels.length - 1 ? bloomLevels[currentIndex + 1] : currentLevel;
  }
}
