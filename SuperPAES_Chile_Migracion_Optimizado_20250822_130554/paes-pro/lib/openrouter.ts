const OPENROUTER_API_KEY = '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'
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export interface GenerateContentRequest {
  type: 'question' | 'explanation' | 'practice';
  topic: string;
  difficulty: 'facil' | 'intermedio' | 'dificil';
  testType: string;
  context?: string;
}

export async function generateContent(request: GenerateContentRequest) {
  const systemPrompts = {
    question: `Eres un experto en educación chilena especializado en la prueba PAES. 
    Genera una pregunta de ${request.testType} sobre ${request.topic} con dificultad ${request.difficulty}.
    La pregunta debe ser de opción múltiple con 4 alternativas (A, B, C, D).
    Incluye la respuesta correcta y una explicación breve.`,
    
    explanation: `Eres un tutor educativo experto en PAES. 
    Explica el tema "${request.topic}" de ${request.testType} de manera clara y didáctica 
    para estudiantes de 4to medio. Nivel de dificultad: ${request.difficulty}.`,
    
    practice: `Crea ejercicios de práctica para ${request.testType} sobre ${request.topic} 
    con dificultad ${request.difficulty}. Incluye 3 ejercicios con sus soluciones paso a paso.`
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://paes-pro.vercel.app',
        'X-Title': 'PAES Pro'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompts[request.type]
          },
          {
            role: 'user',
            content: request.context || `Genera contenido sobre ${request.topic}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      content: data.choices[0].message.content,
      type: request.type,
      metadata: {
        topic: request.topic,
        difficulty: request.difficulty,
        testType: request.testType,
        generatedAt: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Error generating content:', error)
    throw error
  }
}

export async function generateQuestions(
  testType: string,
  skill: string,
  count: number = 5,
  difficulty: 'facil' | 'intermedio' | 'dificil' = 'intermedio'
) {
  const questions = []
  
  for (let i = 0; i < count; i++) {
    try {
      const content = await generateContent({
        type: 'question',
        topic: skill,
        difficulty,
        testType,
        context: `Pregunta ${i + 1} de ${count} para simulacro de ${testType}`
      })
      questions.push(content)
    } catch (error) {
      console.error(`Error generating question ${i + 1}:`, error)
    }
  }
  
  return questions
}
