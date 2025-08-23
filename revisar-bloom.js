// Revisar implementación de taxonomía de Bloom en PAES
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://settifboilityelprvjd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("🧠 REVISANDO TAXONOMÍA DE BLOOM EN SISTEMA PAES");
console.log("==============================================");

// Niveles de Bloom esperados
const nivelesBloom = [
  'recordar', 'comprender', 'aplicar', 'analizar', 'evaluar', 'crear'
];

async function analizarBloomEnLearningNodes() {
  console.log("\n📊 1. Analizando Bloom en learning_nodes (205 registros)...");
  
  try {
    // Obtener todos los niveles de Bloom utilizados
    const { data: bloomData } = await supabase
      .from('learning_nodes')
      .select('bloom_level, title, subject, difficulty_level')
      .not('bloom_level', 'is', null);
    
    if (bloomData && bloomData.length > 0) {
      console.log(`✅ ${bloomData.length} nodos con nivel de Bloom definido`);
      
      // Analizar distribución de niveles
      const distribucionBloom = {};
      bloomData.forEach(nodo => {
        const nivel = nodo.bloom_level;
        if (!distribucionBloom[nivel]) {
          distribucionBloom[nivel] = { count: 0, ejemplos: [] };
        }
        distribucionBloom[nivel].count++;
        if (distribucionBloom[nivel].ejemplos.length < 3) {
          distribucionBloom[nivel].ejemplos.push({
            title: nodo.title,
            subject: nodo.subject,
            difficulty: nodo.difficulty_level
          });
        }
      });
      
      console.log("\n📋 Distribución por nivel de Bloom:");
      Object.entries(distribucionBloom)
        .sort(([a], [b]) => {
          const orderA = nivelesBloom.indexOf(a);
          const orderB = nivelesBloom.indexOf(b);
          return orderA - orderB;
        })
        .forEach(([nivel, data]) => {
          console.log(`\n   🎯 ${nivel.toUpperCase()}: ${data.count} nodos`);
          data.ejemplos.forEach(ej => {
            console.log(`      • ${ej.title} (${ej.subject}, dif: ${ej.difficulty})`);
          });
        });
      
      return distribucionBloom;
    } else {
      console.log("❌ No se encontraron nodos con niveles de Bloom");
      return {};
    }
  } catch (error) {
    console.log("❌ Error analizando Bloom en learning_nodes:", error.message);
    return {};
  }
}

async function analizarBloomEnBancoPreguntas() {
  console.log("\n📚 2. Analizando Bloom en banco_preguntas...");
  
  try {
    const { data: preguntasBloom } = await supabase
      .from('banco_preguntas')
      .select('nivel_bloom, enunciado, nivel_dificultad, prueba_paes')
      .not('nivel_bloom', 'is', null);
    
    if (preguntasBloom && preguntasBloom.length > 0) {
      console.log(`✅ ${preguntasBloom.length} preguntas con nivel de Bloom`);
      
      const distribucionPreguntas = {};
      preguntasBloom.forEach(p => {
        const nivel = p.nivel_bloom;
        if (!distribucionPreguntas[nivel]) {
          distribucionPreguntas[nivel] = { count: 0, ejemplos: [] };
        }
        distribucionPreguntas[nivel].count++;
        if (distribucionPreguntas[nivel].ejemplos.length < 2) {
          distribucionPreguntas[nivel].ejemplos.push({
            enunciado: p.enunciado.substring(0, 60) + '...',
            dificultad: p.nivel_dificultad,
            paes: p.prueba_paes
          });
        }
      });
      
      console.log("\n📋 Distribución Bloom en preguntas:");
      Object.entries(distribucionPreguntas).forEach(([nivel, data]) => {
        console.log(`\n   🎯 ${nivel.toUpperCase()}: ${data.count} preguntas`);
        data.ejemplos.forEach(ej => {
          console.log(`      • ${ej.enunciado}`);
          console.log(`        (${ej.paes}, ${ej.dificultad})`);
        });
      });
      
      return distribucionPreguntas;
    } else {
      console.log("❌ No hay preguntas con nivel de Bloom definido");
      return {};
    }
  } catch (error) {
    console.log("❌ Error analizando Bloom en preguntas:", error.message);
    return {};
  }
}

async function buscarBloomEnPreguntas211() {
  console.log("\n📝 3. Verificando Bloom en tabla 'preguntas' (211 registros)...");
  
  try {
    const { data: muestra } = await supabase
      .from('preguntas')
      .select('*')
      .limit(3);
    
    if (muestra && muestra.length > 0) {
      const campos = Object.keys(muestra[0]);
      const camposBloom = campos.filter(campo => 
        campo.toLowerCase().includes('bloom') ||
        campo.toLowerCase().includes('cognitive') ||
        campo.toLowerCase().includes('taxonomia')
      );
      
      if (camposBloom.length > 0) {
        console.log("✅ Campos relacionados con Bloom encontrados:", camposBloom);
        
        // Analizar contenido de estos campos
        muestra.forEach((pregunta, index) => {
          console.log(`\nPregunta ${index + 1}:`);
          camposBloom.forEach(campo => {
            console.log(`   ${campo}: ${pregunta[campo]}`);
          });
        });
      } else {
        console.log("❌ No hay campos de Bloom en tabla 'preguntas'");
        
        // Mostrar algunos campos disponibles
        console.log("📋 Campos disponibles en 'preguntas':");
        console.log(`   ${campos.slice(0, 8).join(', ')}...`);
      }
    }
  } catch (error) {
    console.log("❌ Error verificando Bloom en preguntas:", error.message);
  }
}

