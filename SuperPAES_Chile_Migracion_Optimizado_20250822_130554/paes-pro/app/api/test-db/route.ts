import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test 1: Simple connection test
    const { data: connectionTest, error: connectionError } = await supabase
      .from('learning_nodes')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      console.error('Connection test failed:', connectionError)
      return NextResponse.json({
        success: false,
        error: 'Connection failed',
        details: connectionError.message
      }, { status: 500 })
    }

    // Test 2: Get learning nodes
    const { data: nodes, error: nodesError } = await supabase
      .from('learning_nodes')
      .select('*')
      .limit(5)

    if (nodesError) {
      console.error('Nodes query failed:', nodesError)
      return NextResponse.json({
        success: false,
        error: 'Nodes query failed',
        details: nodesError.message
      }, { status: 500 })
    }

    // Test 3: Check RPC functions
    let rpcTest = null
    try {
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('generate_automatic_recommendations', { p_user_id: 'test-user-id' })
      
      if (rpcError) {
        console.log('RPC test failed (expected):', rpcError.message)
        rpcTest = { error: rpcError.message }
      } else {
        rpcTest = { data: rpcData }
      }
    } catch (e) {
      rpcTest = { error: 'RPC function not available' }
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      tests: {
        connection: 'OK',
        nodes_count: nodes?.length || 0,
        nodes_sample: nodes?.slice(0, 2) || [],
        rpc_test: rpcTest
      }
    })

  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error.message
    }, { status: 500 })
  }
}
