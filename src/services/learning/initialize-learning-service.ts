
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { initializeRLSPolicies } from "@/services/database/rls-service";
import { v4 as uuidv4 } from 'uuid';
import { initializePAESContent } from './paes-content-service';

// Check if required tables exist and have data
const checkRequiredTables = async (): Promise<{exists: boolean, skillIds: number[], testIds: number[]}> => {
  try {
    const { data: skillsData, error: skillsError } = await supabase
      .from('paes_skills')
      .select('id, code');
    
    if (skillsError) {
      console.error('Error checking paes_skills table:', skillsError);
      return {exists: false, skillIds: [], testIds: []};
    }
    
    const { data: testsData, error: testsError } = await supabase
      .from('paes_tests')
      .select('id, code');
    
    if (testsError) {
      console.error('Error checking paes_tests table:', testsError);
      return {exists: false, skillIds: [], testIds: []};
    }
    
    const exists = (skillsData && skillsData.length > 0) && (testsData && testsData.length > 0);
    const skillIds = skillsData ? skillsData.map(skill => skill.id) : [];
    const testIds = testsData ? testsData.map(test => test.id) : [];
    
    console.log('Available skill IDs:', skillIds);
    console.log('Available test IDs:', testIds);
    
    return { exists, skillIds, testIds };
  } catch (error) {
    console.error('Error checking required tables:', error);
    return {exists: false, skillIds: [], testIds: []};
  }
};

