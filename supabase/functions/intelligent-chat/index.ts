
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      case 'start_conversation': {
        const { session_type, context } = data;

        // Crear nueva sesión de conversación
        const { data: session } = await supabaseClient
          .from('ai_conversation_sessions')
          .insert({
            user_id: user.id,
            session_type,
            context_data: context
          })
          .select('id')
          .single();

        return new Response(JSON.stringify({ 
          session_id: session.id,
          welcome_message: getWelcomeMessage(session_type, context)
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'send_message': {
        const { session_id, message, neural_context } = data;

        // Guardar mensaje del usuario
        await supabaseClient
          .from('ai_conversation_messages')
          .insert({
            session_id,
            role: 'user',
            content: message,
            neural_context
          });

        // Obtener contexto de la sesión
        const { data: session } = await supabaseClient
          .from('ai_conversation_sessions')
          .select('*, ai_conversation_messages(*)')
          .eq('id', session_id)
          .single();

        // Generar respuesta de IA (simulada por ahora)
        const aiResponse = await generateAIResponse(message, session, neural_context);

        // Guardar respuesta de IA
        await supabaseClient
          .from('ai_conversation_messages')
          .insert({
            session_id,
            role: 'assistant',
            content: aiResponse.content,
            processing_time_ms: aiResponse.processing_time,
            model_used: 'neural-assistant-v1',
            tokens_used: aiResponse.tokens_used
          });

        // Actualizar métricas de sesión
        await supabaseClient
          .from('ai_conversation_sessions')
          .update({
            total_messages: session.total_messages + 2, // usuario + asistente
            session_quality: calculateSessionQuality(session.ai_conversation_messages)
          })
          .eq('id', session_id);

        return new Response(JSON.stringify({
          response: aiResponse.content,
          suggestions: aiResponse.suggestions,
          neural_insights: aiResponse.neural_insights
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get_conversation_history': {
        const { session_id } = data;

        const { data: messages } = await supabaseClient
          .from('ai_conversation_messages')
          .select('*')
          .eq('session_id', session_id)
          .order('created_at', { ascending: true });

        return new Response(JSON.stringify({ messages }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        throw new Error('Unknown action');
    }
  } catch (error) {
    console.error('Intelligent Chat Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function getWelcomeMessage(sessionType: string, context: any) {
  const messages = {
    'study_assistant': '¡Hola! Soy tu asistente de estudio personalizado. Analizo tus métricas neurales para ofrecerte la mejor ayuda. ¿En qué puedo ayudarte hoy?',
    'lecture_guide': 'Bienvenido a LectoGuía IA. Estoy aquí para ayudarte a comprender mejor los textos y mejorar tu comprensión lectora. ¿Qué material quieres estudiar?',
    'paes_coach': '¡Hola futuro universitario! Soy tu coach personal para la PAES. Basándome en tu progreso neural, te ayudaré a optimizar tu preparación.',
    'career_counselor': 'Hola, soy tu consejero de carrera inteligente. Analizo tu perfil académico y preferencias para guiarte hacia la mejor decisión universitaria.'
  };

  return messages[sessionType as keyof typeof messages] || 'Hola, ¿cómo puedo ayudarte?';
}

async function generateAIResponse(message: string, session: any, neuralContext: any) {
  const startTime = Date.now();

  // Por ahora, respuestas inteligentes basadas en patrones
  // En el futuro, esto se conectará a OpenRouter
  let response = '';
  const suggestions = [];
  const neuralInsights = {};

  // Análisis del contexto neural
  const engagement = neuralContext?.real_time_engagement || 50;
  const coherence = neuralContext?.neural_coherence || 50;

  // Respuestas contextuales basadas en el tipo de sesión
  switch (session.session_type) {
    case 'study_assistant':
      if (engagement < 50) {
        response = `Noto que tu nivel de engagement está en ${engagement}%. Te sugiero tomar un descanso de 5 minutos y luego continuar con técnicas de estudio más dinámicas.`;
        suggestions.push('Tomar un descanso corto', 'Cambiar de técnica de estudio', 'Hacer ejercicio ligero');
      } else {
        response = `¡Excelente! Tu engagement está en ${engagement}%. Estás en un estado óptimo para el aprendizaje. ¿En qué tema específico quieres profundizar?`;
        suggestions.push('Continuar con el tema actual', 'Explorar conceptos avanzados', 'Practicar con ejercicios');
      }
      break;

    case 'lecture_guide':
      response = `Basándome en tu coherencia neural de ${coherence}%, voy a adaptar mi explicación. `;
      if (coherence > 70) {
        response += 'Puedo profundizar en conceptos complejos.';
        suggestions.push('Análisis profundo', 'Conexiones interdisciplinarias', 'Ejercicios avanzados');
      } else {
        response += 'Empezaré con conceptos básicos y aumentaré la complejidad gradualmente.';
        suggestions.push('Conceptos fundamentales', 'Ejemplos prácticos', 'Repaso paso a paso');
      }
      break;

    case 'paes_coach':
      response = `Tu estado neural actual indica que estás `;
      if (engagement > 70 && coherence > 70) {
        response += 'en condiciones óptimas para practicar preguntas de alta dificultad.';
        suggestions.push('Simulacro completo', 'Preguntas complejas', 'Análisis de errores');
      } else {
        response += 'en un estado que requiere refuerzo de conceptos básicos antes de avanzar.';
        suggestions.push('Repaso conceptual', 'Ejercicios básicos', 'Técnicas de relajación');
      }
      break;

    default:
      response = 'Entiendo tu consulta. Basándome en tus métricas neurales actuales, puedo ayudarte de manera personalizada.';
  }

  // Añadir insights neurales
  Object.assign(neuralInsights, {
    engagement_level: engagement,
    coherence_level: coherence,
    optimal_study_time: engagement > 60 && coherence > 60,
    recommended_break: engagement < 40 || coherence < 40
  });

  const processingTime = Date.now() - startTime;

  return {
    content: response,
    suggestions,
    neural_insights: neuralInsights,
    processing_time: processingTime,
    tokens_used: Math.floor(response.length / 4) // Estimación
  };
}

function calculateSessionQuality(messages: any[]) {
  if (!messages || messages.length === 0) return 0;
  
  // Calidad basada en longitud promedio de respuestas y frecuencia
  const avgLength = messages.reduce((sum, msg) => sum + msg.content.length, 0) / messages.length;
  const messageFrequency = messages.length;
  
  return Math.min(100, (avgLength / 100) * 30 + (messageFrequency * 10));
}
