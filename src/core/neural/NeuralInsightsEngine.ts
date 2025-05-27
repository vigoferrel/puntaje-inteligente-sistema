
/**
 * NEURAL INSIGHTS ENGINE v2.0
 * Motor de detección de patrones de aprendizaje y adaptación de UI
 */

import { neuralTelemetryService, TelemetryMetrics } from './NeuralTelemetryService';
import { predictiveAnalyticsEngine, AdaptiveRecommendation } from './PredictiveAnalyticsEngine';
import { autoHealingSystem } from './AutoHealingSystem';

interface LearningPattern {
  id: string;
  pattern_type: 'visual' | 'kinesthetic' | 'auditory' | 'reading' | 'mixed';
  confidence: number;
  detected_behaviors: string[];
  adaptation_suggestions: string[];
  effectiveness_score: number;
}

interface UIAdaptation {
  element_type: string;
  adaptation_type: 'layout' | 'color' | 'size' | 'interaction' | 'content';
  original_value: any;
  adapted_value: any;
  reason: string;
  applied: boolean;
  effectiveness: number;
}

interface NeuralInsight {
  id: string;
  type: 'learning_optimization' | 'performance_insight' | 'behavior_pattern' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  suggested_actions: string[];
  data: Record<string, any>;
  timestamp: number;
}

interface PersonalizedState {
  learning_style: LearningPattern | null;
  ui_adaptations: UIAdaptation[];
  generated_insights: NeuralInsight[];
  optimization_level: number;
  personalization_score: number;
  last_adaptation: number;
}

class NeuralInsightsEngineCore {
  private static instance: NeuralInsightsEngineCore;
  private state: PersonalizedState = {
    learning_style: null,
    ui_adaptations: [],
    generated_insights: [],
    optimization_level: 0,
    personalization_score: 0,
    last_adaptation: 0
  };

  private behaviorHistory: Map<string, number[]> = new Map();
  private adaptationRules = new Map<string, (data: any) => UIAdaptation[]>();
  private insightGenerators = new Map<string, (data: any) => NeuralInsight[]>();

  static getInstance(): NeuralInsightsEngineCore {
    if (!NeuralInsightsEngineCore.instance) {
      NeuralInsightsEngineCore.instance = new NeuralInsightsEngineCore();
    }
    return NeuralInsightsEngineCore.instance;
  }

  private constructor() {
    this.initializeInsightsEngine();
    this.registerAdaptationRules();
    this.registerInsightGenerators();
    this.startContinuousLearning();
  }

  private initializeInsightsEngine(): void {
    // Suscribirse a métricas de telemetría
    neuralTelemetryService.subscribe((metrics) => {
      this.processMetricsForInsights(metrics);
    });

    console.log('🧠 Neural Insights Engine initialized');
  }

  private registerAdaptationRules(): void {
    // Regla: Adaptación por engagement bajo
    this.adaptationRules.set('low_engagement', (data) => {
      const adaptations: UIAdaptation[] = [];
      
      if (data.engagement < 50) {
        adaptations.push({
          element_type: 'buttons',
          adaptation_type: 'color',
          original_value: 'default',
          adapted_value: 'vibrant',
          reason: 'Increase visual appeal for low engagement',
          applied: false,
          effectiveness: 0
        });

        adaptations.push({
          element_type: 'animations',
          adaptation_type: 'interaction',
          original_value: 'subtle',
          adapted_value: 'prominent',
          reason: 'Add more interactive feedback',
          applied: false,
          effectiveness: 0
        });
      }

      return adaptations;
    });

    // Regla: Adaptación por velocidad de lectura
    this.adaptationRules.set('reading_speed', (data) => {
      const adaptations: UIAdaptation[] = [];
      
      if (data.reading_speed < 200) { // WPM bajo
        adaptations.push({
          element_type: 'text',
          adaptation_type: 'size',
          original_value: '14px',
          adapted_value: '16px',
          reason: 'Larger text for slower readers',
          applied: false,
          effectiveness: 0
        });

        adaptations.push({
          element_type: 'content',
          adaptation_type: 'layout',
          original_value: 'compact',
          adapted_value: 'spacious',
          reason: 'More whitespace for better readability',
          applied: false,
          effectiveness: 0
        });
      }

      return adaptations;
    });

    // Regla: Adaptación por estilo de aprendizaje visual
    this.adaptationRules.set('visual_learner', (data) => {
      const adaptations: UIAdaptation[] = [];
      
      if (data.visual_preference > 0.7) {
        adaptations.push({
          element_type: 'content',
          adaptation_type: 'content',
          original_value: 'text_heavy',
          adapted_value: 'visual_rich',
          reason: 'More visual elements for visual learners',
          applied: false,
          effectiveness: 0
        });

        adaptations.push({
          element_type: 'navigation',
          adaptation_type: 'layout',
          original_value: 'text_menu',
          adapted_value: 'icon_menu',
          reason: 'Icon-based navigation for visual preference',
          applied: false,
          effectiveness: 0
        });
      }

      return adaptations;
    });
  }

