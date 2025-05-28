
import { useState, useCallback } from 'react';
import { DiagnosticTest } from '@/types/diagnostic';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDiagnosticTests = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTests = useCallback(async () => {
    if (!user?.id) {
      setError('Usuario no autenticado');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch real diagnostic tests from database
      const { data: diagnosticTests, error: testsError } = await supabase
        .from('diagnostic_tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (testsError) {
        throw testsError;
      }

      // Fetch exercises for each diagnostic test
      const testsWithQuestions = await Promise.all(
        (diagnosticTests || []).map(async (test) => {
          const { data: exercises, error: exercisesError } = await supabase
            .from('exercises')
            .select('*')
            .eq('test_id', test.test_id)
            .limit(test.total_questions || 15);

          if (exercisesError) {
            console.error('Error fetching exercises for test:', test.id, exercisesError);
            return null;
          }

          return {
            id: test.id,
            title: test.title,
            description: test.description || '',
            testId: test.test_id,
            isCompleted: false, // TODO: Check user progress
            questions: (exercises || []).map(exercise => ({
              id: exercise.id,
              question: exercise.question,
              options: exercise.options ? Object.values(exercise.options) : [],
              correctAnswer: exercise.correct_answer,
              skill: 'INTERPRET_RELATE' as any, // Map from skill_id
              prueba: 'COMPETENCIA_LECTORA' as any, // Map from test_id
              explanation: exercise.explanation || '',
              difficulty: exercise.difficulty === 'basic' ? 'BASICO' : 
                         exercise.difficulty === 'intermediate' ? 'INTERMEDIO' : 'AVANZADO'
            }))
          } as DiagnosticTest;
        })
      );

      const validTests = testsWithQuestions.filter(test => test !== null) as DiagnosticTest[];
      setTests(validTests);
      return validTests;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching tests';
      setError(errorMessage);
      console.error('Error fetching diagnostic tests:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  return {
    tests,
    loading,
    error,
    fetchTests
  };
};
