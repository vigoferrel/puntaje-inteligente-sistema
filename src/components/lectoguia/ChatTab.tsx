
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { SubjectSelector } from "@/components/lectoguia/SubjectSelector";
import { ChatSettingsButton } from "@/components/lectoguia/chat-settings/ChatSettingsButton";
import { ContextualActionButtons } from "@/components/lectoguia/action-buttons/ContextualActionButtons";
import { LectoGuiaBreadcrumb } from './navigation/LectoGuiaBreadcrumb';
import { NodeRecommendations } from './chat-skills/NodeRecommendations';
import { useContextualActions } from '@/hooks/lectoguia/use-contextual-actions';
import { useLectoGuia } from '@/contexts/LectoGuiaContext';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { TPAESHabilidad } from '@/types/system-types';

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
  const { 
    setActiveTab, 
    handleNewExercise, 
    selectedPrueba, 
    nodes,
    validationStatus 
  } = useLectoGuia();
  
  const [showNodeRecommendations, setShowNodeRecommendations] = useState(true);
  
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
  
  // Obtener información de la materia actual
  const subjectDisplayNames: Record<string, string> = {
    'lectura': 'Competencia Lectora',
    'matematicas-basica': 'Matemática 1',
    'matematicas-avanzada': 'Matemática 2',
    'ciencias': 'Ciencias',
    'historia': 'Historia'
  };
  
  // Filtrar nodos por materia actual
  const currentSubjectNodes = nodes.filter(node => {
    const subjectToPruebaMap: Record<string, string> = {
      'lectura': 'COMPETENCIA_LECTORA',
      'matematicas-basica': 'MATEMATICA_1',
      'matematicas-avanzada': 'MATEMATICA_2',
      'ciencias': 'CIENCIAS',
      'historia': 'HISTORIA'
    };
    
    return node.prueba === subjectToPruebaMap[activeSubject];
  });
  
  // Construir breadcrumbs
  const breadcrumbItems = [
    { 
      label: 'LectoGuía', 
      active: false, 
      onClick: () => setActiveTab('chat')
    }
  ];
  
  if (activeSubject && activeSubject !== 'general') {
    breadcrumbItems.push({
      label: subjectDisplayNames[activeSubject] || activeSubject,
      active: true,
      onClick: () => onSubjectChange(activeSubject)
    });
  }
  
  if (activeSkill) {
    breadcrumbItems.push({
      label: `Habilidad: ${activeSkill}`,
      active: true,
      onClick: () => {}
    });
  }
  
  const handleNodeSelected = (nodeId: string) => {
    if (onNodeSelect) {
      onNodeSelect(nodeId);
      setShowNodeRecommendations(false);
      setTimeout(() => setShowNodeRecommendations(true), 5000);
    }
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        {/* Header con selector de materia */}
        <div className="p-3 border-b border-border">
          <div className="flex justify-between items-center mb-2">
            <SubjectSelector 
              activeSubject={activeSubject} 
              onSelectSubject={onSubjectChange}
            />
            <ChatSettingsButton />
          </div>
          
          {/* Indicadores de estado de la materia */}
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="secondary" className="px-2 py-1">
              {subjectDisplayNames[activeSubject]}
            </Badge>
            <Badge variant="outline" className="px-2 py-1">
              {currentSubjectNodes.length} nodos disponibles
            </Badge>
            {selectedPrueba && (
              <Badge variant="default" className="px-2 py-1">
                {selectedPrueba}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Breadcrumbs */}
        <div className="px-3 py-1.5 bg-muted/20">
          <LectoGuiaBreadcrumb items={breadcrumbItems} />
        </div>
        
        {/* Alertas de validación */}
        {!validationStatus.isValid && (
          <div className="px-3 pt-2">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Se detectaron {validationStatus.issuesCount} problemas de coherencia en los datos. 
                Algunos ejercicios podrían no corresponder exactamente a la materia seleccionada.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* Confirmación de materia activa */}
        <div className="px-3 py-2">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Materia activa:</strong> {subjectDisplayNames[activeSubject]}. 
              Todos los ejercicios y nodos se filtrarán para esta materia específicamente.
            </AlertDescription>
          </Alert>
        </div>
        
        {/* Recomendaciones de nodos */}
        {activeSkill && showNodeRecommendations && recommendedNodes.length > 0 && (
          <div className="px-3 pt-2">
            <NodeRecommendations 
              activeSkill={activeSkill}
              recommendedNodes={recommendedNodes}
              onNodeSelect={handleNodeSelected}
            />
          </div>
        )}
        
        {/* Interfaz de chat */}
        <div className="h-[calc(100vh-400px)] min-h-[400px]">
          <ChatInterface
            messages={messages}
            onSendMessage={onSendMessage}
            isTyping={isTyping}
            placeholder={`Pregunta sobre ${subjectDisplayNames[activeSubject]} o sube una imagen...`}
          />
        </div>
        
        {/* Botones de acción */}
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
