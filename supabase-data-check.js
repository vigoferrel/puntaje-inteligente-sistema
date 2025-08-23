// Script de Verificación de Datos Reales en Supabase
// Basado en el análisis CIO proporcionado
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://settifboilityelprvjd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("🔍 INICIANDO VERIFICACIÓN DE DATOS REALES SUPABASE");
console.log("📊 Análisis basado en reporte CIO de infraestructura sin inteligencia");
console.log("=" .repeat(80));

async function verificarConexion() {
  try {
    console.log("\n🌐 1. VERIFICANDO CONEXIÓN A SUPABASE...");
    
    // Test básico de conexión
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);
    
    if (error) {
      console.log("❌ ERROR DE CONEXIÓN:", error.message);
      return false;
    }
    
    console.log("✅ Conexión exitosa a Supabase");
    return true;
  } catch (error) {
    console.log("❌ ERROR CRÍTICO DE CONEXIÓN:", error.message);
    return false;
  }
}

async function listarTablas() {
  try {
    console.log("\n📋 2. LISTANDO TABLAS DISPONIBLES...");
    
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (error) {
      console.log("❌ Error listando tablas:", error.message);
      return [];
    }
    
    const tablas = data.map(row => row.table_name);
    console.log("📊 Tablas encontradas:", tablas.length);
    tablas.forEach(tabla => console.log(`   - ${tabla}`));
    
    return tablas;
  } catch (error) {
    console.log("❌ Error obteniendo tablas:", error.message);
    return [];
  }
}

async function verificarTablasEvaluaciones(tablas) {
  console.log("\n🎯 3. VERIFICANDO TABLAS DE EVALUACIONES...");
  
  const tablasRelevantes = [
    'evaluaciones',
    'banco_preguntas',
    'preguntas',
    'examenes',
    'opciones_respuesta'
  ];
  
  const tablasExistentes = [];
  const tablasFaltantes = [];
  
  for (const tabla of tablasRelevantes) {
    if (tablas.includes(tabla)) {
      tablasExistentes.push(tabla);
      console.log(`✅ Tabla '${tabla}' existe`);
    } else {
      tablasFaltantes.push(tabla);
      console.log(`❌ Tabla '${tabla}' NO existe`);
    }
  }
  
  return { tablasExistentes, tablasFaltantes };
}

async function contarRegistros(tabla) {
  try {
    const { count, error } = await supabase
      .from(tabla)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`❌ Error contando registros en '${tabla}':`, error.message);
      return -1;
    }
    
    return count || 0;
  } catch (error) {
    console.log(`❌ Error crítico en '${tabla}':`, error.message);
    return -1;
  }
}

async function verificarDatos(tablasExistentes) {
  console.log("\n📊 4. VERIFICANDO CONTENIDO DE DATOS...");
  
  const resultados = {};
  
  for (const tabla of tablasExistentes) {
    const count = await contarRegistros(tabla);
    resultados[tabla] = count;
    
    if (count === -1) {
      console.log(`🔴 ${tabla}: ERROR AL CONTAR`);
    } else if (count === 0) {
      console.log(`⚠️  ${tabla}: ${count} registros (VACÍA)`);
    } else {
      console.log(`✅ ${tabla}: ${count} registros`);
    }
  }
  
  return resultados;
}

