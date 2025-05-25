
import { supabase } from "@/integrations/supabase/client";
import { BancoEvaluacionesService } from "@/services/banco-evaluaciones/BancoEvaluacionesService";

/**
 * HUB CENTRAL OMNISCIENTE - Única fuente de verdad sin duplicaciones
 * Arquitectura quirúrgica que centraliza todo el intercambio de datos
 */
export class UniversalDataHub {
  private static instance: UniversalDataHub;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private subscribers: Map<string, ((data: any) => void)[]> = new Map();
  private contextStack: string[] = [];
  
  // Singleton quirúrgico
  static getInstance(): UniversalDataHub {
    if (!UniversalDataHub.instance) {
      UniversalDataHub.instance = new UniversalDataHub();
    }
    return UniversalDataHub.instance;
  }

  /**
   * NÚCLEO CENTRALIZADOR - Evita duplicaciones completamente
   */
  async getCentralizedData<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl: number = 300000,
    context?: string
  ): Promise<T> {
    // Cache inteligente con contexto
    const contextKey = context ? `${context}:${key}` : key;
    const cached = this.cache.get(contextKey);
    
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      this.notifySubscribers(contextKey, cached.data);
      return cached.data;
    }

    // Fetch y cache centralizado
    const data = await fetcher();
    this.cache.set(contextKey, {
      data,
      timestamp: Date.now(),
      ttl
    });

    // Notificar a todos los suscriptores
    this.notifySubscribers(contextKey, data);
    return data;
  }

  /**
   * SUSCRIPCIÓN REACTIVA - Comunicación interseccional instantánea
   */
  subscribe(key: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    this.subscribers.get(key)!.push(callback);

    // Enviar datos cached si existen
    const cached = this.cache.get(key);
    if (cached) {
      callback(cached.data);
    }

    // Retornar función de limpieza
    return () => {
      const subs = this.subscribers.get(key) || [];
      const index = subs.indexOf(callback);
      if (index > -1) {
        subs.splice(index, 1);
      }
    };
  }

  /**
   * NOTIFICACIÓN PÚBLICA - Método expuesto para bridges
   */
  public notifySubscribers(key: string, data: any): void {
    const subscribers = this.subscribers.get(key) || [];
    subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error notificando suscriptor para ${key}:`, error);
      }
    });
  }

  /**
   * CONTEXTO QUIRÚRGICO - Manejo de stack de contextos educativos
   */
  pushContext(context: string): void {
    this.contextStack.push(context);
    console.log(`📍 Contexto añadido: ${context}, Stack: [${this.contextStack.join(' → ')}]`);
  }

  popContext(): string | undefined {
    const context = this.contextStack.pop();
    console.log(`📍 Contexto removido: ${context}, Stack: [${this.contextStack.join(' → ')}]`);
    return context;
  }

  getCurrentContext(): string | null {
    return this.contextStack[this.contextStack.length - 1] || null;
  }

  /**
   * EVALUACIÓN CENTRALIZADA - Bridge directo sin duplicaciones
   */
  async getEvaluationData(userId: string, prueba: string): Promise<any> {
    const context = `evaluation:${prueba}`;
    this.pushContext(context);

    return this.getCentralizedData(
      `evaluation_${userId}_${prueba}`,
      async () => {
        const [preguntas, progreso, analisis] = await Promise.all([
          BancoEvaluacionesService.generarEvaluacionOptimizada({
            tipo_evaluacion: 'adaptativa',
            prueba_paes: prueba,
            total_preguntas: 15,
            duracion_minutos: 45,
            distribucion_dificultad: { basico: 30, intermedio: 50, avanzado: 20 }
          }),
          supabase
            .from('user_node_progress')
            .select('*')
            .eq('user_id', userId),
          supabase
            .from('analisis_evaluacion')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
        ]);

        return {
          preguntas: preguntas.preguntas,
          progreso: progreso.data || [],
          analisis: analisis.data?.[0] || null,
          metadata: {
            prueba,
            timestamp: Date.now(),
            context
          }
        };
      },
      600000, // 10 minutos TTL para evaluaciones
      context
    );
  }

  /**
   * LECTOGUÍA CENTRALIZADA - Integración sin duplicaciones
   */
  async getLectoGuiaData(userId: string, subject: string): Promise<any> {
    const context = `lectoguia:${subject}`;
    this.pushContext(context);

    return this.getCentralizedData(
      `lectoguia_${userId}_${subject}`,
      async () => {
        const [nodes, skillLevels, messages] = await Promise.all([
          supabase
            .from('learning_nodes')
            .select('*')
            .eq('subject_area', subject)
            .order('position'),
          supabase
            .from('user_node_progress')
            .select('*')
            .eq('user_id', userId),
          // Obtener mensajes de chat relacionados
          this.getContextualMessages(userId, subject)
        ]);

        return {
          nodes: nodes.data || [],
          skillLevels: skillLevels.data || [],
          messages: messages || [],
          activeSubject: subject,
          context
        };
      },
      300000, // 5 minutos TTL
      context
    );
  }

  private async getContextualMessages(userId: string, subject: string): Promise<any[]> {
    // Simular mensajes contextuales por ahora
    return [
      {
        id: `msg_${Date.now()}`,
        content: `Contexto activo: ${subject}. ¿En qué puedo ayudarte?`,
        role: 'assistant',
        timestamp: new Date()
      }
    ];
  }

  /**
   * DASHBOARD CENTRALIZADO - Vista holística unificada
   */
  async getDashboardData(userId: string): Promise<any> {
    const context = 'dashboard:unified';
    this.pushContext(context);

    return this.getCentralizedData(
      `dashboard_${userId}`,
      async () => {
        const [profile, diagnostics, plans, nodes, evaluations] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', userId).single(),
          supabase.from('user_diagnostic_results').select('*').eq('user_id', userId),
          supabase.from('generated_study_plans').select('*').eq('user_id', userId),
          supabase.from('learning_nodes').select('*').limit(100),
          supabase.from('sesiones_evaluacion').select('*').eq('user_id', userId).limit(5)
        ]);

        // Análisis quirúrgico de datos
        const unifiedMetrics = this.analyzeUnifiedMetrics({
          profile: profile.data,
          diagnostics: diagnostics.data || [],
          plans: plans.data || [],
          nodes: nodes.data || [],
          evaluations: evaluations.data || []
        });

        return {
          profile: profile.data,
          metrics: unifiedMetrics,
          recommendations: this.generateSmartRecommendations(unifiedMetrics),
          context,
          lastUpdate: Date.now()
        };
      },
      180000, // 3 minutos TTL para dashboard
      context
    );
  }

  private analyzeUnifiedMetrics(data: any): any {
    const { profile, diagnostics, plans, nodes, evaluations } = data;
    
    return {
      overallProgress: this.calculateOverallProgress(data),
      strongAreas: this.identifyStrongAreas(diagnostics),
      weakAreas: this.identifyWeakAreas(diagnostics),
      studyEfficiency: this.calculateStudyEfficiency(evaluations),
      nextActions: this.prioritizeNextActions(data),
      paesReadiness: this.assessPAESReadiness(data)
    };
  }

  private calculateOverallProgress(data: any): number {
    // Algoritmo quirúrgico para calcular progreso general
    const weights = {
      diagnostics: 0.3,
      practice: 0.4,
      plans: 0.3
    };
    
    return Math.min(100, Math.max(0, 
      (data.diagnostics.length * 20 * weights.diagnostics) +
      (data.evaluations.length * 15 * weights.practice) +
      (data.plans.length * 25 * weights.plans)
    ));
  }

  private identifyStrongAreas(diagnostics: any[]): string[] {
    // Análisis quirúrgico de fortalezas
    if (!diagnostics.length) return [];
    
    const latest = diagnostics[0];
    const strongAreas: string[] = [];
    
    if (latest.results && typeof latest.results === 'object') {
      Object.entries(latest.results).forEach(([area, score]: [string, any]) => {
        if (typeof score === 'number' && score > 600) {
          strongAreas.push(area);
        }
      });
    }
    
    return strongAreas;
  }

  private identifyWeakAreas(diagnostics: any[]): string[] {
    // Análisis quirúrgico de debilidades
    if (!diagnostics.length) return [];
    
    const latest = diagnostics[0];
    const weakAreas: string[] = [];
    
    if (latest.results && typeof latest.results === 'object') {
      Object.entries(latest.results).forEach(([area, score]: [string, any]) => {
        if (typeof score === 'number' && score < 450) {
          weakAreas.push(area);
        }
      });
    }
    
    return weakAreas;
  }

  private calculateStudyEfficiency(evaluations: any[]): number {
    if (!evaluations.length) return 0;
    
    // Algoritmo quirúrgico de eficiencia
    const totalTime = evaluations.reduce((acc, evalItem) => acc + (evalItem.tiempo_total_segundos || 0), 0);
    const avgTime = totalTime / evaluations.length;
    
    return Math.min(100, Math.max(0, 100 - (avgTime / 60))); // Eficiencia basada en tiempo promedio
  }

  private prioritizeNextActions(data: any): string[] {
    const actions: string[] = [];
    
    if (!data.diagnostics.length) {
      actions.push('Realizar diagnóstico inicial');
    }
    
    if (!data.plans.length) {
      actions.push('Crear plan de estudio personalizado');
    }
    
    if (data.evaluations.length < 3) {
      actions.push('Practicar con más evaluaciones');
    }
    
    return actions;
  }

  private assessPAESReadiness(data: any): { score: number; areas: string[] } {
    const { diagnostics, evaluations } = data;
    
    let readinessScore = 0;
    const readyAreas: string[] = [];
    
    if (diagnostics.length > 0) {
      const latest = diagnostics[0];
      if (latest.results && typeof latest.results === 'object') {
        Object.entries(latest.results).forEach(([area, score]: [string, any]) => {
          if (typeof score === 'number' && score > 550) {
            readyAreas.push(area);
            readinessScore += 20;
          }
        });
      }
    }
    
    return {
      score: Math.min(100, readinessScore),
      areas: readyAreas
    };
  }

  private generateSmartRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];
    
    if (metrics.weakAreas.length > 0) {
      recommendations.push(`Enfócate en fortalecer: ${metrics.weakAreas.join(', ')}`);
    }
    
    if (metrics.studyEfficiency < 50) {
      recommendations.push('Optimiza tu tiempo de estudio con sesiones más cortas');
    }
    
    if (metrics.nextActions.length > 0) {
      recommendations.push(`Próximo paso: ${metrics.nextActions[0]}`);
    }
    
    return recommendations;
  }

  /**
   * BRIDGE INTERSECCIONAL - Comunicación fluida entre módulos
   */
  async bridgeEvaluationToLectoGuia(evaluationResult: any, userId: string): Promise<void> {
    const { preguntaId, esCorrecta, nodoId } = evaluationResult;
    
    // Actualizar progreso en LectoGuía automáticamente
    if (nodoId) {
      await this.getCentralizedData(
        `bridge_eval_to_lg_${userId}_${nodoId}`,
        async () => {
          const newProgress = esCorrecta ? 10 : -5;
          
          await supabase
            .from('user_node_progress')
            .upsert({
              user_id: userId,
              node_id: nodoId,
              progress: Math.max(0, Math.min(100, newProgress)),
              last_activity_at: new Date().toISOString()
            });

          return { success: true, nodoId, newProgress };
        },
        60000, // 1 minuto TTL
        'bridge:evaluation_to_lectoguia'
      );
    }

    // Notificar a suscriptores de LectoGuía
    this.notifySubscribers(`lectoguia_update_${userId}`, {
      type: 'evaluation_result',
      data: evaluationResult
    });
  }

  /**
   * LIMPIEZA QUIRÚRGICA
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      Array.from(this.cache.keys())
        .filter(key => key.includes(pattern))
        .forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  /**
   * MÉTRICAS DEL HUB
   */
  getHubMetrics(): any {
    return {
      cacheSize: this.cache.size,
      subscriberCount: Array.from(this.subscribers.values()).reduce((acc, subs) => acc + subs.length, 0),
      contextStack: [...this.contextStack],
      cacheHitRate: this.calculateCacheHitRate()
    };
  }

  private calculateCacheHitRate(): number {
    // Simplificado por ahora
    return this.cache.size > 0 ? 85 : 0;
  }
}

// Exportar instancia singleton
export const universalHub = UniversalDataHub.getInstance();
