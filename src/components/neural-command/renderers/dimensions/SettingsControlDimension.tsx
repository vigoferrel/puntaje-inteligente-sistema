
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const SettingsControlDimension: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gradient-to-br from-gray-800 via-slate-900 to-gray-900"
    >
      <div className="text-center space-y-6">
        <motion.div
          animate={{ 
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mx-auto w-32 h-32 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center text-4xl"
        >
          ⚙️
        </motion.div>
        
        <h2 className="text-4xl font-bold text-white">Centro de Configuración Neural</h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Panel de control avanzado y personalización del ecosistema. 
          Configura tu experiencia de aprendizaje según tus preferencias.
        </p>
        
        <div className="bg-gradient-to-r from-gray-800/60 to-slate-900/60 rounded-lg p-8 backdrop-blur-xl mt-8">
          <p className="text-white/80 mb-6 text-lg">
            Próximamente: Configuración avanzada, personalización de IA, gestión de datos
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <span className="px-4 py-2 bg-white/20 rounded-lg text-white">Configuración IA</span>
            <span className="px-4 py-2 bg-white/20 rounded-lg text-white">Personalización</span>
            <span className="px-4 py-2 bg-white/20 rounded-lg text-white">Gestión de Datos</span>
          </div>
          
          <Button className="bg-gray-600 hover:bg-gray-500 text-white px-8 py-3 text-lg">
            Acceder a Configuración
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
