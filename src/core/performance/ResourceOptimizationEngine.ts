
/**
 * RESOURCE OPTIMIZATION ENGINE v1.0
 * Sistema inteligente de optimización de recursos
 */

interface ResourceItem {
  url: string;
  type: 'script' | 'style' | 'image' | 'font' | 'module';
  priority: 'critical' | 'high' | 'medium' | 'low';
  used: boolean;
  loadTime?: number;
  size?: number;
}

interface OptimizationMetrics {
  totalResources: number;
  unusedResources: number;
  totalSize: number;
  unusedSize: number;
  loadTime: number;
}

class ResourceOptimizationEngine {
  private static instance: ResourceOptimizationEngine;
  private resources = new Map<string, ResourceItem>();
  private unusedResources = new Set<string>();
  private preloadedResources = new Set<string>();
  private intersectionObserver?: IntersectionObserver;

  static getInstance(): ResourceOptimizationEngine {
    if (!ResourceOptimizationEngine.instance) {
      ResourceOptimizationEngine.instance = new ResourceOptimizationEngine();
    }
    return ResourceOptimizationEngine.instance;
  }

  private constructor() {
    this.setupResourceMonitoring();
    this.setupIntersectionObserver();
    this.startPeriodicCleanup();
  }

  private setupResourceMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitorear recursos preloaded que no se usan
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.detectUnusedPreloadedResources();
      }, 5000);
    });

    // Monitorear performance de recursos
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource') {
              this.trackResourceUsage(entry as PerformanceResourceTiming);
            }
          }
        });
        observer.observe({ entryTypes: ['resource'] });
      } catch (error) {
        // PerformanceObserver no soportado
      }
    }
  }

  private setupIntersectionObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            this.markResourceAsUsed(element.dataset.resourceUrl || '');
          }
        });
      },
      { threshold: 0.1 }
    );
  }

  private detectUnusedPreloadedResources(): void {
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    
    preloadLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !this.isResourceUsed(href)) {
        this.unusedResources.add(href);
        
        // Remover preload no utilizado
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      }
    });
  }

  private trackResourceUsage(entry: PerformanceResourceTiming): void {
    const resource: ResourceItem = {
      url: entry.name,
      type: this.getResourceType(entry.name),
      priority: this.getResourcePriority(entry.name),
      used: true,
      loadTime: entry.duration,
      size: entry.transferSize || 0
    };

    this.resources.set(entry.name, resource);
  }

  private getResourceType(url: string): ResourceItem['type'] {
    if (url.includes('.js') || url.includes('script')) return 'script';
    if (url.includes('.css') || url.includes('style')) return 'style';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.svg')) return 'image';
    if (url.includes('.woff') || url.includes('.ttf')) return 'font';
    return 'module';
  }

  private getResourcePriority(url: string): ResourceItem['priority'] {
    if (url.includes('critical') || url.includes('main')) return 'critical';
    if (url.includes('important') || url.includes('core')) return 'high';
    if (url.includes('optional') || url.includes('lazy')) return 'low';
    return 'medium';
  }

  markResourceAsUsed(url: string): void {
    const resource = this.resources.get(url);
    if (resource) {
      resource.used = true;
      this.unusedResources.delete(url);
    }
  }

  isResourceUsed(url: string): boolean {
    const resource = this.resources.get(url);
    return resource ? resource.used : false;
  }

  // Preload inteligente solo para recursos críticos
  intelligentPreload(urls: string[], priority: ResourceItem['priority'] = 'medium'): void {
    if (priority === 'low') return; // No preload para baja prioridad

    urls.forEach((url) => {
      if (!this.preloadedResources.has(url) && !this.unusedResources.has(url)) {
        this.createPreloadLink(url, priority);
        this.preloadedResources.add(url);
      }
    });
  }

  private createPreloadLink(url: string, priority: ResourceItem['priority']): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = this.getPreloadAs(url);
    
    if (priority === 'critical') {
      link.setAttribute('importance', 'high');
    }
    
    // Auto-remover después de un tiempo si no se usa
    setTimeout(() => {
      if (!this.isResourceUsed(url) && link.parentNode) {
        link.parentNode.removeChild(link);
        this.unusedResources.add(url);
      }
    }, 10000);
    
    document.head.appendChild(link);
  }

  private getPreloadAs(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'style';
    if (url.includes('.woff') || url.includes('.ttf')) return 'font';
    if (url.includes('.png') || url.includes('.jpg')) return 'image';
    return 'fetch';
  }

  private startPeriodicCleanup(): void {
    setInterval(() => {
      this.cleanupUnusedResources();
    }, 60000); // Cada minuto
  }

  private cleanupUnusedResources(): void {
    // Remover recursos no utilizados de la cache
    for (const url of this.unusedResources) {
      if ('caches' in window) {
        caches.open('resource-cache').then(cache => {
          cache.delete(url);
        });
      }
    }

    // Limpiar recursos antiguos del tracking
    const oneHourAgo = Date.now() - 3600000;
    for (const [url, resource] of this.resources.entries()) {
      if (!resource.used && resource.loadTime && resource.loadTime < oneHourAgo) {
        this.resources.delete(url);
      }
    }
  }

  getOptimizationMetrics(): OptimizationMetrics {
    const resources = Array.from(this.resources.values());
    const unusedCount = this.unusedResources.size;
    const totalSize = resources.reduce((sum, r) => sum + (r.size || 0), 0);
    const unusedSize = Array.from(this.unusedResources).reduce((sum, url) => {
      const resource = this.resources.get(url);
      return sum + (resource?.size || 0);
    }, 0);

    return {
      totalResources: resources.length,
      unusedResources: unusedCount,
      totalSize,
      unusedSize,
      loadTime: resources.reduce((sum, r) => sum + (r.loadTime || 0), 0)
    };
  }

  // Observar elementos para lazy loading
  observeElement(element: HTMLElement, resourceUrl: string): void {
    if (this.intersectionObserver) {
      element.dataset.resourceUrl = resourceUrl;
      this.intersectionObserver.observe(element);
    }
  }

  // Desconectar observador
  disconnect(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

export const resourceOptimizer = ResourceOptimizationEngine.getInstance();
