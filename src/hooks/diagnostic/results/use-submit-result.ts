
import { useState } from 'react';
import { DiagnosticResult } from '@/types/diagnostic';
import { TPAESHabilidad } from '@/types/system-types';
import { submitDiagnosticResult } from '@/services/diagnostic/results/submit-result';
import { calculateDiagnosticResults } from '@/utils/diagnostic-helpers';

export const useSubmitResult = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    userId: string,
    diagnosticId: string,
    answers: Record<string, string>,
    questions: any[]
  ): Promise<DiagnosticResult | null> => {
    try {
      setSubmitting(true);
      setError(null);

      // Calculate results from answers and questions
      const calculatedResults = calculateDiagnosticResults(answers, questions);
      
      // Submit the calculated results
      const result = await submitDiagnosticResult(userId, diagnosticId, calculatedResults);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error submitting result';
      setError(errorMessage);
      console.error('Error submitting diagnostic result:', err);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const submitWithResults = async (
    userId: string,
    diagnosticId: string,
    results: Record<TPAESHabilidad, number>
  ): Promise<DiagnosticResult | null> => {
    try {
      setSubmitting(true);
      setError(null);

      const result = await submitDiagnosticResult(userId, diagnosticId, results);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error submitting result';
      setError(errorMessage);
      console.error('Error submitting diagnostic result:', err);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submit,
    submitWithResults,
    submitting,
    error
  };
};
