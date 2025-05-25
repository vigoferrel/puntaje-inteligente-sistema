
import { DiagnosticTest } from "@/types/diagnostic";
import { TPAESPrueba } from "@/types/system-types";
import { DiagnosticConfig } from "./base/diagnostic-base-service";
import { ExamQuestionExtractor } from "./extractors/exam-question-extractor";
import { NodeProgressValidator } from "./validators/node-progress-validator";
import { SkillAssessmentEngine } from "./engines/skill-assessment-engine";
import { AIContentGenerator } from "./generators/ai-content-generator";

const REAL_EXAM_DIAGNOSTICS: DiagnosticConfig[] = [
  {
    examCode: 'PAES-2024-FORM-103',
    title: 'Diagnóstico Comprensión Lectora PAES 2024',
    description: 'Evaluación basada en preguntas oficiales PAES de Competencia Lectora',
    testId: 1,
    prueba: 'COMPETENCIA_LECTORA',
    questionCount: 12
  },
  {
    examCode: 'MATEMATICA_M1_2024_FORMA_123',
    title: 'Diagnóstico Matemática M1 PAES 2024',
    description: 'Evaluación oficial de Matemática M1 con preguntas representativas',
    testId: 2,
    prueba: 'MATEMATICA_1',
    questionCount: 15
  },
  {
    examCode: 'MATEMATICA_M2_2024_FORMA_456',
    title: 'Diagnóstico Matemática M2 PAES 2024',
    description: 'Evaluación avanzada de Matemática M2 basada en examen oficial',
    testId: 3,
    prueba: 'MATEMATICA_2',
    questionCount: 15
  },
  {
    examCode: 'CIENCIAS_2024_FORMA_789',
    title: 'Diagnóstico Ciencias PAES 2024',
    description: 'Evaluación integral de Ciencias con preguntas oficiales',
    testId: 5,
    prueba: 'CIENCIAS',
    questionCount: 18
  },
  {
    examCode: 'HISTORIA_2024_FORMA_123',
    title: 'Diagnóstico Historia PAES 2024',
    description: 'Evaluación de competencias históricas basada en PAES oficial',
    testId: 4,
    prueba: 'HISTORIA',
    questionCount: 12
  }
];

export class ComprehensiveDiagnosticGenerator {
  static async generateAllDiagnostics(userId?: string): Promise<DiagnosticTest[]> {
    console.log('🔬 Generando diagnósticos integrales con IA y backend educativo...');
    
    const diagnostics: DiagnosticTest[] = [];
    
    for (const config of REAL_EXAM_DIAGNOSTICS) {
      try {
        const diagnostic = await this.generateComprehensiveDiagnostic(config, userId);
        if (diagnostic) {
          diagnostics.push(diagnostic);
          console.log(`✅ Diagnóstico integral generado: ${diagnostic.title}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error generando diagnóstico ${config.examCode}:`, error);
        const fallbackDiagnostic = this.createFallbackDiagnostic(config);
        diagnostics.push(fallbackDiagnostic);
      }
    }
    
    return diagnostics;
  }

  private static async generateComprehensiveDiagnostic(
    config: DiagnosticConfig, 
    userId?: string
  ): Promise<DiagnosticTest | null> {
    try {
      // 1. Extract official exam questions
      const officialQuestions = await ExamQuestionExtractor.extractQuestions(config);
      
      if (officialQuestions.length === 0) {
        console.warn(`No official questions for ${config.examCode}`);
        return null;
      }

      // 2. Map questions to learning nodes
      const questionsWithNodes = await NodeProgressValidator.mapQuestionsToNodes(
        officialQuestions, 
        config.prueba
      );

      let finalQuestions = questionsWithNodes;

      // 3. If user provided, enhance with personalized content
      if (userId) {
        const skillAssessments = await SkillAssessmentEngine.assessUserSkills(userId, config.prueba);
        const weakSkills = skillAssessments
          .filter(s => s.recommendedFocus === 'critical')
          .map(s => s.skill);

        if (weakSkills.length > 0) {
          // Generate AI-powered adaptive questions
          const adaptiveQuestions = await AIContentGenerator.generateAdaptiveQuestions(
            weakSkills,
            config.prueba,
            3
          );
          
          finalQuestions = [...questionsWithNodes, ...adaptiveQuestions];
        }
      }

      return {
        id: `comprehensive-${config.testId}`,
        title: config.title,
        description: `${config.description} (Integración completa con IA y nodos)`,
        testId: config.testId,
        questions: finalQuestions,
        isCompleted: false,
        targetTier: 'tier1_critico',
        questionsPerSkill: 3,
        totalQuestions: finalQuestions.length
      };
    } catch (error) {
      console.error(`Error generating comprehensive diagnostic for ${config.examCode}:`, error);
      return null;
    }
  }

  private static createFallbackDiagnostic(config: DiagnosticConfig): DiagnosticTest {
    return {
      id: `fallback-${config.testId}`,
      title: config.title,
      description: `${config.description} (Modo fallback)`,
      testId: config.testId,
      questions: [],
      isCompleted: false,
      targetTier: 'tier1_critico',
      questionsPerSkill: 2,
      totalQuestions: 0
    };
  }
}
