
import { useState } from "react";
import { 
  DiagnosticTest, 
  DiagnosticQuestion, 
  DiagnosticResult 
} from "@/types/diagnostic";
import {
  fetchDiagnosticTests as fetchTests,
  fetchDiagnosticQuestions,
  submitDiagnosticResult as submitResult,
  fetchDiagnosticResults as fetchResults,
} from "@/services/diagnostic";

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
  const fetchDiagnosticTests = async (userId: string) => {
    try {
      setLoading(true);
      const testsWithQuestions = await fetchTests(userId);
      setTests(testsWithQuestions);
      return testsWithQuestions;
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
  const submitDiagnosticResult = async (
    userId: string,
    diagnosticId: string,
    answers: Record<string, string>,
    timeSpentMinutes: number
  ) => {
    try {
      const test = tests.find(t => t.id === diagnosticId);
      if (!test) throw new Error("Test not found");
      
      const result = await submitResult(
        userId,
        diagnosticId,
        test,
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
  const fetchDiagnosticResults = async (userId: string) => {
    try {
      const fetchedResults = await fetchResults(userId);
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
    fetchDiagnosticTests,
    startDiagnosticTest,
    submitDiagnosticResult,
    fetchDiagnosticResults
  };
};
