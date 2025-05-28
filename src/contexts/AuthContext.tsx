
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    // Sistema de autenticación de emergencia
    const initEmergencyAuth = async () => {
      try {
        const emergencyMode = (window as any).__EMERGENCY_MODE__;
        
        if (emergencyMode) {
          // Usuario mock para modo emergencia
          const mockUser: User = {
            id: 'emergency-user-001',
            email: 'emergency@paes.local'
          };
          
          const mockProfile: Profile = {
            id: 'emergency-user-001',
            name: 'Usuario Emergencia',
            email: 'emergency@paes.local',
            role: 'student'
          };
          
          setTimeout(() => {
            setUser(mockUser);
            setProfile(mockProfile);
            setIsLoading(false);
            console.log('🚨 Emergency auth activated');
          }, 100);
          
          return;
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
          
          // Por ahora, crear usuario guest
          const guestUser: User = {
            id: 'guest-user-001',
            email: 'guest@paes.local'
          };
          
          const guestProfile: Profile = {
            id: 'guest-user-001',
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

    initEmergencyAuth();
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
