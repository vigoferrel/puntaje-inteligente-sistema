
import React from "react";
import { DiagnosticTest } from "@/types/diagnostic";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionView } from "./QuestionView";
import { QuestionNavigation } from "./QuestionNavigation";

interface DiagnosticExecutionProps {
  test: DiagnosticTest;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  showHint: boolean;
  onAnswerSelect: (questionId: string, answer: string) => void;
  onRequestHint: () => void;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onFinishTest: () => void;
}

export const DiagnosticExecution = ({
  test,
  currentQuestionIndex,
  answers,
  showHint,
  onAnswerSelect,
  onRequestHint,
  onPreviousQuestion,
  onNextQuestion,
  onFinishTest
}: DiagnosticExecutionProps) => {
  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
  const selectedAnswer = answers[currentQuestion.id] || "";
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <QuestionView
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            showHint={showHint}
            onAnswerSelect={(answer) => onAnswerSelect(currentQuestion.id, answer)}
            onRequestHint={onRequestHint}
          />
        </CardContent>
      </Card>
      
      <QuestionNavigation
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={test.questions.length}
        canContinue={Boolean(selectedAnswer)}
        isLastQuestion={isLastQuestion}
        onPreviousQuestion={onPreviousQuestion}
        onNextQuestion={onNextQuestion}
        onFinishTest={onFinishTest}
      />
    </div>
  );
};