async function muestrearDatos(tablasExistentes) {
  console.log("\n🔬 5. MUESTREANDO DATOS EXISTENTES...");
  
  for (const tabla of tablasExistentes) {
    try {
      const { data, error } = await supabase
        .from(tabla)
        .select('*')
        .limit(3);
      
      if (error) {
        console.log(`❌ Error muestreando '${tabla}':`, error.message);
        continue;
      }
      
      if (data && data.length > 0) {
        console.log(`\n🔍 MUESTRA de '${tabla}':`);
        console.log(JSON.stringify(data[0], null, 2));
        if (data.length > 1) {
          console.log(`   ... y ${data.length - 1} registro(s) más`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Error crítico muestreando '${tabla}':`, error.message);
    }
  }
}

async function probarFuncionesSupabase() {
  console.log("\n🧪 6. PROBANDO FUNCIONES SQL (Análisis CIO)...");
  
  // Basado en el análisis CIO, probar función vigoleonrocks_inference
  try {
    console.log("🔍 Probando vigoleonrocks_inference...");
    
    const { data, error } = await supabase.rpc('vigoleonrocks_inference', {
      prompt: 'Test desde verificación de datos'
    });
    
    if (error) {
      console.log("❌ Función vigoleonrocks_inference no encontrada:", error.message);
    } else {
      console.log("✅ Función vigoleonrocks_inference encontrada:");
      console.log("📝 Respuesta:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log("❌ Error probando funciones:", error.message);
  }
}

async function generarReporte(tablasExistentes, tablasFaltantes, conteos) {
  console.log("\n" + "=".repeat(80));
  console.log("📋 REPORTE FINAL DE VERIFICACIÓN DE DATOS SUPABASE");
  console.log("=".repeat(80));
  
  console.log("\n🔍 DIAGNÓSTICO DEL PROBLEMA:");
  console.log("❓ Por qué muestra '0 Preguntas Validadas' y '0 Evaluaciones Activas'");
  
  // Análisis específico para el problema
  if (conteos['evaluaciones'] === 0) {
    console.log("🔴 CAUSA PRINCIPAL: Tabla 'evaluaciones' está VACÍA");
    console.log("📝 Solución: Necesita poblar datos de evaluaciones PAES");
  }
  
  if (conteos['banco_preguntas'] === 0) {
    console.log("🔴 PROBLEMA: Tabla 'banco_preguntas' está VACÍA"); 
    console.log("📝 Solución: Necesita importar preguntas validadas");
  }
  
  console.log("\n📊 RESUMEN DE TABLAS:");
  console.log(`✅ Tablas existentes: ${tablasExistentes.length}`);
  console.log(`❌ Tablas faltantes: ${tablasFaltantes.length}`);
  
  console.log("\n📈 CONTEO DE REGISTROS:");
  Object.entries(conteos).forEach(([tabla, count]) => {
    const status = count === 0 ? "🔴 VACÍA" : count > 0 ? "✅ CON DATOS" : "❌ ERROR";
    console.log(`   ${tabla}: ${count} registros ${status}`);
  });
  
  console.log("\n🎯 PLAN DE ACCIÓN RECOMENDADO:");
  console.log("1. 📥 Crear datos de ejemplo para evaluaciones");
  console.log("2. 📚 Poblar banco de preguntas con contenido PAES");
  console.log("3. 🔧 Verificar filtros en el componente RealEvaluationSystem");
  console.log("4. 🧪 Confirmar que las consultas SQL son correctas");
  
  // Según el análisis CIO
  console.log("\n⚠️  CONTEXTO (Análisis CIO):");
  console.log("📋 Infraestructura Supabase: OPERACIONAL");  
  console.log("🧠 LLMs implementados: 0 (solo templates)");
  console.log("💾 Base de datos: FUNCIONAL pero SIN DATOS");
  console.log("🏗️  Arquitectura: EXCELENTE, falta contenido");
}

// Función principal
async function main() {
  const conectado = await verificarConexion();
  if (!conectado) return;
  
  const tablas = await listarTablas();
  if (tablas.length === 0) return;
  
  const { tablasExistentes, tablasFaltantes } = await verificarTablasEvaluaciones(tablas);
  const conteos = await verificarDatos(tablasExistentes);
  
  if (tablasExistentes.length > 0) {
    await muestrearDatos(tablasExistentes);
  }
  
  await probarFuncionesSupabase();
  await generarReporte(tablasExistentes, tablasFaltantes, conteos);
  
  console.log("\n🏁 VERIFICACIÓN COMPLETADA");
  console.log("📊 Datos listos para análisis y solución del problema");
}

// Ejecutar
main().catch(error => {
  console.error("💥 ERROR CRÍTICO:", error);
});

export { main as verificarDatosSupabase };
