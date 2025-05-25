
import { useState, useCallback } from 'react';
import { DiagnosticTest } from '@/types/diagnostic';
import { useDemonstrationMode } from './use-demonstration-mode';

export const useDiagnosticTests = () => {
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getDemoDiagnosticTests } = useDemonstrationMode();

  const fetchTests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Por ahora usamos datos de demostración
      const demoTests = getDemoDiagnosticTests();
      setTests(demoTests);
      
      return demoTests;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching tests';
      setError(errorMessage);
      console.error('Error fetching diagnostic tests:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getDemoDiagnosticTests]);

  return {
    tests,
    loading,
    error,
    fetchTests
  };
};
