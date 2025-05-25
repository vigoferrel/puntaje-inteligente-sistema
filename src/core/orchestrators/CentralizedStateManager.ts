
import { universalHub } from '../universal-hub/UniversalDataHub';
import { evaluationBridge } from '../bridges/EvaluationBridge';

/**
 * ORQUESTADOR CENTRAL - Director de flujos interseccionalmente sincronizados
 * Evita duplicaciones de estado y centraliza toda la lógica de negocio
 */
export class CentralizedStateManager {
  private static instance: CentralizedStateManager;
  private globalState: Map<string, any> = new Map();
  private stateHistory: Array<{ timestamp: number; state: any; action: string }> = [];
  
  static getInstance(): CentralizedStateManager {
    if (!CentralizedStateManager.instance) {
      CentralizedStateManager.instance = new CentralizedStateManager();
    }
    return CentralizedStateManager.instance;
  }

  /**
   * ESTADO GLOBAL UNIFICADO - Sin duplicaciones
   */
  setState(key: string, value: any, action: string = 'UPDATE'): void {
    const previousValue = this.globalState.get(key);
    this.globalState.set(key, value);
    
    // Historial quirúrgico
    this.stateHistory.push({
      timestamp: Date.now(),
      state: { key, previousValue, newValue: value },
      action
    });
    
    // Limitar historial
    if (this.stateHistory.length > 100) {
      this.stateHistory = this.stateHistory.slice(-50);
    }
    
    // Notificar cambios a través del hub
    universalHub.notifySubscribers(`state_${key}`, value);
    
    console.log(`🎯 Estado actualizado: ${key} → ${action}`);
  }

  getState<T>(key: string): T | undefined {
    return this.globalState.get(key);
  }

  /**
   * FLUJO EDUCATIVO CENTRALIZADO
   */
  async orchestrateEducationalFlow(userId: string, action: any): Promise<any> {
    const { type, payload } = action;
    
    switch (type) {
      case 'START_EVALUATION':
        return this.orchestrateEvaluationFlow(userId, payload);
        
      case 'COMPLETE_QUESTION':
        return this.orchestrateQuestionCompletion(userId, payload);
        
      case 'NAVIGATE_TO_LECTOGUIA':
        return this.orchestrateLectoGuiaNavigation(userId, payload);
        
      case 'UPDATE_DASHBOARD':
        return this.orchestrateDashboardUpdate(userId, payload);
        
      default:
        console.warn(`Acción no reconocida: ${type}`);
        return { success: false, error: 'Unknown action' };
    }
  }

  private async orchestrateEvaluationFlow(userId: string, payload: any): Promise<any> {
    const { prueba, configuracion } = payload;
    
    // Estado centralizdo
    this.setState(`evaluation_${userId}`, {
      active: true,
      prueba,
      startTime: Date.now(),
      configuration: configuracion
    }, 'START_EVALUATION');
    
    // Bridge con evaluación adaptativa
    const evaluationData = await evaluationBridge.startAdaptiveEvaluation(userId, prueba);
    
    // Sincronizar con otros módulos
    await this.syncCrossModule(userId, 'evaluation_started', evaluationData);
    
    return {
      success: true,
      data: evaluationData,
      nextAction: 'SHOW_FIRST_QUESTION'
    };
  }

  private async orchestrateQuestionCompletion(userId: string, payload: any): Promise<any> {
    const { questionId, response, analytics } = payload;
    
    // Procesar respuesta adaptativa
    const adaptiveResult = await evaluationBridge.processAdaptiveResponse(
      userId, 
      questionId, 
      response, 
      analytics
    );
    
    // Actualizar estado global
    const currentEvaluation = this.getState(`evaluation_${userId}`) || {};
    this.setState(`evaluation_${userId}`, {
      ...currentEvaluation,
      lastResponse: {
        questionId,
        response,
        result: adaptiveResult,
        timestamp: Date.now()
      }
    }, 'COMPLETE_QUESTION');
    
    // Bridge interseccional automático
    await this.syncCrossModule(userId, 'question_completed', {
      questionId,
      response,
      adaptiveResult
    });
    
    return {
      success: true,
      data: adaptiveResult,
      nextAction: adaptiveResult.shouldContinue ? 'SHOW_NEXT_QUESTION' : 'SHOW_RESULTS'
    };
  }

  private async orchestrateLectoGuiaNavigation(userId: string, payload: any): Promise<any> {
    const { subject, context } = payload;
    
    // Obtener datos centralizados
    const lectoGuiaData = await universalHub.getLectoGuiaData(userId, subject);
    
    // Estado centralizado
    this.setState(`lectoguia_${userId}`, {
      activeSubject: subject,
      context,
      data: lectoGuiaData,
      lastAccess: Date.now()
    }, 'NAVIGATE_LECTOGUIA');
    
    // Sincronizar contexto educativo
    await this.syncEducationalContext(userId, subject, lectoGuiaData);
    
    return {
      success: true,
      data: lectoGuiaData,
      nextAction: 'RENDER_LECTOGUIA_INTERFACE'
    };
  }

