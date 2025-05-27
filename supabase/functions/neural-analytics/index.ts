
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NeuralEvent {
  event_type: string;
  event_data: any;
  neural_metrics: any;
  component_source?: string;
  session_id?: string;
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

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { action, data } = await req.json();

    switch (action) {
      case 'track_event': {
        const event: NeuralEvent = data;
        
        // Obtener o crear sesión
        let sessionId = event.session_id;
        if (!sessionId) {
          const { data: session } = await supabaseClient
            .from('neural_telemetry_sessions')
            .insert({
              user_id: user.id,
              metadata: { component_source: event.component_source }
            })
            .select('id')
            .single();
          sessionId = session?.id;
        }

        // Insertar evento neural
        const { error: eventError } = await supabaseClient
          .from('neural_events')
          .insert({
            session_id: sessionId,
            user_id: user.id,
            event_type: event.event_type,
            event_data: event.event_data,
            neural_metrics: event.neural_metrics,
            component_source: event.component_source
          });

        if (eventError) throw eventError;

        // Actualizar métricas de sesión
        await updateSessionMetrics(supabaseClient, sessionId);

        return new Response(JSON.stringify({ 
          success: true, 
          session_id: sessionId 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get_analytics': {
        const days = data.days || 7;
        
        // Obtener métricas usando la función SQL
        const { data: metrics } = await supabaseClient
          .rpc('calculate_neural_metrics_summary', {
            user_id_param: user.id,
            days_back: days
          });

        // Obtener sesiones recientes
        const { data: sessions } = await supabaseClient
          .from('neural_telemetry_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(10);

        return new Response(JSON.stringify({
          metrics,
          recent_sessions: sessions,
          insights: generateInsights(metrics, sessions)
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'generate_recommendations': {
        const { data: userEvents } = await supabaseClient
          .from('neural_events')
          .select('*')
          .eq('user_id', user.id)
          .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('timestamp', { ascending: false })
          .limit(50);

        const recommendations = await generateAIRecommendations(userEvents);

        // Guardar recomendaciones
        for (const rec of recommendations) {
          await supabaseClient
            .from('ai_recommendations')
            .insert({
              user_id: user.id,
              recommendation_type: rec.type,
              content: rec.content,
              priority: rec.priority,
              neural_basis: rec.neural_basis,
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            });
        }

        return new Response(JSON.stringify({ recommendations }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        throw new Error('Unknown action');
    }
  } catch (error) {
    console.error('Neural Analytics Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function updateSessionMetrics(supabase: any, sessionId: string) {
  const { data: events } = await supabase
    .from('neural_events')
    .select('neural_metrics, event_data')
    .eq('session_id', sessionId);

  if (!events || events.length === 0) return;

  const avgEngagement = events.reduce((sum: number, e: any) => 
    sum + (e.event_data?.engagement || 0), 0) / events.length;
  
  const avgCoherence = events.reduce((sum: number, e: any) => 
    sum + (e.neural_metrics?.neural_coherence || 0), 0) / events.length;

  const sessionQuality = (avgEngagement + avgCoherence) / 2;

  await supabase
    .from('neural_telemetry_sessions')
    .update({
      total_events: events.length,
      avg_engagement: avgEngagement,
      avg_coherence: avgCoherence,
      session_quality: sessionQuality
    })
    .eq('id', sessionId);
}

function generateInsights(metrics: any, sessions: any[]) {
  const insights = [];

  if (metrics?.avg_engagement < 50) {
    insights.push({
      type: 'warning',
      title: 'Bajo Engagement',
      message: 'Tu nivel de engagement promedio es bajo. Considera tomar descansos más frecuentes.',
      action: 'adjust_study_schedule'
    });
  }

  if (metrics?.avg_coherence > 80) {
    insights.push({
      type: 'success',
      title: 'Excelente Coherencia Neural',
      message: '¡Tu coherencia neural es excepcional! Estás en un estado óptimo de aprendizaje.',
      action: 'continue_current_approach'
    });
  }

  if (sessions?.length > 0 && sessions[0].session_quality > 85) {
    insights.push({
      type: 'achievement',
      title: 'Sesión de Alta Calidad',
      message: 'Tu última sesión fue extraordinaria. ¡Mantén este ritmo!',
      action: 'maintain_momentum'
    });
  }

  return insights;
}

async function generateAIRecommendations(events: any[]) {
  // Análisis basico de patrones sin IA externa por ahora
  const recommendations = [];

  const avgEngagement = events.reduce((sum, e) => sum + (e.event_data?.engagement || 0), 0) / events.length;
  
  if (avgEngagement < 60) {
    recommendations.push({
      type: 'study_optimization',
      content: {
        title: 'Optimiza tu Ritmo de Estudio',
        description: 'Detectamos que tu engagement está bajo. Te recomendamos sesiones más cortas pero más frecuentes.',
        actions: ['Estudiar en bloques de 25 minutos', 'Tomar descansos de 5 minutos', 'Usar técnicas de respiración']
      },
      priority: 2,
      neural_basis: { avg_engagement: avgEngagement }
    });
  }

  return recommendations;
}
