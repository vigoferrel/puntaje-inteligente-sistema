
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AchievementTrigger {
  user_id: string;
  action_type: string;
  action_data: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const trigger: AchievementTrigger = await req.json();

    // Obtener logros disponibles
    const { data: achievements } = await supabaseClient
      .from('intelligent_achievements')
      .select('*')
      .eq('is_active', true);

    if (!achievements) {
      throw new Error('No achievements found');
    }

    const unlockedAchievements = [];

    // Verificar cada logro
    for (const achievement of achievements) {
      const isUnlocked = await checkAchievementConditions(
        supabaseClient,
        achievement,
        trigger
      );

      if (isUnlocked) {
        // Verificar si ya fue desbloqueado
        const { data: existing } = await supabaseClient
          .from('user_achievement_unlocks')
          .select('id')
          .eq('user_id', trigger.user_id)
          .eq('achievement_id', achievement.id)
          .single();

        if (!existing) {
          // Desbloquear logro
          await supabaseClient
            .from('user_achievement_unlocks')
            .insert({
              user_id: trigger.user_id,
              achievement_id: achievement.id,
              unlock_context: trigger.action_data,
              neural_metrics_at_unlock: trigger.action_data.neural_metrics || {}
            });

          unlockedAchievements.push({
            id: achievement.id,
            code: achievement.code,
            title: achievement.title,
            description: achievement.description,
            points_reward: achievement.points_reward,
            rarity: achievement.rarity
          });
        }
      }
    }

    return new Response(JSON.stringify({
      achievements_unlocked: unlockedAchievements.length,
      new_achievements: unlockedAchievements,
      total_points_earned: unlockedAchievements.reduce((sum, a) => sum + a.points_reward, 0)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Achievement Engine Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function checkAchievementConditions(
  supabase: any,
  achievement: any,
  trigger: AchievementTrigger
): Promise<boolean> {
  const conditions = achievement.unlock_conditions;
  const neuralReqs = achievement.neural_requirements;

  // Verificar requisitos neurales
  if (neuralReqs && Object.keys(neuralReqs).length > 0) {
    const neuralMetrics = trigger.action_data.neural_metrics || {};
    
    for (const [key, minValue] of Object.entries(neuralReqs)) {
      if (typeof minValue === 'number' && neuralMetrics[key] < minValue) {
        return false;
      }
    }
  }

  // Verificar condiciones específicas por código de logro
  switch (achievement.code) {
    case 'NEURAL_PIONEER':
      return trigger.action_type === 'neural_session_start';

    case 'HIGH_ENGAGEMENT':
      if (trigger.action_type === 'engagement_milestone') {
        const engagement = trigger.action_data.engagement;
        const duration = trigger.action_data.duration_minutes;
        return engagement >= 80 && duration >= 10;
      }
      return false;

    case 'COHERENCE_MASTER':
      if (trigger.action_type === 'coherence_achievement') {
        return trigger.action_data.coherence >= 90;
      }
      return false;

    case 'INTERACTION_EXPERT':
      if (trigger.action_type === 'interaction_count') {
        return trigger.action_data.total_interactions >= 100;
      }
      return false;

    case 'CINEMA_ENTHUSIAST':
      if (trigger.action_type === 'transition_count') {
        return trigger.action_data.total_transitions >= 25;
      }
      return false;

    default:
      // Verificar condiciones genéricas
      return checkGenericConditions(supabase, conditions, trigger);
  }
}

async function checkGenericConditions(
  supabase: any,
  conditions: any,
  trigger: AchievementTrigger
): Promise<boolean> {
  // Implementar lógica genérica para condiciones más complejas
  // Por ejemplo, contar eventos, verificar progreso, etc.
  
  if (conditions.min_engagement && trigger.action_data.engagement) {
    return trigger.action_data.engagement >= conditions.min_engagement;
  }

  if (conditions.min_coherence && trigger.action_data.coherence) {
    return trigger.action_data.coherence >= conditions.min_coherence;
  }

  return true;
}
