
import React from "react";
import { DiagnosticQuestion } from "@/types/diagnostic"; 
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionViewProps {
  question: DiagnosticQuestion;
  selectedAnswer: string;
  onAnswerSelect: (questionId: string, answer: string) => void;
  showHint?: boolean;
  onRequestHint?: () => void;
}

export const QuestionView = ({ 
  question, 
  selectedAnswer, 
  onAnswerSelect,
  showHint = false,
  onRequestHint
}: QuestionViewProps) => {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">{question.question}</div>
      
      <RadioGroup 
        value={selectedAnswer} 
        onValueChange={(value) => onAnswerSelect(question.id, value)}
      >
        {question.options.map((option, index) => (
          <Card 
            key={index} 
            className={`flex items-center space-x-2 p-3 rounded cursor-pointer transition-colors ${
              selectedAnswer === option ? 'bg-primary/10 border-primary' : 'hover:bg-accent'
            }`}
            onClick={() => onAnswerSelect(question.id, option)}
          >
            <RadioGroupItem value={option} id={`option-${index}`} />
            <Label 
              htmlFor={`option-${index}`} 
              className="flex-grow cursor-pointer py-1"
            >
              {option}
            </Label>
          </Card>
        ))}
      </RadioGroup>
      
      {!selectedAnswer && (
        <Alert variant="destructive" className="animate-fadeIn">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Selecciona una respuesta</AlertTitle>
          <AlertDescription>
            Debes seleccionar una respuesta para continuar.
          </AlertDescription>
        </Alert>
      )}

      {onRequestHint && !showHint && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={onRequestHint}
            className="flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" /> Necesito una pista
          </Button>
        </div>
      )}

      {showHint && question.explanation && (
        <Alert className="bg-blue-50 border-blue-200">
          <HelpCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700">Pista</AlertTitle>
          <AlertDescription className="text-blue-700">
            {question.explanation}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
