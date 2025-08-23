// Revisión completa de todas las tablas en Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://settifboilityelprvjd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("🗄️ REVISIÓN COMPLETA DE SUPABASE");
console.log("================================");

// Lista de tablas adicionales a explorar
const tablasAExplorar = [
  // Sistema de usuarios
  'users', 'profiles', 'user_profiles', 'auth_users',
  
  // Progreso y tracking
  'user_progress', 'learning_progress', 'student_progress',
  'progress_tracking', 'achievements', 'user_achievements',
  
  // Sesiones y respuestas
  'user_sessions', 'evaluation_sessions', 'question_responses',
  'user_responses', 'test_sessions', 'exam_sessions',
  
  // Sistema de skills/habilidades  
  'skills', 'user_skills', 'skill_assessments',
  
  // Analytics y métricas
  'user_analytics', 'learning_analytics', 'performance_metrics',
  'diagnostic_results', 'assessment_results',
  
  // Contenido y recursos
  'content', 'resources', 'learning_materials',
  'study_materials', 'multimedia_content',
  
  // Sistema de recomendaciones
  'recommendations', 'adaptive_recommendations',
  'personalized_content', 'learning_paths',
  
  // Configuraciones
  'settings', 'system_settings', 'user_settings',
  'app_settings', 'configuration'
];

async function explorarTabla(nombreTabla) {
  try {
    console.log(`\n🔍 Explorando tabla: ${nombreTabla}`);
    
    // Contar registros
    const { count, error: countError } = await supabase
      .from(nombreTabla)
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log(`   ❌ No existe o sin acceso`);
      return null;
    }
    
    console.log(`   📊 ${count || 0} registros`);
    
    if (count === 0) {
      return { tabla: nombreTabla, count: 0, campos: [], muestra: [] };
    }
    
    // Obtener muestra y estructura
    const { data: muestra, error: dataError } = await supabase
      .from(nombreTabla)
      .select('*')
      .limit(2);
    
    if (dataError) {
      console.log(`   ❌ Error obteniendo datos: ${dataError.message}`);
      return null;
    }
    
    const campos = muestra && muestra.length > 0 ? Object.keys(muestra[0]) : [];
    
    // Mostrar información básica
    console.log(`   📋 Campos (${campos.length}): ${campos.slice(0, 6).join(', ')}${campos.length > 6 ? '...' : ''}`);
    
    if (muestra && muestra.length > 0) {
      // Mostrar algunos campos interesantes del primer registro
      const registro = muestra[0];
      const camposInteresantes = campos.filter(campo => 
        !campo.includes('created_at') && 
        !campo.includes('updated_at') && 
        !campo.includes('id') &&
        registro[campo] !== null &&
        registro[campo] !== ''
      ).slice(0, 3);
      
      if (camposInteresantes.length > 0) {
        console.log(`   🔍 Muestra:`);
        camposInteresantes.forEach(campo => {
          let valor = registro[campo];
          if (typeof valor === 'string' && valor.length > 50) {
            valor = valor.substring(0, 50) + '...';
          }
          console.log(`      ${campo}: ${valor}`);
        });
      }
    }
    
    return {
      tabla: nombreTabla,
      count: count || 0,
      campos: campos,
      muestra: muestra || []
    };
    
  } catch (error) {
    console.log(`   ❌ Error explorando: ${error.message}`);
    return null;
  }
}

async function buscarTablasAdicionales() {
  console.log("\n🔎 Buscando tablas adicionales por patrones...");
  
  const patrones = ['paes', 'test', 'eval', 'quiz', 'question', 'answer'];
  const tablasEncontradas = [];
  
  for (const patron of patrones) {
    console.log(`\n   Buscando patrón: *${patron}*`);
    
    const tablasConPatron = [
      `${patron}s`, `${patron}_data`, `${patron}_results`,
      `user_${patron}`, `${patron}_history`, `${patron}_analytics`
    ];
    
    for (const tabla of tablasConPatron) {
      try {
        const { count, error } = await supabase
          .from(tabla)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          console.log(`      ✅ ${tabla}: ${count || 0} registros`);
          tablasEncontradas.push({ tabla, count: count || 0 });
        }
      } catch (err) {
        // Silenciar errores para tablas que no existen
      }
    }
  }
  
  return tablasEncontradas;
}

async function analizarRelaciones() {
  console.log("\n🔗 Analizando relaciones entre tablas...");
  
  // Buscar foreign keys y referencias
  const tablasConRelaciones = [
    { tabla: 'preguntas', campo: 'examen_id', relaciona: 'examenes' },
    { tabla: 'banco_preguntas', campo: 'nodo_id', relaciona: 'learning_nodes' },
    { tabla: 'learning_nodes', campo: 'skill_id', relaciona: 'skills' },
    { tabla: 'learning_nodes', campo: 'test_id', relaciona: 'tests' }
  ];
  
  for (const relacion of tablasConRelaciones) {
    try {
      const { data: muestra } = await supabase
        .from(relacion.tabla)
        .select(relacion.campo)
        .not(relacion.campo, 'is', null)
        .limit(3);
      
      if (muestra && muestra.length > 0) {
        console.log(`   🔗 ${relacion.tabla}.${relacion.campo} → ${relacion.relaciona}`);
        const ids = muestra.map(m => m[relacion.campo]).slice(0, 2);
        console.log(`      IDs ejemplo: ${ids.join(', ')}`);
      }
    } catch (error) {
      // Continuar silenciosamente
    }
  }
}

