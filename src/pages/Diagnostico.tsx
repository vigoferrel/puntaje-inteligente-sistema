
import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useDiagnostic, DiagnosticTest, DiagnosticQuestion } from "@/hooks/use-diagnostic";
import { useAuth } from "@/contexts/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUserData } from "@/hooks/use-user-data";
import { toast } from "@/components/ui/use-toast";
import { InfoIcon, AlertCircle, ArrowRightIcon, CheckCircle } from "lucide-react";

const Diagnostico = () => {
  const { user, loading: userLoading } = useUserData();
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
      }
    }
  };
  
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentTest && currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
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
          // In a real implementation, we would update the user's learning phase
          // We'll just show a toast notification for now
          toast({
            title: "Diagnóstico completado",
            description: "Ahora puedes avanzar a la siguiente fase del ciclo de aprendizaje",
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
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Cargando...
                </span>
              </div>
              <p className="mt-2">Cargando diagnósticos...</p>
            </div>
          </div>
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
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Evaluación Diagnóstica</AlertTitle>
              <AlertDescription>
                Esta evaluación nos ayudará a determinar tu nivel actual de habilidades para crear un plan de estudio personalizado.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests.map((test) => (
                <Card 
                  key={test.id} 
                  className={`cursor-pointer transition-all ${
                    selectedTestId === test.id ? 'ring-2 ring-primary ring-offset-2' : ''
                  } ${test.isCompleted ? 'bg-green-50' : ''}`}
                  onClick={() => handleTestSelect(test.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{test.title}</CardTitle>
                      {test.isCompleted && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      variant={test.isCompleted ? "outline" : "default"}
                      className="w-full"
                      onClick={() => handleTestSelect(test.id)}
                    >
                      {test.isCompleted ? 'Ver resultados' : 'Seleccionar'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {selectedTestId && (
              <div className="flex justify-end mt-8">
                <Button onClick={handleStartTest}>
                  Comenzar diagnóstico <ArrowRightIcon className="ml-2 h-4 w-4" />
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
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Próximos pasos</AlertTitle>
                <AlertDescription>
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
                <p className="text-sm text-gray-500">
                  Pregunta {currentQuestionIndex + 1} de {currentTest?.questions.length}
                </p>
              </div>
            </CardHeader>
            
            {currentQuestion && (
              <CardContent className="space-y-6">
                <div className="text-lg font-medium">{currentQuestion.question}</div>
                
                <RadioGroup 
                  value={answers[currentQuestion.id] || ""} 
                  onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {!canContinue && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Selecciona una respuesta</AlertTitle>
                    <AlertDescription>
                      Debes seleccionar una respuesta para continuar.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            )}
            
            <CardFooter>
              <div className="w-full flex justify-end">
                <Button 
                  onClick={handleNextQuestion} 
                  disabled={!canContinue}
                >
                  {currentQuestionIndex === (currentTest?.questions.length || 0) - 1 ? 'Finalizar' : 'Siguiente'}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Diagnostico;
