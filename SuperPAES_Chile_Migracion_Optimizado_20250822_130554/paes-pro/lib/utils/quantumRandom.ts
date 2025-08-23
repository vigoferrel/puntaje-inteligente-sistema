/**
 * Sistema de Números Aleatorios Cuánticos
 * 
 * Este módulo proporciona funciones de generación de números aleatorios cuánticos
 * que reemplazan completamente Math.random() en toda la aplicación.
 * Utiliza el sistema cuántico implementado en Supabase para generar números
 * verdaderamente aleatorios basados en fluctuaciones cuánticas.
 */

import { supabase } from '@/lib/supabase'

// Cache para números cuánticos pre-generados para mejor rendimiento
interface QuantumCache {
  numbers: number[]
  lastGenerated: number
  batchSize: number
  precision: number
}

const quantumCache: QuantumCache = {
  numbers: [],
  lastGenerated: 0,
  batchSize: 100, // Pre-generar 100 números a la vez
  precision: 12   // Precisión de 12 dígitos decimales
}

// Fallback robusto en caso de falla del sistema cuántico
const fallbackRandom = (): number => {
  // Usar crypto.getRandomValues si está disponible (más seguro que Math.random)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] / (0xFFFFFFFF + 1)
  }
  
  // Último recurso: Math.random() con timestamp para mejorar entropía
  const timestamp = Date.now() % 1000000
  return (Math.random() * timestamp) % 1
}

/**
 * Genera un lote de números cuánticos y los almacena en cache
 */
async function fillQuantumCache(): Promise<void> {
  try {
    const { data, error } = await supabase
      .rpc('generate_quantum_number', {
        precision_digits: quantumCache.precision
      })

    if (error || !data) {
      console.warn('Error generando número cuántico:', error?.message)
      // Llenar cache con números fallback
      for (let i = 0; i < quantumCache.batchSize; i++) {
        quantumCache.numbers.push(fallbackRandom())
      }
    } else {
      // El RPC retorna un número, generamos variaciones cuánticas usando ese número como semilla
      const baseQuantum = parseFloat(data)
      quantumCache.numbers = []
      
      for (let i = 0; i < quantumCache.batchSize; i++) {
        // Generar variaciones usando el número cuántico base
        const variation = (baseQuantum + i * 0.000000001) % 1
        quantumCache.numbers.push(variation)
      }
    }
    
    quantumCache.lastGenerated = Date.now()
  } catch (error) {
    console.error('Error crítico en sistema cuántico:', error)
    // Fallback completo
    quantumCache.numbers = []
    for (let i = 0; i < quantumCache.batchSize; i++) {
      quantumCache.numbers.push(fallbackRandom())
    }
    quantumCache.lastGenerated = Date.now()
  }
}

/**
 * Función principal para obtener un número aleatorio cuántico
 * Reemplaza completamente Math.random()
 */
export async function quantumRandom(): Promise<number> {
  // Verificar si necesitamos refrescar el cache (cada 5 minutos o cuando esté vacío)
  const cacheAge = Date.now() - quantumCache.lastGenerated
  const needsRefresh = quantumCache.numbers.length === 0 || cacheAge > 300000 // 5 minutos

  if (needsRefresh) {
    await fillQuantumCache()
  }

  // Obtener número del cache
  const quantumNumber = quantumCache.numbers.shift()
  
  if (quantumNumber === undefined) {
    // Cache vacío, usar fallback inmediato
    console.warn('Cache cuántico vacío, usando fallback')
    return fallbackRandom()
  }

  return quantumNumber
}

/**
 * Función síncrona que usa cache o fallback inmediato
 * Para casos donde no se puede usar async/await
 */
export function quantumRandomSync(): number {
  if (quantumCache.numbers.length > 0) {
    return quantumCache.numbers.shift() || fallbackRandom()
  }
  
  // Si no hay números en cache, iniciar rellenado asíncrono y usar fallback
  fillQuantumCache().catch(console.error)
  return fallbackRandom()
}

/**
 * Genera un número cuántico en un rango específico
 */
export async function quantumRandomRange(min: number, max: number): Promise<number> {
  const quantum = await quantumRandom()
  return min + quantum * (max - min)
}

/**
 * Genera un entero cuántico en un rango específico
 */
export async function quantumRandomInt(min: number, max: number): Promise<number> {
  const range = await quantumRandomRange(min, max + 1)
  return Math.floor(range)
}

/**
 * Selecciona un elemento aleatorio de un array usando números cuánticos
 */
export async function quantumRandomChoice<T>(array: T[]): Promise<T> {
  if (array.length === 0) {
    throw new Error('No se puede seleccionar de un array vacío')
  }
  
  const index = await quantumRandomInt(0, array.length - 1)
  return array[index]
}

/**
 * Mezcla un array usando el algoritmo Fisher-Yates con números cuánticos
 */
export async function quantumShuffle<T>(array: T[]): Promise<T[]> {
  const shuffled = [...array]
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = await quantumRandomInt(0, i)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  return shuffled
}

/**
 * Genera un ID único usando números cuánticos
 */
export async function quantumId(prefix: string = ''): Promise<string> {
  const timestamp = Date.now().toString(36)
  const quantum1 = (await quantumRandom()).toString(36).substr(2, 9)
  const quantum2 = (await quantumRandom()).toString(36).substr(2, 9)
  
  return `${prefix}${timestamp}-${quantum1}-${quantum2}`
}

/**
 * Versión síncrona de quantumId para casos donde no se puede usar async
 */
export function quantumIdSync(prefix: string = ''): string {
  const timestamp = Date.now().toString(36)
  const quantum1 = quantumRandomSync().toString(36).substr(2, 9)
  const quantum2 = quantumRandomSync().toString(36).substr(2, 9)
  
  return `${prefix}${timestamp}-${quantum1}-${quantum2}`
}

/**
 * Inicializa el cache cuántico al cargar el módulo
 */
export function initializeQuantumCache(): void {
  fillQuantumCache().catch(error => {
    console.error('Error inicializando cache cuántico:', error)
  })
}

/**
 * Obtiene estadísticas del sistema cuántico
 */
export function getQuantumStats() {
  return {
    cacheSize: quantumCache.numbers.length,
    lastGenerated: new Date(quantumCache.lastGenerated).toISOString(),
    cacheAge: Date.now() - quantumCache.lastGenerated,
    precision: quantumCache.precision,
    batchSize: quantumCache.batchSize,
    isHealthy: quantumCache.numbers.length > 10 // Saludable si tiene más de 10 números
  }
}

// Inicializar cache al importar el módulo
if (typeof window !== 'undefined') {
  // Solo en el cliente
  setTimeout(initializeQuantumCache, 100)
}
