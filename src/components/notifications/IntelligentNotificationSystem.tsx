import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Check,
  Star,
  Trophy,
  Brain,
  AlertTriangle,
  TrendingUp,
  Target,
  Sparkles,
  Clock,
  Filter,
  Settings,
  Volume2,
  VolumeX,
  Eye,
  Music,
  BookOpen,
  Zap,
  Activity,
  Calendar,
  RefreshCw
} from 'lucide-react';

import { useGamification } from '@/hooks/use-gamification';
import { useAIRecommendations } from '@/hooks/use-ai-recommendations';
import { useRealTimeAnalytics } from '@/hooks/use-real-time-analytics';
import { useSpotifyPAES } from '@/hooks/use-spotify-paes';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface SmartNotification {
  id: string;
  type: 'achievement' | 'recommendation' | 'alert' | 'insight' | 'music' | 'study_reminder' | 'milestone';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'gamification' | 'ai' | 'analytics' | 'spotify' | 'system';
  timestamp: string;
  isRead: boolean;
  isPersistent?: boolean;
  data?: any;
  actions?: {
    primary?: {
      label: string;
      action: () => void;
    };
    secondary?: {
      label: string;
      action: () => void;
    };
  };
  aiGenerated: boolean;
  relevanceScore: number;
  expiresAt?: string;
}

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  categories: {
    gamification: boolean;
    ai: boolean;
    analytics: boolean;
    spotify: boolean;
    system: boolean;
  };
  priorities: {
    low: boolean;
    medium: boolean;
    high: boolean;
    urgent: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  aiPersonalization: boolean;
}

