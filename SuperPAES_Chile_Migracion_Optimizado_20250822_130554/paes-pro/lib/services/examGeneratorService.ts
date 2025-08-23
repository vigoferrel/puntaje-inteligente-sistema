import { 
  ExamQuestion, 
  ExamConfig, 
  GeneratedExam, 
  QuestionGenerationPrompt,
  GeneratedQuestionResponse,
  AIExamGeneratorConfig,
  TestSubject,
  PAESSkill,
  DifficultyLevel,
  QuestionType 
} from '@/types/exams'
import { 
  quantumRandomSync, 
  quantumIdSync, 
  quantumShuffle 
} from '@/lib/utils/quantumRandom'

interface OpenRouterResponse {
  id: string
  choices: Array<{
    message: {
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  model: string
}

export class PAESExamGenerator {
  private config: AIExamGeneratorConfig
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions'

  constructor(config: AIExamGeneratorConfig) {
    this.config = config
  }

  /**
   * Genera un examen completo basado en la configuración
   */
  async generateExam(examConfig: ExamConfig): Promise<GeneratedExam> {
    try {
      console.log('Generando examen con configuración:', examConfig)
      
      const questions: ExamQuestion[] = []
      const subjectDistribution = this.calculateSubjectDistribution(examConfig)
      const skillDistribution = this.calculateSkillDistribution(examConfig)
      const difficultyDistribution = this.calculateDifficultyDistribution(examConfig)

      // Generar preguntas por cada combinación de materia, habilidad y dificultad
      for (const [subject, questionCount] of Object.entries(subjectDistribution)) {
        if (questionCount === 0) continue

        const subjectQuestions = await this.generateQuestionsForSubject(
          subject as TestSubject,
          questionCount,
          skillDistribution,
          difficultyDistribution,
          examConfig
        )
        
        questions.push(...subjectQuestions)
      }

      // Mezclar preguntas si está configurado usando algoritmo cuántico
      if (examConfig.shuffleQuestions) {
        const shuffledQuestions = await quantumShuffle(questions)
        questions.splice(0, questions.length, ...shuffledQuestions)
      }

      // Crear examen
      const exam: GeneratedExam = {
        id: quantumIdSync('exam-'),
        title: this.generateExamTitle(examConfig),
        description: this.generateExamDescription(examConfig),
        config: examConfig,
        questions,
        createdAt: new Date().toISOString(),
        estimatedDuration: this.calculateEstimatedDuration(questions),
        metadata: {
          totalQuestions: questions.length,
          subjectDistribution: this.calculateActualSubjectDistribution(questions),
          skillDistribution: this.calculateActualSkillDistribution(questions),
          difficultyDistribution: this.calculateActualDifficultyDistribution(questions)
        }
      }

      console.log('Examen generado:', exam.title, 'con', questions.length, 'preguntas')
      return exam

    } catch (error) {
      console.error('Error generando examen:', error)
      throw new Error('Error al generar el examen')
    }
  }

  /**
   * Genera preguntas para una materia específica
   */
  private async generateQuestionsForSubject(
    subject: TestSubject,
    questionCount: number,
    skillDistribution: Record<PAESSkill, number>,
    difficultyDistribution: Record<DifficultyLevel, number>,
    examConfig: ExamConfig
  ): Promise<ExamQuestion[]> {
    const questions: ExamQuestion[] = []
    
    // Distribuir preguntas por habilidad y dificultad
    const relevantSkills = this.getRelevantSkillsForSubject(subject)
    
    for (let i = 0; i < questionCount; i++) {
      // Seleccionar habilidad y dificultad para esta pregunta
      const skill = this.selectSkillByDistribution(relevantSkills, skillDistribution)
      const difficulty = this.selectDifficultyByDistribution(difficultyDistribution)
      
      try {
        const question = await this.generateSingleQuestion({
          subject,
          skill,
          difficultyLevel: difficulty,
          questionType: 'MULTIPLE_CHOICE', // Por ahora solo opción múltiple
          includeDistractors: true,
          language: 'es'
        })
        
        questions.push(question)
        
        // Pequeña pausa para evitar rate limiting
        await this.sleep(100)
        
      } catch (error) {
        console.error(`Error generando pregunta ${i + 1} para ${subject}:`, error)
        // Continúar con la siguiente pregunta en caso de error
      }
    }
    
    return questions
  }

  /**
   * Genera una pregunta individual usando IA
   */
  async generateSingleQuestion(prompt: QuestionGenerationPrompt): Promise<ExamQuestion> {
    const systemPrompt = this.buildSystemPrompt(prompt)
    const userPrompt = this.buildUserPrompt(prompt)

    const response = await this.callOpenRouter(systemPrompt, userPrompt)
    const questionData = this.parseQuestionResponse(response)
    
    return {
      id: quantumIdSync('q-'),
      ...questionData,
      subject: prompt.subject,
      skill: prompt.skill,
      difficultyLevel: prompt.difficultyLevel,
      estimatedTime: this.estimateQuestionTime(prompt.difficultyLevel),
      tags: this.generateTags(prompt)
    }
  }

  /**
   * Construye el prompt del sistema para la IA
   */
  private buildSystemPrompt(prompt: QuestionGenerationPrompt): string {
    return `Eres un experto en educación chilena especializado en la Prueba de Acceso a la Educación Superior (PAES).

Tu tarea es generar preguntas de alta calidad para ${this.getSubjectName(prompt.subject)} enfocadas en la habilidad "${this.getSkillName(prompt.skill)}" con nivel de dificultad ${prompt.difficultyLevel}.

REQUISITOS ESPECÍFICOS:
- La pregunta debe ser apropiada para estudiantes de 4° medio en Chile
- Debe evaluar específicamente la habilidad: ${this.getSkillDescription(prompt.skill)}
- Nivel de dificultad: ${prompt.difficultyLevel}
- Formato: Opción múltiple con 4 alternativas (A, B, C, D)
- Una sola respuesta correcta
- Distractores plausibles pero claramente incorrectos
- Lenguaje claro y preciso
- Contexto chileno cuando sea relevante

ESTRUCTURA DE RESPUESTA (JSON):
{
  "questionText": "Texto de la pregunta",
  "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "correctAnswer": 0,
  "explanation": "Explicación detallada de por qué la respuesta es correcta",
  "questionType": "MULTIPLE_CHOICE",
  "bloomLevel": "Recordar|Comprender|Aplicar|Analizar|Evaluar|Crear",
  "context": "Contexto adicional si es necesario (opcional)"
}

IMPORTANTE: Responde SOLO con el JSON válido, sin texto adicional.`
  }

  /**
   * Construye el prompt del usuario para la IA
   */
  private buildUserPrompt(prompt: QuestionGenerationPrompt): string {
    let userPrompt = `Genera una pregunta PAES de ${this.getSubjectName(prompt.subject)} que evalúe la habilidad "${this.getSkillName(prompt.skill)}" con dificultad ${prompt.difficultyLevel}.`
    
    if (prompt.topic) {
      userPrompt += `\n\nTema específico: ${prompt.topic}`
    }
    
    if (prompt.context) {
      userPrompt += `\n\nContexto: ${prompt.context}`
    }

    userPrompt += `\n\nAsegúrate de que la pregunta sea:
- Relevante para la PAES chilena
- Apropiada para el nivel de dificultad ${prompt.difficultyLevel}
- Enfocada en evaluar ${this.getSkillName(prompt.skill)}
- Con distractores realistas y educativos`

    return userPrompt
  }

  /**
   * Llama a la API de OpenRouter
   */
  private async callOpenRouter(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'PAES Pro - Exam Generator'
      },
      body: JSON.stringify({
        model: this.config.model || 'anthropic/claude-3-sonnet-20240229',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: this.config.temperature || 0.7,
        max_tokens: this.config.maxTokens || 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API error:', response.status, errorData)
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data: OpenRouterResponse = await response.json()
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenRouter API')
    }

    return data.choices[0].message.content
  }

  /**
   * Parsea la respuesta de la IA para extraer los datos de la pregunta
   */
  private parseQuestionResponse(response: string): Omit<ExamQuestion, 'id' | 'subject' | 'skill' | 'difficultyLevel' | 'estimatedTime' | 'tags'> {
    try {
      // Limpiar respuesta y extraer JSON
      const cleanResponse = response.trim()
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/)
      
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const questionData = JSON.parse(jsonMatch[0])
      
      // Validar estructura básica
      if (!questionData.questionText || !questionData.options || !Array.isArray(questionData.options)) {
        throw new Error('Invalid question structure')
      }

      // Asegurar que correctAnswer sea un número
      if (typeof questionData.correctAnswer !== 'number') {
        questionData.correctAnswer = 0
      }

      // Validar opciones
      if (questionData.options.length !== 4) {
        throw new Error('Must have exactly 4 options')
      }

      return {
        questionText: questionData.questionText,
        questionType: questionData.questionType || 'MULTIPLE_CHOICE',
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation || '',
        bloomLevel: questionData.bloomLevel || 'Aplicar',
        context: questionData.context || undefined,
        metadata: {
          source: 'AI Generated',
          year: new Date().getFullYear()
        }
      }
      
    } catch (error) {
      console.error('Error parsing question response:', error)
      console.error('Original response:', response)
      
      // Generar pregunta de fallback
      return this.generateFallbackQuestion()
    }
  }

  /**
   * Genera una pregunta de respaldo en caso de error
   */
  private generateFallbackQuestion(): Omit<ExamQuestion, 'id' | 'subject' | 'skill' | 'difficultyLevel' | 'estimatedTime' | 'tags'> {
    return {
      questionText: 'Esta es una pregunta de ejemplo generada automáticamente.',
      questionType: 'MULTIPLE_CHOICE',
      options: [
        'Opción A - Correcta',
        'Opción B - Incorrecta',
        'Opción C - Incorrecta',
        'Opción D - Incorrecta'
      ],
      correctAnswer: 0,
      explanation: 'Esta es una pregunta de ejemplo con fines de demostración.',
      bloomLevel: 'Aplicar',
      metadata: {
        source: 'Fallback',
        year: new Date().getFullYear()
      }
    }
  }

  // Métodos auxiliares para distribuciones y cálculos

  private calculateSubjectDistribution(config: ExamConfig): Record<string, number> {
    if (config.subject) {
      if (Array.isArray(config.subject)) {
        const questionsPerSubject = Math.floor(config.numberOfQuestions / config.subject.length)
        const distribution: Record<string, number> = {}
        config.subject.forEach(subject => {
          distribution[subject] = questionsPerSubject
        })
        return distribution
      } else {
        return { [config.subject]: config.numberOfQuestions }
      }
    }

    // Distribución estándar PAES
    return {
      'COMPETENCIA_LECTORA': Math.floor(config.numberOfQuestions * 0.25),
      'MATEMATICA_M1': Math.floor(config.numberOfQuestions * 0.25),
      'MATEMATICA_M2': Math.floor(config.numberOfQuestions * 0.20),
      'HISTORIA': Math.floor(config.numberOfQuestions * 0.15),
      'CIENCIAS': Math.floor(config.numberOfQuestions * 0.15)
    }
  }

  private calculateSkillDistribution(config: ExamConfig): Record<PAESSkill, number> {
    if (config.skillDistribution) {
      return config.skillDistribution as Record<PAESSkill, number>
    }

    // Distribución por defecto
    return {
      'TRACK_LOCATE': 15,
      'INTERPRET_RELATE': 25,
      'EVALUATE_REFLECT': 20,
      'SOLVE_PROBLEMS': 20,
      'REPRESENT': 10,
      'MODEL': 10,
      'ARGUE_COMMUNICATE': 0
    }
  }

  private calculateDifficultyDistribution(config: ExamConfig): Record<DifficultyLevel, number> {
    if (config.difficultyDistribution) {
      return config.difficultyDistribution as Record<DifficultyLevel, number>
    }

    // Distribución por defecto
    return {
      'BASICO': 30,
      'INTERMEDIO': 50,
      'AVANZADO': 20
    }
  }

  private getRelevantSkillsForSubject(subject: TestSubject): PAESSkill[] {
    const skillMap: Record<TestSubject, PAESSkill[]> = {
      'COMPETENCIA_LECTORA': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT'],
      'MATEMATICA_M1': ['SOLVE_PROBLEMS', 'REPRESENT', 'MODEL'],
      'MATEMATICA_M2': ['SOLVE_PROBLEMS', 'REPRESENT', 'MODEL'],
      'HISTORIA': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT'],
      'CIENCIAS': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'SOLVE_PROBLEMS']
    }
    return skillMap[subject] || ['SOLVE_PROBLEMS']
  }

