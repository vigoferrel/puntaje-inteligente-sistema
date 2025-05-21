
import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/use-user-data";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticSkeleton } from "@/components/diagnostic/DiagnosticSkeleton";
import { TestSelection } from "@/components/diagnostic/TestSelection";
import { TestResultView } from "@/components/diagnostic/TestResultView";
import { TestRunner } from "@/components/diagnostic/TestRunner";

const Diagnostico = () => {
  const { user, loading: userLoading, updateLearningPhase } = useUserData();
  const { profile } = useAuth();
  const { 
    tests, 
    loading, 
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
  
  useEffect(() => {
    if (profile) {
      fetchDiagnosticTests(profile.id);
    }
  }, [profile, fetchDiagnosticTests]);
  
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
  };
  
  if (loading || userLoading) {
    return (
      <AppLayout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Diagnóstico</h1>
          <DiagnosticSkeleton />
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Diagnóstico</h1>
        
        {!testStarted ? (
          <TestSelection 
            tests={tests}
            selectedTestId={selectedTestId}
            onTestSelect={handleTestSelect}
            onStartTest={handleStartTest}
          />
        ) : resultSubmitted ? (
          <TestResultView onRestartDiagnostic={handleRestartDiagnostic} />
        ) : (
          <TestRunner 
            currentTest={currentTest}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            showHint={showHint}
            onAnswerSelect={handleAnswerSelect}
            onRequestHint={handleRequestHint}
            onPreviousQuestion={handlePreviousQuestion}
            onNextQuestion={handleNextQuestion}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default Diagnostico;
