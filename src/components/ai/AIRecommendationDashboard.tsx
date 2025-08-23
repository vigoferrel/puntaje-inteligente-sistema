import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIRecommendations, AIRecommendation } from '../../hooks/use-ai-recommendations';
import { Brain, Target, Zap, Clock, Star, TrendingUp, BookOpen, Award, Lightbulb } from 'lucide-react';

const AIRecommendationDashboard = () => {
  const { recommendations, isLoading, error, refreshRecommendations, generateAIActivity } = useAIRecommendations();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'activities' | 'bloom' | 'plan'>('overview');
  const [generatingActivity, setGeneratingActivity] = useState(false);

  const priorityColors = {
    high: 'from-red-500 to-orange-500',
    medium: 'from-yellow-500 to-amber-500',
    low: 'from-green-500 to-emerald-500'
  };

  const difficultyIcons = {
    basic: '⭐',
    intermediate: '⭐⭐',
    advanced: '⭐⭐⭐'
  };

  const handleGenerateActivity = async (bloomLevel: string, subject: string, topic: string) => {
    setGeneratingActivity(true);
    try {
      await generateAIActivity(bloomLevel, subject, topic);
      refreshRecommendations();
    } catch (err) {
      console.error('Error generating activity:', err);
    } finally {
      setGeneratingActivity(false);
    }
  };

  const RecommendationCard = ({ recommendation }: { recommendation: AIRecommendation }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${priorityColors[recommendation.priority]}`}>
            {recommendation.type === 'activity' && <Brain className="h-5 w-5 text-white" />}
            {recommendation.type === 'exercise' && <BookOpen className="h-5 w-5 text-white" />}
            {recommendation.type === 'study_plan' && <Target className="h-5 w-5 text-white" />}
            {recommendation.type === 'topic' && <Lightbulb className="h-5 w-5 text-white" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {recommendation.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {recommendation.subject} • {difficultyIcons[recommendation.difficulty]} {recommendation.difficulty}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
            <Clock className="h-4 w-4" />
            <span>{recommendation.estimatedTime} min</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-green-600">
            <Zap className="h-3 w-3" />
            <span>{Math.round(recommendation.aiConfidence * 100)}% confianza</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {recommendation.description}
      </p>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>¿Por qué es recomendado?</strong> {recommendation.reasoning}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
            {recommendation.bloomLevel}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            recommendation.priority === 'high' 
              ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
              : recommendation.priority === 'medium'
              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
              : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
          }`}>
            {recommendation.priority}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
        >
          Comenzar
        </motion.button>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        >
          <Brain className="h-8 w-8 text-white" />
        </motion.div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Generando recomendaciones con IA...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Analizando tu progreso y preferencias de aprendizaje
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
          Error al cargar recomendaciones
        </h3>
        <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
        <button
          onClick={refreshRecommendations}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Star },
    { id: 'activities', label: 'Actividades', icon: BookOpen },
    { id: 'bloom', label: 'Progresión Bloom', icon: TrendingUp },
    { id: 'plan', label: 'Plan de Estudios', icon: Target }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Recomendaciones Inteligentes</h1>
            <p className="text-blue-100">
              Personalizado con IA avanzada basado en tu progreso y estilo de aprendizaje
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{recommendations.personalizedActivities.length}</div>
            <div className="text-sm text-blue-200">Actividades recomendadas</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Áreas de Mejora */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Áreas de Mejora Identificadas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.improvementAreas.map((area, index) => (
                    <motion.div
                      key={area}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-orange-600" />
                        <h3 className="font-medium text-orange-800 dark:text-orange-300">{area}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Plan de Estudios Rápido */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Plan de Estudios
                </h2>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-300">
                      {recommendations.studyPlan.estimatedCompletionDays} días estimados
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                    Plan personalizado con {recommendations.studyPlan.shortTerm.length} actividades a corto plazo
                  </p>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Ver Plan Completo
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'activities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Actividades Personalizadas
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGenerateActivity('L3', 'matematica', 'álgebra')}
                  disabled={generatingActivity}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {generatingActivity ? 'Generando...' : 'Generar Nueva Actividad IA'}
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.personalizedActivities.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RecommendationCard recommendation={recommendation} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'bloom' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Progresión en Taxonomía de Bloom
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.bloomProgression.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RecommendationCard recommendation={recommendation} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'plan' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Plan de Estudios Detallado
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Corto Plazo */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                    Actividades a Corto Plazo
                  </h3>
                  <div className="space-y-4">
                    {recommendations.studyPlan.shortTerm.map((recommendation, index) => (
                      <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                    ))}
                  </div>
                </div>

                {/* Largo Plazo */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                    Objetivos a Largo Plazo
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                    <p className="text-blue-700 dark:text-blue-300 mb-4">
                      Tu plan de estudios está diseñado para completarse en aproximadamente{' '}
                      <strong>{recommendations.studyPlan.estimatedCompletionDays} días</strong>.
                    </p>
                    <div className="space-y-2">
                      {recommendations.studyPlan.longTerm.slice(0, 5).map((activity: any, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                          <Award className="h-4 w-4" />
                          <span>{activity.title || `Actividad ${index + 1}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AIRecommendationDashboard;
