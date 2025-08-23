
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

const SUBJECT_CONTEXTS = {
  'COMPETENCIA_LECTORA': {
    name: 'Competencia Lectora',
    skills: ['comprensión', 'análisis textual', 'interpretación', 'evaluación crítica']
  },
  'MATEMATICA_1': {
    name: 'Matemática M1',
    skills: ['números', 'álgebra', 'geometría', 'datos y probabilidad']
  },
  'MATEMATICA_2': {
    name: 'Matemática M2', 
    skills: ['álgebra avanzada', 'funciones', 'probabilidad', 'estadística']
  },
  'CIENCIAS': {
    name: 'Ciencias',
    skills: ['biología', 'física', 'química', 'método científico']
  },
  'HISTORIA': {
    name: 'Historia y Ciencias Sociales',
    skills: ['análisis histórico', 'pensamiento temporal', 'fuentes', 'multicausalidad']
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, subject, sessionId, context } = await req.json();
    
    if (!message || !subject) {
      return new Response(
        JSON.stringify({ error: 'Message and subject are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const subjectContext = SUBJECT_CONTEXTS[subject as keyof typeof SUBJECT_CONTEXTS];
    
    if (!subjectContext) {
      return new Response(
        JSON.stringify({ error: 'Invalid subject' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Eres LectoGuía, un asistente especializado en ${subjectContext.name} para la preparación PAES en Chile.

ESPECIALIDADES:
- ${subjectContext.skills.join('\n- ')}

TU ROL ES:
1. Responder consultas específicas sobre ${subjectContext.name}
2. Generar ejercicios personalizados tipo PAES
3. Explicar conceptos de manera clara y didáctica
4. Proporcionar estrategias de estudio efectivas
5. Adaptar tu comunicación al nivel del estudiante

INSTRUCCIONES:
- Responde de manera clara, concisa y educativa
- Usa ejemplos prácticos relacionados con PAES
- Motiva al estudiante y mantén un tono positivo
- Si no entiendes algo, pide aclaración específica
- Enfócate únicamente en ${subjectContext.name}

Si el estudiante pide un ejercicio, genera uno formato PAES con 4 alternativas.`;

    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not found');
      return new Response(
        JSON.stringify({ 
          reply: `Como especialista en ${subjectContext.name}, estoy aquí para ayudarte con tu preparación PAES. ¿En qué tema específico te gustaría que te apoye?`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://paes-pro.app.com',
        'X-Title': 'PAES Pro - LectoGuía IA'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ 
          reply: `Como tu asistente en ${subjectContext.name}, estoy aquí para ayudarte. ¿Podrías reformular tu consulta o decirme en qué tema específico necesitas apoyo?`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 
      `Como especialista en ${subjectContext.name}, estoy aquí para ayudarte con tu preparación PAES. ¿En qué puedo asistirte específicamente?`;

    return new Response(
      JSON.stringify({ 
        reply,
        subject,
        sessionId,
        suggestions: [
          `Explícame ${subjectContext.skills[0]}`,
          `Genera un ejercicio de ${subjectContext.name}`,
          `Estrategias para ${subjectContext.name}`,
          `Consejos de estudio para PAES`
        ]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in lectoguia-chat function:', error);
    return new Response(
      JSON.stringify({ 
        reply: 'Disculpa, tuve un problema técnico. ¿Podrías intentar de nuevo con tu consulta?',
        error: 'Internal server error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
