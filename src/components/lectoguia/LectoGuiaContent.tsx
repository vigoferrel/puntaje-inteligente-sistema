
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatTab } from "@/components/lectoguia/ChatTab";
import { ExerciseTab } from "@/components/lectoguia/ExerciseTab";
import { ProgressTab } from "@/components/lectoguia/ProgressTab";
import { useLectoGuia } from "@/contexts/LectoGuiaContext";

export const LectoGuiaContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    messages,
    isTyping,
    handleSendMessage,
    activeSubject,
    handleSubjectChange,
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    isLoading,
    handleNodeSelect
  } = useLectoGuia();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            activeSubject={activeSubject}
            onSubjectChange={handleSubjectChange}
          />
        </TabsContent>

        <TabsContent value="exercise" className="m-0">
          <ExerciseTab
            exercise={currentExercise}
            selectedOption={selectedOption}
            showFeedback={showFeedback}
            onOptionSelect={handleOptionSelect}
            onContinue={handleNewExercise}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="progress" className="m-0">
          <ProgressTab 
            onNodeSelect={handleNodeSelect}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};
