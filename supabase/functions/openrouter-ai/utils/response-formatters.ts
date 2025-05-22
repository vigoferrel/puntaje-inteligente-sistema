
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
 * Función mejorada para manejar diferentes formatos de respuesta
 */
export function processAIResponse(response: any): any {
  console.log("Procesando respuesta AI:", response ? typeof response : "null");
  
  // Si la respuesta es nula o undefined, proporcionar respuesta por defecto
  if (response === null || response === undefined) {
    return {
      response: "No se recibió una respuesta válida"
    };
  }
  
  // Si la respuesta ya es un objeto con una propiedad 'response', devolverla
  if (typeof response === 'object' && response !== null && 'response' in response) {
    return response;
  }
  
  // Si la respuesta ya es un objeto, pero sin propiedad 'response', encapsularla
  if (typeof response === 'object' && response !== null) {
    // Si el objeto tiene choices (formato OpenAI), extraer el contenido
    if ('choices' in response && Array.isArray(response.choices) && response.choices.length > 0) {
      const content = response.choices[0].message?.content;
      if (content) {
        return { response: content };
      }
    }
    
    // Para otros objetos, intentar encontrar el primer valor de texto
    for (const key of Object.keys(response)) {
      if (typeof response[key] === 'string') {
        return { response: response[key] };
      }
    }
    
    // Si no encontramos un valor de texto, serializar el objeto completo
    try {
      return { response: JSON.stringify(response) };
    } catch (e) {
      return { response: "Objeto no serializable" };
    }
  }
  
  // Importante: Si la respuesta es una cadena, encapsularla en un objeto
  if (typeof response === 'string') {
    // Intentar analizar la cadena como JSON
    try {
      const parsed = JSON.parse(response);
      // Si ya tiene la estructura esperada, devolverla
      if (typeof parsed === 'object' && parsed !== null) {
        if ('response' in parsed) {
          return parsed;
        } else {
          // Encapsular el objeto analizado
          return { response: parsed };
        }
      }
    } catch (e) {
      // No es un JSON válido, devolver como respuesta de texto
      // Este es el caso que estaba fallando - texto plano que no es JSON
      return { response: response };
    }
  }
  
  // Valor predeterminado si la respuesta es de un tipo no manejado
  return {
    response: "Respuesta en formato no reconocido"
  };
}
