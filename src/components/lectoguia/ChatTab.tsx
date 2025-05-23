
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { SubjectSelector } from "@/components/lectoguia/SubjectSelector";
import { ChatSettingsButton } from "@/components/lectoguia/chat-settings/ChatSettingsButton";
import { ContextualActionButtons } from "@/components/lectoguia/action-buttons/ContextualActionButtons";
import { LectoGuiaBreadcrumb } from './navigation/LectoGuiaBreadcrumb';
import { useContextualActions } from '@/hooks/lectoguia/use-contextual-actions';
import { useLectoGuia } from '@/contexts/LectoGuiaContext';
import { Skeleton } from '@/components/ui/skeleton';
import { ConnectionStatusIndicator } from '@/components/lectoguia/ConnectionStatusIndicator';

interface ChatTabProps {
  messages: any[];
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
  const { setActiveTab, connectionStatus, serviceStatus, resetConnectionStatus, showConnectionStatus } = useLectoGuia();
  const [imageLoading, setImageLoading] = useState(false);
  
  const handleExerciseRequest = async () => {
    // Simulación temporal hasta la implementación completa
    return true;
  };

  const { handleAction } = useContextualActions(setActiveTab, handleExerciseRequest);
  
  // Construir los elementos de migas de pan
  const breadcrumbItems = [
    { 
      label: 'LectoGuía', 
      active: false, 
      onClick: () => setActiveTab('chat')
    }
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
      active: true,
      onClick: () => onSubjectChange(activeSubject)
    });
  }
  
  // Manejar el envío de mensajes con carga de imágenes
  const handleSendWithImage = (message: string, imageData?: string) => {
    if (imageData) {
      setImageLoading(true);
      setTimeout(() => setImageLoading(false), 3000); // Simulación de carga de imagen
    }
    onSendMessage(message, imageData);
  };
  
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="p-2 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SubjectSelector 
              activeSubject={activeSubject} 
              onSelectSubject={onSubjectChange}
            />
            <ConnectionStatusIndicator 
              status={connectionStatus} 
              serviceStatus={serviceStatus} 
              onRetry={resetConnectionStatus}
            />
          </div>
          <ChatSettingsButton />
        </div>
        
        {/* Breadcrumbs para navegación contextual */}
        <div className="px-3 py-1.5 bg-muted/20">
          <LectoGuiaBreadcrumb items={breadcrumbItems} />
        </div>
        
        {/* Alerta de estado de conexión si es necesario */}
        <div className="px-3">
          {showConnectionStatus && showConnectionStatus()}
        </div>
        
        {/* Indicador de carga de imagen */}
        {imageLoading && (
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-md">
              <Skeleton className="w-12 h-12 rounded-md" />
              <div className="space-y-1">
                <p className="text-xs font-medium">Procesando imagen...</p>
                <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-1 w-1/2 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="h-[calc(100vh-350px)] min-h-[450px]">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendWithImage}
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
