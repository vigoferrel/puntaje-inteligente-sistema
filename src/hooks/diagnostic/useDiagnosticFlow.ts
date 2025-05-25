
import { useState, useCallback, useEffect } from 'react';
import { DiagnosticTest, DiagnosticQuestion, DiagnosticResult } from '@/types/diagnostic';
import { useDiagnosticTests } from './use-diagnostic-tests';
import { useSubmitResult } from './results/use-submit-result';

interface DiagnosticFlowState {
  currentTest: DiagnosticTest | null;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isCompleted: boolean;
  result: DiagnosticResult | null;
  selectedTestId: string | null;
  isActive: boolean;
  showHint: boolean;
}

export const useDiagnosticFlow = (userId?: string) => {
  const [flowState, setFlowState] = useState<DiagnosticFlowState>({
    currentTest: null,
    currentQuestionIndex: 0,
    answers: {},
    isCompleted: false,
    result: null,
    selectedTestId: null,
    isActive: false,
    showHint: false
  });

  const { tests, loading: testsLoading, fetchTests } = useDiagnosticTests();
  const { submit, submitting } = useSubmitResult();

  // Auto-fetch tests on mount
  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const selectTest = useCallback((testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return false;

    setFlowState(prev => ({
      ...prev,
      selectedTestId: testId,
      currentTest: test
    }));

    return true;
  }, [tests]);

  const startTest = useCallback((testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return false;

    setFlowState({
      currentTest: test,
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false,
      result: null,
      selectedTestId: testId,
      isActive: true,
      showHint: false
    });

    return true;
  }, [tests]);

  const startDiagnostic = useCallback(() => {
    if (!flowState.selectedTestId) return false;
    return startTest(flowState.selectedTestId);
  }, [flowState.selectedTestId, startTest]);

  const answerQuestion = useCallback((questionId: string, answer: string) => {
    setFlowState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  }, []);

  const navigateQuestion = useCallback((direction: 'next' | 'prev' | number) => {
    setFlowState(prev => {
      if (!prev.currentTest) return prev;
      
      let nextIndex: number;
      
      if (typeof direction === 'number') {
        nextIndex = direction;
      } else if (direction === 'next') {
        nextIndex = prev.currentQuestionIndex + 1;
      } else {
        nextIndex = prev.currentQuestionIndex - 1;
      }
      
      // Clamp to valid range
      nextIndex = Math.max(0, Math.min(nextIndex, prev.currentTest.questions.length - 1));
      
      const isCompleted = nextIndex >= prev.currentTest.questions.length;
      
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        isCompleted
      };
    });
  }, []);

  const toggleHint = useCallback(() => {
    setFlowState(prev => ({
      ...prev,
      showHint: !prev.showHint
    }));
  }, []);

  const finishDiagnostic = useCallback(async () => {
    if (!flowState.currentTest || !userId) return false;

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
          isCompleted: true,
          isActive: false
        }));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error submitting test:', error);
      return false;
    }
  }, [flowState, userId, submit]);

  const resetFlow = useCallback(() => {
    setFlowState({
      currentTest: null,
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false,
      result: null,
      selectedTestId: null,
      isActive: false,
      showHint: false
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
    // State - mapped to expected interface
    flowState,
    tests,
    loading: testsLoading || submitting,
    availableTests: tests,
    selectedTestId: flowState.selectedTestId,
    currentTest: flowState.currentTest,
    isActive: flowState.isActive,
    currentQuestionIndex: flowState.currentQuestionIndex,
    answers: flowState.answers,
    showHint: flowState.showHint,
    results: flowState.result,
    systemReady: tests.length > 0,
    isLoading: testsLoading || submitting,

    // Actions
    selectTest,
    startTest,
    startDiagnostic,
    answerQuestion,
    navigateQuestion,
    toggleHint,
    finishDiagnostic,
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
