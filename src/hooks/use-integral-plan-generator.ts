
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDiagnosticRecommendations } from '@/hooks/use-diagnostic-recommendations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useIntegralPlanGenerator = () => {
  const { user } = useAuth();
  const { weakestSkills, recommendedNodeIds } = useDiagnosticRecommendations();
  const [generating, setGenerating] = useState(false);

  const generateIntegralPlan = useCallback(async () => {
    if (!user?.id) return null;

    setGenerating(true);
    try {
      // 1. Obtener todos los nodos PAES disponibles
      const { data: allNodes, error: nodesError } = await supabase
        .from('learning_nodes')
        .select(`
          *,
          paes_skills!learning_nodes_skill_id_fkey (
            code,
            name,
            test_id
          )
        `)
        .order('tier_priority', { ascending: true });

      if (nodesError) throw nodesError;

      // 2. Priorizar nodos basado en diagnóstico
      const prioritizedNodes = allNodes?.map(node => {
        let priority = 0;
        
        // Bonificación por debilidades detectadas
        const skillCode = node.paes_skills?.code;
        if (skillCode && weakestSkills.includes(skillCode as any)) {
          priority += 100;
        }
        
        // Bonificación por nodos recomendados específicamente
        if (recommendedNodeIds.includes(node.id)) {
          priority += 50;
        }
        
        // Bonificación por tier crítico
        if (node.tier_priority === 'tier1_critico') {
          priority += 30;
        } else if (node.tier_priority === 'tier2_importante') {
          priority += 20;
        }
        
        // Bonificación por frecuencia PAES
        priority += (node.paes_frequency || 0) * 2;
        
        return { ...node, calculatedPriority: priority };
      }) || [];

      // 3. Ordenar por prioridad calculada
      prioritizedNodes.sort((a, b) => b.calculatedPriority - a.calculatedPriority);

      // 4. Seleccionar nodos para el plan integral (máximo 20 nodos)
      const selectedNodes = prioritizedNodes.slice(0, 20);

      // 5. Organizar en cronograma de 12 semanas
      const weeklySchedule = organizeNodesInWeeks(selectedNodes, 12);

      // 6. Crear el plan en la base de datos
      const { data: plan, error: planError } = await supabase
        .from('generated_study_plans')
        .insert({
          user_id: user.id,
          title: 'Plan Integral PAES - Generado Automáticamente',
          description: 'Plan completo basado en análisis de fortalezas y debilidades',
          plan_type: 'comprehensive',
          target_tests: ['COMPETENCIA_LECTORA', 'MATEMATICA_1', 'MATEMATICA_2', 'HISTORIA', 'CIENCIAS'],
          estimated_duration_weeks: 12,
          total_nodes: selectedNodes.length,
          estimated_hours: selectedNodes.reduce((total, node) => total + (node.estimated_time_minutes / 60), 0),
          schedule: weeklySchedule,
          metrics: {
            weaknessesAddressed: weakestSkills.length,
            priorityDistribution: calculatePriorityDistribution(selectedNodes),
            generatedAt: new Date().toISOString(),
            diagnosticBased: true
          }
        })
        .select()
        .single();

      if (planError) throw planError;

      // 7. Crear entradas para nodos del plan
      const planNodes = selectedNodes.map((node, index) => ({
        plan_id: plan.id,
        node_id: node.id,
        week_number: Math.floor(index / 2) + 1, // ~2 nodos por semana
        position: (index % 2) + 1,
        estimated_hours: node.estimated_time_minutes / 60
      }));

      const { error: nodesInsertError } = await supabase
        .from('study_plan_nodes')
        .insert(planNodes);

      if (nodesInsertError) throw nodesInsertError;

      toast({
        title: "¡Plan Integral Generado!",
        description: `Se creó un plan personalizado con ${selectedNodes.length} nodos priorizados según tu diagnóstico`,
      });

      return plan;
    } catch (error) {
      console.error('Error generating integral plan:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el plan integral",
        variant: "destructive"
      });
      return null;
    } finally {
      setGenerating(false);
    }
  }, [user?.id, weakestSkills, recommendedNodeIds]);

  const organizeNodesInWeeks = (nodes: any[], totalWeeks: number) => {
    const schedule = [];
    const nodesPerWeek = Math.ceil(nodes.length / totalWeeks);
    
    for (let week = 1; week <= totalWeeks; week++) {
      const weekNodes = nodes.slice((week - 1) * nodesPerWeek, week * nodesPerWeek);
      const focusArea = determineFocusArea(week, totalWeeks);
      
      schedule.push({
        week,
        focus: focusArea,
        nodeCount: weekNodes.length,
        estimatedHours: weekNodes.reduce((total, node) => total + (node.estimated_time_minutes / 60), 0),
        skills: weekNodes.map(node => node.paes_skills?.name).filter(Boolean)
      });
    }
    
    return schedule;
  };

  const determineFocusArea = (week: number, totalWeeks: number) => {
    const phase = week / totalWeeks;
    
    if (phase <= 0.33) return 'Fundamentos y Conceptos Base';
    if (phase <= 0.66) return 'Aplicación y Práctica';
    return 'Simulacros y Perfeccionamiento';
  };

  const calculatePriorityDistribution = (nodes: any[]) => {
    const distribution = {
      tier1: nodes.filter(n => n.tier_priority === 'tier1_critico').length,
      tier2: nodes.filter(n => n.tier_priority === 'tier2_importante').length,
      tier3: nodes.filter(n => n.tier_priority === 'tier3_complementario').length
    };
    
    return distribution;
  };

  return {
    generateIntegralPlan,
    generating
  };
};
