
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/hooks/use-user-data";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        // Map the database profile to our UserProfile type
        // This is a simplified version as we'll need to handle the full UserProfile structure
        const userProfile: UserProfile = {
          id: data.id,
          name: data.name || 'Usuario',
          email: data.email || '',
          targetCareer: data.target_career || undefined,
          skillLevels: {
            SOLVE_PROBLEMS: 0.3,
            REPRESENT: 0.4,
            MODEL: 0.5,
            INTERPRET_RELATE: 0.35,
            EVALUATE_REFLECT: 0.45,
            TRACK_LOCATE: 0.6,
            ARGUE_COMMUNICATE: 0.4,
            IDENTIFY_THEORIES: 0.3,
            PROCESS_ANALYZE: 0.5,
            APPLY_PRINCIPLES: 0.45,
            SCIENTIFIC_ARGUMENT: 0.3,
            TEMPORAL_THINKING: 0.5,
            SOURCE_ANALYSIS: 0.6,
            MULTICAUSAL_ANALYSIS: 0.4,
            CRITICAL_THINKING: 0.5,
            REFLECTION: 0.45
          },
          progress: {
            completedNodes: [],
            completedExercises: 0,
            correctExercises: 0,
            totalTimeMinutes: 0
          }
        };
        
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
