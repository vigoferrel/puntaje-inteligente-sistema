
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
  
  // Initialization hook con mejor manejo de estados
  const { 
    initializing, 
    generatingDiagnostic, 
    error, 
    retryInitialization, 
    retryCount,
    isDemoMode 
  } = useDiagnosticInitialization();
  
  // Get diagnostic service
  const diagnosticService = useDiagnostic();
  
  // Estado adicional para rastrear si los tests están disponibles
  const [testsAvailable, setTestsAvailable] = useState(false);
  
  // Verificar disponibilidad de tests cuando la inicialización termine
  useEffect(() => {
    if (!initializing && !generatingDiagnostic) {
      const hasTests = diagnosticService.tests && diagnosticService.tests.length > 0;
      setTestsAvailable(hasTests);
      
      if (hasTests) {
        console.log(`✅ Tests disponibles: ${diagnosticService.tests.length}`);
      } else {
        console.warn("⚠️ No hay tests disponibles después de la inicialización");
      }
    }
  }, [initializing, generatingDiagnostic, diagnosticService.tests]);
  
  // Compose the sub-hooks
  const selectionState = useDiagnosticTestSelection({
    selectedTestId,
    setSelectedTestId,
    setTestStarted,
    isDemoMode
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

  // Función para manejar el reintento con mejor feedback
  const handleRetryInitialization = async () => {
    console.log(`🔄 Reintentando inicialización (intento ${retryCount + 1})`);
    await retryInitialization();
  };
  
  // Determinar el estado de loading general
  const isLoading = initializing || generatingDiagnostic || selectionState.loading;
  
  return {
    // State from initialization
    initializing,
    generatingDiagnostic,
    error,
    retryCount,
    isDemoMode,
    testsAvailable,
    
    // State from hooks - usar los tests del servicio directamente
    tests: diagnosticService.tests || [],
    loading: isLoading,
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
