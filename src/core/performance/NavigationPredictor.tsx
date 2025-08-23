
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationPattern {
  from: string;
  to: string;
  frequency: number;
  lastUsed: number;
}

class NavigationPredictor {
  private static patterns: Map<string, NavigationPattern[]> = new Map();
  private static readonly STORAGE_KEY = 'navigation_patterns';
  
  static {
    this.loadPatterns();
  }
  
  private static loadPatterns() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.patterns = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn('Error loading navigation patterns:', error);
    }
  }
  
  private static savePatterns() {
    try {
      const data = Object.fromEntries(this.patterns);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Error saving navigation patterns:', error);
    }
  }
  
  static recordNavigation(from: string, to: string) {
    if (from === to) return;
    
    const patterns = this.patterns.get(from) || [];
    const existing = patterns.find(p => p.to === to);
    
    if (existing) {
      existing.frequency++;
      existing.lastUsed = Date.now();
    } else {
      patterns.push({
        from,
        to,
        frequency: 1,
        lastUsed: Date.now()
      });
    }
    
    // Mantener solo los 5 patrones más frecuentes por ruta
    patterns.sort((a, b) => b.frequency - a.frequency);
    this.patterns.set(from, patterns.slice(0, 5));
    
    this.savePatterns();
  }
  
  static predictNext(currentRoute: string): string[] {
    const patterns = this.patterns.get(currentRoute) || [];
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    
    return patterns
      .filter(p => now - p.lastUsed < oneWeek) // Solo patrones recientes
      .sort((a, b) => {
        // Combinar frecuencia y recencia
        const scoreA = a.frequency * (1 - (now - a.lastUsed) / oneWeek);
        const scoreB = b.frequency * (1 - (now - b.lastUsed) / oneWeek);
        return scoreB - scoreA;
      })
      .slice(0, 3)
      .map(p => p.to);
  }
  
  static getStats() {
    const totalPatterns = Array.from(this.patterns.values())
      .reduce((sum, patterns) => sum + patterns.length, 0);
    
    return {
      totalRoutes: this.patterns.size,
      totalPatterns,
      patterns: Object.fromEntries(this.patterns)
    };
  }
}

export const useNavigationPredictor = () => {
  const location = useLocation();
  const [predictions, setPredictions] = useState<string[]>([]);
  
  const recordNavigation = useCallback((to: string) => {
    NavigationPredictor.recordNavigation(location.pathname, to);
  }, [location.pathname]);
  
  useEffect(() => {
    const predicted = NavigationPredictor.predictNext(location.pathname);
    setPredictions(predicted);
    
    console.log(`🔮 Predicted routes from ${location.pathname}:`, predicted);
  }, [location.pathname]);
  
  return {
    predictions,
    recordNavigation,
    getStats: NavigationPredictor.getStats
  };
};

export { NavigationPredictor };
