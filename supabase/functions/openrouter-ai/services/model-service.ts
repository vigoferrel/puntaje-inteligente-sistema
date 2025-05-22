
import { config, MODELS } from "../config.ts";
import { getOpenRouterHeaders, createErrorResponse, ServiceResult } from "./base-service.ts";

/**
 * Intenta llamar a un modelo de OpenRouter con los prompts dados
 */
export async function attemptModelRequest(
  model: string, 
  systemPrompt: string, 
  userPrompt: string
): Promise<Response> {
  const requestBody = JSON.stringify({
    model: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 1000
  });
  
  console.log(`Realizando solicitud al modelo ${model}`);
  
  try {
    return await fetch(`${config.OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: getOpenRouterHeaders(),
      body: requestBody
    });
  } catch (error) {
    console.error(`Error de red durante solicitud a ${model}:`, error);
    throw error;
  }
}

/**
 * Llama a la API de OpenRouter con estrategia de retroceso en cascada de modelos
 */
export async function callOpenRouter(systemPrompt: string, userPrompt: string): Promise<ServiceResult<any>> {
  try {
    console.log('Llamando a OpenRouter con prompt de sistema:', systemPrompt.substring(0, 100) + '...');
    console.log('Prompt del usuario:', userPrompt.substring(0, 100) + '...');
    
    if (!config.OPENROUTER_API_KEY) {
      console.error('Falta la clave API de OpenRouter');
      throw new Error('La clave API de OpenRouter no está configurada');
    }
    
    const requestStartTime = Date.now();
    
    // Intentar con cada modelo en orden hasta que uno funcione
    let response;
    let attempts = 0;
    const maxAttempts = MODELS.length;
    
    while (attempts < maxAttempts) {
      const currentModel = MODELS[attempts];
      console.log(`Intentando con el modelo: ${currentModel} (intento ${attempts + 1}/${maxAttempts})`);
      
      try {
        response = await attemptModelRequest(currentModel, systemPrompt, userPrompt);
        
        if (response.ok) {
          console.log(`El modelo ${currentModel} respondió exitosamente con estado:`, response.status);
          break;
        } else if (response.status === 429) {
          // Se encontró un límite de tasa, intentar con el siguiente modelo
          console.warn(`Límite de tasa alcanzado para el modelo ${currentModel}, probando el siguiente modelo...`);
          attempts++;
        } else {
          // Otro error, registrar e intentar con el siguiente modelo
          const errorText = await response.text().catch(() => 'No se pudo leer la respuesta de error');
          console.error(`Error con el modelo ${currentModel}: ${response.status}`, errorText);
          attempts++;
          
          if (attempts >= maxAttempts) {
            throw new Error(`Todos los modelos fallaron. Último error: Estado ${response.status}`);
          }
        }
      } catch (fetchError) {
        console.error(`Error de fetch con el modelo ${currentModel}:`, fetchError);
        attempts++;
        
        if (attempts >= maxAttempts) {
          throw new Error(`Error de red: ${fetchError.message}`);
        }
      }
    }

    const requestDuration = Date.now() - requestStartTime;
    console.log(`Llamada a la API de OpenRouter completada en ${requestDuration}ms con estado: ${response.status}`);

    if (!response.ok) {
      return await handleApiError(response, attempts >= maxAttempts);
    }

    return await processSuccessfulResponse(response);
  } catch (error) {
    console.error('Error llamando a OpenRouter:', error);
    
    // Crear una respuesta de respaldo
    const fallbackResponse = {
      response: "Lo siento, estoy experimentando problemas de conexión en este momento. Por favor, intenta de nuevo más tarde."
    };
    
    return { 
      error: `Error llamando a OpenRouter: ${error.message}`,
      fallbackResponse
    };
  }
}