  private registerInsightGenerators(): void {
    // Generador: Insights de performance
    this.insightGenerators.set('performance_insights', (data) => {
      const insights: NeuralInsight[] = [];
      
      if (data.session_quality < 60) {
        insights.push({
          id: `perf_${Date.now()}`,
          type: 'performance_insight',
          title: 'Oportunidad de Optimización',
          description: `Tu calidad de sesión está en ${data.session_quality}%. Podemos mejorarlo.`,
          confidence: 0.85,
          impact_level: 'medium',
          actionable: true,
          suggested_actions: [
            'Reducir contenido en pantalla',
            'Aumentar tiempo entre ejercicios',
            'Activar modo enfoque'
          ],
          data: { current_quality: data.session_quality, target_quality: 80 },
          timestamp: Date.now()
        });
      }

      if (data.learning_effectiveness > 80) {
        insights.push({
          id: `learning_${Date.now()}`,
          type: 'learning_optimization',
          title: 'Aprendizaje Excepcional',
          description: 'Tu efectividad de aprendizaje es excelente. Considera aumentar la dificultad.',
          confidence: 0.92,
          impact_level: 'high',
          actionable: true,
          suggested_actions: [
            'Desbloquear contenido avanzado',
            'Acelerar ritmo de estudio',
            'Explorar temas complementarios'
          ],
          data: { effectiveness: data.learning_effectiveness },
          timestamp: Date.now()
        });
      }

      return insights;
    });

    // Generador: Patrones de comportamiento
    this.insightGenerators.set('behavior_patterns', (data) => {
      const insights: NeuralInsight[] = [];
      
      // Analizar patrones de tiempo de uso
      const currentHour = new Date().getHours();
      const hourlyUsage = this.behaviorHistory.get('hourly_usage') || [];
      
      if (hourlyUsage.length > 7) { // Al menos una semana de datos
        const avgUsageThisHour = hourlyUsage
          .filter((_, index) => index % 24 === currentHour)
          .reduce((sum, val) => sum + val, 0) / Math.floor(hourlyUsage.length / 24);
        
        if (avgUsageThisHour > 30) { // 30 minutos promedio
          insights.push({
            id: `pattern_${Date.now()}`,
            type: 'behavior_pattern',
            title: 'Horario Óptimo Detectado',
            description: `Las ${currentHour}:00 es uno de tus mejores horarios de estudio.`,
            confidence: 0.78,
            impact_level: 'medium',
            actionable: true,
            suggested_actions: [
              'Programar sesiones intensivas en este horario',
              'Configurar recordatorios automáticos',
              'Priorizar contenido difícil en este horario'
            ],
            data: { optimal_hour: currentHour, avg_usage: avgUsageThisHour },
            timestamp: Date.now()
          });
        }
      }

      return insights;
    });

    // Generador: Recomendaciones inteligentes
    this.insightGenerators.set('smart_recommendations', (data) => {
      const insights: NeuralInsight[] = [];
      const systemHealth = autoHealingSystem.getSystemHealth();
      
      if (systemHealth.overall_score < 80) {
        insights.push({
          id: `system_${Date.now()}`,
          type: 'recommendation',
          title: 'Optimización del Sistema',
          description: 'El sistema detecta oportunidades de mejora en tu experiencia.',
          confidence: 0.88,
          impact_level: 'high',
          actionable: true,
          suggested_actions: [
            'Ejecutar limpieza automática',
            'Reiniciar componentes lentos',
            'Optimizar configuración personal'
          ],
          data: { system_score: systemHealth.overall_score },
          timestamp: Date.now()
        });
      }

      return insights;
    });
  }

  private startContinuousLearning(): void {
    setInterval(() => {
      this.detectLearningPatterns();
      this.generatePersonalizedInsights();
      this.updatePersonalizationScore();
      this.applyBestAdaptations();
    }, 20000); // Cada 20 segundos
  }

  private processMetricsForInsights(metrics: TelemetryMetrics): void {
    // Registrar métricas para análisis de patrones
    this.recordBehaviorMetrics(metrics);
    
    // Detectar necesidad de adaptaciones
    this.evaluateAdaptationNeeds(metrics);
    
    // Generar insights basados en métricas actuales
    this.generateInsightsFromMetrics(metrics);
  }