// Initialize foundation tables with complete data structure
const initializeFoundationTables = async (): Promise<boolean> => {
  try {
    const {exists} = await checkRequiredTables();
    
    if (exists) {
      console.log('Foundation tables already exist with data, no need to initialize');
      return true;
    }
    
    // Define complete paes_skills data
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
    
    // Define complete paes_tests data with all required fields
    const testsData = [
      { 
        id: 1, 
        name: 'Competencia Lectora', 
        code: 'COMPETENCIA_LECTORA', 
        description: 'Prueba de comprensión de lectura', 
        is_required: true,
        complexity_level: 'intermediate',
        questions_count: 65,
        time_minutes: 150,
        relative_weight: 1.0
      },
      { 
        id: 2, 
        name: 'Matemática 1', 
        code: 'MATEMATICA_1', 
        description: 'Prueba de matemáticas para 7° a 2° medio', 
        is_required: true,
        complexity_level: 'basic',
        questions_count: 65,
        time_minutes: 140,
        relative_weight: 1.0
      },
      { 
        id: 3, 
        name: 'Matemática 2', 
        code: 'MATEMATICA_2', 
        description: 'Prueba de matemáticas para 3° y 4° medio', 
        is_required: false,
        complexity_level: 'advanced',
        questions_count: 55,
        time_minutes: 160,
        relative_weight: 1.0
      },
      { 
        id: 4, 
        name: 'Ciencias', 
        code: 'CIENCIAS', 
        description: 'Prueba de ciencias', 
        is_required: false,
        complexity_level: 'intermediate',
        questions_count: 80,
        time_minutes: 160,
        relative_weight: 1.0
      },
      { 
        id: 5, 
        name: 'Historia', 
        code: 'HISTORIA', 
        description: 'Prueba de historia y ciencias sociales', 
        is_required: false,
        complexity_level: 'intermediate',
        questions_count: 80,
        time_minutes: 160,
        relative_weight: 1.0
      }
    ];
    
    // Insert skills data
    const { error: skillsError } = await supabase
      .from('paes_skills')
      .insert(skillsData);
    
    if (skillsError) {
      console.error('Error inserting paes_skills data:', skillsError);
      return false;
    }
    
    // Insert tests data
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

// Get initial learning nodes with complete structure
const getInitialLearningNodes = (availableSkillIds: number[], availableTestIds: number[]) => {
  const defaultSkills = [15, 4, 9]; // CRITICAL_THINKING, SOLVE_PROBLEMS, PROCESS_ANALYZE
  const defaultTests = [1, 2, 4];   // COMPETENCIA_LECTORA, MATEMATICA_1, CIENCIAS
  
  const getValidSkillId = (preferredId: number, index: number) => {
    if (availableSkillIds.includes(preferredId)) {
      return preferredId;
    }
    console.log(`Warning: Preferred skill ID ${preferredId} not found, using alternative`);
    return availableSkillIds[index % availableSkillIds.length] || 1;
  };
  
  const getValidTestId = (preferredId: number, index: number) => {
    if (availableTestIds.includes(preferredId)) {
      return preferredId;
    }
    console.log(`Warning: Preferred test ID ${preferredId} not found, using alternative`);
    return availableTestIds[index % availableTestIds.length] || 1;
  };
  
  return [
    {
      id: uuidv4(),
      title: 'Introducción a la Competencia Lectora',
      description: 'Aprende los fundamentos de la competencia lectora y cómo abordar diferentes tipos de textos.',
      code: 'INTRO_LECTORA',
      position: 1,
      skill_id: getValidSkillId(defaultSkills[0], 0),
      test_id: getValidTestId(defaultTests[0], 0),
      depends_on: [],
      difficulty: 'basic' as const,
      estimated_time_minutes: 30,
      subject_area: 'COMPETENCIA_LECTORA',
      domain_category: 'comprension_lectora',
      cognitive_level: 'comprender' as const,
      tier_priority: 'tier1_critico' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Resolución de Problemas Matemáticos',
      description: 'Desarrolla tus habilidades para resolver problemas matemáticos complejos paso a paso.',
      code: 'PROB_MATEMATICOS',
      position: 1,
      skill_id: getValidSkillId(defaultSkills[1], 1),
      test_id: getValidTestId(defaultTests[1], 1),
      depends_on: [],
      difficulty: 'basic' as const,
      estimated_time_minutes: 45,
      subject_area: 'MATEMATICA_1',
      domain_category: 'algebra_basica',
      cognitive_level: 'aplicar' as const,
      tier_priority: 'tier1_critico' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      title: 'Análisis de Datos Científicos',
      description: 'Aprende a interpretar y analizar datos científicos para extraer conclusiones significativas.',
      code: 'ANAL_CIENTIFICOS',
      position: 1,
      skill_id: getValidSkillId(defaultSkills[2], 2),
      test_id: getValidTestId(defaultTests[2], 2),
      depends_on: [],
      difficulty: 'basic' as const,
      estimated_time_minutes: 60,
      subject_area: 'CIENCIAS',
      domain_category: 'metodologia_cientifica',
      cognitive_level: 'analizar' as const,
      tier_priority: 'tier2_importante' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
};

// Validate database content
const validateDatabaseContent = async (): Promise<string | null> => {
  try {
    const { data: skillsData, error: skillsError } = await supabase
      .from('paes_skills')
      .select('id, name, code');
    
    if (skillsError) {
      return `Error validando tabla paes_skills: ${skillsError.message}`;
    }
    
    if (!skillsData || skillsData.length === 0) {
      return 'La tabla paes_skills no contiene datos. Por favor, inicialice los datos base primero.';
    }
    
    console.log('Skills encontrados:', skillsData.length);
    
    const { data: testsData, error: testsError } = await supabase
      .from('paes_tests')
      .select('id, name, code');
    
    if (testsError) {
      return `Error validando tabla paes_tests: ${testsError.message}`;
    }
    
    if (!testsData || testsData.length === 0) {
      return 'La tabla paes_tests no contiene datos. Por favor, inicialice los datos base primero.';
    }
    
    console.log('Tests encontrados:', testsData.length);
    
    return null;
  } catch (error: any) {
    return `Error validando contenido de la base de datos: ${error.message}`;
  }
};

export const ensureLearningNodesExist = async (): Promise<boolean> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Usuario no autenticado. Se requiere autenticación para inicializar los nodos de aprendizaje.');
      throw new Error('AUTH_REQUIRED');
    }
    
    const { count, error: countError } = await supabase
      .from('learning_nodes')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking for existing nodes:', countError);
      return false;
    }
    
    if (count && count > 0) {
      console.log('Learning nodes already exist, skipping initialization');
      return true;
    }
    
    const validationError = await validateDatabaseContent();
    if (validationError) {
      console.error(validationError);
      throw new Error(`VALIDATION_ERROR: ${validationError}`);
    }
    
    console.log('No learning nodes found, initializing RLS policies first...');
    const rlsPoliciesInitialized = await initializeRLSPolicies();
    
    if (!rlsPoliciesInitialized) {
      console.error('Failed to initialize RLS policies, cannot continue with node initialization');
      return false;
    }
    
    console.log('Ensuring foundation tables are initialized...');
    const foundationTablesInitialized = await initializeFoundationTables();
    
    if (!foundationTablesInitialized) {
      console.error('Failed to initialize foundation tables, cannot continue with node initialization');
      return false;
    }
    
    const { skillIds, testIds } = await checkRequiredTables();
    
    if (skillIds.length === 0 || testIds.length === 0) {
      console.error('No skill or test IDs available. Cannot create learning nodes.');
      throw new Error('MISSING_REFERENCE_DATA');
    }
    
    const initialLearningNodes = getInitialLearningNodes(skillIds, testIds);
    
    console.log('Foundation tables ready, now inserting learning nodes...');
    console.log('Using skill IDs:', initialLearningNodes.map(node => node.skill_id));
    console.log('Using test IDs:', initialLearningNodes.map(node => node.test_id));
    
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
        throw new Error(`FOREIGN_KEY_VIOLATION: ${insertError.message}`);
      } else {
        console.error('Error insertando nodos de aprendizaje iniciales:', insertError);
        throw new Error(`INSERT_ERROR: ${insertError.message}`);
      }
    }
    
    console.log('Basic nodes created successfully, now initializing PAES educational content...');
    try {
      const paesResults = await initializePAESContent();
      console.log('PAES content initialization results:', paesResults);
      
      if (paesResults.failed > 0) {
        console.warn('Some PAES nodes failed to initialize:', paesResults.errors);
      } else {
        console.log('All PAES content initialized successfully');
      }
    } catch (paesError: any) {
      console.error('Error initializing PAES content:', paesError);
    }
    
    console.log('Learning nodes initialized successfully');
    return true;
  } catch (error: any) {
    if (['AUTH_REQUIRED', 'PERMISSION_DENIED', 'DUPLICATE_KEY', 'FOREIGN_KEY_VIOLATION', 'VALIDATION_ERROR', 'MISSING_REFERENCE_DATA', 'INSERT_ERROR'].some(
      errType => error.message?.includes(errType)
    )) {
      throw error;
    }
    console.error('Error initializing learning nodes:', error);
    return false;
  }
};

export const initializePAESNodesOnly = async (): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Usuario no autenticado. Se requiere autenticación para inicializar los nodos de aprendizaje.');
      return {
        success: 0,
        failed: 1,
        errors: ['AUTH_REQUIRED: Debe iniciar sesión para realizar esta operación']
      };
    }
    
    return await initializePAESContent();
  } catch (error: any) {
    console.error('Error initializing PAES nodes:', error);
    return {
      success: 0,
      failed: 1,
      errors: [`Error: ${error?.message || 'Unknown error'}`]
    };
  }
};
