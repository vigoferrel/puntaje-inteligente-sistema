import { supabase } from '../lib/supabase';

export interface SupabaseExercise {
  id: string;
  question: string;
  context_text?: string;
  context_image?: string;
  context_formula?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
  explanation: string;
  explanation_formula?: string;
  subject: string;
  topic: string;
  difficulty: string;
  bloom_level: string;
  points: number;
  tags: string[];
}

export interface ExerciseFilters {
  subject?: string;
  topic?: string;
  difficulty?: string;
  bloom_level?: string;
  limit?: number;
}

export class ExerciseService {
  private static instance: ExerciseService;

  public static getInstance(): ExerciseService {
    if (!ExerciseService.instance) {
      ExerciseService.instance = new ExerciseService();
    }
    return ExerciseService.instance;
  }

  async getExercises(filters: ExerciseFilters = {}): Promise<SupabaseExercise[]> {
    try {
      // Usar la configuración correcta de Supabase (settifboilityelprvjd)
      let query = supabase
        .from('exercises')
        .select('*')
        .eq('is_active', true);

      if (filters.subject) {
        query = query.eq('subject', filters.subject);
      }
      if (filters.topic) {
        query = query.eq('topic', filters.topic);
      }
      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters.bloom_level) {
        query = query.eq('bloom_level', filters.bloom_level);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching exercises from Supabase:', error);
        // Fallback al backend Flask
        return this.getBackendExercises(filters);
      }

      return this.transformExercises(data || []);
    } catch (error) {
      console.error('Error in getExercises:', error);
      // Fallback al backend Flask
      return this.getBackendExercises(filters);
    }
  }

  private async getBackendExercises(filters: ExerciseFilters = {}): Promise<SupabaseExercise[]> {
    try {
      // Usar datos del backend Flask consolidado
      const response = await fetch('http://localhost:5000/api/exercises');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      let exercises = data.exercises || [];

      // Aplicar filtros localmente
      if (filters.subject) {
        exercises = exercises.filter((ex: any) => ex.subject === filters.subject);
      }
      if (filters.topic) {
        exercises = exercises.filter((ex: any) => ex.topic === filters.topic);
      }
      if (filters.difficulty) {
        exercises = exercises.filter((ex: any) => ex.difficulty === filters.difficulty);
      }
      if (filters.bloom_level) {
        exercises = exercises.filter((ex: any) => ex.bloom_level === filters.bloom_level);
      }
      if (filters.limit) {
        exercises = exercises.slice(0, filters.limit);
      }

      return this.transformExercises(exercises);
    } catch (error) {
      console.error('Error fetching from backend:', error);
      // Fallback final a datos locales
      return this.getLocalExercises(filters);
    }
  }

  private getLocalExercises(filters: ExerciseFilters = {}): SupabaseExercise[] {
    // Datos locales como fallback
    const localExercises = [
      {
        id: '1',
        subject: 'Matemática M1',
        topic: 'Ecuaciones de primer grado',
        question: 'Resuelve la ecuación: 2x + 5 = 13',
        options: ['x = 4', 'x = 8', 'x = 6', 'x = 3'],
        correct_answer: 'x = 4',
        explanation: '2x + 5 = 13 → 2x = 8 → x = 4',
        difficulty: 'Medio',
        bloom_level: 'APLICAR',
        is_active: true,
        context_text: null,
        context_image: null,
        context_formula: null,
        explanation_formula: null
      },
      {
        id: '2',
        subject: 'Competencia Lectora',
        topic: 'Comprensión de lectura',
        question: '¿Cuál es la idea principal del texto?',
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correct_answer: 'Opción A',
        explanation: 'La idea principal se encuentra en el primer párrafo',
        difficulty: 'Fácil',
        bloom_level: 'COMPRENDER',
        is_active: true,
        context_text: 'Este es un texto de ejemplo para comprensión lectora...',
        context_image: null,
        context_formula: null,
        explanation_formula: null
      }
    ];

    let exercises = localExercises;

    // Aplicar filtros
    if (filters.subject) {
      exercises = exercises.filter(ex => ex.subject === filters.subject);
    }
    if (filters.topic) {
      exercises = exercises.filter(ex => ex.topic === filters.topic);
    }
    if (filters.difficulty) {
      exercises = exercises.filter(ex => ex.difficulty === filters.difficulty);
    }
    if (filters.bloom_level) {
      exercises = exercises.filter(ex => ex.bloom_level === filters.bloom_level);
    }
    if (filters.limit) {
      exercises = exercises.slice(0, filters.limit);
    }

    return this.transformExercises(exercises);
  }

  async getRandomExercise(filters: ExerciseFilters = {}): Promise<SupabaseExercise | null> {
    try {
      const exercises = await this.getExercises(filters);
      if (exercises.length === 0) {
        return null;
      }

      const randomIndex = Math.floor(Math.random() * exercises.length);
      return exercises[randomIndex];
    } catch (error) {
      console.error('Error getting random exercise:', error);
      return null;
    }
  }

  async getExercisesBySubject(subject: string): Promise<SupabaseExercise[]> {
    return this.getExercises({ subject });
  }

  async getExercisesByBloomLevel(bloomLevel: string): Promise<SupabaseExercise[]> {
    return this.getExercises({ bloom_level: bloomLevel });
  }

  async getExercisesByDifficulty(difficulty: string): Promise<SupabaseExercise[]> {
    return this.getExercises({ difficulty });
  }

  async getExercisesWithContext(): Promise<SupabaseExercise[]> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .or('context_text.neq.null,context_image.neq.null,context_formula.neq.null')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching exercises with context:', error);
        throw error;
      }

      return this.transformExercises(data || []);
    } catch (error) {
      console.error('Error in getExercisesWithContext:', error);
      return [];
    }
  }

  async getExercisesWithFormulas(): Promise<SupabaseExercise[]> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .or('context_formula.neq.null,explanation_formula.neq.null')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching exercises with formulas:', error);
        throw error;
      }

      return this.transformExercises(data || []);
    } catch (error) {
      console.error('Error in getExercisesWithFormulas:', error);
      return [];
    }
  }

  async getExercisesWithImages(): Promise<SupabaseExercise[]> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .not('context_image', 'is', null)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching exercises with images:', error);
        throw error;
      }

      return this.transformExercises(data || []);
    } catch (error) {
      console.error('Error in getExercisesWithImages:', error);
      return [];
    }
  }

  private transformExercises(data: any[]): SupabaseExercise[] {
    return data.map(item => ({
      id: item.id,
      question: item.question,
      context_text: item.context_text,
      context_image: item.context_image,
      context_formula: item.context_formula,
      options: this.parseOptions(item.options),
      correct_answer: item.correct_answer,
      explanation: item.explanation,
      explanation_formula: item.explanation_formula,
      subject: item.subject,
      topic: item.topic,
      difficulty: item.difficulty,
      bloom_level: item.bloom_level,
      points: item.points || 10,
      tags: item.tags || []
    }));
  }

  private parseOptions(options: any): { A: string; B: string; C: string; D: string } {
    if (typeof options === 'string') {
      try {
        options = JSON.parse(options);
      } catch {
        options = {};
      }
    }

    return {
      A: options.A || options.a || options[0] || '',
      B: options.B || options.b || options[1] || '',
      C: options.C || options.c || options[2] || '',
      D: options.D || options.d || options[3] || ''
    };
  }

  async getExerciseStats(): Promise<{
    total: number;
    bySubject: Record<string, number>;
    byDifficulty: Record<string, number>;
    byBloomLevel: Record<string, number>;
    withContext: number;
    withFormulas: number;
    withImages: number;
  }> {
    try {
      const [allExercises, withContext, withFormulas, withImages] = await Promise.all([
        this.getExercises(),
        this.getExercisesWithContext(),
        this.getExercisesWithFormulas(),
        this.getExercisesWithImages()
      ]);

      const stats = {
        total: allExercises.length,
        bySubject: {} as Record<string, number>,
        byDifficulty: {} as Record<string, number>,
        byBloomLevel: {} as Record<string, number>,
        withContext: withContext.length,
        withFormulas: withFormulas.length,
        withImages: withImages.length
      };

      allExercises.forEach(exercise => {
        stats.bySubject[exercise.subject] = (stats.bySubject[exercise.subject] || 0) + 1;
        stats.byDifficulty[exercise.difficulty] = (stats.byDifficulty[exercise.difficulty] || 0) + 1;
        stats.byBloomLevel[exercise.bloom_level] = (stats.byBloomLevel[exercise.bloom_level] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting exercise stats:', error);
      return {
        total: 0,
        bySubject: {},
        byDifficulty: {},
        byBloomLevel: {},
        withContext: 0,
        withFormulas: 0,
        withImages: 0
      };
    }
  }
}

export const exerciseService = ExerciseService.getInstance();
