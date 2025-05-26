
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name: string;
  email?: string;
  role: 'student' | 'parent' | 'admin';
  target_career?: string;
  learning_phase?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    const loadUserProfile = async (userId: string, retryCount = 0) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.log('Profile not found or error:', error);
          
          // Si no existe el perfil, crear uno básico
          if (error.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                name: 'Usuario',
                email: user?.email || '',
                learning_phase: 'DIAGNOSIS'
              })
              .select()
              .single();

            if (!createError && newProfile && mounted) {
              setProfile({
                id: newProfile.id,
                name: newProfile.name || 'Usuario',
                email: newProfile.email,
                role: 'student',
                target_career: newProfile.target_career,
                learning_phase: newProfile.learning_phase
              });
            }
          }
          return;
        }

        if (data && mounted) {
          setProfile({
            id: data.id,
            name: data.name || 'Usuario',
            email: data.email,
            role: 'student',
            target_career: data.target_career,
            learning_phase: data.learning_phase
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        
        // Retry logic con backoff exponencial
        if (retryCount < 3 && mounted) {
          const delay = Math.pow(2, retryCount) * 1000;
          retryTimeout = setTimeout(() => {
            loadUserProfile(userId, retryCount + 1);
          }, delay);
        } else {
          setError('Error cargando perfil de usuario');
        }
      }
    };

    // Listener de auth con manejo de errores mejorado
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event);
        
        try {
          setSession(session);
          setUser(session?.user ?? null);
          setError(null);
          
          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setProfile(null);
          }
        } catch (err) {
          console.error('Error in auth state change:', err);
          setError('Error en autenticación');
        } finally {
          setIsLoading(false);
        }
      }
    );

    // Verificar sesión inicial con timeout
    const initTimeout = setTimeout(async () => {
      if (!mounted) return;
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError('Error obteniendo sesión');
          setIsLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error in initial session check:', err);
        setError('Error verificando sesión');
        setIsLoading(false);
      }
    }, 100);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(initTimeout);
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Error en login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Error en logout');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      login,
      logout,
      isLoading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};
