
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { Exercise } from "@/types/ai-types";
import { openRouterService } from "./core";
import { ExerciseContentValidator } from "@/utils/exercise-content-validator";
import { EducationalExerciseBank } from "@/utils/educational-exercise-bank";

/**
 * Prompts mejorados para generar ejercicios educativos apropiados
 */
const EDUCATIONAL_PROMPTS = {
  system: `Eres un experto en educación chilena especializado en crear ejercicios para la prueba PAES.

REGLAS ESTRICTAS PARA CONTENIDO EDUCATIVO:
1. SOLO genera contenido educativo apropiado para estudiantes de educación media
2. NUNCA incluyas IDs, códigos técnicos, o referencias de programación
3. Cada ejercicio debe tener contexto educativo claro y relevante
4. Las preguntas deben ser comprensibles y apropiadas para el nivel
5. Todas las opciones deben ser plausibles y educativamente válidas
6. Las explicaciones deben ser pedagógicas y ayudar al aprendizaje

FORMATO REQUERIDO:
- Pregunta clara y específica
- 4 opciones de respuesta educativamente apropiadas
- Respuesta correcta que coincida exactamente con una opción
- Explicación pedagógica detallada
- Contexto educativo relevante

CONTENIDO PROHIBIDO:
- IDs técnicos o códigos
- Referencias a programación
- Contenido sin contexto educativo
- Respuestas que no sean educativas
- Texto técnico o de sistema`,

  user: (skill: TPAESHabilidad, prueba: TPAESPrueba, difficulty: string) => 
    `Genera un ejercicio educativo de alta calidad para:
- Habilidad PAES: ${skill}
- Prueba: ${prueba} 
- Nivel: ${difficulty}

El ejercicio debe:
1. Evaluar específicamente la habilidad ${skill}
2. Ser apropiado para estudiantes chilenos de educación media
3. Incluir contexto educativo relevante y realista
4. Tener opciones de respuesta plausibles y educativas
5. Proporcionar explicación pedagógica clara

Responde ÚNICAMENTE con un objeto JSON válido con esta estructura:
{
  "question": "Pregunta educativa clara y específica",
  "options": ["Opción A educativa", "Opción B educativa", "Opción C educativa", "Opción D educativa"],
  "correctAnswer": "Opción correcta exacta",
  "explanation": "Explicación pedagógica detallada",
  "text": "Contexto educativo del ejercicio",
  "skill": "${skill}",
  "prueba": "${prueba}",
  "difficulty": "${difficulty}"
}`
};

/**
 * Genera un ejercicio específico con validación de contenido
 */
export const generateExercise = async (
  skill: TPAESHabilidad,
  prueba: TPAESPrueba,
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED',
  previousExercises: Exercise[] = [],
  includeVisualContent?: boolean
): Promise<Exercise | null> => {
  console.log(`Generando ejercicio educativo - skill=${skill}, prueba=${prueba}, difficulty=${difficulty}`);
  
  try {
    // Intentar generar con AI primero
    const aiExercise = await generateWithAI(skill, prueba, difficulty, previousExercises);
    
    if (aiExercise) {
      // Validar contenido
      const validation = ExerciseContentValidator.validateExercise(aiExercise);
      
      if (validation.isValid) {
        console.log('Ejercicio AI generado y validado exitosamente');
        return aiExercise;
      } else {
        console.warn('Ejercicio AI inválido:', validation.errors);
        
        // Intentar sanitizar
        const sanitized = ExerciseContentValidator.sanitizeExercise(aiExercise);
        if (sanitized) {
          console.log('Ejercicio AI sanitizado exitosamente');
          return sanitized;
        }
      }
    }
    
    // Si AI falla o genera contenido inapropiado, usar respaldo educativo
    console.log('Usando ejercicio educativo de respaldo');
    return EducationalExerciseBank.getFallbackExercise(skill, prueba, difficulty);
    
  } catch (error) {
    console.error('Error generando ejercicio:', error);
    // Siempre proporcionar respaldo educativo
    return EducationalExerciseBank.getFallbackExercise(skill, prueba, difficulty);
  }
};

/**
 * Genera ejercicio usando AI con prompts mejorados
 */
