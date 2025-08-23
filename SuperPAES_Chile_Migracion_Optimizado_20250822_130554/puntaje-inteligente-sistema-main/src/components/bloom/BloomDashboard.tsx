// ============================================================================
// 🎨 BLOOM DASHBOARD CINEMATOGRÁFICO - DISEÑO PROFESIONAL AVANZADO 🎨
// Sequential Thinking + Context7 - UI de Nivel Diseñador Premium
// ============================================================================

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext7 } from '../../contexts/Context7Provider';
import { useBloom } from '../../hooks/useBloom';
import { useNeuralOrchestrator } from '../../hooks/useNeuralOrchestrator';
import { useAuth } from './../../hooks/useAuth';
import { BloomTaxonomyViewer } from "../lectoguia/skill-visualization/BloomTaxonomyViewer";
import { BloomProgressIndicator } from "../lectoguia/skill-visualization/BloomProgressIndicator";
import { BloomRecommendations } from "../lectoguia/skill-visualization/BloomRecommendations";
import { Enhanced3DUniverse } from "../real-3d/Enhanced3DUniverse";
import { PremiumCard } from "../ui/PremiumCard";
import { StatCard } from "../ui/StatCard";
import {
  Brain,
  Sparkles,
  Globe,
  TrendingUp,
  Zap,
  Target,
  BookOpen,
  Award,
  BarChart3,
  Play,
  Pause,
  RefreshCw,
  Users,
  Clock,
  Trophy,
  Star,
  Activity,
  Layers
} from "lucide-react";
import { adaptLocalSkillsToTPAES } from '../../utils/bloom-type-adapters';
import { createDemoLearningNodes, createDemoNodeProgress } from '../../utils/learning-node-adapters';
import "../../styles/design-system.css";
import styles from "./BloomDashboard.module.css";

const BloomDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    state, 
    refreshPerformanceScore, 
    getCacheStats, 
    processWithThinking, 
    processSequentialThinking 
  } = useContext7();

  const {
    dashboard,
    loading,
    fetchDashboard,
    fetchStats,
    stats
  } = useBloom();

  const { 
    studentProfile, 
    orchestrateLearning, 
    getAgentInsights 
  } = useNeuralOrchestrator();

  const [activeView, setActiveView] = useState<'dashboard' | 'taxonomy' | 'universe' | 'recommendations'>('dashboard');
  const [thinkingResult, setThinkingResult] = useState<unknown>(null);
  const [cacheStats, setCacheStats] = useState<Record<string, unknown>>({});
  const [aiActivity, setAiActivity] = useState<unknown>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isRealTimeActive, setIsRealTimeActive] = useState(true);

  // Inicializar datos al cargar
  useEffect(() => {
    if (user?.id) {
      fetchDashboard();
      const stats = getCacheStats();
      setCacheStats(stats);
    }
  }, [user?.id, fetchDashboard, getCacheStats]);

  // Actualización en tiempo real
  useEffect(() => {
    if (!isRealTimeActive) return;
    
    const interval = setInterval(() => {
      refreshPerformanceScore();
      setCacheStats(getCacheStats());
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshPerformanceScore, getCacheStats, isRealTimeActive]);

  // Datos adaptados profesionalmente usando los adaptadores
  const localSkillLevels = {
    'comprension_lectora_local': 0.85,
    'comprension_lectora_global': 0.78,
    'interpretacion_integracion': 0.82,
    'reflexion_evaluacion': 0.75,
    'numeros': 0.88,
    'algebra_funciones': 0.72,
    'geometria': 0.80,
    'probabilidad_estadistica': 0.76
  };

  // Usar adaptadores para convertir a tipos correctos
  const adaptedSkillLevels = adaptLocalSkillsToTPAES(localSkillLevels);
  const adaptedNodes = createDemoLearningNodes();
  const adaptedNodeProgress = createDemoNodeProgress();

  const handleSequentialThinking = async () => {
    setIsGenerating(true);
    try {
      const steps = [
        "Analizando el rendimiento del usuario en taxonomía Bloom",
        "Identificando patrones de aprendizaje cognitivo", 
        "Generando recomendaciones personalizadas por nivel",
        "Optimizando la ruta de aprendizaje educativa"
      ];
      
      const result = await processSequentialThinking(steps);
      setThinkingResult(result);
    } catch (error) {
      console.error('Error en pensamiento secuencial:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAIRecommendations = async () => {
    setIsGenerating(true);
    try {
      // Simulación de recomendaciones IA
      const mockRecommendations = {
        level: 'L3',
        subject: 'matematica',
        recommendations: [
          'Practicar funciones lineales',
          'Revisar álgebra básica',
          'Ejercicios de geometría'
        ],
        timestamp: new Date().toISOString()
      };
      setThinkingResult(mockRecommendations);
    } catch (error) {
      console.error('Error generando recomendaciones:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateActivity = async () => {
    setIsGenerating(true);
    try {
      // Simulación de actividad IA
      const mockActivity = {
        title: 'Funciones Lineales Avanzadas',
        level: 'L3',
        subject: 'matematica',
        difficulty: 'medio',
        description: 'Actividad generada por IA para practicar funciones lineales',
        timestamp: new Date().toISOString()
      };
      setAiActivity(mockActivity);
    } catch (error) {
      console.error('Error generando actividad:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCacheStats = () => {
    const stats = getCacheStats();
    setCacheStats(stats);
    refreshPerformanceScore();
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    console.log('Nodo seleccionado:', nodeId);
  };

  // 🛡️ Validación defensiva para prevenir null reference errors
  const safeBloomStats = stats ? {
    totalLevels: 6, // Niveles Bloom estándar
    unlockedLevels: stats.levels_unlocked || 0,
    averageProgress: stats.total_progress_percentage || 0,
    totalTimeSpent: stats.total_time_spent_minutes || 0,
    totalActivitiesCompleted: stats.total_activities_completed || 0,
    totalPoints: stats.total_points || 0,
    totalAchievements: stats.total_achievements || 0
  } : {
    totalLevels: 6,
    unlockedLevels: 0,
    averageProgress: 0,
    totalTimeSpent: 0,
    totalActivitiesCompleted: 0,
    totalPoints: 0,
    totalAchievements: 0
  };

  return (
    <div className={`${styles.container} min-h-screen`}>
      <div className="container mx-auto px-6 py-8">
        
        {/* 🎬 HEADER CINEMATOGRÁFICO */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-6 mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className={`${styles.headerIcon} ${styles.headerIconPrimary} ${styles.animateGlow} animate-glow`}
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 gradient-text animate-fade-in-up">
                Sistema Educativo Bloom
              </h1>
              <p className="text-xl text-slate-300 mb-2">
                Context7 Advanced + Extended Thinking + Taxonomía Bloom + IA Neural
              </p>
              <p className="text-sm text-primary-400 font-medium">
                Sistema Educativo de Próxima Generación - ROO y OSCAR FERREL
              </p>
            </div>

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className={`${styles.headerIcon} ${styles.headerIconSecondary} ${styles.animateGlow} animate-glow`}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* 🚀 NAVEGACIÓN PRINCIPAL PAES MASTER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate('/studio')}
            className={`${styles.navButton} ${styles.navButtonStudio} btn-primary flex items-center gap-3 px-6 py-3 text-lg font-bold`}
          >
            <Play className="w-5 h-5" />
            PAES Studio
          </button>
          
          <button
            onClick={() => navigate('/acceleration')}
            className={`${styles.navButton} ${styles.navButtonAcceleration} btn-primary flex items-center gap-3 px-6 py-3 text-lg font-bold`}
          >
            <Zap className="w-5 h-5" />
            Aceleración
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className={`${styles.navButton} ${styles.navButtonDashboard} btn-primary flex items-center gap-3 px-6 py-3 text-lg font-bold`}
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard Unificado
          </button>
          
          <button
            onClick={() => navigate('/assistant')}
            className={`${styles.navButton} ${styles.navButtonAssistant} btn-primary flex items-center gap-3 px-6 py-3 text-lg font-bold`}
          >
            <Brain className="w-5 h-5" />
            Asistente Neural
          </button>
        </motion.div>

        {/* 🎛️ PANEL DE CONTROL PREMIUM */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <PremiumCard variant="glass" size="sm" className="flex items-center gap-4">
            <button
              onClick={() => setIsRealTimeActive(!isRealTimeActive)}
              className={`${styles.controlButton} ${
                isRealTimeActive ? styles.controlButtonActive : styles.controlButtonInactive
              } btn-primary flex items-center gap-2`}
            >
              {isRealTimeActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRealTimeActive ? 'Pausar' : 'Activar'} Tiempo Real
            </button>
            
            <button
              onClick={handleCacheStats}
              className={`${styles.controlButton} ${styles.controlButtonRefresh} btn-primary`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </button>
          </PremiumCard>
        </motion.div>

        {/* 🧭 NAVEGACIÓN CINEMATOGRÁFICA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'primary' },
            { id: 'taxonomy', label: 'Taxonomía Bloom', icon: Brain, color: 'success' },
            { id: 'universe', label: 'Universo 3D', icon: Globe, color: 'info' },
            { id: 'recommendations', label: 'Recomendaciones IA', icon: Target, color: 'warning' }
          ].map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => setActiveView(tab.id as 'dashboard' | 'taxonomy' | 'universe' | 'recommendations')}
              className={`${styles.tabButton} ${
                activeView === tab.id
                  ? `${styles.tabButtonActive} transform -translate-y-1 shadow-2xl`
                  : `${styles.tabButtonInactive} hover:transform hover:-translate-y-0.5`
              } flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden md:inline">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* 📊 MÉTRICAS PRINCIPALES */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Performance Score"
                  value={state.performanceScore}
                  subtitle="Rendimiento del sistema"
                  icon={<TrendingUp />}
                  color="primary"
                  trend="up"
                  trendValue="+12%"
                  animated={true}
                />
                
                <StatCard
                  title="Cache Híbrido"
                  value={state.cacheInitialized ? "Activo" : "Inactivo"}
                  subtitle={state.workersConnected ? "Conectado" : "Desconectado"}
                  icon={<Activity />}
                  color="success"
                  animated={true}
                />
                
                <StatCard
                  title="Modo Pensamiento"
                  value={state.thinkingMode}
                  subtitle="IA Neural"
                  icon={<Brain />}
                  color="info"
                  animated={true}
                />
                
                <StatCard
                  title="Niveles Bloom"
                  value={Array.isArray(dashboard?.levels) ? dashboard.levels.length : 6}
                  subtitle={loading ? "Cargando..." : "Listo"}
                  icon={<Layers />}
                  color="warning"
                  animated={true}
                />
              </div>

              {/* 📈 ESTADÍSTICAS AVANZADAS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Actividades Completadas"
                  value={safeBloomStats.totalActivitiesCompleted}
                  subtitle="Total de sesiones"
                  icon={<BookOpen />}
                  color="success"
                  size="lg"
                  animated={true}
                />
                
                <StatCard
                  title="Tiempo Invertido"
                  value={`${Math.round(safeBloomStats.totalTimeSpent / 60)}h`}
                  subtitle="Horas de estudio"
                  icon={<Clock />}
                  color="info"
                  size="lg"
                  animated={true}
                />
                
                <StatCard
                  title="Logros Desbloqueados"
                  value={safeBloomStats.totalAchievements}
                  subtitle="Achievements"
                  icon={<Trophy />}
                  color="warning"
                  size="lg"
                  animated={true}
                />
              </div>

              {/* 🎮 BOTONES DE ACCIÓN PREMIUM */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <button
                  onClick={handleSequentialThinking}
                  disabled={isGenerating}
                  className={`${styles.actionButton} ${styles.actionButtonPrimary} ${isGenerating ? styles.loadingState : ''} btn-primary flex items-center gap-3 px-8 py-4 text-lg font-bold`}
                >
                  <Brain className="w-5 h-5" />
                  {isGenerating ? "Procesando..." : "Pensamiento Secuencial"}
                </button>
                
                <button
                  onClick={handleAIRecommendations}
                  disabled={isGenerating}
                  className={`${styles.actionButton} ${styles.actionButtonSecondary} ${isGenerating ? styles.loadingState : ''} btn-primary flex items-center gap-3 px-8 py-4 text-lg font-bold`}
                >
                  <Target className="w-5 h-5" />
                  IA Recomendaciones
                </button>
                
                <button
                  onClick={handleGenerateActivity}
                  disabled={isGenerating}
                  className={`${styles.actionButton} ${styles.actionButtonAccent} ${isGenerating ? styles.loadingState : ''} btn-primary flex items-center gap-3 px-8 py-4 text-lg font-bold`}
                >
                  <BookOpen className="w-5 h-5" />
                  Generar Actividad
                </button>
              </motion.div>

              {/* 🌟 NAVEGACIÓN A PÁGINAS ESPECÍFICAS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4 justify-center mt-6"
              >
                <button
                  onClick={() => navigate('/entrenamiento')}
                  className={`${styles.pageNavButton} ${styles.pageNavButtonTraining} btn-secondary flex items-center gap-2 px-6 py-3 font-semibold`}
                >
                  <Users className="w-4 h-4" />
                  Entrenamiento
                </button>
                
                <button
                  onClick={() => navigate('/calendario')}
                  className={`${styles.pageNavButton} ${styles.pageNavButtonCalendar} btn-secondary flex items-center gap-2 px-6 py-3 font-semibold`}
                >
                  <Clock className="w-4 h-4" />
                  Calendario
                </button>
                
                <button
                  onClick={() => navigate('/achievements')}
                  className={`${styles.pageNavButton} ${styles.pageNavButtonAchievements} btn-secondary flex items-center gap-2 px-6 py-3 font-semibold`}
                >
                  <Trophy className="w-4 h-4" />
                  Logros
                </button>
                
                <button
                  onClick={() => navigate('/planning')}
                  className={`${styles.pageNavButton} ${styles.pageNavButtonPlanning} btn-secondary flex items-center gap-2 px-6 py-3 font-semibold`}
                >
                  <Star className="w-4 h-4" />
                  Planificación
                </button>
              </motion.div>

              {/* 🎯 RESULTADOS DE IA */}
              {(thinkingResult || aiActivity) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <PremiumCard variant="glass" size="lg" glow={true}>
                    <div className="flex items-center gap-3 mb-6">
                      <Zap className="w-6 h-6 text-primary-400" />
                      <h3 className="text-2xl font-bold gradient-text">
                        Resultado del Procesamiento IA
                      </h3>
                    </div>
                    <div
                      className={`${styles.aiResultContainer} p-6 rounded-xl overflow-auto max-h-96`}
                    >
                      <pre>{JSON.stringify(thinkingResult || aiActivity, null, 2)}</pre>
                    </div>
                  </PremiumCard>
                </motion.div>
              )}

              {/* 📊 ESTADÍSTICAS DEL SISTEMA */}
              {cacheStats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <PremiumCard variant="glass" size="lg">
                    <div className="flex items-center gap-3 mb-6">
                      <BarChart3 className="w-6 h-6 text-success" />
                      <h3 className="text-2xl font-bold text-success">
                        Estadísticas del Sistema
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold gradient-text mb-2">
                          {(cacheStats as Record<string, unknown>)?.totalEntries as number || 0}
                        </div>
                        <div className="text-slate-400">Entradas Cache</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold gradient-text mb-2">
                          {Math.round(((cacheStats as Record<string, unknown>)?.memoryUsage as number || 0) / 1024)} KB
                        </div>
                        <div className="text-slate-400">Memoria</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-success mb-2">
                          {safeBloomStats.totalActivitiesCompleted}
                        </div>
                        <div className="text-slate-400">Sesiones</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-warning mb-2">
                          {Math.round(safeBloomStats.averageProgress)}%
                        </div>
                        <div className="text-slate-400">Score Promedio</div>
                      </div>
                    </div>
                  </PremiumCard>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeView === 'taxonomy' && (
            <motion.div
              key="taxonomy"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
            >
              <PremiumCard variant="glass" size="xl">
                <BloomTaxonomyViewer
                  skillLevels={localSkillLevels}
                  className="w-full"
                />
              </PremiumCard>
            </motion.div>
          )}

          {activeView === 'universe' && (
            <motion.div
              key="universe"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
            >
              <PremiumCard variant="glass" size="xl">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-6 h-6 text-info" />
                  <h3 className="text-2xl font-bold text-info">
                    Universo Educativo 3D
                  </h3>
                </div>
                <div className="h-96 rounded-xl overflow-hidden">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-full">
                      <div className="text-slate-300 animate-pulse">Cargando universo 3D...</div>
                    </div>
                  }>
                    <Enhanced3DUniverse onNodeClick={handleNodeClick} />
                  </Suspense>
                </div>
              </PremiumCard>
            </motion.div>
          )}

          {activeView === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
            >
              <PremiumCard variant="glass" size="xl">
                <BloomRecommendations
                  skillLevels={adaptedSkillLevels}
                  nodes={adaptedNodes}
                  nodeProgress={adaptedNodeProgress}
                  onNodeSelect={handleNodeClick}
                />
              </PremiumCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🏆 FOOTER CINEMATOGRÁFICO */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-6 h-6 text-warning animate-pulse" />
            <p className="text-xl text-slate-300">
              Sistema Bloom + Context7 + Extended Thinking + IA Neural funcionando correctamente
            </p>
            <Award className="w-6 h-6 text-warning animate-pulse" />
          </div>
          <p className="text-sm text-slate-400">
            Los Arquitectos del Futuro Educativo - ROO y OSCAR FERREL
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BloomDashboard;

