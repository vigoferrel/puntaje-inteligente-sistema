
/**
 * Sistema de logging v9.0 - SILENCIOSO POR DEFECTO
 * Solo errores críticos y funcionalidad mínima
 */
class OptimizedLogger {
  private static instance: OptimizedLogger;
  private isProduction = process.env.NODE_ENV === 'production';
  private logBuffer: Array<{ level: string; module: string; message: string; timestamp: number }> = [];
  private maxBufferSize = 10; // DRASTICAMENTE REDUCIDO
  private lastFlush = Date.now();
  private flushInterval = 3600000; // 1 HORA
  private silentMode = true; // SILENCIOSO POR DEFECTO

  static getInstance(): OptimizedLogger {
    if (!OptimizedLogger.instance) {
      OptimizedLogger.instance = new OptimizedLogger();
    }
    return OptimizedLogger.instance;
  }

  private constructor() {
    // Solo capturar errores REALMENTE críticos
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        // Solo errores que afecten funcionalidad core
        if (event.message && event.message.includes('CardiovascularSystem')) {
          this.critical('Global', `Sistema cardiovascular: ${event.message}`);
        }
      });

      window.addEventListener('unhandledrejection', (event) => {
        // Solo rechazos críticos
        if (event.reason && event.reason.toString().includes('critical')) {
          this.critical('Promise', `Rechazo crítico: ${event.reason}`);
        }
      });
    }
  }

  private shouldLog(level: string): boolean {
    // SOLO errores críticos
    if (this.silentMode) {
      return level === 'critical';
    }
    
    // En desarrollo, solo critical y error
    return level === 'critical' || level === 'error';
  }

  private addToBuffer(level: string, module: string, message: string) {
    if (!this.shouldLog(level)) return;

    this.logBuffer.push({
      level,
      module,
      message,
      timestamp: Date.now()
    });

    // Buffer MUY pequeño
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
    }

    // Flush solo en críticos
    if (level === 'critical') {
      this.flushBuffer();
    }
  }

  private flushBuffer() {
    if (this.logBuffer.length === 0) return;

    // Solo mostrar críticos
    const criticalLogs = this.logBuffer.filter(log => log.level === 'critical');

    criticalLogs.forEach(log => {
      console.error(`[${log.module}] ${log.message}`);
    });

    this.logBuffer = [];
    this.lastFlush = Date.now();
  }

  // Métodos públicos - MAYORÍA SILENCIOSOS
  debug(module: string, message: string) {
    // Completamente silenciado
  }

  info(module: string, message: string) {
    // Completamente silenciado
  }

  warn(module: string, message: string) {
    // Completamente silenciado
  }

  error(module: string, message: string, data?: any) {
    // Solo si no es spam de tracking
    if (!message.includes('Tracking Prevention') && !message.includes('storage')) {
      this.addToBuffer('error', module, message);
    }
  }

  critical(module: string, message: string, data?: any) {
    this.addToBuffer('critical', module, message);
  }

  // Métodos de configuración
  enableSilentMode() {
    this.silentMode = true;
  }

  disableSilentMode() {
    this.silentMode = false;
  }

  getLogs() {
    return [...this.logBuffer];
  }

  clearLogs() {
    this.logBuffer = [];
  }
}

export const optimizedLogger = OptimizedLogger.getInstance();

// AUTO-CONFIGURAR MODO SILENCIOSO
optimizedLogger.enableSilentMode();
