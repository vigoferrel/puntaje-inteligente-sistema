
import { callVisionModel } from "../services/openrouter-service.ts";
import { processAIResponse } from "../utils/response-utils.ts";

/**
 * Manejador para la acción de procesamiento de imágenes
 */
export async function processImage(payload: any): Promise<any> {
  const { image, prompt, context } = payload;
  
  if (!image) {
    console.error('No se proporcionó imagen para procesar');
    return {
      error: 'No se proporcionó imagen para procesar',
      result: { response: "Error: No se proporcionó una imagen para analizar." }
    };
  }
  
  console.log('Procesando imagen con prompt:', prompt || 'prompt predeterminado');
  
  const systemPrompt = `Eres un asistente especializado en analizar y extraer información de imágenes.
  Contexto: ${context || 'Análisis educativo'}.
  Debes analizar la imagen proporcionada y responder a la consulta del usuario.
  Si es posible, extrae cualquier texto visible en la imagen.
  Estructura tu respuesta como JSON cuando sea apropiado.`;

  const userPrompt = prompt || "Analiza esta imagen y extrae todo el texto que puedas encontrar. Describe brevemente su contenido.";

  const response = await callVisionModel(systemPrompt, userPrompt, image);
  
  if (response.error) {
    console.error('Error en el procesamiento de imagen:', response.error);
    return {
      error: response.error,
      result: response.fallbackResponse || { 
        response: "No se pudo analizar la imagen proporcionada debido a un error técnico." 
      }
    };
  }
  
  return { 
    result: processAIResponse(response.result) 
  };
}
