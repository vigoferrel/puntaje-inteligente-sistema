
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  priority: 'low' | 'medium' | 'high';
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  size: number;
  entries: Array<{
    key: string;
    accessCount: number;
    size: number;
  }>;
}

class IntelligentCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 100;

  set<T>(key: string, data: T, ttl: number = 3600000, priority: 'low' | 'medium' | 'high' = 'medium'): void {
    try {
      // Cleanup expired entries
      this.cleanup();
      
      // If cache is full, remove low priority items
      if (this.cache.size >= this.maxSize) {
        this.evictLowPriority();
      }

      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
        priority,
        accessCount: 0,
        lastAccessed: Date.now()
      };

      this.cache.set(key, entry);
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const entry = this.cache.get(key);
      
      if (!entry) return null;
      
      // Check if expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        return null;
      }
      
      // Update access stats
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      
      return entry.data;
    } catch (error) {
      console.warn('Cache get failed:', error);
      return null;
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getCacheStats(): CacheStats {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      accessCount: entry.accessCount,
      size: JSON.stringify(entry.data).length
    }));

    return {
      size: this.cache.size,
      entries
    };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private evictLowPriority(): void {
    const lowPriorityEntries = Array.from(this.cache.entries())
      .filter(([, entry]) => entry.priority === 'low')
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

    if (lowPriorityEntries.length > 0) {
      this.cache.delete(lowPriorityEntries[0][0]);
    } else {
      // Fallback: remove least recently used
      const lruEntry = Array.from(this.cache.entries())
        .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)[0];
      
      if (lruEntry) {
        this.cache.delete(lruEntry[0]);
      }
    }
  }
}

export const intelligentCache = new IntelligentCache();
