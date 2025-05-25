
import { useState, useCallback } from "react";
import { 
  DiagnosticTest, 
  DiagnosticQuestion, 
  DiagnosticResult 
} from "@/types/diagnostic";
import {
  fetchDiagnosticTests,
  fetchDiagnosticResults,
  submitDiagnosticResult,
  ensureDefaultDiagnosticsExist,
  createLocalFallbackDiagnostics
} from "@/services/diagnostic-service-unified";
import { toast } from "@/components/ui/use-toast";

// Re-export types for convenience
export type { DiagnosticTest, DiagnosticQuestion, DiagnosticResult } from "@/types/diagnostic";

export const useDiagnostic = () => {
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState<DiagnosticTest | null>(null);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  
  /**
   * Fetches all diagnostic tests for a user
   */
  const fetchTests = async (userId: string) => {
    try {
      setLoading(true);
      const testsWithQuestions = await fetchDiagnosticTests(userId);
      setTests(testsWithQuestions);
      return testsWithQuestions;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ensures that at least one default diagnostic test exists
   */
  const ensureDefaultDiagnostics = async () => {
    try {
      setLoading(true);
      
      // Asegurarse que exista al menos un diagnóstico por defecto
      const hasTests = await ensureDefaultDiagnosticsExist();
      
      if (hasTests) {
        // Refrescar la lista si se crearon diagnósticos
        if (tests.length === 0) {
          const updatedTests = await fetchTests("auto-generated");
          return updatedTests.length > 0;
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al asegurar diagnósticos por defecto:', error);
      toast({
        title: "Error",
        description: "No se pudo generar un diagnóstico de prueba",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates local fallback diagnostics when online generation fails
   */
  const createLocalFallbacks = async () => {
    try {
      setLoading(true);
      const success = await createLocalFallbackDiagnostics();
      if (success) {
        // Refrescar la lista
        await fetchTests("auto-generated");
      }
      return success;
    } catch (error) {
      console.error('Error al crear diagnósticos fallback:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Starts a diagnostic test
   */
  const startDiagnosticTest = async (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (test) {
      setCurrentTest(test);
      return test;
    }
    return null;
  };

  /**
   * Submits results from a diagnostic test
   */
  const submitResult = async (
    userId: string,
    diagnosticId: string,
    answers: Record<string, string>,
    timeSpentMinutes: number
  ) => {
    try {
      const test = tests.find(t => t.id === diagnosticId);
      if (!test) throw new Error("Test not found");
      
      const result = await submitDiagnosticResult(
        userId,
        diagnosticId,
        answers,
        timeSpentMinutes
      );
      
      if (result) {
        // Mark test as completed
        setTests(prev => 
          prev.map(t => 
            t.id === diagnosticId ? { ...t, isCompleted: true } : t
          )
        );
        
        // Add result to results array
        setResults(prev => [...prev, result]);
      }
      
      return result;
    } catch (error) {
      console.error('Error in submitDiagnosticResult:', error);
      return null;
    }
  };

  /**
   * Fetches diagnostic results for a user
   */
  const fetchResults = async (userId: string) => {
    try {
      const fetchedResults = await fetchDiagnosticResults(userId);
      setResults(fetchedResults);
      return fetchedResults;
    } catch (error) {
      console.error('Error in fetchDiagnosticResults:', error);
      return [];
    }
  };

  return {
    tests,
    loading,
    currentTest,
    results,
    fetchDiagnosticTests: fetchTests,
    ensureDefaultDiagnosticsExist: ensureDefaultDiagnostics,
    createLocalFallbackDiagnostics: createLocalFallbacks,
    startDiagnosticTest,
    submitDiagnosticResult: submitResult,
    fetchDiagnosticResults: fetchResults
  };
};
