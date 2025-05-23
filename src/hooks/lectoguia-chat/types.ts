
import { ChatMessage } from '@/components/ai/ChatInterface';

export interface ImageProcessingResult {
  response: string;
  extractedText?: string;
  tags?: string[];
  confidence?: number;
}

export const WELCOME_MESSAGE = `👋 ¡Hola! Soy LectoGuía, tu asistente de aprendizaje personalizado.

Puedo ayudarte con:

• Todas las materias de la PAES (Comprensión Lectora, Matemáticas, Ciencias, Historia)
• Explicaciones detalladas y ejemplos prácticos de cualquier concepto
• Ejercicios personalizados según tu nivel de dominio
• Análisis de tu progreso y recomendaciones personalizadas
• Análisis de imágenes y textos con reconocimiento inteligente
• Visualización de tu mapa de habilidades y competencias

¿En qué puedo ayudarte hoy?`;

export const ERROR_RATE_LIMIT_MESSAGE = `Lo siento, estoy experimentando alta demanda en este momento. Por favor, intenta de nuevo en unos minutos.`;
