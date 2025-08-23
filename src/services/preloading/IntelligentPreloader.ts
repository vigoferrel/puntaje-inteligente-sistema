import { supabase } from "@/integrations/supabase/client";
import { BancoEvaluacionesService } from "../banco-evaluaciones/BancoEvaluacionesService";

/**
 * Sistema de Precarga Inteligente con Cache Multicapa
 * Optimiza tiempos de carga y permite funcionamiento offline
 */
export class IntelligentPreloader {
  private static cache: Map<string, { data: any; timestamp: number; priority: number }> = new Map();
  private static readonly CACHE_LEVELS = {
    L1_CRITICAL: 1000 * 60 * 60, // 1 hora - Datos críticos
    L2_IMPORTANT: 1000 * 60 * 30, // 30 min - Datos importantes  
    L3_PREFETCH: 1000 * 60 * 15   // 15 min - Datos prefetch
  };

  /**
   * Precarga inteligente basada en perfil del usuario
   */
  static async initializeIntelligentPreload(userId: string): Promise<{
    preloadedData: any;
    cacheStats: any;
    offlineCapability: boolean;
  }> {
    console.log('🚀 Iniciando precarga inteligente para usuario:', userId);
    
    try {
      const startTime = Date.now();
      
      // Obtener perfil y historial del usuario
      const userProfile = await this.getUserProfile(userId);
      const learningHistory = await this.getUserLearningHistory(userId);
      
      // Determinar estrategia de precarga personalizada
      const preloadStrategy = this.determinePreloadStrategy(userProfile, learningHistory);
      
      // Ejecutar precarga por niveles de prioridad
      const preloadResults = await Promise.allSettled([
        this.preloadCriticalData(userId, preloadStrategy),
        this.preloadImportantData(userId, preloadStrategy),
        this.preloadPrefetchData(userId, preloadStrategy)
      ]);

      // Consolidar datos precargados
      const preloadedData = {
        critical: preloadResults[0].status === 'fulfilled' ? preloadResults[0].value : null,
        important: preloadResults[1].status === 'fulfilled' ? preloadResults[1].value : null,
        prefetch: preloadResults[2].status === 'fulfilled' ? preloadResults[2].value : null
      };

      const loadTime = Date.now() - startTime;
      const cacheStats = this.getCacheStatistics();
      
      console.log(`✅ Precarga completada en ${loadTime}ms`);
      console.log(`📊 Cache stats:`, cacheStats);

      return {
        preloadedData,
        cacheStats,
        offlineCapability: this.calculateOfflineCapability()
      };

    } catch (error) {
      console.error('❌ Error en precarga inteligente:', error);
      return {
        preloadedData: null,
        cacheStats: this.getCacheStatistics(),
        offlineCapability: false
      };
    }
  }

  /**
   * Precarga datos críticos (L1) - Sesión actual del usuario
   */
  private static async preloadCriticalData(userId: string, strategy: any): Promise<any> {
    console.log('🔴 Precargando datos críticos (L1)...');
    
    const criticalData = await Promise.all([
      // Perfil del usuario actualizado
      this.cacheWithTTL(`user_profile_${userId}`, 
        () => this.getUserProfile(userId), 
        this.CACHE_LEVELS.L1_CRITICAL, 1
      ),
      
      // Evaluaciones activas del usuario
      this.cacheWithTTL(`active_evaluations_${userId}`,
        () => this.getActiveEvaluations(userId),
        this.CACHE_LEVELS.L1_CRITICAL, 1
      ),
      
      // Nodos de aprendizaje prioritarios
      this.cacheWithTTL(`priority_nodes_${userId}`,
        () => this.getPriorityLearningNodes(userId, strategy.targetAreas),
        this.CACHE_LEVELS.L1_CRITICAL, 1
      ),
      
      // Preguntas para evaluación inmediata
      this.cacheWithTTL(`immediate_questions_${strategy.primaryTest}`,
        () => this.getQuestionsForImmediate(strategy.primaryTest, 20),
        this.CACHE_LEVELS.L1_CRITICAL, 1
      )
    ]);

    return {
      userProfile: criticalData[0],
      activeEvaluations: criticalData[1],
      priorityNodes: criticalData[2],
      immediateQuestions: criticalData[3]
    };
  }

