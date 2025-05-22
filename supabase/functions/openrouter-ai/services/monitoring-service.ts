
/**
 * Niveles de severidad para el sistema de logging
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

/**
 * Configuración del nivel mínimo de log (puede ajustarse según el entorno)
 */
const MIN_LOG_LEVEL = LogLevel.INFO;

/**
 * Métricas para monitoreo de rendimiento
 */
interface PerformanceMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  totalLatencyMs: number;
  modelUsage: Record<string, number>;
  lastRequestTime?: number;
  avgLatencyMs: number;
}

// Objeto para mantener métricas en memoria
const metrics: PerformanceMetrics = {
  requestCount: 0,
  successCount: 0,
  errorCount: 0,
  totalLatencyMs: 0,
  modelUsage: {},
  avgLatencyMs: 0
};

/**
 * Servicio para monitoreo y logging centralizado
 */
export class MonitoringService {
  /**
   * Registra un mensaje en el log si supera el nivel mínimo configurado
   */
  static log(level: LogLevel, message: string, data?: any): void {
    if (level < MIN_LOG_LEVEL) return;
    
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    
    const logEntry = {
      timestamp,
      level: levelName,
      message,
      data
    };
    
    // Imprimir el log con formato adecuado según nivel
    if (level >= LogLevel.ERROR) {
      console.error(JSON.stringify(logEntry));
    } else if (level === LogLevel.WARN) {
      console.warn(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }
  }
  
  /**
   * Métodos de conveniencia para los diferentes niveles
   */
  static debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }
  
  static info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }
  
  static warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }
  
  static error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }
  
  static critical(message: string, data?: any): void {
    this.log(LogLevel.CRITICAL, message, data);
  }
  
  /**
   * Inicia el tracking de una solicitud
   */
  static startRequest(modelName?: string): number {
    const requestTime = Date.now();
    metrics.requestCount++;
    metrics.lastRequestTime = requestTime;
    
    if (modelName) {
      metrics.modelUsage[modelName] = (metrics.modelUsage[modelName] || 0) + 1;
    }
    
    return requestTime;
  }
  
  /**
   * Finaliza y registra métricas de una solicitud
   */
  static endRequest(startTime: number, success: boolean): void {
    const duration = Date.now() - startTime;
    
    metrics.totalLatencyMs += duration;
    metrics.avgLatencyMs = metrics.totalLatencyMs / metrics.requestCount;
    
    if (success) {
      metrics.successCount++;
    } else {
      metrics.errorCount++;
    }
    
    // Log performance metrics para solicitudes lentas (>5 segundos)
    if (duration > 5000) {
      this.warn(`Solicitud lenta detectada: ${duration}ms`, { 
        duration, 
        success 
      });
    }
  }
  
  /**
   * Obtiene estadísticas actuales
   */
  static getMetrics(): PerformanceMetrics {
    return { ...metrics };
  }
  
  /**
   * Registra una excepción con contexto adicional
   */
  static logException(error: Error, context?: Record<string, any>): void {
    this.error(`Exception: ${error.message}`, {
      stack: error.stack,
      name: error.name,
      context
    });
  }
}
