
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { PAESTestInfo, PAESSkillInfo, SmartRecommendation } from './use-paes-data';

export interface SmartPlanConfig {
  goalType: 'comprehensive' | 'weakness_focused' | 'skill_specific' | 'test_specific';
  targetTests: string[];
  duration: number; // weeks
  intensity: 'light' | 'moderate' | 'intensive';
  focusAreas: string[];
}

export interface GeneratedSmartPlan {
  id: string;
  title: string;
  description: string;
  config: SmartPlanConfig;
  schedule: WeeklySchedule[];
  metrics: PlanMetrics;
  estimatedOutcome: {
    expectedImprovement: number;
    confidenceLevel: number;
    keyBenefits: string[];
  };
}

interface WeeklySchedule {
  week: number;
  focus: string;
  sessions: SessionPlan[];
  estimatedHours: number;
}

interface SessionPlan {
  day: string;
  skillFocus: string;
  nodeIds: string[];
  duration: number;
}

interface PlanMetrics {
  totalNodes: number;
  totalHours: number;
  weaknessesAddressed: number;
  opportunitiesIncluded: number;
  strengthsMaintained: number;
}

export const useSmartPlanGenerator = () => {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);

  const generateSmartPlan = async (
    config: SmartPlanConfig,
    tests: PAESTestInfo[],
    skills: PAESSkillInfo[],
    recommendations: SmartRecommendation[]
  ): Promise<GeneratedSmartPlan | null> => {
    if (!user?.id) return null;

    setGenerating(true);
    try {
      // Obtener nodos relevantes
      const { data: nodesData, error: nodesError } = await supabase
        .from('learning_nodes')
        .select(`
          *,
          paes_skills!learning_nodes_skill_id_fkey (
            code,
            name,
            test_id
          )
        `)
        .in('test_id', getTestIds(config.targetTests, tests))
        .order('tier_priority')
        .order('position');

      if (nodesError) throw nodesError;

      // Filtrar y priorizar nodos
      const prioritizedNodes = prioritizeNodes(nodesData || [], skills, recommendations, config);
      
      // Generar cronograma semanal
      const schedule = generateWeeklySchedule(prioritizedNodes, config);
      
      // Calcular métricas
      const metrics = calculatePlanMetrics(prioritizedNodes, recommendations);
      
      // Estimar resultados
      const estimatedOutcome = estimateOutcome(config, skills, recommendations);

      // Crear el plan en la base de datos
      const { data: planData, error: planError } = await supabase
        .from('generated_study_plans')
        .insert({
          user_id: user.id,
          title: generatePlanTitle(config),
          description: generatePlanDescription(config, metrics),
          plan_type: config.goalType,
          target_tests: config.targetTests,
          estimated_duration_weeks: config.duration,
          total_nodes: prioritizedNodes.length,
          estimated_hours: metrics.totalHours,
          schedule: schedule,
          metrics: {
            ...metrics,
            estimatedOutcome,
            generatedAt: new Date().toISOString(),
            aiGenerated: true
          }
        })
        .select()
        .single();

      if (planError) throw planError;

      // Crear entradas de nodos del plan
      const planNodes = prioritizedNodes.map((node, index) => ({
        plan_id: planData.id,
        node_id: node.id,
        week_number: Math.floor(index / getNodesPerWeek(config)) + 1,
        position: (index % getNodesPerWeek(config)) + 1,
        estimated_hours: node.estimated_time_minutes / 60
      }));

      const { error: nodesInsertError } = await supabase
        .from('study_plan_nodes')
        .insert(planNodes);

      if (nodesInsertError) throw nodesInsertError;

      const generatedPlan: GeneratedSmartPlan = {
        id: planData.id,
        title: planData.title,
        description: planData.description,
        config,
        schedule,
        metrics,
        estimatedOutcome
      };

      toast({
        title: "¡Plan Inteligente Generado!",
        description: `Plan personalizado creado con ${prioritizedNodes.length} nodos optimizados`,
      });

      return generatedPlan;

    } catch (error) {
      console.error('Error generating smart plan:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el plan inteligente",
        variant: "destructive"
      });
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const getTestIds = (testCodes: string[], tests: PAESTestInfo[]): number[] => {
    return tests
      .filter(test => testCodes.includes(test.code))
      .map(test => test.id);
  };

  const prioritizeNodes = (
    nodes: any[],
    skills: PAESSkillInfo[],
    recommendations: SmartRecommendation[],
    config: SmartPlanConfig
  ) => {
    return nodes
      .map(node => {
        let priority = 0;
        
        // Prioridad por tier
        if (node.tier_priority === 'tier1_critico') priority += 100;
        else if (node.tier_priority === 'tier2_importante') priority += 50;
        else priority += 10;
        
        // Prioridad por recomendaciones
        const skillCode = node.paes_skills?.code;
        const hasRecommendation = recommendations.find(r => r.skillCode === skillCode);
        if (hasRecommendation) {
          priority += hasRecommendation.type === 'weakness' ? 80 : 40;
        }
        
        // Prioridad por skill performance
        const skill = skills.find(s => s.code === skillCode);
        if (skill) {
          if (skill.priority === 'high') priority += 60;
          else if (skill.priority === 'medium') priority += 30;
        }
        
        return { ...node, calculatedPriority: priority };
      })
      .sort((a, b) => b.calculatedPriority - a.calculatedPriority)
      .slice(0, getMaxNodes(config));
  };

  const generateWeeklySchedule = (nodes: any[], config: SmartPlanConfig): WeeklySchedule[] => {
    const schedule: WeeklySchedule[] = [];
    const nodesPerWeek = getNodesPerWeek(config);
    
    for (let week = 1; week <= config.duration; week++) {
      const weekNodes = nodes.slice((week - 1) * nodesPerWeek, week * nodesPerWeek);
      const focus = getWeekFocus(week, config.duration);
      
      schedule.push({
        week,
        focus,
        sessions: generateSessionPlan(weekNodes, config.intensity),
        estimatedHours: weekNodes.reduce((total, node) => total + (node.estimated_time_minutes / 60), 0)
      });
    }
    
    return schedule;
  };

  const generateSessionPlan = (nodes: any[], intensity: string): SessionPlan[] => {
    const sessionsPerWeek = intensity === 'intensive' ? 5 : intensity === 'moderate' ? 4 : 3;
    const sessions: SessionPlan[] = [];
    
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    for (let i = 0; i < sessionsPerWeek && i < nodes.length; i++) {
      const node = nodes[i];
      sessions.push({
        day: days[i],
        skillFocus: node.paes_skills?.name || 'Práctica General',
        nodeIds: [node.id],
        duration: node.estimated_time_minutes || 45
      });
    }
    
    return sessions;
  };

  const calculatePlanMetrics = (nodes: any[], recommendations: SmartRecommendation[]): PlanMetrics => {
    return {
      totalNodes: nodes.length,
      totalHours: Math.round(nodes.reduce((total, node) => total + (node.estimated_time_minutes / 60), 0)),
      weaknessesAddressed: recommendations.filter(r => r.type === 'weakness').length,
      opportunitiesIncluded: recommendations.filter(r => r.type === 'opportunity').length,
      strengthsMaintained: recommendations.filter(r => r.type === 'strength').length
    };
  };

  const estimateOutcome = (
    config: SmartPlanConfig,
    skills: PAESSkillInfo[],
    recommendations: SmartRecommendation[]
  ) => {
    const baseImprovement = config.intensity === 'intensive' ? 25 : 
                           config.intensity === 'moderate' ? 20 : 15;
    
    const weaknessBonus = recommendations.filter(r => r.type === 'weakness').length * 5;
    const durationBonus = Math.min(config.duration * 2, 20);
    
    return {
      expectedImprovement: Math.min(baseImprovement + weaknessBonus + durationBonus, 50),
      confidenceLevel: 85,
      keyBenefits: [
        'Enfoque en áreas de mayor impacto',
        'Cronograma optimizado por IA',
        'Seguimiento de progreso personalizado'
      ]
    };
  };

  const generatePlanTitle = (config: SmartPlanConfig): string => {
    const typeNames = {
      comprehensive: 'Plan Integral PAES',
      weakness_focused: 'Plan Enfocado en Debilidades',
      skill_specific: 'Plan por Habilidades Específicas',
      test_specific: 'Plan por Pruebas Específicas'
    };
    
    return `${typeNames[config.goalType]} - ${config.duration} semanas`;
  };

  const generatePlanDescription = (config: SmartPlanConfig, metrics: PlanMetrics): string => {
    return `Plan inteligente generado con IA, optimizado para ${config.duration} semanas. ` +
           `Incluye ${metrics.totalNodes} nodos de aprendizaje y ${metrics.totalHours} horas estimadas. ` +
           `Aborda ${metrics.weaknessesAddressed} debilidades críticas y ${metrics.opportunitiesIncluded} oportunidades de mejora.`;
  };

  const getNodesPerWeek = (config: SmartPlanConfig): number => {
    return config.intensity === 'intensive' ? 4 : 
           config.intensity === 'moderate' ? 3 : 2;
  };

  const getMaxNodes = (config: SmartPlanConfig): number => {
    return config.duration * getNodesPerWeek(config);
  };

  const getWeekFocus = (week: number, totalWeeks: number): string => {
    const phase = week / totalWeeks;
    if (phase <= 0.33) return 'Fundamentos y Conceptos';
    if (phase <= 0.66) return 'Aplicación y Práctica';
    return 'Consolidación y Simulacros';
  };

  return {
    generateSmartPlan,
    generating
  };
};
