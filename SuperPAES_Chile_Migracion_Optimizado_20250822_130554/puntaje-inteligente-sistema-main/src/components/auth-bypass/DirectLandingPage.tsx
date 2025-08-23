/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const DirectLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const universes = [
    {
      id: 'dashboard',
      name: 'Dashboard Universe',
      description: 'Centro de control principal con mÃ©tricas en tiempo real',
      color: 'from-cyan-500 to-blue-600',
      icon: 'DASH'
    },
    {
      id: 'superpaes',
      name: 'SuperPAES Universe',
      description: 'Sistema educativo PAES completo con gamificaciÃ³n',
      color: 'from-purple-500 to-pink-600',
      icon: 'PAES'
    },
    {
      id: 'neural-hub',
      name: 'Neural Hub Universe',
      description: 'Centro de inteligencia artificial y analytics',
      color: 'from-green-500 to-emerald-600',
      icon: 'BRAIN'
    }
  ];

  const handleUniverseSelect = (universeId: string) => {
    console.log(`ðŸŽ¯ Navegando a universo: ${universeId}`);
    navigate(`/${universeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            ðŸŽ¬ Universo CinematogrÃ¡fico PAES
          </h1>
          <p className="text-xl text-cyan-300">
            âœ… Acceso directo sin autenticaciÃ³n - Modo Bypass Activado
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {universes.map((universe, index) => (
            <motion.div
              key={universe.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUniverseSelect(universe.id)}
              className="cursor-pointer"
            >
              <div className={`bg-gradient-to-br ${universe.color} p-1 rounded-2xl`}>
                <div className="bg-black/80 backdrop-blur-sm rounded-xl p-8 h-full">
                  <div className="text-center">
                    <div className="text-4xl font-mono mb-4 text-white">
                      [{universe.icon}]
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {universe.name}
                    </h3>
                    <p className="text-gray-300 mb-6">
                      {universe.description}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`px-6 py-3 bg-gradient-to-r ${universe.color} text-white font-bold rounded-lg`}
                    >
                      ðŸš€ Ingresar
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-green-400 text-sm">
            âœ… Sistema de bypass activado - Sin redirecciones de autenticaciÃ³n
          </p>
        </div>
      </div>
    </div>
  );
};
