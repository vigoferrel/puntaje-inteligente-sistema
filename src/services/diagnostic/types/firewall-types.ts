
/**
 * FIREWALL ANTI-RECURSIÓN
 * Tipos completamente independientes de Supabase para prevenir recursión infinita
 */

// Tipos primitivos seguros sin recursión
export interface RawDatabaseRecord {
  [key: string]: unknown;
}

// Interface firewall para ejercicios
export interface FirewallExercise {
  id: string;
  question: string;
  options: unknown;
  correct_answer: string;
  explanation: string;
  skill_id: unknown;
  test_id: unknown;
  diagnostic_id: string;
  node_id: string;
  difficulty: string;
  bloom_level: string;
  created_at: string;
  updated_at: string;
}

// Procesador seguro de datos raw
export class TypeFirewall {
  static processRawExercise(raw: RawDatabaseRecord): FirewallExercise {
    return {
      id: String(raw.id || ''),
      question: String(raw.question || ''),
      options: raw.options,
      correct_answer: String(raw.correct_answer || ''),
      explanation: String(raw.explanation || ''),
      skill_id: raw.skill_id,
      test_id: raw.test_id,
      diagnostic_id: String(raw.diagnostic_id || ''),
      node_id: String(raw.node_id || ''),
      difficulty: String(raw.difficulty || 'intermediate'),
      bloom_level: String(raw.bloom_level || 'aplicar'),
      created_at: String(raw.created_at || ''),
      updated_at: String(raw.updated_at || '')
    };
  }

  static processRawExerciseArray(rawArray: RawDatabaseRecord[]): FirewallExercise[] {
    const result: FirewallExercise[] = [];
    for (let i = 0; i < rawArray.length; i++) {
      result.push(this.processRawExercise(rawArray[i]));
    }
    return result;
  }

  static safeStringArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.map(item => String(item));
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map(item => String(item));
        }
      } catch {
        // Si no es JSON válido, devolver como string único
      }
      return [value];
    }
    return ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
  }
}
