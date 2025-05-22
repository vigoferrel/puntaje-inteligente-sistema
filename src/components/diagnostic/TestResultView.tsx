
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, InfoIcon, Home, RotateCw, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DiagnosticResultsSummary } from "@/components/diagnostic/DiagnosticResultsSummary";
import { TPAESHabilidad } from "@/types/system-types";

interface TestResultViewProps {
  onRestartDiagnostic: () => void;
  results?: Record<TPAESHabilidad, number>;
}

export const TestResultView = ({ onRestartDiagnostic, results }: TestResultViewProps) => {
  const navigate = useNavigate();
  
  // Convertir los resultados del rango 0-1 a porcentajes
  const percentageResults = results
    ? Object.entries(results).reduce((acc, [key, value]) => {
        acc[key as TPAESHabilidad] = Math.round(value * 100);
        return acc;
      }, {} as Record<TPAESHabilidad, number>)
    : undefined;
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl">¡Diagnóstico completado!</CardTitle>
        <CardDescription className="text-center">
          Gracias por completar el diagnóstico. A continuación podrás ver un análisis de tus resultados.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Show results summary if available */}
        {percentageResults && Object.keys(percentageResults).length > 0 ? (
          <DiagnosticResultsSummary results={percentageResults} />
        ) : (
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-700">Resultados pendientes</AlertTitle>
            <AlertDescription className="text-blue-700">
              Los resultados detallados de tu diagnóstico estarán disponibles en breve.
            </AlertDescription>
          </Alert>
        )}
        
        <Alert className="bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-700">Próximos pasos</AlertTitle>
          <AlertDescription className="text-blue-700">
            <p className="mb-2">Con base en tus resultados, te recomendamos:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Revisar los temas en los que obtuviste menor puntaje</li>
              <li>Utilizar los recursos de estudio personalizados</li>
              <li>Programar sesiones de práctica enfocadas en tus áreas de mejora</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
        <Button 
          variant="outline" 
          onClick={onRestartDiagnostic}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <RotateCw className="w-4 h-4" />
          Ver otros diagnósticos
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate("/plan")}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Ver plan de estudio
        </Button>
        <Button 
          onClick={() => navigate("/")}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Ir al inicio
        </Button>
      </CardFooter>
    </Card>
  );
};
