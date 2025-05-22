
// Environment variables and constants
export const config = {
  OPENROUTER_API_KEY: Deno.env.get('OPENROUTER_API_KEY'),
  OPENROUTER_BASE_URL: "https://openrouter.ai/api/v1",
  APP_URL: "https://puntaje-inteligente-sistema.lovable.app"
};

// Available models in cascading priority order
export const MODELS = [
  'google/gemini-2.0-flash-exp:free',
  'anthropic/claude-3-haiku:2024-04-29',
  'meta-llama/llama-3-70b-instruct',
  'qwen/qwen2.5-vl-72b-instruct:free' // Vision model
];

// Vision-capable models
export const VISION_MODELS = [
  'qwen/qwen2.5-vl-72b-instruct:free'
];
