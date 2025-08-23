
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string;
  context: {
    user_id: string;
    dimension: string;
    metrics: any;
    progress: any;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { message, context } = await req.json() as ChatRequest;

    // Obtener datos del usuario desde Supabase
    const { data: userData } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', context.user_id)
      .single();

    const { data: achievements } = await supabaseClient
      .from('user_achievements')
      .select('*')
      .eq('user_id', context.user_id)
      .order('unlocked_at', { ascending: false })
      .limit(5);

    const { data: progress } = await supabaseClient
      .from('user_node_progress')
      .select('*')
      .eq('user_id', context.user_id)
      .order('last_activity_at', { ascending: false })
      .limit(10);

    // Construir prompt contextual para la IA
    const systemPrompt = `Eres un asistente neural especializado en educación PAES y desarrollo cognitivo. 

CONTEXTO DEL USUARIO:
- Dimensión neural activa: ${context.dimension}
- Perfil: ${userData?.name || 'Estudiante'}
- Logros recientes: ${achievements?.map(a => a.title).join(', ') || 'Ninguno'}
- Progreso actual: ${progress?.length || 0} nodos en desarrollo

MÉTRICAS NEURALES ACTUALES:
${Object.entries(context.metrics || {}).map(([key, value]) => `- ${key}: ${value}%`).join('\n')}

Tu rol es:
1. Proporcionar orientación educativa personalizada
2. Analizar patrones de aprendizaje del estudiante
3. Sugerir estrategias de estudio optimizadas
4. Motivar y guiar hacia objetivos académicos
5. Explicar conceptos PAES de manera clara y adaptativa

Responde de manera empática, motivadora y científicamente precisa. Personaliza tus respuestas basándote en el contexto específico del usuario.`;

    // Llamar a OpenRouter API
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'Content-Type': 'application/json',
        'X-Title': 'Neural PAES Assistant'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter API error: ${openRouterResponse.statusText}`);
    }

    const aiResponse = await openRouterResponse.json();
    const assistantMessage = aiResponse.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from AI assistant');
    }

    // Registrar la conversación en Supabase
    await supabaseClient
      .from('lectoguia_conversations')
      .insert([
        {
          user_id: context.user_id,
          session_id: `neural-${Date.now()}`,
          message_type: 'user',
          content: message,
          subject_context: context.dimension,
          metadata: { neural_context: context.metrics }
        },
        {
          user_id: context.user_id,
          session_id: `neural-${Date.now()}`,
          message_type: 'assistant',
          content: assistantMessage,
          subject_context: context.dimension,
          metadata: { ai_model: 'claude-3.5-sonnet', response_type: 'neural_guidance' }
        }
      ]);

    // Crear notificación si es relevante
    if (assistantMessage.toLowerCase().includes('logro') || assistantMessage.toLowerCase().includes('objetivo')) {
      await supabaseClient
        .from('user_notifications')
        .insert({
          user_id: context.user_id,
          notification_type: 'ai_insight',
          title: 'Nueva Guía Neural',
          message: 'Tu asistente neural ha proporcionado una nueva recomendación personalizada',
          priority: 'normal',
          action_data: { dimension: context.dimension, conversation_id: `neural-${Date.now()}` }
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: assistantMessage,
        metadata: {
          dimension: context.dimension,
          processing_time: Date.now(),
          suggestions_provided: true
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in neural AI assistant:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        fallback_message: 'Disculpa, temporalmente no puedo procesar tu consulta. Intenta nuevamente en unos momentos.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
