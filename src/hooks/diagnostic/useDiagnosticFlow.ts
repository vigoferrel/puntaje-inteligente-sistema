
import { useState, useCallback, useEffect } from 'react';
import { useDiagnosticSystem } from './useDiagnosticSystem';
import { DiagnosticTest, DiagnosticResult } from '@/types/diagnostic';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { submitDiagnosticResult } from '@/services/diagnostic/results/submit-result';
import { fetchDiagnosticQuestions } from '@/services/diagnostic/question/fetch-questions';

interface DiagnosticFlowState {
  selectedTestId: string | null;
  currentTest: DiagnosticTest | null;
  isActive: boolean;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeStarted: Date | null;
  showHint: boolean;
  results: DiagnosticResult | null;
}

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

  // Cargar preguntas para un test
  const loadTestQuestions = useCallback(async (test: DiagnosticTest): Promise<DiagnosticTest> => {
    try {
      console.log('📋 Cargando preguntas para test:', test.id);
      
      // Intentar cargar preguntas reales
      const questions = await fetchDiagnosticQuestions(test.id, test.testId);
      
      if (questions.length > 0) {
        console.log(`✅ Cargadas ${questions.length} preguntas reales`);
        return { ...test, questions };
      }
      
      // Fallback: crear preguntas de demostración
      console.log('⚠️ Usando preguntas de demostración');
      const demoQuestions = Array.from({ length: 5 }, (_, i) => ({
        id: `demo-${test.id}-${i + 1}`,
        question: `Pregunta de demostración ${i + 1} para ${test.title}`,
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctAnswer: 'Opción A',
        skill: 'INTERPRET_RELATE' as any,
        prueba: 'COMPETENCIA_LECTORA' as any,
        explanation: `Explicación para la pregunta ${i + 1}`,
        difficulty: 'intermediate' as any
      }));
      
      return { ...test, questions: demoQuestions };
    } catch (error) {
      console.error('❌ Error cargando preguntas:', error);
      
      // Fallback de emergencia
      const fallbackQuestions = Array.from({ length: 3 }, (_, i) => ({
        id: `fallback-${test.id}-${i + 1}`,
        question: `Pregunta de fallback ${i + 1}`,
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctAnswer: 'Opción A',
        skill: 'INTERPRET_RELATE' as any,
        prueba: 'COMPETENCIA_LECTORA' as any,
        explanation: 'Explicación de fallback',
        difficulty: 'basic' as any
      }));
      
      return { ...test, questions: fallbackQuestions };
    }
  }, []);

  // Seleccionar test
  const selectTest = useCallback(async (testId: string) => {
    const test = diagnosticSystem.diagnosticTests.find(t => t.id === testId);
    if (!test) {
      console.error('❌ Test no encontrado:', testId);
      return false;
    }

    console.log('🎯 Seleccionando test:', test.title);
    
    try {
      const testWithQuestions = await loadTestQuestions(test);
      
      setState(prev => ({
        ...prev,
        selectedTestId: testId,
        currentTest: testWithQuestions
      }));
      
      toast({
        title: "Test seleccionado",
        description: `${test.title} - ${testWithQuestions.questions.length} preguntas`,
      });
      
      return true;
    } catch (error) {
      console.error('❌ Error seleccionando test:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el test seleccionado",
        variant: "destructive"
      });
      return false;
    }
  }, [diagnosticSystem.diagnosticTests, loadTestQuestions]);

  // Iniciar diagnóstico
  const startDiagnostic = useCallback(() => {
    if (!state.currentTest) {
      console.error('❌ No hay test seleccionado');
      return false;
    }

    if (state.currentTest.questions.length === 0) {
      console.error('❌ Test sin preguntas');
      toast({
        title: "Error",
        description: "El test seleccionado no tiene preguntas disponibles",
        variant: "destructive"
      });
      return false;
    }

    console.log('▶️ Iniciando diagnóstico:', state.currentTest.title);

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
      description: `Comenzando ${state.currentTest.title} - ${state.currentTest.questions.length} preguntas`,
    });

    return true;
  }, [state.currentTest]);

  // Responder pregunta
  const answerQuestion = useCallback((questionId: string, answer: string) => {
    console.log('📝 Respuesta registrada:', questionId, answer);
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

      console.log('🔄 Navegando a pregunta:', newIndex + 1);
      return { ...prev, currentQuestionIndex: newIndex, showHint: false };
    });
  }, []);

  // Finalizar diagnóstico
  const finishDiagnostic = useCallback(async (): Promise<boolean> => {
    if (!state.currentTest || !state.timeStarted || !user?.id) {
      console.error('❌ Datos insuficientes para finalizar');
      return false;
    }

    try {
      console.log('🏁 Finalizando diagnóstico...');
      
      const timeSpentMinutes = Math.round(
        (Date.now() - state.timeStarted.getTime()) / 60000
      );

      console.log('📊 Enviando resultados:', {
        test: state.currentTest.id,
        answers: Object.keys(state.answers).length,
        timeSpent: timeSpentMinutes
      });

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

        // Actualizar sistema
        await diagnosticSystem.refreshSystem();

        toast({
          title: "Diagnóstico completado",
          description: "Resultados guardados exitosamente",
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Error finalizando diagnóstico:', error);
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
    console.log('🔄 Reset completo del flujo');
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
