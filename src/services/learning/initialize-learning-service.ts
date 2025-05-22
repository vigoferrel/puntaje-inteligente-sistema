
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { initializeRLSPolicies } from "@/services/database/rls-service";
import { mapEnumToSkillId, mapEnumToTestId } from "@/utils/supabase-mappers";

const initialLearningNodes = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    
    // No nodes exist, so let's initialize
    console.log('No learning nodes found, initializing...');
    
    // Insert initial learning nodes
    const { error: insertError } = await supabase
      .from('learning_nodes')
      .insert(initialLearningNodes);
    
    if (insertError) {
      console.error('Error inserting initial learning nodes:', insertError);
      return false;
    }
    
    // Check current RLS policies
    const { data: policies, error: policiesError } = await supabase.rpc('get_policies_for_table', { 
      table_name: 'learning_nodes' 
    } as { table_name: string });
    
    // If there are RLS issues, try to fix them
    if (policiesError || !policies || (policies as any[]).length === 0) {
      console.warn('RLS policies issue detected, attempting to initialize policies');
      await initializeRLSPolicies();
    }
    
    console.log('Learning nodes initialized successfully');
    
    return true;
  } catch (error) {
    console.error('Error initializing learning nodes:', error);
    return false;
  }
};
