
import { DiagnosticBaseService, DiagnosticConfig } from "../base/diagnostic-base-service";
import { DiagnosticQuestion } from "@/types/diagnostic";

export class ExamQuestionExtractor extends DiagnosticBaseService {
  static async extractQuestions(config: DiagnosticConfig): Promise<DiagnosticQuestion[]> {
    try {
      const examData = await this.getExamData(config.examCode);
      
      if (examData.length === 0) {
        console.warn(`No questions found for exam ${config.examCode}`);
        return [];
      }
      
      const selectedQuestions = this.selectRepresentativeQuestions(examData, config.questionCount);
      return selectedQuestions.map(q => this.convertToDelicateQuestion(q, config));
    } catch (error) {
      console.error(`Error extracting questions for ${config.examCode}:`, error);
      return [];
    }
  }

  private static selectRepresentativeQuestions(questions: any[], targetCount: number): any[] {
    if (questions.length <= targetCount) {
      return questions;
    }
    
    const step = Math.floor(questions.length / targetCount);
    const selected = [];
    
    for (let i = 0; i < targetCount && i * step < questions.length; i++) {
      selected.push(questions[i * step]);
    }
    
    return selected;
  }

  private static convertToDelicateQuestion(rawQuestion: any, config: DiagnosticConfig): DiagnosticQuestion {
    const options = rawQuestion.opciones || rawQuestion.opciones_respuesta || [];
    const correctOption = options.find((opt: any) => opt.es_correcta);
    
    return {
      id: `${config.examCode}-q${rawQuestion.numero}`,
      question: rawQuestion.enunciado,
      options: options.map((opt: any) => `${opt.letra}) ${opt.contenido}`),
      correctAnswer: correctOption ? `${correctOption.letra}) ${correctOption.contenido}` : options[0]?.contenido || 'A',
      skill: this.mapPruebaToSkill(config.prueba),
      prueba: config.prueba,
      explanation: rawQuestion.contexto || `Pregunta ${rawQuestion.numero} del examen oficial ${config.examCode}`,
      bloomLevel: 'aplicar',
      difficulty: 'intermediate',
      paesFrequencyWeight: 1.5
    };
  }
}
