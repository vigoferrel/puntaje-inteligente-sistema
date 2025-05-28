
import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ConsolidatedMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  source: 'unified' | 'chat' | 'analysis';
}

interface ConsolidatedStats {
  totalSessions: number;
  averageScore: number;
  todayProgress: number;
  unifiedMetrics: {
    chatInteractions: number;
    exercisesCompleted: number;
    readingAnalysis: number;
  };
}

/**
 * Hook consolidado para LectoGuía
 * Reemplaza múltiples hooks dispersos con una interfaz unificada
 */
export const useLectoGuiaConsolidated = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ConsolidatedMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '¡Bienvenido al LectoGuía consolidado! Sistema unificado de comprensión lectora.',
      timestamp: new Date(),
      source: 'unified'
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeModule, setActiveModule] = useState<'chat' | 'reading' | 'analysis'>('chat');

  // Estadísticas consolidadas
  const consolidatedStats: ConsolidatedStats = useMemo(() => ({
    totalSessions: 15,
    averageScore: 87.5,
    todayProgress: 65,
    unifiedMetrics: {
      chatInteractions: 42,
      exercisesCompleted: 18,
      readingAnalysis: 8
    }
  }), []);

  // Envío de mensajes unificado
  const sendMessage = useCallback(async (content: string, source: 'chat' | 'analysis' = 'chat') => {
    if (!content.trim()) return;

    const userMessage: ConsolidatedMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      source
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simular respuesta unificada
    setTimeout(() => {
      const response: ConsolidatedMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Respuesta consolidada para "${content}" desde el módulo ${source}. Sistema unificado activo.`,
        timestamp: new Date(),
        source: 'unified'
      };
      
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Cambio de módulo
  const switchModule = useCallback((module: 'chat' | 'reading' | 'analysis') => {
    setActiveModule(module);
    
    const switchMessage: ConsolidatedMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Módulo cambiado a ${module}. Todas las funciones están consolidadas y disponibles.`,
      timestamp: new Date(),
      source: 'unified'
    };
    
    setMessages(prev => [...prev, switchMessage]);
  }, []);

  return {
    // Estado consolidado
    messages,
    isLoading,
    activeModule,
    consolidatedStats,
    
    // Acciones unificadas
    sendMessage,
    switchModule,
    
    // Utilidades
    isAuthenticated: !!user,
    userId: user?.id
  };
};
