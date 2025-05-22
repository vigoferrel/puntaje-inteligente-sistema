
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DiagnosticoCard } from "./DiagnosticoCard";
import { DiagnosticTest } from "@/types/diagnostic";

interface DiagnosticoListProps {
  diagnostics: DiagnosticTest[];
  loading: boolean;
  selectedTestId: number | undefined;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewExercises?: (id: string) => void;
}

export const DiagnosticoList = ({ 
  diagnostics, 
  loading, 
  selectedTestId,
  onView,
  onEdit,
  onDelete,
  onViewExercises
}: DiagnosticoListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnósticos Existentes</CardTitle>
        <CardDescription>
          {selectedTestId 
            ? `Diagnósticos disponibles para el test seleccionado` 
            : 'Selecciona un tipo de test para ver los diagnósticos disponibles'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : diagnostics.length > 0 ? (
          <div className="space-y-4">
            {diagnostics.map((diagnostic) => (
              <DiagnosticoCard 
                key={diagnostic.id} 
                diagnostic={diagnostic}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewExercises={onViewExercises}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {selectedTestId 
              ? 'No hay diagnósticos disponibles para este test. Crea uno nuevo.' 
              : 'Selecciona un tipo de test para ver los diagnósticos disponibles'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
