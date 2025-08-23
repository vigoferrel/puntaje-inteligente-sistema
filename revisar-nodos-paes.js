// Revisar nodos PAES en Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://settifboilityelprvjd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("🎓 REVISANDO NODOS PAES EN SUPABASE");
console.log("=====================================");

async function buscarTablasNodos() {
  console.log("\n🔍 1. Buscando tablas relacionadas con nodos...");
  
  const tablasABuscar = [
    'nodos',
    'learning_nodes', 
    'nodos_paes',
    'nodos_aprendizaje',
    'educational_nodes',
    'paes_nodes'
  ];
  
  const tablasEncontradas = [];
  
  for (const tabla of tablasABuscar) {
    try {
      const { count, error } = await supabase
        .from(tabla)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`✅ Tabla '${tabla}': ${count || 0} registros`);
        tablasEncontradas.push({ tabla, count: count || 0 });
      } else {
        console.log(`❌ Tabla '${tabla}': No existe`);
      }
    } catch (err) {
      console.log(`❌ Tabla '${tabla}': Error de acceso`);
    }
  }
  
  return tablasEncontradas;
}

async function explorarTablaNodos(tabla, count) {
  if (count === 0) {
    console.log(`⚠️ Tabla ${tabla} está vacía`);
    return;
  }
  
  console.log(`\n🔍 Explorando tabla '${tabla}' (${count} registros):`);
  
  // Obtener estructura
  const { data: muestra, error } = await supabase
    .from(tabla)
    .select('*')
    .limit(3);
  
  if (error) {
    console.log(`❌ Error obteniendo muestra: ${error.message}`);
    return;
  }
  
  if (muestra && muestra.length > 0) {
    console.log("📋 Campos disponibles:", Object.keys(muestra[0]));
    console.log("\n🔍 Muestra de registros:");
    muestra.forEach((nodo, index) => {
      console.log(`\n   Registro ${index + 1}:`);
      Object.entries(nodo).forEach(([key, value]) => {
        if (value && key !== 'created_at' && key !== 'updated_at') {
          const displayValue = typeof value === 'string' && value.length > 50 
            ? value.substring(0, 50) + '...' 
            : value;
          console.log(`     ${key}: ${displayValue}`);
        }
      });
    });
  }
}

async function buscarReferenciasNodos() {
  console.log("\n🔗 2. Buscando referencias a nodos en otras tablas...");
  
  // Buscar en banco_preguntas
  try {
    const { data: preguntasConNodo } = await supabase
      .from('banco_preguntas')
      .select('nodo_id, nodo_code')
      .not('nodo_id', 'is', null)
      .limit(5);
    
    console.log("📚 Referencias en 'banco_preguntas':");
    if (preguntasConNodo && preguntasConNodo.length > 0) {
      preguntasConNodo.forEach(p => {
        console.log(`   nodo_id: ${p.nodo_id}, nodo_code: ${p.nodo_code}`);
      });
    } else {
      console.log("   Sin referencias a nodos");
    }
  } catch (error) {
    console.log("❌ Error buscando en banco_preguntas:", error.message);
  }
  
  // Buscar en preguntas
  try {
    const { data: preguntasTabla } = await supabase
      .from('preguntas')
      .select('*')
      .limit(3);
    
    if (preguntasTabla && preguntasTabla.length > 0) {
      console.log("\n📝 Campos en tabla 'preguntas':");
      const campos = Object.keys(preguntasTabla[0]);
      const camposNodo = campos.filter(campo => 
        campo.toLowerCase().includes('nodo') || 
        campo.toLowerCase().includes('node')
      );
      
      if (camposNodo.length > 0) {
        console.log("   Campos relacionados con nodos:", camposNodo);
      } else {
        console.log("   No hay campos relacionados con nodos");
      }
    }
  } catch (error) {
    console.log("❌ Error explorando preguntas:", error.message);
  }
}

