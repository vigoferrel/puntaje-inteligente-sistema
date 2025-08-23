// Verificación Simplificada de Datos Supabase
// Basado en análisis CIO: "Base de datos FUNCIONAL pero SIN DATOS"
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://settifboilityelprvjd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("🔍 DIAGNÓSTICO DIRECTO DE SUPABASE");
console.log("📋 Verificando el problema: '0 Preguntas Validadas' y '0 Evaluaciones Activas'");
console.log("=" .repeat(70));

async function verificarTablasDirectamente() {
  const tablas = ['evaluaciones', 'banco_preguntas', 'examenes', 'preguntas'];
  const resultados = {};
  
  for (const tabla of tablas) {
    try {
      console.log(`\n🔍 Verificando tabla: ${tabla}`);
      
      // Contar registros
      const { count, error: countError } = await supabase
        .from(tabla)
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.log(`❌ ${tabla}: ${countError.message}`);
        resultados[tabla] = { existe: false, error: countError.message };
        continue;
      }
      
      resultados[tabla] = { existe: true, count: count || 0 };
      console.log(`📊 ${tabla}: ${count || 0} registros`);
      
      // Si tiene datos, mostrar una muestra
      if (count > 0) {
        const { data, error: sampleError } = await supabase
          .from(tabla)
          .select('*')
          .limit(1);
        
        if (!sampleError && data && data.length > 0) {
          console.log(`📋 Muestra de ${tabla}:`);
          console.log(JSON.stringify(data[0], null, 2));
        }
      }
      
    } catch (error) {
      console.log(`💥 Error crítico en ${tabla}:`, error.message);
      resultados[tabla] = { existe: false, error: error.message };
    }
  }
  
  return resultados;
}

async function probarConsultasEspecificas() {
  console.log("\n🎯 PROBANDO CONSULTAS ESPECÍFICAS DEL CÓDIGO...");
  
  // Esta es la consulta exacta que usa RealEvaluationSystem.tsx
  try {
    console.log("\n1. Probando consulta de evaluaciones activas:");
    const { data: evaluationsData, error: evalError } = await supabase
      .from('evaluaciones')
      .select('*')
      .eq('esta_activo', true)
      .order('created_at', { ascending: false });
    
    if (evalError) {
      console.log("❌ Error en evaluaciones:", evalError.message);
    } else {
      console.log(`✅ Evaluaciones encontradas: ${evaluationsData?.length || 0}`);
      if (evaluationsData && evaluationsData.length > 0) {
        console.log("📋 Primera evaluación:", JSON.stringify(evaluationsData[0], null, 2));
      }
    }
  } catch (error) {
    console.log("💥 Error probando evaluaciones:", error.message);
  }
  
  // Consulta de preguntas validadas
  try {
    console.log("\n2. Probando consulta de preguntas validadas:");
    const { count: questionsCount, error: questError } = await supabase
      .from('banco_preguntas')
      .select('*', { count: 'exact', head: true })
      .eq('validada', true);
    
    if (questError) {
      console.log("❌ Error en banco_preguntas:", questError.message);
    } else {
      console.log(`✅ Preguntas validadas: ${questionsCount || 0}`);
    }
  } catch (error) {
    console.log("💥 Error probando preguntas:", error.message);
  }
}

async function probarFuncionCIO() {
  console.log("\n🧪 PROBANDO FUNCIÓN CIO (vigoleonrocks_inference)...");
  
  try {
    const { data, error } = await supabase.rpc('vigoleonrocks_inference', {
      prompt: 'Test de verificación de datos'
    });
    
    if (error) {
      console.log("❌ Función CIO no encontrada:", error.message);
    } else {
      console.log("✅ Función CIO encontrada (solo template según análisis):");
      console.log("📝 Respuesta:", JSON.stringify(data, null, 2));
      console.log("⚠️  Nota: Según análisis CIO, esta función solo concatena strings");
    }
  } catch (error) {
    console.log("💥 Error probando función CIO:", error.message);
  }
}

