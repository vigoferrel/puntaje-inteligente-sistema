
import { corsHeaders } from "../cors.ts";

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  message: string, 
  status: number = 500, 
  fallbackData: any = null
): Response {
  const responseBody = { 
    error: message,
    result: fallbackData // Include fallback data if available
  };
  
  return new Response(
    JSON.stringify(responseBody),
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
 * Process and normalize AI response data with enhanced error handling
 */
export function processAIResponse(result: any) {
  try {
    // Handle string responses
    if (typeof result === 'string') {
      // Try to parse it as JSON first
      try {
        return JSON.parse(result);
      } catch (e) {
        // Not valid JSON, return as text response
        return { response: result };
      }
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
  } catch (error) {
    console.error("Error processing AI response:", error);
    return { 
      response: "Ocurrió un error al procesar la respuesta del modelo.",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Attempts to extract JSON data from response content with improved robustness
 */
export function extractJsonFromContent(content: string | null): any {
  if (!content) return null;
  
  try {
    // If already an object, return as is
    if (typeof content === 'object') {
      return content;
    }
    
    // Clean up content to increase chances of valid JSON parsing
    let cleanedContent = content.trim();
    
    // Remove any leading/trailing markdown backticks and language identifiers
    cleanedContent = cleanedContent.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    
    // Look for JSON pattern in the string - find the outer most braces
    const jsonStartIndex = cleanedContent.indexOf('{');
    const jsonEndIndex = cleanedContent.lastIndexOf('}');
    
    if (jsonStartIndex >= 0 && jsonEndIndex > jsonStartIndex) {
      // Extract the potential JSON object
      const jsonCandidate = cleanedContent.substring(jsonStartIndex, jsonEndIndex + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch (innerError) {
        console.log('Could not parse JSON candidate, trying full content');
      }
    }
    
    // Try parsing the entire content as JSON
    try {
      return JSON.parse(cleanedContent);
    } catch (e) {
      console.log('Could not parse content as JSON, returning raw content:', e);
      return content;
    }
  } catch (e) {
    console.log('Error in extractJsonFromContent:', e);
    return content;
  }
}

/**
 * Create a structured diagnostic response fallback when parsing fails
 */
export function createDiagnosticFallback(testId: number, description: string = ""): any {
  return {
    title: `Diagnóstico para Test ${testId}`,
    description: description || "Diagnóstico generado con contenido predefinido.",
    exercises: [
      {
        id: `fallback-${crypto.randomUUID()}`,
        question: "¿Cuál es la idea principal del siguiente texto?",
        options: [
          "Opción A: Primer concepto",
          "Opción B: Segundo concepto", 
          "Opción C: Tercer concepto", 
          "Opción D: Cuarto concepto"
        ],
        correctAnswer: "Opción A: Primer concepto",
        explanation: "La opción A es correcta porque representa el concepto fundamental tratado en el texto.",
        skill: "INTERPRET_RELATE",
        difficulty: "INTERMEDIATE"
      },
      {
        id: `fallback-${crypto.randomUUID()}`,
        question: "Según el contexto, ¿qué se puede inferir del siguiente párrafo?",
        options: [
          "Opción A: Primera inferencia", 
          "Opción B: Segunda inferencia", 
          "Opción C: Tercera inferencia", 
          "Opción D: Cuarta inferencia"
        ],
        correctAnswer: "Opción C: Tercera inferencia",
        explanation: "La opción C es correcta porque se puede inferir directamente del contexto proporcionado.",
        skill: "INTERPRET_RELATE",
        difficulty: "INTERMEDIATE"
      }
    ]
  };
}
