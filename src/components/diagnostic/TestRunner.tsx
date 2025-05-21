
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionView } from "./QuestionView";
import { QuestionNavigation } from "./QuestionNavigation";
import { DiagnosticTest } from "@/types/diagnostic";

interface TestRunnerProps {
  currentTest: DiagnosticTest | null;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  showHint: boolean;
  onAnswerSelect: (questionId: string, answer: string) => void;
  onRequestHint: () => void;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
}

export const TestRunner = ({ 
  currentTest,
  currentQuestionIndex,
  answers,
  showHint,
  onAnswerSelect,
  onRequestHint,
  onPreviousQuestion,
  onNextQuestion
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
          <CardTitle>{currentTest?.title}</CardTitle>
          {currentTest && (
            <QuestionNavigation
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={currentTest.questions.length}
              canContinue={canContinue}
              onPreviousQuestion={onPreviousQuestion}
              onNextQuestion={onNextQuestion}
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
          isLastQuestion={isLastQuestion}
        />
      </CardFooter>
    </Card>
  );
};