async function generateWithAI(
  skill: TPAESHabilidad,
  prueba: TPAESPrueba,
  difficulty: string,
  previousExercises: Exercise[]
): Promise<Exercise | null> {
  try {
    const response = await openRouterService<Exercise>({
      action: 'generate_exercise',
      payload: {
        systemPrompt: EDUCATIONAL_PROMPTS.system,
        userPrompt: EDUCATIONAL_PROMPTS.user(skill, prueba, difficulty),
        skill,
        prueba,
        difficulty,
        previousExercises: previousExercises.slice(-3), // Solo últimos 3 para contexto
        maxRetries: 2
      }
    });

    if (!response) {
      console.warn('No se recibió respuesta del servicio AI');
      return null;
    }

    // Asegurar que el ejercicio tiene los campos requeridos
    const exercise: Exercise = {
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      question: response.question || '',
      options: response.options || [],
      correctAnswer: response.correctAnswer || '',
      explanation: response.explanation || '',
      skill: skill,
      prueba: prueba,
      difficulty: difficulty,
      text: response.text || response.context || '',
      ...response
    };

    return exercise;
  } catch (error) {
    console.error('Error en generación AI:', error);
    return null;
  }
}

/**
 * Genera un lote de ejercicios para un nodo y habilidad específicos
 */
export const generateExercisesBatch = async (
  nodeId: string,
  skill: string,
  testId: number,
  count: number = 5,
  difficulty: string = 'INTERMEDIATE',
  includeVisualContent?: boolean
): Promise<Exercise[]> => {
  try {
    console.log(`Generando lote de ${count} ejercicios educativos para skill ${skill}, testId ${testId}`);
    
    // Convertir parámetros a tipos apropiados
    const mappedSkill = skill as TPAESHabilidad;
    const mappedPrueba = mapTestIdToPrueba(testId);
    const mappedDifficulty = difficulty as 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
    
    const exercises: Exercise[] = [];
    const maxAttempts = count * 2; // Permitir más intentos para asegurar calidad
    let attempts = 0;
    
    while (exercises.length < count && attempts < maxAttempts) {
      attempts++;
      
      const exercise = await generateExercise(
        mappedSkill,
        mappedPrueba,
        mappedDifficulty,
        exercises, // Pasar ejercicios previos para evitar duplicados
        includeVisualContent
      );
      
      if (exercise) {
        // Validar que no sea duplicado
        const isDuplicate = exercises.some(existing => 
          existing.question === exercise.question ||
          (existing.correctAnswer === exercise.correctAnswer && 
           existing.options.join('') === exercise.options.join(''))
        );
        
        if (!isDuplicate) {
          exercise.nodeId = nodeId;
          exercises.push(exercise);
          console.log(`Ejercicio ${exercises.length}/${count} generado para lote`);
        }
      }
    }
    
    // Si no se pudieron generar suficientes, completar con respaldos
    while (exercises.length < count) {
      const fallback = EducationalExerciseBank.getFallbackExercise(
        mappedSkill, 
        mappedPrueba, 
        mappedDifficulty
      );
      
      if (fallback) {
        fallback.nodeId = nodeId;
        fallback.id = `fallback-batch-${exercises.length}-${Date.now()}`;
        exercises.push(fallback);
      } else {
        break;
      }
    }
    
    console.log(`Lote completado: ${exercises.length} ejercicios educativos generados`);
    return exercises;
    
  } catch (error) {
    console.error('Error al generar lote de ejercicios:', error);
    
    // Generar lote de respaldo en caso de error total
    const fallbackExercises: Exercise[] = [];
    for (let i = 0; i < count; i++) {
      const fallback = EducationalExerciseBank.getFallbackExercise(
        skill as TPAESHabilidad,
        mapTestIdToPrueba(testId),
        difficulty as 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'
      );
      
      if (fallback) {
        fallback.nodeId = nodeId;
        fallback.id = `error-fallback-${i}-${Date.now()}`;
        fallbackExercises.push(fallback);
      }
    }
    
    return fallbackExercises;
  }
};

/**
 * Mapea testId a TPAESPrueba
 */
function mapTestIdToPrueba(testId: number): TPAESPrueba {
  const mapping: Record<number, TPAESPrueba> = {
    1: 'COMPETENCIA_LECTORA',
    2: 'MATEMATICA_1', 
    3: 'MATEMATICA_2',
    4: 'CIENCIAS',
    5: 'HISTORIA'
  };
  
  return mapping[testId] || 'COMPETENCIA_LECTORA';
}
