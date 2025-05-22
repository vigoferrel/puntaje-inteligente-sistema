
import React, { useState } from "react";
import { TLearningNode, TPAESHabilidad, TPAESPrueba, getHabilidadDisplayName } from "@/types/system-types";
import { NodeProgress } from "@/hooks/use-learning-nodes";
import { SkillRadar } from "./SkillRadar";
import { BloomTaxonomyViewer } from "./BloomTaxonomyViewer";
import { SkillHierarchyChart } from "./SkillHierarchyChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActiveLearningNodes } from "./ActiveLearningNodes";
import { LearningNodesByBloomLevel } from "./LearningNodesByBloomLevel";
import { TestSelector } from "./TestSelector";

interface SkillNodeConnectionProps {
  skillLevels: Record<TPAESHabilidad, number>;
  nodes?: TLearningNode[];
  nodeProgress?: Record<string, NodeProgress>;
  className?: string;
}

export const SkillNodeConnection = ({
  skillLevels,
  nodes = [],
  nodeProgress = {},
  className = "",
}: SkillNodeConnectionProps) => {
  const [activeTab, setActiveTab] = useState<string>("radar");
  const [selectedTest, setSelectedTest] = useState<TPAESPrueba | undefined>(undefined);

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
        <TabsList className="w-full justify-start">
          <TabsTrigger value="radar">Radar de Habilidades</TabsTrigger>
          <TabsTrigger value="bloom">Taxonomía de Bloom</TabsTrigger>
          <TabsTrigger value="hierarchy">Jerarquía de Habilidades</TabsTrigger>
          <TabsTrigger value="nodes">Nodos de Aprendizaje</TabsTrigger>
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
          
          <TabsContent value="nodes" className="m-0">
            <LearningNodesByBloomLevel 
              nodes={nodes}
              nodeProgress={nodeProgress}
            />
          </TabsContent>
        </div>
      </Tabs>

      {activeTab !== "nodes" && (
        <ActiveLearningNodes 
          nodes={nodes}
          nodeProgress={nodeProgress}
        />
      )}
    </div>
  );
};
