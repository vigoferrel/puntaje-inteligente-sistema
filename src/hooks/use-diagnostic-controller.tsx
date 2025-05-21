
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/use-user-data";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { toast } from "@/components/ui/use-toast";
import { 
  saveTestProgress, 
  getTestProgress, 
  clearTestProgress,
  StoredTestProgress 
} from "@/utils/test-storage";

export const useDiagnosticController = () => {
  const { user, loading: userLoading, updateLearningPhase } = useUserData();
  const { profile } = useAuth();
  const { 
    tests, 
    loading: testsLoading, 
    currentTest, 
    fetchDiagnosticTests,
    startDiagnosticTest,
    submitDiagnosticResult
  } = useDiagnostic();
  
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [resultSubmitted, setResultSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, number> | null>(null);
  const [pausedProgress, setPausedProgress] = useState<StoredTestProgress | null>(null);
  const [showPauseConfirmation, setShowPauseConfirmation] = useState(false);
  
  useEffect(() => {
    if (profile) {
      fetchDiagnosticTests(profile.id);
    }
  }, [profile, fetchDiagnosticTests]);
  
  useEffect(() => {
    // Check for saved progress when tests are loaded
    const savedProgress = getTestProgress();
    if (savedProgress && tests.some(test => test.id === savedProgress.testId)) {
      setPausedProgress(savedProgress);
    }
  }, [tests]);
  
  const handleTestSelect = (testId: string) => {
    setSelectedTestId(testId);
  };
  
  const handleStartTest = async () => {
    if (selectedTestId) {
      const test = await startDiagnosticTest(selectedTestId);
      if (test) {
        setTestStarted(true);
        setTimeStarted(new Date());
        setCurrentQuestionIndex(0);
        setAnswers({});
        setShowHint(false);
      }
    }
  };
  
  const handleResumeTest = async () => {
    if (pausedProgress) {
      const test = await startDiagnosticTest(pausedProgress.testId);
      if (test) {
        setTestStarted(true);
        setCurrentQuestionIndex(pausedProgress.currentQuestionIndex);
        setAnswers(pausedProgress.answers);
        setTimeStarted(new Date(pausedProgress.timeStarted));
        setShowHint(false);
        // Clear the paused state once resumed
        setPausedProgress(null);
        clearTestProgress();
      }
    }
  };
  
  const handleDiscardProgress = () => {
    setPausedProgress(null);
    clearTestProgress();
    toast({
      title: "Progreso descartado",
      description: "Se ha eliminado el progreso guardado del diagnóstico anterior",
    });
  };
  
  const handlePauseTest = () => {
    setShowPauseConfirmation(true);
  };
  
  const confirmPauseTest = () => {
    if (currentTest && timeStarted) {
      saveTestProgress(
        currentTest,
        currentQuestionIndex,
        answers,
        timeStarted
      );
      
      setTestStarted(false);
      setSelectedTestId(null);
      toast({
        title: "Diagnóstico pausado",
        description: "Tu progreso ha sido guardado. Puedes continuar más tarde.",
      });
    }
    setShowPauseConfirmation(false);
  };
  
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleRequestHint = () => {
    setShowHint(true);
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowHint(false);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentTest && currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowHint(false);
    } else {
      handleFinishTest();
    }
  };
  
  const handleFinishTest = async () => {
    if (!profile || !currentTest || !timeStarted) return;
    
    // Calculate time spent
    const timeSpentMinutes = Math.floor((new Date().getTime() - timeStarted.getTime()) / 60000);
    
    // Submit results
    const result = await submitDiagnosticResult(
      profile.id,
      currentTest.id,
      answers,
      timeSpentMinutes
    );
    
    if (result) {
      setResultSubmitted(true);
      setTestResults(result.results);
      
      // Clear any saved progress
      clearTestProgress();
      
      // Update user's learning phase to next phase
      if (user) {
        try {
          await updateLearningPhase("PERSONALIZED_PLAN");
          
          toast({
            title: "Diagnóstico completado",
            description: "Ahora puedes avanzar a la creación de tu plan de estudio personalizado",
          });
        } catch (error) {
          console.error("Error updating learning phase:", error);
        }
      }
    }
  };
  
  const handleRestartDiagnostic = () => {
    setTestStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeStarted(null);
    setResultSubmitted(false);
    setSelectedTestId(null);
    setShowHint(false);
    setTestResults(null);
  };

  const loading = userLoading || testsLoading;
  
  return {
    // State
    tests,
    loading,
    currentTest,
    selectedTestId,
    testStarted,
    currentQuestionIndex,
    answers,
    timeStarted,
    resultSubmitted,
    showHint,
    testResults,
    pausedProgress,
    showPauseConfirmation,
    
    // Handlers
    handleTestSelect,
    handleStartTest,
    handleResumeTest,
    handleDiscardProgress,
    handlePauseTest,
    confirmPauseTest,
    handleAnswerSelect,
    handleRequestHint,
    handlePreviousQuestion,
    handleNextQuestion,
    handleFinishTest,
    handleRestartDiagnostic
  };
};

export type DiagnosticControllerState = ReturnType<typeof useDiagnosticController>;
