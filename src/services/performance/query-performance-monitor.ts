
interface QueryMetrics {
  queryName: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  error?: string;
  rowCount?: number;
}

class QueryPerformanceMonitor {
  private static instance: QueryPerformanceMonitor;
  private metrics: QueryMetrics[] = [];
  private readonly maxMetrics = 1000;

  static getInstance(): QueryPerformanceMonitor {
    if (!QueryPerformanceMonitor.instance) {
      QueryPerformanceMonitor.instance = new QueryPerformanceMonitor();
    }
    return QueryPerformanceMonitor.instance;
  }

  /**
   * Wrapper para medir performance de consultas
   */
  async measureQuery<T>(
    queryName: string,
    queryFunction: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await queryFunction();
      const endTime = performance.now();
      
      this.recordMetric({
        queryName,
        startTime,
        endTime,
        duration: endTime - startTime,
        success: true,
        rowCount: Array.isArray(result) ? result.length : 1
      });
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      
      this.recordMetric({
        queryName,
        startTime,
        endTime,
        duration: endTime - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }

  private recordMetric(metric: QueryMetrics): void {
    this.metrics.push(metric);
    
    // Mantener solo las últimas métricas
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
    
    // Log de consultas lentas (>1000ms)
    if (metric.duration > 1000) {
      console.warn(`🐌 Slow query detected: ${metric.queryName} took ${metric.duration.toFixed(2)}ms`);
    }
  }

  /**
   * Obtiene estadísticas de performance
   */
  getPerformanceStats(): {
    totalQueries: number;
    averageDuration: number;
    slowQueries: number;
    successRate: number;
    recentMetrics: QueryMetrics[];
  } {
    if (this.metrics.length === 0) {
      return {
        totalQueries: 0,
        averageDuration: 0,
        slowQueries: 0,
        successRate: 0,
        recentMetrics: []
      };
    }

    const totalQueries = this.metrics.length;
    const successfulQueries = this.metrics.filter(m => m.success).length;
    const averageDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0) / totalQueries;
    const slowQueries = this.metrics.filter(m => m.duration > 1000).length;
    const successRate = (successfulQueries / totalQueries) * 100;

    return {
      totalQueries,
      averageDuration: Math.round(averageDuration * 100) / 100,
      slowQueries,
      successRate: Math.round(successRate * 100) / 100,
      recentMetrics: this.metrics.slice(-50) // Últimas 50 consultas
    };
  }

  /**
   * Limpia las métricas
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Exporta métricas para análisis
   */
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

export const queryPerformanceMonitor = QueryPerformanceMonitor.getInstance();
