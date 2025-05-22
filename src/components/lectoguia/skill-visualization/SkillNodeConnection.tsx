
import React, { useState } from "react";
import { TLearningNode, TPAESHabilidad, TPAESPrueba, getHabilidadDisplayName, getPruebaDisplayName } from "@/types/system-types";
import { NodeProgress } from "@/hooks/use-learning-nodes";
import { SkillRadar } from "./SkillRadar";
import { BloomTaxonomyViewer } from "./BloomTaxonomyViewer";
import { SkillHierarchyChart } from "./SkillHierarchyChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveLearningNodes } from "./ActiveLearningNodes";
import { LearningNodesByBloomLevel } from "./LearningNodesByBloomLevel";
import { TestSelector } from "./TestSelector";
import { BloomRecommendations } from "./BloomRecommendations";
import { SkillLearningPath } from "./SkillLearningPath";

interface SkillNodeConnectionProps {
  skillLevels: Record<TPAESHabilidad, number>;
  nodes?: TLearningNode[];
  nodeProgress?: Record<string, NodeProgress>;
  className?: string;
  onNodeSelect?: (nodeId: string) => void;
}

export const SkillNodeConnection = ({
  skillLevels,
  nodes = [],
  nodeProgress = {},
  className = "",
  onNodeSelect
}: SkillNodeConnectionProps) => {
  const [activeTab, setActiveTab] = useState<string>("radar");
  const [selectedTest, setSelectedTest] = useState<TPAESPrueba | undefined>(undefined);
  const [selectedTestId, setSelectedTestId] = useState<number>(1); // Default: Competencia lectora

  // Update selectedTestId when selectedTest changes
  React.useEffect(() => {
    if (selectedTest) {
      // Map the test enum to its ID
      const testIdMap: Record<TPAESPrueba, number> = {
        "COMPETENCIA_LECTORA": 1,
        "MATEMATICA_1": 2,
        "MATEMATICA_2": 3,
        "CIENCIAS": 4,
        "HISTORIA": 5
      };
      setSelectedTestId(testIdMap[selectedTest] || 1);
    }
  }, [selectedTest]);

  // Convert skill levels to format required by SkillRadar
  const skillRadarData = Object.entries(skillLevels).map(([skill, level]) => ({
    name: getHabilidadDisplayName(skill as TPAESHabilidad),
    value: Math.round(level * 100),
  }));

  // Available tests based on active nodes
  const availableTests = [...new Set(nodes.map(node => node.prueba))];

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="radar">Radar de Habilidades</TabsTrigger>
          <TabsTrigger value="bloom">Taxonomía de Bloom</TabsTrigger>
          <TabsTrigger value="hierarchy">Jerarquía de Habilidades</TabsTrigger>
          <TabsTrigger value="path">Ruta de Aprendizaje</TabsTrigger>
          <TabsTrigger value="nodes">Nodos de Aprendizaje</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <TabsContent value="radar" className="m-0">
            <SkillRadar skills={skillRadarData} title="Radar de Habilidades" />
          </TabsContent>
          
          <TabsContent value="bloom" className="m-0">
            <BloomTaxonomyViewer skillLevels={skillLevels} />
          </TabsContent>
          
          <TabsContent value="hierarchy" className="m-0">
            <div className="space-y-4">
              {/* Test selector */}
              <TestSelector 
                availableTests={availableTests}
                selectedTest={selectedTest}
                onTestSelect={setSelectedTest}
              />
              
              <SkillHierarchyChart skillLevels={skillLevels} selectedTest={selectedTest} />
            </div>
          </TabsContent>
          
          <TabsContent value="path" className="m-0">
            <div className="space-y-4">
              {/* Test selector */}
              <TestSelector 
                availableTests={availableTests}
                selectedTest={selectedTest}
                onTestSelect={setSelectedTest}
              />
              
              <SkillLearningPath 
                skillLevels={skillLevels} 
                selectedTestId={selectedTestId} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="nodes" className="m-0">
            <LearningNodesByBloomLevel 
              nodes={nodes}
              nodeProgress={nodeProgress}
            />
          </TabsContent>
          
          <TabsContent value="recommendations" className="m-0">
            <BloomRecommendations 
              skillLevels={skillLevels}
              nodes={nodes}
              nodeProgress={nodeProgress}
              onNodeSelect={onNodeSelect}
            />
          </TabsContent>
        </div>
      </Tabs>

      {(activeTab !== "nodes" && activeTab !== "recommendations" && activeTab !== "path") && (
        <ActiveLearningNodes 
          nodes={nodes}
          nodeProgress={nodeProgress}
        />
      )}
    </div>
  );
};
