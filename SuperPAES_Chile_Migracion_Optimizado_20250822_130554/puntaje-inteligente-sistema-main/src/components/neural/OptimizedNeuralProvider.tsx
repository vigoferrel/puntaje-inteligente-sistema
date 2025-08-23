﻿/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { useErrorRecovery } from '../../core/performance/GlobalErrorRecovery';

interface NeuralState {
  isStable: boolean;
  efficiency: number;
  errorCount: number;
  lastRecovery: number;
  memoryUsage: number;
}

interface NeuralContextType {
  state: NeuralState;
  reportError: (error: Error) => void;
  triggerRecovery: () => Promise<void>;
  optimizePerformance: () => void;
}

const NeuralContext = createContext<NeuralContextType | null>(null);

export const useOptimizedNeural = () => {
  const context = useContext(NeuralContext);
  if (!context) {
    throw new Error('useOptimizedNeural must be used within OptimizedNeuralProvider');
  }
  return context;
};

export const OptimizedNeuralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { reportError: globalReportError, attemptRecovery } = useErrorRecovery();
  
  const [state, setState] = useState<NeuralState>({
    isStable: true,
    efficiency: 100,
    errorCount: 0,
    lastRecovery: 0,
    memoryUsage: 0
  });

  // Monitor continuo de salud del sistema
  useEffect(() => {
    const monitorInterval = setInterval(() => {
      const memory = (performance as unknown).memory;
      const memoryUsage = memory ? memory.usedJSHeapSize / (1024 * 1024) : 0;
      
      setState(prev => {
        const efficiency = Math.max(40, 100 - (memoryUsage / 2) - (prev.errorCount * 5));
        const isStable = efficiency > 60 && prev.errorCount < 5;
        
        return {
          ...prev,
          efficiency,
          isStable,
          memoryUsage
        };
      });
    }, 5000);

    return () => clearInterval(monitorInterval);
  }, []);

  const reportError = useCallback((error: Error) => {
    console.error('ðŸ§  Neural Error:', error.message);
    
    setState(prev => ({
      ...prev,
      errorCount: prev.errorCount + 1,
      isStable: prev.errorCount < 4
    }));
    
    globalReportError(error.message);
    
    // Auto-recovery si hay muchos errores
    if (state.errorCount > 5) {
      triggerRecovery();
    }
  }, [state.errorCount, globalReportError]);

  const triggerRecovery = useCallback(async () => {
    console.log('ðŸ”„ Iniciando recuperaciÃ³n neural...');
    
    setState(prev => ({
      ...prev,
      isStable: false,
      lastRecovery: Date.now()
    }));

    try {
      // Limpiar memoria y optimizar
      if (typeof window !== 'undefined' && window.gc) {
        window.gc();
      }
      
      // Ejecutar recovery global
      await attemptRecovery();
      
      // Resetear estado neural
      setState(prev => ({
        ...prev,
        errorCount: 0,
        efficiency: 100,
        isStable: true
      }));
      
      console.log('âœ… RecuperaciÃ³n neural completada');
    } catch (error) {
      console.error('âŒ Error en recuperaciÃ³n neural:', error);
      setState(prev => ({
        ...prev,
        isStable: false,
        efficiency: Math.max(prev.efficiency, 40)
      }));
    }
  }, [attemptRecovery]);

  const optimizePerformance = useCallback(() => {
    // Optimizaciones bÃ¡sicas de rendimiento
    requestIdleCallback(() => {
      // Limpiar listeners no utilizados
      const unusedEvents = ['resize', 'scroll', 'mousemove'];
      unusedEvents.forEach(event => {
        const handlers = (window as unknown)._eventHandlers?.[event] || [];
        if (handlers.length > 10) {
          console.warn(`âš ï¸ Muchos handlers para ${event}: ${handlers.length}`);
        }
      });
    });
  }, []);

  // Auto-optimizaciÃ³n cada 30 segundos
  useEffect(() => {
    const optimizeInterval = setInterval(optimizePerformance, 30000);
    return () => clearInterval(optimizeInterval);
  }, [optimizePerformance]);

  const value: NeuralContextType = {
    state,
    reportError,
    triggerRecovery,
    optimizePerformance
  };

  return (
    <NeuralContext.Provider value={value}>
      {children}
    </NeuralContext.Provider>
  );
};

