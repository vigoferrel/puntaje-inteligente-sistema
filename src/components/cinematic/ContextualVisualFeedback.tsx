
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdvancedNeuralSystem } from '@/hooks/useAdvancedNeuralSystem';

interface FeedbackNotification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'neural';
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
}

export const ContextualVisualFeedback: React.FC = () => {
  const { realTimeMetrics, neuralSystemStatus, actions } = useAdvancedNeuralSystem('visual-feedback');
  const [notifications, setNotifications] = useState<FeedbackNotification[]>([]);
  const [cognitiveLoadWarning, setCognitiveLoadWarning] = useState(false);

  // Monitoreo de métricas para feedback automático
  useEffect(() => {
    const checkMetrics = () => {
      // Warning por baja coherencia neural
      if (realTimeMetrics.neural_coherence < 40 && !cognitiveLoadWarning) {
        setCognitiveLoadWarning(true);
        addNotification({
          type: 'neural',
          message: 'Detectamos alta carga cognitiva. Activando modo simplificado.',
          duration: 4000,
          position: 'top-right'
        });
        
        setTimeout(() => setCognitiveLoadWarning(false), 10000);
      }
      
      // Feedback positivo por alto engagement
      if (realTimeMetrics.real_time_engagement > 85) {
        addNotification({
          type: 'success',
          message: '¡Excelente! Tu nivel de engagement está al máximo.',
          duration: 3000,
          position: 'bottom-right'
        });
      }
      
      // Sugerencia de optimización
      if (realTimeMetrics.adaptive_intelligence_score > 90) {
        addNotification({
          type: 'info',
          message: 'Sistema optimizado al máximo. Experiencia premium activada.',
          duration: 2500,
          position: 'top-left'
        });
      }
    };

    const interval = setInterval(checkMetrics, 15000); // Cada 15 segundos
    return () => clearInterval(interval);
  }, [realTimeMetrics, cognitiveLoadWarning]);

  const addNotification = (notification: Omit<FeedbackNotification, 'id'>) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remover después de la duración
    setTimeout(() => {
      removeNotification(id);
    }, notification.duration || 3000);
    
    // Capturar evento de feedback
    actions.captureEvent('interaction', {
      type: 'visual_feedback',
      notification_type: notification.type,
      message: notification.message,
      auto_generated: true
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationStyle = (type: FeedbackNotification['type']) => {
    switch (type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9))',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          color: 'white'
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9))',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: 'white'
        };
      case 'neural':
        return {
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: 'white'
        };
      default:
        return {
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: 'white'
        };
    }
  };

  const getPositionClasses = (position: FeedbackNotification['position']) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <>
      {/* Notificaciones contextuales */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`fixed z-50 ${getPositionClasses(notification.position)} max-w-sm`}
            style={getNotificationStyle(notification.type)}
            onClick={() => removeNotification(notification.id)}
          >
            <div className="p-4 rounded-lg backdrop-blur-xl shadow-2xl cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  notification.type === 'success' ? 'bg-green-300' :
                  notification.type === 'warning' ? 'bg-yellow-300' :
                  notification.type === 'neural' ? 'bg-purple-300' :
                  'bg-blue-300'
                } animate-pulse`} />
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Indicador de estado neural en tiempo real */}
      <motion.div
        className="fixed bottom-4 left-4 z-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-3 border border-white/10">
          <div className="flex items-center space-x-2">
            <motion.div
              className={`w-3 h-3 rounded-full ${
                neuralSystemStatus.health > 80 ? 'bg-green-400' :
                neuralSystemStatus.health > 60 ? 'bg-yellow-400' :
                'bg-red-400'
              }`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white/80 text-xs font-medium">
              Neural: {neuralSystemStatus.health}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Overlay de modo focus cuando hay alta carga cognitiva */}
      <AnimatePresence>
        {cognitiveLoadWarning && (
          <motion.div
            className="fixed inset-0 z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10" />
            <div className="absolute inset-0 backdrop-blur-[1px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Hook para feedback manual
export const useVisualFeedback = () => {
  const { actions } = useAdvancedNeuralSystem();

  const showFeedback = (message: string, type: FeedbackNotification['type'] = 'info') => {
    actions.captureEvent('interaction', {
      type: 'manual_feedback',
      message,
      feedback_type: type,
      timestamp: Date.now()
    });

    // Aquí se podría integrar con un sistema de notificaciones global
    console.log(`🎯 Feedback: ${message} (${type})`);
  };

  return { showFeedback };
};
