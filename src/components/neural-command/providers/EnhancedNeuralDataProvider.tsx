
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useOptimizedRealNeuralMetrics } from '@/hooks/useOptimizedRealNeuralMetrics';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, Target, Zap, Eye, Network, Sparkles, Globe, Award } from 'lucide-react';

interface NeuralDimension {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  connections: string[];
}

interface ConnectionNode {
  id: string;
  name: string;
  type: 'input' | 'processing' | 'output';
  strength: number;
  active: boolean;
}

interface EnhancedNeuralData {
  dimensions: NeuralDimension[];
  connections: ConnectionNode[];
  activeModules: string[];
  systemHealth: number;
  updateDimension: (id: string, updates: Partial<NeuralDimension>) => void;
  refreshData: () => void;
}

const EnhancedNeuralContext = createContext<EnhancedNeuralData | null>(null);

export const EnhancedNeuralDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { metrics, isLoading, refetch } = useOptimizedRealNeuralMetrics();
  const { user } = useAuth();
  
  const [dimensions, setDimensions] = useState<NeuralDimension[]>([]);
  const [connections, setConnections] = useState<ConnectionNode[]>([]);
  const [activeModules, setActiveModules] = useState<string[]>([]);

  const initializeDimensions = useCallback(() => {
    if (!metrics) return;

    const newDimensions: NeuralDimension[] = [
      {
        id: 'neural_efficiency',
        title: 'Eficiencia Neural',
        description: 'Optimización del procesamiento cognitivo',
        icon: Brain,
        color: 'from-purple-600 to-indigo-600',
        value: Math.round(metrics.neural_efficiency),
        trend: metrics.neural_efficiency > 75 ? 'up' : metrics.neural_efficiency < 50 ? 'down' : 'stable',
        category: 'Core',
        connections: ['pattern_recognition', 'adaptive_intelligence']
      },
      {
        id: 'pattern_recognition',
        title: 'Reconocimiento de Patrones',
        description: 'Identificación de estructuras y tendencias',
        icon: Target,
        color: 'from-green-600 to-emerald-600',
        value: Math.round(metrics.pattern_recognition),
        trend: metrics.pattern_recognition > 70 ? 'up' : metrics.pattern_recognition < 45 ? 'down' : 'stable',
        category: 'Cognitive',
        connections: ['learning_velocity', 'strategic_thinking']
      },
      {
        id: 'adaptive_intelligence',
        title: 'Inteligencia Adaptativa',
        description: 'Capacidad de ajuste dinámico',
        icon: Zap,
        color: 'from-yellow-600 to-orange-600',
        value: Math.round(metrics.adaptive_intelligence),
        trend: metrics.adaptive_intelligence > 72 ? 'up' : 'stable',
        category: 'Adaptive',
        connections: ['creative_synthesis', 'innovation_index']
      },
      {
        id: 'creative_synthesis',
        title: 'Síntesis Creativa',
        description: 'Combinación innovadora de conceptos',
        icon: Sparkles,
        color: 'from-pink-600 to-purple-600',
        value: Math.round(metrics.creative_synthesis),
        trend: metrics.creative_synthesis > 60 ? 'up' : 'stable',
        category: 'Creative',
        connections: ['innovation_index', 'emotional_intelligence']
      },
      {
        id: 'strategic_thinking',
        title: 'Pensamiento Estratégico',
        description: 'Planificación y toma de decisiones',
        icon: Eye,
        color: 'from-blue-600 to-cyan-600',
        value: Math.round(metrics.strategic_thinking),
        trend: metrics.strategic_thinking > 68 ? 'up' : 'stable',
        category: 'Strategic',
        connections: ['leadership_potential', 'prediction_accuracy']
      },
      {
        id: 'universe_exploration',
        title: 'Exploración Universal',
        description: 'Navegación en el universo educativo',
        icon: Globe,
        color: 'from-indigo-600 to-purple-600',
        value: Math.round(metrics.universe_exploration_depth),
        trend: metrics.universe_exploration_depth > 80 ? 'up' : 'stable',
        category: 'Exploration',
        connections: ['gamification_engagement', 'achievement_momentum']
      },
      {
        id: 'achievement_momentum',
        title: 'Momentum de Logros',
        description: 'Aceleración en la obtención de logros',
        icon: Award,
        color: 'from-green-600 to-teal-600',
        value: Math.round(metrics.achievement_momentum),
        trend: metrics.achievement_momentum > 85 ? 'up' : 'stable',
        category: 'Achievement',
        connections: ['battle_readiness', 'vocational_alignment']
      },
      {
        id: 'neural_networks',
        title: 'Redes Neurales',
        description: 'Conectividad entre módulos cognitivos',
        icon: Network,
        color: 'from-cyan-600 to-blue-600',
        value: Math.round((metrics.neural_efficiency + metrics.adaptive_intelligence) / 2),
        trend: 'up',
        category: 'Network',
        connections: ['neural_efficiency', 'adaptive_intelligence', 'pattern_recognition']
      }
    ];

    setDimensions(newDimensions);
  }, [metrics]);

  const initializeConnections = useCallback(() => {
    if (!metrics) return;

    const newConnections: ConnectionNode[] = [
      {
        id: 'lectoguia_input',
        name: 'LectoGuía IA',
        type: 'input',
        strength: Math.round(metrics.adaptive_learning_rate),
        active: metrics.adaptive_learning_rate > 50
      },
      {
        id: 'diagnostic_input',
        name: 'Sistema Diagnóstico',
        type: 'input',
        strength: Math.round(metrics.prediction_accuracy),
        active: metrics.prediction_accuracy > 60
      },
      {
        id: 'neural_processor',
        name: 'Procesador Neural',
        type: 'processing',
        strength: Math.round(metrics.neural_efficiency),
        active: metrics.neural_efficiency > 65
      },
      {
        id: 'pattern_processor',
        name: 'Analizador de Patrones',
        type: 'processing',
        strength: Math.round(metrics.pattern_recognition),
        active: metrics.pattern_recognition > 55
      },
      {
        id: 'plan_output',
        name: 'Plan Inteligente',
        type: 'output',
        strength: Math.round(metrics.strategic_thinking),
        active: metrics.strategic_thinking > 60
      },
      {
        id: 'universe_output',
        name: 'Universo 3D',
        type: 'output',
        strength: Math.round(metrics.universe_exploration_depth),
        active: metrics.universe_exploration_depth > 70
      }
    ];

    setConnections(newConnections);
    setActiveModules(newConnections.filter(c => c.active).map(c => c.id));
  }, [metrics]);

  const updateDimension = useCallback((id: string, updates: Partial<NeuralDimension>) => {
    setDimensions(prev => prev.map(dim => 
      dim.id === id ? { ...dim, ...updates } : dim
    ));
  }, []);

  const systemHealth = Math.round(
    dimensions.reduce((sum, dim) => sum + dim.value, 0) / Math.max(dimensions.length, 1)
  );

  useEffect(() => {
    if (metrics && !isLoading) {
      initializeDimensions();
      initializeConnections();
    }
  }, [metrics, isLoading, initializeDimensions, initializeConnections]);

  const value: EnhancedNeuralData = {
    dimensions,
    connections,
    activeModules,
    systemHealth,
    updateDimension,
    refreshData: refetch
  };

  return (
    <EnhancedNeuralContext.Provider value={value}>
      {children}
    </EnhancedNeuralContext.Provider>
  );
};

export const useEnhancedNeuralData = () => {
  const context = useContext(EnhancedNeuralContext);
  if (!context) {
    throw new Error('useEnhancedNeuralData must be used within EnhancedNeuralDataProvider');
  }
  return context;
};
