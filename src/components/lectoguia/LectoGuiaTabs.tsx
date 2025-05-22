
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatTab } from "@/components/lectoguia/ChatTab";
import { ExerciseTab } from "@/components/lectoguia/ExerciseTab";
import { ProgressTab } from "@/components/lectoguia/ProgressTab";
import { ChatMessage } from "@/components/ai/ChatInterface";
import { Exercise } from "@/types/ai-types";
import { LectoGuiaSkill } from "@/types/lectoguia-types";

interface LectoGuiaTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  // Chat props
  messages: ChatMessage[];
  onSendMessage: (message: string, imageData?: string) => void;
  isTyping: boolean;
  activeSubject: string;
  onSubjectChange: (subject: string) => void;
  // Exercise props
  exercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  onOptionSelect: (index: number) => void;
  onContinue: () => void;
  // Progress props
  skillLevels: Record<LectoGuiaSkill, number>;
  onStartSimulation: () => void;
}

export const LectoGuiaTabs: React.FC<LectoGuiaTabsProps> = ({
  activeTab,
  onTabChange,
  messages,
  onSendMessage,
  isTyping,
  activeSubject,
  onSubjectChange,
  exercise,
  selectedOption,
  showFeedback,
  onOptionSelect,
  onContinue,
  skillLevels,
  onStartSimulation
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="flex justify-between items-center">
        <TabsList className="bg-secondary/30">
          <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Chat
          </TabsTrigger>
          <TabsTrigger value="exercise" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Ejercicios
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Progreso
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="mt-4">
        <TabsContent value="chat" className="m-0">
          <ChatTab 
            messages={messages}
            onSendMessage={onSendMessage}
            isTyping={isTyping}
            activeSubject={activeSubject}
            onSubjectChange={onSubjectChange}
          />
        </TabsContent>

        <TabsContent value="exercise" className="m-0">
          <ExerciseTab
            exercise={exercise}
            selectedOption={selectedOption}
            showFeedback={showFeedback}
            onOptionSelect={onOptionSelect}
            onContinue={onContinue}
          />
        </TabsContent>

        <TabsContent value="progress" className="m-0">
          <ProgressTab 
            skillLevels={skillLevels}
            onStartSimulation={onStartSimulation}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};
