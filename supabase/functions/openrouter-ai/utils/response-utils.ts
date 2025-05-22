
// Utility functions for processing responses from the OpenRouter AI service

export function createSuccessResponse(result: any) {
  return new Response(
    JSON.stringify({
      result,
      success: true,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    }
  );
}

export function createErrorResponse(message: string, status: number = 400, fallbackResponse: any = null) {
  return new Response(
    JSON.stringify({
      error: message,
      success: false,
      result: fallbackResponse,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      status,
    }
  );
}

/**
 * Process AI response to ensure consistent format
 */
export function processAIResponse(response: any): any {
  // If response is already an object, return it
  if (typeof response === 'object' && response !== null) {
    return response;
  }
  
  // If response is a string, try to parse it as JSON
  if (typeof response === 'string') {
    try {
      return JSON.parse(response);
    } catch (e) {
      // Not valid JSON, return as text response
      return {
        response: response
      };
    }
  }
  
  // Fallback if response is null or undefined
  return {
    response: response || "No se recibió una respuesta válida"
  };
}

/**
 * Mejorada función para extraer JSON válido de una respuesta de texto
 * Implementa múltiples estrategias para recuperar estructuras JSON
 */
export function extractJsonFromContent(content: string): any {
  if (!content) {
    console.log('Content is empty');
    return null;
  }

  try {
    // Intento directo de parsear como JSON
    return JSON.parse(content);
  } catch (e) {
    console.log('Could not parse content as JSON, trying alternative methods');
  }

  try {
    // 1. Buscar patrón de objeto JSON completo
    const jsonObjectPattern = /\{[\s\S]*\}/;
    const jsonObjectMatch = content.match(jsonObjectPattern);
    if (jsonObjectMatch && jsonObjectMatch[0]) {
      try {
        const cleanedJson = cleanJsonString(jsonObjectMatch[0]);
        console.log('Found JSON object pattern, attempting to parse');
        return JSON.parse(cleanedJson);
      } catch (e) {
        console.log('Found JSON object pattern but failed to parse:', e);
      }
    }

    // 2. Buscar patrón de array JSON completo
    const jsonArrayPattern = /\[[\s\S]*\]/;
    const jsonArrayMatch = content.match(jsonArrayPattern);
    if (jsonArrayMatch && jsonArrayMatch[0]) {
      try {
        const cleanedJson = cleanJsonString(jsonArrayMatch[0]);
        console.log('Found JSON array pattern, attempting to parse');
        return JSON.parse(cleanedJson);
      } catch (e) {
        console.log('Found JSON array pattern but failed to parse:', e);
      }
    }

    // 3. Intentar reconstruir el JSON manualmente
    const parsedContent = extractJsonStructure(content);
    if (parsedContent) {
      return parsedContent;
    }

    // 4. Si todos los intentos fallan, intentar arreglar problemas comunes
    console.log('All parse attempts failed, trying to fix common JSON issues');
    const fixedContent = fixCommonJsonIssues(content);
    try {
      return JSON.parse(fixedContent);
    } catch (e) {
      console.log('Could not parse content as JSON, returning raw content:', e);
      // Si todo falla, devolver el contenido tal cual
      return content;
    }
  } catch (error) {
    console.error('Error in extractJsonFromContent:', error);
    return content;
  }
}

/**
 * Limpia un string JSON de caracteres problemáticos comunes
 */
function cleanJsonString(jsonString: string): string {
  // Eliminar backticks al principio y final
  let cleaned = jsonString.replace(/^```json\s*|```$/g, '');
  // Eliminar marcadores "```json" o "```" al principio y final
  cleaned = cleaned.replace(/^```(?:json)?\s*|```$/g, '');
  // Eliminar espacios en blanco extra al principio y final
  cleaned = cleaned.trim();
  return cleaned;
}

/**
 * Intenta extraer una estructura JSON válida de un texto
 */
function extractJsonStructure(text: string): any {
  // Buscar el inicio y fin de una estructura JSON
  const startIdx = text.indexOf('{');
  const endIdx = text.lastIndexOf('}');
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    try {
      const jsonCandidate = text.substring(startIdx, endIdx + 1);
      console.log('Found JSON candidate, trying to parse');
      return JSON.parse(jsonCandidate);
    } catch (e) {
      console.log('Could not parse JSON candidate, trying full content');
    }
  }
  
  return null;
}

/**
 * Intenta corregir problemas comunes en strings JSON
 */
function fixCommonJsonIssues(jsonString: string): string {
  // Eliminar caracteres no imprimibles
  let fixed = jsonString.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  
  // Reemplazar comillas simples por comillas dobles (excepto dentro de cadenas)
  fixed = fixed.replace(/(\w+)'(\w+)/g, '$1\\"$2');
  fixed = fixed.replace(/(\w+)'/g, '$1\\"');
  fixed = fixed.replace(/'(\w+)/g, '\\"$1');
  
  // Corregir comillas sin escape dentro de strings
  fixed = fixed.replace(/(?<=": ")([^"]*?)(?:")([^"]*?)(?=")/g, '$1\\"$2');
  
  // Corregir comas finales en objetos y arrays
  fixed = fixed.replace(/,\s*}/g, '}');
  fixed = fixed.replace(/,\s*\]/g, ']');
  
  // Añadir comillas a claves sin comillas
  fixed = fixed.replace(/(\{|\,)\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
  
  return fixed;
}

/**
 * Create a fallback diagnostic when generation fails
 */
export function createDiagnosticFallback(
  testId: number, 
  title: string = "Diagnóstico de prueba",
  description: string = "Este es un diagnóstico generado automáticamente"
): any {
  console.log(`Creating fallback diagnostic for test ID: ${testId}`);
  
  // Definir habilidades básicas según el testId
  const skills = ['comprensión', 'análisis', 'interpretación', 'razonamiento'];
  
  // Crear ejercicios de ejemplo para cada habilidad
  const exercises = skills.map((skill, index) => ({
    id: `fallback-${testId}-${index}`,
    question: `¿Qué habilidad se está evaluando en esta pregunta de ${skill}?`,
    options: [
      `Capacidad de ${skills[0]}`,
      `Habilidad de ${skills[1]}`,
      `Competencia en ${skills[2]}`,
      `Destreza de ${skills[3]}`
    ],
    correctAnswer: `Habilidad de ${skill}`,
    explanation: `Esta pregunta evalúa específicamente la habilidad de ${skill}`,
    skill: skill.toUpperCase(),
    difficulty: index % 3 === 0 ? "BASIC" : index % 3 === 1 ? "INTERMEDIATE" : "ADVANCED"
  }));
  
  return {
    title: title || `Diagnóstico para Test ${testId}`,
    description: description || "Diagnóstico generado como respaldo ante errores en la generación con IA",
    exercises
  };
}
