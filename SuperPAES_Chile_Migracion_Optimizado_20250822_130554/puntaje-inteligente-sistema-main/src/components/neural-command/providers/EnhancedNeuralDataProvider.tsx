/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { useOptimizedRealNeuralMetrics } from '../../../hooks/useOptimizedRealNeuralMetrics';
import './EnhancedNeuralDataProvider.css';

interface NeuralDimension {
  id: string;
  title: string;
  description: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  iconElement: React.ReactNode;
  connections: string[];
}

interface NeuralConnection {
  id: string;
  from: string;
  to: string;
  strength: number;
  active: boolean;
  type: 'data' | 'neural' | 'feedback';
}

interface EnhancedNeuralContextType {
  dimensions: NeuralDimension[];
  connections: NeuralConnection[];
  activeModules: string[];
  systemHealth: number;
  refreshData: () => void;
  isLoading: boolean;
}

const EnhancedNeuralContext = createContext<EnhancedNeuralContextType | undefined>(undefined);

export const EnhancedNeuralDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { metrics, isLoading, refetch } = useOptimizedRealNeuralMetrics();
  const [dimensions, setDimensions] = useState<NeuralDimension[]>([]);
  const [connections, setConnections] = useState<NeuralConnection[]>([]);
  const [activeModules, setActiveModules] = useState<string[]>([]);

  useEffect(() => {
    // Generar dimensiones neurales basadas en mÃ©tricas
    const newDimensions: NeuralDimension[] = [
      {
        id: 'coherence',
        title: 'Coherencia Neural',
        description: 'Nivel de sincronizaciÃ³n entre redes neurales',
        value: metrics.neuralCoherence,
        trend: metrics.neuralCoherence > 85 ? 'up' : metrics.neuralCoherence < 75 ? 'down' : 'stable',
        icon: ({ className }) => (
          <div className={`neural-icon neural-icon--coherence ${className || ''}`}>ðŸ§ </div>
        ),
        iconElement: <div className="neural-icon neural-icon--coherence">ðŸ§ </div>,
        connections: ['velocity', 'engagement']
      },
      {
        id: 'velocity',
        title: 'Velocidad de Aprendizaje',
        description: 'Rapidez en la adquisiciÃ³n de nuevos conocimientos',
        value: metrics.learningVelocity,
        trend: metrics.learningVelocity > 90 ? 'up' : metrics.learningVelocity < 80 ? 'down' : 'stable',
        icon: ({ className }) => (
          <div className={`neural-icon neural-icon--velocity ${className || ''}`}>âš¡</div>
        ),
        iconElement: <div className="neural-icon neural-icon--velocity">âš¡</div>,
        connections: ['coherence', 'adaptability']
      },
      {
        id: 'engagement',
        title: 'Nivel de Compromiso',
        description: 'Grado de participaciÃ³n activa en el aprendizaje',
        value: metrics.engagementScore,
        trend: metrics.engagementScore > 85 ? 'up' : metrics.engagementScore < 70 ? 'down' : 'stable',
        icon: ({ className }) => (
          <div className={`neural-icon neural-icon--engagement ${className || ''}`}>ðŸŽ¯</div>
        ),
        iconElement: <div className="neural-icon neural-icon--engagement">ðŸŽ¯</div>,
        connections: ['coherence', 'cognitive']
      },
      {
        id: 'cognitive',
        title: 'Carga Cognitiva',
        description: 'Nivel de esfuerzo mental requerido',
        value: 100 - metrics.cognitiveLoad, // Invertir para que menor carga = mejor
        trend: metrics.cognitiveLoad < 70 ? 'up' : metrics.cognitiveLoad > 85 ? 'down' : 'stable',
        icon: ({ className }) => (
          <div className={`neural-icon neural-icon--cognitive ${className || ''}`}>ðŸ”„</div>
        ),
        iconElement: <div className="neural-icon neural-icon--cognitive">ðŸ”„</div>,
        connections: ['engagement', 'adaptability']
      },
      {
        id: 'adaptability',
        title: 'Ãndice de Adaptabilidad',
        description: 'Capacidad de ajuste a nuevos contextos',
        value: metrics.adaptabilityIndex,
        trend: metrics.adaptabilityIndex > 85 ? 'up' : metrics.adaptabilityIndex < 75 ? 'down' : 'stable',
        icon: ({ className }) => (
          <div className={`neural-icon neural-icon--adaptability ${className || ''}`}>ðŸŒŸ</div>
        ),
        iconElement: <div className="neural-icon neural-icon--adaptability">ðŸŒŸ</div>,
        connections: ['velocity', 'cognitive']
      },
      {
        id: 'system',
        title: 'Salud del Sistema',
        description: 'Estado general del ecosistema neural',
        value: metrics.systemHealth,
        trend: metrics.systemHealth > 90 ? 'up' : metrics.systemHealth < 85 ? 'down' : 'stable',
        icon: ({ className }) => (
          <div className={`neural-icon neural-icon--system ${className || ''}`}>ðŸ’š</div>
        ),
        iconElement: <div className="neural-icon neural-icon--system">ðŸ’š</div>,
        connections: ['coherence', 'velocity', 'engagement']
      }
    ];

    setDimensions(newDimensions);

    // Generar conexiones entre dimensiones
    const newConnections: NeuralConnection[] = [];
    newDimensions.forEach(dimension => {
      dimension.connections.forEach(connectionId => {
        const targetDimension = newDimensions.find(d => d.id === connectionId);
        if (targetDimension) {
          newConnections.push({
            id: `${dimension.id}-${connectionId}`,
            from: dimension.id,
            to: connectionId,
            strength: Math.random() * 0.5 + 0.5,
            active: Math.random() > 0.3,
            type: Math.random() > 0.5 ? 'neural' : 'data'
          });
        }
      });
    });

    setConnections(newConnections);

    // Actualizar mÃ³dulos activos
    setActiveModules([
      'neural-core',
      'learning-engine',
      'feedback-system',
      'analytics-module'
    ]);
  }, [metrics]);

  const refreshData = () => {
    refetch();
  };

  const contextValue: EnhancedNeuralContextType = {
    dimensions,
    connections,
    activeModules,
    systemHealth: metrics.systemHealth,
    refreshData,
    isLoading
  };

  return (
    <EnhancedNeuralContext.Provider value={contextValue}>
      {children}
    </EnhancedNeuralContext.Provider>
  );
};

export const useEnhancedNeuralData = () => {
  const context = useContext(EnhancedNeuralContext);
  if (context === undefined) {
    throw new Error('useEnhancedNeuralData must be used within an EnhancedNeuralDataProvider');
  }
  return context;
};

