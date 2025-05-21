
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { TPAESPrueba, TPAESHabilidad } from "@/types/system-types";

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  skill: TPAESHabilidad;
  prueba: TPAESPrueba;
  explanation?: string;
}

export interface DiagnosticTest {
  id: string;
  title: string;
  description?: string;
  testId: number;
  questions: DiagnosticQuestion[];
  isCompleted: boolean;
}

export interface DiagnosticResult {
  id: string;
  userId: string;
  diagnosticId: string;
  results: Record<TPAESHabilidad, number>;
  completedAt: string;
}

export const useDiagnostic = () => {
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState<DiagnosticTest | null>(null);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  
  const fetchDiagnosticTests = async (userId: string) => {
    try {
      setLoading(true);
      
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
      
      // For each test, fetch sample questions
      const testsWithQuestions: DiagnosticTest[] = await Promise.all(
        testData.map(async (test) => {
          // In a real implementation, we would fetch real questions for each diagnostic test
          // For now, we'll create mock questions
          const mockQuestions = generateMockQuestions(test.id, test.test_id);
          
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
      
      setTests(testsWithQuestions);
      return testsWithQuestions;
    } catch (error) {
      console.error('Error fetching diagnostic tests:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las evaluaciones diagnósticas",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const startDiagnosticTest = async (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (test) {
      setCurrentTest(test);
      return test;
    }
    return null;
  };

  const submitDiagnosticResult = async (
    userId: string,
    diagnosticId: string,
    answers: Record<string, string>,
    timeSpentMinutes: number
  ) => {
    try {
      const test = tests.find(t => t.id === diagnosticId);
      if (!test) throw new Error("Test not found");
      
      // Calculate skill levels based on answers
      const skillResults: Record<TPAESHabilidad, { correct: number, total: number }> = {};
      
      test.questions.forEach(question => {
        const skill = question.skill;
        if (!skillResults[skill]) {
          skillResults[skill] = { correct: 0, total: 0 };
        }
        
        skillResults[skill].total += 1;
        if (answers[question.id] === question.correctAnswer) {
          skillResults[skill].correct += 1;
        }
      });
      
      // Calculate level for each skill (0 to 1)
      const results: Record<TPAESHabilidad, number> = {};
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
      
      // Mark test as completed
      setTests(prev => 
        prev.map(t => 
          t.id === diagnosticId ? { ...t, isCompleted: true } : t
        )
      );
      
      // Add result to results array
      if (data) {
        const newResult: DiagnosticResult = {
          id: data.id,
          userId: data.user_id,
          diagnosticId: data.diagnostic_id,
          results: data.results,
          completedAt: data.completed_at
        };
        
        setResults(prev => [...prev, newResult]);
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

  const updateUserSkillLevels = async (userId: string, skillLevels: Record<TPAESHabilidad, number>) => {
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

  const fetchDiagnosticResults = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_diagnostic_results')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      if (data) {
        const mappedResults: DiagnosticResult[] = data.map(result => ({
          id: result.id,
          userId: result.user_id,
          diagnosticId: result.diagnostic_id,
          results: result.results,
          completedAt: result.completed_at
        }));
        
        setResults(mappedResults);
        return mappedResults;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching diagnostic results:', error);
      return [];
    }
  };

  // Helper function to generate mock questions for testing
  const generateMockQuestions = (diagnosticId: string, testId: number): DiagnosticQuestion[] => {
    // In a real implementation, these would come from the database
    const mockQuestions: DiagnosticQuestion[] = [];
    
    // Generate different questions based on the test type
    switch (testId) {
      case 1: // Competencia Lectora
        mockQuestions.push({
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
        });
        break;
        
      case 2: // Matemática 1
        mockQuestions.push({
          id: `${diagnosticId}-q1`,
          question: "Si 3x + 5 = 17, ¿cuál es el valor de x?",
          options: ["2", "4", "6", "12"],
          correctAnswer: "4",
          skill: "SOLVE_PROBLEMS",
          prueba: "MATEMATICA_1"
        });
        break;
        
      case 3: // Matemática 2
        mockQuestions.push({
          id: `${diagnosticId}-q1`,
          question: "La derivada de f(x) = x² + 3x - 5 es:",
          options: ["f'(x) = 2x + 3", "f'(x) = x² + 3", "f'(x) = 2x", "f'(x) = 2x - 5"],
          correctAnswer: "f'(x) = 2x + 3",
          skill: "MODEL",
          prueba: "MATEMATICA_2"
        });
        break;
        
      default:
        mockQuestions.push({
          id: `${diagnosticId}-q1`,
          question: "Pregunta de ejemplo",
          options: ["Opción A", "Opción B", "Opción C", "Opción D"],
          correctAnswer: "Opción C",
          skill: "SOLVE_PROBLEMS",
          prueba: "MATEMATICA_1"
        });
    }
    
    return mockQuestions;
  };

  return {
    tests,
    loading,
    currentTest,
    results,
    fetchDiagnosticTests,
    startDiagnosticTest,
    submitDiagnosticResult,
    fetchDiagnosticResults
  };
};
