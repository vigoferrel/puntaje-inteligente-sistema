
/**
 * Configuración para la función OpenRouter AI
 */

// URL base de la API de OpenRouter
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// URL de la aplicación para referencia en encabezados
export const APP_URL = 'https://app.paes-ai.com';

// Modelos disponibles en orden de prioridad
// Configurado para dar prioridad a Gemini 2.5 Flash Preview
export const MODELS = [
  'google/gemini-2.5-flash-preview',    // Modelo principal Gemini 2.5 Flash
  'google/gemini-2.0-flash-exp:free',   // Fallback: Gemini 2.0 Flash
  'anthropic/claude-3-haiku:2024-04-29', // Segundo fallback
  'meta-llama/llama-3-70b-instruct',     // Tercer fallback
  'qwen/qwen2.5-vl-72b-instruct:free'    // Cuarto fallback
];

// Configuración de modelos avanzados con parámetros específicos
export const MODEL_CONFIGS = {
  'google/gemini-2.5-flash-preview': {
    temperature: 0.7,
    max_tokens: 1500,
    top_p: 0.95,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    multimodal: true,
    default_system_prompt: "Eres un asistente educativo experto en prueba PAES."
  },
  'google/gemini-2.0-flash-exp:free': {
    temperature: 0.75,
    max_tokens: 1200,
    multimodal: false
  },
  'anthropic/claude-3-haiku:2024-04-29': {
    temperature: 0.7,
    max_tokens: 1000,
    multimodal: false
  }
};

// Configuración desde variables de entorno
export const config = {
  OPENROUTER_API_KEY: Deno.env.get('OPENROUTER_API_KEY'),
  OPENROUTER_BASE_URL,
  APP_URL,
};

// Configuración para seguimiento de uso y métricas
export const METRICS_CONFIG = {
  ENABLE_TRACKING: true,
  STORE_PROMPTS: true,
  LOG_LEVEL: 'info',
  CACHE_TTL: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
  QUOTA_TRACKING: true,
};

// Categorías de contenido para optimización de prompts
export const CONTENT_CATEGORIES = {
  DIAGNOSTIC: 'diagnostic',
  EXERCISE: 'exercise',
  FEEDBACK: 'feedback',
  PERFORMANCE: 'performance',
  IMAGE: 'image'
};
