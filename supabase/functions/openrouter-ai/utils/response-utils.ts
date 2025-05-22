
// Funciones de utilidad para procesar respuestas del servicio OpenRouter AI

export function createSuccessResponse(result: any) {
  return {
    result,
    success: true,
  };
}

export function createErrorResponse(message: string, status: number = 400, fallbackResponse: any = null) {
  return {
    error: message,
    success: false,
    result: fallbackResponse,
  };
}

/**
 * Procesa la respuesta de la IA para asegurar un formato consistente
 */
export function processAIResponse(response: any): any {
  // Si la respuesta ya es un objeto, devolverla
  if (typeof response === 'object' && response !== null) {
    return response;
  }
  
  // Si la respuesta es una cadena, intentar analizarla como JSON
  if (typeof response === 'string') {
    try {
      return JSON.parse(response);
    } catch (e) {
      // No es un JSON válido, devolver como respuesta de texto
      return {
        response: response
      };
    }
  }
  
  // Valor predeterminado si la respuesta es nula o indefinida
  return {
    response: response || "No se recibió una respuesta válida"
  };
}

/**
 * Función mejorada para extraer JSON válido de una respuesta de texto
 * Implementa múltiples estrategias para recuperar estructuras JSON
 */
export function extractJsonFromContent(content: string): any {
  if (!content) {
    console.log('El contenido está vacío');
    return null;
  }

  try {
    // Intento directo de analizar como JSON
    return JSON.parse(content);
  } catch (e) {
    console.log('No se pudo analizar el contenido como JSON, probando métodos alternativos');
  }

  try {
    // 1. Buscar patrón de objeto JSON completo
    const jsonObjectPattern = /\{[\s\S]*\}/;
    const jsonObjectMatch = content.match(jsonObjectPattern);
    if (jsonObjectMatch && jsonObjectMatch[0]) {
      try {
        const cleanedJson = cleanJsonString(jsonObjectMatch[0]);
        console.log('Se encontró patrón de objeto JSON, intentando analizar');
        return JSON.parse(cleanedJson);
      } catch (e) {
        console.log('Se encontró patrón de objeto JSON pero falló al analizar:', e);
      }
    }

    // 2. Buscar patrón de array JSON completo
    const jsonArrayPattern = /\[[\s\S]*\]/;
    const jsonArrayMatch = content.match(jsonArrayPattern);
    if (jsonArrayMatch && jsonArrayMatch[0]) {
      try {
        const cleanedJson = cleanJsonString(jsonArrayMatch[0]);
        console.log('Se encontró patrón de array JSON, intentando analizar');
        return JSON.parse(cleanedJson);
      } catch (e) {
        console.log('Se encontró patrón de array JSON pero falló al analizar:', e);
      }
    }

    // 3. Intentar reconstruir el JSON manualmente
    const parsedContent = extractJsonStructure(content);
    if (parsedContent) {
      return parsedContent;
    }

    // 4. Si todos los intentos fallan, intentar arreglar problemas comunes
    console.log('Todos los intentos de análisis fallaron, intentando arreglar problemas comunes de JSON');
    const fixedContent = fixCommonJsonIssues(content);
    try {
      return JSON.parse(fixedContent);
    } catch (e) {
      console.log('No se pudo analizar el contenido como JSON, devolviendo contenido en crudo:', e);
      // Si todo falla, devolver el contenido tal cual
      return content;
    }
  } catch (error) {
    console.error('Error en extractJsonFromContent:', error);
    return content;
  }
}

/**
 * Limpia una cadena JSON de caracteres problemáticos comunes
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
      console.log('Se encontró candidato JSON, intentando analizar');
      return JSON.parse(jsonCandidate);
    } catch (e) {
      console.log('No se pudo analizar el candidato JSON, probando con el contenido completo');
    }
  }
  
  return null;
}

/**
 * Intenta corregir problemas comunes en cadenas JSON
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
 * Crea un diagnóstico de respaldo cuando la generación falla
 */
export function createDiagnosticFallback(
  testId: number, 
  title: string = "Diagnóstico de prueba",
  description: string = "Este es un diagnóstico generado automáticamente"
): any {
  console.log(`Creando diagnóstico de respaldo para ID de prueba: ${testId}`);
  
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
