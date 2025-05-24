
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticTest, DiagnosticQuestion } from "@/types/diagnostic";
import { TPAESPrueba } from "@/types/system-types";
import { mapTestIdToEnum } from "@/utils/supabase-mappers";
import { fetchDiagnosticQuestions } from "./question/fetch-questions";

/**
 * Fetches diagnostic tests with improved error handling and pagination
 */
export const fetchDiagnosticTests = async (userId: string, limit: number = 50) => {
  try {
    console.log(`🔍 Cargando diagnósticos para usuario: ${userId}`);
    
    // Get diagnostic tests with pagination
    const { data: testData, error: testError, count } = await supabase
      .from('diagnostic_tests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (testError) {
      console.error('Error al cargar tests:', testError);
      throw testError;
    }
    
    console.log(`📊 Tests encontrados: ${testData?.length || 0} de ${count || 0} totales`);
    
    if (!testData || testData.length === 0) {
      console.log("⚠️ No se encontraron diagnósticos en la base de datos");
      return [];
    }
    
    // Check which tests the user has completed (with error handling)
    let completedTestIds = new Set<string>();
    
    try {
      const { data: resultData, error: resultError } = await supabase
        .from('user_diagnostic_results')
        .select('diagnostic_id')
        .eq('user_id', userId);
      
      if (resultError) {
        console.warn('No se pudieron cargar resultados del usuario:', resultError);
        // Continuar sin datos de completitud
      } else {
        completedTestIds = new Set(resultData?.map(r => r.diagnostic_id) || []);
      }
    } catch (error) {
      console.warn('Error al verificar tests completados:', error);
      // Continuar sin datos de completitud
    }
    
    // Fetch questions for each diagnostic test (with improved error handling)
    const testsWithQuestions: DiagnosticTest[] = [];
    
    for (const test of testData) {
      try {
        const questions = await fetchDiagnosticQuestions(test.id, test.test_id);
        
        testsWithQuestions.push({
          id: test.id,
          title: test.title,
          description: test.description || '',
          testId: test.test_id,
          questions: questions,
          isCompleted: completedTestIds.has(test.id)
        });
        
        console.log(`✅ Test "${test.title}" cargado con ${questions.length} preguntas`);
      } catch (error) {
        console.error(`❌ Error al cargar preguntas para test ${test.id}:`, error);
        
        // Incluir el test sin preguntas en lugar de fallar completamente
        testsWithQuestions.push({
          id: test.id,
          title: test.title,
          description: test.description || '',
          testId: test.test_id,
          questions: [],
          isCompleted: completedTestIds.has(test.id)
        });
      }
    }
    
    console.log(`✅ Total de diagnósticos cargados exitosamente: ${testsWithQuestions.length}`);
    return testsWithQuestions;
    
  } catch (error) {
    console.error('❌ Error fatal al cargar diagnósticos:', error);
    
    // Solo mostrar toast en errores críticos
    if (error instanceof Error && !error.message.includes('JWT')) {
      toast({
        title: "Error de conexión",
        description: "No se pudieron cargar las evaluaciones desde la base de datos",
        variant: "destructive"
      });
    }
    
    return [];
  }
};
