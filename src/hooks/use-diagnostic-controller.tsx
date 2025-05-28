
import { useState, useEffect } from "react";
import { useDiagnosticState } from "./diagnostic/use-diagnostic-state";
import { useDiagnosticInitialization } from "./diagnostic/use-diagnostic-initialization";
import { useDiagnosticTestSelection } from "./diagnostic/use-diagnostic-test-selection";
import { useDiagnosticTestExecution } from "./diagnostic/use-diagnostic-test-execution";
import { useDiagnosticProgress } from "./diagnostic/use-diagnostic-progress";
import { useDiagnosticResults } from "./diagnostic/use-diagnostic-results";

export const useDiagnosticController = () => {
  console.log('🔬 DiagnosticController: Inicializando hook');
  
  // Estado básico del diagnóstico
  const { selectedTestId, testStarted, setSelectedTestId, setTestStarted } = useDiagnosticState();
  console.log('🔬 DiagnosticController: Estado básico cargado', { selectedTestId, testStarted });
  
  // Inicialización con manejo de errores mejorado
  const initializationState = useDiagnosticInitialization();
  console.log('🔬 DiagnosticController: Estado de inicialización', {
    initializing: initializationState.initializing,
    generatingDiagnostic: initializationState.generatingDiagnostic,
    testsCount: initializationState.tests?.length || 0,
    error: initializationState.error
  });
  
  // Estado de disponibilidad de tests
  const [testsAvailable, setTestsAvailable] = useState(false);
  
  // Verificar disponibilidad cuando termine la inicialización
  useEffect(() => {
    const isNotInitializing = !initializationState.initializing && !initializationState.generatingDiagnostic;
    console.log('🔬 DiagnosticController: Verificando disponibilidad de tests', {
      isNotInitializing,
      testsLength: initializationState.tests?.length
    });
    
    if (isNotInitializing) {
      const hasTests = initializationState.tests && initializationState.tests.length > 0;
      setTestsAvailable(hasTests);
      
      if (hasTests) {
        console.log(`✅ Tests disponibles: ${initializationState.tests.length}`);
      } else {
        console.warn("⚠️ No hay tests disponibles después de la inicialización");
      }
    }
  }, [initializationState.initializing, initializationState.generatingDiagnostic, initializationState.tests]);
  
  // Composición de sub-hooks con logging
  const selectionState = useDiagnosticTestSelection({
    selectedTestId,
    setSelectedTestId,
    setTestStarted
  });
  console.log('🔬 DiagnosticController: Estado de selección cargado');
  
  const executionState = useDiagnosticTestExecution({
    selectedTestId,
    testStarted,
    setTestStarted
  });
  console.log('🔬 DiagnosticController: Estado de ejecución cargado');
  
  const progressState = useDiagnosticProgress({
    testStarted,
    currentTest: executionState.currentTest,
    setTestStarted,
    setSelectedTestId,
    currentQuestionIndex: executionState.currentQuestionIndex,
    answers: executionState.answers,
    timeStarted: executionState.timeStarted
  });
  console.log('🔬 DiagnosticController: Estado de progreso cargado');
  
  const resultState = useDiagnosticResults({
    currentTest: executionState.currentTest,
    answers: executionState.answers,
    timeStarted: executionState.timeStarted,
    setTestStarted
  });
  console.log('🔬 DiagnosticController: Estado de resultados cargado');

  // Función de reintento mejorada
  const handleRetryInitialization = async () => {
    console.log(`🔄 Reintentando inicialización (intento ${initializationState.retryCount + 1})`);
    try {
      await initializationState.retryInitialization();
      console.log('✅ Reinicio exitoso');
    } catch (error) {
      console.error('❌ Error en reinicio:', error);
    }
  };
  
  // Estado de loading general simplificado
  const isLoading = initializationState.initializing || initializationState.generatingDiagnostic;
  
  console.log('🔬 DiagnosticController: Estado final compilado', {
    testsAvailable,
    isLoading,
    selectedTestId,
    testStarted
  });
  
  return {
    // Estados de inicialización
    initializing: initializationState.initializing,
    generatingDiagnostic: initializationState.generatingDiagnostic,
    error: initializationState.error,
    retryCount: initializationState.retryCount,
    isDemoMode: initializationState.isDemoMode,
    testsAvailable,
    
    // Estados principales
    tests: initializationState.tests || [],
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
    
    // Handlers con logging mejorado
    handleTestSelect: (testId: string) => {
      console.log('🎯 Seleccionando test:', testId);
      selectionState.handleTestSelect(testId);
    },
    handleStartTest: () => {
      console.log('🚀 Iniciando test');
      selectionState.handleStartTest();
    },
    handleResumeTest: () => {
      console.log('▶️ Reanudando test');
      selectionState.handleResumeTest();
    },
    handleDiscardProgress: () => {
      console.log('🗑️ Descartando progreso');
      selectionState.handleDiscardProgress();
    },
    handleAnswerSelect: (answer: string) => {
      console.log('✏️ Respuesta seleccionada:', answer);
      executionState.handleAnswerSelect(answer);
    },
    handleRequestHint: () => {
      console.log('💡 Solicitando pista');
      executionState.handleRequestHint();
    },
    handlePreviousQuestion: () => {
      console.log('⬅️ Pregunta anterior');
      executionState.handlePreviousQuestion();
    },
    handleNextQuestion: () => {
      console.log('➡️ Siguiente pregunta');
      executionState.handleNextQuestion();
    },
    handlePauseTest: () => {
      console.log('⏸️ Pausando test');
      progressState.handlePauseTest();
    },
    confirmPauseTest: () => {
      console.log('✅ Confirmando pausa');
      progressState.confirmPauseTest();
    },
    handleFinishTest: () => {
      console.log('🏁 Finalizando test');
      resultState.handleFinishTest();
    },
    handleRestartDiagnostic: () => {
      console.log('🔄 Reiniciando diagnóstico');
      resultState.handleRestartDiagnostic();
    },
    handleRetryInitialization
  };
};

export type DiagnosticControllerState = ReturnType<typeof useDiagnosticController>;
