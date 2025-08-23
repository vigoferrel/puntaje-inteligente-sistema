#!/usr/bin/env node

/**
 * 🔗 SUPABASE INTEGRATION - Integración con Base de Datos
 * Respeta la estructura oficial PAES: Matemáticas 1 y 2
 * Usa nodos como backbone y Bloom para jerarquizar
 * Basado en el esquema SQL de Supabase encontrado
 */

import PAESStructureManager from './paes-structure.js';

export class SupabaseIntegration {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
    this.paesManager = new PAESStructureManager();
    this.structure = this.paesManager.getStructure();
  }

  // 🔄 SINCRONIZAR ESTRUCTURA OFICIAL PAES CON SUPABASE
  async syncPAESStructure() {
    console.log('🔄 Sincronizando estructura oficial PAES con Supabase...');
    
    try {
      // Generar nodos de aprendizaje completos
      const learningNodes = this.paesManager.generateCompleteNodeStructure();
      
      // Insertar nodos en Supabase
      const { data, error } = await this.supabase
        .from('learning_nodes')
        .upsert(learningNodes, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error('❌ Error sincronizando nodos:', error);
        throw error;
      }
      
      console.log(`✅ ${learningNodes.length} nodos sincronizados con Supabase`);
      return data;
      
    } catch (error) {
      console.error('❌ Error en sincronización:', error);
      throw error;
    }
  }

  // 📊 OBTENER PROGRESO DEL USUARIO POR ESTRUCTURA OFICIAL
  async getUserProgressByStructure(userId) {
    console.log(`📊 Obteniendo progreso del usuario ${userId} por estructura oficial...`);
    
    try {
      // Obtener progreso de nodos del usuario
      const { data: userProgress, error } = await this.supabase
        .from('user_node_progress')
        .select(`
          *,
          learning_nodes (
            id,
            name,
            test_type,
            skill,
            sub_skill,
            difficulty,
            position
          )
        `)
        .eq('user_id', userId);
      
      if (error) {
        console.error('❌ Error obteniendo progreso:', error);
        throw error;
      }
      
      // Organizar por estructura oficial PAES
      const progressByStructure = {};
      
      for (const testType of Object.keys(this.structure)) {
        progressByStructure[testType] = {};
        
        for (const skill of this.paesManager.getSkills(testType)) {
          progressByStructure[testType][skill] = {};
          
          for (const subSkill of this.paesManager.getSubSkills(testType, skill)) {
            const nodeId = `node-${testType}-${skill}-${subSkill}`;
            const userNodeProgress = userProgress.find(p => p.node_id === nodeId);
            
            progressByStructure[testType][skill][subSkill] = {
              status: userNodeProgress?.status || 'not_started',
              progress: userNodeProgress?.progress_percentage || 0,
              masteryLevel: userNodeProgress?.mastery_level || 0,
              confidenceLevel: userNodeProgress?.confidence_level || 0,
              bestScore: userNodeProgress?.best_score || 0,
              averageScore: userNodeProgress?.average_score || 0,
              attemptsCount: userNodeProgress?.attempts_count || 0,
              timeSpentMinutes: userNodeProgress?.time_spent_minutes || 0,
              sessionsCount: userNodeProgress?.sessions_count || 0,
              lastPracticedAt: userNodeProgress?.last_practiced_at,
              bloomLevel: this.paesManager.getBloomLevel(testType, subSkill),
              difficulty: this.paesManager.getDifficultyByBloom(
                this.paesManager.getBloomLevel(testType, subSkill)
              )
            };
          }
        }
      }
      
      return progressByStructure;
      
    } catch (error) {
      console.error('❌ Error obteniendo progreso por estructura:', error);
      throw error;
    }
  }

  // 🎯 CREAR SESIÓN DE ESTUDIO (ESTRUCTURA OFICIAL)
  async createStudySession(userId, testType, skill, subSkill, duration) {
    console.log(`🎯 Creando sesión de estudio: ${testType} - ${skill} - ${subSkill}`);
    
    try {
      // Validar estructura oficial
      if (!this.paesManager.validateStructure(testType, skill, subSkill)) {
        throw new Error(`Estructura inválida: ${testType} - ${skill} - ${subSkill}`);
      }
      
      const nodeId = `node-${testType}-${skill}-${subSkill}`;
      const bloomLevel = this.paesManager.getBloomLevel(testType, subSkill);
      
      // Crear sesión de estudio
      const { data: session, error: sessionError } = await this.supabase
        .from('study_sessions')
        .insert({
          user_id: userId,
          test_type: testType,
          skill: skill,
          sub_skill: subSkill,
          node_id: nodeId,
          duration_minutes: duration,
          bloom_level: bloomLevel,
          status: 'active',
          started_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (sessionError) {
        console.error('❌ Error creando sesión:', sessionError);
        throw sessionError;
      }
      
      // Actualizar progreso del nodo
      await this.updateNodeProgress(userId, nodeId, {
        duration,
        bloomLevel,
        status: 'in_progress'
      });
      
      return session;
      
    } catch (error) {
      console.error('❌ Error en sesión de estudio:', error);
      throw error;
    }
  }

  // 📈 ACTUALIZAR PROGRESO DE NODO (BACKBONE)
  async updateNodeProgress(userId, nodeId, data) {
    try {
      const { duration = 0, bloomLevel, status, score = 0 } = data;
      
      // Obtener progreso actual
      const { data: currentProgress, error: fetchError } = await this.supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('node_id', nodeId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      const updateData = {
        user_id: userId,
        node_id: nodeId,
        time_spent_minutes: (currentProgress?.time_spent_minutes || 0) + duration,
        sessions_count: (currentProgress?.sessions_count || 0) + 1,
        last_practiced_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      };
      
      // Actualizar según el estado
      if (status) {
        updateData.status = status;
      }
      
      if (score > 0) {
        updateData.attempts_count = (currentProgress?.attempts_count || 0) + 1;
        updateData.best_score = Math.max(currentProgress?.best_score || 0, score);
        updateData.average_score = this.calculateAverageScore(
          currentProgress?.average_score || 0,
          currentProgress?.attempts_count || 0,
          score
        );
        
        if (score >= 70) {
          updateData.successful_attempts = (currentProgress?.successful_attempts || 0) + 1;
        }
      }
      
      // Calcular progreso basado en Bloom
      if (bloomLevel) {
        const bloomProgress = this.calculateBloomProgress(bloomLevel, score);
        updateData.progress_percentage = Math.min(100, bloomProgress);
        updateData.mastery_level = this.calculateMasteryLevel(bloomLevel, score);
        updateData.confidence_level = this.calculateConfidenceLevel(score, duration);
      }
      
      // Upsert progreso
      const { data: updatedProgress, error: updateError } = await this.supabase
        .from('user_node_progress')
        .upsert(updateData, { onConflict: 'user_id,node_id' })
        .select()
        .single();
      
      if (updateError) {
        throw updateError;
      }
      
      return updatedProgress;
      
    } catch (error) {
      console.error('❌ Error actualizando progreso:', error);
      throw error;
    }
  }

  // 🎵 SINCRONIZAR SPOTIFY NEURAL (ESTRUCTURA OFICIAL)
  async syncSpotifyNeural(userId, testType, skill, subSkill, playlistId, trackId) {
    console.log(`🎵 Sincronizando Spotify Neural: ${testType} - ${skill} - ${subSkill}`);
    
    try {
      const nodeId = `node-${testType}-${skill}-${subSkill}`;
      const bloomLevel = this.paesManager.getBloomLevel(testType, subSkill);
      
      // Crear contenido generado por IA para Spotify
      const { data: aiContent, error: aiError } = await this.supabase
        .from('ai_generated_content')
        .insert({
          user_id: userId,
          node_id: nodeId,
          content_type: 'interactive',
          title: `Spotify Neural - ${testType} ${skill} ${subSkill}`,
          content: JSON.stringify({
            playlistId,
            trackId,
            testType,
            skill,
            subSkill,
            bloomLevel,
            neuralSync: true
          }),
          personalization_factors: {
            testType,
            skill,
            subSkill,
            bloomLevel,
            spotifyIntegration: true
          },
          quality_score: 0.9,
          is_active: true
        })
        .select()
        .single();
      
      if (aiError) {
        console.error('❌ Error creando contenido AI:', aiError);
        throw aiError;
      }
      
      return aiContent;
      
    } catch (error) {
      console.error('❌ Error sincronizando Spotify:', error);
      throw error;
    }
  }

  // 📊 OBTENER ANALÍTICAS POR ESTRUCTURA OFICIAL
  async getAnalyticsByStructure(userId) {
    console.log(`📊 Obteniendo analíticas por estructura oficial para usuario ${userId}`);
    
    try {
      // Obtener datos de analíticas
      const { data: analytics, error } = await this.supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) {
        throw error;
      }
      
      // Organizar por estructura oficial PAES
      const analyticsByStructure = {};
      
      for (const testType of Object.keys(this.structure)) {
        analyticsByStructure[testType] = {
          totalTime: 0,
          totalSessions: 0,
          averageScore: 0,
          bloomProgress: {},
          weeklyProgress: []
        };
        
        // Progreso por nivel Bloom
        for (let level = 1; level <= 6; level++) {
          analyticsByStructure[testType].bloomProgress[`L${level}`] = {
            nodesCompleted: 0,
            averageScore: 0,
            totalTime: 0
          };
        }
      }
      
      // Procesar datos de analíticas
      for (const analytic of analytics) {
        const testType = analytic.test_type;
        if (analyticsByStructure[testType]) {
          analyticsByStructure[testType].totalTime += analytic.study_time_minutes || 0;
          analyticsByStructure[testType].totalSessions += analytic.sessions_count || 0;
          
          // Progreso semanal
          analyticsByStructure[testType].weeklyProgress.push({
            week: analytic.week_start,
            timeSpent: analytic.study_time_minutes || 0,
            sessions: analytic.sessions_count || 0,
            score: analytic.average_score || 0
          });
        }
      }
      
      return analyticsByStructure;
      
    } catch (error) {
      console.error('❌ Error obteniendo analíticas:', error);
      throw error;
    }
  }

  // 🎯 GENERAR RECOMENDACIONES (ESTRUCTURA OFICIAL)
  async generateRecommendations(userId) {
    console.log(`🎯 Generando recomendaciones para usuario ${userId}`);
    
    try {
      // Obtener progreso actual
      const userProgress = await this.getUserProgressByStructure(userId);
      
      const recommendations = [];
      
      // Analizar cada tipo de prueba
      for (const [testType, testStructure] of Object.entries(userProgress)) {
        for (const [skill, skillStructure] of Object.entries(testStructure)) {
          for (const [subSkill, progress] of Object.entries(skillStructure)) {
            
            // Recomendaciones basadas en progreso
            if (progress.status === 'not_started') {
              recommendations.push({
                type: 'start_learning',
                priority: 'high',
                testType,
                skill,
                subSkill,
                reason: 'Nodo no iniciado',
                estimatedTime: this.paesManager.getEstimatedTime(progress.bloomLevel)
              });
            } else if (progress.status === 'in_progress' && progress.progress < 50) {
              recommendations.push({
                type: 'continue_learning',
                priority: 'medium',
                testType,
                skill,
                subSkill,
                reason: 'Progreso bajo',
                currentProgress: progress.progress
              });
            } else if (progress.status === 'needs_review' && progress.averageScore < 70) {
              recommendations.push({
                type: 'review_weak',
                priority: 'high',
                testType,
                skill,
                subSkill,
                reason: 'Rendimiento bajo',
                averageScore: progress.averageScore
              });
            }
          }
        }
      }
      
      // Ordenar por prioridad y tiempo estimado
      recommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
      
      return recommendations.slice(0, 10); // Top 10 recomendaciones
      
    } catch (error) {
      console.error('❌ Error generando recomendaciones:', error);
      throw error;
    }
  }

  // 🔧 FUNCIONES AUXILIARES
  calculateAverageScore(currentAvg, currentAttempts, newScore) {
    if (currentAttempts === 0) return newScore;
    return ((currentAvg * currentAttempts) + newScore) / (currentAttempts + 1);
  }

  calculateBloomProgress(bloomLevel, score) {
    const level = parseInt(bloomLevel.slice(1));
    const baseProgress = (level - 1) * 16.67; // 100% / 6 niveles
    const scoreProgress = (score / 100) * 16.67;
    return baseProgress + scoreProgress;
  }

  calculateMasteryLevel(bloomLevel, score) {
    const level = parseInt(bloomLevel.slice(1));
    const scoreMultiplier = score / 100;
    return Math.min(100, level * 16.67 * scoreMultiplier);
  }

  calculateConfidenceLevel(score, duration) {
    const scoreWeight = 0.7;
    const durationWeight = 0.3;
    const normalizedDuration = Math.min(duration / 60, 1); // Normalizar a 1 hora
    return (score * scoreWeight) + (normalizedDuration * 100 * durationWeight);
  }

  // 🚀 INICIALIZAR INTEGRACIÓN
  async initialize() {
    console.log('🔗 Inicializando integración con Supabase...');
    console.log('📚 Respetando estructura oficial PAES: Matemáticas 1 y 2');
    console.log('🌟 Usando nodos como backbone del sistema');
    console.log('🌸 Jerarquizando con taxonomía Bloom');
    
    try {
      // Sincronizar estructura oficial
      await this.syncPAESStructure();
      
      console.log('✅ Integración con Supabase inicializada');
      return true;
      
    } catch (error) {
      console.error('❌ Error inicializando integración:', error);
      throw error;
    }
  }
}

export default SupabaseIntegration;
