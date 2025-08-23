
import { config } from "../config.ts";
import { corsHeaders } from "../cors.ts";

// Constantes y configuración común
export const SERVICE_BASE_URL = config.OPENROUTER_BASE_URL;
export const APP_URL = config.APP_URL;

// Error común y manejo de respuestas
export type ServiceResult<T> = {
  result?: T;
  error?: string;
  fallbackResponse?: any;
};

/**
 * Genera encabezados estándar para las solicitudes a OpenRouter
 */
export function getOpenRouterHeaders() {
  return {
    'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': APP_URL,
    'X-Title': 'PAES Preparation Platform',
    'User-Agent': 'PAES-App/1.0'
  };
}

/**
 * Crea una respuesta HTTP con el formato adecuado
 */
export function createServiceResponse<T>(result: ServiceResult<T>, status: number = 200): Response {
  return new Response(JSON.stringify(result), {
    status: status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}

/**
 * Crea una respuesta de error estándar
 */
export function createErrorResponse(message: string, fallbackResponse: any = null): ServiceResult<null> {
  console.error('Error en servicio OpenRouter:', message);
  return {
    error: message,
    fallbackResponse
  };
}
