
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Separator } from "@/components/ui/separator";
import { useDiagnosticoDashboard } from "./components/diagnostico-generator/useDiagnosticoDashboard";
import { DiagnosticoForm } from "./components/diagnostico-generator/DiagnosticoForm";
import { DiagnosticoStats } from "./components/diagnostico-generator/DiagnosticoStats";
import { DiagnosticoFilter } from "./components/diagnostico-generator/DiagnosticoFilter";
import { DiagnosticoTable } from "./components/diagnostico-generator/DiagnosticoTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GeneradorDiagnostico = () => {
  const {
    tests,
    diagnostics,
    loading,
    loadingTests,
    selectedTestId,
    setSelectedTestId,
    handleCreateDiagnostic,
    handleSearch,
    handleFilterByTest,
    handleResetFilters,
    handleViewDiagnostic,
    handleEditDiagnostic,
    handleDeleteDiagnostic,
    handleViewExercises,
    statsData
  } = useDiagnosticoDashboard();
  
  return (
    <AppLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard de Diagnósticos</h1>
        <p className="text-muted-foreground mb-6">
          Gestiona y monitoriza los diagnósticos de la plataforma
        </p>
        
        <DiagnosticoStats 
          diagnostics={diagnostics} 
          totalUsers={statsData.totalUsers}
          totalCompletions={statsData.totalCompletions}
          loading={loading} 
        />
        
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="list">Lista de Diagnósticos</TabsTrigger>
            <TabsTrigger value="create">Crear Diagnóstico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <DiagnosticoFilter 
              onSearch={handleSearch}
              onFilterByTest={handleFilterByTest}
              onReset={handleResetFilters}
              tests={tests.map(t => ({ id: t.id, name: t.title }))}
            />
            
            <DiagnosticoTable 
              diagnostics={diagnostics}
              loading={loading}
              onView={handleViewDiagnostic}
              onEdit={handleEditDiagnostic}
              onDelete={handleDeleteDiagnostic}
              onViewExercises={handleViewExercises}
            />
          </TabsContent>
          
          <TabsContent value="create">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <DiagnosticoForm
                  tests={tests}
                  loading={loading}
                  loadingTests={loadingTests}
                  onCreateDiagnostic={handleCreateDiagnostic}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default GeneradorDiagnostico;
