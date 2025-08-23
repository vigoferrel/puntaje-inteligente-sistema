'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  createBrowserSupabaseClient, 
  executeWithRetry, 
  getReusableClient,
  testSupabaseConnection 
} from '@/lib/supabase'
import { 
  User, 
  AuthContextType, 
  LoginCredentials, 
  RegisterCredentials, 
  UserUpdate,
  AuthError 
} from '@/types/auth'
import { Session } from '@supabase/supabase-js'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [connectionHealth, setConnectionHealth] = useState<boolean | null>(null)
  const router = useRouter()
  
  // Cliente optimizado para browser
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    // Prueba inicial de conectividad
    const checkConnectionHealth = async () => {
      const health = await testSupabaseConnection()
      setConnectionHealth(health.isHealthy)
      
      if (!health.isHealthy) {
        console.warn('Supabase connection issues detected:', health.error)
      }
    }
    
    checkConnectionHealth()
    
    // Obtener sesión inicial con retry
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting initial session:', error)
          return
        }

        if (initialSession) {
          setSession(initialSession)
          await loadUserProfile(initialSession.user.id)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()
    
    // Monitorear salud de la conexión cada 5 minutos
    const healthCheckInterval = setInterval(checkConnectionHealth, 300000)

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.id)
        
        setSession(session)
        
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setUser(null)
        }
        
        setLoading(false)

        // Redirigir según el evento
        if (event === 'SIGNED_OUT') {
          router.push('/login')
        } else if (event === 'SIGNED_IN' && session) {
          router.push('/dashboard')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      clearInterval(healthCheckInterval)
    }
  }, [router])

  const loadUserProfile = async (userId: string) => {
    try {
      const data = await executeWithRetry(async () => {
        return await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()
      })
      
      setUser(data)
      return data
    } catch (error: any) {
      console.error('Error in loadUserProfile:', error)
      
      // Si es un error de "usuario no encontrado", no es crítico
      if (error.code === 'PGRST116') {
        console.info('User profile not found - user might be newly registered')
        return null
      }
      
      throw error
    }
  }

  const signIn = async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        throw new Error(error.message)
      }

      // Actualizar último login
      if (data.user) {
        await supabase
          .from('users')
          .update({ 
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', data.user.id)
      }

    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (credentials: RegisterCredentials) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.full_name,
          },
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      // Crear perfil de usuario en la tabla users
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: credentials.email,
            full_name: credentials.full_name,
            grade_level: credentials.grade_level || null,
            region: credentials.region || null,
            city: credentials.city || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            total_study_minutes: 0,
            current_streak_days: 0,
            max_streak_days: 0,
            is_active: true,
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          throw new Error('Error creando perfil de usuario')
        }
      }

    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw new Error(error.message)
      }

      setUser(null)
      setSession(null)
      
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw new Error(error.message)
      }

    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  const updateProfile = async (data: Partial<UserUpdate>) => {
    try {
      if (!user) throw new Error('No user logged in')

      setLoading(true)

      const { error } = await supabase
        .from('users')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) {
        throw new Error(error.message)
      }

      // Recargar perfil del usuario
      await loadUserProfile(user.id)

    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}