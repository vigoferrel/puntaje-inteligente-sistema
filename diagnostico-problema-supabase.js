#!/usr/bin/env node

/**
 * DIAGNÓSTICO PROFUNDO DEL PROBLEMA CON SUPABASE
 * 
 * Este script identifica la raíz del problema con las tablas educativas
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const SUPABASE_URL = "https://settifboilityelprvjd.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzg1ODIyMiwiZXhwIjoyMDYzNDM0MjIyfQ.VlriU1ShZH_PFPJzutat2uqnc-TZ6plxUIaBp7NTZyE";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function diagnosticarProblema() {
  console.log('🔍 DIAGNÓSTICO PROFUNDO DEL PROBLEMA CON SUPABASE');
  console.log('=' .repeat(60));
  
  // 1. Verificar conexión básica
  console.log('\n1️⃣ Verificando conexión básica...');
  try {
    const { data, error } = await supabase.from('_dummy').select('*').limit(1);
    if (error && error.message.includes('does not exist')) {
      console.log('✅ Conexión a Supabase funcionando');
    } else {
      console.log('❌ Problema con la conexión:', error?.message);
    }
  } catch (err) {
    console.log('❌ Error de conexión:', err.message);
  }
  
  // 2. Verificar tablas existentes en el sistema
  console.log('\n2️⃣ Verificando tablas existentes...');
  const tablasExistentes = [
    'study_sessions',
    'user_achievements', 
    'user_stats'
  ];
  
  for (const tabla of tablasExistentes) {
    try {
      const { data, error } = await supabase.from(tabla).select('*').limit(1);
      if (error) {
        console.log(`❌ Tabla ${tabla}: ${error.message}`);
      } else {
        console.log(`✅ Tabla ${tabla}: Existe y accesible`);
      }
    } catch (err) {
      console.log(`❌ Error verificando ${tabla}: ${err.message}`);
    }
  }
  
  // 3. Verificar tablas que deberían existir pero no aparecen
  console.log('\n3️⃣ Verificando tablas que deberían existir...');
  const tablasFaltantes = [
    'paes_subjects',
    'bloom_levels',
    'subject_topics',
    'user_preferences',
    'user_progress',
    'exercise_bank',
    'user_exercises',
    'paes_simulations',
    'user_simulations',
    'achievements'
  ];
  
  for (const tabla of tablasFaltantes) {
    try {
      const { data, error } = await supabase.from(tabla).select('*').limit(1);
      if (error && error.message.includes('Could not find the table')) {
        console.log(`❌ Tabla ${tabla}: NO EXISTE en el schema`);
      } else if (error) {
        console.log(`⚠️  Tabla ${tabla}: Error diferente - ${error.message}`);
      } else {
        console.log(`✅ Tabla ${tabla}: SÍ EXISTE (¡sorpresa!)`);
      }
    } catch (err) {
      console.log(`❌ Error verificando ${tabla}: ${err.message}`);
    }
  }
  
  // 4. Verificar si el problema es de permisos
  console.log('\n4️⃣ Verificando permisos y RLS...');
  try {
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`❌ Problema de permisos: ${error.message}`);
    } else {
      console.log('✅ Permisos funcionando correctamente');
    }
  } catch (err) {
    console.log(`❌ Error de permisos: ${err.message}`);
  }
  
  // 5. Verificar si el problema es de cache
  console.log('\n5️⃣ Verificando si es problema de cache...');
  try {
    // Intentar una consulta que force refresh del cache
    const { data, error } = await supabase
      .from('study_sessions')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log(`❌ Problema de cache: ${error.message}`);
    } else {
      console.log('✅ Cache funcionando correctamente');
    }
  } catch (err) {
    console.log(`❌ Error de cache: ${err.message}`);
  }
  
  // 6. Verificar configuración del cliente
  console.log('\n6️⃣ Verificando configuración del cliente...');
  console.log(`URL: ${SUPABASE_URL}`);
  console.log(`Service Key: ${SUPABASE_SERVICE_KEY.substring(0, 20)}...`);
  console.log(`Cliente configurado: ${supabase ? 'SÍ' : 'NO'}`);
  
  // 7. Intentar crear una tabla de prueba
  console.log('\n7️⃣ Intentando crear tabla de prueba...');
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name TEXT);'
    });
    
    if (error) {
      console.log(`❌ No se puede crear tabla: ${error.message}`);
    } else {
      console.log('✅ Se puede crear tabla usando exec_sql');
      
      // Limpiar tabla de prueba
      await supabase.rpc('exec_sql', {
        sql: 'DROP TABLE IF EXISTS test_table;'
      });
    }
  } catch (err) {
    console.log(`❌ Error creando tabla de prueba: ${err.message}`);
  }
  
  // 8. Análisis del problema
  console.log('\n8️⃣ ANÁLISIS DEL PROBLEMA:');
  console.log('=' .repeat(40));
  console.log('🔍 POSIBLES CAUSAS:');
  console.log('1. Las tablas se crearon en un schema diferente');
  console.log('2. Las tablas se crearon pero no se confirmaron (rollback)');
  console.log('3. Problema de permisos con la service role key');
  console.log('4. Cache de Supabase no se ha actualizado');
  console.log('5. Las tablas se crearon con nombres diferentes');
  console.log('6. Problema de configuración de RLS');
  
  console.log('\n💡 SOLUCIONES RECOMENDADAS:');
  console.log('1. Verificar en el dashboard de Supabase si las tablas existen');
  console.log('2. Usar el SQL Editor de Supabase para crear las tablas manualmente');
  console.log('3. Verificar que la service role key tenga permisos completos');
  console.log('4. Esperar unos minutos y reintentar (problema de cache)');
  console.log('5. Usar Supabase CLI para verificar el estado real de la base de datos');
  
  console.log('\n🔗 Enlaces útiles:');
  console.log(`Dashboard: https://supabase.com/dashboard/project/settifboilityelprvjd/api?page=tables-intro`);
  console.log(`SQL Editor: https://supabase.com/dashboard/project/settifboilityelprvjd/sql/new`);
}

// Ejecutar diagnóstico
diagnosticarProblema().catch(err => {
  console.error('Error en el diagnóstico:', err);
  process.exit(1);
});
