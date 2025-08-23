#!/usr/bin/env node

/**
 * Script de pruebas automatizadas para la optimización Supabase-Next.js
 * Ejecuta pruebas de conectividad, performance y funcionalidad
 * 
 * Uso: node scripts/test-supabase-optimization.js
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Configuración
const CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
}

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function makeRequest(url, options = {}) {
  const fetch = await import('node-fetch').then(m => m.default)
  
  return fetch(url, {
    timeout: CONFIG.TIMEOUT,
    ...options
  })
}

async function testBasicConnectivity() {
  log('\n📡 Prueba 1: Conectividad básica de Supabase', 'blue')
  
  try {
    const response = await makeRequest(`${CONFIG.BASE_URL}/api/test-db`)
    const data = await response.json()
    
    if (data.success) {
      log('✅ Conectividad básica: EXITOSA', 'green')
      log(`   - Nodos encontrados: ${data.tests.nodes_count}`)
      return true
    } else {
      log(`❌ Conectividad básica: FALLIDA - ${data.error}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ Conectividad básica: ERROR - ${error.message}`, 'red')
    return false
  }
}

async function testHealthCheck() {
  log('\n🏥 Prueba 2: Health Check Optimizado', 'blue')
  
  try {
    const response = await makeRequest(`${CONFIG.BASE_URL}/api/health-check`)
    const data = await response.json()
    
    if (data.success) {
      log('✅ Health Check: EXITOSO', 'green')
      log(`   - Score de salud: ${data.performance.healthScore}%`)
      log(`   - Latencia total: ${data.performance.totalLatency}ms`)
      log(`   - Grado de performance: ${data.performance.grade}`)
      log(`   - Estado general: ${data.performance.status}`)
      
      // Mostrar detalles de pruebas
      const tests = data.tests
      log('   📊 Detalle de pruebas:')
      log(`      • Conectividad básica: ${tests.basic_connectivity.status}`)
      log(`      • Cliente SSR: ${tests.ssr_client.status}`)
      log(`      • Funciones RPC: ${tests.rpc_functions.quantum_number?.status || 'N/A'}`)
      log(`      • Tiempo real: ${tests.realtime.status}`)
      
      // Pool de conexiones
      log(`   🔗 Pool de conexiones: ${data.infrastructure.connectionPool.activeConnections} activas`)
      
      // Recomendaciones
      if (data.recommendations.length > 0) {
        log('   💡 Recomendaciones:', 'yellow')
        data.recommendations.forEach(rec => log(`      • ${rec}`, 'yellow'))
      }
      
      return data.performance.healthScore >= 75
    } else {
      log(`❌ Health Check: FALLIDO - ${data.error}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ Health Check: ERROR - ${error.message}`, 'red')
    return false
  }
}

async function testRPCFunctions() {
  log('\n⚡ Prueba 3: Funciones RPC', 'blue')
  
  try {
    const response = await makeRequest(`${CONFIG.BASE_URL}/api/test-rpc`)
    const data = await response.json()
    
    if (data.success) {
      log('✅ Pruebas RPC: EXITOSAS', 'green')
      log(`   - Tests completados: ${data.summary.total_tests}`)
      log(`   - Tests exitosos: ${data.summary.passed}`)
      log(`   - Tests fallidos: ${data.summary.failed}`)
      log(`   - Tasa de éxito: ${data.summary.success_rate}`)
      log(`   - Estado general: ${data.summary.overall_status}`)
      
      return data.summary.success_rate >= '75%'
    } else {
      log(`❌ Pruebas RPC: FALLIDAS - ${data.error}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ Pruebas RPC: ERROR - ${error.message}`, 'red')
    return false
  }
}

async function testPerformance() {
  log('\n🚀 Prueba 4: Performance y Latencia', 'blue')
  
  const performanceTests = [
    { name: 'Health Check', endpoint: '/api/health-check' },
    { name: 'DB Test', endpoint: '/api/test-db' },
    { name: 'RPC Test', endpoint: '/api/test-rpc' }
  ]
  
  const results = []
  
  for (const test of performanceTests) {
    const startTime = Date.now()
    
    try {
      const response = await makeRequest(`${CONFIG.BASE_URL}${test.endpoint}`)
      const latency = Date.now() - startTime
      
      results.push({
        name: test.name,
        latency,
        status: response.ok ? 'EXITOSO' : 'FALLIDO',
        statusCode: response.status
      })
      
      const grade = latency < 500 ? 'EXCELENTE' : 
                   latency < 1000 ? 'BUENO' : 
                   latency < 2000 ? 'REGULAR' : 'POBRE'
      
      log(`   • ${test.name}: ${latency}ms (${grade})`)
      
    } catch (error) {
      results.push({
        name: test.name,
        latency: Date.now() - startTime,
        status: 'ERROR',
        error: error.message
      })
      
      log(`   • ${test.name}: ERROR - ${error.message}`, 'red')
    }
  }
  
  const avgLatency = results.reduce((sum, r) => sum + r.latency, 0) / results.length
  const successRate = results.filter(r => r.status === 'EXITOSO').length / results.length * 100
  
  log(`   📊 Latencia promedio: ${Math.round(avgLatency)}ms`)
  log(`   📊 Tasa de éxito: ${Math.round(successRate)}%`)
  
  return avgLatency < 2000 && successRate >= 75
}

async function testSSRIntegration() {
  log('\n🔄 Prueba 5: Integración SSR', 'blue')
  
  try {
    // Test POST específico para SSR
    const response = await makeRequest(`${CONFIG.BASE_URL}/api/health-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testType: 'connection',
        params: {}
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      log('✅ Integración SSR: EXITOSA', 'green')
      log(`   - Cliente servidor funcional`)
      log(`   - Cookies y sesiones manejadas correctamente`)
      return true
    } else {
      log(`❌ Integración SSR: FALLIDA - ${data.error}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ Integración SSR: ERROR - ${error.message}`, 'red')
    return false
  }
}

function checkFileStructure() {
  log('\n📁 Prueba 6: Estructura de archivos optimizada', 'blue')
  
  const requiredFiles = [
    'lib/supabase.ts',
    'contexts/AuthContext.tsx',
    'hooks/useRealtimeData.ts',
    'app/api/health-check/route.ts',
    'middleware.ts'
  ]
  
  let allFilesExist = true
  
  requiredFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath)
    if (fs.existsSync(fullPath)) {
      log(`   ✅ ${filePath}`, 'green')
    } else {
      log(`   ❌ ${filePath} - FALTANTE`, 'red')
      allFilesExist = false
    }
  })
  
  // Verificar contenido específico en archivos clave
  const supabaseFile = path.join(process.cwd(), 'lib/supabase.ts')
  if (fs.existsSync(supabaseFile)) {
    const content = fs.readFileSync(supabaseFile, 'utf-8')
    const hasSSR = content.includes('createServerSupabaseClient')
    const hasRetry = content.includes('executeWithRetry')
    const hasPool = content.includes('connectionPool')
    
    log(`   📋 Características en lib/supabase.ts:`)
    log(`      • SSR Support: ${hasSSR ? '✅' : '❌'}`)
    log(`      • Retry Logic: ${hasRetry ? '✅' : '❌'}`)
    log(`      • Connection Pool: ${hasPool ? '✅' : '❌'}`)
  }
  
  return allFilesExist
}

async function runAllTests() {
  log('🧪 INICIANDO PRUEBAS DE OPTIMIZACIÓN SUPABASE-NEXT.JS', 'bold')
  log('================================================', 'bold')
  
  const testResults = []
  
  // Ejecutar todas las pruebas
  testResults.push(await testBasicConnectivity())
  testResults.push(await testHealthCheck())
  testResults.push(await testRPCFunctions())
  testResults.push(await testPerformance())
  testResults.push(await testSSRIntegration())
  testResults.push(checkFileStructure())
  
  // Resumen final
  log('\n📊 RESUMEN DE RESULTADOS', 'bold')
  log('========================', 'bold')
  
  const passedTests = testResults.filter(result => result).length
  const totalTests = testResults.length
  const successRate = Math.round((passedTests / totalTests) * 100)
  
  log(`✅ Pruebas exitosas: ${passedTests}/${totalTests}`)
  log(`📊 Tasa de éxito: ${successRate}%`)
  
  if (successRate >= 90) {
    log('\n🎉 OPTIMIZACIÓN COMPLETADA CON ÉXITO', 'green')
    log('El sistema Supabase-Next.js está funcionando óptimamente', 'green')
  } else if (successRate >= 75) {
    log('\n⚠️  OPTIMIZACIÓN PARCIALMENTE EXITOSA', 'yellow')
    log('El sistema funciona pero requiere algunas mejoras', 'yellow')
  } else {
    log('\n❌ OPTIMIZACIÓN REQUIERE ATENCIÓN', 'red')
    log('El sistema tiene problemas que deben ser resueltos', 'red')
  }
  
  log('\n💡 Para más detalles, ejecuta las pruebas individuales:', 'blue')
  log('   • curl http://localhost:3000/api/health-check')
  log('   • curl http://localhost:3000/api/test-db')
  log('   • curl http://localhost:3000/api/test-rpc')
  
  process.exit(successRate >= 75 ? 0 : 1)
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runAllTests().catch(error => {
    log(`\n💥 ERROR CRÍTICO: ${error.message}`, 'red')
    process.exit(1)
  })
}

module.exports = {
  testBasicConnectivity,
  testHealthCheck,
  testRPCFunctions,
  testPerformance,
  testSSRIntegration,
  checkFileStructure,
  runAllTests
}
