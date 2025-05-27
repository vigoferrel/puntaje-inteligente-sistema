
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

  static getInstance(): RobustErrorCaptureSystem {
    if (!RobustErrorCaptureSystem.instance) {
      RobustErrorCaptureSystem.instance = new RobustErrorCaptureSystem();
    }
    return RobustErrorCaptureSystem.instance;
  }

  constructor() {
    this.initializeGlobalHandlers();
  }

  private initializeGlobalHandlers(): void {
    // Reemplazar el sistema _ES_UNCAUGHT_EXCEPTION defectuoso
    window.addEventListener('error', (event) => {
      this.captureException(
        new Error(event.message || 'Unknown error'),
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          source: 'window.error'
        }
      );
    });

    // Capturar promesas rechazadas
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error 
        ? event.reason 
        : new Error(String(event.reason));
      
      this.captureException(error, {
        source: 'unhandledrejection',
        promise: true
      });
    });

    // Capturar errores de recursos (404, etc.)
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const target = event.target as HTMLElement;
        if (target.tagName) {
          this.captureMessage(
            `Resource failed to load: ${target.tagName} - ${(target as any).src || (target as any).href}`,
            'error'
          );
        }
      }
    }, true);
  }

  captureException(error: Error, context?: any): void {
    const errorEntry = {
      error,
      context: { ...this.context, ...context },
      timestamp: Date.now()
    };

    this.errorQueue.push(errorEntry);
    
    // Procesar inmediatamente errores críticos
    if (this.isCriticalError(error)) {
      this.processErrorQueue();
    } else {
      // Procesar en batch para errores normales
      this.scheduleProcessing();
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    this.messageQueue.push({
      message,
      level,
      timestamp: Date.now()
    });

    if (level === 'error') {
      this.scheduleProcessing();
    }
  }

  setContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
  }

  private isCriticalError(error: Error): boolean {
    return error.message.includes('ChunkLoadError') ||
           error.message.includes('Loading chunk') ||
           error.message.includes('Failed to fetch') ||
           error.name === 'ChunkLoadError';
  }

  private scheduleProcessing(): void {
    if (this.isProcessing) return;

    setTimeout(() => {
      this.processErrorQueue();
    }, 1000);
  }

  private processErrorQueue(): void {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // Procesar errores acumulados
      this.errorQueue.forEach(({ error, context, timestamp }) => {
        console.group(`🚨 Error capturado: ${error.name}`);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        console.log('Context:', context);
        console.log('Timestamp:', new Date(timestamp).toISOString());
        console.groupEnd();
      });

      // Procesar mensajes
      this.messageQueue.forEach(({ message, level, timestamp }) => {
        const logLevel = level === 'error' ? console.error : 
                        level === 'warning' ? console.warn : console.log;
        logLevel(`📋 ${level.toUpperCase()}: ${message} (${new Date(timestamp).toISOString()})`);
      });

      // Limpiar colas
      this.errorQueue = [];
      this.messageQueue = [];

    } finally {
      this.isProcessing = false;
    }
  }

  // Método para testing y debugging
  getQueueStatus(): { errors: number; messages: number } {
    return {
      errors: this.errorQueue.length,
      messages: this.messageQueue.length
    };
  }

  // Force flush para casos críticos
  forceFlush(): void {
    this.processErrorQueue();
  }
}

export const robustErrorCapture = RobustErrorCaptureSystem.getInstance();
