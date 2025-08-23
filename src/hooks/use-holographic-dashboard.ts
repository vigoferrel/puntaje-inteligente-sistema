import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';

export interface HolographicMetrics {
  learningNodes: Array<{
    id: string;
    subject: string;
    mastery: number;
    connections: string[];
    position: { x: number; y: number; z: number };
    color: string;
    size: number;
    activity: number;
  }>;
  knowledgeGraph: {
    nodes: Array<{
      id: string;
      label: string;
      type: 'concept' | 'skill' | 'topic';
      strength: number;
      connections: number;
    }>;
    edges: Array<{
      source: string;
      target: string;
      weight: number;
      type: 'prerequisite' | 'related' | 'builds_on';
    }>;
  };
  performanceFlow: Array<{
    timestamp: string;
    subject: string;
    score: number;
    difficulty: number;
    flow_state: number;
  }>;
  spatialProgress: {
    totalVolume: number;
    exploredVolume: number;
    efficiency: number;
    coverage: number;
  };
}

export interface HolographicSettings {
  renderQuality: 'low' | 'medium' | 'high' | 'ultra';
  particleCount: number;
  animationSpeed: number;
  interactionSensitivity: number;
  colorScheme: 'default' | 'neon' | 'educational' | 'adaptive';
  showConnections: boolean;
  showLabels: boolean;
  autoRotate: boolean;
  immersiveMode: boolean;
  vrSupport: boolean;
}

export interface HolographicInteraction {
  type: 'click' | 'hover' | 'select' | 'zoom' | 'rotate';
  target: string;
  data: any;
  timestamp: string;
}

