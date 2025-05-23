
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChatInterface, ChatMessage } from "@/components/ai/ChatInterface";
import { SubjectSelector } from "@/components/lectoguia/SubjectSelector";
import { ChatSettingsButton } from "@/components/lectoguia/chat-settings/ChatSettingsButton";
import { ContextualActionButtons } from "@/components/lectoguia/action-buttons/ContextualActionButtons";
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { LectoGuiaBreadcrumb } from './navigation/LectoGuiaBreadcrumb';
import { useContextualActions } from '@/hooks/lectoguia/use-contextual-actions';
import { useLectoGuia } from '@/contexts/LectoGuiaContext';
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
  const { setActiveTab } = useLectoGuia();
  const [imageLoading, setImageLoading] = useState(false);
  
  const handleExerciseRequest = async () => {
    // Simulación temporal hasta la implementación completa
    return true;
  };

  const { 
    detectSubjectFromMessage, 
    connectionStatus, 
    showConnectionStatus, 
    resetConnectionStatus,
    serviceStatus
  } = useLectoGuiaChat();
  
  const { handleAction } = useContextualActions(setActiveTab, handleExerciseRequest);
  
  // Indicador de estado de conexión
  const renderConnectionIndicator = () => {
    if (connectionStatus === 'connected' && serviceStatus === 'available') {
      return (
        <div className="flex items-center text-xs text-green-600 gap-1 px-2">
          <Wifi className="h-3 w-3" />
          <span>Conectado</span>
        </div>
      );
    } else if (connectionStatus === 'connecting') {
      return (
        <div className="flex items-center text-xs text-amber-600 gap-1 px-2">
          <RefreshCw className="h-3 w-3 animate-spin" />
          <span>Conectando...</span>
        </div>
      );
    } else {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-xs text-destructive gap-1 h-6 px-2"
          onClick={resetConnectionStatus}
        >
          <WifiOff className="h-3 w-3" />
          <span className="whitespace-nowrap">Reconectar</span>
        </Button>
      );
    }
  };
  
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
            {renderConnectionIndicator()}
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
