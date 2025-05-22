
import { ChatMessage } from '@/components/ai/ChatInterface';

export interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  activeSubject: string;
}

export interface ChatActions {
  processUserMessage: (message: string, imageData?: string) => Promise<string | null>;
  addAssistantMessage: (content: string) => void;
  changeSubject: (subject: string) => void;
  detectSubjectFromMessage: (message: string) => string | null;
}

export interface ImageProcessingResult {
  response: string;
  extractedText?: string;
}

export const WELCOME_MESSAGE = `👋 ¡Hola! Soy LectoGuía, tu asistente personalizado para toda la preparación PAES.

Puedo ayudarte con:

• Todas las materias de la PAES (Comprensión Lectora, Matemáticas, Ciencias, Historia)
• Explicaciones detalladas de conceptos en cualquier asignatura
• Análisis de tu progreso y recomendaciones personalizadas
• Técnicas específicas para mejorar tus habilidades
• Análisis de imágenes y textos con OCR
• Navegación y orientación por todas las secciones de la plataforma

¿En qué puedo ayudarte hoy?`;

export const ERROR_RATE_LIMIT_MESSAGE = `Lo siento, estoy experimentando alta demanda en este momento. Por favor, intenta de nuevo en unos minutos.`;
