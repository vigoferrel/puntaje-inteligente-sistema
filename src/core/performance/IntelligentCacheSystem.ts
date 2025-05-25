
import { usePredictivePreloading } from './PredictivePreloader';

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  priority: 'low' | 'medium' | 'high';
  accessCount: number;
  lastAccessed: number;
}

class IntelligentCacheSystem {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize = 100;
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.cleanupInterval = setInterval(() => this.performCleanup(), 300000); // 5 min
  }

  set<T>(key: string, data: T, ttl: number = 3600000, priority: 'low' | 'medium' | 'high' = 'medium'): void {
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      priority,
      accessCount: 0,
      lastAccessed: Date.now()
    });

    console.log(`💾 Cache SET: ${key} [${priority}]`);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      console.log(`⏰ Cache EXPIRED: ${key}`);
      return null;
    }

    // Actualizar estadísticas de acceso
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    console.log(`🎯 Cache HIT: ${key} (${entry.accessCount} hits)`);
    return entry.data;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictLeastUsed(): void {
    let leastUsedKey = '';
    let leastUsedScore = Infinity;
    
    for (const [key, entry] of this.cache.entries()) {
      const priorityWeight = { low: 1, medium: 2, high: 3 }[entry.priority];
      const recencyWeight = Date.now() - entry.lastAccessed;
      const score = (entry.accessCount * priorityWeight) / (recencyWeight / 1000);
      
      if (score < leastUsedScore) {
        leastUsedScore = score;
        leastUsedKey = key;
      }
    }
    
    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
      console.log(`🗑️ Cache EVICTED: ${leastUsedKey}`);
    }
  }

  private performCleanup(): void {
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.cache.delete(key));
    
    if (expiredKeys.length > 0) {
      console.log(`🧹 Cache CLEANUP: Removed ${expiredKeys.length} expired entries`);
    }
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        priority: entry.priority,
        accessCount: entry.accessCount,
        ageMinutes: (Date.now() - entry.timestamp) / 60000,
        ttlMinutes: entry.ttl / 60000
      }))
    };
  }

  clear(): void {
    this.cache.clear();
    console.log('🔄 Cache CLEARED');
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.clear();
  }
}

export const intelligentCache = new IntelligentCacheSystem();

// Hook para usar cache inteligente
export const useIntelligentCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600000,
  priority: 'low' | 'medium' | 'high' = 'medium'
) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      // Intentar obtener del cache primero
      const cached = intelligentCache.get<T>(key);
      if (cached) {
        setData(cached);
        return;
      }

      // Si no está en cache, fetch y almacenar
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetcher();
        intelligentCache.set(key, result, ttl, priority);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, fetcher, ttl, priority]);

  return { data, loading, error };
};
