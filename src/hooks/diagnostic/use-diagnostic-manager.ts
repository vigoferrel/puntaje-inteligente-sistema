
import { useState, useEffect, useCallback } from "react";
import { DiagnosticTest, DiagnosticResult } from "@/types/diagnostic";
import { fetchDiagnosticTests, submitDiagnosticResult } from "@/services/diagnostic";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useHierarchicalDiagnostic } from "./use-hierarchical-diagnostic";

interface DiagnosticManagerState {
  // Data state
  tests: DiagnosticTest[];
  currentTest: DiagnosticTest | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  selectedTestId: string | null;
  testStarted: boolean;
  
  // Test execution state
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeStarted: Date | null;
  showHint: boolean;
  
  // Results state
  resultSubmitted: boolean;
  testResults: DiagnosticResult | null;
}

interface DiagnosticManagerActions {
  // Data actions
  loadTests: () => Promise<void>;
  
  // Selection actions
  selectTest: (testId: string) => void;
  startTest: () => Promise<void>;
  
  // Execution actions
  answerQuestion: (questionId: string, answer: string) => void;
  navigateToQuestion: (index: number) => void;
  toggleHint: () => void;
  
  // Completion actions
  finishTest: () => Promise<void>;
  restart: () => void;
}

export const useDiagnosticManager = (): DiagnosticManagerState & DiagnosticManagerActions & {
  // Hierarchical system data
  hierarchicalData: ReturnType<typeof useHierarchicalDiagnostic>;
} => {
  const { user } = useAuth();
  const hierarchicalData = useHierarchicalDiagnostic();
  
  // State initialization
  const [state, setState] = useState<DiagnosticManagerState>({
    tests: [],
    currentTest: null,
    loading: false,
    error: null,
    selectedTestId: null,
    testStarted: false,
    currentQuestionIndex: 0,
    answers: {},
    timeStarted: null,
    showHint: false,
    resultSubmitted: false,
    testResults: null
  });

  // Load tests from database (integrated with hierarchical system)
  const loadTests = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const userId = user?.id || "auto-generated";
      
      // Use hierarchical diagnostic tests if available, fallback to original
      let loadedTests: DiagnosticTest[] = [];
      
      if (hierarchicalData.diagnosticTests.length > 0) {
        loadedTests = hierarchicalData.diagnosticTests;
        console.log(`✅ Using hierarchical diagnostic tests: ${loadedTests.length}`);
      } else {
        loadedTests = await fetchDiagnosticTests(userId); // Solo 1 argumento
        console.log(`✅ Using fallback diagnostic tests: ${loadedTests.length}`);
      }
      
      if (loadedTests.length === 0) {
        setState(prev => ({ 
          ...prev, 
          loading: false,
          error: "No hay diagnósticos disponibles en este momento"
        }));
        return;
      }
      
      setState(prev => ({ 
        ...prev, 
        tests: loadedTests, 
        loading: false,
        error: null
      }));
      
      console.log(`✅ Diagnósticos cargados: ${loadedTests.length}`);
      
    } catch (error) {
      console.error("Error al cargar diagnósticos:", error);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: "Error al cargar los diagnósticos" 
      }));
      
      toast({
        title: "Error",
        description: "No se pudieron cargar los diagnósticos",
        variant: "destructive"
      });
    }
  }, [user?.id, hierarchicalData.diagnosticTests]);

  // Auto-sync with hierarchical system
  useEffect(() => {
    if (hierarchicalData.diagnosticTests.length > 0 && state.tests.length === 0) {
      setState(prev => ({ 
        ...prev, 
        tests: hierarchicalData.diagnosticTests,
        loading: false,
        error: null
      }));
    }
  }, [hierarchicalData.diagnosticTests, state.tests.length]);

  // Test selection
  const selectTest = useCallback((testId: string) => {
    setState(prev => ({ ...prev, selectedTestId: testId }));
  }, []);

  // Start test
  const startTest = useCallback(async () => {
    const { selectedTestId, tests } = state;
    if (!selectedTestId) return;
    
    const test = tests.find(t => t.id === selectedTestId);
    if (!test) return;
    
    setState(prev => ({
      ...prev,
      currentTest: test,
      testStarted: true,
      currentQuestionIndex: 0,
      answers: {},
      timeStarted: new Date(),
      showHint: false,
      resultSubmitted: false,
      testResults: null
    }));
  }, [state.selectedTestId, state.tests]);

  // Answer question
  const answerQuestion = useCallback((questionId: string, answer: string) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer }
    }));
  }, []);

  // Navigate to question
  const navigateToQuestion = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: index,
      showHint: false
    }));
  }, []);

  // Toggle hint
  const toggleHint = useCallback(() => {
    setState(prev => ({ ...prev, showHint: !prev.showHint }));
  }, []);

  // Finish test
  const finishTest = useCallback(async () => {
    const { currentTest, answers, timeStarted } = state;
    if (!currentTest || !timeStarted || !user?.id) return;
    
    try {
      const timeSpentMinutes = Math.round((Date.now() - timeStarted.getTime()) / 60000);
      
      const result = await submitDiagnosticResult(
        user.id,
        currentTest.id,
        answers,
        timeSpentMinutes
      );
      
      if (result) {
        setState(prev => ({
          ...prev,
          resultSubmitted: true,
          testResults: result,
          testStarted: false
        }));
        
        // Refresh hierarchical data to update user weights
        if (hierarchicalData.loadUserWeights) {
          await hierarchicalData.loadUserWeights();
        }
        
        toast({
          title: "Diagnóstico completado",
          description: "Tus resultados han sido guardados exitosamente"
        });
      }
    } catch (error) {
      console.error("Error al enviar resultados:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los resultados",
        variant: "destructive"
      });
    }
  }, [state.currentTest, state.answers, state.timeStarted, user?.id, hierarchicalData.loadUserWeights]);

  // Restart
  const restart = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedTestId: null,
      testStarted: false,
      currentTest: null,
      currentQuestionIndex: 0,
      answers: {},
      timeStarted: null,
      showHint: false,
      resultSubmitted: false,
      testResults: null
    }));
  }, []);

  // Load tests on mount or when hierarchical system is ready
  useEffect(() => {
    if (hierarchicalData.isSystemReady) {
      loadTests();
    }
  }, [loadTests, hierarchicalData.isSystemReady]);

  return {
    // State
    ...state,
    
    // Actions
    loadTests,
    selectTest,
    startTest,
    answerQuestion,
    navigateToQuestion,
    toggleHint,
    finishTest,
    restart,
    
    // Hierarchical system data
    hierarchicalData
  };
};
