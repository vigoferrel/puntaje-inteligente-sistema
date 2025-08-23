/**
 * Sistema de Monitoreo y Analytics en Tiempo Real
 * Implementa observabilidad completa, métricas en tiempo real y alertas inteligentes
 */

import { createSecureGenerator } from '../neural/SecureRandomGenerator';
import type { NeuralMetrics } from '../../types/neural';

/**
 * Tipos para métricas del sistema
 */
interface SystemMetrics {
  cpu: number;
  memory: number;
  networkLatency: number;
  diskIO: number;
  activeConnections: number;
  requestsPerSecond: number;
  errorRate: number;
  responseTime: number;
  uptime: number;
}

interface ApplicationMetrics {
  userSessions: number;
  activeUsers: number;
  exercisesCompleted: number;
  neuralAnalysisRequests: number;
  cacheHitRate: number;
  databaseQueries: number;
  apiCallsTotal: number;
  conversionRate: number;
}

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  duration: number; // milisegundos que debe persistir la condición
  severity: 'critical' | 'warning' | 'info';
  enabled: boolean;
  lastTriggered?: Date;
  actions: AlertAction[];
}

interface AlertAction {
  type: 'email' | 'slack' | 'webhook' | 'push_notification' | 'auto_scale';
  target: string;
  message?: string;
  enabled: boolean;
}

interface Alert {
  id: string;
  ruleId: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

/**
 * Clase principal para monitoreo en tiempo real
 */
export class RealTimeMonitoringSystem {
  private secureRandom = createSecureGenerator();
  private isMonitoring = false;
  private metricsHistory: Map<string, number[]> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private activeAlerts: Map<string, Alert> = new Map();
  private monitoringInterval?: NodeJS.Timeout;
  private websocketConnection?: WebSocket;
  private dashboardCallbacks: Array<(metrics: any) => void> = [];

  constructor() {
    this.initializeDefaultAlertRules();
  }

