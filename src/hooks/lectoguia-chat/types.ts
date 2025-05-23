
import { ChatMessage } from '@/components/ai/ChatInterface';

export interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  activeSubject: string;
  connectionStatus?: 'connected' | 'connecting' | 'disconnected';
  serviceStatus?: 'available' | 'degraded' | 'unavailable';
}

export interface ChatActions {
  processUserMessage: (message: string, imageData?: string) => Promise<string | null>;
  addAssistantMessage: (content: string) => void;
  changeSubject: (subject: string) => void;
  detectSubjectFromMessage: (message: string) => string | null;
  showConnectionStatus?: () => React.ReactNode;
  resetConnectionStatus?: () => void;
}

export interface ImageProcessingResult {
  response: string;
  extractedText?: string;
}

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
