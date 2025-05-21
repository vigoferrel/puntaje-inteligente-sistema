
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
          handleFinishTest, // Make sure we're using this
          handleRestartDiagnostic
        }) => (
          <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Diagnóstico</h1>
            
            {loading ? (
              <DiagnosticSkeleton />
            ) : !testStarted ? (
              <>
                {pausedProgress && tests.some(test => test.id === pausedProgress.testId) && (
                  <PausedTestBanner 
                    testProgress={pausedProgress}
                    test={tests.find(test => test.id === pausedProgress.testId)!}
                    onResumeTest={handleResumeTest}
                    onDiscardProgress={handleDiscardProgress}
                  />
                )}
                <TestSelection 
                  tests={tests}
                  selectedTestId={selectedTestId}
                  onTestSelect={handleTestSelect}
                  onStartTest={handleStartTest}
                />
              </>
            ) : resultSubmitted ? (
              <TestResultView 
                onRestartDiagnostic={handleRestartDiagnostic} 
                results={testResults || undefined}
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
                onFinishTest={handleFinishTest} // Pass the function
              />
            )}

            <PauseConfirmationDialog 
              open={showPauseConfirmation} 
              onOpenChange={(open) => !open && confirmPauseTest()}
              onConfirm={confirmPauseTest} 
            />
          </div>
        )}
      </DiagnosticController>
    </AppLayout>
  );
};

export default Diagnostico;
