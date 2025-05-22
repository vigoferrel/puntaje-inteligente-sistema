
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface DiagnosticErrorViewProps {
  error?: string;
  message?: string;
  onRetry: () => void;
}

export const DiagnosticErrorView = ({
  error = "Se produjo un error al cargar los diagnósticos",
  message = "Por favor, intenta nuevamente más tarde o contacta con soporte si el problema persiste.",
  onRetry
}: DiagnosticErrorViewProps) => {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Error en el diagnóstico
        </CardTitle>
        <CardDescription>{error}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
      </CardFooter>
    </Card>
  );
};
