
import { useState, useEffect } from "react";
import { useDiagnosticTestSelection } from "./diagnostic/use-diagnostic-test-selection";
import { useDiagnosticTestExecution } from "./diagnostic/use-diagnostic-test-execution";
import { useDiagnosticProgress } from "./diagnostic/use-diagnostic-progress";
import { useDiagnosticResults } from "./diagnostic/use-diagnostic-results";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { toast } from "@/components/ui/use-toast";

export const useDiagnosticController = () => {
  // State used across multiple hooks
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [generatingDiagnostic, setGeneratingDiagnostic] = useState(false);
  
  // Get diagnostic service
  const diagnosticService = useDiagnostic();
  
  // Initialize data
  useEffect(() => {
    const initDiagnostics = async () => {
      try {
        // This will ensure at least one test exists
        setInitializing(true);
        
        // Generate a test if none exist
        if (diagnosticService.tests.length === 0) {
          setGeneratingDiagnostic(true);
          const success = await diagnosticService.ensureDefaultDiagnosticsExist();
          
          if (success) {
            toast({
              title: "Diagnóstico creado",
              description: "Se ha generado un diagnóstico inicial para ti",
            });
          }
          setGeneratingDiagnostic(false);
        }
      } catch (error) {
        console.error("Error initializing diagnostics:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los diagnósticos iniciales",
          variant: "destructive"
        });
        setGeneratingDiagnostic(false);
      } finally {
        setInitializing(false);
      }
    };
    
    initDiagnostics();
  }, [diagnosticService]);
  
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
  
  return {
    // State from hooks
    initializing,
    generatingDiagnostic,
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
    handleRestartDiagnostic: resultState.handleRestartDiagnostic
  };
};

export type DiagnosticControllerState = ReturnType<typeof useDiagnosticController>;
