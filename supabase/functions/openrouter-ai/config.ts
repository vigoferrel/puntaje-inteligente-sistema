
/**
 * Configuración para la función OpenRouter AI
 */

// URL base de la API de OpenRouter
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// URL de la aplicación para referencia en encabezados
export const APP_URL = 'https://app.paes-ai.com';

// Modelos disponibles en orden de prioridad
// Optimizado para costos con Gemini Flash 1.5 como modelo principal
export const MODELS = [
  'google/gemini-flash-1.5',              // Modelo principal - costo optimizado
  'google/gemini-2.0-flash-exp:free',     // Fallback gratuito
  'openai/gpt-4o-mini',                   // Segundo fallback
  'meta-llama/llama-3-70b-instruct',      // Tercer fallback
  'qwen/qwen2.5-vl-72b-instruct:free'     // Cuarto fallback
];

// Configuración de modelos avanzados con parámetros específicos
export const MODEL_CONFIGS = {
  'google/gemini-flash-1.5': {
    temperature: 0.7,
    max_tokens: 1000,        // Reducido para optimizar costos
    top_p: 0.95,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    multimodal: true,
    default_system_prompt: "Eres un asistente educativo experto en prueba PAES.",
    cost_tier: 'low'         // Marcador de costo bajo
  },
  'google/gemini-2.0-flash-exp:free': {
    temperature: 0.75,
    max_tokens: 800,         // Límite más estricto para modelo gratuito
    multimodal: false,
    cost_tier: 'free'
  },
  'openai/gpt-4o-mini': {
    temperature: 0.7,
    max_tokens: 900,
    top_p: 0.95,
    frequency_penalty: 0.1,
    presence_penalty: 0.1,
    multimodal: false,
    cost_tier: 'low'
  }
};

// Configuración desde variables de entorno
export const config = {
  OPENROUTER_API_KEY: Deno.env.get('OPENROUTER_API_KEY'),
  OPENROUTER_BASE_URL,
  APP_URL,
  MODEL_CONFIGS
};

// Configuración para seguimiento de uso y métricas
export const METRICS_CONFIG = {
  ENABLE_TRACKING: true,
  STORE_PROMPTS: true,
  LOG_LEVEL: 'info',
  CACHE_TTL: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
  QUOTA_TRACKING: true,
  COST_OPTIMIZATION: true,         // Nuevo: habilitamos optimización de costos
  MAX_RETRIES: 2,                  // Reducido para limitar costos por reintentos
};

// Categorías de contenido para optimización de prompts
export const CONTENT_CATEGORIES = {
  DIAGNOSTIC: 'diagnostic',
  EXERCISE: 'exercise',
  FEEDBACK: 'feedback',
  PERFORMANCE: 'performance',
  IMAGE: 'image'
};
