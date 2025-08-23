import { NextResponse } from 'next/server'
import { 
  testSupabaseConnection,
  getConnectionPoolStats,
  createServerSupabaseClient,
  executeWithRetry 
} from '@/lib/supabase'

export async function GET() {
  const startTime = Date.now()
  
  try {
    // Pruebas de conectividad
    const healthCheck = await testSupabaseConnection()
    
    // Estadísticas del pool de conexiones
    const poolStats = getConnectionPoolStats()
    
    // Prueba de cliente SSR
    const serverClient = createServerSupabaseClient()
    let ssrTest = null
    
    try {
      const { data, error } = await serverClient
        .from('learning_nodes')
        .select('count')
        .limit(1)
        .single()
      
      ssrTest = {
        status: error ? 'FAILED' : 'PASSED',
        error: error?.message,
        latency: Date.now() - startTime
      }
    } catch (ssrError: any) {
      ssrTest = {
        status: 'ERROR',
        error: ssrError.message,
        latency: Date.now() - startTime
      }
    }
    
    // Pruebas de funciones RPC críticas
    const rpcTests: any = {}
    
    try {
      // Test función cuántica
      const quantumResult = await executeWithRetry(async () => {
        return await serverClient.rpc('generate_quantum_number', { precision_digits: 8 })
      })
      
      rpcTests.quantum_number = {
        status: 'PASSED',
        data: quantumResult,
        description: 'Quantum number generation (replaces Math.random)'
      }
    } catch (error: any) {
      rpcTests.quantum_number = {
        status: 'FAILED',
        error: error.message,
        description: 'Quantum number generation (replaces Math.random)'
      }
    }
    
    // Pruebas de tiempo real
    let realtimeTest = null
    try {
      const realtimeClient = createServerSupabaseClient()
      const channel = realtimeClient.channel('health-check-test')
      
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Realtime timeout')), 5000)
        
        channel.subscribe((status) => {
          clearTimeout(timeout)
          if (status === 'SUBSCRIBED') {
            resolve(true)
          } else {
            reject(new Error(`Realtime subscription failed: ${status}`))
          }
        })
      })
      
      await channel.unsubscribe()
      
      realtimeTest = {
        status: 'PASSED',
        description: 'Realtime connection test'
      }
    } catch (error: any) {
      realtimeTest = {
        status: 'FAILED',
        error: error.message,
        description: 'Realtime connection test'
      }
    }
    
    // Métricas de performance
    const totalLatency = Date.now() - startTime
    const performanceGrade = totalLatency < 500 ? 'EXCELLENT' : 
                           totalLatency < 1000 ? 'GOOD' : 
                           totalLatency < 2000 ? 'FAIR' : 'POOR'
    
    // Calcular score general de salud
    const tests = [
      healthCheck.isHealthy ? 1 : 0,
      ssrTest?.status === 'PASSED' ? 1 : 0,
      rpcTests.quantum_number?.status === 'PASSED' ? 1 : 0,
      realtimeTest?.status === 'PASSED' ? 1 : 0
    ]
    
    const healthScore = Math.round((tests.reduce((a, b) => a + b, 0) / tests.length) * 100)
    const overallStatus = healthScore >= 75 ? 'HEALTHY' : 
                         healthScore >= 50 ? 'WARNING' : 'CRITICAL'
    
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      performance: {
        totalLatency,
        grade: performanceGrade,
        healthScore,
        status: overallStatus
      },
      tests: {
        basic_connectivity: {
          status: healthCheck.isHealthy ? 'PASSED' : 'FAILED',
          latency: healthCheck.latency,
          error: healthCheck.error,
          details: healthCheck.details
        },
        ssr_client: ssrTest,
        rpc_functions: rpcTests,
        realtime: realtimeTest
      },
      infrastructure: {
        connectionPool: poolStats,
        environment: {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          nodeEnv: process.env.NODE_ENV
        }
      },
      recommendations: generateRecommendations(healthScore, totalLatency, tests)
    }
    
    return NextResponse.json(response, {
      status: overallStatus === 'CRITICAL' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Score': healthScore.toString(),
        'X-Performance-Grade': performanceGrade
      }
    })
    
  } catch (error: any) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Health check failed',
      details: error.message,
      timestamp: new Date().toISOString(),
      totalLatency: Date.now() - startTime
    }, { 
      status: 503,
      headers: {
        'X-Health-Score': '0',
        'X-Performance-Grade': 'CRITICAL'
      }
    })
  }
}

function generateRecommendations(
  healthScore: number, 
  latency: number, 
  testResults: number[]
): string[] {
  const recommendations: string[] = []
  
  if (healthScore < 75) {
    recommendations.push('Sistema requiere atención: Score de salud por debajo del 75%')
  }
  
  if (latency > 2000) {
    recommendations.push('Latencia alta detectada: Considerar optimización de queries o ubicación del servidor')
  }
  
  if (latency > 1000) {
    recommendations.push('Considerar implementar cache para queries frecuentes')
  }
  
  if (testResults[0] === 0) {
    recommendations.push('Conectividad básica fallida: Verificar credenciales y red')
  }
  
  if (testResults[1] === 0) {
    recommendations.push('Cliente SSR fallido: Revisar configuración de cookies y middleware')
  }
  
  if (testResults[2] === 0) {
    recommendations.push('Funciones RPC fallidas: Verificar despliegue de funciones en Supabase')
  }
  
  if (testResults[3] === 0) {
    recommendations.push('Tiempo real fallido: Revisar configuración de realtime en Supabase')
  }
  
  if (healthScore >= 90) {
    recommendations.push('Sistema funcionando óptimamente')
  }
  
  return recommendations
}

// POST endpoint para ejecutar pruebas específicas
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { testType, params } = body
    
    const serverClient = createServerSupabaseClient()
    let result = null
    
    switch (testType) {
      case 'connection':
        result = await testSupabaseConnection()
        break
        
      case 'rpc-test':
        if (params?.functionName) {
          result = await executeWithRetry(async () => {
            return await serverClient.rpc(params.functionName, params.args || {})
          })
        }
        break
        
      case 'query-test':
        if (params?.table) {
          result = await executeWithRetry(async () => {
            return await serverClient
              .from(params.table)
              .select(params.select || '*')
              .limit(params.limit || 5)
          })
        }
        break
        
      default:
        throw new Error(`Test type '${testType}' not supported`)
    }
    
    return NextResponse.json({
      success: true,
      testType,
      result,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
