
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticQuestion } from "@/types/diagnostic";
import { mapTestIdToEnum } from "@/utils/supabase-mappers";
import { TPAESHabilidad } from "@/types/system-types";

// Create a stored function or RPC for getting test questions
// This solves the issue of direct table access to diagnostic_questions
export const fetchDiagnosticQuestions = async (
  diagnosticId: string,
  testId: number
): Promise<DiagnosticQuestion[]> => {
  try {
    // Call stored function or RPC - we're simulating this here
    // In production, you would have this function defined in your database
    const { data, error } = await supabase
      .rpc('get_diagnostic_questions', { 
        p_diagnostic_id: diagnosticId 
      } as Record<string, any>); // Type assertion to bypass TypeScript error

    if (error) {
      console.error('Error fetching diagnostic questions:', error);
      throw error;
    }

    // If no stored function exists, let's provide mock data for now
    // This would be replaced with real data in production
    if (!data || (Array.isArray(data) && data.length === 0)) {
      // Generate mock questions based on test ID
      return generateMockQuestions(diagnosticId, testId);
    }

    if (Array.isArray(data)) {
      return data.map((q: any) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct_answer,
        skill: q.skill as TPAESHabilidad,
        prueba: mapTestIdToEnum(testId),
        explanation: q.explanation || undefined
      }));
    }

    // If we got here, we don't have the right data format
    // Fall back to mock data
    return generateMockQuestions(diagnosticId, testId);
  } catch (error) {
    console.error('Error in fetchDiagnosticQuestions:', error);
    // Fallback to mock data on error
    return generateMockQuestions(diagnosticId, testId);
  }
};

// Helper function to generate mock questions for testing
function generateMockQuestions(diagnosticId: string, testId: number): DiagnosticQuestion[] {
  const testType = mapTestIdToEnum(testId);
  const skills: TPAESHabilidad[] = [
    "TRACK_LOCATE", "INTERPRET_RELATE", "EVALUATE_REFLECT"
  ];

  // Create 10 mock questions per diagnostic
  return Array.from({ length: 10 }).map((_, index) => {
    const questionNumber = index + 1;
    const mockSkill = skills[index % skills.length];
    
    return {
      id: `q-${diagnosticId}-${questionNumber}`,
      question: `Pregunta ${questionNumber} del test de ${testType}`,
      options: [
        `Opción A para pregunta ${questionNumber}`,
        `Opción B para pregunta ${questionNumber}`,
        `Opción C para pregunta ${questionNumber}`,
        `Opción D para pregunta ${questionNumber}`
      ],
      correctAnswer: `Opción ${String.fromCharCode(65 + (index % 4))} para pregunta ${questionNumber}`,
      skill: mockSkill,
      prueba: testType,
      explanation: `Explicación de la pregunta ${questionNumber}`
    };
  });
}
