
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { DiagnosticSkeleton } from "@/components/diagnostic/DiagnosticSkeleton";
import { DiagnosticSelector } from "@/components/diagnostic/DiagnosticSelector";
import { TestResultView } from "@/components/diagnostic/TestResultView";
import { TestRunner } from "@/components/diagnostic/TestRunner";
import { PausedTestBanner } from "@/components/diagnostic/PausedTestBanner";
import { PauseConfirmationDialog } from "@/components/diagnostic/PauseConfirmationDialog";
import { DiagnosticController } from "@/components/diagnostic/DiagnosticController";
import { DiagnosticErrorView } from "@/components/diagnostic/DiagnosticErrorView"; 
import { Button } from "@/components/ui/button";
import { DetailedResultView } from "@/components/diagnostic/DetailedResultView";
import { RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Diagnostico = () => {
  console.log("Renderizando página de Diagnóstico");
  
  return (
    <AppLayout>
      <DiagnosticController>
        {({ 
          tests, 
          loading,
          initializing,
          generatingDiagnostic,
          currentTest,
          selectedTestId,
          testStarted,
          currentQuestionIndex,
          answers,
          resultSubmitted,
          showHint,
          testResults,
          pausedProgress,
          showPauseConfirmation,
          error,
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
          handleRestartDiagnostic,
          handleRetryInitialization
        }) => {
          console.log("Estado actual:", { 
            loading, 
            initializing,
            generatingDiagnostic,
            testStarted, 
            resultSubmitted,
            testsCount: tests.length,
            error
          });
          
          // Determine what message to show during loading
          let loadingMessage = "Cargando diagnósticos...";
          if (initializing) {
            loadingMessage = "Inicializando diagnósticos. Por favor espera...";
          } else if (generatingDiagnostic) {
            loadingMessage = "Cargando diagnóstico básico...";
          }
          
          return (
            <div className="container py-8">
              <h1 className="text-3xl font-bold mb-2">Diagnóstico</h1>
              <p className="text-gray-600 mb-6">
                Evalúa tus conocimientos y habilidades para crear un plan de estudio personalizado.
              </p>
              
              <Alert className="mb-6 bg-blue-50 border-blue-100">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertTitle>Diagnósticos predefinidos</AlertTitle>
                <AlertDescription>
                  Los diagnósticos disponibles son versiones básicas predefinidas. Para diagnósticos avanzados o personalizados, 
                  contacta con el administrador.
                </AlertDescription>
              </Alert>
              
              {loading ? (
                <DiagnosticSkeleton message={loadingMessage} generating={generatingDiagnostic} />
              ) : error ? (
                <DiagnosticErrorView 
                  error={error}
                  message="Esto puede deberse a una conexión inestable o a un problema temporal con el sistema. Por favor, intenta nuevamente."
                  onRetry={handleRetryInitialization}
                />
              ) : !testStarted ? (
                <>
                  {pausedProgress && tests.length > 0 && tests.some(test => test.id === pausedProgress.testId) && (
                    <PausedTestBanner 
                      testProgress={pausedProgress}
                      test={tests.find(test => test.id === pausedProgress.testId)!}
                      onResumeTest={handleResumeTest}
                      onDiscardProgress={handleDiscardProgress}
                    />
                  )}
                  
                  {tests.length > 0 ? (
                    <DiagnosticSelector 
                      tests={tests}
                      selectedTestId={selectedTestId}
                      onTestSelect={handleTestSelect}
                      onStartTest={handleStartTest}
                      loading={loading}
                    />
                  ) : (
                    <div className="text-center p-8 border rounded-lg bg-background">
                      <h3 className="text-xl font-medium mb-2">No hay diagnósticos disponibles</h3>
                      <p className="text-muted-foreground mb-4">
                        No se encontraron pruebas diagnósticas. Puede deberse a un problema de conexión o que aún no se han configurado.
                      </p>
                      <Button 
                        onClick={handleRetryInitialization}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Reintentar
                      </Button>
                    </div>
                  )}
                </>
              ) : resultSubmitted ? (
                <DetailedResultView 
                  onRestartDiagnostic={handleRestartDiagnostic} 
                  results={testResults ? testResults : undefined}
                />
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
                  onPauseTest={handlePauseTest}
                  onFinishTest={handleFinishTest}
                />
              )}
  
              <PauseConfirmationDialog 
                open={showPauseConfirmation} 
                onOpenChange={(open) => {
                  if (!open) {
                    console.log("Diálogo de pausa cerrado sin confirmar");
                  }
                }}
                onConfirm={confirmPauseTest} 
              />
            </div>
          );
        }}
      </DiagnosticController>
    </AppLayout>
  );
};

export default Diagnostico;
