
import { config } from "../config.ts";
import { MonitoringService } from "./monitoring-service.ts";
import { storeContentInCache, getContentFromCache, cleanExpiredCacheContent } from "./usage-tracking-service.ts";

// Estructura de caché en memoria: clave -> {data, timestamp}
const memoryCache: Record<string, { data: any, timestamp: number }> = {};

// Configuración del TTL para elementos en caché (24 horas por defecto)
const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

/**
 * Servicio de caché para almacenar y recuperar resultados de diagnósticos y ejercicios
 * con persistencia en BD para contenido de alta prioridad
 */
export class CacheService {
  /**
   * Guarda un objeto en la caché con una clave específica
   */
  static async set(key: string, data: any, ttl: number = DEFAULT_CACHE_TTL, persistInDB: boolean = false): Promise<void> {
    // Guardar en memoria
    memoryCache[key] = {
      data,
      // Establecer timestamp de expiración
      timestamp: Date.now() + ttl
    };
    
    // Extraer información de la clave
    const keyParts = key.split(':');
    const contentType = keyParts[0];
    
    MonitoringService.info(`Guardado en caché: ${key} (expira en ${ttl / 60000} minutos)`);
    
    // Si se solicita persistencia, guardar en la BD
    if (persistInDB) {
      await storeContentInCache(
        contentType,
        key,
        data,
        ttl / (60 * 60 * 1000) // Convertir a horas
      ).catch(err => {
        MonitoringService.error(`Error al persistir caché en BD: ${key}`, err);
      });
    }
  }
  
  /**
   * Recupera un objeto de la caché por su clave
   * Intenta primero en memoria, luego en BD si no está en memoria
   */
  static async get(key: string, checkDB: boolean = true): Promise<any | null> {
    // Verificar en caché de memoria primero (más rápido)
    const item = memoryCache[key];
    
    if (item) {
      // Verificar si el elemento ha expirado
      if (Date.now() > item.timestamp) {
        MonitoringService.debug(`Cache expired: ${key}`);
        delete memoryCache[key]; // Limpiar elemento expirado
      } else {
        MonitoringService.debug(`Cache hit (memory): ${key}`);
        return item.data;
      }
    }
    
    // Si no está en memoria y se solicita verificar en BD
    if (checkDB) {
      const keyParts = key.split(':');
      const contentType = keyParts[0];
      
      const dbContent = await getContentFromCache(contentType, key);
      
      if (dbContent) {
        // Si se encuentra en la BD, cargar también en memoria
        MonitoringService.debug(`Cache hit (database): ${key}`);
        this.set(key, dbContent); // Sin persistir para evitar escrituras redundantes
        return dbContent;
      }
    }
    
    MonitoringService.debug(`Cache miss: ${key}`);
    return null;
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
   * Genera una clave para análisis de rendimiento
   */
  static generatePerformanceAnalysisCacheKey(answers: any[]): string {
    // Crear un hash simplificado para las respuestas
    const answerHash = answers.map(a => `${a.id}:${a.correct}`).join('|');
    return `performance:${answerHash.length}:${answerHash.substring(0, 50)}`;
  }
  
  /**
   * Limpia elementos expirados de la caché en memoria
   */
  static cleanExpiredMemoryCache(): number {
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
   * Limpia todos los elementos expirados (memoria y BD)
   */
  static async cleanAllExpired(): Promise<{memory: number, db: number}> {
    const memoryRemoved = this.cleanExpiredMemoryCache();
    const dbRemoved = await cleanExpiredCacheContent();
    
    return { 
      memory: memoryRemoved, 
      db: dbRemoved 
    };
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
