
import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { intelligentCache } from '@/core/performance/IntelligentCacheSystem';

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  version: string;
}

interface UnifiedContextCacheType {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, data: T, ttl?: number) => void;
  invalidate: (pattern: string) => void;
  clear: () => void;
  getStats: () => { entries: number; size: string };
}

const UnifiedContextCacheContext = createContext<UnifiedContextCacheType | undefined>(undefined);

interface UnifiedContextCacheProps {
  children: ReactNode;
}

export const UnifiedContextCache: React.FC<UnifiedContextCacheProps> = ({ children }) => {
  const [cacheVersion] = useState(() => Date.now().toString());
  
  // Cache optimizado con invalidación inteligente
  const contextCache = useMemo(() => {
    const cache = new Map<string, CacheEntry>();
    
    const get = <T>(key: string): T | null => {
      const entry = cache.get(key);
      if (!entry) return null;
      
      // Verificar si expiró
      if (Date.now() - entry.timestamp > 600000) { // 10 minutos
        cache.delete(key);
        return null;
      }
      
      return entry.data as T;
    };
    
    const set = <T>(key: string, data: T, ttl: number = 600000) => {
      cache.set(key, {
        data,
        timestamp: Date.now(),
        version: cacheVersion
      });
      
      // También usar el cache inteligente global
      intelligentCache.set(key, data, ttl, 'high');
    };
    
    const invalidate = (pattern: string) => {
      for (const [key] of cache.entries()) {
        if (key.includes(pattern)) {
          cache.delete(key);
        }
      }
    };
    
    const clear = () => {
      cache.clear();
      intelligentCache.clear();
    };
    
    const getStats = () => ({
      entries: cache.size,
      size: `${Math.round(JSON.stringify([...cache.values()]).length / 1024)}KB`
    });
    
    return { get, set, invalidate, clear, getStats };
  }, [cacheVersion]);
  
  // Limpieza automática cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of (contextCache as any).cache?.entries() || []) {
        if (now - entry.timestamp > 600000) {
          (contextCache as any).cache?.delete(key);
        }
      }
    }, 300000);
    
    return () => clearInterval(interval);
  }, [contextCache]);
  
  return (
    <UnifiedContextCacheContext.Provider value={contextCache}>
      {children}
    </UnifiedContextCacheContext.Provider>
  );
};

export const useUnifiedContextCache = () => {
  const context = useContext(UnifiedContextCacheContext);
  if (!context) {
    throw new Error('useUnifiedContextCache must be used within UnifiedContextCache');
  }
  return context;
};
