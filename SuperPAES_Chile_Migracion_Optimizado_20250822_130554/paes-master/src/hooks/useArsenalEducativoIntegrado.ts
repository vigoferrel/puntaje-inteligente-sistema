/**
 * =====================================================================================
 * 🎯 HOOK ARSENAL EDUCATIVO INTEGRADO - REACT HOOK CON ESQUEMA ARSENAL_EDUCATIVO
 * =====================================================================================
 * Hook React integrado que funciona con el esquema arsenal_educativo en Supabase
 * Incluye todas las funcionalidades del Arsenal con integración Leonardo/VLR
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { ArsenalEducativoIntegradoService } from '../services/ArsenalEducativoIntegradoService'
import type {
  NeuralCacheSession,
  RealTimeMetric,
  HUDSession,
  SmartNotification,
  ExercisePlaylist,
  SuperPAESSimulation,
  IntegratedSystemStatus,
  EnhancedNeuralCacheData,
  EnhancedRealTimeMetrics,
  LeonardoCuratedPlaylists
} from '../types/ArsenalEducativo'

/**
 * Estado del hook integrado
 */
interface ArsenalIntegradoState {
  // Estados base
  isLoading: boolean
  error: string | null
  isInitialized: boolean

  // Estado del sistema integrado
  systemStatus: IntegratedSystemStatus | null
  leonardoCompatibility: {
    vigoleonrocksAvailable: boolean
    enhancedFunctionsReady: boolean
    quantumFeaturesActive: boolean
  } | null
  performanceStats: {
    totalCacheSessions: number
    totalMetrics: number
    activeHUDSessions: number
    leonardoNotifications: number
    quantumPlaylists: number
    enhancedSimulations: number
  } | null

  // Cache Neural integrado
  neuralCacheData: EnhancedNeuralCacheData | null
  cacheSessions: NeuralCacheSession[]

  // Analytics con Leonardo
  enhancedMetrics: EnhancedRealTimeMetrics | null
  realtimeMetrics: RealTimeMetric[]

  // HUD cuántico
  activeHUDSessions: HUDSession[]
  quantumState: Record<string, any> | null

  // Notificaciones Leonardo
  notifications: SmartNotification[]
  leonardoNotifications: SmartNotification[]
  unreadCount: number

  // Playlists curadas
  curatedPlaylists: LeonardoCuratedPlaylists | null
  userPlaylists: ExercisePlaylist[]
  quantumPlaylists: ExercisePlaylist[]

  // Simulaciones cuánticas
  quantumSimulations: SuperPAESSimulation[]
  enhancedSimulations: SuperPAESSimulation[]
}

/**
 * Configuración del hook
 */
interface UseArsenalIntegradoConfig {
  autoRefresh?: boolean
  refreshInterval?: number
  enableRealTime?: boolean
  quantumThreshold?: number
  leonardoIntegration?: boolean
}

/**
 * =====================================================================================
 * HOOK ARSENAL EDUCATIVO INTEGRADO
 * =====================================================================================
 */
