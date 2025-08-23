
import { config } from "../config.ts";
import { getOpenRouterHeaders, createErrorResponse, ServiceResult } from "./base-service.ts";
import { extractJsonFromContent } from "../utils/response-utils.ts";

/**
 * Función específica para llamar a modelos de visión para procesamiento de imágenes
 */
export async function callVisionModel(systemPrompt: string, userPrompt: string, imageData: string): Promise<ServiceResult<any>> {
  try {
    console.log('Llamando al modelo de visión con prompt del sistema:', systemPrompt.substring(0, 100) + '...');
    console.log('Prompt del usuario:', userPrompt.substring(0, 100) + '...');
    
    if (!config.OPENROUTER_API_KEY) {
      console.error('Falta la clave API de OpenRouter');
      throw new Error('La clave API de OpenRouter no está configurada');
    }
    
    const requestStartTime = Date.now();
    
    // Usar el modelo Qwen directamente ya que soporta imágenes
    const model = 'qwen/qwen2.5-vl-72b-instruct:free';
    console.log(`Usando modelo de visión: ${model}`);
    
    // Preparar array de contenido con texto e imagen
    const messages = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user',
        content: [
          { type: 'text', text: userPrompt }
        ]
      }
    ];

    // Agregar datos de imagen según el formato (URL o Base64)
    if (imageData.startsWith('data:image/')) {
      // Imagen Base64
      messages[1].content.push({
        type: 'image_url',
        image_url: { url: imageData }
      });
    } else {
      // Imagen URL
      messages[1].content.push({
        type: 'image_url',
        image_url: { url: imageData }
      });
    }

    const requestBody = JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.5,
      max_tokens: 1200
    });
    
    console.log('Estructura del cuerpo de solicitud de visión:', JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: '...' },
        { role: 'user', content: [{ type: 'text' }, { type: 'image_url' }] }
      ]
    }));
    
    const response = await fetch(`${config.OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: getOpenRouterHeaders(),
      body: requestBody
    });

    const requestDuration = Date.now() - requestStartTime;
    console.log(`Llamada a la API de visión de OpenRouter completada en ${requestDuration}ms con estado: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Respuesta de error de la API de visión de OpenRouter:', errorText);
      
      // Proporcionar una respuesta de respaldo
      const fallbackResponse = {
        response: "Lo siento, no he podido analizar esta imagen. Por favor, intenta con otra o proporciona más detalles sobre lo que necesitas."
      };
      
      return { 
        error: `Error procesando imagen (${response.status}): ${errorText}`,
        fallbackResponse
      };
    }

    const responseText = await response.text();
    console.log('Texto de respuesta crudo de visión:', responseText.substring(0, 200) + '...');
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error al analizar respuesta JSON:', e);
      return { error: `Error al analizar respuesta JSON: ${e.message}` };
    }
    
    console.log('Respuesta de visión recibida, primeros 200 caracteres del contenido:', 
      data.choices?.[0]?.message?.content?.substring(0, 200) + '...');
    
    const content = data.choices?.[0]?.message?.content || null;
    
    return { result: content };
  } catch (error) {
    console.error('Error llamando al modelo de visión:', error);
    
    // Proporcionar una respuesta de respaldo
    const fallbackResponse = {
      response: "Lo siento, no he podido analizar esta imagen debido a un error técnico. Por favor, intenta de nuevo más tarde."
    };
    
    return { 
      error: `Error llamando al modelo de visión: ${error.message}`,
      fallbackResponse
    };
  }
}
