import { NextRequest, NextResponse } from 'next/server'
import { getUserProgress, updateUserProgress, getLearningNodes } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const [progress, nodes] = await Promise.all([
      getUserProgress(userId),
      getLearningNodes()
    ])

    return NextResponse.json({
      progress,
      nodes,
      summary: {
        totalNodes: nodes.length,
        completedNodes: progress.filter(p => p.status === 'completed').length,
        inProgressNodes: progress.filter(p => p.status === 'in-progress').length
      }
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, nodeId, status, progressPercentage, score, timeSpentMinutes } = body

    if (!userId || !nodeId) {
      return NextResponse.json(
        { error: 'User ID and Node ID are required' },
        { status: 400 }
      )
    }

    const updatedProgress = await updateUserProgress(userId, nodeId, {
      status,
      progress_percentage: progressPercentage,
      score,
      time_spent_minutes: timeSpentMinutes
    })

    return NextResponse.json({
      success: true,
      progress: updatedProgress
    })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
