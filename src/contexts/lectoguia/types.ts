
import { ChatMessage } from '@/components/ai/ChatInterface';
import { Exercise } from '@/types/ai-types';
import { TPAESHabilidad } from '@/types/system-types';
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
  selectedPrueba: string;
  
  // Estado de conexión
  serviceStatus: 'available' | 'degraded' | 'unavailable';
  connectionStatus: ConnectionStatus;
  resetConnectionStatus: () => void;
  showConnectionStatus: () => ReactNode | null;
}

// Constantes
export const SUBJECT_TO_PRUEBA_MAP: Record<string, string> = {
  'general': 'COMPETENCIA_LECTORA',
  'lectura': 'COMPETENCIA_LECTORA',
  'matematicas-basica': 'MATEMATICA_BASICA',
  'matematicas-avanzada': 'MATEMATICA_AVANZADA',
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