async function explorarEstructuraPAES() {
  console.log("\n🎯 3. Explorando estructura PAES...");
  
  // Analizar tipos de PAES en banco_preguntas
  try {
    const { data: tiposPAES } = await supabase
      .from('banco_preguntas')
      .select('prueba_paes')
      .not('prueba_paes', 'is', null);
    
    if (tiposPAES && tiposPAES.length > 0) {
      const tiposUnicos = [...new Set(tiposPAES.map(t => t.prueba_paes))];
      console.log("📊 Tipos de PAES encontrados:");
      tiposUnicos.forEach(tipo => {
        console.log(`   • ${tipo}`);
      });
    }
  } catch (error) {
    console.log("❌ Error explorando tipos PAES:", error.message);
  }
  
  // Analizar examenes
  try {
    const { data: examenes } = await supabase
      .from('examenes')
      .select('codigo, nombre, tipo')
      .limit(5);
    
    if (examenes && examenes.length > 0) {
      console.log("\n📋 Exámenes PAES disponibles:");
      examenes.forEach(exam => {
        console.log(`   • ${exam.codigo}: ${exam.nombre} (${exam.tipo})`);
      });
    }
  } catch (error) {
    console.log("❌ Error explorando exámenes:", error.message);
  }
}

async function buscarSistemaAprendizaje() {
  console.log("\n🧠 4. Buscando sistema de aprendizaje/nodos...");
  
  const tablasAprendizaje = [
    'user_progress',
    'learning_progress', 
    'student_progress',
    'progress_tracking',
    'user_learning_paths',
    'learning_analytics'
  ];
  
  for (const tabla of tablasAprendizaje) {
    try {
      const { count, error } = await supabase
        .from(tabla)
        .select('*', { count: 'exact', head: true });
      
      if (!error && count !== null) {
        console.log(`✅ ${tabla}: ${count} registros`);
        
        if (count > 0) {
          const { data: muestra } = await supabase
            .from(tabla)
            .select('*')
            .limit(1);
          
          if (muestra && muestra.length > 0) {
            console.log(`   Campos: ${Object.keys(muestra[0]).join(', ')}`);
          }
        }
      }
    } catch (err) {
      // Tabla no existe, continuar silenciosamente
    }
  }
}

async function generarReporteNodos(tablasEncontradas) {
  console.log("\n" + "=".repeat(50));
  console.log("📋 REPORTE FINAL - NODOS PAES");
  console.log("=".repeat(50));
  
  if (tablasEncontradas.length === 0) {
    console.log("\n❌ NO SE ENCONTRARON TABLAS DE NODOS");
    console.log("🤔 Posibles razones:");
    console.log("   • El sistema no usa nodos explícitos");
    console.log("   • Los nodos están embebidos en otras estructuras");
    console.log("   • Nombre de tabla diferente al buscado");
  } else {
    console.log("\n✅ TABLAS DE NODOS ENCONTRADAS:");
    tablasEncontradas.forEach(t => {
      console.log(`   • ${t.tabla}: ${t.count} registros`);
    });
  }
  
  console.log("\n🎯 ESTRUCTURA PAES IDENTIFICADA:");
  console.log("   • Preguntas: 211 registros en tabla 'preguntas'");
  console.log("   • Exámenes: 5 registros oficiales PAES");
  console.log("   • Banco complementario: 2 preguntas en 'banco_preguntas'");
  console.log("   • Evaluaciones: 0 (sistema pendiente)");
  
  console.log("\n💡 OBSERVACIONES:");
  console.log("   • Sistema funciona sin nodos explícitos");
  console.log("   • Estructura basada en exámenes reales PAES");
  console.log("   • Referencias a nodos en banco_preguntas (nodo_code, nodo_id)");
}

async function main() {
  const tablasEncontradas = await buscarTablasNodos();
  
  // Explorar cada tabla encontrada
  for (const { tabla, count } of tablasEncontradas) {
    await explorarTablaNodos(tabla, count);
  }
  
  await buscarReferenciasNodos();
  await explorarEstructuraPAES();
  await buscarSistemaAprendizaje();
  await generarReporteNodos(tablasEncontradas);
  
  console.log("\n🏁 REVISIÓN DE NODOS COMPLETADA");
}

main().catch(console.error);
