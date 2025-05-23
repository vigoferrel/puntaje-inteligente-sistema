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

// Función para obtener la clave de autorización de forma segura
function getAuthorizationKey(): string {
  // Intentar obtener la clave desde diferentes fuentes
  const viteKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;
  const envKey = process?.env?.VITE_SUPABASE_ANON_KEY;
  
  // Clave anon de Supabase hardcodeada como fallback (es pública y segura)
  const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ';
  
  return viteKey || envKey || fallbackKey;
}

/**
 * Verifica la salud del servicio con mejor manejo de errores y reintentos
 */
async function checkServiceHealth(): Promise<boolean> {
  const now = Date.now();
  
  // Si verificamos recientemente, devolver el último estado conocido
  if (now - serviceHealthLastChecked < HEALTH_CHECK_INTERVAL) {
    return serviceHealthStatus;
  }
  
  const maxRetries = 2;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      console.log(`OpenRouter: Verificando salud del servicio (intento ${retryCount + 1}/${maxRetries})`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Aumentado a 8 segundos
      
      const functionUrl = 'https://settifboilityelprvjd.supabase.co/functions/v1/openrouter-ai';
      const authKey = getAuthorizationKey();
      
      console.log(`OpenRouter: Usando clave de autorización: ${authKey.substring(0, 20)}...`);
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authKey}`
        },
        body: JSON.stringify({
          action: 'health_check',
          payload: {},
          requestId: generateRequestId()
        }),
        signal: controller.signal,
        cache: 'no-store'
      });
      
      clearTimeout(timeoutId);
      serviceHealthLastChecked = now;
      
      if (!response.ok) {
        console.warn(`OpenRouter: Health check falló con estado: ${response.status}`);
        const errorText = await response.text().catch(() => 'No se pudo leer el error');
        console.warn(`OpenRouter: Error detail: ${errorText}`);
        
        // Si es un error 401, esperar un poco más antes del siguiente intento
        if (response.status === 401) {
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`OpenRouter: Error 401, reintentando en 2 segundos...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
        }
        
        serviceHealthStatus = false;
        return false;
      }
      
      const data = await response.json();
      serviceHealthStatus = data?.result?.status === 'available' || response.ok;
      console.log(`OpenRouter: Health check exitoso:`, serviceHealthStatus);
      return serviceHealthStatus;
      
    } catch (error) {
      console.warn(`OpenRouter: Health check falló (intento ${retryCount + 1}):`, error);
      retryCount++;
      
      if (retryCount < maxRetries) {
        console.log(`OpenRouter: Reintentando health check en 1 segundo...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      serviceHealthLastChecked = now;
      serviceHealthStatus = false;
      return false;
    }
  }
  
  return false;
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
 * Servicio principal mejorado con mejor manejo de conexión
 */
export async function openRouterService<T>(request: OpenRouterRequest): Promise<T | null> {
  const requestId = request.requestId || generateRequestId();
  
  try {
    console.log(`OpenRouter [${requestId}]: Iniciando solicitud - action: ${request.action}`);
    
    const cacheKey = generateCacheKey(request.action, request.payload);
    
    // Intentar obtener respuesta desde caché primero (solo para acciones no críticas)
    if (request.action !== 'health_check') {
      const cachedResponse = getCachedResponse(cacheKey);
      if (cachedResponse) {
        console.log(`OpenRouter [${requestId}]: Usando respuesta en caché para ${request.action}`);
        return cachedResponse as T;
      }
    }
    
    // Verificar la salud del servicio con reintentos mejorados
    const isHealthy = await checkServiceHealth();
    if (!isHealthy && request.action !== 'health_check') {
      console.warn(`OpenRouter [${requestId}]: Servicio no disponible después de verificaciones`);
      
      // Para algunas acciones críticas, devolver respuestas fallback inmediatas
      if (['provide_feedback', 'provide_exercise_feedback'].includes(request.action)) {
        return {
          response: "Estoy funcionando en modo offline con capacidades limitadas. Por favor intenta más tarde para acceder a todas mis funcionalidades."
        } as unknown as T;
      }
    }
    
    const requestWithId = {
      ...request,
      requestId
    };
    
    const functionUrl = 'https://settifboilityelprvjd.supabase.co/functions/v1/openrouter-ai';
    const authKey = getAuthorizationKey();
    
    console.log(`OpenRouter [${requestId}]: Enviando a ${functionUrl}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000); // Timeout aumentado
    
    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authKey}`
        },
        body: JSON.stringify(requestWithId),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter [${requestId}]: Error HTTP ${response.status}:`, errorText);
        
        // Actualizar estado del servicio si hay errores críticos
        if (response.status >= 500) {
          serviceHealthStatus = false;
        }
        
        // No mostrar toast para health checks para evitar spam de notificaciones
        if (request.action !== 'health_check') {
          if (response.status === 401) {
            console.error(`OpenRouter [${requestId}]: Error de autorización`);
            return { 
              response: "Hay un problema de autorización con el servicio. Por favor verifica la configuración." 
            } as unknown as T;
          } else if (response.status === 404) {
            console.error(`OpenRouter [${requestId}]: Endpoint no encontrado`);
            return { 
              response: "El servicio de AI está experimentando dificultades técnicas. Estamos trabajando para resolverlo." 
            } as unknown as T;
          } else if (response.status === 429) {
            console.warn(`OpenRouter [${requestId}]: Rate limit alcanzado`);
            return {
              response: "El servicio está experimentando alta demanda en este momento. Por favor intenta de nuevo en unos minutos."
            } as unknown as T;
          } else if (response.status === 504 || response.status === 503) {
            console.error(`OpenRouter [${requestId}]: Servicio no disponible`);
            return {
              response: "El servicio de IA está temporalmente no disponible. Funcionaré con capacidades limitadas."
            } as unknown as T;
          }
        }
        
        throw new Error(`Error en solicitud OpenRouter: ${response.status}`);
      }
      
      // Restablecer el estado del servicio a saludable si la solicitud fue exitosa
      serviceHealthStatus = true;
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error(`OpenRouter [${requestId}]: Error procesando JSON:`, jsonError);
        throw new Error(`Error al procesar respuesta JSON: ${jsonError.message}`);
      }
      
      if (data.error) {
        console.error(`OpenRouter [${requestId}]: Error en respuesta:`, data.error);
        throw new Error(`Error de la API: ${data.error}`);
      }
      
      console.log(`OpenRouter [${requestId}]: Respuesta exitosa para ${request.action}`);
      
      // Cachear respuesta exitosa si es apropiada para caché
      if (request.action !== 'health_check') {
        cacheResponse(cacheKey, data.result);
      }
      
      return data.result || null;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.warn(`OpenRouter [${requestId}]: Timeout de solicitud`);
        return {
          response: "La respuesta está tardando más de lo esperado. Estoy funcionando en modo limitado en este momento."
        } as unknown as T;
      }
      
      throw fetchError;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`OpenRouter [${requestId}]: Error del servicio:`, errorMessage, error);
    
    return null;
  }
}
