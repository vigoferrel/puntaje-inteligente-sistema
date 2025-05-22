
import { MonitoringService } from "../monitoring-service.ts";
import { ServiceResult } from "../base-service.ts";
import { extractJsonFromContent } from "../../utils/json-extractor.ts";
import { processAIResponse } from "../../utils/response-formatters.ts";

/**
 * Servicio para procesar respuestas de los modelos
 */
export const processResponse = {
  /**
   * Maneja errores de la API de OpenRouter
   */
  async handleError(response: Response, allModelsAttempted: boolean): Promise<ServiceResult<any>> {
    const errorText = await response.text();
    MonitoringService.error('Respuesta de error de la API de OpenRouter:', errorText);
    
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      errorData = { error: { message: errorText } };
    }
    
    const errorMessage = errorData.error?.message || errorText || 'Error desconocido';
    const statusCode = response.status;
    
    // Proporcionar mensaje informativo basado en el tipo de error
    let userMessage = 'Se produjo un error al comunicarse con el modelo de IA.';
    
    if (statusCode === 429 && allModelsAttempted) {
      userMessage = "Todos los modelos están experimentando alta demanda actualmente. Por favor, intenta de nuevo más tarde.";
    } else if (statusCode === 401 || statusCode === 403) {
      userMessage = "Error de autenticación con el servicio de IA. Por favor, verifica la configuración.";
    } else if (statusCode >= 500) {
      userMessage = "El servicio de IA está experimentando problemas técnicos. Por favor, intenta de nuevo más tarde.";
    }
    
    // Crear una respuesta de respaldo
    const fallbackResponse = {
      response: userMessage
    };
    
    return { 
      error: `Error de OpenRouter (${statusCode}): ${errorMessage}`,
      fallbackResponse
    };
  },

  /**
   * Procesa respuestas exitosas de la API de OpenRouter
   */
  async handleSuccess(response: Response, requestId?: string): Promise<ServiceResult<any>> {
    const responseText = await response.text();
    MonitoringService.debug('Texto de respuesta crudo:', responseText.substring(0, 200) + '...');
    
    // Si la respuesta es texto vacío o muy corta
    if (!responseText || responseText.trim().length < 3) {
      return {
        error: 'Respuesta vacía o inválida del modelo',
        fallbackResponse: {
          response: "No se recibió una respuesta válida del modelo. Por favor intenta de nuevo."
        }
      };
    }
    
    // Intentar analizar como JSON primero
    try {
      const data = JSON.parse(responseText);
      
      MonitoringService.debug('Respuesta de OpenRouter recibida como JSON:', 
        data.choices?.[0]?.message?.content?.substring(0, 200) + '...');
      
      const content = data.choices?.[0]?.message?.content || null;
      
      // Intentar extraer JSON del contenido si hay contenido estructurado
      if (content) {
        try {
          const parsedContent = extractJsonFromContent(content);
          if (parsedContent) {
            return { result: parsedContent };
          }
        } catch (e) {
          // Si falla la extracción, usar el contenido original
          MonitoringService.debug('No se pudo extraer JSON del contenido:', e);
        }
      }
      
      // Si no hay JSON que extraer, devolver el contenido o los datos completos
      return { result: content || data || null };
      
    } catch (e) {
      // Si no es JSON, manejar como texto plano
      MonitoringService.debug('Respuesta no es JSON, procesando como texto plano:', responseText.substring(0, 200) + '...');
      
      // Procesar la respuesta para asegurar un formato consistente
      const processedResult = processAIResponse(responseText);
      console.log("Processed result for client:", processedResult);
      
      return { result: processedResult };
    }
  }
};
