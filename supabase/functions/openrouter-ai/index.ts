
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
    // Verify API key exists
    if (!config.OPENROUTER_API_KEY) {
      return createErrorResponse('OpenRouter API key no está configurado. Por favor, configura la clave en los secretos de Supabase.', 500);
    }

    // Parse request data
    const { action, payload } = await parseRequestData(req);
    
    // Process the requested action
    return await processAction(action, payload);
  } catch (error) {
    console.error('Error in OpenRouter AI function:', error);
    return createErrorResponse(error.message, 500);
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
    console.log(`Processing ${action} request with payload:`, JSON.stringify(payload));
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
  switch (action) {
    case 'generate_exercise':
      return await generateExercise(payload);
    case 'analyze_performance':
      return await analyzePerformance(payload);
    case 'provide_feedback':
      return await provideFeedback(payload);
    case 'process_image':
      return await processImage(payload);
    default:
      console.error(`Invalid action specified: ${action}`);
      return createErrorResponse(`Acción inválida: ${action}`, 400);
  }
}
