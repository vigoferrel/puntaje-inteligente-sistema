
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AchievementCheckRequest {
  user_id: string;
  action_type: string;
  action_data: any;
}

const ACHIEVEMENT_DEFINITIONS = {
  'first_node_completed': {
    title: 'Primer Paso Neural',
    description: 'Has completado tu primer nodo de aprendizaje',
    category: 'progress',
    rarity: 'common',
    points: 10
  },
  'streak_7_days': {
    title: 'Constancia Neural',
    description: 'Has estudiado durante 7 días consecutivos',
    category: 'consistency',
    rarity: 'rare',
    points: 50
  },
  'battle_first_win': {
    title: 'Guerrero Neural',
    description: 'Has ganado tu primera batalla académica',
    category: 'combat',
    rarity: 'rare',
    points: 30
  },
  'paes_simulation_master': {
    title: 'Maestro de Simulación',
    description: 'Has completado 10 simulaciones PAES con más del 80% de precisión',
    category: 'academic',
    rarity: 'epic',
    points: 100
  },
  'neural_efficiency_90': {
    title: 'Eficiencia Neural Superior',
    description: 'Has alcanzado 90% de eficiencia neural',
    category: 'neural',
    rarity: 'epic',
    points: 150
  },
  'universe_explorer': {
    title: 'Explorador del Universo',
    description: 'Has explorado todas las dimensiones del universo educativo',
    category: 'exploration',
    rarity: 'legendary',
    points: 200
  },
  'cognitive_master': {
    title: 'Maestro Cognitivo',
    description: 'Has dominado todos los niveles cognitivos de Bloom',
    category: 'cognitive',
    rarity: 'legendary',
    points: 300
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { user_id, action_type, action_data } = await req.json() as AchievementCheckRequest;

    console.log(`Checking achievements for user ${user_id}, action: ${action_type}`);

    // Obtener logros actuales del usuario
    const { data: existingAchievements } = await supabaseClient
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', user_id);

    const existingIds = new Set(existingAchievements?.map(a => a.achievement_id) || []);

    // Obtener datos del usuario para verificar logros
    const { data: userProgress } = await supabaseClient
      .from('user_node_progress')
      .select('*')
      .eq('user_id', user_id);

    const { data: userBattles } = await supabaseClient
      .from('battle_sessions')
      .select('*')
      .or(`creator_id.eq.${user_id},opponent_id.eq.${user_id}`);

    const { data: userMetrics } = await supabaseClient
      .from('neural_metrics')
      .select('*')
      .eq('user_id', user_id);

    const newAchievements = [];

    // Verificar logros basados en la acción y datos del usuario
    for (const [achievementId, achievement] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
      if (existingIds.has(achievementId)) continue;

      let shouldUnlock = false;

      switch (achievementId) {
        case 'first_node_completed':
          shouldUnlock = action_type === 'node_completed' && 
            userProgress?.filter(p => p.status === 'completed').length === 1;
          break;

        case 'streak_7_days':
          shouldUnlock = checkStudyStreak(userProgress, 7);
          break;

        case 'battle_first_win':
          shouldUnlock = action_type === 'battle_won' && 
            userBattles?.filter(b => b.winner_id === user_id).length === 1;
          break;

        case 'paes_simulation_master':
          shouldUnlock = checkPAESSimulationMastery(userProgress);
          break;

        case 'neural_efficiency_90':
          shouldUnlock = checkNeuralEfficiency(userMetrics, 90);
          break;

        case 'universe_explorer':
          shouldUnlock = checkUniverseExploration(userProgress);
          break;

        case 'cognitive_master':
          shouldUnlock = checkCognitiveMastery(userProgress);
          break;
      }

      if (shouldUnlock) {
        const newAchievement = {
          user_id,
          achievement_id: achievementId,
          achievement_type: 'auto_unlock',
          title: achievement.title,
          description: achievement.description,
          category: achievement.category,
          rarity: achievement.rarity,
          points_awarded: achievement.points,
          metadata: { unlocked_by: action_type, action_data }
        };

        // Insertar logro en la base de datos
        const { data: insertedAchievement } = await supabaseClient
          .from('user_achievements')
          .insert(newAchievement)
          .select()
          .single();

        if (insertedAchievement) {
          newAchievements.push(insertedAchievement);

          // Crear notificación para el logro
          await supabaseClient
            .from('user_notifications')
            .insert({
              user_id,
              notification_type: 'achievement_unlocked',
              title: `¡Logro Desbloqueado!`,
              message: `Has desbloqueado: ${achievement.title}`,
              priority: achievement.rarity === 'legendary' ? 'high' : 'normal',
              action_data: { achievement_id: achievementId, points: achievement.points }
            });

          console.log(`Achievement unlocked: ${achievementId} for user ${user_id}`);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        achievements_unlocked: newAchievements.length,
        new_achievements: newAchievements
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in achievement engine:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Helper functions for achievement checking
function checkStudyStreak(userProgress: any[], days: number): boolean {
  if (!userProgress || userProgress.length === 0) return false;
  
  const recentActivities = userProgress
    .map(p => new Date(p.last_activity_at))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    const dayToCheck = new Date(currentDate);
    dayToCheck.setDate(currentDate.getDate() - i);

    const hasActivityOnDay = recentActivities.some(date => {
      const activityDate = new Date(date);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === dayToCheck.getTime();
    });

    if (hasActivityOnDay) {
      streak++;
    } else {
      break;
    }
  }

  return streak >= days;
}

function checkPAESSimulationMastery(userProgress: any[]): boolean {
  if (!userProgress) return false;
  
  const paesNodes = userProgress.filter(p => 
    p.node_id.includes('paes') || p.node_id.includes('simulation')
  );
  
  const masteredSimulations = paesNodes.filter(p => 
    p.status === 'completed' && p.success_rate >= 0.8
  );
  
  return masteredSimulations.length >= 10;
}

function checkNeuralEfficiency(userMetrics: any[], threshold: number): boolean {
  if (!userMetrics) return false;
  
  const efficiencyMetric = userMetrics.find(m => 
    m.metric_type === 'neural_dimension' && m.dimension_id === 'neural_efficiency'
  );
  
  return efficiencyMetric && efficiencyMetric.current_value >= threshold;
}

function checkUniverseExploration(userProgress: any[]): boolean {
  if (!userProgress) return false;
  
  const universeNodes = userProgress.filter(p => 
    p.node_id.includes('universe') || p.node_id.includes('3d')
  );
  
  return universeNodes.length >= 20 && 
    universeNodes.filter(p => p.progress > 0.8).length >= 15;
}

function checkCognitiveMastery(userProgress: any[]): boolean {
  if (!userProgress) return false;
  
  const bloomLevels = ['recordar', 'comprender', 'aplicar', 'analizar', 'evaluar', 'crear'];
  const masteredLevels = new Set();
  
  // Este sería más complejo en una implementación real
  // Por ahora, verificamos si tiene progreso diverso
  const completedNodes = userProgress.filter(p => p.status === 'completed');
  
  return completedNodes.length >= 50 && 
    new Set(completedNodes.map(p => p.node_id.split('-')[1])).size >= 6;
}
