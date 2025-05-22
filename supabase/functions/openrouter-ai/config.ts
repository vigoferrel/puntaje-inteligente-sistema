
/**
 * Configuración para la función OpenRouter AI
 */

// URL base de la API de OpenRouter
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// URL de la aplicación para referencia en encabezados
export const APP_URL = 'https://app.paes-ai.com';

// Modelos disponibles en orden de prioridad
// Añadir nuevos modelos o reordenar según disponibilidad/costo
export const MODELS = [
  'google/gemini-2.0-flash-exp:free',   // Rápido y gratuito
  'anthropic/claude-3-haiku:2024-04-29', // Buena calidad y relación velocidad/costo
  'meta-llama/llama-3-70b-instruct',     // Alta calidad
  'qwen/qwen2.5-vl-72b-instruct:free'    // Alternativo gratuito
];

// Configuración desde variables de entorno
export const config = {
  OPENROUTER_API_KEY: Deno.env.get('OPENROUTER_API_KEY'),
  OPENROUTER_BASE_URL,
  APP_URL,
};