  private recordBehaviorMetrics(metrics: TelemetryMetrics): void {
    const currentHour = new Date().getHours();
    
    // Registrar uso por hora
    const hourlyUsage = this.behaviorHistory.get('hourly_usage') || [];
    hourlyUsage[currentHour] = (hourlyUsage[currentHour] || 0) + 1;
    this.behaviorHistory.set('hourly_usage', hourlyUsage);
    
    // Registrar engagement histórico
    const engagementHistory = this.behaviorHistory.get('engagement') || [];
    engagementHistory.push(metrics.real_time_engagement);
    if (engagementHistory.length > 100) {
      engagementHistory.splice(0, engagementHistory.length - 100);
    }
    this.behaviorHistory.set('engagement', engagementHistory);
    
    // Registrar efectividad de aprendizaje
    const learningHistory = this.behaviorHistory.get('learning') || [];
    learningHistory.push(metrics.learning_effectiveness);
    if (learningHistory.length > 50) {
      learningHistory.splice(0, learningHistory.length - 50);
    }
    this.behaviorHistory.set('learning', learningHistory);
  }

  private detectLearningPatterns(): void {
    const engagementData = this.behaviorHistory.get('engagement') || [];
    const learningData = this.behaviorHistory.get('learning') || [];
    
    if (engagementData.length < 10) return;

    // Analizar preferencias de interacción
    const avgEngagement = engagementData.reduce((sum, val) => sum + val, 0) / engagementData.length;
    const engagementVariability = this.calculateVariability(engagementData);
    
    let detectedPattern: LearningPattern | null = null;

    // Patrón visual: engagement alto con poca variabilidad
    if (avgEngagement > 70 && engagementVariability < 15) {
      detectedPattern = {
        id: `pattern_visual_${Date.now()}`,
        pattern_type: 'visual',
        confidence: 0.82,
        detected_behaviors: [
          'consistent_high_engagement',
          'stable_interaction_patterns',
          'preference_for_visual_elements'
        ],
        adaptation_suggestions: [
          'increase_visual_content',
          'add_interactive_diagrams',
          'enhance_color_coding'
        ],
        effectiveness_score: avgEngagement
      };
    }
    
    // Patrón kinestésico: engagement variable pero alto en general
    else if (avgEngagement > 60 && engagementVariability > 25) {
      detectedPattern = {
        id: `pattern_kinesthetic_${Date.now()}`,
        pattern_type: 'kinesthetic',
        confidence: 0.75,
        detected_behaviors: [
          'variable_engagement_levels',
          'preference_for_interaction',
          'responds_to_dynamic_content'
        ],
        adaptation_suggestions: [
          'add_interactive_exercises',
          'increase_hands_on_activities',
          'provide_immediate_feedback'
        ],
        effectiveness_score: avgEngagement
      };
    }

    if (detectedPattern && detectedPattern.confidence > 0.7) {
      this.state.learning_style = detectedPattern;
      console.log('🎯 Learning pattern detected:', detectedPattern.pattern_type);
    }
  }

