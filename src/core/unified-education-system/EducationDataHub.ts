
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

// Tipos unificados del sistema educativo
export interface StudentProfile {
  id: string;
  name: string;
  currentLevel: 'inicial' | 'intermedio' | 'avanzado';
  learningStyle: 'visual' | 'auditivo' | 'kinestesico' | 'mixto';
  motivationProfile: {
    gamification: number; // 0-100
    competition: number;
    collaboration: number;
    achievement: number;
  };
  cognitiveProfile: {
    processingSpeed: number;
    workingMemory: number;
    attention: number;
    reasoning: number;
  };
  academicGoals: {
    targetScore: number;
    prioritySubjects: string[];
    timeframe: string;
  };
}

export interface SkillNode {
  id: string;
  code: string;
  name: string;
  subject: string;
  difficulty: 'basico' | 'intermedio' | 'avanzado';
  prerequisites: string[];
  masteryLevel: number; // 0-100
  diagnosticResults: {
    lastAssessment: Date;
    accuracy: number;
    speed: number;
    confidence: number;
  };
  aiRecommendations: {
    nextActions: string[];
    studyTime: number;
    difficulty: string;
    resources: string[];
  };
}

export interface IntelligentRecommendation {
  id: string;
  type: 'estudio' | 'diagnostico' | 'refuerzo' | 'avance';
  priority: 'alta' | 'media' | 'baja';
  subject: string;
  skillNodes: string[];
  description: string;
  estimatedTime: number;
  confidence: number;
  reasoning: string[];
  adaptiveContent: {
    exercises: any[];
    explanations: string[];
    visualizations: any[];
  };
}

export interface LearningSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  activities: {
    type: 'diagnostic' | 'study' | 'practice' | 'review';
    nodeId: string;
    performance: number;
    timeSpent: number;
    aiInsights: string[];
  }[];
  overallPerformance: number;
  insights: string[];
  nextRecommendations: IntelligentRecommendation[];
}

interface EducationSystemStore {
  // Estado principal
  studentProfile: StudentProfile | null;
  skillNodes: Record<string, SkillNode>;
  currentRecommendations: IntelligentRecommendation[];
  activeSessions: LearningSession[];
  systemMetrics: {
    totalStudyTime: number;
    nodesCompleted: number;
    averagePerformance: number;
    learningVelocity: number;
    predictionAccuracy: number;
  };
  
  // Estado de carga
  isInitializing: boolean;
  isGeneratingContent: boolean;
  error: string | null;

  // Acciones principales
  initializeSystem: (userId: string) => Promise<void>;
  updateStudentProfile: (updates: Partial<StudentProfile>) => Promise<void>;
  updateSkillMastery: (nodeId: string, performance: number) => Promise<void>;
  generateIntelligentRecommendations: () => Promise<IntelligentRecommendation[]>;
  startLearningSession: (type: string) => string;
  endLearningSession: (sessionId: string, performance: number) => Promise<void>;
  
  // IA y análisis
  analyzePerformancePatterns: () => any;
  generateAdaptiveContent: (nodeId: string, difficulty: string) => Promise<any>;
  predictLearningPath: (targetScore: number) => Promise<string[]>;
  getPersonalizedInsights: () => string[];
}

