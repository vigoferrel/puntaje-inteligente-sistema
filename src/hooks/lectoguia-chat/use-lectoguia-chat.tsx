
import { useState, useCallback, useEffect } from 'react';
import { useChatMessages } from './use-chat-messages';
import { useImageProcessing } from './use-image-processing';
import { useSubjectDetection } from './subject-detection';
import { ConnectionStatus } from '@/hooks/use-openrouter';
import { ERROR_RATE_LIMIT_MESSAGE } from './types';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircleWarning, Brain } from 'lucide-react';
import { openRouterService } from '@/services/openrouter/core';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { supabase } from '@/integrations/supabase/client';
import { Exercise } from '@/types/ai-types';

// Define connection status type to match what's expected from use-openrouter
type LectoGuiaConnectionStatus = ConnectionStatus;

interface ChatState {
  messages: any[];
  isTyping: boolean;
  activeSubject: string;
  serviceStatus: 'available' | 'degraded' | 'unavailable';
  connectionStatus: LectoGuiaConnectionStatus;
  activeSkill?: TPAESHabilidad | null;
  recommendedNodes: any[];
}

interface ChatActions {
  processUserMessage: (content: string, imageData?: string) => Promise<string | null>;
  resetConnectionStatus: () => void;
  showConnectionStatus: () => React.ReactNode | null;
  setActiveSubject: (subject: string) => void;
  addAssistantMessage: (content: string) => any;
  changeSubject: (subject: string) => void;
  detectSubjectFromMessage: (message: string) => string | null;
  generateExerciseForNode: (nodeId: string) => Promise<Exercise | null>;
  generateExerciseForSkill: (skill: TPAESHabilidad) => Promise<Exercise | null>;
  setActiveSkill: (skill: TPAESHabilidad | null) => void;
  updateNodeProgress: (nodeId: string, progress: number) => Promise<boolean>;
  updateSkillLevel: (skill: TPAESHabilidad, isCorrect: boolean) => Promise<boolean>;
}

// Helper to extract exercise JSON from AI response
const extractExerciseFromResponse = (response: string): Exercise | null => {
  try {
    // Try to extract JSON enclosed in ```json and ```
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    
    // Try to extract JSON enclosed in { and }
    const jsonObjectMatch = response.match(/{[\s\S]*"question"[\s\S]*"options"[\s\S]*}/);
    if (jsonObjectMatch) {
      return JSON.parse(jsonObjectMatch[0]);
    }
    
    return null;
  } catch (error) {
    console.error("Failed to extract exercise JSON:", error);
    return null;
  }
};

