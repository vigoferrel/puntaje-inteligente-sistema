
/**
 * Handler para generar ejercicios individuales
 */
import { callOpenRouter } from "../../services/model-service.ts";
import { MonitoringService } from "../../services/monitoring-service.ts";
import { v4 as uuid } from "https://esm.sh/uuid@9.0.0";
import { MODELS } from "../../config.ts";

export async function generateExercise(payload: any): Promise<any> {
  const { 
    skill, 
    prueba = "COMPETENCIA_LECTORA", 
    difficulty = "INTERMEDIATE", 
    previousExercises = [],
    includeVisualContent = false,
    nodeContext = null
  } = payload;

  // Registro detallado para identificar problemas
  MonitoringService.info(`Generando ejercicio para habilidad: ${skill}, prueba: ${prueba}, dificultad: ${difficulty}`);
  MonitoringService.debug('Payload completo:', payload);

  try {
    // Sistema para generar ejercicios
    const systemPrompt = `
      Eres un generador experto de ejercicios educativos para la preparación de la prueba PAES (Chile).
      Debes generar ejercicios de alta calidad basados en los parámetros especificados.
      Tu respuesta debe ser un objeto JSON con los siguientes campos:
      - id: Identificador único (puedes usar uuid)
      - text/context: Texto o contexto para el ejercicio
      - question: La pregunta del ejercicio
      - options: Array con 4 opciones de respuesta
      - correctAnswer: La respuesta correcta (debe coincidir con una de las opciones)
      - explanation: Explicación detallada de por qué la respuesta es correcta
      - skill: La habilidad que se evalúa
      - difficulty: La dificultad del ejercicio
      - imageUrl: (opcional) URL de una imagen relacionada
      - graphData: (opcional) Datos para un gráfico si aplica
      - visualType: (opcional) Tipo de elemento visual
      - hasVisualContent: (opcional) Boolean indicando si tiene contenido visual
    `;

    // Prompt para crear el ejercicio
    let userPrompt = `
      Por favor, genera un ejercicio educativo con los siguientes parámetros:
      - Habilidad: ${skill}
      - Prueba: ${prueba}
      - Dificultad: ${difficulty}
    `;

    if (nodeContext) {
      userPrompt += `
      - Contexto del nodo: 
        - Título: ${nodeContext.title}
        - Descripción: ${nodeContext.description}
      `;
    }

    if (includeVisualContent) {
      userPrompt += `
      - Incluye algún tipo de contenido visual si es apropiado para este ejercicio
        (puede ser una descripción para un gráfico, diagrama o imagen conceptual)
      `;
    }

    // Llamar al modelo preferido para ejercicios
    const response = await callOpenRouter(systemPrompt, userPrompt, MODELS.EXERCISE_GENERATION);

    if (response.error) {
      // Si hay error, generar un ejercicio basado en respaldo
      MonitoringService.error('Error en generación de ejercicio:', response.error);
      
      // Crear un ejercicio de respaldo básico
      const backupExercise = createBackupExercise(skill, difficulty, prueba);
      MonitoringService.info('Generando ejercicio de respaldo');
      
      return backupExercise;
    }

    // Procesar y validar el resultado
    const exerciseResult = processExerciseResponse(response.result, skill, difficulty, prueba);
    MonitoringService.info(`Ejercicio generado exitosamente con ID ${exerciseResult.id}`);
    
    return exerciseResult;

  } catch (error) {
    MonitoringService.error('Error en la generación del ejercicio:', error);
    return createBackupExercise(skill, difficulty, prueba);
  }
}

/**
 * Procesa y valida la respuesta del modelo AI
 */