export const useHolographicDashboard = () => {
  const { user } = useAuth();
  const [holographicMetrics, setHolographicMetrics] = useState<HolographicMetrics | null>(null);
  const [isHolographicActive, setIsHolographicActive] = useState(false);
  const [settings, setSettings] = useState<HolographicSettings>({
    renderQuality: 'medium',
    particleCount: 500,
    animationSpeed: 1.0,
    interactionSensitivity: 0.8,
    colorScheme: 'adaptive',
    showConnections: true,
    showLabels: true,
    autoRotate: false,
    immersiveMode: false,
    vrSupport: false
  });
  const [interactions, setInteractions] = useState<HolographicInteraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    webGL: false,
    webGPU: false,
    webXR: false,
    performanceLevel: 'unknown' as 'low' | 'medium' | 'high' | 'unknown'
  });

  // Detectar capacidades del dispositivo
  const detectDeviceCapabilities = useCallback(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const webGL = !!gl;
    
    // Detectar WebGPU
    const webGPU = 'gpu' in navigator;
    
    // Detectar WebXR
    const webXR = 'xr' in navigator;
    
    // Estimar nivel de performance
    let performanceLevel: 'low' | 'medium' | 'high' = 'medium';
    
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (renderer.includes('Intel') || renderer.includes('AMD')) {
          performanceLevel = 'medium';
        } else if (renderer.includes('NVIDIA') || renderer.includes('RTX') || renderer.includes('GTX')) {
          performanceLevel = 'high';
        } else {
          performanceLevel = 'low';
        }
      }
    }

    const capabilities = {
      webGL,
      webGPU,
      webXR,
      performanceLevel
    };

    setDeviceCapabilities(capabilities);
    
    // Ajustar configuración automáticamente
    if (capabilities.performanceLevel === 'low') {
      setSettings(prev => ({
        ...prev,
        renderQuality: 'low',
        particleCount: 100,
        animationSpeed: 0.5
      }));
    } else if (capabilities.performanceLevel === 'high') {
      setSettings(prev => ({
        ...prev,
        renderQuality: 'ultra',
        particleCount: 1000,
        animationSpeed: 1.5
      }));
    }

    return capabilities;
  }, []);

  // Generar métricas holográficas
  const generateHolographicMetrics = useCallback(async (): Promise<HolographicMetrics> => {
    // Simular generación de datos 3D basados en progreso del usuario
    const subjects = ['matematica', 'ciencias', 'lectura', 'historia'];
    
    const learningNodes = subjects.map((subject, index) => ({
      id: `node-${subject}`,
      subject,
      mastery: 0.4 + Math.random() * 0.6, // 40-100% mastery
      connections: subjects.filter(s => s !== subject).slice(0, Math.floor(Math.random() * 3) + 1),
      position: {
        x: Math.cos((index * Math.PI * 2) / subjects.length) * 3,
        y: Math.sin((index * Math.PI * 2) / subjects.length) * 3,
        z: Math.random() * 2 - 1
      },
      color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][index],
      size: 0.8 + Math.random() * 0.4,
      activity: Math.random()
    }));

    const knowledgeGraph = {
      nodes: Array.from({ length: 20 }, (_, i) => ({
        id: `concept-${i}`,
        label: `Concepto ${i + 1}`,
        type: ['concept', 'skill', 'topic'][Math.floor(Math.random() * 3)] as 'concept' | 'skill' | 'topic',
        strength: Math.random(),
        connections: Math.floor(Math.random() * 5) + 1
      })),
      edges: Array.from({ length: 30 }, (_, i) => ({
        source: `concept-${Math.floor(Math.random() * 20)}`,
        target: `concept-${Math.floor(Math.random() * 20)}`,
        weight: Math.random(),
        type: ['prerequisite', 'related', 'builds_on'][Math.floor(Math.random() * 3)] as 'prerequisite' | 'related' | 'builds_on'
      }))
    };

    const performanceFlow = Array.from({ length: 50 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      score: 0.5 + Math.random() * 0.5,
      difficulty: Math.random(),
      flow_state: Math.random()
    }));

    const spatialProgress = {
      totalVolume: 1000,
      exploredVolume: 650 + Math.random() * 200,
      efficiency: 0.75 + Math.random() * 0.2,
      coverage: 0.6 + Math.random() * 0.3
    };

    return {
      learningNodes,
      knowledgeGraph,
      performanceFlow,
      spatialProgress
    };
  }, []);

  // Activar/desactivar modo holográfico
  const toggleHolographic = useCallback(async () => {
    if (!deviceCapabilities.webGL) {
      setError('Tu dispositivo no soporta visualizaciones 3D WebGL');
      return false;
    }

    setIsLoading(true);
    try {
      if (!isHolographicActive) {
        const metrics = await generateHolographicMetrics();
        setHolographicMetrics(metrics);
        setIsHolographicActive(true);
      } else {
        setIsHolographicActive(false);
        setHolographicMetrics(null);
      }
      return true;
    } catch (err) {
      console.error('Error toggling holographic mode:', err);
      setError('Error al activar modo holográfico');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [deviceCapabilities.webGL, isHolographicActive, generateHolographicMetrics]);

  // Registrar interacción 3D
  const recordInteraction = useCallback((interaction: Omit<HolographicInteraction, 'timestamp'>) => {
    const fullInteraction: HolographicInteraction = {
      ...interaction,
      timestamp: new Date().toISOString()
    };
    
    setInteractions(prev => [fullInteraction, ...prev.slice(0, 99)]); // Mantener últimas 100
  }, []);

  // Actualizar configuración 3D
  const updateSettings = useCallback((newSettings: Partial<HolographicSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Obtener nodo por sujeto
  const getNodeBySubject = useCallback((subject: string) => {
    return holographicMetrics?.learningNodes.find(node => node.subject === subject);
  }, [holographicMetrics]);

  // Calcular conexiones de conocimiento
  const getKnowledgeConnections = useCallback((nodeId: string) => {
    if (!holographicMetrics) return [];
    
    return holographicMetrics.knowledgeGraph.edges.filter(
      edge => edge.source === nodeId || edge.target === nodeId
    );
  }, [holographicMetrics]);

  // Detectar patrones de flujo
  const getFlowPatterns = useCallback(() => {
    if (!holographicMetrics) return null;

    const recentFlow = holographicMetrics.performanceFlow.slice(0, 10);
    const averageFlow = recentFlow.reduce((acc, flow) => acc + flow.flow_state, 0) / recentFlow.length;
    
    return {
      currentFlowState: averageFlow,
      trend: recentFlow.length > 1 ? 
        (recentFlow[0].flow_state > recentFlow[recentFlow.length - 1].flow_state ? 'improving' : 'declining') : 'stable',
      peakSubject: recentFlow.reduce((peak, current) => 
        current.flow_state > peak.flow_state ? current : peak
      ).subject
    };
  }, [holographicMetrics]);

  // Inicialización
  useEffect(() => {
    detectDeviceCapabilities();
  }, [detectDeviceCapabilities]);

  // Auto-refresh de métricas si está activo
  useEffect(() => {
    if (isHolographicActive && user?.id) {
      const interval = setInterval(async () => {
        const updatedMetrics = await generateHolographicMetrics();
        setHolographicMetrics(updatedMetrics);
      }, 60000); // Actualizar cada minuto

      return () => clearInterval(interval);
    }
  }, [isHolographicActive, user?.id, generateHolographicMetrics]);

  return {
    // Estados
    holographicMetrics,
    isHolographicActive,
    settings,
    interactions,
    deviceCapabilities,
    isLoading,
    error,

    // Acciones
    toggleHolographic,
    recordInteraction,
    updateSettings,
    generateHolographicMetrics,

    // Utilidades de análisis
    getNodeBySubject,
    getKnowledgeConnections,
    getFlowPatterns,
    
    // Métricas calculadas
    getSpatialEfficiency: () => 
      holographicMetrics ? 
        holographicMetrics.spatialProgress.exploredVolume / holographicMetrics.spatialProgress.totalVolume : 0,
    
    getAverageNodeMastery: () =>
      holographicMetrics ? 
        holographicMetrics.learningNodes.reduce((acc, node) => acc + node.mastery, 0) / holographicMetrics.learningNodes.length : 0,
    
    getMostActiveNode: () =>
      holographicMetrics ? 
        holographicMetrics.learningNodes.reduce((most, current) => 
          current.activity > most.activity ? current : most
        ) : null,
    
    getSystemRecommendations: () => {
      if (!holographicMetrics) return [];
      
      const recommendations = [];
      
      // Recomendar explorar nodos con baja maestría
      const lowMasteryNodes = holographicMetrics.learningNodes.filter(node => node.mastery < 0.5);
      if (lowMasteryNodes.length > 0) {
        recommendations.push({
          type: 'improvement',
          message: `Considera enfocarte en ${lowMasteryNodes[0].subject} para mejorar la conexión del grafo`,
          priority: 'medium'
        });
      }
      
      // Recomendar explorar nuevas conexiones
      if (holographicMetrics.spatialProgress.coverage < 0.7) {
        recommendations.push({
          type: 'exploration',
          message: 'Explora nuevas áreas del conocimiento para expandir tu grafo',
          priority: 'low'
        });
      }
      
      return recommendations;
    }
  };
};
