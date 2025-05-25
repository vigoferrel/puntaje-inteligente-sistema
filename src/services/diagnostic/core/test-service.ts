
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticTest } from "@/types/diagnostic";
import { fetchTestQuestions } from './question-service';

/**
 * Servicio modular para gestión de tests diagnósticos
 */
export class TestService {
  private static cache = new Map<string, DiagnosticTest[]>();
  private static cacheExpiry = 5 * 60 * 1000; // 5 minutos
  private static lastFetch = 0;

  static async fetchTests(userId: string, limit = 10): Promise<DiagnosticTest[]> {
    const cacheKey = `tests_${userId}`;
    const now = Date.now();

    // Cache hit si no ha expirado
    if (this.cache.has(cacheKey) && (now - this.lastFetch) < this.cacheExpiry) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const { data: tests, error } = await supabase
        .from('diagnostic_tests')
        .select('*')
        .limit(limit);

      if (error) throw error;

      if (!tests || tests.length === 0) {
        console.log("📋 No hay tests, creando fallbacks...");
        return this.createFallbackTests();
      }

      // Cargar preguntas para cada test en paralelo
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

      // Actualizar cache
      this.cache.set(cacheKey, testsWithQuestions);
      this.lastFetch = now;

      return testsWithQuestions;
    } catch (error) {
      console.error('❌ Error cargando tests:', error);
      return this.createFallbackTests();
    }
  }

  static async ensureTestExists(testId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('diagnostic_tests')
        .select('id')
        .eq('id', testId)
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  }

  private static createFallbackTests(): DiagnosticTest[] {
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
  }

  static clearCache(userId?: string): void {
    if (userId) {
      this.cache.delete(`tests_${userId}`);
    } else {
      this.cache.clear();
    }
    this.lastFetch = 0;
  }
}
