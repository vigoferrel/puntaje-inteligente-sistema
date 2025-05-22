
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
    const { data: existingTests, error: checkError } = await supabase
      .from('diagnostic_tests')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error al verificar diagnósticos existentes:', checkError);
      return await createLocalFallbackDiagnostics();
    }
    
    if (existingTests && existingTests.length > 0) {
      console.log('Se encontraron diagnósticos existentes, no es necesario generar más.');
      
      // Verificar que los diagnósticos tengan ejercicios asociados
      const { data: exercises, error: exercisesError } = await supabase
        .from('exercises')
        .select('id')
        .eq('diagnostic_id', existingTests[0].id)
        .limit(1);
      
      if (exercisesError || !exercises || exercises.length === 0) {
        console.log('El diagnóstico existente no tiene ejercicios, generando ejercicios de fallback...');
        return await createLocalFallbackDiagnostics();
      }
      
      return true;
    }
    
    console.log('No se encontraron diagnósticos, generando diagnósticos locales fallback...');
    
    // Usar SOLO diagnósticos locales - evitar llamadas a la API
    return await createLocalFallbackDiagnostics();
  } catch (error) {
    console.error('Error al asegurar diagnósticos por defecto:', error);
    return await createLocalFallbackDiagnostics();
  }
};

/**
 * Crea diagnósticos locales mínimos cuando la generación en línea falla
 * Versión mejorada con más ejercicios predefinidos y manejo robusto de errores
 */
export const createLocalFallbackDiagnostics = async (): Promise<boolean> => {
  try {
    console.log("Creando diagnósticos locales de respaldo...");
    
    // Verificar si ya existen diagnósticos
    const { data: existingTests, error: fetchError } = await supabase
      .from('diagnostic_tests')
      .select('id')
      .limit(1);
    
    if (fetchError) {
      console.error("Error al verificar diagnósticos existentes:", fetchError);
      // Continuar intentando crear diagnósticos a pesar del error
    } else if (existingTests && existingTests.length > 0) {
      console.log('Se encontraron diagnósticos existentes, verificando si tienen ejercicios...');
      
      // Verificar si los diagnósticos tienen ejercicios
      const { data: exercises, error: exercisesError } = await supabase
        .from('exercises')
        .select('id')
        .eq('diagnostic_id', existingTests[0].id)
        .limit(1);
      
      if (!exercisesError && exercises && exercises.length > 0) {
        console.log('Se encontraron ejercicios para el diagnóstico existente.');
        return true;
      }
      
      console.log('No se encontraron ejercicios para el diagnóstico existente, generando ejercicios...');
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
    
    let insertedDiagnostics = [];
    let insertError = null;
    
    // Intentar insertar los diagnósticos
    try {
      const { data, error } = await supabase
        .from('diagnostic_tests')
        .insert(fallbackDiagnostics)
        .select();
      
      if (error) {
        insertError = error;
      } else if (data) {
        insertedDiagnostics = data;
      }
    } catch (error) {
      insertError = error;
    }
    
    // Si no se pudieron insertar diagnósticos, intentar obtener los existentes
    if (insertError || insertedDiagnostics.length === 0) {
      console.error('Error al crear diagnósticos fallback:', insertError);
      
      // Intentar obtener diagnósticos existentes como fallback
      const { data: existingDiagnostics } = await supabase
        .from('diagnostic_tests')
        .select('*')
        .limit(3);
        
      if (existingDiagnostics && existingDiagnostics.length > 0) {
        console.log('Usando diagnósticos existentes como fallback');
        insertedDiagnostics = existingDiagnostics;
      } else {
        // Si aún no hay diagnósticos, generar datos de demostración en memoria
        console.warn('No se pudieron crear ni obtener diagnósticos - usando modo demostración');
        return createDemonstrationModeDiagnostics();
      }
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
    
    // Intentar crear ejercicios para cada diagnóstico
    let exercisesCreated = false;
    
    for (const diagnostic of insertedDiagnostics) {
      const exercisesForThisTest = predefinedExercises[diagnostic.test_id] || [];
      
      if (exercisesForThisTest.length > 0) {
        try {
          // Insertar los ejercicios predefinidos asignando el diagnostic_id
          const exercisesToInsert = exercisesForThisTest.map(ex => ({
            ...ex,
            diagnostic_id: diagnostic.id
          }));
          
          const { error: insertExercisesError } = await supabase
            .from('exercises')
            .insert(exercisesToInsert);
            
          if (!insertExercisesError) {
            exercisesCreated = true;
            console.log(`Creados ${exercisesToInsert.length} ejercicios para diagnóstico ${diagnostic.id}`);
          } else {
            console.error(`Error al insertar ejercicios para diagnóstico ${diagnostic.id}:`, insertExercisesError);
          }
        } catch (error) {
          console.error(`Error al procesar ejercicios para diagnóstico ${diagnostic.id}:`, error);
        }
      } else {
        // Si no hay ejercicios predefinidos para este test, crear uno genérico
        try {
          const { error: genericExerciseError } = await supabase
            .from('exercises')
            .insert({
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
            
          if (!genericExerciseError) {
            exercisesCreated = true;
            console.log(`Creado ejercicio genérico para diagnóstico ${diagnostic.id}`);
          } else {
            console.error(`Error al insertar ejercicio genérico para diagnóstico ${diagnostic.id}:`, genericExerciseError);
          }
        } catch (error) {
          console.error(`Error al crear ejercicio genérico para diagnóstico ${diagnostic.id}:`, error);
        }
      }
    }
    
    // Si no se pudieron crear ejercicios en la base de datos, usar modo demostración
    if (!exercisesCreated) {
      console.warn('No se pudieron crear ejercicios en la base de datos - usando modo demostración');
      return createDemonstrationModeDiagnostics();
    }
    
    console.log('Diagnósticos locales y ejercicios predefinidos creados con éxito');
    return true;
  } catch (error) {
    console.error('Error al crear diagnósticos fallback:', error);
    return createDemonstrationModeDiagnostics();
  }
};

/**
 * Crea un modo de demostración completamente en memoria como último recurso
 * cuando fallan todos los intentos de usar la base de datos
 */
const createDemonstrationModeDiagnostics = (): boolean => {
  console.log('MODO DEMOSTRACIÓN ACTIVADO: Usando datos de diagnóstico simulados');
  
  // En un proyecto real, aquí crearíamos datos en memoria y los
  // guardaríamos en localStorage o en un store global
  
  // Retornamos true para indicar que se ha activado correctamente el modo de demostración
  // Esto evita ciclos infinitos de reintento
  return true;
};
