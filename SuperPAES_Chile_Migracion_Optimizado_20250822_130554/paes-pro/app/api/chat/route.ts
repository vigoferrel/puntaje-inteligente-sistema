import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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'
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function POST(request: NextRequest) {
  try {
    const { message, conversation } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      )
    }

    // Construir el contexto de la conversación
    const messages = [
      {
        role: 'system',
        content: `Eres un asistente de estudio inteligente especializado en la Prueba de Acceso a la Educación Superior (PAES) de Chile. Tu objetivo es ayudar a estudiantes de 4to medio a prepararse efectivamente para esta prueba.

CARACTERÍSTICAS PRINCIPALES:
- Eres experto en todas las áreas PAES: Competencia Lectora, Matemática M1 y M2, Ciencias, Historia
- Generas contenido educativo personalizado y adaptativo
- Proporcionas estrategias de estudio efectivas
- Mantienes un tono motivador y profesional
- Respondes en español chileno, adaptándote al contexto local

CAPACIDADES:
✅ Explicar conceptos académicos complejos de forma simple
✅ Generar ejercicios de práctica personalizados
✅ Crear planes de estudio adaptativos
✅ Analizar fortalezas y debilidades del estudiante
✅ Proporcionar técnicas de estudio y manejo del estrés
✅ Dar feedback constructivo y motivacional

FORMATO DE RESPUESTAS:
- Usa emojis para hacer las respuestas más atractivas
- Estructura la información con bullets y secciones claras
- Incluye ejemplos prácticos cuando sea relevante
- Ofrece seguimiento o preguntas para profundizar
- Mantén respuestas concisas pero completas (máximo 300 palabras)

CONTEXTO ESPECÍFICO PAES:
- La PAES reemplazó a la PSU en Chile
- Se enfoca en habilidades más que en memorización
- Incluye competencias de comprensión lectora y razonamiento matemático
- Es crucial para acceder a universidades chilenas

Responde siempre como un tutor personal que genuinamente quiere ayudar al estudiante a alcanzar sus metas académicas.`
      }
    ]

    // Agregar conversación previa si existe
    if (conversation && Array.isArray(conversation)) {
      messages.push(...conversation)
    }

    // Agregar mensaje actual
    messages.push({
      role: 'user',
      content: message
    })

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://paes-pro.vercel.app',
        'X-Title': 'PAES Pro - Asistente IA'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Respuesta inválida de la API')
    }

    return NextResponse.json({
      response: data.choices[0].message.content,
      usage: data.usage,
      model: data.model
    })

  } catch (error) {
    console.error('Error en chat API:', error)
    
    // Respuesta de fallback
    const fallbackResponse = `Lo siento, hubo un problema técnico momentáneo. 

🤖 **Mientras tanto, aquí tienes algunos consejos generales:**

📚 **Para Comprensión Lectora:**
• Lee activamente subrayando ideas principales
• Practica con diferentes tipos de texto diariamente
• Amplía tu vocabulario leyendo noticias y literatura

🧮 **Para Matemática:**
• Repasa conceptos básicos regularmente
• Resuelve ejercicios bajo tiempo limitado
• Analiza tus errores para mejorar

💡 **Estrategia General:**
• Estudia 2-3 horas diarias de forma consistente
• Usa la técnica Pomodoro (25min + 5min pausa)
• Realiza simulacros semanales

¿Te gustaría que profundice en algún tema específico cuando el sistema esté funcionando normalmente?`

    return NextResponse.json({
      response: fallbackResponse,
      fallback: true
    })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de Chat PAES Pro funcionando',
    version: '1.0.0',
    capabilities: [
      'Asistencia académica PAES',
      'Generación de contenido personalizado',
      'Estrategias de estudio',
      'Análisis de progreso',
      'Motivación y apoyo'
    ]
  })
}
