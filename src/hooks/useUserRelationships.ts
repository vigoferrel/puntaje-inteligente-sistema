
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

      // Verificar si es padre (tiene hijos) - consulta separada
      const { data: relationshipsData, error: relationshipsError } = await supabase
        .from('user_relationships')
        .select('*')
        .eq('parent_user_id', user.id)
        .eq('is_active', true);

      if (relationshipsError) throw relationshipsError;

      // Si hay relaciones, obtener los perfiles de los hijos
      let childrenWithProfiles: UserRelationship[] = [];
      
      if (relationshipsData && relationshipsData.length > 0) {
        const childUserIds = relationshipsData.map(rel => rel.child_user_id);
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email, target_career, learning_phase')
          .in('id', childUserIds);

        if (profilesError) {
          console.warn('Error fetching child profiles:', profilesError);
        }

        // Combinar datos manualmente
        childrenWithProfiles = relationshipsData.map(relationship => ({
          ...relationship,
          child_profile: profilesData?.find(profile => profile.id === relationship.child_user_id) || {
            name: 'Estudiante',
            email: 'No disponible'
          }
        }));
      }

      // Verificar si es hijo (tiene padre)
      const { data: parentData, error: parentError } = await supabase
        .from('user_relationships')
        .select('parent_user_id')
        .eq('child_user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (parentError) throw parentError;

      setChildren(childrenWithProfiles);
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
