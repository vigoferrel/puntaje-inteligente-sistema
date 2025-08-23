
import { MonitoringService } from "../monitoring-service.ts";
import { config, MODELS } from "../../config.ts";
import { attemptModelRequest, generateRequestId } from "./request-service.ts";
import { processResponse } from "./response-processor.ts";
import { ServiceResult } from "../base-service.ts";

/**
 * Llama a la API de OpenRouter con estrategia de retroceso en cascada de modelos
 */
export async function callOpenRouter(
  systemPrompt: string, 
  userPrompt: string,
  preferredModel?: string
): Promise<ServiceResult<any>> {
  const requestId = generateRequestId();
  
  try {
    MonitoringService.info('Llamando a OpenRouter', {
      requestId,
      systemPromptPreview: systemPrompt.substring(0, 100) + '...',
      userPromptPreview: userPrompt.substring(0, 100) + '...',
      preferredModel
    });
    
    if (!config.OPENROUTER_API_KEY) {
      MonitoringService.error('Falta la clave API de OpenRouter');
      throw new Error('La clave API de OpenRouter no está configurada');
    }
    
    const requestStartTime = Date.now();
    
    // Lista de modelos a intentar - usar el preferido primero si se especifica
    const modelsToTry = preferredModel 
      ? [preferredModel, ...MODELS.filter(m => m !== preferredModel)]
      : MODELS;
    
    let response;
    let attempts = 0;
    let successfulModel = '';
    const maxAttempts = modelsToTry.length;
    
    while (attempts < maxAttempts) {
      const currentModel = modelsToTry[attempts];
      MonitoringService.info(`Intentando con el modelo: ${currentModel} (intento ${attempts + 1}/${maxAttempts})`, { requestId });
      
      try {
        response = await attemptModelRequest(currentModel, systemPrompt, userPrompt, requestId);
        
        if (response.ok) {
          MonitoringService.info(`El modelo ${currentModel} respondió exitosamente con estado:`, response.status);
          successfulModel = currentModel;
          break;
        } else if (response.status === 429) {
          // Se encontró un límite de tasa, intentar con el siguiente modelo
          MonitoringService.warn(`Límite de tasa alcanzado para el modelo ${currentModel}, probando el siguiente modelo...`, { requestId });
          attempts++;
        } else {
          // Otro error, registrar e intentar con el siguiente modelo
          const errorText = await response.text().catch(() => 'No se pudo leer la respuesta de error');
          MonitoringService.error(`Error con el modelo ${currentModel}: ${response.status}`, errorText);
          attempts++;
          
          if (attempts >= maxAttempts) {
            throw new Error(`Todos los modelos fallaron. Último error: Estado ${response.status}`);
          }
        }
      } catch (fetchError) {
        MonitoringService.error(`Error de fetch con el modelo ${currentModel}:`, fetchError);
        attempts++;
        
        if (attempts >= maxAttempts) {
          throw new Error(`Error de red: ${fetchError.message}`);
        }
      }
    }

    const requestDuration = Date.now() - requestStartTime;
    MonitoringService.info(`Llamada a la API de OpenRouter completada en ${requestDuration}ms`, { 
      status: response.status,
      model: successfulModel || 'no exitoso',
      attempts: attempts + 1,
      requestId
    });

    if (!response.ok) {
      return await processResponse.handleError(response, attempts >= maxAttempts);
    }

    const result = await processResponse.handleSuccess(response, requestId);
    
    // Agregar información sobre qué modelo respondió finalmente
    if (result && !result.error) {
      result.metadata = {
        ...(result.metadata || {}),
        modelUsed: successfulModel
      };
    }
    
    return result;
  } catch (error) {
    MonitoringService.error('Error llamando a OpenRouter:', error);
    
    // Crear una respuesta de respaldo
    const fallbackResponse = {
      response: "Lo siento, estoy experimentando problemas de conexión en este momento. Por favor, intenta de nuevo más tarde."
    };
    
    return { 
      error: `Error llamando a OpenRouter: ${error.message}`,
      fallbackResponse,
      requestId
    };
  }
}
