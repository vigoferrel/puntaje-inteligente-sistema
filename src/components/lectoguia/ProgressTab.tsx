
import React, { useState } from "react";
import { ProgressView } from "./ProgressView";
import { SkillNodeConnection } from "./skill-visualization/SkillNodeConnection";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLectoGuia } from "@/contexts/LectoGuiaContext";
import { getPruebaDisplayName } from "@/types/system-types";
import { ContextualActionButtons } from "./action-buttons/ContextualActionButtons";
import { useContextualActions } from '@/hooks/lectoguia/use-contextual-actions';
import { LectoGuiaBreadcrumb } from './navigation/LectoGuiaBreadcrumb';
import { motion } from "framer-motion";

interface ProgressTabProps {
  onNodeSelect?: (nodeId: string) => void;
}

// Variantes de animación para el contenido
const contentVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      delay: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

export function ProgressTab({ onNodeSelect }: ProgressTabProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  
  const {
    skillLevels,
    handleStartSimulation,
    nodes,
    nodeProgress,
    selectedTestId,
    setSelectedTestId,
    selectedPrueba,
    setActiveTab
  } = useLectoGuia();

  const handleExerciseRequest = async () => {
    // Simulación temporal hasta la implementación completa
    return true;
  };
  
  const { handleAction } = useContextualActions(setActiveTab, handleExerciseRequest);
  
  // Manejar cambio de prueba
  const handleTestChange = (value: string) => {
    const newTestId = parseInt(value, 10);
    setSelectedTestId(newTestId);
    setSelectedSkill(null); // Resetear la habilidad seleccionada al cambiar de prueba
  };
  
  // Manejar la selección de un nodo
  const handleNodeSelection = (nodeId: string) => {
    // Encontrar el nodo seleccionado para obtener sus datos
    const selectedNode = nodes.find(node => node.id === nodeId);
    
    if (selectedNode && onNodeSelect) {
      setSelectedSkill(selectedNode.skill || null);
      onNodeSelect(nodeId);
    }
  };
  
  // Construir los elementos de migas de pan
  const breadcrumbItems = [
    { 
      label: 'LectoGuía', 
      active: false, 
      onClick: () => setActiveTab('chat') 
    },
    { 
      label: 'Progreso', 
      active: true,
      onClick: () => setActiveTab('progress')
    }
  ];
  
  // Si hay una prueba seleccionada, añadirla como un elemento adicional
  if (selectedPrueba) {
    breadcrumbItems.splice(1, 0, {
      label: getPruebaDisplayName(selectedPrueba),
      active: false,
      onClick: () => {
        // Mapear la prueba a la materia correspondiente
        const pruebaMappings: Record<string, string> = {
          'COMPETENCIA_LECTORA': 'lectura',
          'MATEMATICA_1': 'matematicas-basica',
          'MATEMATICA_2': 'matematicas-avanzada',
          'CIENCIAS': 'ciencias',
          'HISTORIA': 'historia'
        };
        
        // Navegar al chat para esta prueba
        setActiveTab('chat');
        // La actualización de la materia se hará a través del contexto
      }
    });
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Tu Progreso de Aprendizaje</h2>
            
            {/* Breadcrumbs para navegación contextual */}
            <div className="mt-1">
              <LectoGuiaBreadcrumb items={breadcrumbItems} />
            </div>
          </div>
          
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
        
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Botones de acción contextual */}
          <motion.div variants={itemVariants}>
            <ContextualActionButtons 
              context="progress"
              skill={selectedSkill as any}
              prueba={selectedPrueba}
              onAction={handleAction}
            />
          </motion.div>
          
          {/* Sección de resumen de progreso con métricas de habilidades */}
          <motion.div variants={itemVariants}>
            <ProgressView 
              skillLevels={skillLevels}
              selectedPrueba={selectedPrueba} 
              onStartSimulation={handleStartSimulation} 
            />
          </motion.div>
          
          {/* Visualización avanzada de habilidades y nodos con jerarquía de Bloom */}
          <motion.div variants={itemVariants}>
            <SkillNodeConnection 
              skillLevels={skillLevels} 
              nodes={nodes}
              nodeProgress={nodeProgress}
              onNodeSelect={handleNodeSelection}
              selectedTest={selectedPrueba}
              className="mt-8"
            />
          </motion.div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
