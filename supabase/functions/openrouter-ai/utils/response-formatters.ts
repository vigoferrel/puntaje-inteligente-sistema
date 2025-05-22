
/**
 * Utilidades para crear respuestas con formato estándar
 */

/**
 * Crea una respuesta de éxito estándar
 */
export function createSuccessResponse(result: any) {
  return {
    result,
    success: true,
  };
}

/**
 * Crea una respuesta de error estándar
 */
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