export const useEducationSystem = create<EducationSystemStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        studentProfile: null,
        skillNodes: {},
        currentRecommendations: [],
        activeSessions: [],
        systemMetrics: {
          totalStudyTime: 0,
          nodesCompleted: 0,
          averagePerformance: 0,
          learningVelocity: 0,
          predictionAccuracy: 0
        },
        isInitializing: false,
        isGeneratingContent: false,
        error: null,

        // Inicialización del sistema
        initializeSystem: async (userId: string) => {
          set({ isInitializing: true, error: null });
          
          try {
            console.log('🎓 Inicializando Sistema Educativo Unificado');
            
            // Cargar perfil del estudiante
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();

            // Cargar nodos de habilidades
            const { data: nodes } = await supabase
              .from('learning_nodes')
              .select(`
                *,
                user_node_progress(*)
              `)
              .order('position');

            // Cargar progreso del usuario
            const { data: progress } = await supabase
              .from('user_node_progress')
              .select('*')
              .eq('user_id', userId);

            // Procesar datos en estructuras unificadas
            const processedNodes: Record<string, SkillNode> = {};
            
            nodes?.forEach(node => {
              const userProgress = progress?.find(p => p.node_id === node.id);
              
              processedNodes[node.id] = {
                id: node.id,
                code: node.code,
                name: node.title,
                subject: node.subject_area,
                difficulty: node.difficulty,
                prerequisites: node.depends_on || [],
                masteryLevel: userProgress?.mastery_level || 0,
                diagnosticResults: {
                  lastAssessment: userProgress?.last_activity_at || new Date(),
                  accuracy: userProgress?.success_rate || 0,
                  speed: 100 - (userProgress?.time_spent_minutes || 0) / 5,
                  confidence: userProgress?.mastery_level || 0
                },
                aiRecommendations: {
                  nextActions: [],
                  studyTime: node.estimated_time_minutes || 45,
                  difficulty: node.difficulty,
                  resources: []
                }
              };
            });

            // Crear perfil del estudiante
            const studentProfile: StudentProfile = {
              id: userId,
              name: profile?.name || 'Estudiante',
              currentLevel: get().determineCurrentLevel(processedNodes),
              learningStyle: 'mixto',
              motivationProfile: {
                gamification: 80,
                competition: 60,
                collaboration: 70,
                achievement: 90
              },
              cognitiveProfile: {
                processingSpeed: 75,
                workingMemory: 80,
                attention: 70,
                reasoning: 85
              },
              academicGoals: {
                targetScore: profile?.target_score || 600,
                prioritySubjects: ['matematica', 'lenguaje'],
                timeframe: '6 meses'
              }
            };

            set({
              studentProfile,
              skillNodes: processedNodes,
              isInitializing: false
            });

            // Generar recomendaciones iniciales
            await get().generateIntelligentRecommendations();
            
            console.log('✅ Sistema Educativo inicializado con éxito');

          } catch (error) {
            console.error('❌ Error inicializando sistema:', error);
            set({ error: 'Error al inicializar el sistema educativo', isInitializing: false });
          }
        },

        // Determinar nivel actual del estudiante
        determineCurrentLevel: (nodes: Record<string, SkillNode>) => {
          const masteryLevels = Object.values(nodes).map(n => n.masteryLevel);
          const average = masteryLevels.reduce((a, b) => a + b, 0) / masteryLevels.length;
          
          if (average < 40) return 'inicial';
          if (average < 70) return 'intermedio';
          return 'avanzado';
        },

        // Actualizar perfil del estudiante
        updateStudentProfile: async (updates: Partial<StudentProfile>) => {
          const current = get().studentProfile;
          if (!current) return;

          const updated = { ...current, ...updates };
          set({ studentProfile: updated });

          // Sincronizar con backend
          await supabase
            .from('profiles')
            .update({
              name: updated.name,
              target_score: updated.academicGoals.targetScore
            })
            .eq('id', updated.id);
        },

        // Actualizar dominio de habilidad
        updateSkillMastery: async (nodeId: string, performance: number) => {
          const nodes = get().skillNodes;
          const node = nodes[nodeId];
          
          if (!node) return;

          // Algoritmo de actualización de dominio con IA
          const newMastery = Math.min(100, node.masteryLevel + (performance - 50) * 0.3);
          
          const updatedNode = {
            ...node,
            masteryLevel: newMastery,
            diagnosticResults: {
              ...node.diagnosticResults,
              lastAssessment: new Date(),
              accuracy: performance
            }
          };

          set({
            skillNodes: {
              ...nodes,
              [nodeId]: updatedNode
            }
          });

          // Actualizar en backend
          await supabase
            .from('user_node_progress')
            .upsert({
              user_id: get().studentProfile?.id,
              node_id: nodeId,
              mastery_level: newMastery / 100,
              success_rate: performance / 100,
              last_activity_at: new Date().toISOString()
            });

          // Regenerar recomendaciones
          await get().generateIntelligentRecommendations();
        },

        // Generar recomendaciones inteligentes
        generateIntelligentRecommendations: async () => {
          const { studentProfile, skillNodes } = get();
          if (!studentProfile) return [];

          console.log('🤖 Generando recomendaciones inteligentes...');

          const recommendations: IntelligentRecommendation[] = [];
          
          // Algoritmo de recomendación basado en IA
          Object.values(skillNodes).forEach(node => {
            if (node.masteryLevel < 70) {
              const priority = node.masteryLevel < 40 ? 'alta' : node.masteryLevel < 60 ? 'media' : 'baja';
              
              recommendations.push({
                id: `rec_${node.id}_${Date.now()}`,
                type: node.masteryLevel < 30 ? 'diagnostico' : 'refuerzo',
                priority,
                subject: node.subject,
                skillNodes: [node.id],
                description: `Fortalecer ${node.name} - Dominio actual: ${Math.round(node.masteryLevel)}%`,
                estimatedTime: node.aiRecommendations.studyTime,
                confidence: 0.85,
                reasoning: [
                  `Dominio actual: ${Math.round(node.masteryLevel)}%`,
                  `Prerequisito para ${node.prerequisites.length} habilidades`,
                  'Impacto alto en puntaje PAES'
                ],
                adaptiveContent: {
                  exercises: [],
                  explanations: [`Concepto clave: ${node.name}`],
                  visualizations: []
                }
              });
            }
          });

          // Ordenar por prioridad e impacto
          recommendations.sort((a, b) => {
            const priorityOrder = { alta: 3, media: 2, baja: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          });

          set({ currentRecommendations: recommendations.slice(0, 10) });
          return recommendations;
        },

        // Iniciar sesión de aprendizaje
        startLearningSession: (type: string) => {
          const sessionId = `session_${Date.now()}`;
          const newSession: LearningSession = {
            id: sessionId,
            userId: get().studentProfile?.id || '',
            startTime: new Date(),
            activities: [],
            overallPerformance: 0,
            insights: [],
            nextRecommendations: []
          };

          set({
            activeSessions: [...get().activeSessions, newSession]
          });

          return sessionId;
        },

        // Finalizar sesión de aprendizaje
        endLearningSession: async (sessionId: string, performance: number) => {
          const sessions = get().activeSessions;
          const sessionIndex = sessions.findIndex(s => s.id === sessionId);
          
          if (sessionIndex === -1) return;

          const session = sessions[sessionIndex];
          session.endTime = new Date();
          session.overallPerformance = performance;
          
          // Generar insights con IA
          session.insights = get().generateSessionInsights(session);
          
          // Actualizar métricas del sistema
          const metrics = get().systemMetrics;
          set({
            systemMetrics: {
              ...metrics,
              totalStudyTime: metrics.totalStudyTime + 
                ((session.endTime.getTime() - session.startTime.getTime()) / 60000),
              averagePerformance: (metrics.averagePerformance + performance) / 2
            },
            activeSessions: sessions.filter(s => s.id !== sessionId)
          });
        },

        // Generar insights de sesión
        generateSessionInsights: (session: LearningSession) => {
          const insights: string[] = [];
          const duration = session.endTime ? 
            (session.endTime.getTime() - session.startTime.getTime()) / 60000 : 0;

          if (session.overallPerformance > 80) {
            insights.push('¡Excelente desempeño! Estás dominando estos conceptos.');
          } else if (session.overallPerformance > 60) {
            insights.push('Buen progreso. Con un poco más de práctica dominarás completamente estos temas.');
          } else {
            insights.push('Sigue practicando. Cada intento te acerca más al dominio completo.');
          }

          if (duration < 15) {
            insights.push('Sesión corta pero efectiva. Considera extender el tiempo para mayor retención.');
          } else if (duration > 60) {
            insights.push('Sesión extensa. Recuerda tomar descansos para mantener la concentración.');
          }

          return insights;
        },

        // Análisis de patrones de rendimiento
        analyzePerformancePatterns: () => {
          const { skillNodes, systemMetrics } = get();
          
          const patterns = {
            strongSubjects: [],
            weakSubjects: [],
            learningTrends: 'improving',
            recommendedFocus: [],
            timeOptimization: []
          };

          // Analizar materias fuertes y débiles
          const subjectPerformance: Record<string, number[]> = {};
          
          Object.values(skillNodes).forEach(node => {
            if (!subjectPerformance[node.subject]) {
              subjectPerformance[node.subject] = [];
            }
            subjectPerformance[node.subject].push(node.masteryLevel);
          });

          Object.entries(subjectPerformance).forEach(([subject, scores]) => {
            const average = scores.reduce((a, b) => a + b, 0) / scores.length;
            if (average > 75) {
              patterns.strongSubjects.push(subject);
            } else if (average < 50) {
              patterns.weakSubjects.push(subject);
            }
          });

          return patterns;
        },

        // Generar contenido adaptativo
        generateAdaptiveContent: async (nodeId: string, difficulty: string) => {
          set({ isGeneratingContent: true });
          
          try {
            // Aquí se integraría con el sistema de IA para generar contenido
            // Por ahora, simulamos la generación
            const content = {
              exercises: [
                {
                  id: `ex_${nodeId}_${Date.now()}`,
                  question: `Ejercicio adaptativo para ${nodeId}`,
                  options: ['A', 'B', 'C', 'D'],
                  explanation: 'Explicación generada por IA',
                  difficulty: difficulty
                }
              ],
              explanations: [`Explicación detallada del concepto ${nodeId}`],
              visualizations: [{
                type: '3D',
                data: { nodeId, difficulty }
              }]
            };

            set({ isGeneratingContent: false });
            return content;

          } catch (error) {
            set({ isGeneratingContent: false, error: 'Error generando contenido' });
            return null;
          }
        },

        // Predecir ruta de aprendizaje
        predictLearningPath: async (targetScore: number) => {
          const { skillNodes } = get();
          
          // Algoritmo de predicción de ruta óptima
          const path: string[] = [];
          const nodesByPriority = Object.values(skillNodes)
            .filter(node => node.masteryLevel < 80)
            .sort((a, b) => {
              // Priorizar por impacto en puntaje objetivo
              const impactA = (80 - a.masteryLevel) * a.prerequisites.length;
              const impactB = (80 - b.masteryLevel) * b.prerequisites.length;
              return impactB - impactA;
            });

          nodesByPriority.forEach(node => {
            if (path.length < 20) { // Límite de ruta
              path.push(node.id);
            }
          });

          return path;
        },

        // Obtener insights personalizados
        getPersonalizedInsights: () => {
          const { studentProfile, skillNodes, systemMetrics } = get();
          if (!studentProfile) return [];

          const insights: string[] = [];
          
          const completionRate = systemMetrics.nodesCompleted / Object.keys(skillNodes).length;
          if (completionRate > 0.8) {
            insights.push('¡Estás muy cerca de completar tu preparación PAES!');
          } else if (completionRate > 0.5) {
            insights.push('Has completado más de la mitad de tu ruta de aprendizaje. ¡Sigue así!');
          }

          if (systemMetrics.averagePerformance > 80) {
            insights.push('Tu rendimiento promedio es excelente. Estás listo para desafíos más complejos.');
          }

          return insights;
        }
      }),
      {
        name: 'education-system-store',
        partialize: (state) => ({
          studentProfile: state.studentProfile,
          skillNodes: state.skillNodes,
          systemMetrics: state.systemMetrics
        })
      }
    ),
    { name: 'EducationSystem' }
  )
);
