
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DiagnosticTest } from "@/types/diagnostic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, ListChecks } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DiagnosticoTableProps {
  diagnostics: DiagnosticTest[];
  loading: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewExercises: (id: string) => void;
}

export const DiagnosticoTable = ({
  diagnostics,
  loading,
  onView,
  onEdit,
  onDelete,
  onViewExercises
}: DiagnosticoTableProps) => {
  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Prueba</TableHead>
              <TableHead>Ejercicios</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-8 w-32 float-right" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Prueba</TableHead>
            <TableHead>Ejercicios</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diagnostics.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No hay diagnósticos disponibles con los filtros actuales
              </TableCell>
            </TableRow>
          ) : (
            diagnostics.map((diagnostic) => (
              <TableRow key={diagnostic.id}>
                <TableCell className="font-mono text-sm">
                  {diagnostic.id.substring(0, 8)}...
                </TableCell>
                <TableCell>{diagnostic.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getTestName(diagnostic.testId)}
                  </Badge>
                </TableCell>
                <TableCell>{diagnostic.questions ? diagnostic.questions.length : 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onView(diagnostic.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(diagnostic.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewExercises(diagnostic.id)}
                    >
                      <ListChecks className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive"
                      onClick={() => onDelete(diagnostic.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper function to get test name from testId
function getTestName(testId: number): string {
  const testNames: Record<number, string> = {
    1: 'Matemáticas',
    2: 'Lengua',
    3: 'Historia',
    4: 'Ciencias'
  };
  return testNames[testId] || `Prueba ${testId}`;
}