  /**
   * Precarga datos importantes (L2) - Próximas sesiones
   */
  private static async preloadImportantData(userId: string, strategy: any): Promise<any> {
    console.log('🟡 Precargando datos importantes (L2)...');
    
    const importantData = await Promise.all([
      // Plan de estudios activo
      this.cacheWithTTL(`study_plan_${userId}`,
        () => this.getStudyPlan(userId),
        this.CACHE_LEVELS.L2_IMPORTANT, 2
      ),
      
      // Progreso por nodos
      this.cacheWithTTL(`node_progress_${userId}`,
        () => this.getNodeProgress(userId),
        this.CACHE_LEVELS.L2_IMPORTANT, 2
      ),
      
      // Banco de preguntas por área de interés
      this.cacheWithTTL(`questions_bank_${strategy.secondaryTest}`,
        () => this.getQuestionsByArea(strategy.secondaryTest, strategy.targetAreas),
        this.CACHE_LEVELS.L2_IMPORTANT, 2
      ),
      
      // Diagnósticos disponibles
      this.cacheWithTTL(`available_diagnostics`,
        () => this.getAvailableDiagnostics(),
        this.CACHE_LEVELS.L2_IMPORTANT, 2
      )
    ]);

    return {
      studyPlan: importantData[0],
      nodeProgress: importantData[1],
      questionsBank: importantData[2],
      diagnostics: importantData[3]
    };
  }

  /**
   * Precarga datos de prefetch (L3) - Anticipación
   */
  private static async preloadPrefetchData(userId: string, strategy: any): Promise<any> {
    console.log('🟢 Precargando datos prefetch (L3)...');
    
    const prefetchData = await Promise.all([
      // Contenido educativo general
      this.cacheWithTTL(`educational_content_${strategy.primaryTest}`,
        () => this.getEducationalContent(strategy.primaryTest),
        this.CACHE_LEVELS.L3_PREFETCH, 3
      ),
      
      // Estadísticas del sistema
      this.cacheWithTTL(`system_stats`,
        () => this.getSystemStatistics(),
        this.CACHE_LEVELS.L3_PREFETCH, 3
      ),
      
      // Preguntas de otros tests (cross-training)
      this.cacheWithTTL(`cross_training_questions`,
        () => this.getCrossTrainingQuestions(strategy.allTests),
        this.CACHE_LEVELS.L3_PREFETCH, 3
      )
    ]);

    return {
      educationalContent: prefetchData[0],
      systemStats: prefetchData[1],
      crossTrainingQuestions: prefetchData[2]
    };
  }