const IntelligentNotificationSystem: React.FC<{ userId: string }> = ({ userId }) => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    categories: {
      gamification: true,
      ai: true,
      analytics: true,
      spotify: true,
      system: true
    },
    priorities: {
      low: true,
      medium: true,
      high: true,
      urgent: true
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    aiPersonalization: true
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'ai' | 'urgent'>('all');

  // Hooks para datos
  const { gameStats, achievements, autoCheckAchievements } = useGamification();
  const { recommendations, refreshRecommendations } = useAIRecommendations();
  const { metrics, predictions } = useRealTimeAnalytics();
  const { currentSession, currentTrack, isPlaying } = useSpotifyPAES();

  // Generar notificaciones inteligentes basadas en datos
  const generateSmartNotifications = useCallback(() => {
    const newNotifications: SmartNotification[] = [];
    const now = new Date();

    // Notificaciones de gamificación
    if (achievements) {
      // Logros desbloqueados recientemente
      const recentAchievements = achievements.filter(a => 
        a.unlocked && a.unlockedAt && 
        new Date(a.unlockedAt) > new Date(now.getTime() - 5 * 60 * 1000) // Últimos 5 minutos
      );
      
      recentAchievements.forEach(achievement => {
        newNotifications.push({
          id: `achievement-${achievement.id}`,
          type: 'achievement',
          title: '🏆 ¡Logro Desbloqueado!',
          message: `Has conseguido: ${achievement.name}`,
          priority: achievement.rarity === 'legendary' ? 'urgent' : 
                   achievement.rarity === 'epic' ? 'high' : 'medium',
          category: 'gamification',
          timestamp: achievement.unlockedAt!,
          isRead: false,
          aiGenerated: false,
          relevanceScore: 0.9,
          data: { achievement },
          actions: {
            primary: {
              label: 'Ver Detalles',
              action: () => {/* Abrir gamification dashboard */}
            }
          }
        });
      });

      // Logros cerca de completarse
      const nearComplete = achievements.filter(a => 
        !a.unlocked && a.progress >= 0.8 && a.progress < 1
      );

      nearComplete.forEach(achievement => {
        newNotifications.push({
          id: `near-achievement-${achievement.id}`,
          type: 'milestone',
          title: '⭐ ¡Casi lo logras!',
          message: `${achievement.name}: ${Math.round(achievement.progress * 100)}% completado`,
          priority: 'medium',
          category: 'gamification',
          timestamp: now.toISOString(),
          isRead: false,
          aiGenerated: true,
          relevanceScore: 0.7,
          data: { achievement },
          expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
        });
      });
    }

    // Notificaciones de IA
    if (recommendations?.personalizedActivities) {
      const highPriorityRecs = recommendations.personalizedActivities.filter(rec => 
        rec.priority === 'high' && rec.aiConfidence > 0.8
      );

      if (highPriorityRecs.length > 0) {
        newNotifications.push({
          id: `ai-recommendations-${Date.now()}`,
          type: 'recommendation',
          title: '🧠 Nuevas Recomendaciones IA',
          message: `${highPriorityRecs.length} actividades personalizadas disponibles`,
          priority: 'high',
          category: 'ai',
          timestamp: now.toISOString(),
          isRead: false,
          aiGenerated: true,
          relevanceScore: Math.max(...highPriorityRecs.map(r => r.aiConfidence)),
          data: { recommendations: highPriorityRecs },
          actions: {
            primary: {
              label: 'Ver Recomendaciones',
              action: () => refreshRecommendations()
            }
          }
        });
      }
    }

    // Notificaciones de Analytics Predictivos
    if (predictions?.riskFactors) {
      const highRiskFactors = predictions.riskFactors.filter(risk => 
        risk.severity === 'high'
      );

      highRiskFactors.forEach(risk => {
        newNotifications.push({
          id: `risk-alert-${risk.area}`,
          type: 'alert',
          title: '⚠️ Área de Atención',
          message: `Riesgo detectado en ${risk.area}: ${risk.description}`,
          priority: 'urgent',
          category: 'analytics',
          timestamp: now.toISOString(),
          isRead: false,
          isPersistent: true,
          aiGenerated: true,
          relevanceScore: risk.probability,
          data: { risk },
          actions: {
            primary: {
              label: 'Ver Análisis',
              action: () => {/* Abrir analytics dashboard */}
            },
            secondary: {
              label: 'Crear Plan',
              action: () => {/* Generar plan de mejora */}
            }
          }
        });
      });
    }

    // Notificaciones de Spotify PAES
    if (currentTrack && !isPlaying) {
      newNotifications.push({
        id: `spotify-paused-${Date.now()}`,
        type: 'music',
        title: '🎵 Música Pausada',
        message: `¿Continuar con "${currentTrack.name}"?`,
        priority: 'low',
        category: 'spotify',
        timestamp: now.toISOString(),
        isRead: false,
        aiGenerated: false,
        relevanceScore: 0.3,
        data: { track: currentTrack },
        expiresAt: new Date(now.getTime() + 10 * 60 * 1000).toISOString(),
        actions: {
          primary: {
            label: 'Reanudar',
            action: () => {/* Resume playback */}
          }
        }
      });
    }

    // Recordatorios inteligentes de estudio basados en patrones
    if (settings.aiPersonalization && gameStats) {
      const studyTime = new Date().getHours();
      if (studyTime >= 9 && studyTime <= 21 && gameStats.streakDays > 0) {
        const lastActivity = localStorage.getItem('lastStudyActivity');
        const timeSinceLastActivity = lastActivity ? 
          now.getTime() - new Date(lastActivity).getTime() : 
          Infinity;

        if (timeSinceLastActivity > 2 * 60 * 60 * 1000) { // 2 horas
          newNotifications.push({
            id: `study-reminder-${Date.now()}`,
            type: 'study_reminder',
            title: '📚 Momento de Estudio',
            message: `Mantén tu racha de ${gameStats.streakDays} días. ¡Es tu hora más productiva!`,
            priority: 'medium',
            category: 'ai',
            timestamp: now.toISOString(),
            isRead: false,
            aiGenerated: true,
            relevanceScore: 0.6,
            expiresAt: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
            actions: {
              primary: {
                label: 'Comenzar Sesión',
                action: () => {/* Iniciar sesión de estudio */}
              }
            }
          });
        }
      }
    }

    return newNotifications;
  }, [achievements, recommendations, predictions, currentTrack, isPlaying, gameStats, settings.aiPersonalization]);

  // Filtrar notificaciones basado en configuración y filtros
  const filteredNotifications = useMemo(() => {
    if (!settings.enabled) return [];

    let filtered = notifications;

    // Filtrar por configuración de categorías
    filtered = filtered.filter(notification => 
      settings.categories[notification.category]
    );

    // Filtrar por configuración de prioridades
    filtered = filtered.filter(notification => 
      settings.priorities[notification.priority]
    );

    // Aplicar filtro activo
    switch (activeFilter) {
      case 'unread':
        filtered = filtered.filter(n => !n.isRead);
        break;
      case 'ai':
        filtered = filtered.filter(n => n.aiGenerated);
        break;
      case 'urgent':
        filtered = filtered.filter(n => n.priority === 'urgent');
        break;
      default:
        break;
    }

    // Verificar horas silenciosas
    if (settings.quietHours.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const startTime = parseInt(settings.quietHours.start.replace(':', ''));
      const endTime = parseInt(settings.quietHours.end.replace(':', ''));

      if (startTime > endTime) {
        // Cruza medianoche
        if (currentTime >= startTime || currentTime <= endTime) {
          filtered = filtered.filter(n => n.priority === 'urgent');
        }
      } else {
        // Mismo día
        if (currentTime >= startTime && currentTime <= endTime) {
          filtered = filtered.filter(n => n.priority === 'urgent');
        }
      }
    }

    // Remover notificaciones expiradas
    const now = new Date();
    filtered = filtered.filter(n => 
      !n.expiresAt || new Date(n.expiresAt) > now
    );

    // Ordenar por relevancia y timestamp
    return filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      const relevanceDiff = b.relevanceScore - a.relevanceScore;
      if (relevanceDiff !== 0) return relevanceDiff;
      
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [notifications, settings, activeFilter]);

  // Actualizar notificaciones periódicamente
  useEffect(() => {
    const updateNotifications = () => {
      const newNotifications = generateSmartNotifications();
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const uniqueNew = newNotifications.filter(n => !existingIds.has(n.id));
        return [...prev, ...uniqueNew];
      });
    };

    // Actualización inicial
    updateNotifications();

    // Actualización cada 30 segundos
    const interval = setInterval(updateNotifications, 30000);

    return () => clearInterval(interval);
  }, [generateSmartNotifications]);

  // Reproducir sonido para notificaciones urgentes
  useEffect(() => {
    if (settings.sound) {
      const urgentNotifications = filteredNotifications.filter(n => 
        n.priority === 'urgent' && !n.isRead
      );
      
      if (urgentNotifications.length > 0) {
        // Reproducir sonido de notificación
        const audio = new Audio('/sounds/urgent-notification.mp3');
        audio.play().catch(() => {
          // Silenciar errores de audio si no hay permisos
        });
      }
    }
  }, [filteredNotifications, settings.sound]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationIcon = (notification: SmartNotification) => {
    switch (notification.type) {
      case 'achievement': return Trophy;
      case 'recommendation': return Brain;
      case 'alert': return AlertTriangle;
      case 'insight': return Sparkles;
      case 'music': return Music;
      case 'study_reminder': return BookOpen;
      case 'milestone': return Target;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-500/10';
      case 'high': return 'border-l-orange-500 bg-orange-500/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-l-blue-500 bg-blue-500/10';
      default: return 'border-l-gray-500 bg-gray-500/10';
    }
  };

  const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </Button>

        {/* Notification Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 w-96 max-w-sm z-50"
            >
              <Card className="bg-gray-900 border-gray-700 shadow-2xl">
                {/* Header */}
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">
                      Notificaciones IA
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        Marcar todas
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex gap-1 mt-3">
                    {[
                      { key: 'all', label: 'Todo', count: filteredNotifications.length },
                      { key: 'unread', label: 'Sin leer', count: unreadCount },
                      { key: 'ai', label: 'IA', count: filteredNotifications.filter(n => n.aiGenerated).length },
                      { key: 'urgent', label: 'Urgente', count: filteredNotifications.filter(n => n.priority === 'urgent').length }
                    ].map(filter => (
                      <Button
                        key={filter.key}
                        variant={activeFilter === filter.key ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveFilter(filter.key as any)}
                        className="text-xs"
                      >
                        {filter.label} {filter.count > 0 && `(${filter.count})`}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No hay notificaciones</p>
                    </div>
                  ) : (
                    <div className="space-y-1 p-2">
                      {filteredNotifications.map((notification) => {
                        const Icon = getNotificationIcon(notification);
                        return (
                          <motion.div
                            key={notification.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={cn(
                              'p-3 rounded-lg border-l-4 cursor-pointer transition-all duration-200',
                              getPriorityColor(notification.priority),
                              !notification.isRead && 'ring-1 ring-blue-500/30',
                              'hover:bg-white/5'
                            )}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <Icon className="h-4 w-4 text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={cn(
                                    'text-sm font-medium truncate',
                                    !notification.isRead ? 'text-white' : 'text-gray-300'
                                  )}>
                                    {notification.title}
                                  </h4>
                                  {notification.aiGenerated && (
                                    <Sparkles className="h-3 w-3 text-purple-400" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    {new Date(notification.timestamp).toLocaleTimeString()}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {notification.actions?.primary && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          notification.actions!.primary!.action();
                                        }}
                                        className="text-xs text-blue-400 hover:text-blue-300 p-1"
                                      >
                                        {notification.actions.primary.label}
                                      </Button>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        dismissNotification(notification.id);
                                      }}
                                      className="p-1 text-gray-500 hover:text-gray-300"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {filteredNotifications.length > 0 && (
                  <div className="p-3 border-t border-gray-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllNotifications}
                      className="w-full text-xs text-gray-400 hover:text-white"
                    >
                      Limpiar todas las notificaciones
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default IntelligentNotificationSystem;
