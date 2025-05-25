
import { useState, useCallback } from 'react';
import { useDiagnosticSystem } from './useDiagnosticSystem';
import { DiagnosticTest, DiagnosticResult } from '@/types/diagnostic';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { submitDiagnosticResult } from '@/services/diagnostic/test-services';

interface DiagnosticFlowState {
  // Estado esencial simplificado
  selectedTestId: string | null;
  currentTest: DiagnosticTest | null;
  isActive: boolean;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeStarted: Date | null;
  showHint: boolean;
  results: DiagnosticResult | null;
}

/**
 * Hook simplificado para el flujo diagnóstico
 * Reemplaza use-diagnostic-manager con lógica quirúrgicamente reducida
 */
export const useDiagnosticFlow = () => {
  const { user } = useAuth();
  const diagnosticSystem = useDiagnosticSystem();
  
  const [state, setState] = useState<DiagnosticFlowState>({
    selectedTestId: null,
    currentTest: null,
    isActive: false,
    currentQuestionIndex: 0,
    answers: {},
    timeStarted: null,
    showHint: false,
    results: null
  });

  // Seleccionar test
  const selectTest = useCallback((testId: string) => {
    const test = diagnosticSystem.diagnosticTests.find(t => t.id === testId);
    if (!test) return false;

    setState(prev => ({
      ...prev,
      selectedTestId: testId,
      currentTest: test
    }));
    return true;
  }, [diagnosticSystem.diagnosticTests]);

  // Iniciar diagnóstico
  const startDiagnostic = useCallback(() => {
    if (!state.currentTest) return false;

    setState(prev => ({
      ...prev,
      isActive: true,
      currentQuestionIndex: 0,
      answers: {},
      timeStarted: new Date(),
      showHint: false,
      results: null
    }));

    toast({
      title: "Diagnóstico iniciado",
      description: `Comenzando ${state.currentTest.title}`,
    });

    return true;
  }, [state.currentTest]);

  // Responder pregunta
  const answerQuestion = useCallback((questionId: string, answer: string) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
      showHint: false
    }));
  }, []);

  // Navegar preguntas
  const navigateQuestion = useCallback((direction: 'next' | 'prev' | number) => {
    setState(prev => {
      const maxIndex = (prev.currentTest?.questions.length || 1) - 1;
      let newIndex = prev.currentQuestionIndex;

      if (typeof direction === 'number') {
        newIndex = Math.max(0, Math.min(direction, maxIndex));
      } else if (direction === 'next') {
        newIndex = Math.min(newIndex + 1, maxIndex);
      } else if (direction === 'prev') {
        newIndex = Math.max(newIndex - 1, 0);
      }

      return { ...prev, currentQuestionIndex: newIndex, showHint: false };
    });
  }, []);

  // Finalizar diagnóstico
  const finishDiagnostic = useCallback(async () => {
    if (!state.currentTest || !state.timeStarted || !user?.id) {
      return false;
    }

    try {
      const timeSpentMinutes = Math.round(
        (Date.now() - state.timeStarted.getTime()) / 60000
      );

      const result = await submitDiagnosticResult(
        user.id,
        state.currentTest.id,
        state.answers,
        timeSpentMinutes
      );

      if (result) {
        setState(prev => ({
          ...prev,
          isActive: false,
          results: result
        }));

        // Actualizar sistema para refrescar datos
        await diagnosticSystem.refreshSystem();

        toast({
          title: "Diagnóstico completado",
          description: "Resultados guardados exitosamente",
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error finalizando diagnóstico:', error);
      toast({
        title: "Error",
        description: "No se pudo completar el diagnóstico",
        variant: "destructive"
      });
      return false;
    }
  }, [state.currentTest, state.timeStarted, state.answers, user?.id, diagnosticSystem]);

  // Toggle hint
  const toggleHint = useCallback(() => {
    setState(prev => ({ ...prev, showHint: !prev.showHint }));
  }, []);

  // Reset completo
  const resetFlow = useCallback(() => {
    setState({
      selectedTestId: null,
      currentTest: null,
      isActive: false,
      currentQuestionIndex: 0,
      answers: {},
      timeStarted: null,
      showHint: false,
      results: null
    });
  }, []);

  // Estado derivado
  const currentQuestion = state.currentTest?.questions[state.currentQuestionIndex] || null;
  const isLastQuestion = state.currentQuestionIndex === (state.currentTest?.questions.length || 0) - 1;
  const canContinue = currentQuestion ? !!state.answers[currentQuestion.id] : false;
  const progress = state.currentTest ? 
    ((state.currentQuestionIndex + 1) / state.currentTest.questions.length) * 100 : 0;

  return {
    // Estado
    ...state,
    currentQuestion,
    isLastQuestion,
    canContinue,
    progress,
    
    // Sistema diagnóstico
    availableTests: diagnosticSystem.diagnosticTests,
    systemReady: diagnosticSystem.isSystemReady,
    isLoading: diagnosticSystem.isLoading,
    
    // Acciones
    selectTest,
    startDiagnostic,
    answerQuestion,
    navigateQuestion,
    finishDiagnostic,
    toggleHint,
    resetFlow
  };
};
