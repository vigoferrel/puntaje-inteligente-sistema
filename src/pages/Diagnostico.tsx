
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { DiagnosticController } from "@/components/diagnostic/DiagnosticController";
import { DiagnosticSelection } from "@/components/diagnostic/DiagnosticSelection";
import { DiagnosticExecution } from "@/components/diagnostic/DiagnosticExecution";
import { DiagnosticResults } from "@/components/diagnostic/DiagnosticResults";
import { DiagnosticSkeleton } from "@/components/diagnostic/DiagnosticSkeleton";
import { DiagnosticPauseModal } from "@/components/diagnostic/DiagnosticPauseModal";
import { DiagnosticProgressBar } from "@/components/diagnostic/DiagnosticProgressBar";
import { DiagnosticErrorView } from "@/components/diagnostic/DiagnosticErrorView";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Diagnostico() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [showBackButton, setShowBackButton] = useState(true);
  
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <DiagnosticController>
      {({ 
        initializing,
        generatingDiagnostic,
        tests,
        error,
        loading,
        retryCount,
        handleRetryInitialization,
        selectedTestId,
        pausedProgress,
        testStarted,
        currentTest,
        currentQuestionIndex,
        answers,
        timeStarted,
        showHint,
        showPauseConfirmation,
        resultSubmitted,
        testResults,
        isDemoMode,
        testsAvailable,
        handleTestSelect,
        handleStartTest,
        handleResumeTest,
        handleDiscardProgress,
        handleAnswerSelect,
        handleRequestHint,
        handlePreviousQuestion,
        handleNextQuestion,
        handlePauseTest,
        confirmPauseTest,
        handleFinishTest,
        handleRestartDiagnostic
      }) => (
        <AppLayout>
          <div className="container py-6 max-w-5xl mx-auto">
            {initializing || generatingDiagnostic ? (
              <DiagnosticSkeleton 
                message={generatingDiagnostic 
                  ? "Generando diagnósticos básicos..." 
                  : "Cargando diagnósticos desde la base de datos..."} 
              />
            ) : error ? (
              <DiagnosticErrorView 
                error={error}
                message="Ocurrió un error al cargar los diagnósticos de la base de datos."
                onRetry={handleRetryInitialization}
                retryCount={retryCount}
              />
            ) : (
              <>
                {isDemoMode && (
                  <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertDescription>
                      Modo de demostración: Los diagnósticos mostrados son ejemplos. No se pudo cargar la base de datos.
                    </AlertDescription>
                  </Alert>
                )}
                
                {!testsAvailable && !isDemoMode && (
                  <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription>
                      No hay diagnósticos disponibles en este momento. Los diagnósticos aparecerán aquí cuando estén listos.
                    </AlertDescription>
                  </Alert>
                )}
                
                {showBackButton && !testStarted && (
                  <div className="mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="gap-1"
                    >
                      <Link to="/">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al inicio
                      </Link>
                    </Button>
                  </div>
                )}
                
                {testStarted && currentTest && (
                  <DiagnosticProgressBar 
                    currentQuestion={currentQuestionIndex + 1}
                    totalQuestions={currentTest.questions.length}
                    onPause={handlePauseTest}
                  />
                )}
                
                {!testStarted && !resultSubmitted && (
                  <DiagnosticSelection
                    tests={tests}
                    loading={loading}
                    selectedTestId={selectedTestId}
                    pausedProgress={pausedProgress}
                    onTestSelect={handleTestSelect}
                    onStartTest={handleStartTest}
                    onResumeTest={handleResumeTest}
                    onDiscardProgress={handleDiscardProgress}
                  />
                )}
                
                {testStarted && currentTest && !resultSubmitted && (
                  <DiagnosticExecution
                    test={currentTest}
                    currentQuestionIndex={currentQuestionIndex}
                    answers={answers}
                    showHint={showHint}
                    onAnswerSelect={handleAnswerSelect}
                    onRequestHint={handleRequestHint}
                    onPreviousQuestion={handlePreviousQuestion}
                    onNextQuestion={handleNextQuestion}
                    onFinishTest={handleFinishTest}
                  />
                )}
                
                {resultSubmitted && testResults && (
                  <DiagnosticResults
                    results={testResults}
                    onRestart={handleRestartDiagnostic}
                  />
                )}
                
                {showPauseConfirmation && (
                  <DiagnosticPauseModal
                    onConfirm={confirmPauseTest}
                    onCancel={() => confirmPauseTest(false)}
                  />
                )}
              </>
            )}
          </div>
        </AppLayout>
      )}
    </DiagnosticController>
  );
}
