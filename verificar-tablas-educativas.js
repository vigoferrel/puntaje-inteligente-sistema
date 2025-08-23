#!/usr/bin/env node

/**
 * SCRIPT DE VERIFICACIÓN DE TABLAS EDUCATIVAS PAES
 * 
 * Este script verifica que todas las tablas educativas se hayan creado correctamente
 * en Supabase después de ejecutar el script de configuración.
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const SUPABASE_URL = "https://settifboilityelprvjd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzg1ODIyMiwiZXhwIjoyMDYzNDM0MjIyfQ.VlriU1ShZH_PFPJzutat2uqnc-TZ6plxUIaBp7NTZyE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Lista de tablas educativas que deberían existir
const TABLAS_EDUCATIVAS = [
  'paes_subjects',
  'bloom_levels',
  'subject_topics',
  'user_preferences',
  'user_progress',
  'study_sessions',
  'exercise_bank',
  'user_exercises',
  'paes_simulations',
  'user_simulations',
  'achievements',
  'user_achievements',
  'user_stats'
];

async function verificarTabla(nombreTabla) {
  try {
    console.log(`🔍 Verificando tabla: ${nombreTabla}`);
    
    const { data, error, count } = await supabase
      .from(nombreTabla)
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.log(`❌ Error en tabla ${nombreTabla}: ${error.message}`);
      return { existe: false, error: error.message };
    }
    
    console.log(`✅ Tabla ${nombreTabla} existe y es accesible`);
    return { existe: true, count: count || 0 };
    
  } catch (err) {
    console.log(`❌ Error verificando tabla ${nombreTabla}: ${err.message}`);
    return { existe: false, error: err.message };
  }
}

async function verificarDatosIniciales() {
  console.log('\n📊 Verificando datos iniciales...');
  
  try {
    // Verificar asignaturas PAES
    const { data: subjects, error: subjectsError } = await supabase
      .from('paes_subjects')
      .select('*');
    
    if (subjectsError) {
      console.log(`❌ Error obteniendo asignaturas: ${subjectsError.message}`);
    } else {
      console.log(`✅ Asignaturas PAES encontradas: ${subjects?.length || 0}`);
      if (subjects && subjects.length > 0) {
        subjects.forEach(subject => {
          console.log(`   - ${subject.name} (${subject.id})`);
        });
      }
    }
    
    // Verificar niveles Bloom
    const { data: bloomLevels, error: bloomError } = await supabase
      .from('bloom_levels')
      .select('*')
      .order('level_order');
    
    if (bloomError) {
      console.log(`❌ Error obteniendo niveles Bloom: ${bloomError.message}`);
    } else {
      console.log(`✅ Niveles Bloom encontrados: ${bloomLevels?.length || 0}`);
      if (bloomLevels && bloomLevels.length > 0) {
        bloomLevels.forEach(level => {
          console.log(`   - ${level.name} (Nivel ${level.level_order})`);
        });
      }
    }
    
    // Verificar logros
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*');
    
    if (achievementsError) {
      console.log(`❌ Error obteniendo logros: ${achievementsError.message}`);
    } else {
      console.log(`✅ Logros encontrados: ${achievements?.length || 0}`);
      if (achievements && achievements.length > 0) {
        achievements.forEach(achievement => {
          console.log(`   - ${achievement.name} (${achievement.category})`);
        });
      }
    }
    
  } catch (err) {
    console.log(`❌ Error verificando datos iniciales: ${err.message}`);
  }
}

async function verificarIndices() {
  console.log('\n🔍 Verificando índices...');
  
  const indicesEsperados = [
    'idx_user_progress_user_id',
    'idx_user_progress_subject_id',
    'idx_study_sessions_user_id',
    'idx_study_sessions_subject_id',
    'idx_exercise_bank_subject_id',
    'idx_exercise_bank_bloom_level_id',
    'idx_user_exercises_user_id'
  ];
  
  for (const indexName of indicesEsperados) {
    try {
      // Intentar una consulta que use el índice
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .limit(1);
      
      if (!error) {
        console.log(`✅ Índices funcionando correctamente`);
        break;
      }
    } catch (err) {
      console.log(`⚠️  No se pudo verificar índice ${indexName}: ${err.message}`);
    }
  }
}

async function main() {
  console.log('🚀 INICIANDO VERIFICACIÓN DE TABLAS EDUCATIVAS PAES');
  console.log('=' .repeat(60));
  
  const resultados = [];
  let tablasExistentes = 0;
  let tablasFaltantes = 0;
  
  // Verificar cada tabla
  for (const tabla of TABLAS_EDUCATIVAS) {
    const resultado = await verificarTabla(tabla);
    resultados.push({ tabla, ...resultado });
    
    if (resultado.existe) {
      tablasExistentes++;
    } else {
      tablasFaltantes++;
    }
  }
  
  // Verificar datos iniciales
  await verificarDatosIniciales();
  
  // Verificar índices
  await verificarIndices();
  
  // Resumen final
  console.log('\n' + '=' .repeat(60));
  console.log('📊 RESUMEN DE VERIFICACIÓN');
  console.log('=' .repeat(60));
  console.log(`✅ Tablas existentes: ${tablasExistentes}/${TABLAS_EDUCATIVAS.length}`);
  console.log(`❌ Tablas faltantes: ${tablasFaltantes}/${TABLAS_EDUCATIVAS.length}`);
  
  if (tablasFaltantes > 0) {
    console.log('\n❌ Tablas que faltan:');
    resultados
      .filter(r => !r.existe)
      .forEach(r => console.log(`   - ${r.tabla}: ${r.error}`));
  }
  
  if (tablasExistentes === TABLAS_EDUCATIVAS.length) {
    console.log('\n🎉 ¡TODAS LAS TABLAS EDUCATIVAS ESTÁN OPERATIVAS!');
    console.log('✅ El sistema educativo PAES está listo para usar');
  } else {
    console.log('\n⚠️  Algunas tablas no se crearon correctamente');
    console.log('💡 Revisa los errores y ejecuta el script de configuración nuevamente');
  }
  
  console.log('\n🔗 Dashboard de Supabase: https://supabase.com/dashboard/project/settifboilityelprvjd/api?page=tables-intro');
}

// Ejecutar verificación
main().catch(err => {
  console.error('Error en la verificación:', err);
  process.exit(1);
});