  /**
   * Cache con TTL y prioridad
   */
  private static async cacheWithTTL<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl: number, 
    priority: number
  ): Promise<T> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      console.log(`📦 Cache hit: ${key}`);
      return cached.data;
    }
    
    try {
      const data = await fetcher();
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        priority
      });
      console.log(`💾 Cached: ${key} (priority ${priority})`);
      return data;
    } catch (error) {
      console.error(`❌ Error caching ${key}:`, error);
      return cached?.data || null;
    }
  }

  /**
   * Determina estrategia de precarga personalizada
   */
  private static determinePreloadStrategy(profile: any, history: any): any {
    const recentActivity = history?.slice(0, 10) || [];
    const mostUsedTest = this.getMostUsedTest(recentActivity);
    const targetAreas = this.identifyTargetAreas(profile, recentActivity);
    
    return {
      primaryTest: mostUsedTest || 'COMPETENCIA_LECTORA',
      secondaryTest: this.getSecondaryTest(mostUsedTest),
      allTests: ['COMPETENCIA_LECTORA', 'MATEMATICA_1', 'MATEMATICA_2', 'CIENCIAS', 'HISTORIA'],
      targetAreas,
      userLevel: this.estimateUserLevel(history),
      preloadPriority: this.calculatePreloadPriority(profile)
    };
  }

  // === MÉTODOS DE DATOS ESPECÍFICOS ===

  private static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }

  private static async getUserLearningHistory(userId: string) {
    const { data, error } = await supabase
      .from('respuestas_evaluacion')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);
    
    return data || [];
  }

  private static async getActiveEvaluations(userId: string) {
    const { data, error } = await supabase
      .from('sesiones_evaluacion')
      .select('*, evaluaciones(*)')
      .eq('user_id', userId)
      .eq('estado', 'iniciada')
      .order('created_at', { ascending: false });
    
    return data || [];
  }

  private static async getPriorityLearningNodes(userId: string, targetAreas: string[]) {
    let query = supabase
      .from('learning_nodes')
      .select('*')
      .eq('tier_priority', 'tier1_critico')
      .order('position');
    
    if (targetAreas.length) {
      query = query.in('subject_area', targetAreas);
    }
    
    const { data } = await query.limit(50);
    return data || [];
  }

  private static async getQuestionsForImmediate(testType: string, limit: number) {
    return await BancoEvaluacionesService.generarEvaluacionOptimizada({
      tipo_evaluacion: 'formativa',
      prueba_paes: testType,
      total_preguntas: limit,
      duracion_minutos: 60,
      distribucion_dificultad: { basico: 40, intermedio: 40, avanzado: 20 }
    });
  }

  private static async getStudyPlan(userId: string) {
    const { data, error } = await supabase
      .from('generated_study_plans')
      .select('*, study_plan_nodes(*, learning_nodes(*))')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1);
    
    return data?.[0] || null;
  }

  private static async getNodeProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_node_progress')
      .select('*, learning_nodes(*)')
      .eq('user_id', userId)
      .order('last_activity_at', { ascending: false });
    
    return data || [];
  }

  private static async getQuestionsByArea(testType: string, targetAreas: string[]): Promise<any[]> {
    let query = supabase
      .from('banco_preguntas')
      .select(`
        id, codigo_pregunta, enunciado, nivel_dificultad,
        alternativas_respuesta(id, letra, contenido, es_correcta)
      `)
      .eq('validada', true)
      .eq('prueba_paes', testType);
    
    if (targetAreas.length) {
      // Corregir el error de tipo: usar overlaps en lugar de in para arrays
      query = query.overlaps('competencias_evaluadas', targetAreas);
    }
    
    const { data } = await query.limit(100);
    return data || [];
  }

  private static async getAvailableDiagnostics() {
    const { data, error } = await supabase
      .from('diagnostic_tests')
      .select('*')
      .order('created_at', { ascending: false });
    
    return data || [];
  }

  private static async getEducationalContent(testType: string) {
    // Simular contenido educativo
    return {
      testType,
      materials: ['Guía de estudio', 'Videos explicativos', 'Ejercicios adicionales'],
      estimatedSize: '50MB'
    };
  }

  private static async getSystemStatistics() {
    const { data: nodeStats } = await supabase
      .from('learning_nodes')
      .select('subject_area')
      .limit(1000);
    
    return {
      totalNodes: nodeStats?.length || 0,
      lastUpdate: new Date().toISOString(),
      cacheHealth: this.getCacheHealth()
    };
  }

  private static async getCrossTrainingQuestions(allTests: string[]) {
    const questions = await Promise.all(
      allTests.map(test => 
        this.getQuestionsForImmediate(test, 5)
      )
    );
    
    return questions.flat();
  }

  // === MÉTODOS AUXILIARES ===

  private static getMostUsedTest(recentActivity: any[]): string {
    const testCounts: Record<string, number> = {};
    
    recentActivity.forEach(activity => {
      if (activity.prueba_paes) {
        testCounts[activity.prueba_paes] = (testCounts[activity.prueba_paes] || 0) + 1;
      }
    });
    
    return Object.entries(testCounts).reduce((a, b) => 
      testCounts[a[0]] > testCounts[b[0]] ? a : b
    )?.[0] || 'COMPETENCIA_LECTORA';
  }

  private static getSecondaryTest(primaryTest: string): string {
    const testMap: Record<string, string> = {
      'COMPETENCIA_LECTORA': 'HISTORIA',
      'MATEMATICA_1': 'MATEMATICA_2',
      'MATEMATICA_2': 'CIENCIAS',
      'CIENCIAS': 'MATEMATICA_2',
      'HISTORIA': 'COMPETENCIA_LECTORA'
    };
    
    return testMap[primaryTest] || 'MATEMATICA_1';
  }

  private static identifyTargetAreas(profile: any, history: any[]): string[] {
    const areas = ['lectura', 'matematicas', 'ciencias', 'historia'];
    
    // Priorizar basado en carrera objetivo si está disponible
    if (profile?.target_career) {
      const careerMap: Record<string, string[]> = {
        'ingenieria': ['matematicas', 'ciencias'],
        'medicina': ['ciencias', 'matematicas'],
        'educacion': ['lectura', 'historia'],
        'derecho': ['lectura', 'historia']
      };
      
      const targetCareer = profile.target_career.toLowerCase();
      for (const [career, priorityAreas] of Object.entries(careerMap)) {
        if (targetCareer.includes(career)) {
          return priorityAreas;
        }
      }
    }
    
    return areas.slice(0, 2); // Default: primeras 2 áreas
  }

  private static estimateUserLevel(history: any[]): 'beginner' | 'intermediate' | 'advanced' {
    if (history.length < 10) return 'beginner';
    
    const correctRate = history.filter(h => h.es_correcta).length / history.length;
    
    if (correctRate >= 0.7) return 'advanced';
    if (correctRate >= 0.5) return 'intermediate';
    return 'beginner';
  }

  private static calculatePreloadPriority(profile: any): number {
    let priority = 1;
    
    if (profile?.learning_phase === 'ACTIVE') priority += 1;
    if (profile?.target_score && profile.target_score > 600) priority += 1;
    if (profile?.last_active_at && 
        Date.now() - new Date(profile.last_active_at).getTime() < 24 * 60 * 60 * 1000) {
      priority += 1;
    }
    
    return Math.min(priority, 3);
  }

  private static getCacheStatistics() {
    const stats = {
      totalEntries: this.cache.size,
      byPriority: { 1: 0, 2: 0, 3: 0 },
      totalSize: 0,
      oldestEntry: Date.now(),
      newestEntry: 0
    };
    
    this.cache.forEach(entry => {
      stats.byPriority[entry.priority as keyof typeof stats.byPriority]++;
      stats.totalSize += JSON.stringify(entry.data).length;
      stats.oldestEntry = Math.min(stats.oldestEntry, entry.timestamp);
      stats.newestEntry = Math.max(stats.newestEntry, entry.timestamp);
    });
    
    return stats;
  }

  private static calculateOfflineCapability(): boolean {
    const criticalDataPresent = Array.from(this.cache.keys()).some(key => 
      this.cache.get(key)?.priority === 1
    );
    
    return criticalDataPresent && this.cache.size >= 5;
  }

  private static getCacheHealth(): number {
    const now = Date.now();
    let healthyEntries = 0;
    
    this.cache.forEach(entry => {
      const age = now - entry.timestamp;
      const maxAge = entry.priority === 1 ? this.CACHE_LEVELS.L1_CRITICAL :
                    entry.priority === 2 ? this.CACHE_LEVELS.L2_IMPORTANT :
                    this.CACHE_LEVELS.L3_PREFETCH;
      
      if (age < maxAge) healthyEntries++;
    });
    
    return this.cache.size > 0 ? healthyEntries / this.cache.size : 0;
  }

  /**
   * Limpia cache basado en prioridades y TTL
   */
  static cleanupCache(): void {
    const now = Date.now();
    
    this.cache.forEach((entry, key) => {
      const maxAge = entry.priority === 1 ? this.CACHE_LEVELS.L1_CRITICAL :
                    entry.priority === 2 ? this.CACHE_LEVELS.L2_IMPORTANT :
                    this.CACHE_LEVELS.L3_PREFETCH;
      
      if (now - entry.timestamp > maxAge) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Fuerza recarga de cache para datos críticos
   */
  static async forceReloadCritical(userId: string): Promise<void> {
    const criticalKeys = Array.from(this.cache.keys()).filter(key => 
      this.cache.get(key)?.priority === 1
    );
    
    criticalKeys.forEach(key => this.cache.delete(key));
    
    await this.preloadCriticalData(userId, {
      primaryTest: 'COMPETENCIA_LECTORA',
      targetAreas: ['lectura']
    });
  }
}
