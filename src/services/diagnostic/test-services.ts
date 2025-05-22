
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticTest, DiagnosticQuestion } from "@/types/diagnostic";
import { TPAESPrueba } from "@/types/system-types";
import { mapTestIdToEnum } from "@/utils/supabase-mappers";
import { fetchDiagnosticQuestions } from "./question-services";

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
        const questions = await fetchDiagnosticQuestions(test.id, test.test_id);
        
        return {
          id: test.id,
          title: test.title,
          description: test.description || '',
          testId: test.test_id,
          questions: questions,
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
