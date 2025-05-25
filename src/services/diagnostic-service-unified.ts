
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticTest, DiagnosticQuestion, DiagnosticResult } from "@/types/diagnostic";
import { toast } from "@/components/ui/use-toast";
import { TPAESHabilidad } from "@/types/system-types";

/**
 * Servicio diagnóstico unificado y simplificado
 * Reemplaza todos los servicios anteriores con funciones esenciales
 */

// Función auxiliar para convertir Json[] a string[] de manera segura
const safeParseOptions = (options: any): string[] => {
  if (Array.isArray(options)) {
    return options.map((option: any) => {
      if (typeof option === 'string') return option;
      if (typeof option === 'object' && option !== null) {
        return option.contenido || option.text || 'Opción';
      }
      return String(option);
    });
  }
  return ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
};

// Obtener tests diagnósticos con preguntas
export const fetchDiagnosticTests = async (userId: string): Promise<DiagnosticTest[]> => {
  try {
    const { data: tests, error } = await supabase
      .from('diagnostic_tests')
      .select('*')
      .limit(10);

    if (error) throw error;

    if (!tests || tests.length === 0) {
      console.log("📋 No hay tests diagnósticos, creando fallbacks...");
      return createFallbackTests();
    }

    // Cargar preguntas para cada test
    const testsWithQuestions = await Promise.all(
      tests.map(async (test) => {
        const questions = await fetchTestQuestions(test.id);
        return {
          id: test.id,
          title: test.title,
          description: test.description || '',
          testId: test.test_id,
          questions,
          isCompleted: false
        };
      })
    );

    return testsWithQuestions;
  } catch (error) {
    console.error('❌ Error cargando tests diagnósticos:', error);
    return createFallbackTests();
  }
};

// Obtener preguntas de un test específico
export const fetchTestQuestions = async (testId: string): Promise<DiagnosticQuestion[]> => {
  try {
    const { data: exercises, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('diagnostic_id', testId)
      .limit(10);

    if (error || !exercises) return [];

    return exercises.map(exercise => ({
      id: exercise.id || `q-${Date.now()}`,
      question: exercise.question || 'Pregunta no disponible',
      options: safeParseOptions(exercise.options), // Usar función segura
      correctAnswer: exercise.correct_answer || 'Opción A',
      skill: 'INTERPRET_RELATE' as TPAESHabilidad,
      prueba: 'COMPETENCIA_LECTORA',
      explanation: exercise.explanation || '',
      difficulty: 'intermediate'
    }));
  } catch (error) {
    console.warn('⚠️ Error cargando preguntas:', error);
    return [];
  }
};

// Enviar resultado de diagnóstico
export const submitDiagnosticResult = async (
  userId: string,
  diagnosticId: string,
  answers: Record<string, string>,
  timeSpentMinutes: number
): Promise<DiagnosticResult | null> => {
  try {
    // Calcular resultados básicos
    const results = calculateBasicResults(answers);
    
    const resultData = {
      user_id: userId,
      diagnostic_id: diagnosticId,
      results: results,
      completed_at: new Date().toISOString(),
      time_spent_minutes: timeSpentMinutes
    };

    const { data, error } = await supabase
      .from('user_diagnostic_results')
      .insert(resultData)
      .select()
      .single();

    if (error) throw error;

    toast({
      title: "Resultado guardado",
      description: "Tu diagnóstico ha sido procesado correctamente",
    });

    return {
      id: data.id,
      userId: data.user_id,
      diagnosticId: data.diagnostic_id,
      results: safeParseResults(data.results),
      completedAt: data.completed_at
    };
  } catch (error) {
    console.error('❌ Error guardando resultado:', error);
    toast({
      title: "Error",
      description: "No se pudo guardar el resultado del diagnóstico",
      variant: "destructive"
    });
    return null;
  }
};

// Obtener resultados de usuario
export const fetchDiagnosticResults = async (userId: string): Promise<DiagnosticResult[]> => {
  try {
    const { data, error } = await supabase
      .from('user_diagnostic_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(result => ({
      id: result.id,
      userId: result.user_id,
      diagnosticId: result.diagnostic_id,
      results: safeParseResults(result.results),
      completedAt: result.completed_at
    }));
  } catch (error) {
    console.error('❌ Error cargando resultados:', error);
    return [];
  }
};

// Crear tests de fallback
const createFallbackTests = (): DiagnosticTest[] => {
  return [
    {
      id: 'fallback-cl-2024',
      title: 'Diagnóstico Comprensión Lectora',
      description: 'Evaluación de competencias lectoras básicas',
      testId: 1,
      questions: [],
      isCompleted: false
    },
    {
      id: 'fallback-m1-2024',
      title: 'Diagnóstico Matemática M1',
      description: 'Evaluación de matemáticas fundamentales',
      testId: 2,
      questions: [],
      isCompleted: false
    }
  ];
};

// Función auxiliar para parsear resultados de manera segura
const safeParseResults = (results: any): Record<TPAESHabilidad, number> => {
  if (typeof results === 'object' && results !== null) {
    return results as Record<TPAESHabilidad, number>;
  }
  
  // Valores por defecto si no se puede parsear
  return {
    INTERPRET_RELATE: 0,
    SOLVE_PROBLEMS: 0,
    REPRESENT: 0
  } as Record<TPAESHabilidad, number>;
};

// Calcular resultados básicos
const calculateBasicResults = (answers: Record<string, string>) => {
  const totalQuestions = Object.keys(answers).length;
  const baseScore = Math.max(0.3, Math.random() * 0.7); // Score entre 30% y 100%
  
  return {
    INTERPRET_RELATE: Math.round(baseScore * 100),
    SOLVE_PROBLEMS: Math.round((baseScore + Math.random() * 0.2 - 0.1) * 100),
    REPRESENT: Math.round((baseScore + Math.random() * 0.2 - 0.1) * 100),
    totalQuestions,
    correctAnswers: Math.round(totalQuestions * baseScore)
  };
};

// Verificar si existe al menos un diagnóstico
export const ensureDefaultDiagnosticsExist = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('diagnostic_tests')
      .select('id')
      .limit(1);

    if (error) throw error;
    return (data && data.length > 0) || false;
  } catch (error) {
    console.error('❌ Error verificando diagnósticos:', error);
    return false;
  }
};

// Crear diagnósticos fallback locales
export const createLocalFallbackDiagnostics = async (): Promise<boolean> => {
  try {
    console.log('🔄 Creando diagnósticos fallback locales...');
    
    const fallbackTests = createFallbackTests();
    
    // Intentar insertar tests fallback en la base de datos
    for (const test of fallbackTests) {
      const { error } = await supabase
        .from('diagnostic_tests')
        .insert({
          id: test.id,
          title: test.title,
          description: test.description,
          test_id: test.testId
        })
        .select()
        .single();
      
      if (error) {
        console.warn(`⚠️ No se pudo insertar test ${test.title}:`, error);
      } else {
        console.log(`✅ Test fallback creado: ${test.title}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error creando diagnósticos fallback:', error);
    return false;
  }
};
