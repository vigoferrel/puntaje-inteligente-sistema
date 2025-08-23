import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface RealtimeState {
  channels: Record<string, RealtimeChannel>
  subscribeToTable: (tableName: string, callback: (payload: any) => void) => void
  unsubscribeFromTable: (tableName: string) => void
}

export const useRealtimeStore = create<RealtimeState>()((set, get) => ({
  channels: {},

  subscribeToTable: (tableName: string, callback: (payload: any) => void) => {
    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          console.log('Cambio en tiempo real:', payload)
          callback(payload)
        }
      )
      .subscribe((status) => {
        console.log(`Supabase Realtime status para ${tableName}:`, status)
      })

    set((state) => ({
      channels: {
        ...state.channels,
        [tableName]: channel,
      },
    }))
  },

  unsubscribeFromTable: (tableName: string) => {
    const { channels } = get()
    const channel = channels[tableName]
    
    if (channel) {
      channel.unsubscribe()
      set((state) => {
        const newChannels = { ...state.channels }
        delete newChannels[tableName]
        return { channels: newChannels }
      })
    }
  },
}))