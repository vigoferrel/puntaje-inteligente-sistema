
import { toast } from "@/components/ui/use-toast";

interface OpenRouterRequest {
  action: string;
  payload: any;
  requestId?: string;
}

// Función para generar un UUID para seguimiento de solicitudes
const generateRequestId = () => {
  return 'req_' + Math.random().toString(36).substring(2, 11);
};

// Sistema de caché mejorado para respuestas frecuentes
interface CacheItem {
  timestamp: number;
  response: any;
  hits: number; // Contador de uso para mantener items populares
}

const responseCache: Record<string, CacheItem> = {};
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos
const MAX_CACHE_ITEMS = 200;

// Variables para el seguimiento del estado del servicio
let serviceHealthLastChecked = 0;
let serviceHealthStatus = true; // Asumimos que está saludable inicialmente
const HEALTH_CHECK_INTERVAL = 60000; // 1 minuto

/**
 * Verifica la salud del servicio sin bloquear si fue verificado recientemente
 */
async function checkServiceHealth(): Promise<boolean> {
  const now = Date.now();
  
  // Si verificamos recientemente, devolver el último estado conocido
  if (now - serviceHealthLastChecked < HEALTH_CHECK_INTERVAL) {
    return serviceHealthStatus;
  }
  
  try {
    // Hacer una solicitud liviana para verificar si el servicio está disponible
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://settifboilityelprvjd.supabase.co/functions/v1/openrouter-ai/health_check', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      cache: 'no-store'
    });
    
    clearTimeout(timeoutId);
    serviceHealthLastChecked = now;
    
    if (!response.ok) {
      serviceHealthStatus = false;
      return false;
    }
    
    const data = await response.json();
    serviceHealthStatus = data?.result?.status === 'available';
    return serviceHealthStatus;
  } catch (error) {
    serviceHealthLastChecked = now;
    serviceHealthStatus = false;
    return false;
  }
}

/**
 * Genera una clave de caché basada en la acción y payload
 */
function generateCacheKey(action: string, payload: any): string {
  // Para acciones que no deberían cachearse, incluir timestamp para que sea única
  if (['health_check', 'provide_exercise_feedback'].includes(action)) {
    return `${action}:${Date.now()}`;
  }
  
  // Simplificar y normalizar el payload para generar claves de caché consistentes
  const normalizedPayload = JSON.stringify(payload)
    .replace(/\s+/g, '')
    .substring(0, 200)
    .toLowerCase();
  
  return `${action}:${normalizedPayload}`;
}

/**
 * Mantiene el caché limpio eliminando entradas antiguas o menos usadas
 */
function cleanupCache() {
  const now = Date.now();
  const entries = Object.entries(responseCache);
  
  // Si el caché no está lleno, solo eliminar entradas expiradas
  if (entries.length < MAX_CACHE_ITEMS) {
    for (const [key, item] of entries) {
      if (now - item.timestamp > CACHE_TTL) {
        delete responseCache[key];
      }
    }
    return;
  }
  
  // Si el caché está lleno, eliminar basado en antigüedad y frecuencia de uso
  const sortedEntries = entries.sort((a, b) => {
    const ageScoreA = (now - a[1].timestamp) / CACHE_TTL; // 0-1+ (más alto = más viejo)
    const ageScoreB = (now - b[1].timestamp) / CACHE_TTL;
    
    const popularityScoreA = 1 / (a[1].hits + 1); // 0-1 (más bajo = más popular)
    const popularityScoreB = 1 / (b[1].hits + 1);
    
    // Combinación de edad y popularidad para determinar qué eliminar primero
    return (ageScoreA * 0.7 + popularityScoreA * 0.3) - (ageScoreB * 0.7 + popularityScoreB * 0.3);
  });
  
  // Eliminar el 20% de las entradas menos útiles
  const itemsToRemove = Math.max(Math.floor(sortedEntries.length * 0.2), 10);
  for (let i = 0; i < itemsToRemove; i++) {
    delete responseCache[sortedEntries[i][0]];
  }
}

/**
 * Obtiene una respuesta desde el caché si está disponible y es válida
 */
function getCachedResponse(cacheKey: string): any | null {
  const cachedItem = responseCache[cacheKey];
  if (!cachedItem) return null;
  
  const now = Date.now();
  if (now - cachedItem.timestamp > CACHE_TTL) {
    delete responseCache[cacheKey];
    return null;
  }
  
  // Incrementar contador de hits para mantenimiento del caché
  cachedItem.hits++;
  return cachedItem.response;
}

/**
 * Guarda una respuesta en el caché
 */