export function useLectoGuiaChat(): ChatState & ChatActions {
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubject, setActiveSubject] = useState('general');
  const [serviceStatus, setServiceStatus] = useState<'available' | 'degraded' | 'unavailable'>('available');
  const [connectionStatus, setConnectionStatus] = useState<LectoGuiaConnectionStatus>('connected');
  const [activeSkill, setActiveSkill] = useState<TPAESHabilidad | null>(null);
  const [recommendedNodes, setRecommendedNodes] = useState<any[]>([]);
  
  const { messages, addUserMessage, addAssistantMessage, getRecentMessages } = useChatMessages();
  const { handleImageProcessing, processImage } = useImageProcessing();
  const { detectSubject } = useSubjectDetection();
  
  // Cargar nodos recomendados para la materia activa
  useEffect(() => {
    const fetchRecommendedNodes = async () => {
      if (!activeSubject) return;
      
      try {
        // Mapear la materia activa a un test_id
        const testId = activeSubject === 'lectura' ? 1 : 
                       activeSubject === 'matematicas-basica' ? 2 :
                       activeSubject === 'matematicas-avanzada' ? 3 :
                       activeSubject === 'ciencias' ? 4 :
                       activeSubject === 'historia' ? 5 : 1;
                       
        const { data, error } = await supabase
          .from('learning_nodes')
          .select(`
            id, title, description, difficulty, skill_id,
            skill:paes_skills(id, name, code)
          `)
          .eq('test_id', testId)
          .limit(5);
          
        if (error) {
          console.error("Error fetching recommended nodes:", error);
          return;
        }
        
        setRecommendedNodes(data || []);
      } catch (error) {
        console.error("Error in fetchRecommendedNodes:", error);
      }
    };
    
    fetchRecommendedNodes();
  }, [activeSubject]);
  
  // Estado para mostrar el estado de conexión
  const showConnectionStatus = useCallback(() => {
    if (connectionStatus === 'disconnected') {
      return (
        <Alert variant="destructive">
          <MessageCircleWarning className="h-4 w-4" />
          <AlertDescription>
            No se pudo conectar con el servicio. Por favor, revisa tu conexión a internet e inténtalo de nuevo.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }, [connectionStatus]);
  
  // Resetear el estado de conexión
  const resetConnectionStatus = useCallback(() => {
    setConnectionStatus('connecting');
    setServiceStatus('available');
    
    // Verificar conexión después de un breve delay
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 1000);
  }, []);
  
  // Function to change the subject
  const changeSubject = useCallback((subject: string) => {
    setActiveSubject(subject);
  }, []);
  
  // Function to detect subject from message
  const detectSubjectFromMessage = useCallback((message: string): string | null => {
    return detectSubject(message);
  }, [detectSubject]);
  
  // Actualizar nivel de habilidad usando user_exercise_attempts en lugar de user_skill_levels
  const updateSkillLevel = useCallback(async (skill: TPAESHabilidad, isCorrect: boolean): Promise<boolean> => {
    try {
      // Obtener usuario actual
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return false;
      
      // Insertar un nuevo intento de ejercicio para reflejar el nivel de habilidad
      const { error } = await supabase
        .from('user_exercise_attempts')
        .insert({
          user_id: user.user.id,
          exercise_id: `skill-update-${Date.now()}`,
          answer: isCorrect ? 'correct' : 'incorrect',
          is_correct: isCorrect,
          skill_demonstrated: skill,
          created_at: new Date().toISOString()
        });
        
      if (error) {
        console.error("Error al actualizar nivel de habilidad:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error en updateSkillLevel:", error);
      return false;
    }
  }, []);
  
  // Actualizar progreso de un nodo
  const updateNodeProgress = useCallback(async (nodeId: string, progress: number): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return false;
      
      // Verificar si ya existe un progreso para este nodo
      const { data: existingProgress } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('node_id', nodeId)
        .maybeSingle();
        
      if (existingProgress) {
        // Actualizar progreso existente
        const newProgress = Math.min(1, Math.max(existingProgress.progress, progress));
        const newStatus = newProgress >= 1 ? 'completed' : 'in_progress';
        
        await supabase
          .from('user_node_progress')
          .update({ 
            progress: newProgress, 
            status: newStatus,
            time_spent_minutes: existingProgress.time_spent_minutes + 5
          })
          .eq('id', existingProgress.id);
      } else {
        // Crear nuevo progreso
        const status = progress >= 1 ? 'completed' : 'in_progress';
        
        await supabase
          .from('user_node_progress')
          .insert({
            user_id: user.user.id,
            node_id: nodeId,
            progress: progress,
            status: status,
            time_spent_minutes: 5
          });
      }
      
      return true;
    } catch (error) {
      console.error("Error al actualizar progreso del nodo:", error);
      return false;
    }
  }, []);
  
  // Generar ejercicio para un nodo específico
  const generateExerciseForNode = useCallback(async (nodeId: string): Promise<Exercise | null> => {
    try {
      setIsTyping(true);
      
      // Obtener información del nodo
      const { data: node, error } = await supabase
        .from('learning_nodes')
        .select(`
          id, title, description, difficulty,
          skill:paes_skills(id, name, code),
          test:paes_tests(id, name, code)
        `)
        .eq('id', nodeId)
        .single();
        
      if (error || !node) {
        console.error("Error al obtener información del nodo:", error);
        toast({
          title: "Error",
          description: "No se pudo obtener información del nodo para generar el ejercicio.",
          variant: "destructive"
        });
        return null;
      }
      
      // Sistema y mensaje para generar un ejercicio para este nodo
      const systemPrompt = `Eres un generador especializado de ejercicios PAES para el nodo "${node.title}" 
      con habilidad ${node.skill?.code || 'INTERPRET_RELATE'} y dificultad ${node.difficulty}.
      Genera un ejercicio de opción múltiple con 4 alternativas que evalúe específicamente esta habilidad.
      Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
      {
        "id": "${nodeId}",
        "nodeId": "${nodeId}",
        "nodeName": "${node.title}",
        "prueba": "${node.test?.code || 'COMPETENCIA_LECTORA'}",
        "skill": "${node.skill?.code || 'INTERPRET_RELATE'}",
        "difficulty": "${node.difficulty}",
        "question": "El enunciado completo del ejercicio con contexto",
        "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
        "correctAnswer": "La alternativa correcta exactamente como aparece en options",
        "explanation": "Explicación detallada de por qué la respuesta es correcta y análisis de las incorrectas"
      }
      `;
      
      const userPrompt = `Genera un ejercicio para el nodo "${node.title}".
      Es muy importante que devuelvas SOLO el objeto JSON sin ningún otro texto adicional.`;
      
      const response = await openRouterService({
        action: 'provide_feedback',
        payload: {
          message: userPrompt,
          systemPrompt: systemPrompt,
          context: `node:${nodeId}`,
          subject: activeSubject
        }
      });
      
      if (!response) {
        throw new Error("No se recibió respuesta del servicio");
      }
      
      // Intentar extraer el ejercicio como JSON
      const responseStr = typeof response === 'string' 
        ? response 
        : (response as any)?.response || JSON.stringify(response);
      
      let exercise = extractExerciseFromResponse(responseStr);
      
      // Si no se pudo extraer JSON, crear un ejercicio básico
      if (!exercise) {
        exercise = {
          id: nodeId,
          nodeId: nodeId,
          nodeName: node.title,
          prueba: node.test?.code || 'COMPETENCIA_LECTORA',
          skill: node.skill?.code || 'INTERPRET_RELATE',
          difficulty: node.difficulty,
          question: responseStr.length > 200 
            ? responseStr.substring(0, 200) + '...' 
            : responseStr,
          options: [
            "Alternativa A", 
            "Alternativa B", 
            "Alternativa C", 
            "Alternativa D"
          ],
          correctAnswer: "Alternativa A",
          explanation: "Por favor selecciona una alternativa para recibir retroalimentación."
        };
      }
      
      // Actualizar progreso del nodo
      await updateNodeProgress(nodeId, 0.3);
      
      return exercise;
    } catch (error) {
      console.error("Error generando ejercicio para nodo:", error);
      return null;
    } finally {
      setIsTyping(false);
    }
  }, [activeSubject, updateNodeProgress]);
  
  // Generar ejercicio para una habilidad específica
  const generateExerciseForSkill = useCallback(async (skill: TPAESHabilidad): Promise<Exercise | null> => {
    try {
      setIsTyping(true);
      
      // Mapear la habilidad a una prueba
      const prueba: Record<TPAESHabilidad, TPAESPrueba> = {
        'TRACK_LOCATE': 'COMPETENCIA_LECTORA',
        'INTERPRET_RELATE': 'COMPETENCIA_LECTORA',
        'EVALUATE_REFLECT': 'COMPETENCIA_LECTORA',
        'SOLVE_PROBLEMS': 'MATEMATICA_1',
        'REPRESENT': 'MATEMATICA_1',
        'MODEL': 'MATEMATICA_1',
        'ARGUE_COMMUNICATE': 'MATEMATICA_2',
        'IDENTIFY_THEORIES': 'CIENCIAS',
        'PROCESS_ANALYZE': 'CIENCIAS',
        'APPLY_PRINCIPLES': 'CIENCIAS',
        'SCIENTIFIC_ARGUMENT': 'CIENCIAS',
        'TEMPORAL_THINKING': 'HISTORIA',
        'SOURCE_ANALYSIS': 'HISTORIA',
        'MULTICAUSAL_ANALYSIS': 'HISTORIA',
        'CRITICAL_THINKING': 'HISTORIA',
        'REFLECTION': 'HISTORIA'
      };
      
      // Sistema y mensaje para generar un ejercicio para esta habilidad
      const systemPrompt = `Eres un generador especializado de ejercicios PAES para la habilidad ${skill}
      en la prueba ${prueba[skill] || 'COMPETENCIA_LECTORA'}.
      Genera un ejercicio de opción múltiple con 4 alternativas que evalúe específicamente esta habilidad.
      Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
      {
        "id": "${Date.now()}",
        "nodeId": "",
        "nodeName": "Ejercicio de ${skill}",
        "prueba": "${prueba[skill] || 'COMPETENCIA_LECTORA'}",
        "skill": "${skill}",
        "difficulty": "INTERMEDIATE",
        "question": "El enunciado completo del ejercicio con contexto",
        "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
        "correctAnswer": "La alternativa correcta exactamente como aparece en options",
        "explanation": "Explicación detallada de por qué la respuesta es correcta y análisis de las incorrectas"
      }
      `;
      
      const userPrompt = `Genera un ejercicio para practicar la habilidad ${skill}.
      Es muy importante que devuelvas SOLO el objeto JSON sin ningún otro texto adicional.`;
      
      const response = await openRouterService({
        action: 'provide_feedback',
        payload: {
          message: userPrompt,
          systemPrompt: systemPrompt,
          context: `skill:${skill}`,
          subject: activeSubject
        }
      });
      
      if (!response) {
        throw new Error("No se recibió respuesta del servicio");
      }
      
      // Intentar extraer el ejercicio como JSON
      const responseStr = typeof response === 'string' 
        ? response 
        : (response as any)?.response || JSON.stringify(response);
      
      let exercise = extractExerciseFromResponse(responseStr);
      
      // Si no se pudo extraer JSON, crear un ejercicio básico
      if (!exercise) {
        exercise = {
          id: `skill-${Date.now()}`,
          nodeId: "",
          nodeName: `Ejercicio de ${skill}`,
          prueba: prueba[skill] || 'COMPETENCIA_LECTORA',
          skill: skill,
          difficulty: "INTERMEDIATE",
          question: responseStr.length > 200 
            ? responseStr.substring(0, 200) + '...' 
            : responseStr,
          options: [
            "Alternativa A", 
            "Alternativa B", 
            "Alternativa C", 
            "Alternativa D"
          ],
          correctAnswer: "Alternativa A",
          explanation: "Por favor selecciona una alternativa para recibir retroalimentación."
        };
      }
      
      return exercise;
    } catch (error) {
      console.error("Error generando ejercicio para habilidad:", error);
      return null;
    } finally {
      setIsTyping(false);
    }
  }, [activeSubject]);
  
  // Función principal para procesar los mensajes del usuario usando openRouterService
  const processUserMessage = useCallback(async (content: string, imageData?: string): Promise<string | null> => {
    setIsTyping(true);
    setConnectionStatus('connecting');
    
    try {
      console.log('LectoGuía: Procesando mensaje del usuario:', content.substring(0, 100) + '...');
      
      // Primero, añadir el mensaje del usuario a la conversación
      addUserMessage(content, imageData);
      
      let assistantResponse = '';
      
      // Si hay una imagen, procesarla primero
      if (imageData) {
        console.log('LectoGuía: Procesando imagen adjunta');
        const imageAnalysisResult = await processImage(imageData);
        assistantResponse += imageAnalysisResult.response || '';
      }
      
      // Detectar si se solicita un ejercicio para un nodo
      const nodeIdMatch = content.match(/nodo:([a-f0-9-]+)/i);
      if (nodeIdMatch && nodeIdMatch[1]) {
        const nodeId = nodeIdMatch[1];
        const exercise = await generateExerciseForNode(nodeId);
        
        if (exercise) {
          assistantResponse = JSON.stringify(exercise);
          addAssistantMessage(assistantResponse);
          return assistantResponse;
        }
      }
      
      // Detectar si se solicita un ejercicio para una habilidad
      const skillMatch = content.match(/habilidad:(TRACK_LOCATE|INTERPRET_RELATE|EVALUATE_REFLECT|SOLVE_PROBLEMS|REPRESENT|MODEL|ARGUE_COMMUNICATE|IDENTIFY_THEORIES|PROCESS_ANALYZE|APPLY_PRINCIPLES|SCIENTIFIC_ARGUMENT|TEMPORAL_THINKING|SOURCE_ANALYSIS|MULTICAUSAL_ANALYSIS|CRITICAL_THINKING|REFLECTION)/i);
      if (skillMatch && skillMatch[1]) {
        const skill = skillMatch[1] as TPAESHabilidad;
        const exercise = await generateExerciseForSkill(skill);
        
        if (exercise) {
          assistantResponse = JSON.stringify(exercise);
          addAssistantMessage(assistantResponse);
          return assistantResponse;
        }
      }
      
      // Detectar intención de ejercicio genérico
      const isExerciseRequest = content.toLowerCase().includes("ejercicio") || 
                               content.toLowerCase().includes("practica") ||
                               content.toLowerCase().includes("prueba") ||
                               content.toLowerCase().includes("evalua");
                               
      if (isExerciseRequest && !assistantResponse) {
        // Intentar determinar la habilidad más apropiada para el ejercicio
        let skill: TPAESHabilidad = 'INTERPRET_RELATE'; // Default
        
        if (activeSubject === 'matematicas-basica' || activeSubject === 'matematicas-avanzada') {
          skill = 'SOLVE_PROBLEMS';
        } else if (activeSubject === 'ciencias') {
          skill = 'IDENTIFY_THEORIES';
        } else if (activeSubject === 'historia') {
          skill = 'SOURCE_ANALYSIS';
        }
        
        setActiveSkill(skill);
        
        // Generar mensaje indicando que se está generando un ejercicio
        addAssistantMessage("Generando un ejercicio para practicar la habilidad " + skill + "...");
        
        const exercise = await generateExerciseForSkill(skill);
        if (exercise) {
          assistantResponse = JSON.stringify(exercise);
          addAssistantMessage(assistantResponse);
          return assistantResponse;
        }
      }
      
      // Crear el contexto para LectoGuía
      const systemPrompt = `Eres LectoGuía, un asistente especializado en ayudar a estudiantes chilenos con la preparación para la PAES (Prueba de Acceso a la Educación Superior).

Especialidades:
- Comprensión Lectora: Análisis de textos, interpretación, localización de información
- Matemáticas Básica (7° a 2° medio): Aritmética, geometría, álgebra básica
- Matemáticas Avanzada (3° y 4° medio): Funciones, probabilidades, estadística
- Ciencias: Biología, física, química aplicadas a la PAES
- Historia: Historia de Chile y universal, geografía, educación cívica

Materia activa: ${activeSubject}

Instrucciones:
1. Responde siempre en español chileno
2. Adapta tu nivel al estudiante
3. Usa ejemplos relevantes para Chile
4. Si te piden ejercicios, genera preguntas tipo PAES
5. Mantén un tono amigable y motivador
6. Si la consulta no es educativa, redirige gentilmente al tema de estudios
7. Si identificas que el estudiante está practicando una habilidad específica, menciónala y sugiérele nodos para mejorarla`;

      // Asegurar que el mensaje tenga contenido
      const userMessageContent = content || "Hola, necesito ayuda con mis estudios";

      console.log('LectoGuía: Enviando solicitud a OpenRouter');
      
      // Enviar la solicitud con un formato consistente
      const response = await openRouterService({
        action: 'provide_feedback',
        payload: {
          message: userMessageContent,          // Parámetro principal esperado por el backend
          userMessage: userMessageContent,      // Parámetro alternativo para compatibilidad
          content: userMessageContent,          // Otra variante para compatibilidad
          systemPrompt: systemPrompt,       // Instrucciones del sistema
          subject: activeSubject,           // Materia activa
          context: `subject:${activeSubject}`, // Contexto formateado
          history: getRecentMessages().slice(-6) // Últimos 6 mensajes para contexto
        }
      });
      
      if (!response) {
        console.error('LectoGuía: No se recibió respuesta del servicio');
        setServiceStatus('unavailable');
        setConnectionStatus('disconnected');
        
        const fallbackMessage = "Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor intenta de nuevo en unos momentos.";
        addAssistantMessage(fallbackMessage);
        return fallbackMessage;
      }
      
      console.log('LectoGuía: Respuesta recibida exitosamente');
      
      // Extraer el contenido de la respuesta con type-safe access
      const aiResponseContent = (response as any)?.response || (response as any)?.result || response;
      
      // Detectar las habilidades mencionadas en la respuesta
      const skillMentionsPattern = /(TRACK_LOCATE|INTERPRET_RELATE|EVALUATE_REFLECT|SOLVE_PROBLEMS|REPRESENT|MODEL|ARGUE_COMMUNICATE|IDENTIFY_THEORIES|PROCESS_ANALYZE|APPLY_PRINCIPLES|SCIENTIFIC_ARGUMENT|TEMPORAL_THINKING|SOURCE_ANALYSIS|MULTICAUSAL_ANALYSIS|CRITICAL_THINKING|REFLECTION)/gi;
      const skillMatches = (typeof aiResponseContent === 'string' ? aiResponseContent : JSON.stringify(aiResponseContent)).match(skillMentionsPattern);
      
      if (skillMatches && skillMatches.length > 0) {
        setActiveSkill(skillMatches[0] as TPAESHabilidad);
      }
      
      // Añadir la respuesta del asistente al estado
      addAssistantMessage(aiResponseContent);
      setConnectionStatus('connected');
      setServiceStatus('available');
      
      return aiResponseContent;
    } catch (error: any) {
      console.error("LectoGuía: Error procesando mensaje:", error);
      
      setConnectionStatus('disconnected');
      setServiceStatus('unavailable');
      
      // Mensaje de error más amigable
      const errorMessage = "Estoy teniendo dificultades técnicas en este momento. Por favor intenta de nuevo más tarde.";
      addAssistantMessage(errorMessage);
      
      toast({
        title: "Error de conexión",
        description: "No se pudo procesar tu mensaje. Intenta de nuevo.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsTyping(false);
    }
  }, [addAssistantMessage, addUserMessage, getRecentMessages, activeSubject, processImage, generateExerciseForNode, generateExerciseForSkill]);
  
  // Return all values
  return {
    // Chat state
    messages,
    isTyping,
    activeSubject,
    serviceStatus,
    connectionStatus,
    activeSkill,
    recommendedNodes,
    
    // Chat actions
    processUserMessage,
    resetConnectionStatus,
    showConnectionStatus,
    setActiveSubject,
    setActiveSkill,
    addAssistantMessage,
    changeSubject,
    detectSubjectFromMessage,
    generateExerciseForNode,
    generateExerciseForSkill,
    updateNodeProgress,
    updateSkillLevel
  };
}
