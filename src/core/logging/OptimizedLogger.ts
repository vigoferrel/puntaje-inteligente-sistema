
/**
 * Sistema de logging optimizado - Reemplaza SimpleLogger y SystemLogger
 * Reducción masiva de console statements para mejorar performance
 */
class OptimizedLogger {
  private static instance: OptimizedLogger;
  private isProduction = process.env.NODE_ENV === 'production';
  private logBuffer: Array<{ level: string; module: string; message: string; timestamp: number }> = [];
  private maxBufferSize = 50; // Reducido drásticamente
  private lastFlush = Date.now();
  private flushInterval = 10000; // 10 segundos

  static getInstance(): OptimizedLogger {
    if (!OptimizedLogger.instance) {
      OptimizedLogger.instance = new OptimizedLogger();
    }
    return OptimizedLogger.instance;
  }

  private constructor() {
    // Solo capturar errores críticos
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.critical('Global', `${event.message} at ${event.filename}:${event.lineno}`);
      });
    }
  }

  private shouldLog(level: string): boolean {
    // En producción, solo errores críticos
    if (this.isProduction) {
      return level === 'error' || level === 'critical';
    }
    // En desarrollo, solo info, warn, error, critical
    return ['info', 'warn', 'error', 'critical'].includes(level);
  }

  private addToBuffer(level: string, module: string, message: string) {
    if (!this.shouldLog(level)) return;

    this.logBuffer.push({
      level,
      module,
      message,
      timestamp: Date.now()
    });

    // Mantener buffer pequeño
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
    }

    // Flush periódico o por nivel crítico
    if (level === 'critical' || level === 'error' || 
        (Date.now() - this.lastFlush > this.flushInterval)) {
      this.flushBuffer();
    }
  }

  private flushBuffer() {
    if (this.logBuffer.length === 0) return;

    // Solo mostrar en consola si es crítico
    const criticalLogs = this.logBuffer.filter(log => 
      log.level === 'critical' || log.level === 'error'
    );

    criticalLogs.forEach(log => {
      const method = log.level === 'critical' ? console.error : console.warn;
      method(`[${log.module}] ${log.message}`);
    });

    this.logBuffer = [];
    this.lastFlush = Date.now();
  }

  // Métodos públicos - Solo logging esencial
  debug(module: string, message: string) {
    // Debug completamente silenciado
  }

  info(module: string, message: string) {
    this.addToBuffer('info', module, message);
  }

  warn(module: string, message: string) {
    this.addToBuffer('warn', module, message);
  }

  error(module: string, message: string, data?: any) {
    this.addToBuffer('error', module, data ? `${message} ${JSON.stringify(data)}` : message);
  }

  critical(module: string, message: string, data?: any) {
    this.addToBuffer('critical', module, data ? `${message} ${JSON.stringify(data)}` : message);
  }

  // Método para obtener logs sin console.log
  getLogs() {
    return [...this.logBuffer];
  }

  // Limpieza manual
  clearLogs() {
    this.logBuffer = [];
  }
}

export const optimizedLogger = OptimizedLogger.getInstance();
