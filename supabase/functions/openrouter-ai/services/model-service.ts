
import { config, MODELS, MODEL_CONFIGS, METRICS_CONFIG } from "../config.ts";
import { getOpenRouterHeaders, createErrorResponse, ServiceResult } from "./base-service.ts";
import { handleApiError, processSuccessfulResponse } from "./error-handler.ts";
import { MonitoringService } from "./monitoring-service.ts";
import { trackModelUsage } from "./usage-tracking-service.ts";

/**
 * Intenta llamar a un modelo de OpenRouter con los prompts dados
 */
export async function attemptModelRequest(
  model: string, 
  systemPrompt: string, 
  userPrompt: string,
  requestId?: string
): Promise<Response> {
  // Obtener configuración específica del modelo
  const modelConfig = MODEL_CONFIGS[model] || {
    temperature: 0.7,
    max_tokens: 1000
  };
  
  const requestBody = JSON.stringify({
    model: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: modelConfig.temperature,
    max_tokens: modelConfig.max_tokens,
    top_p: modelConfig.top_p || 0.9,
    frequency_penalty: modelConfig.frequency_penalty || 0,
    presence_penalty: modelConfig.presence_penalty || 0,
    // Incluir request_id para seguimiento si está disponible
    ...(requestId ? { user: requestId } : {})
  });
  
  MonitoringService.info(`Realizando solicitud al modelo ${model}`, { 
    modelName: model,
    promptLength: userPrompt.length,
    requestId
  });
  
  const requestStartTime = Date.now();
  
  try {
    const response = await fetch(`${config.OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: getOpenRouterHeaders(),
      body: requestBody
    });
    
    const requestDuration = Date.now() - requestStartTime;
    
    // Registrar métricas de uso si el seguimiento está habilitado
    if (METRICS_CONFIG.ENABLE_TRACKING) {
      const success = response.ok;
      const status = response.status;
      
      // Registrar asíncronamente para no bloquear el flujo principal
      trackModelUsage({
        model,
        success,
        duration: requestDuration,
        status,
        requestId
      }).catch(err => {
        MonitoringService.error('Error al registrar uso del modelo:', err);
      });
    }
    
    return response;
  } catch (error) {
    const requestDuration = Date.now() - requestStartTime;
    MonitoringService.error(`Error de red durante solicitud a ${model} después de ${requestDuration}ms:`, error);
    
    // Registrar el error si el seguimiento está habilitado
    if (METRICS_CONFIG.ENABLE_TRACKING) {
      trackModelUsage({
        model,
        success: false,
        duration: requestDuration,
        error: error.message,
        requestId
      }).catch(err => {
        MonitoringService.error('Error al registrar uso fallido del modelo:', err);
      });
    }
    
    throw error;
  }
}

/**
 * Genera un ID de solicitud único para seguimiento
 */
function generateRequestId(): string {
  return crypto.randomUUID();
}

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
      return await handleApiError(response, attempts >= maxAttempts);
    }

    const result = await processSuccessfulResponse(response, requestId);
    
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
