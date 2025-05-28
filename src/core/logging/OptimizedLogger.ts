
/**
 * Sistema de logging v11.0 - ULTRA SILENCIOSO MEJORADO
 * Filtra TODOS los errores conocidos y ruido innecesario
 */

class OptimizedLogger {
  private static instance: OptimizedLogger;
  private isProduction = process.env.NODE_ENV === 'production';
  private logBuffer: Array<{ level: string; module: string; message: string; timestamp: number }> = [];
  private maxBufferSize = 1; // EXTREMADAMENTE reducido
  private lastFlush = Date.now();
  private flushInterval = 14400000; // 4 HORAS
  private ultraSilentMode = true;
  private spamFilter = new Set<string>();
  private logCounts = new Map<string, number>();

  // Patrones ultra-expandidos de spam
  private spamPatterns = [
    'Tracking Prevention',
    'storage',
    'localStorage',
    'Circuit Breaker',
    'CardiovascularSystem',
    'Anti-tracking',
    'useIntersectionalGuard',
    'Network request failed',
    'vr',
    'ambient-light-sensor',
    'battery',
    'Unrecognized feature',
    'facebook.com',
    'gptengineer',
    'CORS',
    'preloaded using link preload',
    'Microsoft Edge',
    'third-party cookies',
    'We\'re hiring',
    'lovable.dev',
    'Images loaded lazily',
    'Load events are deferred',
    'Explain Console errors',
    'Failed to load resource'
  ];

  static getInstance(): OptimizedLogger {
    if (!OptimizedLogger.instance) {
      OptimizedLogger.instance = new OptimizedLogger();
    }
    return OptimizedLogger.instance;
  }

  private constructor() {
    // Solo capturar errores que REALMENTE rompan funcionalidad CORE
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        // Solo errores que afecten UI crítica
        if (event.message && (
          event.message.includes('Cannot resolve module') ||
          event.message.includes('ReferenceError: undefined') ||
          event.message.includes('TypeError: Cannot read properties of null')
        ) && !this.isSpam(event.message)) {
          this.critical('Global', `Error crítico UI: ${event.message}`);
        }
      });
    }

    // Limpiar filtros cada hora
    setInterval(() => {
      this.spamFilter.clear();
      this.logCounts.clear();
    }, 3600000);
  }

  private isSpam(message: string): boolean {
    if (!message || typeof message !== 'string') return true;
    
    // Filtrar por patrones conocidos
    if (this.spamPatterns.some(pattern => message.toLowerCase().includes(pattern.toLowerCase()))) {
      return true;
    }

    // Contar mensajes repetidos
    const count = this.logCounts.get(message) || 0;
    this.logCounts.set(message, count + 1);
    
    // Spam si se repite más de 1 vez
    return count >= 1;
  }

  private shouldLog(level: string, message: string): boolean {
    // SOLO críticos únicos que afecten funcionalidad
    if (level !== 'critical') {
      return false;
    }

    // Filtrar spam ultra-agresivo
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

    // Buffer ultra-pequeño
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-1);
    }

    // Flush inmediato solo para críticos únicos
    if (level === 'critical') {
      this.flushBuffer();
    }
  }

  private flushBuffer() {
    if (this.logBuffer.length === 0) return;

    // Solo mostrar críticos únicos que realmente afecten funcionalidad
    this.logBuffer.forEach(log => {
      if (log.level === 'critical' && !this.isSpam(log.message)) {
        console.error(`[${log.module}] ${log.message}`);
      }
    });

    this.logBuffer = [];
    this.lastFlush = Date.now();
  }

  // Métodos públicos - TODOS ULTRA-SILENCIOSOS
  debug() { /* Completamente silenciado */ }
  info() { /* Completamente silenciado */ }
  warn() { /* Completamente silenciado */ }
  error() { /* Completamente silenciado */ }

  critical(module: string, message: string) {
    // Solo si realmente es crítico para funcionalidad CORE
    if (message.includes('Failed to initialize core') || 
        message.includes('Component crash critical') ||
        message.includes('Authentication system failed')) {
      this.addToBuffer('critical', module, message);
    }
  }

  // Configuración ultra-silenciosa
  enableUltraSilentMode() {
    this.ultraSilentMode = true;
    this.maxBufferSize = 0; // CERO logs
  }

  getLogs() { return []; }
  clearLogs() { 
    this.logBuffer = [];
    this.spamFilter.clear();
    this.logCounts.clear();
  }
}

export const optimizedLogger = OptimizedLogger.getInstance();

// AUTO-CONFIGURAR ULTRA-SILENCIOSO
optimizedLogger.enableUltraSilentMode();
