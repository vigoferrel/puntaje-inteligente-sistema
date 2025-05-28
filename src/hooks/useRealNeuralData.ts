
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RealNeuralMetrics {
  neuralCoherence: number;
  cognitiveLoad: number;
  learningVelocity: number;
  adaptiveIndex: number;
  engagementScore: number;
  progressMomentum: number;
}

interface RealNodeData {
  id: string;
  code: string;
  title: string;
  masteryLevel: number;
  position3D: [number, number, number];
  connections: string[];
  skillType: string;
  testId: number;
  tierPriority: string;
  isActive: boolean;
}

export const useRealNeuralData = () => {
  const { user } = useAuth();
  const [neuralMetrics, setNeuralMetrics] = useState<RealNeuralMetrics>({
    neuralCoherence: 0,
    cognitiveLoad: 0,
    learningVelocity: 0,
    adaptiveIndex: 0,
    engagementScore: 0,
    progressMomentum: 0
  });
  const [realNodes, setRealNodes] = useState<RealNodeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const calculateNeuralMetrics = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Obtener progreso real de nodos
      const { data: progressData } = await supabase
        .from('user_node_progress')
        .select('mastery_level, last_activity_at, node_id')
        .eq('user_id', user.id);

      // Obtener eventos neurales recientes
      const { data: neuralEvents } = await supabase
        .from('neural_events')
        .select('event_data, neural_metrics, timestamp')
        .eq('user_id', user.id)
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false })
        .limit(100);

      // Calcular métricas neurales reales
      const totalProgress = progressData?.reduce((sum, p) => sum + p.mastery_level, 0) || 0;
      const avgMastery = progressData?.length ? totalProgress / progressData.length : 0;
      
      // Calcular engagement usando tipo de datos seguro
      const recentEngagement = neuralEvents?.reduce((sum, event) => {
        const eventData = event.event_data as any;
        const engagement = typeof eventData === 'object' && eventData !== null 
          ? (eventData.engagement || 0) 
          : 0;
        return sum + engagement;
      }, 0) || 0;
      
      const avgEngagement = neuralEvents?.length ? recentEngagement / neuralEvents.length : 0;

      // Calcular velocidad de aprendizaje basada en actividad reciente
      const recentActivity = progressData?.filter(p => 
        p.last_activity_at && 
        new Date(p.last_activity_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0;

      const learningVelocity = Math.min(recentActivity / 10, 1) * 100;

      // Calcular coherencia neural basada en patrones de progreso
      const masteryLevels = progressData?.map(p => p.mastery_level) || [];
      const variance = masteryLevels.length > 1 ? 
        masteryLevels.reduce((sum, level) => sum + Math.pow(level - avgMastery, 2), 0) / masteryLevels.length : 0;
      const neuralCoherence = Math.max(0, (1 - variance) * 100);

      const calculatedMetrics: RealNeuralMetrics = {
        neuralCoherence: Math.round(neuralCoherence),
        cognitiveLoad: Math.round(75 + (avgMastery * 25)), // Carga cognitiva adaptativa
        learningVelocity: Math.round(learningVelocity),
        adaptiveIndex: Math.round(avgMastery * 100),
        engagementScore: Math.round(avgEngagement * 100),
        progressMomentum: Math.round((recentActivity / 20) * 100)
      };

      setNeuralMetrics(calculatedMetrics);
    } catch (error) {
      console.error('Error calculating neural metrics:', error);
    }
  }, [user?.id]);

  const loadRealNodes = useCallback(async () => {
    try {
      // Obtener nodos reales con progreso del usuario
      const { data: nodesData } = await supabase
        .from('learning_nodes')
        .select(`
          id, code, title, test_id, skill_id, tier_priority,
          position, subject_area, difficulty
        `)
        .order('position');

      const { data: progressData } = await supabase
        .from('user_node_progress')
        .select('node_id, mastery_level')
        .eq('user_id', user?.id || '');

      // Crear mapa de progreso
      const progressMap = new Map(progressData?.map(p => [p.node_id, p.mastery_level]) || []);

      // Convertir nodos a formato 3D
      const nodes3D: RealNodeData[] = (nodesData || []).map((node, index) => {
        const angle = (index / (nodesData?.length || 1)) * Math.PI * 2;
        const radius = 3 + (node.test_id % 3);
        const height = (node.skill_id || 1) * 0.5;

        return {
          id: node.id,
          code: node.code,
          title: node.title,
          masteryLevel: progressMap.get(node.id) || 0,
          position3D: [
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
          ],
          connections: [], // Se poblará con las dependencias
          skillType: node.subject_area,
          testId: node.test_id || 1,
          tierPriority: node.tier_priority,
          isActive: (progressMap.get(node.id) || 0) > 0
        };
      });

      setRealNodes(nodes3D);
    } catch (error) {
      console.error('Error loading real nodes:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        calculateNeuralMetrics(),
        loadRealNodes()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [calculateNeuralMetrics, loadRealNodes]);

  return {
    neuralMetrics,
    realNodes,
    isLoading,
    refreshMetrics: calculateNeuralMetrics,
    refreshNodes: loadRealNodes
  };
};
