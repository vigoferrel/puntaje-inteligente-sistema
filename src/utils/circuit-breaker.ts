
/**
 * Implementación de Circuit Breaker para prevenir llamadas repetidas a servicios fallidos
 * y proporcionar un mecanismo de recuperación automática.
 */
interface CircuitBreakerOptions {
  failureThreshold: number;   // Número de fallos antes de abrir el circuito
  resetTimeout: number;       // Tiempo en ms antes de intentar cerrar el circuito
  onOpen?: () => void;        // Callback cuando el circuito se abre
  onClose?: () => void;       // Callback cuando el circuito se cierra
}

enum CircuitState {
  CLOSED,   // Operación normal, las solicitudes pasan
  OPEN,     // No se permiten solicitudes
  HALF_OPEN // Modo de prueba, se permite una solicitud
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private nextAttemptTime: number = 0;
  private readonly options: CircuitBreakerOptions;

  constructor(options: CircuitBreakerOptions) {
    this.options = {
      failureThreshold: 3,
      resetTimeout: 30000, // 30 segundos por defecto
      ...options
    };
  }

  /**
   * Registra una operación exitosa
   */
  public success(): void {
    this.failureCount = 0;
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.CLOSED;
      if (this.options.onClose) {
        this.options.onClose();
      }
    }
  }

  /**
   * Registra una operación fallida y potencialmente abre el circuito
   */
  public failure(): void {
    this.failureCount++;

    if (this.failureCount >= this.options.failureThreshold || 
        this.state === CircuitState.HALF_OPEN) {
      
      this.open();
    }
  }

  /**
   * Verifica si el circuito está abierto
   */
  public isOpen(): boolean {
    if (this.state === CircuitState.HALF_OPEN) {
      return false;
    }
    
    if (this.state === CircuitState.OPEN) {
      const now = Date.now();
      
      // Si ha pasado el tiempo de espera, cambiar a medio-abierto
      if (now >= this.nextAttemptTime) {
        this.state = CircuitState.HALF_OPEN;
        return false;
      }
      
      return true;
    }
    
    return false;
  }

  /**
   * Abre manualmente el circuito
   */
  private open(): void {
    if (this.state !== CircuitState.OPEN) {
      this.state = CircuitState.OPEN;
      this.nextAttemptTime = Date.now() + this.options.resetTimeout;
      
      if (this.options.onOpen) {
        this.options.onOpen();
      }
    }
  }

  /**
   * Resetea el estado del circuito a cerrado
   */
  public reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    
    if (this.options.onClose) {
      this.options.onClose();
    }
  }
  
  /**
   * Estado actual del circuito
   */
  public getState(): string {
    switch (this.state) {
      case CircuitState.CLOSED:
        return 'closed';
      case CircuitState.OPEN:
        return 'open';
      case CircuitState.HALF_OPEN:
        return 'half-open';
    }
  }
}
