import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Configuración optimizada del cliente
const clientConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' as const
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-paes-client-version': '2.0.0'
    }
  }
}

// Cliente para componentes del navegador
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, clientConfig)

// Cliente SSR para componentes de servidor
export function createServerSupabaseClient() {
  const cookieStore = cookies()
  
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // La `set` puede fallar en Server Components.
            // Esto es expected cuando se llama desde un Server Component.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch (error) {
            // La `delete` puede fallar en Server Components.
            // Esto es expected cuando se llama desde un Server Component.
          }
        },
      },
    }
  )
}

// Cliente para el navegador con SSR
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, clientConfig)
}

// Configuración del MCP - Temporarily disabled for testing
/*
const mcpConfig = {
  serverUrl: 'http://localhost:3001',
  accessToken: 'sbp_7bde847e658ba8e8804f8c946d602f8e6be8c438'
}

export const mcpClient = new MCPClient(mcpConfig)
*/

// Pool de conexiones reutilizables
const connectionPool = new Map<string, ReturnType<typeof createClient<Database>>>()

// Utilidad para obtener cliente reutilizable
export function getReusableClient(key: string = 'default') {
  if (!connectionPool.has(key)) {
    connectionPool.set(key, createClient<Database>(supabaseUrl, supabaseAnonKey, clientConfig))
  }
  return connectionPool.get(key)!
}

// Wrapper para manejo robusto de errores
export async function executeWithRetry<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await operation()
      
      if (error) {
        lastError = error
        
        // Errores que no deben reintentar
        if (error.code === 'PGRST116' || error.code === '23505') {
          throw error
        }
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)))
          continue
        }
      } else {
        return data as T
      }
    } catch (networkError) {
      lastError = networkError
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)))
        continue
      }
    }
  }
  
  throw lastError
}

// Database helper functions optimizadas
export async function getUserProfile(userId: string) {
  const client = getReusableClient('profile')
  
  return executeWithRetry(async () => {
    return await client
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
  })
}

export async function getUserProgress(userId: string) {
  const client = getReusableClient('progress')
  
  return executeWithRetry(async () => {
    return await client
      .from('user_progress')
      .select(`
        *,
        learning_nodes (
          id,
          name,
          test_type,
          skill,
          difficulty
        )
      `)
      .eq('user_id', userId)
      .order('node_id')
  })
}

export async function getLearningNodes() {
  const client = getReusableClient('nodes')
  
  return executeWithRetry(async () => {
    return await client
      .from('learning_nodes')
      .select('*')
      .eq('is_active', true)
      .order('position')
  })
}

export async function updateUserProgress(
  userId: string, 
  nodeId: string, 
  progress: Partial<{
    status: string;
    progress_percentage: number;
    score: number;
    time_spent_minutes: number;
  }>
) {
  const client = getReusableClient('progress')
  
  return executeWithRetry(async () => {
    return await client
      .from('user_progress')
      .upsert({
        user_id: userId,
        node_id: nodeId,
        ...progress,
        last_updated: new Date().toISOString()
      })
      .select()
  })
}

export async function createPracticeSession(session: {
  user_id: string;
  test_type: string;
  total_questions: number;
  correct_answers: number;
  total_score: number;
  time_spent_minutes: number;
}) {
  const client = getReusableClient('sessions')
  
  return executeWithRetry(async () => {
    return await client
      .from('practice_sessions')
      .insert(session)
      .select()
  })
}

// Funciones para tiempo real optimizadas
export function subscribeToUserProgress(userId: string, callback: (payload: any) => void) {
  const client = getReusableClient('realtime')
  
  const channel = client
    .channel('user-progress-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_progress',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
  
  return () => {
    channel.unsubscribe()
  }
}

export function subscribeToLearningNodes(callback: (payload: any) => void) {
  const client = getReusableClient('realtime')
  
  const channel = client
    .channel('learning-nodes-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'learning_nodes'
      },
      callback
    )
    .subscribe()
  
  return () => {
    channel.unsubscribe()
  }
}

// Pruebas de conexión y salud del sistema
export async function testSupabaseConnection(): Promise<{
  isHealthy: boolean;
  latency: number;
  error?: string;
  details: any;
}> {
  const startTime = Date.now()
  
  try {
    const client = getReusableClient('health-check')
    
    // Test básico de conectividad
    const { data, error } = await client
      .from('learning_nodes')
      .select('count')
      .limit(1)
      .single()
    
    const latency = Date.now() - startTime
    
    if (error) {
      return {
        isHealthy: false,
        latency,
        error: error.message,
        details: error
      }
    }
    
    return {
      isHealthy: true,
      latency,
      details: { connection: 'OK', timestamp: new Date().toISOString() }
    }
  } catch (error: any) {
    return {
      isHealthy: false,
      latency: Date.now() - startTime,
      error: error.message,
      details: error
    }
  }
}

// Función para limpiar el pool de conexiones
export function cleanupConnectionPool() {
  connectionPool.clear()
}

// Función para monitorear el estado de las conexiones
export function getConnectionPoolStats() {
  return {
    activeConnections: connectionPool.size,
    connections: Array.from(connectionPool.keys())
  }
}
