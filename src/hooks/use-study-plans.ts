
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useStudyPlans = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const createStudyPlan = useCallback(async (planData: any) => {
    if (!user?.id) return null;

    setLoading(true);
    try {
      // Crear el plan principal
      const { data: plan, error: planError } = await supabase
        .from('generated_study_plans')
        .insert({
          user_id: user.id,
          title: planData.title,
          description: planData.description,
          plan_type: planData.type,
          target_tests: planData.selectedTests,
          estimated_duration_weeks: planData.duration,
          total_nodes: 0, // Se actualizará después
          estimated_hours: planData.duration * 10, // Estimación inicial
          schedule: generateWeeklySchedule(planData.duration),
          metrics: {
            targetScore: planData.targetScore,
            priority: planData.priority,
            createdAt: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (planError) throw planError;

      // Obtener nodos relevantes basados en las pruebas seleccionadas
      const { data: nodes, error: nodesError } = await supabase
        .from('learning_nodes')
        .select('*')
        .in('test_id', await getTestIds(planData.selectedTests))
        .order('tier_priority')
        .limit(planData.duration * 3); // ~3 nodos por semana

      if (nodesError) throw nodesError;

      // Crear entradas en study_plan_nodes
      if (nodes && nodes.length > 0) {
        const planNodes = nodes.map((node, index) => ({
          plan_id: plan.id,
          node_id: node.id,
          week_number: Math.floor(index / 3) + 1,
          position: (index % 3) + 1,
          estimated_hours: node.estimated_time_minutes / 60
        }));

        const { error: nodesInsertError } = await supabase
          .from('study_plan_nodes')
          .insert(planNodes);

        if (nodesInsertError) throw nodesInsertError;

        // Actualizar el total de nodos en el plan
        await supabase
          .from('generated_study_plans')
          .update({ 
            total_nodes: nodes.length,
            estimated_hours: nodes.reduce((total, node) => total + (node.estimated_time_minutes / 60), 0)
          })
          .eq('id', plan.id);
      }

      toast({
        title: "¡Plan creado exitosamente!",
        description: `Se generó "${planData.title}" con ${nodes?.length || 0} nodos de aprendizaje`,
      });

      return plan;
    } catch (error) {
      console.error('Error creating study plan:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el plan de estudio",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const getTestIds = async (testCodes: string[]): Promise<number[]> => {
    const { data, error } = await supabase
      .from('paes_tests')
      .select('id')
      .in('code', testCodes);

    if (error) throw error;
    return data?.map(test => test.id) || [];
  };

  const generateWeeklySchedule = (weeks: number) => {
    const schedule = [];
    for (let week = 1; week <= weeks; week++) {
      schedule.push({
        week,
        focus: week <= weeks / 2 ? 'Conceptos Fundamentales' : 'Aplicación y Práctica',
        sessions: 3,
        estimatedHours: week <= weeks / 2 ? 8 : 12
      });
    }
    return schedule;
  };

  return {
    createStudyPlan,
    loading
  };
};
