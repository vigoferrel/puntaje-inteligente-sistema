
import React, { useEffect, useState } from "react";
import { ProgressView } from "./ProgressView";
import { SkillNodeConnection } from "./skill-visualization/SkillNodeConnection";
import { useLearningNodes } from "@/hooks/use-learning-nodes";
import { useAuth } from "@/contexts/AuthContext";
import { TPAESPrueba } from "@/types/system-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProgressTabProps {
  skillLevels: Record<string, number>;
  onStartSimulation: () => void;
  onNodeSelect?: (nodeId: string) => void;
}

export function ProgressTab({ skillLevels, onStartSimulation, onNodeSelect }: ProgressTabProps) {
  const { user } = useAuth();
  const [selectedTestId, setSelectedTestId] = useState<number>(1); // Default: Competencia lectora
  
  const { 
    nodes, 
    fetchLearningNodes,
    nodeProgress,
    fetchUserNodeProgress
  } = useLearningNodes();
  
  // Cargar datos de nodos y progreso al iniciar
  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        await fetchLearningNodes(selectedTestId);
        await fetchUserNodeProgress(user.id);
      }
    };
    
    loadData();
  }, [user?.id, selectedTestId, fetchLearningNodes, fetchUserNodeProgress]);

  // Manejar cambio de prueba
  const handleTestChange = (value: string) => {
    setSelectedTestId(parseInt(value, 10));
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
              <SelectItem value="2">Matemática 1</SelectItem>
              <SelectItem value="3">Matemática 2</SelectItem>
              <SelectItem value="4">Ciencias</SelectItem>
              <SelectItem value="5">Historia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Sección de resumen de progreso con métricas de habilidades */}
        <ProgressView skillLevels={skillLevels} onStartSimulation={onStartSimulation} />
        
        {/* Visualización avanzada de habilidades y nodos con jerarquía de Bloom */}
        <SkillNodeConnection 
          skillLevels={skillLevels as any} 
          nodes={nodes}
          nodeProgress={nodeProgress}
          onNodeSelect={onNodeSelect}
          className="mt-8"
        />
      </div>
    </TooltipProvider>
  );
}
