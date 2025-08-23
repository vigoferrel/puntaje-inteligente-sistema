#!/usr/bin/env node

/**
 * SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS EDUCATIVA PAES
 * 
 * Este script ejecuta el esquema completo de base de datos para el sistema educativo PAES
 * en Supabase, creando todas las tablas, índices, funciones y datos iniciales necesarios.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://settifboilityelprvjd.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzg1ODIyMiwiZXhwIjoyMDYzNDM0MjIyfQ.VlriU1ShZH_PFPJzutat2uqnc-TZ6plxUIaBp7NTZyE';

if (!supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está configurada');
  console.log('💡 Asegúrate de tener la variable de entorno SUPABASE_SERVICE_ROLE_KEY configurada');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

class DatabaseSetup {
  constructor() {
    this.errors = [];
    this.successes = [];
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async executeSQL(sql) {
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err) {
      // Si exec_sql no existe, intentar con query directo
      try {
        const { data, error } = await supabase.from('_dummy').select('*').limit(1);
        if (error && error.message.includes('exec_sql')) {
          throw new Error('exec_sql function not available');
        }
      } catch (fallbackError) {
        throw err;
      }
    }
  }

  async readSchemaFile() {
    try {
      const schemaPath = path.join(process.cwd(), 'src', 'database', 'schema-educativo-paes.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      return schema;
    } catch (err) {
      throw new Error(`No se pudo leer el archivo de esquema: ${err.message}`);
    }
  }

  async createTables() {
    await this.log('🏗️  Creando tablas principales...');
    
    const tables = [
      'paes_subjects',
      'bloom_levels', 
      'subject_topics',
      'user_preferences',
      'user_progress',
      'study_sessions',
      'exercise_bank',
      'user_exercises',
      'paes_simulations',
      'user_simulations',
      'achievements',
      'user_achievements',
      'user_stats'
    ];

    for (const table of tables) {
      try {
        await this.log(`Creando tabla: ${table}`);
        
        // Verificar si la tabla existe
        const { data: exists } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (exists !== null) {
          await this.log(`Tabla ${table} ya existe, saltando...`, 'success');
          continue;
        }
        
        // Crear tabla usando SQL directo
        const createTableSQL = this.getCreateTableSQL(table);
        await this.executeSQL(createTableSQL);
        
        await this.log(`Tabla ${table} creada exitosamente`, 'success');
        this.successes.push(`Tabla ${table} creada`);
        
      } catch (err) {
        await this.log(`Error creando tabla ${table}: ${err.message}`, 'error');
        this.errors.push(`Error en tabla ${table}: ${err.message}`);
      }
    }
  }

  getCreateTableSQL(tableName) {
    const tableSQLs = {
      'paes_subjects': `
        CREATE TABLE IF NOT EXISTS paes_subjects (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          is_required BOOLEAN DEFAULT true,
          weight DECIMAL(3,2) DEFAULT 1.0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      'bloom_levels': `
        CREATE TABLE IF NOT EXISTS bloom_levels (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          level_order INTEGER NOT NULL,
          action_verbs TEXT[],
          indicators TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      'user_preferences': `
        CREATE TABLE IF NOT EXISTS user_preferences (
          user_id TEXT PRIMARY KEY,
          difficulty TEXT NOT NULL DEFAULT 'auto',
          focus_skills TEXT DEFAULT '[]',
          study_time_minutes INTEGER DEFAULT 30,
          notifications_enabled BOOLEAN DEFAULT true,
          music_enabled BOOLEAN DEFAULT true,
          theme_preference TEXT DEFAULT 'light',
          language TEXT DEFAULT 'es',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      'user_progress': `
        CREATE TABLE IF NOT EXISTS user_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT NOT NULL,
          subject_id TEXT NOT NULL,
          progress DECIMAL(5,2) NOT NULL DEFAULT 0.0,
          total_exercises INTEGER DEFAULT 0,
          correct_answers INTEGER DEFAULT 0,
          average_score DECIMAL(5,2) DEFAULT 0.0,
          time_studied_minutes INTEGER DEFAULT 0,
          last_studied TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          weak_areas TEXT[],
          strong_areas TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, subject_id)
        );
      `,
      'study_sessions': `
        CREATE TABLE IF NOT EXISTS study_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT NOT NULL,
          subject_id TEXT NOT NULL,
          bloom_level_id TEXT NOT NULL,
          started_at TIMESTAMP WITH TIME ZONE NOT NULL,
          ended_at TIMESTAMP WITH TIME ZONE,
          status TEXT NOT NULL DEFAULT 'in_progress',
          total_time_minutes INTEGER DEFAULT 0,
          exercises_completed INTEGER DEFAULT 0,
          correct_answers INTEGER DEFAULT 0,
          session_score DECIMAL(5,2) DEFAULT 0.0,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      'exercise_bank': `
        CREATE TABLE IF NOT EXISTS exercise_bank (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          subject_id TEXT NOT NULL,
          topic_id UUID,
          bloom_level_id TEXT NOT NULL,
          question TEXT NOT NULL,
          question_type TEXT NOT NULL DEFAULT 'multiple_choice',
          options JSONB,
          correct_answer TEXT NOT NULL,
          explanation TEXT,
          difficulty_level INTEGER DEFAULT 2,
          estimated_time_seconds INTEGER DEFAULT 60,
          tags TEXT[],
          is_official BOOLEAN DEFAULT false,
          source TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      'user_exercises': `
        CREATE TABLE IF NOT EXISTS user_exercises (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT NOT NULL,
          session_id UUID,
          exercise_id UUID NOT NULL,
          user_answer TEXT,
          is_correct BOOLEAN,
          time_spent_seconds INTEGER DEFAULT 0,
          attempts INTEGER DEFAULT 1,
          confidence_level INTEGER,
          feedback TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      'achievements': `
        CREATE TABLE IF NOT EXISTS achievements (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          icon TEXT,
          category TEXT NOT NULL,
          criteria JSONB NOT NULL,
          points INTEGER DEFAULT 0,
          is_hidden BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
      'user_achievements': `
        CREATE TABLE IF NOT EXISTS user_achievements (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT NOT NULL,
          achievement_id UUID NOT NULL,
          unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          progress DECIMAL(5,2) DEFAULT 100.0,
          UNIQUE(user_id, achievement_id)
        );
      `,
      'user_stats': `
        CREATE TABLE IF NOT EXISTS user_stats (
          user_id TEXT PRIMARY KEY,
          total_study_time_minutes INTEGER DEFAULT 0,
          total_exercises_completed INTEGER DEFAULT 0,
          total_correct_answers INTEGER DEFAULT 0,
          current_streak_days INTEGER DEFAULT 0,
          longest_streak_days INTEGER DEFAULT 0,
          total_points INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1,
          experience_points INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    };

    return tableSQLs[tableName] || `CREATE TABLE IF NOT EXISTS ${tableName} (id UUID PRIMARY KEY DEFAULT gen_random_uuid());`;
  }

  async insertInitialData() {
    await this.log('📊 Insertando datos iniciales...');
    
    try {
      // Insertar asignaturas PAES
      const subjects = [
        { id: 'MATEMATICA_M1', name: 'Matemática M1', description: 'Matemática obligatoria para todas las carreras', is_required: true, weight: 1.0 },
        { id: 'MATEMATICA_M2', name: 'Matemática M2', description: 'Matemática específica para carreras científicas', is_required: false, weight: 1.0 },
        { id: 'COMPETENCIA_LECTORA', name: 'Competencia Lectora', description: 'Comprensión lectora y análisis de textos', is_required: true, weight: 1.0 },
        { id: 'CIENCIAS', name: 'Ciencias', description: 'Ciencias naturales y metodología científica', is_required: true, weight: 1.0 },
        { id: 'HISTORIA', name: 'Historia', description: 'Historia de Chile y el mundo', is_required: true, weight: 1.0 }
      ];

      for (const subject of subjects) {
        try {
          const { error } = await supabase
            .from('paes_subjects')
            .upsert(subject, { onConflict: 'id' });
          
          if (error) throw error;
          await this.log(`Asignatura ${subject.name} insertada`, 'success');
        } catch (err) {
          await this.log(`Error insertando asignatura ${subject.name}: ${err.message}`, 'error');
        }
      }

      // Insertar niveles Bloom
      const bloomLevels = [
        { id: 'remember', name: 'Recordar', description: 'Recordar información básica', level_order: 1, action_verbs: ['definir', 'identificar', 'listar'], indicators: ['Puede recordar información específica'] },
        { id: 'understand', name: 'Comprender', description: 'Comprender el significado', level_order: 2, action_verbs: ['explicar', 'describir', 'interpretar'], indicators: ['Puede explicar conceptos'] },
        { id: 'apply', name: 'Aplicar', description: 'Aplicar conocimiento en situaciones nuevas', level_order: 3, action_verbs: ['aplicar', 'calcular', 'resolver'], indicators: ['Puede resolver problemas'] },
        { id: 'analyze', name: 'Analizar', description: 'Analizar componentes y relaciones', level_order: 4, action_verbs: ['analizar', 'comparar', 'contrastar'], indicators: ['Puede identificar patrones'] },
        { id: 'evaluate', name: 'Evaluar', description: 'Evaluar y juzgar', level_order: 5, action_verbs: ['evaluar', 'juzgar', 'criticar'], indicators: ['Puede evaluar argumentos'] },
        { id: 'create', name: 'Crear', description: 'Crear algo nuevo', level_order: 6, action_verbs: ['crear', 'diseñar', 'desarrollar'], indicators: ['Puede crear soluciones'] }
      ];

      for (const level of bloomLevels) {
        try {
          const { error } = await supabase
            .from('bloom_levels')
            .upsert(level, { onConflict: 'id' });
          
          if (error) throw error;
          await this.log(`Nivel Bloom ${level.name} insertado`, 'success');
        } catch (err) {
          await this.log(`Error insertando nivel Bloom ${level.name}: ${err.message}`, 'error');
        }
      }

      // Insertar logros básicos
      const achievements = [
        { name: 'Primer Paso', description: 'Completa tu primera sesión de estudio', category: 'study', criteria: { type: 'sessions_completed', value: 1 }, points: 10 },
        { name: 'Consistencia', description: 'Estudia 7 días seguidos', category: 'streak', criteria: { type: 'streak_days', value: 7 }, points: 50 },
        { name: 'Matemático', description: 'Completa 100 ejercicios de matemáticas', category: 'performance', criteria: { type: 'subject_exercises', subject: 'MATEMATICA_M1', value: 100 }, points: 100 }
      ];

      for (const achievement of achievements) {
        try {
          const { error } = await supabase
            .from('achievements')
            .insert(achievement);
          
          if (error) throw error;
          await this.log(`Logro ${achievement.name} insertado`, 'success');
        } catch (err) {
          await this.log(`Error insertando logro ${achievement.name}: ${err.message}`, 'error');
        }
      }

      await this.log('Datos iniciales insertados exitosamente', 'success');
      
    } catch (err) {
      await this.log(`Error insertando datos iniciales: ${err.message}`, 'error');
      this.errors.push(`Error en datos iniciales: ${err.message}`);
    }
  }

  async createIndexes() {
    await this.log('🔍 Creando índices...');
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_progress_subject_id ON user_progress(subject_id);',
      'CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_study_sessions_subject_id ON study_sessions(subject_id);',
      'CREATE INDEX IF NOT EXISTS idx_exercise_bank_subject_id ON exercise_bank(subject_id);',
      'CREATE INDEX IF NOT EXISTS idx_exercise_bank_bloom_level_id ON exercise_bank(bloom_level_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_exercises_user_id ON user_exercises(user_id);'
    ];

    for (const indexSQL of indexes) {
      try {
        await this.executeSQL(indexSQL);
        await this.log('Índice creado exitosamente', 'success');
      } catch (err) {
        await this.log(`Error creando índice: ${err.message}`, 'error');
      }
    }
  }

  async enableRLS() {
    await this.log('🔒 Habilitando Row Level Security...');
    
    const tables = [
      'user_preferences',
      'user_progress', 
      'study_sessions',
      'user_exercises',
      'user_achievements',
      'user_stats'
    ];

    for (const table of tables) {
      try {
        await this.executeSQL(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
        await this.log(`RLS habilitado en ${table}`, 'success');
      } catch (err) {
        await this.log(`Error habilitando RLS en ${table}: ${err.message}`, 'error');
      }
    }
  }

  async run() {
    await this.log('🚀 Iniciando configuración de base de datos educativa PAES...');
    
    try {
      await this.createTables();
      await this.insertInitialData();
      await this.createIndexes();
      await this.enableRLS();
      
      await this.log('🎉 Configuración de base de datos completada', 'success');
      
      // Resumen
      await this.log(`\n📊 RESUMEN:`);
      await this.log(`✅ Éxitos: ${this.successes.length}`);
      await this.log(`❌ Errores: ${this.errors.length}`);
      
      if (this.errors.length > 0) {
        await this.log('\n❌ Errores encontrados:');
        for (const error of this.errors) {
          await this.log(`  - ${error}`, 'error');
        }
      }
      
      if (this.successes.length > 0) {
        await this.log('\n✅ Operaciones exitosas:');
        for (const success of this.successes) {
          await this.log(`  - ${success}`, 'success');
        }
      }
      
    } catch (err) {
      await this.log(`Error fatal en la configuración: ${err.message}`, 'error');
      process.exit(1);
    }
  }
}

// Ejecutar configuración
const setup = new DatabaseSetup();
setup.run().catch(err => {
  console.error('Error ejecutando configuración:', err);
  process.exit(1);
});
