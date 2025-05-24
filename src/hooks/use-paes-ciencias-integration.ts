
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CienciasNodeMapping {
  nodeId: string;
  skillType: string;
  cognitiveDemand: string;
  contentArea: string;
  difficultyWeight: number;
  questionNumber: number;
}

export interface CienciasSequence {
  id: string;
  sequenceName: string;
  nodeId: string;
  prerequisiteNodes: string[];
  sequenceOrder: number;
  masteryThreshold: number;
  timeEstimate: number;
}

export interface CienciasAnalytics {
  skillDistribution: any[];
  criticalNodes: any[];
  nodePerformance: Record<string, number>;
  recommendedSequence: string[];
}

export const usePAESCienciasIntegration = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cienciasNodes, setCienciasNodes] = useState<any[]>([]);
  const [questionMappings, setQuestionMappings] = useState<CienciasNodeMapping[]>([]);
  const [learningSequences, setLearningSequences] = useState<CienciasSequence[]>([]);
  const [analytics, setAnalytics] = useState<CienciasAnalytics | null>(null);

  // Cargar nodos de Ciencias
  const loadCienciasNodes = useCallback(async () => {
    setLoading(true);
    try {
      const { data: nodes, error } = await supabase
        .from('learning_nodes')
        .select(`
          *,
          paes_skills!learning_nodes_skill_id_fkey (
            code,
            name,
            skill_type
          )
        `)
        .eq('test_id', 5) // Ciencias
        .like('code', 'CS-%')
        .order('position');

      if (error) throw error;
      setCienciasNodes(nodes || []);
    } catch (error) {
      console.error('Error loading Ciencias nodes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar mapeos pregunta-nodo
  const loadQuestionMappings = useCallback(async () => {
    try {
      const { data: mappings, error } = await supabase
        .from('question_node_mapping')
        .select('*')
        .eq('exam_code', 'FORMA_153_2024')
        .order('question_number');

      if (error) throw error;

      const formattedMappings: CienciasNodeMapping[] = (mappings || []).map(mapping => ({
        nodeId: mapping.node_id,
        skillType: mapping.skill_type,
        cognitiveDemand: mapping.cognitive_demand,
        contentArea: mapping.content_area,
        difficultyWeight: mapping.difficulty_weight,
        questionNumber: mapping.question_number
      }));

      setQuestionMappings(formattedMappings);
    } catch (error) {
      console.error('Error loading question mappings:', error);
    }
  }, []);

  // Cargar secuencias de aprendizaje
  const loadLearningSequences = useCallback(async () => {
    try {
      const { data: sequences, error } = await supabase
        .from('learning_sequences_biologia')
        .select('*')
        .order('sequence_name', { ascending: true })
        .order('sequence_order', { ascending: true });

      if (error) throw error;

      const formattedSequences: CienciasSequence[] = (sequences || []).map(seq => ({
        id: seq.id,
        sequenceName: seq.sequence_name,
        nodeId: seq.node_id,
        prerequisiteNodes: seq.prerequisite_nodes || [],
        sequenceOrder: seq.sequence_order,
        masteryThreshold: seq.mastery_threshold,
        timeEstimate: seq.time_estimate_minutes
      }));

      setLearningSequences(formattedSequences);
    } catch (error) {
      console.error('Error loading learning sequences:', error);
    }
  }, []);

  // Generar analytics basados en datos reales
  const generateAnalytics = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Obtener distribución de habilidades usando la vista
      const { data: skillDist, error: skillError } = await supabase
        .from('skill_distribution_ciencias_2024')
        .select('*');

      if (skillError) throw skillError;

      // Obtener análisis de nodos críticos usando la vista
      const { data: criticalNodes, error: criticalError } = await supabase
        .from('critical_nodes_analysis_ciencias_2024')
        .select('*');

      if (criticalError) throw criticalError;

      // Obtener progreso del usuario en nodos de Ciencias
      const { data: userProgress, error: progressError } = await supabase
        .from('user_node_progress')
        .select('node_id, progress, mastery_level')
        .eq('user_id', user.id)
        .in('node_id', cienciasNodes.map(n => n.id));

      if (progressError) throw progressError;

      // Calcular rendimiento por nodo
      const nodePerformance: Record<string, number> = {};
      userProgress?.forEach(progress => {
        nodePerformance[progress.node_id] = progress.mastery_level || 0;
      });

      // Generar secuencia recomendada basada en prerrequisitos y progreso
      const recommendedSequence = generateRecommendedSequence(
        learningSequences,
        nodePerformance
      );

      setAnalytics({
        skillDistribution: skillDist || [],
        criticalNodes: criticalNodes || [],
        nodePerformance,
        recommendedSequence
      });

    } catch (error) {
      console.error('Error generating analytics:', error);
    }
  }, [user?.id, cienciasNodes, learningSequences]);

  // Función auxiliar para generar secuencia recomendada
  const generateRecommendedSequence = (
    sequences: CienciasSequence[],
    nodePerformance: Record<string, number>
  ): string[] => {
    // Agrupar por secuencia
    const sequenceGroups = sequences.reduce((groups, seq) => {
      if (!groups[seq.sequenceName]) {
        groups[seq.sequenceName] = [];
      }
      groups[seq.sequenceName].push(seq);
      return groups;
    }, {} as Record<string, CienciasSequence[]>);

    const recommended: string[] = [];

    // Para cada secuencia, encontrar el siguiente nodo recomendado
    Object.values(sequenceGroups).forEach(sequenceNodes => {
      const sortedNodes = sequenceNodes.sort((a, b) => a.sequenceOrder - b.sequenceOrder);
      
      for (const node of sortedNodes) {
        const currentProgress = nodePerformance[node.nodeId] || 0;
        
        // Si el nodo no está dominado, recomendarlo
        if (currentProgress < node.masteryThreshold * 100) {
          // Verificar prerrequisitos
          const prerequisitesMet = node.prerequisiteNodes.every(prereqId => {
            const prereqProgress = nodePerformance[prereqId] || 0;
            const prereqNode = sequences.find(s => s.nodeId === prereqId);
            const requiredThreshold = prereqNode ? prereqNode.masteryThreshold * 100 : 70;
            return prereqProgress >= requiredThreshold;
          });

          if (prerequisitesMet && !recommended.includes(node.nodeId)) {
            recommended.push(node.nodeId);
          }
          break; // Solo un nodo por secuencia
        }
      }
    });

    return recommended;
  };

  // Calcular puntuación ponderada usando la función SQL
  const calculateWeightedScore = useCallback(async (userResponses: Record<number, boolean>) => {
    try {
      const { data, error } = await supabase.rpc('calculate_weighted_score_ciencias', {
        exam_code_param: 'FORMA_153_2024',
        user_responses: userResponses
      });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error calculating weighted score:', error);
      return null;
    }
  }, []);

  // Obtener nodos recomendados para un usuario
  const getRecommendedNodes = useCallback((limit: number = 5) => {
    if (!analytics) return [];

    return analytics.recommendedSequence
      .slice(0, limit)
      .map(nodeId => cienciasNodes.find(node => node.id === nodeId))
      .filter(Boolean);
  }, [analytics, cienciasNodes]);

  // Cargar datos iniciales
  useEffect(() => {
    loadCienciasNodes();
    loadQuestionMappings();
    loadLearningSequences();
  }, [loadCienciasNodes, loadQuestionMappings, loadLearningSequences]);

  // Generar analytics cuando se cargan los datos
  useEffect(() => {
    if (cienciasNodes.length > 0 && learningSequences.length > 0) {
      generateAnalytics();
    }
  }, [cienciasNodes.length, learningSequences.length, generateAnalytics]);

  return {
    loading,
    cienciasNodes,
    questionMappings,
    learningSequences,
    analytics,
    calculateWeightedScore,
    getRecommendedNodes,
    loadCienciasNodes,
    loadQuestionMappings,
    loadLearningSequences,
    generateAnalytics
  };
};
