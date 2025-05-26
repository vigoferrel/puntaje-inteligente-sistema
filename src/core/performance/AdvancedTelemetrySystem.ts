
interface UserExperienceMetric {
  type: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'TTI';
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface PerformanceInsight {
  category: 'loading' | 'interactivity' | 'visual_stability' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  impact: number; // 1-10
}

class AdvancedTelemetrySystem {
  private static instance: AdvancedTelemetrySystem;
  private metrics: UserExperienceMetric[] = [];
  private insights: PerformanceInsight[] = [];
  private observer: PerformanceObserver | null = null;

  static getInstance(): AdvancedTelemetrySystem {
    if (!AdvancedTelemetrySystem.instance) {
      AdvancedTelemetrySystem.instance = new AdvancedTelemetrySystem();
    }
    return AdvancedTelemetrySystem.instance;
  }

  initialize(): void {
    this.setupPerformanceObserver();
    this.setupCoreWebVitalsTracking();
    this.setupUserInteractionTracking();
    this.setupErrorTracking();
    this.startContinuousAnalysis();
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.processPerformanceEntry(entry);
        });
      });

      // Observar múltiples tipos de entradas
      try {
        this.observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (error) {
        console.warn('Some performance metrics not supported:', error);
      }
    }
  }

  private setupCoreWebVitalsTracking(): void {
    // First Contentful Paint (FCP)
    this.trackPaintMetric('first-contentful-paint', 'FCP');
    
    // Largest Contentful Paint (LCP)
    this.trackLCP();
    
    // First Input Delay (FID)
    this.trackFID();
    
    // Cumulative Layout Shift (CLS)
    this.trackCLS();
    
    // Time to First Byte (TTFB)
    this.trackTTFB();
  }

  private trackPaintMetric(paintType: string, metricType: 'FCP' | 'LCP'): void {
    const paintEntries = performance.getEntriesByType('paint');
    const entry = paintEntries.find(e => e.name === paintType);
    
    if (entry) {
      this.addMetric({
        type: metricType,
        value: entry.startTime,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    }
  }

  private trackLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.addMetric({
          type: 'LCP',
          value: lastEntry.startTime,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        });
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP tracking not supported:', error);
      }
    }
  }

  private trackFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'first-input') {
            this.addMetric({
              type: 'FID',
              value: (entry as any).processingStart - entry.startTime,
              timestamp: Date.now(),
              url: window.location.href,
              userAgent: navigator.userAgent
            });
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID tracking not supported:', error);
      }
    }
  }

  private trackCLS(): void {
    let clsValue = 0;
    
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        
        this.addMetric({
          type: 'CLS',
          value: clsValue,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        });
      });

      try {
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS tracking not supported:', error);
      }
    }
  }

  private trackTTFB(): void {
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      const entry = navigationEntries[0];
      
      this.addMetric({
        type: 'TTFB',
        value: entry.responseStart - entry.requestStart,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    }
  }

  private setupUserInteractionTracking(): void {
    // Track clicks with timing
    document.addEventListener('click', (event) => {
      const startTime = performance.now();
      
      requestAnimationFrame(() => {
        const responseTime = performance.now() - startTime;
        this.trackInteractionMetric('click', responseTime, event.target as Element);
      });
    }, { passive: true });

    // Track scroll performance
    let scrollStart = 0;
    document.addEventListener('scroll', () => {
      if (!scrollStart) {
        scrollStart = performance.now();
        
        requestAnimationFrame(() => {
          const scrollTime = performance.now() - scrollStart;
          this.trackInteractionMetric('scroll', scrollTime);
          scrollStart = 0;
        });
      }
    }, { passive: true });
  }

  private trackInteractionMetric(type: string, responseTime: number, target?: Element): void {
    if (responseTime > 100) { // Slow interaction
      this.insights.push({
        category: 'interactivity',
        severity: responseTime > 300 ? 'critical' : responseTime > 200 ? 'high' : 'medium',
        description: `Slow ${type} response: ${responseTime.toFixed(1)}ms`,
        recommendation: `Optimize ${type} handlers and reduce main thread blocking`,
        impact: Math.min(10, Math.floor(responseTime / 50))
      });
    }
  }

  private setupErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.insights.push({
        category: 'loading',
        severity: 'high',
        description: `JavaScript error: ${event.message}`,
        recommendation: 'Fix JavaScript errors to improve user experience',
        impact: 8
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.insights.push({
        category: 'loading',
        severity: 'high',
        description: `Unhandled promise rejection: ${event.reason}`,
        recommendation: 'Handle promise rejections properly',
        impact: 7
      });
    });
  }

  private processPerformanceEntry(entry: PerformanceEntry): void {
    // Analizar entradas de navegación
    if (entry.entryType === 'navigation') {
      const navEntry = entry as PerformanceNavigationTiming;
      this.analyzeNavigationTiming(navEntry);
    }
    
    // Analizar entradas de recursos
    if (entry.entryType === 'resource') {
      const resourceEntry = entry as PerformanceResourceTiming;
      this.analyzeResourceTiming(resourceEntry);
    }
  }

  private analyzeNavigationTiming(entry: PerformanceNavigationTiming): void {
    const domContentLoaded = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
    const loadComplete = entry.loadEventEnd - entry.loadEventStart;
    
    if (domContentLoaded > 2000) {
      this.insights.push({
        category: 'loading',
        severity: 'high',
        description: `Slow DOM content loaded: ${domContentLoaded.toFixed(0)}ms`,
        recommendation: 'Reduce DOM complexity and optimize critical rendering path',
        impact: 9
      });
    }
    
    if (loadComplete > 5000) {
      this.insights.push({
        category: 'loading',
        severity: 'medium',
        description: `Slow page load: ${loadComplete.toFixed(0)}ms`,
        recommendation: 'Optimize resource loading and use code splitting',
        impact: 7
      });
    }
  }

  private analyzeResourceTiming(entry: PerformanceResourceTiming): void {
    const duration = entry.responseEnd - entry.requestStart;
    
    if (duration > 2000 && entry.name.includes('.js')) {
      this.insights.push({
        category: 'loading',
        severity: 'medium',
        description: `Slow script loading: ${entry.name} took ${duration.toFixed(0)}ms`,
        recommendation: 'Consider code splitting or CDN optimization',
        impact: 6
      });
    }
  }

  private startContinuousAnalysis(): void {
    setInterval(() => {
      this.analyzeUserExperience();
      this.generatePerformanceReport();
    }, 30000); // Cada 30 segundos
  }

  private analyzeUserExperience(): void {
    const recentMetrics = this.metrics.filter(m => Date.now() - m.timestamp < 300000); // Últimos 5 minutos
    
    // Analizar Core Web Vitals
    const lcp = recentMetrics.filter(m => m.type === 'LCP').pop();
    const fid = recentMetrics.filter(m => m.type === 'FID').pop();
    const cls = recentMetrics.filter(m => m.type === 'CLS').pop();
    
    if (lcp && lcp.value > 2500) {
      this.insights.push({
        category: 'loading',
        severity: 'critical',
        description: `Poor LCP: ${lcp.value.toFixed(0)}ms`,
        recommendation: 'Optimize largest contentful paint by reducing server response time and optimizing critical resources',
        impact: 10
      });
    }
    
    if (fid && fid.value > 100) {
      this.insights.push({
        category: 'interactivity',
        severity: 'high',
        description: `Poor FID: ${fid.value.toFixed(0)}ms`,
        recommendation: 'Reduce main thread blocking and optimize JavaScript execution',
        impact: 9
      });
    }
    
    if (cls && cls.value > 0.1) {
      this.insights.push({
        category: 'visual_stability',
        severity: 'medium',
        description: `Poor CLS: ${cls.value.toFixed(3)}`,
        recommendation: 'Add size attributes to images and avoid inserting content above existing content',
        impact: 7
      });
    }
  }

  private addMetric(metric: UserExperienceMetric): void {
    this.metrics.push(metric);
    
    // Mantener solo métricas de las últimas 24 horas
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.metrics = this.metrics.filter(m => m.timestamp > dayAgo);
  }

  private generatePerformanceReport(): any {
    const report = {
      coreWebVitals: this.getCoreWebVitalsScore(),
      insights: this.insights.slice(-10), // Últimas 10 insights
      recommendations: this.generateRecommendations(),
      timestamp: Date.now()
    };
    
    console.log('📊 Advanced Telemetry Report:', report);
    return report;
  }

  private getCoreWebVitalsScore(): any {
    const recent = this.metrics.filter(m => Date.now() - m.timestamp < 300000);
    
    return {
      lcp: recent.filter(m => m.type === 'LCP').pop()?.value || 0,
      fid: recent.filter(m => m.type === 'FID').pop()?.value || 0,
      cls: recent.filter(m => m.type === 'CLS').pop()?.value || 0,
      fcp: recent.filter(m => m.type === 'FCP').pop()?.value || 0,
      ttfb: recent.filter(m => m.type === 'TTFB').pop()?.value || 0
    };
  }

  private generateRecommendations(): string[] {
    const highImpactInsights = this.insights
      .filter(i => i.impact >= 7)
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 5);
    
    return highImpactInsights.map(i => i.recommendation);
  }

  getMetrics(): UserExperienceMetric[] {
    return [...this.metrics];
  }

  getInsights(): PerformanceInsight[] {
    return [...this.insights];
  }

  reset(): void {
    this.metrics = [];
    this.insights = [];
  }
}

export const telemetrySystem = AdvancedTelemetrySystem.getInstance();
