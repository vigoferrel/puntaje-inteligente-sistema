
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TestResultViewProps {
  onRestartDiagnostic: () => void;
}

export const TestResultView = ({ onRestartDiagnostic }: TestResultViewProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="max-w-2xl mx-auto">
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
