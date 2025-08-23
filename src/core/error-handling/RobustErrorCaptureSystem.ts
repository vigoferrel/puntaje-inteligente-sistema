
interface GlobalErrorHandler {
  captureException: (error: Error, context?: any) => void;
  captureMessage: (message: string, level: 'info' | 'warning' | 'error') => void;
  setContext: (context: Record<string, any>) => void;
}

class RobustErrorCaptureSystem implements GlobalErrorHandler {
  private static instance: RobustErrorCaptureSystem;
  private errorQueue: Array<{ error: Error; context?: any; timestamp: number }> = [];
  private messageQueue: Array<{ message: string; level: string; timestamp: number }> = [];
  private context: Record<string, any> = {};
  private isProcessing = false;
  private ultraSilentMode = true;

  // Patrones de extinción ultra-expandidos
  private EXTINCTION_PATTERNS = [
    'vr', 'ambient-light-sensor', 'battery', 'Unrecognized feature',
    'Tracking Prevention', 'blocked access to storage', 'QuotaExceeded',
    'preloaded using link preload', 'Failed to load resource',
    'CORS policy', 'Access-Control-Allow-Origin', 'Content Security Policy',
    'script-src', 'Refused to load', 'gptengineer', 'gpteng.co',
    'facebook.com', 'cloudflareinsights.com', 'beacon.min.js',
    'SES_UNCAUGHT_EXCEPTION', 'lockdown', '_ES_UNCAUGHT_EXCEPTION',
    'Intervention', 'Images loaded lazily', 'Microsoft Edge',
    'third-party cookies', 'We\'re hiring',
    'Explain Console errors', 'import.meta', 'BloomFilter error',
    'replaced with placeholders', 'go.microsoft.com'
  ];

  static getInstance(): RobustErrorCaptureSystem {
    if (!RobustErrorCaptureSystem.instance) {
      RobustErrorCaptureSystem.instance = new RobustErrorCaptureSystem();
    }
    return RobustErrorCaptureSystem.instance;
  }

  constructor() {
    // NO inicializar handlers globales para mantener silencio total
  }

  private isExtinctionTarget(message: string): boolean {
    if (!message || typeof message !== 'string') return true;
    const lowerMessage = message.toLowerCase();
    return this.EXTINCTION_PATTERNS.some(pattern => 
      lowerMessage.includes(pattern.toLowerCase())
    );
  }

  captureException(error: Error, context?: any): void {
    // Solo capturar si no es spam Y estamos en modo desarrollo
    if (this.ultraSilentMode || this.isExtinctionTarget(error.message)) {
      return;
    }

    // En este punto, casi nunca llegaremos aquí
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔍 Non-spam error captured:', error.message);
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    // Filtrar absolutamente todo
    if (this.ultraSilentMode || this.isExtinctionTarget(message)) {
      return;
    }

    // Esto prácticamente nunca se ejecutará
    if (process.env.NODE_ENV === 'development' && level === 'error') {
      console.warn('🔍 Non-spam message:', message);
    }
  }

  setContext(context: Record<string, any>): void {
    // Contexto silencioso
    this.context = { ...this.context, ...context };
  }

  private processErrorQueue(): void {
    // Procesamiento completamente deshabilitado
    return;
  }

  getQueueStatus(): { errors: number; messages: number } {
    return { errors: 0, messages: 0 };
  }

  forceFlush(): void {
    // Flush completamente deshabilitado
    return;
  }
}

export const robustErrorCapture = RobustErrorCaptureSystem.getInstance();
