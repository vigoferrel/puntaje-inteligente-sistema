import { useEffect } from 'react'
import { useRealtimeStore } from '@/lib/store/realtime'
import { useThemeStore } from '@/lib/store/theme'

interface RealtimeSyncOptions {
  userId: string
  onUserProgressUpdate?: (payload: any) => void
  onPracticeSessionUpdate?: (payload: any) => void
}

export function useRealtimeSync({ 
  userId,
  onUserProgressUpdate,
  onPracticeSessionUpdate
}: RealtimeSyncOptions) {
  const { subscribeToTable, unsubscribeFromTable } = useRealtimeStore()

  useEffect(() => {
    // Suscribirse a actualizaciones de progreso del usuario
    if (onUserProgressUpdate) {
      subscribeToTable('user_progress', (payload) => {
        if (payload.new.user_id === userId) {
          onUserProgressUpdate(payload)
        }
      })
    }

    // Suscribirse a actualizaciones de sesiones de práctica
    if (onPracticeSessionUpdate) {
      subscribeToTable('practice_sessions', (payload) => {
        if (payload.new.user_id === userId) {
          onPracticeSessionUpdate(payload)
        }
      })
    }

    // Limpiar suscripciones al desmontar
    return () => {
      if (onUserProgressUpdate) {
        unsubscribeFromTable('user_progress')
      }
      if (onPracticeSessionUpdate) {
        unsubscribeFromTable('practice_sessions')
      }
    }
  }, [userId, subscribeToTable, unsubscribeFromTable, onUserProgressUpdate, onPracticeSessionUpdate])
}

// Hook para sincronizar el tema entre pestañas/ventanas
export function useThemeSync() {
  const { isDark, toggleTheme } = useThemeStore()

  useEffect(() => {
    const channel = new BroadcastChannel('theme-sync')
    
    channel.onmessage = (event) => {
      if (event.data.type === 'THEME_CHANGE' && event.data.isDark !== isDark) {
        toggleTheme()
      }
    }

    return () => channel.close()
  }, [isDark, toggleTheme])

  useEffect(() => {
    const channel = new BroadcastChannel('theme-sync')
    channel.postMessage({ type: 'THEME_CHANGE', isDark })
    return () => channel.close()
  }, [isDark])
}