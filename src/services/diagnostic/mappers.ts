
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { mapSkillIdToEnum, mapTestIdToEnum } from "@/utils/supabase-mappers";
import { DiagnosticQuestion } from "@/types/diagnostic";
import { RawExerciseData, JsonValue } from "./types";

/**
 * Maps a skill value to the corresponding TPAESHabilidad enum
 */
export function safeMapSkill(skillValue: number | string | undefined): TPAESHabilidad {
  if (typeof skillValue === 'number') {
    return mapSkillIdToEnum(skillValue);
  } else if (typeof skillValue === 'string' && !isNaN(Number(skillValue))) {
    // If it's a string but represents a number, convert and map
    return mapSkillIdToEnum(Number(skillValue));
  } else if (typeof skillValue === 'string') {
    const validSkills: TPAESHabilidad[] = [
      'SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'INTERPRET_RELATE', 
      'EVALUATE_REFLECT', 'TRACK_LOCATE', 'ARGUE_COMMUNICATE', 
      'IDENTIFY_THEORIES', 'PROCESS_ANALYZE', 'APPLY_PRINCIPLES', 
      'SCIENTIFIC_ARGUMENT', 'TEMPORAL_THINKING', 'SOURCE_ANALYSIS', 
      'MULTICAUSAL_ANALYSIS', 'CRITICAL_THINKING', 'REFLECTION'
    ];
    
    return validSkills.includes(skillValue as TPAESHabilidad) 
      ? skillValue as TPAESHabilidad 
      : 'SOLVE_PROBLEMS';
  }
  return 'SOLVE_PROBLEMS';
}

/**
 * Maps a test value to the corresponding TPAESPrueba enum
 */
export function safeMapPrueba(pruebaValue: number | string | undefined): TPAESPrueba {
  if (typeof pruebaValue === 'number') {
    return mapTestIdToEnum(pruebaValue);
  } else if (typeof pruebaValue === 'string' && !isNaN(Number(pruebaValue))) {
    // If it's a string but represents a number, convert and map
    return mapTestIdToEnum(Number(pruebaValue));
  } else if (typeof pruebaValue === 'string') {
    const validPruebas: TPAESPrueba[] = [
      'COMPETENCIA_LECTORA', 'MATEMATICA_1', 'MATEMATICA_2', 
      'CIENCIAS', 'HISTORIA'
    ];
    
    return validPruebas.includes(pruebaValue as TPAESPrueba) 
      ? pruebaValue as TPAESPrueba 
      : 'MATEMATICA_1';
  }
  return 'MATEMATICA_1';
}

/**
 * Parse options from database into string array
 */
export function parseOptions(options: JsonValue | undefined): string[] {
  if (!options) return [];
  
  try {
    if (Array.isArray(options)) {
      return options.map(String);
    } else if (typeof options === 'string') {
      try {
        const parsedOptions = JSON.parse(options);
        return Array.isArray(parsedOptions) ? parsedOptions.map(String) : [];
      } catch (e) {
        // If it's not valid JSON, return single item array
        return [options];
      }
    } else if (typeof options === 'object' && options !== null) {
      return Object.values(options).map(String);
    }
  } catch (e) {
    console.error('Error parsing options:', e);
  }
  
  return [];
}

/**
 * Transform a raw exercise from the database into a DiagnosticQuestion
 */
export function mapExerciseToQuestion(exercise: RawExerciseData, testId?: number): DiagnosticQuestion {
  // Extract skill_id from exercise if it exists
  const skillId = exercise.skill_id || exercise.skill;
  
  // Use the actual testId passed or fall back to exercise.test_id
  const actualTestId = testId || exercise.test_id || exercise.prueba;
  
  return {
    id: exercise.id || '',
    question: exercise.question || '',
    options: parseOptions(exercise.options),
    correctAnswer: exercise.correct_answer || '',
    skill: safeMapSkill(skillId),
    prueba: safeMapPrueba(actualTestId),
    explanation: exercise.explanation || undefined
  };
}
