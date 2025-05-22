
import { getOpenRouterHeaders } from "../base-service.ts";
import { MonitoringService } from "../monitoring-service.ts";
import { trackModelUsage } from "../usage-tracking-service.ts";
import { config, METRICS_CONFIG } from "../../config.ts";

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
  const modelConfig = config.MODEL_CONFIGS?.[model] || {
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
export function generateRequestId(): string {
  return crypto.randomUUID();
}
