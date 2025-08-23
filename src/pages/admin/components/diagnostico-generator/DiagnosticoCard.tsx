
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ListChecks, Edit, Trash2 } from "lucide-react";
import { DiagnosticTest } from "@/types/diagnostic";

interface DiagnosticoCardProps {
  diagnostic: DiagnosticTest;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewExercises?: (id: string) => void;
}

export const DiagnosticoCard = ({ 
  diagnostic,
  onView,
  onEdit,
  onDelete,
  onViewExercises
}: DiagnosticoCardProps) => {
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
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => onView && onView(diagnostic.id)}
        >
          <FileText className="mr-2 h-4 w-4" />
          Ver Detalles
        </Button>
        
        <div className="flex gap-1">
          {onViewExercises && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewExercises(diagnostic.id)}
            >
              <ListChecks className="mr-2 h-4 w-4" />
              Ver Ejercicios
            </Button>
          )}
          
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(diagnostic.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-destructive"
              onClick={() => onDelete(diagnostic.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