  private selectSkillByDistribution(skills: PAESSkill[], distribution: Record<PAESSkill, number>): PAESSkill {
    const random = quantumRandomSync() * 100
    let accumulated = 0
    
    for (const skill of skills) {
      accumulated += distribution[skill] || 0
      if (random <= accumulated) {
        return skill
      }
    }
    
    return skills[0] // Fallback
  }

  private selectDifficultyByDistribution(distribution: Record<DifficultyLevel, number>): DifficultyLevel {
    const random = quantumRandomSync() * 100
    let accumulated = 0
    
    const difficulties: DifficultyLevel[] = ['BASICO', 'INTERMEDIO', 'AVANZADO']
    
    for (const difficulty of difficulties) {
      accumulated += distribution[difficulty] || 0
      if (random <= accumulated) {
        return difficulty
      }
    }
    
    return 'INTERMEDIO' // Fallback
  }

  private estimateQuestionTime(difficulty: DifficultyLevel): number {
    const timeMap: Record<DifficultyLevel, number> = {
      'BASICO': 60,      // 1 minuto
      'INTERMEDIO': 90,  // 1.5 minutos
      'AVANZADO': 120    // 2 minutos
    }
    return timeMap[difficulty]
  }

  private generateTags(prompt: QuestionGenerationPrompt): string[] {
    return [
      prompt.subject.toLowerCase(),
      prompt.skill.toLowerCase(),
      prompt.difficultyLevel.toLowerCase(),
      'ai-generated'
    ]
  }

