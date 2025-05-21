
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticQuestion, DiagnosticTest, DiagnosticResult } from "@/types/diagnostic";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { mapTestIdToEnum } from "@/utils/supabase-mappers";

/**
 * Fetches all diagnostic tests from Supabase
 */
export const fetchDiagnosticTests = async (userId: string) => {
  try {
    // Get all diagnostic tests
    const { data: testData, error: testError } = await supabase
      .from('diagnostic_tests')
      .select('*');
    
    if (testError) throw testError;
    
    if (!testData) return [];
    
    // Check which tests the user has completed
    const { data: resultData, error: resultError } = await supabase
      .from('user_diagnostic_results')
      .select('diagnostic_id')
      .eq('user_id', userId);
    
    if (resultError) throw resultError;
    
    const completedTestIds = new Set(resultData?.map(r => r.diagnostic_id) || []);
    
    // Fetch questions for each diagnostic test
    const testsWithQuestions: DiagnosticTest[] = await Promise.all(
      testData.map(async (test) => {
        const mockQuestions = await fetchDiagnosticQuestions(test.id, test.test_id);
        
        return {
          id: test.id,
          title: test.title,
          description: test.description || '',
          testId: test.test_id,
          questions: mockQuestions,
          isCompleted: completedTestIds.has(test.id)
        };
      })
    );
    
    return testsWithQuestions;
  } catch (error) {
    console.error('Error fetching diagnostic tests:', error);
    toast({
      title: "Error",
      description: "No se pudieron cargar las evaluaciones diagnósticas",
      variant: "destructive"
    });
    return [];
  }
};

/**
 * Fetches or generates questions for a diagnostic test
 */
