
import React, { useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { DiagnosticBrowser } from "@/components/diagnostic/DiagnosticBrowser";
import { DiagnosticExecution } from "@/components/diagnostic/DiagnosticExecution";
import { DiagnosticResults } from "@/components/diagnostic/DiagnosticResults";
import { DiagnosticProgressBar } from "@/components/diagnostic/DiagnosticProgressBar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useDiagnosticManager } from "@/hooks/diagnostic/use-diagnostic-manager";

export default function Diagnostico() {
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
    restart
  } = useDiagnosticManager();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
      <div className="container py-6 max-w-5xl mx-auto">
        {/* Back button */}
        {!testStarted && (
          <div className="mb-4">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Link>
            </Button>
          </div>
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
        
        {/* Main content */}
        {!testStarted && !resultSubmitted && (
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
      </div>
    </AppLayout>
  );
}
