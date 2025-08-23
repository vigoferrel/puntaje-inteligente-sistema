/* eslint-disable react-refresh/only-export-components */

import { DiagnosticTest, DiagnosticQuestion } from "../../types/diagnostic";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { QuestionView } from "./QuestionView";
import { QuestionNavigation } from "./QuestionNavigation";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { PauseIcon } from "lucide-react";

interface TestRunnerProps {
  currentTest: DiagnosticTest | null;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  showHint?: boolean;
  onAnswerSelect: (questionId: string, answer: string) => void;
  onRequestHint?: () => void;
  onPreviousQuestion: () => void;
  onNextQuestion: () => void;
  onPauseTest: () => void;
  onFinishTest: () => void;
}

export const TestRunner = ({
  currentTest,
  currentQuestionIndex,
  answers,
  showHint = false,
  onAnswerSelect,
  onRequestHint,
  onPreviousQuestion,
  onNextQuestion,
  onPauseTest,
  onFinishTest
}: TestRunnerProps) => {
  if (!currentTest) {
    return <div>No se ha seleccionado ningÃºn diagnÃ³stico.</div>;
  }

  const currentQuestion = currentTest.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentTest.questions.length - 1;
  const selectedAnswer = answers[currentQuestion?.id] || "";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{currentTest.title}</h2>
        <Button 
          variant="outline" 
          onClick={onPauseTest}
          className="flex items-center gap-2"
        >
          <PauseIcon className="h-4 w-4" />
          Pausar
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          {currentQuestion ? (
            <QuestionView 
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={onAnswerSelect}
              showHint={showHint}
              onRequestHint={onRequestHint}
            />
          ) : (
            <div>No se pudo cargar la pregunta.</div>
          )}
        </CardContent>
      </Card>

      <QuestionNavigation 
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={currentTest.questions.length}
        canContinue={!!selectedAnswer}
        onPreviousQuestion={onPreviousQuestion}
        onNextQuestion={onNextQuestion}
        onFinishTest={onFinishTest}
        isLastQuestion={isLastQuestion}
      />
    </div>
  );
};

