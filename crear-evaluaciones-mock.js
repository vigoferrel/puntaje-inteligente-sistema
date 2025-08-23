// Script para crear datos de evaluaciones PAES como datos mock
// Alternativa para evitar políticas de seguridad de Supabase

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://settifboilityelprvjd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("🛠️ CREANDO EVALUACIONES MOCK PARA SISTEMA PAES");
console.log("============================================");

// Verificar estado actual primero
async function verificarEstadoActual() {
  console.log("\n📊 Estado actual del sistema:");
  
  // Preguntas validadas
  const { count: pregCount } = await supabase
    .from('banco_preguntas')
    .select('*', { count: 'exact', head: true })
    .eq('validada', true);
  
  // Evaluaciones existentes
  const { count: evalCount } = await supabase
    .from('evaluaciones')
    .select('*', { count: 'exact', head: true });
  
  console.log(`📋 Preguntas validadas: ${pregCount || 0}`);
  console.log(`📋 Evaluaciones totales: ${evalCount || 0}`);
  
  return { preguntas: pregCount || 0, evaluaciones: evalCount || 0 };
}

// Usar método alternativo con usuario autenticado si es necesario
async function intentarCrearConAdmin() {
  console.log("\n🔐 Intentando crear evaluaciones con diferentes métodos...");
  
  const evaluacionTest = {
    codigo: "PAES-TEST-001",
    nombre: "Evaluación de Prueba PAES",
    tipo_evaluacion: "diagnostica",
    duracion_minutos: 60,
    total_preguntas: 20,
    nivel_dificultad: "basico",
    prueba_paes: "COMPETENCIA_LECTORA",
    esta_activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Método 1: Insert directo
  console.log("Método 1: Insert directo...");
  const { data: data1, error: error1 } = await supabase
    .from('evaluaciones')
    .insert([evaluacionTest])
    .select();
  
  if (error1) {
    console.log(`❌ Método 1 falló: ${error1.message}`);
    
    // Método 2: Upsert con ID
    console.log("Método 2: Upsert con ID...");
    const evaluacionConId = {
      ...evaluacionTest,
      id: crypto.randomUUID ? crypto.randomUUID() : `test-${Date.now()}`
    };
    
    const { data: data2, error: error2 } = await supabase
      .from('evaluaciones')
      .upsert([evaluacionConId])
      .select();
    
    if (error2) {
      console.log(`❌ Método 2 falló: ${error2.message}`);
      return false;
    } else {
      console.log("✅ Método 2 exitoso!");
      return true;
    }
  } else {
    console.log("✅ Método 1 exitoso!");
    return true;
  }
}

// Verificar si hay problemas con RLS (Row Level Security)
async function verificarRLS() {
  console.log("\n🔍 Diagnosticando políticas de seguridad...");
  
  // Intentar leer evaluaciones para ver si hay restricciones
  const { data, error, status, statusText } = await supabase
    .from('evaluaciones')
    .select('*')
    .limit(1);
  
  console.log(`📊 Status de lectura: ${status} ${statusText}`);
  
  if (error) {
    console.log(`❌ Error de lectura: ${error.message}`);
    return false;
  }
  
  console.log(`✅ Lectura exitosa, ${data?.length || 0} registros encontrados`);
  return true;
}

// Crear datos mock en el frontend como alternativa
async function crearMockEnFrontend() {
  console.log("\n🎭 Creando datos mock para el frontend...");
  
  const mockEvaluations = [
    {
      id: "mock-1",
      codigo: "PAES-CL-MOCK-001",
      nombre: "Comprensión Lectora - Diagnóstico",
      tipo_evaluacion: "diagnostica",
      duracion_minutos: 90,
      total_preguntas: 30,
      nivel_dificultad: "mixto",
      prueba_paes: "COMPETENCIA_LECTORA",
      questionsFromBank: 2,
      averageScore: 0,
      completionRate: 0
    },
    {
      id: "mock-2", 
      codigo: "PAES-MT-MOCK-001",
      nombre: "Matemática 1 - Números",
      tipo_evaluacion: "formativa",
      duracion_minutos: 60,
      total_preguntas: 25,
      nivel_dificultad: "basico", 
      prueba_paes: "COMPETENCIA_MATEMATICA_1",
      questionsFromBank: 2,
      averageScore: 0,
      completionRate: 0
    },
    {
      id: "mock-3",
      codigo: "PAES-CN-MOCK-001", 
      nombre: "Ciencias Naturales",
      tipo_evaluacion: "sumativa",
      duracion_minutos: 120,
      total_preguntas: 40,
      nivel_dificultad: "avanzado",
      prueba_paes: "CIENCIAS",
      questionsFromBank: 2,
      averageScore: 0,
      completionRate: 0
    }
  ];
  
  console.log("📝 Datos mock creados para usar en el frontend:");
  mockEvaluations.forEach(eval => {
    console.log(`   • ${eval.codigo}: ${eval.nombre}`);
  });
  
  return mockEvaluations;
}

async function main() {
  const estadoInicial = await verificarEstadoActual();
  
  if (estadoInicial.preguntas === 0) {
    console.log("\n⚠️ No hay preguntas validadas. Ejecutar populate-data.js primero.");
    return;
  }
  
  const rlsOk = await verificarRLS();
  const creacionExitosa = await intentarCrearConAdmin();
  
  if (!creacionExitosa) {
    console.log("\n🎭 No se pudieron crear evaluaciones en Supabase.");
    console.log("Alternativa: Usar datos mock en el frontend.");
    const mockData = await crearMockEnFrontend();
    
    console.log("\n📋 SOLUCIÓN RECOMENDADA:");
    console.log("1. Modificar RealEvaluationSystem.tsx para usar datos mock cuando Supabase esté vacío");
    console.log("2. Agregar fallback con datos de ejemplo");
    console.log("3. Mostrar mensaje explicativo al usuario");
  }
  
  // Verificar estado final
  const estadoFinal = await verificarEstadoActual();
  
  console.log("\n" + "=".repeat(50));
  console.log("📋 REPORTE FINAL");
  console.log("=".repeat(50));
  console.log(`✅ Preguntas validadas: ${estadoFinal.preguntas}`);
  console.log(`${estadoFinal.evaluaciones > 0 ? '✅' : '❌'} Evaluaciones: ${estadoFinal.evaluaciones}`);
  
  if (estadoFinal.preguntas > 0 && estadoFinal.evaluaciones === 0) {
    console.log("\n💡 PROBLEMA PARCIALMENTE SOLUCIONADO:");
    console.log("• ✅ Ya NO muestra '0 Preguntas Validadas'");
    console.log("• ⚠️ Aún muestra '0 Evaluaciones Activas' (problema de RLS)");
    console.log("\n🔧 PRÓXIMO PASO: Modificar el componente para mostrar datos mock");
  }
}

main().catch(console.error);
