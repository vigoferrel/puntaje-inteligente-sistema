
interface NavigationRecommendation {
  targetDimension: string;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  confidence: number;
  estimatedBenefit: number;
}

interface UserContext {
  currentDimension: string;
  timeSpent: Record<string, number>;
  performance: Record<string, number>;
  goals: string[];
  preferences: {
    studyTime: string;
    difficulty: string;
    focusAreas: string[];
  };
}

interface NavigationPath {
  sequence: string[];
  totalEstimatedTime: number;
  expectedOutcome: string;
  adaptivePoints: string[];
}

class IntelligentNavigationSystem {
  private static instance: IntelligentNavigationSystem;
  private userContext: UserContext | null = null;
  private navigationHistory: Array<{
    from: string;
    to: string;
    timestamp: number;
    success: boolean;
  }> = [];

  static getInstance(): IntelligentNavigationSystem {
    if (!IntelligentNavigationSystem.instance) {
      IntelligentNavigationSystem.instance = new IntelligentNavigationSystem();
    }
    return IntelligentNavigationSystem.instance;
  }

  updateUserContext(context: Partial<UserContext>): void {
    this.userContext = { ...this.userContext, ...context } as UserContext;
    console.log('🧭 Contexto de usuario actualizado:', this.userContext);
  }

  generateRecommendations(currentDimension: string): NavigationRecommendation[] {
    if (!this.userContext) {
      return this.getDefaultRecommendations(currentDimension);
    }

    const recommendations: NavigationRecommendation[] = [];

    // Análisis basado en performance
    const weakDimensions = this.identifyWeakDimensions();
    weakDimensions.forEach(dimension => {
      recommendations.push({
        targetDimension: dimension,
        reason: 'Área de mejora identificada basada en tu performance',
        priority: 'high',
        confidence: 0.85,
        estimatedBenefit: 0.75
      });
    });

    // Análisis de secuencia óptima
    const nextInSequence = this.getOptimalNextDimension(currentDimension);
    if (nextInSequence) {
      recommendations.push({
        targetDimension: nextInSequence,
        reason: 'Siguiente paso recomendado en tu ruta de aprendizaje',
        priority: 'medium',
        confidence: 0.9,
        estimatedBenefit: 0.8
      });
    }

    // Análisis temporal
    const timeBasedRecommendation = this.getTimeBasedRecommendation();
    if (timeBasedRecommendation) {
      recommendations.push({
        targetDimension: timeBasedRecommendation,
        reason: 'Optimizado para tu horario de estudio preferido',
        priority: 'medium',
        confidence: 0.7,
        estimatedBenefit: 0.6
      });
    }

    // Análisis de objetivos
    const goalBasedRecommendations = this.getGoalBasedRecommendations();
    recommendations.push(...goalBasedRecommendations);

    // Ordenar por prioridad y confianza
    return recommendations
      .sort((a, b) => {
        const priorityScore = this.getPriorityScore(b.priority) - this.getPriorityScore(a.priority);
        if (priorityScore !== 0) return priorityScore;
        return b.confidence - a.confidence;
      })
      .slice(0, 5); // Top 5 recomendaciones
  }

  generateAdaptivePath(startDimension: string, targetGoals: string[]): NavigationPath {
    const dimensionMap = this.buildDimensionMap();
    const userPerformance = this.userContext?.performance || {};
    
    // Algoritmo de path-finding adaptativo
    const sequence = this.findOptimalSequence(startDimension, targetGoals, userPerformance);
    
    const totalEstimatedTime = sequence.reduce((total, dimension) => {
      return total + this.getEstimatedTimeForDimension(dimension);
    }, 0);

    const expectedOutcome = this.predictOutcome(sequence, userPerformance);
    const adaptivePoints = this.identifyAdaptivePoints(sequence);

    return {
      sequence,
      totalEstimatedTime,
      expectedOutcome,
      adaptivePoints
    };
  }

  recordNavigation(from: string, to: string, success: boolean): void {
    this.navigationHistory.push({
      from,
      to,
      timestamp: Date.now(),
      success
    });

    // Mantener solo los últimos 100 registros
    if (this.navigationHistory.length > 100) {
      this.navigationHistory = this.navigationHistory.slice(-100);
    }

    // Actualizar modelo de recomendaciones basado en el éxito
    this.updateRecommendationModel(from, to, success);
  }

