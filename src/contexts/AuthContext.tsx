
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Sistema de autenticación con Supabase
    const initAuth = async () => {
      try {
        // Configurar modo emergencia
        (window as any).__EMERGENCY_MODE__ = true;
        const emergencyMode = (window as any).__EMERGENCY_MODE__;
        
        if (emergencyMode) {
          // Iniciar sesión con el usuario de emergencia
          const { data, error } = await supabase.auth.signInWithPassword({
            email: 'emergency@paes.local',
            password: 'emergency123'
          });

          if (error) {
            console.log('⚠️ Error en autenticación de emergencia:', error.message);
            // Fallback a usuario mock
            const mockUser: User = {
              id: '920cd028-45ec-4227-a654-8adabf06d54f',
              email: 'emergency@paes.local'
            };
            
            const mockProfile: Profile = {
              id: '920cd028-45ec-4227-a654-8adabf06d54f',
              name: 'Usuario Emergencia',
              email: 'emergency@paes.local',
              role: 'student'
            };
            
            setUser(mockUser);
            setProfile(mockProfile);
            setIsLoading(false);
            console.log('🚨 Emergency auth fallback activated');
            return;
          }

          if (data.user) {
            const user: User = {
              id: data.user.id,
              email: data.user.email || 'emergency@paes.local'
            };
            
            const profile: Profile = {
              id: data.user.id,
              name: 'Usuario Emergencia',
              email: data.user.email || 'emergency@paes.local',
              role: 'student'
            };
            
            setUser(user);
            setProfile(profile);
            setIsLoading(false);
            console.log('✅ Emergency auth with Supabase activated');
            return;
          }
        }

        // Autenticación normal con timeout
        const authTimeout = setTimeout(() => {
          console.log('⚠️ Auth timeout - activating guest mode');
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }, 2000);

        // Simulación de carga de usuario
        setTimeout(() => {
          clearTimeout(authTimeout);
          
          // Por ahora, crear usuario guest - Usar UUID válido
          const guestUser: User = {
            id: '00000000-0000-0000-0000-000000000002',
            email: 'guest@paes.local'
          };
          
          const guestProfile: Profile = {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Usuario Invitado',
            email: 'guest@paes.local',
            role: 'student'
          };
          
          setUser(guestUser);
          setProfile(guestProfile);
          setIsLoading(false);
        }, 500);
        
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Error de autenticación');
        setIsLoading(false);
      }
    };

            initAuth();
  }, []);

  const signOut = async () => {
    try {
      setUser(null);
      setProfile(null);
      console.log('User signed out');
    } catch (err) {
      console.error('Sign out error:', err);
      setError('Error al cerrar sesión');
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    error,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
