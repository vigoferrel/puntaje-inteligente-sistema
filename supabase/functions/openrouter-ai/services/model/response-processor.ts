
import { MonitoringService } from "../monitoring-service.ts";
import { ServiceResult } from "../base-service.ts";
import { extractJsonFromContent } from "../../utils/json-extractor.ts";

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
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      MonitoringService.error('Error al analizar respuesta JSON:', e);
      return { 
        error: `Error al analizar respuesta JSON: ${e.message}`,
        fallbackResponse: {
          response: "Recibí una respuesta del modelo que no pude procesar correctamente."
        }
      };
    }
    
    MonitoringService.debug('Respuesta de OpenRouter recibida, primeros 200 caracteres del contenido:', 
      data.choices?.[0]?.message?.content?.substring(0, 200) + '...');
    
    const content = data.choices?.[0]?.message?.content || null;
    
    const parsedContent = extractJsonFromContent(content);
    
    return { result: parsedContent || content || null };
  }
};