  // Métodos auxiliares para nombres y descripciones

  private getSubjectName(subject: TestSubject): string {
    const names: Record<TestSubject, string> = {
      'COMPETENCIA_LECTORA': 'Competencia Lectora',
      'MATEMATICA_M1': 'Matemática M1',
      'MATEMATICA_M2': 'Matemática M2',
      'HISTORIA': 'Historia y Ciencias Sociales',
      'CIENCIAS': 'Ciencias'
    }
    return names[subject]
  }

  private getSkillName(skill: PAESSkill): string {
    const names: Record<PAESSkill, string> = {
      'TRACK_LOCATE': 'Rastrear y Localizar',
      'INTERPRET_RELATE': 'Interpretar y Relacionar',
      'EVALUATE_REFLECT': 'Evaluar y Reflexionar',
      'SOLVE_PROBLEMS': 'Resolver Problemas',
      'REPRESENT': 'Representar',
      'MODEL': 'Modelar',
      'ARGUE_COMMUNICATE': 'Argumentar y Comunicar'
    }
    return names[skill]
  }

  private getSkillDescription(skill: PAESSkill): string {
    const descriptions: Record<PAESSkill, string> = {
      'TRACK_LOCATE': 'Encontrar y ubicar información específica en textos',
      'INTERPRET_RELATE': 'Comprender y relacionar ideas del texto',
      'EVALUATE_REFLECT': 'Evaluar críticamente y reflexionar sobre el contenido',
      'SOLVE_PROBLEMS': 'Resolver problemas matemáticos aplicando estrategias',
      'REPRESENT': 'Representar información en diferentes formatos',
      'MODEL': 'Crear modelos matemáticos de situaciones reales',
      'ARGUE_COMMUNICATE': 'Argumentar y comunicar razonamientos'
    }
    return descriptions[skill]
  }

