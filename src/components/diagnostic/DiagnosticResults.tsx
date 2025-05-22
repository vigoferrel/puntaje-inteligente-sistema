
import React from "react";
import { DiagnosticResult } from "@/types/diagnostic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DiagnosticResultsSummary } from "./DiagnosticResultsSummary";
import { DiagnosticResultRadar } from "./SkillRadarChart";
import { DetailedResultView } from "./DetailedResultView";
import { BarChart3, ArrowRight } from "lucide-react";

interface DiagnosticResultsProps {
  results: DiagnosticResult;
  onRestart: () => void;
}

export const DiagnosticResults = ({
  results,
  onRestart
}: DiagnosticResultsProps) => {
  // Verificar que results exista antes de mostrar el contenido
  if (!results) {
    return (
      <Card className="text-center p-6">
        <CardTitle className="mb-4">No se encontraron resultados</CardTitle>
        <CardDescription>
          Ocurrió un error al procesar los resultados. Por favor, intenta realizar el diagnóstico nuevamente.
        </CardDescription>
        <Button onClick={onRestart} className="mt-4">Intentar nuevamente</Button>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-lg shadow-lg text-white">
        <div className="mb-4 flex items-center">
          <BarChart3 className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold">Resultados del diagnóstico</h1>
        </div>
        <p className="text-lg max-w-2xl">
          Hemos evaluado tu nivel de habilidades en base a tus respuestas.
          A continuación te mostramos los resultados detallados.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pasamos el objeto results.results (Record<TPAESHabilidad, number>) al componente DiagnosticResultsSummary */}
        <DiagnosticResultsSummary results={results.results} />
        
        <Card>
          <CardHeader>
            <CardTitle>Perfil de habilidades</CardTitle>
            <CardDescription>
              Visualización de tus niveles en las diferentes habilidades evaluadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* DiagnosticResultRadar acepta el objeto DiagnosticResult completo */}
            <DiagnosticResultRadar results={results} />
          </CardContent>
        </Card>
      </div>
      
      <DetailedResultView results={results} />
      
      <Card>
        <CardHeader>
          <CardTitle>¿Qué sigue?</CardTitle>
          <CardDescription>
            Con base en tu diagnóstico, te recomendamos estos pasos a seguir
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Tu plan de estudio ha sido actualizado según los resultados de este diagnóstico.
            Te recomendamos explorar los contenidos sugeridos y continuar con tu preparación.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onRestart}>
            Repetir diagnóstico
          </Button>
          <Button asChild className="group">
            <a href="/plan">
              Ver plan personalizado
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
