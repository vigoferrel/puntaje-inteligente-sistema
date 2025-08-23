
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticTest } from "@/types/diagnostic";
import { fetchDiagnosticQuestions } from "./question/fetch-questions";

interface FetchTestsOptions {
  limit?: number;
  offset?: number;
  testType?: number;
  searchTerm?: string;
  includeCompleted?: boolean;
}

/**
 * Optimized diagnostic tests fetching with pagination and filters
 */
export const fetchOptimizedDiagnosticTests = async (
  userId: string, 
  options: FetchTestsOptions = {}
): Promise<{ tests: DiagnosticTest[], total: number }> => {
  const { 
    limit = 20, 
    offset = 0, 
    testType, 
    searchTerm,
    includeCompleted = true 
  } = options;

  try {
    console.log(`🔍 Cargando diagnósticos optimizados - Limit: ${limit}, Offset: ${offset}`);
    
    // Build query with filters
    let query = supabase
      .from('diagnostic_tests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply filters
    if (testType) {
      query = query.eq('test_id', testType);
    }
    
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    
    const { data: testData, error: testError, count } = await query;
    
    if (testError) {
      console.error('Error al cargar tests:', testError);
      throw testError;
    }
    
    if (!testData || testData.length === 0) {
      console.log("⚠️ No se encontraron diagnósticos");
      return { tests: [], total: count || 0 };
    }
    
    console.log(`📊 Tests encontrados: ${testData.length} de ${count || 0} totales`);
    
    // Get completed tests for user (with error handling)
    let completedTestIds = new Set<string>();
    
    if (includeCompleted) {
      try {
        const { data: resultData } = await supabase
          .from('user_diagnostic_results')
          .select('diagnostic_id')
          .eq('user_id', userId);
        
        completedTestIds = new Set(resultData?.map(r => r.diagnostic_id) || []);
      } catch (error) {
        console.warn('No se pudieron cargar resultados del usuario:', error);
      }
    }
    
    // Process tests in parallel for better performance
    const testPromises = testData.map(async (test) => {
      try {
        const questions = await fetchDiagnosticQuestions(test.id, test.test_id);
        
        return {
          id: test.id,
          title: test.title,
          description: test.description || '',
          testId: test.test_id,
          questions: questions,
          isCompleted: completedTestIds.has(test.id)
        };
      } catch (error) {
        console.error(`Error al cargar preguntas para test ${test.id}:`, error);
        
        // Return test without questions rather than failing completely
        return {
          id: test.id,
          title: test.title,
          description: test.description || '',
          testId: test.test_id,
          questions: [],
          isCompleted: completedTestIds.has(test.id)
        };
      }
    });
    
    const tests = await Promise.all(testPromises);
    
    console.log(`✅ Diagnósticos procesados exitosamente: ${tests.length}`);
    return { tests, total: count || 0 };
    
  } catch (error) {
    console.error('❌ Error al cargar diagnósticos optimizados:', error);
    throw error;
  }
};

/**
 * Get test types for filtering
 */
export const getTestTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('paes_tests')
      .select('id, name')
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error al cargar tipos de test:', error);
    return [];
  }
};
