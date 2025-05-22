
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { initializeRLSPolicies } from "@/services/database/rls-service";
import { mapEnumToSkillId, mapEnumToTestId } from "@/utils/supabase-mappers";
import { v4 as uuidv4 } from 'uuid';

// Using proper UUID generation instead of hardcoded strings
const initialLearningNodes = [
  {
    id: uuidv4(), // Generate valid UUID
    title: 'Introducción a la Competencia Lectora',
    description: 'Aprende los fundamentos de la competencia lectora y cómo abordar diferentes tipos de textos.',
    code: 'INTRO_LECTORA',
    position: 1,
    skill_id: 15, // CRITICAL_THINKING
    test_id: 1, // COMPETENCIA_LECTORA
    depends_on: [],
    difficulty: 'basic' as const,
    estimated_time_minutes: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(), // Generate valid UUID
    title: 'Resolución de Problemas Matemáticos',
    description: 'Desarrolla tus habilidades para resolver problemas matemáticos complejos paso a paso.',
    code: 'PROB_MATEMATICOS',
    position: 1,
    skill_id: 4, // SOLVE_PROBLEMS
    test_id: 2, // MATEMATICA_1
    depends_on: [],
    difficulty: 'basic' as const,
    estimated_time_minutes: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(), // Generate valid UUID
    title: 'Análisis de Datos Científicos',
    description: 'Aprende a interpretar y analizar datos científicos para extraer conclusiones significativas.',
    code: 'ANAL_CIENTIFICOS',
    position: 1,
    skill_id: 9, // PROCESS_ANALYZE
    test_id: 4, // CIENCIAS
    depends_on: [],
    difficulty: 'basic' as const,
    estimated_time_minutes: 60,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const ensureLearningNodesExist = async (): Promise<boolean> => {
  try {
    // First check if the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Usuario no autenticado. Se requiere autenticación para inicializar los nodos de aprendizaje.');
      // Return a specific error that we can handle in the UI
      throw new Error('AUTH_REQUIRED');
    }
    
    // Check if there are already nodes in the database
    const { count, error: countError } = await supabase
      .from('learning_nodes')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking for existing nodes:', countError);
      return false;
    }
    
    // If we already have nodes, return success
    if (count && count > 0) {
      console.log('Learning nodes already exist, skipping initialization');
      return true;
    }
    
    // No nodes exist, so first ensure RLS policies are properly configured
    console.log('No learning nodes found, initializing RLS policies first...');
    const rlsPoliciesInitialized = await initializeRLSPolicies();
    
    if (!rlsPoliciesInitialized) {
      console.error('Failed to initialize RLS policies, cannot continue with node initialization');
      return false;
    }
    
    console.log('RLS policies initialized, now inserting learning nodes...');
    
    // Insert initial learning nodes
    const { error: insertError } = await supabase
      .from('learning_nodes')
      .insert(initialLearningNodes);
    
    if (insertError) {
      if (insertError.message.includes('permission denied')) {
        console.error('Error de permisos al insertar nodos. Esto probablemente se debe a políticas RLS. Por favor, verifica tu estado de autenticación y permisos.', insertError);
        throw new Error('PERMISSION_DENIED');
      } else if (insertError.message.includes('duplicate key')) {
        console.error('Error de clave duplicada al insertar nodos. Es posible que los nodos con estos IDs ya existan.', insertError);
        throw new Error('DUPLICATE_KEY');
      } else {
        console.error('Error insertando nodos de aprendizaje iniciales:', insertError);
        throw new Error('INSERT_ERROR');
      }
    }
    
    console.log('Learning nodes initialized successfully');
    return true;
  } catch (error: any) {
    // Propagate specific error types we explicitly threw
    if (error.message === 'AUTH_REQUIRED' || error.message === 'PERMISSION_DENIED' || error.message === 'DUPLICATE_KEY') {
      throw error;
    }
    console.error('Error initializing learning nodes:', error);
    return false;
  }
};
