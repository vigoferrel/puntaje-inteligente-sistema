
import React, { useEffect } from 'react';

interface PreloadRule {
  trigger: string;
  targets: string[];
  probability: number;
  conditions?: Record<string, any>;
}

class PredictivePreloader {
  private rules: PreloadRule[] = [];
  private userBehavior: Map<string, number> = new Map();
  private preloadedComponents: Set<string> = new Set();

  constructor() {
    this.initializeDefaultRules();
    this.startBehaviorTracking();
  }

  private initializeDefaultRules() {
    this.rules = [
      {
        trigger: 'dashboard',
        targets: ['diagnostic', 'plan'],
        probability: 0.7
      },
      {
        trigger: 'diagnostic',
        targets: ['plan', 'universe'],
        probability: 0.8
      },
      {
        trigger: 'plan',
        targets: ['exercises', 'universe'],
        probability: 0.6
      }
    ];
  }

  private startBehaviorTracking() {
    // Rastrear tiempo en páginas
    let currentPage = '';
    let startTime = Date.now();

    const trackPageChange = () => {
      if (currentPage) {
        const timeSpent = Date.now() - startTime;
        this.userBehavior.set(currentPage, timeSpent);
      }
      
      currentPage = location.pathname;
      startTime = Date.now();
    };

    // Escuchar cambios de ruta
    window.addEventListener('popstate', trackPageChange);
    trackPageChange(); // Inicial
  }

  predictNextPages(currentPage: string): string[] {
    const relevantRules = this.rules.filter(rule => 
      currentPage.includes(rule.trigger)
    );

    const predictions: string[] = [];
    
    for (const rule of relevantRules) {
      const userHistory = this.userBehavior.get(currentPage) || 0;
      const adjustedProbability = rule.probability + (userHistory > 60000 ? 0.2 : 0);
      
      if (Math.random() < adjustedProbability) {
        predictions.push(...rule.targets);
      }
    }

    return [...new Set(predictions)];
  }

  async preloadComponents(componentNames: string[]) {
    const newComponents = componentNames.filter(name => 
      !this.preloadedComponents.has(name)
    );

    for (const componentName of newComponents) {
      try {
        await this.preloadComponent(componentName);
        this.preloadedComponents.add(componentName);
        console.log(`✅ Preloaded: ${componentName}`);
      } catch (error) {
        console.warn(`❌ Failed to preload: ${componentName}`, error);
      }
    }
  }

  private async preloadComponent(componentName: string): Promise<void> {
    const componentMap: Record<string, () => Promise<any>> = {
      diagnostic: () => import('@/pages/Diagnostico'),
      plan: () => import('@/pages/Plan'),
      universe: () => import('@/pages/PAESUniversePage'),
      exercises: () => import('@/pages/Ejercicios'),
      dashboard: () => import('@/pages/Dashboard')
    };

    const loader = componentMap[componentName];
    if (loader) {
      await loader();
    }
  }

  // Preload basado en hover/focus
  setupHoverPreloading() {
    document.addEventListener('mouseover', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href.includes('/')) {
        const route = new URL(link.href).pathname;
        const predictions = this.predictNextPages(route);
        
        // Preload con delay para evitar preloads innecesarios
        setTimeout(() => {
          this.preloadComponents(predictions);
        }, 500);
      }
    });
  }

  getPreloadStats() {
    return {
      totalRules: this.rules.length,
      behaviorData: Object.fromEntries(this.userBehavior),
      preloadedComponents: Array.from(this.preloadedComponents)
    };
  }
}

export const predictivePreloader = new PredictivePreloader();

// Hook corregido para usar preloading predictivo
export const usePredictivePreloading = (currentRoute: string) => {
  useEffect(() => {
    const predictions = predictivePreloader.predictNextPages(currentRoute);
    predictivePreloader.preloadComponents(predictions);
  }, [currentRoute]);

  useEffect(() => {
    predictivePreloader.setupHoverPreloading();
  }, []);
};
