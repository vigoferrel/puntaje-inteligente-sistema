
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
  hits: number;
}

const responseCache: Record<string, CacheItem> = {};
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos
const MAX_CACHE_ITEMS = 200;

// Variables para el seguimiento del estado del servicio
let serviceHealthLastChecked = 0;
let serviceHealthStatus = true;
const HEALTH_CHECK_INTERVAL = 60000; // 1 minuto

// Función para obtener la clave de autorización de forma segura
function getAuthorizationKey(): string {
  // Clave anon de Supabase (es pública y segura)
  const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ';
  
  // Intentar obtener desde variables de entorno
  if (typeof window !== 'undefined') {
    return import.meta.env?.VITE_SUPABASE_ANON_KEY || fallbackKey;
  }
  
  return fallbackKey;
}

/**
 * Verifica la salud del servicio con mejor manejo de errores
 */
async function checkServiceHealth(): Promise<boolean> {
  const now = Date.now();
  
  if (now - serviceHealthLastChecked < HEALTH_CHECK_INTERVAL) {
    return serviceHealthStatus;
  }
  
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      console.log(`OpenRouter: Health check intento ${retryCount + 1}/${maxRetries}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const functionUrl = 'https://settifboilityelprvjd.supabase.co/functions/v1/openrouter-ai';
      const authKey = getAuthorizationKey();
      
      console.log(`OpenRouter: Enviando health check a ${functionUrl}`);
      console.log(`OpenRouter: Usando auth key: ${authKey.substring(0, 20)}...`);
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authKey}`,
          'apikey': authKey
        },
        body: JSON.stringify({
          action: 'health_check',
          payload: {},
          requestId: generateRequestId()
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      serviceHealthLastChecked = now;
      
      console.log(`OpenRouter: Health check response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No se pudo leer el error');
        console.warn(`OpenRouter: Health check falló: ${response.status} - ${errorText}`);
        
        if (response.status === 401) {
          console.error('OpenRouter: Error de autorización - verificar clave API');
        }
        
        retryCount++;
        if (retryCount < maxRetries) {
          console.log(`OpenRouter: Reintentando en 2 segundos...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        
        serviceHealthStatus = false;
        return false;
      }
      
      const data = await response.json();
      console.log('OpenRouter: Health check response:', data);
      
      serviceHealthStatus = data?.result?.status === 'available' || response.ok;
      console.log(`OpenRouter: Service health status: ${serviceHealthStatus}`);
      return serviceHealthStatus;
      
    } catch (error) {
      console.error(`OpenRouter: Health check error (intento ${retryCount + 1}):`, error);
      retryCount++;
      
      if (retryCount < maxRetries) {
        console.log(`OpenRouter: Reintentando health check en ${retryCount * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
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
  if (['health_check', 'provide_exercise_feedback'].includes(action)) {
    return `${action}:${Date.now()}`;
  }
  
  const normalizedPayload = JSON.stringify(payload)
    .replace(/\s+/g, '')
    .substring(0, 200)
    .toLowerCase();
  
  return `${action}:${normalizedPayload}`;
}

/**
 * Mantiene el caché limpio
 */
function cleanupCache() {
  const now = Date.now();
  const entries = Object.entries(responseCache);
  
  if (entries.length < MAX_CACHE_ITEMS) {
    for (const [key, item] of entries) {
      if (now - item.timestamp > CACHE_TTL) {
        delete responseCache[key];
      }
    }
    return;
  }
  
  const sortedEntries = entries.sort((a, b) => {
    const ageScoreA = (now - a[1].timestamp) / CACHE_TTL;
    const ageScoreB = (now - b[1].timestamp) / CACHE_TTL;
    const popularityScoreA = 1 / (a[1].hits + 1);
    const popularityScoreB = 1 / (b[1].hits + 1);
    return (ageScoreA * 0.7 + popularityScoreA * 0.3) - (ageScoreB * 0.7 + popularityScoreB * 0.3);
  });
  
  const itemsToRemove = Math.max(Math.floor(sortedEntries.length * 0.2), 10);
  for (let i = 0; i < itemsToRemove; i++) {
    delete responseCache[sortedEntries[i][0]];
  }
}

/**
 * Obtiene una respuesta desde el caché
 */
function getCachedResponse(cacheKey: string): any | null {
  const cachedItem = responseCache[cacheKey];
  if (!cachedItem) return null;
  
  const now = Date.now();
  if (now - cachedItem.timestamp > CACHE_TTL) {
    delete responseCache[cacheKey];
    return null;
  }
  
  cachedItem.hits++;
  return cachedItem.response;
}

/**
 * Guarda una respuesta en el caché
 */
function cacheResponse(cacheKey: string, response: any) {
  if (!response || (typeof response === 'object' && response.error)) return;
  
  responseCache[cacheKey] = {
    timestamp: Date.now(),
    response,
    hits: 1
  };
  
  if (Object.keys(responseCache).length > MAX_CACHE_ITEMS * 0.9) {
    cleanupCache();
  }
}

/**
 * Servicio principal mejorado
 */
export async function openRouterService<T>(request: OpenRouterRequest): Promise<T | null> {
  const requestId = request.requestId || generateRequestId();
  
  try {
    console.log(`OpenRouter [${requestId}]: Iniciando solicitud - action: ${request.action}`);
    
    const cacheKey = generateCacheKey(request.action, request.payload);
    
    // Verificar caché para acciones no críticas
    if (request.action !== 'health_check') {
      const cachedResponse = getCachedResponse(cacheKey);
      if (cachedResponse) {
        console.log(`OpenRouter [${requestId}]: Usando respuesta en caché`);
        return cachedResponse as T;
      }
    }
    
    // Verificar salud del servicio
    const isHealthy = await checkServiceHealth();
    if (!isHealthy && request.action !== 'health_check') {
      console.warn(`OpenRouter [${requestId}]: Servicio no disponible`);
      
      if (['provide_feedback', 'provide_exercise_feedback'].includes(request.action)) {
        return {
          response: "Estoy funcionando en modo offline con capacidades limitadas. Por favor intenta más tarde para acceder a todas mis funcionalidades."
        } as unknown as T;
      }
      
      return null;
    }
    
    const requestWithId = { ...request, requestId };
    const functionUrl = 'https://settifboilityelprvjd.supabase.co/functions/v1/openrouter-ai';
    const authKey = getAuthorizationKey();
    
    console.log(`OpenRouter [${requestId}]: Enviando solicitud a ${functionUrl}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authKey}`,
          'apikey': authKey
        },
        body: JSON.stringify(requestWithId),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`OpenRouter [${requestId}]: Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter [${requestId}]: Error HTTP ${response.status}:`, errorText);
        
        if (response.status >= 500) {
          serviceHealthStatus = false;
        }
        
        if (request.action !== 'health_check') {
          if (response.status === 401) {
            console.error(`OpenRouter [${requestId}]: Error de autorización`);
            return { 
              response: "Hay un problema de autorización con el servicio. Por favor verifica la configuración." 
            } as unknown as T;
          } else if (response.status === 404) {
            console.error(`OpenRouter [${requestId}]: Endpoint no encontrado`);
            return { 
              response: "El servicio de AI está experimentando dificultades técnicas." 
            } as unknown as T;
          } else if (response.status === 429) {
            console.warn(`OpenRouter [${requestId}]: Rate limit alcanzado`);
            return {
              response: "El servicio está experimentando alta demanda. Por favor intenta de nuevo en unos minutos."
            } as unknown as T;
          }
        }
        
        throw new Error(`Error en solicitud OpenRouter: ${response.status}`);
      }
      
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
      
      console.log(`OpenRouter [${requestId}]: Respuesta exitosa`);
      
      // Cachear respuesta exitosa
      if (request.action !== 'health_check') {
        cacheResponse(cacheKey, data.result);
      }
      
      return data.result || null;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.warn(`OpenRouter [${requestId}]: Timeout de solicitud`);
        return {
          response: "La respuesta está tardando más de lo esperado. Funcionando en modo limitado."
        } as unknown as T;
      }
      
      throw fetchError;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`OpenRouter [${requestId}]: Error del servicio:`, errorMessage);
    
    // Para health checks, simplemente devolver null sin mostrar errores
    if (request.action === 'health_check') {
      return null;
    }
    
    return null;
  }
}
