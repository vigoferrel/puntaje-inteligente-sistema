
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { DiagnosticSkeleton } from "@/components/diagnostic/DiagnosticSkeleton";
import { TestSelection } from "@/components/diagnostic/TestSelection";
import { TestResultView } from "@/components/diagnostic/TestResultView";
import { TestRunner } from "@/components/diagnostic/TestRunner";
import { PausedTestBanner } from "@/components/diagnostic/PausedTestBanner";
import { PauseConfirmationDialog } from "@/components/diagnostic/PauseConfirmationDialog";
import { DiagnosticController } from "@/components/diagnostic/DiagnosticController";

const Diagnostico = () => {
  console.log("Renderizando página de Diagnóstico");
  
  return (
    <AppLayout>
      <DiagnosticController>
        {({ 
          tests, 
          loading, 
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
        }) => {
          console.log("Estado actual:", { 
            loading, 
            testStarted, 
            resultSubmitted,
            testsCount: tests.length
          });
          
          return (
            <div className="container py-8">
              <h1 className="text-3xl font-bold mb-6">Diagnóstico</h1>
              
              {loading ? (
                <DiagnosticSkeleton />
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
                    <TestSelection 
                      tests={tests}
                      selectedTestId={selectedTestId}
                      onTestSelect={handleTestSelect}
                      onStartTest={handleStartTest}
                    />
                  ) : (
                    <div className="text-center p-8 border rounded-lg bg-background">
                      <h3 className="text-xl font-medium mb-2">No hay diagnósticos disponibles</h3>
                      <p className="text-muted-foreground">
                        No se encontraron pruebas diagnósticas. Por favor, inténtalo de nuevo más tarde.
                      </p>
                    </div>
                  )}
                </>
              ) : resultSubmitted ? (
                <TestResultView 
                  onRestartDiagnostic={handleRestartDiagnostic} 
                  results={testResults ? testResults.results : undefined}
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
                    // Si se cierra el diálogo sin confirmar
                    console.log("Cerrado sin confirmar");
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
