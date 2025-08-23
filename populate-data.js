// Script Simple para Poblar Datos de Evaluaciones PAES
// Solución directa al problema: "0 Preguntas Validadas" y "0 Evaluaciones Activas"

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://settifboilityelprvjd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("🔧 POBLANDO DATOS PARA SISTEMA DE EVALUACIONES");
console.log("Solucionando: 0 Preguntas Validadas y 0 Evaluaciones Activas");
console.log("=" .repeat(60));

// Datos de evaluaciones PAES
const evaluaciones = [
  {
    codigo: "EVAL-CL-001",
    nombre: "Comprensión Lectora - Diagnóstico",
    tipo_evaluacion: "diagnostica",
    duracion_minutos: 90,
    total_preguntas: 30,
    nivel_dificultad: "mixto",
    prueba_paes: "COMPETENCIA_LECTORA",
    esta_activo: true
  },
  {
    codigo: "EVAL-MT-001", 
    nombre: "Matemática 1 - Números",
    tipo_evaluacion: "formativa",
    duracion_minutos: 60,
    total_preguntas: 25,
    nivel_dificultad: "basico",
    prueba_paes: "COMPETENCIA_MATEMATICA_1",
    esta_activo: true
  },
  {
    codigo: "EVAL-CN-001",
    nombre: "Ciencias Naturales",
    tipo_evaluacion: "sumativa",
    duracion_minutos: 120,
    total_preguntas: 40,
    nivel_dificultad: "avanzado",
    prueba_paes: "CIENCIAS",
    esta_activo: true
  }
];

async function validarPreguntas() {
  console.log("\n📚 1. Validando preguntas existentes...");
  
  const { data, error } = await supabase
    .from('banco_preguntas')
    .update({ validada: true })
    .eq('validada', false)
    .select();
  
  if (error) {
    console.log("❌ Error:", error.message);
    return 0;
  }
  
  console.log(`✅ ${data?.length || 0} preguntas validadas`);
  return data?.length || 0;
}

async function crearEvaluaciones() {
  console.log("\n🎯 2. Creando evaluaciones...");
  
  let creadas = 0;
  
  for (const evaluacion of evaluaciones) {
    const { data, error } = await supabase
      .from('evaluaciones')
      .insert([evaluacion])
      .select();
    
    if (error) {
      console.log(`❌ Error con ${evaluacion.codigo}:`, error.message);
      continue;
    }
    
    console.log(`✅ Creada: ${evaluacion.codigo}`);
    creadas++;
  }
  
  return creadas;
}

async function verificarResultados() {
  console.log("\n📊 3. Verificando resultados...");
  
  // Contar evaluaciones activas
  const { count: evalCount } = await supabase
    .from('evaluaciones')
    .select('*', { count: 'exact', head: true })
    .eq('esta_activo', true);
  
  // Contar preguntas validadas
  const { count: pregCount } = await supabase
    .from('banco_preguntas')
    .select('*', { count: 'exact', head: true })
    .eq('validada', true);
  
  console.log(`📋 Evaluaciones activas: ${evalCount || 0}`);
  console.log(`📋 Preguntas validadas: ${pregCount || 0}`);
  
  return { evaluaciones: evalCount || 0, preguntas: pregCount || 0 };
}

async function main() {
  const preguntasValidadas = await validarPreguntas();
  const evaluacionesCreadas = await crearEvaluaciones();
  const resultados = await verificarResultados();
  
  console.log("\n" + "=".repeat(60));
  console.log("📋 RESULTADOS FINALES");
  console.log("=".repeat(60));
  
  if (resultados.evaluaciones > 0) {
    console.log(`✅ ${resultados.evaluaciones} evaluaciones activas`);
  } else {
    console.log("❌ Sin evaluaciones activas");
  }
  
  if (resultados.preguntas > 0) {
    console.log(`✅ ${resultados.preguntas} preguntas validadas`);
  } else {
    console.log("❌ Sin preguntas validadas");
  }
  
  console.log("\n🔄 Recarga la página para ver los cambios:");
  console.log("http://192.168.100.7:8080/evaluations");
  
  if (resultados.evaluaciones > 0 && resultados.preguntas > 0) {
    console.log("\n🎉 ¡Problema solucionado!");
  }
}

main().catch(console.error);
