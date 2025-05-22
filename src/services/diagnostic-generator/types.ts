
import { DiagnosticTest } from "@/types/diagnostic";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";

// Definir tipo para nivel de dificultad aceptado por la base de datos
export type DifficultLevel = "basic" | "intermediate" | "advanced";

// Tipo para las funciones relacionadas con la generación de diagnósticos
export interface DiagnosticGeneratorService {
  generateNewDiagnostic: (title?: string, description?: string) => Promise<string | null>;
}
