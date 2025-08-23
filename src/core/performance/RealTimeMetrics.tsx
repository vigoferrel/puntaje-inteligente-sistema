
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { performanceMonitor } from './PerformanceMonitor';
import { intelligentCache } from './IntelligentCacheSystem';

export const RealTimeMetricsPanel: React.FC = () => {
  const [metrics, setMetrics] = useState({
    memory: 0,
    cacheHitRate: 0,
    avgRenderTime: 0,
    activeComponents: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      // Métricas de memoria
      const memory = (performance as any).memory;
      const memoryUsage = memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0;
      
      // Estadísticas de cache
      const cacheStats = intelligentCache.getCacheStats();
      const totalRequests = cacheStats.entries.reduce((sum, entry) => sum + entry.accessCount, 0);
      const cacheHitRate = totalRequests > 0 ? (cacheStats.size / totalRequests) * 100 : 0;
      
      // Métricas de performance
      const performanceData = performanceMonitor.getMetrics() as Map<string, any>;
      const renderTimes = Array.from(performanceData.values()).map(m => m.componentRenderTime);
      const avgRenderTime = renderTimes.length > 0 ? 
        renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length : 0;

      setMetrics({
        memory: memoryUsage,
        cacheHitRate,
        avgRenderTime,
        activeComponents: performanceData.size
      });
    };

    const interval = setInterval(updateMetrics, 2000);
    updateMetrics(); // Inicial

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return 'default';
    if (value < thresholds[1]) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="bg-black/20 border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center gap-2">
          📊 Performance Metrics
          <Badge variant="outline" className="text-xs">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Memoria</span>
              <Badge variant={getStatusColor(metrics.memory, [60, 80])}>
                {metrics.memory.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={metrics.memory} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Cache Hit Rate</span>
              <Badge variant={getStatusColor(100 - metrics.cacheHitRate, [20, 40])}>
                {metrics.cacheHitRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={metrics.cacheHitRate} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Render Avg</span>
              <Badge variant={getStatusColor(metrics.avgRenderTime, [50, 100])}>
                {metrics.avgRenderTime.toFixed(1)}ms
              </Badge>
            </div>
            <Progress value={Math.min(metrics.avgRenderTime, 200) / 2} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Components</span>
              <Badge variant="outline">
                {metrics.activeComponents}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Hook para integrar métricas en otros componentes
export const useRealTimeMetrics = () => {
  const [isOptimal, setIsOptimal] = useState(true);
  
  useEffect(() => {
    const checkPerformance = () => {
      const memory = (performance as any).memory;
      const memoryUsage = memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0;
      
      setIsOptimal(memoryUsage < 70);
      
      if (memoryUsage > 90) {
        console.warn('🚨 Crítico: Alto uso de memoria detectado');
        // Trigger cleanup automático
        intelligentCache.clear();
      }
    };
    
    const interval = setInterval(checkPerformance, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return { isOptimal };
};