async function explorarSistemaAuth() {
  console.log("\n👤 Explorando sistema de autenticación...");
  
  // Verificar integración con auth.users (tabla system de Supabase)
  try {
    // No podemos acceder directamente a auth.users, pero podemos ver si hay tablas relacionadas
    const tablasAuth = ['profiles', 'user_profiles', 'users'];
    
    for (const tabla of tablasAuth) {
      const resultado = await explorarTabla(tabla);
      if (resultado && resultado.count > 0) {
        console.log(`   ✅ Sistema de usuarios activo en tabla: ${tabla}`);
      }
    }
  } catch (error) {
    console.log("   ⚠️ Sistema de auth no completamente explorable");
  }
}

async function buscarConfiguraciones() {
  console.log("\n⚙️ Buscando configuraciones del sistema...");
  
  const tablasConfig = [
    'app_config', 'system_config', 'configurations',
    'settings', 'app_settings', 'paes_settings'
  ];
  
  for (const tabla of tablasConfig) {
    const resultado = await explorarTabla(tabla);
    if (resultado && resultado.count > 0) {
      console.log(`   ✅ Configuraciones encontradas en: ${tabla}`);
    }
  }
}

async function generarMapaCompleto(tablasExploradas) {
  console.log("\n" + "=".repeat(80));
  console.log("🗺️ MAPA COMPLETO DE SUPABASE");
  console.log("=".repeat(80));
  
  const tablasConDatos = tablasExploradas.filter(t => t && t.count > 0);
  const tablasVacias = tablasExploradas.filter(t => t && t.count === 0);
  
  console.log("\n📊 RESUMEN EJECUTIVO:");
  console.log(`   • Tablas con datos: ${tablasConDatos.length}`);
  console.log(`   • Tablas vacías: ${tablasVacias.length}`);
  console.log(`   • Total registros: ${tablasConDatos.reduce((sum, t) => sum + t.count, 0)}`);
  
  console.log("\n🏆 TABLAS PRINCIPALES (con datos):");
  tablasConDatos
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .forEach(tabla => {
      console.log(`   📊 ${tabla.tabla}: ${tabla.count.toLocaleString()} registros`);
    });
  
  console.log("\n📋 CATEGORÍAS IDENTIFICADAS:");
  
  // Categorizar tablas por tipo
  const categorias = {
    'PAES/Educativo': ['preguntas', 'examenes', 'banco_preguntas', 'evaluaciones', 'learning_nodes'],
    'Usuarios/Auth': ['users', 'profiles', 'user_profiles'],
    'Progreso/Tracking': ['user_progress', 'learning_progress', 'achievements'],
    'Sistema/Config': ['settings', 'configurations', 'app_settings'],
    'Analytics': ['analytics', 'metrics', 'results']
  };
  
  Object.entries(categorias).forEach(([categoria, tablasCat]) => {
    const tablasEncontradas = tablasConDatos.filter(t => 
      tablasCat.some(cat => t.tabla.includes(cat))
    );
    
    if (tablasEncontradas.length > 0) {
      console.log(`\n   📚 ${categoria}:`);
      tablasEncontradas.forEach(t => {
        console.log(`      • ${t.tabla}: ${t.count} registros`);
      });
    }
  });
  
  if (tablasVacias.length > 0) {
    console.log(`\n⚠️ TABLAS VACÍAS (${tablasVacias.length}):`);
    tablasVacias.forEach(t => {
      console.log(`   • ${t.tabla}`);
    });
  }
}

async function main() {
  console.log("🚀 Iniciando revisión completa de Supabase...\n");
  
  // Explorar tablas conocidas adicionales
  const tablasExploradas = [];
  
  for (const tabla of tablasAExplorar) {
    const resultado = await explorarTabla(tabla);
    if (resultado) {
      tablasExploradas.push(resultado);
    }
  }
  
  // Buscar tablas adicionales por patrones
  const tablasAdicionales = await buscarTablasAdicionales();
  
  // Explorar tablas encontradas por patrones
  for (const { tabla } of tablasAdicionales) {
    if (!tablasExploradas.some(t => t.tabla === tabla)) {
      const resultado = await explorarTabla(tabla);
      if (resultado) {
        tablasExploradas.push(resultado);
      }
    }
  }
  
  // Análisis adicionales
  await analizarRelaciones();
  await explorarSistemaAuth();
  await buscarConfiguraciones();
  
  // Generar mapa completo
  await generarMapaCompleto(tablasExploradas);
  
  console.log("\n🏁 REVISIÓN COMPLETA DE SUPABASE TERMINADA");
  console.log("\n💡 PRÓXIMOS PASOS SUGERIDOS:");
  console.log("   1. Revisar tablas con mayor cantidad de datos");
  console.log("   2. Implementar conexiones entre tablas principales");
  console.log("   3. Poblar tablas vacías con datos de prueba");
  console.log("   4. Configurar sistema de usuarios si no está activo");
}

main().catch(console.error);