  private async orchestrateDashboardUpdate(userId: string, payload: any): Promise<any> {
    // Datos holísticos centralizados
    const dashboardData = await universalHub.getDashboardData(userId);
    
    // Estado unificado
    this.setState(`dashboard_${userId}`, {
      ...dashboardData,
      lastUpdate: Date.now(),
      triggers: payload.triggers || []
    }, 'UPDATE_DASHBOARD');
    
    return {
      success: true,
      data: dashboardData,
      nextAction: 'RENDER_UNIFIED_DASHBOARD'
    };
  }

  /**
   * SINCRONIZACIÓN CROSS-MODULE
   */
  private async syncCrossModule(userId: string, event: string, data: any): Promise<void> {
    // Notificar a todos los módulos conectados
    const modules = ['evaluation', 'lectoguia', 'dashboard', 'analytics'];
    
    modules.forEach(module => {
      universalHub.notifySubscribers(`${module}_${userId}`, {
        event,
        data,
        timestamp: Date.now(),
        source: 'orchestrator'
      });
    });
  }

  private async syncEducationalContext(userId: string, subject: string, data: any): Promise<void> {
    // Contexto educativo unificado
    const educationalContext = {
      subject,
      availableNodes: data.nodes,
      currentProgress: data.skillLevels,
      recommendations: this.generateContextualRecommendations(subject, data),
      timestamp: Date.now()
    };
    
    this.setState(`educational_context_${userId}`, educationalContext, 'SYNC_CONTEXT');
    
    // Bridge con evaluación si está activa
    const activeEvaluation = this.getState(`evaluation_${userId}`);
    if (activeEvaluation?.active) {
      await this.bridgeEvaluationWithContext(userId, educationalContext);
    }
  }

  private generateContextualRecommendations(subject: string, data: any): string[] {
    const recommendations: string[] = [];
    
    if (data.nodes.length === 0) {
      recommendations.push(`Explorar nodos fundamentales de ${subject}`);
    }
    
    const lowProgressNodes = data.skillLevels.filter((sl: any) => sl.progress < 30);
    if (lowProgressNodes.length > 0) {
      recommendations.push(`Reforzar ${lowProgressNodes.length} conceptos básicos`);
    }
    
    const readyNodes = data.skillLevels.filter((sl: any) => sl.progress > 80);
    if (readyNodes.length > 0) {
      recommendations.push(`Avanzar a conceptos más complejos en ${readyNodes.length} áreas`);
    }
    
    return recommendations;
  }

  private async bridgeEvaluationWithContext(userId: string, context: any): Promise<void> {
    // Bridge automático entre evaluación activa y contexto educativo
    const relevantNodes = context.availableNodes.filter((node: any) => 
      node.subject_area === context.subject
    );
    
    universalHub.notifySubscribers(`evaluation_context_${userId}`, {
      relevantNodes,
      contextualHints: this.generateContextualHints(context),
      adaptiveAdjustments: this.calculateAdaptiveAdjustments(context)
    });
  }

  private generateContextualHints(context: any): string[] {
    return [
      `Basado en tu progreso en ${context.subject}`,
      `Conecta con conceptos que ya dominas`,
      `Aplica estrategias que funcionaron antes`
    ];
  }

  private calculateAdaptiveAdjustments(context: any): any {
    const avgProgress = context.currentProgress.reduce((acc: number, cp: any) => 
      acc + (cp.progress || 0), 0) / Math.max(context.currentProgress.length, 1);
    
    return {
      difficultyAdjustment: avgProgress > 70 ? 0.3 : avgProgress < 30 ? -0.3 : 0,
      paceAdjustment: avgProgress > 50 ? 1.2 : 0.8,
      contextualSupport: avgProgress < 40
    };
  }

  /**
   * MÉTRICAS DEL ORQUESTADOR
   */
  getOrchestrationMetrics(): any {
    return {
      activeStates: this.globalState.size,
      recentActions: this.stateHistory.slice(-10),
      systemHealth: this.calculateSystemHealth(),
      crossModuleConnections: this.getCrossModuleConnections()
    };
  }

  private calculateSystemHealth(): number {
    // Salud del sistema basada en actividad reciente
    const recentActivity = this.stateHistory.filter(
      entry => Date.now() - entry.timestamp < 300000 // 5 minutos
    );
    
    return Math.min(100, recentActivity.length * 10);
  }

  private getCrossModuleConnections(): string[] {
    const connections: string[] = [];
    
    this.globalState.forEach((value, key) => {
      if (key.includes('_')) {
        const parts = key.split('_');
        if (parts.length >= 2) {
          connections.push(`${parts[0]} ↔ ${parts[1]}`);
        }
      }
    });
    
    return [...new Set(connections)];
  }

  /**
   * LIMPIEZA Y OPTIMIZACIÓN
   */
  cleanup(): void {
    // Limpiar estados antiguos
    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 horas
    this.stateHistory = this.stateHistory.filter(entry => entry.timestamp > cutoff);
    
    console.log('🧹 Limpieza del orquestador completada');
  }
}

export const orchestrator = CentralizedStateManager.getInstance();
