/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ChatTab } from "../../components/lectoguia/ChatTab";
import { ExerciseTab } from "../../components/lectoguia/ExerciseTab";
import { ProgressTab } from "../../components/lectoguia/ProgressTab";
import { ChatMessage } from "../../components/ai/ChatInterface";
import { Exercise } from "../../types/ai-types";
import { motion } from "framer-motion";

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
  isLoading?: boolean;
  // Node selection
  onNodeSelect?: (nodeId: string) => Promise<boolean>;
}

// Variantes de animaciÃ³n para las transiciones entre pestaÃ±as
const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export const LectoGuiaTabs: FC<LectoGuiaTabsProps> = ({
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
  isLoading = false,
  onNodeSelect
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
          <motion.div
            initial="hidden"
            animate="visible"
            variants={tabVariants}
          >
            <ChatTab 
              messages={messages}
              onSendMessage={onSendMessage}
              isTyping={isTyping}
              activeSubject={activeSubject}
              onSubjectChange={onSubjectChange}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="exercise" className="m-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={tabVariants}
          >
            <ExerciseTab
              exercise={exercise}
              selectedOption={selectedOption}
              showFeedback={showFeedback}
              onOptionSelect={onOptionSelect}
              onContinue={onContinue}
              isLoading={isLoading}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="progress" className="m-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={tabVariants}
          >
            <ProgressTab 
              onNodeSelect={onNodeSelect || (async () => false)}
            />
          </motion.div>
        </TabsContent>
      </div>
    </Tabs>
  );
};

