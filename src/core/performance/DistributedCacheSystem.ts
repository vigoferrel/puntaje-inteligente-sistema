
interface CacheLayer {
  id: string;
  priority: number;
  ttl: number;
  maxSize: number;
  hitRate: number;
}

interface CacheMetrics {
  totalHits: number;
  totalMisses: number;
  layerHits: Record<string, number>;
  averageResponseTime: number;
}

class DistributedCacheSystem {
  private static instance: DistributedCacheSystem;
  private layers: Map<string, Map<string, any>> = new Map();
  private metrics: CacheMetrics = {
    totalHits: 0,
    totalMisses: 0,
    layerHits: {},
    averageResponseTime: 0
  };

  private cacheLayers: CacheLayer[] = [
    { id: 'l1', priority: 1, ttl: 60000, maxSize: 50, hitRate: 0 },      // 1 minuto - Ultra rápido
    { id: 'l2', priority: 2, ttl: 300000, maxSize: 200, hitRate: 0 },    // 5 minutos - Rápido
    { id: 'l3', priority: 3, ttl: 1800000, maxSize: 500, hitRate: 0 }    // 30 minutos - Persistente
  ];

  static getInstance(): DistributedCacheSystem {
    if (!DistributedCacheSystem.instance) {
      DistributedCacheSystem.instance = new DistributedCacheSystem();
    }
    return DistributedCacheSystem.instance;
  }

  constructor() {
    this.cacheLayers.forEach(layer => {
      this.layers.set(layer.id, new Map());
      this.metrics.layerHits[layer.id] = 0;
    });
    this.startMaintenanceScheduler();
  }

  set(key: string, data: any, options?: { layer?: string; ttl?: number }): void {
    const startTime = performance.now();
    
    const targetLayer = options?.layer || this.selectOptimalLayer(data);
    const layer = this.layers.get(targetLayer);
    
    if (layer) {
      const entry = {
        data,
        timestamp: Date.now(),
        ttl: options?.ttl || this.cacheLayers.find(l => l.id === targetLayer)?.ttl || 300000,
        accessCount: 0,
        size: JSON.stringify(data).length
      };

      layer.set(key, entry);
      this.promoteToUpperLayers(key, entry);
    }

    this.updateResponseTime(performance.now() - startTime);
  }

  get(key: string): any | null {
    const startTime = performance.now();
    
    // Buscar en capas ordenadas por prioridad
    for (const layerConfig of this.cacheLayers) {
      const layer = this.layers.get(layerConfig.id);
      if (!layer) continue;

      const entry = layer.get(key);
      if (entry && !this.isExpired(entry)) {
        entry.accessCount++;
        
        // Cache hit
        this.metrics.totalHits++;
        this.metrics.layerHits[layerConfig.id]++;
        
        // Promover a capas superiores si es frecuentemente accedido
        if (entry.accessCount > 3) {
          this.promoteToUpperLayers(key, entry);
        }
        
        this.updateResponseTime(performance.now() - startTime);
        return entry.data;
      }
    }

    // Cache miss
    this.metrics.totalMisses++;
    this.updateResponseTime(performance.now() - startTime);
    return null;
  }

  invalidate(key: string): void {
    this.layers.forEach(layer => layer.delete(key));
  }

  private selectOptimalLayer(data: any): string {
    const size = JSON.stringify(data).length;
    
    if (size < 1024) return 'l1';      // Datos pequeños en L1
    if (size < 10240) return 'l2';     // Datos medianos en L2
    return 'l3';                       // Datos grandes en L3
  }

  private promoteToUpperLayers(key: string, entry: any): void {
    if (entry.accessCount > 5) {
      // Promover a L1 si es muy accedido
      this.layers.get('l1')?.set(key, { ...entry, timestamp: Date.now() });
    } else if (entry.accessCount > 2) {
      // Promover a L2 si es medianamente accedido
      this.layers.get('l2')?.set(key, { ...entry, timestamp: Date.now() });
    }
  }

  private isExpired(entry: any): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private updateResponseTime(responseTime: number): void {
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * 0.9) + (responseTime * 0.1);
  }

  private startMaintenanceScheduler(): void {
    setInterval(() => {
      this.cleanupExpiredEntries();
      this.optimizeLayerSizes();
      this.updateHitRates();
    }, 30000); // Cada 30 segundos
  }

  private cleanupExpiredEntries(): void {
    this.layers.forEach(layer => {
      for (const [key, entry] of layer.entries()) {
        if (this.isExpired(entry)) {
          layer.delete(key);
        }
      }
    });
  }

  private optimizeLayerSizes(): void {
    this.cacheLayers.forEach(layerConfig => {
      const layer = this.layers.get(layerConfig.id);
      if (!layer) return;

      if (layer.size > layerConfig.maxSize) {
        // Remover entradas menos accedidas
        const entries = Array.from(layer.entries())
          .sort((a, b) => a[1].accessCount - b[1].accessCount);
        
        const toRemove = layer.size - layerConfig.maxSize;
        for (let i = 0; i < toRemove; i++) {
          layer.delete(entries[i][0]);
        }
      }
    });
  }

  private updateHitRates(): void {
    this.cacheLayers.forEach(layerConfig => {
      const hits = this.metrics.layerHits[layerConfig.id] || 0;
      const total = this.metrics.totalHits + this.metrics.totalMisses;
      layerConfig.hitRate = total > 0 ? hits / total : 0;
    });
  }

  getMetrics(): CacheMetrics & { layers: CacheLayer[] } {
    return {
      ...this.metrics,
      layers: this.cacheLayers
    };
  }

  preload(keys: Array<{ key: string; data: any; priority?: 'high' | 'medium' | 'low' }>): void {
    keys.forEach(({ key, data, priority = 'medium' }) => {
      const layer = priority === 'high' ? 'l1' : priority === 'medium' ? 'l2' : 'l3';
      this.set(key, data, { layer });
    });
  }
}

export const distributedCache = DistributedCacheSystem.getInstance();
