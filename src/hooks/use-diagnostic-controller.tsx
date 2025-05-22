
import { useState, useEffect } from "react";
import { useDiagnosticState } from "./diagnostic/use-diagnostic-state";
import { useDiagnosticInitialization } from "./diagnostic/use-diagnostic-initialization";
import { useDiagnosticTestSelection } from "./diagnostic/use-diagnostic-test-selection";
import { useDiagnosticTestExecution } from "./diagnostic/use-diagnostic-test-execution";
import { useDiagnosticProgress } from "./diagnostic/use-diagnostic-progress";
import { useDiagnosticResults } from "./diagnostic/use-diagnostic-results";
import { useDiagnostic } from "@/hooks/use-diagnostic";

export const useDiagnosticController = () => {
  // Diagnostic state hooks
  const { selectedTestId, testStarted, setSelectedTestId, setTestStarted } = useDiagnosticState();
  
  // Initialization hook
  const { initializing, generatingDiagnostic, error, retryInitialization, retryCount } = useDiagnosticInitialization();
  
  // Get diagnostic service
  const diagnosticService = useDiagnostic();
  
  // Compose the sub-hooks
  const selectionState = useDiagnosticTestSelection({
    selectedTestId,
    setSelectedTestId,
    setTestStarted
  });
  
  const executionState = useDiagnosticTestExecution({
    selectedTestId,
    testStarted,
    setTestStarted
  });
  
  const progressState = useDiagnosticProgress({
    testStarted,
    currentTest: executionState.currentTest,
    setTestStarted,
    setSelectedTestId,
    currentQuestionIndex: executionState.currentQuestionIndex,
    answers: executionState.answers,
    timeStarted: executionState.timeStarted
  });
  
  const resultState = useDiagnosticResults({
    currentTest: executionState.currentTest,
    answers: executionState.answers,
    timeStarted: executionState.timeStarted,
    setTestStarted
  });

  // Función para manejar el reintento de inicialización
  const handleRetryInitialization = async () => {
    await retryInitialization();
  };
  
  return {
    // State from initialization
    initializing,
    generatingDiagnostic,
    error,
    retryCount,
    
    // State from hooks
    tests: selectionState.tests,
    loading: selectionState.loading || initializing || generatingDiagnostic,
    selectedTestId,
    pausedProgress: selectionState.pausedProgress,
    testStarted,
    currentTest: executionState.currentTest,
    currentQuestionIndex: executionState.currentQuestionIndex,
    answers: executionState.answers,
    timeStarted: executionState.timeStarted,
    showHint: executionState.showHint,
    showPauseConfirmation: progressState.showPauseConfirmation,
    resultSubmitted: resultState.resultSubmitted,
    testResults: resultState.testResults,
    
    // Handlers
    handleTestSelect: selectionState.handleTestSelect,
    handleStartTest: selectionState.handleStartTest,
    handleResumeTest: selectionState.handleResumeTest,
    handleDiscardProgress: selectionState.handleDiscardProgress,
    handleAnswerSelect: executionState.handleAnswerSelect,
    handleRequestHint: executionState.handleRequestHint,
    handlePreviousQuestion: executionState.handlePreviousQuestion,
    handleNextQuestion: executionState.handleNextQuestion,
    handlePauseTest: progressState.handlePauseTest,
    confirmPauseTest: progressState.confirmPauseTest,
    handleFinishTest: resultState.handleFinishTest,
    handleRestartDiagnostic: resultState.handleRestartDiagnostic,
    handleRetryInitialization
  };
};

export type DiagnosticControllerState = ReturnType<typeof useDiagnosticController>;
