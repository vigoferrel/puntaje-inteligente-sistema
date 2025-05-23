
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { SubjectSelector } from "@/components/lectoguia/SubjectSelector";
import { ChatSettingsButton } from "@/components/lectoguia/chat-settings/ChatSettingsButton";
import { ContextualActionButtons } from "@/components/lectoguia/action-buttons/ContextualActionButtons";
import { LectoGuiaBreadcrumb } from './navigation/LectoGuiaBreadcrumb';
import { ConnectionMonitor } from './ConnectionMonitor';
import { NodeRecommendations } from './chat-skills/NodeRecommendations';
import { useContextualActions } from '@/hooks/lectoguia/use-contextual-actions';
import { useLectoGuia } from '@/contexts/LectoGuiaContext';
import { Skeleton } from '@/components/ui/skeleton';
import { TPAESHabilidad } from '@/types/system-types';
import { Exercise } from '@/types/ai-types';

interface ChatTabProps {
  messages: any[];
  onSendMessage: (message: string, imageData?: string) => void;
  isTyping: boolean;
  activeSubject: string;
  onSubjectChange: (subject: string) => void;
  activeSkill?: TPAESHabilidad | null;
  recommendedNodes?: any[];
  onNodeSelect?: (nodeId: string) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({ 
  messages, 
  onSendMessage, 
  isTyping,
  activeSubject,
  onSubjectChange,
  activeSkill,
  recommendedNodes = [],
  onNodeSelect
}) => {
  const { setActiveTab, handleNewExercise } = useLectoGuia();
  const [imageLoading, setImageLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [showNodeRecommendations, setShowNodeRecommendations] = useState(true);
  
  // Usar handleNewExercise del contexto que ya está implementado
  const handleExerciseRequest = async (): Promise<boolean> => {
    try {
      await handleNewExercise();
      return true;
    } catch (error) {
      console.error("Error en solicitud de ejercicio:", error);
      return false;
    }
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
  
  // Si hay una habilidad activa, añadirla a las migas de pan
  if (activeSkill) {
    breadcrumbItems.push({
      label: `Habilidad: ${activeSkill}`,
      active: true,
      onClick: () => {}
    });
  }
  
  // Manejar el envío de mensajes con carga de imágenes
  const handleSendWithImage = (message: string, imageData?: string) => {
    if (imageData) {
      setImageLoading(true);
      setTimeout(() => setImageLoading(false), 3000);
    }
    onSendMessage(message, imageData);
  };
  
  // Manejador para la selección de nodo
  const handleNodeSelected = (nodeId: string) => {
    if (onNodeSelect) {
      onNodeSelect(nodeId);
      // Ocultar las recomendaciones temporalmente después de seleccionar un nodo
      setShowNodeRecommendations(false);
      setTimeout(() => setShowNodeRecommendations(true), 5000);
    }
  };

  // Procesar ejercicios en los mensajes
  const hasExerciseInMessages = messages.some(msg => {
    if (msg.role !== 'assistant') return false;
    try {
      const content = typeof msg.content === 'string' ? msg.content : '';
      return content.includes('"question"') && 
             content.includes('"options"') && 
             content.includes('"correctAnswer"');
    } catch (e) {
      return false;
    }
  });

  // Sincronizar el estado de conexión inicial
  useEffect(() => {
    // Establecer como conectado por defecto después de un breve delay
    const timer = setTimeout(() => {
      setConnectionStatus('connected');
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="p-2 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SubjectSelector 
              activeSubject={activeSubject} 
              onSelectSubject={onSubjectChange}
            />
            <div className="text-xs text-muted-foreground">
              {connectionStatus === 'connected' && '🟢 Conectado'}
              {connectionStatus === 'connecting' && '🟡 Conectando...'}
              {connectionStatus === 'disconnected' && '🔴 Desconectado'}
            </div>
          </div>
          <ChatSettingsButton />
        </div>
        
        {/* Breadcrumbs para navegación contextual */}
        <div className="px-3 py-1.5 bg-muted/20">
          <LectoGuiaBreadcrumb items={breadcrumbItems} />
        </div>
        
        {/* Monitor de conexión - solo mostrar si hay problemas */}
        {connectionStatus !== 'connected' && (
          <div className="px-3 pt-3">
            <ConnectionMonitor onConnectionStatusChange={setConnectionStatus} />
          </div>
        )}
        
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
        
        {/* Mostrar recomendaciones de nodos si hay una habilidad activa */}
        {activeSkill && showNodeRecommendations && recommendedNodes.length > 0 && (
          <div className="px-3 pt-2">
            <NodeRecommendations 
              activeSkill={activeSkill}
              recommendedNodes={recommendedNodes}
              onNodeSelect={handleNodeSelected}
            />
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
