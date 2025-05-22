
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { config } from "./config.ts";
import { corsHeaders } from "./cors.ts";
import { callOpenRouter, callVisionModel } from "./services/openrouter-service.ts";
import { 
  generateExercise, 
  analyzePerformance, 
  provideFeedback, 
  processImage 
} from "./handlers/action-handlers.ts";
import { createErrorResponse, createSuccessResponse } from "./utils/response-utils.ts";

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Check if API key exists
    if (!config.OPENROUTER_API_KEY) {
      console.error('No OpenRouter API key found');
      return createErrorResponse('OpenRouter API key no está configurado. Por favor, configura la clave en los secretos de Supabase.', 500);
    }
    
    console.log('Request received at:', new Date().toISOString());

    // Parse request data
    const { action, payload } = await parseRequestData(req);
    
    // Process the requested action
    const response = await processAction(action, payload);
    console.log('Response status:', response.status);
    
    return response;
  } catch (error) {
    console.error('Error in OpenRouter AI function:', error);
    
    // Provide a fallback response
    const fallbackResponse = {
      result: {
        response: "Lo siento, estamos experimentando problemas técnicos. Por favor, intenta de nuevo más tarde."
      }
    };
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallbackResponse
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

/**
 * Parses the request body to extract action and payload
 */
async function parseRequestData(req: Request): Promise<{ action: string; payload: any }> {
  try {
    const requestData = await req.json();
    const action = requestData.action;
    const payload = requestData.payload;
    
    console.log(`Processing ${action} request with payload:`, JSON.stringify({
      action: action,
      payloadSummary: payload ? `${Object.keys(payload).length} fields` : 'empty'
    }));
    
    return { action, payload };
  } catch (jsonError) {
    console.error("Error parsing request JSON:", jsonError);
    throw new Error('Invalid JSON in request body');
  }
}

/**
 * Routes the request to the appropriate handler based on the action
 */
async function processAction(action: string, payload: any): Promise<Response> {
  console.log(`Starting action: ${action}`);
  const startTime = Date.now();
  
  try {
    let response;
    
    switch (action) {
      case 'generate_exercise':
        response = await generateExercise(payload);
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
        console.error(`Invalid action specified: ${action}`);
        return createErrorResponse(`Acción inválida: ${action}`, 400);
    }
    
    const duration = Date.now() - startTime;
    console.log(`Action ${action} completed in ${duration}ms`);
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Action ${action} failed after ${duration}ms:`, error);
    
    // Return an error with a fallback response
    const fallbackResponse = {
      response: "Lo siento, hubo un problema procesando tu solicitud. Por favor, intenta de nuevo más tarde."
    };
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallbackResponse
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}