  private calculateVariability(data: number[]): number {
    if (data.length === 0) return 0;
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  private evaluateAdaptationNeeds(metrics: TelemetryMetrics): void {
    const adaptationData = {
      engagement: metrics.real_time_engagement,
      learning_effectiveness: metrics.learning_effectiveness,
      neural_coherence: metrics.neural_coherence,
      reading_speed: 250, // Simulated - could be measured
      visual_preference: this.state.learning_style?.pattern_type === 'visual' ? 0.8 : 0.5
    };

    // Evaluar cada regla de adaptación
    this.adaptationRules.forEach((rule, ruleName) => {
      const newAdaptations = rule(adaptationData);
      
      newAdaptations.forEach(adaptation => {
        // Solo agregar si no existe una adaptación similar
        const exists = this.state.ui_adaptations.some(existing => 
          existing.element_type === adaptation.element_type &&
          existing.adaptation_type === adaptation.adaptation_type
        );
        
        if (!exists) {
          this.state.ui_adaptations.push(adaptation);
          console.log('🎨 New UI adaptation suggested:', adaptation);
        }
      });
    });
  }

  private generatePersonalizedInsights(): void {
    const currentMetrics = neuralTelemetryService.getCurrentMetrics();
    const systemHealth = autoHealingSystem.getSystemHealth();
    
    const insightData = {
      ...currentMetrics,
      system_health: systemHealth.overall_score,
      behavior_history: Object.fromEntries(this.behaviorHistory)
    };

    // Generar insights de cada generador
    this.insightGenerators.forEach((generator, generatorName) => {
      const newInsights = generator(insightData);
      
      newInsights.forEach(insight => {
        // Evitar duplicados recientes
        const isDuplicate = this.state.generated_insights.some(existing =>
          existing.type === insight.type &&
          existing.timestamp > Date.now() - 300000 // 5 minutos
        );
        
        if (!isDuplicate) {
          this.state.generated_insights.push(insight);
          console.log('💡 New insight generated:', insight.title);
        }
      });
    });

    // Limpiar insights antiguos
    this.cleanupOldInsights();
  }

  private generateInsightsFromMetrics(metrics: TelemetryMetrics): void {
    // Insight específico para métricas actuales
    if (metrics.adaptive_intelligence_score > 85) {
      const insight: NeuralInsight = {
        id: `adaptive_${Date.now()}`,
        type: 'learning_optimization',
        title: 'Inteligencia Adaptativa Excepcional',
        description: 'Tu capacidad de adaptación está en el 15% superior. Considera desafíos más complejos.',
        confidence: 0.94,
        impact_level: 'high',
        actionable: true,
        suggested_actions: [
          'Acceder a contenido de nivel experto',
          'Participar en desafíos avanzados',
          'Mentorear a otros estudiantes'
        ],
        data: { intelligence_score: metrics.adaptive_intelligence_score },
        timestamp: Date.now()
      };
      
      this.state.generated_insights.push(insight);
    }
  }

  private updatePersonalizationScore(): void {
    let score = 0;
    
    // Puntuación por patrón de aprendizaje detectado
    if (this.state.learning_style) {
      score += this.state.learning_style.confidence * 30;
    }
    
    // Puntuación por adaptaciones aplicadas
    const appliedAdaptations = this.state.ui_adaptations.filter(a => a.applied);
    score += Math.min(40, appliedAdaptations.length * 8);
    
    // Puntuación por insights generados
    score += Math.min(20, this.state.generated_insights.length * 2);
    
    // Puntuación por efectividad de adaptaciones
    const avgEffectiveness = appliedAdaptations.length > 0
      ? appliedAdaptations.reduce((sum, a) => sum + a.effectiveness, 0) / appliedAdaptations.length
      : 0;
    score += avgEffectiveness * 10;
    
    this.state.personalization_score = Math.round(score);
    this.state.optimization_level = Math.round(score / 10);
  }

  private applyBestAdaptations(): void {
    // Aplicar automáticamente adaptaciones de bajo riesgo
    const safeAdaptations = this.state.ui_adaptations.filter(
      a => !a.applied && ['color', 'size'].includes(a.adaptation_type)
    );
    
    safeAdaptations.slice(0, 2).forEach(adaptation => {
      this.applyUIAdaptation(adaptation);
    });
  }

  private applyUIAdaptation(adaptation: UIAdaptation): void {
    console.log(`🎨 Applying UI adaptation: ${adaptation.reason}`);
    
    // Simular aplicación de adaptación
    adaptation.applied = true;
    adaptation.effectiveness = 0.7 + Math.random() * 0.3; // 70-100% effectiveness
    this.state.last_adaptation = Date.now();
    
    // En implementación real, aquí se modificaría el DOM o estado de React
    // document.documentElement.style.setProperty(`--${adaptation.element_type}-${adaptation.adaptation_type}`, adaptation.adapted_value);
    
    // Notificar aplicación
    neuralTelemetryService.captureNeuralEvent('performance', {
      ui_adaptation: {
        type: adaptation.adaptation_type,
        element: adaptation.element_type,
        reason: adaptation.reason,
        effectiveness: adaptation.effectiveness
      }
    });
  }

  private cleanupOldInsights(): void {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 horas
    this.state.generated_insights = this.state.generated_insights.filter(
      insight => insight.timestamp > cutoff
    );
  }

  // API pública
  public getCurrentInsights(): NeuralInsight[] {
    return this.state.generated_insights.slice(-10); // Últimos 10
  }

  public getLearningStyle(): LearningPattern | null {
    return this.state.learning_style;
  }

  public getPersonalizationState(): PersonalizedState {
    return { ...this.state };
  }

  public getActiveAdaptations(): UIAdaptation[] {
    return this.state.ui_adaptations.filter(a => a.applied);
  }

  public forcePatternDetection(): void {
    this.detectLearningPatterns();
    this.generatePersonalizedInsights();
  }

  public registerCustomInsightGenerator(
    name: string, 
    generator: (data: any) => NeuralInsight[]
  ): void {
    this.insightGenerators.set(name, generator);
    console.log(`📋 Registered custom insight generator: ${name}`);
  }

  public registerCustomAdaptationRule(
    name: string,
    rule: (data: any) => UIAdaptation[]
  ): void {
    this.adaptationRules.set(name, rule);
    console.log(`🎨 Registered custom adaptation rule: ${name}`);
  }
}

export const neuralInsightsEngine = NeuralInsightsEngineCore.getInstance();
export type { LearningPattern, UIAdaptation, NeuralInsight, PersonalizedState };
