
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { ActionType } from '@/components/lectoguia/action-buttons/ContextualActionButtons';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';

export function useContextualActions(
  setActiveTab: (tab: string) => void,
  handleExerciseRequest: () => Promise<boolean>,
) {
  const { addAssistantMessage } = useLectoGuiaChat();

  const handleAction = useCallback(async (
    action: ActionType, 
    params?: Record<string, any>
  ) => {
    console.log(`Ejecutando acción: ${action}`, params);
    
    switch (action) {
      case 'practice':
        // Solicitar un ejercicio y cambiar a la pestaña de ejercicios
        toast({
          title: "Generando ejercicio",
          description: "Preparando un ejercicio personalizado para ti..."
        });
        
        const success = await handleExerciseRequest();
        if (success) {
          toast({
            title: "¡Ejercicio listo!",
            description: "Tu ejercicio ha sido generado. ¡A practicar!"
          });
        }
        break;
        
      case 'explain':
        // Cambiar a la pestaña de chat y solicitar explicación
        setActiveTab('chat');
        
        const concept = params?.concept || '';
        const skill = params?.skill as TPAESHabilidad;
        const prueba = params?.prueba as TPAESPrueba;
        
        let message = "¿Sobre qué concepto específico te gustaría recibir una explicación?";
        
        if (concept) {
          message = `Te explico sobre "${concept}": Este concepto es fundamental para tu aprendizaje. ¿Hay algún aspecto específico que te gustaría que profundice?`;
        } else if (skill) {
          const skillNames: Record<string, string> = {
            'TRACK_LOCATE': 'localización de información en textos',
            'INTERPRET_RELATE': 'interpretación y relación de ideas',
            'EVALUATE_REFLECT': 'evaluación y reflexión crítica',
            'SOLVE_PROBLEMS': 'resolución de problemas matemáticos',
            'REPRESENT': 'representación matemática',
            'MODEL': 'modelamiento matemático',
            'ARGUE_COMMUNICATE': 'argumentación matemática',
            'IDENTIFY_THEORIES': 'identificación de teorías científicas',
            'PROCESS_ANALYZE': 'análisis de procesos científicos',
            'APPLY_PRINCIPLES': 'aplicación de principios científicos',
            'SCIENTIFIC_ARGUMENT': 'argumentación científica',
            'TEMPORAL_THINKING': 'pensamiento temporal',
            'SOURCE_ANALYSIS': 'análisis de fuentes históricas',
            'MULTICAUSAL_ANALYSIS': 'análisis multicausal',
            'CRITICAL_THINKING': 'pensamiento crítico',
            'REFLECTION': 'reflexión histórica'
          };
          
          const skillName = skillNames[skill] || skill;
          message = `Te explico sobre la habilidad de ${skillName}: Esta habilidad es clave en la PAES. ¿Qué aspectos específicos te gustaría que explique?`;
        } else if (prueba) {
          const pruebaNames: Record<string, string> = {
            'COMPETENCIA_LECTORA': 'Comprensión Lectora',
            'MATEMATICA_1': 'Matemáticas (7° a 2° medio)',
            'MATEMATICA_2': 'Matemáticas (3° y 4° medio)',
            'CIENCIAS': 'Ciencias',
            'HISTORIA': 'Historia'
          };
          
          const pruebaName = pruebaNames[prueba] || prueba;
          message = `Estoy listo para explicarte cualquier tema de ${pruebaName}. ¿Qué concepto específico te gustaría que explique?`;
        }
        
        addAssistantMessage(message);
        
        toast({
          title: "Modo explicación activado",
          description: "Pregunta cualquier concepto que quieras aprender"
        });
        break;
        
      case 'progress':
        // Cambiar a la pestaña de progreso
        setActiveTab('progress');
        toast({
          title: "Visualización de progreso",
          description: "Explora tus habilidades y avances en el mapa de aprendizaje."
        });
        break;
        
      case 'example':
        // Cambiar a la pestaña de chat y mostrar ejemplo
        setActiveTab('chat');
        addAssistantMessage("Te muestro un ejemplo práctico que te ayudará a entender mejor este concepto. Los ejemplos son una excelente forma de consolidar el aprendizaje. ¿Te gustaría ver más ejemplos o prefieres que profundice en algún aspecto específico?");
        
        toast({
          title: "Ejemplo generado",
          description: "Revisa el chat para ver el ejemplo práctico"
        });
        break;
        
      case 'related':
        // Mostrar ejercicios relacionados
        toast({
          title: "Ejercicios relacionados",
          description: "Generando ejercicios del mismo tema y habilidad..."
        });
        
        await handleExerciseRequest();
        break;
        
      default:
        console.warn(`Acción desconocida: ${action}`);
        toast({
          title: "Acción no disponible",
          description: "Esta funcionalidad estará disponible próximamente.",
          variant: "destructive"
        });
        break;
    }
  }, [setActiveTab, handleExerciseRequest, addAssistantMessage]);

  return { handleAction };
}
