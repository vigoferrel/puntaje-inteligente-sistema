// Verificar las 211 preguntas de la tabla 'preguntas'
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://settifboilityelprvjd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("🔍 VERIFICANDO LAS 211 PREGUNTAS EN TABLA 'preguntas'");
console.log("====================================================");

async function explorarTablaPreguntas() {
  console.log("\n📊 1. Explorando estructura de tabla 'preguntas'...");
  
  // Obtener una muestra para ver la estructura
  const { data: muestra, error } = await supabase
    .from('preguntas')
    .select('*')
    .limit(3);
  
  if (error) {
    console.log("❌ Error:", error.message);
    return;
  }
  
  console.log("📋 Estructura de la tabla 'preguntas':");
  if (muestra && muestra.length > 0) {
    console.log("Campos disponibles:", Object.keys(muestra[0]));
    console.log("\n🔍 Muestra de registro:");
    console.log(JSON.stringify(muestra[0], null, 2));
  }
  
  return muestra;
}

async function contarPreguntasValidadas() {
  console.log("\n📊 2. Verificando si hay campo 'validada' en tabla 'preguntas'...");
  
  try {
    // Intentar buscar preguntas validadas
    const { count, error } = await supabase
      .from('preguntas')
      .select('*', { count: 'exact', head: true })
      .eq('validada', true);
    
    if (error) {
      console.log("❌ No hay campo 'validada' en tabla 'preguntas':", error.message);
      return null;
    }
    
    console.log(`✅ Preguntas validadas en tabla 'preguntas': ${count || 0}`);
    return count || 0;
    
  } catch (error) {
    console.log("❌ Error verificando validación:", error.message);
    return null;
  }
}

async function explorarRelacionConExamenes() {
  console.log("\n🔗 3. Explorando relación entre 'preguntas' y 'examenes'...");
  
  // Contar preguntas por examen
  const { data: preguntasPorExamen, error } = await supabase
    .from('preguntas')
    .select('examen_id')
    .limit(10);
  
  if (error) {
    console.log("❌ Error:", error.message);
    return;
  }
  
  console.log("🔍 Algunas preguntas y sus exámenes:");
  const examenesIds = [...new Set(preguntasPorExamen?.map(p => p.examen_id))];
  console.log(`📊 IDs de exámenes encontrados: ${examenesIds.length}`);
  
  // Obtener info de esos exámenes
  if (examenesIds.length > 0) {
    const { data: examenesData } = await supabase
      .from('examenes')
      .select('id, codigo, nombre, tipo')
      .in('id', examenesIds.slice(0, 3));
    
    console.log("📋 Exámenes relacionados:");
    examenesData?.forEach(exam => {
      console.log(`   • ${exam.codigo}: ${exam.nombre} (${exam.tipo})`);
    });
  }
}

async function verificarConsultaCodigoOriginal() {
  console.log("\n🔍 4. Verificando qué consulta debería usar RealEvaluationSystem...");
  
  // Ver qué tabla tiene más sentido para contar "preguntas validadas"
  console.log("\nComparando opciones:");
  
  // Opción 1: banco_preguntas con validada=true
  const { count: bancoPreguntasValidadas } = await supabase
    .from('banco_preguntas')
    .select('*', { count: 'exact', head: true })
    .eq('validada', true);
  
  console.log(`📊 banco_preguntas validadas: ${bancoPreguntasValidadas || 0}`);
  
  // Opción 2: todas las preguntas de tabla preguntas
  const { count: todasPreguntas } = await supabase
    .from('preguntas')
    .select('*', { count: 'exact', head: true });
  
  console.log(`📊 Total preguntas en 'preguntas': ${todasPreguntas || 0}`);
  
  // Opción 3: preguntas que tienen examen_id válido
  const { count: preguntasConExamen } = await supabase
    .from('preguntas')
    .select('*', { count: 'exact', head: true })
    .not('examen_id', 'is', null);
  
  console.log(`📊 Preguntas con examen_id: ${preguntasConExamen || 0}`);
  
  return {
    bancoPreguntasValidadas: bancoPreguntasValidadas || 0,
    todasPreguntas: todasPreguntas || 0,
    preguntasConExamen: preguntasConExamen || 0
  };
}

async function analizarQueDeberíaMostrar(conteos) {
  console.log("\n" + "=".repeat(60));
  console.log("📋 ANÁLISIS FINAL");
  console.log("=".repeat(60));
  
  console.log("\n🤔 ¿Qué número debería mostrar la página?");
  
  if (conteos.todasPreguntas === 211) {
    console.log("✅ RESPUESTA: Debería mostrar '211 Preguntas Validadas'");
    console.log("📝 La tabla 'preguntas' tiene 211 registros reales");
    console.log("🔧 El código actual busca en 'banco_preguntas' pero debería buscar en 'preguntas'");
  }
  
  console.log("\n📊 Opciones de consulta:");
  console.log(`   Opción A: banco_preguntas validadas = ${conteos.bancoPreguntasValidadas}`);
  console.log(`   Opción B: todas las preguntas = ${conteos.todasPreguntas}`);
  console.log(`   Opción C: preguntas con examen = ${conteos.preguntasConExamen}`);
  
  console.log("\n🎯 RECOMENDACIÓN:");
  if (conteos.todasPreguntas > conteos.bancoPreguntasValidadas) {
    console.log("✅ Usar tabla 'preguntas' en lugar de 'banco_preguntas'");
    console.log("📝 Cambiar la consulta en RealEvaluationSystem.tsx");
    console.log(`🔢 Resultado esperado: ${conteos.todasPreguntas} Preguntas Validadas`);
  }
}

async function main() {
  await explorarTablaPreguntas();
  await contarPreguntasValidadas();
  await explorarRelacionConExamenes();
  const conteos = await verificarConsultaCodigoOriginal();
  await analizarQueDeberíaMostrar(conteos);
  
  console.log("\n🏁 VERIFICACIÓN COMPLETADA");
}

main().catch(console.error);
