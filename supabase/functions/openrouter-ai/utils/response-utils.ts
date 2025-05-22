
import { corsHeaders } from "../cors.ts";

/**
 * Creates a standardized error response
 */
export function createErrorResponse(message: string, status: number = 500): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse(data: any): Response {
  return new Response(
    JSON.stringify({ result: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

/**
 * Process and normalize AI response data
 */
export function processAIResponse(result: any) {
  // Handle string responses
  if (typeof result === 'string') {
    return { response: result };
  } 
  
  // Handle object responses
  if (result && typeof result === 'object') {
    // Ensure we have a response property
    if (!result.response && typeof result !== 'string') {
      result.response = "Lo siento, no pude generar una respuesta adecuada.";
    }
    return result;
  }
  
  // Fallback for unexpected formats
  return { response: "Lo siento, no pude generar una respuesta adecuada." };
}

/**
 * Attempts to extract JSON data from response content
 */
export function extractJsonFromContent(content: string | null): any {
  if (!content) return null;
  
  try {
    // If already an object, return as is
    if (typeof content === 'object') {
      return content;
    }
    
    // Look for JSON pattern in the string
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON pattern found, return content as is
    return content;
  } catch (e) {
    console.log('Could not parse content as JSON, returning raw content:', e);
    return content;
  }
}
