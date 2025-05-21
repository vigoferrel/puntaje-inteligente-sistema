
import { useState } from "react";
import { useDiagnosticTestSelection } from "./diagnostic/use-diagnostic-test-selection";
import { useDiagnosticTestExecution } from "./diagnostic/use-diagnostic-test-execution";
import { useDiagnosticProgress } from "./diagnostic/use-diagnostic-progress";
import { useDiagnosticResults } from "./diagnostic/use-diagnostic-results";

export const useDiagnosticController = () => {
  // State used across multiple hooks
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  
  // Compose the sub-hooks
  const selectionState = useDiagnosticTestSelection({
    setSelectedTestId,
    setTestStarted,
    selectedTestId
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
    setSelectedTestId
  });
  
  const resultState = useDiagnosticResults({
    currentTest: executionState.currentTest,
    answers: executionState.answers,
    timeStarted: executionState.timeStarted,
    setTestStarted
  });
  
  return {
    // State from selection hook
    tests: selectionState.tests,
    loading: selectionState.loading,
    selectedTestId,
    pausedProgress: selectionState.pausedProgress,
    
    // State from execution hook
    testStarted,
    currentTest: executionState.currentTest,
    currentQuestionIndex: executionState.currentQuestionIndex,
    answers: executionState.answers,
    timeStarted: executionState.timeStarted,
    showHint: executionState.showHint,

    // State from progress hook  
    showPauseConfirmation: progressState.showPauseConfirmation,
    
    // State from results hook
    resultSubmitted: resultState.resultSubmitted,
    testResults: resultState.testResults,
    
    // Handlers from selection hook
    handleTestSelect: selectionState.handleTestSelect,
    handleStartTest: selectionState.handleStartTest,
    handleResumeTest: selectionState.handleResumeTest,
    handleDiscardProgress: selectionState.handleDiscardProgress,
    
    // Handlers from execution hook
    handleAnswerSelect: executionState.handleAnswerSelect,
    handleRequestHint: executionState.handleRequestHint,
    handlePreviousQuestion: executionState.handlePreviousQuestion,
    handleNextQuestion: executionState.handleNextQuestion,
    
    // Handlers from progress hook
    handlePauseTest: progressState.handlePauseTest,
    confirmPauseTest: progressState.confirmPauseTest,
    
    // Handlers from results hook
    handleFinishTest: resultState.handleFinishTest,
    handleRestartDiagnostic: resultState.handleRestartDiagnostic
  };
};

export type DiagnosticControllerState = ReturnType<typeof useDiagnosticController>;
