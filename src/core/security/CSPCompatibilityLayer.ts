
/**
 * CSP COMPATIBILITY LAYER v1.0
 * Sistema para manejar violaciones de Content Security Policy
 */

interface CSPResource {
  url: string;
  type: 'script' | 'style' | 'image' | 'font';
  fallback?: string;
  critical: boolean;
}

interface CSPViolation {
  url: string;
  directive: string;
  timestamp: number;
}

class CSPCompatibilityLayer {
  private static instance: CSPCompatibilityLayer;
  private violations: CSPViolation[] = [];
  private blockedResources = new Set<string>();
  private fallbackMap = new Map<string, string>();

  static getInstance(): CSPCompatibilityLayer {
    if (!CSPCompatibilityLayer.instance) {
      CSPCompatibilityLayer.instance = new CSPCompatibilityLayer();
    }
    return CSPCompatibilityLayer.instance;
  }

  private constructor() {
    this.setupCSPViolationHandler();
    this.initializeFallbacks();
  }

  private setupCSPViolationHandler(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('securitypolicyviolation', (event) => {
        this.handleCSPViolation({
          url: event.blockedURI,
          directive: event.violatedDirective,
          timestamp: Date.now()
        });
      });
    }
  }

  private handleCSPViolation(violation: CSPViolation): void {
    this.violations.push(violation);
    this.blockedResources.add(violation.url);
    
    // Mantener solo las últimas 50 violaciones
    if (this.violations.length > 50) {
      this.violations = this.violations.slice(-50);
    }

    // Activar fallback si está disponible
    const fallback = this.fallbackMap.get(violation.url);
    if (fallback) {
      this.loadFallbackResource(fallback);
    }
  }

  private initializeFallbacks(): void {
    // Fallbacks para recursos comunes que pueden ser bloqueados
    this.fallbackMap.set(
      'https://static.cloudflareinsights.com/beacon.min.js',
      '/fallbacks/analytics-fallback.js'
    );
    
    this.fallbackMap.set(
      'https://www.googletagmanager.com/gtag/js',
      '/fallbacks/gtag-fallback.js'
    );
  }

  private loadFallbackResource(fallbackUrl: string): void {
    try {
      if (fallbackUrl.endsWith('.js')) {
        const script = document.createElement('script');
        script.src = fallbackUrl;
        script.async = true;
        script.onerror = () => {
          // Fallback también falló, crear stub
          this.createResourceStub(fallbackUrl);
        };
        document.head.appendChild(script);
      }
    } catch (error) {
      // Error cargando fallback
    }
  }

  private createResourceStub(resourceUrl: string): void {
    // Crear stubs para funciones que podrían estar bloqueadas
    if (resourceUrl.includes('analytics') || resourceUrl.includes('gtag')) {
      (window as any).gtag = (window as any).gtag || function() {
        // Stub silencioso para analytics
      };
    }
  }

  isResourceBlocked(url: string): boolean {
    return this.blockedResources.has(url);
  }

  getViolations(): CSPViolation[] {
    return [...this.violations];
  }

  clearViolations(): void {
    this.violations = [];
    this.blockedResources.clear();
  }

  // Método para cargar recursos de forma segura
  safeLoadResource(resource: CSPResource): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isResourceBlocked(resource.url)) {
        if (resource.fallback) {
          this.loadFallbackResource(resource.fallback);
        }
        resolve(false);
        return;
      }

      try {
        if (resource.type === 'script') {
          const script = document.createElement('script');
          script.src = resource.url;
          script.async = true;
          script.onload = () => resolve(true);
          script.onerror = () => {
            this.blockedResources.add(resource.url);
            if (resource.fallback) {
              this.loadFallbackResource(resource.fallback);
            }
            resolve(false);
          };
          document.head.appendChild(script);
        }
      } catch (error) {
        resolve(false);
      }
    });
  }
}

export const cspCompatibility = CSPCompatibilityLayer.getInstance();
