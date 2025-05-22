import { supabase } from "@/integrations/supabase/client";
import { TLearningNode } from "@/types/system-types";
import { initializeRLSPolicies } from "@/services/database/rls-service";

const initialLearningNodes: TLearningNode[] = [
  {
    id: '1',
    title: 'Introducción a la Competencia Lectora',
    description: 'Aprende los fundamentos de la competencia lectora y cómo abordar diferentes tipos de textos.',
    content: 'Aquí encontrarás una explicación detallada de los conceptos clave y estrategias para mejorar tu comprensión lectora.',
    test_id: 1,
    skill_id: 15,
    estimated_time: 30,
    resources: ['Guía de Competencia Lectora', 'Ejercicios de Práctica'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2',
    title: 'Resolución de Problemas Matemáticos',
    description: 'Desarrolla tus habilidades para resolver problemas matemáticos complejos paso a paso.',
    content: 'Este nodo te guiará a través de diferentes técnicas y enfoques para abordar desafíos matemáticos con confianza.',
    test_id: 2,
    skill_id: 4,
    estimated_time: 45,
    resources: ['Estrategias de Resolución de Problemas', 'Ejemplos Resueltos'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '3',
    title: 'Análisis de Datos Científicos',
    description: 'Aprende a interpretar y analizar datos científicos para extraer conclusiones significativas.',
    content: 'Descubre cómo utilizar herramientas y métodos estadísticos para comprender mejor los resultados de experimentos científicos.',
    test_id: 4,
    skill_id: 9,
    estimated_time: 60,
    resources: ['Manual de Análisis de Datos', 'Software de Estadística'],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
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
    
    // Here we would normally initialize nodes from a seed file or external source
    // For demo purposes, we'll add a few sample nodes
    
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
