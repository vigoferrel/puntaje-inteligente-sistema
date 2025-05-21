
import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUserData } from "@/hooks/use-user-data";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircle, InfoIcon } from "lucide-react";
import { DiagnosticSkeleton } from "@/components/diagnostic/DiagnosticSkeleton";
import { DiagnosticCard } from "@/components/diagnostic/DiagnosticCard";
import { QuestionView } from "@/components/diagnostic/QuestionView";

const Diagnostico = () => {
  const { user, loading: userLoading, updateLearningPhase } = useUserData();
  const { profile } = useAuth();
  const navigate = useNavigate();
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
  
  const currentQuestion = currentTest?.questions[currentQuestionIndex];
  const progress = currentTest ? ((currentQuestionIndex + 1) / currentTest.questions.length) * 100 : 0;
  
  // Calculate if we can go to next question
  const canContinue = currentQuestion ? !!answers[currentQuestion.id] : false;
  
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
          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <InfoIcon className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-700">Evaluación Diagnóstica</AlertTitle>
              <AlertDescription className="text-blue-700">
                Esta evaluación nos ayudará a determinar tu nivel actual de habilidades para crear un plan de estudio personalizado.
                Selecciona una de las evaluaciones disponibles para comenzar.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map((test) => (
                <DiagnosticCard 
                  key={test.id}
                  test={test}
                  selected={selectedTestId === test.id}
                  onSelect={handleTestSelect}
                />
              ))}
            </div>
            
            {selectedTestId && (
              <div className="flex justify-end mt-8">
                <Button 
                  onClick={handleStartTest}
                  className="group"
                >
                  Comenzar diagnóstico 
                  <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        ) : resultSubmitted ? (
          // Results view
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl">¡Diagnóstico completado!</CardTitle>
              <CardDescription className="text-center">
                Gracias por completar el diagnóstico. Ahora podremos crear un plan de estudio personalizado para ti.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              
              <Alert className="bg-blue-50 border-blue-200">
                <InfoIcon className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-700">Próximos pasos</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Tu plan de estudio personalizado se está generando. Dirígete al dashboard para continuar tu preparación.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleRestartDiagnostic}>
                Ver otros diagnósticos
              </Button>
              <Button onClick={() => navigate("/")}>
                Ir al dashboard
              </Button>
            </CardFooter>
          </Card>
        ) : (
          // Test view
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="space-y-2">
                <CardTitle>{currentTest?.title}</CardTitle>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Pregunta {currentQuestionIndex + 1} de {currentTest?.questions.length}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.round(progress)}% completado
                  </p>
                </div>
              </div>
            </CardHeader>
            
            {currentQuestion && (
              <CardContent className="space-y-6">
                <QuestionView 
                  question={currentQuestion}
                  selectedAnswer={answers[currentQuestion.id] || ""}
                  onAnswerSelect={handleAnswerSelect}
                  showHint={showHint}
                  onRequestHint={handleRequestHint}
                />
              </CardContent>
            )}
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Anterior
              </Button>
              
              <Button 
                onClick={handleNextQuestion} 
                disabled={!canContinue}
              >
                {currentQuestionIndex === (currentTest?.questions.length || 0) - 1 ? 'Finalizar' : 'Siguiente'}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Diagnostico;
