
import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export const SimpleLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center space-y-6">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="mx-auto"
        >
          <Brain className="w-16 h-16 text-blue-400" />
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Cargando Sistema Neural</h2>
          <p className="text-white/70">Conectando con datos reales...</p>
        </div>
        
        <motion.div
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-2 bg-blue-400 rounded-full max-w-xs mx-auto"
        />
      </div>
    </div>
  );
};
