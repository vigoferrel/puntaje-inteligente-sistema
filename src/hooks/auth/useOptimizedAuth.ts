
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { OptimizedRLSService } from '@/services/database/optimized-rls-service';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
}

export const useOptimizedAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false
  });

  const checkAdminStatus = useCallback(async (user: User | null) => {
    if (!user) {
      setAuthState(prev => ({ ...prev, isAdmin: false }));
      return;
    }

    try {
      const isAdmin = await OptimizedRLSService.isCurrentUserAdmin();
      setAuthState(prev => ({ ...prev, isAdmin }));
    } catch (error) {
      console.error('Error checking admin status:', error);
      setAuthState(prev => ({ ...prev, isAdmin: false }));
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Configurar listener de cambios de auth PRIMERO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔐 Auth state change:', event);
        
        const user = session?.user ?? null;
        
        setAuthState(prev => ({
          ...prev,
          user,
          session,
          loading: false
        }));

        // Invalidar cache en cambios de autenticación
        OptimizedRLSService.invalidateUserCache();
        
        // Verificar status de admin de forma asíncrona
        if (user) {
          setTimeout(() => checkAdminStatus(user), 0);
        } else {
          setAuthState(prev => ({ ...prev, isAdmin: false }));
        }
      }
    );

    // LUEGO obtener sesión existente
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
      }
      
      const user = session?.user ?? null;
      
      setAuthState(prev => ({
        ...prev,
        user,
        session,
        loading: false
      }));

      if (user) {
        setTimeout(() => checkAdminStatus(user), 0);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  const signOut = useCallback(async () => {
    try {
      OptimizedRLSService.invalidateUserCache();
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  return {
    ...authState,
    signOut,
    refreshAuth: () => checkAdminStatus(authState.user)
  };
};
