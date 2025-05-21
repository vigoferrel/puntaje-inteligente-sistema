
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DiagnosticResultsSummary } from "@/components/diagnostic/DiagnosticResultsSummary";
import { TPAESHabilidad } from "@/types/system-types";

interface TestResultViewProps {
  onRestartDiagnostic: () => void;
  results?: Record<TPAESHabilidad, number>;
}

export const TestResultView = ({ onRestartDiagnostic, results }: TestResultViewProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">¡Diagnóstico completado!</CardTitle>
        <CardDescription className="text-center">
          Gracias por completar el diagnóstico. Ahora podremos crear un plan de estudio personalizado para ti.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        {/* Show results summary if available */}
        {results && Object.keys(results).length > 0 ? (
          <DiagnosticResultsSummary results={results} />
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
            Tu plan de estudio personalizado se está generando. Dirígete al dashboard para continuar tu preparación.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onRestartDiagnostic}>
          Ver otros diagnósticos
        </Button>
        <Button onClick={() => navigate("/")}>
          Ir al dashboard
        </Button>
      </CardFooter>
    </Card>
  );
};
