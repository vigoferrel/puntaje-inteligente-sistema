
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Asegura que exista al menos un diagnóstico por defecto
 * Se ha modificado para NO generar nuevos diagnósticos automáticamente
 * y solo usar diagnósticos locales
 */
export const ensureDefaultDiagnosticsExist = async (): Promise<boolean> => {
  try {
    // Verificar si ya existen diagnósticos
    const { data: existingTests } = await supabase
      .from('diagnostic_tests')
      .select('id')
      .limit(1);
    
    if (existingTests && existingTests.length > 0) {
      console.log('Se encontraron diagnósticos existentes, no es necesario generar más.');
      return true;
    }
    
    console.log('No se encontraron diagnósticos, generando diagnósticos locales fallback...');
    
    // Usar SOLO diagnósticos locales - evitar llamadas a la API
    return await createLocalFallbackDiagnostics();
  } catch (error) {
    console.error('Error al asegurar diagnósticos por defecto:', error);
    return false;
  }
};

/**
 * Crea diagnósticos locales mínimos cuando la generación en línea falla
 * Versión mejorada con más ejercicios predefinidos
 */
export const createLocalFallbackDiagnostics = async (): Promise<boolean> => {
  try {
    // Verificar si ya existen diagnósticos
    const { data: existingTests } = await supabase
      .from('diagnostic_tests')
      .select('id')
      .limit(1);
    
    if (existingTests && existingTests.length > 0) {
      console.log('Se encontraron diagnósticos existentes, no es necesario crear fallbacks.');
      return true;
    }
    
    // Crear diagnósticos locales mínimos
    const fallbackDiagnostics = [
      {
        title: "Diagnóstico de Comprensión Lectora",
        description: "Evaluación básica de habilidades de comprensión lectora",
        test_id: 1
      },
      {
        title: "Diagnóstico de Matemáticas (M1)",
        description: "Evaluación básica de habilidades matemáticas nivel 1",
        test_id: 2
      },
      {
        title: "Diagnóstico de Matemáticas (M2)",
        description: "Evaluación básica de habilidades matemáticas nivel 2",
        test_id: 3
      }
    ];
    
    const { data: insertedDiagnostics, error } = await supabase
      .from('diagnostic_tests')
      .insert(fallbackDiagnostics)
      .select();
    
    if (error || !insertedDiagnostics) {
      console.error('Error al crear diagnósticos fallback:', error);
      return false;
    }
    
    // Biblioteca de ejercicios predefinidos por habilidad
    const predefinedExercises = {
      // Ejercicios de Comprensión Lectora
      1: [
        {
          diagnostic_id: '',
          node_id: '00000000-0000-0000-0000-000000000000',
          test_id: 1,
          skill_id: 1,
          question: "Según el siguiente texto: 'La energía solar es una fuente renovable que aprovecha la radiación del sol. A diferencia del petróleo, no produce emisiones de CO2 durante su uso.' ¿Cuál es la principal diferencia mencionada entre la energía solar y el petróleo?",
          options: ["El costo de implementación", "El impacto ambiental", "La disponibilidad geográfica", "La eficiencia energética"],
          correct_answer: "El impacto ambiental",
          explanation: "El texto establece una comparación explícita mencionando que la energía solar, a diferencia del petróleo, no produce emisiones de CO2 durante su uso, lo que se refiere directamente al impacto ambiental.",
          difficulty: "basic"
        },
        {
          diagnostic_id: '',
          node_id: '00000000-0000-0000-0000-000000000000',
          test_id: 1,
          skill_id: 2,
          question: "Lee el siguiente párrafo: 'El cambio climático está causando efectos graves como el aumento del nivel del mar, que amenaza a comunidades costeras. Esta situación obliga a considerar la reubicación de poblaciones enteras.' ¿Qué idea se infiere del texto?",
          options: ["El cambio climático es reversible a corto plazo", "Algunas comunidades costeras tendrán que ser trasladadas", "Las medidas actuales son suficientes para detener el aumento del nivel del mar", "La mayoría de la población mundial vive en zonas costeras"],
          correct_answer: "Algunas comunidades costeras tendrán que ser trasladadas",
          explanation: "La inferencia correcta se basa en la mención de la 'reubicación de poblaciones enteras' como consecuencia de la amenaza que representa el aumento del nivel del mar para las comunidades costeras.",
          difficulty: "intermediate"
        },
        {
          diagnostic_id: '',
          node_id: '00000000-0000-0000-0000-000000000000',
          test_id: 1,
          skill_id: 3,
          question: "En el siguiente fragmento: 'La deforestación de la Amazonía continúa a un ritmo alarmante. Este proceso amenaza la biodiversidad global y contribuye significativamente al cambio climático.' ¿Cuál es la relación entre las dos oraciones?",
          options: ["Contraste", "Causa-efecto", "Comparación", "Secuencia temporal"],
          correct_answer: "Causa-efecto",
          explanation: "La segunda oración describe las consecuencias o efectos (amenaza a la biodiversidad y contribución al cambio climático) causados por el proceso mencionado en la primera oración (deforestación de la Amazonía).",
          difficulty: "basic"
        }
      ],
      
      // Ejercicios de Matemáticas (M1)
      2: [
        {
          diagnostic_id: '',
          node_id: '00000000-0000-0000-0000-000000000000',
          test_id: 2,
          skill_id: 4,
          question: "En una tienda, el precio de un producto aumentó un 20% y después disminuyó un 10%. Si el precio final es $108, ¿cuál era el precio original?",
          options: ["$100", "$90", "$110", "$120"],
          correct_answer: "$100",
          explanation: "Si el precio inicial es x, después del aumento sería 1.2x y después de la disminución sería 0.9 × 1.2x = 1.08x. Como el precio final es $108, entonces 1.08x = 108, por lo tanto x = 100.",
          difficulty: "intermediate"
        },
        {
          diagnostic_id: '',
          node_id: '00000000-0000-0000-0000-000000000000',
          test_id: 2,
          skill_id: 5,
          question: "Si f(x) = 2x² - 3x + 1, ¿cuál es el valor de f(2)?",
          options: ["3", "5", "7", "9"],
          correct_answer: "5",
          explanation: "f(2) = 2(2)² - 3(2) + 1 = 2(4) - 6 + 1 = 8 - 6 + 1 = 3 - 6 + 1 = -3 + 1 = 5",
          difficulty: "basic"
        },
        {
          diagnostic_id: '',
          node_id: '00000000-0000-0000-0000-000000000000',
          test_id: 2,
          skill_id: 6,
          question: "La siguiente gráfica representa la función f(x) = ax² + bx + c. ¿Cuál es el valor del discriminante b² - 4ac?",
          options: ["Mayor que 0", "Igual a 0", "Menor que 0", "No se puede determinar con la información dada"],
          correct_answer: "Menor que 0",
          explanation: "Como la parábola no corta el eje x (no tiene raíces reales), su discriminante b² - 4ac es menor que 0.",
          difficulty: "advanced"
        }
      ],
      
      // Ejercicios de Matemáticas (M2)
      3: [
        {
          diagnostic_id: '',
          node_id: '00000000-0000-0000-0000-000000000000',
          test_id: 3,
          skill_id: 7,
          question: "Si log₃(x) = 4, ¿cuál es el valor de x?",
          options: ["12", "64", "81", "243"],
          correct_answer: "81",
          explanation: "Si log₃(x) = 4, entonces x = 3⁴ = 81.",
          difficulty: "basic"
        },
        {
          diagnostic_id: '',
          node_id: '00000000-0000-0000-0000-000000000000',
          test_id: 3,
          skill_id: 8,
          question: "¿Cuántas soluciones tiene la ecuación sen(x) = 0.5 en el intervalo [0, 2π]?",
          options: ["1", "2", "3", "4"],
          correct_answer: "2",
          explanation: "sen(x) = 0.5 cuando x = π/6 y x = 5π/6 en el primer ciclo. En el intervalo [0, 2π], estas son las dos únicas soluciones.",
          difficulty: "intermediate"
        },
        {
          diagnostic_id: '',
          node_id: '00000000-0000-0000-0000-000000000000',
          test_id: 3,
          skill_id: 9,
          question: "En un triángulo rectángulo, si uno de los catetos mide 8 cm y la hipotenusa mide 17 cm, ¿cuánto mide el otro cateto?",
          options: ["9 cm", "15 cm", "12 cm", "13 cm"],
          correct_answer: "15 cm",
          explanation: "Usando el teorema de Pitágoras: a² + b² = c², donde c = 17 (hipotenusa) y a = 8 (cateto). Entonces b² = c² - a² = 17² - 8² = 289 - 64 = 225, por lo tanto b = √225 = 15.",
          difficulty: "basic"
        }
      ]
    };
    
    // Para cada diagnóstico, crear ejercicios básicos predefinidos
    for (const diagnostic of insertedDiagnostics) {
      const exercisesForThisTest = predefinedExercises[diagnostic.test_id] || [];
      
      if (exercisesForThisTest.length > 0) {
        // Insertar los ejercicios predefinidos asignando el diagnostic_id
        const exercisesToInsert = exercisesForThisTest.map(ex => ({
          ...ex,
          diagnostic_id: diagnostic.id
        }));
        
        await supabase.from('exercises').insert(exercisesToInsert);
      } else {
        // Si no hay ejercicios predefinidos para este test, crear uno genérico
        await supabase.from('exercises').insert({
          diagnostic_id: diagnostic.id,
          node_id: '00000000-0000-0000-0000-000000000000',
          test_id: diagnostic.test_id,
          skill_id: 1,
          question: `Pregunta de ejemplo para el diagnóstico ${diagnostic.title}`,
          options: ["Opción A", "Opción B", "Opción C", "Opción D"],
          correct_answer: "Opción A",
          explanation: "Esta es una pregunta de ejemplo creada automáticamente",
          difficulty: "basic"
        });
      }
    }
    
    console.log('Diagnósticos locales y ejercicios predefinidos creados con éxito');
    return true;
  } catch (error) {
    console.error('Error al crear diagnósticos fallback:', error);
    return false;
  }
};
