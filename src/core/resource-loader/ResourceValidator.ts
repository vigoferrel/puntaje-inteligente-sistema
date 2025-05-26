
interface ResourceStatus {
  isLoaded: boolean;
  isLoading: boolean;
  error?: string;
  lastChecked: number;
}

class ResourceValidator {
  private static instance: ResourceValidator;
  private resourceCache = new Map<string, ResourceStatus>();
  private retryAttempts = new Map<string, number>();
  private maxRetries = 3;

  static getInstance(): ResourceValidator {
    if (!ResourceValidator.instance) {
      ResourceValidator.instance = new ResourceValidator();
    }
    return ResourceValidator.instance;
  }

  async validateResource(url: string): Promise<boolean> {
    const cached = this.resourceCache.get(url);
    const now = Date.now();
    
    // Si está en cache y es reciente (menos de 5 minutos)
    if (cached && (now - cached.lastChecked) < 300000) {
      return cached.isLoaded && !cached.error;
    }

    try {
      this.resourceCache.set(url, {
        isLoaded: false,
        isLoading: true,
        lastChecked: now
      });

      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors' // Evitar problemas de CORS
      });

      const isValid = response.ok || response.type === 'opaque';
      
      this.resourceCache.set(url, {
        isLoaded: isValid,
        isLoading: false,
        lastChecked: now
      });

      if (!isValid) {
        this.retryAttempts.set(url, (this.retryAttempts.get(url) || 0) + 1);
      } else {
        this.retryAttempts.delete(url);
      }

      return isValid;
    } catch (error) {
      this.resourceCache.set(url, {
        isLoaded: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: now
      });

      const attempts = (this.retryAttempts.get(url) || 0) + 1;
      this.retryAttempts.set(url, attempts);

      return false;
    }
  }

  shouldRetry(url: string): boolean {
    const attempts = this.retryAttempts.get(url) || 0;
    return attempts < this.maxRetries;
  }

  getResourceStatus(url: string): ResourceStatus | undefined {
    return this.resourceCache.get(url);
  }

  clearCache() {
    this.resourceCache.clear();
    this.retryAttempts.clear();
  }
}

export const resourceValidator = ResourceValidator.getInstance();
