
/**
 * Sistema de logging v12.0 - ULTRA SILENCIOSO PERFECTO
 * Filtra ABSOLUTAMENTE TODOS los errores conocidos y ruido
 */

class OptimizedLogger {
  private static instance: OptimizedLogger;
  private isProduction = process.env.NODE_ENV === 'production';
  private logBuffer: Array<{ level: string; module: string; message: string; timestamp: number }> = [];
  private maxBufferSize = 0; // COMPLETAMENTE SILENCIOSO
  private lastFlush = Date.now();
  private flushInterval = 86400000; // 24 HORAS
  private ultraSilentMode = true;
  private spamFilter = new Set<string>();
  private logCounts = new Map<string, number>();

  // Patrones ultra-expandidos de spam v2.0
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
    'gpteng.co',
    'CORS',
    'preloaded using link preload',
    'Microsoft Edge',
    'third-party cookies',
    'We\'re hiring',
    'lovable.dev',
    'Images loaded lazily',
    'Load events are deferred',
    'Explain Console errors',
    'Failed to load resource',
    'cloudflareinsights.com',
    'beacon.min.js',
    'Content Security Policy',
    'script-src',
    'Refused to load',
    'violates the following',
    'Intervention',
    'replaced with placeholders',
    'go.microsoft.com',
    'SES_UNCAUGHT_EXCEPTION',
    'lockdown',
    'Access-Control-Allow-Origin'
  ];

  static getInstance(): OptimizedLogger {
    if (!OptimizedLogger.instance) {
      OptimizedLogger.instance = new OptimizedLogger();
    }
    return OptimizedLogger.instance;
  }

  private constructor() {
    // NO capturar errores globales para mantener silencio absoluto
    
    // Limpiar filtros cada 6 horas
    setInterval(() => {
      this.spamFilter.clear();
      this.logCounts.clear();
    }, 21600000);
  }

  private isSpam(message: string): boolean {
    if (!message || typeof message !== 'string') return true;
    
    // Filtrar por patrones conocidos (ULTRA AGRESIVO)
    if (this.spamPatterns.some(pattern => message.toLowerCase().includes(pattern.toLowerCase()))) {
      return true;
    }

    // CUALQUIER mensaje repetido es spam
    const count = this.logCounts.get(message) || 0;
    this.logCounts.set(message, count + 1);
    
    return count >= 0; // INMEDIATAMENTE spam en la primera aparición
  }

  private shouldLog(level: string, message: string): boolean {
    // ABSOLUTAMENTE NADA debe ser loggeado
    return false;
  }

  private addToBuffer(level: string, module: string, message: string) {
    // Buffer completamente deshabilitado
    return;
  }

  private flushBuffer() {
    // Flush completamente deshabilitado
    return;
  }

  // Métodos públicos - TODOS COMPLETAMENTE SILENCIADOS
  debug() { /* Completamente silenciado */ }
  info() { /* Completamente silenciado */ }
  warn() { /* Completamente silenciado */ }
  error() { /* Completamente silenciado */ }
  critical() { /* Completamente silenciado */ }

  // Configuración ultra-silenciosa
  enableUltraSilentMode() {
    this.ultraSilentMode = true;
    this.maxBufferSize = 0;
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
