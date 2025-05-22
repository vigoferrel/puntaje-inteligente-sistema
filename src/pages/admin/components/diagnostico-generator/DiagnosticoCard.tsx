
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ListChecks } from "lucide-react";
import { DiagnosticTest } from "@/types/diagnostic";

interface DiagnosticoCardProps {
  diagnostic: DiagnosticTest;
}

export const DiagnosticoCard = ({ diagnostic }: DiagnosticoCardProps) => {
  return (
    <Card key={diagnostic.id} className="bg-background/50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{diagnostic.title}</CardTitle>
          <Badge variant="outline">
            {diagnostic.questions ? diagnostic.questions.length : 0} ejercicios
          </Badge>
        </div>
        <CardDescription>
          {diagnostic.description || 'Sin descripción'}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="secondary" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Ver Detalles
        </Button>
        <Button variant="outline" size="sm">
          <ListChecks className="mr-2 h-4 w-4" />
          Ver Ejercicios
        </Button>
      </CardFooter>
    </Card>
  );
};
