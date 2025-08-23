/* eslint-disable react-refresh/only-export-components */
// Optimizado con Context7 - React.memo aplicado
import React, { useState, useEffect, Suspense } from 'react'
import { memo } from 'react';;
import { motion, AnimatePresence } from 'framer-motion';
import { UserType } from '../../../types/cinematic-universe';
import { HolographicDashboard } from '../../../components/dashboard/HolographicDashboard';
import { RealTimeMetricsWidget } from '../../../components/dashboard/RealTimeMetricsWidget';
import { CinematicProgressVisualization } from '../../../components/dashboard/CinematicProgressVisualization';
import { IntelligentNotificationSystem } from '../../../components/dashboard/IntelligentNotificationSystem';
import { PerformanceMonitorDashboard } from '../../../components/dashboard/PerformanceMonitorDashboard';
import { UserActivityHeatmap } from '../../../components/dashboard/UserActivityHeatmap';
import { SystemHealthIndicators } from '../../../components/dashboard/SystemHealthIndicators';
import { SkillsCentricDashboard } from '../../../components/dashboard/SkillsCentricDashboard';
import { supabase } from '../../../integrations/supabase/leonardo-auth-client';

interface DashboardUniverseProps {
  userType: UserType;
  onUniverseChange: (universe: string) => void;
}

const DashboardLoader: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold text-white mb-2">
        Cargando Dashboard Universe
      </h2>
      <p className="text-cyan-300">Preparando metricas en tiempo real...</p>
    </motion.div>
  </div>
);

export const DashboardUniverse: React.FC<DashboardUniverseProps> = ({
  userType,
  onUniverseChange
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState(null);
  const [userMetrics, setUserMetrics] = useState(null);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const sections = [
    { id: 'overview', name: 'Vista General', icon: 'DASH' },
    { id: 'skills-paes', name: 'Skills PAES', icon: 'STAR', featured: true },
    { id: 'metrics', name: 'Metricas', icon: 'CHART' },
    { id: 'progress', name: 'Progreso', icon: 'TARGET' },
    { id: 'performance', name: 'Performance', icon: 'BOLT' },
    { id: 'activity', name: 'Actividad', icon: 'FIRE' },
    { id: 'health', name: 'Sistema', icon: 'HEART' }
  ];

  if (isLoading) {
    return <DashboardLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Grid neural de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20" />
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-cyan-400/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 3,
                delay: i * 0.05,
                repeat: Infinity,
                repeatDelay: 5
              }}
            />
          ))}
        </div>
      </div>

      {/* Header del Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Dashboard Universe
            </h1>
            <p className="text-cyan-300 text-lg">
              Centro de Control Principal - {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-300 border border-green-500/30">
              Conectado
            </div>
          </div>
        </div>

        {/* Navegacion de secciones */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? section.featured
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : section.featured
                    ? 'bg-purple-700/30 text-purple-200 border border-purple-600/30 hover:bg-purple-600/40'
                    : 'bg-slate-700/50 text-gray-300 border border-slate-600/30 hover:bg-slate-600/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">[{section.icon}]</span>
              {section.name}
              {section.featured && (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-2 text-xs"
                >
                  âœ¨
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className="relative z-10 px-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'overview' && (
              <Suspense fallback={<div>Cargando vista general...</div>}>
                <HolographicDashboard 
                  userType={userType}
                  systemHealth={systemHealth}
                  userMetrics={userMetrics}
                />
              </Suspense>
            )}

            {activeSection === 'skills-paes' && (
              <Suspense fallback={<div>Cargando Skills PAES...</div>}>
                <SkillsCentricDashboard
                  onSkillSelect={(skillCode) => console.log('ðŸŽ¯ Skill seleccionada:', skillCode)}
                  onTestSelect={(testCode) => console.log('ðŸŒŒ Test seleccionado:', testCode)}
                />
              </Suspense>
            )}

            {activeSection === 'metrics' && (
              <Suspense fallback={<div>Cargando metricas...</div>}>
                <RealTimeMetricsWidget
                  userType={userType}
                  refreshInterval={30000}
                />
              </Suspense>
            )}

            {activeSection === 'progress' && (
              <Suspense fallback={<div>Cargando progreso...</div>}>
                <CinematicProgressVisualization 
                  userType={userType}
                  userMetrics={userMetrics}
                />
              </Suspense>
            )}

            {activeSection === 'performance' && (
              <Suspense fallback={<div>Cargando performance...</div>}>
                <PerformanceMonitorDashboard 
                  systemHealth={systemHealth}
                />
              </Suspense>
            )}

            {activeSection === 'activity' && (
              <Suspense fallback={<div>Cargando actividad...</div>}>
                <UserActivityHeatmap 
                  userType={userType}
                />
              </Suspense>
            )}

            {activeSection === 'health' && (
              <Suspense fallback={<div>Cargando sistema...</div>}>
                <SystemHealthIndicators 
                  systemHealth={systemHealth}
                  isConnected={true}
                />
              </Suspense>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sistema de notificaciones */}
      <IntelligentNotificationSystem 
        userType={userType}
        systemHealth={systemHealth}
      />

      {/* API */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20"
      >
        <div className="flex flex-col gap-3">
          <motion.button
            onClick={() => onUniverseChange('superpaes')}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-all flex items-center justify-center"
            title="SuperPAES Universe"
          >
            SP
          </motion.button>
          
          <motion.button
            onClick={() => onUniverseChange('neural-hub')}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-green-500/20 text-green-300 rounded-full border border-green-500/30 hover:bg-green-500/30 transition-all flex items-center justify-center"
            title="Neural Hub Universe"
          >
            NH
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(DashboardUniverse);