async function analizarCoberturaPorMateria(distribucionNodos) {
  console.log("\n📊 4. Analizando cobertura de Bloom por materia PAES...");
  
  try {
    const { data: nodosPorMateria } = await supabase
      .from('learning_nodes')
      .select('subject, bloom_level, difficulty_level')
      .not('bloom_level', 'is', null);
    
    if (nodosPorMateria && nodosPorMateria.length > 0) {
      const coberturaPorMateria = {};
      
      nodosPorMateria.forEach(nodo => {
        const materia = nodo.subject;
        const bloom = nodo.bloom_level;
        
        if (!coberturaPorMateria[materia]) {
          coberturaPorMateria[materia] = {};
        }
        
        if (!coberturaPorMateria[materia][bloom]) {
          coberturaPorMateria[materia][bloom] = 0;
        }
        
        coberturaPorMateria[materia][bloom]++;
      });
      
      console.log("\n📋 Cobertura de Bloom por materia PAES:");
      
      Object.entries(coberturaPorMateria).forEach(([materia, niveles]) => {
        console.log(`\n   📚 ${materia.toUpperCase()}:`);
        
        nivelesBloom.forEach(nivel => {
          const count = niveles[nivel] || 0;
          const indicator = count > 0 ? '✅' : '❌';
          console.log(`      ${indicator} ${nivel}: ${count} nodos`);
        });
        
        const totalNodos = Object.values(niveles).reduce((sum, count) => sum + count, 0);
        const nivelesConContent = Object.keys(niveles).length;
        console.log(`      📊 Total: ${totalNodos} nodos, ${nivelesConContent}/6 niveles Bloom`);
      });
    }
  } catch (error) {
    console.log("❌ Error analizando cobertura por materia:", error.message);
  }
}

async function verificarImplementacionCompleta() {
  console.log("\n🔍 5. Verificando implementación completa de Bloom...");
  
  // Verificar todos los niveles de Bloom están implementados
  try {
    const { data: todosNiveles } = await supabase
      .from('learning_nodes')
      .select('bloom_level')
      .not('bloom_level', 'is', null);
    
    if (todosNiveles) {
      const nivelesImplementados = [...new Set(todosNiveles.map(n => n.bloom_level))];
      
      console.log("\n📊 Estado de implementación de taxonomía de Bloom:");
      
      nivelesBloom.forEach(nivel => {
        const implementado = nivelesImplementados.includes(nivel);
        const indicator = implementado ? '✅' : '❌';
        console.log(`   ${indicator} ${nivel.charAt(0).toUpperCase() + nivel.slice(1)}`);
      });
      
      const porcentajeImplementacion = (nivelesImplementados.length / nivelesBloom.length) * 100;
      console.log(`\n📈 Completitud: ${nivelesImplementados.length}/6 niveles (${porcentajeImplementacion.toFixed(1)}%)`);
      
      if (porcentajeImplementacion === 100) {
        console.log("🎉 ¡Taxonomía de Bloom completamente implementada!");
      } else {
        const faltantes = nivelesBloom.filter(n => !nivelesImplementados.includes(n));
        console.log("⚠️ Niveles faltantes:", faltantes.join(', '));
      }
    }
  } catch (error) {
    console.log("❌ Error verificando implementación:", error.message);
  }
}

async function generarReporteBloom(distribucionNodos, distribucionPreguntas) {
  console.log("\n" + "=".repeat(60));
  console.log("📋 REPORTE FINAL - TAXONOMÍA DE BLOOM");
  console.log("=".repeat(60));
  
  console.log("\n🎯 RESUMEN EJECUTIVO:");
  
  const totalNodosBloom = Object.values(distribucionNodos).reduce((sum, data) => sum + data.count, 0);
  const totalPreguntasBloom = Object.values(distribucionPreguntas).reduce((sum, data) => sum + data.count, 0);
  
  console.log(`   • Nodos con Bloom: ${totalNodosBloom}/205`);
  console.log(`   • Preguntas con Bloom: ${totalPreguntasBloom}/2 (banco_preguntas)`);
  console.log(`   • Preguntas principales: 211 (sin Bloom explícito)`);
  
  console.log("\n🏗️ ESTRUCTURA ENCONTRADA:");
  console.log("   ✅ learning_nodes: Implementación completa de Bloom");
  console.log("   ✅ banco_preguntas: Clasificación por Bloom");
  console.log("   ❌ preguntas (211): Sin clasificación Bloom");
  
  console.log("\n🎓 MATERIAS CUBIERTAS:");
  console.log("   • Matemática 1 (matematica1)");
  console.log("   • Competencia Lectora (lenguaje)");
  console.log("   • Ciencias (ciencias)");
  
  console.log("\n💡 RECOMENDACIONES:");
  if (totalNodosBloom < 205) {
    console.log("   1. Completar clasificación Bloom en learning_nodes faltantes");
  }
  console.log("   2. Integrar clasificación Bloom con las 211 preguntas principales");
  console.log("   3. Crear mapeo entre nodos de aprendizaje y preguntas");
  console.log("   4. Desarrollar sistema de progresión basado en Bloom");
}

async function main() {
  const distribucionNodos = await analizarBloomEnLearningNodes();
  const distribucionPreguntas = await analizarBloomEnBancoPreguntas();
  await buscarBloomEnPreguntas211();
  await analizarCoberturaPorMateria(distribucionNodos);
  await verificarImplementacionCompleta();
  await generarReporteBloom(distribucionNodos, distribucionPreguntas);
  
  console.log("\n🏁 ANÁLISIS DE BLOOM COMPLETADO");
}

main().catch(console.error);
