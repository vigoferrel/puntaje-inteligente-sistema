
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
 * Versión mejorada para manejar múltiples formatos de respuesta
 */
export function processAIResponse(response: any): any {
  console.log("Procesando respuesta AI:", response ? typeof response : "null");
  
  // Si la respuesta es nula o undefined, proporcionar respuesta por defecto
  if (response === null || response === undefined) {
    console.log("Respuesta nula o undefined, devolviendo objeto estándar");
    return {
      response: "No se recibió una respuesta válida"
    };
  }
  
  // Si la respuesta ya es un objeto con una propiedad 'response', devolverla directamente
  if (typeof response === 'object' && response !== null && 'response' in response) {
    console.log("Respuesta ya tiene formato adecuado con propiedad 'response'");
    return response;
  }
  
  // Si la respuesta ya es un objeto, pero sin propiedad 'response', encapsularla
  if (typeof response === 'object' && response !== null) {
    console.log("Respuesta es un objeto sin propiedad 'response', procesando");
    // Si el objeto tiene choices (formato OpenAI), extraer el contenido
    if ('choices' in response && Array.isArray(response.choices) && response.choices.length > 0) {
      const content = response.choices[0].message?.content;
      if (content) {
        console.log("Extraído contenido de formato OpenAI");
        return { response: content };
      }
    }
    
    // Para otros objetos, intentar encontrar el primer valor de texto
    for (const key of Object.keys(response)) {
      if (typeof response[key] === 'string') {
        console.log(`Usando propiedad string '${key}' como respuesta`);
        return { response: response[key] };
      }
    }
    
    // Si no encontramos un valor de texto, serializar el objeto completo
    try {
      console.log("Serializando objeto completo como respuesta");
      return { response: JSON.stringify(response) };
    } catch (e) {
      console.log("Error al serializar objeto:", e);
      return { response: "Objeto no serializable" };
    }
  }
  
  // Caso crítico: Si la respuesta es una cadena, encapsularla en un objeto
  if (typeof response === 'string') {
    console.log("La respuesta es una cadena de texto directa, encapsulando");
    // Intentar analizar la cadena como JSON primero
    try {
      const parsed = JSON.parse(response);
      // Si ya tiene la estructura esperada, devolverla
      if (typeof parsed === 'object' && parsed !== null) {
        if ('response' in parsed) {
          console.log("La cadena JSON ya tiene estructura adecuada");
          return parsed;
        } else {
          console.log("Encapsulando objeto JSON parseado");
          return { response: parsed };
        }
      }
    } catch (e) {
      // No es un JSON válido, devolver como respuesta de texto plano
      console.log("No es JSON válido, devolviendo como texto plano");
    }
    
    // Este es el caso principal que estaba fallando - respuesta de texto plano
    return { response: response };
  }
  
  // Valor predeterminado si la respuesta es de un tipo no manejado
  console.log("Tipo de respuesta no reconocido:", typeof response);
  return {
    response: "Respuesta en formato no reconocido"
  };
}