  private identifyWeakDimensions(): string[] {
    if (!this.userContext?.performance) return [];

    const threshold = 70; // Umbral de performance
    return Object.entries(this.userContext.performance)
      .filter(([_, score]) => score < threshold)
      .map(([dimension, _]) => dimension)
      .slice(0, 3); // Top 3 áreas débiles
  }

  private getOptimalNextDimension(currentDimension: string): string | null {
    const sequenceMap: Record<string, string[]> = {
      'neural_command': ['cognitive_resonance', 'learning_velocity'],
      'cognitive_resonance': ['pattern_recognition', 'strategic_thinking'],
      'learning_velocity': ['adaptive_capacity', 'knowledge_depth'],
      'battle_mode': ['achievement_system', 'paes_simulation'],
      'vocational_prediction': ['educational_universe', 'settings_control'],
      'paes_simulation': ['battle_mode', 'achievement_system']
    };

    const nextOptions = sequenceMap[currentDimension];
    if (!nextOptions || nextOptions.length === 0) return null;

    // Seleccionar basado en performance del usuario
    const userPerformance = this.userContext?.performance || {};
    return nextOptions.reduce((best, option) => {
      const currentScore = userPerformance[option] || 50;
      const bestScore = userPerformance[best] || 50;
      return currentScore < bestScore ? option : best;
    });
  }

  private getTimeBasedRecommendation(): string | null {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 9 && hour <= 12) {
      return 'cognitive_resonance'; // Mañana - alta concentración
    } else if (hour >= 14 && hour <= 17) {
      return 'paes_simulation'; // Tarde - práctica activa
    } else if (hour >= 19 && hour <= 21) {
      return 'battle_mode'; // Noche - gamificación
    }

