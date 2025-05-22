
import { DiagnosticQuestion } from "@/types/diagnostic";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";

// Define Json types explicitly to avoid circular references
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * Interface for raw exercise data from database
 */
export interface RawExerciseData {
  id?: string;
  question?: string;
  options?: JsonValue;
  correct_answer?: string;
  skill?: number | string;
  prueba?: number | string;
  explanation?: string;
  diagnostic_id?: string;
  node_id?: string;
  difficulty?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Interface for mapping functions
 */
export interface SkillMappers {
  mapSkillToEnum: (value: number | string | undefined) => TPAESHabilidad;
  mapTestToEnum: (value: number | string | undefined) => TPAESPrueba;
}
