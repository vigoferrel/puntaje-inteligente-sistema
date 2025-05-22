import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Exercise } from '@/types/ai-types';
import { TLearningNode, TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { useOpenRouter } from '@/hooks/use-openrouter';
import { NodeProgress } from '@/types/node-progress';
import { ChatMessage } from '@/components/ai/ChatInterface';
import { v4 as uuidv4 } from 'uuid';
import { WELCOME_MESSAGE } from '@/hooks/lectoguia-chat/types';
import { getSkillsByPrueba } from '@/utils/lectoguia-utils';
import { testIdToPrueba } from '@/types/paes-types';

// Estado inicial
const initialSkillLevels: Record<TPAESHabilidad, number> = {
  'TRACK_LOCATE': 0.1,
  'INTERPRET_RELATE': 0.2,
  'EVALUATE_REFLECT': 0,
  'SOLVE_PROBLEMS': 0.3,
  'REPRESENT': 0.2,
  'MODEL': 0.1,
  'ARGUE_COMMUNICATE': 0,
  'IDENTIFY_THEORIES': 0.4,
  'PROCESS_ANALYZE': 0.1,
  'APPLY_PRINCIPLES': 0,
  'SCIENTIFIC_ARGUMENT': 0,
  'TEMPORAL_THINKING': 0.2,
  'SOURCE_ANALYSIS': 0.1,
  'MULTICAUSAL_ANALYSIS': 0,
  'CRITICAL_THINKING': 0.2,
  'REFLECTION': 0.1
};

// Mapeo de materias a pruebas PAES
export const SUBJECT_TO_PRUEBA_MAP: Record<string, TPAESPrueba> = {
  'general': 'COMPETENCIA_LECTORA',
  'lectura': 'COMPETENCIA_LECTORA',
  'matematicas-basica': 'MATEMATICA_1',
  'matematicas-avanzada': 'MATEMATICA_2',
  'ciencias': 'CIENCIAS',
  'historia': 'HISTORIA'
};

// Nombres para mostrar de las materias
export const SUBJECT_DISPLAY_NAMES: Record<string, string> = {
  'general': 'General',
  'lectura': 'Comprensión Lectora',
  'matematicas-basica': 'Matemáticas (7° a 2° medio)',
  'matematicas-avanzada': 'Matemáticas (3° y 4° medio)',
  'ciencias': 'Ciencias',
  'historia': 'Historia'
};

// Tipos para el contexto
interface LectoGuiaContextType {
  // Estado general
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  
  // Chat
  messages: ChatMessage[];
  isTyping: boolean;
  activeSubject: string;
  handleSendMessage: (message: string, imageData?: string) => void;
  handleSubjectChange: (subject: string) => void;
  
  // Ejercicios
  currentExercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  handleOptionSelect: (index: number) => void;
  handleNewExercise: () => void;
  
  // Progreso
  skillLevels: Record<TPAESHabilidad, number>;
  handleStartSimulation: () => void;
  
  // Nodos
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  handleNodeSelect: (nodeId: string) => void;
  selectedTestId: number;
  setSelectedTestId: (testId: number) => void;
  selectedPrueba: TPAESPrueba;
}

// Crear el contexto
export const LectoGuiaContext = createContext<LectoGuiaContextType | undefined>(undefined);

// Proveedor del contexto
export const LectoGuiaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth
  const { user } = useAuth();
  const { callOpenRouter } = useOpenRouter();
  
  // Estado general
  const [activeTab, setActiveTab] = useState('chat');
  const [isLoading, setIsLoading] = useState(false);
  
  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: WELCOME_MESSAGE,
      timestamp: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubject, setActiveSubject] = useState('general');
  
  // Ejercicios
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Progreso
  const [skillLevels, setSkillLevels] = useState<Record<TPAESHabilidad, number>>(initialSkillLevels);
  const [selectedTestId, setSelectedTestId] = useState<number>(1); // Default: Competencia lectora
  const [selectedPrueba, setSelectedPrueba] = useState<TPAESPrueba>('COMPETENCIA_LECTORA');
  
  // Nodos
  const [nodes, setNodes] = useState<TLearningNode[]>([]);
  const [nodeProgress, setNodeProgress] = useState<Record<string, NodeProgress>>({});

  // Actualizar prueba seleccionada cuando cambia el ID de prueba
  useEffect(() => {
    setSelectedPrueba(testIdToPrueba(selectedTestId));
  }, [selectedTestId]);
  
  // Cargar nodos para la prueba seleccionada
  useEffect(() => {
    const fetchLearningNodes = async () => {
      if (!selectedTestId) return;
      
      try {
        const { data, error } = await supabase
          .from('learning_nodes')
          .select('*, skill:paes_skills(*)')
          .eq('test_id', selectedTestId)
          .order('position', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          // Mapear los nodos desde la base de datos a la interfaz TLearningNode
          const formattedNodes: TLearningNode[] = data.map(node => ({
            id: node.id,
            title: node.title,
            description: node.description || '',
            // Convertir explícitamente a TPAESHabilidad
            skill: (node.skill?.code || 'INTERPRET_RELATE') as TPAESHabilidad,
            prueba: testIdToPrueba(node.test_id) || 'COMPETENCIA_LECTORA',
            difficulty: node.difficulty || 'basic',
            position: node.position,
            dependsOn: node.depends_on || [],
            estimatedTimeMinutes: node.estimated_time_minutes || 30,
            content: {
              theory: '',
              examples: [],
              exerciseCount: 0
            }
          }));
          
          setNodes(formattedNodes);
        }
      } catch (error) {
        console.error('Error fetching learning nodes:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los nodos de aprendizaje',
          variant: 'destructive'
        });
      }
    };
    
    fetchLearningNodes();
  }, [selectedTestId]);
  
  // Cargar progreso del usuario
  useEffect(() => {
    const fetchUserNodeProgress = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_node_progress')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data) {
          const progress: Record<string, NodeProgress> = {};
          data.forEach(item => {
            // Convertir el valor de string a uno de los tipos permitidos
            const validStatus = (item.status as "not_started" | "in_progress" | "completed") || "not_started";
            
            progress[item.node_id] = {
              nodeId: item.node_id,
              status: validStatus, // Usando el valor tipado
              progress: item.progress || 0,
              timeSpentMinutes: item.time_spent_minutes || 0
            };
          });
          
          setNodeProgress(progress);
        }
      } catch (error) {
        console.error('Error fetching user node progress:', error);
      }
    };
    
    fetchUserNodeProgress();
  }, [user?.id]);
  
  // Cargar niveles de habilidades del usuario
  useEffect(() => {
    const fetchSkillLevels = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_skill_levels')
          .select('*,paes_skills(code)')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const levels: Record<TPAESHabilidad, number> = { ...initialSkillLevels };
          
          data.forEach((skillLevel: any) => {
            if (skillLevel.paes_skills && skillLevel.paes_skills.code) {
              levels[skillLevel.paes_skills.code as TPAESHabilidad] = skillLevel.level;
            }
          });
          
          setSkillLevels(levels);
        }
      } catch (error) {
        console.error('Error fetching skill levels:', error);
      }
    };
    
    fetchSkillLevels();
  }, [user?.id]);
  
  // Funcionalidad de chat
  const addUserMessage = useCallback((content: string, imageData?: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      imageUrl: imageData
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);
  
  const addAssistantMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      role: "assistant",
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);
  
  // Manejo de envío de mensajes
  const handleSendMessage = useCallback(async (message: string, imageData?: string) => {
    if (!message.trim() && !imageData) return;
    
    addUserMessage(message, imageData);
    setIsTyping(true);
    
    try {
      // Detectar si el mensaje contiene una solicitud de ejercicio
      const isExerciseRequest = message.toLowerCase().includes("ejercicio") || 
                               message.toLowerCase().includes("practica") || 
                               message.toLowerCase().includes("ejemplo");
      
      if (isExerciseRequest) {
        addAssistantMessage("Generando un ejercicio para practicar...");
        handleNewExercise();
        setActiveTab('exercise');
      } else {
        // Procesar mensaje normal
        const response = await callOpenRouter<{ response: string }>("provide_feedback", {
          userMessage: message,
          context: `PAES preparation, subject: ${activeSubject}`,
          previousMessages: messages.slice(-6)
        });
        
        if (response) {
          addAssistantMessage(response.response || "Lo siento, no pude procesar tu solicitud.");
        }
      }
    } catch (error) {
      console.error("Error procesando mensaje:", error);
      addAssistantMessage("Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.");
    } finally {
      setIsTyping(false);
    }
  }, [messages, activeSubject, addUserMessage, addAssistantMessage, callOpenRouter]);
  
  // Manejo de cambio de materia
  const handleSubjectChange = useCallback((subject: string) => {
    if (activeSubject !== subject) {
      setActiveSubject(subject);
      addAssistantMessage(`Ahora estamos en ${SUBJECT_DISPLAY_NAMES[subject]}. ¿En qué puedo ayudarte?`);
    }
  }, [activeSubject, addAssistantMessage]);
  
  // Generación de ejercicios
  const generateExercise = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Obtener prueba correspondiente a la materia
      const prueba = SUBJECT_TO_PRUEBA_MAP[activeSubject] || 'COMPETENCIA_LECTORA';
      
      // Obtener habilidades disponibles para esta prueba
      const skills = getSkillsByPrueba()[prueba];
      
      // Seleccionar una habilidad aleatoria
      const randomSkill = skills[Math.floor(Math.random() * skills.length)];
      
      // Llamar al API para generar ejercicio
      const response = await callOpenRouter<Exercise>("generate_exercise", {
        skill: randomSkill,
        prueba,
        difficulty: "INTERMEDIATE"
      });
      
      if (response) {
        // Asegurarnos que el ejercicio tiene la información de prueba correcta
        response.prueba = prueba;
        setCurrentExercise(response);
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo generar el ejercicio',
          variant: 'destructive'
        });
      }
      
      return response;
    } catch (error) {
      console.error("Error al generar ejercicio:", error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al generar el ejercicio',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [activeSubject, callOpenRouter]);
  
  // Generar un ejercicio para un nodo específico
  const generateExerciseForNode = useCallback(async (nodeId: string) => {
    try {
      setIsLoading(true);
      
      // Encontrar el nodo
      const node = nodes.find(n => n.id === nodeId);
      if (!node) {
        toast({
          title: 'Error',
          description: 'No se encontró el nodo solicitado',
          variant: 'destructive'
        });
        return null;
      }
      
      // Llamar al API para generar ejercicio según el nodo
      const response = await callOpenRouter<Exercise>("generate_exercise", {
        skill: node.skill,
        prueba: node.prueba,
        difficulty: node.difficulty || "INTERMEDIATE",
        nodeContext: {
          nodeId: node.id,
          title: node.title,
          description: node.description
        }
      });
      
      if (response) {
        // Vincular el ejercicio con el nodo
        response.nodeId = node.id;
        response.nodeName = node.title;
        response.prueba = node.prueba;
        
        setCurrentExercise(response);
        setActiveTab('exercise');
        return response;
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo generar el ejercicio para este nodo',
          variant: 'destructive'
        });
      }
      
      return null;
    } catch (error) {
      console.error("Error al generar ejercicio para nodo:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [nodes, callOpenRouter]);
  
  // Manejo de opciones de ejercicio
  const handleOptionSelect = useCallback((index: number) => {
    if (showFeedback || !currentExercise) return;
    
    setSelectedOption(index);
    setShowFeedback(true);
    
    // Encontrar la respuesta correcta
    const correctAnswerIndex = currentExercise.options.findIndex(
      option => option === currentExercise.correctAnswer
    );
    
    const isCorrect = index === correctAnswerIndex;
    
    // Actualizar nivel de habilidad si el usuario está autenticado
    if (user?.id && currentExercise.skill) {
      // Actualizar localmente
      setSkillLevels(prev => {
        const skill = currentExercise.skill as TPAESHabilidad;
        const change = isCorrect ? 0.05 : -0.02;
        const newLevel = Math.min(1, Math.max(0, (prev[skill] || 0) + change));
        
        return {
          ...prev,
          [skill]: newLevel
        };
      });
      
      // Guardar en la base de datos
      saveExerciseAttempt(currentExercise, index, isCorrect);
    }
  }, [currentExercise, showFeedback, user?.id]);
  
  // Guardar intento de ejercicio en la base de datos
  const saveExerciseAttempt = useCallback(async (exercise: Exercise, selectedOption: number, isCorrect: boolean) => {
    if (!user?.id || !exercise) return;
    
    try {
      await supabase.from('lectoguia_exercise_attempts').insert({
        user_id: user.id,
        exercise_id: exercise.id || uuidv4(),
        selected_option: selectedOption,
        is_correct: isCorrect,
        skill_type: exercise.skill,
        prueba: exercise.prueba || 'COMPETENCIA_LECTORA'
      });
      
      // Actualizar nivel de habilidad en la base de datos
      if (exercise.skill) {
        const skillId = getSkillIdFromCode(exercise.skill as TPAESHabilidad);
        if (skillId) {
          updateSkillLevel(skillId, isCorrect);
        }
      }
    } catch (error) {
      console.error("Error al guardar intento de ejercicio:", error);
    }
  }, [user?.id]);
  
  // Obtener ID de habilidad desde su código
  const getSkillIdFromCode = useCallback((skillCode: TPAESHabilidad): number | null => {
    const skillIds: Record<TPAESHabilidad, number> = {
      'TRACK_LOCATE': 1,
      'INTERPRET_RELATE': 2,
      'EVALUATE_REFLECT': 3,
      'SOLVE_PROBLEMS': 4,
      'REPRESENT': 5,
      'MODEL': 6,
      'ARGUE_COMMUNICATE': 7,
      'IDENTIFY_THEORIES': 8,
      'PROCESS_ANALYZE': 9,
      'APPLY_PRINCIPLES': 10,
      'SCIENTIFIC_ARGUMENT': 11,
      'TEMPORAL_THINKING': 12,
      'SOURCE_ANALYSIS': 13,
      'MULTICAUSAL_ANALYSIS': 14,
      'CRITICAL_THINKING': 15,
      'REFLECTION': 16
    };
    
    return skillIds[skillCode] || null;
  }, []);
  
  // Actualizar nivel de habilidad en la base de datos
  const updateSkillLevel = useCallback(async (skillId: number, isCorrect: boolean) => {
    if (!user?.id) return;
    
    try {
      // Verificar si ya existe un registro para esta habilidad
      const { data: existingLevel } = await supabase
        .from('user_skill_levels')
        .select('*')
        .eq('user_id', user.id)
        .eq('skill_id', skillId)
        .maybeSingle();
      
      const change = isCorrect ? 0.05 : -0.02;
      
      if (existingLevel) {
        // Actualizar nivel existente
        const newLevel = Math.min(1, Math.max(0, existingLevel.level + change));
        
        await supabase
          .from('user_skill_levels')
          .update({ level: newLevel })
          .eq('id', existingLevel.id);
      } else {
        // Crear nuevo nivel
        const initialLevel = isCorrect ? 0.05 : 0;
        
        await supabase
          .from('user_skill_levels')
          .insert({
            user_id: user.id,
            skill_id: skillId,
            level: initialLevel
          });
      }
    } catch (error) {
      console.error("Error al actualizar nivel de habilidad:", error);
    }
  }, [user?.id]);
  
  // Manejador para nuevo ejercicio
  const handleNewExercise = useCallback(async () => {
    setSelectedOption(null);
    setShowFeedback(false);
    await generateExercise();
  }, [generateExercise]);
  
  // Manejador para iniciar simulación
  const handleStartSimulation = useCallback(() => {
    toast({
      title: "Simulación",
      description: "Esta función estará disponible próximamente"
    });
  }, []);
  
  // Manejador para selección de nodo
  const handleNodeSelect = useCallback((nodeId: string) => {
    generateExerciseForNode(nodeId);
  }, [generateExerciseForNode]);
  
  // Valores del contexto
  const contextValue = useMemo(() => ({
    // Estado general
    activeTab,
    setActiveTab,
    isLoading,
    
    // Chat
    messages,
    isTyping,
    activeSubject,
    handleSendMessage,
    handleSubjectChange,
    
    // Ejercicios
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    
    // Progreso
    skillLevels,
    handleStartSimulation,
    
    // Nodos
    nodes,
    nodeProgress,
    handleNodeSelect,
    selectedTestId,
    setSelectedTestId,
    selectedPrueba
  }), [
    activeTab, isLoading, messages, isTyping, activeSubject,
    currentExercise, selectedOption, showFeedback, skillLevels,
    nodes, nodeProgress, selectedTestId, selectedPrueba,
    handleSendMessage, handleSubjectChange, handleOptionSelect,
    handleNewExercise, handleStartSimulation, handleNodeSelect
  ]);
  
  return (
    <LectoGuiaContext.Provider value={contextValue}>
      {children}
    </LectoGuiaContext.Provider>
  );
};

// Hook para consumir el contexto
export const useLectoGuia = () => {
  const context = useContext(LectoGuiaContext);
  
  if (!context) {
    throw new Error("useLectoGuia debe ser usado dentro de un LectoGuiaProvider");
  }
  
  return context;
};
