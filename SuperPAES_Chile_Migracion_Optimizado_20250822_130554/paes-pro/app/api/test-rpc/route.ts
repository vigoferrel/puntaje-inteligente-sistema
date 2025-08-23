import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing RPC functions...')
    
    const testResults: any = {
      timestamp: new Date().toISOString(),
      tests: {},
      summary: {
        total_tests: 0,
        passed: 0,
        failed: 0
      }
    }

    // Test 1: generate_automatic_recommendations
    console.log('Testing generate_automatic_recommendations...')
    try {
      const { data: recommendations, error: recError } = await supabase
        .rpc('generate_automatic_recommendations', { p_user_id: 'test-user-123' })
      
      testResults.tests.recommendations = {
        status: recError ? 'FAILED' : 'PASSED',
        error: recError?.message,
        data: recommendations,
        description: 'Generate automatic recommendations for user'
      }
      testResults.summary.total_tests++
      if (!recError) testResults.summary.passed++
      else testResults.summary.failed++
    } catch (e: any) {
      testResults.tests.recommendations = {
        status: 'ERROR',
        error: e.message,
        description: 'Generate automatic recommendations for user'
      }
      testResults.summary.total_tests++
      testResults.summary.failed++
    }

    // Test 2: get_user_statistics
    console.log('Testing get_user_statistics...')
    try {
      const { data: stats, error: statsError } = await supabase
        .rpc('get_user_statistics', { p_user_id: 'test-user-123' })
      
      testResults.tests.user_statistics = {
        status: statsError ? 'FAILED' : 'PASSED',
        error: statsError?.message,
        data: stats,
        description: 'Get comprehensive user statistics'
      }
      testResults.summary.total_tests++
      if (!statsError) testResults.summary.passed++
      else testResults.summary.failed++
    } catch (e: any) {
      testResults.tests.user_statistics = {
        status: 'ERROR',
        error: e.message,
        description: 'Get comprehensive user statistics'
      }
      testResults.summary.total_tests++
      testResults.summary.failed++
    }

    // Test 3: get_realtime_analytics
    console.log('Testing get_realtime_analytics...')
    try {
      const { data: analytics, error: analyticsError } = await supabase
        .rpc('get_realtime_analytics', { p_user_id: 'test-user-123' })
      
      testResults.tests.realtime_analytics = {
        status: analyticsError ? 'FAILED' : 'PASSED',
        error: analyticsError?.message,
        data: analytics,
        description: 'Get realtime system analytics'
      }
      testResults.summary.total_tests++
      if (!analyticsError) testResults.summary.passed++
      else testResults.summary.failed++
    } catch (e: any) {
      testResults.tests.realtime_analytics = {
        status: 'ERROR',
        error: e.message,
        description: 'Get realtime system analytics'
      }
      testResults.summary.total_tests++
      testResults.summary.failed++
    }

    // Test 4: generate_quantum_number
    console.log('Testing generate_quantum_number...')
    try {
      const { data: quantumNumber, error: quantumError } = await supabase
        .rpc('generate_quantum_number', { precision_digits: 8 })
      
      testResults.tests.quantum_number = {
        status: quantumError ? 'FAILED' : 'PASSED',
        error: quantumError?.message,
        data: quantumNumber,
        description: 'Generate quantum number (replaces Math.random)'
      }
      testResults.summary.total_tests++
      if (!quantumError) testResults.summary.passed++
      else testResults.summary.failed++
    } catch (e: any) {
      testResults.tests.quantum_number = {
        status: 'ERROR',
        error: e.message,
        description: 'Generate quantum number (replaces Math.random)'
      }
      testResults.summary.total_tests++
      testResults.summary.failed++
    }

    // Test 5: create_practice_session_quantum
    console.log('Testing create_practice_session_quantum...')
    try {
      const { data: session, error: sessionError } = await supabase
        .rpc('create_practice_session_quantum', {
          p_user_id: 'test-user-123',
          p_test_type: 'MATEMATICA_M1',
          p_total_questions: 20,
          p_correct_answers: 15
        })
      
      testResults.tests.quantum_practice_session = {
        status: sessionError ? 'FAILED' : 'PASSED',
        error: sessionError?.message,
        data: session,
        description: 'Create practice session with quantum scoring'
      }
      testResults.summary.total_tests++
      if (!sessionError) testResults.summary.passed++
      else testResults.summary.failed++
    } catch (e: any) {
      testResults.tests.quantum_practice_session = {
        status: 'ERROR',
        error: e.message,
        description: 'Create practice session with quantum scoring'
      }
      testResults.summary.total_tests++
      testResults.summary.failed++
    }

    // Test 6: Basic database queries
    console.log('Testing basic database operations...')
    try {
      const { data: nodes, error: nodesError } = await supabase
        .from('learning_nodes')
        .select('id, title, subject, difficulty_level')
        .limit(3)
      
      testResults.tests.database_queries = {
        status: nodesError ? 'FAILED' : 'PASSED',
        error: nodesError?.message,
        data: nodes,
        count: nodes?.length || 0,
        description: 'Basic database SELECT operations'
      }
      testResults.summary.total_tests++
      if (!nodesError) testResults.summary.passed++
      else testResults.summary.failed++
    } catch (e: any) {
      testResults.tests.database_queries = {
        status: 'ERROR',
        error: e.message,
        description: 'Basic database SELECT operations'
      }
      testResults.summary.total_tests++
      testResults.summary.failed++
    }

    // Calculate success rate
    const successRate = testResults.summary.total_tests > 0 
      ? Math.round((testResults.summary.passed / testResults.summary.total_tests) * 100) 
      : 0

    testResults.summary.success_rate = `${successRate}%`
    testResults.summary.overall_status = successRate >= 80 ? 'HEALTHY' : successRate >= 50 ? 'WARNING' : 'CRITICAL'

    console.log(`RPC Tests completed: ${testResults.summary.passed}/${testResults.summary.total_tests} passed (${successRate}%)`)

    return NextResponse.json({
      success: true,
      message: 'RPC functions test completed',
      ...testResults
    })

  } catch (error: any) {
    console.error('RPC test error:', error)
    return NextResponse.json({
      success: false,
      error: 'RPC test failed',
      details: error.message
    }, { status: 500 })
  }
}
