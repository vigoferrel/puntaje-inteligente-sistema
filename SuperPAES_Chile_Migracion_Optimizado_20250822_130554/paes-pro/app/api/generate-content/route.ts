import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/lib/openrouter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, topic, difficulty, testType, context } = body

    if (!type || !topic || !testType) {
      return NextResponse.json(
        { error: 'Missing required fields: type, topic, testType' },
        { status: 400 }
      )
    }

    const content = await generateContent({
      type,
      topic,
      difficulty: difficulty || 'intermedio',
      testType,
      context
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error in generate-content API:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Content generation API is running',
    supportedTypes: ['question', 'explanation', 'practice'],
    supportedTestTypes: [
      'COMPETENCIA_LECTORA',
      'MATEMATICA_M1', 
      'MATEMATICA_M2',
      'CIENCIAS',
      'HISTORIA'
    ]
  })
}
