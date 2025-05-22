
import { config } from "../config.ts";

// Estructura de caché en memoria: clave -> {data, timestamp}
const memoryCache: Record<string, { data: any, timestamp: number }> = {};

// Configuración del TTL para elementos en caché (24 horas por defecto)
const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

/**
 * Servicio de caché para almacenar y recuperar resultados de diagnósticos y ejercicios
 */
export class CacheService {
  /**
   * Guarda un objeto en la caché con una clave específica
   */
  static set(key: string, data: any, ttl: number = DEFAULT_CACHE_TTL): void {
    memoryCache[key] = {
      data,
      // Establecer timestamp de expiración
      timestamp: Date.now() + ttl
    };
    
    console.log(`Guardado en caché: ${key} (expira en ${ttl / 60000} minutos)`);
  }
  
  /**
   * Recupera un objeto de la caché por su clave
   * @returns El objeto en caché o null si no existe o expiró
   */
  static get(key: string): any | null {
    const item = memoryCache[key];
    
    if (!item) {
      console.log(`Cache miss: ${key}`);
      return null;
    }
    
    // Verificar si el elemento ha expirado
    if (Date.now() > item.timestamp) {
      console.log(`Cache expired: ${key}`);
      delete memoryCache[key]; // Limpiar elemento expirado
      return null;
    }
    
    console.log(`Cache hit: ${key}`);
    return item.data;
  }
  
  /**
   * Genera una clave de caché para diagnósticos basada en parámetros
   */
  static generateDiagnosticCacheKey(testId: number, skills: string[], exercisesPerSkill: number, difficulty: string): string {
    return `diagnostic:${testId}:${skills.sort().join('_')}:${exercisesPerSkill}:${difficulty}`;
  }
  
  /**
   * Genera una clave de caché para ejercicios basada en parámetros
   */
  static generateExerciseCacheKey(skillId: number, testId: number, difficulty: string): string {
    return `exercise:${skillId}:${testId}:${difficulty}`;
  }
  
  /**
   * Limpia elementos expirados de la caché
   */
  static cleanExpired(): number {
    let removedCount = 0;
    const now = Date.now();
    
    Object.keys(memoryCache).forEach(key => {
      if (now > memoryCache[key].timestamp) {
        delete memoryCache[key];
        removedCount++;
      }
    });
    
    return removedCount;
  }
  
  /**
   * Invalida toda la caché o elementos específicos
   */
  static invalidate(pattern?: RegExp): void {
    if (pattern) {
      Object.keys(memoryCache).forEach(key => {
        if (pattern.test(key)) {
          delete memoryCache[key];
        }
      });
    } else {
      Object.keys(memoryCache).forEach(key => {
        delete memoryCache[key];
      });
    }
  }
}
