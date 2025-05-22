
import { useState, useCallback } from "react";
import { DiagnosticTest, DiagnosticResult } from "@/types/diagnostic";
import { TPAESHabilidad } from "@/types/system-types";

/**
 * Hook que proporciona datos de diagnóstico de demostración 
 * cuando hay problemas con la base de datos
 */
export function useDemonstrationMode() {
  const [demoActivated, setDemoActivated] = useState(false);
  
  /**
   * Activa el modo de demostración para diagnosticos
   */
  const activateDemoMode = useCallback(() => {
    console.log("Modo demostración activado");
    setDemoActivated(true);
  }, []);
  
  /**
   * Genera tests de diagnóstico de demostración
   */
  const getDemoDiagnosticTests = useCallback((): DiagnosticTest[] => {
    return [
      {
        id: "demo-test-1",
        title: "Diagnóstico de Comprensión Lectora",
        description: "Evaluación de habilidades fundamentales de comprensión lectora",
        testId: 1,
        isCompleted: false,
        questions: [
          {
            id: "demo-q1",
            question: "Según el texto, ¿cuál es la idea principal?",
            options: ["Opción A", "Opción B", "Opción C", "Opción D"],
            correctAnswer: "Opción B",
            skill: "TRACK_LOCATE" as TPAESHabilidad,
            prueba: "L",
            explanation: "La idea principal se encuentra en el segundo párrafo."
          },
          {
            id: "demo-q2",
            question: "¿Qué inferencia se puede hacer a partir del último párrafo?",
            options: ["Inferencia 1", "Inferencia 2", "Inferencia 3", "Inferencia 4"],
            correctAnswer: "Inferencia 3",
            skill: "INTERPRET_RELATE" as TPAESHabilidad,
            prueba: "L",
            explanation: "El último párrafo sugiere esta conclusión."
          },
          {
            id: "demo-q3",
            question: "¿Cuál es el propósito del autor al escribir este texto?",
            options: ["Informar", "Persuadir", "Entretener", "Explicar"],
            correctAnswer: "Persuadir",
            skill: "EVALUATE_REFLECT" as TPAESHabilidad,
            prueba: "L",
            explanation: "El lenguaje utilizado indica intención persuasiva."
          }
        ]
      },
      {
        id: "demo-test-2",
        title: "Diagnóstico de Matemáticas (M1)",
        description: "Evaluación de habilidades matemáticas fundamentales",
        testId: 2,
        isCompleted: false,
        questions: [
          {
            id: "demo-m1",
            question: "Resuelve: 2x + 5 = 15",
            options: ["x = 5", "x = 7", "x = 10", "x = 15"],
            correctAnswer: "x = 5",
            skill: "SOLVE_PROBLEMS" as TPAESHabilidad,
            prueba: "M1",
            explanation: "2x + 5 = 15 → 2x = 10 → x = 5"
          },
          {
            id: "demo-m2",
            question: "¿Cuál es el área de un círculo con radio 4 cm?",
            options: ["16π cm²", "8π cm²", "4π cm²", "12π cm²"],
            correctAnswer: "16π cm²",
            skill: "SOLVE_PROBLEMS" as TPAESHabilidad,
            prueba: "M1",
            explanation: "A = πr² = π × 4² = 16π cm²"
          }
        ]
      }
    ];
  }, []);
  
  /**
   * Genera un resultado de diagnóstico de demostración
   */
  const getDemoDiagnosticResult = useCallback((): DiagnosticResult => {
    return {
      id: "demo-result-1",
      userId: "demo-user",
      diagnosticId: "demo-test-1",
      completedAt: new Date().toISOString(),
      results: {
        "TRACK_LOCATE": 65,
        "INTERPRET_RELATE": 78,
        "EVALUATE_REFLECT": 82,
        "SOLVE_PROBLEMS": 70
      }
    };
  }, []);
  
  return {
    demoActivated,
    activateDemoMode,
    getDemoDiagnosticTests,
    getDemoDiagnosticResult
  };
}
