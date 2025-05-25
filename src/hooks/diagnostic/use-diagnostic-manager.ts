
// Hook de compatibilidad que usa el nuevo sistema de flujo diagnóstico
import { useDiagnosticFlow } from './useDiagnosticFlow';
import { useDiagnosticSystem } from './useDiagnosticSystem';

/**
 * Hook de compatibilidad para mantener la interfaz legacy
 * Mapea la nueva arquitectura a la interfaz anterior
 */
export const useDiagnosticManager = () => {
  const diagnosticFlow = useDiagnosticFlow();
  const diagnosticSystem = useDiagnosticSystem();

  return {
    // Estado principal
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

    // Acciones
    loadTests: () => {
      // Auto-cargado por el sistema
    },
    selectTest: diagnosticFlow.selectTest,
    startTest: diagnosticFlow.startDiagnostic,
    answerQuestion: diagnosticFlow.answerQuestion,
    navigateToQuestion: (index: number) => diagnosticFlow.navigateQuestion(index),
    toggleHint: diagnosticFlow.toggleHint,
    finishTest: diagnosticFlow.finishDiagnostic,
    restart: diagnosticFlow.resetFlow,

    // Sistema jerárquico
    hierarchicalData: {
      isSystemReady: diagnosticSystem.isSystemReady,
      paesTests: diagnosticSystem.paesTests,
      tier1Nodes: diagnosticSystem.tier1Nodes
    }
  };
};
