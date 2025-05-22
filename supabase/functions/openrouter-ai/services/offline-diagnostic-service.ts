
import { MonitoringService } from "./monitoring-service.ts";

/**
 * Servicio para proporcionar diagnósticos cuando estamos en modo offline o degradado
 * Implementa un sistema de plantillas pre-generadas para garantizar disponibilidad
 */
export class OfflineDiagnosticService {
  // Banco de ejercicios pre-generados por habilidad y prueba
  private static exerciseBank: Record<string, any[]> = {};
  
  // Plantillas de diagnósticos por prueba
  private static diagnosticTemplates: Record<number, any> = {
    // Ejemplo para matemáticas (testId=2)
    2: {
      title: "Diagnóstico de Matemáticas",
      description: "Este diagnóstico evalúa tus habilidades matemáticas para la prueba PAES",
      exercisesTemplate: []
    },
    // Ejemplo para competencia lectora (testId=1)
    1: {
      title: "Diagnóstico de Competencia Lectora",
      description: "Este diagnóstico evalúa tu comprensión lectora para la prueba PAES",
      exercisesTemplate: []
    }
  };
  
  /**
   * Inicializa el servicio con ejercicios pregenerados
   * Esto debería llamarse al iniciar la función
   */
  static initialize(): void {
    this.loadPregeneratedExercises();
    MonitoringService.info("Servicio de diagnóstico offline inicializado");
  }
  
  /**
   * Carga ejercicios pregenerados desde archivo o memoria
   */
  private static loadPregeneratedExercises(): void {
    // En una implementación real, cargaríamos de un archivo o base de datos
    // Por ahora, usamos algunos ejercicios de ejemplo duros
    
    // Matemáticas - Resolución de problemas
    this.addExercisesToBank(2, "SOLVE_PROBLEMS", [
      {
        id: "math-sp-1",
        question: "Si 3x + 5 = 17, ¿cuál es el valor de x?",
        options: ["2", "3", "4", "6"],
        correctAnswer: "4",
        explanation: "Resolvemos 3x + 5 = 17, restando 5 a ambos lados: 3x = 12, luego dividimos por 3: x = 4",
        difficulty: "BASIC"
      },
      {
        id: "math-sp-2",
        question: "En un triángulo rectángulo, los catetos miden 6 cm y 8 cm. ¿Cuál es la longitud de la hipotenusa?",
        options: ["10 cm", "14 cm", "12 cm", "9 cm"],
        correctAnswer: "10 cm",
        explanation: "Aplicamos el teorema de Pitágoras: h² = 6² + 8² = 36 + 64 = 100, por lo tanto h = 10 cm",
        difficulty: "INTERMEDIATE"
      }
    ]);
    
    // Lectura - Localizar información
    this.addExercisesToBank(1, "TRACK_LOCATE", [
      {
        id: "read-tl-1",
        question: "Según el texto, ¿en qué año ocurrió el evento principal?",
        options: ["1945", "1953", "1962", "1978"],
        correctAnswer: "1962",
        explanation: "En el párrafo 2 se menciona explícitamente que el evento ocurrió en 1962",
        difficulty: "BASIC"
      }
    ]);
  }
  
  /**
   * Añade ejercicios al banco
   */
  private static addExercisesToBank(testId: number, skill: string, exercises: any[]): void {
    const key = `${testId}-${skill}`;
    this.exerciseBank[key] = [...(this.exerciseBank[key] || []), ...exercises];
  }
  
  /**
   * Genera un diagnóstico offline basado en las plantillas disponibles
   */
  static generateOfflineDiagnostic(testId: number, skills: string[], exercisesPerSkill: number): any {
    MonitoringService.info(`Generando diagnóstico offline para test ${testId} con habilidades: ${skills.join(', ')}`);
    
    const template = this.diagnosticTemplates[testId] || {
      title: `Diagnóstico para Prueba ${testId}`,
      description: "Este diagnóstico evaluará tus habilidades para la prueba PAES",
      exercisesTemplate: []
    };
    
    const exercises: any[] = [];
    
    // Intentar obtener ejercicios del banco para cada habilidad
    skills.forEach(skill => {
      const key = `${testId}-${skill}`;
      const availableExercises = this.exerciseBank[key] || [];
      
      // Si hay suficientes ejercicios en el banco, tomarlos
      if (availableExercises.length >= exercisesPerSkill) {
        // Seleccionar aleatoriamente exercisesPerSkill ejercicios
        const selectedExercises = this.getRandomExercises(availableExercises, exercisesPerSkill);
        exercises.push(...selectedExercises);
      } else {
        // Si no hay suficientes, generar algunos básicos
        for (let i = 0; i < exercisesPerSkill; i++) {
          exercises.push(this.generateBasicExercise(testId, skill, i));
        }
      }
    });
    
    return {
      title: template.title,
      description: template.description,
      exercises: exercises,
      isOfflineGenerated: true
    };
  }
  
  /**
   * Selecciona ejercicios aleatorios sin repetición
   */
  private static getRandomExercises(exercises: any[], count: number): any[] {
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  /**
   * Genera un ejercicio básico cuando no hay disponibles
   */
  private static generateBasicExercise(testId: number, skill: string, index: number): any {
    return {
      id: `offline-${testId}-${skill}-${index}`,
      question: `Ejercicio de ejemplo para evaluar la habilidad ${skill} (los ejercicios reales estarán disponibles pronto)`,
      options: ["Opción A", "Opción B", "Opción C", "Opción D"],
      correctAnswer: "Opción A",
      explanation: "Este es un ejercicio generado automáticamente cuando el servicio principal no está disponible",
      skill: skill,
      difficulty: "BASIC",
      isOfflineGenerated: true
    };
  }
  
  /**
   * Registra nuevos ejercicios en el banco de ejercicios
   * Esto permite aprender y mejorar el sistema offline con el tiempo
   */
  static registerExercises(testId: number, skill: string, exercises: any[]): void {
    const validExercises = exercises.filter(e => 
      e && e.question && Array.isArray(e.options) && e.correctAnswer);
      
    if (validExercises.length > 0) {
      const key = `${testId}-${skill}`;
      this.addExercisesToBank(testId, skill, validExercises);
      MonitoringService.info(`Registrados ${validExercises.length} ejercicios en banco offline para ${key}`);
    }
  }
  
  /**
   * Verifica si el servicio offline tiene suficientes ejercicios para una prueba/habilidad
   */
  static hasEnoughExercises(testId: number, skill: string, needed: number): boolean {
    const key = `${testId}-${skill}`;
    return (this.exerciseBank[key] || []).length >= needed;
  }
}

// Inicializar el servicio al cargar el módulo
OfflineDiagnosticService.initialize();
