/* eslint-disable react-refresh/only-export-components */
// Optimizado con Context7 - React.memo aplicado
import React, { useState, useEffect } from 'react'
import { memo } from 'react';;
import '@/styles/CinematicAnimations.css';
import { motion } from 'framer-motion';
import { UserType } from '@/types/cinematic-universe';

interface HolographicDashboardProps {
  userType: UserType;
  systemHealth: Record<string, unknown>;
  userMetrics: Record<string, unknown>;
}

export const HolographicDashboard: React.FC<HolographicDashboardProps> = ({
  userType,
  systemHealth,
  userMetrics
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: 'Sesiones Activas',
      value: '1,247',
      change: '+12%',
      icon: 'USERS',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      title: 'Progreso Global',
      value: '78%',
      change: '+5%',
      icon: 'CHART',
      color: 'from-green-400 to-emerald-500'
    },
    {
      title: 'Tiempo Estudio',
      value: '4.2h',
      change: '+15min',
      icon: 'CLOCK',
      color: 'from-purple-400 to-pink-500'
    },
    {
      title: 'Logros Desbloqueados',
      value: '23',
      change: '+3',
      icon: 'TROPHY',
      color: 'from-yellow-400 to-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Panel principal */}
      <div className="lg:col-span-2 space-y-6">
        {/* Bienvenida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Bienvenido de vuelta!
          </h2>
          <p className="text-cyan-300 mb-4">
            {currentTime.toLocaleString('es-CL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-300">
              Tipo de usuario: <span className="text-cyan-300 font-semibold">{userType}</span>
            </div>
            <div className="text-sm text-gray-300">
              Estado: <span className="text-green-300 font-semibold">Activo</span>
            </div>
          </div>
        </motion.div>

        {/* Estadisticas principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono">[{stat.icon}]</span>
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 mb-1">
                {stat.title}
              </div>
              <div className="text-xs text-green-400">
                {stat.change}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Grafico holografico */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            Actividad en Tiempo Real
          </h3>
          
          <div className="relative h-64 bg-gradient-to-t from-cyan-500/5 to-transparent rounded-lg overflow-hidden">
            {/* Simulacion de grafico holografico */}
            <div className="absolute inset-0 flex items-end justify-around p-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-gradient-to-t from-cyan-400 to-blue-500 rounded-t fixed-width-20"
                  initial={{ height: 0 }}
                  animate={{ 
                    height: `${Math.random() * 80 + 20}%`,
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                />
              ))}
            </div>
            
            {/* Efectos holograficos */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse" />
            <div className="absolute inset-0 border border-cyan-400/20 rounded-lg" />
          </div>
        </motion.div>
      </div>

      {/* Panel lateral */}
      <div className="space-y-6">
        {/* Estado del sistema */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold text-white mb-4">
            Estado del Sistema
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">CPU</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="text-sm text-green-400">65%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Memoria</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: '82%' }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <span className="text-sm text-yellow-400">82%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Red</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
                <span className="text-sm text-cyan-400">45%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actividad reciente */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold text-white mb-4">
            Actividad Reciente
          </h3>
          
          <div className="space-y-3">
            {[
              { action: 'Ejercicio completado', time: '2 min', icon: 'CHECK' },
              { action: 'Nuevo logro desbloqueado', time: '5 min', icon: 'TROPHY' },
              { action: 'Sesion de estudio iniciada', time: '15 min', icon: 'BOOK' },
              { action: 'Progreso actualizado', time: '30 min', icon: 'CHART' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all"
              >
                <span className="text-sm font-mono">[{activity.icon}]</span>
                <div className="flex-1">
                  <div className="text-sm text-white">{activity.action}</div>
                  <div className="text-xs text-gray-400">hace {activity.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(HolographicDashboard);



