
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChatInterface, ChatMessage } from "@/components/ai/ChatInterface";
import { SubjectSelector } from "@/components/lectoguia/SubjectSelector";
import { ChatSettingsButton } from "@/components/lectoguia/chat-settings/ChatSettingsButton";
import { ContextualActionButtons } from "@/components/lectoguia/action-buttons/ContextualActionButtons";
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { LectoGuiaBreadcrumb } from './navigation/LectoGuiaBreadcrumb';
import { useContextualActions } from '@/hooks/lectoguia/use-contextual-actions';

interface ChatTabProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, imageData?: string) => void;
  isTyping: boolean;
  activeSubject: string;
  onSubjectChange: (subject: string) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({ 
  messages, 
  onSendMessage, 
  isTyping,
  activeSubject,
  onSubjectChange
}) => {
  // Esto debe venir del contexto cuando se implemente completamente
  const setActiveTab = (tab: string) => {
    // Implementación temporal hasta que se conecte con el contexto real
    console.log("Cambiando a pestaña:", tab);
  };

  const handleExerciseRequest = async () => {
    // Simulación temporal hasta la implementación completa
    return true;
  };

  const { detectSubjectFromMessage } = useLectoGuiaChat();
  const { handleAction } = useContextualActions(setActiveTab, handleExerciseRequest);
  
  // Determinar la última materia mencionada en los mensajes
  const getLastMentionedSubject = () => {
    // Recorrer mensajes del usuario desde el último
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.role === 'user' && message.content) {
        const detectedSubject = detectSubjectFromMessage(message.content);
        if (detectedSubject) return detectedSubject;
      }
    }
    return null;
  };
  
  // Construir los elementos de migas de pan
  const breadcrumbItems = [
    { label: 'LectoGuía', active: false, onClick: () => {} }
  ];
  
  // Añadir la materia activa como un elemento adicional
  if (activeSubject && activeSubject !== 'general') {
    const subjectNames: Record<string, string> = {
      'lectura': 'Comprensión Lectora',
      'matematicas-basica': 'Matemáticas (7° a 2° medio)',
      'matematicas-avanzada': 'Matemáticas (3° y 4° medio)',
      'ciencias': 'Ciencias',
      'historia': 'Historia'
    };
    
    breadcrumbItems.push({
      label: subjectNames[activeSubject] || activeSubject,
      active: true
    });
  }
  
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="p-2 border-b border-border flex justify-between items-center">
          <SubjectSelector 
            activeSubject={activeSubject} 
            onSelectSubject={onSubjectChange}
          />
          <ChatSettingsButton />
        </div>
        
        {/* Breadcrumbs para navegación contextual */}
        <div className="px-3 py-1.5 bg-muted/20">
          <LectoGuiaBreadcrumb items={breadcrumbItems} />
        </div>
        
        <div className="h-[calc(100vh-350px)] min-h-[450px]">
          <ChatInterface
            messages={messages}
            onSendMessage={onSendMessage}
            isTyping={isTyping}
            placeholder="Pregunta algo sobre cualquier materia PAES o sube una imagen para analizarla..."
          />
        </div>
        
        {/* Botones de acción contextual */}
        <div className="border-t border-border p-2">
          <ContextualActionButtons 
            context="chat"
            subject={activeSubject}
            onAction={handleAction}
            className="justify-center md:justify-start"
          />
        </div>
      </CardContent>
    </Card>
  );
};
