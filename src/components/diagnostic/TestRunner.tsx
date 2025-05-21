
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionView } from "./QuestionView";
import { QuestionNavigation } from "./QuestionNavigation";
import { DiagnosticTest } from "@/types/diagnostic";
import { Button } from "@/components/ui/button";
import { PauseIcon } from "lucide-react";

interface TestRunnerProps {
  currentTest: DiagnosticTest | null;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  showHint: boolean;
  onAnswerSelect: (questionId: string, answer: string) => void;
  onRequestHint: () => void;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onPauseTest: () => void;
  onFinishTest: () => void; // Add the missing prop
}

export const TestRunner = ({ 
  currentTest,
  currentQuestionIndex,
  answers,
  showHint,
  onAnswerSelect,
  onRequestHint,
  onPreviousQuestion,
  onNextQuestion,
  onPauseTest,
  onFinishTest // Add to destructuring
}: TestRunnerProps) => {
  const currentQuestion = currentTest?.questions[currentQuestionIndex];
  
  // Calculate if we can go to next question
  const canContinue = currentQuestion ? !!answers[currentQuestion.id] : false;
  const isLastQuestion = currentTest ? 
    currentQuestionIndex === currentTest.questions.length - 1 : 
    false;
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <CardTitle>{currentTest?.title}</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onPauseTest}
              className="flex items-center gap-1 text-amber-600 hover:text-amber-700"
            >
              <PauseIcon className="h-4 w-4" /> Pausar
            </Button>
          </div>
          {currentTest && (
            <QuestionNavigation
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={currentTest.questions.length}
              canContinue={canContinue}
              onPreviousQuestion={onPreviousQuestion}
              onNextQuestion={onNextQuestion}
              onFinishTest={onFinishTest} // Pass the prop to QuestionNavigation
              isLastQuestion={isLastQuestion}
            />
          )}
        </div>
      </CardHeader>
      
      {currentQuestion && (
        <CardContent className="space-y-6">
          <QuestionView 
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id] || ""}
            onAnswerSelect={onAnswerSelect}
            showHint={showHint}
            onRequestHint={onRequestHint}
          />
        </CardContent>
      )}
      
      <CardFooter>
        <QuestionNavigation
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={currentTest?.questions.length || 0}
          canContinue={canContinue}
          onPreviousQuestion={onPreviousQuestion}
          onNextQuestion={onNextQuestion}
          onFinishTest={onFinishTest} // Pass the prop to QuestionNavigation
          isLastQuestion={isLastQuestion}
        />
      </CardFooter>
    </Card>
  );
};
