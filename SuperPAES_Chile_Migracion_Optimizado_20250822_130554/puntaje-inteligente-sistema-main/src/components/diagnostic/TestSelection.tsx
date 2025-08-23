/* eslint-disable react-refresh/only-export-components */

import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { InfoIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { DiagnosticCard } from "./DiagnosticCard";
import { DiagnosticTest } from "../../types/diagnostic";

interface TestSelectionProps {
  tests: DiagnosticTest[];
  selectedTestId: string | null;
  onTestSelect: (testId: string) => void;
  onStartTest: () => void;
}

export const TestSelection = ({
  tests,
  selectedTestId,
  onTestSelect,
  onStartTest
}: TestSelectionProps) => {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700">EvaluaciÃ³n DiagnÃ³stica</AlertTitle>
        <AlertDescription className="text-blue-700">
          Esta evaluaciÃ³n nos ayudarÃ¡ a determinar tu nivel actual de habilidades para crear un plan de estudio personalizado.
          Selecciona una de las evaluaciones disponibles para comenzar.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => (
          <DiagnosticCard 
            key={test.id}
            test={test}
            selected={selectedTestId === test.id}
            onSelect={onTestSelect}
          />
        ))}
      </div>
      
      {selectedTestId && (
        <div className="flex justify-end mt-8">
          <Button 
            onClick={onStartTest}
            className="group"
          >
            Comenzar diagnÃ³stico 
            <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
};

