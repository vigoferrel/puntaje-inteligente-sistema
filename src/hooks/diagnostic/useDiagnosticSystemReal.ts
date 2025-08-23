import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DiagnosticTest, PAESTest, PAESSkill, LearningNode } from "@/types/diagnostic";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface RealDiagnosticSystemData {
  diagnosticTests: DiagnosticTest[];
  paesTests: PAESTest[];
  paesSkills: PAESSkill[];
  learningNodes: LearningNode[];
  systemMetrics: {
    totalNodes: number;
    completedNodes: number;
    availableTests: number;
    isSystemReady: boolean;
  };
}

export const useDiagnosticSystemReal = () => {
  const { user } = useAuth();
  const [data, setData] = useState<RealDiagnosticSystemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRealData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Cargar datos reales en paralelo
      const [diagnosticTests, paesTests, paesSkills, learningNodes, userProgress] = await Promise.all([
        loadDiagnosticTests(),
        loadPAESTests(),
        loadPAESSkills(),
        loadLearningNodes(),
        loadUserProgress(user.id)
      ]);

      const systemMetrics = {
        totalNodes: learningNodes.length,
        completedNodes: userProgress.filter(p => p.status === 'completed').length,
        availableTests: diagnosticTests.length,
        isSystemReady: diagnosticTests.length > 0 && learningNodes.length > 0
      };

      const systemData: RealDiagnosticSystemData = {
        diagnosticTests,
        paesTests,
        paesSkills,
        learningNodes,
        systemMetrics
      };

      setData(systemData);
    } catch (error) {
      console.error('❌ Error cargando datos reales:', error);
      setError('No se pudo cargar el sistema diagnóstico');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Cargar tests diagnósticos reales
  const loadDiagnosticTests = async (): Promise<DiagnosticTest[]> => {
    const { data: tests, error } = await supabase
      .from('diagnostic_tests')
      .select('*')
      .limit(10);

    if (error) throw error;

    return (tests || []).map(test => ({
      id: test.id,
      title: test.title,
      description: test.description || '',
      testId: test.test_id,
      questions: [],
      isCompleted: false
    }));
  };

  // Cargar progress real del usuario
  const loadUserProgress = async (userId: string) => {
    const { data: progress, error } = await supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return progress || [];
  };

  // Cargar tests PAES
  const loadPAESTests = async (): Promise<PAESTest[]> => {
    try {
      const { data: tests, error } = await supabase
        .from('paes_tests')
        .select('*')
        .order('id');

      if (error) throw error;

      return (tests || []).map(test => ({
        id: test.id,
        name: test.name,
        code: test.code,
        description: test.description,
        questionsCount: test.questions_count || 0,
        timeMinutes: test.time_minutes || 0,
        relativeWeight: test.relative_weight || 1.0,
        complexityLevel: test.complexity_level || 'basic',
        isRequired: test.is_required ?? true
      }));
    } catch (error) {
      console.warn('⚠️ Error cargando tests PAES:', error);
      return [];
    }
  };

  // Cargar habilidades PAES
  const loadPAESSkills = async (): Promise<PAESSkill[]> => {
    try {
      const { data: skills, error } = await supabase
        .from('paes_skills')
        .select('*')
        .order('display_order');

      if (error) throw error;

      return (skills || []).map(skill => ({
        id: skill.id,
        name: skill.name,
        code: skill.code,
        description: skill.description,
        testId: skill.test_id || 1,
        skillType: skill.skill_type || 'INTERPRET_RELATE',
        impactWeight: skill.impact_weight || 1.0,
        nodeCount: skill.node_count || 0,
        applicableTests: skill.applicable_tests || [],
        displayOrder: skill.display_order || 0
      }));
    } catch (error) {
      console.warn('⚠️ Error cargando habilidades PAES:', error);
      return [];
    }
  };

  // Cargar nodos de aprendizaje
  const loadLearningNodes = async (): Promise<LearningNode[]> => {
    try {
      const { data: nodes, error } = await supabase
        .from('learning_nodes')
        .select('*')
        .order('position')
        .limit(50);

      if (error) throw error;

      return (nodes || []).map(node => ({
        id: node.id,
        title: node.title,
        description: node.description,
        code: node.code,
        subjectArea: node.subject_area || 'MATEMATICA_1',
        cognitiveLevel: node.cognitive_level || 'comprender',
        difficulty: node.difficulty || 'basic',
        tierPriority: node.tier_priority || 'tier2_importante',
        testId: node.test_id || 1,
        skillId: node.skill_id || 1,
        position: node.position || 0,
        domainCategory: node.domain_category || 'general',
        dependsOn: node.depends_on || [],
        estimatedTimeMinutes: node.estimated_time_minutes || 45,
        baseWeight: node.base_weight || 1.0,
        difficultyMultiplier: node.difficulty_multiplier || 1.0,
        frequencyBonus: node.frequency_bonus || 0.0,
        prerequisiteWeight: node.prerequisite_weight || 0.0,
        adaptiveAdjustment: node.adaptive_adjustment || 1.0,
        bloomComplexityScore: node.bloom_complexity_score || 3.0,
        paesFrequency: node.paes_frequency || 0
      }));
    } catch (error) {
      console.warn('⚠️ Error cargando nodos de aprendizaje:', error);
      return [];
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadRealData();
    }
  }, [user?.id, loadRealData]);

  return {
    data,
    isLoading,
    error,
    isSystemReady: data?.systemMetrics.isSystemReady || false,
    systemMetrics: data?.systemMetrics || {
      totalNodes: 0,
      completedNodes: 0,
      availableTests: 0,
      isSystemReady: false
    },
    diagnosticTests: data?.diagnosticTests || [],
    paesTests: data?.paesTests || [],
    paesSkills: data?.paesSkills || [],
    learningNodes: data?.learningNodes || [],
    refreshSystem: loadRealData
  };
};
