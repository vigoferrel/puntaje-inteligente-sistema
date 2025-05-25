
import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { DiagnosticBrowser } from "@/components/diagnostic/DiagnosticBrowser";
import { DiagnosticExecution } from "@/components/diagnostic/DiagnosticExecution";
import { DiagnosticResults } from "@/components/diagnostic/DiagnosticResults";
import { DiagnosticProgressBar } from "@/components/diagnostic/DiagnosticProgressBar";
import { CinematicIntelligenceCenter } from "@/components/diagnostic/CinematicIntelligenceCenter";
import { LectoGuiaProvider } from "@/contexts/lectoguia/LectoGuiaProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useDiagnosticFlow } from "@/hooks/diagnostic/useDiagnosticFlow";

export default function Diagnostico() {
  const [viewMode, setViewMode] = useState<'command_center' | 'browser' | 'execution' | 'results'>('command_center');
  
  const {
    // Estado
    availableTests,
    selectedTestId,
    currentTest,
    isActive,
    currentQuestionIndex,
    answers,
    showHint,
    results,
    systemReady,
    isLoading,
    
    // Acciones
    selectTest,
    startDiagnostic,
    answerQuestion,
    navigateQuestion,
    finishDiagnostic,
    toggleHint,
    resetFlow
  } = useDiagnosticFlow();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Manejar transiciones de estado
  useEffect(() => {
    if (results) {
      setViewMode('results');
    } else if (isActive && currentTest) {
      setViewMode('execution');
    } else if (selectedTestId) {
      setViewMode('browser');
    }
  }, [results, isActive, currentTest, selectedTestId]);

  const handleStartAssessment = () => {
    console.log('🎯 Navegando a browser desde Command Center');
    setViewMode('browser');
  };

  const handleTestSelect = (testId: string) => {
    console.log('🔍 Test seleccionado:', testId);
    selectTest(testId);
  };

  const handleStartTest = () => {
    console.log('▶️ Iniciando diagnóstico');
    const success = startDiagnostic();
    if (success) {
      setViewMode('execution');
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    answerQuestion(questionId, answer);
  };

  const handleFinishTest = async () => {
    console.log('🏁 Finalizando diagnóstico');
    const success = await finishDiagnostic();
    if (success) {
      setViewMode('results');
    }
  };

  const handleRestart = () => {
    console.log('🔄 Reiniciando flujo diagnóstico');
    resetFlow();
    setViewMode('command_center');
  };

  const handleBackToCommandCenter = () => {
    setViewMode('command_center');
  };

  // Manejo de navegación de preguntas
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      navigateQuestion('prev');
    }
  };

  const handleNextQuestion = () => {
    if (currentTest && currentQuestionIndex < currentTest.questions.length - 1) {
      navigateQuestion('next');
    }
  };

  // Estados de error y loading
  if (isLoading && viewMode === 'command_center') {
    return (
      <AppLayout>
        <div className="container py-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-lg font-medium">Inicializando sistema diagnóstico...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <LectoGuiaProvider>
        <div className="container py-6 max-w-5xl mx-auto">
          {/* Back button - only show when not in command center */}
          {viewMode !== 'command_center' && (
            <div className="mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToCommandCenter}
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Centro de Comando
              </Button>
            </div>
          )}
          
          {/* System Status Banner */}
          {systemReady && viewMode !== 'command_center' && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <div className="flex items-center justify-between">
                  <span>
                    Sistema PAES activo: {availableTests.length} diagnósticos disponibles
                  </span>
                  <Badge variant="default" className="text-xs">
                    Sistema: OPERACIONAL
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Progress bar during test */}
          {viewMode === 'execution' && currentTest && (
            <DiagnosticProgressBar 
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={currentTest.questions.length}
              onPause={handleRestart}
            />
          )}
          
          {/* Main content based on view mode */}
          {viewMode === 'command_center' && (
            <CinematicIntelligenceCenter onStartAssessment={handleStartAssessment} />
          )}
          
          {viewMode === 'browser' && (
            <DiagnosticBrowser
              tests={availableTests}
              loading={isLoading}
              selectedTestId={selectedTestId}
              onTestSelect={handleTestSelect}
              onStartTest={handleStartTest}
              total={availableTests.length}
            />
          )}
          
          {viewMode === 'execution' && currentTest && (
            <DiagnosticExecution
              test={currentTest}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              showHint={showHint}
              onAnswerSelect={handleAnswerSelect}
              onRequestHint={toggleHint}
              onPreviousQuestion={handlePreviousQuestion}
              onNextQuestion={handleNextQuestion}
              onFinishTest={handleFinishTest}
            />
          )}
          
          {viewMode === 'results' && results && (
            <DiagnosticResults
              results={results}
              onRestart={handleRestart}
            />
          )}
          
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-900 text-green-400 rounded border border-gray-700 text-xs font-mono">
              <strong className="text-yellow-400">🔬 Sistema Debug:</strong>
              <br />
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="text-blue-400">Estado Actual:</div>
                  <div>• Modo: {viewMode}</div>
                  <div>• Tests: {availableTests.length}</div>
                  <div>• Sistema: {systemReady ? 'Listo' : 'No listo'}</div>
                  <div>• Test seleccionado: {selectedTestId || 'Ninguno'}</div>
                </div>
                <div>
                  <div className="text-purple-400">Diagnóstico:</div>
                  <div>• Activo: {isActive ? 'Sí' : 'No'}</div>
                  <div>• Pregunta: {currentQuestionIndex + 1}/{currentTest?.questions.length || 0}</div>
                  <div>• Respuestas: {Object.keys(answers).length}</div>
                  <div>• Resultados: {results ? 'Disponibles' : 'Pendientes'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </LectoGuiaProvider>
    </AppLayout>
  );
}
