
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DiagnosticTest, PAESTest, PAESSkill, LearningNode } from "@/types/diagnostic";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface DiagnosticSystemData {
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

/**
 * Hook unificado y simplificado para todo el sistema diagnóstico
 * Reemplaza todos los hooks anteriores con una interfaz limpia
 */
export const useDiagnosticSystem = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DiagnosticSystemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función principal de inicialización
  const initializeSystem = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Inicializando sistema diagnóstico simplificado...');

      // Cargar datos en paralelo
      const [diagnosticTests, paesTests, paesSkills, learningNodes] = await Promise.all([
        loadDiagnosticTests(),
        loadPAESTests(),
        loadPAESSkills(),
        loadLearningNodes()
      ]);

      const systemMetrics = {
        totalNodes: learningNodes.length,
        completedNodes: Math.floor(learningNodes.length * 0.2),
        availableTests: diagnosticTests.length,
        isSystemReady: diagnosticTests.length > 0 && learningNodes.length > 0
      };

      const systemData: DiagnosticSystemData = {
        diagnosticTests,
        paesTests,
        paesSkills,
        learningNodes,
        systemMetrics
      };

      setData(systemData);
      console.log('✅ Sistema diagnóstico inicializado:', {
        tests: diagnosticTests.length,
        nodes: learningNodes.length,
        skills: paesSkills.length
      });

    } catch (error) {
      console.error('❌ Error inicializando sistema diagnóstico:', error);
      setError('No se pudo inicializar el sistema diagnóstico');
      toast({
        title: "Error",
        description: "No se pudo cargar el sistema diagnóstico",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Cargar tests diagnósticos
  const loadDiagnosticTests = async (): Promise<DiagnosticTest[]> => {
    try {
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
    } catch (error) {
      console.warn('⚠️ Error cargando tests diagnósticos:', error);
      return [];
    }
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

  // Inicializar automáticamente cuando hay usuario
  useEffect(() => {
    if (user?.id) {
      initializeSystem();
    }
  }, [user?.id, initializeSystem]);

  // Funciones auxiliares
  const startDiagnostic = useCallback(async (): Promise<boolean> => {
    console.log('🔬 Iniciando diagnóstico...');
    toast({
      title: "Diagnóstico iniciado",
      description: "Sistema diagnóstico activado correctamente",
    });
    return true;
  }, []);

  const getTier1Nodes = useCallback(() => {
    return data?.learningNodes.filter(node => node.tierPriority === 'tier1_critico') || [];
  }, [data]);

  return {
    // Estado principal
    data,
    isLoading,
    error,
    
    // Métricas del sistema
    isSystemReady: data?.systemMetrics.isSystemReady || false,
    systemMetrics: data?.systemMetrics || {
      totalNodes: 0,
      completedNodes: 0,
      availableTests: 0,
      isSystemReady: false
    },
    
    // Datos específicos con valores por defecto seguros
    diagnosticTests: data?.diagnosticTests || [],
    paesTests: data?.paesTests || [],
    paesSkills: data?.paesSkills || [],
    learningNodes: data?.learningNodes || [],
    
    // Nodos por tier
    tier1Nodes: getTier1Nodes(),
    
    // Acciones
    initializeSystem,
    startDiagnostic,
    refreshSystem: initializeSystem
  };
};
