
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { generateExercise, generateExercisesBatch, generateDiagnostic, analyzePerformance, provideFeedback, processImage } from "./handlers/action-handlers.ts";

console.log("OpenRouter AI Edge Function Started");

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, payload } = await req.json();

    if (!action) {
      return new Response(JSON.stringify({ error: 'Acción no especificada' }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log(`Processing action: ${action}`);
    
    let response;
    try {
      switch (action) {
        case 'generate_exercise':
          response = await generateExercise(payload);
          break;
        case 'generate_exercises_batch':
          response = await generateExercisesBatch(payload);
          break;
        case 'generate_diagnostic':
          response = await generateDiagnostic(payload);
          break;
        case 'analyze_performance':
          response = await analyzePerformance(payload);
          break;
        case 'provide_feedback':
          response = await provideFeedback(payload);
          break;
        case 'process_image':
          response = await processImage(payload);
          break;
        default:
          response = {
            error: `Acción desconocida: ${action}`,
            status: 400
          };
      }
    } catch (handlerError) {
      console.error(`Error executing action ${action}:`, handlerError);
      response = {
        error: `Error ejecutando acción ${action}: ${handlerError.message}`,
        status: 500
      };
    }

    const statusCode = response.status || (response.error ? 500 : 200);
    return new Response(JSON.stringify(response), {
      status: statusCode,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(`Error en edge function:`, error);
    
    return new Response(
      JSON.stringify({
        error: `Error en edge function: ${error.message}`,
        result: {
          response: "Lo siento, hubo un error procesando tu solicitud. Por favor intenta de nuevo."
        }
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
