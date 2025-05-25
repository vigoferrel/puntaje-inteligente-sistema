
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

interface Profile {
  id: string;
  name: string;
  email?: string;
  role: 'student' | 'parent' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
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
  const [user, setUser] = useState<User | null>({
    id: 'demo-user',
    email: 'estudiante@demo.com',
    user_metadata: {
      name: 'Estudiante Demo',
      full_name: 'Estudiante Demo PAES'
    }
  });
  
  const [profile, setProfile] = useState<Profile | null>({
    id: 'demo-user',
    name: 'Estudiante Demo',
    email: 'estudiante@demo.com',
    role: 'student'
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simular login
    setTimeout(() => {
      setUser({ 
        id: 'demo-user', 
        email,
        user_metadata: {
          name: 'Estudiante Demo',
          full_name: 'Estudiante Demo PAES'
        }
      });
      setProfile({ 
        id: 'demo-user',
        name: 'Estudiante Demo', 
        email,
        role: 'student' 
      });
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      login,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
