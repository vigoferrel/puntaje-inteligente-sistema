
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { initializeRLSPolicies } from "@/services/database/rls-service";
import { mapEnumToSkillId, mapEnumToTestId } from "@/utils/supabase-mappers";

const initialLearningNodes = [
  {
    id: 'a1b2c3d4-e5f6-4a1b-8c9d-0e1f2a3b4c5d', // Valid UUID format
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
    id: 'b2c3d4e5-f6a7-4b1c-9d2e-0f1a2b3c4d5', // Valid UUID format
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
    id: 'c3d4e5f6-a7b8-4c1d-9e2f-0a1b2c3d4e5', // Valid UUID format
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
        console.error('Permission denied error while inserting nodes. This is likely due to Row Level Security (RLS) policies. Please check your authentication status and permissions.', insertError);
      } else if (insertError.message.includes('duplicate key')) {
        console.error('Duplicate key error while inserting nodes. Nodes with these IDs may already exist.', insertError);
      } else {
        console.error('Error inserting initial learning nodes:', insertError);
      }
      return false;
    }
    
    // Check current RLS policies again to ensure everything is set up correctly
    const { data: policies, error: policiesError } = await supabase.rpc('get_policies_for_table', { 
      table_name: 'learning_nodes' 
    } as { table_name: string });
    
    // If there are RLS issues, log them but don't try to fix them again since we already attempted
    if (policiesError) {
      console.warn('Could not verify RLS policies after insertion:', policiesError);
    } else {
      console.log(`Found ${(policies as any[])?.length || 0} RLS policies for learning_nodes table`);
    }
    
    console.log('Learning nodes initialized successfully');
    
    return true;
  } catch (error) {
    console.error('Error initializing learning nodes:', error);
    return false;
  }
};
