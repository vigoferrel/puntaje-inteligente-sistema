
// Hook de compatibilidad que usa el nuevo sistema de flujo diagnóstico
import { useDiagnosticFlow } from './useDiagnosticFlow';

/**
 * Hook de compatibilidad para mantener la interfaz legacy
 * Ahora mapea correctamente todas las propiedades de useDiagnosticFlow
 */
export const useDiagnosticManager = () => {
  const diagnosticFlow = useDiagnosticFlow();

  return {
    // Estado principal - mapeo directo desde diagnosticFlow
    tests: diagnosticFlow.availableTests,
    currentTest: diagnosticFlow.currentTest,
    loading: diagnosticFlow.isLoading,
    error: null,
    selectedTestId: diagnosticFlow.selectedTestId,
    testStarted: diagnosticFlow.isActive,
    currentQuestionIndex: diagnosticFlow.currentQuestionIndex,
    answers: diagnosticFlow.answers,
    showHint: diagnosticFlow.showHint,
    resultSubmitted: !!diagnosticFlow.results,
    testResults: diagnosticFlow.results,

    // Acciones - mapeo directo
    loadTests: diagnosticFlow.fetchTests,
    selectTest: diagnosticFlow.selectTest,
    startTest: diagnosticFlow.startDiagnostic,
    answerQuestion: diagnosticFlow.answerQuestion,
    navigateToQuestion: (index: number) => diagnosticFlow.navigateQuestion(index),
    toggleHint: diagnosticFlow.toggleHint,
    finishTest: diagnosticFlow.finishDiagnostic,
    restart: diagnosticFlow.resetFlow,

    // Sistema jerárquico
    hierarchicalData: {
      isSystemReady: diagnosticFlow.systemReady,
      paesTests: diagnosticFlow.availableTests,
      tier1Nodes: []
    }
  };
};