  private generateExamTitle(config: ExamConfig): string {
    const typeNames: Record<string, string> = {
      'DIAGNOSTIC': 'Diagnóstico',
      'PRACTICE': 'Práctica',
      'SIMULATION': 'Simulacro',
      'ADAPTIVE': 'Adaptativo',
      'QUICK_REVIEW': 'Repaso Rápido'
    }
    
    const typeName = typeNames[config.examType] || 'Examen'
    const subjectName = config.subject ? 
      (Array.isArray(config.subject) ? 
        'Multimaterias' : 
        this.getSubjectName(config.subject)) : 
      'PAES Completa'
    
    return `${typeName} ${subjectName} - ${config.numberOfQuestions} preguntas`
  }

  private generateExamDescription(config: ExamConfig): string {
    return `Examen generado automáticamente con ${config.numberOfQuestions} preguntas. ` +
           `Duración estimada: ${Math.ceil((config.timeLimit || 60) / 60)} horas.`
  }

  private calculateEstimatedDuration(questions: ExamQuestion[]): number {
    const totalSeconds = questions.reduce((sum, q) => sum + q.estimatedTime, 0)
    return Math.ceil(totalSeconds / 60) // Convertir a minutos
  }

  private calculateActualSubjectDistribution(questions: ExamQuestion[]): Record<TestSubject, number> {
    const distribution: Record<TestSubject, number> = {
      'COMPETENCIA_LECTORA': 0,
      'MATEMATICA_M1': 0,
      'MATEMATICA_M2': 0,
      'HISTORIA': 0,
      'CIENCIAS': 0
    }
    
    questions.forEach(q => {
      distribution[q.subject]++
    })
    
    return distribution
  }

  private calculateActualSkillDistribution(questions: ExamQuestion[]): Record<PAESSkill, number> {
    const distribution: Record<PAESSkill, number> = {
      'TRACK_LOCATE': 0,
      'INTERPRET_RELATE': 0,
      'EVALUATE_REFLECT': 0,
      'SOLVE_PROBLEMS': 0,
      'REPRESENT': 0,
      'MODEL': 0,
      'ARGUE_COMMUNICATE': 0
    }
    
    questions.forEach(q => {
      distribution[q.skill]++
    })
    
    return distribution
  }

  private calculateActualDifficultyDistribution(questions: ExamQuestion[]): Record<DifficultyLevel, number> {
    const distribution: Record<DifficultyLevel, number> = {
      'BASICO': 0,
      'INTERMEDIO': 0,
      'AVANZADO': 0
    }
    
    questions.forEach(q => {
      distribution[q.difficultyLevel]++
    })
    
    return distribution
  }

  // Utilidades

  private generateId(): string {
    return quantumIdSync()
  }

  // Método deprecado - usar quantumShuffle en su lugar
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(quantumRandomSync() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
