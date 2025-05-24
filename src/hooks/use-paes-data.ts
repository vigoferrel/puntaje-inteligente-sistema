
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface PAESTestInfo {
  id: number;
  name: string;
  code: string;
  description?: string;
  skillsCount: number;
  nodesCount: number;
  userProgress: number;
  weaknessLevel: 'critical' | 'moderate' | 'low' | 'good';
}

export interface PAESSkillInfo {
  id: number;
  name: string;
  code: string;
  testId: number;
  testCode: string;
  performance: number;
  priority: 'high' | 'medium' | 'low';
  nodesCount: number;
}

export interface SmartRecommendation {
  id: string;
  type: 'weakness' | 'opportunity' | 'strength';
  title: string;
  description: string;
  action: string;
  priority: 'Alta' | 'Media' | 'Baja';
  testCode: string;
  skillCode: string;
  impact: number;
}

export const usePAESData = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<PAESTestInfo[]>([]);
  const [skills, setSkills] = useState<PAESSkillInfo[]>([]);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPAESData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        // Cargar tests PAES
        const { data: testsData, error: testsError } = await supabase
          .from('paes_tests')
          .select('*')
          .order('id');

        if (testsError) throw testsError;

        // Cargar skills PAES
        const { data: skillsData, error: skillsError } = await supabase
          .from('paes_skills')
          .select('*')
          .order('display_order');

        if (skillsError) throw skillsError;

        // Cargar nodos para contar por test y skill
        const { data: nodesData, error: nodesError } = await supabase
          .from('learning_nodes')
          .select('test_id, skill_id, id');

        if (nodesError) throw nodesError;

        // Cargar progreso del usuario
        const { data: progressData, error: progressError } = await supabase
          .from('user_node_progress')
          .select('node_id, progress, status')
          .eq('user_id', user.id);

        if (progressError) throw progressError;

        // Procesar datos de tests
        const processedTests: PAESTestInfo[] = testsData?.map(test => {
          const testNodes = nodesData?.filter(node => node.test_id === test.id) || [];
          const testSkills = skillsData?.filter(skill => skill.test_id === test.id) || [];
          
          // Calcular progreso promedio
          const completedNodes = testNodes.filter(node => {
            const progress = progressData?.find(p => p.node_id === node.id);
            return progress?.status === 'completed';
          }).length;
          
          const userProgress = testNodes.length > 0 ? (completedNodes / testNodes.length) * 100 : 0;
          
          // Determinar nivel de debilidad
          const weaknessLevel = userProgress >= 75 ? 'good' : 
                               userProgress >= 50 ? 'low' :
                               userProgress >= 25 ? 'moderate' : 'critical';

          return {
            id: test.id,
            name: test.name,
            code: test.code,
            description: test.description,
            skillsCount: testSkills.length,
            nodesCount: testNodes.length,
            userProgress: Math.round(userProgress),
            weaknessLevel
          };
        }) || [];

        // Procesar datos de skills
        const processedSkills: PAESSkillInfo[] = skillsData?.map(skill => {
          const skillNodes = nodesData?.filter(node => node.skill_id === skill.id) || [];
          const test = testsData?.find(t => t.id === skill.test_id);
          
          // Calcular rendimiento
          const completedNodes = skillNodes.filter(node => {
            const progress = progressData?.find(p => p.node_id === node.id);
            return progress?.status === 'completed';
          }).length;
          
          const performance = skillNodes.length > 0 ? (completedNodes / skillNodes.length) * 100 : 0;
          
          // Determinar prioridad
          const priority = performance < 30 ? 'high' : 
                          performance < 60 ? 'medium' : 'low';

          return {
            id: skill.id,
            name: skill.name,
            code: skill.code,
            testId: skill.test_id,
            testCode: test?.code || '',
            performance: Math.round(performance),
            priority,
            nodesCount: skillNodes.length
          };
        }) || [];

        // Generar recomendaciones inteligentes
        const smartRecommendations = generateSmartRecommendations(processedTests, processedSkills);

        setTests(processedTests);
        setSkills(processedSkills);
        setRecommendations(smartRecommendations);

      } catch (error) {
        console.error('Error loading PAES data:', error);
        setError('Error al cargar datos PAES');
      } finally {
        setLoading(false);
      }
    };

    loadPAESData();
  }, [user?.id]);

  const generateSmartRecommendations = (tests: PAESTestInfo[], skills: PAESSkillInfo[]): SmartRecommendation[] => {
    const recommendations: SmartRecommendation[] = [];

    // Recomendaciones por debilidades críticas
    const criticalSkills = skills.filter(s => s.priority === 'high').slice(0, 2);
    criticalSkills.forEach((skill, index) => {
      recommendations.push({
        id: `weakness-${skill.id}`,
        type: 'weakness',
        title: 'Área Crítica Detectada',
        description: `${skill.name} necesita atención inmediata (${skill.performance}% completado)`,
        action: 'Dedicar 50% del tiempo de estudio',
        priority: 'Alta',
        testCode: skill.testCode,
        skillCode: skill.code,
        impact: 100 - skill.performance
      });
    });

    // Recomendaciones por oportunidades
    const opportunitySkills = skills.filter(s => s.priority === 'medium').slice(0, 2);
    opportunitySkills.forEach((skill, index) => {
      recommendations.push({
        id: `opportunity-${skill.id}`,
        type: 'opportunity',
        title: 'Oportunidad de Mejora',
        description: `${skill.name} tiene potencial de crecimiento (${skill.performance}% completado)`,
        action: 'Incrementar práctica gradualmente',
        priority: 'Media',
        testCode: skill.testCode,
        skillCode: skill.code,
        impact: 80 - skill.performance
      });
    });

    // Recomendaciones por fortalezas
    const strongSkills = skills.filter(s => s.priority === 'low' && s.performance > 70).slice(0, 1);
    strongSkills.forEach((skill, index) => {
      recommendations.push({
        id: `strength-${skill.id}`,
        type: 'strength',
        title: 'Fortaleza Confirmada',
        description: `Excelente desempeño en ${skill.name} (${skill.performance}% completado)`,
        action: 'Mantener práctica regular',
        priority: 'Baja',
        testCode: skill.testCode,
        skillCode: skill.code,
        impact: skill.performance
      });
    });

    return recommendations.sort((a, b) => b.impact - a.impact);
  };

  return {
    tests,
    skills,
    recommendations,
    loading,
    error,
    refreshData: () => {
      setLoading(true);
      // Re-trigger useEffect
    }
  };
};
