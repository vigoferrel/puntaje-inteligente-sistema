
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { DiagnosticQuestion as BaseQuestion } from "@/types/diagnostic";

// Define JSON types explicitly to avoid circular references
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

// Re-export DiagnosticQuestion from types
export type { DiagnosticQuestion } from "@/types/diagnostic";

// Define QuestionStatus enum
export enum QuestionStatus {
  CORRECT = "CORRECT",
  INCORRECT = "INCORRECT",
  UNANSWERED = "UNANSWERED"
}

// Define QuestionFeedback interface
export interface QuestionFeedback {
  message: string;
  explanation: string;
  tips: string[];
  status: QuestionStatus;
}

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