    return null;
  }

  private getGoalBasedRecommendations(): NavigationRecommendation[] {
    const goals = this.userContext?.goals || [];
    const recommendations: NavigationRecommendation[] = [];

    goals.forEach(goal => {
      const dimensionMapping: Record<string, string> = {
        'improve_paes_score': 'paes_simulation',
        'competitive_study': 'battle_mode',
        'career_guidance': 'vocational_prediction',
        'skill_mastery': 'achievement_system',
        'personalized_learning': 'neural_command'
      };

      const targetDimension = dimensionMapping[goal];
      if (targetDimension) {
        recommendations.push({
          targetDimension,
          reason: `Alineado con tu objetivo: ${goal}`,
          priority: 'high',
          confidence: 0.8,
          estimatedBenefit: 0.85
        });
      }
    });

    return recommendations;
  }

  private getDefaultRecommendations(currentDimension: string): NavigationRecommendation[] {
    const defaultSequence = [
      'neural_command',
      'cognitive_resonance',
      'paes_simulation',
      'battle_mode',
      'achievement_system'
    ];

    const currentIndex = defaultSequence.indexOf(currentDimension);
    const nextDimension = currentIndex >= 0 && currentIndex < defaultSequence.length - 1 
      ? defaultSequence[currentIndex + 1] 
      : defaultSequence[0];

    return [{
      targetDimension: nextDimension,
      reason: 'Siguiente paso en la secuencia recomendada',
      priority: 'medium',
      confidence: 0.6,
      estimatedBenefit: 0.7
    }];
  }

  private buildDimensionMap(): Record<string, string[]> {
    return {
      'neural_command': ['cognitive_resonance', 'learning_velocity', 'strategic_thinking'],
      'cognitive_resonance': ['pattern_recognition', 'adaptive_capacity'],
      'learning_velocity': ['knowledge_depth', 'conceptual_mastery'],
      'battle_mode': ['achievement_system', 'gamification_engagement'],
      'paes_simulation': ['analytical_precision', 'prediction_accuracy'],
      'vocational_prediction': ['career_alignment', 'educational_universe'],
      'achievement_system': ['motivation', 'progress_tracking'],
      'settings_control': ['personalization', 'system_optimization']
    };
  }

  private findOptimalSequence(start: string, goals: string[], performance: Record<string, number>): string[] {
    // Implementación simplificada de algoritmo de path-finding
    const visited = new Set<string>();
    const sequence = [start];
    visited.add(start);

    while (sequence.length < 6) { // Máximo 6 dimensiones en secuencia
      const current = sequence[sequence.length - 1];
      const options = this.getConnectedDimensions(current).filter(d => !visited.has(d));
      
      if (options.length === 0) break;

      // Seleccionar la mejor opción basada en performance y objetivos
      const best = options.reduce((bestOption, option) => {
        const score = this.calculateDimensionScore(option, goals, performance);
        const bestScore = this.calculateDimensionScore(bestOption, goals, performance);
        return score > bestScore ? option : bestOption;
      });

      sequence.push(best);
      visited.add(best);
    }

    return sequence;
  }

  private getConnectedDimensions(dimension: string): string[] {
    const connections = this.buildDimensionMap();
    return connections[dimension] || [];
  }

  private calculateDimensionScore(dimension: string, goals: string[], performance: Record<string, number>): number {
    let score = 0;

    // Penalizar dimensiones con alta performance (ya dominadas)
    const performanceScore = performance[dimension] || 50;
    score += (100 - performanceScore) * 0.3;

    // Bonificar dimensiones alineadas con objetivos
    goals.forEach(goal => {
      if (this.isDimensionAlignedWithGoal(dimension, goal)) {
        score += 25;
      }
    });

    // Bonificar por diversidad
    score += Math.random() * 10;

    return score;
  }

  private isDimensionAlignedWithGoal(dimension: string, goal: string): boolean {
    const alignments: Record<string, string[]> = {
      'improve_paes_score': ['paes_simulation', 'analytical_precision'],
      'competitive_study': ['battle_mode', 'achievement_system'],
      'career_guidance': ['vocational_prediction', 'educational_universe'],
      'skill_mastery': ['cognitive_resonance', 'adaptive_capacity']
    };

    return alignments[goal]?.includes(dimension) || false;
  }

  private getEstimatedTimeForDimension(dimension: string): number {
    const timeEstimates: Record<string, number> = {
      'neural_command': 15,
      'cognitive_resonance': 25,
      'learning_velocity': 20,
      'battle_mode': 30,
      'paes_simulation': 45,
      'vocational_prediction': 35,
      'achievement_system': 20,
      'settings_control': 10
    };

    return timeEstimates[dimension] || 20;
  }

  private predictOutcome(sequence: string[], performance: Record<string, number>): string {
    const avgPerformance = Object.values(performance).reduce((sum, val) => sum + val, 0) / Object.values(performance).length || 70;
    
    if (avgPerformance > 85) {
      return 'Excelente progreso esperado con dominio avanzado';
    } else if (avgPerformance > 70) {
      return 'Buen progreso con mejoras significativas';
    } else {
      return 'Progreso gradual con fundamentos sólidos';
    }
  }

  private identifyAdaptivePoints(sequence: string[]): string[] {
    // Identificar puntos donde el sistema debería adaptarse
    return sequence.filter((_, index) => index % 2 === 1); // Cada segunda dimensión
  }

  private updateRecommendationModel(from: string, to: string, success: boolean): void {
    // Actualizar modelo interno basado en el éxito de navegación
    console.log(`📊 Modelo actualizado: ${from} -> ${to} (${success ? 'éxito' : 'fallo'})`);
  }

  private getPriorityScore(priority: string): number {
    const scores = { urgent: 4, high: 3, medium: 2, low: 1 };
    return scores[priority as keyof typeof scores] || 1;
  }

  getNavigationHistory() {
    return [...this.navigationHistory];
  }

  getNavigationStats() {
    const total = this.navigationHistory.length;
    const successful = this.navigationHistory.filter(nav => nav.success).length;
    
    return {
      total,
      successful,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      averageSessionTime: this.calculateAverageSessionTime()
    };
  }

  private calculateAverageSessionTime(): number {
    if (this.navigationHistory.length < 2) return 0;
    
    const sessions = [];
    let sessionStart = this.navigationHistory[0].timestamp;
    
    for (let i = 1; i < this.navigationHistory.length; i++) {
      const current = this.navigationHistory[i];
      const timeDiff = current.timestamp - sessionStart;
      
      if (timeDiff > 300000) { // 5 minutos = nueva sesión
        sessions.push(timeDiff);
        sessionStart = current.timestamp;
      }
    }
    
    return sessions.length > 0 ? sessions.reduce((sum, time) => sum + time, 0) / sessions.length / 1000 / 60 : 0;
  }
}

export const intelligentNav = IntelligentNavigationSystem.getInstance();
