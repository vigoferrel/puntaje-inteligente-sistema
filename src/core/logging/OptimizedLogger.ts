
/**
 * Sistema de logging v10.0 - ULTRA SILENCIOSO
 * Solo errores REALMENTE críticos que afecten funcionalidad
 */

class OptimizedLogger {
  private static instance: OptimizedLogger;
  private isProduction = process.env.NODE_ENV === 'production';
  private logBuffer: Array<{ level: string; module: string; message: string; timestamp: number }> = [];
  private maxBufferSize = 3; // EXTREMADAMENTE reducido
  private lastFlush = Date.now();
  private flushInterval = 7200000; // 2 HORAS
  private silentMode = true;
  private spamFilter = new Set<string>(); // Filtro de spam
  private logCounts = new Map<string, number>(); // Contador de logs repetidos

  static getInstance(): OptimizedLogger {
    if (!OptimizedLogger.instance) {
      OptimizedLogger.instance = new OptimizedLogger();
    }
    return OptimizedLogger.instance;
  }

  private constructor() {
    // Solo capturar errores que REALMENTE rompan funcionalidad
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        // Solo errores que afecten UI o carga
        if (event.message && (
          event.message.includes('Failed to fetch') ||
          event.message.includes('Cannot resolve module') ||
          event.message.includes('ReferenceError') ||
          event.message.includes('TypeError: Cannot read')
        )) {
          this.critical('Global', `Error crítico UI: ${event.message}`);
        }
      });

      window.addEventListener('unhandledrejection', (event) => {
        // Solo rechazos que afecten funcionalidad core
        if (event.reason && (
          event.reason.toString().includes('network') ||
          event.reason.toString().includes('fetch') ||
          event.reason.toString().includes('authentication')
        )) {
          this.critical('Promise', `Rechazo crítico: ${event.reason}`);
        }
      });
    }

    // Limpiar filtros cada 30 minutos
    setInterval(() => {
      this.spamFilter.clear();
      this.logCounts.clear();
    }, 1800000);
  }

  private isSpam(message: string): boolean {
    // Filtros de spam específicos
    const spamPatterns = [
      'Tracking Prevention',
      'storage',
      'localStorage',
      'Circuit Breaker',
      'CardiovascularSystem',
      'Anti-tracking',
      'useIntersectionalGuard',
      'Network request failed'
    ];

    if (spamPatterns.some(pattern => message.includes(pattern))) {
      return true;
    }

    // Contar mensajes repetidos
    const count = this.logCounts.get(message) || 0;
    this.logCounts.set(message, count + 1);
    
    // Spam si se repite más de 2 veces
    return count >= 2;
  }

  private shouldLog(level: string, message: string): boolean {
    // SOLO críticos
    if (level !== 'critical') {
      return false;
    }

    // Filtrar spam
    if (this.isSpam(message)) {
      return false;
    }

    // Filtrar por unicidad
    if (this.spamFilter.has(message)) {
      return false;
    }

    this.spamFilter.add(message);
    return true;
  }

  private addToBuffer(level: string, module: string, message: string) {
    if (!this.shouldLog(level, message)) return;

    this.logBuffer.push({
      level,
      module,
      message,
      timestamp: Date.now()
    });

    // Buffer EXTREMADAMENTE pequeño
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
    }

    // Flush inmediato solo para críticos únicos
    if (level === 'critical') {
      this.flushBuffer();
    }
  }

  private flushBuffer() {
    if (this.logBuffer.length === 0) return;

    // Solo mostrar críticos únicos
    this.logBuffer.forEach(log => {
      if (log.level === 'critical') {
        console.error(`[${log.module}] ${log.message}`);
      }
    });

    this.logBuffer = [];
    this.lastFlush = Date.now();
  }

  // Métodos públicos - TODOS ULTRA-SILENCIOSOS
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
    // Solo errores que realmente afecten funcionalidad
    if (message.includes('Failed to initialize') || 
        message.includes('Component crash') ||
        message.includes('Authentication failed')) {
      this.addToBuffer('error', module, message);
    }
  }

  critical(module: string, message: string, data?: any) {
    // Solo si realmente es crítico para funcionalidad
    if (!this.isSpam(message)) {
      this.addToBuffer('critical', module, message);
    }
  }

  // Configuración
  enableUltraSilentMode() {
    this.silentMode = true;
    this.maxBufferSize = 1; // Solo 1 log crítico
  }

  disableSilentMode() {
    this.silentMode = false;
    this.maxBufferSize = 5;
  }

  getLogs() {
    return [...this.logBuffer];
  }

  clearLogs() {
    this.logBuffer = [];
    this.spamFilter.clear();
    this.logCounts.clear();
  }

  getSpamStats() {
    return {
      filteredMessages: this.spamFilter.size,
      repeatedMessages: this.logCounts.size,
      bufferSize: this.logBuffer.length
    };
  }
}

export const optimizedLogger = OptimizedLogger.getInstance();

// AUTO-CONFIGURAR ULTRA-SILENCIOSO
optimizedLogger.enableUltraSilentMode();
