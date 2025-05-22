
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Separator } from "@/components/ui/separator";
import { useDiagnosticoGenerator } from "./components/diagnostico-generator/useDiagnosticoGenerator";
import { DiagnosticoForm } from "./components/diagnostico-generator/DiagnosticoForm";
import { DiagnosticoList } from "./components/diagnostico-generator/DiagnosticoList";

const GeneradorDiagnostico = () => {
  const {
    tests,
    diagnostics,
    loading,
    loadingTests,
    selectedTestId,
    setSelectedTestId,
    handleCreateDiagnostic
  } = useDiagnosticoGenerator();
  
  return (
    <AppLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Generador de Diagnósticos</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel izquierdo: Selección y creación */}
          <div className="lg:col-span-1">
            <DiagnosticoForm
              tests={tests}
              loading={loading}
              loadingTests={loadingTests}
              onCreateDiagnostic={handleCreateDiagnostic}
            />
          </div>
          
          {/* Panel derecho: Lista de diagnósticos */}
          <div className="lg:col-span-2">
            <DiagnosticoList
              diagnostics={diagnostics}
              loading={loading}
              selectedTestId={selectedTestId}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GeneradorDiagnostico;
