
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserRelationship {
  id: string;
  parent_user_id: string;
  child_user_id: string;
  relationship_type: string;
  is_active: boolean;
  metadata: any;
  child_profile?: {
    name: string;
    email: string;
    target_career?: string;
    learning_phase?: string;
  };
}

interface UseUserRelationshipsReturn {
  children: UserRelationship[];
  isParent: boolean;
  parentId: string | null;
  isLoading: boolean;
  error: string | null;
  refreshRelationships: () => Promise<void>;
}

export const useUserRelationships = (): UseUserRelationshipsReturn => {
  const { user } = useAuth();
  const [children, setChildren] = useState<UserRelationship[]>([]);
  const [parentId, setParentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelationships = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Verificar si es padre (tiene hijos)
      const { data: childrenData, error: childrenError } = await supabase
        .from('user_relationships')
        .select(`
          *,
          child_profile:profiles!user_relationships_child_user_id_fkey(
            name,
            email,
            target_career,
            learning_phase
          )
        `)
        .eq('parent_user_id', user.id)
        .eq('is_active', true);

      if (childrenError) throw childrenError;

      // Verificar si es hijo (tiene padre)
      const { data: parentData, error: parentError } = await supabase
        .from('user_relationships')
        .select('parent_user_id')
        .eq('child_user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (parentError) throw parentError;

      setChildren(childrenData?.map(child => ({
        ...child,
        child_profile: child.child_profile
      })) || []);
      
      setParentId(parentData?.parent_user_id || null);

    } catch (err) {
      console.error('Error fetching user relationships:', err);
      setError('Error cargando relaciones familiares');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRelationships();
  }, [user?.id]);

  return {
    children,
    isParent: children.length > 0,
    parentId,
    isLoading,
    error,
    refreshRelationships: fetchRelationships
  };
};
