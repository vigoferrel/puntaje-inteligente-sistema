
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { generateDiagnosticTest } from "@/services/diagnostic-generator";

/**
 * Generates a default diagnostic test for demonstration purposes
 */
export const generateDefaultDiagnostic = async (): Promise<boolean> => {
  try {
    // First check if there are already diagnostic tests
    const { data: existingTests, error: checkError } = await supabase
      .from('diagnostic_tests')
      .select('count')
      .limit(1);
    
    if (checkError) throw checkError;
    
    // If there are already tests, don't create more by default
    if (existingTests && existingTests.length > 0 && existingTests[0].count > 0) {
      return true;
    }
    
    // Get available tests
    const { data: tests, error: testsError } = await supabase
      .from('paes_tests')
      .select('id, name')
      .limit(3);
    
    if (testsError) throw testsError;
    
    if (!tests || tests.length === 0) {
      // No tests available in the database
      console.error('No hay pruebas PAES disponibles para crear diagnósticos');
      
      // Try to create a default test
      const { data: newTest, error: createError } = await supabase
        .from('paes_tests')
        .insert({
          name: 'Matemáticas',
          code: 'M1',
          description: 'Prueba de matemáticas para la PAES'
        })
        .select();
      
      if (createError) throw createError;
      
      if (newTest && newTest.length > 0) {
        // Create skills for this test
        const { error: skillError } = await supabase
          .from('paes_skills')
          .insert([
            { 
              name: 'Resolución de problemas', 
              code: 'SOLVE_PROBLEMS', 
              test_id: newTest[0].id,
              description: 'Habilidad para resolver problemas matemáticos' 
            },
            { 
              name: 'Interpretación', 
              code: 'INTERPRET_RELATE', 
              test_id: newTest[0].id,
              description: 'Habilidad para interpretar datos y problemas' 
            }
          ]);
        
        if (skillError) throw skillError;
        
        // Generate a diagnostic for this test
        await generateDiagnosticTest(
          newTest[0].id,
          'Diagnóstico de Matemáticas',
          'Diagnóstico inicial para evaluar habilidades matemáticas'
        );
        
        return true;
      }
      
      return false;
    }
    
    // Generate a default diagnostic for each test found
    let createdAny = false;
    
    for (const test of tests) {
      try {
        // Check if there's already a diagnostic for this test
        const { data: existing, error: existingError } = await supabase
          .from('diagnostic_tests')
          .select('id')
          .eq('test_id', test.id)
          .limit(1);
        
        if (existingError) throw existingError;
        
        // Skip if there's already a diagnostic for this test
        if (existing && existing.length > 0) continue;
        
        // Generate a diagnostic for this test
        const diagnosticId = await generateDiagnosticTest(
          test.id,
          `Diagnóstico de ${test.name}`,
          `Diagnóstico inicial para evaluar habilidades en ${test.name}`
        );
        
        if (diagnosticId) {
          createdAny = true;
        }
      } catch (testError) {
        console.error(`Error al crear diagnóstico para prueba ${test.id}:`, testError);
        // Continue with other tests
      }
    }
    
    return createdAny;
  } catch (error) {
    console.error('Error al generar diagnóstico por defecto:', error);
    
    toast({
      title: "Error",
      description: "No se pudo generar un diagnóstico de prueba",
      variant: "destructive"
    });
    
    return false;
  }
};
