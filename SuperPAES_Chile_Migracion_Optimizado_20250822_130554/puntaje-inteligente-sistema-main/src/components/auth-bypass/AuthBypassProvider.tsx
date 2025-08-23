/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from 'react';
import type { User, Profile, AuthContextType } from '../../contexts/AuthContextDefinition';
import { AuthBypassContext } from '../../contexts/AuthBypassContext';
import { clearSupabaseStorage } from '../../utils/storage-utils';

export const AuthBypassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Limpiar storage inmediatamente
    clearSupabaseStorage();
    
    // Crear usuario guest inmediatamente
    const guestUser: User = {
      id: 'bypass-user-' + Date.now(),
      email: 'bypass@paes.local'
    };
    
    const guestProfile: Profile = {
      id: guestUser.id,
      name: 'Usuario Bypass',
      email: guestUser.email,
      role: 'student'
    };
    
    // Establecer usuario inmediatamente sin delay
    setUser(guestUser);
    setProfile(guestProfile);
    setIsLoading(false);
    
    console.log('ðŸš€ AuthBypass: Usuario guest creado inmediatamente');
  }, []);

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    clearSupabaseStorage();
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    error,
    signOut
  };

  return (
    <AuthBypassContext.Provider value={value}>
      {children}
    </AuthBypassContext.Provider>
  );
};


