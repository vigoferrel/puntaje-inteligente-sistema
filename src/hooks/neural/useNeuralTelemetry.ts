/**
 * NEURAL TELEMETRY HOOK v3.0
 * Módulo especializado para telemetría y métricas neurales
 */

import { useCallback, useRef, useEffect } from 'react';
import { useNeuralSystem } from '@/components/neural/NeuralSystemProvider';
import { NeuralBackendService } from '@/services/neural/neural-backend-service';

// Interfaces actualizadas
interface NeuralEvent {
  type: string;
  data: Record<string, any>;
  component_source?: string;
  neural_metrics?: any;
}

interface NeuralMetrics {
  real_time_engagement: number;
  session_quality: number;
  learning_effectiveness: number;
  neural_coherence: number;
  user_satisfaction_index: number;
  adaptive_intelligence_score: number;
}

interface TelemetryConfig {
  batchSize: number;
  flushInterval: number;
  enableCompression: boolean;
  enableOfflineQueue: boolean;
}

const defaultConfig: TelemetryConfig = {
  batchSize: 10,
  flushInterval: 5000,
  enableCompression: false,
  enableOfflineQueue: true
};

export const useNeuralTelemetry = (config: Partial<TelemetryConfig> = {}) => {
  const { state, actions } = useNeuralSystem();
  const telemetryConfig = { ...defaultConfig, ...config };
  
  const eventQueue = useRef<NeuralEvent[]>([]);
  const metricsBuffer = useRef<Partial<NeuralMetrics>[]>([]);
  const flushTimer = useRef<NodeJS.Timeout | null>(null);
  const isOnline = useRef(navigator.onLine);

  // Batch processing for events
  const queueEvent = useCallback((event: NeuralEvent) => {
    const eventWithTimestamp = {
      ...event,
      timestamp: Date.now()
    };
    eventQueue.current.push(eventWithTimestamp);

    if (eventQueue.current.length >= telemetryConfig.batchSize) {
      flushEvents();
    }
  }, [telemetryConfig.batchSize]);

  // Flush queued events to backend
  const flushEvents = useCallback(async () => {
    if (eventQueue.current.length === 0) return;

    const eventsToProcess = [...eventQueue.current];
    eventQueue.current = [];

    try {
      for (const event of eventsToProcess) {
        await processTelemetryEvent(event, state.sessionId);
      }
    } catch (error) {
      // Re-queue failed events if offline queue is enabled
      if (telemetryConfig.enableOfflineQueue && !isOnline.current) {
        eventQueue.current.unshift(...eventsToProcess);
      }
      
      if (state.config.debugMode) {
        console.error('Failed to flush telemetry events:', error);
      }
    }
  }, [state.sessionId, state.config.debugMode, telemetryConfig.enableOfflineQueue]);

  // Process metrics with debouncing
  const updateMetrics = useCallback((metrics: Partial<NeuralMetrics>) => {
    metricsBuffer.current.push(metrics);
    
    // Debounce metrics updates
    if (flushTimer.current) {
      clearTimeout(flushTimer.current);
    }
    
    flushTimer.current = setTimeout(() => {
      if (metricsBuffer.current.length > 0) {
        const aggregatedMetrics = metricsBuffer.current.reduce(
          (acc, curr) => ({ ...acc, ...curr }), 
          {}
        );
        
        actions.updateMetrics(aggregatedMetrics);
        metricsBuffer.current = [];
      }
    }, 1000); // 1 second debounce
  }, [actions]);

  // Auto-capture common events
  const captureInteraction = useCallback((element: string, action: string) => {
    queueEvent({
      type: 'interaction',
      data: {
        element,
        action,
        timestamp: Date.now(),
        path: window.location.pathname
      },
      neural_metrics: state.metrics
    });
  }, [queueEvent, state.metrics]);

  const captureNavigation = useCallback((from: string, to: string) => {
    queueEvent({
      type: 'navigation',
      data: {
        from,
        to,
        timestamp: Date.now()
      },
      neural_metrics: state.metrics
    });
  }, [queueEvent, state.metrics]);

  const captureError = useCallback((error: Error, context?: any) => {
    queueEvent({
      type: 'error',
      data: {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: Date.now()
      },
      neural_metrics: state.metrics
    });
  }, [queueEvent, state.metrics]);

  // Performance monitoring
  const measurePerformance = useCallback((operation: string, fn: () => any) => {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    queueEvent({
      type: 'performance',
      data: {
        operation,
        duration,
        timestamp: Date.now()
      }
    });
    
    return result;
  }, [queueEvent]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      isOnline.current = true;
      if (telemetryConfig.enableOfflineQueue) {
        flushEvents();
      }
    };

    const handleOffline = () => {
      isOnline.current = false;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flushEvents, telemetryConfig.enableOfflineQueue]);

  // Auto-flush interval
  useEffect(() => {
    const interval = setInterval(flushEvents, telemetryConfig.flushInterval);
    return () => clearInterval(interval);
  }, [flushEvents, telemetryConfig.flushInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (flushTimer.current) {
        clearTimeout(flushTimer.current);
      }
      flushEvents();
    };
  }, [flushEvents]);

  return {
    queueEvent,
    updateMetrics,
    captureInteraction,
    captureNavigation,
    captureError,
    measurePerformance,
    flushEvents,
    getQueueSize: () => eventQueue.current.length,
    isOnline: isOnline.current
  };
};

// Standalone function for processing telemetry events
export const processTelemetryEvent = async (event: NeuralEvent, sessionId: string | null) => {
  if (!sessionId) return;

  try {
    await NeuralBackendService.trackNeuralEvent({
      event_type: event.type,
      event_data: event.data,
      neural_metrics: event.neural_metrics || {},
      component_source: event.component_source,
      session_id: sessionId
    });
  } catch (error) {
    throw error;
  }
};