function processExerciseResponse(result: any, skill: string, difficulty: string, prueba: string): any {
  try {
    // Si el resultado ya es un objeto, usarlo directamente
    let exercise: any = typeof result === 'string' ? JSON.parse(result) : result;
    
    // Asegurarse de que todos los campos necesarios existan
    exercise = {
      id: exercise.id || uuid(),
      text: exercise.text || exercise.context || "Sin contexto específico para esta pregunta.",
      context: exercise.context || exercise.text || "Sin contexto específico para esta pregunta.",
      question: exercise.question || "¿Cuál es la respuesta correcta según el contexto?",
      options: exercise.options || ["Opción A", "Opción B", "Opción C", "Opción D"],
      correctAnswer: exercise.correctAnswer || exercise.options?.[0] || "Opción A",
      explanation: exercise.explanation || "No se proporcionó explicación.",
      skill: exercise.skill || skill,
      difficulty: exercise.difficulty || difficulty,
      prueba: exercise.prueba || prueba,
      imageUrl: exercise.imageUrl || null,
      graphData: exercise.graphData || null,
      visualType: exercise.visualType || null,
      hasVisualContent: !!exercise.imageUrl || !!exercise.graphData || !!exercise.hasVisualContent
    };
    
    return exercise;
  } catch (error) {
    MonitoringService.error('Error al procesar respuesta del ejercicio:', error);
    return createBackupExercise(skill, difficulty, prueba);
  }
}

/**
 * Crea un ejercicio de respaldo cuando hay errores
 */
function createBackupExercise(skill: string, difficulty: string, prueba: string): any {
  const id = uuid();
  
  let context = "La lectura comprensiva es un proceso fundamental para el aprendizaje. Implica no solo decodificar las palabras, sino también entender su significado contextual y las ideas que transmiten.";
  let question = "Según el texto, ¿qué implica la lectura comprensiva?";
  let options = [
    "Solo decodificar palabras",
    "Memorizar el texto completo",
    "Entender el significado contextual e ideas transmitidas",
    "Leer en voz alta correctamente"
  ];
  let correctAnswer = "Entender el significado contextual e ideas transmitidas";
  let explanation = "El texto menciona explícitamente que la lectura comprensiva 'implica no solo decodificar las palabras, sino también entender su significado contextual y las ideas que transmiten'.";
  
  if (prueba === "MATEMATICA_1" || prueba === "MATEMATICA_2") {
    context = "Para resolver ecuaciones de primer grado, es necesario aislar la variable despejando términos.";
    question = "¿Cuál es la solución de la ecuación 2x + 3 = 7?";
    options = ["x = 1", "x = 2", "x = 3", "x = 4"];
    correctAnswer = "x = 2";
    explanation = "Para resolver 2x + 3 = 7, restamos 3 a ambos lados: 2x = 4. Luego dividimos por 2: x = 2.";
  } 
  else if (prueba === "CIENCIAS") {
    context = "La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar en energía química.";
    question = "¿Cuál es el principal producto de la fotosíntesis?";
    options = ["Dióxido de carbono", "Oxígeno", "Agua", "Nitrógeno"];
    correctAnswer = "Oxígeno";
    explanation = "Durante la fotosíntesis, las plantas utilizan dióxido de carbono y agua para producir glucosa y liberar oxígeno como subproducto.";
  }
  else if (prueba === "HISTORIA") {
    context = "La Revolución Industrial fue un periodo de transformación económica y social que comenzó en Gran Bretaña a finales del siglo XVIII.";
    question = "¿Cuál fue uno de los principales cambios sociales durante la Revolución Industrial?";
    options = [
      "Disminución de la población urbana",
      "Mejora inmediata de las condiciones laborales",
      "Migración masiva del campo a la ciudad",
      "Reducción de la producción manufacturera"
    ];
    correctAnswer = "Migración masiva del campo a la ciudad";
    explanation = "La Revolución Industrial provocó una migración masiva de personas del campo a la ciudad en busca de trabajo en las nuevas fábricas, transformando la estructura social y demográfica.";
  }
  
  return {
    id,
    text: context,
    context: context,
    question,
    options,
    correctAnswer,
    explanation,
    skill,
    difficulty,
    prueba,
    imageUrl: null,
    graphData: null,
    visualType: null,
    hasVisualContent: false
  };
}
