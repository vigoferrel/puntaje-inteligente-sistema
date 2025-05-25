
/**
 * Circuit Breaker más permisivo para evitar bloqueos indefinidos
 */
interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeout: number;
  maxConsecutiveFailures: number; // Nuevo: máximo de fallos consecutivos
  onOpen?: () => void;
  onClose?: () => void;
}

enum CircuitState {
  CLOSED,
  OPEN,
  HALF_OPEN
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private consecutiveFailures: number = 0;
  private nextAttemptTime: number = 0;
  private readonly options: CircuitBreakerOptions;

  constructor(options: CircuitBreakerOptions) {
    this.options = {
      failureThreshold: 5,        // Más permisivo
      resetTimeout: 10000,        // Timeout más corto
      maxConsecutiveFailures: 3,  // Límite de fallos consecutivos
      ...options
    };
  }

  public success(): void {
    this.failureCount = 0;
    this.consecutiveFailures = 0;
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.CLOSED;
      if (this.options.onClose) {
        this.options.onClose();
      }
    }
  }

  public failure(): void {
    this.failureCount++;
    this.consecutiveFailures++;

    // Abrir circuito solo si excedemos ambos límites
    if (this.failureCount >= this.options.failureThreshold && 
        this.consecutiveFailures >= this.options.maxConsecutiveFailures) {
      this.open();
    }
  }

  public isOpen(): boolean {
    if (this.state === CircuitState.HALF_OPEN) {
      return false;
    }
    
    if (this.state === CircuitState.OPEN) {
      const now = Date.now();
      
      if (now >= this.nextAttemptTime) {
        this.state = CircuitState.HALF_OPEN;
        return false;
      }
      
      return true;
    }
    
    return false;
  }

  private open(): void {
    if (this.state !== CircuitState.OPEN) {
      this.state = CircuitState.OPEN;
      this.nextAttemptTime = Date.now() + this.options.resetTimeout;
      
      if (this.options.onOpen) {
        this.options.onOpen();
      }
    }
  }

  public reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.consecutiveFailures = 0;
    
    if (this.options.onClose) {
      this.options.onClose();
    }
  }
  
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

  // Método para forzar el cierre en emergencias
  public forceClose(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.consecutiveFailures = 0;
  }
}
