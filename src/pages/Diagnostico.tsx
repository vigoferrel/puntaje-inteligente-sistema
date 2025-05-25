
import React, { useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { DiagnosticBrowser } from "@/components/diagnostic/DiagnosticBrowser";
import { DiagnosticExecution } from "@/components/diagnostic/DiagnosticExecution";
import { DiagnosticResults } from "@/components/diagnostic/DiagnosticResults";
import { DiagnosticProgressBar } from "@/components/diagnostic/DiagnosticProgressBar";
import { HierarchicalMetrics } from "@/components/diagnostic/HierarchicalMetrics";
import { CinematicIntelligenceCenter } from "@/components/diagnostic/CinematicIntelligenceCenter";
import { LectoGuiaProvider } from "@/contexts/lectoguia/LectoGuiaProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useDiagnosticManager } from "@/hooks/diagnostic/use-diagnostic-manager";
import { useComprehensiveDiagnostic } from "@/hooks/diagnostic/use-comprehensive-diagnostic";

export default function Diagnostico() {
  const diagnosticManager = useDiagnosticManager();
  const comprehensiveSystem = useComprehensiveDiagnostic();
  
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
  
  // Show Cinematic Intelligence Center if no test is started and system is ready
  const shouldShowIntelligenceCenter = !testStarted && !resultSubmitted && comprehensiveSystem.isSystemReady;
  
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
          {/* Back button - only show when not in intelligence center */}
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
          
          {/* System Status Banner - enhanced with comprehensive data */}
          {comprehensiveSystem.isSystemReady && !testStarted && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <div className="flex items-center justify-between">
                  <span>
                    Sistema PAES Pro Integral activo: {comprehensiveSystem.systemMetrics.totalNodes} nodos, {comprehensiveSystem.diagnosticTests.length} diagnósticos, {comprehensiveSystem.officialExercises.length} ejercicios oficiales
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="destructive" className="text-xs">
                      {comprehensiveSystem.systemMetrics.completedNodes} Completados
                    </Badge>
                    <Badge variant="default" className="text-xs">
                      Sistema: OPERACIONAL
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
            <CinematicIntelligenceCenter />
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
          
          {/* Enhanced debug info */}
          {process.env.NODE_ENV === 'development' && !testStarted && (
            <div className="mt-8 p-4 bg-gray-900 text-green-400 rounded border border-gray-700 text-xs font-mono">
              <strong className="text-yellow-400">🔬 Sistema Integral Debug:</strong>
              <br />
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="text-blue-400">Sistema Jerárquico:</div>
                  <div>• Ready: {hierarchicalData.isSystemReady ? 'Yes' : 'No'}</div>
                  <div>• PAES Tests: {hierarchicalData.paesTests.length}</div>
                  <div>• Tier 1 Nodes: {hierarchicalData.tier1Nodes.length}</div>
                  <div>• Diagnostic Tests: {tests.length}</div>
                </div>
                <div>
                  <div className="text-purple-400">Sistema Integral:</div>
                  <div>• Diagnósticos: {comprehensiveSystem.diagnosticTests.length}</div>
                  <div>• Ejercicios Oficiales: {comprehensiveSystem.officialExercises.length}</div>
                  <div>• Skills PAES: {comprehensiveSystem.paesSkills.length}</div>
                  <div>• Sistema Listo: {comprehensiveSystem.isSystemReady ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </LectoGuiaProvider>
    </AppLayout>
  );
}
