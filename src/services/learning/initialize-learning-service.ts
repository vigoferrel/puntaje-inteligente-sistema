
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { initializeRLSPolicies } from "@/services/database/rls-service";
import { mapEnumToSkillId, mapEnumToTestId } from "@/utils/supabase-mappers";
import { v4 as uuidv4 } from 'uuid';

// First, check if paes_skills and paes_tests already exist before initializing nodes
const checkRequiredTables = async (): Promise<boolean> => {
  try {
    // Check if paes_skills table has data
    const { count: skillsCount, error: skillsError } = await supabase
      .from('paes_skills')
      .select('*', { count: 'exact', head: true });
    
    if (skillsError) {
      console.error('Error checking paes_skills table:', skillsError);
      return false;
    }
    
    // Check if paes_tests table has data
    const { count: testsCount, error: testsError } = await supabase
      .from('paes_tests')
      .select('*', { count: 'exact', head: true });
    
    if (testsError) {
      console.error('Error checking paes_tests table:', testsError);
      return false;
    }
    
    return (skillsCount && skillsCount > 0) && (testsCount && testsCount > 0);
  } catch (error) {
    console.error('Error checking required tables:', error);
    return false;
  }
};

// Initialize foundation tables if they don't exist
const initializeFoundationTables = async (): Promise<boolean> => {
  try {
    // First check if tables already have data
    const hasData = await checkRequiredTables();
    
    if (hasData) {
      console.log('Foundation tables already exist with data, no need to initialize');
      return true;
    }
    
    // Define paes_skills data
    const skillsData = [
      { id: 1, name: 'Rastrear y Localizar', code: 'TRACK_LOCATE', description: 'Habilidad para encontrar información específica en textos' },
      { id: 2, name: 'Interpretar y Relacionar', code: 'INTERPRET_RELATE', description: 'Habilidad para comprender e interconectar información' },
      { id: 3, name: 'Evaluar y Reflexionar', code: 'EVALUATE_REFLECT', description: 'Habilidad para analizar críticamente información' },
      { id: 4, name: 'Resolver Problemas', code: 'SOLVE_PROBLEMS', description: 'Habilidad para encontrar soluciones matemáticas' },
      { id: 5, name: 'Representar', code: 'REPRESENT', description: 'Habilidad para usar representaciones matemáticas' },
      { id: 6, name: 'Modelar', code: 'MODEL', description: 'Habilidad para crear modelos matemáticos' },
      { id: 7, name: 'Argumentar y Comunicar', code: 'ARGUE_COMMUNICATE', description: 'Habilidad para expresar razonamientos matemáticos' },
      { id: 8, name: 'Identificar Teorías', code: 'IDENTIFY_THEORIES', description: 'Habilidad para reconocer principios científicos' },
      { id: 9, name: 'Procesar y Analizar', code: 'PROCESS_ANALYZE', description: 'Habilidad para trabajar con datos científicos' },
      { id: 10, name: 'Aplicar Principios', code: 'APPLY_PRINCIPLES', description: 'Habilidad para usar conocimientos científicos' },
      { id: 11, name: 'Argumentación Científica', code: 'SCIENTIFIC_ARGUMENT', description: 'Habilidad para defender posiciones científicas' },
      { id: 12, name: 'Pensamiento Temporal', code: 'TEMPORAL_THINKING', description: 'Habilidad para comprender procesos históricos' },
      { id: 13, name: 'Análisis de Fuentes', code: 'SOURCE_ANALYSIS', description: 'Habilidad para evaluar fuentes históricas' },
      { id: 14, name: 'Análisis Multicausal', code: 'MULTICAUSAL_ANALYSIS', description: 'Habilidad para entender fenómenos históricos complejos' },
      { id: 15, name: 'Pensamiento Crítico', code: 'CRITICAL_THINKING', description: 'Habilidad para evaluar críticamente eventos históricos' },
      { id: 16, name: 'Reflexión', code: 'REFLECTION', description: 'Habilidad para considerar implicaciones históricas' }
    ];
    
    // Define paes_tests data
    const testsData = [
      { id: 1, name: 'Competencia Lectora', code: 'COMPETENCIA_LECTORA', description: 'Prueba de comprensión de lectura', is_required: true },
      { id: 2, name: 'Matemática 1', code: 'MATEMATICA_1', description: 'Prueba de matemáticas para 7° a 2° medio', is_required: true },
      { id: 3, name: 'Matemática 2', code: 'MATEMATICA_2', description: 'Prueba de matemáticas para 3° y 4° medio', is_required: false },
      { id: 4, name: 'Ciencias', code: 'CIENCIAS', description: 'Prueba de ciencias', is_required: false },
      { id: 5, name: 'Historia', code: 'HISTORIA', description: 'Prueba de historia y ciencias sociales', is_required: false }
    ];
    
    // Insert paes_skills data
    const { error: skillsError } = await supabase
      .from('paes_skills')
      .insert(skillsData);
    
    if (skillsError) {
      console.error('Error inserting paes_skills data:', skillsError);
      return false;
    }
    
    // Insert paes_tests data
    const { error: testsError } = await supabase
      .from('paes_tests')
      .insert(testsData);
    
    if (testsError) {
      console.error('Error inserting paes_tests data:', testsError);
      return false;
    }
    
    console.log('Foundation tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing foundation tables:', error);
    return false;
  }
};

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
    
    // Make sure the foundation tables exist and have data
    console.log('Ensuring foundation tables are initialized...');
    const foundationTablesInitialized = await initializeFoundationTables();
    
    if (!foundationTablesInitialized) {
      console.error('Failed to initialize foundation tables, cannot continue with node initialization');
      return false;
    }
    
    console.log('Foundation tables ready, now inserting learning nodes...');
    
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
      } else if (insertError.message.includes('violates foreign key constraint')) {
        console.error('Error de clave foránea al insertar nodos. Verifica que los skill_id y test_id existan en sus respectivas tablas.', insertError);
        throw new Error('FOREIGN_KEY_VIOLATION');
      } else {
        console.error('Error insertando nodos de aprendizaje iniciales:', insertError);
        throw new Error('INSERT_ERROR');
      }
    }
    
    console.log('Learning nodes initialized successfully');
    return true;
  } catch (error: any) {
    // Propagate specific error types we explicitly threw
    if (['AUTH_REQUIRED', 'PERMISSION_DENIED', 'DUPLICATE_KEY', 'FOREIGN_KEY_VIOLATION'].includes(error.message)) {
      throw error;
    }
    console.error('Error initializing learning nodes:', error);
    return false;
  }
};
