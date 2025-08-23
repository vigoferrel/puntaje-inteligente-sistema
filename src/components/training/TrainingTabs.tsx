
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalizedTraining } from './PersonalizedTraining';
import { SimulationTraining } from './SimulationTraining';
import { GuidedTraining } from './GuidedTraining';
import { Brain, GamepadIcon, MapPin } from 'lucide-react';

interface TrainingTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TrainingTabs: React.FC<TrainingTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
        <TabsTrigger 
          value="personalizado" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
        >
          <Brain className="h-4 w-4" />
          Personalizado
        </TabsTrigger>
        <TabsTrigger 
          value="simulacion"
          className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
        >
                          <GamepadIcon className="h-4 w-4" />
          Simulación
        </TabsTrigger>
        <TabsTrigger 
          value="dirigido"
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          Dirigido
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="personalizado" className="mt-6">
        <PersonalizedTraining />
      </TabsContent>
      
      <TabsContent value="simulacion" className="mt-6">
        <SimulationTraining />
      </TabsContent>
      
      <TabsContent value="dirigido" className="mt-6">
        <GuidedTraining />
      </TabsContent>
    </Tabs>
  );
};
