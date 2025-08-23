#!/usr/bin/env node

/**
 * 🔗 SUPABASE CLIENT - Conexión al Proyecto Central PAES PRO
 * Conecta con la base de datos central de Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

class SupabaseClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.config = this.loadConfig();
  }

  loadConfig() {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      throw new Error('Missing required Supabase configuration: SUPABASE_URL and SUPABASE_ANON_KEY must be set via environment');
    }
    return { url, anonKey };
  }

  async connect() {
    try {
      console.log('🔗 Conectando a Supabase...');
      console.log(`   Config: url set=${!!this.config.url}, anonKey set=${!!this.config.anonKey}`);
      
      this.client = createClient(this.config.url, this.config.anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });

      // Verificar conexión
      const { data, error } = await this.client
        .from('learning_nodes')
        .select('count')
        .limit(1);

      if (error) {
        throw error;
      }

      this.isConnected = true;
      console.log('✅ Conexión a Supabase establecida');
      return true;

    } catch (error) {
      console.error('❌ Error conectando a Supabase:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  // 🔍 OBTENER NODOS DE APRENDIZAJE
  async getLearningNodes() {
    if (!this.isConnected) {
      throw new Error('No conectado a Supabase');
    }

    try {
      const { data, error } = await this.client
        .from('learning_nodes')
        .select('*')
        .eq('is_active', true)
        .order('position');

      if (error) throw error;
      
      console.log(`📚 ${data.length} nodos de aprendizaje obtenidos`);
      return data;

    } catch (error) {
      console.error('❌ Error obteniendo nodos:', error.message);
      throw error;
    }
  }

  // 👤 OBTENER PERFIL DE USUARIO
  async getUserProfile(userId) {
    if (!this.isConnected) {
      throw new Error('No conectado a Supabase');
    }

    try {
      const { data, error } = await this.client
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      console.log(`👤 Perfil de usuario ${userId} obtenido`);
      return data;

    } catch (error) {
      console.error('❌ Error obteniendo perfil:', error.message);
      throw error;
    }
  }

  // 📊 OBTENER PROGRESO DEL USUARIO
  async getUserProgress(userId) {
    if (!this.isConnected) {
      throw new Error('No conectado a Supabase');
    }

    try {
      const { data, error } = await this.client
        .from('user_progress')
        .select(`
          *,
          learning_nodes (
            id,
            name,
            test_type,
            skill_primary,
            skill_secondary,
            difficulty_level,
            bloom_level
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log(`📊 ${data.length} registros de progreso obtenidos para usuario ${userId}`);
      return data;

    } catch (error) {
      console.error('❌ Error obteniendo progreso:', error.message);
      throw error;
    }
  }

  // 📈 ACTUALIZAR PROGRESO
  async updateUserProgress(userId, nodeId, progress) {
    if (!this.isConnected) {
      throw new Error('No conectado a Supabase');
    }

    try {
      const { data, error } = await this.client
        .from('user_progress')
        .upsert({
          user_id: userId,
          node_id: nodeId,
          ...progress,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      
      console.log(`📈 Progreso actualizado para usuario ${userId}, nodo ${nodeId}`);
      return data;

    } catch (error) {
      console.error('❌ Error actualizando progreso:', error.message);
      throw error;
    }
  }

  // 🎯 CREAR SESIÓN DE PRÁCTICA
  async createPracticeSession(session) {
    if (!this.isConnected) {
      throw new Error('No conectado a Supabase');
    }

    try {
      const { data, error } = await this.client
        .from('diagnostic_assessments')
        .insert({
          user_id: session.user_id,
          assessment_type: session.assessment_type || 'practice',
          status: 'completed',
          total_questions: session.total_questions,
          correct_answers: session.correct_answers,
          overall_score: session.total_score,
          time_spent_minutes: session.time_spent_minutes,
          completed_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      
      console.log(`🎯 Sesión de práctica creada para usuario ${session.user_id}`);
      return data;

    } catch (error) {
      console.error('❌ Error creando sesión:', error.message);
      throw error;
    }
  }

  // 🔍 OBTENER ESTRUCTURA DE BASE DE DATOS
  async getDatabaseStructure() {
    if (!this.isConnected) {
      throw new Error('No conectado a Supabase');
    }

    try {
      // Obtener información de las tablas
      const tables = ['users', 'learning_nodes', 'user_progress', 'diagnostic_assessments'];
      const structure = {};

      for (const table of tables) {
        const { data, error } = await this.client
          .from(table)
          .select('*')
          .limit(1);

        if (!error) {
          structure[table] = {
            exists: true,
            sampleData: data.length > 0 ? Object.keys(data[0]) : []
          };
        } else {
          structure[table] = {
            exists: false,
            error: error.message
          };
        }
      }

      console.log('🗄️ Estructura de base de datos obtenida');
      return structure;

    } catch (error) {
      console.error('❌ Error obteniendo estructura:', error.message);
      throw error;
    }
  }

  // 🔄 SINCRONIZAR CON ESTRUCTURA OFICIAL PAES
  async syncWithPAESStructure(paesStructure) {
    if (!this.isConnected) {
      throw new Error('No conectado a Supabase');
    }

    try {
      console.log('🔄 Sincronizando con estructura oficial PAES...');
      
      const nodesToSync = [];
      
      // Generar nodos basados en estructura oficial
      for (const [testType, testStructure] of Object.entries(paesStructure)) {
        for (const skill of testStructure.skills) {
          for (const subSkill of testStructure.subSkills[skill]) {
            const node = {
              name: `${testStructure.name} - ${skill} - ${subSkill}`,
              description: `Nodo de aprendizaje para ${subSkill} en ${skill}`,
              content_type: 'lesson',
              difficulty_level: 'intermedio',
              test_type: testType,
              skill_primary: skill,
              skill_secondary: subSkill,
              bloom_level: testStructure.bloomMapping[subSkill] || 'L1',
              estimated_time_minutes: 30,
              is_active: true,
              position: 0,
              prerequisites: [],
              tags: [testType, skill, subSkill]
            };
            
            nodesToSync.push(node);
          }
        }
      }

      // Insertar nodos en Supabase
      const { data, error } = await this.client
        .from('learning_nodes')
        .upsert(nodesToSync, { 
          onConflict: 'name',
          ignoreDuplicates: false 
        })
        .select();

      if (error) throw error;
      
      console.log(`✅ ${data.length} nodos sincronizados con estructura oficial PAES`);
      return data;

    } catch (error) {
      console.error('❌ Error sincronizando estructura:', error.message);
      throw error;
    }
  }

  // 🧪 TEST DE CONEXIÓN
  async testConnection() {
    console.log('🧪 Probando conexión a Supabase...');
    
    try {
      const connected = await this.connect();
      if (!connected) {
        return { success: false, error: 'No se pudo conectar a Supabase' };
      }

      // Obtener estructura de base de datos
      const structure = await this.getDatabaseStructure();
      
      // Obtener nodos de aprendizaje
      const nodes = await this.getLearningNodes();
      
      return {
        success: true,
        structure,
        nodesCount: nodes.length,
        config: {
          url: this.config.url,
          hasAnonKey: !!this.config.anonKey
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default SupabaseClient;