export function useArsenalEducativoIntegrado(
  config: UseArsenalIntegradoConfig = {}
) {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 segundos
    enableRealTime = true,
    quantumThreshold = 0.8,
    leonardoIntegration = true
  } = config

  // Estados
  const [state, setState] = useState<ArsenalIntegradoState>({
    isLoading: true,
    error: null,
    isInitialized: false,
    systemStatus: null,
    leonardoCompatibility: null,
    performanceStats: null,
    neuralCacheData: null,
    cacheSessions: [],
    enhancedMetrics: null,
    realtimeMetrics: [],
    activeHUDSessions: [],
    quantumState: null,
    notifications: [],
    leonardoNotifications: [],
    unreadCount: 0,
    curatedPlaylists: null,
    userPlaylists: [],
    quantumPlaylists: [],
    quantumSimulations: [],
    enhancedSimulations: []
  })

  // Referencias
  const serviceRef = useRef<ArsenalEducativoIntegradoService | null>(null)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Inicializar el servicio
   */
  const initializeService = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      // Obtener credenciales del entorno
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
      const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Credenciales de Supabase no configuradas')
      }

      // Crear servicio integrado
      serviceRef.current = new ArsenalEducativoIntegradoService(
        supabaseUrl,
        supabaseKey,
        {
          leonardoIntegration,
          quantumProcessing: true,
          vigoleonrocksCompatible: true,
          schema: 'arsenal_educativo'
        }
      )

      // Verificar estado del sistema
      const systemStatus = await serviceRef.current.getIntegratedSystemStatus()
      const compatibility = await serviceRef.current.checkLeonardoCompatibility()
      const stats = await serviceRef.current.getIntegratedPerformanceStats()

      setState(prev => ({
        ...prev,
        isInitialized: true,
        systemStatus,
        leonardoCompatibility: compatibility,
        performanceStats: stats
      }))

      console.log('✅ Arsenal Educativo Integrado inicializado')
    } catch (error) {
      console.error('❌ Error inicializando Arsenal Integrado:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [leonardoIntegration])

  /**
   * Refrescar todos los datos
   */
  const refreshData = useCallback(async () => {
    if (!serviceRef.current || state.isLoading) return

    try {
      setState(prev => ({ ...prev, isLoading: true }))

      const [
        systemStatus,
        compatibility,
        stats,
        notifications,
        quantumNotifications
      ] = await Promise.all([
        serviceRef.current.getIntegratedSystemStatus(),
        serviceRef.current.checkLeonardoCompatibility(),
        serviceRef.current.getIntegratedPerformanceStats(),
        serviceRef.current.getQuantumNotifications(false, 0.5),
        serviceRef.current.getQuantumNotifications(true, quantumThreshold)
      ])

      setState(prev => ({
        ...prev,
        systemStatus,
        leonardoCompatibility: compatibility,
        performanceStats: stats,
        notifications,
        leonardoNotifications: quantumNotifications,
        unreadCount: notifications.filter(n => !n.isRead).length
      }))

    } catch (error) {
      console.error('Error refrescando datos:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error refrescando datos'
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [quantumThreshold, state.isLoading])

  /**
   * Configurar auto-refresh
   */
  const setupAutoRefresh = useCallback(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(refreshData, refreshInterval)
    }
  }, [autoRefresh, refreshInterval, refreshData])

  /**
   * Limpiar auto-refresh
   */
  const clearAutoRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = null
    }
  }, [])

  // =====================================================================================
  // MÉTODOS NEURAL CACHE CON LEONARDO
  // =====================================================================================

  const getEnhancedNeuralCache = useCallback(async (
    sessionKey: string,
    leonardoContext: Record<string, any> = {}
  ) => {
    if (!serviceRef.current) return null

    try {
      setState(prev => ({ ...prev, isLoading: true }))
      const cacheData = await serviceRef.current.getEnhancedNeuralCacheData(
        sessionKey,
        leonardoContext
      )
      setState(prev => ({ ...prev, neuralCacheData: cacheData }))
      return cacheData
    } catch (error) {
      console.error('Error obteniendo cache neural:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error en cache neural' 
      }))
      return null
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const createNeuralCacheSession = useCallback(async (
    sessionData: Partial<NeuralCacheSession>
  ) => {
    if (!serviceRef.current) return null

    try {
      const sessionId = await serviceRef.current.createNeuralCacheSession(sessionData)
      await refreshData() // Refrescar datos después de crear
      return sessionId
    } catch (error) {
      console.error('Error creando sesión cache:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error creando sesión' 
      }))
      return null
    }
  }, [refreshData])

  const updateNeuralCache = useCallback(async (
    sessionKey: string,
    cacheData: Record<string, any>,
    neuralPatterns?: Record<string, any>
  ) => {
    if (!serviceRef.current) return

    try {
      await serviceRef.current.updateNeuralCacheData(sessionKey, cacheData, neuralPatterns)
      await refreshData()
    } catch (error) {
      console.error('Error actualizando cache:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error actualizando cache' 
      }))
    }
  }, [refreshData])

  // =====================================================================================
  // MÉTODOS ANALYTICS CON LEONARDO
  // =====================================================================================

  const getEnhancedAnalytics = useCallback(async (
    includeLeonardo: boolean = true
  ) => {
    if (!serviceRef.current) return null

    try {
      setState(prev => ({ ...prev, isLoading: true }))
      const metrics = await serviceRef.current.getEnhancedRealTimeMetrics(includeLeonardo)
      setState(prev => ({ ...prev, enhancedMetrics: metrics }))
      return metrics
    } catch (error) {
      console.error('Error obteniendo analytics mejoradas:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error en analytics' 
      }))
      return null
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const recordLeonardoMetric = useCallback(async (
    metricType: string,
    value: number,
    context: Record<string, any> = {},
    leonardoCorrelation?: Record<string, any>
  ) => {
    if (!serviceRef.current) return null

    try {
      const metricId = await serviceRef.current.recordMetricWithLeonardoCorrelation(
        metricType,
        value,
        context,
        leonardoCorrelation
      )
      await refreshData()
      return metricId
    } catch (error) {
      console.error('Error registrando métrica Leonardo:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error registrando métrica' 
      }))
      return null
    }
  }, [refreshData])

  // =====================================================================================
  // MÉTODOS HUD CUÁNTICO
  // =====================================================================================

  const createQuantumHUD = useCallback(async (
    hudConfig: Record<string, any> = {},
    quantumState?: Record<string, any>
  ) => {
    if (!serviceRef.current) return null

    try {
      const sessionId = await serviceRef.current.createQuantumHUDSession(hudConfig, quantumState)
      await refreshData()
      return sessionId
    } catch (error) {
      console.error('Error creando HUD cuántico:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error creando HUD' 
      }))
      return null
    }
  }, [refreshData])

  const updateQuantumState = useCallback(async (
    sessionId: string,
    quantumState: Record<string, any>,
    leonardoInsights?: Record<string, any>
  ) => {
    if (!serviceRef.current) return

    try {
      await serviceRef.current.updateQuantumHUDState(sessionId, quantumState, leonardoInsights)
      setState(prev => ({ ...prev, quantumState }))
      await refreshData()
    } catch (error) {
      console.error('Error actualizando estado cuántico:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error actualizando HUD' 
      }))
    }
  }, [refreshData])

  // =====================================================================================
  // MÉTODOS NOTIFICACIONES LEONARDO
  // =====================================================================================

  const createLeonardoNotification = useCallback(async (
    title: string,
    message: string,
    type: 'leonardo_insight' | 'achievement' | 'recommendation' = 'leonardo_insight',
    priority: 'low' | 'medium' | 'high' | 'critical' | 'quantum' = 'medium',
    quantumCoherence: number = 1.0
  ) => {
    if (!serviceRef.current) return null

    try {
      const notificationId = await serviceRef.current.createLeonardoNotification(
        title,
        message,
        type,
        priority,
        quantumCoherence
      )
      await refreshData()
      return notificationId
    } catch (error) {
      console.error('Error creando notificación Leonardo:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error creando notificación' 
      }))
      return null
    }
  }, [refreshData])

  // =====================================================================================
  // MÉTODOS PLAYLISTS LEONARDO
  // =====================================================================================

  const getCuratedPlaylists = useCallback(async (
    subjects?: string[],
    difficulty: string = 'mixed'
  ) => {
    if (!serviceRef.current) return null

    try {
      setState(prev => ({ ...prev, isLoading: true }))
      const playlists = await serviceRef.current.getLeonardoCuratedPlaylists(
        subjects,
        difficulty,
        quantumThreshold
      )
      setState(prev => ({ ...prev, curatedPlaylists: playlists }))
      return playlists
    } catch (error) {
      console.error('Error obteniendo playlists curadas:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error en playlists' 
      }))
      return null
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [quantumThreshold])

  const createLeonardoPlaylist = useCallback(async (
    title: string,
    description: string,
    subjects: string[],
    quantumAlignment: number = 0.95
  ) => {
    if (!serviceRef.current) return null

    try {
      const playlistId = await serviceRef.current.createLeonardoOptimizedPlaylist(
        title,
        description,
        subjects,
        'leonardo_curated',
        quantumAlignment
      )
      await refreshData()
      return playlistId
    } catch (error) {
      console.error('Error creando playlist Leonardo:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error creando playlist' 
      }))
      return null
    }
  }, [refreshData])

  // =====================================================================================
  // MÉTODOS SIMULACIONES CUÁNTICAS
  // =====================================================================================

  const createQuantumSimulation = useCallback(async (
    simulationData: {
      currentScores: Record<string, number>
      simulationType?: 'predictive' | 'vocational' | 'quantum_monte_carlo'
      parameters?: Record<string, any>
    }
  ) => {
    if (!serviceRef.current) return null

    try {
      const simulationId = await serviceRef.current.createEnhancedPAESSimulation(
        simulationData,
        leonardoIntegration,
        true
      )
      await refreshData()
      return simulationId
    } catch (error) {
      console.error('Error creando simulación cuántica:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error creando simulación' 
      }))
      return null
    }
  }, [leonardoIntegration, refreshData])

  const getQuantumSimulations = useCallback(async () => {
    if (!serviceRef.current) return []

    try {
      setState(prev => ({ ...prev, isLoading: true }))
      const simulations = await serviceRef.current.getQuantumPAESSimulations(quantumThreshold)
      setState(prev => ({ ...prev, quantumSimulations: simulations }))
      return simulations
    } catch (error) {
      console.error('Error obteniendo simulaciones cuánticas:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error en simulaciones' 
      }))
      return []
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [quantumThreshold])

  // =====================================================================================
  // UTILIDADES
  // =====================================================================================

  const performMaintenance = useCallback(async () => {
    if (!serviceRef.current) return

    try {
      await serviceRef.current.performIntegratedMaintenance()
      await refreshData()
      console.log('✅ Mantenimiento integrado completado')
    } catch (error) {
      console.error('Error en mantenimiento:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error en mantenimiento' 
      }))
    }
  }, [refreshData])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // =====================================================================================
  // EFFECTS
  // =====================================================================================

  // Inicialización
  useEffect(() => {
    initializeService()
    return () => {
      clearAutoRefresh()
    }
  }, [initializeService, clearAutoRefresh])

  // Auto-refresh
  useEffect(() => {
    if (state.isInitialized && !state.error) {
      setupAutoRefresh()
      return clearAutoRefresh
    }
  }, [state.isInitialized, state.error, setupAutoRefresh, clearAutoRefresh])

  // Refresh inicial
  useEffect(() => {
    if (state.isInitialized && !state.isLoading) {
      refreshData()
    }
  }, [state.isInitialized, refreshData])

  // =====================================================================================
  // RETURN
  // =====================================================================================

  return {
    // Estado
    ...state,

    // Métodos generales
    refresh: refreshData,
    initialize: initializeService,
    clearError,
    performMaintenance,

    // Neural Cache con Leonardo
    getEnhancedNeuralCache,
    createNeuralCacheSession,
    updateNeuralCache,

    // Analytics con Leonardo
    getEnhancedAnalytics,
    recordLeonardoMetric,

    // HUD Cuántico
    createQuantumHUD,
    updateQuantumState,

    // Notificaciones Leonardo
    createLeonardoNotification,

    // Playlists Leonardo
    getCuratedPlaylists,
    createLeonardoPlaylist,

    // Simulaciones Cuánticas
    createQuantumSimulation,
    getQuantumSimulations,

    // Utilidades computadas
    isSystemHealthy: state.systemStatus?.system_health === 'excellent',
    isLeonardoActive: state.leonardoCompatibility?.vigoleonrocksAvailable || false,
    isQuantumReady: state.leonardoCompatibility?.quantumFeaturesActive || false,
    totalActiveFeatures: [
      state.performanceStats?.totalCacheSessions,
      state.performanceStats?.activeHUDSessions,
      state.performanceStats?.leonardoNotifications,
      state.performanceStats?.quantumPlaylists
    ].filter(Boolean).length,

    // Configuración
    config: {
      autoRefresh,
      refreshInterval,
      enableRealTime,
      quantumThreshold,
      leonardoIntegration
    }
  }
}

export default useArsenalEducativoIntegrado
