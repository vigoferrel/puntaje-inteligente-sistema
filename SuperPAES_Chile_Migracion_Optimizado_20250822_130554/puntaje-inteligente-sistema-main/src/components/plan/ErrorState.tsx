/* eslint-disable react-refresh/only-export-components */

import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>No se pudo cargar el plan de estudio. Por favor, intenta de nuevo.</p>
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="w-fit flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
      </AlertDescription>
    </Alert>
  );
};

