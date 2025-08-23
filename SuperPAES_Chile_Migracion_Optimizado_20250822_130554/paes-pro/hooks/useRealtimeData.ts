'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { 
  subscribeToUserProgress, 
  subscribeToLearningNodes,
  getReusableClient,
  executeWithRetry 
} from '@/lib/supabase'

interface RealtimeConfig {
  enableUserProgress?: boolean
  enableLearningNodes?: boolean
  userId?: string
  onError?: (error: any) => void
  throttleMs?: number
}

interface RealtimeState<T> {
  data: T | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  isConnected: boolean
}

export function useRealtimeData<T = any>(config: RealtimeConfig = {}): RealtimeState<T> {
  const {
    enableUserProgress = false,
    enableLearningNodes = false,
    userId,
    onError,
    throttleMs = 1000
  } = config

  const [state, setState] = useState<RealtimeState<T>>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
    isConnected: false
  })

  const unsubscribeRefs = useRef<(() => void)[]>([])
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const throttledUpdate = useCallback((newData: T) => {
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current)
    }

    throttleTimeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        data: newData,
        lastUpdated: new Date(),
        loading: false
      }))
    }, throttleMs)
  }, [throttleMs])

  const handleRealtimeUpdate = useCallback((payload: any) => {
    try {
      console.log('Realtime update received:', payload)
      
      const { eventType, new: newRecord, old: oldRecord } = payload
      
      setState(prev => {
        let updatedData = prev.data
        
        // Lógica para actualizar datos según el tipo de evento
        switch (eventType) {
          case 'INSERT':
            if (Array.isArray(prev.data)) {
              updatedData = [...prev.data, newRecord] as T
            } else {
              updatedData = newRecord as T
            }
            break
            
          case 'UPDATE':
            if (Array.isArray(prev.data)) {
              updatedData = (prev.data as any[]).map(item => 
                item.id === newRecord.id ? newRecord : item
              ) as T
            } else {
              updatedData = newRecord as T
            }
            break
            
          case 'DELETE':
            if (Array.isArray(prev.data)) {
              updatedData = (prev.data as any[]).filter(item => 
                item.id !== oldRecord.id
              ) as T
            } else {
              updatedData = null
            }
            break
            
          default:
            updatedData = prev.data
        }
        
        return {
          ...prev,
          data: updatedData,
          lastUpdated: new Date(),
          isConnected: true
        }
      })
      
    } catch (error) {
      console.error('Error handling realtime update:', error)
      onError?.(error)
      setState(prev => ({
        ...prev,
        error: 'Error processing realtime update',
        isConnected: false
      }))
    }
  }, [onError])

  // Función para cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    if (!enableUserProgress && !enableLearningNodes) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const client = getReusableClient('realtime-initial')
      
      if (enableUserProgress && userId) {
        const data = await executeWithRetry(async () => {
          return await client
            .from('user_progress')
            .select(`
              *,
              learning_nodes (
                id,
                name,
                test_type,
                skill,
                difficulty
              )
            `)
            .eq('user_id', userId)
            .order('node_id')
        })
        
        setState(prev => ({
          ...prev,
          data: data as T,
          loading: false,
          lastUpdated: new Date()
        }))
      }
      
      if (enableLearningNodes) {
        const data = await executeWithRetry(async () => {
          return await client
            .from('learning_nodes')
            .select('*')
            .eq('is_active', true)
            .order('position')
        })
        
        setState(prev => ({
          ...prev,
          data: data as T,
          loading: false,
          lastUpdated: new Date()
        }))
      }
      
    } catch (error: any) {
      console.error('Error loading initial realtime data:', error)
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }))
      onError?.(error)
    }
  }, [enableUserProgress, enableLearningNodes, userId, onError])

  useEffect(() => {
    // Limpiar suscripciones anteriores
    unsubscribeRefs.current.forEach(unsubscribe => unsubscribe())
    unsubscribeRefs.current = []

    // Cargar datos iniciales
    loadInitialData()

    // Configurar suscripciones en tiempo real
    if (enableUserProgress && userId) {
      try {
        const unsubscribeUserProgress = subscribeToUserProgress(userId, handleRealtimeUpdate)
        unsubscribeRefs.current.push(unsubscribeUserProgress)
        
        setState(prev => ({ ...prev, isConnected: true }))
      } catch (error) {
        console.error('Error subscribing to user progress:', error)
        onError?.(error)
      }
    }

    if (enableLearningNodes) {
      try {
        const unsubscribeLearningNodes = subscribeToLearningNodes(handleRealtimeUpdate)
        unsubscribeRefs.current.push(unsubscribeLearningNodes)
        
        setState(prev => ({ ...prev, isConnected: true }))
      } catch (error) {
        console.error('Error subscribing to learning nodes:', error)
        onError?.(error)
      }
    }

    return () => {
      // Cleanup
      unsubscribeRefs.current.forEach(unsubscribe => unsubscribe())
      unsubscribeRefs.current = []
      
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }
      
      setState(prev => ({ ...prev, isConnected: false }))
    }
  }, [enableUserProgress, enableLearningNodes, userId, handleRealtimeUpdate, loadInitialData])

  return state
}

// Hook especializado para el progreso del usuario
export function useUserProgressRealtime(userId: string) {
  return useRealtimeData({
    enableUserProgress: true,
    userId,
    throttleMs: 500 // Actualizar más frecuentemente para el progreso
  })
}

// Hook especializado para nodos de aprendizaje
export function useLearningNodesRealtime() {
  return useRealtimeData({
    enableLearningNodes: true,
    throttleMs: 2000 // Menos frecuente para nodos
  })
}

// Hook para monitorear múltiples tipos de datos
export function useMultiRealtimeData(userId: string) {
  return useRealtimeData({
    enableUserProgress: true,
    enableLearningNodes: true,
    userId,
    throttleMs: 1000
  })
}