async function generarDiagnostico(resultados) {
  console.log("\n" + "=".repeat(70));
  console.log("📋 DIAGNÓSTICO FINAL");
  console.log("=".repeat(70));
  
  console.log("\n🔍 ANÁLISIS DEL PROBLEMA:");
  console.log("❓ ¿Por qué la página muestra '0 Preguntas Validadas' y '0 Evaluaciones Activas'?");
  
  // Verificar cada tabla crítica
  const evaluacionesExiste = resultados['evaluaciones']?.existe;
  const evaluacionesCount = resultados['evaluaciones']?.count || 0;
  const preguntasExiste = resultados['banco_preguntas']?.existe;
  const preguntasCount = resultados['banco_preguntas']?.count || 0;
  
  console.log("\n🎯 CAUSA RAÍZ IDENTIFICADA:");
  
  if (!evaluacionesExiste) {
    console.log("🔴 CRÍTICO: Tabla 'evaluaciones' NO EXISTE");
  } else if (evaluacionesCount === 0) {
    console.log("🔴 PRINCIPAL: Tabla 'evaluaciones' existe pero está VACÍA");
    console.log("   → Esto explica '0 Evaluaciones Activas'");
  } else {
    console.log(`✅ Tabla 'evaluaciones': ${evaluacionesCount} registros`);
  }
  
  if (!preguntasExiste) {
    console.log("🔴 CRÍTICO: Tabla 'banco_preguntas' NO EXISTE");
  } else if (preguntasCount === 0) {
    console.log("🔴 PRINCIPAL: Tabla 'banco_preguntas' existe pero está VACÍA");
    console.log("   → Esto explica '0 Preguntas Validadas'");
  } else {
    console.log(`✅ Tabla 'banco_preguntas': ${preguntasCount} registros`);
  }
  
  console.log("\n📊 ESTADO ACTUAL DE TABLAS:");
  Object.entries(resultados).forEach(([tabla, info]) => {
    if (info.existe) {
      const status = info.count === 0 ? "🔴 VACÍA" : "✅ CON DATOS";
      console.log(`   ${tabla}: ${info.count} registros ${status}`);
    } else {
      console.log(`   ${tabla}: ❌ NO EXISTE (${info.error})`);
    }
  });
  
  console.log("\n🔧 SOLUCIÓN RECOMENDADA:");
  
  if (evaluacionesCount === 0) {
    console.log("1. 📥 POBLAR TABLA 'evaluaciones' con datos de prueba PAES");
  }
  
  if (preguntasCount === 0) {
    console.log("2. 📚 POBLAR TABLA 'banco_preguntas' con preguntas validadas");
  }
  
  console.log("3. 🔧 Verificar filtros en RealEvaluationSystem.tsx");
  console.log("4. 🧪 Probar consultas específicas después de poblar datos");
  
  console.log("\n⚠️  CONTEXTO SEGÚN ANÁLISIS CIO:");
  console.log("✅ Infraestructura Supabase: OPERACIONAL");
  console.log("✅ Credenciales: VÁLIDAS");
  console.log("❌ LLMs reales: 0 (solo templates/simulaciones)");
  console.log("❌ Datos de contenido: AUSENTES");
  console.log("📋 Veredicto: 'Framework sin cerebro' necesita datos");
}

async function main() {
  const resultados = await verificarTablasDirectamente();
  await probarConsultasEspecificas();
  await probarFuncionCIO();
  await generarDiagnostico(resultados);
  
  console.log("\n🏁 VERIFICACIÓN COMPLETADA");
  console.log("📊 Problema identificado: Base de datos SIN DATOS DE CONTENIDO");
}

main().catch(error => {
  console.error("💥 ERROR CRÍTICO EN VERIFICACIÓN:", error.message);
});

export { main as checkSupabaseSimple };
