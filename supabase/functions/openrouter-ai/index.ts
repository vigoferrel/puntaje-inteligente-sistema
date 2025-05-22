import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { 
  generateExercise, 
  generateExercisesBatch, 
  generateDiagnostic, 
  analyzePerformance, 
  provideFeedback, 
  processImage 
} from "./handlers/action-handlers.ts";
import { MonitoringService, LogLevel } from "./services/monitoring-service.ts";
import { CacheService } from "./services/cache-service.ts";
import { METRICS_CONFIG } from "./config.ts";
import { cleanExpiredCacheContent } from "./services/usage-tracking-service.ts";

console.log("OpenRouter AI Edge Function Started with Enhanced Gemini 2.5 Support and GPT-4.1-mini Fallback");

// Variable para el estado de salud del servicio
let serviceHealthy = true;
let startTime = Date.now();

// Programar limpieza de caché cada 30 minutos
const CACHE_CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutos en ms
setInterval(async () => {
  try {
    const result = await CacheService.cleanAllExpired();
    if (result.memory > 0 || result.db > 0) {
      MonitoringService.info(`Limpieza de caché completada: ${result.memory} elementos eliminados de memoria, ${result.db} de BD`);
    }
  } catch (error) {
    MonitoringService.error('Error en limpieza programada de caché:', error);
  }
}, CACHE_CLEANUP_INTERVAL);

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    // Endpoint de salud y estado
    if (url.pathname.endsWith('/health') || url.pathname.endsWith('/status')) {
      const uptime = Math.floor((Date.now() - startTime) / 1000);
      const metrics = MonitoringService.getMetrics();
      
      return new Response(JSON.stringify({
        status: serviceHealthy ? 'healthy' : 'degraded',
        uptime: `${uptime} segundos`,
        metrics,
        version: '3.1.0', // Versión actualizada para cascada con GPT-4.1-mini
        model: 'google/gemini-2.5-flash-preview',
        fallback_models: ['google/gemini-2.0-flash-exp:free', 'openai/gpt-4.1-mini']
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    
    const requestBody = await req.json();
    const { action, payload, requestId } = requestBody;

    if (!action) {
      MonitoringService.warn('Request sin acción especificada');
      return new Response(JSON.stringify({ error: 'Acción no especificada' }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    MonitoringService.info(`Processing action: ${action}`, { 
      payloadSize: JSON.stringify(payload).length,
      requestId: requestId || 'N/A'
    });
    
    let response;
    const actionStartTime = Date.now();
    
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
      
      const actionDuration = Date.now() - actionStartTime;
      MonitoringService.info(`Action ${action} completed in ${actionDuration}ms`);
      
      // Si la respuesta fue exitosa, marcar el servicio como saludable
      if (!response.error) {
        serviceHealthy = true;
      }
    } catch (handlerError) {
      const actionDuration = Date.now() - actionStartTime;
      MonitoringService.error(`Error executing action ${action} after ${actionDuration}ms:`, handlerError);
      response = {
        error: `Error ejecutando acción ${action}: ${handlerError.message}`,
        status: 500
      };
      
      // Si hay muchos errores consecutivos, marcar el servicio como degradado
      if (actionDuration > 10000) { // Si tarda más de 10 segundos
        serviceHealthy = false;
      }
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
    MonitoringService.error(`Error en edge function:`, error);
    
    // Marcar el servicio como degradado si hay error crítico
    serviceHealthy = false;
    
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
