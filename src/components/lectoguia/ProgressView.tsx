
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Play,
  Map,
  BarChart3
} from "lucide-react";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { SkillHierarchyChart } from "./skill-visualization/SkillHierarchyChart";
import { SkillNodeConnection } from "./skill-visualization/SkillNodeConnection";
import { LearningMapVisualization } from "./learning-map/LearningMapVisualization";
import { TestTypeSelector } from "./test-selector/TestTypeSelector";
import { TestSpecificStats } from "./test-stats/TestSpecificStats";
import { ValidationStatus } from "./validation/ValidationStatus";
import { useLectoGuia } from "@/contexts/LectoGuiaContext";
import { formatSkillLevel } from "@/utils/lectoguia-utils";

interface ProgressViewProps {
  skillLevels: Record<TPAESHabilidad, number>;
  onStartSimulation: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  skillLevels,
  onStartSimulation
}) => {
  const { 
    nodes, 
    nodeProgress, 
    selectedPrueba,
    handleNodeSelect,
    setSelectedTestId,
    validationStatus
  } = useLectoGuia();
  
  const [activeView, setActiveView] = useState('overview');

  // Función para manejar el cambio de tipo de prueba
  const handleTestChange = (newPrueba: TPAESPrueba) => {
    console.log(`🔄 ProgressView: Cambiando a ${newPrueba}`);
    
    // Mapeo de prueba a testId para compatibilidad
    const pruebaToTestId: Record<TPAESPrueba, number> = {
      'COMPETENCIA_LECTORA': 1,
      'MATEMATICA_1': 2,
      'MATEMATICA_2': 3,
      'CIENCIAS': 4,
      'HISTORIA': 5
    };
    
    const newTestId = pruebaToTestId[newPrueba];
    setSelectedTestId(newTestId);
  };

  // Obtener nodos filtrados por la prueba actual
  const filteredNodes = nodes.filter(node => node.prueba === selectedPrueba);
  
  console.log(`📊 ProgressView: Mostrando ${filteredNodes.length} nodos para ${selectedPrueba}`);
  
  // Calcular estadísticas específicas de la prueba seleccionada
  const totalSkills = Object.keys(skillLevels).length;
  const averageLevel = Object.values(skillLevels).reduce((sum, level) => sum + level, 0) / totalSkills;
  const strongSkills = Object.values(skillLevels).filter(level => level >= 0.7).length;
  const weakSkills = Object.values(skillLevels).filter(level => level < 0.4).length;

  // Obtener las mejores y peores habilidades
  const sortedSkills = Object.entries(skillLevels)
    .sort(([, a], [, b]) => b - a);
  
  const topSkills = sortedSkills.slice(0, 3);
  const weakestSkills = sortedSkills.slice(-3).reverse();

  return (
    <div className="space-y-6">
      {/* Selector de tipo de prueba */}
      <TestTypeSelector 
        selectedTest={selectedPrueba}
        onTestSelect={handleTestChange}
      />

      {/* Estado de validación */}
      {validationStatus && (
        <ValidationStatus
          isValid={validationStatus.isValid}
          issuesCount={validationStatus.issuesCount}
          currentTest={selectedPrueba}
        />
      )}

      {/* Estadísticas específicas del tipo de prueba */}
      <TestSpecificStats
        selectedPrueba={selectedPrueba}
        nodes={filteredNodes}
        nodeProgress={nodeProgress}
        skillLevels={skillLevels}
      />

      {/* Header con métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Progreso General</p>
              <p className="text-2xl font-bold text-blue-800">
                {Math.round(averageLevel * 100)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
          <Progress value={averageLevel * 100} className="mt-2 h-2" />
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Habilidades Fuertes</p>
              <p className="text-2xl font-bold text-green-800">{strongSkills}</p>
            </div>
            <Brain className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Por Mejorar</p>
              <p className="text-2xl font-bold text-yellow-800">{weakSkills}</p>
            </div>
            <BookOpen className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total Habilidades</p>
              <p className="text-2xl font-bold text-purple-800">{totalSkills}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Navegación de vistas */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Habilidades
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Mapa de Aprendizaje
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mejores habilidades */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-green-600" />
                  Mejores Habilidades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topSkills.map(([skill, level]) => (
                  <div key={skill} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{skill}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {formatSkillLevel(level)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(level * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Habilidades por mejorar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  Por Mejorar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {weakestSkills.map(([skill, level]) => (
                  <div key={skill} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{skill}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        {formatSkillLevel(level)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(level * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Botón de simulación */}
          <Card className="mt-6">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">¿Listo para una simulación?</h3>
              <p className="text-muted-foreground mb-4">
                Pon a prueba tus conocimientos con una simulación interactiva
              </p>
              <Button onClick={onStartSimulation} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Iniciar Simulación
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <div className="space-y-6">
            <SkillHierarchyChart 
              skillLevels={skillLevels}
              selectedTest={selectedPrueba}
            />
            
            <SkillNodeConnection
              skillLevels={skillLevels}
              nodes={filteredNodes}
              nodeProgress={nodeProgress}
              onNodeSelect={handleNodeSelect}
              selectedTest={selectedPrueba}
            />
          </div>
        </TabsContent>

        <TabsContent value="map" className="mt-6">
          <LearningMapVisualization
            nodes={filteredNodes}
            nodeProgress={nodeProgress}
            skillLevels={skillLevels}
            selectedPrueba={selectedPrueba}
            onNodeSelect={handleNodeSelect}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
