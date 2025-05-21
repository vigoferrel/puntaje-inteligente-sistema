
import React from "react";
import { DiagnosticTest } from "@/hooks/use-diagnostic";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiagnosticCardProps {
  test: DiagnosticTest;
  selected: boolean;
  onSelect: (testId: string) => void;
}

export const DiagnosticCard = ({ test, selected, onSelect }: DiagnosticCardProps) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all border-2", 
        selected ? "ring-2 ring-primary ring-offset-2 border-primary" : "",
        test.isCompleted ? "bg-green-50" : ""
      )}
      onClick={() => onSelect(test.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <ClipboardList className="w-5 h-5 mr-2 text-primary" />
            {test.title}
          </CardTitle>
          {test.isCompleted && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
        </div>
        <CardDescription className="line-clamp-2">{test.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground">
          <p>{test.questions.length} preguntas</p>
          <p className="mt-1">Tiempo estimado: {test.questions.length * 2} minutos</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={test.isCompleted ? "outline" : "default"}
          className="w-full"
        >
          {test.isCompleted ? 'Ver resultados' : 'Seleccionar'}
        </Button>
      </CardFooter>
    </Card>
  );
};