export const fetchDiagnosticQuestions = async (diagnosticId: string, testId: number): Promise<DiagnosticQuestion[]> => {
  try {
    // In a real implementation, we would fetch real questions from the database
    // For now, return improved mock questions
    const testEnum = mapTestIdToEnum(testId);
    
    // Generate different questions based on the test type
    switch (testEnum) {
      case "COMPETENCIA_LECTORA": {
        return [
          {
            id: `${diagnosticId}-q1`,
            question: "Según el texto, ¿cuál es la idea principal?",
            options: [
              "La importancia de la lectura en el desarrollo cognitivo",
              "Las diferencias entre lectores novatos y experimentados",
              "El impacto de la tecnología en los hábitos de lectura",
              "La relación entre comprensión lectora y rendimiento académico"
            ],
            correctAnswer: "La relación entre comprensión lectora y rendimiento académico",
            skill: "TRACK_LOCATE",
            prueba: "COMPETENCIA_LECTORA"
          },
          {
            id: `${diagnosticId}-q2`,
            question: "¿Qué se puede inferir del párrafo final?",
            options: [
              "El autor está en desacuerdo con las conclusiones del estudio",
              "La metodología de la investigación presenta fallos graves",
              "Se necesita más investigación para confirmar los hallazgos",
              "Los resultados contradicen estudios previos sobre el tema"
            ],
            correctAnswer: "Se necesita más investigación para confirmar los hallazgos",
            skill: "INTERPRET_RELATE",
            prueba: "COMPETENCIA_LECTORA"
          }
        ];
      }
        
      case "MATEMATICA_1": {
        return [
          {
            id: `${diagnosticId}-q1`,
            question: "Si 3x + 5 = 17, ¿cuál es el valor de x?",
            options: ["2", "4", "6", "12"],
            correctAnswer: "4",
            skill: "SOLVE_PROBLEMS",
            prueba: "MATEMATICA_1"
          },
          {
            id: `${diagnosticId}-q2`,
            question: "¿Cuál es el área de un círculo con radio 5 cm?",
            options: ["25π cm²", "10π cm²", "5π cm²", "15π cm²"],
            correctAnswer: "25π cm²",
            skill: "REPRESENT",
            prueba: "MATEMATICA_1",
            explanation: "El área de un círculo se calcula con la fórmula A = πr², donde r es el radio."
          }
        ];
      }
        
      case "MATEMATICA_2": {
        return [
          {
            id: `${diagnosticId}-q1`,
            question: "La derivada de f(x) = x² + 3x - 5 es:",
            options: ["f'(x) = 2x + 3", "f'(x) = x² + 3", "f'(x) = 2x", "f'(x) = 2x - 5"],
            correctAnswer: "f'(x) = 2x + 3",
            skill: "MODEL",
            prueba: "MATEMATICA_2"
          },
          {
            id: `${diagnosticId}-q2`,
            question: "¿Cuál es la primitiva de g(x) = 2x + 1?",
            options: ["G(x) = x² + x + C", "G(x) = x² + C", "G(x) = 2x² + x + C", "G(x) = x² + x"],
            correctAnswer: "G(x) = x² + x + C",
            skill: "INTERPRET_RELATE",
            prueba: "MATEMATICA_2"
          }
        ];
      }
      
      case "CIENCIAS": {
        return [
          {
            id: `${diagnosticId}-q1`,
            question: "¿Cuál de estas opciones describe mejor el proceso de fotosíntesis?",
            options: [
              "Conversión de energía solar en energía química",
              "Absorción de dióxido de carbono para producir oxígeno",
              "Liberación de energía a partir de glucosa",
              "Descomposición de materia orgánica"
            ],
            correctAnswer: "Conversión de energía solar en energía química",
            skill: "IDENTIFY_THEORIES",
            prueba: "CIENCIAS"
          },
          {
            id: `${diagnosticId}-q2`,
            question: "¿Qué estructura celular contiene el material genético?",
            options: ["Núcleo", "Mitocondria", "Ribosoma", "Aparato de Golgi"],
            correctAnswer: "Núcleo",
            skill: "PROCESS_ANALYZE",
            prueba: "CIENCIAS"
          }
        ];
      }
      
      case "HISTORIA": {
        return [
          {
            id: `${diagnosticId}-q1`,
            question: "¿Cuál fue una consecuencia directa de la Revolución Industrial?",
            options: [
              "Aumento de la producción agrícola",
              "Migración masiva del campo a la ciudad",
              "Fortalecimiento del sistema feudal",
              "Disminución del comercio internacional"
            ],
            correctAnswer: "Migración masiva del campo a la ciudad",
            skill: "TEMPORAL_THINKING",
            prueba: "HISTORIA"
          },
          {
            id: `${diagnosticId}-q2`,
            question: "Analiza la siguiente fuente primaria sobre la independencia de Chile. ¿Qué se puede inferir sobre el autor?",
            options: [
              "Era partidario de la monarquía española",
              "Apoyaba el movimiento independentista",
              "Era neutral respecto al conflicto",
              "No tenía conocimiento de los eventos históricos"
            ],
            correctAnswer: "Apoyaba el movimiento independentista",
            skill: "SOURCE_ANALYSIS",
            prueba: "HISTORIA"
          }
        ];
      }
        
      default:
        return [
          {
            id: `${diagnosticId}-q1`,
            question: "Pregunta de ejemplo",
            options: ["Opción A", "Opción B", "Opción C", "Opción D"],
            correctAnswer: "Opción C",
            skill: "SOLVE_PROBLEMS",
            prueba: "MATEMATICA_1"
          }
        ];
    }
  } catch (error) {
    console.error('Error fetching diagnostic questions:', error);
    return [];
  }
};

/**
 * Submits diagnostic test results to Supabase
 */