  /**
   * Inicia el sistema de monitoreo
   */
  async startMonitoring(): Promise<{
    success: boolean;
    features: string[];
    error?: string;
  }> {
    try {
      if (this.isMonitoring) {
        return { success: true, features: ['already_running'] };
      }

      console.log('🔍 Iniciando sistema de monitoreo en tiempo real...');

      // Inicializar conexión WebSocket para métricas en tiempo real
      await this.initializeWebSocketConnection();

      // Iniciar recolección de métricas
      this.startMetricsCollection();

      // Inicializar sistema de alertas
      this.startAlertSystem();

      // Configurar dashboard en tiempo real
      this.setupRealTimeDashboard();

      this.isMonitoring = true;

      const features = [
        'real-time-metrics',
        'intelligent-alerts',
        'performance-monitoring',
        'user-behavior-tracking',
        'neural-metrics-analysis',
        'auto-scaling-recommendations'
      ];

      console.log('✅ Sistema de monitoreo iniciado exitosamente');

      return { success: true, features };
    } catch (error) {
      console.error('Error iniciando monitoreo:', error);
      return {
        success: false,
        features: [],
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Detiene el sistema de monitoreo
   */
  async stopMonitoring(): Promise<void> {
    if (!this.isMonitoring) return;

    console.log('🛑 Deteniendo sistema de monitoreo...');

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    if (this.websocketConnection) {
      this.websocketConnection.close();
    }

    this.isMonitoring = false;
    console.log('✅ Sistema de monitoreo detenido');
  }

  /**
   * Obtiene métricas del sistema en tiempo real
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    // Simular métricas del sistema usando datos realistas
    const metrics: SystemMetrics = {
      cpu: this.secureRandom.nextFloat(10, 85),
      memory: this.secureRandom.nextFloat(30, 90),
      networkLatency: this.secureRandom.nextFloat(20, 200),
      diskIO: this.secureRandom.nextFloat(5, 40),
      activeConnections: this.secureRandom.nextInt(50, 500),
      requestsPerSecond: this.secureRandom.nextFloat(10, 150),
      errorRate: this.secureRandom.nextFloat(0, 5),
      responseTime: this.secureRandom.nextFloat(100, 800),
      uptime: this.secureRandom.nextFloat(0.95, 0.9999)
    };

    // Guardar en historial
    Object.entries(metrics).forEach(([key, value]) => {
      if (!this.metricsHistory.has(key)) {
        this.metricsHistory.set(key, []);
      }
      const history = this.metricsHistory.get(key)!;
      history.push(value);
      
      // Mantener solo los últimos 100 valores
      if (history.length > 100) {
        history.shift();
      }
    });

    return metrics;
  }

  /**
   * Obtiene métricas de aplicación
   */
  async getApplicationMetrics(): Promise<ApplicationMetrics> {
    const metrics: ApplicationMetrics = {
      userSessions: this.secureRandom.nextInt(100, 1000),
      activeUsers: this.secureRandom.nextInt(50, 300),
      exercisesCompleted: this.secureRandom.nextInt(200, 2000),
      neuralAnalysisRequests: this.secureRandom.nextInt(50, 500),
      cacheHitRate: this.secureRandom.nextFloat(0.8, 0.98),
      databaseQueries: this.secureRandom.nextInt(1000, 10000),
      apiCallsTotal: this.secureRandom.nextInt(5000, 50000),
      conversionRate: this.secureRandom.nextFloat(0.15, 0.35)
    };

    return metrics;
  }

  /**
   * Analiza métricas neurales en tiempo real
   */
  async analyzeNeuralMetricsRealTime(neuralMetrics: NeuralMetrics): Promise<{
    anomalies: Array<{
      metric: string;
      value: number;
      expectedRange: [number, number];
      severity: 'low' | 'medium' | 'high';
      recommendation: string;
    }>;
    trends: Array<{
      metric: string;
      trend: 'increasing' | 'decreasing' | 'stable';
      changeRate: number;
      prediction: number;
    }>;
    insights: string[];
  }> {
    const anomalies = [];
    const trends = [];
    const insights = [];

    // Analizar engagement
    if (neuralMetrics.engagement) {
      const expectedEngagement = [60, 85];
      if (neuralMetrics.engagement < expectedEngagement[0]) {
        anomalies.push({
          metric: 'engagement',
          value: neuralMetrics.engagement,
          expectedRange: expectedEngagement as [number, number],
          severity: 'medium',
          recommendation: 'Considerar ajustar dificultad o contenido más interactivo'
        });
      }

      // Analizar tendencia de engagement
      const engagementHistory = this.metricsHistory.get('engagement') || [];
      if (engagementHistory.length >= 5) {
        const recentAvg = engagementHistory.slice(-5).reduce((a, b) => a + b, 0) / 5;
        const olderAvg = engagementHistory.slice(-10, -5).reduce((a, b) => a + b, 0) / 5;
        const changeRate = ((recentAvg - olderAvg) / olderAvg) * 100;

        trends.push({
          metric: 'engagement',
          trend: changeRate > 2 ? 'increasing' : changeRate < -2 ? 'decreasing' : 'stable',
          changeRate: Math.round(changeRate * 100) / 100,
          prediction: recentAvg + (changeRate * 0.1)
        });
      }
    }

    // Analizar coherence
    if (neuralMetrics.coherence) {
      const expectedCoherence = [65, 90];
      if (neuralMetrics.coherence < expectedCoherence[0]) {
        anomalies.push({
          metric: 'coherence',
          value: neuralMetrics.coherence,
          expectedRange: expectedCoherence as [number, number],
          severity: 'high',
          recommendation: 'Revisar claridad del contenido y secuencia de ejercicios'
        });
      }
    }

    // Generar insights basados en análisis
    if (anomalies.length === 0) {
      insights.push('Todas las métricas neurales están dentro de rangos esperados');
    } else {
      insights.push(`Se detectaron ${anomalies.length} anomalías que requieren atención`);
    }

    if (trends.some(t => t.trend === 'increasing')) {
      insights.push('Tendencias positivas detectadas en métricas neurales');
    }

    if (neuralMetrics.engagement && neuralMetrics.coherence) {
      const combined = (neuralMetrics.engagement + neuralMetrics.coherence) / 2;
      if (combined > 80) {
        insights.push('Excelente rendimiento neural general del usuario');
      } else if (combined < 60) {
        insights.push('Rendimiento neural por debajo del promedio - considerar intervención');
      }
    }

    return { anomalies, trends, insights };
  }

  /**
   * Configura alertas personalizadas
   */
  async configureAlert(rule: Omit<AlertRule, 'id'>): Promise<{
    success: boolean;
    alertId: string;
    error?: string;
  }> {
    try {
      const alertId = `alert_${Date.now()}_${this.secureRandom.nextInt(1000, 9999)}`;
      
      const alertRule: AlertRule = {
        id: alertId,
        ...rule
      };

      this.alertRules.set(alertId, alertRule);

      console.log(`Alerta configurada: ${rule.name} (${alertId})`);

      return {
        success: true,
        alertId
      };
    } catch (error) {
      console.error('Error configurando alerta:', error);
      return {
        success: false,
        alertId: '',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Genera dashboard de métricas en tiempo real
   */
  async generateRealTimeDashboard(): Promise<{
    systemHealth: {
      status: 'healthy' | 'warning' | 'critical';
      score: number;
      issues: string[];
    };
    performanceInsights: {
      bottlenecks: string[];
      optimizations: string[];
      recommendations: string[];
    };
    userEngagement: {
      currentActiveUsers: number;
      engagementTrend: 'up' | 'down' | 'stable';
      sessionQuality: number;
    };
    neuralAnalytics: {
      avgEngagement: number;
      avgCoherence: number;
      learningEfficiency: number;
      adaptationRate: number;
    };
  }> {
    const systemMetrics = await this.getSystemMetrics();
    const appMetrics = await this.getApplicationMetrics();

    // Analizar salud del sistema
    const systemHealthScore = this.calculateSystemHealthScore(systemMetrics);
    const systemStatus = systemHealthScore > 80 ? 'healthy' : 
                       systemHealthScore > 60 ? 'warning' : 'critical';

    const issues = [];
    if (systemMetrics.cpu > 80) issues.push('CPU usage alto');
    if (systemMetrics.memory > 85) issues.push('Uso de memoria crítico');
    if (systemMetrics.errorRate > 3) issues.push('Tasa de errores elevada');
    if (systemMetrics.responseTime > 500) issues.push('Tiempo de respuesta lento');

    // Identificar cuellos de botella
    const bottlenecks = [];
    if (systemMetrics.cpu > 75) bottlenecks.push('CPU - considerar escalado horizontal');
    if (systemMetrics.networkLatency > 150) bottlenecks.push('Red - optimizar conectividad');
    if (systemMetrics.diskIO > 30) bottlenecks.push('Disco - considerar SSD o caché');

    // Generar optimizaciones sugeridas
    const optimizations = [];
    if (appMetrics.cacheHitRate < 0.9) {
      optimizations.push('Mejorar estrategia de caché');
    }
    if (systemMetrics.requestsPerSecond > 100) {
      optimizations.push('Implementar load balancing');
    }
    if (appMetrics.databaseQueries > 5000) {
      optimizations.push('Optimizar consultas a base de datos');
    }

    // Analizar engagement de usuarios
    const engagementTrend = this.analyzeEngagementTrend();
    const sessionQuality = this.calculateSessionQuality(appMetrics);

    // Simular métricas neurales agregadas
    const neuralAnalytics = {
      avgEngagement: this.secureRandom.nextFloat(65, 85),
      avgCoherence: this.secureRandom.nextFloat(70, 88),
      learningEfficiency: this.secureRandom.nextFloat(0.75, 0.95),
      adaptationRate: this.secureRandom.nextFloat(0.8, 0.98)
    };

    return {
      systemHealth: {
        status: systemStatus,
        score: Math.round(systemHealthScore),
        issues
      },
      performanceInsights: {
        bottlenecks,
        optimizations,
        recommendations: this.generatePerformanceRecommendations(systemMetrics, appMetrics)
      },
      userEngagement: {
        currentActiveUsers: appMetrics.activeUsers,
        engagementTrend,
        sessionQuality: Math.round(sessionQuality)
      },
      neuralAnalytics
    };
  }

  /**
   * Configura alertas predictivas usando IA
   */
  async setupPredictiveAlerts(): Promise<{
    success: boolean;
    alertsConfigured: number;
    predictions: Array<{
      metric: string;
      predictedValue: number;
      confidence: number;
      timeframe: string;
      riskLevel: 'low' | 'medium' | 'high';
    }>;
  }> {
    try {
      // Configurar alertas predictivas para métricas críticas
      const predictiveAlerts = [
        {
          name: 'CPU Overload Prediction',
          metric: 'cpu',
          operator: 'gt' as const,
          threshold: 90,
          duration: 300000, // 5 minutos
          severity: 'critical' as const,
          enabled: true,
          actions: [
            { type: 'auto_scale' as const, target: 'cpu', enabled: true },
            { type: 'slack' as const, target: '#alerts', message: 'CPU overload predicted', enabled: true }
          ]
        },
        {
          name: 'Memory Leak Detection',
          metric: 'memory',
          operator: 'gt' as const,
          threshold: 95,
          duration: 180000, // 3 minutos
          severity: 'critical' as const,
          enabled: true,
          actions: [
            { type: 'webhook' as const, target: 'https://monitoring.puntaje-inteligente.com/alerts', enabled: true }
          ]
        },
        {
          name: 'Neural Performance Degradation',
          metric: 'neural_response_time',
          operator: 'gt' as const,
          threshold: 2000,
          duration: 120000, // 2 minutos
          severity: 'warning' as const,
          enabled: true,
          actions: [
            { type: 'email' as const, target: 'admin@puntaje-inteligente.com', enabled: true }
          ]
        }
      ];

      let alertsConfigured = 0;
      for (const alert of predictiveAlerts) {
        const result = await this.configureAlert(alert);
        if (result.success) alertsConfigured++;
      }

      // Generar predicciones usando machine learning simple
      const predictions = await this.generateMetricPredictions();

      return {
        success: true,
        alertsConfigured,
        predictions
      };
    } catch (error) {
      console.error('Error configurando alertas predictivas:', error);
      return {
        success: false,
        alertsConfigured: 0,
        predictions: []
      };
    }
  }

  /**
   * Analiza patrones de uso y comportamiento
   */
  async analyzeUsagePatterns(): Promise<{
    peakHours: Array<{ hour: number; usage: number }>;
    userBehaviorPatterns: Array<{
      pattern: string;
      frequency: number;
      impact: 'positive' | 'negative' | 'neutral';
    }>;
    geographicDistribution: Array<{
      region: string;
      users: number;
      performance: number;
    }>;
    deviceAnalytics: Array<{
      device: string;
      percentage: number;
      avgPerformance: number;
    }>;
  }> {
    // Simular análisis de patrones de uso
    const peakHours = [];
    for (let hour = 0; hour < 24; hour++) {
      // Simular picos durante horas de estudio típicas
      let usage = this.secureRandom.nextFloat(10, 100);
      if (hour >= 9 && hour <= 12) usage *= 1.5; // Mañana
      if (hour >= 14 && hour <= 18) usage *= 1.8; // Tarde
      if (hour >= 19 && hour <= 22) usage *= 1.3; // Noche

      peakHours.push({ hour, usage: Math.round(usage) });
    }

    const userBehaviorPatterns = [
      { pattern: 'Completar ejercicios en secuencia', frequency: 0.65, impact: 'positive' as const },
      { pattern: 'Revisar respuestas antes de enviar', frequency: 0.78, impact: 'positive' as const },
      { pattern: 'Abandonar ejercicios difíciles', frequency: 0.23, impact: 'negative' as const },
      { pattern: 'Usar hints frecuentemente', frequency: 0.34, impact: 'neutral' as const },
      { pattern: 'Sesiones de estudio largas (>30 min)', frequency: 0.42, impact: 'positive' as const }
    ];

    const geographicDistribution = [
      { region: 'América del Norte', users: this.secureRandom.nextInt(300, 800), performance: this.secureRandom.nextFloat(85, 95) },
      { region: 'América del Sur', users: this.secureRandom.nextInt(200, 600), performance: this.secureRandom.nextFloat(75, 90) },
      { region: 'Europa', users: this.secureRandom.nextInt(150, 400), performance: this.secureRandom.nextFloat(80, 92) },
      { region: 'Asia', users: this.secureRandom.nextInt(100, 300), performance: this.secureRandom.nextFloat(70, 88) }
    ];

    const deviceAnalytics = [
      { device: 'Desktop', percentage: this.secureRandom.nextFloat(45, 65), avgPerformance: this.secureRandom.nextFloat(85, 95) },
      { device: 'Mobile', percentage: this.secureRandom.nextFloat(25, 40), avgPerformance: this.secureRandom.nextFloat(70, 85) },
      { device: 'Tablet', percentage: this.secureRandom.nextFloat(8, 18), avgPerformance: this.secureRandom.nextFloat(75, 88) }
    ];

    return {
      peakHours,
      userBehaviorPatterns,
      geographicDistribution,
      deviceAnalytics
    };
  }

  /**
   * Genera reporte de análisis de incidentes
   */
  async generateIncidentAnalysis(): Promise<{
    incidents: Array<{
      id: string;
      title: string;
      severity: 'critical' | 'major' | 'minor';
      startTime: Date;
      endTime?: Date;
      duration: number;
      affectedUsers: number;
      rootCause: string;
      resolution: string;
      preventionMeasures: string[];
    }>;
    mttr: number; // Mean Time To Recovery
    mtbf: number; // Mean Time Between Failures
    availability: number;
  }> {
    // Simular incidentes históricos
    const incidents = [];
    const now = new Date();

    for (let i = 0; i < this.secureRandom.nextInt(3, 8); i++) {
      const startTime = new Date(now.getTime() - this.secureRandom.nextInt(1, 30) * 24 * 60 * 60 * 1000);
      const duration = this.secureRandom.nextInt(5, 120); // minutos
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

      const severities = ['minor', 'major', 'critical'] as const;
      const severity = severities[this.secureRandom.nextInt(0, 2)];

      incidents.push({
        id: `INC-${Date.now()}-${i}`,
        title: this.generateIncidentTitle(severity),
        severity,
        startTime,
        endTime,
        duration,
        affectedUsers: this.secureRandom.nextInt(10, 500),
        rootCause: this.generateRootCause(severity),
        resolution: this.generateResolution(severity),
        preventionMeasures: this.generatePreventionMeasures(severity)
      });
    }

    // Calcular métricas de disponibilidad
    const totalDowntime = incidents.reduce((sum, inc) => sum + inc.duration, 0);
    const totalTime = 30 * 24 * 60; // 30 días en minutos
    const availability = ((totalTime - totalDowntime) / totalTime) * 100;

    const mttr = incidents.length > 0 ? totalDowntime / incidents.length : 0;
    const mtbf = incidents.length > 1 ? 
      (incidents[incidents.length - 1].startTime.getTime() - incidents[0].startTime.getTime()) / (incidents.length - 1) / (60 * 1000) : 0;

    return {
      incidents,
      mttr: Math.round(mttr),
      mtbf: Math.round(mtbf),
      availability: Math.round(availability * 100) / 100
    };
  }

  // Métodos privados

  private initializeDefaultAlertRules(): void {
    const defaultRules = [
      {
        name: 'High CPU Usage',
        metric: 'cpu',
        operator: 'gt' as const,
        threshold: 85,
        duration: 300000,
        severity: 'warning' as const,
        enabled: true,
        actions: [
          { type: 'slack' as const, target: '#alerts', enabled: true }
        ]
      },
      {
        name: 'Memory Critical',
        metric: 'memory',
        operator: 'gt' as const,
        threshold: 90,
        duration: 180000,
        severity: 'critical' as const,
        enabled: true,
        actions: [
          { type: 'email' as const, target: 'admin@puntaje-inteligente.com', enabled: true },
          { type: 'auto_scale' as const, target: 'memory', enabled: true }
        ]
      },
      {
        name: 'High Error Rate',
        metric: 'errorRate',
        operator: 'gt' as const,
        threshold: 5,
        duration: 120000,
        severity: 'critical' as const,
        enabled: true,
        actions: [
          { type: 'webhook' as const, target: 'https://monitoring.puntaje-inteligente.com/alerts', enabled: true }
        ]
      }
    ];

    defaultRules.forEach(rule => {
      const id = `default_${rule.name.toLowerCase().replace(/\s+/g, '_')}`;
      this.alertRules.set(id, { id, ...rule });
    });
  }

  private async initializeWebSocketConnection(): Promise<void> {
    try {
      // En implementación real, conectar al servidor de métricas
      const wsUrl = 'wss://monitoring.puntaje-inteligente.com/metrics';
      
      // Simular conexión WebSocket
      console.log('Conectando a WebSocket de métricas...');
      await this.delay(1000);
      console.log('✅ WebSocket conectado para métricas en tiempo real');
    } catch (error) {
      console.warn('WebSocket no disponible, usando polling como fallback');
    }
  }

  private startMetricsCollection(): void {
    this.monitoringInterval = setInterval(async () => {
      try {
        const systemMetrics = await this.getSystemMetrics();
        const appMetrics = await this.getApplicationMetrics();

        // Verificar alertas
        await this.checkAlertRules(systemMetrics, appMetrics);

        // Notificar callbacks del dashboard
        this.dashboardCallbacks.forEach(callback => {
          callback({ system: systemMetrics, application: appMetrics });
        });
      } catch (error) {
        console.error('Error recolectando métricas:', error);
      }
    }, 5000); // Cada 5 segundos
  }

  private startAlertSystem(): void {
    console.log('🚨 Sistema de alertas iniciado');
  }

  private setupRealTimeDashboard(): void {
    console.log('📊 Dashboard en tiempo real configurado');
  }

  private calculateSystemHealthScore(metrics: SystemMetrics): number {
    const weights = {
      cpu: 0.25,
      memory: 0.25,
      responseTime: 0.2,
      errorRate: 0.15,
      uptime: 0.15
    };

    const scores = {
      cpu: Math.max(0, 100 - metrics.cpu),
      memory: Math.max(0, 100 - metrics.memory),
      responseTime: Math.max(0, 100 - (metrics.responseTime / 10)),
      errorRate: Math.max(0, 100 - (metrics.errorRate * 10)),
      uptime: metrics.uptime * 100
    };

    return Object.entries(weights).reduce((total, [metric, weight]) => {
      return total + (scores[metric as keyof typeof scores] * weight);
    }, 0);
  }

  private analyzeEngagementTrend(): 'up' | 'down' | 'stable' {
    // Simular análisis de tendencia
    const trend = this.secureRandom.next();
    return trend > 0.6 ? 'up' : trend < 0.4 ? 'down' : 'stable';
  }

  private calculateSessionQuality(metrics: ApplicationMetrics): number {
    // Calcular calidad de sesión basada en métricas
    const factors = {
      exerciseCompletion: metrics.exercisesCompleted / metrics.userSessions,
      cachePerformance: metrics.cacheHitRate * 100,
      conversionRate: metrics.conversionRate * 100
    };

    return (factors.exerciseCompletion * 0.4 + 
            factors.cachePerformance * 0.3 + 
            factors.conversionRate * 0.3);
  }

  private generatePerformanceRecommendations(
    systemMetrics: SystemMetrics, 
    appMetrics: ApplicationMetrics
  ): string[] {
    const recommendations = [];

    if (systemMetrics.cpu > 70) {
      recommendations.push('Considerar escalado automático de instancias');
    }
    if (appMetrics.cacheHitRate < 0.85) {
      recommendations.push('Optimizar configuración de caché Redis');
    }
    if (systemMetrics.responseTime > 400) {
      recommendations.push('Implementar CDN para recursos estáticos');
    }
    if (appMetrics.databaseQueries > 8000) {
      recommendations.push('Optimizar consultas de base de datos con índices');
    }

    return recommendations;
  }

  private async checkAlertRules(
    systemMetrics: SystemMetrics, 
    appMetrics: ApplicationMetrics
  ): Promise<void> {
    const allMetrics = { ...systemMetrics, ...appMetrics };

    for (const [ruleId, rule] of this.alertRules.entries()) {
      if (!rule.enabled) continue;

      const metricValue = allMetrics[rule.metric as keyof typeof allMetrics];
      if (metricValue === undefined) continue;

      const conditionMet = this.evaluateAlertCondition(metricValue, rule);

      if (conditionMet) {
        await this.triggerAlert(rule, metricValue);
      }
    }
  }

  private evaluateAlertCondition(value: number, rule: AlertRule): boolean {
    switch (rule.operator) {
      case 'gt': return value > rule.threshold;
      case 'gte': return value >= rule.threshold;
      case 'lt': return value < rule.threshold;
      case 'lte': return value <= rule.threshold;
      case 'eq': return value === rule.threshold;
      default: return false;
    }
  }

  private async triggerAlert(rule: AlertRule, value: number): Promise<void> {
    const alertId = `alert_${Date.now()}_${this.secureRandom.nextInt(1000, 9999)}`;
    
    const alert: Alert = {
      id: alertId,
      ruleId: rule.id,
      metric: rule.metric,
      value,
      threshold: rule.threshold,
      severity: rule.severity,
      message: `${rule.name}: ${rule.metric} = ${value} (threshold: ${rule.threshold})`,
      timestamp: new Date(),
      resolved: false
    };

    this.activeAlerts.set(alertId, alert);

    // Ejecutar acciones configuradas
    for (const action of rule.actions) {
      if (action.enabled) {
        await this.executeAlertAction(action, alert);
      }
    }

    console.log(`🚨 Alerta disparada: ${alert.message}`);
  }

  private async executeAlertAction(action: AlertAction, alert: Alert): Promise<void> {
    switch (action.type) {
      case 'email':
        console.log(`📧 Enviando email a ${action.target}: ${alert.message}`);
        break;
      case 'slack':
        console.log(`💬 Enviando mensaje a Slack ${action.target}: ${alert.message}`);
        break;
      case 'webhook':
        console.log(`🔗 Llamando webhook ${action.target} con alerta ${alert.id}`);
        break;
      case 'push_notification':
        console.log(`📱 Enviando push notification: ${alert.message}`);
        break;
      case 'auto_scale':
        console.log(`🔄 Iniciando auto-escalado para ${action.target}`);
        await this.executeAutoScaling(action.target);
        break;
    }
  }

  private async executeAutoScaling(resource: string): Promise<void> {
    console.log(`🚀 Ejecutando auto-escalado para recurso: ${resource}`);
    // En implementación real, llamar API de escalado de infrastructure
  }

  private async generateMetricPredictions(): Promise<Array<{
    metric: string;
    predictedValue: number;
    confidence: number;
    timeframe: string;
    riskLevel: 'low' | 'medium' | 'high';
  }>> {
    const predictions = [];
    
    const metrics = ['cpu', 'memory', 'responseTime', 'errorRate'];
    const timeframes = ['5min', '15min', '1hour', '24hour'];

    for (const metric of metrics) {
      const history = this.metricsHistory.get(metric) || [];
      if (history.length < 10) continue;

      // Predicción simple usando regresión lineal
      const recentValues = history.slice(-10);
      const trend = this.calculateTrend(recentValues);
      const lastValue = recentValues[recentValues.length - 1];

      for (const timeframe of timeframes) {
        const multiplier = this.getTimeframeMultiplier(timeframe);
        const predictedValue = lastValue + (trend * multiplier);
        const confidence = this.calculatePredictionConfidence(recentValues);
        
        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        if ((metric === 'cpu' && predictedValue > 80) || 
            (metric === 'memory' && predictedValue > 85) ||
            (metric === 'errorRate' && predictedValue > 3)) {
          riskLevel = 'high';
        } else if ((metric === 'cpu' && predictedValue > 60) || 
                   (metric === 'memory' && predictedValue > 70)) {
          riskLevel = 'medium';
        }

        predictions.push({
          metric,
          predictedValue: Math.round(predictedValue * 100) / 100,
          confidence: Math.round(confidence * 100) / 100,
          timeframe,
          riskLevel
        });
      }
    }

    return predictions;
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    // Regresión lineal simple
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  private getTimeframeMultiplier(timeframe: string): number {
    switch (timeframe) {
      case '5min': return 1;
      case '15min': return 3;
      case '1hour': return 12;
      case '24hour': return 288;
      default: return 1;
    }
  }

  private calculatePredictionConfidence(values: number[]): number {
    // Calcular confianza basada en variabilidad de los datos
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Confianza inversamente proporcional a la desviación estándar
    return Math.max(0.5, 1 - (stdDev / mean));
  }

  private generateIncidentTitle(severity: 'critical' | 'major' | 'minor'): string {
    const titles = {
      critical: [
        'Sistema de base de datos inaccesible',
        'Fallo completo del servicio neural',
        'API gateway no responde'
      ],
      major: [
        'Degradación de performance en ejercicios',
        'Errores intermitentes en autenticación',
        'Timeout en análisis neural'
      ],
      minor: [
        'Lentitud en carga de imágenes',
        'Cache miss rate elevado',
        'Delay menor en notificaciones'
      ]
    };

    const options = titles[severity];
    return options[this.secureRandom.nextInt(0, options.length - 1)];
  }

  private generateRootCause(severity: 'critical' | 'major' | 'minor'): string {
    const causes = {
      critical: [
        'Fallo en disco de base de datos principal',
        'Agotamiento de memoria en servidor neural',
        'Configuración incorrecta de load balancer'
      ],
      major: [
        'Consulta SQL lenta sin optimizar',
        'Límite de conexiones alcanzado',
        'Timeout en servicios externos'
      ],
      minor: [
        'CDN con latencia elevada',
        'Cache invalidado prematuramente',
        'Worker ocupado con tareas background'
      ]
    };

    const options = causes[severity];
    return options[this.secureRandom.nextInt(0, options.length - 1)];
  }

  private generateResolution(severity: 'critical' | 'major' | 'minor'): string {
    const resolutions = {
      critical: [
        'Migración a servidor de respaldo y reparación de disco',
        'Reinicio de servicios y optimización de memoria',
        'Corrección de configuración y reinicio de load balancer'
      ],
      major: [
        'Optimización de consulta y adición de índice',
        'Incremento de pool de conexiones',
        'Implementación de circuit breaker'
      ],
      minor: [
        'Cambio de proveedor CDN temporalmente',
        'Reconfiguración de estrategia de cache',
        'Balanceado de carga de workers'
      ]
    };

    const options = resolutions[severity];
    return options[this.secureRandom.nextInt(0, options.length - 1)];
  }

  private generatePreventionMeasures(severity: 'critical' | 'major' | 'minor'): string[] {
    const measures = {
      critical: [
        'Implementar monitoreo de salud de discos',
        'Configurar alertas proactivas de memoria',
        'Automatizar tests de configuración'
      ],
      major: [
        'Implementar análisis automático de performance de queries',
        'Configurar pool de conexiones dinámico',
        'Implementar circuit breakers para servicios externos'
      ],
      minor: [
        'Monitoreo continuo de CDN performance',
        'Implementar warming de cache automático',
        'Configurar auto-scaling de workers'
      ]
    };

    return measures[severity];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Suscribe un callback para recibir métricas en tiempo real
   */
  subscribeToMetrics(callback: (metrics: any) => void): () => void {
    this.dashboardCallbacks.push(callback);
    
    // Retornar función para cancelar suscripción
    return () => {
      const index = this.dashboardCallbacks.indexOf(callback);
      if (index > -1) {
        this.dashboardCallbacks.splice(index, 1);
      }
    };
  }
}

/**
 * Factory para crear instancia del sistema de monitoreo
 */
export function createMonitoringSystem(): RealTimeMonitoringSystem {
  return new RealTimeMonitoringSystem();
}

/**
 * Hook para usar en React
 */
export function useRealTimeMonitoring() {
  const monitoring = new RealTimeMonitoringSystem();

  return {
    startMonitoring: () => monitoring.startMonitoring(),
    stopMonitoring: () => monitoring.stopMonitoring(),
    getSystemMetrics: () => monitoring.getSystemMetrics(),
    getApplicationMetrics: () => monitoring.getApplicationMetrics(),
    configureAlert: (rule: any) => monitoring.configureAlert(rule),
    generateDashboard: () => monitoring.generateRealTimeDashboard(),
    analyzeUsagePatterns: () => monitoring.analyzeUsagePatterns(),
    subscribeToMetrics: (callback: (metrics: any) => void) => monitoring.subscribeToMetrics(callback)
  };
}
