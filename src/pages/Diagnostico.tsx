
import React, { useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { DiagnosticBrowser } from "@/components/diagnostic/DiagnosticBrowser";
import { DiagnosticExecution } from "@/components/diagnostic/DiagnosticExecution";
import { DiagnosticResults } from "@/components/diagnostic/DiagnosticResults";
import { DiagnosticProgressBar } from "@/components/diagnostic/DiagnosticProgressBar";
import { HierarchicalMetrics } from "@/components/diagnostic/HierarchicalMetrics";
import { DiagnosticIntelligenceCenter } from "@/components/diagnostic/DiagnosticIntelligenceCenter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useDiagnosticManager } from "@/hooks/diagnostic/use-diagnostic-manager";
import { LectoGuiaProvider } from "@/contexts/LectoGuiaContext";

export default function Diagnostico() {
  const diagnosticManager = useDiagnosticManager();
  const {
    // State
    tests,
    currentTest,
    loading,
    error,
    selectedTestId,
    testStarted,
    currentQuestionIndex,
    answers,
    showHint,
    resultSubmitted,
    testResults,
    
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
  } = diagnosticManager;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Verificar si debe mostrar el Centro de Inteligencia Diagnóstica
  const shouldShowIntelligenceCenter = !testStarted && !resultSubmitted && !loading;
  
  // Handle question navigation
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentTest && currentQuestionIndex < currentTest.questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  };
  
  return (
    <AppLayout>
      <LectoGuiaProvider>
        <div className="container py-6 max-w-5xl mx-auto">
          {/* Back button - solo mostrar cuando no está en el centro de inteligencia */}
          {!shouldShowIntelligenceCenter && (
            <div className="mb-4">
              <Button variant="ghost" size="sm" asChild className="gap-1">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                  Volver al inicio
                </Link>
              </Button>
            </div>
          )}
          
          {/* System Status Banner */}
          {hierarchicalData.isSystemReady && !testStarted && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <div className="flex items-center justify-between">
                  <span>
                    Sistema PAES Pro activo: {hierarchicalData.systemMetrics.totalNodes} nodos jerárquicos cargados
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="destructive" className="text-xs">
                      {hierarchicalData.systemMetrics.tier1Count} Críticos
                    </Badge>
                    <Badge variant="default" className="text-xs">
                      Tier 1 Coverage: {hierarchicalData.tier1Coverage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Progress bar during test */}
          {testStarted && currentTest && (
            <DiagnosticProgressBar 
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={currentTest.questions.length}
              onPause={() => {
                // Simple pause - just go back to selection
                restart();
              }}
            />
          )}
          
          {/* Error state */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadTests}
                  className="ml-4"
                >
                  Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Hierarchical Metrics - Show only when not in test mode */}
          {!testStarted && !resultSubmitted && hierarchicalData.isSystemReady && !shouldShowIntelligenceCenter && (
            <HierarchicalMetrics />
          )}
          
          {/* Main content */}
          {shouldShowIntelligenceCenter && (
            <DiagnosticIntelligenceCenter />
          )}
          
          {!testStarted && !resultSubmitted && !shouldShowIntelligenceCenter && (
            <DiagnosticBrowser
              tests={tests}
              loading={loading}
              selectedTestId={selectedTestId}
              onTestSelect={selectTest}
              onStartTest={startTest}
              total={tests.length}
            />
          )}
          
          {testStarted && currentTest && !resultSubmitted && (
            <DiagnosticExecution
              test={currentTest}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              showHint={showHint}
              onAnswerSelect={answerQuestion}
              onRequestHint={toggleHint}
              onPreviousQuestion={handlePreviousQuestion}
              onNextQuestion={handleNextQuestion}
              onFinishTest={finishTest}
            />
          )}
          
          {resultSubmitted && testResults && (
            <DiagnosticResults
              results={testResults}
              onRestart={restart}
            />
          )}
          
          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && !testStarted && (
            <div className="mt-8 p-4 bg-gray-100 rounded text-xs">
              <strong>Debug Info:</strong>
              <br />
              System Ready: {hierarchicalData.isSystemReady ? 'Yes' : 'No'}
              <br />
              PAES Tests: {hierarchicalData.paesTests.length}
              <br />
              Tier 1 Nodes: {hierarchicalData.tier1Nodes.length}
              <br />
              Diagnostic Tests: {tests.length}
              <br />
              Recommended Path: {hierarchicalData.recommendedPath.length}
            </div>
          )}
        </div>
      </LectoGuiaProvider>
    </AppLayout>
  );
}