export const submitDiagnosticResult = async (
  userId: string,
  diagnosticId: string,
  test: DiagnosticTest,
  answers: Record<string, string>,
  timeSpentMinutes: number
) => {
  try {
    // Initialize default record with all skills at 0
    const defaultSkillResults: Record<TPAESHabilidad, { correct: number, total: number }> = {
      SOLVE_PROBLEMS: { correct: 0, total: 0 },
      REPRESENT: { correct: 0, total: 0 },
      MODEL: { correct: 0, total: 0 },
      INTERPRET_RELATE: { correct: 0, total: 0 },
      EVALUATE_REFLECT: { correct: 0, total: 0 },
      TRACK_LOCATE: { correct: 0, total: 0 },
      ARGUE_COMMUNICATE: { correct: 0, total: 0 },
      IDENTIFY_THEORIES: { correct: 0, total: 0 },
      PROCESS_ANALYZE: { correct: 0, total: 0 },
      APPLY_PRINCIPLES: { correct: 0, total: 0 },
      SCIENTIFIC_ARGUMENT: { correct: 0, total: 0 },
      TEMPORAL_THINKING: { correct: 0, total: 0 },
      SOURCE_ANALYSIS: { correct: 0, total: 0 },
      MULTICAUSAL_ANALYSIS: { correct: 0, total: 0 },
      CRITICAL_THINKING: { correct: 0, total: 0 },
      REFLECTION: { correct: 0, total: 0 }
    };
    
    // Calculate skill levels based on answers
    const skillResults = { ...defaultSkillResults };
    
    test.questions.forEach(question => {
      const skill = question.skill;
      
      skillResults[skill].total += 1;
      if (answers[question.id] === question.correctAnswer) {
        skillResults[skill].correct += 1;
      }
    });
    
    // Initialize default results with all skills at 0
    const defaultResults: Record<TPAESHabilidad, number> = {
      SOLVE_PROBLEMS: 0,
      REPRESENT: 0,
      MODEL: 0,
      INTERPRET_RELATE: 0,
      EVALUATE_REFLECT: 0,
      TRACK_LOCATE: 0,
      ARGUE_COMMUNICATE: 0,
      IDENTIFY_THEORIES: 0,
      PROCESS_ANALYZE: 0,
      APPLY_PRINCIPLES: 0,
      SCIENTIFIC_ARGUMENT: 0,
      TEMPORAL_THINKING: 0,
      SOURCE_ANALYSIS: 0,
      MULTICAUSAL_ANALYSIS: 0,
      CRITICAL_THINKING: 0,
      REFLECTION: 0
    };
    
    // Calculate level for each skill (0 to 1)
    const results = { ...defaultResults };
    Object.entries(skillResults).forEach(([skill, data]) => {
      results[skill as TPAESHabilidad] = data.total > 0 ? data.correct / data.total : 0;
    });
    
    // Save results to database
    const { data, error } = await supabase
      .from('user_diagnostic_results')
      .insert({
        user_id: userId,
        diagnostic_id: diagnosticId,
        results,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update user skill levels
    await updateUserSkillLevels(userId, results);
    
    // Return the result
    if (data) {
      // Cast data.results to the correct type
      const resultData = data.results as unknown as Record<TPAESHabilidad, number>;
      
      const newResult: DiagnosticResult = {
        id: data.id,
        userId: data.user_id,
        diagnosticId: data.diagnostic_id,
        results: resultData,
        completedAt: data.completed_at
      };
      
      return newResult;
    }
    
    return null;
  } catch (error) {
    console.error('Error submitting diagnostic result:', error);
    toast({
      title: "Error",
      description: "No se pudo guardar los resultados del diagnóstico",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Updates skill levels for a user based on diagnostic results
 */
export const updateUserSkillLevels = async (userId: string, skillLevels: Record<TPAESHabilidad, number>) => {
  try {
    // For each skill, update the user's skill level
    for (const [skillCode, level] of Object.entries(skillLevels)) {
      // Get skill ID from database
      const { data: skillData, error: skillError } = await supabase
        .from('paes_skills')
        .select('id')
        .eq('code', skillCode)
        .maybeSingle();
      
      if (skillError) throw skillError;
      
      if (!skillData) continue;
      
      // Update or insert skill level
      const { error } = await supabase
        .from('user_skill_levels')
        .upsert({
          user_id: userId,
          skill_id: skillData.id,
          level
        });
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user skill levels:', error);
    return false;
  }
};

/**
 * Fetches diagnostic results for a user from Supabase
 */
export const fetchDiagnosticResults = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_diagnostic_results')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (data) {
      // Initialize default results record
      const defaultResults: Record<TPAESHabilidad, number> = {
        SOLVE_PROBLEMS: 0,
        REPRESENT: 0,
        MODEL: 0,
        INTERPRET_RELATE: 0,
        EVALUATE_REFLECT: 0,
        TRACK_LOCATE: 0,
        ARGUE_COMMUNICATE: 0,
        IDENTIFY_THEORIES: 0,
        PROCESS_ANALYZE: 0,
        APPLY_PRINCIPLES: 0,
        SCIENTIFIC_ARGUMENT: 0,
        TEMPORAL_THINKING: 0,
        SOURCE_ANALYSIS: 0,
        MULTICAUSAL_ANALYSIS: 0,
        CRITICAL_THINKING: 0,
        REFLECTION: 0
      };
      
      const mappedResults: DiagnosticResult[] = data.map(result => ({
        id: result.id,
        userId: result.user_id,
        diagnosticId: result.diagnostic_id,
        // Cast database results to our type or use default values
        results: (result.results as unknown as Record<TPAESHabilidad, number>) || defaultResults,
        completedAt: result.completed_at
      }));
      
      return mappedResults;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching diagnostic results:', error);
    return [];
  }
};
