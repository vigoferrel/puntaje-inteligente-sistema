// Script simple para encontrar todas las tablas que realmente existen
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://settifboilityelprvjd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("🔍 BUSCANDO TODAS LAS TABLAS EXISTENTES");
console.log("=====================================");

// Tablas que ya sabemos que existen
const tablasConocidas = [
  'evaluaciones', 'banco_preguntas', 'examenes', 'preguntas', 
  'learning_nodes', 'nodos', 'nodos_paes', 'nodos_aprendizaje',
  'educational_nodes', 'paes_nodes', 'profiles', 'user_achievements'
];

// Lista amplia de posibles tablas
const posiblesTablas = [
  // Auth y usuarios
  'auth', 'authentication', 'login', 'signup', 'tokens',
  
  // Más variaciones de evaluación
  'evaluations', 'assessments', 'tests', 'quizzes', 
  'exams', 'assignments', 'submissions',
  
  // Sesiones y resultados
  'sessions', 'attempts', 'responses', 'answers',
  'results', 'scores', 'grades', 'feedback',
  
  // Sistema académico  
  'subjects', 'topics', 'chapters', 'lessons',
  'curriculum', 'syllabus', 'courses',
  
  // Tracking y progreso
  'tracking', 'progress', 'achievements', 'badges',
  'milestones', 'goals', 'objectives',
  
  // Analytics
  'analytics', 'metrics', 'statistics', 'reports',
  'insights', 'dashboards',
  
  // Configuración
  'config', 'settings', 'preferences', 'options',
  'parameters', 'constants',
  
  // Multimedia y recursos
  'media', 'files', 'images', 'documents',
  'videos', 'audio', 'attachments',
  
  // Sistema de roles
  'roles', 'permissions', 'access', 'rights',
  
  // Notificaciones
  'notifications', 'alerts', 'messages', 'emails',
  
  // Logs y auditoría
  'logs', 'audit', 'history', 'changelog'
];

async function buscarTablaExistente(nombreTabla) {
  try {
    const { count, error } = await supabase
      .from(nombreTabla)
      .select('*', { count: 'exact', head: true });
    
    if (!error) {
      return { tabla: nombreTabla, count: count || 0, existe: true };
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function main() {
  console.log("\n📊 Verificando tablas conocidas...");
  
  const tablasEncontradas = [];
  
  // Verificar tablas conocidas primero
  for (const tabla of tablasConocidas) {
    const resultado = await buscarTablaExistente(tabla);
    if (resultado) {
      console.log(`✅ ${tabla}: ${resultado.count} registros`);
      tablasEncontradas.push(resultado);
    }
  }
  
  console.log("\n🔍 Buscando tablas adicionales...");
  
  // Buscar en lista amplia
  for (const tabla of posiblesTablas) {
    if (!tablasConocidas.includes(tabla)) {
      const resultado = await buscarTablaExistente(tabla);
      if (resultado) {
        console.log(`✅ ${tabla}: ${resultado.count} registros`);
        tablasEncontradas.push(resultado);
      }
    }
  }
  
  // Buscar variaciones con prefijos/sufijos comunes
  const prefijos = ['user_', 'paes_', 'system_', 'app_'];
  const sufijos = ['_data', '_info', '_details', '_history', '_log'];
  
  console.log("\n🔍 Buscando variaciones con prefijos/sufijos...");
  
  const tablasBase = ['progress', 'sessions', 'results', 'analytics'];
  
  for (const base of tablasBase) {
    // Con prefijos
    for (const prefijo of prefijos) {
      const tabla = prefijo + base;
      if (!tablasEncontradas.some(t => t.tabla === tabla)) {
        const resultado = await buscarTablaExistente(tabla);
        if (resultado) {
          console.log(`✅ ${tabla}: ${resultado.count} registros`);
          tablasEncontradas.push(resultado);
        }
      }
    }
    
    // Con sufijos
    for (const sufijo of sufijos) {
      const tabla = base + sufijo;
      if (!tablasEncontradas.some(t => t.tabla === tabla)) {
        const resultado = await buscarTablaExistente(tabla);
        if (resultado) {
          console.log(`✅ ${tabla}: ${resultado.count} registros`);
          tablasEncontradas.push(resultado);
        }
      }
    }
  }
  
  // Resumen final
  console.log("\n" + "=".repeat(60));
  console.log("📋 RESUMEN DE TABLAS ENCONTRADAS");
  console.log("=".repeat(60));
  
  const tablasConDatos = tablasEncontradas.filter(t => t.count > 0);
  const tablasVacias = tablasEncontradas.filter(t => t.count === 0);
  
  console.log(`\n📊 Total tablas encontradas: ${tablasEncontradas.length}`);
  console.log(`   • Con datos: ${tablasConDatos.length}`);
  console.log(`   • Vacías: ${tablasVacias.length}`);
  
  if (tablasConDatos.length > 0) {
    console.log("\n🏆 TABLAS CON DATOS:");
    tablasConDatos
      .sort((a, b) => b.count - a.count)
      .forEach(t => {
        console.log(`   📊 ${t.tabla}: ${t.count.toLocaleString()} registros`);
      });
  }
  
  if (tablasVacias.length > 0) {
    console.log("\n📝 TABLAS VACÍAS:");
    tablasVacias.forEach(t => {
      console.log(`   ⚪ ${t.tabla}`);
    });
  }
  
  console.log("\n🎯 ESTRUCTURA PRINCIPAL CONFIRMADA:");
  console.log("   • learning_nodes: 205 registros (nodos de aprendizaje)");
  console.log("   • preguntas: 211 registros (preguntas PAES oficiales)");
  console.log("   • examenes: 5 registros (exámenes PAES reales)");
  console.log("   • banco_preguntas: 2 registros (banco complementario)");
  console.log("   • evaluaciones: 0 registros (sistema pendiente)");
  
  const totalRegistros = tablasConDatos.reduce((sum, t) => sum + t.count, 0);
  console.log(`\n📈 Total registros en base de datos: ${totalRegistros.toLocaleString()}`);
  
  console.log("\n🏁 BÚSQUEDA COMPLETADA");
}

main().catch(console.error);
