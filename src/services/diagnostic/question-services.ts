
import { DiagnosticQuestion } from "@/types/diagnostic";
import { TPAESPrueba } from "@/types/system-types";
import { mapTestIdToEnum } from "@/utils/supabase-mappers";

/**
 * Fetches diagnostic questions for a specific test
 */
export const fetchDiagnosticQuestions = async (diagnosticId: string, testId: number): Promise<DiagnosticQuestion[]> => {
  try {
    // In a real implementation, we would fetch real questions from the database
    // For now, return improved mock questions
    const testEnum = mapTestIdToEnum(testId);
    
    // Generate different questions based on the test type
    switch (testEnum) {
      case "COMPETENCIA_LECTORA": {
        return [
          {
            id: `${diagnosticId}-q1`,
            question: "Según el texto, ¿cuál es la idea principal?",
            options: [
              "La importancia de la lectura en el desarrollo cognitivo",
              "Las diferencias entre lectores novatos y experimentados",
              "El impacto de la tecnología en los hábitos de lectura",
              "La relación entre comprensión lectora y rendimiento académico"
            ],
            correctAnswer: "La relación entre comprensión lectora y rendimiento académico",
            skill: "TRACK_LOCATE",
            prueba: "COMPETENCIA_LECTORA"
          },
          {
            id: `${diagnosticId}-q2`,
            question: "¿Qué se puede inferir del párrafo final?",
            options: [
              "El autor está en desacuerdo con las conclusiones del estudio",
              "La metodología de la investigación presenta fallos graves",
              "Se necesita más investigación para confirmar los hallazgos",
              "Los resultados contradicen estudios previos sobre el tema"
            ],
            correctAnswer: "Se necesita más investigación para confirmar los hallazgos",
            skill: "INTERPRET_RELATE",
            prueba: "COMPETENCIA_LECTORA"
          }
        ];
      }
        
      case "MATEMATICA_1": {
        return [
          {
            id: `${diagnosticId}-q1`,
            question: "Si 3x + 5 = 17, ¿cuál es el valor de x?",
            options: ["2", "4", "6", "12"],
            correctAnswer: "4",
            skill: "SOLVE_PROBLEMS",
            prueba: "MATEMATICA_1"
          },
          {
            id: `${diagnosticId}-q2`,
            question: "¿Cuál es el área de un círculo con radio 5 cm?",
            options: ["25π cm²", "10π cm²", "5π cm²", "15π cm²"],
            correctAnswer: "25π cm²",
            skill: "REPRESENT",
            prueba: "MATEMATICA_1",
            explanation: "El área de un círculo se calcula con la fórmula A = πr², donde r es el radio."
          }
        ];
      }
        
      case "MATEMATICA_2": {
        return [
          {
            id: `${diagnosticId}-q1`,
            question: "La derivada de f(x) = x² + 3x - 5 es:",
            options: ["f'(x) = 2x + 3", "f'(x) = x² + 3", "f'(x) = 2x", "f'(x) = 2x - 5"],
            correctAnswer: "f'(x) = 2x + 3",
            skill: "MODEL",
            prueba: "MATEMATICA_2"
          },
          {
            id: `${diagnosticId}-q2`,
            question: "¿Cuál es la primitiva de g(x) = 2x + 1?",
            options: ["G(x) = x² + x + C", "G(x) = x² + C", "G(x) = 2x² + x + C", "G(x) = x² + x"],
            correctAnswer: "G(x) = x² + x + C",
            skill: "INTERPRET_RELATE",
            prueba: "MATEMATICA_2"
          }
        ];
      }
      
      case "CIENCIAS": {
        return [
          {
            id: `${diagnosticId}-q1`,
            question: "¿Cuál de estas opciones describe mejor el proceso de fotosíntesis?",
            options: [
              "Conversión de energía solar en energía química",
              "Absorción de dióxido de carbono para producir oxígeno",
              "Liberación de energía a partir de glucosa",
              "Descomposición de materia orgánica"
            ],
            correctAnswer: "Conversión de energía solar en energía química",
            skill: "IDENTIFY_THEORIES",
            prueba: "CIENCIAS"
          },
          {
            id: `${diagnosticId}-q2`,
            question: "¿Qué estructura celular contiene el material genético?",
            options: ["Núcleo", "Mitocondria", "Ribosoma", "Aparato de Golgi"],
            correctAnswer: "Núcleo",
            skill: "PROCESS_ANALYZE",
            prueba: "CIENCIAS"
          }
        ];
      }
      
      case "HISTORIA": {
        return [
          {
            id: `${diagnosticId}-q1`,
            question: "¿Cuál fue una consecuencia directa de la Revolución Industrial?",
            options: [
              "Aumento de la producción agrícola",
              "Migración masiva del campo a la ciudad",
              "Fortalecimiento del sistema feudal",
              "Disminución del comercio internacional"
            ],
            correctAnswer: "Migración masiva del campo a la ciudad",
            skill: "TEMPORAL_THINKING",
            prueba: "HISTORIA"
          },
          {
            id: `${diagnosticId}-q2`,
            question: "Analiza la siguiente fuente primaria sobre la independencia de Chile. ¿Qué se puede inferir sobre el autor?",
            options: [
              "Era partidario de la monarquía española",
              "Apoyaba el movimiento independentista",
              "Era neutral respecto al conflicto",
              "No tenía conocimiento de los eventos históricos"
            ],
            correctAnswer: "Apoyaba el movimiento independentista",
            skill: "SOURCE_ANALYSIS",
            prueba: "HISTORIA"
          }
        ];
      }
        
      default:
        return [
          {
            id: `${diagnosticId}-q1`,
            question: "Pregunta de ejemplo",
            options: ["Opción A", "Opción B", "Opción C", "Opción D"],
            correctAnswer: "Opción C",
            skill: "SOLVE_PROBLEMS",
            prueba: "MATEMATICA_1"
          }
        ];
    }
  } catch (error) {
    console.error('Error fetching diagnostic questions:', error);
    return [];
  }
};
