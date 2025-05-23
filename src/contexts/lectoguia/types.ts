
import { ChatMessage } from '@/components/ai/ChatInterface';
import { Exercise } from '@/types/ai-types';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { ReactNode } from 'react';
import { ConnectionStatus } from '@/hooks/use-openrouter';

export interface LectoGuiaContextType {
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
  handleStartSimulation: (skill?: string) => void;
  
  // Nodos
  nodes: any[];
  nodeProgress: Record<string, any>;
  handleNodeSelect: (nodeId: string) => void;
  selectedTestId: string | null;
  setSelectedTestId: (id: string | null) => void;
  selectedPrueba: TPAESPrueba;
  
  // Estado de conexión
  serviceStatus: 'available' | 'degraded' | 'unavailable';
  connectionStatus: ConnectionStatus;
  resetConnectionStatus: () => void;
  showConnectionStatus: () => ReactNode | null;
}

// Interfaces para hooks individuales
export interface UseTabsState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface UseSubjectsState {
  activeSubject: string;
  handleSubjectChange: (subject: string) => void;
}

export interface UseChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  handleSendMessage: (message: string, imageData?: string) => void;
  addUserMessage: (content: string, imageData?: string) => ChatMessage | null;
  addAssistantMessage: (content: string) => ChatMessage;
}

export interface UseExerciseState {
  currentExercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  handleOptionSelect: (index: number) => void;
  handleNewExercise: () => void;
  isLoading: boolean;
  setCurrentExercise: (exercise: Exercise | null) => void;
  setIsLoading: (value: boolean) => void;
}

export interface UseNodesState {
  nodes: any[];
  nodeProgress: Record<string, any>;
  handleNodeSelect: (nodeId: string) => void;
  selectedTestId: string | null;
  setSelectedTestId: (id: string | null) => void;
  selectedPrueba: TPAESPrueba;
}

export interface UseSkillsState {
  skillLevels: Record<TPAESHabilidad, number>;
  updateSkillLevel: (skillId: number, isCorrect: boolean) => Promise<void>;
  getSkillIdFromCode: (skillCode: TPAESHabilidad) => number | null;
  handleStartSimulation: (skill?: string) => void;
}

// Valores iniciales
export const initialSkillLevels: Record<TPAESHabilidad, number> = {
  'TRACK_LOCATE': 0,
  'INTERPRET_RELATE': 0,
  'EVALUATE_REFLECT': 0,
  'SOLVE_PROBLEMS': 0,
  'REPRESENT': 0,
  'MODEL': 0,
  'ARGUE_COMMUNICATE': 0,
  'IDENTIFY_THEORIES': 0,
  'PROCESS_ANALYZE': 0,
  'APPLY_PRINCIPLES': 0,
  'SCIENTIFIC_ARGUMENT': 0,
  'TEMPORAL_THINKING': 0,
  'SOURCE_ANALYSIS': 0,
  'MULTICAUSAL_ANALYSIS': 0,
  'CRITICAL_THINKING': 0,
  'REFLECTION': 0
};

// Constantes
export const SUBJECT_TO_PRUEBA_MAP: Record<string, TPAESPrueba> = {
  'general': 'COMPETENCIA_LECTORA',
  'lectura': 'COMPETENCIA_LECTORA',
  'matematicas-basica': 'MATEMATICA_1',
  'matematicas-avanzada': 'MATEMATICA_2',
  'ciencias': 'CIENCIAS',
  'historia': 'HISTORIA'
};

export const SUBJECT_DISPLAY_NAMES: Record<string, string> = {
  'general': 'General',
  'lectura': 'Comprensión Lectora',
  'matematicas-basica': 'Matemáticas (7° a 2° medio)',
  'matematicas-avanzada': 'Matemáticas (3° y 4° medio)',
  'ciencias': 'Ciencias',
  'historia': 'Historia'
};

export const WELCOME_MESSAGE = `👋 ¡Hola! Soy LectoGuía, tu asistente de aprendizaje personalizado.

Puedo ayudarte con:

• Todas las materias de la PAES (Comprensión Lectora, Matemáticas, Ciencias, Historia)
• Explicaciones detalladas y ejemplos prácticos de cualquier concepto
• Ejercicios personalizados según tu nivel de dominio
• Análisis de tu progreso y recomendaciones personalizadas
• Análisis de imágenes y textos con reconocimiento inteligente
• Visualización de tu mapa de habilidades y competencias

🔍 Sugerencias para comenzar:
1. "Explícame el concepto de inferencia textual"
2. "Necesito practicar ecuaciones de segundo grado"
3. "Dame un ejercicio de Competencia Lectora"
4. "¿Cuáles son mis habilidades más desarrolladas?"
5. "Ayúdame a mejorar en análisis de fuentes históricas"

También puedes cambiar a las pestañas de 'Ejercicios' para practicar o 'Progreso' para ver tu desarrollo de habilidades.

¿En qué puedo ayudarte hoy?`;

export const ERROR_RATE_LIMIT_MESSAGE = `Lo siento, estoy experimentando alta demanda en este momento. Por favor, intenta de nuevo en unos minutos.`;
