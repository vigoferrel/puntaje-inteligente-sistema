
import React, { useState } from "react";
import { ProgressView } from "./ProgressView";
import { LearningMapVisualization } from "./learning-map/LearningMapVisualization";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLectoGuia } from "@/contexts/LectoGuiaContext";
import { getPruebaDisplayName, TPAESPrueba } from "@/types/system-types";
import { ContextualActionButtons } from "./action-buttons/ContextualActionButtons";
import { useContextualActions } from '@/hooks/lectoguia/use-contextual-actions';
import { LectoGuiaBreadcrumb } from './navigation/LectoGuiaBreadcrumb';
import { motion } from "framer-motion";
import { BarChart3, Map } from "lucide-react";

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
  const [viewMode, setViewMode] = useState<'overview' | 'map'>('overview');
  
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
    // Convertir a string antes de pasar
    setSelectedTestId(value);
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
        const pruebaMappings: Record<TPAESPrueba, string> = {
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
          
          <div className="flex items-center gap-2">
            {/* Selector de vista */}
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'overview' | 'map')}>
              <TabsList>
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Resumen
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  Mapa Visual
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select value={selectedTestId?.toString() || "1"} onValueChange={handleTestChange}>
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
          
          {viewMode === 'overview' ? (
            <>
              {/* Sección de resumen de progreso con métricas de habilidades */}
              <motion.div variants={itemVariants}>
                <ProgressView 
                  skillLevels={skillLevels}
                  selectedPrueba={selectedPrueba} 
                  onStartSimulation={handleStartSimulation} 
                />
              </motion.div>
              
              {/* Visualización básica de habilidades y nodos */}
              <motion.div variants={itemVariants}>
                <div className="mt-8 p-4 bg-muted/20 rounded-lg border-2 border-dashed border-muted">
                  <div className="text-center space-y-2">
                    <Map className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-semibold">¿Quieres una vista más detallada?</h3>
                    <p className="text-muted-foreground">
                      Cambia al "Mapa Visual" para ver una representación interactiva completa de tu progreso
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div variants={itemVariants}>
              <LearningMapVisualization
                nodes={nodes}
                nodeProgress={nodeProgress}
                skillLevels={skillLevels}
                selectedPrueba={selectedPrueba}
                onNodeSelect={handleNodeSelection}
                className="mt-8"
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