function cacheResponse(cacheKey: string, response: any) {
  // No cachear respuestas de error
  if (!response || (typeof response === 'object' && response.error)) return;
  
  responseCache[cacheKey] = {
    timestamp: Date.now(),
    response,
    hits: 1
  };
  
  // Mantener el caché limpio
  if (Object.keys(responseCache).length > MAX_CACHE_ITEMS * 0.9) {
    cleanupCache();
  }
}

/**
 * Servicio principal para comunicarse con la función de borde de OpenRouter
 * Con manejo mejorado de errores, caché y detección de estado
 */
export async function openRouterService<T>(request: OpenRouterRequest): Promise<T | null> {
  try {
    // Verificar estado del servicio antes de intentar la solicitud
    const cacheKey = generateCacheKey(request.action, request.payload);
    
    // Intentar obtener respuesta desde caché primero
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      console.log('OpenRouter: Usando respuesta en caché para', request.action);
      return cachedResponse as T;
    }
    
    // Verificar la salud del servicio (sin bloquear)
    const isHealthy = await checkServiceHealth();
    if (!isHealthy && request.action !== 'health_check') {
      console.warn('OpenRouter service health check failed, continuing with request anyway');
      
      // Para algunas acciones críticas, podemos devolver respuestas fallback inmediatas
      if (['provide_feedback', 'provide_exercise_feedback'].includes(request.action)) {
        return {
          response: "Estoy funcionando en modo offline con capacidades limitadas. Por favor intenta más tarde para acceder a todas mis funcionalidades."
        } as unknown as T;
      }
    }
    
    // Añadir un ID de solicitud para seguimiento si no existe
    const requestWithId = {
      ...request,
      requestId: request.requestId || generateRequestId()
    };
    
    // URL completa de la función de borde de Supabase
    const functionUrl = 'https://settifboilityelprvjd.supabase.co/functions/v1/openrouter-ai';
    
    console.log('OpenRouter: Enviando solicitud a', functionUrl, requestWithId);
    
    // Implementar un timeout para evitar solicitudes pendientes indefinidamente
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout
    
    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`
        },
        body: JSON.stringify(requestWithId),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter: Error en la respuesta:', response.status, errorText);
        
        // Actualizar estado del servicio si hay errores críticos
        if (response.status >= 500) {
          serviceHealthStatus = false;
        }
        
        // No mostrar toast para health checks para evitar spam de notificaciones
        if (request.action !== 'health_check') {
          // Manejos específicos según el código de estado con respuestas más amigables
          if (response.status === 404) {
            return { 
              response: "El servicio de AI está experimentando dificultades técnicas. Estamos trabajando para resolverlo." 
            } as unknown as T;
          } else if (response.status === 429) {
            return {
              response: "El servicio está experimentando alta demanda en este momento. Por favor intenta de nuevo en unos minutos."
            } as unknown as T;
          } else if (response.status === 504 || response.status === 503) {
            return {
              response: "El servicio de IA está temporalmente no disponible. Funcionaré con capacidades limitadas."
            } as unknown as T;
          } else {
            return {
              response: "Estoy teniendo problemas para acceder a mi base de conocimiento completa. Intentaré responder con lo que tengo disponible."
            } as unknown as T;
          }
        }
        
        throw new Error(`Error en solicitud OpenRouter: ${response.status}`);
      }
      
      // Restablecer el estado del servicio a saludable si la solicitud fue exitosa
      serviceHealthStatus = true;
      
      // Intenta procesar la respuesta como JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error al procesar respuesta JSON:', jsonError);
        throw new Error(`Error al procesar respuesta JSON: ${jsonError.message}`);
      }
      
      // Verificar estructura de respuesta esperada
      if (data.error) {
        console.error('OpenRouter: Error reportado en la respuesta:', data.error);
        throw new Error(`Error de la API: ${data.error}`);
      }
      
      console.log('OpenRouter: Respuesta exitosa de', request.action, data);
      
      // Cachear respuesta exitosa si es apropiada para caché (no health checks)
      if (request.action !== 'health_check') {
        cacheResponse(cacheKey, data.result);
      }
      
      // Devolver el resultado o un objeto vacío si es null/undefined
      return data.result || null;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Detectar si fue un error de timeout
      if (fetchError.name === 'AbortError') {
        // Retornar respuesta fallback para timeout sin mostrar toast
        return {
          response: "La respuesta está tardando más de lo esperado. Estoy funcionando en modo limitado en este momento."
        } as unknown as T;
      }
      
      // Cualquier otro error de red, retornar null para manejo superior
      throw fetchError;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('OpenRouter service error:', errorMessage, error);
    
    // No mostrar notificación aquí - dejarlo para el nivel superior (useOpenRouter)
    return null;
  }
}
