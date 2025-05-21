
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { QuestionView } from "./QuestionView";
import { DiagnosticQuestion, DiagnosticTest } from "@/types/diagnostic";

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
  const progress = currentTest ? ((currentQuestionIndex + 1) / currentTest.questions.length) * 100 : 0;
  
  // Calculate if we can go to next question
  const canContinue = currentQuestion ? !!answers[currentQuestion.id] : false;
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle>{currentTest?.title}</CardTitle>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Pregunta {currentQuestionIndex + 1} de {currentTest?.questions.length}
            </p>
            <p className="text-sm text-gray-500">
              {Math.round(progress)}% completado
            </p>
          </div>
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
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={onPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        
        <Button 
          onClick={onNextQuestion} 
          disabled={!canContinue}
        >
          {currentQuestionIndex === (currentTest?.questions.length || 0) - 1 ? 'Finalizar' : 'Siguiente'}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
