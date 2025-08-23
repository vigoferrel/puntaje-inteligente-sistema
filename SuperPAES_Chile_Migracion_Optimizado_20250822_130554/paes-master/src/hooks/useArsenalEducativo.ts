/**
 * 🎯 HOOK - ARSENAL EDUCATIVO COMPLETO
 * ====================================
 * Hook React personalizado que maneja todo el estado del Arsenal Educativo
 * Incluye: Cache Neural, Analytics, HUD, Notificaciones, Playlists, SuperPAES
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArsenalEducativoService,
  UseArsenalEducativoReturn,
  CachePerformanceMetrics,
  AnalyticsSummary,
  RealTimeAnalyticsMetric,
  HUDRealTimeSession,
  HUDAlert,
  SmartNotification,
  ExercisePlaylist,
  PlaylistItem,
  PlaylistRecommendation,
  PAESSimulationAdvanced,
  SimulationType,
  ArsenalConfig
} from '../types/arsenal-educativo.types';

interface UseArsenalEducativoProps {
  service: ArsenalEducativoService;
  config?: Partial<ArsenalConfig>;
  autoStart?: boolean;
}

export function useArsenalEducativo({
  service,
  config,
  autoStart = true
}: UseArsenalEducativoProps): UseArsenalEducativoReturn {
  
  // =====================================================================================
  // ESTADOS PRINCIPALES
  // =====================================================================================
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cache Neural
  const [cacheData, setCacheData] = useState<Record<string, any>>({});
  const [cachePerformance, setCachePerformance] = useState<CachePerformanceMetrics | null>(null);
  
  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [engagementTrends, setEngagementTrends] = useState<RealTimeAnalyticsMetric[]>([]);
  
  // HUD
  const [hudSession, setHudSession] = useState<HUDRealTimeSession | null>(null);
  const [hudAlerts, setHudAlerts] = useState<HUDAlert[]>([]);
  
  // Notificaciones
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Playlists
  const [recommendedPlaylists, setRecommendedPlaylists] = useState<PlaylistRecommendation[]>([]);
  const [myPlaylists, setMyPlaylists] = useState<ExercisePlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<ExercisePlaylist | null>(null);
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  
  // SuperPAES
  const [simulations, setSimulations] = useState<PAESSimulationAdvanced[]>([]);
  const [currentSimulation, setCurrentSimulation] = useState<PAESSimulationAdvanced | null>(null);
  
  // Referencias para intervalos
  const analyticsIntervalRef = useRef<NodeJS.Timeout>();
  const hudIntervalRef = useRef<NodeJS.Timeout>();

  // =====================================================================================
  // UTILIDADES
  // =====================================================================================
  
  const handleError = useCallback((error: any, context: string) => {
    console.error(`Arsenal Educativo - ${context}:`, error);
    setError(`Error en ${context}: ${error.message || 'Error desconocido'}`);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // =====================================================================================
  // CACHE NEURAL METHODS
  // =====================================================================================
  
  const getCacheData = useCallback(async (sessionKey: string): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();
      
      const data = await service.getNeuralCacheData(sessionKey);
      if (data) {
        setCacheData(prev => ({ ...prev, [sessionKey]: data }));
      }
    } catch (err) {
      handleError(err, 'obtener datos del cache');
    } finally {
      setIsLoading(false);
    }
  }, [service, handleError, clearError]);

  const updateCache = useCallback(async (sessionKey: string, data: Record<string, any>): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();
      
      await service.updateCacheData(sessionKey, data);
      setCacheData(prev => ({ ...prev, [sessionKey]: data }));
      
      // Actualizar métricas de performance
      const performance = await service.getCachePerformance();
      setCachePerformance(performance);
    } catch (err) {
      handleError(err, 'actualizar cache');
    } finally {
      setIsLoading(false);
    }
  }, [service, handleError, clearError]);

  // =====================================================================================
  // ANALYTICS METHODS
  // =====================================================================================
  
  const trackUserMetric = useCallback(async (
    type: string, 
    value: number, 
    context?: Record<string, any>
  ): Promise<void> => {
    try {
      await service.trackMetric(type, value, context);
      
      // Refrescar métricas después de tracking
      const updatedAnalytics = await service.getRealTimeMetrics();
      setAnalytics(updatedAnalytics);
    } catch (err) {
      handleError(err, 'rastrear métrica');
    }
  }, [service, handleError]);

  const refreshAnalytics = useCallback(async (): Promise<void> => {
    try {
      const [analyticsData, trendsData] = await Promise.all([
        service.getRealTimeMetrics(),
        service.getEngagementTrends()
      ]);
      
      setAnalytics(analyticsData);
      setEngagementTrends(trendsData);
    } catch (err) {
      handleError(err, 'actualizar analytics');
    }
  }, [service, handleError]);

  // =====================================================================================
  // HUD METHODS
  // =====================================================================================
  
  const startHUD = useCallback(async (config?: Record<string, any>): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();
      
      const session = await service.startHUDSession(config);
      setHudSession(session);
      
      // Obtener alertas iniciales
      const alerts = await service.getHUDAlerts();
      setHudAlerts(alerts);
    } catch (err) {
      handleError(err, 'iniciar sesión HUD');
    } finally {
      setIsLoading(false);
    }
  }, [service, handleError, clearError]);

  const updateHUDData = useCallback(async (metrics: Record<string, any>): Promise<void> => {
    try {
      await service.updateHUDMetrics(metrics);
      
      // Actualizar sesión local
      if (hudSession) {
        setHudSession(prev => prev ? {
          ...prev,
          performance_metrics: metrics,
          optimization_score: metrics.optimization_score || prev.optimization_score
        } : null);
      }
    } catch (err) {
      handleError(err, 'actualizar HUD');
    }
  }, [service, hudSession, handleError]);

  const refreshHUD = useCallback(async (): Promise<void> => {
    try {
      const [session, alerts] = await Promise.all([
        service.getActiveHUDSession(),
        service.getHUDAlerts()
      ]);
      
      setHudSession(session);
      setHudAlerts(alerts);
    } catch (err) {
      handleError(err, 'actualizar HUD');
    }
  }, [service, handleError]);

  // =====================================================================================
  // NOTIFICATIONS METHODS
  // =====================================================================================
  
  const markNotificationRead = useCallback(async (id: string): Promise<void> => {
    try {
      await service.markAsRead(id);
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      handleError(err, 'marcar notificación como leída');
    }
  }, [service, handleError]);

  const sendNotification = useCallback(async (notification: Partial<SmartNotification>): Promise<void> => {
    try {
      const newNotification = await service.createNotification(notification);
      setNotifications(prev => [newNotification, ...prev]);
      
      if (!newNotification.is_read) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (err) {
      handleError(err, 'enviar notificación');
    }
  }, [service, handleError]);

  const refreshNotifications = useCallback(async (): Promise<void> => {
    try {
      const allNotifications = await service.getNotifications();
      const unreadNotifications = allNotifications.filter(n => !n.is_read);
      
      setNotifications(allNotifications);
      setUnreadCount(unreadNotifications.length);
    } catch (err) {
      handleError(err, 'actualizar notificaciones');
    }
  }, [service, handleError]);

  // =====================================================================================
  // PLAYLISTS METHODS
  // =====================================================================================
  
  const loadRecommendations = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();
      
      const recommendations = await service.getRecommendedPlaylists();
      setRecommendedPlaylists(recommendations);
    } catch (err) {
      handleError(err, 'cargar recomendaciones');
    } finally {
      setIsLoading(false);
    }
  }, [service, handleError, clearError]);

  const createNewPlaylist = useCallback(async (playlist: Partial<ExercisePlaylist>): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();
      
      const newPlaylist = await service.createPlaylist(playlist);
      setMyPlaylists(prev => [newPlaylist, ...prev]);
      setCurrentPlaylist(newPlaylist);
    } catch (err) {
      handleError(err, 'crear playlist');
    } finally {
      setIsLoading(false);
    }
  }, [service, handleError, clearError]);

  const loadPlaylistItems = useCallback(async (playlistId: string): Promise<void> => {
    try {
      const items = await service.getPlaylistItems(playlistId);
      setPlaylistItems(items);
    } catch (err) {
      handleError(err, 'cargar elementos de playlist');
    }
  }, [service, handleError]);

  // =====================================================================================
  // SUPERPAES METHODS
  // =====================================================================================
  
  const runSimulation = useCallback(async (type: SimulationType, data: any): Promise<string> => {
    try {
      setIsLoading(true);
      clearError();
      
      const simulationId = await service.createSimulation({
        simulation_type: type,
        current_scores: data.scores || {},
        simulation_parameters: data.parameters || {}
      });
      
      // Actualizar historial de simulaciones
      const history = await service.getSimulationHistory();
      setSimulations(history);
      
      return simulationId;
    } catch (err) {
      handleError(err, 'ejecutar simulación');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [service, handleError, clearError]);

  const getResults = useCallback(async (simulationId: string): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();
      
      const simulation = await service.getSimulationResults(simulationId);
      setCurrentSimulation(simulation);
      
      // Actualizar en el historial si existe
      setSimulations(prev => 
        prev.map(sim => sim.id === simulationId ? simulation : sim)
      );
    } catch (err) {
      handleError(err, 'obtener resultados de simulación');
    } finally {
      setIsLoading(false);
    }
  }, [service, handleError, clearError]);

  // =====================================================================================
  // EFECTOS
  // =====================================================================================
  
  // Inicialización
  useEffect(() => {
    if (autoStart) {
      const initialize = async () => {
        try {
          setIsLoading(true);
          
          // Cargar datos iniciales
          await Promise.allSettled([
            refreshAnalytics(),
            refreshNotifications(),
            loadRecommendations(),
            refreshHUD()
          ]);
          
          // Cargar métricas de cache
          const cachePerf = await service.getCachePerformance();
          setCachePerformance(cachePerf);
          
          // Cargar historial de simulaciones
          const simHistory = await service.getSimulationHistory();
          setSimulations(simHistory);
          
        } catch (err) {
          handleError(err, 'inicialización');
        } finally {
          setIsLoading(false);
        }
      };
      
      initialize();
    }
  }, [autoStart, service, refreshAnalytics, refreshNotifications, loadRecommendations, refreshHUD, handleError]);

  // Intervalos para actualizaciones automáticas
  useEffect(() => {
    if (config?.enableRealTimeAnalytics) {
      analyticsIntervalRef.current = setInterval(() => {
        refreshAnalytics();
      }, config?.analyticsUpdateInterval || 5000);
    }

    if (config?.enableHUD) {
      hudIntervalRef.current = setInterval(() => {
        refreshHUD();
      }, config?.hudRefreshRate || 1000);
    }

    return () => {
      if (analyticsIntervalRef.current) {
        clearInterval(analyticsIntervalRef.current);
      }
      if (hudIntervalRef.current) {
        clearInterval(hudIntervalRef.current);
      }
    };
  }, [config, refreshAnalytics, refreshHUD]);

  // =====================================================================================
  // RETURN OBJECT
  // =====================================================================================
  
  return {
    // Estados
    isLoading,
    error,
    
    // Cache Neural
    cacheData,
    cachePerformance,
    getCacheData,
    updateCache,

    // Analytics
    analytics,
    engagementTrends,
    trackUserMetric,

    // HUD
    hudSession,
    hudAlerts,
    startHUD,
    updateHUDData,

    // Notificaciones
    notifications,
    unreadCount,
    markNotificationRead,
    sendNotification,

    // Playlists
    recommendedPlaylists,
    myPlaylists,
    currentPlaylist,
    playlistItems,
    loadRecommendations,
    createNewPlaylist,

    // SuperPAES
    simulations,
    currentSimulation,
    runSimulation,
    getResults
  };
}

export default useArsenalEducativo;
