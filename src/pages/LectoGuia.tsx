
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { LectoGuiaHeader } from "@/components/lectoguia/LectoGuiaHeader";
import { LectoGuiaTabs } from "@/components/lectoguia/LectoGuiaTabs";
import { useLectoGuia } from "@/hooks/use-lectoguia";
import { Toaster } from "@/components/ui/toaster";

// Componente principal de LectoGuía convertido en asistente completo
const LectoGuia = () => {
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
    handleExerciseOptionSelect,
    handleNewExercise,
    handleStartSimulation,
    skillLevels
  } = useLectoGuia();

  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col space-y-4">
          <LectoGuiaHeader />

          <LectoGuiaTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            activeSubject={activeSubject}
            onSubjectChange={handleSubjectChange}
            exercise={currentExercise}
            selectedOption={selectedOption}
            showFeedback={showFeedback}
            onOptionSelect={handleExerciseOptionSelect}
            onContinue={handleNewExercise}
            skillLevels={skillLevels}
            onStartSimulation={handleStartSimulation}
          />
        </div>
      </div>
      <Toaster />
    </AppLayout>
  );
};

export default LectoGuia;
