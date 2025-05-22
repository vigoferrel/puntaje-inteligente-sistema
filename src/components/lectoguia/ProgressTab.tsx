
import React from "react";
import { ProgressView } from "./ProgressView";
import { SkillNodeConnection } from "./skill-visualization/SkillNodeConnection";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLectoGuia } from "@/contexts/LectoGuiaContext";
import { getPruebaDisplayName } from "@/types/system-types";

interface ProgressTabProps {
  onNodeSelect?: (nodeId: string) => void;
}

export function ProgressTab({ onNodeSelect }: ProgressTabProps) {
  const {
    skillLevels,
    handleStartSimulation,
    nodes,
    nodeProgress,
    selectedTestId,
    setSelectedTestId,
    selectedPrueba
  } = useLectoGuia();

  // Manejar cambio de prueba
  const handleTestChange = (value: string) => {
    const newTestId = parseInt(value, 10);
    setSelectedTestId(newTestId);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-2xl font-bold">Tu Progreso de Aprendizaje</h2>
          
          <Select value={selectedTestId.toString()} onValueChange={handleTestChange}>
            <SelectTrigger className="w-full md:w-[240px]">
              <SelectValue placeholder="Seleccionar prueba" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Competencia Lectora</SelectItem>
              <SelectItem value="2">Matemática 1 (7° a 2° medio)</SelectItem>
              <SelectItem value="3">Matemática 2 (3° y 4° medio)</SelectItem>
              <SelectItem value="4">Ciencias</SelectItem>
              <SelectItem value="5">Historia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Sección de resumen de progreso con métricas de habilidades */}
        <ProgressView 
          skillLevels={skillLevels}
          selectedPrueba={selectedPrueba} 
          onStartSimulation={handleStartSimulation} 
        />
        
        {/* Visualización avanzada de habilidades y nodos con jerarquía de Bloom */}
        <SkillNodeConnection 
          skillLevels={skillLevels} 
          nodes={nodes}
          nodeProgress={nodeProgress}
          onNodeSelect={onNodeSelect}
          selectedTest={selectedPrueba}
          className="mt-8"
        />
      </div>
    </TooltipProvider>
  );
}
