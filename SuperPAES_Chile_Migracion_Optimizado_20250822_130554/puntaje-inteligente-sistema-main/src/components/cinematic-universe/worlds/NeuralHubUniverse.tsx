/* eslint-disable react-refresh/only-export-components */
// Optimizado con Context7 - React.memo aplicado
import React, { useState, useEffect, Suspense } from 'react'
import { memo } from 'react';;
import { motion, AnimatePresence } from 'framer-motion';
import { UserType } from '../../../types/cinematic-universe';

interface NeuralHubUniverseProps {
  userType: UserType;
  onUniverseChange: (universe: string) => void;
}

const NeuralHubLoader: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold text-white mb-2">
        Cargando Neural Hub Universe
      </h2>
      <p className="text-green-300">Inicializando sistemas de inteligencia artificial...</p>
    </motion.div>
  </div>
);

export const NeuralHubUniverse: React.FC<NeuralHubUniverseProps> = ({
  userType,
  onUniverseChange
}) => {
  const [activeSection, setActiveSection] = useState('network');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const sections = [
    { id: 'network', name: 'Red Neural', icon: 'BRAIN' },
    { id: 'analytics', name: 'Analytics IA', icon: 'CHART' },
    { id: 'insights', name: 'Insights', icon: 'LIGHT' },
    { id: 'predictions', name: 'Predicciones', icon: 'CRYSTAL' }
  ];

  if (isLoading) {
    return <NeuralHubLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Neural Hub Universe
            </h1>
            <p className="text-green-300 text-lg">
              Centro de Inteligencia Artificial - {userType}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-300 border border-green-500/30">
              IA: Activa
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="px-4 py-2 rounded-lg text-sm whitespace-nowrap bg-white/10 text-white hover:bg-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">[{section.icon}]</span>
              {section.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="relative z-10 px-6 pb-6">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-green-500/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            Neural Hub - {activeSection}
          </h3>
          
          <div className="text-green-300">
            Sistema de IA avanzado para seccion: {activeSection}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20"
      >
        <div className="flex flex-col gap-3">
          <motion.button
            onClick={() => onUniverseChange('dashboard')}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30 hover:bg-cyan-500/30 transition-all flex items-center justify-center"
            title="Dashboard Universe"
          >
            DB
          </motion.button>
          
          <motion.button
            onClick={() => onUniverseChange('superpaes')}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-all flex items-center justify-center"
            title="SuperPAES Universe"
          >
            SP
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(NeuralHubUniverse);


