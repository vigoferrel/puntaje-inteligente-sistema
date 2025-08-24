// 🚀 CONEXIÓN REAL A SUPABASE - SUPERPAES CHILE
// Conectado directamente al backend con SQL existente

import { createClient } from '@supabase/supabase-js';

// ========================================
// CONFIGURACIÓN REAL
// ========================================
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('❌ Variables de entorno Supabase no configuradas');
}

console.log('🔗 Conectando a Supabase:', SUPABASE_URL);

// ========================================
// CLIENTE PRINCIPAL
// ========================================
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'superpaes-chile-v1.0'
    }
  }
});

// ========================================
// CLIENTE ADMIN (para operaciones privilegiadas)
// ========================================
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'X-Client-Info': 'superpaes-admin-v1.0'
    }
  }
});

// ========================================
// FUNCIONES DE CONECTIVIDAD REAL
// ========================================

// Test de conexión real inmediato
export async function testRealConnection() {
  try {
    console.log('🧪 Probando conexión real a Supabase...');
    
    // Test 1: Verificar conectividad básica
    const { data, error } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Error de conectividad:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Conexión básica exitosa');

    // Test 2: Verificar estructura de tablas
    const tables = ['usuarios', 'preguntas', 'examenes', 'user_node_progress'];
    const tableStatus = {};

    for (const table of tables) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        tableStatus[table] = tableError ? `❌ ${tableError.message}` : '✅ Accesible';
      } catch (err) {
        tableStatus[table] = `❌ Error: ${err}`;
      }
    }

    console.log('📊 Estado de tablas:', tableStatus);

    return {
      success: true,
      url: SUPABASE_URL,
      tablesStatus: tableStatus,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error crítico en conexión:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ========================================
// FUNCIONES EDUCATIVAS REALES
// ========================================

// Crear usuario real en el sistema
export async function createRealUser(email: string, nombre: string) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        auth_id: crypto.randomUUID(),
        email,
        nombre,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Usuario real creado:', data.id);
    return data;

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    throw error;
  }
}

// Obtener ejercicios PAES reales
export async function getRealPAESExercises(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('preguntas')
      .select(`
        id,
        prueba,
        habilidad,
        dificultad,
        tema,
        subtema,
        enunciado,
        contexto,
        imagen_url,
        alternativas,
        respuesta_correcta,
        explicacion,
        tiempo_estimado_segundos,
        nivel_bloom,
        keywords,
        is_active
      `)
      .eq('is_active', true)
      .limit(limit);

    if (error) throw error;

    console.log(`✅ ${data.length} ejercicios PAES reales obtenidos`);
    return data;

  } catch (error) {
    console.error('❌ Error obteniendo ejercicios:', error);
    return [];
  }
}

// Registrar progreso real del usuario
export async function recordRealProgress(
  userId: string, 
  nodeId: string, 
  progress: {
    score?: number;
    timeSpent?: number;
    completed?: boolean;
  }
) {
  try {
    const { data, error } = await supabase
      .from('user_node_progress')
      .upsert({
        user_id: userId,
        node_id: nodeId,
        status: progress.completed ? 'completed' : 'in_progress',
        progress_percentage: progress.score || 0,
        total_time_seconds: progress.timeSpent || 0,
        last_score: progress.score || 0,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Progreso real registrado:', data.id);
    return data;

  } catch (error) {
    console.error('❌ Error registrando progreso:', error);
    throw error;
  }
}

// Crear examen real
export async function createRealExam(
  userId: string,
  examData: {
    titulo: string;
    prueba: string;
    dificultad: string;
    numPreguntas: number;
    tiempoMinutos: number;
  }
) {
  try {
    const { data, error } = await supabase
      .from('examenes')
      .insert({
        usuario_id: userId,
        titulo: examData.titulo,
        descripcion: `Examen generado automáticamente - ${examData.prueba}`,
        prueba: examData.prueba,
        dificultad: examData.dificultad,
        num_preguntas: examData.numPreguntas,
        tiempo_limite_minutos: examData.tiempoMinutos,
        puntaje_maximo: examData.numPreguntas * 100,
        status: 'DRAFT',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Examen real creado:', data.id);
    return data;

  } catch (error) {
    console.error('❌ Error creando examen:', error);
    throw error;
  }
}

// Obtener analytics reales del usuario
export async function getRealUserAnalytics(userId: string) {
  try {
    const { data, error } = await supabase
      .from('analytics_usuario')
      .select('*')
      .eq('usuario_id', userId)
      .order('fecha', { ascending: false })
      .limit(30);

    if (error) throw error;

    console.log(`✅ Analytics reales obtenidos: ${data.length} registros`);
    return data;

  } catch (error) {
    console.error('❌ Error obteniendo analytics:', error);
    return [];
  }
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA
// ========================================

// Probar conexión automáticamente al importar
testRealConnection().then(result => {
  if (result.success) {
    console.log('🚀 SuperPAES conectado exitosamente a Supabase');
    console.log('📊 Tablas disponibles:', result.tablesStatus);
  } else {
    console.error('💥 Error crítico conectando a Supabase:', result.error);
  }
});

// ========================================
// EXPORTS
// ========================================
export default supabase;
