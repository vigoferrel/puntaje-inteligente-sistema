
import { useState, useCallback } from 'react';
import { DiagnosticTest, DiagnosticQuestion, DiagnosticResult } from '@/types/diagnostic';
import { useDiagnosticTests } from './use-diagnostic-tests';
import { useSubmitResult } from './results/use-submit-result';
import { calculateDiagnosticResults } from '@/utils/diagnostic-helpers';

interface DiagnosticFlowState {
  currentTest: DiagnosticTest | null;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isCompleted: boolean;
  result: DiagnosticResult | null;
}

export const useDiagnosticFlow = (userId?: string) => {
  const [flowState, setFlowState] = useState<DiagnosticFlowState>({
    currentTest: null,
    currentQuestionIndex: 0,
    answers: {},
    isCompleted: false,
    result: null
  });

  const { tests, loading: testsLoading, fetchTests } = useDiagnosticTests();
  const { submit, submitting } = useSubmitResult();

  const startTest = useCallback((testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return false;

    setFlowState({
      currentTest: test,
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false,
      result: null
    });

    return true;
  }, [tests]);

  const answerQuestion = useCallback((questionId: string, answer: string) => {
    setFlowState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setFlowState(prev => {
      if (!prev.currentTest) return prev;
      
      const nextIndex = prev.currentQuestionIndex + 1;
      const isCompleted = nextIndex >= prev.currentTest.questions.length;
      
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        isCompleted
      };
    });
  }, []);

  const previousQuestion = useCallback(() => {
    setFlowState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1)
    }));
  }, []);

  const submitTest = useCallback(async () => {
    if (!flowState.currentTest || !userId) return null;

    try {
      const result = await submit(
        userId,
        flowState.currentTest.id,
        flowState.answers,
        flowState.currentTest.questions
      );

      if (result) {
        setFlowState(prev => ({
          ...prev,
          result,
          isCompleted: true
        }));
      }

      return result;
    } catch (error) {
      console.error('Error submitting test:', error);
      return null;
    }
  }, [flowState, userId, submit]);

  const resetFlow = useCallback(() => {
    setFlowState({
      currentTest: null,
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false,
      result: null
    });
  }, []);

  const getCurrentQuestion = useCallback((): DiagnosticQuestion | null => {
    if (!flowState.currentTest || flowState.currentQuestionIndex >= flowState.currentTest.questions.length) {
      return null;
    }
    return flowState.currentTest.questions[flowState.currentQuestionIndex];
  }, [flowState]);

  const getProgress = useCallback(() => {
    if (!flowState.currentTest) return { current: 0, total: 0, percentage: 0 };
    
    const current = flowState.currentQuestionIndex;
    const total = flowState.currentTest.questions.length;
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    
    return { current, total, percentage };
  }, [flowState]);

  return {
    // State
    flowState,
    tests,
    loading: testsLoading || submitting,

    // Actions
    startTest,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    submitTest,
    resetFlow,
    fetchTests,

    // Helpers
    getCurrentQuestion,
    getProgress,

    // Computed
    canGoNext: flowState.currentTest ? 
      flowState.currentQuestionIndex < flowState.currentTest.questions.length - 1 : false,
    canGoPrevious: flowState.currentQuestionIndex > 0,
    canSubmit: flowState.currentTest ? 
      Object.keys(flowState.answers).length === flowState.currentTest.questions.length : false
  };
};
