
import { openRouterService } from '@/services/openrouter/core';
import { supabase } from '@/integrations/supabase/client';

export interface LectoGuiaRequest {
  message: string;
  subject: string;
  sessionId: string;
  context?: any;
}

export interface LectoGuiaResponse {
  reply: string;
  exercise?: any;
  suggestions?: string[];
}

const SUBJECT_CONTEXTS = {
  'COMPETENCIA_LECTORA': {
    name: 'Competencia Lectora',
    skills: ['comprensión', 'análisis textual', 'interpretación', 'evaluación crítica']
  },
  'MATEMATICA_1': {
    name: 'Matemática M1',
    skills: ['números', 'álgebra', 'geometría', 'datos y probabilidad']
  },
  'MATEMATICA_2': {
    name: 'Matemática M2', 
    skills: ['álgebra avanzada', 'funciones', 'probabilidad', 'estadística']
  },
  'CIENCIAS': {
    name: 'Ciencias',
    skills: ['biología', 'física', 'química', 'método científico']
  },
  'HISTORIA': {
    name: 'Historia y Ciencias Sociales',
    skills: ['análisis histórico', 'pensamiento temporal', 'fuentes', 'multicausalidad']
  }
};

export class LectoGuiaAIService {
  private static instance: LectoGuiaAIService;
  
  static getInstance(): LectoGuiaAIService {
    if (!LectoGuiaAIService.instance) {
      LectoGuiaAIService.instance = new LectoGuiaAIService();
    }
    return LectoGuiaAIService.instance;
  }

  async processMessage(request: LectoGuiaRequest): Promise<LectoGuiaResponse> {
    try {
      const subjectContext = SUBJECT_CONTEXTS[request.subject as keyof typeof SUBJECT_CONTEXTS];
      
      const systemPrompt = `Eres LectoGuía, un asistente especializado en ${subjectContext.name} para la preparación PAES.

Especialidades:
- ${subjectContext.skills.join(', ')}

Tu rol es:
1. Responder consultas específicas sobre ${subjectContext.name}
2. Generar ejercicios personalizados
3. Explicar conceptos de manera clara y didáctica
4. Proporcionar estrategias de estudio efectivas
5. Adaptar tu comunicación al nivel del estudiante

Responde de manera:
- Clara y concisa
- Educativa y motivadora
- Específica para PAES
- Adaptada al nivel del estudiante

Si el estudiante necesita un ejercicio, pregúntale qué tipo específico quiere practicar.`;

      const response = await openRouterService({
        action: 'provide_feedback',
        payload: {
          message: request.message,
          systemPrompt,
          context: `subject:${request.subject}`,
          subject: request.subject
        }
      });

      if (typeof response === 'string') {
        return { reply: response };
      }

      const responseText = (response as any)?.response || 'Lo siento, no pude procesar tu consulta en este momento.';
      
      return {
        reply: responseText,
        suggestions: this.generateSuggestions(request.subject, request.message)
      };
      
    } catch (error) {
      console.error('Error in LectoGuía AI service:', error);
      
      return {
        reply: `Como especialista en ${SUBJECT_CONTEXTS[request.subject as keyof typeof SUBJECT_CONTEXTS]?.name || request.subject}, estoy aquí para ayudarte. ¿Podrías reformular tu consulta o decirme en qué tema específico necesitas apoyo?`,
        suggestions: this.generateSuggestions(request.subject, request.message)
      };
    }
  }

  async generateExercise(subject: string, skill?: string, difficulty: string = 'intermediate'): Promise<any> {
    try {
      const subjectContext = SUBJECT_CONTEXTS[subject as keyof typeof SUBJECT_CONTEXTS];
      
      const systemPrompt = `Genera un ejercicio de ${subjectContext.name} para PAES.

Formato JSON requerido:
{
  "question": "Pregunta con contexto si es necesario",
  "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "correctAnswer": "La opción correcta exacta",
  "explanation": "Explicación detallada",
  "skill": "${skill || subjectContext.skills[0]}",
  "difficulty": "${difficulty}"
}

Responde SOLO con el JSON, sin texto adicional.`;

      const userPrompt = `Genera un ejercicio de ${difficulty} dificultad para ${subjectContext.name}${skill ? ` enfocado en ${skill}` : ''}.`;

      const response = await openRouterService({
        action: 'provide_feedback',
        payload: {
          message: userPrompt,
          systemPrompt,
          context: `exercise:${subject}:${skill}`,
          subject
        }
      });

      // Intentar extraer JSON de la respuesta
      const responseStr = typeof response === 'string' ? response : JSON.stringify(response);
      const jsonMatch = responseStr.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback si no se puede parsear
      return {
        question: `Ejercicio de ${subjectContext.name}: ${responseStr.substring(0, 200)}`,
        options: ["Opción A", "Opción B", "Opción C", "Opción D"],
        correctAnswer: "Opción A",
        explanation: "Revisa los conceptos fundamentales del tema.",
        skill: skill || subjectContext.skills[0],
        difficulty
      };

    } catch (error) {
      console.error('Error generating exercise:', error);
      throw error;
    }
  }

  private generateSuggestions(subject: string, message: string): string[] {
    const subjectContext = SUBJECT_CONTEXTS[subject as keyof typeof SUBJECT_CONTEXTS];
    
    const baseSuggestions = [
      `Explícame sobre ${subjectContext.skills[0]}`,
      `Genera un ejercicio de ${subjectContext.name}`,
      `¿Cuáles son las estrategias clave para ${subjectContext.name}?`,
      `Dame consejos para mejorar en ${subjectContext.skills[1] || subjectContext.skills[0]}`
    ];

    return baseSuggestions;
  }

  async saveChatInteraction(userId: string, sessionId: string, message: string, response: string, subject: string) {
    try {
      await supabase
        .from('lectoguia_conversations')
        .insert([
          {
            user_id: userId,
            session_id: sessionId,
            message_type: 'user',
            content: message,
            subject_context: subject
          },
          {
            user_id: userId,
            session_id: sessionId,
            message_type: 'assistant',
            content: response,
            subject_context: subject
          }
        ]);
    } catch (error) {
      console.error('Error saving chat interaction:', error);
    }
  }
}

export const lectoGuiaService = LectoGuiaAIService.getInstance();
